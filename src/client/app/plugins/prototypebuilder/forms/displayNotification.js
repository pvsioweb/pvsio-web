/**
 * Displays a notification to the user. This module is a variant of displayQuestion.js
 * @author Paolo Masci
 * @date 5/5/14 16:29:00 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Backbone, Handlebars, self */
define(function (require, exports, module) {
    "use strict";
    var d3 = require("d3/d3"),
        formTemplate = require("text!./templates/displayNotification.handlebars"),
        BaseDialog = require("pvsioweb/forms/BaseDialog"),
        FormUtils = require("./FormUtils");
    
    var NotificationView = BaseDialog.extend({
        render: function (data) {
            var template = Handlebars.compile(formTemplate);
            this.$el.html(template(data));
            $("body").append(this.el);
            return this;
        },
        events: {
			"click #btnOk": "ok"
		}
    });
    
    module.exports = {
        /**
         * creates a new form view to display questions. Renders two buttons for
         * taking positive or negative responses to the question posed.
         * @param {header: {string}, notification: {string}} data Data to use to render the form
         */
        create: function (data) {
            return new NotificationView(data);
        }
    };
});
