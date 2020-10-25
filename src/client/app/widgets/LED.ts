/**
 * @module LED
 * @version 2.0
 * @description Renders LED light bulbs.
 *              The look and feel of LEDs can be customised, e.g., color, size, shape.
 * @author Paolo Masci
 * @date Apr 2, 2015
 *
 * @example <caption>Typical use of LED APIs within a PVSio-web plugin module.</caption>
 * // Example module that uses LED.
 * define(function (require, exports, module) {
 *     "use strict";
 *
 * });
 *
 */

import * as Widget from './Widget';
const StateParser = require("util/PVSioStateParser");

export interface WidgetOptions extends Widget.WidgetOptions {
    radius?: number;
    color?: string,
    blinking?: boolean,
    ledKey?: string
}

export class LED extends Widget.BasicWidget {

    protected radius: number;
    protected color: string;
    protected ledColor: string;
    protected blinking: boolean;
    protected isOn: boolean;
    protected ledKey: string;

    /**
     * @function <a name="LED">LED</a>
     * @description Constructor.
     * @param id {String} The ID of the HTML element where the display will be rendered.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 12, height: 12 }.
     * @param opt {Object} Rendering options:
     *        <li>radius (Number) Radius of the LED</li>
     *        <li>color (String) Color of the LED (must be a valid HTML color. Default is bright green "#00FF66")</li>
     *        <li>blinking (Bool) Whether the LED is blinking (default: false, i.e., not blinking)</li>
     *        <li>ledKey (string) The name of the state attribute defining the color of the display. This information will be used by the render method. Default is the ID of the display.</li>
     * @memberof module:LED
     * @instance
     */
    constructor (id: string, coords: Widget.WidgetCoordinates, opt?: WidgetOptions) {
        super(id, "led", coords, opt);
        this.radius = opt.radius || (this.height / 4);
        this.color = opt.color || "#00FF66"; // default is bright green
        this.blinking = opt.blinking || false;

        const canvas: HTMLCanvasElement = document.createElement("canvas");
        $(canvas).attr("id", id + "_canvas")
            .attr("class", id + "_canvas")
            .attr("width", this.width).attr("height", this.height)
            .css({ 
                margin: 0,
                padding: 0,
                "vertical-align": "top"
            });

        this.div.append(canvas);
        this.isOn = false;
        this.ledKey = opt.ledKey || id;
        this.ledColor = this.color;
    }

    /**
     * Returns a JSON object representation of this Widget.
     * @returns {object}
     * @memberof module:LED
    */
    toJSON (): { type: string, id: string, visibleWhen: string, ledKey: string, ledColor: string } {
        return {
            type: this.type,
            id: this.id,
            visibleWhen: this.visibleWhen,
            ledKey: this.ledKey,
            ledColor: this.ledColor
        };
    };
    /**
     * Updates the location and size of the widget according to the given position and size
     */
    updateLocationAndSize (pos: { x: number, y: number, width: number, height: number }): void {
        super.updateLocationAndSize(pos);
        $(`#${this.id} canvas`).attr("width", `${this.width}px`).attr("height", `${this.height}px`);
        this.render();
    };
    
    render (txt?: string, opt?: { color?: string, noborder?: boolean, blinking?: boolean, visibleWhen?: string }): void {
        opt = opt || {};
        txt = txt || "#00FF66"; // default is light green
        var color = (opt.color) ? opt.color
            : (txt && typeof txt === "string") ? txt 
            : this.ledColor;

        const renderCanvas = () => {
            const elem: JQuery<HTMLCanvasElement> = $(`#${this.id}_canvas`);
            if (elem && elem[0]) {
                const context: CanvasRenderingContext2D = elem[0].getContext("2d");
                context.beginPath();
                context.globalAlpha = 0.9;
                context.arc(this.width / 2, this.height / 2, this.radius, 0, 2 * Math.PI, false);
                context.fillStyle = color;
                context.fill();
                if (!opt.noborder) { context.stroke(); }
                if (opt.blinking && !this.blinking) {
                    this.div.addClass("blink");
                } else {
                    this.div.removeClass("blink");
                }
            }
            this.reveal();
        }

        const visibleWhen: string = opt.visibleWhen || this.visibleWhen;
        const isVisible: boolean = this.isVisible({ visibleWhen, txt });
        if (isVisible) {
            if (opt.blinking && !this.blinking) {
                this.div.addClass("blink");
            }
            renderCanvas();
        } else {
            this.hide();
        }
    };

    renderSample (): void {
        this.render("#00FF66");
    };


    toggle (): void {
        (this.isOn) ? this.hide() : this.reveal();
    };

    on (opt?: { color?: string }): void {
        this.isOn = true;
        this.render("", opt);
    };

    off (): void {
        this.isOn = false;
        this.hide();
    };

    blink (nTimes: number) {
        if (nTimes && isFinite(+nTimes)) {
            this.div.removeClass("blink");
            window.setTimeout(() => {
                if (this.isOn) {
                    this.off();
                } else {
                    this.on();
                }
            }, nTimes * 1000);
        } else {
            this.div.addClass("blink");
        }
        this.reveal();
    };

}
