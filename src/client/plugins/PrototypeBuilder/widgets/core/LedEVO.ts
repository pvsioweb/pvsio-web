/**
 * @module LedEVO
 * @version 1.0
 * @description Renders an LED light
 * @author Paolo Masci
 * @date Jul 16, 2018
 *
 *
 */
import { WidgetEVO, WidgetAttr } from "./WidgetEVO";
import { Coords, Renderable, WidgetOptions } from "../../../../common/interfaces/Widgets";

export interface LedOptions extends WidgetOptions {
    ledName?: string
};

const COLOR = {
    brightGreen: "#00FF66"
};

export interface LedAttr extends WidgetAttr {
    ledName: string
};

export class LedEVO extends WidgetEVO {
    static readonly constructorName: string = "LedEVO";
    getConstructorName (): string {
        return LedEVO.constructorName;
    }

    protected attr: LedAttr;
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
        this.kind = "LED";

        opt = opt || {};
        opt.css = opt.css || {};
        coords = coords || {};

        const width: number = parseFloat(`${coords.width}`) || parseFloat(`${coords.height}`) || 1;
        const height = parseFloat(`${coords.height}`) || parseFloat(`${coords.width}`) || 1;
        const maxWidth: number = parseFloat($(this.sel2jquery(opt.parent)).css("width")) || width;
        const maxHeight: number = parseFloat($(this.sel2jquery(opt.parent)).css("height")) || height;

        this.radius = Math.min(width, height, maxWidth, maxHeight) / 2;

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css["background"] = opt.css["color"] || opt.css["background"] || COLOR.brightGreen;
        this.css.cursor = opt.css.cursor || "default";
        this.css["border-radius"] = opt.css["border-radius"] || `${this.radius}px`;
        this.css.overflow = "visible";
        
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
    render (state: Renderable, opt?: LedOptions): void {
        super.render();
        // set style
        opt = opt || {};
        this.applyCSS({ ...this.css, ...opt.css });

        // make sure shape is round
        this.$base.css({ 
            width: `${this.radius * 2}px`,
            height: `${this.radius * 2}px`,
            left: `${this.width / 2 - this.radius}px`
        });

        // update style, if necessary
        state = (state === undefined || state === null) ? "" : state;
        if (typeof state === "string") {
            this.applyCSS({ "background": state });
        } 
        // else if (typeof state === "object" && this.attr.ledName !== "" && this.evalViz(state)) {
        //     this.applyCSS({ "background": this.evaluate(this.attr.ledName, state) });
        // }

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
        return "Multi-color LED light.";
    }
}