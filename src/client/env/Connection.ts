export type PVSioWebCallBack = (err?: any, res?: any) => void;
export declare type PVSioWebRequest = TokenId;
export declare type PVSioWebResponse = TokenId;
import * as serverUtils from '../../server/ServerUtils';
import * as Backbone from 'backbone';

export declare type RequestType = TokenType;
export declare type ResponseType = TokenType;
export declare type TokenType = "startPvsProcess" | "stopPvsProcess" | "sendCommand" | "execJava"
    | "readFile" | "writeFile" | "deleteFile" | "deleteFolder" | "writeFolder" | "readFolder"
    | "keepAlive" | "activate-server" | "setMainFile" | "changeProjectSetting" | "listProjects"
    | "openProject" | "typeCheck" | "<ping>" | "<pong>" | "renameFile" | "fileExists"
    | "readExamplesFolder" | "renameProject" | "ctrl" | "startSapereEE" | "stopSapereEE"
    | "startIVY" | "error" | "changeProjectSettings" | "FileSystemUpdate";

export interface BasicToken {
    socketId?: number,
    name?: string,
    path?: string,
    files?: serverUtils.NodeJSFileDescriptor[],
    type: TokenType,
    time?: { 
        client?: { sent?: number, received?: number },
        server?: { sent?: number, received?: number }
    },
    data?: any,
    err?: {
        path?: string,
        message?: string,
        code?: string,
        failedCommand?: string
    }
}
export interface ErrorToken extends BasicToken {
    type: "error",
    err: {
        message: string,
        code: string,
        path?: string,
        failedCommand?: string
    }
}
export interface TokenId extends BasicToken {
    id: string;
}
export interface StartServerToken extends TokenId {
    data: string;
}
export interface SetMainFileToken extends TokenId {
    type: "setMainFile",
    name: string,
    project: serverUtils.ProjectDescriptor,
    key?: string,
    value?: string
}
export interface ChangeProjectSettingsToken extends TokenId {
    type: "changeProjectSettings",
    name: string,
    project: serverUtils.ProjectDescriptor,
    key?: string,
    value?: string
}
export interface OpenProjectToken extends TokenId {
    name: string,
    project: serverUtils.ProjectDescriptor,
    key?: string,
    value?: string
}
export interface TypecheckToken extends TokenId {
    path: string
    stdout?: string,
    stderr?: string
}
export interface SendCommandToken extends TokenId {
    type: "sendCommand",
    command: string,
    data?: {},
    raw?: string,
    json?: string
}
export interface ListProjectsToken extends TokenId {
    socketId: number,
    projects: serverUtils.ProjectDescriptor[]
}
export interface FileDescriptor {
    fileName: string,
    fileExtension: string,
    contextFolder: string
}

export interface StartPvsProcessToken extends TokenId {
    type: "startPvsProcess",
    data: FileDescriptor
}
export interface StopPvsProcessToken extends TokenId {
    type: "stopPvsProcess",
    data: FileDescriptor,
    message?: string
}
export interface ReadFileToken extends TokenId {
    path: string,
    encoding: "utf8" | "base64",
    content: string    
}
export interface WriteFileToken extends TokenId {
    type: "writeFile",
    encoding: "utf8" | "base64",
    content?: string,
    opt?: {
        overWrite?: boolean
    }
}
export interface DeleteFileToken extends TokenId {
    type: "deleteFile",
    encoding: "utf8" | "base64",
    content?: string
}
export interface RenameFileToken extends TokenId {
    type: "renameFile",
    encoding: "utf8" | "base64",
    oldPath: string,
    newPath: string
}
export interface FileExistsToken extends TokenId {
    type: "fileExists",
    encoding: "utf8" | "base64",
    path: string,
    exists?: boolean
}
export interface ReadFolderToken extends TokenId {
    type: "readFolder",
    files?: serverUtils.NodeJSFileDescriptor[]
}
export interface WriteFolderToken extends TokenId {
    type: "writeFolder"
}
export interface DeleteFolderToken extends TokenId {
    type: "deleteFolder"
}
export interface ReadExamplesFolderToken extends TokenId {
    type: "readExamplesFolder",
    files?: serverUtils.NodeJSFileDescriptor[]
}
export interface RenameProjectToken extends TokenId {
    type: "renameProject",
    oldPath: string,
    newPath: string
}
export interface CtrlToken extends TokenId {
    type: "ctrl"
}
export interface JavaToken extends TokenId {
    type: "execJava",
    data: {
        javaFile: string, 
        basePath?: string, 
        argv?: string[], 
        javaOptions?: string[] 
    },
    stdout?: string,
    stderr?: string
}
export interface StartSapereEEToken extends TokenId {
    type: "startSapereEE",
    stdout?: string,
    stderr?: string
}
export interface StopSapereEEToken extends TokenId {
    type: "stopSapereEE"
}
export interface StartIVYToken extends TokenId {
    type: "startIVY",
    stdout?: string,
    stderr?: string
}
export interface FileSystemUpdateToken extends BasicToken {
    socketId: -1,
    type: "FileSystemUpdate",
    event: "rename" | "change" | "delete" | "refresh",
    subFiles?: serverUtils.NodeJSFileDescriptor[],
    isDirectory?: boolean,
    subFolders?: serverUtils.NodeJSFileDescriptor[]
}
export interface PingToken extends TokenId {
    type: "<ping>",
    data?: string[]
} 
export interface PongToken extends TokenId {
    type: "<pong>",
    data?: string[]
} 

export type Token = PongToken | PingToken | FileSystemUpdateToken | StartIVYToken | StopSapereEEToken | StartSapereEEToken
    | JavaToken | CtrlToken | RenameProjectToken | DeleteFolderToken | WriteFolderToken | ReadFolderToken
    | FileExistsToken | RenameFileToken | DeleteFileToken | WriteFileToken | ReadFileToken | StopPvsProcessToken
    | StartPvsProcessToken | ListProjectsToken | SendCommandToken | TypecheckToken | OpenProjectToken | ReadExamplesFolderToken
    | ChangeProjectSettingsToken | SetMainFileToken | ErrorToken | StartServerToken;


export const ConnectionEvents = {
    DidOpenConnection: "DidOpenConnection",
    DidCloseConnection: "DidCloseConnection",
    ConnectionTimedOut: "ConnectionTimedOut",
    UserAuthenticated: "UserAuthenticated",
    NoConnection: "NoConnection",
    DidSendRequest: "DidSendRequest",
    SendResponse: "SendResponse"
};

export interface SendRequestDescriptor {
    type: RequestType,
    req: PVSioWebRequest
};
export interface ResponseDescriptor {
    type: ResponseType,
    err?: any,
    res?: any
};

export declare interface Connection extends Backbone.EventsMixin {
    activate: () => Promise<boolean>;
    getUrl: () => string;
    sendRequest: (type: RequestType, req: PVSioWebRequest) => Promise<boolean>;
    onRequest: (type: RequestType, req: PVSioWebCallBack) => void;
}

//--------- Connection Implementations ---------------

/**
 * Backbone connection uses triggers and events to enable interactions.
 * For example, callers can 
 * - listen to open conneciton events: connection.on(ConnectionEvents.DidOpenConnection, () => { ... })
 * - listen to requests sent by modules using the connection: connection.on(ConnectionEvents.DidSendRequest, (desc: SendRequestDescriptor) => { ... })
 * - send messages in response to requests: connection.trigger(ConnectionEvents.SendResponse, <ResponseDescriptor> desc);
 */
export class BackboneConnection extends Backbone.Model implements Connection {

    protected serverUrl: string = "ws://localhost";
    protected serverPort: number = 8082;

    protected connected: boolean = false;

    protected callbackRegistry: { [type: string]: PVSioWebCallBack } = {};

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
        return this.isOnCloud() ? this.getServerAddress().replace("wss://", "https://")
            : this.getServerAddress().replace("ws://", "http://");
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