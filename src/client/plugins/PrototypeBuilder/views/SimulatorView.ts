import { uuid } from '../../../utils/pvsiowebUtils';
import { Connection } from '../../../env/Connection';
import { CentralView, WidgetsMap, CentralViewOptions } from './CentralView';
import { Renderable } from '../widgets/core/WidgetEVO';
import { CSS } from '../widgets/core/WidgetEVO';

export enum SimulatorEvents {
    DidRebootPrototype = "DidRebootPrototype"
};

export class SimulatorView extends CentralView {
    protected simulatorId: string = uuid();

    protected widgets: WidgetsMap;

    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
        this.installHandlers();
    }

    /**
     * Saves a pointer to the prototype widgets
     * @param widgets 
     */
    importWidgets (widgets: WidgetsMap): void {
        this.widgets = widgets;
    }

    /**
     * Renders all widgets with the given state
     * @param desc 
     */
    async renderWidgets (state: Renderable, opt?: CSS): Promise<void> {
        console.log(`[simulator-view] renderWidgets`, this.widgets);
        for (let i in this.widgets) {
            this.widgets[i].render(state, opt);
        }
    }

    /**
     * Render the view
     * @param opt 
     */
    async renderView (opt?: CentralViewOptions): Promise<SimulatorView> {
        const content: string = "";
        await super.renderView({ ...this.viewOptions, content });
        return this;
    }

    /**
     * Internal function, installs relevant event handlers
     */
    protected installHandlers (): void {
        $(document).find(".reboot-prototype-btn").on("click", async (evt: JQuery.ClickEvent) => {
            this.trigger(SimulatorEvents.DidRebootPrototype);
        });
    }

}