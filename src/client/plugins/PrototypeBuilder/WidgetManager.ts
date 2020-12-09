import { EventDispatcher } from "../../env/EventDispatcher";
import { Connection } from '../../env/Connection';
import { WidgetEVO } from './widgets/core/WidgetEVO';
import { WidgetClassDescriptor, widgets } from './widgets/widgets';
export class WidgetManager extends EventDispatcher {

    protected connection: Connection;
    protected wdg: { [id: string]: WidgetEVO } = {}; // widget instances created by prototype builder

    async activate (connection: Connection): Promise<boolean> {
        this.connection = connection;
        // test
        // for (let i in widgets) {
        //     const obj: WidgetEVO = new widgets[i].cons();
        //     this.wdg[i] = obj;
        //     const msg: string = `[widget-manager] Widget ${widgets[i].name} loaded!`
        //     console.log(msg);
        // }
        return true;
    }

    getWidget (id: string): WidgetEVO {
        return this.wdg[id];
    }

    getAllWidgets (): WidgetEVO[] {
        return Object.values(this.wdg);
    }

    getWidgetClassDescriptors (): WidgetClassDescriptor[] {
        return widgets;
    }

    startTimers (): void {

    }
    stopTimers (): void {

    }
    initWidgets (): void {

    }
}