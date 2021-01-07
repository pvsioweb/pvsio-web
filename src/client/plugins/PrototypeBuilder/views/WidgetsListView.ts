import * as Backbone from 'backbone';
import { BuilderEvents, SelectWidgetEvent, WidgetsMap } from './View';

const widgetsListViewTemplate: string = `
{{#each widgets}}
<button type="button" class="btn-sm list-group-item list-group-item-action widget-list-item" widget-id="{{widget-id}}" widget-name="{{name}}">{{type}}: {{name}}</button>
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
        const data: { [id: string]: { "widget-id": string, type: string, name: string }} = {};
        for (let i in widgetsMap) {
            data[i] = { "widget-id": widgetsMap[i].getId(), type: widgetsMap[i].getType(), name: widgetsMap[i].getName() };
        }
        // update DOM
        const content: string = Handlebars.compile(widgetsListViewTemplate, { noEscape: true })({
            widgets: data
        });
        this.$el.html(content);

        // click toggles selection status
        this.$el.find(".widget-list-item").on("click", (evt: JQuery.ClickEvent) => {
            const id: string = $(evt?.currentTarget).attr("widget-id");
            // const name: string = $(evt?.currentTarget).attr("widget-name");
            const active: boolean = $(evt?.currentTarget).hasClass("active");
            if (active) {
                // deselect widget
                this.deselectWidget({ id });
            } else {
                // select widget
                this.selectWidget({ id });
            }
        });
        // double click opens widget editor
        this.$el.find(".widget-list-item").on("dblclick", (evt: JQuery.DoubleClickEvent) => {
            const id: string = $(evt?.currentTarget).attr("widget-id");
            // edit widget
            this.editWidget({ id });
        });
    }

    selectWidget (data: { id: string }): void {
        if (data?.id) {
            this.clearSelection();
            const elem: JQuery<HTMLElement> = this.$el.find(`[widget-id=${data.id}]`);
            elem.addClass("active");
            const event: SelectWidgetEvent = { id: data.id };
            this.trigger(BuilderEvents.DidSelectWidget, event);
        }
    }
    deselectWidget (data: { id: string }): void {
        if (data?.id) {
            const elem: JQuery<HTMLElement> = this.$el.find(`[widget-id=${data.id}]`);
            elem.removeClass("active");
            const event: SelectWidgetEvent = { id: data.id };
            this.trigger(BuilderEvents.DidDeselectWidget, event);
        }
    }
    clearSelection (): void {
        this.$el.find(`.widget-list-item`).removeClass("active");
    }
    editWidget (data: { id: string }): void {
        if (data.id) {
            const elem: JQuery<HTMLElement> = this.$el.find(`[widget-id=${data.id}]`);
            this.selectWidget(data);
            const event: SelectWidgetEvent = { id: data.id };
            this.trigger(BuilderEvents.WillEditWidget, event);
        }
    }
}
