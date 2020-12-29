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

import { Coords, BasicEvent, WidgetEVO, WidgetOptions, WidgetAttr, CSS, BasicEventData } from "./WidgetEVO";
import { Timer } from "../../../../util/Timer"
import { ActionsQueue, ActionCallback } from "../../../../env/ActionsQueue";
import { Connection } from "../../../../env/Connection";
import { mouseButtons } from "../../../../env/Utils";

const CLICK_RATE = 250; // 250 milliseconds, default interval for repeating button clicks when the button is pressed and held down
                            // going below 250ms may cause multiple unintended activations when pressing the button
const DBLCLICK_TIMEOUT = 350; // 350 milliseconds, default (and minimum) timeout for detecting double clicks

export interface ButtonOptions extends WidgetOptions {
    customLabel?: string,
    readBack?: string,
    keyCodes?: string, // comma-separated list of keycodes. first keycode is key down, second is key up
    evts?: BasicEvent | BasicEvent[],
    buttonName?: string,
    customFunction?: string,
    rate?: number,
    dblclick_timeout?: number
};

export interface ButtonAttr extends WidgetAttr {
    buttonName: string,
    customFunction: string,
    customLabel: string,
    keyCodes: string
};

export class ButtonEVO extends WidgetEVO {
    protected attr: ButtonAttr;

    protected lineHeight: number;

    protected rate: number;
    protected dblclick_timeout: number;
    protected dblclick_timer: NodeJS.Timer;
    protected _timer: Timer;
    protected callback: ActionCallback;
    protected _tick_listener: () => void;
    protected _tick: () => void;

    // flags
    protected hoverFlag: boolean = false;
    protected mouseDownFlag: boolean = false;

    protected dragStart: { top: number, left: number };
    protected touchStart: { top: number, left: number };

    protected connection: Connection;

    constructor (id: string, coords: Coords, opt?: ButtonOptions) {
        super(id, coords, opt);

        opt = opt || {};
        opt.css = opt.css || {};

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.type = opt.type || "button";
        this.css["background-color"] = opt.css["background-color"] || "transparent";
        this.css.color = opt.css.color || "white";
        this.css["cursor"] = opt.css.cursor || "pointer";
        this.css["z-index"] = opt.css["z-index"] || 1; // z-index for buttons should be at least 1, so they are placed over display widgets
        // this.css.halo = opt.css.halo || "steelblue";
        this.lineHeight = parseFloat(opt.css["line-height"]) || this.height;

        this.connection = opt.connection;

        // create the basic widget
        // super.createHTMLElement();

        // add button-specific functionalities
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

        // set widget keys
        this.attr.buttonName = opt.buttonName || id;
        this.attr.customFunction = opt.customFunction || "";
        this.attr.customLabel = opt.customLabel || "";
        // this.attr.readBack = opt.readBack;
        this.attr.keyCodes = opt.keyCodes;

        // install action handlers
        // this.installHandlers();
    }

    protected installHandlers() {
        // bind mouse events
        this.$overlay.on("mouseover", (evt: JQuery.MouseOverEvent) => {
            this.hoverFlag = true;
            this.onMouseOver(evt);
        }).on("mouseout", (evt: JQuery.MouseOutEvent) => {
            this.hoverFlag = false;
            this.onMouseOut(evt);
        }).on("mousedown", (evt: JQuery.MouseDownEvent) => {
            this.mouseDownFlag = true;
            if (evt.button === mouseButtons.left) {
                this.onMouseDown(evt);
                // add mousemove event listener so we can handle drag events
                this.dragStart = {
                    top: evt.pageY || 0,
                    left: evt.pageX || 0
                };
                this.$overlay.on("mousemove", (evt: JQuery.MouseMoveEvent) => {
                    this.onMouseMove(evt);
                });
                // we need to attach the listener to the document, otherwise the event is cancelled when the mouse exits the div of the button
                $(document).on("mousemove", (evt: JQuery.MouseMoveEvent) => {
                    this.onMouseDrag(evt);
                });
                $(document).on("mouseup", (evt: JQuery.MouseUpEvent) => {
                    this.dragStart = null;
                    this.mouseDownFlag = false;
                });
            }
        }).on("mouseup", (evt: JQuery.MouseUpEvent) => {
            this.mouseDownFlag = false;
            if (evt.button === mouseButtons.left) {
                this.onMouseUp(evt);
            }
        }).on("blur", (evt: JQuery.BlurEvent) => {
            this.hoverFlag = false;
            this.onBlur(evt);
        });

        // add touch events, so the button is mobile device friendly
        $(document).on("touchstart", (evt: JQuery.TouchStartEvent) => {
            if (this.hoverFlag) {
                console.log("touchstart");
                if (evt.changedTouches?.length) {
                    this.touchStart = {
                        top: evt.changedTouches[0].pageY || 0,
                        left: evt.changedTouches[0].pageX || 0
                    };
                }
            }
        });
        $(document).on("touchmove", (evt: JQuery.TouchMoveEvent) => {
            if (this.hoverFlag) {
                this.onMouseDrag(evt);
            }
        });
        $(document).on("touchend", (evt: JQuery.TouchEndEvent) => {
            this.touchStart = null;
        });

        // bind key events
        if (this.attr.keyCodes) {
            const codes: string[] = this.attr?.keyCodes?.split(",").map((key: string) => {
                return key.trim();
            }).filter((key:string) => {
                return key !== "";
            });
            if (codes?.length > 0) {
                $(document).on("keydown", (evt: JQuery.KeyDownEvent) => {
                    this.touchStart = null;
                    this.dragStart = null;
                    if (codes.includes(evt.key)) {
                        this.onKeyDown(evt);
                    }
                });
                $(document).on("keyup", (evt: JQuery.KeyUpEvent) => {
                    this.touchStart = null;
                    this.dragStart = null;
                    if (codes.includes(evt.key)) {
                        this.onKeyUp(evt);
                    }
                });
            }
        }
    }

    protected onKeyDown (evt?: JQuery.KeyDownEvent): void {
        this.onMouseDown();
    }

    protected onKeyUp (evt?: JQuery.KeyUpEvent): void {
        this.onMouseUp();
    }

    protected onButtonPress (): void {
        if (this.evts.press) {
            this.pressAndHold();
        } else if (this.evts.click) {
            this.click();  // mechanical buttons emit click events when the button is pressed
        }
    };
    protected onButtonRelease (): void {
        if (this.evts.release) {
            this.release();
        }
    };
    protected onButtonDoubleClick (): void {
        if (this.evts.dblclick) {
            this.dblclick();
        }
    };
    protected onMouseMove (evt?: JQuery.MouseMoveEvent): void {
        // do nothing, this function will be overridden by derived classes
    }
    protected onMouseDrag (evt?: JQuery.MouseMoveEvent | JQuery.TouchMoveEvent): void {
        // do nothing, this function will be overridden by derived classes
    }
    protected onMouseOver (evt?: JQuery.MouseOverEvent): void {
        this.select();
    };
    protected onMouseOut (evt?: JQuery.MouseOutEvent): void {
        this.deselect();
        if (this._tick) { this.onButtonRelease(); }
    };
    protected onMouseDown (evt?: JQuery.MouseDownEvent): void {
        this.onButtonPress();
        this.select({ "background-color": this.css["background-color"] });
    };
    protected onMouseUp (evt?: JQuery.MouseUpEvent): void {
        this.onButtonRelease();
        if (this.hoverFlag) {
            this.onMouseOver();
        } else {
            this.deselect(); 
        }
        // the following code is the dblclick handler
        if (this.dblclick_timer) {
            this.onButtonDoubleClick();
            clearInterval(this.dblclick_timer);
            this.dblclick_timer = null;
        } else {
            this.dblclick_timer = setTimeout(() => {
                this.dblclick_timer = null;
            }, this.dblclick_timeout);
        }
    };
    protected onBlur (evt?: JQuery.BlurEvent): void {
        this.deselect();
        if (this._tick) { this.onButtonRelease(); }
    };

    protected btn_action(evt: BasicEvent, opt?: { buttonName?: string, customFunction?: string, callback?: ActionCallback }) {
        opt = opt || {};

        const fun: string = opt.customFunction || this.attr.customFunction || (evt + "_" + this.attr.buttonName);
        const callback: ActionCallback = opt.callback || this.callback;
        ActionsQueue.queueGUIAction(fun, this.connection, callback);
        
        const data: BasicEventData = { evt, fun };
        this.trigger(evt, data);
        console.log(fun);
    }
    
    // @override
    getAttributes (opt?: { nameReplace?: string, keyCode?: boolean, optionals?: string[] }): WidgetAttr {
        opt = opt || {};
        opt.optionals = opt.optionals || [];
        opt.optionals = opt.optionals.concat([ "customFunction", "customLabel", "keyCode" ]);
        return super.getAttributes(opt);
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
    render (state?: string | number | {}, opt?: CSS): void {
        super.render();
        // set style
        opt = opt || {};
        this.setCSS({ ...this.css, ...opt });

        // set line height so text is vertically centered
        this.$base.css("line-height", `${this.lineHeight}px`);

        // render content
        state = (state === undefined || state === null) ? "" : state;

        // a fixed label is shown if any is specified, otherwise the provided value is displayed
        if (this.attr.customLabel || typeof state === "string" || typeof state === "number") {
            const label: string = this.attr.customLabel || `${state}`;
            this.$base.html(label);
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
            Click events are emitted when the button is pressed.`;
    }


    /**
     * @function <a name="click">click</a>
     * @description API to simulate a click action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    click (opt?: ButtonOptions): void {
        this.btn_action("click", opt);
    }

    /**
     * @function <a name="dblclick">dblclick</a>
     * @description API to simulate a double click action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    dblclick (opt?: ButtonOptions): void {
        this.btn_action("dblclick", opt);
    }

    /**
     * @function <a name="press">press</a>
     * @description API to simulate a single press action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    press (opt?: ButtonOptions): void {
        this.btn_action("press", opt);
    }

    /**
     * @function <a name="pressAndHold">pressAndHold</a>
     * @description API to simulate a press & hold action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    pressAndHold (opt?: ButtonOptions): void {
        this._tick = () => {
            this.press(opt);
        };
        this._timer.addListener("TimerTicked", this._tick_listener);
        this.press(opt);
        this._timer.interval(this.rate).start();
    }

    /**
     * @function <a name="release">release</a>
     * @description API to simulate a release action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    release (opt?: ButtonOptions): void {
        this.btn_action("release", opt);
        this._tick = null;
        this._timer.reset();
        this._timer.removeListener("TimerTicked", this._tick_listener);
    }

}