/**
 * @module ToggleButton
 * @version 1.0
 * @description Renders a toggle button. Uses jquery-toggles
 * @author Paolo Masci
 * @date Sep 15, 2017
 *
 * @example <caption>Typical use of ToggleButton APIs within a PVSio-web plugin module.</caption>
 * // Example module that uses ToggleButton.
 * define(function (require, exports, module) {
 *     "use strict";
 *     var device = {};
 *     device.toggleBTN = new ToggleButton("tgl", { top: 222, left: 96, height: 8, width: 38 });
 *     device.toggleBTN.render(); // the toggle button is rendered
 * });
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, document */
define(function (require, exports, module) {
    "use strict";

    var d3 = require("d3/d3");
    var Widget = require("widgets/Widget"),
        TouchscreenButton = require("widgets/TouchscreenButton"),
        property = require("util/property");

    /**
     * @function <a name="ToggleButton">ToggleButton</a>
     * @description Constructor.
     * @param id {String} The ID of the display.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 104, height: 32 }.
     * @param opt {Object} Options:
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
     *          <li>orientation (String): "vertical" | "horizontal" (default is "vertical")</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     * @memberof module:ToggleButton
     * @instance
     */
    function ToggleButton(id, coords, opt) {
        opt = opt || {};
        coords = coords || {};
        this.id = property.call(this, id);
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 104;
        this.height = coords.height || 32;
        this.backgroundColor = opt.backgroundColor || "#E0E0E0";
        this.fontColor = opt.fontColor || "white";
        this.borderWidth = opt.borderWidth || 1;
        this.borderStyle = opt.borderStyle || "none";
        this.borderColor = opt.borderColor || "inherit";
        this.cursor = opt.cursor || "default";
        var elemClass = id + " ToggleButton" + " noselect ";
        opt.position = opt.position || "absolute";
        opt.borderRadius = opt.borderRadius || "2px";
        opt.opacity = opt.opacity || 1;
        this.format = opt.format;
        this.max = opt.max || 100;
        this.min = opt.min || 0;
        this.init = opt.init || this.min;
        this.ticks = opt.ticks || [this.min, this.max];
        this.div = d3.select(this.parent)
                        .append("div").style("position", opt.position)
                        .style("top", this.top + "px").style("left", this.left + "px")
                        .style("width", (this.width + this.borderWidth) + "px")
                        .style("height", (this.height + this.borderWidth) + "px")
                        .style("margin", 0).style("padding", 0).style("border-radius", opt.borderRadius).style("opacity", opt.opacity)
                        .style("background-color", this.backgroundColor)
                        .attr("id", id).attr("class", elemClass);
        this.toggle_elem = this.div.append("div").attr("id", id + "_elem")
                        .style("width", (this.width) + "px")
                        .style("height", (this.height) + "px")
                        .attr("class", "toggle toggle-modern");

        this.button = new TouchscreenButton(id + "_button", {
            top: 0,
            left: 0,
            width: 0,
            height: 0
        });
        opt.functionText = opt.functionText || id;
        this.functionText = property.call(this, opt.functionText);
        var _this = this;
        this.div.on("click", function (val) {
            _this.toggle();
        });
        Widget.call(this, id, "toggle_button");
        $('.toggle').toggles();
        d3.selectAll(".toggle-inner").style("display", "inline-flex"); // this fixes a bug in jquery toggles, which does not render correctly when the browser page is zoomed at 80% zoom
        return this;
    }
    ToggleButton.prototype = Object.create(Widget.prototype);
    ToggleButton.prototype.constructor = ToggleButton;
    ToggleButton.prototype.parentClass = Widget.prototype;
    /**
     * Returns a JSON object representation of this Widget.
     * @returns {object}
     * @memberof module:ToggleButton
    */
    ToggleButton.prototype.toJSON = function () {
        return {
            type: this.type(),
            id: this.id(),
            backgroundColor: this.backgroundColor,
            orientation: this.orientation
        };
    };
    ToggleButton.prototype.toggle = function () {
        return this.button.click({ functionText: this.functionText() });
    };
    ToggleButton.prototype.isOn = function () {
        return this.toggle_elem.select(".toggle-on").classed("active");
    };
    ToggleButton.prototype.off = function () {
        $("#" + this.id() + "_elem").data('toggles').toggle(false);
        // return this.toggle(false);
    };
    ToggleButton.prototype.on = function () {
        $("#" + this.id() + "_elem").data('toggles').toggle(true);
        // return this.toggle(true);
    };
    /**
    * Updates the location and size of the widget according to the given position and size
     */
    ToggleButton.prototype.updateLocationAndSize = function (pos, opt) {
        opt = opt || {};
        if (opt.imageMap) {
            ToggleButton.prototype.parentClass.updateLocationAndSize.apply(this, arguments);
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
    ToggleButton.prototype.updateStyle = function (data) {
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
    ToggleButton.prototype.remove = function () {
        ToggleButton.prototype.parentClass.remove.apply(this);
        d3.select("div." + this.id()).remove();
    };
    ToggleButton.prototype.setColors = function (colors, opt) {
        colors = colors || {};
        opt = opt || {};
        opt.auditoryFeedback = opt.auditoryFeedback || "disabled";
        this.fontColor = colors.fontColor || this.fontColor;
        this.backgroundColor = colors.backgroundColor || this.backgroundColor;
        return this.render(this.txt, opt);
    };
    ToggleButton.prototype.invertColors = function () {
        var tmp = this.backgroundColor;
        this.backgroundColor = this.fontColor;
        this.fontColor = tmp;
        var elemIsBlinking = (document.getElementById(this.id()).getAttribute("class").indexOf("blink") >= 0);
        return this.render(this.txt, { blinking: elemIsBlinking });
    };
    ToggleButton.prototype.invertGlyphiconColors = function () {
        var tmp = this.backgroundColor;
        this.backgroundColor = this.fontColor;
        this.fontColor = tmp;
        var elemIsBlinking = (document.getElementById(this.id()).getAttribute("class").indexOf("blink") >= 0);
        return this.renderGlyphicon(this.txt, { blinking: elemIsBlinking });
    };
    ToggleButton.prototype.renderSample = function (opt) {
        opt = opt || {};
        return this.render();
    };
    ToggleButton.prototype.render = function (txt, opt) {
        return this.reveal();
    };
    ToggleButton.prototype.hide = function () {
        return this.div.style("display", "none");
    };
    ToggleButton.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    ToggleButton.prototype.move = function (data) {
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

    module.exports = ToggleButton;
});
