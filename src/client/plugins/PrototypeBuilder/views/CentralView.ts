import * as Backbone from 'backbone';
import * as Utils from '../../../env/Utils';
import { Connection } from '../../../env/Connection';
import { HotspotsMap } from './editors/HotspotEditor';
import { Coords, WidgetEVO } from '../widgets/core/WidgetEVO';

export interface CentralViewOptions extends Backbone.ViewOptions {
    label: string, // label shown in the tab
    viewId: string, // unique id of the view
    panelId: string, // id of the panel linked to the view
    externalPanel?: boolean, // flag indicating whether an external panel will be used (if true, the view will not create the body of the panel)
    headerDiv: HTMLElement,
    content?: string,
    active?: boolean,
    parentDiv: HTMLElement
};

export const CentralViewEvents = {
    DidShowView: "DidShowView",
    DidHideView: "DidHideView"
};

const headerTemplate: string = `
<li class="nav-item">
<a draggable="false" class="nav-link{{#if active}} active{{/if}}" id="{{tabId}}" data-toggle="tab" href="#{{controls}}" role="tab" aria-controls="{{controls}}" aria-selected="true">{{label}}</a>
</li>`;

const bodyTemplate: string = `
<div id="{{panelId}}" class="container-fluid tab-pane show no-gutters{{#if active}} active{{/if}}" aria-labelledby="{{controlledBy}}" style="padding:0; position:relative; min-height:480px; top:1em;">
    {{content}}
</div>`;

export type WidgetsMap = { [id: string]: WidgetEVO };
export const BuilderEvents = {
    DidCreateWidget: "DidCreateWidget",
    DidCutWidget: "DidCutWidget",
    DidDeleteWidget: "DidDeleteWidget",
    DidSelectWidget: "DidSelectWidget",
    DidDeselectWidget: "DidDeselectWidget",
    WillEditWidget: "WillEditWidget",
};
export interface SelectWidgetEvent {
    id: string
}
export interface CreateWidgetEvent extends SelectWidgetEvent {
    name: string,
    widgets: WidgetsMap,
    hotspots: HotspotsMap
};
export type DeleteWidgetEvent = CreateWidgetEvent; 
export type CutWidgetEvent = CreateWidgetEvent; 

export const MIN_WIDTH: number = 800; //px
export const MIN_HEIGHT: number = 400; //px

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

    resizeView (coords?: Coords): void { }

    /**
     * Attaches a new panel to prototype builder. This function should be invoked only once.
     * @param opt 
     */
    render (opt?: CentralViewOptions): CentralView {
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