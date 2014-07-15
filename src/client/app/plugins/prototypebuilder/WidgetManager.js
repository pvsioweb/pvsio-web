/**
 * @module WidgetManager
 * @desc WidgetManager deals with interacting with user interface widgets used for prototyping picture based uis.
 * @author Patrick Oladimeji
 * @date 10/30/13 21:42:56 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, _ */
define(function (require, exports, module) {
    "use strict";
    var d3 = require("d3/d3"),
        eventDispatcher = require("util/eventDispatcher"),
		imageMapper             = require("imagemapper"),
		WSManager				= require("websockets/pvs/WSManager"),
        uidGenerator            = require("util/uuidGenerator"),
	    EditWidgetView            = require("pvsioweb/forms/editWidget"),
		Button                    = require("pvsioweb/Button"),
        Display                    = require("pvsioweb/Display"),
		NewWidgetView            = require("pvsioweb/forms/newWidget"),
        StateParser = require("util/PVSioStateParser");
	var wm, mapCreator;
	
   ///TODO this should be moved out of this file and promoted to a property, or a function parameter in createImageMap
	function renderResponse(err, res) {
//        var state = res.data.join("");
        var stateString = res.data[0];
        var state = StateParser.parse(stateString);
		//render displays
		wm.getDisplayWidgets().forEach(function (w) {
			w.render(state);
		});
	}
	
	function createImageMap(widget) {
        if (widget.needsImageMap()) { widget.createImageMap(WSManager.getWebSocket(), renderResponse); }
    }

	
    function handleWidgetEdit(widget) {
        if (widget) {
            var wEd = EditWidgetView.create(widget);
            wEd.on("ok", function (e, view) {
                view.remove();
                widget.updateWithProperties(e.data);
                //create an interactive image area only if there isnt one already
                createImageMap(widget);
            }).on("cancel", function (e, view) {
                view.remove();
            });
        }
    }
	/**
		@class WidgetManager
		@classdesc WidgetManager deals with interacting with user interface widgets used for prototyping picture based uis.
	*/
	/**
	 * Instantiates a new WidgetManager
	 * @private
	 */
	function WidgetManager() {
        this._widgets = {};
        eventDispatcher(this);
    }
    
	/**
		Restores the widget definitions passed in the parameter.
		@param {Object} defs JSOn specification for the widget definitions to restore
		@memberof WidgetManager
	 */
    WidgetManager.prototype.restoreWidgetDefinitions = function (defs) {
		var wm = this;
        if (defs) {
            console.log(defs);
            var widget;
            _.each(defs.widgetMaps, function (w, key) {
                w.type = w.type.toLowerCase();
                widget = w.type === "button" ? new Button(key) : new Display(key);
                widget.updateWithProperties(w);
                wm.addWidget(widget);
            });

            //create div
            defs.regionDefs.forEach(function (d) {
                widget = wm.getWidget(d["class"]);
                var coords = d.coords.split(",").map(function (d) {
                    return parseFloat(d);
                });
                var h = coords[3] - coords[1], w = coords[2] - coords[0], x = coords[0], y = coords[1];
                var mark = mapCreator.restoreRectRegion({x: x, y: y, width: w, height: h});
                mark.attr("id", widget.id()).classed(widget.type(), true);
                widget.element(mark);
                createImageMap(widget);
                //set the font-size of the mark to be 80% of the height and the id of the mark
                mark.on("dblclick", function () {
                    handleWidgetEdit(wm.getWidget(mark.attr("id")));
                });
            });
        }
    };

	WidgetManager.prototype.updateMapCreator = function (cb) {
		var wm = this, event = {type: "WidgetModified"};
        imageMapper({element: "#imageDiv img", parent: "#imageDiv", onReady: function (mc) {
            mapCreator = mc.on("create", function (e) {
                var region = e.region;
                region.on("dblclick", function () {
                    handleWidgetEdit(wm.getWidget(region.attr("id")));
                });
                //pop up the widget edit dialog
                NewWidgetView.create()
                    .on("ok", function (e, view) {
                        view.remove();
                        var id = e.data.type + "_" + uidGenerator();
                        var widget = e.data.type === "button" ? new Button(id) : new Display(id);
                        region.classed(widget.type(), true)
                            .attr("id", id);
                        widget.updateWithProperties(e.data);
                        widget.element(region);
                        createImageMap(widget);
                        wm.addWidget(widget);
                        event.action = "create";
                        event.widget = widget;
                        wm.fire(event);
                    }).on("cancel", function (e, view) {
                        view.remove();
                        d3.select(region.node().parentNode).remove();
                    });
            }).on("resize", function (e) {
                wm.updateLocationAndSize(e.region.attr("id"), e.pos);
                event.action = "resize";
                event.widget = wm.getWidget(e.region.attr("id"));
                wm.fire(event);
            }).on("move", function (e) {
                wm.updateLocationAndSize(e.region.attr("id"), e.pos);
                event.action = "move";
                event.widget = wm.getWidget(e.region.attr("id"));
                wm.fire(event);
            }).on("remove", function (e) {
                e.regions.each(function () {
                    var w = wm.getWidget(d3.select(this).attr("id"));
                    if (w) {
                        w.remove();
                    } else {
                        d3.select(this.parentNode).remove();
                    }
                });
                event.action = "remove";
                wm.fire(event);
            });
            if (cb) { cb(); }
        }});
    };

	/**
		Get the current map creator
		@memberof WidgetManager
	 */
	WidgetManager.prototype.mapCreator = function () {
		return mapCreator;
	};
	
	/**
		Clears the widget areas on the interface.
		@memberof WidgetManager
	 */
    WidgetManager.prototype.clearWidgetAreas = function () {
        //clear old widhget maps and area def
        if (this.mapCreator()) {
            this.mapCreator().clear();
        }
        this.clearWidgets();
    };
	/**
		Gets the widget with the specified id.
		@param {string} id The html element id of the widget
		@memberof WidgetManager
	 */
    WidgetManager.prototype.getWidget = function (id) {
        return this._widgets[id];
    };
    /**
		Adds the specified widget to the list of widgets.
		@param {Widget} widget The widget to add.
		@memberof WidgetManager
	 */
    WidgetManager.prototype.addWidget = function (widget) {
        this._widgets[widget.id()] = widget;
    };
    /**
		Removes the specified widget from the list of widgets.
		@param {Widget} widget The widget to remove.
		@memberof WidgetManager
	 */
    WidgetManager.prototype.removeWidget = function (widget) {
        widget.remove();
        delete this._widgets[widget.id()];
    };
    /**
		Gets a list of all the display widgets loaded on the page.
		@returns {Display[]}
		@memberof WidgetManager
	 */
	WidgetManager.prototype.getDisplayWidgets = function () {
		return _.filter(this._widgets, function (w) {
			return w.type() === "display";
		});
	};
	/**
		Gets a list of all the button widgets loaded on the page.
		@returns {Button[]}
		@memberof WidgetManager
	 */
	WidgetManager.prototype.getButtonWidgets = function () {
		return _.filter(this._widgets, function (w) {
			return w.type() === "button";
		});
	};
	/**
		Update  the location of the widget by updating the image map coords to the position given.
		@param {Widget} widget The widget to update
		@param {{x: number, y: number, width: number, height: number}} pos The new position and size
		@memberof WidgetManager
	 */
    WidgetManager.prototype.updateLocationAndSize = function (widget, pos) {
		if (typeof widget === "string") { widget = this.getWidget(widget); }
        if (widget) {
            widget.updateLocationAndSize(pos);
        }
    };
    /**
     * Returns a JSON object representing widget definitions for the currently open project
	   @memberof WidgetManager
     */
    WidgetManager.prototype.getWidgetDefinitions = function () {
        var widgets = [], regionDefs = [];
        _.each(this._widgets, function (widget) {
            widgets.push(widget.toJSON());
			var a = widget.imageMap();
			regionDefs.push({"class": a.attr("class"), shape: a.attr("shape"),
						coords: a.attr("coords"), href: a.attr("href")});
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
	
    module.exports = {
		/**
		 * Returns a singleton instance of the WidgetManager
		 */
		getWidgetManager: function () {
			if (!wm) {
				wm = new WidgetManager();
			}
			return wm;
		}
	};
});
