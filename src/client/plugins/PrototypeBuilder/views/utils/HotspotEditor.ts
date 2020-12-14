import * as Backbone from 'backbone';
import * as Utils from '../../../../env/Utils';
import { WidgetManager } from "../../WidgetManager";
import { Coords } from "../../widgets/core/WidgetEVO";

export const HotspotEditorEvents = {
    DidCreateHotspot: "DidCreateHotspot",
    EditHotspot: "EditHotspot"
};
export interface HotspotData {
    id: string,
    coords: Coords
};

export interface HotspotEditorOptions extends Backbone.ViewOptions {
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
<div class="marker-tooltip noselect" style="display:block; z-index:100; position:absolute; background-color:white; color:black; opacity:0.8; padding:2px 8px; border-radius:8px;">
    <div class="marker-tooltip-label" style="display:block; z-index:100;"></div>
</div>
<div class="marker-areas" style="display:block; z-index:100; opacity:0.9; background-color:green;"></div>
`;
// the marker has only one active corner for resize (tl), as this makes everything much easier to implement and bring little or no usability issue.
const markerTemplate: string = `
<div class="marker" coords="{ top: 0, left: 0, width: 0, height: 0 }" id="{{id}}" style="top:{{top}}px; left:{{left}}px; width:{{width}}px; height:{{height}}px; position:absolute;">
    <div class="shader" style="margin-left:-1px; margin-top:-1px; width:100%; height:100%; background:lightseagreen; position:absolute; opacity:0.4; border: 1px solid yellow; cursor:pointer;"></div>
    <div class="tl corner" style="width:16px; height:16px; top:0px; left:0px; position:absolute; cursor:nw-resize; margin-left:-6px; margin-top:-6px; border:1px solid yellow; opacity:0.7;"></div>
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
    protected $marker?: JQuery<HTMLElement>;
    protected $corner?: JQuery<HTMLElement>;
    constructor ($el: JQuery<HTMLElement>) {
        this.$el = $el;
    }
    activate (desc: {
        $activeMarker: JQuery<HTMLElement>, 
        $activeCorner?: JQuery<HTMLElement>, 
        initialMarkerCoords?: Coords, 
        draftStartCoords?: Coords 
    }): boolean {
        this.$marker = desc.$activeMarker;
        this.$corner = desc.$activeCorner;
        this.initialMarkerCoords = desc.initialMarkerCoords;
        this.dragStartCoords = desc.draftStartCoords;
        return true 
    };
    deactivate () {
        this.$marker = null;
        this.$corner = null;
        this.initialMarkerCoords = null;
        this.dragStartCoords = null;
    }
    onMouseDown (evt: JQuery.MouseDownEvent): void {};
    onMouseMove (evt: JQuery.MouseMoveEvent): void {};
    onMouseUp (evt: JQuery.MouseUpEvent): void {};
    protected resizeHotspot (evt: JQuery.MouseMoveEvent | JQuery.MouseUpEvent): Coords {
        const mousePosition: Coords = getMouseCoords(evt, this.$el);
        const offset: Coords = {
            left: mousePosition.left - this.dragStartCoords.left,
            top: mousePosition.top - this.dragStartCoords.top
        };
        // node: corners are not adjusted, to reduce overhead. All corners but the active corner are hidden.
        this.$marker.find(".corner").css({
            display: "none"
        });
        this.$corner.css("display", "block");
        // resize marker -- this will automatically resize shader
        if (this.$corner.hasClass("tl")) {
            this.$marker.css({
                left: this.initialMarkerCoords.left + offset.left,
                top: this.initialMarkerCoords.top + offset.top,
                width: this.initialMarkerCoords.width - offset.left,
                height: this.initialMarkerCoords.height - offset.top
            });
        }
        return offset;
    }
};
class ResizeHandler extends HotspotHandler {
    onMouseDown (evt: JQuery.MouseDownEvent) {
        // save initial drag position
        this.dragStartCoords = getMouseCoords(evt, this.$el);
        // save marker and coords
        this.initialMarkerCoords = getCoords(this.$marker);
    }
    onMouseMove (evt: JQuery.MouseMoveEvent) {
        if (this.dragStartCoords) {
            // resize marker -- this will automatically resize shader
            this.resizeHotspot(evt);
        }
    }
    onMouseUp (evt: JQuery.MouseUpEvent) {
        if (this.dragStartCoords) {
            const offset: Coords = this.resizeHotspot(evt);
            this.dragStartCoords = null;

            const widgetCoords: Coords = JSON.parse(this.$marker.attr("coords"));
            const finalWidgetCoords: Coords = {
                left: widgetCoords.left + offset.left,
                top: widgetCoords.top + offset.top,
                width: widgetCoords.width - offset.left,
                height: widgetCoords.height - offset.top
            };                
            this.$marker.attr("coords", JSON.stringify(finalWidgetCoords));
            this.$marker.find(".shader").css({ cursor: "pointer" });
        }
        // show corners
        this.$marker.find(".corner").css({
            display: "block"
        });
    }
}
class MoveHandler extends HotspotHandler {
    onMouseDown (evt: JQuery.MouseDownEvent) {
        // save initial drag position
        this.dragStartCoords = getMouseCoords(evt, this.$el);
        // save marker and coords
        this.initialMarkerCoords = getCoords(this.$marker);
        // change cursor style
        this.$marker.find(".shader").css({ cursor: "move" });
    }
    onMouseMove (evt: JQuery.MouseMoveEvent) {
        if (this.dragStartCoords) {
            const mousePosition: Coords = getMouseCoords(evt, this.$el);
            const offset: Coords = {
                left: mousePosition.left - this.dragStartCoords.left,
                top: mousePosition.top - this.dragStartCoords.top
            };
            this.$marker.css({
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
            this.$marker.css({
                left: this.initialMarkerCoords.left + offset.left,
                top: this.initialMarkerCoords.top + offset.top
            });
            this.dragStartCoords = null;

            const widgetCoords: Coords = JSON.parse(this.$marker.attr("coords"));
            const finalWidgetCoords: Coords = {
                left: +(widgetCoords.left + offset.left).toFixed(0),
                top: +(widgetCoords.top + offset.top).toFixed(0),
                width: +(widgetCoords.width).toFixed(0),
                height: +(widgetCoords.height).toFixed(0)
            };

            this.$marker.attr("coords", JSON.stringify(finalWidgetCoords));
            this.$marker.find(".shader").css({ cursor: "pointer" });
        }
    }
}

// main class
export class HotspotEditor extends Backbone.View {
    protected widgetManager: WidgetManager;

    static readonly MIN_WIDTH: number = 10;
    static readonly MIN_HEIGHT: number = 10;

    protected mode: "create" | "move" | "resize" | null = null;

    protected anchorCoords: Coords;

    protected dblClick: number = 0;
    // protected imageViewId: string;
    // readonly imageMarkerId: string;

    readonly tooltipMargin: number = 16;

    protected $overlay: JQuery<HTMLElement>;
    protected $marker: JQuery<HTMLElement>;

    protected moveHandler: HotspotHandler;
    protected resizeHandler: HotspotHandler;
    
    constructor (widgetManager: WidgetManager, data: HotspotEditorOptions) {
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
        return this.$overlay.find(".marker-tooltip-label");
    }
    areas (): JQuery<HTMLElement> {
        return this.$overlay.find(".marker-areas");
    }
    info (): JQuery<HTMLElement> {
        return this.$overlay.find(".marker-tooltip");
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
    /**
     * Utility function, detects double clicks based on timing of consecutive mouse presses
     */
    protected isDoubleClick (): boolean {
        this.dblClick++;
        setTimeout(() => {
            this.dblClick = 0;
        }, Utils.DBLCLICK_TIMEOUT);
        return this.dblClick > 1;
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
            case "create":
            default: {
                if (this.$marker) {
                    // create hotspot
                    const $activeMarker: JQuery<HTMLElement> = this.$marker;
                    const $shader: JQuery<HTMLElement> = $activeMarker.find(".shader");
                    const $tl: JQuery<HTMLElement> = $activeMarker.find(".tl");

                    const width: number = parseFloat($activeMarker.css("width"));
                    const height: number = parseFloat($activeMarker.css("height"));

                    if (height < HotspotEditor.MIN_HEIGHT && width < HotspotEditor.MIN_WIDTH) {
                        this.$marker.remove();
                        this.$marker = null;
                    } else {
                        // install mouse handlers on shader
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
                            // check if this is a double click
                            if (this.isDoubleClick()) {
                                // trigger edit event
                                const hotspotData: HotspotData = {
                                    id: $activeMarker.attr("id"),
                                    coords: JSON.parse($activeMarker.attr("coords"))
                                };    
                                this.trigger(HotspotEditorEvents.EditHotspot, hotspotData);
                            } else {
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
                            }
                            this.mode = null; // end mode
                        });

                        // install mouse handlers on hot corners
                        $tl.on("mousedown", (evt: JQuery.MouseDownEvent) => {
                            if (this.mode === null) {
                                this.mode = "resize"; // start resize mode
                                this.resizeHandler.activate({ $activeMarker, $activeCorner: $tl });
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

                        // adjust corners
                        $activeMarker.find(".corner").css({ display: "block" });
                        const dragEndPosition: Coords = getMouseCoords(evt, this.$el);
                        $activeMarker.attr("coords", JSON.stringify({
                            top: (this.anchorCoords.top < dragEndPosition.top) ? this.anchorCoords.top : dragEndPosition.top,
                            left: (this.anchorCoords.left < dragEndPosition.left) ? this.anchorCoords.left : dragEndPosition.left,
                            width,
                            height
                        }));

                        // move hotspot on the front
                        $activeMarker.css("z-index", zIndex.FRONT);
                        $shader.css("opacity", opacity.HIGH);

                        // end creation
                        const hotspotData: HotspotData = {
                            id: $activeMarker.attr("id"),
                            coords: JSON.parse($activeMarker.attr("coords"))
                        };
                        this.trigger(HotspotEditorEvents.DidCreateHotspot, hotspotData);
                        this.$marker = null;
                    }
                }
                this.anchorCoords = null;
            }
            this.mode = null; // end current mode
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