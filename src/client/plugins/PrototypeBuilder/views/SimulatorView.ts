import { uuid } from '../../../utils/pvsiowebUtils';
import { Connection } from '../../../env/Connection';
import { CentralView, WidgetsMap, CentralViewOptions } from './CentralView';
import { Renderable } from '../widgets/core/WidgetEVO';
import { CSS } from '../widgets/core/WidgetEVO';
import { SettingsElem } from './SettingsView';

export class SimulatorView extends CentralView {
    protected simulatorId: string = uuid();

    protected settings: SettingsElem[];
    protected widgets: WidgetsMap;

    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
    }

    /**
     * Saves a pointer to the settings panel
     * @param settings 
     */
    importSettings (settings: SettingsElem[]): void {
        this.settings = settings;
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
        for (let i in this.widgets) {
            this.widgets[i].render(state, opt);
        }
    }

    async renderView (opt?: CentralViewOptions): Promise<SimulatorView> {
        const content: string = "";
        await super.renderView({ ...this.viewOptions, content });
        return this;
    }

}