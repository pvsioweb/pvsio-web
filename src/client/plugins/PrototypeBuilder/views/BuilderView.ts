import * as Utils from '../../../env/Utils';

import { WidgetEVO, Coords } from "../widgets/core/WidgetEVO";
import { Connection, ReadFileRequest, ReadFileResponse } from '../../../env/Connection';
import { HotspotEditor, HotspotEditorEvents, HotspotData, HotspotsMap } from './editors/HotspotEditor';

import { CentralViewOptions, CreateWidgetEvent, WidgetsMap, BuilderEvents, MIN_WIDTH, MIN_HEIGHT, CentralView } from './CentralView';
import { WidgetData, WidgetEditor, WidgetEditorEvents } from './editors/WidgetEditor';
import { WidgetClassDescriptor, widgets } from '../widgets/widgets';

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
    top:-2.2em; 
    left:35%; 
    transform:scale(0.8);
}
.builder-toolbar .btn {
    height:2.5em;
}
.builder-coords {
    position:absolute;
    color:darkslategray; 
    top:-1.8em; 
    transform:scale(0.8); 
    font-size:small;
}
</style>
<div class="builder-coords"></div>
<div class="builder-toolbar">
    <form class="load-picture-form">
        <div class="custom-file" style="position:absolute; width:13em;">
            <input type="file" class="custom-file-input load-picture-btn" accept="image/*">
            <label class="custom-file-label btn-sm" style="padding-right:20px; width:15em;"><i class="fa fa-upload"></i> Upload Picture</label>
        </div>
        <button class="btn btn-outline-danger btn-lg load-whiteboard-btn btn-sm" style="margin-left:16em; width:15em;">Remove Picture</button>
    </form>
</div>
<div class="prototype-image view-div container-fluid"></div>
<div class="prototype-image-frame view-div container-fluid"></div>
<div class="prototype-image-overlay container-fluid" style="padding-left:0;"></div>`;

export interface Picture {
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

export class BuilderView extends CentralView {
    
    protected $imageDiv: JQuery<HTMLElement>;
    protected $imageFrame: JQuery<HTMLElement>;
    protected $imageOverlay: JQuery<HTMLElement>;

    protected hotspotEditor: HotspotEditor;
    protected widgetsMap: WidgetsMap = {};

    protected clipboard: WidgetEVO;

    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
    }

    getWidgets (): WidgetsMap {
        return this.widgetsMap;
    }

    getHotspots (): HotspotsMap {
        return this.hotspotEditor.getHotspots();
    }

    activate (): void {
        const content: string = Handlebars.compile(contentTemplate, { noEscape: true })({});
        super.render({ ...this.viewOptions, content });
        // each prototype has three layers:
        // - a bottom layer (prototype-image) contains the prototype image
        // - a mid layer (prototype-image-frame) for rendering widgets -- this facilitates porting the set of widgets from one prototype to another when swapping the prototype image
        // - an upper layer (prototype-image-overlay) shows the resizeable hotspot areas while building the prototype. This layer become hidden during simulation runs.  
        this.$imageDiv = this.$el.find(".prototype-image");
        this.$imageFrame = this.$el.find(".prototype-image-frame");
        this.$imageOverlay = this.$el.find(".prototype-image-overlay");
        this.createWhiteboard();
        this.createTransparentLayer();
        this.resizeView();
        this.installHandlers();
        // create hotspot editor on top of the image
        this.createHotspotEditor();
    }

    selectWidget (data: { id: string }): void {
        this.hotspotEditor.selectHotspot(data);
    }
    deselectWidget (data: { id: string }): void {
        this.hotspotEditor.deselectHotspot(data);
    }

    createWidget (widgetData: WidgetData): WidgetEVO {
        if (widgetData) {
            // console.log(widgetData);
            if (widgetData.cons) {
                const desc: WidgetClassDescriptor = widgets.find((desc: WidgetClassDescriptor) => {
                    return desc.name === widgetData.cons;
                });
                // console.log(desc);
                if (desc) {
                    if (this.widgetsMap[widgetData.id]) {
                        this.widgetsMap[widgetData.id].remove();
                    }
                    const widget: WidgetEVO = new desc.cons(widgetData.id, widgetData.coords, { 
                        parent: this.$imageFrame,
                        type: widgetData.cons,
                        ...widgetData?.opt
                    });
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
    createHotspotEditor (): void {
        this.hotspotEditor = new HotspotEditor({
            el: this.$imageFrame.find("img")[0],
            overlay: this.$imageOverlay[0],
            builderCoords: this.$el.find(".builder-coords")[0]
        });

        // install handlers for hotspot events
        this.hotspotEditor.on(HotspotEditorEvents.DidCreateHotspot, (data: HotspotData) => {
            // do nothing, editing is triggered by double click on the hotspot
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
                    const widgetData: WidgetData = {
                        ...data.clone,
                        name: widget.getName(),
                        opt: widget.getOptions(),
                        cons: widget.getType()
                    };
                    this.createWidget(widgetData);
                }
            }
        });
    }

    deleteWidget (widgetData: { id: string }): void {
        this.widgetsMap[widgetData.id]?.remove();
        delete this.widgetsMap[widgetData.id];
    }

    async editWidget (data: { id: string }): Promise<WidgetEVO | null> {
        if (data?.id) {
            const id: string = data.id;
            const coords: Coords = this.hotspotEditor.getCoords(id);
            return new Promise((resolve, reject) => {
                if (id && coords) {
                    const widgetData: WidgetData = {
                        id,
                        coords,
                        name: this.widgetsMap[id]?.getName() || WidgetEVO.uuid(),
                        opt: this.widgetsMap[id]?.getOptions(),
                        cons: this.widgetsMap[id]?.getType()
                    }
                    const editor: WidgetEditor = new WidgetEditor({ widgetData });
                    editor.on(WidgetEditorEvents.ok, (widgetData: WidgetData) => {
                        const widget: WidgetEVO = this.createWidget(widgetData);
                        resolve(widget);
                    });
                    editor.on(WidgetEditorEvents.cancel, (data: WidgetData) => {
                        resolve(null);
                    });
                } else {
                    resolve(null);
                }
            });
        }
    }

    createWhiteboard (): void {
        const size: { width: number, height: number } = this.getActiveScreenSize();
        this.loadPicture({
            fileName: "whiteboard",
            fileExtension: ".gif",
            fileContent: Utils.transparentGif
        }, {
            ...size,
            border: "1px solid black"
        });
    }

    createTransparentLayer (): void {
        const size: { width: number, height: number } = this.getActiveScreenSize();
        this.loadPicture({
            fileName: "transparent",
            fileExtension: ".gif",
            fileContent: Utils.transparentGif
        }, {
            ...size,
            border: "1px solid black",
            $el: this.$imageFrame
        });
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
            const maxSize: { width: number, height: number } = this.getActiveScreenSize();
            if (opt.width) { imageElement.width = opt.width; }
            if (opt.height) { imageElement.height = opt.height; }
            $el.html(imageElement);
            $el.find("img").css({ "max-width": `${maxSize.width}px`, "max-height": `${maxSize.height}px` });
            $el.attr("name", `${desc.fileName}${desc.fileExtension}`);
            // update size of image frame
            this.$imageFrame.find("img").css({ "max-width": `${maxSize.width}px`, "max-height": `${maxSize.height}px` });
            if (opt.border) { this.$imageFrame.css({ border: "1px solid black" }); }
            return true;
        }
        return false;
    }

    getActiveImageSize (): { width: number, height: number } {
        const width: number = parseFloat($(`.prototype-screens .tab-pane.active .prototype-image`).css("width")) || window.innerWidth || MIN_WIDTH;
        const height: number = parseFloat($(`.prototype-screens .tab-pane.active .prototype-image`).css("height")) || window.innerHeight || MIN_HEIGHT;
        return { width, height };
    }
    getActiveScreenSize (): { width: number, height: number } {
        const width: number = parseFloat($(`.prototype-screens .tab-pane.active`).css("width")) || window.innerWidth || MIN_WIDTH;
        const height: number = parseFloat($(`.prototype-screens .tab-pane.active`).css("height")) || window.innerHeight || MIN_HEIGHT;
        return { width, height };
    }

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
                            fileName: Utils.getFileName(file.name),
                            fileExtension: Utils.getFileExtension(file.name),
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

    protected installHandlers (): void {

        $(document).find(".load-whiteboard-btn").on("click", (evt: JQuery.ClickEvent) => {
            this.createWhiteboard();
        });

        $(document).find(".load-picture-btn").on("input", async (evt: JQuery.ChangeEvent) => {
            await this.onLoadPicture(evt);
        });


        // this.$el.find(".use-whiteboard-btn").on("click", (evt: JQuery.ClickEvent) => {


        // });

        // this.$el.find(".load-image-btn").on("click", (evt: JQuery.ClickEvent) => {
        //     const req: OpenFileDialog = {
        //         type: "openFileDialog",
        //         image: true
        //     };
        //     this.connection?.sendRequest(req, (desc: Utils.FileDescriptor) => {
        //         if (desc && desc.fileContent) {
        //             const imageElement: HTMLImageElement = new Image();
        //             imageElement.src = desc.fileContent;
        //             this.$imageDiv.html(imageElement);
        //             this.$imageDiv.css({ border: "none" });

        //             const $image: JQuery<HTMLImageElement> = this.$imageDiv.find("img");
        //             $image.attr("id", this.id).addClass(this.viewId);

        //             this.hotspotEditor = new HotspotEditor(this.widgetManager, {
        //                 el: $image[0],
        //                 overlay: this.$imageOverlay[0]
        //             });
        //             // install handlers for hotspot events
        //             this.hotspotEditor.on(HotspotEditorEvents.DidCreateHotspot, (data: HotspotData) => {
        //                 // this.showDialog(data);
        //             });
        //             this.hotspotEditor.on(HotspotEditorEvents.EditHotspot, (data: HotspotData) => {
        //                 this.showDialog(data);
        //             });
        //         }
        //     });
        // });
    }

    // async loadImageContent (desc: Utils.FileDescriptor): Promise<boolean> {
    //     if (desc && desc.fileContent) {
    //         const imageElement: HTMLImageElement = new Image();
    //         imageElement.src = desc.fileContent;
    //         this.$imageDiv.html(imageElement);
    //         const $image: JQuery<HTMLImageElement> = this.$imageDiv.find("img");
    //         $image.attr("id", this.id).addClass(this.viewId);

    //         this.hotspotEditor = new HotspotEditor(this.widgetManager, {
    //             el: $image[0],
    //             overlay: this.$imageOverlay[0]
    //         });
    //         // install handlers for hotspot events
    //         this.hotspotEditor.on(HotspotEditorEvents.DidCreateHotspot, (data: HotspotData) => {
    //             // this.showDialog(data);
    //         });
    //         this.hotspotEditor.on(HotspotEditorEvents.EditHotspot, (data: HotspotData) => {
    //             this.editWidget(data);
    //         });
    //         return true;
    //     }
    //     return false;
    // }

    async sendLoadImageRequest(desc: Utils.FileDescriptor): Promise<boolean> {
        const fname: string = Utils.desc2fname(desc);
        const req: ReadFileRequest = {
            type: "readFile",
            encoding: "base64",
            path: fname
        }
        return new Promise ((resolve, reject) => {
            this.connection.sendRequest(req, (res: ReadFileResponse) => {
                if (res?.content) {
                    const img: HTMLImageElement = new Image();
                    img.onload = (res) => {
                        resolve(true);
                    }
                    img.onerror = (res) => {
                        //show the image drag and drop div
                        this.$el.filter(".dndcontainer").css("display", "block");
                        alert("Failed to load picture " + fname);
                        resolve(false);
                    };
                    // this.img.name = image.path;
                    img.src = res.content;        
                }
            });
        });
    }


    /**
     * Resizes the image and widgets to fit the view's element size
     * @return {number} Scale of the image
     */
    resize (): void {
        // if (this.img) {
        //     var // pbox = this.d3El.node().getBoundingClientRect(),
        //         adjustedWidth = this.img.width,
        //         adjustedHeight = this.img.height;

        //     this.$el.css("width", adjustedWidth + "px").css("height", adjustedHeight + "px");
        //     this.$el.filter("img").attr("src", this.img.src).attr("height", adjustedHeight).attr("width", adjustedWidth).css("display", "block");
        //     this.$el.filter("svg").attr("height", adjustedHeight).attr("width", adjustedWidth);
        //     // //hide the draganddrop stuff
        //     // this.$el.filter(".dndcontainer").css("display", "none");
        // }
    }

    /**
     * Removes a widget regions from the display
     */
    clearWidgetAreas () {
        // this.mapCreator.clear();
    }

    /**
     * Removes widget areas from the view, without completely removing the widget container itself
     */
    // softClearWidgetAreas () {
    //     this.mapCreator.clearRegions();
    // }

    /**
     * Removes the image displayed within the prototype builder image view
     */
    clearImage () {
        // this.$el.attr("style", null);
        // this.$el.filter("img").attr("src", "").attr("height", "0").attr("width", "0").attr("display", "none");
        // this.img = null;
        // this.$el.filter("svg").attr("height", "0").attr("width", "0");
        // this.$el.attr("style", "");
        // this.$el.filter("#body").attr("style", "height: 480px"); // 430 + 44 + 6
        // //show the image drag and drop div
        // this.$el.filter(".dndcontainer").css("display", null);
    }

    /**
     * @function hasImage
     * @description Returns whether or not the view is currently displaying an image
     * @returns {Boolean} true if an image is currently displayed, false otherwise.
     */
    // hasImage (): boolean {
    //     // return this.img && this.img.src && this.img.src !== "";
    // }

    /**
     * @return {d3.selection} The image map element used by this view
     */
    // getImageMap: function () {
    //     return this._map;
    // },

    // updateMapCreator (cb?: () => void) {
    //     const round = (val: number): number => {
    //         return Math.round(val * 10) / 10;
    //     };

    //     imageMapper({
    //         scale: 1, 
    //         element: this.$el.filter("img")[0], 
    //         parent: this.$el[0], 
    //         onReady: (mc) => {
    //             this.mapCreator = mc.on("create", (e) => {
    //                 const region = e.region;
    //                 // region.on("dblclick", function () {
    //                 //     _this.trigger("WidgetEditRequested", region.attr("id"));
    //                 // });

    //                 //pop up the widget edit dialog
    //                 const coord = {
    //                     top: round(e.pos.y),
    //                     left: round(e.pos.x),
    //                     width: round(e.pos.width),
    //                     height: round(e.pos.height)
    //                 };

    //                 this.trigger("WidgetRegionDrawn", coord, region);
    //             }).on("edit", (e) => {
    //                 this.trigger("WidgetEditRequested", e.region.attr("id"));
    //             }).on("resize", (e) => {
    //                 this.widgetManager.updateLocationAndSize(e.region.attr("id"), e.pos, e.scale);
    //                 const event = {
    //                     action: "resize",
    //                     widget: this.widgetManager.getWidget(e.region.attr("id"))
    //                 };
    //                 this.widgetManager.fire({ type: "WidgetModified", event });
    //             }).on("move", (e) => {
    //                 this.widgetManager.updateLocationAndSize(e.region.attr("id"), e.pos, e.scale);
    //                 const event = {
    //                     action: "move",
    //                     widget: this.widgetManager.getWidget(e.region.attr("id"))
    //                 };
    //                 this.widgetManager.fire({ type: "WidgetModified", event });
    //             }).on("remove", (e) => {
    //                 const event = {
    //                     action: "remove",
    //                     widget: this.widgetManager.getWidget(e.regions.node().id)
    //                 };
    //                 // e.regions.each(() => {
    //                 //     const w = this.widgetManager.getWidget($(this).attr("id"));
    //                 //     if (w) {
    //                 //         wm.removeWidget(w);
    //                 //         w.remove();
    //                 //     } else {
    //                 //         $(this.parentNode).empty();
    //                 //     }
    //                 // });
    //                 this.widgetManager.fire({ type: "WidgetModified", event });
    //             }).on("select", (e) => {
    //                 this.trigger("WidgetSelected", this.widgetManager.getWidget(e.region.attr("id")), e.event.shiftKey);
    //             }).on("clearselection", (e) => {
    //                 const widgets = [];
    //                 // e.regions.each(function () {
    //                 //     widgets.push(wm.getWidget($(this).attr("id")));
    //                 // });
    //                 this.widgetManager.fire({ type: "WidgetSelectionCleared", widgets, event: e.event });
    //             });
    //             if (cb) { 
    //                 cb();
    //             }
    //         }
    //     });
    // }
}