/**
 * Loopback connection -- useful to build prototypes without a server component
 */

import { Connection, PVSioWebRequest, PVSioWebCallBack, RequestType } from './Connection';
import * as Backbone from 'backbone';

const dbg: boolean = true;

export const ConnectionEvents = {
    ConnectionOpened: "ConnectionOpened",
    ConnectionClosed: "ConnectionClosed",
    ConnectionTimedOut: "ConnectionTimedOut",
    UserAuthenticated: "UserAuthenticated",
    NoConnection: "NoConnection"
};

export class LoopbackConnection extends Backbone.Model implements Connection {

    protected serverUrl: string = "ws://localhost";
    protected serverPort: number = 8082;

    protected callbackRegistry: { [type: string]: PVSioWebCallBack } = {};

    constructor (opt?: { keepAlive?: boolean, keepAliveInterval?: number }) {
        super();
        opt = opt || {};
        this.serverPort = this.getServerPort();
        this.serverUrl = this.getServerUrl();
    }
    protected isOnCloud (): boolean {
        return window.location.href.includes(".herokuapp.com")
            || window.location.href.includes("pvsioweb.org");
    }
    protected getServerPort (): number {
        return this.isOnCloud() ? 0 : 8082;
    }
    protected getServerUrl (): string {
        const protocol: string = this.isOnCloud() ? "wss" : "ws";
        return window.location.href.indexOf("file") === 0 ?
            (`${protocol}://localhost`) 
                : (`${protocol}://${window.location.hostname}`);
    }
    protected getServerAddress (): string {
        return (this.serverPort) ?
            this.serverUrl + ":" + this.serverPort
                : this.serverUrl;
    }
    /**
     * Returns the type of connection
     */
    getUrl (): string {
        return this.isOnCloud() ? this.getServerAddress().replace("wss://", "https://")
            : this.getServerAddress().replace("ws://", "http://");
    }
    /**
     * Activates the connection to the server, i.e., tries to connect to the server
     */
    async activate (): Promise<boolean> {
        this.trigger(ConnectionEvents.ConnectionOpened);
        return true;
    };
    onRequest (type: RequestType, cb?: PVSioWebCallBack): void {
        if (type && typeof cb === "function") {
            this.callbackRegistry[type] = cb;
        }
    }
    /**
     * echoes the message.
     */
    async sendRequest (type: RequestType, request?: PVSioWebRequest): Promise<boolean> {
        if (type) {
            setTimeout(() => {
                if (this.callbackRegistry && typeof this.callbackRegistry[type] === "function") {
                    this.callbackRegistry[type](null, request);
                }
            }, 50);
        }
        return true;
    };
}