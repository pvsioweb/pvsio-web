/**
 * View that lists all widgets within a prototype
 * @author Nathaniel Watson
 */

import Backbone = require("backbone");
import { WidgetEVO } from "../widgets/core/WidgetEVO";
import { WidgetManager } from "../WidgetManager";

const widgetsListTemplate: string = `
{{#each widgets}}
<button type="button" class="list-group-item list-group-item-action widget-list-item" id="{{id}}">{{type}}: {{name}}</button>
{{/each}}
`;

export interface WidgetListViewOptions extends Backbone.ViewOptions {
}

export class WidgetsListView extends Backbone.View {
    protected widgetManager: WidgetManager;
    protected labelFunction: (id: WidgetEVO) => string;

    protected $listItems: JQuery<HTMLUListElement>;

    constructor (widgetManager: WidgetManager, data: WidgetListViewOptions) {
        super(data);
        this.widgetManager = widgetManager;

        this.listenTo(this.widgetManager, "WidgetModified", () => {
            this.render();
        });
        this.listenTo(this.widgetManager, "WidgetSelected", (event: { id: string, add?: boolean }) => {
            this.selectWidget(event.id, event.add);
        });

        this.render();
    }

    /**
     * @function render
     * @description Updates and redraws the view.
     * @return {PrototypeImageView} The view
     */
    render (): WidgetsListView {
        const widgets: WidgetEVO[] = this.widgetManager.getAllWidgets();
        
        // update DOM
        const content: string = Handlebars.compile(widgetsListTemplate)({ widgets });
        this.$el.html(content);

        // add event handlers
        for (let i in widgets) {
            const widget: WidgetEVO = widgets[i];
            const id: string = widget.id;
            const $elem: JQuery<HTMLElement> = this.$el.filter(`#${id}`);
            $elem.on("click", (evt: JQuery.Event) => {
                const add: boolean = evt.shiftKey;
                this.selectWidget(id, add);
                evt.preventDefault();
                evt.stopPropagation();
            });
            $elem.on("dblclick", (evt: JQuery.Event) => {
                this.editWidget(id);
                evt.preventDefault();
                evt.stopPropagation();
            });
        }
        return this;
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
