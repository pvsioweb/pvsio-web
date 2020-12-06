/**
 * Useful Utilities for working with html forms
 * @author Patrick Oladimeji
 * @date 11/5/13 9:22:48 AM
 */

const defaultInputSelectors = "select, input, textarea";

export function serializeForm(el: string, inputSelectors?: string) {
    inputSelectors = inputSelectors || defaultInputSelectors;
    const res = {};
    const elems: JQuery<HTMLDivElement> = $(`${el} ${inputSelectors}`);
    for (let i = 0; i < elems.length; i++) {
        const el: JQuery<HTMLDivElement> = $(elems[i]);
        const type: string = el.attr("type");
        if (type === "checkbox" || type === "radio") {
            //only add checkboxes when they aer checked
            if (this.checked) {
                //store as array if it is a checkbox
                if (!res[el.attr("name")]) { res[el.attr("name")] = []; }
                res[el.attr("name")].push(el.attr("value"));
            }
        } else if (el.attr("type") === "file") {
            res[el.attr("name")] =  el.attr("files");
        } else {
            res[el.attr("name")] = el.attr("value") || el.text();
        }
    }
    return res;
}
    
export function validate (form, inputSelectors) {
    let res: boolean = true;
    inputSelectors = inputSelectors || defaultInputSelectors;
    $(`${form} ${inputSelectors}`).each((d) => {
        res = res && this.checkValidity();
    });
    return res;
}