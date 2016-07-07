/**
 * @module BaseWidgetManager
 * @description
 * @author Nathaniel Watson
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, _ */
define(function (require, exports, module) {
    function WidgetManager() {}
    
    _.extend(WidgetManager.prototype, Backbone.Events);
    
    /**
        Gets the widget with the specified id.
        @param {string} id The html element id of the widget
        @memberof module:WidgetManager
     */
    WidgetManager.prototype.getWidget = function (id) {
        return this._widgets[id];
    };
    
    /**
        Adds the specified widget to the list of widgets.
        @param {Widget} widget The widget to be added.
        @memberof module:WidgetManager
     */
    WidgetManager.prototype.addWidget = function (widget) {
        this._widgets[widget.id()] = widget;
    };
    
    /**
        Removes the specified widget from the list of widgets.
        @param {Widget} widget The widget to remove.
        @memberof module:WidgetManager
     */
    WidgetManager.prototype.removeWidget = function (widget) {
        widget.remove();
        delete this._widgets[widget.id()];
    };
    
    /**
        Update  the location of the widget by updating the image map coords to the position given.
        @param {Widget} widget The widget to update
        @param {{x: number, y: number, width: number, height: number}} pos The new position and size
        @param {Number?} scale a scale factor for the pos value. If not supplied defaults to 1
        @memberof WidgetManager
     */
    WidgetManager.prototype.updateLocationAndSize = function (widget, pos, scale) {
        scale = scale || 1;
        if (typeof widget === "string") { widget = this.getWidget(widget); }
        if (widget) {
            pos.x *= scale;
            pos.y *= scale;
            pos.width *= scale;
            pos.height *= scale;
            widget.updateLocationAndSize(pos);
        }
    };
    
    /**
     * Returns a JSON object representing widget definitions for the currently open project
       @memberof WidgetManager
     */
    WidgetManager.prototype.getWidgetDefinitions = function () {
        var scale = (d3.select("svg > g").node()) ?
                        +(d3.select("svg > g").attr("transform").replace("scale(", "").replace(")", "")) || 1 : 1;
        var widgets = [], regionDefs = [];
        _.each(this._widgets, function (widget) {
            widgets.push(widget.toJSON());
            var a = widget.imageMap();
            if (a) {
                var scaledCoords = a.attr("coords").split(",").map(function (c) {
                    return +c / scale;
                }).join(",");
                regionDefs.push({"class": a.attr("class"), shape: a.attr("shape"),
                            coords: scaledCoords, href: a.attr("href")});
            }
        });
        return {widgetMaps: widgets, regionDefs: regionDefs};
    };

    /**
        Removes all the widgets on the interface
     */
    WidgetManager.prototype.clearWidgets = function () {
        _.each(this._widgets, function (value) {
            value.remove();//remove the widgets from the interface
        });
        this._widgets = {};
    };
    /**
        update all the area maps attributed to all widgets on the project by the given scale factor
        @param {Number} scale the scale to transform the maps by
    */
    WidgetManager.prototype.scaleAreaMaps = function (scale) {
        var _this = this;
        var widgets = _this.getAllWidgets();
        function _getPos(el) {
            return {x: el.attr("x"), y: el.attr("y"), height: el.attr("height"), width: el.attr("width")};
        }
        widgets.forEach(function (w) {
            var pos = _getPos(w.element());
            _this.updateLocationAndSize(w, pos, scale);
        });
    };
        
    module.exports = WidgetManager;
});
