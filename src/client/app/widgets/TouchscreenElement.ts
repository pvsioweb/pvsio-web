/**
 * @module TouchscreenButton
 * @version 2.0
 * @description Renders a touchscreen button. The button label is static, and defined when the button is created.
 *              This module provide APIs for setting up user interactions captured by the button,
 *              as well as the visual appearance of the button.
 *              Note that the button can also be transparent and without label: this is useful for creating
 *              interactive areas over pictures of a user interface.
 * @author Paolo Masci
 * @date May 24, 2015
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses TouchscreenButton
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: {
         d3: "../lib/d3",
         lib: "../lib"
     }
 });
 require(["widgets/TouchscreenButton"], function (TouchscreenButton) {
      "use strict";
      var device = {};
      device.touchscreenOk = new TouchscreenButton("touchscreenOk", {
        top: 200, left: 120, height: 24, width: 120
      }, {
        softLabel: "Ok",
        fontColor: "black",
        backgroundColor: "blue",
        fontsize: 16,
        callback: function (err, data) { console.log("Ok button clicked"); console.log(data); }
      });
     device.touchscreenOk.render(); // The touchscreen button is rendered. Clicking the button has the effect of sending a command "click_touchscreenOk(<current state>)" to the pvs back-end
 });
 *
 */

import { Recorder } from '../util/ActionRecorder';
import { ButtonHalo2 } from './ButtonHalo2';

const Timer = require("util/Timer");
const ButtonActionsQueue = require("widgets/ButtonActionsQueue");

import { NumericDisplay } from './NumericDisplay';
import { WidgetCoordinates } from './Widget';

export class TouchscreenElement extends NumericDisplay {
    protected btnClass: string;
    functionText: string;
    protected customFunctionText: string;

    protected evts: string[];
    protected buttonReadback: string;
    protected toggleButton: boolean;
    protected pushButton: boolean;

    protected softLabel: string;
    protected keyCode: string;
    protected keyName: string;

    protected btnTimer;
    protected timerTickFunction: () => void;
    protected recallRate: number;

    protected hover: boolean = false;
    protected isPressed: boolean = false;
    protected isSelected: boolean = false;

    protected callback: () => void;
    protected animation: () => void;


    /**
     * @function <a name="TouchscreenButton">TouchscreenButton</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 32, height: 20 }.
     * @param opt {Object} Options:
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
     *          <li>blinking (bool): whether the button blinks (default is false, i.e., does not blink)</li>
     *          <li>borderWidth (Number): border width (default is 0, i.e., no border, unless option borderColor has been specified -- in this case, the border is 2px)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid" (default is "none")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default color used in the widget is "black")</li>
     *          <li>buttonReadback (String): playback text reproduced with synthesised voice wheneven an action is performed with the button.</li>
     *          <li>customFunctionText (String): custom PVS function to be associated with button actions.</li>
     *          <li>displayKey (String): name of the state attribute defining the display content. This information will be used by the render method. Default is the ID of the display.</li>
     *          <li>evts (Array[String]): events triggered by the widget. Can be either "click", or "press/release" (default is "click").
     *                                    The PVS function associated with the widget is given by the widget name prefixed with the event name.
     *                                    In the case of "press/release", the widget is associated to two PVS functions,
     *                                    one modelling the button being pressed, the other modelling the button being released.</li>
     *          <li>fontfamily (String): font type (default is "sans-serif")</li>
     *          <li>fontsize (Number): font size (default is 0.8 * height)</li>
     *          <li>fontfamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>functionText (String): option for overriding the default binding with PVS functions.
     *                                     Note that this option requires the specification of the full name of the PVS function (e.g., click_ok).</li>
     *          <li>keyCode (Number): binds the widget to keyboard keyCodes. Use e.g., http://keycode.info/, to see keyCodes</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>pushButton (Bool): if true, the visual aspect of the button resembles a push button, i.e., the button remains selected after clicking the button</li>
     *          <li>softLabel (String): the button label (default is blank).
     *          <li>toggleButton (Bool): if true, the visual aspect of the button resembles a toggle button, i.e., the button remains selected after clicking the button</li>
     *          <li>visibleWhen (string): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     * @memberof module:TouchscreenButton
     * @instance
     */
    constructor (id: string, coords: WidgetCoordinates, opt) {
        super(id, coords, opt);
        this.type = "touchscreenbutton";

        this.cursor = opt.cursor || "pointer";
        this.btnClass = opt.btnClass || "primary";

        this.functionText = opt.functionText || id;
        this.customFunctionText = opt.customFunctionText;
        this.evts = opt.evts || [ "click" ];

        this.keyCode = opt.keyCode || "";
        this.keyName = opt.keyName || "";

        this.buttonReadback = opt.buttonReadback;
        this.toggleButton = opt.toggleButton;
        this.pushButton = opt.pushButton;


        this.callback = opt.callback;
        this.animation = opt.animation;

        this.recallRate = opt.recallRate || 250;
        this.evts = opt.evts || ["click"];

        //define timer for sensing hold down actions on buttons
        this.btnTimer = new Timer(250);
        this.btnTimer.addListener('TimerTicked', () => {
            if (this.timerTickFunction) {
                this.timerTickFunction();
            }
        });

        ButtonHalo2.installKeypressHandler(this, {
            keyCode: opt.keyCode,
            coords: { left: this.left, top: this.top, height: this.height, width: this.width },
            evts: opt.evts,
            noHalo: opt.noHalo
        });

        this.displayKey = opt.displayKey || id;

        $(`#${this.id}`).on("mouseover", () => {
            if (!(this.toggleButton || this.pushButton)) {
                this.select();
            }
            this.hover = true;
        }).on("mouseout", () => {
            if (!this.isSelected) {
                this.deselect();
            }
            if (this.isPressed && this.evts && this.evts[0] === "press/release") {
                this.release();
            }
            this.hover = false;
        })// -- the following events will eventually be replaced by taphold and release
        .on("mousedown", this.mouseDown)
        .on("mouseup", this.mouseUp);

        // this.mtouch = mtouchEvents()
        //     .on("taphold", function (d) {
        //         console.log("taphold");
        //         mousedown_handler();
        //     }).on("release", function (d) {
        //         console.log("release");
        //         mouseup_handler();
        //     });
        // d3.select("#" + id + "_overlayDisplay").call(this.mtouch);

        this.softLabel = opt.softLabel || "";
        this.example = opt.example || "btn";
    }

    mouseDown (): void {
        if (this.backgroundColor !== "transparent") {
            this.setColors({
                backgroundColor: "black",
                fontColor: "white"
            });
        }
        if (this.evts && this.evts[0] === "press/release") {
            this.pressAndHold();
        }
        if (this.toggleButton || this.pushButton) {
            this.isSelected = (this.pushButton)? true : !this.isSelected;
            if (this.isSelected) {
                this.select();
            } else {
                this.deselect();
            }
        }
    }
    mouseUp (): void {
        if (this.backgroundColor !== "transparent") {
            this.setColors({
                backgroundColor: this.backgroundColor,
                fontColor: this.fontColor,
                opacity: this.opacity
            });
        }
        if (this.evts && this.evts[0] === "press/release") {
            this.release();
        } else {
            this.click();
        }
        if (this.isSelected || (this.hover && !this.toggleButton)) {
            this.select();
        } else {
            this.deselect();
        }
    }

    /**
     * @function release
     * @description API to simulate a release action on the button
     * @memberof module:Button
     */
    release (opt?: { animation?: () => void, callback?: () => void }): void {
        this.isPressed = false;

        opt = opt || {};
        const anim = opt.animation || this.animation;
        opt.callback = opt.callback || this.callback;

        ButtonActionsQueue.queueGUIAction("release_" + this.functionText, opt.callback);
        if (anim) { anim(); }
        Recorder.addAction({
            id: this.id,
            functionText: this.functionText,
            action: "release",
            ts: new Date().getTime()
        });
        this.mouseUp();
        this.deselect();
    };

    /**
     * @function press
     * @description API to simulate a single press action on the button
     * @memberof module:Button
     */
    press (opt?: { animation?: () => void, callback?: () => void }): void {
        this.isPressed = true;

        opt = opt || {};
        const anim = opt.animation || this.animation;
        opt.callback = opt.callback || this.callback;

        ButtonActionsQueue.queueGUIAction("press_" + this.functionText, opt.callback);
        if (anim) { anim(); }
        Recorder.addAction({
            id: this.id,
            functionText: this.functionText,
            action: "press",
            ts: new Date().getTime()
        });

    };

    /**
     * @function pressAndHold
     * @description API to simulate a continuous press action on the button
     * @memberof module:Button
     */
    pressAndHold (opt?: { animation?: () => void, callback?: () => void }): void {
        opt = opt || {};
        const anim = opt.animation || this.animation;
        opt.callback = opt.callback || this.callback;

        this.press(opt);
        this.timerTickFunction = () => {
            ButtonActionsQueue.queueGUIAction("press_" + this.functionText, opt.callback);
            anim();
            //record action
            Recorder.addAction({
                id: this.id,
                functionText: this.functionText,
                action: "press",
                ts: new Date().getTime()
            });
        };
        this.btnTimer.interval(this.recallRate).start();
    };

    /**
     * @function click
     * @description API to simulate a click action on the button
     * @memberof module:Button
     */
    click (opt?: { animation?: () => void, callback?: () => void, functionText?: string }): void {
        opt = opt || {};
        const anim = opt.animation || this.animation;
        opt.callback = opt.callback || this.callback;
        const functionText: string = this.customFunctionText || opt.functionText || `click_${this.functionText}`;
        ButtonActionsQueue.getInstance().queueGUIAction(functionText, opt.callback);

        if (anim) { anim(); }
        Recorder.addAction({
            id: this.id,
            functionText: this.functionText,
            action: "click",
            ts: new Date().getTime()
        });
        if (this.buttonReadback && this.buttonReadback !== "") {
            // Speaker.speak(this.buttonReadback);
        }

        if ((this.toggleButton || this.pushButton) && this.isSelected) {
            this.select();
        } else {
            this.deselect();
        }
    };

    /**
     * @function <a name="select">select</a>
     * @description Selects the widget -- useful to highlight the widget programmaticaly.
     * @param opt {Object} Options:
     *          <li>backgroundColor (String): background color when the button is selected. Overrides the default background color of the widget.</li>
     *          <li>borderColor (String): border color when the button is selected. Overrides the default border color of the widget.</li>
     *          <li>classed (String): CSS style to be assigned to the widget to customise its visual appearance.
     *                                The CSS stylesheet needs to be included in the html file of the pvsio-web prototype.</li>
     * @memberof module:TouchscreenButton
     * @instance
     */
    select (opt?: { backgroundColor?: string, borderColor?: string, classed?: string }): void {
        opt = opt || {};
        const color: string = opt.backgroundColor || this.backgroundColor;
        if (color === "transparent" || this.opacity < 0.4 ) {
            this.setColors({ backgroundColor: dimColor("steelblue"), opacity: 0.4 });
        } else {
            this.setColors({ backgroundColor: dimColor(color) });
        }
        if (opt.borderColor) {
            this.div.css("border", "solid 2px " + opt.borderColor);
        }
        if (opt.classed) {
            this.div.addClass(opt.classed);
        }
    };

    /**
     * @function <a name="deselect">deselect</a>
     * @description Deselects the widget -- useful to highlight the widget programmaticaly.
     * @memberof module:TouchscreenButton
     * @instance
     */
    deselect (): void {
        this.setColors({
            backgroundColor: this.backgroundColor,
            fontColor: this.fontColor,
            opacity: this.opacity
        });
        this.div.css("border", "");
    };


    boundFunctions (): string {
        let res: string = "";
        if (this.evts) {
            if (this.evts.length === 1 && this.evts[0] === "custom") {
                res = this.customFunctionText;
            } else {
                res = this.evts.map((d) => {
                    if (d.indexOf("/") > -1) {
                        return d.split("/").map((a) => {
                            return a + "_" + this.functionText;
                        }).join(", ");
                    } else {
                        return d + "_" + this.functionText;
                    }
                }).join(", ");
            }
        }
        return res;
    };


    /**
     * @function <a name="toJSON">toJSON</a>
     * @description Returns a serialised version of the widget in JSON format.
     *              This is useful for saving/loading a specific instance of the widget.
     *              In the current implementation, the following attributes are included in the JSON object:
     *              <li> type (string): widget type, i.e., "touchscreenbutton" in this case
     *              <li> id (string): the unique identifier of the widget instance
     *              <li> softLabel (string): the label of the button
     *              <li> evts (array of strings): the type of events generated by the button (click, press/release)
     *              <li> fontsize (string): the font size of the button
     *              <li> fontColor (string): the font color of the button
     *              <li> backgroundColor (string): the background color of the button
     *              <li> boundFunctions (string): the name of the command that will be sent to the pvs back-end when the button is pressed.
     *              <li> visibleWhen (string): a booloan expression defining when the condition under which the widget is visible
     *              <li> auditoryFeedback (string): whether auditory feedback is enabled
     * @returns JSON object
     * @memberof module:TouchscreenButton
     * @instance
     */
    toJSON (): {
        id: string, type: string, evts?: string[], 
        recallRate?: number, displayKey?: string,
        functionText?: string, customFunctionText?: string, 
        boundFunctions?: string, softLabel?: string,
        fontSize?: number, fontColor?: string, backgroundColor?: string, 
        buttonReadback?: string, keyCode?: string, keyName?: string, visibleWhen?: string
    } {
        return {
            type: this.type,
            id: this.id,
            evts: this.evts,
            displayKey: this.displayKey,
            functionText: this.functionText,
            customFunctionText: this.customFunctionText,
            boundFunctions: this.boundFunctions(),
            buttonReadback: this.buttonReadback,
            keyCode: this.keyCode,
            keyName: this.keyName,
            visibleWhen: this.visibleWhen,
            softLabel: this.softLabel,
            fontSize: this.fontSize,
            fontColor: this.fontColor,
            backgroundColor: this.backgroundColor,
            recallRate: this.recallRate
        };
    };

    /**
     * @function <a name="render">render</a>
     * @param data {Object} JSON object representing the touchscreen button to be rendered.
     * @param opt {Object} Override options for the display style, useful to dynamically change the display style during simulations. Available options include:
     *              <li> fontsize (string): the font size of the display
     *              <li> fontColor (string): the font color of the display
     *              <li> backgroundColor (string): the background color of the display
     *              <li> blinking (Bool): true means the text is blinking
     * @memberof module:TouchscreenButton
     * @instance
     */
    render (state: string, opt?:{ visibleWhen?: string, blinking?: boolean }) {
        // state is used to check whether the button is visible/enabled
        // the expression visibleWhen() is the condition we need to check on the state
        opt = opt || {};
        const visibleWhen: string = opt.visibleWhen || this.visibleWhen;
        const isVisible = this.isVisible({ visibleWhen });
        if (isVisible) {
            if (this.div.css("display") === "none" || !opt.blinking) {//} || (opt.blinking && !this.div.selectAll("div").classed("blink"))) {
                super.render(this.softLabel, opt);
            }
            this.reveal();
            return this.reveal();
        }
        return this.hide();
    };
    renderSample (opt?: { txt?: string }): void {
        opt = opt || {};
        var txt = opt.txt || this.softLabel;
        return this.render(txt, { visibleWhen: "true" });
    };


    // TouchscreenButton.prototype.renderGlyphicon = function (icon, opt) {
    //     opt = opt || {};
    //     var button = document.getElementById(this.id + "_button");
    //     this.txt = icon;
    //     button.setAttribute("class", "glyphicon " + icon + " btn btn-" + this.btnClass + " center");
    //     button.style.width = this.width;
    //     button.style.height = this.height;
    //     button.style.fontSize = 0.8 * this.height + "px";
    //     button.textContent = opt.txt || this.txt;
    //     d3.select("#" + this.id + "_button").style("display", "block");
    //     return this.reveal();
    // };

}
