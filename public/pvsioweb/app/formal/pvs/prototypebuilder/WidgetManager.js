/**
 * WidgetManager deals with interacting with user interface widgets used for prototyping picture based uis.
 * @author Patrick Oladimeji
 * @date 10/30/13 21:42:56 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent, _ */
define(function (require, exports, module) {
    "use strict";
    var d3 = require("d3/d3");
    var wm;
    function WidgetManager() {
        this._widgets = {};
    }
    
    WidgetManager.prototype.getWidget = function (id) {
        return this._widgets[id];
    };
    
    WidgetManager.prototype.addWidget = function (widget) {
        this._widgets[widget.id()] = widget;
    };
    
    WidgetManager.prototype.removeWidget = function (widget) {
        widget.remove();
        delete this._widgets[widget.id()];
    };
    
	WidgetManager.prototype.getDisplayWidgets = function () {
		return _.filter(this._widgets, function (w) {
			return w.type() === "display";
		});
	};
	
	WidgetManager.prototype.getButtonWidgets = function () {
		return _.filter(this._widgets, function (w) {
			return w.type() === "button";
		});
	};
	
    WidgetManager.prototype.updateLocation = function (widget, pos) {
		if (typeof widget === "string") { widget = this.getWidget(widget); }
        if (widget.imageMap()) {
            widget.imageMap().attr("coords", [pos.x, pos.y, pos.x + pos.width, pos.y + pos.height].join(","));
        } else {
			throw new Error("Image Map has not be initialised for this Widget");
		}
    };
    /**
     * Returns a JSON object representing widget definitions for the currently open project
     */
    WidgetManager.prototype.getWidgetDefinitions = function () {
        var widgets = [], regionDefs = [];
        _.each(this._widgets, function (widget, widgetId) {
            widgets.push(widget.toJSON());
			var a = widget.imageMap();
			regionDefs.push({"class": a.attr("class"), shape: a.attr("shape"),
						coords: a.attr("coords"), href: a.attr("href")});
        });
        return {widgetMaps: widgets, regionDefs: regionDefs};
    };
    
    WidgetManager.prototype.clearWidgets = function () {
		_.each(this._widgets, function (value, key) {
			value.remove();//remove the widgets from the interface
		});
		this._widgets = {};
	};
	
    module.exports = function () {
		if (!wm) {
			wm = new WidgetManager();
		}
		return wm;
	};
});
