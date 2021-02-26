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

import { BasicDisplayEVO, DisplayAttr, DisplayOptions } from './BasicDisplayEVO';
import { Coords, WidgetAttr, CSS, Renderable, MatchState } from './WidgetEVO';

const selectedFontSize = 1.076; // ratio selectedFont/normalFont for integer digits

export const digitsTemplate: string = `
{{#if template_description}}<!-- Template defining the visual appearance of integer and fractional part of a numeric display widget -->{{/if}}
<div class="{{type}}_whole_part" style="position:absolute; left:0px; margin-left:{{whole.margin-left}}px; width:{{whole.width}}px; height:{{whole.height}}px; {{#if whole.margin-top}}margin-top:{{whole.margin-top}};{{/if}} text-align:right; display:inline-flex;">{{#each whole.digits}}
    <div style="position:absolute; border-radius:2px;text-align:center; width:{{../whole.letter-spacing}}px; min-width:{{../whole.letter-spacing}}px; max-width:{{../whole.letter-spacing}}px; margin-left:{{margin-left}}px; font-size:{{font-size}}px;{{#if selected}} color:{{../whole.background-color}}; background-color:{{../whole.color}}; transform:scale(0.94);{{else}} color:{{../whole.color}}; background-color:{{../whole.background-color}};{{/if}}">{{val}}</div>{{/each}}
</div>

{{#if point.viz}}<div class="{{type}}_decimal_point" style="position:absolute; text-align:center; margin-left:{{point.margin-left}}px; left:{{point.left}}px; width:{{point.width}}px; min-width:{{point.width}}px; max-width:{{point.width}}px; height:{{point.height}}px; text-align:center; font-size:{{point.font-size}}px;">
&bull;</div>{{/if}}

{{#if frac.viz}}<div class="{{type}}_frac_part" style="position:absolute; left:{{frac.left}}px; width:{{frac.width}}px; height:{{frac.height}}px; {{#if frac.margin-top}}margin-top:{{frac.margin-top}};{{/if}} text-align:left; display:inline-flex;">{{#each frac.digits}}
    <div style="position:absolute; border-radius:2px; text-align:center; width:{{../frac.letter-spacing}}px; min-width:{{../frac.letter-spacing}}px; max-width:{{../frac.letter-spacing}}px; margin-left:{{margin-left}}px; font-size:{{font-size}}px;{{#if selected}} color:{{../frac.background-color}}; background-color:{{../frac.color}}{{else}} color:{{../frac.color}}; background-color:{{../frac.background-color}}{{/if}}">{{val}}</div>{{/each}}
</div>{{/if}}`;

export interface NumericDisplayOptions extends DisplayOptions {
    cursorName?: string,
    css?: NumericCSS,
    maxDecimalDigits?: number,
    maxIntegerDigits?: number,
    decimalPointOffset?: number,
    decimalFontRatio?: number
};

export interface NumericCSS extends CSS {
    "decimal-font-size"?: string,
    "decimal-letter-spacing"?: string
};

export interface NumericAttr extends DisplayAttr {
    cursorName: string
};

interface NumericDisplayData {
    whole: { val: string, selected: boolean, "font-size": number }[], 
    frac: { val: string, selected: boolean, "font-size": number }[],
    point: boolean,
    whole_zeropadding: { val: string, selected: boolean, "font-size": number }[], 
    frac_zeropadding: { val: string, selected: boolean, "font-size": number }[],
    max_integer_digits: number,
    max_decimal_digits: number,
    cursorPos: number      
};

export class NumericDisplayEVO extends BasicDisplayEVO {
    static readonly constructorName: string = "NumericDisplayEVO";
    getConstructorName (): string {
        return NumericDisplayEVO.constructorName;
    }

    protected attr: NumericAttr;

    protected maxDecimalDigits: number;
    protected maxIntegerDigits: number;
    protected decimalPointOffset: number;

    protected letterSpacing: number;

    /**
     * @function <a name="NumericDisplayEVO">NumericDisplayEVO</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget area.
     *        Default is { top: 0, left: 0, width: 32, height: 20 }.
     * @param opt {Object} Style options defining the visual appearance of the widget.
     *                     Options can be given either as standard html style attributes or using the following widget attributes:
     *          <li>align (String): text align: "center", "right", "left", "justify" (default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is black, "transparent")</li>
     *          <li>blinking (bool): whether the button is blinking (default is false, i.e., does not blink)</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default is "steelblue")</li>
     *          <li>borderRadius (Number|String): border radius, must be a number or a valid HTML5 border radius, e.g., 2, "2px", etc. (default is 0, i.e., square border)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>cursorName (String): name of the state attribute defining the cursor position. Default is empty string, i.e., cursor is disabled.</li>
     *          <li>decimalPointOffset (Number): offset for the decimal point position (default is 0, i.e., the decimal point is placed at the center of the display)</li>
     *          <li>decimalFontSize (Number): decimal font size (default is opt.fontSize * 0.8)</li>
     *          <li>decimalLetterSpacing (Number): fixed letter spacing for decimal digits (default: opt.decimalFontSize * 0.8).</li>
     *          <li>displayName (String): name of the state attribute defining the display content. Default is the ID of the widget.</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>letterSpacing (Number): fixed letter spacing (default: opt.fontSize * 0.8).</li>
     *          <li>maxIntegerDigits (Number): max digits of the whole part of the display (default is Math.floor(0.75 * coords.width / opt.letterSpacing)).</li>
     *          <li>maxDecimalDigits (Number): max digits of the fractional part of the display (default is Math.floor(0.25 * coords.width / opt.decimalLetterSpacing)).</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>position (String): standard HTML position attribute indicating the position of the widget with respect to the parent, e.g., "relative", "absolute" (default is "absolute")</li>
     *          <li>visibleWhen (String): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     *                  The following additional attribute links the display widget to a specific state attribute of a model:
     * @memberof module:NumericDisplayEVO
     * @instance
     */
    constructor (id: string, coords: Coords, opt?: NumericDisplayOptions) {
        super(id, coords, opt);

        opt = opt || {};
        opt.css = opt.css || {};

        // override options
        this.css["background-color"] = (opt.css["background-color"] && opt.css["background-color"] !== "transparent") ? opt.css["background-color"] : "black";

        // invoke BasicDisplayEVO constructor to create the widget
        // super.createHTMLElement();
        
        // add widget-specific style attributes
        this.letterSpacing = parseFloat(this.css["font-size"]) || 1;
        const decimalFontRatio: number = opt.decimalFontRatio || 0.7;
        this.css["decimal-font-size"] = opt.css["decimal-font-size"] || `${parseFloat(this.css["font-size"]) * decimalFontRatio}px`;
        const decimalLetterSpacing: number = parseFloat(this.css["decimal-font-size"]) * 0.8;
        this.css["decimal-letter-spacing"] = opt.css["decimal-letter-spacing"] || `${decimalLetterSpacing}px`;

        this.maxDecimalDigits = isNaN(parseInt(`${opt.maxDecimalDigits}`)) ? 2 : parseInt(`${opt.maxDecimalDigits}`);
        this.maxIntegerDigits = isNaN(parseInt(`${opt.maxIntegerDigits}`)) ? 
            Math.floor((this.width - this.maxDecimalDigits * decimalLetterSpacing) / this.letterSpacing)
                : parseInt(`${opt.maxIntegerDigits}`);
        this.decimalPointOffset = opt.decimalPointOffset || 0;

        // set widget keys
        this.attr.cursorName = opt.cursorName || "";
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
     *          <li>borderRadius (Number|String): border radius, must be a number or a valid HTML5 border radius, e.g., 2, "2px", etc. (default is 0, i.e., square border)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid", "dotted", "dashed", etc. (default is "none")</li>
     *          <li>borderWidth (Number): border width (if option borderColor !== null then the default border is 2px, otherwise 0px, i.e., no border)</li>
     *          <li>cursorName (String): name of the state attribute defining the cursor position. Default is empty string, i.e., cursor is disabled.</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontSize (Number): font size (default is (coords.height - opt.borderWidth) / 2 )</li>
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     * @memberof module:NumericDisplayEVO
     * @instance
     */
    render (state?: Renderable, opt?: NumericCSS): void {
        opt = opt || {};
        console.log(`[NumericDisplay] rendering state`, state);
        // create the html element
        super.render();
        // update style
        const borderWidth: number = this.updateDisplayStyle(opt);
        // reveal the widget
        this.reveal();
        // render the content if state is non-null
        if (state) {
            // check if the state contains a field named after the widget
            if (this.matchStateFlag) {
                if (typeof state === "string") {

                    const data: NumericDisplayData = {
                        whole: [], 
                        frac: [],
                        point: (state.indexOf(".") >= 0),
                        whole_zeropadding: [],
                        frac_zeropadding: [],
                        max_integer_digits: this.maxIntegerDigits,
                        max_decimal_digits: this.maxDecimalDigits,
                        cursorPos: 0
                    };
            
                    const dispName: string = this.attr.displayName;
                    const matchDisp: MatchState = this.matchState(state, dispName);
                    if (matchDisp) {
                        // update display data
                        this.updateDisplayData(data, matchDisp.val);
                    }

                    const cursName: string = <string> opt.cursorName || this.attr.cursorName;
                    const matchCurs: MatchState = this.matchState(state, cursName);
                    if (matchDisp) {
                        // update cursor data
                        this.updateCursorData(data, matchCurs.val);
                    }

                    // render data
                    this.renderData(data, borderWidth);
                }
            } else {
                // render string or number
                this.$base.html(`${state}`);
            }   
        }
    }

    protected updateDisplayData (data: NumericDisplayData, val: string): void {
        let parts: string[] = val.split(".");

        const fontSize: number = parseFloat(`${this.css["font-size"]}`);
        data.whole = parts[0].split("").map((d: string, index: number) => {
            return { 
                val: d, 
                selected: false, 
                "font-size": fontSize,
                "margin-left": index * this.letterSpacing
            };
        });
        if (parts.length > 1) {
            const decimalFontSize: number = parseFloat(`${this.css["decimal-font-size"]}`);
            data.frac = parts[1].split("").map((d: string, index: number) => {
                return { 
                    val: d, 
                    selected: false, 
                    "font-size": decimalFontSize,
                    "margin-left": index * this.letterSpacing
                };
            });
        }
    }

    protected updateCursorData (data: NumericDisplayData, val: string): void {
        const cursorPos: number = parseInt(val);
        if (!isNaN(cursorPos)) {
            if (data.cursorPos >= 0) {
                if (data.cursorPos < data.whole.length) {
                    data.whole[data.whole.length - 1 - data.cursorPos].selected = true;
                    data.whole[data.whole.length - 1 - data.cursorPos]["font-size"] *= selectedFontSize;
                } else { // introduce leading zeros
                    data.whole_zeropadding = new Array(data.cursorPos - (data.whole.length - 1)).fill({
                        val: "0", selected: false, "font-size": parseFloat(`${this.css["font-size"]}`)
                    });
                    data.whole_zeropadding[0] = {
                        val: "0", selected: true, "font-size": parseFloat(`${this.css["font-size"]}`) * selectedFontSize
                    };
                }
            } else if (data.cursorPos < 0) {
                if (-(data.cursorPos + 1) < data.frac.length) {
                    data.frac[-(data.cursorPos + 1)].selected = true;
                } else { // introduce trailing zeros and the decimal point
                    data.frac_zeropadding = new Array(-data.cursorPos - data.frac.length).fill({
                        val: "0", selected: false, "font-size": parseFloat(`${this.css["decimal-font-size"]}`)
                    });
                    data.frac_zeropadding[data.frac_zeropadding.length - 1] = {
                        val: "0", selected: true, "font-size": parseFloat(`${this.css["decimal-font-size"]}`)
                    };
                    data.point = true;
                }
            }
        }
    }

    protected renderData (data: NumericDisplayData, borderWidth: number): void {
        const point_style = {
            left: ((data.max_integer_digits) * this.letterSpacing + (this.decimalPointOffset)).toFixed(2),
            width: (this.letterSpacing / 2).toFixed(2),
            height: this.height - 2 * borderWidth,
            "margin-left": (-this.letterSpacing / 32).toFixed(2),
            "font-size": parseFloat(`${this.css["decimal-font-size"]}`).toFixed(2),
            viz: data.point
        };
        const whole_style = {
            digits: data.whole_zeropadding.concat(data.whole),
            width: (data.max_integer_digits) * this.letterSpacing,
            height: this.height - 2 * borderWidth,
            "margin-top": `${-borderWidth}px`,
            left: parseFloat(point_style.left) - parseFloat(point_style.width),
            "letter-spacing": this.letterSpacing.toFixed(2),
            color: this.css.color,
            "background-color": this.css["background-color"],
            "margin-left": ((data.max_integer_digits - data.whole.length - data.whole_zeropadding.length) * this.letterSpacing).toFixed(2)
        };
        const frac_digits: { val: string, selected: boolean, "font-size": number }[] = data.frac.concat(data.frac_zeropadding);
        const frac_style = {
            digits: frac_digits,
            width: ((data.max_decimal_digits) * parseFloat(`${this.css["decimal-letter-spacing"]}`)).toFixed(2),
            height: this.height - 2 * borderWidth,
            "margin-top": `${-(borderWidth / 2)}px`,
            left: (parseFloat(point_style.left) + parseFloat(point_style.width)).toFixed(2),
            "letter-spacing": parseFloat(`${this.css["decimal-letter-spacing"]}`).toFixed(2),
            color: this.css.color,
            "background-color": this.css["background-color"],
            viz: (frac_digits.length > 0)
        };
        //  console.log(frac_style);
        const dom = Handlebars.compile(digitsTemplate, { noEscape: true })({
            type: NumericDisplayEVO.constructorName,
            whole: whole_style,
            frac: frac_style,
            point: point_style
        });
        this.$base.empty();
        this.$base.append(dom).css("line-height", `${this.height}px`);
    }
    /**
     * Internal function, updates the display style
     * @param opt 
     * @returns The border width
     */
    protected updateDisplayStyle (opt?: CSS): number {
        this.setCSS({ ...this.css, ...opt }); // opt overrides this.css
        const matchBorder: RegExpMatchArray = opt?.css && opt.css["border"] ? /\d+px/.exec(opt.css["border"]) : null;
        let borderWidth: number = opt["border-width"] ? parseFloat(`${opt["border-width"]}`)
            : matchBorder ? parseFloat(matchBorder[0]) 
                : 0;    
        borderWidth = isNaN(borderWidth) ? 0 : borderWidth;
        return borderWidth;
    }

    /**
     * @function <a name="renderSample">renderSample</a>
     * @description Version of the render function that demonstrates the functionalities of the widget.
     * @memberof module:NumericDisplayEVO
     * @instance
     */
    renderSample (): void {
        let st = {};
        st[this.attr.displayName] = "123.4";
        st["demoCursor"] = 2;
        this.render(JSON.stringify(st), { cursorName: "demoCursor" });
    }

    getDescription (): string {
        return `Enhances the visibility of digits, and provides a cursor for highlighing digits.`;
    }

    // @override
    getAttributes (opt?: { nameReplace?: string, keyCode?: boolean, optionals?: string[] }): WidgetAttr {
        opt = opt || {};
        opt.optionals = opt.optionals || [];
        opt.optionals = opt.optionals.concat([ "cursorName" ]);
        return super.getAttributes(opt);
    }

}