import { WidgetEVO, Coords, WidgetOptions, WidgetData } from "../widgets/core/WidgetEVO";
import { Connection } from '../../../env/Connection';
import { HotspotEditor, HotspotEditorEvents, HotspotData, HotspotsMap } from './editors/HotspotEditor';

import { CentralViewOptions, CreateWidgetEvent, WidgetsMap, BuilderEvents, MIN_WIDTH, MIN_HEIGHT, CentralView } from './CentralView';
import { WidgetObjectData, WidgetEditor, WidgetEditorEvents } from './editors/WidgetEditor';
import { WidgetClassDescriptor, widgetList } from '../widgets/widgetList';

import * as utils from '../../../utils/pvsiowebUtils';
import * as fsUtils from '../../../utils/fsUtils';

const toolbarHeight: number = 36; //px

const contentTemplate: string = `
<style>
.view-div {
    position: absolute;
    padding-left:0;
    margin-right:30px;
    overflow:hidden;
}
.builder-toolbar {
    position:absolute; 
    transform:scale(0.8);
    transform-origin:left;
}
.builder-toolbar .btn {
    height:2.5em;
}
.builder-coords {
    position:absolute;
    color:darkslategray; 
    top:0.6em;
    left:300px;
    font-size:small;
    white-space:nowrap;
}
.prototype-image-frame {
    position: absolute;
    cursor: crosshair;
}
.prototype-image-overlay {
    position: absolute;
    cursor: crosshair;
}
.prototype {
    transform-origin: top left;
}
</style>
<div class="row" style="height:36px;">
    <div class="builder-toolbar">
        <form class="load-picture-form">
            <div class="custom-file" style="position:absolute;">
                <input type="file" class="custom-file-input load-picture-btn" accept="image/*">
                <label class="custom-file-label btn-sm" style="width:14em;">Upload Picture</label>
            </div>
            <button class="btn btn-outline-danger btn-lg load-whiteboard-btn btn-sm" style="margin-left:15em; width:12em;">Remove Picture</button>
        </form>
    </div>
    <div class="builder-coords"></div>
</div>
<div class="prototype row">
    <div class="prototype-image view-div container-fluid"></div>
    <div class="prototype-image-frame view-div container-fluid"></div>
    <div class="prototype-image-overlay container-fluid"></div>
</div>`;

export type Picture = {
    fileName: string,
    fileExtension: string,
    fileContent: string
};
export interface PictureOptions {
    width?: number, 
    height?: number, 
    border?: string,
    $el?: JQuery<HTMLElement>
};
export interface PictureData extends Picture {
    "max-width": "auto" | string,
    "max-height": "auto" | string,
};
export type WidgetsData = WidgetData[]; 

export class BuilderView extends CentralView {
    
    /**
     * jQuery pointers to relevant elements of the view
     */
    protected $imageDiv: JQuery<HTMLElement>;
    protected $imageFrame: JQuery<HTMLElement>;
    protected $imageOverlay: JQuery<HTMLElement>;
    protected $coords: JQuery<HTMLElement>;
    protected $toolbar: JQuery<HTMLElement>;

    /**
     * Editor for creating hotspot areas over the picture of the prototype
     */
    protected hotspotEditor: HotspotEditor;

    /**
     * List of widgets created for the prototype opened in builder view
     */
    protected widgetsMap: WidgetsMap = {};

    /**
     * Clipboard, stored information for copy/paste operations in builder view
     */
    protected clipboard: WidgetEVO;

    /**
     * Builder view constructor
     * @param data 
     * @param connection 
     */
    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
    }

    /**
     * Returns the list of widgets created for the current prototype opened in builder view
     */
    getWidgets (): WidgetsMap {
        return this.widgetsMap;
    }

    /**
     * Returns the list of hotspot areas created for the current prototype opened in builder view
     * The list of hotspots is a super-set of the list of widgets (some hotspots may not have been instantiated yet)
     */
    getHotspots (): HotspotsMap {
        return this.hotspotEditor.getHotspots();
    }

    /**
     * Renders the view
     * The view includes three layers:
     * - a bottom layer (prototype-image) contains the prototype image
     * - a mid layer (prototype-image-frame) for rendering widgets -- this facilitates porting the set of widgets from one prototype to another when swapping the prototype image
     * - an upper layer (prototype-image-overlay) shows the hotspot areas. This layer becomes hidden in simulator view.  
     * @param opt 
     */
    render (): BuilderView {
        const content: string = Handlebars.compile(contentTemplate, { noEscape: true })({});
        super.render({ ...this.viewOptions, content });
        this.$imageDiv = this.$el.find(".prototype-image");
        this.$imageFrame = this.$el.find(".prototype-image-frame");
        this.$imageOverlay = this.$el.find(".prototype-image-overlay");
        this.$coords = this.$el.find(".builder-coords");
        this.$toolbar = this.$el.find(".builder-toolbar");
        this.createWhiteboard();
        this.createImageFrameLayer();
        this.resizeView();
        this.installHandlers();
        // create hotspot editor on top of the image
        this.createHotspotEditor();
        return this;
    }

        /**
     * Internal function, creates the hotspot editor
     */
    protected createHotspotEditor (): void {
        this.hotspotEditor = new HotspotEditor({
            el: this.$imageFrame.find("img")[0],
            overlay: this.$imageOverlay[0],
            builderCoords: this.$coords[0]
        });

        // install handlers for hotspot events
        this.hotspotEditor.on(HotspotEditorEvents.DidCreateHotspot, async (data: HotspotData) => {
            // automatically open widget editor
            const widget: WidgetEVO = await this.editWidget(data);
            if (!widget) {
                // the user has pressed 'Cancel', delete the hotspot
                this.hotspotEditor.deleteHotspot(data);
            }
        });
        this.hotspotEditor.on(HotspotEditorEvents.DidSelectHotspot, (data: HotspotData) => {
            this.trigger(BuilderEvents.DidSelectWidget, data);
        });
        this.hotspotEditor.on(HotspotEditorEvents.DidMoveHotspot, (data: HotspotData) => {
            this.widgetsMap[data.id]?.move(data.coords);
        });
        this.hotspotEditor.on(HotspotEditorEvents.DidResizeHotspot, (data: HotspotData) => {
            this.widgetsMap[data.id]?.resize(data.coords);
        });
        this.hotspotEditor.on(HotspotEditorEvents.WillEditHotspot, async (data: HotspotData) => {
            await this.editWidget(data);
        });
        this.hotspotEditor.on(HotspotEditorEvents.DidCopyHotspot, async (data: HotspotData) => {
            this.clipboard = this.widgetsMap[data.id];
        });
        this.hotspotEditor.on(HotspotEditorEvents.DidDeleteHotspot, async (data: HotspotData) => {
            this.deleteWidget(data);
            this.trigger(BuilderEvents.DidDeleteWidget, {
                ...data,
                widgets: this.getWidgets(),
                hotspots: this.getHotspots()
            });
        });
        this.hotspotEditor.on(HotspotEditorEvents.DidCutHotspot, async (data: HotspotData) => {
            this.clipboard = this.widgetsMap[data.id];
            if (this.clipboard) {
                this.clipboard.hide();
                delete this.widgetsMap[data.id];
                this.trigger(BuilderEvents.DidCutWidget, {
                    ...data,
                    widgets: this.getWidgets(),
                    hotspots: this.getHotspots()
                });
            }
        });
        this.hotspotEditor.on(HotspotEditorEvents.DidPasteHotspot, async (data: { origin: HotspotData, clone: HotspotData }) => {
            if (data) {
                const id: string = data.origin.id;
                const widget: WidgetEVO = this.widgetsMap[id] || this.clipboard;
                if (widget) {
                    const widgetData: WidgetObjectData = {
                        ...data.clone,
                        name: widget.getName(),
                        kind: widget.getKind(),
                        opt: widget.getOptions(),
                        cons: widget.getConstructorName()
                    };
                    this.createWidget(widgetData);
                }
            }
        });
    }

    /**
     * Selects (i.e., highlights) a widget
     * @param data 
     */
    selectWidget (data: { id: string }): void {
        this.hotspotEditor.selectHotspot(data);
    }

    /**
     * Deselects a widget
     * @param data 
     */
    deselectWidget (data: { id: string }): void {
        this.hotspotEditor.deselectHotspot(data);
    }

    /**
     * Hide coordinates
     */
    hideCoords (): void {
        this.$coords?.css("display", "none");
    }

    /**
     * Reveal coordinates
     */
    revealCoords (): void {
        this.$coords?.css("display", "block");
    }

    /**
     * Hide toolbar
     */
    hideToolbar (): void {
        this.$toolbar?.css("display", "none");
    }

    /**
     * Reveal toolbar
     */
    revealToolbar (): void {
        this.$toolbar?.css("display", "block");
    }

    /**
     * Hide hotspot areas
     */
    hideHotspots (): void {
        this.$imageOverlay?.css("display", "none");
        this.$imageFrame?.css("cursor", "default");
    }

    /**
     * Reveal hotspot areas
     */
    revealHotspots (): void {
        this.$imageOverlay?.css("display", "block");
        this.$imageFrame?.css("cursor", "crosshair");
    }

    /**
     * Switch to builder view
     */
    builderView (): void {
        this.revealHotspots();
        this.revealCoords();
        this.revealToolbar();
    }

    /**
     * Switch to simulator view
     */
    simulatorView (): void {
        this.hideHotspots();
        this.hideCoords();
        this.hideToolbar();
    }

    /**
     * Returns the picture name and content
     */
    getPicture (): Picture {
        const fileContent: string = <string> this.$imageFrame?.find("img").attr("src");
        const fname: string = <string> <string> this.$imageFrame?.attr("fname");
        return {
            fileContent,
            fileName: fsUtils.getFileName(fname),
            fileExtension: fsUtils.getFileExtension(fname)
        };
    }

    /**
     * Returns the picture size
     */
    getPictureSize (): { "max-width": string, "max-height": string } {
        return {
            "max-width": <string> this.$imageFrame?.find("img").css("max-width"),
            "max-height": <string> this.$imageFrame?.find("img").css("max-height")
        };
    }

    /**
     * Returns the picture data (name, content, and size)
     */
    getPictureData (): PictureData {
        const picture: Picture = this.getPicture();
        const size: { "max-width": string, "max-height": string } = this.getPictureSize();
        return {
            ...picture,
            ...size
        };
    }

    /**
     * Returns the widgets descriptors
     * TODO: harmonize WidgetData and WidgetObjectData
     */
    getWidgetsData (): WidgetsData {
        if (this.widgetsMap) {
            const keys: string[] = Object.keys(this.widgetsMap);
            const ans: WidgetData[] = [];
            for (let i = 0; i < keys.length; i++) {
                const desc: WidgetData = this.widgetsMap[keys[i]].toJSON();
                ans.push(desc);
            }
            return ans;
        }
        return [];
    }

    /**
     * Create a widget
     * @param widgetData 
     */
    createWidget (widgetData: WidgetObjectData): WidgetEVO {
        if (widgetData) {
            // console.log(widgetData);
            if (widgetData.cons && widgetData.kind) {
                const desc: WidgetClassDescriptor = widgetList[widgetData.kind].find((desc: WidgetClassDescriptor) => {
                    return desc.cons.name === widgetData.cons;
                });
                // console.log(desc);
                if (desc) {
                    if (this.widgetsMap[widgetData.id]) {
                        this.widgetsMap[widgetData.id].remove();
                    }
                    const options: WidgetOptions = { 
                        parent: this.$imageFrame,
                        type: widgetData.cons,
                        ...widgetData?.opt,
                        connection: this.connection
                    };
                    const widget: WidgetEVO = new desc.cons(widgetData.id, widgetData.coords, options);
                    widget.renderSample();
                    // console.log(widget);
                    this.widgetsMap[widgetData.id] = widget;
                    const evt: CreateWidgetEvent = {
                        id: widgetData.id,
                        name: widgetData.name,
                        widgets: this.getWidgets(),
                        hotspots: this.getHotspots()
                    };
                    this.trigger(BuilderEvents.DidCreateWidget, evt);
                    return widget;
                }
            }
        }
        return null;
    }

    /**
     * Delete a widget
     * @param widgetData 
     */
    deleteWidget (widgetData: { id: string }): void {
        this.widgetsMap[widgetData.id]?.remove();
        delete this.widgetsMap[widgetData.id];
    }

    /**
     * Edit a widget
     * @param widgetData 
     */
    async editWidget (data: { id: string, coords?: Coords }): Promise<WidgetEVO | null> {
        if (data?.id) {
            const id: string = data.id;
            const coords: Coords = data?.coords || this.hotspotEditor.getCoords(id);
            return new Promise((resolve, reject) => {
                if (id && coords) {
                    const widgetData: WidgetObjectData = {
                        id,
                        coords,
                        name: this.widgetsMap[id]?.getName() || WidgetEVO.uuid(),
                        kind: this.widgetsMap[id]?.getKind(),
                        opt: this.widgetsMap[id]?.getOptions(),
                        cons: this.widgetsMap[id]?.getConstructorName()
                    }
                    const editor: WidgetEditor = new WidgetEditor({ widgetData });
                    editor.on(WidgetEditorEvents.ok, (widgetData: WidgetObjectData) => {
                        const widget: WidgetEVO = this.createWidget(widgetData);
                        resolve(widget);
                    });
                    editor.on(WidgetEditorEvents.cancel, (data: WidgetObjectData) => {
                        resolve(null);
                    });
                } else {
                    resolve(null);
                }
            });
        }
    }

    /**
     * Uses a whiteboard as prototype picture
     */
    createWhiteboard (): void {
        const size: { width: number, height: number } = this.getActivePanelSize();
        this.loadPicture({
            fileName: "whiteboard",
            fileExtension: ".gif",
            fileContent: utils.transparentGif
        }, {
            ...size,
            border: "1px solid black"
        });
    }

    /**
     * Internal function, creates the frame where widgets will be rendered
     */
    protected createImageFrameLayer (): void {
        const size: { width: number, height: number } = this.getActivePanelSize();
        this.loadPicture({
            fileName: "image-frame",
            fileExtension: ".gif",
            fileContent: utils.transparentGif
        }, {
            ...size,
            border: "1px solid black",
            $el: this.$imageFrame
        });
    }

    /**
     * Returns the size of the current picture loaded in builder view
     */
    getActivePictureSize (): { width: number, height: number } {
        const width: number = parseFloat($(`.prototype-screens .tab-pane.active .prototype-image`).css("width")) || window.innerWidth || MIN_WIDTH;
        const height: number = parseFloat($(`.prototype-screens .tab-pane.active .prototype-image`).css("height")) || (window.innerHeight - toolbarHeight) || MIN_HEIGHT;
        return { width, height };
    }

    /**
     * Returns the size of the central panel
     */
    getActivePanelSize (): { width: number, height: number } {
        const width: number = parseFloat($(`.prototype-screens .tab-pane.active`).css("width")) || window.innerWidth || MIN_WIDTH;
        const height: number = parseFloat($(`.prototype-screens .tab-pane.active`).css("height")) || window.innerHeight || MIN_HEIGHT;
        return { width, height: height - (1.5 * toolbarHeight) };
    }

    /**
     * Loads a new picture to the builder view, and automatically attaches a hotspot editor on top of the picture.
     * @param desc 
     * @param opt 
     */
    loadPicture (desc: Picture, opt?: PictureOptions): boolean {
        if (desc && desc.fileName && desc.fileContent && desc.fileExtension) {
            opt = opt || {};
            const $el: JQuery<HTMLElement> = opt.$el || this.$imageDiv;
            // load the image
            const imageElement: HTMLImageElement = new Image();
            imageElement.src = desc.fileContent;
            const maxSize: { width: number, height: number } = this.getActivePanelSize();
            if (opt.width) { imageElement.width = opt.width; }
            if (opt.height) { imageElement.height = opt.height; }
            $el.html(imageElement);
            $el.find("img").css({ "max-width": `${maxSize.width}px`, "max-height": `${maxSize.height}px` });
            // update size of image frame
            this.$imageFrame.find("img").css({ "max-width": `${maxSize.width}px`, "max-height": `${maxSize.height}px` });
            this.$imageFrame.attr("fname", `${desc.fileName}${desc.fileExtension}`);
            if (opt.border) { this.$imageFrame.css({ border: "1px solid black" }); }
            return true;
        }
        return false;
    }

    /**
     * Internal function, handles clicks on load-picture-btn
     * @param evt 
     */
    protected async onLoadPicture (evt: JQuery.ChangeEvent): Promise<Picture> {
        return new Promise ((resolve, reject) => {
            const file: File = evt?.currentTarget?.files[0];
            if (file) {
                const reader: FileReader = new FileReader();
                reader.addEventListener('loadend', (evt: ProgressEvent<FileReader>) => {
                    const fileContent: string = reader.result?.toString();
                    $(".load-picture-form").trigger("reset");
                    if (fileContent) {
                        const picture: Picture = {
                            fileName: fsUtils.getFileName(file.name),
                            fileExtension: fsUtils.getFileExtension(file.name),
                            fileContent
                        };
                        this.loadPicture(picture);
                        resolve(picture);
                    } else {
                        resolve(null);
                    }
                });
                reader.readAsDataURL(file);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * Internal function, installs event handlers
     */
    protected installHandlers (): void {
        $(document).find(".load-whiteboard-btn").on("click", (evt: JQuery.ClickEvent) => {
            this.createWhiteboard();
        });
        $(document).find(".load-picture-btn").on("input", async (evt: JQuery.ChangeEvent) => {
            await this.onLoadPicture(evt);
        });
    }

    // async sendLoadImageRequest(desc: Utils.FileDescriptor): Promise<boolean> {
    //     const fname: string = Utils.desc2fname(desc);
    //     const req: ReadFileRequest = {
    //         type: "readFile",
    //         encoding: "base64",
    //         path: fname
    //     }
    //     return new Promise ((resolve, reject) => {
    //         this.connection.sendRequest(req, (res: ReadFileResponse) => {
    //             if (res?.content) {
    //                 const img: HTMLImageElement = new Image();
    //                 img.onload = (res) => {
    //                     resolve(true);
    //                 }
    //                 img.onerror = (res) => {
    //                     //show the image drag and drop div
    //                     this.$el.filter(".dndcontainer").css("display", "block");
    //                     alert("Failed to load picture " + fname);
    //                     resolve(false);
    //                 };
    //                 // this.img.name = image.path;
    //                 img.src = res.content;        
    //             }
    //         });
    //     });
    // }
}