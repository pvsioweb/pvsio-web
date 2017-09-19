/**
 * @module SliderWidget
 * @version 1.0
 * @description Renders a basic digital display.
 *              This module provide APIs for changing the look and feel of
 *              the rendered text, including: cursors, background color, font, size, alignment.
 * @author Paolo Masci
 * @date Sep 15, 2017
 *
 * @example <caption>Typical use of SliderWidget APIs within a PVSio-web plugin module.</caption>
 * // Example module that uses SliderWidget.
 * define(function (require, exports, module) {
 *     "use strict";
 *     var device = {};
 *     device.slider = new SliderWidget("slider", { top: 222, left: 96, height: 8, width: 38 }, { orientation: vertical });
 *     device.slider.render(); // the slider is rendered
 * });
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, document, Slider */
define(function (require, exports, module) {
    "use strict";

    var d3 = require("d3/d3");
    var Widget = require("widgets/Widget"),
        TouchscreenButton = require("widgets/TouchscreenButton"),
        property = require("util/property");

    var init_done = false;

    /**
     * @function <a name="SliderWidget">SliderWidget</a>
     * @description Constructor.
     * @param id {String} The ID of the display.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 104, height: 250 }.
     * @param opt {Object} Options:
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
     *          <li>orientation (String): "vertical" | "horizontal" (default is "vertical")</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     * @memberof module:SliderWidget
     * @instance
     */
    function SliderWidget(id, coords, opt) {
        opt = opt || {};
        coords = coords || {};
        this.id = property.call(this, id);
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 104;
        this.height = coords.height || 250;
        this.barwidth = opt.barwidth || 20;
        this.paddingTop = opt.paddingTop || 20;
        this.backgroundColor = opt.backgroundColor || "#E0E0E0";
        this.fontColor = opt.fontColor || "white";
        this.borderWidth = opt.borderWidth || 1;
        this.borderStyle = opt.borderStyle || "none";
        this.borderColor = opt.borderColor || "inherit";
        this.cursor = opt.cursor || "default";
        if (opt.inverted) {
            var tmp = this.backgroundColor;
            this.backgroundColor = this.fontColor;
            this.fontColor = tmp;
        }
        var elemClass = id + " sliderWidget" + " noselect ";
        opt.position = opt.position || "absolute";
        opt.borderRadius = opt.borderRadius || "2px";
        opt.opacity = opt.opacity || 1;
        this.format = opt.format;
        this.orientation = opt.orientation || "vertical";
        this.max = opt.max || 100;
        this.min = opt.min || 0;
        this.init = opt.init || this.min;
        this.ticks = opt.ticks || [this.min, this.max];
        this.div = d3.select(this.parent)
                        .append("div").style("position", opt.position)
                        .style("top", this.top + "px").style("left", this.left + "px")
                        .style("width", (this.width + this.borderWidth) + "px").style("height", (this.height + this.borderWidth) + "px")
                        .style("margin", 0).style("padding", 0).style("border-radius", opt.borderRadius).style("opacity", opt.opacity)
                        .style("background-color", this.backgroundColor)
                        .style("border-width", this.borderWidth + "px")
                        .style("border-style", this.borderStyle)
                        .style("border-color", this.borderColor)
                        .style("padding-left", (this.width - this.barwidth) / 2 + "px")
                        .style("padding-top", (this.paddingTop) + "px")
                        .style("border", "solid").style("border-color", "black").style("border-width", "1px")
                        .style("display", "block").attr("id", id).attr("class", elemClass);
        this.div.append("input").attr("id", id + "_slider_data")
                        .attr("type", "text");

        this.slider = new Slider("#" + id + "_slider_data", {
                        reversed: true,
                        orientation: this.orientation,
                        tooltip_position: "left",
                        tooltip: "always",
                        max: this.max,
                        min: this.min,
                        step: 1,
                        ticks_snap_bounds: 10,
                        handle: "bar",
                        ticks: this.ticks,
                        ticks_labels: this.ticks,
                        value: this.init
                    });
        this.button = new TouchscreenButton(id + "_button", {
            top: 0,
            left: 0,
            width: 0,
            height: 0
        });
        opt.functionText = opt.functionText || id;
        this.functionText = property.call(this, opt.functionText);
        var _this = this;
        this.slider.on("slide", function (val) {
            _this.slide(val);
        });
        this.div.selectAll(".slider-track-high").style("background-color", "#337ab7");
        this.div.selectAll(".slider-selection").style("opacity", "0");
        this.slider.relayout();
        Widget.call(this, id, "slider");
        return this;
    }
    SliderWidget.prototype = Object.create(Widget.prototype);
    SliderWidget.prototype.constructor = SliderWidget;
    SliderWidget.prototype.parentClass = Widget.prototype;
    /**
     * Returns a JSON object representation of this Widget.
     * @returns {object}
     * @memberof module:SliderWidget
    */
    SliderWidget.prototype.toJSON = function () {
        return {
            type: this.type(),
            id: this.id(),
            backgroundColor: this.backgroundColor,
            orientation: this.orientation
        };
    };
    SliderWidget.prototype.slide = function (val) {
        this.button.click({ functionText: this.functionText() + "(" + val + ")" });
    };
    /**
    * Updates the location and size of the widget according to the given position and size
     */
    SliderWidget.prototype.updateLocationAndSize = function (pos, opt) {
        opt = opt || {};
        if (opt.imageMap) {
            SliderWidget.prototype.parentClass.updateLocationAndSize.apply(this, arguments);
        }
        this.top = pos.y || 0;
        this.left = pos.x || 0;
        this.width = pos.width || 200;
        this.height = pos.height || 80;
        // this.fontsize = this.height * 0.9;
        // this.font = [this.fontsize, "px ", this.fontfamily];
        // this.smallFont = [(this.fontsize * 0.7), "px ", this.fontfamily];
        d3.select("div." + this.id()).style("left", this.left + "px").style("top", this.top + "px")
            .style("width", this.width + "px").style("height", this.height + "px").style("font-size", this.fontsize + "px");
        d3.select("div." + this.id()).select("span").attr("width", this.width + "px").attr("height", this.height + "px"); // used for glyphicon
        d3.select("div." + this.id()).select("canvas").attr("width", this.width + "px").attr("height", this.height + "px"); // used for standard text and numbers
        return this.render(this.example, opt);
    };
    SliderWidget.prototype.updateStyle = function (data) {
        data = data || {};
        this.fontsize = data.fontsize || this.fontsize;
        this.font = [this.fontsize, "px ", this.fontfamily];
        this.smallFont = [(this.fontsize * 0.7), "px ", this.fontfamily];
        this.fontColor = data.fontColor || this.fontColor;
        this.backgroundColor = data.backgroundColor || this.backgroundColor;
        return this;
    };
    /**
     * Removes the widget's div
     */
    SliderWidget.prototype.remove = function () {
        SliderWidget.prototype.parentClass.remove.apply(this);
        d3.select("div." + this.id()).remove();
    };
    SliderWidget.prototype.setColors = function (colors, opt) {
        colors = colors || {};
        opt = opt || {};
        opt.auditoryFeedback = opt.auditoryFeedback || "disabled";
        this.fontColor = colors.fontColor || this.fontColor;
        this.backgroundColor = colors.backgroundColor || this.backgroundColor;
        return this.render(this.txt, opt);
    };
    SliderWidget.prototype.invertColors = function () {
        var tmp = this.backgroundColor;
        this.backgroundColor = this.fontColor;
        this.fontColor = tmp;
        var elemIsBlinking = (document.getElementById(this.id()).getAttribute("class").indexOf("blink") >= 0);
        return this.render(this.txt, { blinking: elemIsBlinking });
    };
    SliderWidget.prototype.invertGlyphiconColors = function () {
        var tmp = this.backgroundColor;
        this.backgroundColor = this.fontColor;
        this.fontColor = tmp;
        var elemIsBlinking = (document.getElementById(this.id()).getAttribute("class").indexOf("blink") >= 0);
        return this.renderGlyphicon(this.txt, { blinking: elemIsBlinking });
    };
    SliderWidget.prototype.renderSample = function (opt) {
        opt = opt || {};
        return this.render();
    };
    SliderWidget.prototype.render = function (txt, opt) {
        if (!init_done) {
            this.slide(d3.select("#" + this.id() + "_slider_data").node().value);
            init_done = true;
        }
        return this.reveal();
    };
    SliderWidget.prototype.hide = function () {
        return this.div.style("display", "none");
    };
    SliderWidget.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    SliderWidget.prototype.move = function (data) {
        data = data || {};
        if (data.top) {
            this.top = data.top;
            this.div.style("top", this.top + "px");
        }
        if (data.left) {
            this.left = data.left;
            this.div.style("left", this.left + "px");
        }
        return this;
    };

    module.exports = SliderWidget;
});
