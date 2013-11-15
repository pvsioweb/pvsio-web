/**
 * model for new project
 * @author Patrick Oladimeji
 * @date Jan 3, 2013 : 12:56:03 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, _, Handlebars, Backbone, $*/
define(function (require, exports, module) {
	"use strict";
	var d3			= require("d3/d3"),
		npTempl		= require("text!./templates/newProject.handlebars"),
		FormUtils = require("./FormUtils");
	
	var NewProjectView = Backbone.View.extend({
		initialize: function () {
			d3.select(this.el).attr("class", "overlay");
			this.render();
		},
		render: function () {
			var template = Handlebars.compile(npTempl);
			this.$el.html(template());
			$("body").append(this.el);
			return this;
		},
		events: {
			"click #btnOk": "ok",
			"click #btnCancel": "cancel"
		},
		ok: function (event) {
			var form = d3.select(this.el).select("form").node();
			if (FormUtils.validateForm(form)) {
				var formdata = FormUtils.serializeForm(form);
				this.trigger("ok", {data: formdata, el: this.el}, this);
			}
		},
		cancel: function (event) {
			this.trigger("cancel", {el: this.el}, this);
		}
	});
	
	module.exports = {
		create: function () {
			var newProject = new NewProjectView({});
			return newProject;
		}
	};
});