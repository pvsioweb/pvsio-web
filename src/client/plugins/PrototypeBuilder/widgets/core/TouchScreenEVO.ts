/**
 * @module TouchScreenEVO
 * @version 1.0
 * @description Renders a touchscreen display.
 * @author Paolo Masci
 * @date Jul 25, 2018
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses TouchScreenEVO
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: { d3: "../lib/d3", text: "../lib/text" }
 });
 require(["widgets/core/TouchScreenEVO"], function (TouchScreenEVO) {
      "use strict";
      var disp = new TouchScreenEVO("touch", {
        top: 200, left: 120, height: 24, width: 120
      }, {
        callback: function (err, data) { console.log("Ok button clicked"); console.log(data); }
      });
     disp.render("touch me!"); // The display shows touch me!
 });
 *
 */

import { DisplayAttr, DisplayOptions } from "./BasicDisplayEVO";
import { ButtonAttr, ButtonEVO, ButtonOptions } from "./ButtonEVO";
import { Coords, CSS, MatchState } from "./WidgetEVO";

export interface TouchScreenOptions extends DisplayOptions, ButtonOptions { };

export interface TouchScreenAttr extends DisplayAttr, ButtonAttr { };

export class TouchScreenEVO extends ButtonEVO {
    static readonly constructorName: string = "TouchScreenEVO";
    getConstructorName (): string {
        return TouchScreenEVO.constructorName;
    }

    protected attr: TouchScreenAttr;
    
    constructor (id: string, coords: Coords, opt?: TouchScreenOptions) {
        super(id, coords, opt);
        this.kind = "Touchscreen";
        opt = opt || {};
        opt.css = opt.css || {};

        // override default button style
        this.css["background"] = opt.css["background"] || "steelblue";
        this.css["font-color"] = opt.css["font-color"] || "white";

        // set widget keys
        this.attr.displayName = opt.displayName || opt.buttonName || this.attr?.buttonName || id;
    }

    // @override
    protected onButtonPress (): void {
        if (this.evts.press) {
            this.pressAndHold();
        }
    };
    // @override
    protected onButtonRelease (): void {
        if (this.evts.release) {
            this.release();
        } else if (this.evts.click) {
            this.click();  // touchscreen buttons register a click when the button is released
        }
    };

    render (state?: string | number | {}, opt?: CSS): void {
        // the following will render custom labels
        super.render(state, opt);
        if (!this.attr.customLabel && state) {
            // check if the state contains a field named after the widget
            if (this.matchStateFlag) {
                if (typeof state === "string") {
                    const match: MatchState = this.matchState(state);
                    if (match) {
                        // render state attribute value
                        this.$base.html(`${match.val}`);
                    }
                }
            } else {
                // render string or number
                this.$base.html(`${state}`);
            }
        }
    }

    /**
     * @function <a name="renderSample">renderSample</a>
     * @description Version of the render function that demonstrates the functionalities of the widget.
     * @memberof module:TouchScreenEVO
     * @instance
     */
    renderSample () {
        return this.render();
    }

    getDescription (): string {
        return `Renders touch-screen elements.
            Click events are emitted when the element is released.`;
    }
}