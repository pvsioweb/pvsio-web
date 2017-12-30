/**
 * @module WidgetEVO
 * @version 1.0
 * @description Base class for EVO widgets.
 * @author Paolo Masci
 * @date Dec 11, 2017
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, esnext: true */
/*global define */
define(function (require, exports, module) {
    "use strict";
    var d3 = require("d3/d3");
    var StateParser = require("util/PVSioStateParser"),
        widget_template = require("text!widgets/templates/generic_widget_template.handlebars");
    const MAX_COORDINATES_ACCURACY = 3; // max 3 decimal digits for coordinates

    /**
     * @function <a name="ButtonEVO">ButtonEVO</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget.
     * @param opt {Object} Options:
     *          <li>blinking (bool): whether the button is blinking (default is false, i.e., does not blink)</li>
     *          <li>align (String): text align: "center", "right", "left", "justify" (default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is "transparent")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default is "steelblue")</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>functionText (String): defines the action names associated with the widget.
     *                                     The indicated name is prefixed with the string indicated in opt.evts.</li>
     *          <li>keyCode (Number): binds the widget to keyboard keyCodes. Use e.g., http://keycode.info/, to see keyCodes</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is 0.9, i.e., semi-opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>pushButton (Bool): if true, the visual aspect of the button resembles a push button, i.e., the button remains selected after clicking the button</li>
     *          <li>softLabel (String): the button label (default is blank).
     *          <li>toggleButton (Bool): if true, the visual aspect of the button resembles a toggle button, i.e., the button remains selected after clicking the button</li>
     *          <li>visibleWhen (string): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     */
    function WidgetEVO(id, coords, opt) {
        opt = opt || {};
        this.id = id;
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = (isNaN(parseFloat(coords.width))) ? 32 : coords.width;
        this.height = (isNaN(parseFloat(coords.height))) ? 32 : coords.height;
        this.zIndex = opt.zIndex || 0;
        this.blinking = opt.blinking || false;
        this.opacity = (isNaN(parseFloat(opt.opacity))) ? 0.9 : opt.opacity;
        this.visibleWhen = opt.visibleWhen || "true"; // default: always enabled/visible
        this.widget = true; // this flag can be used to identify whether an object is a widget

        // visual style
        opt.borderRadius = (opt.borderRadius) ?
                                ((typeof opt.borderRadius === "string" && opt.borderRadius.indexOf("px") >= 0) ? opt.borderRadius : opt.borderRadius.toString() + "px")
                                : 0;
        opt.borderStyle = (opt.borderStyle) ? opt.borderStyle : (opt.borderRadius || opt.borderWidth) ? "solid" : "none";
        opt.borderWidth = (!isNaN(parseFloat(opt.borderWidth))) ? opt.borderWidth : (opt.borderColor) ? 2 : 0;
        this.style = this.style || {};
        this.style["background-color"] = opt.backgroundColor || "transparent";
        this.style["font-size"] = (opt.fontSize || opt.fontsize || (this.height - opt.borderWidth) / 2) + "pt";
        this.style["font-family"] = opt.fontFamily || opt.fontfamily || "sans-serif";
        this.style.color = opt.fontColor || opt.fontcolor || "white";
        this.style["text-align"] = opt.align || "center";
        this.style["border-width"] = opt.borderWidth + "px";
        this.style["border-style"] = opt.borderStyle;
        this.style["border-radius"] = opt.borderRadius;
        this.style["border-color"] = opt.borderColor || "steelblue";
        this.style.opacity = this.opacity;

        this.cursor = opt.cursor || "default";

        this.widget_template = this.widget_template || widget_template;
        var res = Handlebars.compile(this.widget_template, { noEscape: true })(this);
        if (!d3.select(this.parent).node()) { console.error("Error: " + this.parent + " does not exist. Widget '" + id + "' cannot be attached to DOM :(("); }

        d3.select(this.parent).append("div").html(res);
        this.div = d3.select("#" + this.id);
        this.base = d3.select("#" + this.id + "_base");
        this.overlay = d3.select("#" + this.id + "_overlay");
        this.setStyle(this.style);

        this.hide();
        return this;
    }

    /**
     * @function <a name="render">render</a>
     * @description Basic rendering function (reveals the widget). Widgets need to override this function when rendering involves additional/different logic.
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.render = function (res) {
        return this.reveal();
    };

    /**
     * @function <a name="reveal">reveal</a>
     * @description Reveals the widget
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.reveal = function () {
        if (this.div && this.div.node()) {
            this.div.style("display", "block");
        }
        return this;
    };

    /**
     * @function <a name="hide">hide</a>
     * @description Hides the widget
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.hide = function () {
        if (this.div && this.div.node()) {
            this.div.style("display", "none");
        }
        return this;
    };

    /**
     * @function <a name="move">move</a>
     * @description Changes the position of the widget according to the coordinates given as parameter.
     * @param coords {Object} Coordinates indicating the new position of the widget. The coordinates are given in the form { top: (number), left: (number) }
     * @param opt {Object}
     *         <li> duration (Number): duration in milliseconds of the move transition (default is 0, i.e., instantaneous) </li>
     *         <li> transitionTimingFunction (String): HTML5 timing function (default is "ease-out") </li>
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.move = function (coords, opt) {
        // console.log(coords);
        if (this.div && this.div.node()) {
            coords = coords || {};
            opt = opt || {};
            opt.duration = opt.duration || 0;
            opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-out";
            this.top = (isNaN(parseFloat(coords.top))) ? this.top : parseFloat(parseFloat(coords.top).toFixed(MAX_COORDINATES_ACCURACY));
            this.left = (isNaN(parseFloat(coords.left))) ? this.left : parseFloat(parseFloat(coords.left).toFixed(MAX_COORDINATES_ACCURACY));
            this.div.transition().duration(opt.duration).style("top", this.top + "px").style("left", this.left + "px")
                        .style("transition-timing-function", opt.transitionTimingFunction);
        }
        return this.reveal();
    };

    /**
     * @function <a name="rotate">rotate</a>
     * @description Rotates the widget of the degree given as parameter.
     * @param deg {Number | String} Degrees by which the widget will be rotated. Positive degrees are for clock-wise rotations, negative degrees are for counter-clock-wise rotations.
     * @param opt {Object}
     *         <li> duration (Number): duration in milliseconds of the move transition (default is 0, i.e., instantaneous) </li>
     *         <li> transitionTimingFunction (String): HTML5 timing function (default is "ease-in") </li>
     *         <li> transformOrigin (String): rotation pivot, e.g., "top", "bottom", "center" (default is "center") </li>
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.rotate = function (deg, opt) {
        if (this.div && this.div.node()) {
            deg = (isNaN(parseFloat(deg))) ? 0 : parseFloat(deg);
            opt = opt || {};
            opt.duration = opt.duration || 0;
            opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-in";
            opt.transformOrigin = opt.transformOrigin || "center";
            this.div.transition().duration(opt.duration)
                        .style("transform", "rotate(" + deg + "deg)")
                        .style("transform-origin", opt.transformOrigin)
                        .style("transition-timing-function", opt.transitionTimingFunction);
        }
        return this.reveal();
    };

    /**
     * @function <a name="remove">remove</a>
     * @description Removes the div elements of the widget from the html page -- useful to programmaticaly remove widgets from a page.
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.remove = function () {
        if (this.div && this.div.node()) {
            this.div.remove();
        }
        return this;
    };

    /**
     * @function <a name="evalViz">evalViz</a>
     * @description Evaluates the visibility of the widget based on the state attrbutes (passed as function parameter) and the expression stored in this.visibleWhen
     * @param state {Object} JSON object with the current value of the state attributes of the modelled system
     * @return {bool} true if the state attributes indicate widget visible, otherwise false.
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.evalViz = function (state) {
        var vizAttribute = true;
        if (state && typeof state === "object") {
            vizAttribute = false;
            var expr = StateParser.simpleExpressionParser(this.visibleWhen);
            if (expr && expr.res) {
                if (expr.res.type === "constexpr" && expr.res.constant === "true") {
                    vizAttribute = true;
                } else if (expr.res.type === "boolexpr" && expr.res.binop) {
                    var str = StateParser.resolve(state, expr.res.attr);
                    if (str) {
                        str = StateParser.evaluate(str);
                        if ((expr.res.binop === "=" && str === expr.res.constant) ||
                             (expr.res.binop === "!=" && str !== expr.res.constant)) {
                                 vizAttribute = true;
                        }
                    }
                }
            }
        }
        return vizAttribute;
    };

    /**
     * @function <a name="evaluate">evaluate</a>
     * @description Evaluates the visibility of the widget based on the state attrbutes (passed as function parameter) and the expression stored in this.visibleWhen
     * @param attr {String} Name of the state attribute to be evaluated
     * @param state {Object} JSON object with the current value of the state attributes of the modelled system
     * @return {String} Text representing the current evaluation of the state attribute associated with the widget
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.evaluate = function (attr, state) {
        if (attr && state && typeof state === "object") {
            var disp = StateParser.resolve(state, attr);
            if (disp) {
                return StateParser.evaluate(disp).replace(new RegExp("\"", "g"), "");
            } else {
                console.log("Warning: WidgetEVO.evaluate could not find state attribute " + attr + " requested by " + this.id);
            }
        }
        return "";
    };


    /**
     * @function <a name="getVizExpression">getVizExpression</a>
     * @description Returns the expression defining the visibility of the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.getVizExpression = function () {
        return this.visibleWhen;
    };


    /**
     * @function <a name="setStyle">setStyle</a>
     * @description Sets the font color and background color.
     * @param style {Object} Set of valid HTML5 attributes characterising the visual appearance of the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.setStyle = function (style) {
        for(var key in style) {
            this.base.style(key, style[key]);
        }
        return this;
    };
    /**
     * @function <a name="invertColors">invertColors</a>
     * @description Inverts the colors of the display (as in a negative film).
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.invertColors = function () {
        this.base.style("background-color", this.style["font-color"]);
        this.base.style("color", this.style["background-color"]);
        return this;
    };

    /**
     * @function <a name="select">select</a>
     * @description Selects the widget -- useful to highlight the widget programmaticaly.
     * @param style {Object} Set of valid HTML5 attributes characterising the visual appearance of the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.select = function (opt) {
        opt = opt || {};
        opt.opacity = (isNaN(parseFloat(opt.opacity))) ? 0.5 : opt.opacity;
        this.setStyle(opt);
        if (opt.overlayColor) { this.overlay.style("background-color", opt.overlayColor); }
        if (opt.classed) { this.base.classed(opt.classed, true); }
        var borderColor = opt.borderColor || this.style["border-color"];
        // the following is for enhancing visibility of the selected areas
        this.div.style("border", "solid 2px");
        this.div.style("border-radius", this.style["border-radius"]);
        this.div.style("border-color", borderColor);
        return this.reveal();
    };

    /**
     * @function <a name="deselect">deselect</a>
     * @description Deselects the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.deselect = function () {
        this.div.style("border", "");
        this.div.style("border-radius", "");
        this.div.style("border-color", "");
        this.overlay.style("background-color", this.style["overlay-color"]);
        this.setStyle(this.style);
        return this.reveal();
    };

    /**
     * @function <a name="getPosition">getPosition</a>
     * @description Returns the position of the widget
     * @return {Object} Coordinates of the widget, in the form { left: x, top: y }, where x and y are real numbers
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.getPosition = function () {
        return { left: this.left, top: this.top };
    };

    /**
     * @function <a name="getSize">getSize</a>
     * @description Returns the size of the widget
     * @return {Object} Size of the widget, in the form { width: x, height: y }, where x and y are real numbers
     * @memberof module:WidgetEVO
     * @instance
     */
    WidgetEVO.prototype.getSize = function () {
        return { width: this.width, height: this.height };
    };


    module.exports = WidgetEVO;
});
