/**
 * View that renders the list of widgets currently on the simulator
 * @author Patrick Oladimeji
 * @date 9/17/14 14:40:29 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, require, Backbone, Handlebars, $, d3*/
define(function (require, exports, module) {
	"use strict";
	var WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager();
	var itemTemplate = require("text!./templates/widgetListItem.handlebars");

	function WidgetsListView (widgets) {
		var el = d3.select("#widgetsList").append("ul");
		
		function update(data) {
			var listItems = el.selectAll("li.list-group-item").data(data);
			listItems.enter().append("li").attr("class", "list-group-item")
				.attr("widget-id", function (w) {
					return w.id();
				})
				.on("click", function (w) {
					var event = d3.event;
					if (!event.shiftKey) {
						d3.selectAll("g.selected").classed("selected", false);
						listItems.classed("selected", false);
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
			//update
			listItems.html(function (widget, i) {
				var template = Handlebars.compile(itemTemplate);
				return template(widget.toJSON());
			});
			//remove
			listItems.exit().remove();
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
