/**
 * handles creating a form for opening a project
 * @author Patrick Oladimeji, Paolo Masci
 * @date Jan 5, 2013 : 6:42:35 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, $, Handlebars, Backbone, self*/
define(function (require, exports, module) {
	"use strict";
	var d3			 = require("d3/d3"),
		formTemplate = require("text!./templates/openTextFile.handlebars"),
		FormUtils	 = require("pvsioweb/forms/FormUtils");
	
	
	var OpenLocalFileAsJSONView = Backbone.View.extend({
		initialize: function (data) {
			d3.select(this.el).attr("class", "overlay").style("top", self.scrollY + "px");
			this.render(data);
            this._data = data;
		},
		render: function (data) {
            var template = Handlebars.compile(formTemplate);
            this.$el.html(template(data));
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
		create: function (data) {
			return new OpenLocalFileAsJSONView(data);
		}
	};
});
