import * as Backbone from 'backbone';
import { WidgetManager } from '../../WidgetManager';
import { createDialog, setDialogTitle, uuid } from '../../../../env/Utils';
import { Coords, HtmlStyle, WidgetEvents, WidgetEVO, WidgetAttr } from '../../widgets/core/WidgetEVO';
import { HotspotData } from './HotspotEditor';
import { WidgetClassDescriptor } from '../../widgets/widgets';
import { ButtonEventData } from '../../widgets/core/ButtonEVO';
import { preview } from '../../forms/widgetPreviewer';


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
                    <div id="{{name}}-preview" class="widget-preview" style="min-width:200px;height:31px;position:relative; box-shadow:0px 0px 10px #666;">
                    <!-- {{name}}-preview -->
                    </div>

                    <div id="{{name}}-evts" class="text-muted" style="min-width:200px; margin-top:8px; text-align:center; position:absolute;">
                    <!-- {{name}}-events -->
                    </div>

                    <small id="{{name}}-desc" class="text-muted" style="position:absolute; margin-top:40px;">
                    <!-- {{name}}-description -->
                    </small>
                </div>
                <div class="col-md-6 ml-auto" style="height:400px; overflow:auto;">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" style="width:100%;">ID</span>
                        </div>
                        <input type="text" class="widget-id form-control" value="{{../id}}" placeholder="{{../id}}" aria-label="{{../id}}" aria-describedby="{{name}}-id">
                    </div>

                    <br>
                    
                    <div id="{{name}}-attr" class="widget-attr">
                    <!-- {{name}}-attributes -->
                    </div>

                    <br>
                    
                    <div id="{{name}}-coords" class="widget-coords">
                        {{#each ../coords}}
                        <div class="input-group input-group-sm">
                            <div class="input-group-prepend" style="min-width:40%;">
                                <span class="input-group-text" id="{{@key}}-label" style="width:100%;">{{@key}}</span>
                            </div>
                            <input type="text" class="form-control" value="{{this}}px" placeholder="{{this}}px" aria-label="{{this}}" aria-describedby="{{@key}}-label">
                        </div>
                        {{/each}}
                    </div>

                    <br>

                    <div id="{{name}}-style" class="widget-style"></div>

                    <br>

                    <div id="{{name}}-viz" class="widget-viz"></div>

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
    <input type="text" class="form-control" name="{{@key}}" value="{{this}}" placeholder="{{this}}" aria-label="{{this}}" aria-describedby="{{@key}}-label">
</div>
{{/each}}`;
const vizTemplate: string = `
{{#each viz}}
<div class="input-group input-group-sm">
    <div class="input-group-prepend" style="min-width:40%;">
        <span class="input-group-text" id="{{@key}}-when" style="width:100%;">{{@key}} when...</span>
    </div>
    <input type="text" class="form-control" name="{{@key}}" value="{{this}}" placeholder="{{this}}" aria-label="{{this}}" aria-describedby="{{@key}}-when">
</div>
{{/each}}`;
const attrTemplate: string = `
{{#each attr}}
<div class="input-group input-group-sm">
    <div class="input-group-prepend" style="min-width:40%;">
        <span class="input-group-text" id="{{@key}}-attr" style="width:100%;">{{@key}}</span>
    </div>
    <input type="text" class="form-control" name="{{@key}}" value="{{this}}" placeholder="{{this}}" aria-label="{{this}}" aria-describedby="{{@key}}-attr">
</div>
{{/each}}`;

export class WidgetEditor extends Backbone.View {
    protected widgetManager: WidgetManager;
    protected mode: "create" | "edit"; // dialog modes
    protected widgetData: WidgetData;
    protected $dialog: JQuery<HTMLElement>;

    protected timer: NodeJS.Timer;

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
        const data: {
            widgets: { [name: string]: any },
            coords: Coords
        } = { widgets, ...this.widgetData };
        console.log(data);
        const container: string = Handlebars.compile(containerTemplate)(data);
        this.$dialog = createDialog({
            content: container,
            largeModal: true
        });
        const width: number = +parseFloat($(".widget-preview").css("width")).toFixed(0);
        const height: number = +parseFloat($(".widget-preview").css("height")).toFixed(0);
        for (let i = 0; i < widgets.length; i++) {
            const name: string = widgets[i].name;
            const coords: Coords = { width, height };
            const opt = { parent: `${name}-preview` };
            const previewId: string = uuid();
            const obj: WidgetEVO = new widgets[i].cons(previewId, coords, opt);

            const style: string = Handlebars.compile(styleTemplate)({
                style: obj.getStyle()
            });
            $(`#${name}-style`).html(style);
            $(`#${name}-style input`).on("input", (evt: JQuery.ChangeEvent) => {
                const value: string = evt.currentTarget?.value;
                const key: string = evt.currentTarget?.name;
                let style: HtmlStyle = {};
                if (key) {
                    style[key] = value;
                    obj.setStyle(style);
                    obj.renderSample();
                }
                console.log(key, value);
            });

            const viz: string = Handlebars.compile(vizTemplate)({
                viz: obj.getViz()
            });
            $(`#${name}-viz`).html(viz);

            const attr: string = Handlebars.compile(attrTemplate)({
                attr: obj.getAttr({ nameReplace: this.widgetData.id, keyCode: false })
            });
            $(`#${name}-attr`).html(attr);
            $(`#${name}-attr input`).on("input", (evt: JQuery.ChangeEvent) => {
                const value: string = evt.currentTarget?.value;
                const key: string = evt.currentTarget?.name;
                let attr: WidgetAttr = {};
                if (key) {
                    if (key === "keyCode") {
                        // TODO: render appropriate controls to simplify keyboard key binding
                    } else {
                        attr[key] = value;
                        obj.setAttr(attr);
                        obj.renderSample();
                    }
                }
                console.log(key, value);
            });


            const evts: WidgetEvents = obj.getEvents();
            if (evts) {
                for (const evt in evts) {
                    this.listenTo(obj, evt, (data: ButtonEventData) => {
                        const fun: string = data?.fun.replace(previewId, this.widgetData.id);
                        console.log(fun);
                        $(`#${name}-evts`).html(`<i class="fa fa-bolt"></i> ${fun}`);
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            $(`#${name}-evts`).html("");
                            this.timer = null;
                        }, 1200);
                    });
                }
            }

            $(`#${name}-desc`).html(obj.getDescription());
            obj.renderSample();
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