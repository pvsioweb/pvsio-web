/**
 * @module PIMWidget
 * @desc PIM Prototype widget
 * @author Nathanile Watson
 */
define(function (require, exports, module) {
    "use strict";
    var Widget = require("widgets/Widget"),
        property = require("util/property");

    var PIMWidget = function (id, coords, opt) {
        opt = opt || {};
        opt.evts = ["click"];
        coords = coords || {};
        this.imageMap = property.call(this);

        Widget.call(this, id, "pim-button");

        this.y = coords.top || 0;
        this.x = coords.left || 0;
        this.width = coords.width || 32;
        this.height = coords.height || 32;

        return this;
    };


    PIMWidget.prototype = Object.create(Widget.prototype);
    PIMWidget.prototype.constructor = PIMWidget;
    PIMWidget.prototype.parentClass = Widget.prototype;

    /**
     * Returns a JSON object representation of this Widget.
     * @returns {object}
     * @memberof PIMWidget
    */
    PIMWidget.prototype.toJSON = function () {
        return {
            id: this.id(),
            type: this.type()
        };
    };

    /**
     * Returns an object containing the x, y, width and height properties of the widget.
     * @returns {object}
     * @memberof PIMWidget
    */
    PIMWidget.prototype.getCoords = function () {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    };

    PIMWidget.prototype.createImageMap = function (opt) {
    };

    PIMWidget.prototype.updateLocationAndSize = function (pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.width = pos.width;
        this.height = pos.height;

        // TODO: nwatson: update the area map
    };

    module.exports = PIMWidget;
});
