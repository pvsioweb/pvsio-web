/**
 * @module ButtonEVO
 * @version 1.0
 * @description Renders a customisable button.
 *              The button has two layers: one layer renders the visual appearance, the other layer captures user interactions with the widget.
 *              This module provide APIs for setting up the visual appearance of the button and the user interactions captured by the button.
 *              Note that the button can also be transparent and without label: this is useful for creating
 *              interactive areas over pictures of a user interface.
 * @author Paolo Masci
 * @date Dec 11, 2017
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses ButtonEVO
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: {
         d3: "../lib/d3",
         lib: "../lib",
         text: "../lib/text",
         stateParser: "./util/PVSioStateParser"
     }
 });
 require(["widgets/core/ButtonEVO"], function (ButtonEVO) {
      "use strict";
      let device = {};
      device.btnOk = new ButtonEVO("btnOk", {
        top: 200, left: 120, height: 24, width: 120
      }, {
        label: "Ok",
        fontColor: "black",
        backgroundColor: "blue",
        fontsize: 16,
        callback: function (err, data) { console.log("Ok button clicked"); console.log(data); }
      });
     device.btnOk.render(); // The button is rendered.
     device.btnOk.click();  // Actions can be triggered programmatically. Clicking the button has the effect of sending a command "click_btnOk(<current state>)" to the PVSio-web back-end
 });
 *
 */

import { Coords, BasicEvent, WidgetEVO, WidgetOptions } from "./WidgetEVO";
import { Timer } from "../../../../util/Timer"
import { ActionsQueue, ActionCallback } from "../ActionsQueue";
import { Connection } from "../../../../env/Connection";
import { dimColor } from "../../../../env/Utils";

const CLICK_RATE = 250; // 250 milliseconds, default interval for repeating button clicks when the button is pressed and held down
                            // going below 250ms may cause multiple unintended activations when pressing the button
const DBLCLICK_TIMEOUT = 350; // 350 milliseconds, default (and minimum) timeout for detecting double clicks


export type ButtonEvent = BasicEvent;
export type ButtonEventData = {
    evt: BasicEvent,
    fun: string // function to be invoked when a given event is triggered
};

export interface ButtonOptions extends WidgetOptions {
    toggleButton?: boolean,
    pushButton?: boolean,
    label?: string,
    readBack?: string,
    touchscreenMode?: boolean,
    keyCode?: string,
    evts?: BasicEvent | BasicEvent[],
    functionName?: string,
    customFunction?: string,
    rate?: number,
    dblclick_timeout?: number
}

export class ButtonEVO extends WidgetEVO {
    protected toggleButton: boolean;
    protected pushButton: boolean;
    protected touchscreenMode: boolean = false;

    protected rate: number;
    protected dblclick_timeout: number;
    protected dblclick_timer: NodeJS.Timer;
    protected _timer: Timer;
    protected callback: ActionCallback;
    protected _tick_listener: () => void;
    protected _tick: () => void;

    protected isSelected: boolean = false;
    protected hover: boolean = false;

    protected connection: Connection;

    /**
     * @function <a name="ButtonEVO">ButtonEVO</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget area.
     *        Default is { top: 0, left: 0, width: 32, height: 20 }.
     * @param opt {Object} Options:
     *          <li>blinking (bool): whether the button is blinking (default is false, i.e., does not blink)</li>
     *          <li>align (String): text align: "center", "right", "left", "justify" (default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is transparent)</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default is "steelblue")</li>
     *          <li>borderRadius (Number|String): border radius, must be a number or a valid HTML5 border radius, e.g., 2, "2px", etc. (default is 0, i.e., square border)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>buttonReadback (String): playback text reproduced with synthesised voice wheneven an action is performed with the button.</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>overlayColor (String): color of the semi-transparent overlay layer used indicating mouse over button, button pressed, etc (default is steelblue)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>position (String): standard HTML position attribute indicating the position of the widget with respect to the parent, e.g., "relative", "absolute" (default is "absolute")</li>
     *          <li>pushButton (Bool): if true, the visual aspect of the button resembles a push button, i.e., the button remains selected after clicking the button</li>
     *          <li>label (String): the button label (default is blank).</li>
     *          <li>dblclick_timeout (Number): timeout, in milliseconds, for detecting double clicks (default is 350ms)</li>
     *          <li>toggleButton (Bool): if true, the visual aspect of the button resembles a toggle button, i.e., the button remains selected after clicking the button</li>
     *          <li>visibleWhen (string): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     *                  The following additional attributes define which events are triggered when the button is activated:
     *          <li>evts (String|Array[String]): actions associated to the widget. Can be either "click", or "press/release" (default is "click").
     *                             Actions can be specified either as a string and using an array of strings (this is useful for backwards compatibility with old prototypes)
     *                             The function associated with the widget is given by the widget name prefixed with the action name.
     *                             In the case of "press/release", the widget is associated to two functions: press_<id> and release_<id>.</li>
     *          <li>customFunctionText (String): overrides the standard action name associated with click events.</li>
     *          <li>functionText (String): defines the action names associated with the widget.
     *                                     The indicated name is prefixed with the string indicated in opt.evts.</li>
     *          <li>keyCode (Number): binds the widget to keyboard keyCodes. Use e.g., http://keycode.info/, to see keyCodes</li>
     *          <li>rate (Number): interval, in milliseconds, for repeating button clicks when the button is pressed and held down (default is 250ms)</li>
     * @memberof module:ButtonEVO
     * @instance
     */
    constructor (id: string, coords: Coords, opt?: ButtonOptions) {
        super(id, coords, opt);

        opt = opt || {};
        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.type = opt.type || "button";
        this.style["background-color"] = opt.backgroundColor || "transparent";
        this.style["font-color"] = opt.fontColor || "black";
        this.style["font-size"] = opt.fontSize || 12;
        this.style["cursor"] = opt.cursor || "pointer";
        this.style["border-width"] = (!isNaN(parseFloat(`${opt.borderRadius}`))) ? `${parseFloat(`${opt.borderWidth}`)}[x]` : (opt.borderColor) ? "1px" : "0px";
        this.style["border-radius"] = (!isNaN(parseFloat(`${opt.borderRadius}`))) ? `${parseFloat(`${opt.borderRadius}`)}px` : "4px";
        this.style["z-index"] = opt.zIndex || 1; // z-index for buttons should be at least 1, so they are placed over display widgets
        this.style["overlay-color"] = opt.overlayColor || "steelblue";
        this.connection = opt.connection;

        // create the basic widget
        super.createHTMLElement();

        // add button-specific functionalities
        this.toggleButton = !!opt.toggleButton;
        this.pushButton = !!opt.pushButton;
        this.touchscreenMode = opt.touchscreenMode;
        this.rate = (isNaN(opt.rate)) ? CLICK_RATE : Math.max(CLICK_RATE, opt.rate);
        this.dblclick_timeout = (isNaN(opt.dblclick_timeout)) ? DBLCLICK_TIMEOUT : Math.max(DBLCLICK_TIMEOUT, opt.rate);

        // associate relevant actions to the button
        opt.evts = opt.evts || "click";
        if (typeof opt.evts === "object" && opt.evts?.length > 0) {
            this.evts = {};
            this.evts.click = (opt.evts.filter(function (evt) { return evt === "click"; }).length > 0);
            this.evts.dblclick = (opt.evts.filter(function (evt) { return evt === "dblclick"; }).length > 0);
            this.evts.press = (opt.evts.filter(function (evt) { return evt === "press"; }).length > 0);
            this.evts.release = (opt.evts.filter(function (evt) { return evt === "release"; }).length > 0);
        } else {
            this.evts = {
                press: (opt.evts === "press"),
                release: (opt.evts === "release"),
                click: (opt.evts === "click"),
                dblclick: (opt.evts === "dblclick")
            };
        }

        // prepare timers necessary for executing press & hold actions
        this._timer = new Timer(this.rate);
        this.callback = opt.callback || function (err, res) { console.warn("[button-widget] Warning: " + this.id + " does not have a callback :/"); };

        this._tick_listener = () => {
            if (this._tick) {
                this._tick();
            } else { console.error("Error in ButtonEVO: undefined handler for tick function."); }
        }

        // install action handlers
        this.installHandlers();

        // set widget keys
        this.attr.functionName = opt.functionName || id;
        this.attr.customFunction = opt.customFunction;
        this.attr.label = opt.label;
        // this.attr.readBack = opt.readBack;
        this.attr.keyCode = opt.keyCode;
    }

    protected getOverlayColor (): string {
        return this.style["background-color"] === "transparent" ? "steelblue" : this.style["background-color"];
    }

    protected installHandlers() {
        const onButtonPress = () => {
            if (this.evts.press) {
                this.pressAndHold();
            } else if (this.evts.click && !this.touchscreenMode) {
                this.click();  // mechanical buttons register a click when the button is pressed
            }
        };
        const onButtonRelease = () => {
            if (this.evts.release) {
                this.release();
            } else if (this.evts.click && this.touchscreenMode) {
                this.click();  // touchscreen buttons register a click when the button is released
            }
        };
        const onButtonDoubleClick = () => {
            if (this.evts.dblclick) {
                this.dblclick();
            }
        };

        const onMouseOver = () => {
            if ((this.toggleButton || this.pushButton) && this.isSelected) {
                this.select({ opacity: 0.8, backgroundColor: this.getOverlayColor() });
            } else {
                this.select({ opacity: 0.4, backgroundColor: this.getOverlayColor() }); 
            }
            this.hover = true;
        };
        const onMouseDown = () => {
            onButtonPress();
            this.isSelected = this.pushButton ? true 
                : this.toggleButton ? !this.isSelected
                    : true;
            if (this.isSelected) {
                this.select({ opacity: 0.8, backgroundColor: dimColor(this.getOverlayColor()) });
            } else { this.deselect(); }
        };
        const onMouseUp = () => {
            onButtonRelease();
            this.isSelected = this.pushButton ? true
                : this.toggleButton ? this.isSelected
                    : false;
            if (this.isSelected) {
                this.select({ opacity: 0.8, backgroundColor: this.getOverlayColor() });
            } else {
                if (this.hover) {
                    onMouseOver();
                } else {
                    this.deselect(); 
                }
            }
            // the following code is the dblclick handler
            if (this.dblclick_timer) {
                onButtonDoubleClick();
                clearInterval(this.dblclick_timer);
                this.dblclick_timer = null;
            } else {
                this.dblclick_timer = setTimeout(() => {
                    this.dblclick_timer = null;
                }, this.dblclick_timeout);
            }
        };
        const onBlur = () => {
            if (this.isSelected || (this.hover && !this.toggleButton)) {
                this.select({ opacity: 0.8, backgroundColor: this.getOverlayColor() });
            } else { this.deselect(); }
            if (this._tick) { onButtonRelease(); }
            this.hover = false;
        };
        const onMouseOut = () => {
            if (!this.isSelected) { this.deselect(); }
            if (this._tick) { onButtonRelease(); }
            this.hover = false;
        };

        // bind mouse events
        this.overlay.on("mouseover", () => {
            onMouseOver();
        }).on("mouseout", () => {
            onMouseOut();
        }).on("mousedown", () => {
            onMouseDown();
        }).on("mouseup", () => {
            onMouseUp();
        }).on("blur", () => {
            onBlur();
        });

        // bind key events
        if (this.attr.keyCode) {
            $(document).on("keydown", (event: JQuery.Event) => {
                onMouseDown();
            });
            $(document).on("keyup", (event: JQuery.Event) => {
                onMouseUp();
            });
        }
    }

    protected btn_action(evt: ButtonEvent, opt?: { functionName?: string, customFunction?: string, callback?: ActionCallback }) {
        opt = opt || {};
        const callback: ActionCallback = opt.callback || this.callback;
        const fun: string = opt.customFunction || this.attr.customFunction || (evt + "_" + this.attr.functionName);
        ActionsQueue.queueGUIAction(fun, this.connection, callback);
        this.deselect();
        const data: ButtonEventData = { evt, fun };
        this.trigger(evt, data);
        console.log(fun);
    }
    

    /**
     * @function <a name="render">render</a>
     * @description Rendering function for button widgets.
     * @param state {Object|String} Information to be rendered
     * @param opt {Object} Style options overriding the style attributes used when the widget was created.
     *                     The override style options are temporary, i.e., they are applied only for the present invocation of the render method.
     *                     Available options are either html style attributes or the following widget attributes:
     *          <li>align (String): text align: "center", "right", "left", "justify" (default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is black, "transparent")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default is "steelblue")</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     * @memberof module:ButtonEVO
     * @instance
     */
    render (state?: string | number | {}, opt?: ButtonOptions): void {
        // set style
        opt = opt || {};
        // handle options that need units
        opt["font-size"] = (opt.fontSize || this.style["font-size"]) + "px";
        opt["border-width"] = (opt.borderWidth) ? opt.borderWidth + "px" : this.style["border-width"];
        this.setStyle({ ...this.style, ...opt });

        // render content
        state = (state === undefined || state === null)? "" : state;
        // a fixed label is shown if any is specified, otherwise the provided value is displayed
        if (typeof state === "string" || typeof state === "number") {
            const label: string = this.attr["label"] || `${state}`;
            this.base.text(label);
            this.reveal();
        } else if (typeof state === "object" && this.attr?.displayName !== "" && this.evalViz(state)) {
            const label: string = this.attr["label"] || this.evaluate(this.attr.displayName, state);
            this.base.text(label);
            this.reveal();
        } else {
            this.hide();
        }
    }

    /**
     * @function <a name="renderSample">renderSample</a>
     * @description Version of the render function that demonstrates the functionalities of the widget.
     * @memberof module:ButtonEVO
     * @instance
     */
    renderSample (): void {
        this.render();
    }

    getDescription (): string {
        return `Button widget, a semi-transparent element that captures user interactions with physical buttons.
            Click events are registered when the button is pressed.`;
    }


    /**
     * @function <a name="click">click</a>
     * @description API to simulate a click action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    click (opt?) {
        this.btn_action("click", opt);
        return this;
    }

    /**
     * @function <a name="dblclick">dblclick</a>
     * @description API to simulate a double click action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    dblclick (opt?) {
        this.btn_action("dblclick", opt);
        return this;
    }

    /**
     * @function <a name="press">press</a>
     * @description API to simulate a single press action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    press (opt?) {
        this.btn_action("press", opt);
        return this;
    }

    /**
     * @function <a name="pressAndHold">pressAndHold</a>
     * @description API to simulate a press & hold action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    pressAndHold (opt?) {
        this._tick = () => {
            this.press(opt);
        };
        this._timer.addListener("TimerTicked", this._tick_listener);
        this.press(opt);
        this._timer.interval(this.rate).start();
        return this;
    }

    /**
     * @function <a name="release">release</a>
     * @description API to simulate a release action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    release (opt?) {
        this.btn_action("release", opt);
        this._tick = null;
        this._timer.reset();
        this._timer.removeListener("TimerTicked", this._tick_listener);
        return this;
    }

}