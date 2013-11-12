/**
 * Create the widgets form using backbonejs and handlebars
 * @author Patrick Oladimeji
 * @date 11/4/13 22:12:09 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Handlebars, Backbone */
define(function (require, exports, module) {
	"use strict";
	var FormUtils					= require("./FormUtils"),
		template					= require("text!./templates/createWidget.handlebars"),
		d3							= require("d3/d3");
	
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
        d3.select("#boundFunctions").text(str);
    }
	
	var NewWidgetView	= Backbone.View.extend({
		initialize: function () {
			d3.select(this.el).attr("class", "overlay");
			this.render();
		},
		render: function () {
			var t = Handlebars.compile(template);
			this.$el.html(t());
			$("body").append(this.el);
			$("#tabHeaders #displayTab").tab("show");
			return this;
		},
		events: {
			"click #btnOk": "ok",
			"click #btnCancel": "cancel",
			"click #displayTab": "displayTabClicked",
			"click #buttonTab": "buttonTabClicked",
			"change #predefinedRegex": "regexChanged",
			"change input[type='checkbox'][name='events']": "eventsChanged",
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
			var form = d3.select(this.el).select("form");
			var type = form.select("li.active a").html().toLowerCase();
			var activeForm = form.select("#" + type).node();
			if (FormUtils.validateForm(activeForm)) {
				var formdata = FormUtils.serializeForm(activeForm);
				formdata.type = type;
				this.trigger("ok", {data: formdata, el: this.el, event: event}, this);
			}
		},
		cancel: function (event) {
			this.trigger("cancel", {el: this.el, event: event}, this);
		},
		displayTabClicked: function (event) {
			event.preventDefault();
			$(event.target).tab("show");
		},
		buttonTabClicked: function (event) {
			event.preventDefault();
			$(event.target).tab("show");
		}
	});
	
	module.exports = {
		create: function () {
			var form = new NewWidgetView();
			return form;
		}
	};
});
