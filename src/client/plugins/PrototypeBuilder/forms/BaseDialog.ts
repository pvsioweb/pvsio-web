/**
 * Base module for dialog boxes. This module implements several default functions for dialog boxes.
 * 1. It ensures that all dialog boxes inherited from it are draggable
 * 2. It implements default behaviours for canceling and accepting a form using Esc and Enter  respectively
 * 3. It appends events registered in subclasses to the base events list and where functions are redefined, those functions override the ones defined in this module
 * @author Patrick Oladimeji
 * @date 11/6/14 9:10:56 AM
 */
import * as FormUtils from "./FormUtils";
import * as template from './Templates';
import * as Backbone from 'backbone';

export abstract class BaseDialog extends Backbone.Model {
    protected div: JQuery<HTMLDivElement>;
    protected ok: JQuery<HTMLDivElement>;
    protected cancel: JQuery<HTMLDivElement>;

    render (content: string, data) {
        this.div = $("#PVSioWebModalCenter");
        if (!this.div[0]) {
            const model: string = template.makeDialogTemplate(content);
            const dialog: string = Handlebars.compile(model)(data);
            this.div = $(dialog);
            $("body").append(this.div)
        }
        this.ok = $("#PVSioWebModalCenter ok-button");
        this.ok.on("click", (evt: JQuery.Event) => {
            const formdata = FormUtils.serializeForm(this.div[0].innerHTML);
            this.trigger("ok", { data: formdata, el: this.div, event: evt });
        });
        this.cancel = $("#PVSioWebModalCenter cancel-button");
        this.cancel.on("click", (evt: JQuery.Event) => {
            const formdata = FormUtils.serializeForm(this.div[0].innerHTML);
            this.trigger("cancel", { data: formdata, el: this.div, event: evt });
        });
        this.div.css("display", "block");
    }
}