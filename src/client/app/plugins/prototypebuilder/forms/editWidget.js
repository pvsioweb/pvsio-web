/**
 * Edit widget
 * @author Patrick Oladimeji
 * @date 11/5/13 13:16:05 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Handlebars, $*/
define(function (require, exports, module) {
    "use strict";
    var FormUtils		= require("./FormUtils"),
        template		= require("text!./templates/editWidget.handlebars"),
        BaseDialog      = require("pvsioweb/forms/BaseDialog"),
        widgetPreviewer = require("pvsioweb/forms/widgetPreviewer"),
        d3				= require("d3/d3");

    function getWidgetEvents(widgetType) {
        var evts = [];
        d3.select("#events").selectAll("input[type='radio']").each(function () {
            if (this.checked) { evts = evts.concat(this.value.split("/")); }
        });
        return evts;
    }
    function updateBoundFunctionsLabel() {
        var f = d3.select("#functionText").property("value"),
            str = "",
            events = [];
        d3.select("#events").selectAll("input[type='radio']").each(function () {
            if (this.checked) {
                events = events.concat(this.value.split("/"));
            }
        });
        str = events.map(function (d) {
            return d + "_" + f;
        }).join(", ");
        d3.select("#boundFunctions").text(str);
    }
    function updateTimerEvent() {
        var f = d3.select("#timerEvent").property("value");
        d3.select("#timerFunction").text(f);
    }
    function showWidgetPreview(widgetType) {
        if (widgetType === "button") {
            widgetPreviewer.preview(widgetType, {
                keyboardKey: d3.select("#keyCode").node().value,
                buttonReadback: d3.select("#buttonReadback").node().value,
                evts: getWidgetEvents(widgetType)
            });
        } else if (widgetType === "display") {
            widgetPreviewer.preview(widgetType, {
                auditoryFeedback: d3.select("#auditoryFeedback").node().checked,
                fontsize: d3.select("#fontsize").node().value,
                fontColor: d3.select("#fontColor").node().value,
                backgroundColor: d3.select("#backgroundColor").node().value
            });
        } else if (widgetType === "numericdisplay") {
            widgetPreviewer.preview(widgetType, {
                auditoryFeedback: d3.select("#auditoryFeedback").node().checked,
                fontsize: d3.select("#fontsize").node().value,
                fontColor: d3.select("#fontColor").node().value,
                backgroundColor: d3.select("#backgroundColor").node().value
            });
        } else if (widgetType === "touchscreenbutton") {
            widgetPreviewer.preview(widgetType, {
                buttonReadback: d3.select("#buttonReadback").node().value,
                fontsize: d3.select("#fontsize").node().value,
                fontColor: d3.select("#fontColor").node().value,
                backgroundColor: d3.select("#backgroundColor").node().value
            });
        } else if (widgetType === "touchscreendisplay") {
            widgetPreviewer.preview(widgetType, {
                auditoryFeedback: d3.select("#auditoryFeedback").node().checked,
                cursorName: d3.select("#cursorName").node().value,
                fontsize: d3.select("#fontsize").node().value,
                fontColor: d3.select("#fontColor").node().value,
                backgroundColor: d3.select("#backgroundColor").node().value
            });
        } else if (widgetType === "led") {
            var color = d3.select("#ledColor").node().value;
            widgetPreviewer.preview(widgetType, {
                color: color
            });
        }
    }

    var EditWidgetView	= BaseDialog.extend({
        render: function (widget) {
            var t = Handlebars.compile(template);
            var widgetData = widget.toJSON();
            widgetData.isButton = widget.type() === "button";
            widgetData.isDisplay = widget.type() === "display";
            widgetData.isNumericDisplay = widget.type() === "numericdisplay";
            widgetData.isTouchscreenDisplay = widget.type() === "touchscreendisplay";
            widgetData.isTouchscreenButton = widget.type() === "touchscreenbutton";
            widgetData.isLED = widget.type() === "led";
            widgetData.isTimer = widget.type() === "timer";
            this.$el.html(t(widgetData));
            $("body").append(this.el);
            this.widget = widget;

            //update form
            if (widgetData.isButton || widgetData.isTouchscreenButton) {
                widget.evts().forEach(function (e) {
                    d3.select("input[type='radio'][value='" + e + "']").property("checked", true);
                });
                updateBoundFunctionsLabel();
            }
            if (widget.auditoryFeedback && widget.auditoryFeedback() === "enabled") {
                d3.select("input[type='checkbox'][name='auditoryFeedback']").property("checked", true);
            }
            showWidgetPreview(widget.type());
            return this;
        },
        events: {
            "click #btnOk"                : "ok",
            "click #btnCancel"            : "cancel",
            "change input[type='radio'][name='button_events']"           : "eventsChanged",
            "change input[type='radio'][name='touchscreenbutton_events']": "eventsChanged",
            "keyup #functionText"         : "eventsChanged",
            "keyup #timerEvent"           : "timerEventChanged",
            "change input[type='checkbox']": "updatePreview",
            "keyup #buttonReadback"       : "updatePreview",
            "keyup #ledColor"             : "updatePreview",
            "keyup #fontsize"             : "updatePreview",
            "keyup #fontColor"            : "updatePreview",
            "keyup #backgroundColor"      : "updatePreview",
            "keyup #cursorName"           : "updatePreview"
        },
        eventsChanged: function (event) {
            updateBoundFunctionsLabel();
            showWidgetPreview(this.widget.type());
        },
        updatePreview: function (event) {
            showWidgetPreview(this.widget.type());
        },
        timerEventChanged: function (event) {
            updateTimerEvent(this.widget.type());
        },
        ok: function (event) {
            var form = this.el;
            if (FormUtils.validateForm(form)) {
                var formdata = FormUtils.serializeForm(form, "input");
                // update auditory feedback and touchscreen properties if the properties are supported by the widget
                if (this.widget.auditoryFeedback) {
                    formdata.auditoryFeedback = (d3.select("input[type='checkbox'][name='auditoryFeedback']").property("checked")) ? "enabled" : "disabled";
                }
                if (formdata.button_events) {
                    formdata.evts = formdata.button_events;
                    delete formdata.button_events;
                }
                // trigger event
                this.trigger("ok", { data: formdata, el: this.el, event: event }, this);
            }
        },
        cancel: function (event) {
            this.trigger("cancel", {el: this.el, event: event}, this);
        }
    });

    module.exports = {
        create: function (widget) {
            return new EditWidgetView(widget);
        }
    };
});
