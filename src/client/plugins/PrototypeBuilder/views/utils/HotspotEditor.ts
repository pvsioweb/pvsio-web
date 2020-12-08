import Backbone = require("backbone");
import { WidgetManager } from "../../WidgetManager";
import * as Utils from '../../../../env/Utils';
import { Coords } from "../../widgets/core/WidgetEVO";

export interface ImageMarkerOptions extends Backbone.ViewOptions {
    overlay: HTMLElement//,
    // imageViewId: string
};

// constants
export enum zIndex {
    BACK = 0,
    NORMAL = 1,
    FRONT = 2
};
export enum opacity {
    LOW = 0.4,
    HIGH = 0.9
};

// templates
const markerOverlayTemplate: string = `
<div">
    <div class="marker-info noselect" style="display:block; z-index:100; position:absolute; background-color:white; color:black; opacity:0.8; padding:2px 8px; border-radius:8px;">
        <div class="marker-info-label" style="display:block; z-index:100;"></div>
    </div>
    <div class="marker-areas" style="display:block; z-index:100; opacity:0.9; background-color:green;"></div>
</div>
`;
const markerTemplate: string = `
<div class="marker" coords="{ top: 0, left: 0, width: 0, height: 0 }" id="{{id}}" style="top:{{top}}px; left:{{left}}px; width:{{width}}px; height:{{height}}px; position:absolute;">
    <div class="shader" style="margin-left:-1px; margin-top:-1px; width:100%; height:100%; background:lightseagreen; position:absolute; opacity:0.4; border: 1px solid blue; cursor:pointer;"></div>
    <div class="tl corner" style="width:16px; height:16px; background: blue; top:0px; left:0px; position:absolute; cursor:nw-resize; margin-left:-8px; margin-top:-8px;"></div>
    <div class="tr corner" style="width:16px; height:16px; background: blue; top:0px; left:{{width}}px; position:absolute; cursor:ne-resize; margin-left:-10px; margin-top:-8px;"></div>
    <div class="bl corner" style="width:16px; height:16px; background: blue; top:{{height}}px; left:0px; position:absolute; cursor:sw-resize; margin-left:-8px; margin-top:-8px;"></div>
    <div class="br corner" style="width:16px; height:16px; background: blue; top:{{height}}px; left:{{width}}px; position:absolute; cursor:se-resize; margin-left:-10px; margin-top:-8px;"></div>
</div>
`;

// utility functions
export function getCoords (elem: JQuery<HTMLElement>): Coords {
    return {
        top: +parseFloat(elem.css("top")).toFixed(0),
        left: +parseFloat(elem.css("left")).toFixed(0),
        width: +parseFloat(elem.css("width")).toFixed(0),
        height: +parseFloat(elem.css("height")).toFixed(0),
    };
}
export function getMouseCoords (evt: JQuery.MouseUpEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent | JQuery.MouseDownEvent, $el: JQuery<HTMLElement>): Coords {
    const offset: JQuery.Coordinates = $el.offset()
    const top: number = +(evt?.pageY - offset?.top).toFixed(0);
    const left: number = +(evt?.pageX - offset?.left).toFixed(0);
    return {
        top: top < 0 ? 0 : top, 
        left: left < 0 ? 0 : left
    }
}

// Utility classes
abstract class HotspotHandler {
    protected $el: JQuery<HTMLElement>;
    protected initialMarkerCoords?: Coords;
    protected dragStartCoords?: Coords;
    protected $activeMarker?: JQuery<HTMLElement>;
    protected $activeCorner?: JQuery<HTMLElement>;
    constructor ($el: JQuery<HTMLElement>) {
        this.$el = $el;
    }
    activate (desc: {
        $activeMarker: JQuery<HTMLElement>, 
        $activeCorner?: JQuery<HTMLElement>, 
        initialMarkerCoords?: Coords, 
        draftStartCoords?: Coords 
    }): boolean {
        this.$activeMarker = desc.$activeMarker;
        this.$activeCorner = desc.$activeCorner;
        this.initialMarkerCoords = desc.initialMarkerCoords;
        this.dragStartCoords = desc.draftStartCoords;
        return true 
    };
    deactivate () {
        this.$activeMarker = null;
        this.$activeCorner = null;
        this.initialMarkerCoords = null;
        this.dragStartCoords = null;
    }
    onMouseDown (evt: JQuery.MouseDownEvent): void {};
    onMouseMove (evt: JQuery.MouseMoveEvent): void {};
    onMouseUp (evt: JQuery.MouseUpEvent): void {};
    protected adjustShader ($activeMarker: JQuery<HTMLElement>, $activeCorner:JQuery<HTMLElement>, offset: Coords): void {
        // node: corners are not adjusted, to reduce overhead. All corners should be hidden when the shader is adjusted.
        // resize marker -- this will automatically resize shader
        if ($activeCorner.hasClass("tl")) {
            $activeMarker.css({
                left: this.initialMarkerCoords.left + offset.left,
                top: this.initialMarkerCoords.top + offset.top,
                width: this.initialMarkerCoords.width - offset.left,
                height: this.initialMarkerCoords.height - offset.top
            });
        } else if ($activeCorner.hasClass("tr")) {
            $activeMarker.css({
                top: this.initialMarkerCoords.top + offset.top,
                width: this.initialMarkerCoords.width + offset.left,
                height: this.initialMarkerCoords.height - offset.top,
            });
        } else if ($activeCorner.hasClass("br")) {
            $activeMarker.css({
                width: this.initialMarkerCoords.width + offset.left,
                height: this.initialMarkerCoords.height + offset.top,
            });
        } else if ($activeCorner.hasClass("bl")) {
            $activeMarker.css({
                left: this.initialMarkerCoords.left + offset.left,
                width: this.initialMarkerCoords.width - offset.left,
                height: this.initialMarkerCoords.height + offset.top,
            });
        }
    }
};
class ResizeHandler extends HotspotHandler {
    onMouseDown (evt: JQuery.MouseDownEvent) {
        // save initial drag position
        this.dragStartCoords = getMouseCoords(evt, this.$el);
        // save marker and coords
        this.initialMarkerCoords = getCoords(this.$activeMarker);
    }
    onMouseMove (evt: JQuery.MouseMoveEvent) {
        if (this.dragStartCoords) {
            const mousePosition: Coords = getMouseCoords(evt, this.$el);
            this.$activeMarker.find(".corner").css({
                display: "none"
            });
            // resize marker -- this will automatically resize shader
            const offset: Coords = {
                left: mousePosition.left - this.dragStartCoords.left,
                top: mousePosition.top - this.dragStartCoords.top
            };        
            this.adjustShader(this.$activeMarker, this.$activeCorner, offset);
        }
    }
    onMouseUp (evt: JQuery.MouseUpEvent) {
        if (this.dragStartCoords) {
            const mousePosition: Coords = getMouseCoords(evt, this.$el);
            const offset: Coords = {
                left: mousePosition.left - this.dragStartCoords.left,
                top: mousePosition.top - this.dragStartCoords.top
            };        
            this.adjustShader(this.$activeMarker, this.$activeCorner, offset);

            const finalMarkerCoords: Coords = getCoords(this.$activeMarker);
            this.dragStartCoords = null;

            const widgetCoords: Coords = JSON.parse(this.$activeMarker.attr("coords"));
            const finalWidgetCoords: Coords = {
                left: widgetCoords.left + offset.left,
                top: widgetCoords.top + offset.top,
                width: widgetCoords.width - offset.left,
                height: widgetCoords.height - offset.top
            };                
            this.$activeMarker.attr("coords", JSON.stringify(finalWidgetCoords));

            // adjust corners
            this.$activeMarker.find(".tr").css({ left: finalMarkerCoords.width });
            this.$activeMarker.find(".bl").css({ top: finalMarkerCoords.height });
            this.$activeMarker.find(".br").css({ top: finalMarkerCoords.height, left: finalMarkerCoords.width });
        }
        // show corners
        this.$activeMarker.find(".corner").css({
            display: "block"
        });
    }
}
class MoveHandler extends HotspotHandler {
    onMouseDown (evt: JQuery.MouseDownEvent) {
        // save initial drag position
        this.dragStartCoords = getMouseCoords(evt, this.$el);
        // save marker and coords
        this.initialMarkerCoords = getCoords(this.$activeMarker);
        // change cursor style
        this.$activeMarker.find(".shader").css({ cursor: "move" });
    }
    onMouseMove (evt: JQuery.MouseMoveEvent) {
        if (this.dragStartCoords) {
            const mousePosition: Coords = getMouseCoords(evt, this.$el);
            const offset: Coords = {
                left: mousePosition.left - this.dragStartCoords.left,
                top: mousePosition.top - this.dragStartCoords.top
            };
            this.$activeMarker.css({
                left: this.initialMarkerCoords.left + offset.left,
                top: this.initialMarkerCoords.top + offset.top
            });
        }
    }
    onMouseUp (evt: JQuery.MouseUpEvent) {
        if (this.dragStartCoords) {
            const mousePosition: Coords = getMouseCoords(evt, this.$el);
            const offset: Coords = {
                left: mousePosition.left - this.dragStartCoords.left,
                top: mousePosition.top - this.dragStartCoords.top
            };
            this.$activeMarker.css({
                left: this.initialMarkerCoords.left + offset.left,
                top: this.initialMarkerCoords.top + offset.top
            });
            this.dragStartCoords = null;

            const widgetCoords: Coords = JSON.parse(this.$activeMarker.attr("coords"));
            const finalWidgetCoords: Coords = {
                left: widgetCoords.left + offset.left,
                top: widgetCoords.top + offset.top,
                width: widgetCoords.width,
                height: widgetCoords.height
            };                
            this.$activeMarker.attr("coords", JSON.stringify(finalWidgetCoords));
            this.$activeMarker.find(".shader").css({ cursor: "pointer" });
        }
    }
}

// main class
export class HotspotEditor extends Backbone.View {
    protected widgetManager: WidgetManager;

    protected mode: "create" | "move" | "resize" | null = null;

    protected anchorCoords: Coords;

    // protected imageViewId: string;
    // readonly imageMarkerId: string;

    readonly tooltipMargin: number = 16;

    protected $overlay: JQuery<HTMLElement>;
    protected $marker: JQuery<HTMLElement>;

    protected moveHandler: HotspotHandler;
    protected resizeHandler: HotspotHandler;
    
    constructor (widgetManager: WidgetManager, data: ImageMarkerOptions) {
        super(data);
        this.widgetManager = widgetManager;
        // this.imageViewId = data.imageViewId;
        // this.imageMarkerId = this.imageViewId.replace("image-view", "image-marker");
        this.$overlay = $(data.overlay);

        this.render();

        this.moveHandler = new MoveHandler(this.$el);
        this.resizeHandler = new ResizeHandler(this.$el);
    
        $(window).on("keydown", (evt: JQuery.KeyDownEvent) => {
            this.onKeyDown(evt);
        });
    }
    render (): HotspotEditor {
        const content: string = Handlebars.compile(markerOverlayTemplate)({});
        this.$overlay.append(content);
        this.$el.attr("draggable", "false");
        this.$el.css("cursor", "crosshair");
        return this;
    }
    label (): JQuery<HTMLElement> {
        return this.$overlay.find(".marker-info-label");
    }
    areas (): JQuery<HTMLElement> {
        return this.$overlay.find(".marker-areas");
    }
    info (): JQuery<HTMLElement> {
        return this.$overlay.find(".marker-info");
    }
    events (): Backbone.EventsHash {
        return {
            mouseover: "onMouseOver",
            mousemove: "onMouseMove",
            mousedown: "onMouseDown",
            mouseout: "onMouseOut",
            mouseup: "onMouseUp",
            scroll: "onScroll"
        };
    }
    showName (evt: JQuery.MouseOverEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent): void {
        const coords: Coords = getMouseCoords(evt, this.$el);
        this.info().css({ display: "block", top: `${coords.top + this.tooltipMargin}px`, left: `${coords.left + this.tooltipMargin}px`, background: "whitesmoke", color: "black" });
        this.label().html(`${evt?.target?.id}`);
    }
    showCoords (coords: Coords): void {
        this.info().css({ display: "block", top: `${coords.top + this.tooltipMargin}px`, left: `${coords.left + this.tooltipMargin}px`, background: "whitesmoke", color: "black" });
        this.label().html(`top:${coords.top}px<br>left:${coords.left}px`);
    }
    hideCoords (): void {
        this.info().css({ display: "none" });
    }
    protected mouseEventHandler (evt: JQuery.MouseDownEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent): void {
        const mousePosition: Coords = getMouseCoords(evt, this.$el);
        this.anchorCoords = this.anchorCoords || mousePosition;
        const width: number = Math.abs(this.anchorCoords?.left - mousePosition?.left);
        const height: number = Math.abs(this.anchorCoords?.top - mousePosition?.top);
        if (!this.$marker) {
            const id: string = `marker-${Utils.uuid()}`;
            const marker: string = Handlebars.compile(markerTemplate)({
                id,
                top: mousePosition.top,//pageY,
                left: mousePosition.left,//pageX,
                width,
                height
            });
            this.areas().append(marker);
            this.$marker = this.areas().find(`#${id}`);
            // add mouse move event to the shader to display info box when the shader is crossed while creating the area 
            // e.g., this happens when the mouse position goes above the left/top of the initial mouse down position
            this.$marker?.find(".shader").on("mousemove", (evt: JQuery.MouseMoveEvent) => {
                this.onMouseMove(evt);
            });
            // mouse up event is necessary to register completion of the area creation when the cursor is on the sharer
            this.$marker?.find(".shader").on("mouseup", (evt: JQuery.MouseUpEvent) => {
                this.onMouseUp(evt);
            });
        }
        this.$marker.css({ width, height });
        this.$marker.find(".corner").css({ display: "none" });
        if (mousePosition?.left < this.anchorCoords?.left) {
            this.$marker.css({ left: mousePosition.left });
        }
        if (mousePosition?.top < this.anchorCoords?.top) {
            this.$marker.css({ top: mousePosition.top });
        }
        this.showInfo({
            top: mousePosition.top,
            left: mousePosition.left
        }, `width:${width.toFixed(0)}px<br>height:${height.toFixed(0)}px`);
    }
    showInfo (coords: Coords, info: string): void {
        this.info().css({ display: "block", top: `${coords.top + this.tooltipMargin}px`, left: `${coords.left + this.tooltipMargin}px`, background: "black", color: "white" });
        this.label().html(info);
    }
    protected onKeyDown (evt: JQuery.KeyDownEvent): void {
        const key: string = evt.key;
        if (key === "Escape") {
            switch (this.mode) {
                case "move": {
                    // restore initial marker position
                    //....
                    break;
                }
                case "resize": {
                    // restore initial marker size
                    //...
                    break;
                }
                default: {
                    this.$marker?.remove();
                    this.$marker = null;
                    this.anchorCoords = null;
                    this.info().css({ display: "none" });
                    break;
                }
            }
            this.mode = null;
            this.showCorners();
        }
    }
    showCorners (): void {
        this.$overlay?.find(".corner").css({
            display: "block"
        });
    }
    hideCorners (): void {
        this.$overlay?.find(".corner").css({
            display: "none"
        });
    }
    protected onScroll (evt: JQuery.ScrollEvent): void {
        evt.preventDefault();
        this.label().html("");
    }
    protected onMouseOut (evt: JQuery.MouseOverEvent): void {
        evt.preventDefault();
        this.info().css({ display: "none" });
        this.label().html("");
    }
    protected onMouseOver (evt: JQuery.MouseOverEvent): void {
        switch (this.mode) {
            case "move":
            case "resize": {
                break;
            }
            default: {
                if (this.anchorCoords) {
                    this.mouseEventHandler(evt);
                } else {
                    const coords: Coords = getMouseCoords(evt, this.$el);
                    this.showCoords(coords);
                }
                break;
            }
        }
    }

    onMouseUp (evt: JQuery.MouseUpEvent): void {
        switch (this.mode) {
            case "move": {
                this.moveHandler.onMouseUp(evt);
                break;
            }
            case "resize": {
                this.resizeHandler.onMouseUp(evt);
                break;
            }
            default: {
                if (this.$marker) {
                    const $activeMarker: JQuery<HTMLElement> = this.$marker;
                    const $shader: JQuery<HTMLElement> = $activeMarker.find(".shader");
                    const corners: {
                        $tl: JQuery<HTMLElement>,
                        $tr: JQuery<HTMLElement>,
                        $bl: JQuery<HTMLElement>,
                        $br: JQuery<HTMLElement>
                    } = {
                        $tl: $activeMarker.find(".tl"),
                        $tr: $activeMarker.find(".tr"),
                        $bl: $activeMarker.find(".bl"),
                        $br: $activeMarker.find(".br")
                    };

                    $shader.on("mouseover", (evt: JQuery.MouseOverEvent) => {
                        if (this.mode === null) {
                            // put marker under the cursor on top of the other markers
                            $(".marker").css("z-index", zIndex.NORMAL);
                            $activeMarker.css("z-index", zIndex.FRONT);
                            // increase visibility of the marker under the cursor
                            $shader.css({ opacity: opacity.HIGH });
                        }
                    }).on("mouseout", (evt: JQuery.MouseOutEvent) => {
                        if (this.mode === null) {
                            $activeMarker.css("z-index", zIndex.NORMAL);
                            $shader.css({ opacity: opacity.LOW });
                        }
                    }).on("mousedown", (evt: JQuery.MouseDownEvent) => {
                        if (this.mode === null) {
                            this.mode = "move"; // start move mode
                            this.moveHandler.activate({ $activeMarker });
                            this.moveHandler.onMouseDown(evt);
                        }
                    }).on("mousemove", (evt: JQuery.MouseMoveEvent) => {
                        switch (this.mode) {
                            case "move": {
                                this.hideCoords();
                                this.moveHandler.onMouseMove(evt);
                                break; 
                            }
                            case "resize": {
                                this.hideCoords(); 
                                this.resizeHandler.onMouseMove(evt); 
                                break; 
                            }
                            default: {
                                break
                            }
                        }
                    }).on("mouseup", (evt: JQuery.MouseUpEvent) => {
                        switch (this.mode) {
                            case "move": {
                                const coords: Coords = getMouseCoords(evt, this.$el);
                                this.showCoords(coords);
                                this.moveHandler.onMouseUp(evt);
                                break;
                            }
                            case "resize": {
                                const coords: Coords = getMouseCoords(evt, this.$el);
                                this.showCoords(coords);
                                this.resizeHandler.onMouseUp(evt);
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        this.mode = null; // end move mode
                    });

                    for (let i in corners) {
                        corners[i].on("mousedown", (evt: JQuery.MouseDownEvent) => {
                            if (this.mode === null) {
                                this.mode = "resize"; // start resize mode
                                this.resizeHandler.activate({ $activeMarker, $activeCorner: corners[i] });
                                this.resizeHandler.onMouseDown(evt);
                            }
                        }).on("mousemove", (evt: JQuery.MouseMoveEvent) => {
                            switch (this.mode) {
                                case "move": {
                                    this.hideCoords();
                                    this.moveHandler.onMouseMove(evt);
                                    break;
                                }
                                case "resize": {
                                    this.hideCoords();
                                    this.resizeHandler.onMouseMove(evt); 
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                        }).on("mouseup", (evt: JQuery.MouseUpEvent) => {
                            switch (this.mode) {
                                case "move": {
                                    const coords: Coords = getMouseCoords(evt, this.$el);
                                    this.showCoords(coords);
                                    this.moveHandler.onMouseUp(evt); 
                                    break; 
                                }
                                case "resize": {
                                    const coords: Coords = getMouseCoords(evt, this.$el);
                                    this.showCoords(coords);
                                    this.resizeHandler.onMouseUp(evt);
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                            this.resizeHandler.deactivate();
                            this.mode = null; // end move mode
                            
                            const coords: Coords = getMouseCoords(evt, this.$el);
                            this.showCoords(coords);
                        });
                    }

                    const width: number = parseFloat($activeMarker.css("width"));
                    const height: number = parseFloat($activeMarker.css("height"));

                    // adjust corners
                    corners.$tr.css({ left: width });
                    corners.$bl.css({ top: height });
                    corners.$br.css({ top: height, left: width });
                    $activeMarker.find(".corner").css({ display: "block" });

                    const dragEndPosition: Coords = getMouseCoords(evt, this.$el);
                    $activeMarker.attr("coords", JSON.stringify({
                        top: (this.anchorCoords.top < dragEndPosition.top) ? this.anchorCoords.top : dragEndPosition.top,
                        left: (this.anchorCoords.left < dragEndPosition.left) ? this.anchorCoords.left : dragEndPosition.left,
                        width,
                        height
                    }));
                    $activeMarker.css("z-index", zIndex.FRONT);
                    $shader.css("opacity", opacity.HIGH);

                    this.$marker = null;
                }        
                this.anchorCoords = null;
            }
            this.mode = null;
        }
    }
    onMouseDown (evt: JQuery.MouseDownEvent): void {
        switch (this.mode) {
            case "move": {
                this.moveHandler.onMouseDown(evt);
                break;
            }
            case "resize": {
                this.resizeHandler.onMouseDown(evt);
                break;
            }
            default: {
                const key: string | number = evt.key || evt.keyCode;
                if (+key === Utils.mouseButtons.right) {
                    // show context menu
                } else {
                    $(".shader").css("opacity", opacity.LOW);
                    this.mouseEventHandler(evt);
                }
            }
        }
    }
    onMouseMove (evt: JQuery.MouseMoveEvent): void {
        evt.preventDefault();
        switch (this.mode) {
            case "move": {
                this.moveHandler.onMouseMove(evt);
                break;
            }
            case "resize": {
                this.resizeHandler.onMouseMove(evt);
                break;
            }
            default: {
                if (this.anchorCoords) {
                    this.mouseEventHandler(evt);
                } else {
                    const coords: Coords = getMouseCoords(evt, this.$el);
                    this.showCoords(coords);
                }
            }
        }
    }
}