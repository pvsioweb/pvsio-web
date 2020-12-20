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

import { Connection } from "../../../../env/Connection";
import { DisplayOptions } from "./BasicDisplayEVO";
import { ButtonEVO, ButtonOptions } from "./ButtonEVO";
import { Coords } from "./WidgetEVO";

export interface TouchScreenOptions extends DisplayOptions, ButtonOptions { };

export class TouchScreenEVO extends ButtonEVO {

    constructor (id: string, coords: Coords, opt?: TouchScreenOptions) {
        super(id, coords, { ...opt, touchscreenMode: true });
        opt = opt || {};
        opt.css = opt.css || {};

        // override default button style
        this.css["background-color"] = opt.css["background-color"] || "steelblue";
        this.css["font-color"] = opt.css["font-color"] || "white";
        this.type = opt.type || "touchscreendisplay";

        // override default button style
        this.setCSS(this.css);

        // set widget keys
        this.attr.displayName = opt.displayName || id;
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
        return `Touchscreen display, renders touch-screen elements.
            Click events are emitted when the element is released.`;
    }
}