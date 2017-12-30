/**
 * @module BasicDisplayEVO
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
 // Example pvsio-web demo that uses BasicDisplayEVO
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
 require(["widgets/core/BasicDisplayEVO"], function (BasicDisplayEVO) {
      "use strict";
      var device = {};
      device.btnOk = new BasicDisplayEVO("btnOk", {
        top: 200, left: 120, height: 24, width: 120
      }, {
        softLabel: "Ok",
        fontColor: "black",
        backgroundColor: "blue",
        fontsize: 16,
        callback: function (err, data) { console.log("Ok button clicked"); console.log(data); }
      });
     device.btnOk.render(); // The touchscreen button is rendered.
 });
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */
define(function (require, exports, module) {
    "use strict";
    var WidgetEVO = require("widgets/core/WidgetEVO");

    /**
     * @function <a name="BasicDisplayEVO">BasicDisplayEVO</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget area.
     *        Default is { top: 0, left: 0, width: 32, height: 20 }.
     * @param opt {Object} Options:
     *          <li>blinking (bool): whether the button is blinking (default is false, i.e., does not blink)</li>
     *          <li>align (String): text align: "center", "right", "left", "justify" (default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is black, "transparent")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default is "steelblue")</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>displayKey (String): name of the state attribute defining the button label. Default is the ID of the widget.</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>visibleWhen (string): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     * @memberof module:BasicDisplayEVO
     * @instance
     */
     function BasicDisplayEVO(id, coords, opt) {
         coords = coords || {};
         opt = opt || {};
         // set widget type & display key
         this.type = this.type || "BasicDisplayEVO";
         this.displayKey = (typeof opt.displayKey === "string") ? opt.displayKey : id;

         // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
         opt.backgroundColor = opt.backgroundColor || "black";
         opt.cursor = opt.cursor || "default";

         // invoke WidgetEVO constructor to create the widget
         WidgetEVO.apply(this, arguments);
         return this;
     }
     BasicDisplayEVO.prototype = Object.create(WidgetEVO.prototype);
     BasicDisplayEVO.prototype.parentClass = WidgetEVO.prototype;
     BasicDisplayEVO.prototype.constructor = BasicDisplayEVO;

     /**
      * @function <a name="render">render</a>
      * @description Rendering function for button widgets.
      * @param state {Object} JSON object with the current value of the state attributes of the modelled system
      * @param opt {Object} Attributes characterising the visual appearance of the widget:
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
      * @memberof module:BasicDisplayEVO
      * @instance
      */
     BasicDisplayEVO.prototype.render = function (state, opt) {
         this.setStyle(opt);
         if (typeof state !== "object") {
             this.base.text(state);
         } else if (this.displayKey !== "" && this.evalViz(state)) {
             this.base.text(this.evaluate(this.displayKey, state));
         }
         this.reveal();
         return this;
     };

     /**
      * @function <a name="renderGlyphicon">renderGlyphicon</a>
      * @description Renders a glyphicon.
      * @param icon (String) Name of the glyphicon to be rendered, e.g., glyphicon-time. Glyphicon names are those of the bootstrap library (https://getbootstrap.com/docs/3.3/components/)
      * @param opt {Object} Attributes characterising the visual appearance of the widget:
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
      * @memberof module:BasicDisplayEVO
      * @instance
      */
     BasicDisplayEVO.prototype.renderGlyphicon = function (icon, opt) {
         this.setStyle(opt);
         if (icon) {
             this.base.classed("blink glyphicon " + icon, true).style("font-family", "");
         }
         this.reveal();
         return this;
     };


     module.exports = BasicDisplayEVO;
});
