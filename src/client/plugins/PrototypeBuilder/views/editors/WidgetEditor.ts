import * as Backbone from 'backbone';
import { createDialog, setDialogTitle, uuid } from '../../../../env/Utils';
import { Coords, CSS, WidgetEVO, WidgetAttr, BasicEventData, VizOptions, WidgetOptions } from '../../widgets/core/WidgetEVO';
import { HotspotData } from './HotspotEditor';
import { widgets } from '../../widgets/widgets';

export interface WidgetData extends HotspotData {
    name: string,
    cons?: string, // constructor name
    opt?: WidgetOptions
};
export interface WidgetEditorData extends Backbone.ViewOptions {
    widgetData: WidgetData
};

export const WidgetEditorEvents = {
    ok: "ok",
    cancel: "cancel"
};

// all input forms must have attributes "name" and "value", as they will be used to identify key and value of coords, attr, css
const containerTemplate: string = `
<div class="card">
    <div class="card-header" style="position:absolute; left:-180px; background:gainsboro; border-radius:4px; padding-bottom:22px;">
        <ul class="nav flex-column flex-nowrap nav-pills card-header-tabs widget-list" style="overflow-y:auto; overflow-x:hidden; max-height:408px;">
            {{#each widgets}}
            <li class="nav-item">
                <a draggable="false" cons="{{name}}" class="widget-class nav-link{{#if @first}} active{{/if}}" id="{{name}}-tab" data-toggle="tab" href="#{{name}}" role="tab" aria-controls="{{name}}" aria-selected="true">{{name}}</a>
            </li>
            {{/each}}
        </ul>
    </div>
    <div class="card-body tab-content" style="height:400px; padding-top:0px;">
        {{#each widgets}}
        <div id="{{name}}" class="widget-info body modal-body container-fluid tab-pane fade show no-gutters{{#if @first}} active{{/if}}" aria-labelledby="{{key}}-tab" style="padding:0; position:relative;">
            <div class="row">

                <div class="col-md-4">
                    <div id="{{name}}-preview" class="widget-preview" style="min-width:200px;height:31px;position:relative; box-shadow:0px 0px 10px #666;">
                    <!-- {{name}}-preview -->
                    </div>

                    <div id="{{name}}-evts" class="text-muted" style="min-width:200px; height:60px; overflow:auto; margin-top:8px;">
                    <!-- {{name}}-events -->
                    </div>

                    <small id="{{name}}-desc" class="text-muted">
                    <!-- {{name}}-description -->
                    </small>
                </div>
                <div class="col-md-6 ml-auto" style="height:400px; overflow:auto;">
                    <div class="widget-id input-group input-group-sm" style="display:none;">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" style="width:100%;">ID</span>
                        </div>
                        <input type="text" class="form-control" value="{{../id}}" placeholder="{{../id}}" aria-label="{{../id}}" aria-describedby="{{name}}-id">
                        <br>
                    </div>
                    
                    <div id="{{name}}-attr" class="widget-attr">
                    <!-- {{name}}-attributes -->
                    </div>
                    
                    <div id="{{name}}-coords" class="widget-coords" style="display:none;">
                        <br>
                        {{#each ../coords}}
                        <div class="input-group input-group-sm">
                            <div class="input-group-prepend" style="min-width:40%;">
                                <span class="input-group-text" id="{{@key}}-label" style="width:100%;">{{@key}}</span>
                            </div>
                            <input type="text" class="form-control" name="{{@key}}" value="{{this}}px" placeholder="{{this}}px" aria-label="{{this}}" aria-describedby="{{@key}}-label">
                        </div>
                        {{/each}}
                    </div>

                    <br>

                    <div id="{{name}}-viz" class="widget-viz"></div>

                    <br>

                    <div id="{{name}}-css" class="widget-css"></div>

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
    protected mode: "create" | "edit"; // dialog modes
    protected widgetData: WidgetData;

    protected $dialog: JQuery<HTMLElement>;

    protected timer: NodeJS.Timer;

    constructor (data: WidgetEditorData) {
        super(data);
        this.widgetData = data?.widgetData;
        this.mode = "create";
        this.render();
        this.installHandlers();
    }

    selectTab (cons: string): boolean {
        if (cons) {
            $(".widget-class").removeClass("active");
            $(`#${cons}-tab`).addClass("active");
            $(".widget-info").removeClass("active show");
            $(`#${cons}`).addClass("active show");
            return true;
        }
        return false;
    }

    /**
     * Renders the dialog
     */
    render (): WidgetEditor {
        const data: {
            widgets: { [name: string]: any },
            coords: Coords
        } = { widgets, ...this.widgetData };
        // console.log(data);
        const container: string = Handlebars.compile(containerTemplate)(data);
        this.$dialog = createDialog({
            content: container,
            largeModal: true
        });
        setDialogTitle("Widget Editor");
        const width: number = +parseFloat($(".widget-preview").css("width")).toFixed(0);
        const height: number = +parseFloat($(".widget-preview").css("height")).toFixed(0);
        for (let i = 0; i < widgets.length; i++) {
            // create widget preview
            const cons: string = widgets[i].name;
            const coords: Coords = { width, height };
            const previewId: string = uuid();
            const options: WidgetOptions = {
                ...this.widgetData?.opt,
                parent: `${cons}-preview`
            };
            const obj: WidgetEVO = new widgets[i].cons(previewId, coords, options);
            obj.setName(this.widgetData.name);

            // set css style
            const css: CSS = obj.getCSS({
                all: true
            });
            const style: string = Handlebars.compile(styleTemplate)({
                style: css
            });
            $(`#${cons}-css`).html(style);
            $(`#${cons}-css input`).on("input", (evt: JQuery.ChangeEvent) => {
                const key: string = evt.currentTarget?.name;
                if (key) {
                    const value: string = evt.currentTarget?.value;
                    $(evt.currentTarget).attr("value", value);
                    const style: CSS = {};
                    style[key] = value;
                    obj.setCSS(style);
                    obj.renderSample();
                }
            });

            // set viz options
            let vizOp: VizOptions = obj.getViz();
            const viz: string = Handlebars.compile(vizTemplate)({
                viz: vizOp
            });
            $(`#${cons}-viz`).html(viz);

            // set widget attributes
            const attr: string = Handlebars.compile(attrTemplate)({
                attr: obj.getAttributes({ nameReplace: this.widgetData.id, keyCode: false })
            });
            $(`#${cons}-attr`).html(attr);
            $(`#${cons}-attr input`).on("input", (evt: JQuery.ChangeEvent) => {
                const value: string = evt.currentTarget?.value;
                const key: string = evt.currentTarget?.name;
                let attr: WidgetAttr = {};
                if (key) {
                    $(evt.currentTarget).attr("value", value);
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

            // set widget events
            const evts: string[] = obj.getEvents();
            for (let i = 0; i < evts?.length; i++) {
                const evt: string = evts[i];
                this.listenTo(obj, evt, (data: BasicEventData) => {
                    const fun: string = data?.fun.replace(previewId, this.widgetData.id);
                    console.log(fun);
                    $(`#${cons}-evts`).append(`<div><i class="fa fa-bolt"></i> ${fun}</div>`);
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        $(`#${cons}-evts`).html("");
                        this.timer = null;
                    }, 1200);
                });
            }

            // attach widget description
            $(`#${cons}-desc`).html(obj.getDescription());
            // render widget sample
            obj.renderSample();
        }
        // select corresponding tab
        this.selectTab(this.widgetData?.cons)
        return this;
    }

    setWidgetId (name: string): void {
        this.widgetData.id = name;
        this.$dialog.find(".widget-id input").val(name);
        this.updateDialogTitle();
    }

    protected updateDialogTitle (): void {
        setDialogTitle("Editing " + this.widgetData.id)
    }

    protected getDialogElement<T> (elem: string): T {
        const elems: JQuery<HTMLElement> = this.$dialog.find(`.active .widget-${elem} input`);
        let res = {};
        for (let i = 0; i < elems.length; i++) {
            const name: string = elems[i].getAttribute("name");
            if (name) {
                const value: string = elems[i].getAttribute("value");
                res[name] = value;
            }
        }
        return <T> res;
    }
    protected getDialogCoords (): Coords<number> {
        const coords: Coords = this.getDialogElement<Coords>("coords");
        const ans: Coords<number> = {};
        for (let i in coords) {
            ans[i] = parseFloat(coords[i]);
        }
        return ans;
    }
    protected getDialogCSS (): CSS {
        return this.getDialogElement<CSS>("css");
    }
    protected getDialogAttr (): WidgetAttr {
        return this.getDialogElement<WidgetAttr>("attr");
    }
    protected getDialogViz (): VizOptions {
        return this.getDialogElement<VizOptions>("viz");
    }
    protected getDialogWidgetId (): string {
        return this.$dialog.find(".widget-id input").attr("value");
    }
    protected getDialogWidgetConstructor (): string {
        return this.$dialog.find(".widget-class.active").attr("cons");
    }
    protected getWidgetName (): string {
        const attr: WidgetAttr = this.getDialogAttr();
        const keys: string[] = Object.keys(attr);
        return keys && keys.length ? attr[keys[0]] : "";
    }

    protected installHandlers (): void {
        this.$dialog.find(".ok-btn").on("click", (evt: JQuery.ClickEvent) => {
            this.widgetData = {
                cons: this.getDialogWidgetConstructor(),
                name: this.getWidgetName(),
                id: this.getDialogWidgetId(),
                coords: this.getDialogCoords(),
                opt: {
                    css: this.getDialogCSS(),
                    viz: this.getDialogViz(),
                    ...this.getDialogAttr()
                }
            };
            // console.log(this.widgetData);
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
            this.setWidgetId(newName);
        });
    }

}