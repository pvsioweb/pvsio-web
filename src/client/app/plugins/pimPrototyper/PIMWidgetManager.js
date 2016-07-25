/* global _ */

/**
* @module PIMWidgetManager
* @description Compatibility 'layer' that allows classes from the original prototype builder to interact with a PIM
* screen
* @author Nathaniel Watson
*/
define(function (require, exports, module) {
    var BaseWidgetManager = require("pvsioweb/BaseWidgetManager"),
        PIMWidget  = require("./PIMWidget"),
        uidGenerator = require("util/uuidGenerator");

    var PIMWidgetManager = function() {
        this._widgets = {};
    };

    PIMWidgetManager.prototype = Object.create(BaseWidgetManager.prototype);

    /**
     * Updates the widget manager to use the provided screen
     * @param {Screen} scrn Prototype screen whose widgets should be managed by this manager
     */
    PIMWidgetManager.prototype.setScreen = function (scrn) {
        var _this = this;
        this._screen = scrn;

        if (this._screen != null && this._screen.get("widgets") != null) {
            this._widgets = this._screen.get("widgets"); // TODO: nwatson: would this be better as an ES5 getter?

            _.each(this._widgets, function(widget) {
                _this.trigger("WidgetRegionRestored", widget, widget.getCoords());
            });
        } else {
            this._widgets = {};
        }
    };

    /**
     * Creates a new widget and adds it to the WidgetManager and underlying PIM screen
     * @param {object} data Data object from a NewWidgetView callback
     * @param {object} coord Object with top, left, width, height properties specifying the widget position
     * @param {function} onCreate Called once the widget has been created, but before it is added to the manager
     * @return {Widget} The new widget
     */
    PIMWidgetManager.prototype.addNewWidget = function (data, coord, onCreate) {
        var id = "pimwidget_" + uidGenerator();

        var widget = new PIMWidget(id, coord, data);

        if (onCreate) {
            onCreate(widget);
        }

        widget.updateWithProperties(data);
        this.addWidget(widget);
        this.trigger("WidgetModified", {action: "create", widget: widget});

        return widget;
    };


    return PIMWidgetManager;
});
