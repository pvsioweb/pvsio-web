import * as Backbone from 'backbone';
import * as Utils from '../../../utils/pvsiowebUtils';
import { Connection } from '../../../env/Connection';
import { HotspotsMap } from './editors/HotspotEditor';
import { Coords, WidgetEVO } from '../widgets/core/WidgetEVO';

export declare interface CentralViewOptions extends Backbone.ViewOptions {
    label: string, // label shown in the tab
    viewId: string, // unique id of the view
    panelId: string, // id of the panel linked to the view
    externalPanel?: boolean, // flag indicating whether an external panel will be used (if true, the view will not create the body of the panel)
    headerDiv: HTMLElement,
    content?: string,
    active?: boolean,
    parentDiv: HTMLElement
}

export const MIN_WIDTH: number = 800; //px
export const MIN_HEIGHT: number = 480; //px

export const CentralViewEvents = {
    DidShowView: "DidShowView",
    DidHideView: "DidHideView"
};

const headerTemplate: string = `
<style>
.nav-item {
    z-index:1;
    position:relative;
}
.nav-link {
    white-space:nowrap;
}
.nav-link.active {
    border-top: 1px solid !important;
    border-left: 1px solid !important;
    border-right: 1px solid !important;
}
</style>
<li class="nav-item">
<button draggable="false" class="nav-link {{#if active}}active{{/if}}" id="{{tabId}}" data-toggle="tab" href="#{{controls}}" role="tab" aria-controls="{{controls}}" aria-selected="true">{{label}}</button>
</li>`;

const bodyTemplate: string = `
<div id="{{panelId}}" class="container-fluid tab-pane show no-gutters p-0 {{#if active}}active{{/if}}" aria-labelledby="{{controlledBy}}" style="position:relative; min-height:${MIN_HEIGHT}px;">
    {{content}}
</div>`;

export type WidgetsMap = { [id: string]: WidgetEVO };

export const DELAYED_TRIGGER_TIMEOUT: number = 2000; //ms


export abstract class CentralView extends Backbone.View {
    protected connection: Connection;
    
    protected panelId: string;
    protected $headerDiv: JQuery<HTMLElement>;
    protected $parentDiv: JQuery<HTMLElement>;

    protected $headerTab: JQuery<HTMLElement>;

    protected viewId: string;
    protected viewOptions: CentralViewOptions;

    constructor (data: CentralViewOptions, connection: Connection) {
        super(data);
        this.viewOptions = data;
        this.connection = connection;
        this.viewId = data.viewId?.replace(/[\s\.]/g, "-") || `view-${Utils.uuid()}`;
        this.panelId = data?.panelId?.replace(/[\s\.]/g, "-") || "";
        this.$headerDiv = $(data?.headerDiv);
        this.$parentDiv = $(data?.parentDiv);
    }

    /**
     * Resize the view
     * @param coords View size
     */
    resizeView (coords?: Coords): void {
        if (coords) {
            const width: number = coords.width ? parseFloat(`${coords.width}`) : 0;
            if (width) { this.$el.css({ width }); }
            const height: number = coords.height ? parseFloat(`${coords.height}`) : 0;
            if (height) { this.$el.css({ height }); }            
        }
    }

    /**
     * Attaches a new panel to prototype builder. This function should be invoked only once.
     * @param opt 
     */
    async renderView (opt?: CentralViewOptions): Promise<CentralView> {
        // append header tab
        if (this.$headerDiv) {
            const label: string = opt?.label || this.panelId;
            const headerTab: string = Handlebars.compile(headerTemplate, { noEscape: true })({
                tabId: `${this.viewId}-tab`,
                controls: this.panelId,
                label,
                active: opt?.active
            });
            this.$headerDiv.append(headerTab);
            this.$headerTab = this.$headerDiv.find(`#${this.viewId}-tab`);
            // the view is active when the user clicks on the tab
            this.$headerTab.on("click", (evt: JQuery.ClickEvent) => {
                if (!this.$headerTab.hasClass("active")) {
                    this.trigger(CentralViewEvents.DidShowView, { id: this.viewId });
                }
            });    
        }
        if (!opt?.externalPanel) {
            // append body
            const viewBody: string = Handlebars.compile(bodyTemplate, { noEscape: true })({
                controlledBy: `${this.viewId}-tab`,
                panelId: this.panelId,
                content: opt?.content,
                active: opt?.active
            });
            this.$el.append(viewBody);
        }
        return this;
    }
}