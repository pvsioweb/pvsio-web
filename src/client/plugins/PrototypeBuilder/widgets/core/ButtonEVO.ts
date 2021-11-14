/**
 * Renders a customisable button.
 * @author Paolo Masci
 */

import { WidgetEvent, WidgetEVO, WidgetAttr, WidgetEventData, WidgetAttrX, MatchState, rat2real, ratNumberMatch } from "./WidgetEVO";
import { Connection, PVSioWebCallBack, SendCommandToken } from "../../../../common/interfaces/Connection";
import { mouseButtons } from "../../../../common/utils/pvsiowebUtils";
import { Coords, WidgetOptions, CSS, Renderable } from "../../../../common/interfaces/Widgets";

const CLICK_RATE = 250; // 250 milliseconds, default interval for repeating button clicks when the button is pressed and held down
                            // going below 250ms may cause multiple unintended activations when pressing the button
const DBLCLICK_TIMEOUT = 350; // 350 milliseconds, default (and minimum) timeout for detecting double clicks

export interface ButtonOptions extends WidgetOptions {
    customLabel?: string,
    readBack?: string,
    keyCodes?: string, // space-separated list of keycodes. first keycode is key down, second is key up
    evts?: WidgetEvent | WidgetEvent[],
    actions?: string, // space-separated list of actions, this is an alternative way to specify evts. NOTE: actions overwrites events, specify only one of the two fields.
    buttonName?: string,
    customFunction?: string,
    rate?: number,
    dblclick_timeout?: number
};

export const buttonEvents: WidgetEvent[] = [
    WidgetEvent.click,
    WidgetEvent.dblclick,
    WidgetEvent.press,
    WidgetEvent.release
];

export interface ButtonAttr extends WidgetAttr {
    buttonName: string,
    customFunction: string,
    customLabel: string,
    keyCodes: string
};

export class ButtonEVO extends WidgetEVO {
    static readonly constructorName: string = "ButtonEVO";
    getConstructorName (): string {
        return ButtonEVO.constructorName;
    }

    protected attr: ButtonAttr;

    protected lineHeight: number;

    protected interval: number;
    protected dblclick_timeout: number;
    protected dblclick_timer: NodeJS.Timer;
    protected _timer: NodeJS.Timer;
    protected callback: PVSioWebCallBack;
    protected _tick_listener: () => void;
    protected _tick: () => void;

    // flags
    protected hoverFlag: boolean = false;
    protected mouseDownFlag: boolean = false;
    protected wasDownFlag: boolean = false;

    protected dragStart: { top: number, left: number };
    protected touchStart: { top: number, left: number };

    protected connection: Connection;

    constructor (id: string, coords: Coords, opt?: ButtonOptions) {
        super(id, coords, opt);
        this.kind = "Button";
        
        opt = opt || {};
        opt.css = opt.css || {};

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css["background"] = opt.css.background || opt.css["background-color"] || "transparent";
        this.css.color = opt.css.color || "white";
        this.css["cursor"] = opt.css.cursor || "pointer";
        this.css["z-index"] = opt.css["z-index"] || 1; // z-index for buttons should be at least 1, so they are placed over display widgets
        this.lineHeight = parseFloat(opt.css["line-height"]) || this.height;

        this.connection = opt.connection;

        // create the basic widget
        // super.createHTMLElement();

        // add button-specific functionalities
        this.interval = (isNaN(opt.rate)) ? CLICK_RATE : Math.max(CLICK_RATE, opt.rate);
        this.dblclick_timeout = (isNaN(opt.dblclick_timeout)) ? DBLCLICK_TIMEOUT : Math.max(DBLCLICK_TIMEOUT, opt.rate);

        // associate relevant actions to the button
        opt.evts = opt.evts || WidgetEvent.click;
        this.evts = {};
        if (opt.actions && opt.actions) {
            this.setActions(opt.actions);
        } else if (opt.evts) {
            if (typeof opt.evts === "object" && opt.evts?.length > 0) {
                for (let i in WidgetEvent) {
                    this.evts[i] = (opt.evts.filter((evt) => { return evt === i; }).length > 0);
                }
            } else {
                for (let i in WidgetEvent) {
                    this.evts[i] = (opt.evts === i);
                }
            }
        }

        // prepare timers necessary for executing press & hold actions
        this._timer = null;
        this.callback = opt.callback || ((err, res) => { console.warn("[button-widget] Warning: " + this.id + " does not have a callback :/"); });

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
        this.attr.actions = this.getActions();

        // install action handlers
        // this.installHandlers();
    }

    /**
     * Returns the space-separated list of actions this widget listens to
     */
    getActions (): string {
        const ans: string[] = [];
        for (let i in WidgetEvent) {
            if (this.evts[i]) {
                ans.push(i);
            }
        }
        return ans.join(" ");
    }

    /**
     * Stores a new set of actions
     */
    setActions (actions: string): void {
        if (actions) {
            const acts: string[] = actions.split(" ");
            for (let i in WidgetEvent) {
                this.evts[i] = acts.includes(i);
            }
        }
    }

    /**
     * Internal function, installs relevant event handlers
     */
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
            this.wasDownFlag = true;
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

        // add touch events, so the widget is mobile-device friendly
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
            const codes: string[] = this.attr?.keyCodes?.split(" ").map((key: string) => {
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
    /**
     * Internal function, handles button press events
     */
    protected onButtonPress (): void {
        if (this.evts.press) {
            this.pressAndHold();
        } else if (this.evts.click) {
            this.click();  // mechanical buttons emit click events when the button is pressed
        }
    };
    protected onButtonRelease (): void {
        this.wasDownFlag = false;
        if (this.evts.release) {
            this.release();
        }
        if (this.evts.click && this.evts.press) {
            this.click();  // if press event is active, then the click event should be emitted when the button is released
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
        if (this.wasDownFlag && this._tick) {
            this.onButtonRelease();
        } else {
            this.clearTimer();
        }
    };
    protected onMouseDown (evt?: JQuery.MouseDownEvent): void {
        // the handlers is enabled as long as the mouse is over the button
        if (this.hoverFlag) {
            this.onButtonPress();
            this.select({ "background": this.css["background"] });
        }
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

    protected btn_action(evt: WidgetEvent, opt?: { buttonName?: string, customFunction?: string, callback?: PVSioWebCallBack }) {
        opt = opt || {};

        const action: string = opt.customFunction || this.attr.customFunction || (evt + "_" + this.attr.buttonName);
        const callback: PVSioWebCallBack = opt.callback || this.callback;

        const req: SendCommandToken = {
            id: this.id,
            type: "sendCommand",
            command: action
        };
        this.connection?.sendRequest("sendCommand", req);
        if (callback) {
            this.connection?.onRequest("sendCommand", (err, res) => {
                callback(err, res);
            });
        }
        // ActionsQueue.queueGUIAction(fun, this.id, this.connection, callback);
        
        const data: WidgetEventData = { evt, fun: action };
        this.trigger(evt, data);
        console.log(data);
    }
    
    // @override
    getAttributes (opt?: { keyCode?: boolean, optionals?: string[] }): WidgetAttr {
        opt = opt || {};
        opt.optionals = opt.optionals || [];
        opt.optionals = opt.optionals.concat([ "customFunction", "customLabel", "keyCode" ]);
        return super.getAttributes(opt);
    }

    /**
     * Overrides the default widget function, to add hints for "actions"
     */
     getAttrX (opt?: { keyCode?: boolean, optionals?: string[] }): WidgetAttrX {
        opt = opt || {};
        opt.optionals = opt.optionals || [];
        opt.optionals = opt.optionals.concat([ "customFunction", "customLabel", "keyCode" ]);
        const attrx: WidgetAttrX = super.getAttrX(opt);
        if (attrx) {
            attrx.actions = {
                val: attrx.actions.val,
                hints: buttonEvents
            };
        }
        return attrx;
    }

    /**
     * Render the button
     */
    render (state?: Renderable, opt?: ButtonOptions): void {
        opt = opt || {};
        // console.log(`[ButtonEVO] rendering state`, state);
        // create the html element
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();

        // a fixed label is rendered if any is specified
        if (this.attr?.customLabel) {
            this.$base.html(this.attr.customLabel);
        } else if (state !== undefined && state !== null) {
            // check if the state contains a field named after the widget
            if (this.matchStateFlag) {
                const name: string = this.getName();
                const match: MatchState = (typeof state === "string") ?
                    this.matchState(state, name)
                        : { name, val: state[name] };
                if (match) {
                    // check if this is a rational number -- don't use directly rat2real 
                    // because the state may be a string that resembles a number, e.g., "2.", 
                    // and rat2real would translate it into number 2 (i.e., the '.' gets removed, 
                    // which is not what we want for non-numeric displays)
                    const matchRat: RegExpMatchArray = new RegExp(ratNumberMatch).exec(match.val);
                    if (matchRat) {
                        const val: number = rat2real(match.val);
                        const disp: string = isNaN(val) ? `${match.val}` : `${val}`;
                        this.$base.html(disp);
                    } else {
                        this.$base.html(match.val);
                    }
                    // const name: string = this.getName();
                    // console.log(`[BasicDisplay] ${name} render`, state);
                }
            } else {
                // render string or number
                this.$base.html(`${state}`);
            }
        }
    }

    /**
     * Internal function, updates the display style
     */
    protected updateDisplayStyle (opt?: CSS): void {
        opt = opt || {};
        this.applyCSS({ ...this.css, ...opt });
        // set line height so text is vertically centered
        this.$base.css("line-height", `${this.lineHeight}px`);
    }

    /**
     * Set a new value for a given attribute.
     * @overrides the default widget function, to take into account updated actions
     */
    setAttr (attr: WidgetAttr): void {
        attr = attr || {};
        for (const key in attr) {
            if (key === "actions") {
                this.setActions(attr[key])
            } else {
                // store style info
                this.attr[key] = attr[key];
            }
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
        return `Creates transparent hotspot areas over button widgets.
            Click events are emitted when the button is pressed.`;
    }


    /**
     * @function <a name="click">click</a>
     * @description API to simulate a click action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    click (opt?: ButtonOptions): void {
        this.btn_action(WidgetEvent.click, opt);
    }

    /**
     * @function <a name="dblclick">dblclick</a>
     * @description API to simulate a double click action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    dblclick (opt?: ButtonOptions): void {
        this.btn_action(WidgetEvent.dblclick, opt);
    }

    /**
     * @function <a name="press">press</a>
     * @description API to simulate a single press action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    press (opt?: ButtonOptions): void {
        this.btn_action(WidgetEvent.press, opt);
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
        this.clearTimer();
        this._timer = setInterval(() => {
            if (this.hoverFlag && this.mouseDownFlag) {
                this._tick_listener();
            } else {
                this.clearTimer();
            }
        }, this.interval);
        this.press(opt);
    }

    /**
     * Internal function, resets this._timer
     */
    protected clearTimer (): void {
        clearInterval(this._timer);
        this._timer = null;
    }

    /**
     * @function <a name="release">release</a>
     * @description API to simulate a release action on the button
     * @memberof module:ButtonEVO
     * @instance
     */
    release (opt?: ButtonOptions): void {
        this.btn_action(WidgetEvent.release, opt);
        this.clearTimer();
    }

}