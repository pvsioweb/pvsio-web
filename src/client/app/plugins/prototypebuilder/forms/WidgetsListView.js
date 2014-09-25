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
	var wlTemplate = require("text!./templates/widgetsList.handlebars");
	
	var WidgetsListView = Backbone.View.extend({
		initialize: function (data) {
			this.render(data);
		},
		render: function (data) {
			var template = Handlebars.compile(wlTemplate);
			this.$el.html(template(data));
			$("#widgetsList").html("").append(this.el);
			return this;
		},
		events: {
			"click li": "widgetSelected",
			"dblclick li": "showEditDialog"
		},
		showEditDialog: function (event) {
			var selectedListItem = d3.select(event.currentTarget);
			var widgetId = selectedListItem.attr("widget-id");
			var dblclick = new Event("dblclick");
			var widget = WidgetManager.getWidget(widgetId);
			if (widget) {
				widget.element().node().dispatchEvent(dblclick);	
			}
			event.preventDefault();
			event.stopPropagation();
			return false;
		},
		widgetSelected: function (event) {
			var selectedListItem = d3.select(event.currentTarget);
			var widgetId = selectedListItem.attr("widget-id");
			var widget = d3.select("#" + widgetId).node();
			if (!event.shiftKey) {
				d3.selectAll("g.selected").classed("selected", false);
				d3.selectAll("#widgetsList li").classed("selected", false);
			}
			d3.select(widget.parentNode).classed("selected", true);
			selectedListItem.classed("selected", true);
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
	});
	
	module.exports = {
		create: function () {
			var widgets = WidgetManager.getAllWidgets().map(function (w) { return w.toJSON(); });
			return new WidgetsListView(widgets);	
		}
	};
});
