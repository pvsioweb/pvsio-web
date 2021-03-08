import * as Backbone from 'backbone';
import { createDialog, keyCodes, setDialogTitle, uuid } from '../../../../utils/pvsiowebUtils';
import { Coords, CSS, WidgetEVO, WidgetAttr, WidgetEventData, VizOptions, WidgetOptions, WidgetData, CSSx, WidgetEvent } from '../../widgets/core/WidgetEVO';
import { WidgetClassDescriptor, WidgetClassMap } from '../../widgets/widgetClassMap';

export interface WidgetEditorData extends Backbone.ViewOptions {
    widgetData: WidgetData,
    widgetClassMap: WidgetClassMap
};

export const WidgetEditorEvents = {
    ok: "ok",
    cancel: "cancel"
};

const previewHeight: number = 31; //px
// all input forms must have attributes "name" and "value", which will be used to identify the attribute name (coords, attr, css) and its value
const containerTemplate: string = `
<style>
.widget-class {
    white-space:nowrap;
}
.widget-lib {
    margin-left: 0px;
    width: 100%;
}
.spinner-left {
    position:absolute;
    left:-160px; 
    background:gainsboro; 
    border-radius:4px; 
    padding-bottom:22px;
    width:140px;
}
</style>
<div id="editorId" class="card">
    <div class="card-header spinner-left px-1">
        <ul class="nav flex-column flex-nowrap nav-pills card-header-tabs widget-lib" style="overflow-y:auto; overflow-x:hidden; max-height:408px;">
            {{#each widgets as |item kind|}}
            <li class="nav-item">
                <a draggable="false" kind="{{kind}}" class="widget-class nav-link{{#if @first}} active{{/if}}" id="{{@key}}-tab" data-toggle="tab" href="#{{@key}}" role="tab" aria-controls="{{@key}}" aria-selected="true">{{@key}}</a>
            </li>
            {{/each}}
        </ul>
    </div>
    <style>
    .carousel-indicators li {
        background-color: #999;
        background-color: rgba(70, 70, 70, 0.25);
    }
    .carousel-indicators .active {
        background-color: #444;
    }
    .carousel-indicators {
        position: relative;
        min-width:290px;
    }
    .carousel-inner {
        min-width: 362px;
        margin: 20px 0;
    }
    .widget-attributes {
        margin-top:42px;
        min-width: 362px;
    }
    .widget-editor-card {
        height:400px;
        padding-top:0px;
        overflow:auto;
    }
    .widget-info {
        position:relative;
        overflow:auto;
    }
    </style>
    <div class="widget-editor-card card-body tab-content">
        {{#each widgets as |item kind|}}
        <div id="{{kind}}" class="widget-info p-0 modal-body container-fluid tab-pane fade show no-gutters{{#if @first}} active{{/if}}" aria-labelledby="{{kind}}-tab">
            <div class="row">
                <div id="{{kind}}-carousel" class="carousel slide col-md-6" data-interval="false">
                    <!-- carousel indicators -->
                    <ol class="carousel-indicators mx-0">
                        {{#each this}}
                        <li data-target="#{{kind}}-carousel" kind="{{kind}}" cons="{{cons.constructorName}}" data-slide-to="{{@index}}" {{#if @first}}class="active"{{/if}}></li>
                        {{/each}}
                    </ol>
                    <div class="carousel-inner">
                        <!-- carousel screen shows available widgets -->
                        {{#each this}}
                        <div class="carousel-item {{#if @first}}active{{/if}}">
                            <div style="width:60%; margin-left:20%;">
                                <div id="{{cons.constructorName}}-preview" class="widget-preview" style="min-width:200px; height:${previewHeight}px; position:relative; box-shadow:0px 0px 10px #666;">
                                <!-- {{cons.constructorName}}-preview -->
                                </div>
                                <div id="{{cons.constructorName}}-evts" class="text-muted" style="min-width:200px; height:60px; overflow:auto; margin-top:8px;">
                                <!-- {{cons.constructorName}}-events -->
                                </div>
                                <h5>{{this.label}}</h5>
                                <small id="{{cons.constructorName}}-desc" class="text-muted carousel-description">
                                <!-- {{cons.constructorName}}-description -->
                                </small>
                            </div>
                        </div>
                        {{/each}}
                        <!-- carousel controls -->
                        <div class="btn btn-dark carousel-control carousel-control-prev" kind="{{kind}}" href="#{{kind}}-carousel" role="button" data-slide="prev" style="height:${previewHeight}px">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </div>
                        <div class="btn btn-dark carousel-control carousel-control-next" kind="{{kind}}" href="#{{kind}}-carousel" role="button" data-slide="next" style="height:${previewHeight}px">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </div>
                    </div>
                </div>

                {{#each this}}
                <div id="{{kind}}-{{cons.constructorName}}" class="widget-attributes col-md-6 ml-auto" style="height:400px; overflow:auto; display:{{#if @first}}block{{else}}none{{/if}};">
                    <div class="widget-id input-group input-group-sm" style="display:none;">
                        <div class="input-group-prepend" style="min-width:40%;">
                            <span class="input-group-text" style="width:100%;">ID</span>
                        </div>
                        <input type="text" class="form-control" value="{{../../id}}" placeholder="{{../../id}}" aria-label="{{../../id}}" aria-describedby="{{cons.constructorName}}-id">
                        <br>
                    </div>
                    
                    <div id="{{cons.constructorName}}-attr" class="widget-attr">
                    <!-- {{cons.constructorName}}-attributes -->
                    </div>
                    
                    <div id="{{cons.constructorName}}-coords" class="widget-coords" style="display:none;">
                        <br>
                        {{#each ../../coords}}
                        <div class="input-group input-group-sm">
                            <div class="input-group-prepend" style="min-width:40%;">
                                <span class="input-group-text" id="{{@key}}-label" style="width:100%;">{{@key}}</span>
                            </div>
                            <input type="text" class="form-control" name="{{@key}}" value="{{this}}px" placeholder="{{this}}px" aria-label="{{this}}" aria-describedby="{{@key}}-label">
                        </div>
                        {{/each}}
                    </div>
                    <br>
                    <div id="{{cons.constructorName}}-viz" style="display:none;" class="widget-viz"></div>
                    <br>
                    <div id="{{cons.constructorName}}-css" class="widget-css"></div>
                </div>
                {{/each}}
            </div>
        </div>
        {{/each}}
    </div>
</div>`;
const styleTemplate: string = `
{{#each style}}
<div class="input-group input-group-sm">
    <div class="input-group-prepend" style="min-width:40%;">
        <span class="input-group-text" id="{{key}}-label" style="width:100%;">{{key}}</span>
    </div>
    <input type="text" {{#if hints}}list="{{key}}-hints"{{/if}} class="form-control" name="{{key}}" value="{{value}}" placeholder="" aria-label="{{value}}" aria-describedby="{{key}}-label">
    {{#if hints}}
    <datalist id="{{key}}-hints">
        {{#each hints}}
        <option value="{{this}}">
        {{/each}}
    </datalist>
    {{/if}}
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
    protected widgetClassMap: WidgetClassMap;
    protected editorId: string = uuid();

    /**
     * Pointer to the editor dialog
     */
    protected $dialog: JQuery<HTMLElement>;

    /**
     * Internal timer, used to update events generated by the widget samples
     */
    protected timer: NodeJS.Timer;

    /**
     * Constructor
     * @param data 
     */
    constructor (data: WidgetEditorData) {
        super(data);
        this.widgetData = data?.widgetData;
        this.widgetClassMap = data?.widgetClassMap || {};
        this.mode = "create";
    }

    /**
     * Renders the editor dialog
     */
    renderView (): void {
        this.createHtmlContent();
        this.installHandlers();
    }

    /**
     * Replaces whitespaces and '.' with '-'. This is needed if the string is used as a class name or identifier in the HTML
     * @param str 
     */
    protected safeString (str: string): string {
        return str?.replace(/[\.\s]/g, "-") || "";
    }

    /**
     * Click on a tab. Tab names are specified by giving widget kind and widget constructor name
     */
    protected selectTab (desc: { kind: string, cons: string }): boolean {
        if (desc && desc.kind) {
            $(".widget-class").removeClass("active");
            $(`#${desc.kind}-tab`).addClass("active");
            $(".widget-info").removeClass("active show");
            $(`#${desc.kind}`).addClass("active show");
            if (desc.cons) {
                // $(`#${desc.kind}-carousel .carousel-indicators li`).removeClass("active");
                // $(`#${desc.kind}-carousel .carousel-indicators li[cons='${desc.cons}']`).addClass("active");   
                $(`#${desc.kind}-carousel .carousel-indicators li[cons='${desc.cons}']`).trigger("click");             
            }
            return true;
        }
        return false;
    }

    /**
     * Renders the dialog
     */
    protected createHtmlContent (): WidgetEditor {
        const data: {
            editorId: string,
            widgets: WidgetClassMap,
            id: string,
            coords: Coords
        } = {
            editorId: this.editorId,
            widgets: this.widgetClassMap,
            id: this.widgetData?.id,
            coords: this.widgetData?.coords
        };
        // console.log(data);
        const container: string = Handlebars.compile(containerTemplate)(data);
        this.$dialog = createDialog({
            content: container,
            largeModal: true
        });
        setDialogTitle("Edit Widget");
        // const carouselControls: JQuery<HTMLElement> = $(`.carousel-control`);
        const width: number = +parseFloat($(".widget-preview").css("width")).toFixed(0);
        const height: number = +parseFloat($(".widget-preview").css("height")).toFixed(0);
        for (let kind in this.widgetClassMap) {
            const widgetsDesc: WidgetClassDescriptor[] = this.widgetClassMap[kind];
            for (let i = 0; i < widgetsDesc.length; i++) {
                console.log(`[widget-editor] loading widget`, widgetsDesc[i].cons?.constructorName, widgetsDesc[i].cons?.constructorName);
                if (widgetsDesc[i].cons?.constructorName) {
                    // create widget preview
                    const cons: string = widgetsDesc[i].cons.constructorName;
                    const coords: Coords = { width, height };
                    const previewId: string = WidgetEVO.uuid();
                    const options: WidgetOptions = {
                        ...this.widgetData?.opt,
                        parent: `${cons}-preview`
                    };
                    const obj: WidgetEVO = new widgetsDesc[i].cons(previewId, coords, options);
                    obj.setName(this.widgetData.name);

                    // set css style
                    // const css: CSS = obj.getCSS({
                    //     all: true
                    // });
                    const cssx: CSSx[] = obj.getCSSx();
                    const style: string = Handlebars.compile(styleTemplate)({
                        style: cssx
                    });
                    $(`#${cons}-css`).html(style);
                    $(`#${cons}-css input`).on("input", (evt: JQuery.ChangeEvent) => {
                        const key: string = evt.currentTarget?.name;
                        if (key) {
                            const value: string = evt.currentTarget?.value;
                            this.updateInput(key, value);
                            // re-render sample
                            const style: CSS = {};
                            style[key] = value;
                            obj.updateCSS(style);
                            obj.renderSample();
                        }
                    });

                    // set viz options
                    let vizOp: VizOptions = obj.getViz();
                    const viz: string = Handlebars.compile(vizTemplate)({
                        viz: vizOp
                    });
                    $(`#${cons}-viz`).html(viz);
                    $(`#${cons}-viz input`).on("input", (evt: JQuery.ChangeEvent) => {
                        const key: string = evt.currentTarget?.name;
                        if (key) {
                            const value: string = evt.currentTarget?.value;
                            this.updateInput(key, value);
                        }
                    });

                    // set widget attributes
                    const attr: string = Handlebars.compile(attrTemplate)({
                        attr: obj.getAttributes({ keyCode: false })
                    });
                    $(`#${cons}-attr`).html(attr);
                    $(`#${cons}-attr input`).on("input", (evt: JQuery.ChangeEvent) => {
                        const value: string = evt.currentTarget?.value;
                        const key: string = evt.currentTarget?.name;
                        let attr: WidgetAttr = {};
                        if (key) {
                            this.updateInput(key, value);
                            if (key !== "keyCode") {
                                // re-render sample
                                attr[key] = value;
                                obj.setAttr(attr);
                                obj.renderSample();
                            }
                        }
                        // console.log(key, value);
                    });

                    // listen to all possible widget events
                    const evts: string[] = obj.getEvents();
                    for (let i in WidgetEvent) {
                        const evt: string = evts[i];
                        this.listenTo(obj, evt, (data: WidgetEventData) => {
                            const fun: string = data?.fun.replace(previewId, this.widgetData.id);
                            // console.log(fun);
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
            }
        }
        // attach handlers to the carousel controls so we can select the div with the attributes based on the active widget
        $(`.carousel-control`).on("click", (evt: JQuery.ClickEvent) => {
            // console.log(evt?.currentTarget);
            const kind: string = $(evt.currentTarget).attr("kind");
            if (kind) {
                const idx: string = $(`#${kind}-carousel li.active`).attr("data-slide-to");
                if (idx && +idx < this.widgetClassMap[kind]?.length) {
                    const activeIndex: number = +idx;
                    const isNext: boolean = $(evt?.currentTarget).hasClass("carousel-control-next");
                    const nextIndex: number = isNext ? (activeIndex + 1) % this.widgetClassMap[kind]?.length
                        : Math.abs((activeIndex - 1) % this.widgetClassMap[kind]?.length);
                    const activeName: string = this.widgetClassMap[kind][activeIndex]?.cons?.constructorName;
                    const nextName: string = this.widgetClassMap[kind][nextIndex]?.cons?.constructorName;
                    $(`#${kind}-${activeName}`).css({ display: "none" });
                    $(`#${kind}-${nextName}`).css({ display: "block" });
                }
            } else {
                console.warn(`[widget-editor] Warning: carousel control disconnected`, evt?.currentTarget)
            }
        });
        $(`.carousel-indicators li`).on("click", (evt: JQuery.ClickEvent) => {
            // console.log(evt?.currentTarget);
            const kind: string = $(evt.currentTarget).attr("kind");
            if (kind) {
                const idx: string = $(`#${kind}-carousel li.active`).attr("data-slide-to");
                const next: string = $(evt.currentTarget).attr("data-slide-to");
                if (idx && next && +idx < this.widgetClassMap[kind]?.length && +next < this.widgetClassMap[kind]?.length) {
                    const activeIndex: number = +idx;
                    const nextIndex: number = +next;
                    const activeName: string = this.widgetClassMap[kind][activeIndex]?.cons?.constructorName;
                    const nextName: string = this.widgetClassMap[kind][nextIndex]?.cons?.constructorName;
                    $(`#${kind}-${activeName}`).css({ display: "none" });
                    $(`#${kind}-${nextName}`).css({ display: "block" });
                }
            } else {
                console.warn(`[widget-editor] Warning: carousel control disconnected`, evt?.currentTarget)
            }
        });
        // select corresponding tab
        this.selectTab({ kind: this.widgetData?.kind, cons: this.widgetData?.cons });
        return this;
    }

    /**
     * Update the widget ID
     * @param id widget ID
     */
    setWidgetId (id: string): void {
        this.widgetData.id = id;
        this.$dialog.find(".widget-id input").val(id);
        this.updateDialogTitle();
    }

    /**
     * Update the title of the dialog
     */
    updateDialogTitle (): void {
        setDialogTitle("Editing " + this.widgetData.id)
    }

    /**
     * Programmatically update input for attribute id
     * @param id name of the attributed
     * @param value value to be assigned to the attribute
     */
    updateInput (id: string, value: string): void {
        if (id) {
            // update attributes on all tabs
            this.$dialog.find(`input[name=${id}]`).attr("value", value);
        }
    }

    /**
     * Internal function for reading information from the edit dialog
     */
    protected getDialogElement<T> (elem: string): T {
        const elems: JQuery<HTMLElement> = this.$dialog.find(`.active :visible .widget-${elem} input`);
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
    /**
     * Get widget coords specified in the input field of the edit dialog
     */
    getCurrentCoords (): Coords<number> {
        const coords: Coords = this.getDialogElement<Coords>("coords");
        const ans: Coords<number> = {};
        for (let i in coords) {
            ans[i] = parseFloat(coords[i]);
        }
        return ans;
    }
    /**
     * Get widget kind specified in the input field of the edit dialog
     */
    getCurrentWidgetKind (): string {
        return this.$dialog.find(".widget-class.active").attr("kind");
    }
    /**
     * Get widget CSS specified in the input field of the edit dialog
     */
    getCurrentCSS (): CSS {
        return this.getDialogElement<CSS>("css");
    }
    /**
     * Get widget attributes specified in the input field of the edit dialog
     */
    getCurrentAttr (): WidgetAttr {
        return this.getDialogElement<WidgetAttr>("attr");
    }
    /**
     * Get widget viz options specified in the input field of the edit dialog
     */
    getCurrentViz (): VizOptions {
        return this.getDialogElement<VizOptions>("viz");
    }
    /**
     * Get widget ID specified in the input field of the edit dialog
     */
    getCurrentWidgetId (): string {
        return this.$dialog.find(".widget-id input").attr("value");
    }
    /**
     * Get widget constructor specified in the input field of the edit dialog
     */
    getCurrentWidgetCons (): string {
        const activeKind: string = this.getCurrentWidgetKind();
        const activeCons: string = $(`#${activeKind}-carousel`).find(`.carousel-indicators li.active`).attr("cons");
        return activeCons;
    }
    /**
     * Get widget name specified in the input field of the edit dialog
     */
    getCurrentWidgetName (): string {
        // widget name is, by convention, the first attribute
        const attr: WidgetAttr = this.getCurrentAttr();
        const keys: string[] = Object.keys(attr);
        return keys && keys.length ? attr[keys[0]] : "";
    }
    /**
     * Internal function, install event handlers
     */
    protected installHandlers (): void {
        this.$dialog.find(".ok-btn").on("click", (evt: JQuery.ClickEvent) => {
            this.widgetData = {
                cons: this.getCurrentWidgetCons(),
                name: this.getCurrentWidgetName(),
                kind: this.getCurrentWidgetKind(),
                id: this.getCurrentWidgetId(),
                coords: this.getCurrentCoords(),
                opt: {
                    css: this.getCurrentCSS(),
                    viz: this.getCurrentViz(),
                    ...this.getCurrentAttr()
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