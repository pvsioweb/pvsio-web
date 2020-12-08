import * as Backbone from 'backbone';
import * as Utils from '../../../env/Utils';
import { Connection } from '../../../env/Connection';
import { WidgetManager } from "../WidgetManager";

export interface BuilderViewOptions extends Backbone.ViewOptions {
    viewId: string,
    screenName: string,
    headerDiv: HTMLElement,
    content?: string,
    label?: string,
    active?: boolean
};

const headerTemplate: string = `
<li class="nav-item">
<a draggable="false" class="nav-link{{#if active}} active{{/if}}" id="{{screenName}}-tab" data-toggle="tab" href="#{{screenName}}" role="tab" aria-controls="{{screenName}}" aria-selected="true">{{label}}</a>
</li>`;

const bodyTemplate: string = `
<div id="{{screenName}}" class="container-fluid tab-pane fade show no-gutters{{#if active}} active{{/if}}" aria-labelledby="{{screenName}}-tab" style="padding:0; position:relative; min-height:480px;">
    {{content}}
</div>`;

export abstract class View extends Backbone.View {
    protected widgetManager: WidgetManager;
    protected connection: Connection;
    
    protected screenName: string;
    protected $headerDiv: JQuery<HTMLElement>;

    protected viewId: string;

    constructor (widgetManager: WidgetManager, data: BuilderViewOptions, connection: Connection) {
        super(data);
        this.widgetManager = widgetManager;
        this.connection = connection;
        this.viewId = data.viewId || `view-${Utils.uuid()}`;
        this.screenName = data?.screenName || "";
        this.$headerDiv = (data?.headerDiv) ? $(data.headerDiv) : null;
    }

    render (opt?: BuilderViewOptions): View {
        // append body
        const viewBody: string = Handlebars.compile(bodyTemplate, { noEscape: true })({
            id: this.viewId,
            screenName: this.screenName,
            content: opt?.content,
            active: opt?.active
        });
        this.$el.append(viewBody);
        // append header tab
        if (this.$headerDiv) {
            const label: string = opt?.label || this.screenName;
            const headerTab: string = Handlebars.compile(headerTemplate, { noEscape: true })({
                screenName: this.screenName,
                label,
                active: opt?.active
            });
            this.$headerDiv.append(headerTab);
        }
        return this;
    }
}