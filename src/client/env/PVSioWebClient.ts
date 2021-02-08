import { LayoutManager } from "./LayoutManager";
import { Connection } from "./Connection";
import { WebSocketConnection } from "./WebSocketConnection";

export class PVSioWebClient {
    readonly pvsioweb_version: string = "3.0";

    protected connection: Connection;

    protected layoutManager: LayoutManager;

    constructor (opt?: { connection?: Connection}) {
        this.connection = opt?.connection || new WebSocketConnection();
        this.layoutManager = new LayoutManager({ version: this.pvsioweb_version });
    }

    async start (): Promise<boolean> {
        await this.layoutManager.activate(this.connection);
        this.layoutManager.hideSplash({ fade: true });
        return true;
    }

}
