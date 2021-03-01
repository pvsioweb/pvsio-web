import { BuilderEvents, SelectWidgetEvent } from './BuilderView';
import { WidgetsMap } from './CentralView';
import { SideView, SideViewOptions } from './SideView';

const widgetsListViewTemplate: string = `
{{#each widgets}}
<button type="button" class="py-2 btn-sm list-group-item list-group-item-action widget-list-item" widget-id="{{widget-id}}" widget-name="{{name}}">{{kind}}: {{name}}</button>
{{/each}}
`;

/**
 * Renders the widgets list in the side panel
 */
export class WidgetsListView extends SideView {

    /**
     * Constructor
     * @param data 
     */
    constructor (data: SideViewOptions) {
        super(data);
        this.render();
    }

    /**
     * Refresh the view
     * @param widgetsMap 
     */
    refresh (widgetsMap: WidgetsMap): void {
        const data: { [id: string]: { "widget-id": string, kind: string, name: string }} = {};
        for (let i in widgetsMap) {
            data[i] = { "widget-id": widgetsMap[i].getId(), kind: widgetsMap[i].getKind(), name: widgetsMap[i].getName() };
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

    /**
     * Select a widget programmatically
     * @param data 
     */
    selectWidget (data: { id: string }): void {
        if (data?.id) {
            this.clearSelection();
            const elem: JQuery<HTMLElement> = this.$el.find(`[widget-id=${data.id}]`);
            elem.addClass("active");
            const event: SelectWidgetEvent = { id: data.id };
            this.trigger(BuilderEvents.DidSelectWidget, event);
        }
    }
    /**
     * Deselect a widget programmatically
     * @param data 
     */
    deselectWidget (data: { id: string }): void {
        if (data?.id) {
            const elem: JQuery<HTMLElement> = this.$el.find(`[widget-id=${data.id}]`);
            elem.removeClass("active");
            const event: SelectWidgetEvent = { id: data.id };
            this.trigger(BuilderEvents.DidDeselectWidget, event);
        }
    }
    /**
     * Clear selection programmatically
     * @param data 
     */
    clearSelection (): void {
        this.$el.find(`.widget-list-item`).removeClass("active");
    }
    /**
     * Edit a widget programmatically: selects the widget and triggers WillEditWidget event
     * @param data 
     */
    editWidget (data: { id: string }): void {
        if (data.id) {
            this.selectWidget(data);
            const event: SelectWidgetEvent = { id: data.id };
            this.trigger(BuilderEvents.WillEditWidget, event);
        }
    }
}
