/**
 * Edit widget
 * @author Patrick Oladimeji, Paolo Masci
 * @date 11/5/13 13:16:05 PM
 */
import { WidgetEVO } from "../widgets/core/WidgetEVO";
import { WidgetDescriptor } from "../widgets/core/WidgetEVO";
import { BaseDialog } from "./BaseDialog";
import { editWidgetTemplate } from "./Templates";
const widgetPreviewer = require("pvsioweb/forms/widgetPreviewer");

export interface WidgetData extends WidgetDescriptor {
    isButton?: boolean;
    isDisplay?: boolean;
    isNumericDisplay?: boolean;
    isTouchscreenDisplay?: boolean;
    isTouchscreenButton?: boolean;
    isLED?: boolean;
    isTimer?: boolean;
};

export class EditWidgetView extends BaseDialog {

    protected widget: WidgetEVO;

    constructor (widget: WidgetEVO) {
        super();
    
        this.widget = widget;
        const widgetData: WidgetData = widget.toJSON();
        widgetData.isButton = widget.type === "button";
        widgetData.isDisplay = widget.type === "display";
        widgetData.isNumericDisplay = widget.type === "numericdisplay";
        widgetData.isTouchscreenDisplay = widget.type === "touchscreendisplay";
        widgetData.isTouchscreenButton = widget.type === "touchscreenbutton";
        widgetData.isLED = widget.type === "led";
        widgetData.isTimer = widget.type === "timer";

        this.render(editWidgetTemplate, widgetData);
    }

    render (template: string, widgetData: WidgetData) {
        // super.render(template, widgetData);
        // //update form
        // if (widgetData.isButton || widgetData.isTouchscreenButton) {
        //     if (this.widget["customFunctionText"] && typeof this.widget["customFunctionText"] === "function") {
        //         $("#custom_event").attr("checked");
        //         $("#boundFunctions").html(this.widget["customFunctionText"]());
        //     } else {
        //         for (let e in widget.evts) {
        //             d3.select("input[type='radio'][value='" + e + "']").property("checked", true);
        //         }
        //     }
        //     updateBoundFunctionsLabel(widget.type);
        // }
        // if (widget.auditoryFeedback && typeof widget.auditoryFeedback === "function" && widget.auditoryFeedback() === "enabled") {
        //     d3.select("input[type='checkbox'][name='auditoryFeedback']").property("checked", true);
        // }
        // showWidgetPreview(widget.type);
        
    }

    // getWidgetEvents(widgetType: string): string[] {
    //     let evts = [];
    //     const checked: JQuery<HTMLDivElement> = $("#events input[type='radio']:checked");
    //     for (let i = 0; i < checked.length; i++) {
    //         const elem: JQuery<HTMLDivElement> = $(checked[0]);
    //         evts = evts.concat(elem[0].innerHTML.split("/"));
    //     }
    //     return evts;
    // }
    // updateBoundFunctionsLabel(widgetType: string) {
    //     if ($("#custom_event")[0]) {
    //         if ($("#custom_event:checked")) {
    //             $("#boundFunctions").removeAttr("readonly");
    //         }
    //     }
    //     if ($("#functionText")[0]) {
    //         const f: string = $("#functionText").attr("value");
    //         const evts: string[] = this.getWidgetEvents(widgetType);
    //         const str = evts.map(function (d) {
    //             return d + "_" + f;
    //         }).join(", ");
    //         $("#boundFunctions").val(str);
    //         $("#boundFunctions").attr("readonly");
    //     }
    // }
    // updateTimerEvent() {
    //     const f: string = $("#timerEvent").attr("value");
    //     $("#timerFunction").text(f);
    // }
    // showWidgetPreview(widgetType: string) {
    //     if (widgetType.includes("display") || widgetType.includes("button") || widgetType.includes("touchscreen")) {
    //         widgetPreviewer.preview(widgetType, {
    //             keyboardKey: `${$("#keyCode").val()}`.trim(),
    //             auditoryFeedback: $("#auditoryFeedback").attr("checked"),
    //             fontsize: `${$("#fontsize").val()}`.trim(),
    //             fontColor: `${$("#fontColor").val()}`.trim(),
    //             backgroundColor: `${$("#backgroundColor").val()}`.trim(),
    //             cursorName: `${$("#cursorName").val()}`.trim(),
    //         });
    //     } else if (widgetType === "led") {
    //         widgetPreviewer.preview(widgetType, {
    //             color: `${$("#ledColor").val()}`.trim()
    //         });
    //     }
    // }

    // var EditWidgetView	= BaseDialog.extend({
    //     render: function (widget) {
    //         var t = Handlebars.compile(template);
    //         var widgetData = widget.toJSON();
    //         widgetData.isButton = widget.type === "button";
    //         widgetData.isDisplay = widget.type === "display";
    //         widgetData.isNumericDisplay = widget.type === "numericdisplay";
    //         widgetData.isTouchscreenDisplay = widget.type === "touchscreendisplay";
    //         widgetData.isTouchscreenButton = widget.type === "touchscreenbutton";
    //         widgetData.isLED = widget.type === "led";
    //         widgetData.isTimer = widget.type === "timer";
    //         this.$el.html(t(widgetData));
    //         $("body").append(this.el);
    //         this.widget = widget;

    //         return this;
    //     },
    //     events: {
    //         "click #btnOk"                : "ok",
    //         "click #btnCancel"            : "cancel",
    //         "change input[type='radio'][name='button_events']"           : "eventsChanged",
    //         "change input[type='radio'][name='touchscreenbutton_events']": "eventsChanged",
    //         "change input[type='checkbox']": "updatePreview",
    //         "input #functionText"         : "eventsChanged",
    //         "input #timerEvent"           : "timerEventChanged",
    //         "input #buttonReadback"       : "updatePreview",
    //         "input #ledColor"             : "updatePreview",
    //         "input #fontsize"             : "updatePreview",
    //         "input #fontColor"            : "updatePreview",
    //         "input #backgroundColor"      : "updatePreview",
    //         "input #cursorName"           : "updatePreview"
    //     },
    //     eventsChanged: function (event) {
    //         updateBoundFunctionsLabel(this.widget.type);
    //         showWidgetPreview(this.widget.type);
    //     },
    //     updatePreview: function (event) {
    //         showWidgetPreview(this.widget.type);
    //     },
    //     timerEventChanged: function (event) {
    //         updateTimerEvent(this.widget.type);
    //     },
    //     ok: function (event) {
    //         var form = this.el;
    //         if (FormUtils.validateForm(form)) {
    //             var formdata = FormUtils.serializeForm(form, "input");
    //             // update auditory feedback and touchscreen properties if the properties are supported by the widget
    //             if (this.widget.auditoryFeedback) {
    //                 formdata.auditoryFeedback = (d3.select("input[type='checkbox'][name='auditoryFeedback']").property("checked")) ? "enabled" : "disabled";
    //             }
    //             if (formdata.button_events) {
    //                 formdata.evts = formdata.button_events;
    //                 delete formdata.button_events;
    //                 if (formdata.evts[0] === "custom") {
    //                     formdata.customFunctionText = document.getElementById("boundFunctions").value;
    //                 } else {
    //                     formdata.customFunctionText = null;
    //                 }
    //             }
    //             // trigger event
    //             this.trigger("ok", { data: formdata, el: this.el, event: event }, this);
    //         }
    //     },
    //     cancel: function (event) {
    //         this.trigger("cancel", {el: this.el, event: event}, this);
    //     }
    // });
}