/**
 * @module LED22
 * @version 2.0
 * @description Circular LED2 lights.
 * @author Paolo Masci
 * @date June 1, 2017
 *
 * @example <caption>Typical use of LED2 APIs within a PVSio-web plugin module.</caption>
 * // Example module that uses LED2.
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
    ledKey?: string,
    strokeSize?: number
}

export class LED2 extends Widget.BasicWidget {

    protected radius: number;
    protected color: string;
    protected ledColor: string;
    protected blinking: boolean;
    protected isOn: boolean;
    protected ledKey: string;

    /**
     * @function <a name="LED2">LED2</a>
     * @description Constructor.
     * @param id {String} The ID of the HTML element where the display will be rendered.
     * @param coords {Object} The four coordinates (x1,y1,x2,y2) of the display, specifying
     *        the left, top, right, bottom corner of the rectangle (for shape="rect")
     * @param opt {Object}
     * @memberof module:LED2
     * @instance
     */
    constructor (id: string, coords: Widget.WidgetCoordinates, opt?: WidgetOptions) {
        super(id, "led", coords, opt);

        opt = opt || {};
        opt.strokeSize = opt.strokeSize || 3;

        this.radius = opt.radius || (this.height / 4);
        this.color = opt.color || "#00FF66"; // default is bright green
        this.ledColor = this.color;
        this.blinking = opt.blinking || false;
        
        this.div?.addClass("noselect");
        if (this.blinking) { this.div?.addClass("blink"); }
        
        this.div?.css({ opacity: 0.6 });

        const svg: HTMLElement = document.createElement("svg");
        $(svg).attr("id", `${id}_svg`).addClass(`${id}_svg`)
            .attr("width", this.width)
            .attr("height", this.height)
            .css({ margin: 0, padding: 0, "vertical-align": "top" });
        const circle: HTMLElement = document.createElement("circle");
        $(circle).attr("cx", this.width / 2)
            .attr("cy", this.height / 2)
            .attr("r", (Math.min(this.width, this.height) - opt.strokeSize) / 2)
            .attr("stroke", this.ledColor)
            .attr("stroke-width", opt.strokeSize)
            .attr("fill", "transparent");
        this.div?.append(svg).append(circle);


        this.isOn = false;
        opt.visibleWhen = opt.visibleWhen || "true"; // default: always visible
        this.ledKey = opt.ledKey || id;
    }

    /**
     * Returns a JSON object representation of this Widget.
     * @returns {object}
     * @memberof module:LED2
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
        super.updateLocationAndSize.apply(pos);
        $(`#${this.id} svg`).attr("width", `${this.width}px`).attr("height", `${this.height}px`);
        this.render();
    };

    render (txt?: string, opt?: { blinking?: boolean, visibleWhen?: string }) {
        opt = opt || {};

        const visibleWhen: string = opt.visibleWhen || this.visibleWhen;
        const isVisible: boolean = this.isVisible({ visibleWhen, txt });
        if (isVisible) {
            if (opt.blinking && !this.blinking) {
                this.div.addClass("blink");
            }
            this.reveal();
        } else {
            this.hide();
        }
    };

    renderSample () {
        return this.render(null, { visibleWhen: "true" });
    };


    toggle (): void {
        (this.isOn) ? this.off() : this.on();
    };

    on (opt?: { blinking?: boolean, visibleWhen?: string }): void {
        this.isOn = true;
        if (this.blinking) {
            this.div.addClass("blink");
        } else {
            this.div.removeClass("blink");
        }
        this.render(null, opt);
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
