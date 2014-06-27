/**
 * Displays a question to the user. Uses event dispatcher to tell the caller what button was clicked
 in response to the question.
 * @author Patrick Oladimeji
 * @date 2/20/14 14:52:24 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Backbone, Handlebars, self */
define(function (require, exports, module) {
    "use strict";
    var d3 = require("d3/d3"),
        formTemplate = require("text!./templates/displayQuestion.handlebars"),
        FormUtils = require("./FormUtils");
    
    var QuestionView = Backbone.View.extend({
        initialize: function (data) {
            d3.select(this.el).attr("class", "overlay").style("top", self.scrollY + "px");
            this.render(data);
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
				this.trigger("ok", {data: formdata, el: this.el}, this);
			}
		},
		cancel: function (event) {
			this.trigger("cancel", {el: this.el}, this);
		}
    });
    
    module.exports = {
        /**
         * creates a new form view to display questions. Renders two buttons for
         * taking positive or negative responses to the question posed.
         * @param {header: {string}, question: {string}} data Data to use to render the form
         */
        create: function (data) {
            return new QuestionView(data);
        }
    };
});
