/**
 * Shows a dialog to save changes to a project
 * @author Patrick Oladimeji
 * @date Dec 29, 2013 : 23:23:48
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, $, Handlebars, Backbone, self*/
define(function (require, exports, module) {
	"use strict";
	var d3						= require("d3/d3"),
		template				= require("text!./saveChanges.handlebars");
	
	var SaveProjectChangesView = Backbone.View.extend({
		initialize: function (data) {
			d3.select(this.el).attr("class", "overlay").style("top", self.scrollY + "px");
			this.render(data);
		},
		render: function (data) {
			var t = Handlebars.compile(template);
			this.$el.html(t(data));
			$("body").append(this.el);
			return this;
		},
		events: {
			"click #btnYes": "yes",
			"click #btnNo": "no"
		},
		
		yes: function (event) {
            this.trigger("yes", {el: this.el, event: event}, this);
		},
		no: function (event) {
			this.trigger("no", {el: this.el, event: event}, this);
		}
	});
	
	module.exports = {
		create: function (project) {
			return new SaveProjectChangesView({name: project.name()});
		}
	};
});