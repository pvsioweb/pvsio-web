/**
 * model for new project
 * @author Patrick Oladimeji, Paolo Masci
 * @date Jan 3, 2013 : 12:56:03 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, require, Handlebars, $*/
define(function (require, exports, module) {
	"use strict";
	var d3			= require("d3/d3"),
		createProjectTemplate = require("text!./templates/createProject.handlebars"),
        BaseDialog  = require("pvsioweb/forms/BaseDialog"),
		FormUtils   = require("pvsioweb/forms/FormUtils");
	
	var CreateProjectView = BaseDialog.extend({
		render: function () {
			var template = Handlebars.compile(createProjectTemplate);
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
			return new CreateProjectView();
		}
	};
});