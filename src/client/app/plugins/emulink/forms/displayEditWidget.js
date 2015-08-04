/**
 * Displays edit window for the widgets of a state.
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Backbone, Handlebars, self */
define(function (require, exports, module) {
	"use strict";
	var d3 = require("d3/d3"),
		formTemplate = require("text!./templates/displayEditWidget.handlebars"),
		FormUtils = require("./FormUtils");

	var EditWidgetView = Backbone.View.extend({
		initialize: function (data) {
			d3.select(this.el).attr("class", "overlay").style("top", self.scrollY + "px").style("z-index", 999);
			this.render(data);
			this._data = data;
			this._widgets = data.value.widgets;
			this._widgetsList = document.getElementById("pmWidgetsList");
			this.rebuildWidgetList();
			console.log(this._widgets);
		},
		render: function (data) {
			var template = Handlebars.compile(formTemplate);
			this.$el.html(template(data));
			$("body").append(this.el);
			d3.select(this.el).select("#newWidgetName").node().focus();
			return this;
		},
		events: {
			"click #btnRight2": "right",
			"click #btnLeft2": "left",
			"click #btnAdd": "add",
			"click .btnRemove": "removeWidget"
		},
		right: function (event) {
			this.trigger(this._data.buttons[1].toLowerCase().replace(new RegExp(" ", "g"), "_"),
				{data: this._widgets, el: this.el}, this);
		},
		left: function (event) {
			this.trigger(this._data.buttons[0].toLowerCase(), {el: this.el}, this);
		},
		add: function (event) {
			var _this = this;
			var form = this.el;
			if (FormUtils.validateForm(form)) {
				var selectors = ["newWidgetName", "newWidgetCategory", "newWidgetBehaviours"];
				var formData = FormUtils.serializeForm(form, selectors);
				FormUtils.clearForm(selectors);
				var newWidgetName = formData.labels.get("newWidgetName");
				var newWidgetCategory = formData.labels.get("newWidgetCategory");
				var newWidgetBehaviours = formData.labels.get("newWidgetBehaviours").split(',').filter(function(b) { return b.trim(); });
				var newWidget = { name: newWidgetName, category: newWidgetCategory, S_behaviours: newWidgetBehaviours };
				// Add new widget to the list.
				_this._widgets.push(newWidget);
				_this.rebuildWidgetList();
			}
		},
		removeWidget: function (event) {
			if (confirm("Delete this widget?")) {
				this._widgets.splice(event.currentTarget.parentNode.parentNode.id, 1);
				this.rebuildWidgetList();
			}
		},
		rebuildWidgetList: function () {
			var newList = "";
			var count = 0;
			// Rebuild the list each change :/
			// TODO: improve the table functions (use template) (ensure unique ids) (use a lib)!
			this._widgets.forEach(function (w) {
				newList +=
					'<div id="' + count++ + '" class="row" style="padding: 2px 0 2px 0;">' +
						'<div class="col-md-3">' + w.name + '</div>' +
						'<div class="col-md-3">' + w.category + '</div>' +
						'<div class="col-md-5">' + w.S_behaviours.join(", ") + '</div>' +
						'<div class="col-md-1"><button type="button" class="btn btn-danger btn-xs btnRemove right" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>' +
					'</div>';
			});
			this._widgetsList.innerHTML = newList;
		}
	});

	module.exports = {
		create: function (data) {
			return new EditWidgetView(data);
		}
	};
});
