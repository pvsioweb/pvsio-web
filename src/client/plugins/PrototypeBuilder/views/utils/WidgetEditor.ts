import * as Backbone from 'backbone';
import { WidgetManager } from '../../WidgetManager';
import { dialogTemplate, createDialog, setDialogTitle, uuid } from '../../../../env/Utils';
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

                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" style="width:100%;">ID</span>
                        </div>
                        <input type="text" class="widget-id form-control" value="{{../id}}" placeholder="{{../id}}" aria-label="{{../id}}" aria-describedby="{{name}}-id">
                    </div>

                    {{#each ../when}}
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" id="{{@key}}-when" style="width:100%;">{{@key}} when...</span>
                        </div>
                        <input type="text" class="form-control" value="{{this}}" placeholder="{{this}}" aria-label="{{this}}" aria-describedby="{{@key}}-when">
                    </div>
                    {{/each}}

                    {{#each ../coords}}
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" id="{{@key}}-label" style="width:100%;">{{@key}}</span>
                        </div>
                        <input type="text" class="form-control" value="{{this}}px" placeholder="{{this}}px" aria-label="{{this}}" aria-describedby="{{@key}}-label">
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
        this.widgetData = { ...data, id: WidgetEVO.uuid() };
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
            content: container,
            largeModal: true
        });
        const width: number = +parseFloat($(".widget-preview").css("width")).toFixed(0);
        for (let i = 0; i < widgets.length; i++) {
            const key: string = widgets[i].name;
            const coords: Coords = { width };
            const opt = { parent: `${key}-preview` };
            const obj: WidgetEVO = new widgets[i].cons(uuid(), coords, opt);
            const style: string = Handlebars.compile(styleTemplate)({
                style: obj.getStyle()
            });
            $(`#${key}-style`).html(style);
            obj.renderSample(); // todo: get sample text from the dialog
            const msg: string = `[widget-manager] Widget ${widgets[i].name} loaded!`
            console.log(msg);
        }
        this.setWidgetName(this.widgetData.id);
        return this;
    }

    setWidgetName (name: string): void {
        this.widgetData.id = name;
        this.$dialog.find(".widget-id").val(name);
        this.updateDialogTitle();
    }

    protected updateDialogTitle (): void {
        setDialogTitle("Editing widget " + this.widgetData.id)
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
        this.$dialog.find(".widget-id").on("input", (evt: JQuery.ChangeEvent) => {
            const newName: string = evt.currentTarget?.value;
            this.setWidgetName(newName);
        });
    }

}