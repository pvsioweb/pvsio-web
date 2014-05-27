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
		FormUtils				= require("./FormUtils");
	
	
	var OpenFilesView = Backbone.View.extend({
		initialize: function () {
			d3.select(this.el).attr("class", "overlay").style("top", self.scrollY + "px");
			this.render();
		},
		render: function () {
			var t = Handlebars.compile(template);
			this.$el.html(t());
			$("body").append(this.el);
			return this;
		},
		events: {
			"click #btnOk": "ok",
			"click #btnCancel": "cancel"
		},
		
		ok: function (event) {
			var form = this.el;
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
		create: function (options, labelFunc) {
			labelFunc = labelFunc || function (d) { return d.label; };
			return new OpenFilesView();
		}
	};
});
