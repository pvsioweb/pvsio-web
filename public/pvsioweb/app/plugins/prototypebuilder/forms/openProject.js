/**
 * handles creating a form for opening a project
 * @author Patrick Oladimeji
 * @date Jan 5, 2013 : 6:42:35 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, $, Handlebars, Backbone*/
define(function (require, exports, module) {
	"use strict";
	var d3						= require("d3/d3"),
		template				= require("text!./templates/openProject.handlebars"),
		FormUtils				= require("./FormUtils");
	
	
	var OpenProjectView = Backbone.View.extend({
		initialize: function (data) {
			d3.select(this.el).attr("class", "overlay");
			this.render(data);
		},
		render: function (data) {
			var t = Handlebars.compile(template);
			this.$el.html(t(data));
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
			return new OpenProjectView({projects: options.map(labelFunc)});
		}
	};
});