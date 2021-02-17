import { uuid } from '../../../utils/pvsiowebUtils';
import { Connection, SendCommandToken, StartProcessData, StartProcessToken } from '../../../env/Connection';
import { CentralViewOptions, CentralView, WidgetsMap } from './CentralView';
import { Settings } from './SettingsView';

export class SimulatorView extends CentralView {
    protected simulatorId: string = uuid();

    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
    }

    async initSimulation (desc: { settings: Settings[], widgets: WidgetsMap }): Promise<boolean> {
        if (desc?.settings) {
            const data: StartProcessData = {};
            for (let i = 0; i < desc.settings.length; i++) {
                if (desc.settings[i]?.init) {
                    data[desc.settings[i].id] = desc.settings[i].value;
                }
            }
            const reqStart: StartProcessToken = {
                type: "startProcess",
                id: this.simulatorId,
                data
            };
            let success: boolean = await new Promise((resolve, reject) => {
                if (this.connection) {
                    this.connection.sendRequest("startProcess", reqStart);
                    this.connection.onRequest("startProcess", () => {
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }
            });
            if (success && desc.settings.filter(elem => {
                elem.id === "initFunction"
            }).length) {
                const command: string = desc.settings.filter(elem => {
                    elem.id === "initFunction"
                })[0].value;
                const reqInit: SendCommandToken = {
                    type: "sendCommand",
                    id: this.simulatorId,
                    command
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
        return false;
    }

    render (opt?: CentralViewOptions): SimulatorView {
        const content: string = "";
        super.render({ ...this.viewOptions, content });
        return this;
    }

}