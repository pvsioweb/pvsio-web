/**
 * @module Stylus
 * @version 1.0
 * @description Renders a mouse cursor.
 *              The widget is implemented using a png image embedded in a div.
 * @author Paolo Masci
 * @date Dec 23, 2017
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses Stylus
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: {
         d3: "../lib/d3",
         lib: "../lib",
         text: "../lib/text",
         stateParser: "./util/PVSioStateParser"
     }
 });
 require(["widgets/core/Stylus"], function (Stylus) {
      "use strict";
      var device = {};
      device.cursor = new Stylus("cursor", {
        top: 200, left: 120, height: 24, width: 120
      });
     device.cursor.render(); // The cursor is rendered.
     device.cursor.move( { top: 100, left: 300 }, { duration: 1000 }); // The cursor is moved to position (100,300), and the animation duration is 1 second.
 });
 *
 */

import { Coords, WidgetEVO, img_template, CSS, WidgetOptions } from "../core/WidgetEVO";
import { stylus_white } from "./StylusTemplate";

export class Stylus extends WidgetEVO {
    protected initial_position: {
        top: number,
        left: number
    };
    protected opacity: number = 1;
    readonly fw_move: number = 20; // these are the number of pixels the stylus goes forward when animating a click

    /**
     * @function <a name="Stylus">Stylus</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget area.
     *        Default is { top: 0, left: 0, width: 32, height: 20 }.
     * @param opt {Object} Options:
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>visibleWhen (string): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     * @memberof module:Stylus
     * @instance
     */
    constructor (id: string, coords: Coords, opt?: WidgetOptions) {
        super(id, coords, opt);
        coords = coords || {};
        opt = opt || {};

        // adjust position, based on the stylus size: the coordinates are indicating the position of the stylus pointer
        this.width = 40;
        this.height = 640;
        this.css = this.css || {};
        this.css["margin-top"] = `${-(this.height)}px`;
        this.css["margin-left"] = `-12px`;

        // store initial position
        this.initial_position = {
            top: this.top,
            left: this.left
        };

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css["background-color"] = "transparent";
        this.css.opacity = opt.css.opacity || 1;

        // invoke WidgetEVO constructor to create the widget
        super.createHTMLElement();

        // append the pointer image to the base layer
        const dom = Handlebars.compile(img_template, { noEscape: true })({
            svg: stylus_white
        });
        this.$base.append(dom);
    }

     
    /**
     * @function <a name="render">render</a>
     * @description Rendering function for button widgets.
     * @memberof module:Stylus
     * @instance
     */
    render () {
        return this.reveal();
    };

    /**
     * @function <a name="click">click</a>
     * @description Simulates a small forward movement of the stylus. The overall duration of the movement is 1000ms.
     * @memberof module:Stylus
     * @instance
     */
    click (opt?: { fw_move?: number }) {
        opt = opt || {};
        opt.fw_move = opt.fw_move || this.fw_move;
        this.move({ top: this.top + opt.fw_move, left: this.left - opt.fw_move }, {
            duration: 200,
            rotation: "auto"
        });
        setTimeout(() => {
            this.move({ top: this.top - opt.fw_move, left: this.left + opt.fw_move }, {
                duration: 500,
                rotation: "auto"
            });
        }, 500);
        return this.reveal();
    };

    /**
     * @function <a name="longPress">longPress</a>
     * @description Simulates a small forward movement of the stylus. The overall duration of the movement is 3000ms.
     * @memberof module:Stylus
     * @instance
     */
    longPress (opt?) {
        opt = opt || {};
        opt.fw_move = opt.fw_move || 20;
        this.move({ top: this.top + opt.fw_move, left: this.left - opt.fw_move }, {
            duration: 200,
            rotation: "auto"
        });
        setTimeout(() => {
            this.move({ top: this.top - opt.fw_move, left: this.left + opt.fw_move }, {
                duration: 500,
                rotation: "auto"
            });
        }, 2500);
        return this.reveal();
    };

    /**
     * @override
     * @function <a name="move">move</a>
     * @description Changes the position of the stylus according to the coordinates given as parameter. The stylus is automatically rotated by 35 degree when moving the stylus.
     * @param coords {Object} Coordinates indicating the new position of the widget. The coordinates are given in the form { top: (number), left: (number) }
     * @param opt {Object}
     *         <li> duration (Number): duration in milliseconds of the move transition (default is 1000) </li>
     *         <li> transitionTimingFunction (String): HTML5 timing function (default is "ease-in") </li>
     *         <li> rotation (bool): whether the stylus should be rotated while moving it</li>
     * @memberof module:Stylus
     * @instance
     */
    move (coords: Coords, opt?: CSS) {
        super.move(coords, opt);
        if (this.$div && this.$div[0]) {
            opt = opt || {};
            // the translation needs to be normalised by the top / left attributes of the div
            opt.duration = opt.duration || 1000;
            opt.transitionTimingFunction = opt.transitionTimingFunction || "ease-out";
            opt.rotation = (opt.rotation !== undefined) ? opt.rotation : "auto";
            const rotation_val: number = (opt.rotation === "auto") ? 35 : 0;
            this.$base.css("transform", "rotate(" + rotation_val + "deg)")
                .css("transform-origin", "bottom")
                .css("transition-duration", opt.duration + "ms")
                .css("transition-timing-function", opt.transitionTimingFunction);
        }
        return this;
    };

    /**
     * @override
     * @function <a name="select">select</a>
     * @description Selects the widget -- useful to highlight the widget programmaticaly.
     * @param style {Object} Set of valid HTML5 attributes characterising the visual appearance of the widget.
     * @memberof module:Stylus
     * @instance
     */
    select (opt?: { opacity?: number, overlayColor?: string, classed?: string, "background-color"?: string }) {
        opt = opt || {};
        opt.opacity = (isNaN(+opt.opacity)) ? 1 : opt.opacity;
        return this.setCSS(opt);
    };

    /**
     * @override
     * @function <a name="reveal">reveal</a>
     * @description Reveals the stylus using fade-in effect
     * @memberof module:Stylus
     * @instance
     */
    reveal () {
        if (this.$div && this.$div[0] && this.$div.css("display") !== "block") {
            this.$div.css("display", "block").css("opacity", 0).animate({ "opacity": this.opacity }, 250);
        }
        return this;
    };

    /**
     * @override
     * @function <a name="hide">reveal</a>
     * @description Hides the stylus with a fade-out effect. The position is reset to the initial position, and rotation is reset to 0.
     * @memberof module:Stylus
     * @instance
     */
    hide () {
        if (this.$div && this.$div[0] && this.$div.css("display") === "block") {
            this.$div.animate({ "opacity": 0 }, 250);
            setTimeout(() => {
                this.move(this.initial_position, { rotation: "0deg" });
                this.$div.css("display", "none");
            }, 260);
        }
        return this;
    };
}
