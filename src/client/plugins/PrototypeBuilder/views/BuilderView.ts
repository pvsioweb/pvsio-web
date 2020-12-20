/**
 * View that provides the main image display region of a prototype editor
 * @author Paolo Masci, Nathaniel Watson
 */

import * as Backbone from 'backbone';
import * as Utils from '../../../env/Utils';

import { WidgetEVO, Coords } from "../widgets/core/WidgetEVO";
import { Connection, OpenFileDialog, ReadFileRequest, ReadFileResponse } from '../../../env/Connection';
import { WidgetManager } from "../WidgetManager";
import { HotspotEditor, HotspotEditorEvents, HotspotData } from './utils/HotspotEditor';

import { View, BuilderViewOptions } from './View';
import { WidgetData, WidgetEditor, WidgetEditorEvents } from './utils/WidgetEditor';
import { WidgetClassDescriptor, widgets } from '../widgets/widgets';
import { Constructable } from '../../../env/PVSioWeb';

export const contentTemplate: string = `
<div class="image-div container-fluid" style="padding-left:0;">
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

export class BuilderView extends View {
    
    protected $imageOverlay: JQuery<HTMLElement>;
    protected $imageDiv: JQuery<HTMLElement>;

    protected hotspots: HotspotEditor;

    constructor (widgetManager: WidgetManager, data: BuilderViewOptions, connection: Connection, opt?: { localFiles?: boolean }) {
        super(widgetManager, data, connection);        
        this.render(data, opt);
        this.installHandlers();
    }

    render (data?: BuilderViewOptions, opt?: { localFiles?: boolean }): BuilderView {
        opt = opt || {};
        const content: string = Handlebars.compile(contentTemplate, { noEscape: true })(opt);
        super.render({ ...data, content });
        this.$imageDiv = this.$el.find(".image-div");
        this.$imageOverlay = this.$el.find(".image-overlay");
        return this;
    }

    async showDialog (data: HotspotData): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const editor: WidgetEditor = new WidgetEditor(this.widgetManager, data);
            editor.on(WidgetEditorEvents.ok, (data: WidgetData) => {
                if (data) {
                    console.log(data);
                    if (data.type) {
                        const desc: WidgetClassDescriptor = widgets.find((desc: WidgetClassDescriptor) => {
                            return desc.name === data.type;
                        });
                        console.log(desc);
                        if (desc) {
                            const widget: WidgetEVO = new desc.cons(data.id, data.coords, data.opt);
                            widget.renderSample();
                            console.log(widget);
                            return resolve(true);
                        }
                    }
                }
                return resolve(false);
            });
            editor.on(WidgetEditorEvents.cancel, (data: WidgetData) => {
                resolve(false);
            });
        });
    }

    protected installOpenLocalFileHandler (cb: (desc: Utils.FileDescriptor) => void, opt?: { isImage?: boolean }): void {
        const customFileInput: JQuery<HTMLElement> = this.$imageDiv.find(".custom-file-input");
        (opt?.isImage) ? customFileInput.attr("accept", "image/*") 
            : customFileInput.attr("accept", "*");
        customFileInput.on("change", (evt: JQuery.ChangeEvent) => {
            const file: File = evt?.currentTarget?.files[0];
            const reader: FileReader = new FileReader();
            reader.addEventListener('loadend', (evt: ProgressEvent<FileReader>) => {
                const fileContent: string = reader.result?.toString();
                customFileInput.trigger("reset");
                customFileInput.off("input");
                if (cb) {
                    cb ({
                        fileName: Utils.getFileName(file.name),
                        fileExtension: Utils.getFileExtension(file.name),
                        contextFolder: null,
                        fileContent
                    });
                }
            });
            reader.readAsDataURL(file);
        });
    }

    protected installHandlers (): void {
        this.listenTo(this.widgetManager, "WidgetRegionRestored", (id: string, coord: Coords) => {
            const widget: WidgetEVO = this.widgetManager.getWidget(id);
            // imageMapper.createRegion();
            // widget.element(mark);
        });

        this.$el.find(".use-whiteboard-btn").on("click", (evt: JQuery.ClickEvent) => {

            const minWidth: number = 800;
            const minHeight: number = 400;

            const imageElement: HTMLImageElement = new Image();
            imageElement.src = Utils.whiteGif;
            const width: number = parseFloat($(".tab-pane.active .image-div").css("width")) || minWidth;
            const height: number = parseFloat($(".tab-pane.active .image-div").css("height")) || minHeight;
            imageElement.width = width < minWidth ? minWidth : width;
            imageElement.height = height < minHeight ? minHeight : height;
            this.$imageDiv.html(imageElement);
            this.$imageDiv.css({ border: "1px solid black" });

            this.hotspots = new HotspotEditor(this.widgetManager, {
                el: this.$imageDiv.find("img")[0],
                overlay: this.$imageOverlay[0]
            });
            // install handlers for hotspot events
            this.hotspots.on(HotspotEditorEvents.DidCreateHotspot, (data: HotspotData) => {
                // this.showDialog(data);
            });
            this.hotspots.on(HotspotEditorEvents.EditHotspot, (data: HotspotData) => {
                this.showDialog(data);
            });
        });

        this.$el.find(".load-image-btn").on("click", (evt: JQuery.ClickEvent) => {
            const req: OpenFileDialog = {
                type: "openFileDialog",
                image: true
            };
            this.connection?.sendRequest(req, (desc: Utils.FileDescriptor) => {
                if (desc && desc.fileContent) {
                    const imageElement: HTMLImageElement = new Image();
                    imageElement.src = desc.fileContent;
                    this.$imageDiv.html(imageElement);
                    this.$imageDiv.css({ border: "none" });

                    const $image: JQuery<HTMLImageElement> = this.$imageDiv.find("img");
                    $image.attr("id", this.id).addClass(this.viewId);

                    this.hotspots = new HotspotEditor(this.widgetManager, {
                        el: $image[0],
                        overlay: this.$imageOverlay[0]
                    });
                    // install handlers for hotspot events
                    this.hotspots.on(HotspotEditorEvents.DidCreateHotspot, (data: HotspotData) => {
                        // this.showDialog(data);
                    });
                    this.hotspots.on(HotspotEditorEvents.EditHotspot, (data: HotspotData) => {
                        this.showDialog(data);
                    });
                }
            });
        });
    }


    events (): Backbone.EventsHash {
        return {
            "click button.btn-primary": "clickLoadImage"
        };
    }

    async loadImageContent (desc: Utils.FileDescriptor): Promise<boolean> {
        if (desc && desc.fileContent) {
            const imageElement: HTMLImageElement = new Image();
            imageElement.src = desc.fileContent;
            this.$imageDiv.html(imageElement);
            const $image: JQuery<HTMLImageElement> = this.$imageDiv.find("img");
            $image.attr("id", this.id).addClass(this.viewId);

            this.hotspots = new HotspotEditor(this.widgetManager, {
                el: $image[0],
                overlay: this.$imageOverlay[0]
            });
            // install handlers for hotspot events
            this.hotspots.on(HotspotEditorEvents.DidCreateHotspot, (data: HotspotData) => {
                // this.showDialog(data);
            });
            this.hotspots.on(HotspotEditorEvents.EditHotspot, (data: HotspotData) => {
                this.showDialog(data);
            });
            return true;
        }
        return false;
    }

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
     * Displays the region for the given widget as selected
     * @param {Widget} widget Widget to display as selected
     * @param {boolean} add True if any existing selection is being added to
     */
    selectWidget (id: string, add?: boolean) {
        // this.mapCreator.selectRegion(id, add);
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