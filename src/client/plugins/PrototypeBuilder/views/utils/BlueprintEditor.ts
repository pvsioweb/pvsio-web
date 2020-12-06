import Backbone = require("backbone");
import { WidgetManager } from "../../WidgetManager";
import * as Utils from '../../../../env/Utils';
import { Coords } from "../../widgets/core/WidgetEVO";

export interface ImageMarkerOptions extends Backbone.ViewOptions {
    overlay: HTMLElement,
    imageViewId: string
};

export enum zIndex {
    BACK = 0,
    NORMAL = 1,
    FRONT = 2
};

export enum opacity {
    LOW = 0.4,
    HIGH = 0.9
};

const markerOverlayTemplate: string = `
<div id="{{id}}" class="{{imageViewId}}">
    <div class="marker-info noselect" style="display:block; z-index:100; position:absolute; background-color:white; color:black; opacity:0.8; padding:2px 8px; border-radius:8px;">
        <div class="marker-info-label" style="display:block; z-index:100;"></div>
    </div>
    <div class="marker-areas" style="display:block; z-index:100; opacity:0.9; background-color:green;"></div>
</div>
`;

const markerTemplate: string = `
<div class="marker" coords="{ top: 0, left: 0, width: 0, height: 0 }" id="{{id}}" style="top:{{top}}px; left:{{left}}px; width:{{width}}px; height:{{height}}px; position:absolute;">
    <div class="shader" style="margin-left:-1px; margin-top:-1px; width:100%; height:100%; background:lightseagreen; position:absolute; opacity:0.4; border: 1px solid blue; cursor:pointer;"></div>
    <div class="tl corner" style="width:8px; height:8px; background: blue; top:0px; left:0px; position:absolute; cursor:nw-resize; margin-left:-4px; margin-top:-4px;"></div>
    <div class="tr corner" style="width:8px; height:8px; background: blue; top:0px; left:{{width}}px; position:absolute; cursor:ne-resize; margin-left:-6px; margin-top:-4px;"></div>
    <div class="bl corner" style="width:8px; height:8px; background: blue; top:{{height}}px; left:0px; position:absolute; cursor:sw-resize; margin-left:-4px; margin-top:-4px;"></div>
    <div class="br corner" style="width:8px; height:8px; background: blue; top:{{height}}px; left:{{width}}px; position:absolute; cursor:se-resize; margin-left:-6px; margin-top:-4px;"></div>
</div>
`;

export class BlueprintEditor extends Backbone.View {
    protected widgetManager: WidgetManager;
    protected anchorCoords: Coords;
    protected dragStartCoords: Coords;

    protected imageViewId: string;
    readonly imageMarkerId: string;

    readonly tooltipMargin: number = 16;

    protected $overlay: JQuery<HTMLElement>;
    protected $marker: JQuery<HTMLElement>;
    
    constructor (widgetManager: WidgetManager, data: ImageMarkerOptions) {
        super(data);
        this.widgetManager = widgetManager;
        this.imageViewId = data.imageViewId;
        this.imageMarkerId = this.imageViewId.replace("image-view", "image-marker");
        this.$overlay = $(data.overlay);

        this.render();

        $(window).on("keydown", (evt: JQuery.KeyDownEvent) => {
            this.onKeyDown(evt);
        });
    }
    render (): BlueprintEditor {
        const content: string = Handlebars.compile(markerOverlayTemplate)({
            imageViewId: this.imageViewId,
            id: this.imageMarkerId
        });
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
    getMouseCoords (evt: JQuery.MouseUpEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent | JQuery.MouseDownEvent): Coords {
        const offset: JQuery.Coordinates = this.$el.offset();
        const top: number = +(evt?.pageY - offset?.top).toFixed(0);
        const left: number = +(evt?.pageX - offset?.left).toFixed(0);
        return {
            top: top < 0 ? 0 : top, 
            left: left < 0 ? 0 : left
        }
    }
    getMarkerCoords (marker: JQuery<HTMLElement>): Coords {
        return {
            top: +parseFloat(marker.css("top")).toFixed(0),
            left: +parseFloat(marker.css("left")).toFixed(0),
            width: +parseFloat(marker.css("width")).toFixed(0),
            height: +parseFloat(marker.css("height")).toFixed(0),
        };
    }
    showName (evt: JQuery.MouseOverEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent): void {
        const coords: Coords = this.getMouseCoords(evt);
        this.info().css({ display: "block", top: `${coords.top + this.tooltipMargin}px`, left: `${coords.left + this.tooltipMargin}px`, background: "white", color: "black" });
        this.label().html(`${evt?.target?.id}`);
    }
    showCoordinates (evt: JQuery.MouseOverEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent): void {
        const coords: Coords = this.getMouseCoords(evt);
        this.info().css({ display: "block", top: `${coords.top + this.tooltipMargin}px`, left: `${coords.left + this.tooltipMargin}px`, background: "white", color: "black" });
        this.label().html(`top:${coords.top}px<br>left:${coords.left}px`);
    }
    showSize (evt: JQuery.MouseDownEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent): void {
        const mousePosition: Coords = this.getMouseCoords(evt);
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
        this.info().css({ display: "block", top: `${mousePosition.top + this.tooltipMargin}px`, left: `${mousePosition.left + this.tooltipMargin}px`, background: "black", color: "white" });
        this.label().html(`width:${width.toFixed(0)}px<br>height:${height.toFixed(0)}px`);
    }
    protected onKeyDown (evt: JQuery.KeyDownEvent): void {
        const key: string = evt.key;
        if (key === "Escape") {
            this.$marker?.remove();
            this.$marker = null;
            this.anchorCoords = null;
            this.info().css({ display: "none" });
        }
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
        evt.preventDefault();
        this.dragStartCoords = null;
        if (this.anchorCoords) {
            this.showSize(evt);
        } else {
            this.showCoordinates(evt);
        }
    }
    protected onMouseMove (evt: JQuery.MouseMoveEvent): void {
        evt.preventDefault();
        if (this.anchorCoords) {
            this.showSize(evt);
        } else {
            this.showCoordinates(evt);
        }
    }
    protected onMouseDown (evt: JQuery.MouseDownEvent): void {
        evt.preventDefault();
        this.dragStartCoords = null;
        const key: string | number = evt.key || evt.keyCode;
        if (+key === Utils.mouseButtons.right) {
            // show context menu
        } else {
            $(".shader").css("opacity", opacity.LOW);
            // show size of the area while the are is created
            this.showSize(evt);
        }
    }
    protected onMouseUp (evt: JQuery.MouseUpEvent): void {
        evt.preventDefault();
        if (this.$marker) {
            const marker: JQuery<HTMLElement> = this.$marker;
            const shader: JQuery<HTMLElement> = marker.find(".shader");
            let markerCoords: Coords = this.getMarkerCoords(marker);
            shader.on("mouseover", (evt: JQuery.MouseOverEvent) => {
                if (!this.anchorCoords) {
                    // put marker under the cursor on top of the other markers
                    $(".marker").css("z-index", zIndex.NORMAL);
                    marker.css("z-index", zIndex.FRONT);
                    // increase visibility of the marker under the cursor
                    shader.css({ opacity: opacity.HIGH });
                }
            }).on("mouseout", (evt: JQuery.MouseOutEvent) => {
                if (!this.anchorCoords) {
                    marker.css("z-index", zIndex.NORMAL);
                    shader.css({ opacity: opacity.LOW });
                }
            }).on("mousedown", (evt: JQuery.MouseDownEvent) => {
                if (!this.anchorCoords) {
                    // save initial drag position
                    this.dragStartCoords = this.getMouseCoords(evt);
                    markerCoords = this.getMarkerCoords(marker);
                    // change cursor style
                    shader.css({ cursor: "move" });
                }
            }).on("mousemove", (evt: JQuery.MouseMoveEvent) => {
                if (!this.anchorCoords && this.dragStartCoords) {
                    const mousePosition: Coords = this.getMouseCoords(evt);
                    const offset: Coords = {
                        top: mousePosition.top - this.dragStartCoords.top,
                        left: mousePosition.left - this.dragStartCoords.left
                    };
                    marker.css({
                        left: markerCoords.left + offset.left,
                        top: markerCoords.top + offset.top
                    });
                }
            }).on("mouseup", (evt: JQuery.MouseUpEvent) => {
                if (!this.anchorCoords && this.dragStartCoords) {
                    const currentPosition: Coords = this.getMouseCoords(evt);
                    const offset: Coords = {
                        top: currentPosition.top - this.dragStartCoords.top,
                        left: currentPosition.left - this.dragStartCoords.left
                    };
                    this.dragStartCoords = null;
                    const finalMarkerCoords: Coords = {
                        top: markerCoords.top + offset.top,
                        left: markerCoords.left + offset.left
                    };
                    const widgetCoords: Coords = JSON.parse(marker.attr("coords"));
                    const finalWidgetCoords: Coords = {
                        top: widgetCoords.top + offset.top,
                        left: widgetCoords.left + offset.left,
                        width: currentPosition.width,
                        height: currentPosition.height
                    };                
                    marker.css({ top: finalMarkerCoords.top, left: finalMarkerCoords.left });
                    marker.attr("coords", JSON.stringify(finalWidgetCoords));
                    shader.css({ cursor: "pointer" });
                }
            });

            const width: number = parseFloat(marker.css("width"));
            const height: number = parseFloat(marker.css("height"));

            marker.find(".tr").css({ left: width });
            marker.find(".bl").css({ top: height });
            marker.find(".br").css({ top: height, left: width });
            marker.find(".corner").css({ display: "block" });

            const dragEndPosition: Coords = this.getMouseCoords(evt);
            marker.attr("coords", JSON.stringify({
                top: (this.anchorCoords.top < dragEndPosition.top) ? this.anchorCoords.top : dragEndPosition.top,
                left: (this.anchorCoords.left < dragEndPosition.left) ? this.anchorCoords.left : dragEndPosition.left,
                width,
                height
            }));
            marker.css("z-index", zIndex.FRONT);
            shader.css("opacity", opacity.HIGH);

            this.$marker = null;
        }        
        this.anchorCoords = null;
    }
}