/**
 * @module NumericDisplayEVO
 * @version 1.0
 * @description Renders a Numeric Display with a cursor that can be used to highlight digits.
                Digits can be either numeric or alphanumeric characters.
                The visibility of the decimal point is enhanced by making it bigger and aligned towards the middle of the line height.
                The font of integer digits is slightly bigger than that of fractional digits.
                All digits are evenly spaced, and the exact spacing can be set and controlled programmatically.
 * @author Paolo Masci
 * @date Dec 11, 2017
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses NumericDisplayEVO
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: { d3: "../lib/d3", text: "../lib/text" }
 });
 require(["widgets/core/NumericDisplayEVO"], function (NumericDisplayEVO) {
      "use strict";
      var disp = new NumericDisplayEVO("disp", {
        top: 200, left: 120, height: 24, width: 120
      }, {
        fontColor: "black",
        fontsize: 16,
        backgroundColor: "blue"
      });
     disp.render("BN-32.5"); // The display shows BN-32.5
 });
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, esnext:true */
/*global define */
define(function (require, exports, module) {
    "use strict";
    var BasicDisplayEVO = require("widgets/core/BasicDisplayEVO"),
        digits_template = require("text!widgets/templates/digits_template.handlebars");

    const selectedFontSize = 1.076; // ratio selectedFont/normalFont for integer digits

    /**
     * @function <a name="NumericDisplayEVO">NumericDisplayEVO</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget area.
     *        Default is { top: 0, left: 0, width: 32, height: 20 }.
     * @param opt {Object} Style options defining the visual appearance of the widget.
     *                     Options can be given either as standard html style attributes or using the following widget attributes:
     *          <li>blinking (bool): whether the button is blinking (default is false, i.e., does not blink)</li>
     *          <li>align (String): text align: "center", "right", "left", "justify" (default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is black, "transparent")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default is "steelblue")</li>
     *          <li>borderRadius (Number|String): border radius, must be a number or a valid HTML5 border radius, e.g., 2, "2px", etc. (default is 0, i.e., square border)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>decimalPointOffset (Number): offset for the decimal point position (default is 0, i.e., the decimal point is placed at the center of the display)</li>
     *          <li>decimalFontSize (Number): decimal font size (default is opt.fontSize * 0.8)</li>
     *          <li>decimalLetterSpacing (Number): fixed letter spacing for decimal digits (default: opt.decimalFontSize * 0.8).</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>decimalFontSize (Number): font size for the decimal part of numbers (default is opt.fontSize * 0.8 )</li>
     *          <li>letterSpacing (Number): fixed letter spacing (default: opt.fontSize * 0.8).</li>
     *          <li>maxIntegerDigits (Number): max digits of the whole part of the display (default is Math.floor(0.75 * coords.width / opt.letterSpacing)).</li>
     *          <li>maxDecimalDigits (Number): max digits of the fractional part of the display (default is Math.floor(0.25 * coords.width / opt.decimalLetterSpacing)).</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>position (String): standard HTML position attribute indicating the position of the widget with respect to the parent, e.g., "relative", "absolute" (default is "absolute")</li>
     *          <li>visibleWhen (String): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     *                  The following additional attribute links the display widget to a specific state attribute of a model:
     *          <li>displayKey (String): name of the state attribute defining the display content. Default is the ID of the widget.</li>
     * @memberof module:NumericDisplayEVO
     * @instance
     */
     function NumericDisplayEVO(id, coords, opt) {
         coords = coords || {};
         opt = this.normaliseOptions(opt);
         // set widget type
         this.type = this.type || "NumericDisplayEVO";
         this.cursorName = opt.cursorName || "";
         // invoke BasicDisplayEVO constructor to create the widget
         BasicDisplayEVO.apply(this, [ id, coords, opt ]);
         // add widget-specific style attributes
         this.style["letter-spacing"] = opt.letterSpacing || parseFloat(this.style["font-size"]) * 0.8;
         this.style["decimal-font-size"] = opt.decimalFontSize || parseFloat(this.style["font-size"]) * 0.8;
         this.style["decimal-letter-spacing"] = opt.decimalLetterSpacing || parseFloat(this.style["decimal-font-size"]) * 0.8;
         this.maxIntegerDigits = (isNaN(parseInt(opt.maxIntegerDigits))) ? Math.floor(0.75 * this.width / parseFloat(this.style["letter-spacing"])) : parseInt(opt.maxIntegerDigits);
         this.maxDecimalDigits = (isNaN(parseInt(opt.maxDecimalDigits))) ? Math.floor(0.25 * this.width / parseFloat(this.style["decimal-letter-spacing"])) : parseInt(opt.maxDecimalDigits);
         this.decimalPointOffset = opt.decimalPointOffset || 0;
         return this;
     }
     NumericDisplayEVO.prototype = Object.create(BasicDisplayEVO.prototype);
     NumericDisplayEVO.prototype.parentClass = BasicDisplayEVO.prototype;
     NumericDisplayEVO.prototype.constructor = NumericDisplayEVO;

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
      *          <li>borderRadius (Number|String): border radius, must be a number or a valid HTML5 border radius, e.g., 2, "2px", etc. (default is 0, i.e., square border)</li>
      *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
      *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
      *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
      *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
      *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
      *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
      *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
      * @memberof module:NumericDisplayEVO
      * @instance
      */
     NumericDisplayEVO.prototype.render = function (state, opt) {
         if (state) {
             // set style
             opt = this.normaliseOptions(opt);
             opt = this.normaliseOptions(opt);
             opt["background-color"] = opt.backgroundColor || this.style["background-color"];
             opt["font-size"] = (opt.fontSize || this.style["font-size"]) + "pt";
             opt["font-family"] = opt.fontFamily || this.style["font-family"];
             opt.color = opt.fontColor || this.style.color;
             opt["text-align"] = opt.align || this.style["text-align"];
             opt["border-width"] = (opt.borderWidth) ? opt.borderWidth + "px" : this.style["border-width"];
             opt["border-style"] = opt.borderStyle || this.style["border-style"];
             opt["border-radius"] = (isNaN(parseFloat(opt.borderRadius))) ? this.style["border-radius"] : opt.borderRadius;
             opt["border-color"] = opt.borderColor || this.style["border-color"];
             this.setStyle(opt);

             // set content
             if (typeof state === "string") {
                 var val = state;
                 state = {};
                 state[this.displayKey] = val;
             }
             if (typeof state === "object" && this.evalViz(state)) {
                 var disp = this.evaluate(this.displayKey, state);
                 var parts = disp.split(".");
                 var _this = this;

                 var desc = {
                     whole: [], frac: [],
                     point: (disp.indexOf(".") >= 0),
                     whole_zeropadding: [], frac_zeropadding: [],
                     max_integer_digits: this.maxIntegerDigits,
                     max_decimal_digits: this.maxDecimalDigits
                 };
                 desc.whole = parts[0].split("").map(function (d) {
                     return { val: d, selected: false, "font-size": parseFloat(_this.style["font-size"]) };
                 });
                 if (parts.length > 1) {
                     desc.frac = parts[1].split("").map(function (d) {
                         return { val: d, selected: false, "font-size": parseFloat(_this.style["decimal-font-size"]) };
                     });
                 }
                 desc.cursorPos = parseInt(this.evaluate(this.cursorName, state));
                 if (!isNaN(desc.cursorPos)) {
                     if (desc.cursorPos >= 0) {
                         if (desc.cursorPos < desc.whole.length) {
                             desc.whole[desc.whole.length - 1 - desc.cursorPos].selected = true;
                             desc.whole[desc.whole.length - 1 - desc.cursorPos].fontSize *= selectedFontSize;
                         } else { // introduce leding zeros
                             desc.whole_zeropadding = new Array(desc.cursorPos - (desc.whole.length - 1)).fill({
                                 val: 0, selected: false, "font-size": parseFloat(_this.style["font-size"])
                             });
                             desc.whole_zeropadding[0] = {
                                 val: 0, selected: true, "font-size": parseFloat(_this.style["font-size"]) * selectedFontSize
                             };
                         }
                     } else if (desc.cursorPos < 0) {
                         if (-(desc.cursorPos + 1) < desc.frac.length) {
                             desc.frac[-(desc.cursorPos + 1)].selected = true;
                         } else { // introduce trailing zeros and introduce the decimal point
                             desc.frac_zeropadding = new Array(-desc.cursorPos - desc.frac.length).fill({
                                 val: 0, selected: false, "font-size": parseFloat(_this.style["decimal-font-size"])
                             });
                             desc.frac_zeropadding[desc.frac_zeropadding.length - 1] = {
                                 val: 0, selected: true, "font-size": parseFloat(_this.style["decimal-font-size"])
                             };
                             desc.point = true;
                         }
                     }
                 }
                //  console.log(desc);
                 var point_style = {
                     "left": (parseFloat(desc.max_integer_digits) * parseFloat(this.style["letter-spacing"]) + parseFloat(this.decimalPointOffset)).toFixed(2),
                     "width": (parseFloat(this.style["letter-spacing"]) / 2).toFixed(2),
                     "margin-left": (-parseFloat(this.style["letter-spacing"]) / 32).toFixed(2),
                     "font-size": parseFloat(this.style["decimal-font-size"]).toFixed(2),
                     "viz": desc.point
                 };
                 var whole_style = {
                     "digits": desc.whole_zeropadding.concat(desc.whole),
                     "width": parseFloat(desc.max_integer_digits) * parseFloat(this.style["letter-spacing"]),
                     "left": parseFloat(point_style.left) - parseFloat(point_style.width),
                     "letter-spacing": parseFloat(this.style["letter-spacing"]).toFixed(2),
                     "color": this.style.color,
                     "background-color": this.style["background-color"],
                     "padding-left": ((parseFloat(desc.max_integer_digits) - parseFloat(desc.whole.length) - parseFloat(desc.whole_zeropadding.length)) * parseFloat(this.style["letter-spacing"])).toFixed(2)
                 };
                 var frac_style = {
                     "digits": desc.frac.concat(desc.frac_zeropadding),
                     "width": (parseFloat(desc.max_decimal_digits) * parseFloat(this.style["decimal-letter-spacing"])).toFixed(2),
                     "left": (parseFloat(point_style.left) + parseFloat(point_style.width)).toFixed(2),
                     "letter-spacing": parseFloat(this.style["decimal-letter-spacing"]).toFixed(2),
                     "color": this.style.color,
                     "background-color": this.style["background-color"]
                 };
                //  console.log(frac_style);
                 frac_style.viz = (frac_style.digits.length > 0);
                 var dom = Handlebars.compile(digits_template, { noEscape: true })({
                     type: this.type,
                     whole: whole_style,
                     frac: frac_style,
                     point: point_style
                 });
                 this.base.html(dom);
             }
         }
         this.reveal();
         return this;
     };

     module.exports = NumericDisplayEVO;
});
