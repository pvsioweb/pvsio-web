/**
 * Edit widget
 * @author Patrick Oladimeji
 * @date 11/5/13 13:16:05 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Handlebars, Backbone */
define(function (require, exports, module) {
	"use strict";
	var FormUtils					= require("./FormUtils"),
		template					= require("text!./templates/editWidget.handlebars"),
		d3							= require("d3/d3");
	
	var regexOptionMap = {"\\w+": "optString", "[0-9/.]+": "optNumeric"};
	function updateRegex() {
        var predefined = d3.select("#predefinedRegex").property("value"),
			prefix = d3.select("#prefix").property("value"),
			r = prefix + ":=(" + predefined + ")";
        d3.select("#regex").property("value", r);
    }

	function updateBoundFunctionsLabel() {
        var f = d3.select("#functionText").property("value"),
			str = "",
			events = [];
        d3.selectAll("input[type='checkbox'][name='events']").each(function () {
            if (this.checked) {
                events = events.concat(this.value.split("/"));
            }
        });
        str = events.map(function (d) {
            return d + "_" + f;
        }).join(", ");
        d3.select("#boundFunction").text(str);
    }
	
	var EditWidgetView	= Backbone.View.extend({
		initialize: function (data) {
			d3.select(this.el).attr("class", "overlay");
			this.render(data.widget);
		},
		render: function (widget) {
			var t = Handlebars.compile(template);
			var widgetData = widget.toJSON();
			widgetData.isDisplay = widget.type() === "display";
			this.$el.html(t(widgetData));
			$("body").append(this.el);
			
			//update form
			if (widget.type() === "button") {
				widget.events().forEach(function (e) {
					d3.select("input[type='checkbox'][value='" + e + "']").attr("checked", true);
				});
			} else {
				var optId = regexOptionMap[widget.predefinedRegex()] || "optCustom";
				d3.select("option#" + optId).attr("selected", true);
			}
			return this;
		},
		events: {
			"change #predefinedRegex": "regexChanged",
			"change input[type='checkbox'][name='events']": "eventsChanged",
			"click #btnOk": "ok",
			"click #btnCancel": "cancel",
			"keyup #functionText": "eventsChanged",
			"keyup #prefix": "regexChanged"
		},
		eventsChanged: function (event) {
			updateBoundFunctionsLabel();
		},
		regexChanged: function (event) {
			updateRegex();
		},
		ok: function (event) {
			var form = d3.select(this.el).select("form").node();
			if (FormUtils.validateForm(form)) {
				var formdata = FormUtils.serializeForm(form);
				this.trigger("ok", {data: formdata, el: this.el, event: event}, this);
			}
		},
		cancel: function (event) {
			this.trigger("cancel", {el: this.el, event: event}, this);
		}
	});
	
	module.exports = {
		create: function (widget) {
			return new EditWidgetView({widget: widget});
		}
	};
});
