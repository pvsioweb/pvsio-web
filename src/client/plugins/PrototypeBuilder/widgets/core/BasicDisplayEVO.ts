/**
 * @module BasicDisplayEVO
 * @version 1.0
 * @description Renders a digital display for rendering text.
 *              This module provide APIs for setting up the visual appearance of the widget, e.g., font size and color.
 * @author Paolo Masci
 * @date Dec 11, 2017
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses BasicDisplayEVO
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: { d3: "../lib/d3", text: "../lib/text" }
 });
 require(["widgets/core/BasicDisplayEVO"], function (BasicDisplayEVO) {
      "use strict";
      var disp = new BasicDisplayEVO("disp", {
        top: 200, left: 120, height: 24, width: 120
      }, {
        fontColor: "black",
        fontsize: 16,
        backgroundColor: "blue"
      });
      disp.render("Hello World!"); // The display shows Hello World!
 });
 *
 */

import { Coords, WidgetEVO, WidgetOptions, CSS, WidgetAttr } from "./WidgetEVO";

export interface DisplayOptions extends WidgetOptions {
    displayName?: string
};

export interface DisplayAttr extends WidgetAttr {
    displayName: string
};

export class BasicDisplayEVO extends WidgetEVO {
    protected attr: DisplayAttr;

    /**
     * @function <a name="BasicDisplayEVO">BasicDisplayEVO</a>
     * @description Constructor.
     * @augments WidgetEVO
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
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>position (String): standard HTML position attribute indicating the position of the widget with respect to the parent, e.g., "relative", "absolute" (default is "absolute")</li>
     *          <li>visibleWhen (String): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     *                  The following additional attribute links the display widget to a specific state attribute of a model:
     *          <li>displayName (String): name of the state attribute defining the display content. Default is the ID of the widget.</li>
     * @memberof module:BasicDisplayEVO
     * @instance
     */
    constructor (id: string, coords: Coords, opt?: DisplayOptions) {
        super(id, coords, opt);

        opt = opt || {};
        opt.css = opt.css || {};

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.type = opt.type || "display";
        this.css["background-color"] = opt.css["background-color"] || "black";
        this.css.color = opt.css.color || "white";
        this.css.cursor = opt.css.cursor || "default";
        this.css.overflow = opt.css.overflow || "hidden";

        // set display key
        this.attr.displayName = opt.displayName || id;
    }

    /**
     * @function <a name="render">render</a>
     * @description Rendering function for button widgets.
     * @param state {Object} JSON object with the current value of the state attributes of the modelled system
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
     * @memberof module:BasicDisplayEVO
     * @instance
     */
    render (state?: string | number | {}, opt?: CSS): void {
        super.render();
        // if (!this.rendered) {
        //     // invoke createHTMLElement to create the widget
        //     super.createHTMLElement();
        // }
        // set style
        this.setCSS({ ...this.css, ...opt });

        // set line height so text is properly centered
        const lineHeight: number = parseFloat(this.css["line-height"]) || this.height;
        this.$base.css("line-height", `${lineHeight}px`);

        // render content
        state = (state === undefined || state === null)? "" : state;
        if (typeof state === "string" || typeof state === "number") {
            this.$base.html(`${state}`);
            this.reveal();
        } else if (typeof state === "object" && this.attr?.displayName !== "" && this.evalViz(state)) {
            this.$base.html(this.evaluate(this.attr.displayName, state));
            this.reveal();
        } else {
            this.hide();
        }
    }

    /**
     * @function <a name="renderSample">renderSample</a>
     * @description Version of the render function that demonstrates the functionalities of the widget.
     * @memberof module:BasicDisplayEVO
     * @instance
     */
    renderSample (): void {
        return this.render("ABC12");
    }

    getDescription (): string {
        return "Basic display, suitable for rendering text and numbers.";
    }

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
    renderGlyphicon (icon, opt) {
        this.setCSS(opt);
        if (icon) {
            this.$base.addClass("blink glyphicon " + icon).css("font-family", "");
        }
        this.reveal();
        return this;
    }
}