/**
 * 
 * @author Patrick Oladimeji
 * @date 3/25/14 14:02:48 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, Backbone, Handlebars */
define(function (require, exports, module) {
	"use strict";
	var d3						= require("d3/d3"),
		template				= require("text!./templates/playListView.handlebars"),
		FormUtils				= require("./FormUtils");
	
	
	var PlayListView = Backbone.View.extend({
		initialize: function (data) {
			this.render(data);
		},
		render: function (data) {
			var t = Handlebars.compile(template);
			this.$el.html(t(data));
			$("#scripts").append(this.el);
			return this;
		},
		events: {
            "click li": "scriptClicked"
		},
		scriptClicked: function (event) {
            this.trigger("scriptClicked", $(event.target).attr("name"));
        }
	});
	
	module.exports = {
		create: function (scripts) {
			return new PlayListView({scripts: scripts});
		}
	};
});