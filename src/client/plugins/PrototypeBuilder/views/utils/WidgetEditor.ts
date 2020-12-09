import * as Backbone from 'backbone';
import { WidgetManager } from '../../WidgetManager';
import { dialogTemplate, showDialog, uuid } from '../../../../env/Utils';
import { Coords, WidgetDescriptor, WidgetEVO } from '../../widgets/core/WidgetEVO';
import { HotspotData } from './HotspotEditor';
import { WidgetClassDescriptor } from '../../widgets/widgets';


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
    <div class="card-body tab-content" style="height:400px; padding-top:0px;">
        {{#each widgets}}
        <div id="{{@key}}" class="body modal-body container-fluid tab-pane fade show no-gutters{{#if @first}} active{{/if}}" aria-labelledby="{{key}}-tab" style="padding:0; position:relative;">
            <div class="row">
                <div class="col-md-4">
                    <div id="{{@key}}-preview" class="img-thumbnail mb-3" style="min-width:200px;height:200px;">
                    {{@key}}-preview
                    </div>
                    {{#each coords}}
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" id="{{@key}}-label" style="width:100%;">{{@key}}</span>
                        </div>
                        <input type="text" class="form-control" value="{{this}}" placeholder="{{this}}" aria-label="{{this}}" aria-describedby="{{@key}}-label">
                    </div>
                    {{/each}}
                </div>
                <div class="col-md-6 ml-auto" style="height:400px; overflow:auto;">
                    {{#each style}}
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" id="{{@key}}-label" style="width:100%;">{{@key}}</span>
                        </div>
                        <input type="text" class="form-control" value="{{this}}" placeholder="{{this}}" aria-label="{{this}}" aria-describedby="{{@key}}-label">
                    </div>
                    {{/each}}
                </div>
            </div>
        </div>
        {{/each}}
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
        const desc: WidgetClassDescriptor[] = this.widgetManager.getWidgetClassDescriptors();
        const widgets: { [name: string]: WidgetDescriptor } = {};
        for (let i in desc) {
            const obj: WidgetEVO = new desc[i].cons();
            widgets[obj.constructor.name] = {
                ...obj.toJSON()
            };
            const msg: string = `[widget-manager] Widget ${desc[i].name} loaded!`
            console.log(msg);
        }
        const header: string = Handlebars.compile(headerTemplate)({ widgets });
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