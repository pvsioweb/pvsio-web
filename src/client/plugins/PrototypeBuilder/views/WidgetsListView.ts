/**
 * View that lists all widgets within a prototype
 * @author Nathaniel Watson
 */

import Backbone = require("backbone");
import { WidgetsMap } from "./BuilderView";

const widgetsListViewTemplate: string = `
{{#each widgets}}
<button type="button" class="list-group-item list-group-item-action widget-list-item" widget-id="{{widget-id}}">{{type}}: {{name}}</button>
{{/each}}
`;

export interface WidgetListViewOptions extends Backbone.ViewOptions {
}

export class WidgetsListView extends Backbone.View {

    constructor (data: WidgetListViewOptions) {
        super(data);
        this.render();
    }

    refresh (widgetsMap: WidgetsMap): void {
        const widgets: { [id: string]: { "widget-id": string, type: string, name: string }} = {};
        for (let i in widgetsMap) {
            widgets[i] = { "widget-id": widgetsMap[i].getId(), type: widgetsMap[i].getType(), name: widgetsMap[i].getName() };
        }
        // update DOM
        const content: string = Handlebars.compile(widgetsListViewTemplate)({
            widgets
        });
        this.$el.html(content);

        // add event handlers
        // for (let i in components) {
        //     const widget: WidgetEVO = components[i];
        //     const id: string = widget.id;
        //     const $elem: JQuery<HTMLElement> = this.$el.filter(`#${id}`);
        //     $elem.on("click", (evt: JQuery.Event) => {
        //         const add: boolean = evt.shiftKey;
        //         this.selectWidget(id, add);
        //         evt.preventDefault();
        //         evt.stopPropagation();
        //     });
        //     $elem.on("dblclick", (evt: JQuery.Event) => {
        //         this.editWidget(id);
        //         evt.preventDefault();
        //         evt.stopPropagation();
        //     });
        // }
    }


    /**
     * @function selectWidget
     * @description Displays the given widget as selected within the view
     * @param {Widget} widget Widget to select
     * @param {boolean} add True if the widget should be added to the current selection, false if only it should
     * be selected.
     */
    selectWidget (id: string, add?: boolean): void {
        this.$el.filter(`#${id}`).addClass("active");
        this.trigger("WidgetSelected", { id, add });
    }

    editWidget (id: string, add?: boolean): void {
        this.$el.filter(`#${id}`).addClass("active");
        this.trigger("WidgetEditRequested", { id, add });
    }

    clearSelection (): void {
        this.$el.filter(`.widget-list-item`).removeClass("active");
    }
}
