import * as Backbone from 'backbone';
import { WidgetManager } from '../../WidgetManager';
import { dialogTemplate, createDialog, uuid } from '../../../../env/Utils';
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

const containerTemplate: string = `
<div class="card">
    <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs d-flex flex-nowrap widget-list">
            {{#each widgets}}
            <li class="nav-item">
                <a draggable="false" class="nav-link{{#if @first}} active{{/if}}" id="{{name}}-tab" data-toggle="tab" href="#{{name}}" role="tab" aria-controls="{{name}}" aria-selected="true">{{name}}</a>
            </li>
            {{/each}}
        </ul>
    </div>
    <div class="card-body tab-content" style="height:400px; padding-top:0px;">
        {{#each widgets}}
        <div id="{{name}}" class="body modal-body container-fluid tab-pane fade show no-gutters{{#if @first}} active{{/if}}" aria-labelledby="{{key}}-tab" style="padding:0; position:relative;">
            <div class="row">

                <div class="col-md-4">
                    <div id="{{name}}-preview" class="widget-preview mb-3" style="min-width:200px;height:60px;position:relative;">
                    <!-- {{name}}-preview -->
                    </div>
                    {{#each ../coords}}
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" id="{{@key}}-label" style="width:100%;">{{@key}}</span>
                        </div>
                        <input type="text" class="form-control" value="{{this}}" placeholder="{{this}}" aria-label="{{this}}" aria-describedby="{{@key}}-label">
                    </div>
                    {{/each}}
                </div>
                <div class="col-md-6 ml-auto" style="height:400px; overflow:auto;">
                    <div id="{{name}}-style" class="widget-style"></div>
                </div>

            </div>
        </div>
        {{/each}}
    </div>
</div>`;
const styleTemplate: string = `
{{#each style}}
<div class="input-group input-group-sm">
    <div class="input-group-prepend" style="min-width:40%;">
        <span class="input-group-text" id="{{@key}}-label" style="width:100%;">{{@key}}</span>
    </div>
    <input type="text" class="form-control" value="{{this}}" placeholder="{{this}}" aria-label="{{this}}" aria-describedby="{{@key}}-label">
</div>
{{/each}}`;

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
        const widgets: WidgetClassDescriptor[] = this.widgetManager.getWidgetClassDescriptors();
        const container: string = Handlebars.compile(containerTemplate)({ widgets, coords: this.widgetData?.coords });
        this.$dialog = createDialog({
            title: this.makeTitle(),
            content: container,
            largeModal: true
        });
        const width: number = +parseFloat($(".widget-preview").css("width")).toFixed(0);
        for (let i in widgets) {
            const key: string = widgets[i].name;
            const id: string = uuid();
            const coords: Coords = { width };
            const opt = { parent: `${key}-preview` };
            const obj: WidgetEVO = new widgets[i].cons(id, coords, opt);
            const style: string = Handlebars.compile(styleTemplate)({
                style: obj.getStyle()
            });
            $(`#${key}-style`).html(style);
            obj.renderSample(); // todo: get sample text from the dialog
            const msg: string = `[widget-manager] Widget ${widgets[i].name} loaded!`
            console.log(msg);
        }
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