import * as Backbone from 'backbone';
import * as Utils from '../../../../common/utils/pvsiowebUtils';
import { Coords, HotspotData } from "../../../../common/interfaces/Widgets";
import { widgetUUID } from '../../../../common/utils/uuidUtils';
import { getMouseCoords } from '../../../../common/utils/pvsiowebUtils';

/**
 * Events fired by the editor
 */
export const HotspotEditorEvents = {
    DidCreateHotspot: "DidCreateHotspot",
    DidSelectHotspot: "DidSelectHotspot",
    DidMoveHotspot: "DidMoveHotspot",
    DidResizeHotspot: "DidResizeHotspot",
    WillEditHotspot: "WillEditHotspot",
    DidCutHotspot: "DidCutHotspot",
    DidCopyHotspot: "DidCopyHotspot",
    DidPasteHotspot: "DidPasteHotspot",
    DidDeleteHotspot: "DidDeleteHotspot",
    DidClearSelection: "DidClearSelection"
};
/**
 * DOM elements used by the editor
 */
export interface HotspotEditorElements extends Backbone.ViewOptions {
    overlay: HTMLElement,
    builderCoords: HTMLElement
};

// constants
export enum zIndex {
    BACK = 100,
    NORMAL = 101,
    FRONT = 102
};
export enum opacity {
    TRANSPARENT = 0,
    LOW = 0.4,
    NORMAL = 0.6,
    HIGH = 0.9,
    OPAQUE = 1
};
const tooltipDistance: number = 20; // px

const hotspotNamePrefix: string = "hotspot_";

// templates
const markerOverlayTemplate: string = `
<style>
.marker.selected {
    border: 2px solid yellow;
    margin-top: 1px;
    margin-left: 1px;
}
</style>
<div class="marker-tooltip noselect" style="display:none; z-index:100; position:absolute; background-color:white; color:black; opacity:0.8; padding:2px 8px; border-radius:8px;">
    <div class="marker-tooltip-label" style="display:block; z-index:100;"></div>
</div>
<div class="marker-areas" style="position:absolute; top:0px; left:0px; display:block; z-index:100; opacity:0.9; background-color:green;"></div>
`;
// the marker has only one active corner for resize (tl), as this makes everything much easier to implement and bring little or no usability issue.
const markerTemplate: string = `
<div class="marker" coords=${JSON.stringify({ top: 0, left: 0, width: 0, height: 0 })} id="{{id}}" style="z-index:100; top:{{top}}px; left:{{left}}px; width:{{width}}px; height:{{height}}px; position:absolute;">
    <div class="shader" style="z-index:100; width:100%; height:100%; opacity:${opacity.LOW}; background:steelblue; position:absolute; border: 1px solid blue; cursor:crosshair;"></div>
    <div class="l corner" style="z-index:100; width:10px; height:100%; top:5px; left:0px; position:absolute; cursor:ew-resize; margin-left:-7px; margin-top:-5px; border: 1px solid blue; opacity:${opacity.TRANSPARENT};"></div>
    <div class="r corner" style="z-index:100; width:10px; height:100%; top:5px; left:100%; position:absolute; cursor:ew-resize; margin-left:-3px; margin-top:-5px; border: 1px solid blue; opacity:${opacity.TRANSPARENT};"></div>
    <div class="b corner" style="z-index:100; width:100%; height:10px; top:100%; left:5px; position:absolute; cursor:ns-resize; margin-left:-5px; margin-top:-2px; border: 1px solid blue; opacity:${opacity.TRANSPARENT};"></div>
    <div class="t corner" style="z-index:100; width:100%; height:10px; top:0px; left:5px; position:absolute; cursor:ns-resize; margin-left:-5px; margin-top:-7px; border: 1px solid blue; opacity:${opacity.TRANSPARENT};"></div>
    <div class="tl corner" style="z-index:100; width:10px; height:10px; top:0px; left:0px; position:absolute; cursor:nwse-resize; margin-left:-7px; margin-top:-7px; border: 1px solid blue; opacity:${opacity.TRANSPARENT};"></div>
    <div class="bl corner" style="z-index:100; width:10px; height:10px; top:100%; left:0px; position:absolute; cursor:nesw-resize; margin-left:-7px; margin-top:-3px; border: 1px solid blue; opacity:${opacity.TRANSPARENT};"></div>
    <div class="br corner" style="z-index:100; width:10px; height:10px; top:100%; left:100%; position:absolute; cursor:nwse-resize; margin-left:-3px; margin-top:-3px; border: 1px solid blue; opacity:${opacity.TRANSPARENT};"></div>
    <div class="tr corner" style="z-index:100; width:10px; height:10px; top:0px; left:100%; position:absolute; cursor:nesw-resize; margin-left:-3px; margin-top:-7px; border: 1px solid blue; opacity:${opacity.TRANSPARENT};"></div>
</div>
`;

// utility function, returns the coordinates of a given element
export function getCoords (elem: JQuery<HTMLElement>): Coords<number> {
    return {
        top: +parseFloat(elem.css("top")).toFixed(0),
        left: +parseFloat(elem.css("left")).toFixed(0),
        width: +parseFloat(elem.css("width")).toFixed(0),
        height: +parseFloat(elem.css("height")).toFixed(0),
    };
}
/**
 * Prints the given coordinates, in formatted form, in the given rendering element
 */
function printCoords ($elem: JQuery<HTMLElement>, coords: Coords<number>, opt?: { showSize?: boolean }): void {
    opt = opt || {};
    const info: string = opt.showSize ? `(top:${coords.top}, left:${coords.left}, width:${coords.width}, height:${coords.height})`
        : `(top:${coords.top}, left:${coords.left})`;
    $elem.text(info);
}


// Utility classes for mouse handlers
abstract class HotspotHandler extends Backbone.View {
    protected triggerEnabled: boolean = true;
    protected triggerTimer: NodeJS.Timer;
    protected initialMarkerCoords?: Coords<number>;
    protected dragStartCoords?: Coords<number>;
    protected $marker?: JQuery<HTMLElement>;
    protected $corner?: JQuery<HTMLElement>;
    protected $tooltip?: JQuery<HTMLElement>;
    protected $builderCoords?: JQuery<HTMLElement>;

    /**
     * Constructor
     */
    constructor ($el: JQuery<HTMLElement>, opt?: { $tooltip?: JQuery<HTMLElement>, $builderCoords: JQuery<HTMLElement> }) {
        super({ el: $el[0] });
        this.$tooltip = opt?.$tooltip;
        this.$builderCoords = opt?.$builderCoords;
        this.triggerTimer = setInterval(() => {
            this.triggerEnabled = true;
        }, 1000);
    }
    /**
     * Activates the handler
     */
    activate (desc: {
        $activeMarker: JQuery<HTMLElement>, 
        $activeCorner?: JQuery<HTMLElement>, 
        initialMarkerCoords?: Coords<number>, 
        draftStartCoords?: Coords<number>
    }): boolean {
        this.$marker = desc?.$activeMarker;
        this.$corner = desc?.$activeCorner;
        this.initialMarkerCoords = desc?.initialMarkerCoords;
        this.dragStartCoords = desc?.draftStartCoords;
        return true 
    };
    /**
     * Deactivates the handler
     */
    deactivate (): void {
        this.$marker = null;
        this.$corner = null;
        this.initialMarkerCoords = null;
        this.dragStartCoords = null;
    }
    /**
     * Internal function, mouse down handler
     */
    protected onMouseDown (evt: JQuery.MouseDownEvent): void {}
    /**
     * Internal function, mouse up handler
     */
    protected onMouseUp (evt: JQuery.MouseUpEvent): void {}
    /**
     * Internal function, mouse move handler
     */
    protected onMouseMove (evt: JQuery.MouseMoveEvent): boolean { return false; }
    /**
     * Internal function, resize hotspot handler
     */
    protected onResizeHotspot (evt: JQuery.MouseMoveEvent | JQuery.MouseUpEvent): Coords<number> {
        const mousePosition: Coords<number> = getMouseCoords(evt, this.$el);
        const offset: Coords<number> = {
            left: mousePosition.left - this.dragStartCoords.left,
            top: mousePosition.top - this.dragStartCoords.top
        };
        // node: corners are not adjusted, to reduce overhead. All corners but the active corner are hidden.
        this.$marker.find(".corner").css({
            display: "none"
        });
        this.$corner.css("display", "block");
        // resize marker -- this will automatically resize shader
        const coords: Coords<number> = this.$corner.hasClass("tl") ? {
            left: this.initialMarkerCoords.left + offset.left,
            top: this.initialMarkerCoords.top + offset.top,
            width: this.initialMarkerCoords.width - offset.left,
            height: this.initialMarkerCoords.height - offset.top
        } : this.$corner.hasClass("bl") ? {
            left: this.initialMarkerCoords.left + offset.left,
            top: this.initialMarkerCoords.top,
            width: this.initialMarkerCoords.width - offset.left,
            height: this.initialMarkerCoords.height + offset.top
        } : this.$corner.hasClass("br") ? {
            left: this.initialMarkerCoords.left,
            top: this.initialMarkerCoords.top,
            width: this.initialMarkerCoords.width + offset.left,
            height: this.initialMarkerCoords.height + offset.top
        } : this.$corner.hasClass("tr") ? {
            left: this.initialMarkerCoords.left,
            top: this.initialMarkerCoords.top + offset.top,
            width: this.initialMarkerCoords.width + offset.left,
            height: this.initialMarkerCoords.height - offset.top
        } : this.$corner.hasClass("l") ? {
            left: this.initialMarkerCoords.left + offset.left,
            top: this.initialMarkerCoords.top,
            width: this.initialMarkerCoords.width - offset.left,
            height: this.initialMarkerCoords.height
        } : this.$corner.hasClass("r") ? {
            left: this.initialMarkerCoords.left,
            top: this.initialMarkerCoords.top,
            width: this.initialMarkerCoords.width + offset.left,
            height: this.initialMarkerCoords.height
        } : this.$corner.hasClass("b") ? {
            left: this.initialMarkerCoords.left,
            top: this.initialMarkerCoords.top,
            width: this.initialMarkerCoords.width,
            height: this.initialMarkerCoords.height + offset.top
        } : this.$corner.hasClass("t") ? {
            left: this.initialMarkerCoords.left,
            top: this.initialMarkerCoords.top + offset.top,
            width: this.initialMarkerCoords.width,
            height: this.initialMarkerCoords.height - offset.top
        } : this.initialMarkerCoords;
        this.resizeHotspot(coords);
        return coords;
    }
    /**
     * Programmatically resize the active hotspot
     */
    resizeHotspot (coords: Coords, opt?: { $activeMarker?: JQuery<HTMLElement> }): void {
        if (coords) {
            const data: Coords = {};
            if (coords.left) { data.left = `${parseFloat(`${coords.left}`)}px`; }
            if (coords.top) { data.top = `${parseFloat(`${coords.top}`)}px`; }
            if (coords.width) { data.width = `${parseFloat(`${coords.width}`)}px`; }
            if (coords.height) { data.height = `${parseFloat(`${coords.height}`)}px`; }
            const $activeMarker: JQuery<HTMLElement> = opt?.$activeMarker || this.$marker;
            $activeMarker.css(data);
        }
    }
    // showTooltip (coords: Coords<number>, info: string): void {
    //     this.$tooltip.css({ display: "block", top: `${coords.top + tooltipDistance}px`, left: `${coords.left + tooltipDistance}px`, background: "black", color: "white" });
    //     this.$tooltip.find(".marker-tooltip-label").html(info);
    // }
    /**
     * Hide tooltip of the active hotspot
     */
    hideTooltip (): void {
        this.$tooltip.css({ display: "none" });
    }
    /**
     * Show coordinates of the active hotspot
     */
    showCoords (coords: Coords<number>, opt?: { showSize?: boolean }): void {
        printCoords(this.$builderCoords, coords, opt);
    }
};
class ResizeHandler extends HotspotHandler {
    onMouseDown (evt: JQuery.MouseDownEvent): void {
        // save initial drag position
        this.dragStartCoords = getMouseCoords(evt, this.$el);
        // save marker and coords
        this.initialMarkerCoords = getCoords(this.$marker);
    }
    onMouseMove (evt: JQuery.MouseMoveEvent): boolean {
        if (this.dragStartCoords) {
            // resize marker -- this will automatically resize shader
            const coords: Coords<number> = this.onResizeHotspot(evt);
            const id: string = this.$marker.attr("id");
            const data: HotspotData = { id, coords };
            this.trigger(HotspotEditorEvents.DidResizeHotspot, data);

            const mousePosition: Coords<number> = getMouseCoords(evt, this.$el);
            // const info: string = `width:${coords.width.toFixed(0)}px<br>height:${coords.height.toFixed(0)}px`;
            // this.showTooltip(mousePosition, info);
            this.showCoords({
                ...mousePosition,
                width: +coords.width.toFixed(0),
                height: +coords.height.toFixed(0)    
            }, { showSize: true });
            return true;
        }
        return false;
    }
    onMouseUp (evt: JQuery.MouseUpEvent): void {
        if (this.dragStartCoords) {
            const coords: Coords<number> = this.onResizeHotspot(evt);
            this.dragStartCoords = null;

            this.$marker.attr("coords", JSON.stringify(coords));
            this.$marker.find(".shader").css({ cursor: "default" });

            const id: string = this.$marker.attr("id");
            const data: HotspotData = { id, coords };
            this.trigger(HotspotEditorEvents.DidResizeHotspot, data);
        }
        this.$marker.find(".corner").css({
            display: "block"
        });
        this.hideTooltip();
    }
}
class MoveHandler extends HotspotHandler {
    onMouseDown (evt: JQuery.MouseDownEvent): void {
        // save initial drag position
        this.dragStartCoords = getMouseCoords(evt, this.$el);
        // save marker and coords
        this.initialMarkerCoords = getCoords(this.$marker);
        // change cursor style
        this.$marker.find(".shader").css({ cursor: "move" });
    }
    onMouseMove (evt: JQuery.MouseMoveEvent): boolean {
        if (this.dragStartCoords) {
            const mousePosition: Coords<number> = getMouseCoords(evt, this.$el);
            const offset: Coords<number> = {
                left: mousePosition.left - this.dragStartCoords.left,
                top: mousePosition.top - this.dragStartCoords.top
            };
            this.$marker.css({
                left: this.initialMarkerCoords.left + offset.left,
                top: this.initialMarkerCoords.top + offset.top
            });

            const coords: Coords<number> = {
                left: parseFloat(this.$marker.css("left")),
                top: parseFloat(this.$marker.css("top"))
            };
            const id: string = this.$marker.attr("id");
            const data: HotspotData = { id, coords };
            this.trigger(HotspotEditorEvents.DidMoveHotspot, data);
            return true;
        }
        return false;
    }
    onMouseUp (evt: JQuery.MouseUpEvent): void {
        if (this.dragStartCoords) {
            const mousePosition: Coords<number> = getMouseCoords(evt, this.$el);
            const offset: Coords<number> = {
                left: mousePosition.left - this.dragStartCoords.left,
                top: mousePosition.top - this.dragStartCoords.top
            };
            this.dragStartCoords = null;

            const id: string = this.$marker.attr("id");
            this.$marker.find(".shader").css({ cursor: "default" });
            this.$marker.css({
                left: this.initialMarkerCoords.left + offset.left,
                top: this.initialMarkerCoords.top + offset.top
            });
            const coords: Coords<number> = {
                left: +parseFloat(this.$marker.css("left")).toFixed(0),
                top: +parseFloat(this.$marker.css("top")).toFixed(0),
                width: +parseFloat(this.$marker.css("width")).toFixed(0),
                height: +parseFloat(this.$marker.css("height")).toFixed(0)
            };
            const data: HotspotData = { id, coords };
            if (offset.left === 0 && offset.top === 0) {
                // did select widget
                this.trigger(HotspotEditorEvents.DidSelectHotspot, data);
            } else {
                // did move widget
                this.$marker.attr("coords", JSON.stringify(coords));
                this.trigger(HotspotEditorEvents.DidMoveHotspot, data);
            }
        }
    }
}

// list of hotspots
export type HotspotsMap = { [id: string]: {
    $marker: JQuery<HTMLElement>
}};

/**
 * Hotspot Editor (main class)
 */
export class HotspotEditor extends Backbone.View {

    static readonly MIN_WIDTH: number = 10;
    static readonly MIN_HEIGHT: number = 10;

    /**
     * Editor modes
     */
    protected mode: "create" | "move" | "resize" | null = null;

    /**
     * Editor clipboard
     */
    protected clipboard: HotspotData;

    /**
     * Coordinates of the anchor node of the hotspot (i.e., first corner of the hotspot, create when starting mouse drag)
     */
    protected anchorCoords: Coords<number>;

    /**
     * Internal variables, used for the detection of double clicks
     */
    protected dblClick: number = 0;

    /**
     * DOM element for rendering mouse coordinates
     */
    protected $builderCoords: JQuery<HTMLElement>;

    /**
     * DOM element for rendering overlay, markers, and tooltips
     * - overlay layer is used for rendering the contours of the hotspot
     * - markers layer is used for the corners of the hotspot
     * - tooltips layers is used for tooltips
     */
    protected $overlay: JQuery<HTMLElement>;
    protected $marker: JQuery<HTMLElement>;
    protected $tooltip: JQuery<HTMLElement>;

    /**
     * Mouse handlers
     */
    protected moveHandler: MoveHandler;
    protected resizeHandler: ResizeHandler;

    /**
     * Hotspots created in the view
     */
    protected hotspots: HotspotsMap = {};

    /**
     * DOM elements used for overlay and coordinates
     */
    protected elems: HotspotEditorElements;
    
    /**
     * Constructor
     */
    constructor (elems: HotspotEditorElements) {
        super(elems);
        this.elems = elems;
    }

    /**
     * Renders the editor
     */
    renderView (): void {
        this.$overlay = $(this.elems.overlay);
        this.createHtmlContent(this.elems);
        this.$tooltip = this.$overlay.find(".marker-tooltip");
        this.$builderCoords = $(this.elems.builderCoords);

        this.moveHandler = new MoveHandler(this.$el, { $tooltip: this.$tooltip, $builderCoords: this.$builderCoords });
        this.resizeHandler = new ResizeHandler(this.$el, { $tooltip: this.$tooltip, $builderCoords: this.$builderCoords });
        this.moveHandler.on(HotspotEditorEvents.DidMoveHotspot, (data: HotspotData) => {
            this.selectHotspot(data);
            this.trigger(HotspotEditorEvents.DidSelectHotspot, data);
            this.trigger(HotspotEditorEvents.DidMoveHotspot, data);
        });
        this.moveHandler.on(HotspotEditorEvents.DidSelectHotspot, (data: HotspotData) => {
            this.selectHotspot(data);
            this.trigger(HotspotEditorEvents.DidSelectHotspot, data);
        });
        this.resizeHandler.on(HotspotEditorEvents.DidResizeHotspot, (data: HotspotData) => {
            this.selectHotspot(data);
            this.trigger(HotspotEditorEvents.DidSelectHotspot, data);
            this.trigger(HotspotEditorEvents.DidResizeHotspot, data);
        });
    
        $(window).on("keydown", (evt: JQuery.KeyDownEvent) => {
            this.onKeyDown(evt);
        });
    }
    /**
     * Returns the hotspots
     */
    getHotspots (): HotspotsMap {
        return this.hotspots;
    }
    /**
     * Returns a specific hotspot
     */
    getHotspot (id: string): JQuery<HTMLElement> {
        return this.hotspots[id]?.$marker;
    }
    /**
     * Returns the selected hotspots
     */
    getSelectedHotspot (): JQuery<HTMLElement> {
        const id: string = this.$overlay.find(".marker.selected").attr("id");
        return this.getHotspot(id);
    }
    /**
     * Returns the coordinates of a specific hotspot
     */
    getCoords (id: string): Coords {
        const coords: string = this.hotspots[id]?.$marker.attr("coords") || null;
        return JSON.parse(coords);
    }
    /**
     * Internal function, creates the html elements of the editor
     */
    protected createHtmlContent (elems?: HotspotEditorElements): HotspotEditor {
        elems = elems || this.elems;
        const content: string = Handlebars.compile(markerOverlayTemplate)({});
        const parent: HTMLElement = elems?.overlay || $("body")[0];
        $(parent).append(content);
        this.$el.attr("draggable", "false");
        // this.$el.css("cursor", "crosshair");
        this.$el.on("contextmenu", (evt: JQuery.ContextMenuEvent) => {
            // context menu position is relative to body
            const coords: Coords<number> = getMouseCoords(evt, $("body"));
            // hotspot position is relative to $el
            const hotspotCoords: Coords<number> = getMouseCoords(evt, this.$el);
            hotspotCoords.height = parseFloat(`${this.clipboard?.coords.height}`);
            hotspotCoords.width = parseFloat(`${this.clipboard?.coords.width}`);
            const hotspotData: HotspotData = {
                id: this.clipboard?.id,
                coords: hotspotCoords
            };
            this.openContextMenu(coords, hotspotData, {
                edit: false, delete: false, cut: false, copy: false
            });
            evt.preventDefault();
        });
        return this;
    }
    /**
     * Returns the markers layer, which is used to render the corners of the hotspot
     */
    getMarkersLayer (): JQuery<HTMLElement> {
        return this.$overlay.find(".marker-areas");
    }
    /**
     * Returns the list of event handlers implemented in the editor
     */
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
    /**
     * Renders the mouse coordinates (in the DOM element for rendering the coordinates)
     */
    showCoords (coords: Coords<number>, opt?: { showSize?: boolean }): void {
        printCoords(this.$builderCoords, coords, opt);
    }
    /**
     * Internal function, handles mouse events
     */
    protected mouseEventHandler (evt: JQuery.MouseDownEvent | JQuery.MouseOverEvent | JQuery.MouseMoveEvent): void {
        const mousePosition: Coords<number> = getMouseCoords(evt, this.$el);
        this.anchorCoords = this.anchorCoords || mousePosition;
        const width: number = Math.abs(this.anchorCoords?.left - mousePosition?.left);
        const height: number = Math.abs(this.anchorCoords?.top - mousePosition?.top);
        if (!this.$marker) {
            const id: string = `${hotspotNamePrefix}${widgetUUID()}`;
            const marker: string = Handlebars.compile(markerTemplate)({
                id,
                top: mousePosition.top,//pageY,
                left: mousePosition.left,//pageX,
                width,
                height
            });
            this.getMarkersLayer().append(marker);
            this.$marker = this.getMarkersLayer().find(`#${id}`);
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
        // this.showTooltip({
        //     top: mousePosition.top,
        //     left: mousePosition.left
        // }, `width:${width.toFixed(0)}px<br>height:${height.toFixed(0)}px`);
        this.showCoords({
            ...mousePosition,
            width: +width.toFixed(0),
            height: +height.toFixed(0)
        }, { showSize: true });
    }
    /**
     * Show tooltips
     */
    showTooltip (coords: Coords<number>, info: string): void {
        this.$tooltip.css({ display: "block", top: `${coords.top + tooltipDistance}px`, left: `${coords.left + tooltipDistance}px`, background: "black", color: "white" });
        this.$tooltip.find(".marker-tooltip-label").html(info);
    }
    /**
     * Hides tooltips
     */
    hideTooltip (): void {
        this.$tooltip.css({ display: "none" });
    }
    /**
     * Internal function, handles key down events
     */
    protected onKeyDown (evt: JQuery.KeyDownEvent): void {
        switch (evt.key) {
            // escape cancels the current operation
            case "Escape": {
                this.closeContextMenu();
                switch (this.mode) {
                    case "move": {
                        // TODO: restore initial marker position
                        //....
                        break;
                    }
                    case "resize": {
                        // TODO: restore initial marker size
                        //...
                        break;
                    }
                    default: {
                        this.$marker?.remove();
                        this.$marker = null;
                        this.anchorCoords = null;
                        this.hideTooltip();
                        break;
                    }
                }
                this.mode = null;
                this.showCorners();
                this.enableShaderPointer();
                break;
            }
            // case "c":
            // case "C": {
            //     const modifier: boolean = evt.ctrlKey || evt.metaKey;
            //     if (modifier) {
            //         // copy selected hotspot
            //         const selected: JQuery<HTMLElement> = this.getSelectedHotspot();
            //         const id: string = selected.attr("id");
            //         if (id) {
            //             this.copyHotspot({
            //                 id,
            //                 coords: this.getCoords(id)
            //             });
            //         }
            //     }
            //     break;
            // }
            default: {
                break;
            }
        }
    }
    /**
     * Shows the hotspot corners used for resize operations
     */
    showCorners (): void {
        this.$overlay?.find(".corner").css({
            display: "block"
        });
    }
    /**
     * Hides the hotspot corners used for resize operations
     */
    hideCorners (): void {
        this.$overlay?.find(".corner").css({
            display: "none"
        });
    }
    /**
     * Forces the use of crosshair pointer on .shader
     */
    disableShaderPointer (): void {
        this.$overlay?.find(".shader").css({ cursor: "crosshair" });
    }
    /**
     * Mouse pointer restored on .shader
     */
    enableShaderPointer (): void {
        this.$overlay?.find(".shader").css({ cursor: "default" });
    }
    /**
     * Internal function, handles scroll events
     */
    protected onScroll (evt: JQuery.ScrollEvent): void {
        evt.preventDefault();
        // this.$tooltip.html("");
    }
    /**
     * Internal function, handles mouse out events
     */
    protected onMouseOut (evt: JQuery.MouseOverEvent): void {
        evt.preventDefault();
        this.hideTooltip();
        // this.$tooltip.find(".marker-tooltip-label").html("");
    }
    /**
     * Internal function, handles mouse over events
     */
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
                    const coords: Coords<number> = getMouseCoords(evt, this.$el);
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
    /**
     * Closes (i.e., deletes from the view) the context menu
     */
    closeContextMenu (): void {
        Utils.deleteContextMenu();
    }
    /**
     * Open context menu
     */
    openContextMenu (menuCoords: Coords, hotspotData: HotspotData, opt?: {
        edit?: boolean, cut?: boolean, copy?: boolean, paste?: boolean, delete?: boolean,
        atCursorPosition?: boolean
    }): void {
        opt = {
            edit: !!hotspotData?.id, 
            cut: !!hotspotData?.id, 
            copy: !!hotspotData?.id, 
            paste: !!this.clipboard, 
            delete: !!hotspotData?.id,
            ...opt
        };
        const $menu: JQuery<HTMLElement> = Utils.createMenu({
            top: +parseFloat(`${menuCoords.top}`),
            left: +parseFloat(`${menuCoords.left}`),
            items: [
                { name: "Edit", disabled: !opt.edit, icon: `<i class="fa fa-edit" style="${opt.edit ? `color:${Utils.colors.blue};` : ""}padding-right:20px;"></i>` },
                "------",
                { name: "Cut", disabled: !opt.cut, icon: `<i class="fa fa-cut" style="${opt.cut ? `color:${Utils.colors.blue};` : ""}padding-right:20px;"></i>` },
                { name: "Copy", disabled: !opt.copy, icon: `<i class="fa fa-copy" style="${opt.copy ? `color:${Utils.colors.blue};` : ""}padding-right:20px;"></i>`},
                { name: "Paste", disabled: !opt.paste, icon: `<i class="fa fa-paste" style="${opt.paste ? `color:${Utils.colors.blue};` : ""}padding-right:20px;"></i>` },
                "------",
                { name: "Delete", disabled: !opt.delete, icon: `<i class="fa fa-trash" style="${opt.delete ? `color:${Utils.colors.blue};` : ""}padding-right:20px;"></i>` },
            ]
        });
        const $items: JQuery<HTMLElement> = $menu.find(".dropdown-item");
        for (let i = 0; i < $items.length; i++) {
            $($items[i]).on("click", (evt: JQuery.ClickEvent) => {
                jQuery(evt?.currentTarget).addClass("active");
                const action: string = jQuery(evt?.currentTarget).attr("action");
                const id: string = hotspotData?.id;
                let coords: Coords = this.getCoords(id); // this is done to make sure the size of the hotspot is current -- the user may have resized the hotspot
                switch (action) {
                    case "Edit": {
                        this.trigger(HotspotEditorEvents.WillEditHotspot, { id, coords });
                        break;
                    }
                    case "Cut": {
                        this.cutHotspot({ id, coords });
                        this.trigger(HotspotEditorEvents.DidCutHotspot, { id, coords });
                        break;
                    }
                    case "Copy": {
                        this.copyHotspot({ id, coords });
                        this.trigger(HotspotEditorEvents.DidCopyHotspot, { id, coords });
                        break;
                    }
                    case "Paste": {
                        const clone: HotspotData = this.pasteHotspot(hotspotData);
                        this.trigger(HotspotEditorEvents.DidPasteHotspot, { origin: hotspotData, clone });
                        break;
                    }
                    case "Delete": {
                        this.deleteHotspot({ id });
                        this.trigger(HotspotEditorEvents.DidDeleteHotspot, { id, coords });
                        break;
                    }
                    default: {
                        break;
                    }
                }
                this.closeContextMenu();
            });
        }
    }

    /**
     * Create a hotspot programmatically, based on the hotspot data passed to the function
     */
    createHotspot (data: HotspotData, opt?: { useFreshId?: boolean }): HotspotData {
        const id: string = opt?.useFreshId ? `${hotspotNamePrefix}${widgetUUID()}` : data?.id;
        const hotspotData: HotspotData = {
            ...data, id
        };
        let $activeMarker: JQuery<HTMLElement> = this.getMarkersLayer().find(`#${id}`) || this.$marker;
        if (!$activeMarker[0]) {
            const marker: string = Handlebars.compile(markerTemplate)({ id });
            this.getMarkersLayer().append(marker);
            $activeMarker = this.getMarkersLayer().find(`#${id}`);
            this.resizeHandler.resizeHotspot(hotspotData.coords, { $activeMarker });
        }

        $activeMarker.attr("coords", JSON.stringify(hotspotData.coords));
        const $shader: JQuery<HTMLElement> = $activeMarker.find(".shader");
        const $corners: JQuery<HTMLElement>[] = [
            $activeMarker.find(".tl"),
            $activeMarker.find(".bl"),
            $activeMarker.find(".br"),
            $activeMarker.find(".tr"),
            $activeMarker.find(".l"),
            $activeMarker.find(".r"),
            $activeMarker.find(".b"),
            $activeMarker.find(".t")
        ];
        // show corners
        $activeMarker.find(".corner").css({ display: "block" });

        // move hotspot to the front
        $activeMarker.css("z-index", zIndex.FRONT);            

        // install mouse handlers on shader
        $shader.on("mouseover", (evt: JQuery.MouseOverEvent) => {
            if (this.mode === null) {
                this.highlightHotspot({ id });
            }
        }).on("mouseout", (evt: JQuery.MouseOutEvent) => {
            if (this.mode === null) {
                this.clearHighlight();
            }
        }).on("mousedown", (evt: JQuery.MouseDownEvent) => {
            this.closeContextMenu();
            if (this.mode === null) {
                const key: number = evt.button;
                switch (key) {
                    case Utils.mouseButtons.middle:
                    case Utils.mouseButtons.right: {
                        break;
                    }
                    case Utils.mouseButtons.left:
                    default: {
                        this.mode = "move"; // start move mode
                        this.moveHandler.activate({ $activeMarker });
                        this.moveHandler.onMouseDown(evt);
                        break;
                    }
                }
            }
        }).on("mousemove", (evt: JQuery.MouseMoveEvent) => {
            const coords: Coords<number> = getMouseCoords(evt, this.$el);
            switch (this.mode) {
                case "move": {
                    this.showCoords(coords);
                    this.moveHandler.onMouseMove(evt);
                    break; 
                }
                case "resize": {
                    this.showCoords(coords); 
                    this.resizeHandler.onMouseMove(evt); 
                    break; 
                }
                default: {
                    break
                }
            }
        }).on("mouseup", (evt: JQuery.MouseUpEvent) => {
            this.enableShaderPointer();
            // check if this is a double click
            if (this.isDoubleClick()) {
                // trigger edit event
                const id: string = $activeMarker.attr("id");
                const hotspotData: HotspotData = {
                    id,
                    coords: this.getCoords(id)
                };    
                this.trigger(HotspotEditorEvents.WillEditHotspot, hotspotData);
            } else {
                switch (this.mode) {
                    case "move": {
                        const coords: Coords<number> = getMouseCoords(evt, this.$el);
                        this.showCoords(coords);
                        this.moveHandler.onMouseUp(evt);
                        break;
                    }
                    case "resize": {
                        const coords: Coords<number> = getMouseCoords(evt, this.$el);
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
        }).on("contextmenu", (evt: JQuery.ContextMenuEvent) => {
            const coords: Coords<number> = getMouseCoords(evt, $("body"));
            this.openContextMenu(coords, hotspotData);
            evt.preventDefault();
        });

        // install mouse handlers on hot corners
        for (let i in $corners) {
            const $activeCorner: JQuery<HTMLElement> = $corners[i];
            $activeCorner.on("mouseover", (evt: JQuery.MouseOverEvent) => {
                if (this.mode === null) {
                    this.highlightHotspot({ id });
                }
            }).on("mouseout", (evt: JQuery.MouseOutEvent) => {
                if (this.mode === null) {
                    this.clearHighlight();
                }
            }).on("mousedown", (evt: JQuery.MouseDownEvent) => {
                this.closeContextMenu();
                if (this.mode === null) {
                    this.mode = "resize"; // start resize mode
                    this.resizeHandler.activate({ $activeMarker, $activeCorner });
                    this.resizeHandler.onMouseDown(evt);
                    this.selectHotspot({ id });
                }
            }).on("mousemove", (evt: JQuery.MouseMoveEvent) => {
                const coords: Coords<number> = getMouseCoords(evt, this.$el);
                switch (this.mode) {
                    case "move": {
                        this.showCoords(coords);
                        this.moveHandler.onMouseMove(evt);
                        break;
                    }
                    case "resize": {
                        this.showCoords(coords);
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
                        const coords: Coords<number> = getMouseCoords(evt, this.$el);
                        this.showCoords(coords);
                        this.moveHandler.onMouseUp(evt); 
                        break; 
                    }
                    case "resize": {
                        const coords: Coords<number> = getMouseCoords(evt, this.$el);
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
                
                const coords: Coords<number> = getMouseCoords(evt, this.$el);
                this.showCoords(coords);
            });
        }

        // end creation
        this.hotspots[id] = {
            $marker: $activeMarker
        };
        return hotspotData;
    }

    /**
     * Internal function, handles mouse up events
     */
    protected onMouseUp (evt: JQuery.MouseUpEvent): void {
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
                this.showCorners();
                if (this.$marker) {
                    const width: number = parseFloat(this.$marker.css("width"));
                    const height: number = parseFloat(this.$marker.css("height"));
        
                    if (height < HotspotEditor.MIN_HEIGHT && width < HotspotEditor.MIN_WIDTH) {
                        // disallow creation of hotspots that are too small when using the mouse
                        this.$marker.remove();
                    } else {
                        // create hotspot
                        const id: string = this.$marker.attr("id");
                        const dragEndPosition: Coords = getMouseCoords(evt, this.$el);
                        const coords: Coords = {
                            top: (this.anchorCoords.top < dragEndPosition.top) ? this.anchorCoords.top : dragEndPosition.top,
                            left: (this.anchorCoords.left < dragEndPosition.left) ? this.anchorCoords.left : dragEndPosition.left,
                            width,
                            height
                        };
                        const hotspotData: HotspotData = { id, coords };
                        this.createHotspot(hotspotData);
                        this.trigger(HotspotEditorEvents.DidCreateHotspot, hotspotData); // this will open the editor dialog -- see handlers listening to the event
                    }
                    this.$marker = null;
                }
                this.anchorCoords = null;
            }
            this.mode = null; // end current mode
        }
    }
    /**
     * Internal function, handles mouse down events
     * This handler is triggered when the user starts to create a new hotspot 
     */
    protected onMouseDown (evt: JQuery.MouseDownEvent): void {
        this.closeContextMenu();
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
                const key: number = evt.button;
                if (key === Utils.mouseButtons.right) {
                    // show context menu
                } else {
                    this.hideCorners();
                    this.disableShaderPointer();
                    this.mouseEventHandler(evt);
                }
            }
        }
    }
    /**
     * Handles mouse move events
     */
    onMouseMove (evt: JQuery.MouseMoveEvent): void {
        evt.preventDefault();
        switch (this.mode) {
            case "move": {
                const success: boolean = this.moveHandler.onMouseMove(evt);
                if (!success) {
                    this.mode = null;
                }
                break;
            }
            case "resize": {
                const success: boolean = this.resizeHandler.onMouseMove(evt);
                if (!success) {
                    this.mode = null;
                }
                break;
            }
            default: {
                if (this.anchorCoords) {
                    this.mouseEventHandler(evt);
                } else {
                    const coords: Coords<number> = getMouseCoords(evt, this.$el);
                    this.showCoords(coords);
                }
            }
        }
    }
    /**
     * Selects a given hotspot
     */
    selectHotspot (data: { id: string }): void {
        if (data?.id) {
            this.clearSelection();
            const $el: JQuery<HTMLElement> = this.$overlay.find(`#${data.id}`);
            $el.addClass("selected");
            this.highlightHotspot(data);
        }
    }
    /**
     * Deselects a give hotspot
     */
    deselectHotspot (data: { id: string }): void {
        if (data?.id) {
            const $el: JQuery<HTMLElement> = this.$overlay.find(`#${data.id}`);
            $el.removeClass("selected");
            this.highlightHotspot(data);
        }
    }
    /**
     * Deselects all hotspots
     */
    clearSelection (): void {
        this.clearHighlight();
        this.$overlay.find(`.marker`).removeClass("selected");
        this.trigger(HotspotEditorEvents.DidClearSelection);
    }
    /**
     * Highlights a hotspot
     */
    highlightHotspot (data: { id: string }): void {
        if (data?.id) {
            const $el: JQuery<HTMLElement> = this.$overlay.find(`#${data.id}`);
            const color: string = $el.hasClass("selected") ? "yellow" : Utils.colors.blue;
            // put marker under the cursor on top of the other markers
            this.clearHighlight();
            $el.css("z-index", zIndex.FRONT);
            // increase visibility of the marker under the cursor
            $el.find(".shader").css({ border: `1px solid ${color}`});
            $el.find(".corner").css({ border: `1px solid ${Utils.colors.blue}`});
            $el.css({ "box-shadow": `${color} 0px 0px 8px` });
        }
    }
    /**
     * Removes highlight from all hotspots
     */
    clearHighlight (): void {
        $(".marker").css({ "z-index": zIndex.NORMAL });
        this.$overlay.find(".shader").css({ border: `1px solid gray`});
        this.$overlay.find(".corner").css({ border: `1px solid gray`});
        this.$overlay.find(`.marker`).css({ "box-shadow": `${Utils.colors.blue} 0px 0px 0px` });
        this.$overlay.find(".marker.selected .shader").css({ border: `1px solid ${Utils.colors.blue}`});
        this.$overlay.find(".marker.selected .corner").css({ border: `1px solid ${Utils.colors.blue}`});
        this.$overlay.find(`.marker.selected`).css({ "box-shadow": `${Utils.colors.blue} 0px 0px 8px` });
    }
    /**
     * Copies a given hotspot to the clipboard
     */
    copyHotspot (hotspotData: HotspotData): void {
        if (hotspotData) {
            this.clipboard = hotspotData;
        }
    }
    /**
     * Copies a given hotspot to the clipboard and deletes the hotspot
     */
    cutHotspot (hotspotData: HotspotData): void {
        if (hotspotData) {
            this.clipboard = hotspotData;
            this.deleteHotspot(hotspotData);
        }
    }
    /**
     * Creates a new hotspot using the clipboard as model
     */
    pasteHotspot (hotspotData: HotspotData): HotspotData {
        return this.createHotspot(hotspotData, { useFreshId: true });
    }
    /**
     * Deletes a given hotspot
     */
    deleteHotspot (data: { id: string }): void {
        if (data?.id) {
            const $el: JQuery<HTMLElement> = this.$overlay.find(`#${data.id}`);
            $el.remove();
        }
    }
}