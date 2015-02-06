/**
 * model for new project
 * @author Paolo Masci
 * @date Jan 5, 2015 12:11:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, require, Handlebars, $*/
define(function (require, exports, module) {
	"use strict";
	var d3			= require("d3/d3"),
		saveProjectTemplate = require("text!./templates/saveProject.handlebars"),
        BaseDialog  = require("pvsioweb/forms/BaseDialog"),
		FormUtils   = require("pvsioweb/forms/FormUtils");
    var defaultName;
	
	var SaveProjectView = BaseDialog.extend({
		render: function () {
			var template = Handlebars.compile(saveProjectTemplate);
			this.$el.html(template({ projectName: defaultName }));
			$("body").append(this.el);
			return this;
		},
		events: {
			"click #btnOk": "ok",
			"click #btnCancel": "cancel"
		}
	});
	
	module.exports = {
		create: function (projectName) {
            defaultName = projectName || "";
			return new SaveProjectView();
		}
	};
});