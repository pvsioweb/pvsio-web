import { uuid } from '../../../utils/pvsiowebUtils';
import { Connection, SendCommandToken, StartPvsProcessToken } from '../../../env/Connection';
import { CentralViewOptions, CentralView, WidgetsMap } from './CentralView';
import { Settings } from './SettingsView';

export class SimulatorView extends CentralView {
    protected simulatorId: string = uuid();

    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
    }

    async initSimulation (desc: { settings: Settings, widgets: WidgetsMap }): Promise<boolean> {
        const reqStart: StartPvsProcessToken = {
            type: "startPvsProcess",
            id: this.simulatorId,
            data: desc?.settings
        };
        let success: boolean = await new Promise((resolve, reject) => {
            if (this.connection) {
                this.connection.sendRequest("startPvsProcess", reqStart);
                this.connection.onRequest("startPvsProcess", () => {
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
        if (success && desc?.settings?.initFunction) {
            const reqInit: SendCommandToken = {
                type: "sendCommand",
                id: this.simulatorId,
                command: desc.settings.initFunction
            };
            success = await new Promise((resolve, reject) => {
                this.connection?.sendRequest("sendCommand", reqInit);
                this.connection?.onRequest("sendCommand", (res) => {
                    console.log(res);
                    for (let i in desc.widgets) {
                        desc.widgets[i].render()
                    }
                    resolve(true);
                });
            });        
        }
        return success;
    }

    render (opt?: CentralViewOptions): SimulatorView {
        const content: string = "";
        super.render({ ...this.viewOptions, content });
        return this;
    }

}