/**
 * @module WidgetManager
 * @desc WidgetManager deals with interacting with user interface widgets used for prototyping picture based uis.
 * @author Patrick Oladimeji
 * @date 10/30/13 21:42:56 PM
 */
import { uuid as uuidGenerator } from '../../env/Utils';
// const EditWidgetView  = require("./forms/editWidget")

// core widgets
import { ButtonEVO as Button, ButtonEVO } from "./widgets/core/ButtonEVO";
import { TouchScreenEVO as TouchscreenButton } from "./widgets/core/TouchScreenEVO";
import { TouchScreenEVO as TouchscreenDisplay } from "./widgets/core/TouchScreenEVO";
import { LedEVO as LED } from "./widgets/core/LedEVO";
import { BasicDisplayEVO as BasicDisplay } from "./widgets/core/BasicDisplayEVO";
import { NumericDisplayEVO as NumericDisplay } from "./widgets/core/NumericDisplayEVO";
import { EmuTimer } from "./widgets/EmuTimer";
import { ButtonActionsQueue } from "./widgets/ButtonActionsQueue";

// import * as StateParser from "../../../util/PVSioStateParser";
import { keys as PreferenceKeys } from "../../app/preferences/PreferenceKeys";
import { WidgetEVO } from './widgets/core/WidgetEVO';
import { Connection } from '../../env/Connection';

// const Preferences = require("../../preferences/PreferenceStorage").getInstance();

import { EventDispatcher } from "../../env/EventDispatcher";

/**
 * @module BaseWidgetManager
 * @description
 * @author Nathaniel Watson
 */
export abstract class WidgetManagerBase extends EventDispatcher {
    protected _widgets: { [id: string]: WidgetEVO } = {};

    /**
     * Gets the widget with the specified id.
     * @param {string} id The html element id of the widget
     * @memberof module:WidgetManager
     */
    getWidget (id: string) {
        return this._widgets[id];
    };

    /**
     * Adds the specified widget to the list of widgets.
     * @param {Widget} widget The widget to be added.
     * @memberof module:WidgetManager
     */
    addWidget (widget: WidgetEVO) {
        this._widgets[widget.id] = widget;
    };

    /**
     * Removes the specified widget from the list of widgets.
     * @param {Widget} widget The widget to remove.
     * @memberof module:WidgetManager
     */
    removeWidget (widget: WidgetEVO) {
        widget.remove();
        delete this._widgets[widget.id];
    };

    /**
     * Gets a list of all the widgets loaded on the page. The returned array contains all
     * widget types
     * @returns {Widget[]}
     * @memberof WidgetManager
    */
    getAllWidgets (): WidgetEVO[] {
        return Object.values(this._widgets);
    };

    /**
     * Update  the location of the widget by updating the image map coords to the position given.
     * @param {Widget} widget The widget to update
     * @param {{x: number, y: number, width: number, height: number}} pos The new position and size
     * @param {Number?} scale a scale factor for the pos value. If not supplied defaults to 1
     * @memberof WidgetManager
     */
    updateLocationAndSize (widget: WidgetEVO, pos: { x?: number, y: number, width?: number, height?: number }, scale?: number) {
        scale = scale || 1;
        if (typeof widget === "string") { widget = this.getWidget(widget); }
        if (widget) {
            pos.x *= scale;
            pos.y *= scale;
            pos.width *= scale;
            pos.height *= scale;
            widget.updateLocationAndSize(pos);
        }
    };

    /**
     * update all the area maps attributed to all widgets on the project by the given scale factor
     * @param {Number} scale the scale to transform the maps by
    */
    scaleAreaMaps (scale: number) {
        const widgets: WidgetEVO[] = this.getAllWidgets();
        const _getPos = (el) => {
            return {
                x: el.attr("x"), 
                y: el.attr("y"), 
                height: el.attr("height"), 
                width: el.attr("width")
            };
        }
        if (widgets) {
            widgets.forEach((w:WidgetEVO) => {
                if (w.element()) {
                    const pos = _getPos(w.element());
                    this.updateLocationAndSize(w, pos, scale);
                }
            });
        }
    };
}


/**
 * @class WidgetManager
 * @classdesc WidgetManager deals with interacting with user interface widgets used for prototyping picture based uis.
 */
export class WidgetManager extends WidgetManagerBase {

    protected _timers: { [key: string]: EmuTimer } = {};
    protected _keyCode2widget = {}; // this table stores information about the relation between keyCodes and widgets
    protected connection: Connection;

    constructor (connection: Connection) {
        super();
        this._widgets = {};
        this.connection = connection;
        // Preferences.addListener("preferenceChanged", (e) => {
        //     if (e.key === "WALL_CLOCK_INTERVAL" && this._timers.tick) {
        //         const timerRate: number = Preferences.get(PreferenceKeys.WALL_CLOCK_INTERVAL) * 1000;
        //         this._timers.tick.updateInterval(timerRate);
        //         console.log("tick timer interval updated to " + timerRate / 1000 + " secs");
        //     }
        // });
    }

    ///TODO this should be moved out of this file and promoted to a property, or a function parameter in createImageMap
    renderResponse(err, res) {
        if (!err) {
            const state: string = res.data;//StateParser.parse(res.data[0]);
            const widgets: WidgetEVO[] = this.getAllWidgets();
            for (let i = 0; i < widgets.length; i++) {
                widgets[i].render(state);
            }
        } else {
            if (err.failedCommand && err.failedCommand.indexOf("tick(") === 0) {
                this.stopTimers();
                console.log("wallclock paused (tick function not implemented in the selected prototype)");
            }
        }
    }

    // left for backwards compatibility while moving to typescript -- to be removed
    createImageMap(widget: WidgetEVO) { }

    handleTimerEdit(emuTimer) {
        // EditWidgetView.create(emuTimer).on("ok", (e, view) => {
        //         view.remove();
        //         emuTimer.updateWithProperties(e.data);
        //         // fire event widget created
        //         this.fire({ type: "TimerModified", action: "create", timer: emuTimer });
        //     }).on("cancel", (e, view) => {
        //         view.remove();
        //     });
    }
    halo (buttonID: string) {
        const coords = $("." + buttonID)?.attr("coords")?.split(",");
        const pos = {
            x1: +coords[0], 
            y1: +coords[1], 
            x2: +coords[2], 
            y2: +coords[3]
        };
        const w: number = pos.x2 - pos.x1;
        const hrad: number = w / 2;
        const h: number = pos.y2 - pos.y1;
        const vrad: number = h / 2;
        const brad: string = hrad + "px " + vrad + "px";
        let mark: JQuery<HTMLDivElement> = $(".animation-halo");
        if (!mark[0]) {
            mark = $(document.createElement("div")).addClass("animation-halo");
            $("#imageDiv .prototype-image-inner").append(mark);
        }
        mark.css("top", pos.y1 + "px").css("left", pos.x1 + "px")
            .css("width", (pos.x2 - pos.x1) + "px").css("height", (pos.y2 - pos.y1) + "px")
            .css("border-top-left-radius", brad).css("border-top-right-radius", brad)
            .css("border-bottom-left-radius", brad).css("border-bottom-right-radius", brad);
    }
    haloOff () {
        $(".animation-halo").empty();
    }


    createWidget(w) {
        let widget = null;
        let x = w.x;
        let y = w.y;
        let height = w.height;
        let width = w.width;
        let scale = w.scale;
        w.type = w.type.toLowerCase();
        if (w.type === "button") {
            widget = new Button(w.id,
                { top: y * scale, left: x * scale, width: width * scale, height: height * scale },
                this.connection,
                { callback: this.renderResponse,
                  keyCode: w.keyCode,
                  keyName: w.keyName,
                  functionText: w.functionText,
                  customFunctionText: w.customFunctionText,
                  visibleWhen: w.visibleWhen,
                  evts: w.evts,
                  buttonReadback: w.buttonReadback,
                  parent: "imageDiv .prototype-image-inner" });
        } else if (w.type === "display") {
            widget = new BasicDisplay(w.id,
                { top: y * scale, left: x * scale, width: width * scale, height: height * scale },
                { displayKey: w.displayKey,
                  auditoryFeedback: w.auditoryFeedback,
                  visibleWhen: w.visibleWhen,
                  fontsize: w.fontsize,
                  fontColor: w.fontColor,
                  backgroundColor: w.backgroundColor,
                  parent: "imageDiv .prototype-image-inner" });
        } else if (w.type === "numericdisplay") {
            widget = new NumericDisplay(w.id,
                { top: y * scale, left: x * scale, width: width * scale, height: height * scale },
                { displayKey: w.displayKey,
                  cursorName: w.cursorName,
                  auditoryFeedback: w.auditoryFeedback,
                  visibleWhen: w.visibleWhen,
                  fontsize: w.fontsize,
                  fontColor: w.fontColor,
                  backgroundColor: w.backgroundColor,
                  parent: "imageDiv .prototype-image-inner" });
        } else if (w.type === "touchscreendisplay") {
            widget = new TouchscreenDisplay(w.id,
                { top: y * scale, left: x * scale, width: width * scale, height: height * scale },
                this.connection,
                { callback: this.renderResponse,
                  displayKey: w.displayKey,
                  cursorName: w.cursorName,
                  auditoryFeedback: w.auditoryFeedback,
                  visibleWhen: w.visibleWhen,
                  functionText: w.functionText,
                  fontsize: w.fontsize,
                  fontColor: w.fontColor,
                  backgroundColor: w.backgroundColor,
                  parent: "imageDiv .prototype-image-inner" });
        } else if (w.type === "touchscreenbutton") {
            widget = new TouchscreenButton(w.id,
                { top: y * scale, left: x * scale, width: width * scale, height: height * scale },
                this.connection,
                { callback: this.renderResponse,
                  functionText: w.functionText,
                  softLabel: w.softLabel,
                  auditoryFeedback: w.auditoryFeedback,
                  visibleWhen: w.visibleWhen,
                  fontsize: w.fontsize,
                  fontColor: w.fontColor,
                  backgroundColor: w.backgroundColor,
                  parent: "imageDiv .prototype-image-inner" });
        } else if (w.type === "led") {
            widget = new LED(w.id,
                { top: y * scale, left: x * scale, width: width * scale, height: height * scale },
                { ledKey: w.ledKey,
                  color: w.ledColor,
                  visibleWhen: w.visibleWhen,
                  parent: "imageDiv .prototype-image-inner" });
        } else {
            console.log("Warning: unrecognised widget type " + w.type);
        }
        return widget;
    }

    initialiseWidgets (): WidgetManager {
        console.log(`[widget-manager] bootstrapping widgets: ${this.renderResponse}`);
        ButtonActionsQueue.sendINIT(this.connection, this.renderResponse);
        return this;
    };

    /**
     * Restores the widget definitions passed in the parameter.
     * @param {Object} defs JSOn specification for the widget definitions to restore
     * @memberof WidgetManager
     */
    restoreWidgetDefinitions (defs) {
        this.clearWidgets();
        if (defs && defs.widgetMaps && defs.regionDefs) {
            // sanity check
            if (defs.widgetMaps.length !== defs.regionDefs.length) {
                // there's an issue with the file -- a widget is not associated to any region
                console.log("WARNING: Corrupted widgets definition file. Fixing the definitions...");
                var curruptedRegionDefs = [];
                defs.regionDefs.forEach((regionDef) => {
                    if (defs.widgetMaps.filter((map) => { return map.id === regionDef.class; }).length === 0) {
                        console.log("Found offending region definition: " + regionDef.class);
                        curruptedRegionDefs.push(regionDef.class);
                    }
                });
                var curruptedWidgetMaps = [];
                defs.widgetMaps.forEach((map) => {
                    if (defs.regionDefs.filter((def) => { return def.class === map.id; }).length === 0) {
                        console.log("Found offending widget map: " + map.displayKey + " (id: " + map.id + ")");
                        curruptedWidgetMaps.push(map.id);
                    }
                });
                // removing corrupted elements
                curruptedRegionDefs.forEach((x) => {
                    defs.regionDefs = defs.regionDefs.filter((d) => { return d.class !== x; });
                });
                curruptedWidgetMaps.forEach((x) => {
                    defs.widgetMaps = defs.widgetMaps.filter((d) => { return d.id !== x; });
                });
                if (defs.widgetMaps.length === defs.regionDefs.length) {
                    console.log("Definitions fixed successfully!");
                } else {
                    console.error("Failed to fix the widget definitions :((");
                }
            }
            this._keyCode2widget = {};
            let widget = null;
            for (let id in defs.widgetMaps) {
                const w = defs.widgetMaps[id];
                defs.regionDefs = defs.regionDefs || [];
                const coords = defs?.regionDefs?[0]["coords"]?.split(",") : [0,0,0,0];
                w.height = (parseFloat(coords[3]) - parseFloat(coords[1]));
                w.width  = (parseFloat(coords[2]) - parseFloat(coords[0]));
                w.left = parseFloat(coords[0]);
                w.top = parseFloat(coords[1]);
                // w.scale = (d3.select("#imageDiv svg > g").node()) ?
                //              +(d3.select("#imageDiv svg > g").attr("transform").replace("scale(", "").replace(")", "")) || 1 : 1;
                const widget: WidgetEVO = this.createWidget(w);
                if (widget) {
                    this.addWidget(widget);
                    if (widget["keyCode"] && widget.type === "button") {
                        this._keyCode2widget[widget["keyCode"]] = widget;
                    }
                }
            }

            //create div
            if (defs.regionDefs) {
                defs.regionDefs.forEach(function (d) {
                    widget = this.getWidget(d["class"]);
                    var coords = d.coords.split(",").map(function (d) {
                        return parseFloat(d);
                    });
                    var h = parseFloat(coords[3]) - parseFloat(coords[1]),
                        w = parseFloat(coords[2]) - parseFloat(coords[0]),
                        x = parseFloat(coords[0]),
                        y = parseFloat(coords[1]);
                    h = h > 8 ? h - 5 : h;
                    w = w > 8 ? w - 5 : w;
                    var coord = {x: x, y: y, width: w, height: h};
                    this.trigger("WidgetRegionRestored", widget, coord);
                    this.createImageMap(widget);
                });
            }
        }
    };
    handleKeyDownEvent (evt: JQuery.Event) {
        // d3.select(document).on("keydown", function () {
        if ($("#btnSimulatorView")[0] && $("#btnSimulatorView").hasClass("active")) {
            const eventKeyCode: number = evt.which;
            const widget: WidgetEVO = this._keyCode2widget[eventKeyCode];
            if (widget && typeof widget.evts === "function" && (<ButtonEVO> widget).evts?.click) {
                (<ButtonEVO> widget).click({ callback: this.renderResponse });
                this.halo(widget.id);
                evt.preventDefault();
                evt.stopPropagation();
            } else if (widget && typeof widget.evts === "function" && (<ButtonEVO> widget).evts["press/release"]) {
                (<ButtonEVO> widget).pressAndHold({ callback: this.renderResponse });
                this.halo(widget.id);
                evt.preventDefault();
                evt.stopPropagation();
            }
        }
        // });
    };
    handleKeyUpEvent (evt: JQuery.Event) {
        // d3.select(document).on("keyup", function () {
        if ($("#btnSimulatorView")[0] && $("#btnSimulatorView").hasClass("active")) {
            const eventKeyCode: number = evt.which;
            const widget: WidgetEVO = this._keyCode2widget[eventKeyCode];
            if (widget && typeof widget.evts === "function" && (<ButtonEVO> widget).evts["press/release"]) {
                (<ButtonEVO> widget).release({ callback: this.renderResponse });
            }
            this.haloOff();
        }
        // });
    };
    addWallClockTimer () {
        //pop up the timer edit dialog
        const id: string = "tick";
        const timerRate: number = 10000;//Preferences.get(PreferenceKeys.WALL_CLOCK_INTERVAL) * 1000;
        const emuTimer: EmuTimer = new EmuTimer(id, this.connection, { timerEvent: id, timerRate: timerRate, callback: this.renderResponse });
        this._timers[emuTimer.id] = emuTimer;
        // fire event widget created
        this.fire({ type: "TimerModified", action: "create", timer: emuTimer });

    };
    editTimer (emuTimer: EmuTimer) {
        this.handleTimerEdit(emuTimer);
    };

    /**
     * Edits the specified widget.
     * @param {Widget} widget The widget to be edited.
     * @memberof module:WidgetManager
     */
    editWidget (widget: WidgetEVO, data) {
        widget.updateLocationAndSize(data);
        // widget.updateStyle(data);
        widget.renderSample({ visibleWhen: "true" });
        //create an interactive image area only if there isnt one already
        this.createImageMap(widget);
        if (data.keyCode) {
            this._keyCode2widget[data.keyCode] = widget;
        }
        // fire event widget modified
        this.fire({ type: "WidgetModified" });
    };
    startTimers (): void {
        console.log("[widget-manager] bootstrapping wallclock timers...");
        for (let id in this._timers) {
            this._timers[id].start();
        }
    };
    stopTimers = function () {
        for (let id in this._timers) {
            this._timers[id].stop();
        }
    };

    /**
     * Creates a new widget and adds it to the WidgetManager
     * @param {object} data Data object from a NewWidgetView callback
     * @param {object} coord Object with top, left, width, height properties specifying the widget position
     * @param {function} onCreate Called once the widget has been created, but before it is added to the manager
     * @return {Widget} The new widget
     */
    addNewWidget (data, coord, onCreate) {
        var name = data.functionText || data.displayKey || data.ledKey || "";
        data.id = data.type + "_" + name + "_" + uuidGenerator();
        // the ID should not contain "."
        data.id = data.id.replace(/\./g,"-");

        data.height = coord.height;
        data.width = coord.width;
        data.x = coord.left;
        data.y = coord.top;
        data.visibleWhen = (!data.visibleWhen || data.visibleWhen.length === 0) ? "true" : data.visibleWhen;

        const widget: WidgetEVO = this.createWidget(data);
        if (widget) {
            if (onCreate) {
                onCreate(widget, this.renderResponse);
            }
            widget.updateLocationAndSize(data);
            this.addWidget(widget);
            if (widget["keyCode"] && widget.type === "button") {
                this._keyCode2widget[widget["keyCode"]] = widget;
            }
            this.fire({ type: "WidgetModified", action: "create", widget: widget });
        }
        return widget;
    };

    /**
     * Removes all the widgets on the interface
     */
    clearWidgets () {
        for (let id in this._widgets) {
            this._widgets[id].remove();//remove the widgets from the interface
        }
        this._widgets = {};
        require("widgets/ButtonHalo").getInstance().removeKeypressHandlers();
    }

    /**
     * Gets a list of all display widgets loaded on the page.
     * @returns {BasicDisplay[]}
     * @memberof module:WidgetManager
     */
    getAllDisplays (): WidgetEVO[] {
        const widgets: WidgetEVO[] = Object.values(this._widgets);
        return widgets?.filter(w => {
            return w.type.toLocaleLowerCase().includes("display");
        });
    };
    /**
     * Gets a list of all display widgets loaded on the page.
     * @returns {BasicDisplay[]}
     * @memberof module:WidgetManager
     */
    getDisplayWidgets (): WidgetEVO[] {
        return this.getAllDisplays();
    };
    /**
     * Gets a list of all display widgets loaded on the page.
     * @returns {NumericDisplay[]}
     * @memberof module:WidgetManager
     */
    getNumericDisplayWidgets (): WidgetEVO[] {
        const widgets: WidgetEVO[] = Object.values(this._widgets);
        return widgets?.filter(w => {
            return w.type.toLocaleLowerCase().includes("numericdisplay");
        });
    };
    /**
     * Gets a list of all LED widgets loaded on the page.
     * @returns {LED[]}
     * @memberof module:WidgetManager
     */
    getLEDWidgets (): WidgetEVO[] {
        const widgets: WidgetEVO[] = Object.values(this._widgets);
        return widgets?.filter(w => {
            return w.type.toLocaleLowerCase().includes("led");
        });
    };
    /**
     * Gets a list of all button widgets loaded on the page.
     * @returns {Button[]}
     * @memberof WidgetManager
     */
    getButtonWidgets (): WidgetEVO[] {
        const widgets: WidgetEVO[] = Object.values(this._widgets);
        return widgets?.filter(w => {
            return w.type.toLocaleLowerCase().includes("button");
        });
    };
    /**
     * Gets a list of all button widgets loaded on the page.
     * @returns {TouchscreenButton[]}
     * @memberof WidgetManager
     */
    getTouchscreenButtonWidgets (): WidgetEVO[] {
        const widgets: WidgetEVO[] = Object.values(this._widgets);
        return widgets?.filter(w => {
            return w.type.toLocaleLowerCase().includes("button");
        });
    };
    /**
     * Gets a list of all button widgets loaded on the page.
     * @returns {TouchscreenDisplay[]}
     * @memberof WidgetManager
     */
    getTouchscreenDisplayWidgets (): WidgetEVO[] {
        const widgets: WidgetEVO[] = Object.values(this._widgets);
        return widgets?.filter(w => {
            return w.type.toLocaleLowerCase().includes("touchscreen");
        });
    };

    getAllTimers () {
        const widgets: WidgetEVO[] = Object.values(this._widgets);
        return widgets?.filter(w => {
            return w.type.toLocaleLowerCase().includes("timer");
        });
    };

    /**
     * Gets a list of all the widgets loaded on the page. The returned array contains all
     * widget types
     * @returns {Widget[]}
     * @memberof WidgetManager
     */
    getAllWidgets (): WidgetEVO[] {
        // return an array sorted by widget type
        return this.getDisplayWidgets()
            .concat(this.getNumericDisplayWidgets())
            .concat(this.getTouchscreenDisplayWidgets())
            .concat(this.getTouchscreenButtonWidgets())
            .concat(this.getButtonWidgets())
            .concat(this.getLEDWidgets());
    };

    /**
     * Returns a JSON object representing widget definitions for the currently open project
     * @memberof WidgetManager
     */
    getWidgetDefinitions () {
        const widgetMaps: string[] = [];
        const regionDefs = [];
        for (let id in this._widgets) {
            const widget: WidgetEVO = this._widgets[id];
            widgetMaps.push(JSON.stringify(widget.toJSON(), null, " "));
            const a = widget.imageMap();
            if (a) {
                var scaledCoords = a.attr("coords").split(",").map(function (c) {
                    return +c;
                }).join(",");
                regionDefs.push({
                    "class": a.attr("class"), 
                    shape: a.attr("shape"), 
                    coords: scaledCoords, 
                    href: a.attr("href")
                });
            }
        }
        return { widgetMaps, regionDefs };
    };
}