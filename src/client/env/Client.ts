import { PluginManager } from "./PluginManager";
import { LayoutManager } from "./LayoutManager";
import { Connection } from "./Connection";
import { WebSocketConnection } from "./WebSocketConnection";

export class Client {
    readonly pvsioweb_version: string = "3.0";

    protected connection: Connection;

    protected layoutManager: LayoutManager;
    protected pluginManager: PluginManager;

    constructor (opt?: { connection?: Connection}) {
        this.layoutManager = new LayoutManager({ version: this.pvsioweb_version });
        this.connection = opt?.connection || new WebSocketConnection();
        this.pluginManager = new PluginManager();
    }

    async start (): Promise<boolean> {
        this.layoutManager.activate(this.connection);
        this.pluginManager.activate(this.connection);
        this.layoutManager.hideSplash({ fade: true });
        return true;
    }
}
