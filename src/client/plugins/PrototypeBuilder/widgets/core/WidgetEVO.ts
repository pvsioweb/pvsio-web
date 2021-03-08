/**
 * @module WidgetEVO
 * @version 1.0
 * @description Base class for EVO widgets.
 * @author Paolo Masci
 * @date Dec 11, 2017
 *
 */

import * as parserUtils from '../../../../utils/parserUtils';
import * as utils from '../../../../utils/pvsiowebUtils';
import { dimColor } from "../../../../utils/pvsiowebUtils";
import { Connection, PVSioWebCallBack } from "../../../../env/Connection";
import * as Backbone from 'backbone';

/**
 * Note: the css of all divs in the templates must indicate "position:absolute" otherwise z-index is not used by the browser, and coordinates are automatically re-arranged by the browser
 */
export const widget_template: string = `
{{#if template_description}}<!--
    Basic widget template. Provides a base layer for rendering the visual appearance of the widget
    The widget has the following layers:
      - an outer div layer defining position and size of the widget
      - an inner base layer renders the visual appearance
      - an inner img layer renders images
      - an inner transparent overlay layer captures user interactions with the widget -->{{/if}}
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:{{css.z-index}}; overflow:{{css.overflow}};"
    class="{{type}} noselect {{#if css.class}}{{class}}{{/if}}">
    <div id="{{id}}_base"
        style="position:absolute; top:0; width:{{width}}px; height:{{height}}px; {{#each css}} {{@key}}:{{this}};{{/each}}"
        class="base"></div>
    <div id="{{id}}_img"
        style="position:absolute; top:0;"
        class="img"></div>
    <div id="{{id}}_overlay"
        style="position:absolute; top:0; left:0; width:{{width}}px; height:{{height}}px; {{#if css.z-index}}z-index:{{css.z-index}};{{/if}} border-radius:{{css.border-radius}}; cursor:{{css.cursor}}; opacity:0;"
        class="overlay"></div>
</div>`;

export const img_template: string = `
{{#if template_description}}<!-- Template for embedding an image in a div -->{{/if}}
{{#if img}}<img src="{{img}}" style="user-select:none; position:absolute; opacity:{{opacity}}; transform-origin:{{transformOrigin}};">{{/if}}
{{#if svg}}{{svg}}{{/if}}
`;
export type Renderable = string | number;
export type Coords<T = string | number> = { top?: T, left?: T, width?: T, height?: T };

// keys and type
export const cssKeys = {
    position: [ "absolute", "relative" ],
    cursor: [ "string" ],
    "background": [ "string" ],
    "font-size": [ "string" ],
    "font-family": [ "string" ],

    color: [ "string" ],
    "text-align": [ "string" ],
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

    class: [ "string" ],
    "box-shadow": [ "string" ]
};

export interface CSSx { key: string, value: string, hints?: string[] };

export interface CSS {
    position?: "absolute" | "relative",
    cursor?: string,
    "background"?: string,
    "font-size"?: string,
    "font-family"?: string,

    color?: string,
    "text-align"?: string,
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

    // css class
    class?: string,

    // css box-shadow
    "box-shadow"?: string,

    // animation options
    duration?: number,
    rotation?: string,
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
    callback?: PVSioWebCallBack,
    connection?: Connection
};
export type VizOptions =  {
    visible?: string | boolean,
    enabled?: string | boolean
};
// widget events
export enum WidgetEvent {
    press = "press",
    release = "release",
    click = "click",
    dblclick = "dblclick",
    rotate = "rotate",
    move = "move"
};
export type WidgetEventData = {
    evt: WidgetEvent,
    fun: string // name of the prototype function to be invoked when a given event is triggered
};
export type WidgetEventsMap = { [evt in WidgetEvent]?: boolean };
export type WidgetAttr = {
    [key: string]: string
};
export interface HotspotData {
    id: string,
    coords: Coords
};
export interface WidgetData extends HotspotData {
    name: string,
    kind: string,
    cons?: string, // constructor name
    opt?: WidgetOptions,
    evts?: string[]
};

// regexp for rational number
export const ratNumber: string = `[\\+\\-]?\\d+\/\\d+`;
export const ratNumberMatch: string = `([\\+\\-]?\\d+)\/(\\d+)`;
export function rat2real (rat: string): number {
    if (rat !== undefined && rat !== null) {
        const match: RegExpMatchArray = new RegExp(ratNumberMatch).exec(rat);
        if (match && match.length > 2 && !isNaN(+match[1]) && !isNaN(+match[2]) && +match[2] !== 0) {
            return +match[1] / +match[2];
        }
        return +rat;
    }
    return NaN;
}

// regexp for quick parsing of state information
// group 1 captures state attribute name
// group 2 captures state attribute value
export function getStateRegexSource (name: string): string[] {
    return [
        // pvs syntax
        `(${name})\\s*:=\\s*(${ratNumber})`, // e.g. (# disp_2 := 4/3 #)
        `(${name})\\s*:=\\s*([\\-\\+\\w\\.]+)`, // e.g. (# disp_2 := 4.1, c := -2 #)
        `(${name})\\s*:=\\s*\\"([^\\"]*)\\"`, // e.g., (# disp4 := "asd" #)
        // equivalent json syntax
        `\\"(${name})\\"\\s*:\\s*([\\-\\+\\w\\.]+)`, // e.g., { "disp1" : 4.1 }
        `\\"(${name})\"\\s*:\s*\\"([^\\"]*)\\"` // e.g., { "disp_3" : "asd" }
    ];
}

export interface MatchState {
    name: string,
    val: string
};

export abstract class WidgetEVO extends Backbone.Model {
    static readonly MAX_COORDINATES_ACCURACY: number = 0; // max 0 decimal digits for coordinates, i.e., position accuracy is 1px
    readonly widget: boolean = true; // this is used in the playback player to recognize widgets. TODO: remove this attribute.

    protected attr: WidgetAttr = {};
    protected kind: string = "widget"; // e.g., display, button, dial.. useful for grouping together similar widgets. This attribute will be overridden by concrete classes.

    id: string;

    /**
     * matchStateFlag regulates the behavior of the render function
     * If matchStateFlag is true, then the information passed to the render function is treated as a state, 
     * and the widget tries to find if there's a state attribute that matches the widget name
     * if such state attributes is found, then the widget renders the corresponding value of the attribute
     * otherwise the widget keeps the previous state
     */
    protected matchStateFlag: boolean = true;

    protected $parent: JQuery<HTMLElement>;
    protected parentSelector: string; // this is useful for debugging purposes
    
    protected top: number;
    protected left: number;
    protected width: number;
    protected height: number;
    
    protected viz: VizOptions = {};
    protected css: CSS = {};

    protected widget_template: string;

    protected $div: JQuery<HTMLDivElement>;
    protected $img: JQuery<HTMLElement>;
    protected $base: JQuery<HTMLElement>;
    protected $overlay: JQuery<HTMLElement>;
    protected marker: JQuery<HTMLElement>;

    protected evts: WidgetEventsMap = null;
    readonly fontPadding: number = 6;
    protected rendered?: boolean = false;

    // constructor name -- this is used for dynamic loading of widgets
    static readonly constructorName: string = "WidgetEVO";
    // the following method needs to be overridden in all descendant classes
    abstract getConstructorName (): string

    /**
     * Utility function, tries to match the widget name with state attributes
     * If a match is found, the function returns a data structure { name: string, val: string }
     * Otherwise, the function returns null
     * @param state State information
     * @param name the attribute to be matched
     */
    matchState (state: string, name?: string): MatchState | null {
        if (state) {
            name = name || this.getName();
            if (name) {
                const regexSrc: string[] = getStateRegexSource(name);
                for (let i = 0; i < regexSrc.length; i++) {
                    const match: RegExpMatchArray = new RegExp(regexSrc[i], "g").exec(state);
                    if (match && match.length > 2) {
                        return {
                            name,
                            val: match[2]
                        };
                    }
                }
            }
        }
        return null;
    }

    /**
     * Sets matchStateFlag
     * @param flag 
     */
    setMatchStateFlag (flag: boolean): void {
        this.matchStateFlag = !!flag;
    }
    
    /**
     * Utility function, returns a unique ID in the format wdgW1234
     */
    static uuid (): string {
        return "wdg" + utils.uuid("Wxxxx");
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
        opt.parent = opt.parent || "body";
        opt.css = opt.css || {};
        coords = coords || {};
        this.id = id;
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
        fontSize = !isNaN(fontSize) ? fontSize : this.height - borderWidth - this.fontPadding;

        // save css style
        this.setCSS(opt.css);

        // set the initial value of some core style options if they are not provided
        this.css["background"] = opt.css["background"] || "transparent";
        this.css["font-size"] = fontSize + "px";
        this.css["font-family"] = opt.css["font-family"] || "sans-serif";
        this.css.color = opt.css.color || "white";
        this.css["text-align"] = opt.css["text-align"] || "center";
        this.css.overflow = opt.css.overflow || "visible";
        this.css["white-space"] = opt.css["white-space"] || "nowrap";
        this.css["box-shadow"] = opt.css["box-shadow"] || "yellow"; // this is the color of the halo shown around the widget when e.g., the mouse is over the button
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
        this.applyCSS(this.css);
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
    abstract renderSample (opt?: CSS): void;

    /**
     * Returns a description of the widget, e.g., display for text and numbers, touchscreen, button, etc
     */
    abstract getDescription (): string;

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
     * Changes the size of the widget according to the width and height given as parameter.
     * @param coords Width and height indicating the new size of the widget. The coordinates are given in the form { width: (number), height: (number) }
     * @param opt Options
     *  - duration (Number): duration in milliseconds of the move transition (default is 0, i.e., instantaneous)
     *  - transitionTimingFunction (String): HTML5 timing function (default is "ease-out")
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

        // don't touch font-size
        // const fontSize: number = !isNaN(parseFloat(opt["font-size"])) && parseFloat(opt["font-size"]) < this.height - borderWidth - this.fontPadding ? 
        //     parseFloat(opt["font-size"]) 
        //         : this.height - borderWidth - this.fontPadding;
        // this.css["font-size"] = fontSize + "px";

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
     * Evaluates the visibility of the widget based 
     * on the state attrbutes (passed as function parameter) and the expression stored in this.visibleWhen
     * @instance
     */
    evalViz (state: Renderable): boolean {
        const expr: { res: parserUtils.SimpleExpression, err?: string } = parserUtils.simpleExpressionParser(this.viz?.visible);
        if (expr && expr.res && expr.res.type === "constexpr") {
            const ans: boolean = expr.res.constant === "true"
            return ans;
        }
        if (typeof state === "string") {
            if (expr && expr.res && expr.res.type === "boolexpr" && expr.res.binop) {
                const match: MatchState = this.matchState(state, expr.res.attr);
                if (match) {
                    let str: string = match.val;
                    if (str) {
                        str = parserUtils.evaluate(str);                        
                        if ((expr.res.binop === "=" && str === expr.res.constant)
                                || (expr.res.binop === "!=" && str !== expr.res.constant)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        return true;
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
            var disp = parserUtils.resolveAttribute (state, attr);
            if (disp !== null && disp !== undefined) {
                return parserUtils.evaluate(disp).replace(new RegExp("\"", "g"), "");
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
     * Internal function, sets the basic style options.
     * This function is typically used in the constructor.
     * If a widget class introduces additional options, this function needs to be overridden (e.g., see NumericDisplay). 
     */
    protected setCSS (style: CSS): void {
        this.css = {};
        for(const key in cssKeys) {
            // store style info
            this.css[key] = style[key];
        }
    }

    /**
     * Updates the style options.
     */
     updateCSS (style: CSS): void {
        if (style) {
            for(let key in style) {
                if (style[key] !== undefined) {
                    // store style info
                    this.css[key] = style[key];
                }
            }
        }
    }

    /**
     * Internal function, applies the given style options to the html
     */
    protected applyCSS (style: CSS): void {
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
                case "class": {
                    // replace css class for the base layer
                    this.$base[0].className = "base"; // the empty class for the base layer is "base"
                    this.$base.addClass(style[key]);
                    break;
                }
                case "cursor": {
                    this.$overlay.css({ cursor: style[key]});
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

    /**
     * Sets a new value for a given attribute
     * @param attr 
     */
    setAttr (attr: WidgetAttr): void {
        attr = attr || {};
        for (const key in attr) {
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
     * Returns the widget kind, useful for grouping together similar widgets.
     */
    getKind (): string {
        return this.kind || "widget";
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
        this.$base.css("background", this.css["font-color"]);
        this.$base.css("color", this.css["background"]);
    }

    /**
     * Utility function, checks if the given color is transparent
     * @param color 
     */
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
        const boxShadow: string = this.css["box-shadow"] || "0px 0px 10px yellow";
        this.$base.css({
            ...this.css, 
            "background": dimColor(this.css["background"], 8),
            ...opt
        });
        const cssClass: string = opt.class || this.css.class; 
        if (cssClass) { this.$base.addClass(cssClass); };
        this.$overlay.css({ "box-shadow": boxShadow, opacity: 1 });
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
        this.applyCSS(this.css);
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

    getId (): string {
        return this.id;
    }

    /**
     * @param opt 
     *  - all: returns css keys even if the value is null or empty
     *  - replace: specifies pairs key-value that need to be replaced in the CSS provided as result, this is useful e.g., for replacing attribute 'parent' included in the css style
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

    /**
     * Returns extended css information, which includes hints for values, which can be useful for auto-completion engines
     */
    getCSSx (): CSSx[] {
        const keys: string[] = Object.keys({ ...this.css, ...cssKeys })?.sort((a: string, b: string): number => {
            return a < b ? -1 : 1;
        });
        if (keys && keys.length) {
            const ans: CSSx[] = [];
            for (let i in keys) {
                const key: string = keys[i];
                const value: string = <string> this.css[key];
                const hints: string[] =
                    key === "class" ? utils.animateCssClasses 
                    : key === "background" || key === "color" ? Object.keys(utils.cssColors) 
                    : key === "cursor" ? utils.cssCursorClasses
                    : undefined;
                ans.push({ key, value, hints });
            }
            return ans;
        }
        return [];
    }

    /**
     * Get visibility status
     */
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

    /**
     * Returns a JSON representation of the characteristics of the widget
     */
    toJSON (): WidgetData {
        return {
            id: this.id,
            coords: this.getCoordinates(),
            name: this.getName(),
            kind: this.kind,
            cons: this.getConstructorName(),
            opt: this.getOptions(),
            evts: this.getEvents()
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