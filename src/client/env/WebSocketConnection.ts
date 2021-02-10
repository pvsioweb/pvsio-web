/**
 * manages websocket connection to the pvsio-web server-- currently useful
 * @author Patrick Oladimeji
 * @date 6/20/13 10:45:57 AM
 */
import { Token, Connection, PVSioWebRequest, PVSioWebCallBack } from './Connection';
import * as Backbone from 'backbone';
import { ConnectionEvents } from './LoopbackConnection';

export const WebSocketConnectionEvents = ConnectionEvents;

export class WebSocketConnection extends Backbone.Model implements Connection {

    protected serverUrl: string = "ws://localhost";
    protected serverPort: number = 8082;
    protected callbackRegistry: { [key: string]: PVSioWebCallBack } = {};
    // protected receiversRegistry: { [key: string]: any } = {};
    protected ws: WebSocket;
    protected keepAlive: boolean = false;
    protected keepAliveInterval: number = 6000;

    // connection flags
    connected: boolean = false;

    constructor (opt?: { keepAlive?: boolean, keepAliveInterval?: number }) {
        super();
        opt = opt || {};
        this.serverPort = this.getServerPort();
        this.serverUrl = this.getServerUrl();
        this.keepAlive = opt.keepAlive;
        this.keepAliveInterval = opt.keepAliveInterval || 6000;
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
    getUrl (): string {
        return this.isOnCloud() ? this.getServerAddress().replace("wss://", "https://")
            : this.getServerAddress().replace("ws://", "http://");
    }
    protected getServerAddress (): string {
        return (this.serverPort) ?
            this.serverUrl + ":" + this.serverPort
                : this.serverUrl;
    }

    /**
     * Activates the connection to the server, i.e., tries to connect to the server
     */
    async activate (): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.ws) {
                resolve(true);
            } else {
                this.ws = new WebSocket(this.getServerAddress());
                this.ws.onopen = (event: Event) => {
                    this.connected = true;
                    if (this.keepAlive) {
                        setInterval(() => {
                            this.sendRequest("keepAlive");
                            // console.log("Sending keepalive message...");
                        }, this.keepAliveInterval);
                    }
                    this.trigger(ConnectionEvents.ConnectionOpened, event);
                    resolve(true);
                };
                this.ws.onerror = (event: ErrorEvent) => {
                    this.connected = false;
                    console.error("[websocket-connection] Connection closed unexpectedly :/", event);
                    resolve(false);
                };
                this.ws.onclose = (event: CloseEvent) => {
                    this.connected = false;
                    this.ws = null;
                    // this.fire({ type: WebSocketEvents.ConnectionClosed, event });
                    console.error("[websocket-connection] Connection closed", event);
                    resolve(false);
                };
                //when a message is received, look for the callback for that message id in the callbackRegistry
                //if no callback exists then broadcast the event using the token type string
                this.ws.onmessage = (event: MessageEvent) => {
                    let token: Token = JSON.parse(event.data);
                    //if token has an id check if there is a function to be called in the registry
                    if (token) {
                        if (token.err) {
                            console.warn("[websocket-connection] Warning: server replied with error state", token.err);
                            // these are critical errors such as websocket being closed
                            if (token.err.code !== "EPIPE") {
                                console.warn(JSON.stringify(token)); // errors should always be reported in the browser console
                            }
                        }
                        // if (token.type === "ctrl") {
                        //     let cbs = this.receiversRegistry[token.data.channelID];
                        //     if (cbs && cbs.length > 0) {
                        //         for (let f in cbs) {
                        //             if (cbs[f] && typeof cbs[f] === "function") {
                        //                 cbs[f](token.data);
                        //             }
                        //         }
                        //     }
                        // }
                        if (token.type && this.callbackRegistry[token.type] && typeof this.callbackRegistry[token.type] === "function") {
                            this.callbackRegistry[token.type](token.err, token);
                        }
                    }
                };
            }
        });
    };

    /**
     * Register a callback to be invoked for message type.
     * @param type message type
     * @param cb callback function
     */
    onRequest (type: string, cb: PVSioWebCallBack): void {
        if (type && typeof cb === "function") {
            this.callbackRegistry[type] = cb;
        }
    }
    /**
     * sends a message to the server
     * @param type message type
     * @param request message to be send to the server
     * @returns the id of the request, to be used by the called to register the callback with onRequest
     */
    async sendRequest (type: string, request?: PVSioWebRequest): Promise<boolean> {
        const send = (): boolean => {
            this.ws?.send(JSON.stringify({ type, ...request }));
            return true;
        }
        await this.activate();
        if (this.ws) {
            return send();
        }
        console.error("[websocket-connection] Cannot send: WebSocket is closed :/");
        return false;
    };
    // async sendRequest (request?: PVSioWebRequest, cb?: PVSioWebCallBack): Promise<boolean> {
    //     const send = () => {
    //         request.id = uuid();
    //         request.time = { client: { sent: new Date().getTime() } };
    //         if (request.data && request.data.command && typeof request.data.command === "string") {
    //             // removing white space is useful to reduce the message size (e.g., to prevent stdin buffer overflow)
    //             request.data.command = request.data.command.split(",").map((str: string) => {
    //                 return str.trim();
    //             }).join(",");
    //         }
    //         this.callbackRegistry[request.id] = cb;
    //         this.ws.send(JSON.stringify(request));
    //     }
    //     await this.activate();
    //     if (this.ws) {
    //         if (request && request.type) {
    //             switch (request.type) {
    //                 default: {
    //                     break;
    //                 }
    //             }
    //             send();
    //             return true;
    //         } else {
    //             console.error("[websocket-client] Error: Token is undefined or malformed");
    //             console.error(request);
    //         }
    //     } else {
    //         console.error("[websocket-client] Cannot send: WebSocket is closed :/");
    //     }
    //     return false;
    // };
    /**
     * closes the websocket connection
     */
    close (): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    };

    // registerReceiver (channelID, cb: PVSioWebCallBack) {
    //     if (!this.receiversRegistry[channelID]) {
    //         this.receiversRegistry[channelID] = [];
    //     }
    //     this.receiversRegistry[channelID].push(cb);
    // };
}


