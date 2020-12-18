/**
 * manages websocket connection to the pvsio-web server-- currently useful
 * @author Patrick Oladimeji
 * @date 6/20/13 10:45:57 AM
 */
import { FileDescriptor, uuid } from "./Utils";
import { Connection, PVSioWebRequest, PVSioWebCallBack, OpenFileDialog } from "./Connection";
import { EventDispatcher } from "./EventDispatcher";
import { LayoutManager } from "./LayoutManager";

export const WebSocketConnectionEvents = {
    ConnectionOpened: "ConnectionOpened",
    ConnectionClosed: "ConnectionClosed",
    ConnectionTimedOut: "ConnectionTimedOut",
    UserAuthenticated: "UserAuthenticated",
    NoConnection: "NoConnection"
};

const dbg: boolean = true;

// import { EventDispatcher } from "../util/eventDispatcher";
// import * as PVSioStateParser from "../util/PVSioStateParser";

export class WebSocketConnection extends EventDispatcher implements Connection {

    protected serverUrl: string = "ws://localhost";
    protected serverPort: number = 8082;
    protected callbackRegistry: { [key: string]: any } = {};
    protected receiversRegistry: { [key: string]: any } = {};
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
                            this.sendRequest({ type: "keepAlive" });
                            // console.log("Sending keepalive message...");
                        }, this.keepAliveInterval);
                    }
                    this.fire({ type: WebSocketConnectionEvents.ConnectionOpened, event });
                    resolve(true);
                };
                this.ws.onerror = (event: ErrorEvent) => {
                    this.connected = false;
                    console.error("[websocket-client] Connection closed unexpectedly :/", event);
                    resolve(false);
                };
                this.ws.onclose = (event: CloseEvent) => {
                    this.connected = false;
                    this.ws = null;
                    // this.fire({ type: WebSocketEvents.ConnectionClosed, event });
                    console.error("[websocket-client] Connection closed", event);
                    resolve(false);
                };
                //when a message is received, look for the callback for that message id in the callbackRegistry
                //if no callback exists then broadcast the event using the token type string
                this.ws.onmessage = (event: MessageEvent) => {
                    let token = JSON.parse(event.data);
                    //if token has an id check if there is a function to be called in the registry
                    if (token) {
                        if (token.err && !token.id) {
                            console.warn("[websocket-client] Warning: server replied with error state", token.err);
                            // these are critical errors such as websocket being closed
                            if (token.err.code !== "EPIPE") {
                                console.error(JSON.stringify(token)); // errors should always be reported in the browser console
                            }
                            // clear callback log to unlock functions waiting
                            for (let f in this.callbackRegistry) {
                                this.callbackRegistry[f](token.err, null);
                            }
                            this.callbackRegistry = {}; // clean up callback registry for critical errors
                        }
                        if (token.type === "ctrl") {
                            let cbs = this.receiversRegistry[token.data.channelID];
                            if (cbs && cbs.length > 0) {
                                for (let f in cbs) {
                                    if (cbs[f] && typeof cbs[f] === "function") {
                                        cbs[f](token.data);
                                    }
                                }
                            }
                        }
                        if (token.id && typeof this.callbackRegistry[token.id] === "function") {
                            let time = new Date().getTime() - token.time.client.sent;
                            console.log("[websocket-client] Time to response", time, "ms");
                            if (token.type.indexOf("_error") >= 0 && dbg) {
                                console.error(token); // errors should always be reported in the browser console
                            }
                            let f = this.callbackRegistry[token.id];
                            delete this.callbackRegistry[token.id];
                            f(token.err, token);
                        } else if (token.type && token.type !== "FileSystemUpdate") {
                            console.warn("[websocket-client] Warning: token id is not in callback registry");
                            // this.fire(token);
                        }
                    }
                };
            }
        });
    };
    /**
     * sends a message and register a callback to invoke when the message response is received from the server.
     */
    async sendRequest (request?: PVSioWebRequest, cb?: PVSioWebCallBack): Promise<boolean> {
        const send = () => {
            request.id = uuid();
            request.time = { client: { sent: new Date().getTime() } };
            if (request.data && request.data.command && typeof request.data.command === "string") {
                // removing white space is useful to reduce the message size (e.g., to prevent stdin buffer overflow)
                request.data.command = request.data.command.split(",").map((str: string) => {
                    return str.trim();
                }).join(",");
            }
            this.callbackRegistry[request.id] = cb;
            this.ws.send(JSON.stringify(request));
        }
        await this.activate();
        if (this.ws) {
            if (request && request.type) {
                switch (request.type) {
                    default: {
                        break;
                    }
                }
                send();
                return true;
            } else {
                console.error("[websocket-client] Error: Token is undefined or malformed");
                console.error(request);
            }
        } else {
            console.error("[websocket-client] Cannot send: WebSocket is closed :/");
        }
        return false;
    };
    /**
     * closes the websocket connection
     */
    close (): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    };

    registerReceiver (channelID, cb) {
        if (!this.receiversRegistry[channelID]) {
            this.receiversRegistry[channelID] = [];
        }
        this.receiversRegistry[channelID].push(cb);
        // if (ws) {
        //     if (!receiversRegistry[channelID]) {
        //         receiversRegistry[channelID] = [];
        //     }
        //     ws.send(JSON.stringify({
        //         id: uuid(),
        //         time: { client: { sent: new Date().getTime() } },
        //         type: "registerReceiver"
        //     }));
        // }
    };
}


