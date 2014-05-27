/**
 * Displays edit window for states and transitions.
 * @author Paolo Masci
 * @date 5/24/14 2:08:02 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Backbone, Handlebars, self */
define(function (require, exports, module) {
    "use strict";
    var d3 = require("d3/d3"),
        formTemplate = require("text!./templates/displayDelete.handlebars"),
        FormUtils = require("./FormUtils");
    
    var DeleteView = Backbone.View.extend({
        initialize: function (data) {
            d3.select(this.el).attr("class", "overlay").style("top", self.scrollY + "px");
            this.render(data);
            this._data = data;
        },
        render: function (data) {
            var template = Handlebars.compile(formTemplate);
            this.$el.html(template(data));
            $("body").append(this.el);
            // by default, select the cancel button
            d3.select(this.el).select("#btnLeft").node().focus();
            return this;
        },
        events: {
			"click #btnRight": "right",
			"click #btnLeft": "left"
		},
		right: function (event) {
			var form = this.el;
			if (FormUtils.validateForm(form)) {
                var selectors = [ "currentLabel" ];
				var formdata = FormUtils.serializeForm(form, selectors);
				this.trigger(this._data.buttons[1].toLowerCase(), {data: formdata, el: this.el}, this);
			}
		},
		left: function (event) {
			this.trigger(this._data.buttons[0].toLowerCase(), {el: this.el}, this);
		}
    });
    
    module.exports = {
        /**
         * @param {
         *    {header} form header
         *    {elem} list of diagram elements already present in the diagram
         *    {buttons} names for cancel and ok buttons
         * }
         */
        create: function (data) {
            return new DeleteView(data);
        }
    };
});
