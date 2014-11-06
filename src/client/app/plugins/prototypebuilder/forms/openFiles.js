/**
 * handles creating a form for opening a project
 * @author Patrick Oladimeji
 * @date Jan 5, 2013 : 6:42:35 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, $, Handlebars, Backbone, self*/
define(function (require, exports, module) {
	"use strict";
	var d3						= require("d3/d3"),
		template				= require("text!./templates/openFiles.handlebars"),
        BaseDialog = require("pvsioweb/forms/BaseDialog"),
	   FormUtils				= require("./FormUtils");
	
	
	var OpenFilesView = BaseDialog.extend({
		render: function () {
			var t = Handlebars.compile(template);
			this.$el.html(t());
			$("body").append(this.el);
			return this;
		},
		events: {
			"click #btnOk": "ok",
			"click #btnCancel": "cancel"
		}
	});
	
	module.exports = {
		create: function (options, labelFunc) {
			labelFunc = labelFunc || function (d) { return d.label; };
			return new OpenFilesView();
		}
	};
});
