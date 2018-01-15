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
      var device = {};
      device.btnOk = new ButtonEVO("btnOk", {
        top: 200, left: 120, height: 24, width: 120
      }, {
        softLabel: "Ok",
        fontColor: "black",
        backgroundColor: "blue",
        fontsize: 16,
        callback: function (err, data) { console.log("Ok button clicked"); console.log(data); }
      });
     device.btnOk.render(); // The touchscreen button is rendered.
     device.btnOk.click();  // Actions can be triggered programmatically. Clicking the button has the effect of sending a command "click_btnOk(<current state>)" to the PVSio-web back-end
 });
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, esnext: true */
/*global define */
define(function (require, exports, module) {
    "use strict";
    var Timer = require("util/Timer"),
        WidgetEVO = require("widgets/core/WidgetEVO"),
        ButtonHalo2 = require("widgets/ButtonHalo2"),
        ButtonActionsQueue = require("widgets/ButtonActionsQueue").getInstance(),
        widget_template = require("text!widgets/templates/button_widget_template.handlebars");

    const CLICK_RATE = 250; // 250 milliseconds, default interval for repeating button clicks when the button is pressed and held down
                             // going below 250ms may cause multiple unintended activations when pressing the button
    const DBLCLICK_TIMEOUT = 350; // 350 milliseconds, default timeout for detecting double clicks

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
     *          <li>softLabel (String): the button label (default is blank).</li>
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
     function ButtonEVO(id, coords, opt) {
         coords = coords || {};
         opt = opt || {};
         // set widget type
         this.type = this.type || "ButtonEVO";
         this.widget_template = opt.widget_template || widget_template;

         // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
         opt.backgroundColor = opt.backgroundColor || "transparent";
         opt.cursor = opt.cursor || "pointer";
         opt.zIndex = opt.zIndex || 1; // z-index for buttons should be at least 1, so they can be placed over display widgets
         this.style = this.style || {};
         this.style["overlay-color"] = opt.overlayColor || "steelblue";

         // invoke WidgetEVO constructor to create the widget
         WidgetEVO.apply(this, [ id, coords, opt ]);

         // add button-specific functionalities
         this.buttonReadback = opt.buttonReadback || "";
         this.toggleButton = opt.toggleButton;
         this.pushButton = opt.pushButton;
         this.softLabel = opt.softLabel || "";
         this.touchscreenMode = opt.touchscreenMode || false;
         this.keyCode = opt.keyCode;
         this.functionText = opt.functionText || id;
         this.customFunctionText = opt.customFunctionText;
         this.rate = (isNaN(parseFloat(opt.rate))) ? CLICK_RATE : Math.max(CLICK_RATE, parseFloat(opt.rate));
         this.dblclick_timeout = (isNaN(parseFloat(opt.dblclick_timeout))) ? DBLCLICK_TIMEOUT : Math.max(DBLCLICK_TIMEOUT, parseFloat(opt.rate));

         // associate relevant actions to the button
         opt.evts = opt.evts || "click";
         if (typeof opt.evts === "object" && opt.evts.length > 0) {
             this.evts = {};
             this.evts.click = (opt.evts.filter(function (evt) { return evt === "click"; }).length > 0);
             this.evts.dblclick = (opt.evts.filter(function (evt) { return evt === "dblclick"; }).length > 0);
             this.evts["press/release"] = (opt.evts.filter(function (evt) { return evt === "press/release"; }).length > 0);
         } else {
             this.evts = {
                 "press/release": (opt.evts === "press/release"),
                 "click": (opt.evts === "click"),
                 "dblclick": (opt.evts === "dblclick")
             };
         }

         // prepare timers necessary for executing press & hold actions
         var _this = this;
         this._timer = new Timer(this.rate);
         this.callback = opt.callback || function (err, res) { console.log("Warning: " + _this.id + " does not have a callback :/"); };
         if (!opt.callback) { this.callback(); }

         // install action handlers
         installHandlers(this);
         return this;
     }
     ButtonEVO.prototype = Object.create(WidgetEVO.prototype);
     ButtonEVO.prototype.parentClass = WidgetEVO.prototype;
     ButtonEVO.prototype.constructor = ButtonEVO;

     //-- Utility functions -----------------------
     function installHandlers(_this, opt) {
         opt = opt || {};
         function onButtonPress(_this) {
             if (_this.evts["press/release"]) {
                 _this.pressAndHold();
             } else if (_this.evts.click && !_this.touchscreenMode) {
                 _this.click();
             }
         }
         function onButtonRelease(_this) {
             if (_this.evts["press/release"]) {
                 _this.release();
             } else if (_this.evts.click && _this.touchscreenMode) {
                 _this.click();
             }
         }
         function onButtonDoubleClick(_this) {
             if (_this.evts.dblclick) {
                 _this.dblclick();
             }
         }
         _this.overlay.on("mouseover", function () {
             if (!(_this.toggleButton || _this.pushButton) || _this.isSelected) {
                 _this.select({ opacity: 0.4 });
             } else { _this.select({ opacity: 0.4, "background-color": "transparent" }); }
             _this.hover = true;
         }).on("mouseout", function () {
             if (!_this.isSelected) { _this.deselect(); }
             if (_this._tick) { onButtonRelease(_this); }
             _this.hover = false;
         }).on("mousedown", function () {
             if (_this.toggleButton || _this.pushButton) {
                 _this.isSelected = (_this.pushButton)? true : !_this.isSelected;
                 if (_this.isSelected) {
                     _this.select({ opacity: 0.6 });
                 } else { _this.deselect(); }
             }
             onButtonPress(_this);
         }).on("mouseup", function () {
             onButtonRelease(_this);
             if (_this.isSelected || (_this.hover && !_this.toggleButton)) {
                 _this.select({ opacity: 0.4 });
             } else { _this.deselect(); }
             // the following code is the dblclick handler
             if (_this.dblclick_timer) {
                 onButtonDoubleClick(_this);
                 clearInterval(_this.dblclick_timer);
                 _this.dblclick_timer = null;
             } else {
                 _this.dblclick_timer = setTimeout(function () {
                     _this.dblclick_timer = null;
                 }, _this.dblclick_timeout);
             }
         }).on("blur", function () {
             if (_this.isSelected || (_this.hover && !_this.toggleButton)) {
                 _this.select({ opacity: 0.4 });
             } else { _this.deselect(); }
             if (_this._tick) { onButtonRelease(_this); }
             _this.hover = false;
         });
         // bind key events
         if (_this.keyCode) {
             ButtonHalo2.getInstance().installKeypressHandler(_this, {
                 keyCode: _this.keyCode,
                 coords: { left: _this.left, top: _this.top, height: _this.height, width: _this.width },
                 evts: _this.evts,
                 noHalo: opt.noHalo
             });
         }
     }
     function btn_action(evt, _this, opt) {
         opt = opt || {};
         opt.callback = opt.callback || _this.callback;
         opt.functionText = opt.customFunctionText || _this.customFunctionText || (evt + "_" + _this.functionText);
         ButtonActionsQueue.queueGUIAction(opt.functionText, opt.callback);
         _this.deselect();
         console.log(opt.functionText);
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
     ButtonEVO.prototype.render = function (state) {
         if (this.evalViz(state)) {
             this.base.text(this.softLabel);
             this.reveal();
         }
         return this;
     };


     /**
      * @function click
      * @description API to simulate a click action on the button
      * @memberof module:ButtonEVO
      * @instance
      */
     ButtonEVO.prototype.click = function (opt) {
         btn_action("click", this, opt);
         return this;
     };

     /**
      * @function dblclick
      * @description API to simulate a double click action on the button
      * @memberof module:ButtonEVO
      * @instance
      */
     ButtonEVO.prototype.dblclick = function (opt) {
         btn_action("dblclick", this, opt);
         return this;
     };

     /**
      * @function press
      * @description API to simulate a single press action on the button
      * @memberof module:ButtonEVO
      * @instance
      */
     ButtonEVO.prototype.press = function (opt) {
         btn_action("press", this, opt);
         return this;
     };

     /**
      * @function pressAndHold
      * @description API to simulate a press & hold action on the button
      * @memberof module:ButtonEVO
      * @instance
      */
     ButtonEVO.prototype.pressAndHold = function (opt) {
         var _this = this;
         this._tick = function () {
             _this.press(opt);
         };
         this._timer.addListener("TimerTicked", function () {
             if (_this._tick) {
                 _this._tick();
             } else { console.err("Error in ButtonEVO: undefined handler for tick function."); }
         });
         _this.press(opt);
         this._timer.interval(_this.rate).start();
         return this;
     };

     /**
      * @function release
      * @description API to simulate a release action on the button
      * @memberof module:ButtonEVO
      * @instance
      */
     ButtonEVO.prototype.release = function (opt) {
         btn_action("release", this, opt);
         this._tick = null;
         this._timer.reset();
         return this;
     };

     module.exports = ButtonEVO;
});
