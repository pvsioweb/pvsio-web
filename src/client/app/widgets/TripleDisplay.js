/**
 * @module TripleDisplay
 * @version 2.0
 * @description This module renders three displays horizontally aligned next to each other.
 *              It is intended to be used for rendering triples such as (label, val, units), e.g., rate 1.2mL/h.
 * @author Paolo Masci
 * @date Apr 2, 2015
 *
 * @example <caption>Typical use of TripleDisplay APIs within a PVSio-web plugin module.</caption>
 * // Example module that uses TripleDisplay.
 * define(function (require, exports, module) {
 *     "use strict";
 *
 * });
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";

//    var d3 = require("d3/d3");
//    var black, white;
    var SingleDisplay = require("widgets/SingleDisplay");

    /**
     * @function <a name="TripleDisplay">TripleDisplay</a>
     * @description Constructor.
     * @param id {String} The ID of the HTML element where the display will be rendered.
     * @param coords {Object} The four coordinates (x1,y1,x2,y2) of the display, specifying
     *        the left, top, right, bottom corner of the rectangle (for shape="rect")
     * @param opt {Object}
     * @memberof module:DoubleDisplay
     * @instance
     */
    function TripleDisplay(id, coords, opt) {
        opt = opt || {};
        this.id = id;
        this.parent = opt.parent || "body";
        this.ratio = opt.ratio || 0.32;
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 200;
        this.height = coords.height || 80;
        var coords_left = {
            top: (opt.left_display && opt.left_display.top) ? opt.left_display.top : this.top,
            left: (opt.left_display && opt.left_display.left) ? opt.left_display.left : this.left,
            width: (opt.left_display && opt.left_display.width) ? opt.left_display.width : this.width * this.ratio,
            height: (opt.left_display && opt.left_display.height) ? opt.left_display.height : this.height
        };
        var coords_center = {
            top: (opt.center_display && opt.center_display.top)
                    ? opt.center_display.top : this.top,
            left: (opt.center_display && opt.center_display.left)
                    ? opt.center_display.left : (coords_left.left + coords_left.width),
            width: (opt.center_display && opt.center_display.width)
                    ? opt.center_display.width
                    : (this.width - coords_left.width) * 0.5,
            height: (opt.center_display && opt.center_display.height)
                    ? opt.center_display.height : coords.height
        };
        var coords_right = {
            top: (opt.right_display && opt.right_display.top)
                    ? opt.right_display.top : this.top,
            left: (opt.right_display && opt.right_display.center)
                    ? opt.right_display.center : (coords_center.left + coords_center.width),
            width: (opt.right_display && opt.right_display.width)
                    ? opt.right_display.width : (this.width - coords_center.width - coords_left.width),
            height: (opt.right_display && opt.right_display.height) ? opt.right_display.height : coords.height
        };
        var opt_left = {
            parent: opt.parent,
            font: opt.font,
            align: (opt.left_display && opt.left_display.align) ? opt.left_display.align : opt.align,
            inverted: opt.inverted
        };
        var opt_center = {
            parent: opt.parent,
            font: opt.font,
            align: (opt.center_display && opt.center_display.align) ? opt.center_display.align : opt.align,
            inverted: opt.inverted
        };
        var opt_right = {
            parent: opt.parent,
            font: opt.font,
            align: (opt.right_display && opt.right_display.align) ? opt.right_display.align : opt.align,
            inverted: opt.inverted
        };
        this.leftDisplay = new SingleDisplay(id + "_left", coords_left, opt_left);
        this.centerDisplay = new SingleDisplay(id + "_center", coords_center, opt_center);
        this.rightDisplay = new SingleDisplay(id + "_right", coords_right, opt_right);
        this.reveal();
        return this;
    }

    TripleDisplay.prototype.getLeftDisplay = function () {
        return this.leftDisplay;
    };

    TripleDisplay.prototype.getRightDisplay = function () {
        return this.rightDisplay;
    };

    TripleDisplay.prototype.getCenterDisplay = function () {
        return this.centerDisplay;
    };

    TripleDisplay.prototype.renderLabel = function (txt) {
        return this.leftDisplay.render(txt);
    };

    TripleDisplay.prototype.renderValue = function (val) {
        return this.centerDisplay.render(val);
    };

    TripleDisplay.prototype.renderUnits = function (units) {
        return this.rightDisplay.render(units);
    };

    TripleDisplay.prototype.hide = function () {
        this.leftDisplay.hide();
        this.centerDisplay.hide();
        this.rightDisplay.hide();
        return this;
    };

    TripleDisplay.prototype.reveal = function () {
        this.leftDisplay.reveal();
        this.centerDisplay.reveal();
        this.rightDisplay.reveal();
        return this;
    };

//    TripleDisplay.prototype.move = function (data) {
//        this.leftDisplay.move(data);
//        this.centerDisplay.move(data);
//        this.rightDisplay.move(data);
//        return this;
//    };


    module.exports = TripleDisplay;
});
