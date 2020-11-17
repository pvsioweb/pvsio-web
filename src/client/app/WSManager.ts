/**
 * manages websocket connection to the pvsio-web server-- currently useful
 * @author Patrick Oladimeji
 * @date 6/20/13 10:45:57 AM
 */
import { EventHandler } from "backbone";
import { EventDispatcher } from "./util/eventDispatcher";
import * as PVSioStateParser from "./util/PVSioStateParser";
import { uuid } from "./util/uuidGenerator";

export const WebSocketEvents = {
    ConnectionOpened: "ConnectionOpened",
    ConnectionClosed: "ConnectionClosed",
    ConnectionTimedOut: "ConnectionTimedOut",
    UserAuthenticated: "UserAuthenticated",
    NoConnection: "NoConnection"
};

const dbg: boolean = true;
const keepAlive = false;

export class WebSocketClient extends EventDispatcher {

    protected _url: string = "ws://localhost";
    protected _port: number = 8082;
    protected callbackRegistry: { [key: string]: any } = {};
    protected receiversRegistry: { [key: string]: any } = {};
    protected ws: WebSocket;
    
    url (url?: string): string | WebSocketClient {
        if (url) {
            this._url = url; 
            return this; 
        }
        return this._url;
    }
    port (port?: number): number | WebSocketClient {
        if (port) { 
            this._port = port; 
            return this; 
        }
        return this._port;
    }

    /**
     * Attempts to logon to the websocket server
     * returns a promise that resolves when the connection has been opened
     */
    logon (): Promise<WebSocketClient> {
        return new Promise((resolve, reject) => {
            if (this.ws) {
                resolve(this);
            } else {
                let wsUrl: string = this._url;
                if (this.port()) { wsUrl = wsUrl + ":" + this.port(); }
                this.ws = new WebSocket(wsUrl);
                this.ws.onopen = (event: Event) => {
                    this.fire({ type: WebSocketEvents.ConnectionOpened, event });
                    resolve(this);
                };
                this.ws.onerror = (event: ErrorEvent) => {
                    console.error("socket closed unexpectedly :/");
                    reject(event);
                };
                this.ws.onclose = (event: CloseEvent) => {
                    this.ws = undefined;
                    this.fire({ type: WebSocketEvents.ConnectionClosed, event });
                    reject(event);
                };
                //when a message is received, look for the callback for that message id in the callbackRegistry
                //if no callback exists then broadcast the event using the token type string
                this.ws.onmessage = (event: MessageEvent) => {
                    let token = JSON.parse(event.data);
                    //if token has an id check if there is a function to be called in the registry
                    if (token) {
                        if (token.err && !token.id) {
                            console.error("Warning: server replied with error state", token.err);
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
                            console.log("Time to response", time, "ms");
                            if (token.type.indexOf("_error") >= 0 && dbg) {
                                console.error(token); // errors should always be reported in the browser console
                            }
                            let f = this.callbackRegistry[token.id];
                            delete this.callbackRegistry[token.id];
                            f(token.err, token);
                        } else if (token.type && token.type !== "FileSystemUpdate") {
                            console.error("Warning: token id is not in callback registry");
                            this.fire(token);
                        }
                    }
                };
            }
        });
    };
    /**
     * sends a message and register a callback to invoke when the message response is received from the server.
     */
    send (token, cb?) {
        if (this.ws) {
            let id = uuid();
            if (token && token.type) {
                token.id = token.id || id;
                token.time = { client: { sent: new Date().getTime() } };
                if (token.data && token.data.command && typeof token.data.command === "string") {
                    // removing white space is useful to reduce the message size (e.g., to prevent stdin buffer overflow)
                    token.data.command = token.data.command.split(",").map((str) => { return str.trim(); }).join(",");
                }
                this.callbackRegistry[id] = cb;
                this.ws.send(JSON.stringify(token));
            } else {
                console.error("Token is undefined or malformed");
                console.error(token);
            }
        } else {
            console.error("Cannot send: WebSocket is closed :/");
        }
        return this;
    };
    /**
     * closes the websocket connection
     */
    close () {
        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
            console.log("Client closes websocket connection...");
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


export class PVSioWebClient extends WebSocketClient {
    protected _lastState: string = "init(0)";

    /**
     * Get or set the server url for the websocket connection
     */
    serverUrl (url?: string): string | PVSioWebClient {
        if (url) {
            this.url(url);
            return this;
        }
        return <string> this.url();
    };

    /**
     * Get or set the last state of the model being executed in pvsio
     */
    lastState (st?: string): string | PVSioWebClient {
        if (st) {
            this._lastState = st;
            return this;
        }
        return this._lastState;
    }

    protected _logon () : Promise<WebSocketClient> {
        return super.logon();
    }

    /**
     * Initiates a connection to the pvsioweb websocket server.
     * Returns a promise that resolves when the connection is opened
     */
    logon (): Promise<PVSioWebClient> {
        return new Promise((resolve, reject) => {
            this._logon().then((res: PVSioWebClient) => {
                if (keepAlive) {
                    setInterval(() => {
                        this.send({ type: "keepAlive" });
                        // console.log("Sending keepalive message...");
                    }, 6000);
                }
                resolve(this);
            }).catch((err) => { console.log(err); reject(err); });
        });
    };

    /**
     * Starts the pvsio process with the parameters supplied
     * @param {{name: string, projectName: ?string, demoName: ?string}} data This contains information about the file to start and the folder containing that file relative to the server public folder
     * @param {callback} cb The callback function to invoke when the process has started
    */
    startPVSProcess (data, cb): void {
        if (data && data.name) {
            const sourceFile: string = data.name.split(".pvs")[0];
            this.send({
                type: "startProcess",
                data: {
                    name: sourceFile,
                    projectName: data.projectName,
                    demoName: data.demoName
                }
            }, cb);
        } else {
            console.log("ERROR: Failed to load pvs file " + data.demoName + "/" + data.name);
        }
    };

    /**
     * @function java
     * @desc Executes a java command
     * @param {Function} cb Callback function invoked when the command execution completes
     */
    java (javaFile, data, cb) {
        if (javaFile) {
            this.send({
                type: "java",
                data: {
                    javaFile: javaFile,
                    argv: data.argv,
                    javaOptions: data.javaOptions,
                    basePath: data.basePath
                }
            }, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                    if (cb && typeof cb === "function") {
                        cb(res.stderr, res.stdout);
                    }
                }
            });
        }
    };


    /**
     * @function ctrl
     * @desc Sends input control commands
     * @param {Function} cb Callback function invoked when the command execution completes
     */
    ctrl (data, cb) {
        this.send({
            type: "ctrl",
            data: data
        }, (err, res) => {
            if (err) {
                console.error(err);
            } else {
                // console.log(res);
                if (cb && typeof cb === "function") {
                    cb(res.stderr, res.stdout);
                }
            }
        });
    };

    /**
     * Closes the pvsio process attributed to this websocket connection if there is one
     * @param {function} cb The function to invoke when process has been closed
    */
    closePVSProcess (cb) {
        this.send({type: "closeProcess"}, cb);
    };

    /**
     * Sends a user interface command to be executed by the pvsio process. This method fires a "GraphUpdate" event whenever there is a response from the server due to the callback
     * @param {string} action The action to send to the process
     * @param {callback} cb The function to invoke with the results of performing the passed action on the process
    */
    sendGuiAction (action: string, cb) {
        if (action === "<ping>" || action === "<pong>") {
            var type = action.replace(/</,"").replace(/>/,"");
            this.send({type: type, command: action }, (err, res) => {
                if (cb && typeof cb === "function") {
                    cb(err, res);
                }
            });
        } else {
            this.send({ type: "sendCommand", command: action }, (err, res) => {
                console.log("data received: ", res);
                if (res) {
                    if (res.json) {
                        console.log("json data: ", res.json);
                    } 
                    if (res.data && res.data !== "") {
                        //do stuff to update the explored state graph and invoke the callback with the same parameters
                        this.fire({type: "GraphUpdate", transition: action, target: res.data, source: this.lastState()});
                        //update the lastState if it was a valid pvsio state
                        if (PVSioStateParser.isState(res.data)) {
                            this.lastState(res.data);
                        }
                    } else {
                        console.error("Warning: expression received from PVS is invalid: ", res);
                    }
                    if (cb && typeof cb === "function") {
                        cb(err, res);
                    }
                } else {
                    console.log("Warning: PVSio was not able to evalute expression ", action);
                    console.log(res.data);
                    //update res.data with previous valid state
                    res.data = this.lastState();
                }
            });
        }
        this.fire({type: "InputUpdated", data: action});
        return this;
    };

    /**
     * Gets the content of the file passed in the parameter
     * @param {string} path The relative path (from the base project dir) to the file whose content is desired
     * @param {callback} cb The function to invoke when content has been loaded. res parameter contains file content.
     * @deprecated we can use this function only for utf8 files --> this function has been replaced by readFile
    */
    getFile (path: string, cb) {
        const token = { type: "readFile", path, name: path.split("/").slice(-1).join("") };
        this.send(token, cb);
        return this;
    };
    /**
     * Reads the content of the file whose filename is specified in the descriptor
     * @param {{path: String, encoding: String}} token The details of the file to read.
     * @param {callback} cb The function to invoke when content has been loaded. res parameter contains file content.
    */
    readFile (token: { path: string, encoding?: string }, cb) {
        const type: string = "readFile";
        const name: string = token.path.split("/").slice(-1).join("");
        this.send({ type, name, path: token.path, encoding: token.encoding }, cb);
        return this;
    };
    /**
     * Writes the content passed using the specified name
     * @param {{path: String, content: String, projectName: String}} token The details of the file to write.
     *          Note that file path is relative to the base project directory
     * @param {callback} cb The callback to invoke with the result of the write operation.
    */
    writeFile (token, cb) {
        token.type = "writeFile";
        token.name = token.path.split("/").slice(-1).join("");
        this.send(token, cb);
        return this;
    };

    /**
     * @function deleteFile
     * @description Deletes the file passed as argument. The file path must start with the project name.
     * @param token {Object{path: String, projectName: String}} The details of the file that shall be deleted.
     *        Note: the file path is relative to the base project directory
     * @param cb {function} The callback function that shall be invoked at the end, when the delete result is ready.
     */
    deleteFile (token, cb) {
        token.type = "deleteFile";
        token.name = token.path.split("/").slice(-1).join("");
        this.send(token, cb);
        return this;
    };

    /**
     * @function deleteDirectory
     * @description Deletes the directory passed as argument.
     *      The directory path must start with the project name, and end with  "/"
     * @param path {String} The path of the directory that shall be deleted. The path is relative to the current project.
     *       Note: the file path is relative to the base project directory
     * @param cb {function} The callback function that shall be invoked at the end, when the delete result is ready.
     */
    deleteDirectory (path: string, cb) {
        this.send({type: "deleteDirectory", path: path}, cb);
        return this;
    };

    /**
     * creates a directory with the specified path.
     * @param {string} path the path to the directory to create. This path is relative to the base project directory
     * @param {callback} cb the callback function to invoke when the function returns from the server
    */
    writeDirectory (path: string, cb) {
        this.send({type: "writeDirectory", path: path}, cb);
        return this;
    };
}


let client: PVSioWebClient; 

export class WSManager {
    protected instance: WSManager;
    static getWebSocket (): PVSioWebClient {
        client = client || new PVSioWebClient();
        return client;
    }
}

