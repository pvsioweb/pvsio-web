/**
 * @module LedEVO
 * @version 1.0
 * @description Renders an LED light
 * @author Paolo Masci
 * @date Jul 16, 2018
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses LedEVO
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: { d3: "../lib/d3", text: "../lib/text" }
 });
 require(["widgets/core/LedEVO"], function (LedEVO) {
      "use strict";
      var led = new LedEVO("disp", {
        top: 200, left: 120, height: 24, width: 120
      });
      led.render(); // The LED is on
 });
 *
 */
import { ActionCallback } from "../ActionsQueue";
import { WidgetOptions, Coords, WidgetEVO, CSS, Renderable } from "./WidgetEVO";

export interface LedOptions extends WidgetOptions {
    ledName?: string,
    callback?: ActionCallback
};

const COLOR = {
    brightGreen: "#00FF66"
};

export class LedEVO extends WidgetEVO {
    protected radius: number;
    /**
     * @function <a name="LedEVO">LedEVO</a>
     * @description Constructor.
     * @augments WidgetEVO
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget area.
     *        Default is { top: 0, left: 0, width: 32, height: 20 }.
     * @param opt {Object} Style options defining the visual appearance of the widget.
     *                     Options can be given either as standard html style attributes or using the following widget attributes:
     *          <li>backgroundColor (String): background display color (default is black, "transparent")</li>
     *          <li>blinking (bool): whether the button is blinking (default is false, i.e., does not blink)</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default is "steelblue")</li>
     *          <li>borderRadius (Number|String): border radius, must be a number or a valid HTML5 border radius, e.g., 2, "2px", etc. (default is 0, i.e., square border)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>ledName (String): The name of the state attribute defining the color of the display. This information will be used by the render method. Default is the ID of the display.</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>position (String): standard HTML position attribute indicating the position of the widget with respect to the parent, e.g., "relative", "absolute" (default is "absolute")</li>
     *          <li>visibleWhen (String): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     *                  The following additional attribute links the display widget to a specific state attribute of a model:
     * @memberof module:LedEVO
     * @instance
     */
    constructor (id: string, coords: Coords, opt?: LedOptions) {
        super(id, coords, opt);

        opt = opt || {};
        coords = coords || {};

        coords.width = coords.width || coords.height || 1;
        coords.height = coords.height || coords.width || 1;
        const maxWidth: number = parseFloat(`$(opt.parent).css("width")`) || coords.width;
        const maxHeight: number = parseFloat(`$(opt.parent).css("height")`) || coords.height;

        this.radius = Math.min(coords.width, coords.height, maxWidth, maxHeight) / 2;
        const marginLeft: number = coords.width / 2 - this.radius;
        const marginTop = coords.height / 2 - this.radius;

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.type = opt.type || "led";
        this.css["background-color"] = opt.css["color"] || opt.css["background-color"] || COLOR.brightGreen;
        this.css.cursor = opt.css.cursor || "default";
        this.css["border-radius"] = opt.css["border-radius"] || `${this.radius}px`;
        this.css.overflow = "visible";
        
        // create the DOM element
        super.createHTMLElement();
        this.base.css({ 
            width: this.radius * 2,
            height: this.radius * 2,
            left: `${this.width / 2 - this.radius}px`
        });

        // delete unnecessary style options
        delete this.css["font-size"];
        delete this.css["font-family"];
        delete this.css["text-align"];
        delete this.css["white-space"];

        // set display key
        this.attr = {
            ledName: opt.ledName || id        
        };
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
     * @memberof module:LedEVO
     * @instance
     */
    render (state: Renderable, opt?: CSS): void {
        // set style
        this.setStyle({ ...this.css, ...opt });

        // update style, if necessary
        state = (state === undefined || state === null) ? "" : state;
        if (typeof state === "string") {
            this.setStyle({ "background-color": state });
        } else if (typeof state === "object" && this.attr.ledName !== "" && this.evalViz(state)) {
            this.setStyle({ "background-color": this.evaluate(this.attr.ledName, state) });
        }

        this.reveal();
    }

    /**
     * @function <a name="renderSample">renderSample</a>
     * @description Version of the render function that demonstrates the functionalities of the widget.
     * @memberof module:LedEVO
     * @instance
     */
    renderSample (): void {
        this.render(COLOR.brightGreen);
    }

    // @override
    getDescription (): string {
        return "LED widget, renders multi-color LED lights.";
    }
}