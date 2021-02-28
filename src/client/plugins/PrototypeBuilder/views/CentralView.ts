import * as Backbone from 'backbone';
import * as Utils from '../../../utils/pvsiowebUtils';
import { Connection } from '../../../env/Connection';
import { HotspotsMap } from './editors/HotspotEditor';
import { Coords, WidgetEVO } from '../widgets/core/WidgetEVO';

export declare interface CentralViewOptions extends Backbone.ViewOptions {
    label: string, // label shown in the tab
    viewId: string, // unique id of the view
    panelId: string, // id of the panel linked to the view
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

const bodyTemplate: string = `
<div id="{{panelId}}" class="container-fluid tab-pane show no-gutters p-0">
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

    /**
     * Constructor
     * @param data 
     * @param connection 
     */
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
        // append body
        const viewBody: string = Handlebars.compile(bodyTemplate, { noEscape: true })({
            controlledBy: `${this.viewId}-tab`,
            panelId: this.panelId,
            content: opt?.content,
            active: opt?.active
        });
        this.$el.append(viewBody);
        return this;
    }

    /**
     * Makes the view visible. Only one central view is visible at each time.
     */
    revealView (): void {
        // hide all central views
        this.$el.find(`.tab-pane`).removeClass("active");
        // make this view visible
        this.$el.find(`#${this.panelId}`).addClass("active");
    }
}