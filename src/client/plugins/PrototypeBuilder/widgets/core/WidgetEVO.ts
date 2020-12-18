/**
 * @module WidgetEVO
 * @version 1.0
 * @description Base class for EVO widgets.
 * @author Paolo Masci
 * @date Dec 11, 2017
 *
 */

// import * as StateParser from "../../../util/PVSioStateParser";
import * as Utils from '../../../../env/Utils';
import { dimColor } from "../../../../env/Utils";
import { ActionCallback } from "../ActionsQueue";
import { Connection } from "../../../../env/Connection";
import * as Backbone from 'backbone';

// const normalised = {
//     backgroundcolor: "backgroundColor",
//     fontsize: "fontSize",
//     fontfamily: "fontFamily",
//     fontcolor: "fontColor",
//     borderwidth: "borderWidth",
//     borderstyle: "borderStyle",
//     borderradius: "borderRadius",
//     bordercolor: "borderColor",
//     zindex: "zIndex"
// };
// function normalise_options(data) {
//     var opt = {};
//     if (data) {
//         let norm_key = null;
//         for (let key in data) {
//             norm_key = normalised[key] || key;
//             opt[norm_key] = data[key];
//         }
//     }
//     return opt;
// }
// const html_attributes = {
//     backgroundColor: "background-color",
//     backgroundcolor: "background-color",
//     fontSize: "font-size",
//     fontsize: "font-size",
//     fontFamily: "font-family",
//     fontfamily: "font-family",
//     fontColor: "color",
//     fontcolor: "color",
//     align: "text-align",
//     borderWidth: "border-width",
//     borderwidth: "border-width",
//     borderStyle: "border-style",
//     borderstyle: "border-style",
//     borderRadius: "border-radius",
//     borderradius: "border-radius",
//     borderColor: "border-color",
//     bordercolor: "border-color",
//     zIndex: "z-index"
// };
// function toHtmlStyle (style: WidgetStyle): HtmlStyle {
//     var style = {};
//     if (data) {
//         data = normalise_options(data);
//         let html_key = null;
//         for (let key in data) {
//             html_key = html_attributes[key] || key;
//             style[html_key] = data[key];
//         }
//     }
//     return style;
// }

export const widget_template: string = `
{{#if template_description}}<!--
    Basic widget template. Provides a base layer for rendering the visual appearance of the widget
    The widget has three layers:
      - a div layer defining position and size of the widget
      - a base layer renders the visual appearance
      - an overlay layer captures user interactions with the widget -->{{/if}}
<div style="width:0px; height:0px">
<div id="{{id}}"
     style="position:{{position}}; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:{{zIndex}}; overflow:{{overflow}};"
     class="{{type}} noselect{{#if blinking}} blink{{/if}}">
    <div id="{{id}}_base"
         style="position:absolute; width:{{width}}px; height:{{height}}px; line-height:{{line-height}}px; z-index:inherit; {{#each style}} {{@key}}:{{this}};{{/each}}"
         class="{{type}}_base {{id}}_base"></div>
    <div id="{{id}}_overlay"
         style="position:absolute; width:{{width}}px; height:{{height}}px; background-color:{{style.overlay-color}}; border-radius:{{style.border-radius}}; cursor:{{style.cursor}}; opacity:0; z-index:inherit;"
         class="{{type}}_overlay {{id}}_overlay"></div>
</div>
</div>`;

export const img_template: string = `
{{#if template_description}}<!-- Template for embedding an image in the div -->{{/if}}
{{#if img}}<img src="{{img}}" style="z-index:inherit;opacity:{{opacity}};transform-origin:{{transformOrigin}};">{{/if}}
{{#if svg}}{{svg}}{{/if}}
`;
export type Renderable = string | number | {};
export type Coords = { top?: number, left?: number, width?: number, height?: number };
export type WidgetDescriptor = {
    id: string,
    type: string,
    attr: WidgetAttr,
    coords: Coords,
    style: CSS,
    evts: string[]
};
// export interface WidgetStyle {
//     position?: "absolute" | "relative",
//     parent?: string,
//     cursor?: string,
//     backgroundColor?: string,
//     fontSize?: number | string,
//     fontFamily?: string,
//     fontColor?: string, // equivalent to "color"
//     color?: string,
//     align?: string,
//     borderWidth?: number | string,
//     borderStyle?: string,
//     borderRadius?: number | string,
//     borderColor?: string,
//     overflow?: "hidden" | "visible",
//     opacity?: number | string,
//     blinking?: boolean,
//     marginLeft?: number | string,
//     marginTop?: number | string,
//     duration?: number | string,
//     overlayColor?: string,
//     transitionTimingFunction?: "ease-in" | "ease-out",
//     transformOrigin?: "center"
//     zIndex?: number | string,
//     letterSpacing?: number | string,
//     whiteSpace?: "normal" | "nowrap",
//     lineHeight?: string,
//     paddingTop?: string,
//     paddingLeft?: string,
//     paddingRight?: string,
//     paddingBottom?: string,
// }
export interface CSS {
    parent?: "body" | string,
    position?: "absolute" | "relative",
    cursor?: string,
    "background-color"?: string,
    "font-size"?: string,
    "font-family"?: string,
    "font-color"?: string, // equivalent to "color"
    "color"?: string,
    align?: string,
    "border-width"?: string,
    "border-style"?: string,
    "border-radius"?: string,
    "border-color"?: string,
    overflow?: "hidden" | "visible",
    opacity?: number,
    "margin-left"?: string,
    "margin-top"?: string,
    "z-index"?: string,
    "letter-spacing"?: string,
    "white-space"?: "normal" | "nowrap",
    "line-height"?: string,
    "padding-top"?: string,
    "padding-left"?: string,
    "padding-right"?: string,
    "padding-bottom"?: string,
    [key: string]: string | number,

    // animation options
    "overlay-color"?: string,
    duration?: number,
    rotation?: string,
    blinking?: string,
    transitionTimingFunction?: "ease-in" | "ease-out",
    transformOrigin?: "center"
}
export interface WidgetOptions {
    css?: CSS,
    visibleWhen?: string,
    enabledWhen?: string,
    type?: string, // widget type, e.g., button, display
    widget_template?: string, // HTML template for rendering the widget
    callback?: ActionCallback,
    connection?: Connection
};

export type VisibilityOptions =  {
    visible: string,
    enabled: string
};

export type BasicEvent = "click" | "dblclick" | "press" | "release";
export type WidgetEvents = { [evt in BasicEvent]?: boolean };
export type WidgetAttr = {
    [key: string]: string
};

export abstract class WidgetEVO extends Backbone.Model {
    static readonly MAX_COORDINATES_ACCURACY: number = 0; // max 0 decimal digits for coordinates, i.e., position accuracy is 1px
    readonly widget: boolean = true; // this flag can be used to identify whether an object is a widget

    protected attr: WidgetAttr = {};

    id: string;
    type: string;
    parent: string;
    top: number;
    left: number;
    width: number;
    height: number;
    viz: VisibilityOptions;
    position: "absolute" | "relative";
    zIndex: number;
    css: CSS = {};

    widget_template: string;

    div: JQuery<HTMLDivElement>;
    base: JQuery<HTMLDivElement>;
    overlay: JQuery<HTMLDivElement>;
    marker: JQuery<HTMLElement>;

    evts: WidgetEvents = null;
    alias: string;
    readonly fontPadding: number = 6;
    protected rendered?: boolean = false;

    static uuid (): string {
        return "wdg" + Utils.uuid("Wxxxx");    
    }
    /**
     * @function <a name="ButtonEVO">ButtonEVO</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget.
     * @param opt {Object} Style options defining the visual appearance of the widget.
     *                     Options can be given either as standard html style attributes or using the following widget attributes:
     *          <li>blinking (bool): whether the button is blinking (default is false, i.e., does not blink)</li>
     *          <li>align (String): text align: "center", "right", "left", "justify" (default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is "transparent")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default is "steelblue")</li>
     *          <li>borderRadius (Number|String): border radius, must be a number or a valid HTML5 border radius, e.g., 2, "2px", etc. (default is 0, i.e., square border)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 ))</li>
     *          <li>marginLeft (Number): left margin (default is 0)</li>
     *          <li>marginTop (Number): top margin (default is 0)</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is 0.9, i.e., semi-opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>position (String): standard HTML position attribute indicating the position of the widget with respect to the parent, e.g., "relative", "absolute" (default is "absolute")</li>
     *          <li>visibleWhen (String): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     * @memberof module:WidgetEVO
     * @instance
     */
    constructor (id: string, coords: Coords, opt?: WidgetOptions) {
        super();
        opt = opt || {};
        opt.css = opt.css || {};
        coords = coords || {};
        this.id = id;
        this.type = opt.type || "widget";
        this.parent = (opt.css.parent) ? 
            opt.css.parent.startsWith("#") || opt.css.parent.startsWith(".") ? 
                opt.css.parent : ("#" + opt.css.parent) : "body";
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = (isNaN(coords.width)) ? 32 : coords.width;
        this.height = (isNaN(coords.height)) ? 32 : coords.height;
        this.viz = {
            visible: opt.visibleWhen || "true", // default: always enabled/visible
            enabled: opt.enabledWhen || "true"
        };

        this.position = opt.css.position || "absolute";

        // visual style
        const borderWidth: number = parseFloat(opt.css["border-width"]) || 0;
        const fontSize: number = !isNaN(parseFloat(`${opt.css["font-size"]}`)) && parseFloat(`${opt.css["font-size"]}`) < this.height - borderWidth - this.fontPadding ? 
            parseFloat(`${opt.css["font-size"]}`)
                : this.height - borderWidth - this.fontPadding;

        this.css = { ...opt.css };
        // set the initial value of some core style options if they are not provided
        this.css["background-color"] = opt.css["background-color"] || "transparent";
        this.css["font-size"] = fontSize + "px";
        this.css["font-family"] = opt.css["font-family"] || "sans-serif";
        this.css.color = opt.css.color || "white";
        this.css["text-align"] = opt.css["text-align"] || "center";
        this.css.overflow = opt.css.overflow || "hidden";
        this.css["white-space"] = opt.css["white-space"] || "nowrap";
        this.css.blinking = opt.css.blinking || "false";
        this.css["overlay-color"] = opt.css["overlay-color"] || "transparent";

        this.widget_template = opt.widget_template || widget_template;
    }

    createHTMLElement (): void {
        this.rendered = true;

        const res: string = Handlebars.compile(this.widget_template, { noEscape: true })(this);
        if (!$(this.parent)[0]) {
            console.error("Error: " + this.parent + " does not exist. Widget '" + this.id + "' cannot be attached to DOM :((");
        }

        $(this.parent).append(res);
        this.div = $("#" + this.id);
        this.base = $("#" + this.id + "_base");
        this.overlay = $("#" + this.id + "_overlay");
        this.setStyle(this.css);

        this.hide();
    }

    /**
     * @function <a name="render">render</a>
     * @description Basic rendering function (reveals the widget). Widgets need to override this function when rendering involves additional/different logic.
     * @memberof module:WidgetEVO
     * @instance
     */
    render (state?: Renderable, opt?: CSS): void {
        return this.reveal();
    }

    /**
     * @function <a name="renderSample">renderSample</a>
     * @description Version of the render function that demonstrates the functionalities of the widget.
     *              The predefined behaviour is rendering the widget type.
     * @memberof module:WidgetEVO
     * @instance
     */
    renderSample (opt?: CSS): void {
        this.render(null, opt);
    }

    /**
     * Returns a description of the widget, e.g., display for text and numbers, touchscreen, button, etc
     */
    getDescription (): string {
        return "";
    }

    /**
     * @function <a name="reveal">reveal</a>
     * @description Reveals the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    reveal (): void {
        if (this.div && this.div[0]) {
            // console.log("revealing widget " + this.id);
            this.div.css("display", "block");
        }
    }

    /**
     * @function <a name="hide">hide</a>
     * @description Hides the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    hide (): void {
        if (this.div && this.div[0]) {
            // console.log("hiding widget " + this.id);
            this.div.css("display", "none");
        }
    }

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
    move (coords: Coords, opt?: CSS): void {
        opt = opt || {};
        // console.log(coords);
        if (this.div && this.div[0]) {
            coords = coords || {};
            // opt = normalise_options(opt);
            opt.duration = opt.duration || 0;
            opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-out";
            this.top = (isNaN(coords.top)) ? this.top : parseFloat(coords.top.toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY));
            this.left = (isNaN(coords.left)) ? this.left : parseFloat(coords.left.toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY));
            this.div.animate({
                "top": this.top + "px",
                "left": this.left + "px",
                "transition-timing-function": opt.transitionTimingFunction
            }, +opt.duration);
        }
        this.reveal();
    }

    /**
     * @function <a name="resize">resize</a>
     * @description Changes the size of the widget according to the width and height given as parameter.
     * @param coords {Object} Width and height indicating the new size of the widget. The coordinates are given in the form { width: (number), height: (number) }
     * @param opt {Object}
     *         <li> duration (Number): duration in milliseconds of the move transition (default is 0, i.e., instantaneous) </li>
     *         <li> transitionTimingFunction (String): HTML5 timing function (default is "ease-out") </li>
     * @memberof module:WidgetEVO
     * @instance
     */
    resize (size: { height?: number, width?: number}, opt?: CSS): void {
        // console.log(coords);
        if (this.div && this.div[0]) {
            size = size || {};
            opt = opt || {};
            opt.duration = opt.duration || 0;
            opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-out";
            this.height = (isNaN(size.height)) ? this.height : parseFloat(size.height.toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY));
            this.width = (isNaN(size.width)) ? this.width : parseFloat(size.width.toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY));

            // update font size
            const borderWidth: number = parseFloat(opt["border-width"]) || 0;
            const fontSize: number = !isNaN(parseFloat(opt["font-size"])) && parseFloat(opt["font-size"]) < this.height - borderWidth - this.fontPadding ? 
                parseFloat(opt["font-size"]) 
                    : this.height - borderWidth - this.fontPadding;
            this.css["font-size"] = fontSize + "px";

            if (opt.duration) {
                this.div.animate({ "height": this.height + "px", "width": this.width + "px", "transition-timing-function": opt.transitionTimingFunction }, +opt.duration);
                this.base.css("font-size", this.css["font-size"]).animate({ "line-height": this.height + "px", "height": this.height + "px", "width": this.width + "px", "transition-timing-function": opt.transitionTimingFunction }, +opt.duration);
                this.overlay.animate({ "height": this.height + "px", "width": this.width + "px", "transition-timing-function": opt.transitionTimingFunction }, +opt.duration);
            } else {
                this.div.css("height", this.height + "px").css("width", this.width + "px");
                this.base.css("line-height", this.height + "px").css("height", this.height + "px").css("width", this.width + "px").css("font-size", this.css["font-size"]);
                this.overlay.css("height", this.height + "px").css("width", this.width + "px");
            }
        }
        this.reveal();
    }

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
    rotate (deg: string | number, opt?: CSS): void {
        if (this.div && this.div[0]) {
            deg = (isNaN(parseFloat(`${deg}`))) ? 0 : parseFloat(`${deg}`);
            opt = opt || {};
            opt.duration = opt.duration || 0;
            opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-in";
            opt.transformOrigin = opt.transformOrigin || "center";
            this.div.css({
                "transform": `rotate(${deg}deg)`,
                "transform-origin": opt.transformOrigin
            });
            if (opt.duration) {
                this.div.css({ "transition": `all ${opt.duration}ms ${opt.transitionTimingFunction} 0s` });
            }
        }
        this.reveal();
    }

    /**
     * @function <a name="remove">remove</a>
     * @description Removes the div elements of the widget from the html page -- useful to programmaticaly remove widgets from a page.
     * @memberof module:WidgetEVO
     * @instance
     */
    remove (): void {
        if (this.div && this.div[0]) {
            this.div.remove();
        }
    }

    /**
     * @function <a name="evalViz">evalViz</a>
     * @description Evaluates the visibility of the widget based on the state attrbutes (passed as function parameter) and the expression stored in this.visibleWhen
     * @param state {Object} JSON object with the current value of the state attributes of the modelled system
     * @return {bool} true if the state attributes indicate widget visible, otherwise false.
     * @memberof module:WidgetEVO
     * @instance
     */
    evalViz (state: string | {}): boolean {
        let vizAttribute: boolean = true;
        if (state && typeof state === "object") {
            vizAttribute = false;
            const expr: { res: Utils.SimpleExpression, err?: string } = Utils.simpleExpressionParser(this.viz?.visible);
            if (expr && expr.res) {
                if (expr.res.type === "constexpr" && expr.res.constant === "true") {
                    vizAttribute = true;
                } else if (expr.res.type === "boolexpr" && expr.res.binop) {
                    let str: string = Utils.resolve(state, expr.res.attr);
                    if (str) {
                        str = Utils.evaluate(str);
                        if ((expr.res.binop === "=" && str === expr.res.constant) ||
                            (expr.res.binop === "!=" && str !== expr.res.constant)) {
                                vizAttribute = true;
                        }
                    }
                }
            }
        }
        return vizAttribute;
    }

    /**
     * @function <a name="evaluate">evaluate</a>
     * @description Returns the state of the widget.
     * @param attr {String} Name of the state attribute associated with the widget.
     * @param state {Object} Current system state, represented as a JSON object.
     * @return {String} String representation of the state of the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    evaluate (attr: string, state: {}): string {
        if (attr && state && typeof state === "object") {
            var disp = Utils.resolve(state, attr);
            if (disp !== null && disp !== undefined) {
                return Utils.evaluate(disp).replace(new RegExp("\"", "g"), "");
            } else {
                console.log("Warning: WidgetEVO.evaluate could not find state attribute " + attr + " requested by " + this.id);
            }
        }
        return "";
    }


    /**
     * @function <a name="getVizExpression">getVizExpression</a>
     * @description Returns the expression defining the visibility of the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    getVizExpression (): string {
        return this.viz?.visible;
    }


    /**
     * @function <a name="setStyle">setStyle</a>
     * @description Sets the font color and background color.
     * @param style {Object} Style attributes characterising the visual appearance of the widget.
     *                      Attributes can be either standard HTML5 attributes, or the following widgets attributes:
     *          <li>blinking (bool): whether the button is blinking (default is false, i.e., does not blink)</li>
     *          <li>align (String): text align: "center", "right", "left", "justify" (default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is "transparent")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color </li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (String): font size (default is "VALpx", where VAL = (coords.height - opt.borderWidth) / 2)</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is 0.9, i.e., semi-opaque)</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     * @memberof module:WidgetEVO
     * @instance
     */
    setStyle (style: CSS): void {
        style = style || {};
        for(const key in style) {
            // store style info
            this.css[key] = style[key];
            // update style
            this.base.css(key, style[key]);
            if (key === "z-index" || key === "overlay-color" || key === "border-radius") {
                // set z-index of the overlay, otherwise the overlay may fall under base
                this.overlay.css(key, style[key]);
            }
        }
        if (style.blinking && style.blinking !== "false") {
            this.base.addClass("blinking");
        }
    }

    setAttr (attr: WidgetAttr): void {
        attr = attr || {};
        for(const key in attr) {
            // store style info
            this.attr[key] = attr[key];
        }
    }

    /**
     * @function <a name="invertColors">invertColors</a>
     * @description Inverts the colors of the display (as in a negative film).
     * @memberof module:WidgetEVO
     * @instance
     */
    invertColors (): void {
        this.base.css("background-color", this.css["font-color"]);
        this.base.css("color", this.css["background-color"]);
    }

    /**
     * @function <a name="select">select</a>
     * @description Selects the widget -- useful to highlight the widget programmaticaly.
     * @param style {Object} Set of valid HTML5 attributes characterising the visual appearance of the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    select (opt?: { opacity?: number, borderColor?: string, classed?: string, backgroundColor?: string }): void {
        opt = opt || {};
        opt.opacity = (isNaN(opt.opacity)) ? 0.5 : opt.opacity;
        const borderColor: string = this.base.css("background-color") === "transparent" ? "yellow" : this.base.css("background-color");
        const overlayColor: string = this.css['overlay-color'] || "transparent";
        // this.base.css({
        //     "background-color": opt.backgroundColor || dimColor(this.base.css("background-color")),
        //     opacity: opt.opacity
        // });
        if (opt.classed) { this.base.addClass(opt.classed); }
        this.overlay.css({ "background-color": overlayColor });
        this.overlay.css({ "box-shadow": `0px 0px 10px ${opt.borderColor || borderColor}`, opacity: 1 });
        // this.overlay.css({ border: `1px solid ${opt.borderColor || borderColor}`, opacity: 1 });
    }

    protected getOverlayColor (): string {
        return this.css["background-color"] === "transparent" ? "steelblue" : this.css["background-color"];
    }

    /**
     * @function <a name="deselect">deselect</a>
     * @description Deselects the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    deselect (): void {
        this.setStyle(this.css);
        this.overlay.css({ opacity: 0 });
    }

    /**
     * @function <a name="getPosition">getPosition</a>
     * @description Returns the position of the widget
     * @return {Object} Coordinates of the widget, in the form { left: x, top: y }, where x and y are real numbers
     * @memberof module:WidgetEVO
     * @instance
     */
    getPosition (): { left: number, top: number } {
        return { left: this.left, top: this.top };
    }

    /**
     * @function <a name="getSize">getSize</a>
     * @description Returns the size of the widget
     * @return {Object} Size of the widget, in the form { width: x, height: y }, where x and y are real numbers
     * @memberof module:WidgetEVO
     * @instance
     */
    getSize (): { width: number, height: number } {
        return { width: this.width, height: this.height };
    }

    /**
     * @function <a name="setPosition">setPosition</a>
     * @description Sets the position of the widget, equivalent to function move(...)
     * @param coords {Object} Coordinates of the widget, in the form { left: x, top: y }, where x and y are real numbers
     * @memberof module:WidgetEVO
     * @instance
     */
    setPosition (coords: Coords): void {
        return this.move(coords);
    }

    /**
     * @function <a name="setSize">setSize</a>
     * @description Set the size of the widget, equivalent to function resize(...)
     * @param size {Object} Size of the widget, in the form { width: x, height: y }, where x and y are real numbers
     * @memberof module:WidgetEVO
     * @instance
     */
    setSize (size: { height?: number, width?: number}): void {
        return this.resize(size);
    }

    /**
     * @function <a name="setPositionAndSize">setPositionAndSize</a>
     * @description Sets the position & size of the widget
     * @param data {Object} Coordinates and size of the widget, in the form { left: x, top: y, width: w, height: h }, where x, y, w, h are real numbers
     * @memberof module:WidgetEVO
     * @instance
     */
    setPositionAndSize (data: Coords): void {
        if (data) {
            this.move(data);
            this.resize(data);
        }
    }

    updateLocationAndSize (data: Coords): void {
        return this.setPositionAndSize(data);
    }

    getType () {
        return this.type;
    }

    getStyle (): CSS | null {
        const keys: string[] = Object.keys(this.css)?.sort((a: string, b: string): number => {
            return a < b ? -1 : 1;
        });
        if (keys && keys.length) {
            const ans: CSS = {};
            for (let i in keys) {
                const key: string = keys[i];
                ans[key] = this.css[key];
            }
            return ans;
        }
        return null;
    }

    getViz (): VisibilityOptions {
        return this.viz;
    }

    getCoordinates (): Coords {
        return {
            top: +(this.top).toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY),
            left: +(this.left).toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY),
            width: +(this.width).toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY),
            height: +(this.height).toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY)
        };
    }

    /**
     * Get widget attributes
     * @param opt 
     *      nameReplace {string}: apply a name-replace to the attribute name, where the id of the widget is replaced by the provided string
     *      keyCode {boolean}: whether to include keyCode in the returned list of attributes
     *      optionals {string[]}: list of optional attributes --- they will be placed at the end of the returned list 
     */
    getAttr (opt?: { nameReplace?: string, keyCode?: boolean, optionals?: string[] }): WidgetAttr {
        opt = opt || {};
        opt.optionals = opt.optionals || [];
        const keys: string[] = Object.keys(this.attr)?.sort((a: string, b: string): number => {
            return a < b ? -1 : 1;
        });
        if (keys && keys.length) {
            const core: WidgetAttr = {};
            const optionals: WidgetAttr = {};
            for (let i in keys) {
                const key: string = keys[i];
                if (!opt.optionals.includes(key)) {
                    core[key] = (typeof this.attr[key] === "string" && opt.nameReplace) ?
                        `${this.attr[key]}`.replace(this.id, opt.nameReplace)
                            : this.attr[key];
                } else {
                    optionals[key] = (typeof this.attr[key] === "string" && opt.nameReplace) ?
                        `${this.attr[key]}`.replace(this.id, opt.nameReplace)
                            : this.attr[key];
                }
            }
            return {...core, ...optionals};
        };
        return null;
    }
    
    getPrimaryKey (): string {
        return this.id;
    }

    getEvents (): string[] {
        const ans: string[] = [];
        if (this.evts) {
            const keys: string[] = Object.keys(this.evts);
            for (let i in keys) {
                const evt: string = keys[i];
                if (this.evts[evt]) {
                    ans.push(evt);
                }
            }
        }
        return ans;
    }

    setEvents (evts: string[]): void {
        if (evts && evts.length > 0) {
            this.evts = {};
            this.enableEvents(evts);
        } else {
            this.evts = null;
        }
    }

    enableEvents (evts: string[]): void {
        if (evts && evts.length > 0) {
            this.evts = this.evts || {};
            for (let i in evts) {
                this.evts[evts[i]] = true;
            }
        } else {
            this.evts = null;
        }
    }

    disableEvents (evts: string[]): void {
        if (evts && evts.length > 0) {
            for (let i in evts) {
                this.evts = this.evts || {};
                this.evts[evts[i]] = false;
            }
        } else {
            this.evts = null;
        }
    }

    toJSON (): WidgetDescriptor {
        return {
            id: this.id,
            type: this.alias || this.getType(),
            attr: this.getAttr(),
            coords: this.getCoordinates(),
            evts: this.getEvents(),
            style: this.getStyle()
        };
    }

    setMarker (marker?: JQuery<HTMLElement>): void {
        if (marker) {
            this.marker = marker;
        }
    }

    getMarker (): JQuery<HTMLElement> {
        return this.marker;
    }
}