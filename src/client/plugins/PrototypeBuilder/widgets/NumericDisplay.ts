/**
 * @module NumericDisplay
 * @version 2.0
 * @description Renders a basic digital display for rendering numbers. Uses different font size for integer and fractional parts. A cursor can be used to highlight specific digits.
 *              This module provide APIs for changing the look and feel of
 *              the rendered text, including: cursors, background color, font, size, alignment.
 * @author Paolo Masci, Patrick Oladimeji
 * @date Apr 1, 2015
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses NumericDisplay
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: {
         d3: "../lib/d3",
         lib: "../lib"
     }
 });
 require(["widgets/NumericDisplay"], function (NumericDisplay) {
      "use strict";
      var device = {};
      device.dispNumeric = new NumericDisplay("dispNumeric", {
        top: 150, left: 120, height: 24, width: 120
      }, {
        displayKey: "disp",
        cursorName: "cur",
        align: "right"
      });
      device.dispNumeric.render({ disp: "B 10.5", cur: -1 }); // the display value is "B 10.5" and the cursor highlights the first fractional digit of the number
 });
 *
 */

import { BasicDisplay, WidgetOptions } from './BasicDisplay';
import { WidgetCoordinates } from './Widget';

export class NumericDisplay extends BasicDisplay {
    protected displayMode: "text" | "numeric";

    /**
     * @function <a name="NumericDisplay">NumericDisplay</a>
     * @description Constructor.
     * @param id {String} The ID of the display.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 200, height: 80 }.
     * @param opt {Object} Options:
     *          <li>align (String): text alignment (available options are "left", "right", anc "center". Default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
     *          <li>borderWidth (Number): border width (default is 0, i.e., no border, unless option borderColor has been specified -- in this case, the border is 2px)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid" (default is "none")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default color used in the widget is "black")</li>
     *          <li>cursorName (string): the name of the state attribute defining the cursor position. This information will be used by the render method. If this options is not specified, the cursor will not be displayed.
     *          <li>displayKey (string): the name of the state attribute defining the display content. This information will be used by the render method. Default is the ID of the display.
     *          <li>fontsize (Number): font size (default is 0.8 * coords.height)</li>
     *          <li>fontfamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>inverted (Bool): if true, the text has inverted colors,
     *              i.e., fontColor becomes backgroundColor, and backgroundColor becomes fontColor (default is false)</li>
     *          <li>letterSpacing (Number): spacing between characters, in pixels (default is 0)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>visibleWhen (string): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).
     * @memberof module:NumericDisplay
     * @instance
     */
    constructor (id: string, coords: WidgetCoordinates, opt?: WidgetOptions) {
        super(id, coords, opt);
        this.type = "numericdisplay";
        this.displayMode = "numeric";
    }

    setDisplayMode (displayMode: "numeric" | "text"): void {
        this.displayMode = displayMode || "numeric";
    }

    // @Overrides
    protected renderln (data: {
        txt: string,
        context: CanvasRenderingContext2D,
        align: string,
        height: number,
        width: number,
        cursorPos: number
    }, opt?): void {
        return (this.displayMode === "text") ? super.renderln(data, opt)
            : this.renderNumber(data, opt);
    }

    protected renderNumber (data: {
        txt: string,
        context: CanvasRenderingContext2D,
        align: string,
        height: number,
        width: number,
        cursorPos: number
    }, opt?): void {

        const drawCircle = (context: CanvasRenderingContext2D, x: number, y: number, r: number, fillStyle: string): void => {
            context.save();
            context.fillStyle = fillStyle;
            context.beginPath();
            context.arc(x, y, r, 0, Math.PI * 2, true);
            context.closePath();
            context.stroke();
            context.fill();
            context.restore();
        }
        const fontheight = (font: string): number => {
            const r: string = font.match(/\d+/g)[0];
            return parseFloat(r);
        }
        const decRadius = (): number => {
            return this.fontSize * 0.7 / 8;
        }
        opt = opt || {};
        data.context.clearRect(0, 0, data.width, data.height);
        data.context.fillStyle = opt.backgroundColor || this.backgroundColor;
        if (data.context.fillStyle !== "transparent") {
            data.context.fillRect(0, 0, data.width, data.height);
        }
        data.context.fillStyle = opt.fontColor || this.fontColor;
        let th: number = 28;
        const pad: number = 2;
        let centerx: number = data.width / 2;
        let centery: number = data.height / 2;

        data.txt = (typeof data.txt === "string") ? data.txt : parseFloat(data.txt).toString();
        const nakedPoint: boolean = (data.txt.indexOf(".") === (data.txt.length - 1));

        let frac: string = data.txt.split(".")[1];
        let whole: string = data.txt.split(".")[0];
        //pad the string if necessary
        if (data.align === "left") {
            data.context.textAlign = "start";
            centerx = (whole && whole.length) ?
                        this.fontSize * whole.length / 1.5 - (+this.borderWidth * 1.5)
                        : (+this.borderWidth * 1.5);
        } else if (data.align === "right") {
            data.context.textAlign = "end";
            centerx = (frac && frac.length) ?
                        data.width - (this.fontSize * frac.length / 1.8) - (+this.borderWidth * 1.5)
                        : data.width - (+this.borderWidth * 1.5);
        } else {
            data.context.textAlign = "center";
        }
        if (data.cursorPos >= whole.length - 1) {
            for (let i = data.cursorPos - (whole.length - 1); i > 0; i--) {
                whole = "0".concat(whole);
            }
        } else if (data.cursorPos < 0) {
            frac = frac || "";
            for (let i = Math.abs(data.cursorPos) - frac.length; i > 0; i--) {
                frac = frac.concat("0");
            }
        }
        if (nakedPoint || (frac !== undefined && frac.length > 0)) {
            drawCircle(data.context, centerx, centery, decRadius(), this.fontColor);
        }
        if (frac !== undefined && frac.length > 0) {
            let x: number = centerx + pad + decRadius();
            data.context.textAlign = "left";
            data.context.fillStyle = this.fontColor;
            data.context.font = `${this.fontSize * 0.7}px`;
            let th: number = fontheight(data.context.font);
            let y = centery + (th * 0.5);
            //draw the fraction bit
            frac.split("").forEach((d, index) => {
                if (data.cursorPos === (index + 1) * -1) {
                    data.context.save();
                    //draw a cursor and then the number
                    const txtmeasure: TextMetrics = data.context.measureText(d);
                    data.context.fillRect(x, y - th, txtmeasure.width, th);
                    data.context.fillStyle = (this.backgroundColor !== "") ? this.backgroundColor : "#000";
                    data.context.fillText(d, x, centery);
                    x += txtmeasure.width + pad;
                    data.context.restore();
                } else {
                    const txtmeasure: TextMetrics = data.context.measureText(d);
                    data.context.fillText(d, x, centery);
                    x += txtmeasure.width + pad;
                }
            });
        }
        data.context.font = `${this.fontSize}px`;
        data.context.textAlign = "right";
        data.context.fillStyle = this.fontColor;
        let x: number = centerx - decRadius() - pad;
        th = fontheight(data.context.font);
        let y = centery + (th * 0.5);
        //draw the whole bit in reverse aligning to the right
        whole.split("").reverse().forEach(function (d, index) {
            if (d === "_" && index < whole.length - data.cursorPos) { d = "0"; }
            if (data.cursorPos === index) {
                data.context.save();
                //draw a cursor and then the number
                const txtmeasure: TextMetrics = data.context.measureText(d);
                data.context.fillRect(x - txtmeasure.width, y - th, txtmeasure.width, th);
                data.context.fillStyle = (this.backgroundColor !== "") ? this.backgroundColor : "#000";
                data.context.fillText(d, x, centery);
                x -= (txtmeasure.width + pad);
                data.context.restore();
            } else {
                const txtmeasure: TextMetrics = data.context.measureText(d);
                data.context.fillText(d, x, centery);
                x -= (txtmeasure.width + pad);
            }
        });
    }

}
