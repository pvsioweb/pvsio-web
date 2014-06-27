/**
 * Edit widget
 * @author Patrick Oladimeji
 * @date 11/5/13 13:16:05 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Handlebars, Backbone, self */
define(function (require, exports, module) {
	"use strict";
	var FormUtils					= require("./FormUtils"),
		template					= require("text!./templates/editWidget.handlebars"),
		d3							= require("d3/d3");

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
			d3.select(this.el).attr("class", "overlay").style("top", self.scrollY + "px");
			this.render(data.widget);
		},
		render: function (widget) {
			var t = Handlebars.compile(template);
			var widgetData = widget.toJSON();
			widgetData.isDisplay = widget.type() === "display";
			this.$el.html(t(widgetData));
			$("body").append(this.el);
			this.widget = widget;
            
			//update form
			if (widget.type() === "button") {
				widget.events().forEach(function (e) {
					d3.select("input[type='checkbox'][value='" + e + "']").property("checked", true);
				});
			}
            if (widget.auditoryFeedback && widget.auditoryFeedback()) {
                d3.select("input[type='checkbox'][name='auditoryFeedback']").property("checked", true);
            }
			return this;
		},
		events: {
			"change input[type='checkbox'][name='events']": "eventsChanged",
			"click #btnOk": "ok",
			"click #btnCancel": "cancel",
			"keyup #functionText": "eventsChanged"
		},
		eventsChanged: function (event) {
			updateBoundFunctionsLabel();
		},
		ok: function (event) {
			var form = this.el;
			if (FormUtils.validateForm(form, "input[type='checkbox'][name='events'], input[type='text'], textarea")) {
				var formdata = FormUtils.serializeForm(form, "input");
                //add auditory feedback property manually
                if (this.widget.auditoryFeedback && this.widget.auditoryFeedback()) {
                    formdata.auditoryFeedback = d3.select("input[type='checkbox'][name='auditoryFeedback']").property("checked");
                }
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
