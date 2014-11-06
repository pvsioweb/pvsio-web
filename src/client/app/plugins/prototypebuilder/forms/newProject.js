/**
 * model for new project
 * @author Patrick Oladimeji
 * @date Jan 3, 2013 : 12:56:03 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, d3, require, __dirname, _, Handlebars, Backbone, self, $*/
define(function (require, exports, module) {
	"use strict";
	var d3			= require("d3/d3"),
		npTempl		= require("text!./templates/newProject.handlebars"),
        BaseDialog = require("pvsioweb/forms/BaseDialog"),
		FormUtils = require("./FormUtils");
	
	var NewProjectView = BaseDialog.extend({
		render: function () {
			var template = Handlebars.compile(npTempl);
			this.$el.html(template());
			$("body").append(this.el);
			return this;
		},
		events: {
			"click #btnOk": "ok",
			"click #btnCancel": "cancel"
		}
	});
	
	module.exports = {
		create: function () {
			var newProject = new NewProjectView({});
			return newProject;
		}
	};
});