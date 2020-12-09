import * as Backbone from 'backbone';
import { WidgetManager } from '../../WidgetManager';
import { dialogTemplate, showDialog, uuid } from '../../../../env/Utils';
import { Coords } from '../../widgets/core/WidgetEVO';
import { HotspotData } from './HotspotEditor';


export interface WidgetEditorOptions extends Backbone.ViewOptions {
    id: string, // widget ID
    coords: Coords // widget coords
};

export interface WidgetData extends HotspotData {
};

export const WidgetEditorEvents = {
    ok: "ok",
    cancel: "cancel"
};

const headerTemplate: string = `
<div class="card">
    <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs d-flex flex-nowrap widget-list">
            {{#each widgets}}
            <li class="nav-item">
                <a draggable="false" class="nav-link{{#if @first}} active{{/if}}" id="{{@key}}-tab" data-toggle="tab" href="#{{@key}}" role="tab" aria-controls="{{@key}}" aria-selected="true">{{@key}}</a>
            </li>
            {{/each}}
        </ul>
    </div>
    <div class="card-body tab-content" style="height:400px;">
        <div class="body container-fluid tab-pane fade show no-gutters" aria-labelledby="Settings-tab" style="padding:0; position:relative; min-height:480px;">
    </div>
</div>`;

export class WidgetEditor extends Backbone.View {
    protected widgetManager: WidgetManager;
    protected mode: "create" | "edit"; // dialog modes
    protected widgetData: WidgetData;
    protected $dialog: JQuery<HTMLElement>;

    constructor (widgetManager: WidgetManager, data: WidgetEditorOptions) {
        super(data);
        this.widgetData = { ...data };
        this.widgetManager = widgetManager;
        this.mode = "create";
        this.render();
        this.installHandlers();
    }

    /**
     * Renders the dialog
     */
    render (): WidgetEditor {
        const header: string = Handlebars.compile(headerTemplate)({
            widgets: {
                Button: true,
                Display: true,
                TouchScreenDisplay: true,
                LED: true
            }
        });
        this.$dialog = showDialog({
            title: this.makeTitle(),
            content: header,
            largeModal: true
        });
        return this;
    }

    protected installHandlers (): void {
        this.$dialog.find(".ok-btn").on("click", (evt: JQuery.ClickEvent) => {
            // trigger event
            this.trigger(WidgetEditorEvents.ok, this.widgetData);
            // delete dialog
            this.$dialog.remove();
        });
        this.$dialog.find(".cancel-btn").on("click", (evt: JQuery.ClickEvent) => {
            // trigger event
            this.trigger(WidgetEditorEvents.cancel, this.widgetData);
            // delete dialog
            this.$dialog.remove();
        });
    }

    protected makeTitle (): string {
        return this.widgetData?.id || "";
    }


}