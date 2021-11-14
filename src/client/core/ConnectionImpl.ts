//--------- Connection Implementations ---------------

import * as Backbone from 'backbone';
import { 
    Connection, PVSioWebCallBack, PVSioWebRequest, RequestType, 
    ResponseDescriptor, SendRequestDescriptor, Token
} from '../common/interfaces/Connection';

export const ConnectionEvents = {
    DidOpenConnection: "DidOpenConnection",
    DidCloseConnection: "DidCloseConnection",
    ConnectionTimedOut: "ConnectionTimedOut",
    UserAuthenticated: "UserAuthenticated",
    NoConnection: "NoConnection",
    DidSendRequest: "DidSendRequest",
    SendResponse: "SendResponse"
};

/**
 * Backbone connection uses triggers and events to enable interactions.
 * For example, callers can 
 * - listen to open conneciton events: connection.on(ConnectionEvents.DidOpenConnection, () => { ... })
 * - listen to requests sent by modules using the connection: connection.on(ConnectionEvents.DidSendRequest, (desc: SendRequestDescriptor) => { ... })
 * - send messages in response to requests: connection.trigger(ConnectionEvents.SendResponse, <ResponseDescriptor> desc);
 */
export class BackboneConnection extends Backbone.Model implements Connection {

    protected serverUrl: string = "wss://localhost";
    protected serverPort: number = 8082;

    protected connected: boolean = false;

    protected callbackRegistry: { [type: string]: PVSioWebCallBack } = {};

    /**
     * Constructor
     */
    constructor () {
        super();
        this.serverPort = this.getServerPort();
        this.serverUrl = this.getServerUrl();
        this.on(ConnectionEvents.SendResponse, (desc: ResponseDescriptor) => {
            if (desc && desc.type) {
                if (this.callbackRegistry && typeof this.callbackRegistry[desc.type] === "function") {
                    this.callbackRegistry[desc.type](desc.err, desc.res)
                } else {
                    console.warn(`[connection] Warning: unable to trigger callback (callback registry for ${desc.type} is null)`);
                }
            } else {
                console.warn(`[connection] Warning: unable to trigger callback (OnRequest descriptor is null)`);
            }
        });
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
     * Returns the connection address
     */
    getUrl (): string {
        return this.getServerAddress().startsWith("ws") ?
            this.getServerAddress().replace("ws", "http")
                : this.getServerAddress();
    }
    /**
     * Activates the connection to the server, i.e., tries to connect to the server
     */
    async activate (): Promise<boolean> {
        if (this.connected) {
            return true;
        }
        this.connected = true;
        this.trigger(ConnectionEvents.DidOpenConnection);
        return true;
    };
    /**
     * Registers an event receiver
     */
    onRequest (type: RequestType, cb?: PVSioWebCallBack): void {
        if (type && typeof cb === "function") {
            this.callbackRegistry[type] = cb;
        }
    }
    /**
     * Triggers a SendRequest event. 
     * The response can be triggered using trigger(ConnectionEvents.TriggerOnRequest, { type, err?, res? }) -- see also LoopbackConnection
     */
    async sendRequest (type: RequestType, req?: PVSioWebRequest): Promise<boolean> {
        await this.activate();
        if (type) {
            const desc: SendRequestDescriptor = { type, req };
            this.trigger(ConnectionEvents.DidSendRequest, desc);
        }
        return true;
    };
    /**
     * Closes the connection
     */
    close (): void {
        if (this.connected) {
            this.connected = false;
            this.trigger(ConnectionEvents.DidCloseConnection)
        }
    }
}

/**
 * Loopback Connection
 */
export class LoopbackConnection extends BackboneConnection {
    
    /**
     * echoes the message.
     */
    async sendRequest (type: RequestType, request?: PVSioWebRequest): Promise<boolean> {
        super.sendRequest(type, request);
        if (type) {
            setTimeout(() => {
                this.trigger(ConnectionEvents.SendResponse, { type, res: request }); // sends back the request
            }, 50);
        }
        return true;
    };
}

/**
 * WebSocket Connection Manager
 */
export class WebSocketConnection extends BackboneConnection {

    protected ws: WebSocket;
    protected keepAlive: boolean = false;
    protected keepAliveInterval: number = 6000;

    constructor (opt?: { keepAlive?: boolean, keepAliveInterval?: number }) {
        super();
        opt = opt || {};
        this.keepAlive = opt.keepAlive;
        this.keepAliveInterval = opt.keepAliveInterval || 6000;
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
                    super.activate();
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

    /**
     * closes the websocket connection
     */
    close (): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            super.close();
        }
    };
}