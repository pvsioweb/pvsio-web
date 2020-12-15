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

import { BasicDisplayEVO, DisplayOptions } from './BasicDisplayEVO';
import { Coords } from './WidgetEVO';

const selectedFontSize = 1.076; // ratio selectedFont/normalFont for integer digits

export const digitsTemplate: string = `
{{#if template_description}}<!-- Template defining the visual appearance of integer and fractional part of a numeric display widget -->{{/if}}
<div class="{{type}}_whole_part" style="position:absolute; left:0px; margin-left:{{whole.margin-left}}px; width:{{whole.width}}px; height:{{whole.height}}px; {{#if whole.margin-top}}margin-top:{{whole.margin-top}};{{/if}} text-align:right; display:inline-flex;">{{#each whole.digits}}
    <div style="border-radius:2px;text-align:center; width:{{../whole.letter-spacing}}px; min-width:{{../whole.letter-spacing}}px; max-width:{{../whole.letter-spacing}}px; font-size:{{font-size}}pt;{{#if selected}} color:{{../whole.background-color}}; background-color:{{../whole.color}}; transform:scale(0.94); transform-origin:bottom;{{else}} color:{{../whole.color}}; background-color:{{../whole.background-color}};{{/if}}">{{val}}</div>{{/each}}
</div>

{{#if point.viz}}<div class="{{type}}_decimal_point" style="position:absolute; text-align:center; margin-left:{{point.margin-left}}px; left:{{point.left}}px; width:{{point.width}}px; min-width:{{point.width}}px; max-width:{{point.width}}px; height:{{point.height}}px; text-align:center; font-size:{{point.font-size}}pt;">
&bull;</div>{{/if}}

{{#if frac.viz}}<div class="{{type}}_frac_part" style="position:absolute; left:{{frac.left}}px; width:{{frac.width}}px; height:{{frac.height}}px; {{#if frac.margin-top}}margin-top:{{frac.margin-top}};{{/if}} text-align:left; display:inline-flex;">{{#each frac.digits}}
    <div style="border-radius:2px; text-align:center; width:{{../frac.letter-spacing}}px; min-width:{{../frac.letter-spacing}}px; max-width:{{../frac.letter-spacing}}px; font-size:{{font-size}}pt;{{#if selected}} color:{{../frac.background-color}}; background-color:{{../frac.color}}{{else}} color:{{../frac.color}}; background-color:{{../frac.background-color}}{{/if}}">{{val}}</div>{{/each}}
</div>{{/if}}`;

export interface NumericDisplayOptions extends DisplayOptions, NumericDisplayStyle {
    cursorName?: string,
};

export interface NumericDisplayStyle {
    decimalFontSize?: number | string,
    decimalLetterSpacing?: number | string,
    maxDecimalDigits?: number,
    maxIntegerDigits?: number
    decimalPointOffset?: number
}

export class NumericDisplayEVO extends BasicDisplayEVO {

    protected maxDecimalDigits: number;
    protected maxIntegerDigits: number;
    protected decimalPointOffset: number;


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

        // override options
        this.type = opt.type || "numericdisplay";
        this.style["background-color"] = (opt.backgroundColor && opt.backgroundColor !== "transparent") ? opt.backgroundColor : "black";

        // invoke BasicDisplayEVO constructor to create the widget
        super.createHTMLElement();
        
        // add widget-specific style attributes
        this.style["letter-spacing"] = opt.letterSpacing || (typeof this.style["font-size"] === "string" ? parseFloat(this.style["font-size"]) : this.style["font-size"]);
        this.style["decimal-font-size"] = opt.decimalFontSize || (typeof this.style["font-size"] === "string" ? parseFloat(this.style["font-size"]) * 0.8 : this.style["font-size"] * 0.8);
        this.style["decimal-letter-spacing"] = opt.decimalLetterSpacing || parseFloat(this.style["decimal-font-size"]) * 0.8;
        this.maxDecimalDigits = isNaN(parseInt(`${opt.maxDecimalDigits}`)) ? 2 : parseInt(`${opt.maxDecimalDigits}`);

        //  this.maxDecimalDigits = (isNaN(parseInt(opt.maxDecimalDigits))) ? Math.floor(0.25 * this.width / parseFloat(this.style["decimal-letter-spacing"])) : parseInt(opt.maxDecimalDigits);
        this.maxIntegerDigits = isNaN(parseInt(`${opt.maxIntegerDigits}`)) ? 
            Math.floor((this.width - this.maxDecimalDigits * parseFloat(this.style["decimal-letter-spacing"])) / parseFloat(`${this.style["letter-spacing"]}`)) 
                : parseInt(`${opt.maxIntegerDigits}`);
        this.decimalPointOffset = opt.decimalPointOffset || 0;

        // set widget keys
        this.attr.cursorName = opt.cursorName;
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
    render (state: string | {}, opt?: NumericDisplayOptions): void {
        if (state !== null && state !== undefined) {
            // set style
            opt = opt || {};
            opt["background-color"] = opt.backgroundColor || this.style["background-color"];
            opt.color = opt.fontColor || this.style.color;
            opt["font-size"] = (opt.fontSize || this.style["font-size"]) + "px";
            opt["font-family"] = opt.fontFamily || this.style["font-family"];
            opt["text-align"] = opt.align || this.style["text-align"];
            const borderWidth: number = +opt.borderWidth || 0;
            opt["border-width"] = (!isNaN(borderWidth)) ? opt.borderWidth + "px" : this.style["border-width"];
            opt["border-style"] = (opt.borderStyle) ? opt.borderStyle : (borderWidth > 0) ? "solid" : this.style["border-style"];
            opt["border-radius"] = (!isNaN(+opt.borderRadius)) ? opt.borderRadius : this.style["border-radius"];
            opt["border-color"] = (opt.borderColor) ? opt.borderColor : (borderWidth > 0) ? "transparent" : this.style["border-color"];
            this.setStyle(opt);

            // set content
            if (typeof state === "string" || typeof state === "number") {
                const val: string = `${state}`;
                state = {};
                state[this.attr.displayName] = val;
            }
            if (typeof state === "object" && this.evalViz(state)) {
                const disp: string = this.evaluate(this.attr.displayName, state);
                let parts: string[] = disp.split(".");

                const desc: {
                    whole: { val: string, selected: boolean, "font-size": number }[], 
                    frac: { val: string, selected: boolean, "font-size": number }[],
                    point: boolean,
                    whole_zeropadding: { val: string, selected: boolean, "font-size": number }[], 
                    frac_zeropadding: { val: string, selected: boolean, "font-size": number }[],
                    max_integer_digits: number,
                    max_decimal_digits: number,
                    cursorPos: number      
                } = {
                    whole: [], 
                    frac: [],
                    point: (disp.indexOf(".") >= 0),
                    whole_zeropadding: [], frac_zeropadding: [],
                    max_integer_digits: this.maxIntegerDigits,
                    max_decimal_digits: this.maxDecimalDigits,
                    cursorPos: 0
                };
                desc.whole = parts[0].split("").map((d) => {
                    return { val: d, selected: false, "font-size": parseFloat(`${this.style["font-size"]}`) };
                });
                if (parts.length > 1) {
                    desc.frac = parts[1].split("").map((d) => {
                        return { val: d, selected: false, "font-size": parseFloat(`${this.style["decimal-font-size"]}`) };
                    });
                }
                const cursorName: string = opt.cursorName || this.attr.cursorName;
                desc.cursorPos = parseInt(this.evaluate(cursorName, state));
                if (!isNaN(desc.cursorPos)) {
                    if (desc.cursorPos >= 0) {
                        if (desc.cursorPos < desc.whole.length) {
                            desc.whole[desc.whole.length - 1 - desc.cursorPos].selected = true;
                            desc.whole[desc.whole.length - 1 - desc.cursorPos]["font-size"] *= selectedFontSize;
                        } else { // introduce leading zeros
                            desc.whole_zeropadding = new Array(desc.cursorPos - (desc.whole.length - 1)).fill({
                                val: "0", selected: false, "font-size": parseFloat(`${this.style["font-size"]}`)
                            });
                            desc.whole_zeropadding[0] = {
                                val: "0", selected: true, "font-size": parseFloat(`${this.style["font-size"]}`) * selectedFontSize
                            };
                        }
                    } else if (desc.cursorPos < 0) {
                        if (-(desc.cursorPos + 1) < desc.frac.length) {
                            desc.frac[-(desc.cursorPos + 1)].selected = true;
                        } else { // introduce trailing zeros and the decimal point
                            desc.frac_zeropadding = new Array(-desc.cursorPos - desc.frac.length).fill({
                                val: "0", selected: false, "font-size": parseFloat(this.style["decimal-font-size"])
                            });
                            desc.frac_zeropadding[desc.frac_zeropadding.length - 1] = {
                                val: "0", selected: true, "font-size": parseFloat(this.style["decimal-font-size"])
                            };
                            desc.point = true;
                        }
                    }
                }
                //  console.log(desc);
                const point_style = {
                    left: ((desc.max_integer_digits) * parseFloat(`${this.style["letter-spacing"]}`) + (this.decimalPointOffset)).toFixed(2),
                    width: (parseFloat(`${this.style["letter-spacing"]}`) / 2).toFixed(2),
                    height: this.height - 2 * borderWidth,
                    "margin-left": (-parseFloat(`${this.style["letter-spacing"]}`) / 32).toFixed(2),
                    "font-size": parseFloat(this.style["decimal-font-size"]).toFixed(2),
                    viz: desc.point
                };
                const whole_style = {
                    digits: desc.whole_zeropadding.concat(desc.whole),
                    width: (desc.max_integer_digits) * parseFloat(`${this.style["letter-spacing"]}`),
                    height: this.height - 2 * borderWidth,
                    "margin-top": `-${borderWidth}px`,
                    left: parseFloat(point_style.left) - parseFloat(point_style.width),
                    "letter-spacing": parseFloat(`${this.style["letter-spacing"]}`).toFixed(2),
                    color: this.style.color,
                    "background-color": this.style["background-color"],
                    "margin-left": (((desc.max_integer_digits) - (desc.whole.length) - (desc.whole_zeropadding.length)) * parseFloat(`${this.style["letter-spacing"]}`)).toFixed(2)
                };
                const frac_digits: { val: string, selected: boolean, "font-size": number }[] = desc.frac.concat(desc.frac_zeropadding);
                const frac_style = {
                    digits: frac_digits,
                    width: ((desc.max_decimal_digits) * parseFloat(this.style["decimal-letter-spacing"])).toFixed(2),
                    height: this.height - 2 * borderWidth,
                    "margin-top": `-${borderWidth / 2}px`,
                    left: (parseFloat(point_style.left) + parseFloat(point_style.width)).toFixed(2),
                    "letter-spacing": parseFloat(this.style["decimal-letter-spacing"]).toFixed(2),
                    color: this.style.color,
                    "background-color": this.style["background-color"],
                    viz: (frac_digits.length > 0)
                };
                //  console.log(frac_style);
                const dom = Handlebars.compile(digitsTemplate, { noEscape: true })({
                    type: this.type,
                    whole: whole_style,
                    frac: frac_style,
                    point: point_style
                });
                this.base.empty();
                this.base.append(dom);
            }
        }
        this.reveal();
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
        this.render(st, { cursorName: "demoCursor" });
    }

    getDescription (): string {
        return `Numeric display, suitable for rendering numbers. 
                Enhances the visibility of decimal point and fractional digits.
                Provides a cursor for highlighting digits.`;
    }

}