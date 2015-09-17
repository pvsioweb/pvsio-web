/**
 * Displays edit window for pm states.
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Backbone, Handlebars, self */
define(function (require, exports, module) {
	"use strict";
	var d3 = require("d3/d3"),
		formTemplate         = require("text!../templates/pim/displayEditPIMState.handlebars"),
		FormUtils            = require("plugins/emulink/forms/FormUtils"),
		displayEditPIMWidget = require("plugins/emulink/forms/pim/displayEditPIMWidget"),
		displayEditPIMPMR    = require("plugins/emulink/forms/pim/displayEditPIMPMR"),
		PIMs                 = require("plugins/emulink/pim/PIMs");

	var EditPIMStateView = Backbone.View.extend({
		initialize: function (data) {
			d3.select(this.el).attr("class", "overlay").style("top", self.scrollY + "px").style("z-index", 998);
			this.render(data);
			this._data = data;
			// Used for cloning the widgets to edit.
			this.pims = new PIMs();
		},
		render: function (data) {
			var template = Handlebars.compile(formTemplate);
			this.$el.html(template(data));
			$("body").append(this.el);
			d3.select(this.el).select("#newStateName").node().focus();
			return this;
		},
		events: {
			"click #btnRight": "right",
			"click #btnLeft": "left",
			"click #newStateWidgets": "editWidgets",
			"click #newStatePMR": "editPMR"
		},
		right: function (event) {
			var form = this.el;
			if (FormUtils.validateForm(form)) {
				var selectors = [ "newStateName", /*"newStateComponents",*/ "newStatePMR" ];
				var formdata = FormUtils.serializeForm(form, selectors);
				// Set the widget values obtained from the editWidgits view.
				formdata.labels.set("newStateWidgets", this._data.value.widgets);
				//formdata.labels.set("newStateComponents", this._data.value.components);
				formdata.labels.set("newStatePMR", this._data.value.pmr);
				this.trigger(this._data.buttons[1].toLowerCase().replace(new RegExp(" ", "g"), "_"),
					{data: formdata, el: this.el}, this);
			}
		},
		left: function (event) {
			this.trigger(this._data.buttons[0].toLowerCase(), {el: this.el}, this);
		},
		editWidgets: function (event) {
			var _this = this;
			var data = _this._data.value;
			displayEditPIMWidget.create({
				header: "Edit " + data.newStateName + " widgets...",
				textLabel: {
					newWidgetName: "Name",
					newWidgetCategory: "Category",
					newWidgetBehaviours: "Behaviours"
				},
				placeholder: {
					newWidgetName: "Name",
					newWidgetCategory: "Category",
					newWidgetBehaviours: "Behaviours (Multiple with ,)"
				},
				value: {
					widgets: _this.pims.getWidgets(data.widgets) || []
				},
				buttons: ["Cancel", "Save Widgets"]
			}).on("save_widgets", function (e, view) {
				// Save the cloned widgets as the original.
				data.widgets = e.data;
				view.remove();
				d3.select(_this.el).select("#newStateName").node().focus();
			}).on("cancel", function (e, view) {
				// Discard the cloned widgets, revert to the original.
				view.remove();
				d3.select(_this.el).select("#newStateName").node().focus();
			});
		},
		editPMR: function (event) {
			var _this = this;
			var data = _this._data.value;
			displayEditPIMPMR.create({
				header: "Edit " + data.newStateName + " presentation model relations...",
				textLabel: {
					behaviour: "S_Behaviour",
					operation: "Operation"
				},
				placeholder: {
					operation: "Operation"
				},
				value: {
					widgets: _this.pims.getWidgets(data.widgets) || [],
					pmr: _this.pims.getPMR(data.pmr) || d3.map()
				},
				buttons: ["Cancel", "Save PMR"]
			}).on("save_pmr", function (e, view) {
				_this.pims.mergePMR(data.pmr, e.data);
				view.remove();
				d3.select(_this.el).select("#newStateName").node().focus();
			}).on("cancel", function (e, view) {
				view.remove();
				d3.select(_this.el).select("#newStateName").node().focus();
			});
		}
	});

	module.exports = {
		/**
		 * @param {
         *    {header} form header
         *    {buttons} names for cancel and ok buttons
         * }
		 */
		create: function (data) {
			return new EditPIMStateView(data);
		}
	};
});
