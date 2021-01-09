import * as Backbone from 'backbone';
import * as Utils from '../../../env/Utils';
import { Connection } from '../../../env/Connection';
import { HotspotsMap } from './editors/HotspotEditor';
import { Coords, WidgetEVO } from '../widgets/core/WidgetEVO';

export interface CentralViewOptions extends Backbone.ViewOptions {
    viewId: string,
    screenName: string,
    headerDiv: HTMLElement,
    content?: string,
    label?: string,
    active?: boolean,
    parentDiv: HTMLElement
};

export const CentralViewEvents = {
    DidShowView: "DidShowView",
    DidHideView: "DidHideView"
};

const headerTemplate: string = `
<li class="nav-item">
<a draggable="false" class="nav-link{{#if active}} active{{/if}}" id="{{screenName}}-tab" data-toggle="tab" href="#{{screenName}}" role="tab" aria-controls="{{screenName}}" aria-selected="true">{{label}}</a>
</li>`;

const bodyTemplate: string = `
<div id="{{screenName}}" class="container-fluid tab-pane show no-gutters{{#if active}} active{{/if}}" aria-labelledby="{{screenName}}-tab" style="padding:0; position:relative; min-height:480px;">
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
    
    protected screenName: string;
    protected $headerDiv: JQuery<HTMLElement>;
    protected $parentDiv: JQuery<HTMLElement>;

    protected $headerTab: JQuery<HTMLElement>;

    protected viewId: string;
    protected viewOptions: CentralViewOptions;

    constructor (data: CentralViewOptions, connection: Connection) {
        super(data);
        this.viewOptions = data;
        this.connection = connection;
        this.viewId = data.viewId || `view-${Utils.uuid()}`;
        this.screenName = data?.screenName || "";
        this.$headerDiv = $(data?.headerDiv);
        this.$parentDiv = $(data?.parentDiv);
    }

    resizeView (coords?: Coords): void { }

    activate (): void { }

    /**
     * Attaches a new panel to prototype builder. This function should be invoked only once.
     * @param opt 
     */
    render (opt?: CentralViewOptions): CentralView {
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
            this.$headerTab = this.$headerDiv.find(`#${this.screenName}-tab`);
            // the view is active when the user clicks on the tab
            this.$headerTab.on("click", (evt: JQuery.ClickEvent) => {
                // console.log(`${this.screenName} active`);
                this.trigger(CentralViewEvents.DidShowView, { id: this.screenName });
            });    
        }
        return this;
    }
}