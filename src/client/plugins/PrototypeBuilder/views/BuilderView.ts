import * as Utils from '../../../env/Utils';

import { WidgetEVO, Coords } from "../widgets/core/WidgetEVO";
import { Connection, ReadFileRequest, ReadFileResponse } from '../../../env/Connection';
import { HotspotEditor, HotspotEditorEvents, HotspotData, HotspotsMap } from './editors/HotspotEditor';

import { CentralViewEvents, CentralViewOptions, CreateWidgetEvent, WidgetsMap, BuilderEvents, MIN_WIDTH, MIN_HEIGHT } from './CentralView';
import { WidgetData, WidgetEditor, WidgetEditorEvents } from './editors/WidgetEditor';
import { WidgetClassDescriptor, widgets } from '../widgets/widgets';
import { BackgroundView } from './BackgroundView';

const contentTemplate: string = `
<div class="builder-coords" style="position:absolute; color:darkslategray; top:-1.4em; left:45%; white-space:nowrap;"></div>
<div class="image-div view-div container-fluid" style="padding-left:0;">
    <div class="container-fluid" style="position:relative; overflow:hidden; background-color:white; border:4px dashed teal; text-align:center; min-height:480px;">

        <div style="top:50%; left:35%; position:absolute;">
            <div class="btn-group center">
                <button class="btn btn-primary btn-lg load-image-btn" style="white-space:nowrap;">Load Image</button>
                <button class="btn btn-outline-secondary btn-lg use-whiteboard-btn" style="white-space:nowrap;">Use Whiteboard</button>
            </div>
        </div>

    </div>
</div>
<div class="image-overlay container-fluid" style="padding-left:0;"></div>`;

export class BuilderView extends BackgroundView {
    
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
        this.$imageDiv = this.$el.find(".image-div");
        this.$imageOverlay = this.$el.find(".image-overlay");
        this.createWhiteboard();
        this.createHotspotEditor();
        this.resizeView();
    }

    resizeView (coords?: Coords): void {
        // keep image height of background image -- do it only when the background panel is active
        const $background: JQuery<HTMLElement> = this.$el.find(`.tab-pane.active .background-div .image-div`);
        if ($background[0]) {
            const width: number = parseFloat(`${$background.css("width")}`);
            if (isFinite(width) && width > 0) {
                this.$imageDiv.css({ width: `${width}px`});
                this.$imageDiv.find("img").attr({ width });
            }
            const height: number = parseFloat(`${$background.css("height")}`);
            if (isFinite(height) && height > 0) {
                this.$imageDiv.css({ height: `${height}px`});
                this.$imageDiv.find("img").attr({ height });
            }
        } else if (coords && !this.keepAspectRatio) {
            super.resizeView(coords);
            const width: number = parseFloat(`${coords.width}`);
            if (isFinite(width) && width > 0) {
                this.$imageDiv.css({ width: `${width}px`});
                this.$imageDiv.find("img").attr({ width });
            }
        }
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
                        parent: this.$imageDiv,
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
            el: this.$imageDiv.find("img")[0],
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

    protected createWhiteboard (): void {
        const imageElement: HTMLImageElement = new Image();
        imageElement.src = Utils.transparentGif;
        const width: number = parseFloat($(".tab-pane.active .image-div").css("width")) || MIN_WIDTH;
        const height: number = parseFloat($(".tab-pane.active .image-div").css("height")) || MIN_HEIGHT;
        imageElement.width = width < MIN_WIDTH ? MIN_WIDTH : width;
        imageElement.height = height < MIN_HEIGHT ? MIN_HEIGHT : height;
        this.$imageDiv.html(imageElement);
        this.$imageDiv.css({ border: "1px solid black" });
    }

    protected installHandlers (): void {

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