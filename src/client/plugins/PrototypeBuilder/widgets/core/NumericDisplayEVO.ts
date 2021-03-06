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
import { Coords, WidgetAttr, CSS, Renderable, MatchState, rat2real } from './WidgetEVO';

// typical height/width ratio for non-monospace font
const hwratio = 1.076;

export const digitsTemplate: string = `
{{#if template_description}}<!-- Template defining the visual appearance of integer and fractional part of a numeric display widget -->{{/if}}
<div class="{{type}}_whole_part" style="position:absolute; left:0px; margin-left:{{whole.margin-left}}px; width:{{whole.width}}px; height:{{whole.height}}px; {{#if whole.margin-top}}margin-top:{{whole.margin-top}};{{/if}} text-align:right; display:inline-flex;">{{#each whole.digits}}
    <div style="position:absolute; border-radius:2px;text-align:center; width:{{../whole.letter-spacing}}px; min-width:{{../whole.letter-spacing}}px; max-width:{{../whole.letter-spacing}}px; margin-left:{{margin-left}}px; font-size:{{font-size}}px;{{#if selected}} color:{{../whole.background}}; background:{{../whole.color}}; transform:scale(0.94);{{else}} color:{{../whole.color}}; background:{{../whole.background}};{{/if}}">{{val}}</div>{{/each}}
</div>

{{#if point.viz}}<div class="{{type}}_decimal_point" style="position:absolute; text-align:center; margin-left:{{point.margin-left}}px; left:{{point.left}}px; width:{{point.width}}px; min-width:{{point.width}}px; max-width:{{point.width}}px; height:{{point.height}}px; text-align:center; font-size:{{point.font-size}}px;">
&bull;</div>{{/if}}

{{#if frac.viz}}<div class="{{type}}_frac_part" style="position:absolute; left:{{frac.left}}px; width:{{frac.width}}px; height:{{frac.height}}px; {{#if frac.margin-top}}margin-top:{{frac.margin-top}};{{/if}} text-align:left; display:inline-flex;">{{#each frac.digits}}
    <div style="position:absolute; border-radius:2px; text-align:center; width:{{../frac.letter-spacing}}px; min-width:{{../frac.letter-spacing}}px; max-width:{{../frac.letter-spacing}}px; margin-left:{{margin-left}}px; font-size:{{font-size}}px;{{#if selected}} color:{{../frac.background}}; background:{{../frac.color}}{{else}} color:{{../frac.color}}; background:{{../frac.background}}{{/if}}">{{val}}</div>{{/each}}
</div>{{/if}}`;

export interface NumericDisplayOptions extends DisplayOptions {
    cursorName?: string,
    css?: NumericCSS,
    maxDecimalDigits?: number,
    maxIntegerDigits?: number,
    decimalPointOffset?: number,
    decimalFontScale?: number
};

export interface NumericCSS extends CSS {
    "decimal-font-scale"?: string
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

export const defaultDecimalFontScale: number = 0.7;

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
     * Constructor
     */
    constructor (id: string, coords: Coords, opt?: NumericDisplayOptions) {
        super(id, coords, opt);

        opt = opt || {};
        opt.css = opt.css || {};

        // override options
        this.css["background"] = (opt.css["background"] && opt.css["background"] !== "transparent") ? opt.css["background"] : "black";

        // invoke BasicDisplayEVO constructor to create the widget
        // super.createHTMLElement();
        
        // add widget-specific style attributes
        this.letterSpacing = parseFloat(this.css["font-size"]) || 1;
        const decimalFontScale: number = opt.decimalFontScale || 0.7;

        this.css["decimal-font-scale"] = opt.css["decimal-font-scale"] || decimalFontScale;
        const decimalLetterSpacing: number = this.getDecimalFontSpacing();

        this.maxDecimalDigits = isNaN(parseInt(`${opt.maxDecimalDigits}`)) ? 2 : parseInt(`${opt.maxDecimalDigits}`);
        this.maxIntegerDigits = isNaN(parseInt(`${opt.maxIntegerDigits}`)) ? 
            Math.floor((this.width - this.maxDecimalDigits * decimalLetterSpacing) / this.letterSpacing)
                : parseInt(`${opt.maxIntegerDigits}`);
        this.decimalPointOffset = opt.decimalPointOffset || 0;

        // set widget keys
        this.attr.cursorName = opt.cursorName || "";
    }

    /**
     * Renders the widget
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
                        cursorPos: NaN
                    };
            
                    const dispName: string = this.attr.displayName;
                    const matchDisp: MatchState = this.matchState(state, dispName);
                    if (matchDisp) {
                        // check if this is a rational number
                        const val: number = rat2real(matchDisp.val);
                        if (!isNaN(val)) {
                            data.point = `${val}`.indexOf(".") >= 0;
                            this.updateDisplayData(data, `${val}`);
                        } else {
                            // render state attribute value
                            this.updateDisplayData(data, matchDisp.val);
                        }                        
                    }

                    if (this.attr.cursorName) {
                        const cursName: string = <string> opt.cursorName || this.attr.cursorName;
                        const matchCurs: MatchState = this.matchState(state, cursName);
                        if (matchDisp) {
                            // update cursor data
                            this.updateCursorData(data, matchCurs.val);
                        }
                    } else {
                        data.cursorPos = NaN;
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

    /**
     * Internal function, sets the basic style options.
     * Overrides the standard function provided by widget, because 'decimal-font-scale' needs to be added to the css
     */
    protected setCSS (style: NumericCSS): void {
        super.setCSS(style);
        this.css["decimal-font-scale"] = style["decimal-font-scale"];
    }

    /**
     * Internal function, computes the decimal font size
     * @returns 
     */
    protected getDecimalFontSize (): number {
        const fontSize: number = parseFloat(`${this.css["font-size"]}`);
        let decimalFontScale: number = parseFloat(`${this.css["decimal-font-scale"]}`);
        decimalFontScale = isNaN(decimalFontScale) ? defaultDecimalFontScale : decimalFontScale;
        const decimalFontSize: number = fontSize * decimalFontScale;
        return decimalFontSize;
    }
    /**
     * Internal function, computes font spacing for decimal digits
     */
    protected getDecimalFontSpacing (): number {
        return hwratio * this.getDecimalFontSize();
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
            const decimalFontSize: number = this.getDecimalFontSize();
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
                    data.whole[data.whole.length - 1 - data.cursorPos]["font-size"] *= hwratio;
                } else { // introduce leading zeros
                    data.whole_zeropadding = new Array(data.cursorPos - (data.whole.length - 1)).fill({
                        val: "0", selected: false, "font-size": parseFloat(`${this.css["font-size"]}`)
                    });
                    data.whole_zeropadding[0] = {
                        val: "0", selected: true, "font-size": parseFloat(`${this.css["font-size"]}`) * hwratio
                    };
                }
            } else if (data.cursorPos < 0) {
                if (-(data.cursorPos + 1) < data.frac.length) {
                    data.frac[-(data.cursorPos + 1)].selected = true;
                } else { // introduce trailing zeros and the decimal point
                    const decimalFontSize: number = this.getDecimalFontSize();
                    data.frac_zeropadding = new Array(-data.cursorPos - data.frac.length).fill({
                        val: "0", selected: false, "font-size": decimalFontSize
                    });
                    data.frac_zeropadding[data.frac_zeropadding.length - 1] = {
                        val: "0", selected: true, "font-size": decimalFontSize
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
            "font-size": this.getDecimalFontSize().toFixed(2),
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
            "background": this.css["background"],
            "margin-left": ((data.max_integer_digits - data.whole.length - data.whole_zeropadding.length) * this.letterSpacing).toFixed(2)
        };
        const frac_digits: { val: string, selected: boolean, "font-size": number }[] = data.frac.concat(data.frac_zeropadding);
        const frac_style = {
            digits: frac_digits,
            width: ((data.max_decimal_digits) * this.getDecimalFontSpacing()).toFixed(2),
            height: this.height - 2 * borderWidth,
            "margin-top": `${-(borderWidth / 2)}px`,
            left: (parseFloat(point_style.left) + parseFloat(point_style.width)).toFixed(2),
            "letter-spacing": this.getDecimalFontSpacing().toFixed(2),
            color: this.css.color,
            "background": this.css["background"],
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
        this.applyCSS({ ...this.css, ...opt }); // opt overrides this.css
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