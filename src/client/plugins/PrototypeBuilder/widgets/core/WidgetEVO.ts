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
import { ActionCallback } from "../../ActionsQueue";
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

/**
 * Note: the css of all divs in the templates must indicate "position:absolute" otherwise z-index is not used by the browser, and coordinates are automatically re-arranged by the browser
 */
export const widget_template: string = `
{{#if template_description}}<!--
    Basic widget template. Provides a base layer for rendering the visual appearance of the widget
    The widget has three layers:
      - a div layer defining position and size of the widget
      - a base layer renders the visual appearance
      - an overlay layer captures user interactions with the widget -->{{/if}}
<div id="{{id}}"
     style="position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:{{css.z-index}}; overflow:{{css.overflow}};"
     class="{{type}} noselect{{#if css.blinking}} blink{{/if}}">
     <div id="{{id}}_img"
        style="position:absolute;"
        class="img"></div>
    <div id="{{id}}_base"
         style="position:absolute; width:{{width}}px; height:{{height}}px; {{#each css}} {{@key}}:{{this}};{{/each}}"
         class="base"></div>
    <div id="{{id}}_overlay"
         style="position:absolute; width:{{width}}px; height:{{height}}px; {{#if css.z-index}}z-index:{{css.z-index}};{{/if}} border-radius:{{css.border-radius}}; cursor:{{css.cursor}}; opacity:0;"
         class="overlay"></div>
</div>`;

export const img_template: string = `
{{#if template_description}}<!-- Template for embedding an image in a div -->{{/if}}
{{#if img}}<img src="{{img}}" style="position:absolute; opacity:{{opacity}}; transform-origin:{{transformOrigin}};">{{/if}}
{{#if svg}}{{svg}}{{/if}}
`;
export type Renderable = string | number | {};
export type Coords<T = string | number> = { top?: T, left?: T, width?: T, height?: T };
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

// keys and type
export const cssKeys = {
    position: [ "absolute", "relative" ],
    cursor: [ "string" ],
    "background-color": [ "string" ],
    "font-size": [ "string" ],
    "font-family": [ "string" ],

    color: [ "string" ],
    align: [ "string" ],
    border: [ "string" ],
    "border-radius": [ "string" ],
    overflow: [ "hidden", "visible" ],
    opacity: [ "number" ],

    "z-index": [ "string" ],
    "letter-spacing": [ "string" ],
    "white-space": [ "normal", "nowrap" ],
    "line-height": [ "string" ],

    margin: [ "string" ], // top right bottom left
    padding: [ "string" ], // top right bottom left

    halo: [ "string" ] // color
};

export interface CSS {
    position?: "absolute" | "relative",
    cursor?: string,
    "background-color"?: string,
    "font-size"?: string,
    "font-family"?: string,

    color?: string,
    align?: string,
    border?: string,
    "border-radius"?: string,
    overflow?: "hidden" | "visible",
    opacity?: number,

    "z-index"?: number,
    "letter-spacing"?: string,
    "white-space"?: "normal" | "nowrap",
    "line-height"?: string,

    margin?: string,
    padding?: string,

    halo?: string,

    // animation options
    duration?: number,
    rotation?: string,
    blinking?: string,
    transitionTimingFunction?: "ease-in" | "ease-out",
    transformOrigin?: "center"

    // the following allows to add more keys
    [key: string]: string | number,
}
export interface WidgetOptions {
    parent?: "body" | string | JQuery<HTMLElement>,
    css?: CSS,
    viz?: VizOptions,
    type?: string, // widget type, e.g., "Button", "Display"
    widget_template?: string, // HTML template for rendering the widget
    callback?: ActionCallback,
    connection?: Connection
};

export type VizOptions =  {
    visible?: string | boolean,
    enabled?: string | boolean
};

export type BasicEvent = "click" | "dblclick" | "press" | "release";
export type BasicEventData = {
    evt: BasicEvent,
    fun: string // name of the prototype function to be invoked when a given event is triggered
};
export type WidgetEvents = { [evt in BasicEvent]?: boolean };
export type WidgetAttr = {
    // [key: string]: string
};

export abstract class WidgetEVO extends Backbone.Model {
    static readonly MAX_COORDINATES_ACCURACY: number = 0; // max 0 decimal digits for coordinates, i.e., position accuracy is 1px
    readonly widget: boolean = true; // this flag can be used to identify whether an object is a widget

    protected attr: WidgetAttr = {};

    id: string;
    type: string;

    $parent: JQuery<HTMLElement>;
    parentSelector: string; // this is useful for debugging purposes
    
    top: number;
    left: number;
    width: number;
    height: number;
    
    viz: VizOptions = {};
    css: CSS = {};

    widget_template: string;

    $div: JQuery<HTMLDivElement>;
    $img: JQuery<HTMLElement>;
    $base: JQuery<HTMLElement>;
    $overlay: JQuery<HTMLElement>;
    marker: JQuery<HTMLElement>;

    evts: WidgetEvents = null;
    alias: string;
    readonly fontPadding: number = 6;
    protected rendered?: boolean = false;

    static uuid (): string {
        return "wdg" + Utils.uuid("Wxxxx");    
    }
    /**
     * Creates an instance of the widget.
     * The widget is attached to the DOM only with the render function is invoked for the first time.
     * DOM elements are created using createHTMLElement. Handlers associated to the DOM elements are installed with installHandlers.
     * All derived class should use createHTMLElement to create additional DOM elements and installHandlers to install handlers.
     * The render function in all derived classes should start with an invocation of the render function from WidgetEVO, otherwise $div $img $base $overlay are not initialized.
     */
    constructor (id: string, coords: Coords, opt?: WidgetOptions) {
        super();
        opt = opt || {};
        opt.css = opt.css || {};
        coords = coords || {};
        this.id = id;
        this.type = opt.type || "widget";
        opt.parent = opt.parent || "body";
        this.parentSelector = (typeof opt.parent === "string") ? 
            opt.parent === "body" || opt.parent.startsWith("#") || opt.parent.startsWith(".") ? opt.parent : `#${opt.parent}`
                : null;
        this.$parent = this.sel2jquery(opt.parent);
        this.top = parseFloat(`${coords.top}`) || 0;
        this.left = parseFloat(`${coords.left}`) || 0;
        this.width = isNaN(parseFloat(`${coords.width}`)) ? 32 : parseFloat(`${coords.width}`);
        this.height = isNaN(parseFloat(`${coords.height}`)) ? 32 : parseFloat(`${coords.height}`);
        this.viz = {
            // default: always enabled/visible
            visible: opt.viz?.visible || "true",
            enabled: opt.viz?.enabled || "true"
        };

        // visual style
        const matchBorder: RegExpMatchArray = /\d+px/.exec(opt.css?.border);
        let borderWidth: number = opt["border-width"] ? parseFloat(`${opt["border-width"]}`)
            : matchBorder ? parseFloat(matchBorder[0]) 
                : 0;
        borderWidth = isNaN(borderWidth) ? 0 : borderWidth;    
        let fontSize: number = parseFloat(`${opt.css["font-size"]}`);
        fontSize = !isNaN(fontSize) && fontSize < this.height - borderWidth - this.fontPadding && fontSize > 0 
            ? fontSize
                : this.height - borderWidth - this.fontPadding;

        this.css = { ...opt.css };
        // set the initial value of some core style options if they are not provided
        this.css["background-color"] = opt.css["background-color"] || "transparent";
        this.css["font-size"] = fontSize + "px";
        this.css["font-family"] = opt.css["font-family"] || "sans-serif";
        this.css.color = opt.css.color || "white";
        this.css["text-align"] = opt.css["text-align"] || "center";
        this.css.overflow = opt.css.overflow || "visible";
        this.css["white-space"] = opt.css["white-space"] || "nowrap";
        this.css.blinking = opt.css.blinking === "true" ? "true" : undefined;
        this.css.halo = opt.css.halo || "yellow"; // this is the color of the halo shown around the widget when e.g., the mouse is over the button
        this.css["z-index"] = opt.css["z-index"] || 0;

        this.widget_template = opt.widget_template || widget_template;
    }

    protected sel2jquery (sel: string | JQuery<HTMLElement>): JQuery<HTMLElement> {
        return (typeof sel === "string") ? 
            (sel === "body" || sel.startsWith("#") || sel.startsWith(".")) ? $(sel) 
                : $(`#${sel}`)
                    : sel;
    }

    /**
     * Creates HTML elements
     */
    protected createHTMLElement (): void {
        const res: string = Handlebars.compile(this.widget_template, { noEscape: true })(this);
        if (!this.$parent[0]) {
            console.error("Error: " + this.parentSelector + " does not exist. Widget '" + this.id + "' cannot be attached to DOM :((");
        }

        this.$parent.append(res);
        this.$div = $("#" + this.id);
        this.$img = this.$div.find(".img");
        this.$base = this.$div.find(".base");
        this.$overlay = this.$div.find(".overlay");
        this.setCSS(this.css);
        this.rendered = true;
    }

    /**
     * Installs event handlers, e.g., for click events, mouse over, etc.
     */
    protected installHandlers (): void {}

    /**
     * @function <a name="render">render</a>
     * @description Basic rendering function (reveals the widget). Widgets need to override this function when rendering involves additional/different logic.
     * @memberof module:WidgetEVO
     * @instance
     */
    render (state?: Renderable, opt?: CSS): void {
        if (!this.rendered) {
            this.createHTMLElement();
            this.installHandlers();
        }
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
        if (!this.rendered) {
            this.createHTMLElement();
            this.installHandlers();
        }
        this.$div.css("display", "block");
    }

    /**
     * @function <a name="hide">hide</a>
     * @description Hides the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    hide (): void {
        if (!this.rendered) {
            this.createHTMLElement();
            this.installHandlers();
        }
        this.$div.css("display", "none");
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
        if (!this.rendered) {
            this.createHTMLElement();
            this.installHandlers();
        }
        coords = coords || {};
        // opt = normalise_options(opt);
        opt.duration = opt.duration || 0;
        opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-out";
        this.top = isNaN(parseFloat(`${coords.top}`)) ? this.top : +parseFloat(`${coords.top}`).toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY);
        this.left = isNaN(parseFloat(`${coords.left}`)) ? this.left : +parseFloat(`${coords.left}`).toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY);
        this.$div.animate({
            "top": this.top + "px",
            "left": this.left + "px",
            "transition-timing-function": opt.transitionTimingFunction
        }, +opt.duration);
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
    resize (coords: Coords, opt?: CSS): void {
        if (!this.rendered) {
            this.createHTMLElement();
            this.installHandlers();
        }
        coords = coords || {};
        opt = opt || {};
        opt.duration = opt.duration || 0;
        opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-out";
        this.height = isNaN(parseFloat(`${coords.height}`)) ? this.height : +parseFloat(`${coords.height}`).toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY);
        this.width = isNaN(parseFloat(`${coords.width}`)) ? this.width : +parseFloat(`${coords.width}`).toFixed(WidgetEVO.MAX_COORDINATES_ACCURACY);

        // update font size
        const matchBorder: RegExpMatchArray = /\d+px/.exec(opt?.border);
        let borderWidth: number = opt["border-width"] ? parseFloat(`${opt["border-width"]}`)
            : matchBorder ? parseFloat(matchBorder[0]) 
                : 0;
        borderWidth = isNaN(borderWidth) ? 0 : borderWidth;
        const fontSize: number = !isNaN(parseFloat(opt["font-size"])) && parseFloat(opt["font-size"]) < this.height - borderWidth - this.fontPadding ? 
            parseFloat(opt["font-size"]) 
                : this.height - borderWidth - this.fontPadding;
        this.css["font-size"] = fontSize + "px";

        if (opt.duration) {
            this.$div.animate({ "height": this.height + "px", "width": this.width + "px", "transition-timing-function": opt.transitionTimingFunction }, +opt.duration);
            this.$base.css("font-size", this.css["font-size"]).animate({ "line-height": this.height + "px", "height": this.height + "px", "width": this.width + "px", "transition-timing-function": opt.transitionTimingFunction }, +opt.duration);
            this.$overlay.animate({ "height": this.height + "px", "width": this.width + "px", "transition-timing-function": opt.transitionTimingFunction }, +opt.duration);
        } else {
            this.$div.css("height", this.height + "px").css("width", this.width + "px");
            this.$base.css("line-height", this.height + "px").css("height", this.height + "px").css("width", this.width + "px").css("font-size", this.css["font-size"]);
            this.$overlay.css("height", this.height + "px").css("width", this.width + "px");
        }
        this.move(coords, opt); // resize may change the top/left position of the widget
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
        if (!this.rendered) {
            this.createHTMLElement();
            this.installHandlers();
        }
        deg = (isNaN(parseFloat(`${deg}`))) ? 0 : parseFloat(`${deg}`);
        opt = opt || {};
        opt.duration = opt.duration || 0;
        opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-in";
        opt.transformOrigin = opt.transformOrigin || "center";
        this.$div.css({
            "transform": `rotate(${deg}deg)`,
            "transform-origin": opt.transformOrigin
        });
        if (opt.duration) {
            this.$div.css({ "transition": `all ${opt.duration}ms ${opt.transitionTimingFunction} 0s` });
        }
    }

    /**
     * @function <a name="remove">remove</a>
     * @description Removes the div elements of the widget from the html page -- useful to programmaticaly remove widgets from a page.
     * @memberof module:WidgetEVO
     * @instance
     */
    remove (): void {
        if (this.$div && this.$div[0]) {
            this.$div.remove();
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
    getVizExpression (): string | boolean {
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
    setCSS (style: CSS): void {
        style = style || {};
        for(const key in style) {
            // store style info
            this.css[key] = style[key];
            // update DOM
            switch (key) {
                case "z-index": {
                    this.$div.css(key, style[key]);
                    break;
                }
                case "width":
                case "height": {
                    this.$overlay.css(key, `${parseFloat(`${style[key]}`)}px`);
                    this.$base.css(key, `${parseFloat(`${style[key]}`)}px`);
                    break;
                }
                case "border-radius": {
                    this.$overlay.css(key, style[key]);
                    this.$base.css(key, style[key]);
                    break;
                }
                case "blinking": {
                    if (style[key] && style[key] !== "false") {
                        this.$base.addClass(key);
                    } else {
                        this.$base.removeClass(key);
                    }
                    break;
                }
                default: {
                    this.$base.css(key, style[key]);
                    break;
                }
            }
        }
        this.$base.css("position", "absolute"); // position of the base should always be absolute
    }

    setAttr (attr: WidgetAttr): void {
        attr = attr || {};
        for(const key in attr) {
            // store style info
            this.attr[key] = attr[key];
        }
    }

    /**
     * Returns the first attribute the widget, which is considered the widget name.
     */
    getName (): string {
        const keys: string[] = Object.keys(this.attr);
        return keys && keys.length ? this.attr[keys[0]] : "...";
    }

    /**
     * Sets the first attribute the widget, which is considered the widget name.
     * The function has no effect if the widget does not have attributes.
     */
    setName (name: string): void {
        const keys: string[] = Object.keys(this.attr);
        if (keys && keys.length) {
            this.attr[keys[0]] = name;
        }
    }

    /**
     * @function <a name="invertColors">invertColors</a>
     * @description Inverts the colors of the display (as in a negative film).
     * @memberof module:WidgetEVO
     * @instance
     */
    invertColors (): void {
        this.$base.css("background-color", this.css["font-color"]);
        this.$base.css("color", this.css["background-color"]);
    }

    isTransparent (color: string): boolean {
        return color === "transparent" || color === "rgba(0, 0, 0, 0)";
    }

    /**
     * @function <a name="select">select</a>
     * @description Selects the widget -- useful to highlight the widget programmaticaly.
     * @param opt {CSS} HTML5 attributes characterising the visual appearance of the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    select (opt?: CSS): void {
        if (!this.rendered) {
            this.createHTMLElement();
            this.installHandlers();
        }
        opt = opt || {};
        const halo: string = this.css.halo || "yellow";
        this.$base.css({
            ...this.css, 
            "background-color": dimColor(this.css["background-color"], 8),
            ...opt
        });
        if (opt.classed) { this.$base.addClass(<string> opt.classed); };
        this.$overlay.css({ "box-shadow": `0px 0px 10px ${halo}`, opacity: 1 });
    }

    /**
     * @function <a name="deselect">deselect</a>
     * @description Deselects the widget.
     * @memberof module:WidgetEVO
     * @instance
     */
    deselect (): void {
        if (!this.rendered) {
            this.createHTMLElement();
            this.installHandlers();
        }
        this.setCSS(this.css);
        this.$overlay.css({ opacity: 0 });
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

    getType (): string {
        return this.type;
    }

    getId (): string {
        return this.id;
    }

    /**
     * @param opt 
     *  - all: returns css keys even if the value is null or empty
     *  - replace: specifies pairs key-value that need to be replaced in the CSS provided as result, this is useful e.g., for replacing the parent ID indicated in a CSS
     */
    getCSS (opt?: { all?: true, replace?: CSS }): CSS {
        opt = opt || {};
        const css = opt.all ? { ...this.css, ...cssKeys } : this.css;
        const keys: string[] = Object.keys(css)?.sort((a: string, b: string): number => {
            return a < b ? -1 : 1;
        });
        if (keys && keys.length) {
            const ans: CSS = {};
            for (let i in keys) {
                const key: string = keys[i];
                if (this.css[key] || opt.all) {
                    ans[key] = opt.replace?.hasOwnProperty(key) ? opt.replace[key] 
                        : this.css[key];
                }
            }
            return ans;
        }
        return {};
    }

    getViz (): VizOptions {
        return this.viz;
    }

    getOptions (): WidgetOptions {
        return {
            css: this.getCSS(),
            viz: this.getViz(),
            ...this.getAttributes()
        };
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
    getAttributes (opt?: { nameReplace?: string, keyCode?: boolean, optionals?: string[] }): WidgetAttr {
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
            attr: this.getAttributes(),
            coords: this.getCoordinates(),
            evts: this.getEvents(),
            style: this.getCSS()
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