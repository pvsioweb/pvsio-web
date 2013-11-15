/**
 * WidgetManager deals with interacting with user interface widgets used for prototyping picture based uis.
 * @author Patrick Oladimeji
 * @date 10/30/13 21:42:56 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent, _ */
define(function (require, exports, module) {
    "use strict";
    var d3 = require("d3/d3"),
		property = require("util/property"),
		imageMapper             = require("imagemapper"),
		WSManager				= require("websockets/pvs/WSManager"),
        uidGenerator            = require("util/uuidGenerator"),
	    EditWidgetView            = require("pvsioweb/forms/editWidget"),
		Button                    = require("pvsioweb/Button"),
        Display                    = require("pvsioweb/Display"),
		NewWidgetView            = require("pvsioweb/forms/newWidget");
	var wm, mapCreator;
	
   ///TODO this should be moved out of this file and promoted to a property, or a function parameter in createImageMap
	function renderResponse(err, res) {
		//render displays
		wm.getDisplayWidgets().forEach(function (w) {
			w.render(res.data);
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
	
	function WidgetManager() {
        this._widgets = {};
    }
    
	
    WidgetManager.prototype.restoreWidgetDefinitions = function (defs) {
		var wm = this;
        if (defs) {
            console.log(defs);
            var key, w, widget, property;
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
		var ws = WSManager.getWebSocket(), wm = this;
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
                        widget.updateWidthProperties(e.data);
                        widget.element(region);
                        widget.createImageMap(ws);
                        wm.addWidget(widget);
                    }).on("cancel", function (e, view) {
                        view.remove();
                        d3.select(region.node().parentNode).remove();
                    });
            }).on("resize", function (e) {
                wm.updateLocation(e.region.attr("id"), e.pos);
            }).on("move", function (e) {
                wm.updateLocation(e.region.attr("id"), e.pos);
            }).on("remove", function (e) {
                e.regions.each(function () {
                    var w = wm.getWidget(d3.select(this).attr("id"));
                    if (w) {
                        w.remove();
                    } else {
                        d3.select(this.parentNode).remove();
                    }
                });
            });
            if (cb) { cb(); }
        }});
    };

	
	WidgetManager.prototype.mapCreator = function () {
		return mapCreator;
	};
	 
    WidgetManager.prototype.clearWidgetAreas = function () {
        //clear old widhget maps and area def
        if (this.mapCreator()) {
            this.mapCreator().clear();
        }
        this.clearWidgets();
    };
	
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
        if (widget && widget.imageMap()) {
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
	
    module.exports = {
		getWidgetManager: function () {
			if (!wm) {
				wm = new WidgetManager();
			}
			return wm;
		}
	};
});
