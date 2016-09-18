/**
 * Create the widgets form using backbonejs and handlebars
 * @author Patrick Oladimeji
 * @date 11/4/13 22:12:09 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, Handlebars*/
define(function (require, exports, module) {
    "use strict";
    var FormUtils		= require("./FormUtils"),
        template		= require("text!./templates/createWidget.handlebars"),
        BaseDialog      = require("pvsioweb/forms/BaseDialog"),
        widgetPreviewer = require("pvsioweb/forms/widgetPreviewer"),
        d3				= require("d3/d3");

    function getWidgetEvents(widgetType) {
        var evts = [];
        d3.select("#" + widgetType).select("#events").selectAll("input[type='radio']").each(function () {
            if (this.checked) { evts = evts.concat(this.value.split("/")); }
        });
        return evts;
    }

    function updateBoundFunctionsLabel() {
        var activeForm = d3.select("form").select(".active").node();
        if (activeForm) {
            var widgetType = activeForm.children[0].getAttribute("widgetType");
            var f = d3.select("#" + widgetType).select("#functionText").property("value"),
                events = getWidgetEvents(widgetType),
                str = (f && f !== "") ? events.map(function (d) {
                    return d + "_" + f;
                }).join(", ") : "";
            d3.select("#" + widgetType).select("#boundFunctions").text(str);
        }
    }

    function showWidgetPreview() {
        var activeForm = d3.select("form").select(".active").node();
        if (activeForm) {
            var widgetType = activeForm.children[0].getAttribute("widgetType");
            if (widgetType === "button") {
                widgetPreviewer.preview(widgetType, {
                    keyboardKey: d3.select("#" + widgetType).select("#keyCode").node().value,
                    buttonReadback: d3.select("#" + widgetType).select("#buttonReadback").node().value,
                    evts: getWidgetEvents(widgetType)
                });
            } else if (widgetType === "display") {
                widgetPreviewer.preview(widgetType, {
                    auditoryFeedback: d3.select("#" + widgetType).select("#auditoryFeedback").node().checked,
                    fontsize: d3.select("#" + widgetType).select("#fontsize").node().value,
                    fontColor: d3.select("#" + widgetType).select("#fontColor").node().value,
                    backgroundColor: d3.select("#" + widgetType).select("#backgroundColor").node().value
                });
            } else if (widgetType === "numericdisplay") {
                widgetPreviewer.preview(widgetType, {
                    auditoryFeedback: d3.select("#" + widgetType).select("#auditoryFeedback").node().checked
                });
            } else if (widgetType === "touchscreenbutton") {
                widgetPreviewer.preview(widgetType, {
                    buttonReadback: d3.select("#" + widgetType).select("#buttonReadback").node().value
                });
            } else if (widgetType === "touchscreendisplay") {
                widgetPreviewer.preview(widgetType, {
                    auditoryFeedback: d3.select("#" + widgetType).select("#auditoryFeedback").node().checked
                });
            } else if (widgetType === "led") {
                var color = d3.select("#" + widgetType).select("#ledColor").node().value;
                widgetPreviewer.preview(widgetType, {
                    color: color
                });
            }
        }
    }

    var NewWidgetView	= BaseDialog.extend({
        render: function (data) {
            var t = Handlebars.compile(template);
            this.$el.html(t(data));
            $("body").append(this.el);
            $("#tabHeaders #buttonTab").tab("show");
            showWidgetPreview();
            return this;
        },
        events: {
            "click #btnOk"                : "ok",
            "click #btnCancel"            : "cancel",
            "click #displayTab"           : "changeTab",
            "click #numericdisplayTab"    : "changeTab",
            "click #buttonTab"            : "changeTab",
            "click #touchscreendisplayTab": "changeTab",
            "click #touchscreenbuttonTab" : "changeTab",
            "click #ledTab"               : "changeTab",
            "change input[type='radio'][name='events']": "eventsChanged",
            "keyup #functionText"         : "eventsChanged",
            "change input[type='checkbox']": "updatePreview",
            "keyup #buttonReadback"       : "updatePreview",
            "keyup #ledColor"             : "updatePreview",
            "keyup #fontsize"             : "updatePreview",
            "keyup #fontColor"            : "updatePreview",
            "keyup #backgroundColor"      : "updatePreview"
        },
        eventsChanged: function (event) {
            updateBoundFunctionsLabel();
            showWidgetPreview();
        },
        updatePreview: function (event) {
            showWidgetPreview();
        },
        ok: function (event) {
            var activeForm = d3.select("form").select(".active").node();
            var widgetType = activeForm.children[0].getAttribute("widgetType");
            var res = d3.select("#" + widgetType).node();
            if (FormUtils.validateForm(res)) {
                var formdata = FormUtils.serializeForm(res, "input");
                formdata.type = widgetType;
                // trigger event
                this.trigger("ok", {data: formdata, el: this.el, event: event}, this);
            }
        },
        cancel: function (event) {
            this.trigger("cancel", {el: this.el, event: event}, this);
        },
        changeTab: function (event) {
            event.preventDefault();
            $(event.target).tab("show");
            showWidgetPreview();
        }
    });

    module.exports = {
        create: function (data) {
            data = data || { top: 10, left: 10, width: 60, height: 32 };
            var form = new NewWidgetView(data);
            return form;
        }
    };
});
