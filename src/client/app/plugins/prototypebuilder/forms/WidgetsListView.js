/**
 * View that renders the list of widgets currently on the simulator
 * @author Patrick Oladimeji
 * @date 9/17/14 14:40:29 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, require, Backbone, Handlebars, $, d3, Event*/
define(function (require, exports, module) {
	"use strict";
	var WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager();
	var itemTemplate = require("text!./templates/widgetListItem.handlebars");

	function WidgetsListView(widgets) {
		var el = d3.select("#widgetsList").html("").append("ul");
		
		function update(data) {
            var listItems = el.selectAll("li.list-group-item").data(data, function (data) {
                return data.id();
            });
            var enteredItems = listItems.enter();
            var exitedItems = listItems.exit();
            enteredItems.append("li").attr("class", "list-group-item")
                .attr("widget-id", function (w) {
                    d3.selectAll("#widgetsList ul li").classed("selected", false);
                    return w.id();
                }).classed("selected", true)
                .text(function (widget, i) {
                    var label = widget.type() + ": " + widget.displayKey();
                    return label;
                }).on("click", function (w) {
                    var event = d3.event;
                    if (!event.shiftKey) {
                        d3.selectAll("g.selected").classed("selected", false);
                        d3.selectAll("#widgetsList ul li").classed("selected", false);
                    }
                    d3.select(this).classed("selected", true);
                    d3.select(w.parentGroup()).classed("selected", true);
                    event.preventDefault();
                    event.stopPropagation();
                }).on("dblclick", function (w) {
                    var event = d3.event;
                    var dblclick = new Event("dblclick");
                    w.element().node().dispatchEvent(dblclick);
                    event.preventDefault();
                    event.stopPropagation();
                });
            exitedItems.transition().duration(220).style("opacity", 0).remove();
		}
		
		update(widgets);
		
		WidgetManager.addListener("WidgetModified", function (event) {
			switch (event.action) {
            case "create":
                widgets.push(event.widget);
                break;
            case "remove":
                var index = widgets.indexOf(event.widget);
                if (index > -1) {
                    widgets.splice(index, 1);
                }
                break;
            default:
                break;
			}
			update(widgets);
		}).addListener("WidgetSelected", function (event) {
			var e = new Event("click");
			e.shiftKey = event.event.shiftKey;
			el.select("li[widget-id='" + event.widget.id() + "']").node().dispatchEvent(e);
		});
	}
	
	
	module.exports = {
		create: function () {
			var widgets = WidgetManager.getAllWidgets();
			return new WidgetsListView(widgets);
		}
	};
});
