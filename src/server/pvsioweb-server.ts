//#!/usr/bin/env node
/**
Copyright (c) 2012

Patrick Oladimeji
This file is part of pvsio-web.

pvsio-web is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pvsio-web is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with pvsio-web.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * This file creates a connection to a pvsio process run locally or at specified host.
 * It also creates an express webserver to serve demo applications e.g. the infusion
 * pump pvsio demo.
 * The websocket connection started by this process listens for 3 commands:
 * sendCommand: used to send a pvsio command to the processs
 * startProcess: used to start the pvsio process
 * getSourceCode: used to get the source code of the pvs code being executed
 * @author patrick
 * @date 28 Jul 2012 21:52:31
 *
 */

import * as path from 'path';
import * as ws from 'ws';
import * as fs from 'fs';
import * as express from 'express';
import * as http from 'http';
import * as open from 'open';
import * as util from 'util';
import { ProcessWrapper } from './processwrapper';
import * as FileFilters from './FileFilters';
import * as serverUtils from './serverFunctions';
import { ExecException } from 'child_process';
import { CallbackArgs, PvsProcess } from './pvsprocess';
import WebSocket = require('ws');

const baseProjectDir: string = path.join(__dirname, "../../examples/projects/");
const baseDemosDir: string = path.join(__dirname, "../../examples/demos/");
const baseTutorialsDir: string = path.join(__dirname, "../../examples/tutorials/");
const baseExamplesDir: string = path.join(__dirname, "../../examples/");
const clientDir: string = path.join(__dirname, "../client");

export interface BasicToken {
    socketId: number,
    name?: string,
    path?: string,
    files?: serverUtils.FileDescriptor[],
    type: string,
    time: { client?: { sent?: number }, server?: { sent?: number } },
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
    id: string
}
export interface SetMainFileToken extends TokenId {
    type: "setMainFile",
    projectName: string,
    projectDesc: serverUtils.ProjectDescriptor,
    key?: string,
    value?: string
}
export interface ChangeProjectSettingsToken extends TokenId {
    type: "changeProjectSettings",
    projectName: string,
    projectDesc: serverUtils.ProjectDescriptor,
    key?: string,
    value?: string
}
export interface OpenProjectToken extends TokenId {
    projectName: string,
    projectDesc: serverUtils.ProjectDescriptor,
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
    data?: string[],
    json?: string
}
export interface ListProjectsToken extends TokenId {
    socketId: number,
    projects: serverUtils.ProjectDescriptor[]
}
export interface StartProcessToken extends TokenId {
    type: "startProcess",
    data: {
        name: string,
        projectName?: string,
        demoName?: string
    }
}
export interface CloseProcessToken extends TokenId {
    type: "closeProcess",
    data: {
        name: string,
        projectName?: string,
        demoName?: string
    },
    message?: string
}
export interface ReadFileToken extends TokenId {
    type: "readFile",
    encoding: "utf8" | "base64",
    content?: string
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
export interface ReadDirectoryToken extends TokenId {
    type: "readDirectory",
    files?: serverUtils.FileDescriptor[]
}
export interface WriteDirectoryToken extends TokenId {
    type: "writeDirectory"
}
export interface DeleteDirectoryToken extends TokenId {
    type: "deleteDirectory"
}
export interface ReadExamplesFolderToken extends TokenId {
    type: "readExamplesFolder",
    files?: serverUtils.FileDescriptor[]
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
    type: "java",
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
    subFiles?: serverUtils.FileDescriptor[],
    isDirectory?: boolean,
    subFolders?: serverUtils.FileDescriptor[]
}
export interface PingToken extends TokenId {
    type: "ping",
    data?: string[]
} 
export interface PongToken extends TokenId {
    type: "pong",
    data?: string[]
} 

export type Token = PongToken | PingToken | FileSystemUpdateToken | StartIVYToken | StopSapereEEToken | StartSapereEEToken
    | JavaToken | CtrlToken | RenameProjectToken | DeleteDirectoryToken | WriteDirectoryToken | ReadDirectoryToken
    | FileExistsToken | RenameFileToken | DeleteFileToken | WriteFileToken | ReadFileToken | CloseProcessToken
    | StartProcessToken | ListProjectsToken | SendCommandToken | TypecheckToken | OpenProjectToken | ReadExamplesFolderToken
    | ChangeProjectSettingsToken | SetMainFileToken | ErrorToken;


class PvsiowebServer {
    protected port: number = +process.env.PORT || 8082;
    protected pvsioProcessMap: { [key: string]: PvsProcess } = {};//each client should get his own process
    protected httpServer: http.Server;
    protected wsServer: ws.Server;
    protected clientid: number = 0;
    protected fsWatchers: { [folder: string]: fs.FSWatcher } = {};
    protected socketRegistry = {};
    protected procWrapper: ProcessWrapper;
    protected functionMaps: { [key: string]: (token: Token, socket: WebSocket, socketid: number) => Promise<void> } = {};

    constructor () {
        // create pvs process wrapper
        this.procWrapper = new ProcessWrapper();
        this.createClientFunctionMaps();
    }

    activate () {
        // create websocket server
        const webserver = express();
        this.httpServer = http.createServer(webserver);
        // create logger
        webserver.use("/demos", (req, res, next) => {
            if (req.method !== "GET") {
                console.log('Method: %s,  Url: %s, IP: %s', req.method, req.url, req.connection.remoteAddress);
            }
            next();
        });        
        //create the express static server serve contents in the client directory and the demos directory
        webserver.use(express.static(clientDir));
        webserver.use("/demos", express.static(baseDemosDir));
        webserver.use("/tutorials", express.static(baseTutorialsDir));
        webserver.use("/projects", express.static(baseProjectDir));
        //creating a pathname prefix for client so that demo css and scripts can be loaded from the client dir
        webserver.use("/client", express.static(clientDir));


        this.wsServer = new ws.Server({ server: this.httpServer });
        this.wsServer.on("connection", (socket: WebSocket) => {
            const socketid: number =  this.clientid++;
            this.socketRegistry[socketid] = socket;
            
            console.info("opening websocket client " + socketid);
            socket.on("message", async (m: string) => {
                try {
                    let token = JSON.parse(m);
                    console.dir(`[pvsioweb-server] ${m}`);
                    token.time = token.time || {};
                    token.time.server = { received: new Date().getTime() };
                    const f: (token: Token, socket: WebSocket, socketid: number) => Promise<void> = this.functionMaps[token.type];
                    if (f && typeof f === 'function') {
                        //call the function with token and socket as parameter
                        try {
                            await f(token, socket, socketid);
                        } catch (eval_error) {
                            const cmd: string = (token && token.data && token.data.command)? token.data.command : JSON.stringify(token);
                            console.error("unable to evaluate command " + cmd + " in PVSio (" + eval_error + ")");
                            token.err = eval_error;
                            this.processCallback(token, socket);
                        }
                    } else {
                        console.warn("f is something unexpected -- I expected a function but got type " + typeof f);
                    }
                } catch (error) {
                    console.error(error.message);
                    console.error(m);
                    console.warn("Error while parsing token " + JSON.stringify(m).replace(/\\/g,""));
                    const res: ErrorToken = {
                        type: "error",
                        err: error,
                        time: { server: { sent: new Date().getTime() } },
                        socketId: socketid
                    };
                    this.processCallback(res, socket);
                }
            });
    
            socket.on("close", () => {
                console.info("closing websocket client " + socketid);
                const p: PvsProcess = this.pvsioProcessMap[socketid];
                p?.close();
                delete this.pvsioProcessMap[socketid];
            });
    
            socket.on("error", (err: NodeJS.ErrnoException) => {
                console.error("abrupt websocket close operation from client " + socketid);
                console.error(err);
                const p: PvsProcess = this.pvsioProcessMap[socketid];
                p?.close();
                delete this.pvsioProcessMap[socketid];
            });
        });
        this.wsServer.on("error", (err: NodeJS.ErrnoException) => {
            if (err.code === "EADDRINUSE") {
                console.log("\nError: Another instance of the PVSio-web server is already running.\nPlease shut down the other PVSio-web server instance before starting a new instance.");
            } else {
                console.error(JSON.stringify(err));
            }
            console.log("----------------------------------------------");
        });


        console.info(""); // this is used to print date and time in the console
        console.log("----------------------------------------------\nStarting up PVSio-web server on port " + this.port + "...");
        this.httpServer.listen(this.port, () => {
            console.log("PVSio-web server ready!");
            console.log("----------------------------------------------");
            let restart = false;
            if (process.argv) {
                process.argv.forEach((val: string) => {
                    if (val?.toLowerCase() === "restart") {
                        restart = true;
                    }
                    if (val?.toLowerCase().indexOf("pvsdir:") === 0) {
                        process.env.pvsdir = val?.split(":")[1];
                    }
                });
            }
            if (!restart) {
                open(util.format("http://localhost:%s", this.port.toString()));
            }
        });
    }

    /**
     * Utility function that dispatches responses to websocket clients
     * @param {{type:string, data}} token The token to send to the client
     * @param {Socket} socket The websocket to use to send the token
     */
    protected processCallback(token: Token, socket: WebSocket): void {
        try {
            //called when any data is recieved from pvs process
            //if the type of the token is 'processExited' then send message to client if the socket is still open
            token.time = token.time || { };
            token.time.server = { sent: new Date().getTime() };

            //always send relative directories to the client
            if (token.name && token.name.indexOf(baseProjectDir) === 0) {
                token.name = token.name.replace(baseProjectDir, "");
            }
            if (token.path && token.path.indexOf(baseProjectDir) === 0) {
                token.path = token.path.replace(baseProjectDir, "");
            }
            if (token.files) {
                token.files.forEach((file: serverUtils.FileDescriptor) => {
                    if (file && file.path && file.path.indexOf(baseProjectDir) === 0) {
                        file.path = file.path.replace(baseProjectDir, "");
                    }
                });
            }
            if (token.err) {
                if (token.err.path) {
                    token.err.path = token.err.path.replace(new RegExp(baseProjectDir, "g"), "");
                }
                if (token.err.message) {
                    token.err.message = token.err.message.replace(new RegExp(baseProjectDir, "g"), "");
                }
            }
            if (socket && socket.readyState === 1) {
                // console.log("sending data back to client...");
                socket.send(JSON.stringify(token));
                // console.log("data sent!");
            }
        } catch (processCallbackError) {
            console.log("WARNING: processCallbackError " + JSON.stringify(processCallbackError));
        }
    }
    protected broadcast(token: Token): void {
        const keys: string[] = Object.keys(this.socketRegistry);
        for(let k in keys) {
            this.processCallback(token, this.socketRegistry[k]);
        }
    }

    /**
     * reads and changes the settings in the .pvsioweb file in the project root
     * @param {string} projectName the name of the project
     * @param {string} key the key of the setting to write
     * @param {object} value the value of the setting to write
     * @returns {Promise} a promise that is resolved when the settings file has been written.
    */
    protected async changeProjectSetting(projectName: string, key: string, value: any): Promise<Object> {
        let props = {};
        try {
            const file: string = path.join(baseProjectDir, projectName, "/pvsioweb.json");
            //if file does not exist, create it. Else read the property file and update just the key value specified
            const exists: boolean = serverUtils.fileExists(file);
            if (!exists) {
                props[key] = value;
                await serverUtils.writeFile(file, JSON.stringify(props, null, " "));
            } else {
                const content: string = await serverUtils.readFile(file, "utf8");
                props = JSON.parse(content) || props;
                props[key] = value;
                //write the file back
                await serverUtils.writeFile(file, JSON.stringify(props, null, " "), "utf8", { overWrite: true });
            }
        } catch (error) {
            console.log(error);
        } finally {
            return props;
        }
    }


    async typeCheck(file: string, cb: (error: ExecException, stdout: string, stderr: string) => void): Promise<void> {
        console.log("typechecking file " + file + " ...");
        if (process.env.PORT) { // this is for the PVSio-web version installed on the heroku cloud
            console.log("/app/PVS/proveit -T -l -v " + file);
            this.procWrapper.exec({
                command: "/app/PVS/proveit -T -l -v " + file,
                callBack: cb
            });
        } else if (process.env.pvsdir) {
            console.log(path.join(process.env.pvsdir, "proveit") + " -T -l -v " + file);
            this.procWrapper.exec({
                command: path.join(process.env.pvsdir, "proveit") + " -T -l -v " + file,
                callBack: cb
            });
        } else {
            console.log("proveit -T -l -v " + file);
            this.procWrapper.exec({
                command: "proveit -T -l -v " + file,
                callBack: cb
            });
        }
    }

    /**
     * @function java
     * @desc Executes a java program on the server
     * @param {Array[String]} options Command options. Includes argv (i.e., command options), basePath, javaOptions
     * @param {Function} cb Callback function invoked when the command execution completes
     */
    async java(javaFile: string, options: { 
        basePath?: string, 
        argv?: string[], 
        javaOptions?: string[] 
    }, cb: (error: ExecException, stdout: string, stderr: string) => void): Promise<void> {
        // console.log(javaFile, options, argv);
        options = options || {};
        try {
            const basePath: string = (options.basePath && path.isAbsolute(options.basePath)) ? options.basePath : path.join(baseExamplesDir, options.basePath);
            const argv: string[] = options.argv || [];
            const javaOptions: string[] = options.javaOptions || [];
            // console.log(javaFile, argv, basePath);
            const command = `cd ${basePath} && java ${javaOptions.join(" ")} ${javaFile} ${argv.join(" ")}`;
            console.log("Executing command: ", command);
            this.procWrapper.exec({
                command: command,
                callBack: cb
            });
        } catch (execError) {
            console.error(execError);
        }
    }

    async startSapereEE(cb: (error: ExecException, stdout: string, stderr: string) => void): Promise<void> {
        const command: string = path.join(__dirname, "lib/glassfish4/bin/asadmin") + " restart-domain --force=true";
        this.procWrapper.exec({ command, callBack: cb });
    }

    async stopSapereEE(cb: (error: ExecException, stdout: string, stderr: string) => void): Promise<void> {
        const command: string = path.join(__dirname, "lib/glassfish4/bin/asadmin") + "  stop-domain";
        this.procWrapper.exec({ command, callBack: cb });
    }

    async startIVY(cb: (error: ExecException, stdout: string, stderr: string) => void): Promise<void> {
        const command: string = `cd ${path.join(__dirname, "ext/IVY")} && java -Dlog4j.configuration=file:log4j.properties -jar lib/jpf-boot.jar -interactive`;
        console.log(command);
        this.procWrapper.exec({ command });
        // This delayed callback is a workaround to wait for IVY to start up.
        // We can remove this workaround as soon as the IVY tool implements a way to start IVY and return control to the caller.
        setTimeout(cb, 2000);
    }

    /**
     * Creates a function that updates the path of the parameter object such that it is relative to the specified basePath
     */
    toRelativePath(basePath: string): (d: serverUtils.FileDescriptor) => serverUtils.FileDescriptor {
        basePath = basePath || baseProjectDir;
        return (desc: serverUtils.FileDescriptor) => {
            if (desc?.path?.indexOf(basePath) === 0) {
                desc.path = desc.path.replace(basePath, "");
            }
            return desc;
        };
    }
    /**
     * utility function for check if a path is absolute
    */
    isAbsolute(fullPath: string): boolean {
        return path.isAbsolute(fullPath);
    }

    /**
     * Reads the contents of a directory.
     * @param {string} folderPath
     * @returns {Promise} a promise that resolves with a list of objects representing the files in the directory
     * each object contains {name: <String>, path: <String>, isDirectory: <boolean>}
     */
    async readDirectory(folderPath: string): Promise<serverUtils.FileDescriptor[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(folderPath, async (err: NodeJS.ErrnoException, files: string[]) => {
                if (!err) {
                    //get stat attributes for all the files using an async call
                    const promises: Promise<serverUtils.FileDescriptor>[] = files.map((name: string) => {
                        return new Promise((resolve, reject) => {
                            const fullPath: string = path.join(folderPath, name);
                            fs.stat(fullPath, (err: NodeJS.ErrnoException, res) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({
                                        created: res.birthtime,
                                        modified: res.mtime,
                                        size: res.size,
                                        name,
                                        path: fullPath,
                                        isDirectory: res.isDirectory()
                                    });
                                }
                            });
                        });
                    });

                    const res: serverUtils.FileDescriptor[] = await Promise.all(promises);
                    const result: serverUtils.FileDescriptor[] = res.map((d, i) => {
                        return {
                            name: d.name,
                            path: d.path,
                            isDirectory: d.isDirectory,
                            stats: d
                        };
                    });
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    unregisterFolderWatcher(folderPath: string): void {
        const watcher = this.fsWatchers[folderPath];
        if (watcher) {
            watcher.close();
            delete this.fsWatchers[folderPath];
            // console.debug("unregistered watcher for " + folderPath);
        }
    }

    unregisterFolderWatchers(): void {
        Object.keys(this.fsWatchers).forEach((path) => {
            this.unregisterFolderWatcher(path);
        });
        this.fsWatchers = {};
    }

    protected watch (folder: string, socket: WebSocket): fs.FSWatcher {
        const notificationDelay: number = 200;
        if (folder.indexOf("pvsbin") > -1) { return; }
        // console.debug("watching changes to .. " + folder);
        return fs.watch(folder, {persistent: false}, async (event: string, name: string) => {
            const extension: string = path.extname(name).toLowerCase();
            if (name && name !== ".DS_Store" && (event === "rename" || event === "change")) {
                const fullPath: string = path.join(folder, name);
                const token: FileSystemUpdateToken = {
                    socketId: -1,
                    type: "FileSystemUpdate",
                    name: name,
                    path: fullPath,
                    event: event,
                    time: { server: {} }
                };
                const exists: boolean = serverUtils.fileOrFolderExists(fullPath);
                if (exists) {
                    const res: fs.Stats = await serverUtils.stat(fullPath);
                    if (res.isDirectory()) {
                        await this.registerFolderWatcher(fullPath, socket);
                        token.isDirectory = true;
                    }
                    if (token.isDirectory || FileFilters.filesFilter?.indexOf(extension) > -1) {
                        setTimeout(() => {
                            if (token.isDirectory) {
                                serverUtils.getFolderTree(fullPath).then((data) => {
                                    token.subFiles = data.filter((f) => {
                                        return (!f.isDirectory) &&
                                            FileFilters.filesFilter?.indexOf(path.extname(f.path).toLowerCase()) > -1;
                                    }).map(this.toRelativePath(fullPath));
                                    token.subFolders = data.filter(function (f) {
                                        return f.isDirectory;
                                    }).map(this.toRelativePath(fullPath));
                                    this.processCallback(token, socket);
                                }).catch(function (err) {
                                    token.err = err;
                                    this.processCallback(token, socket);
                                });
                            } else {
                                this.processCallback(token, socket);
                            }
                        }, notificationDelay);
                    }
                } else {
                    token.event = "delete";
                    this.unregisterFolderWatcher(fullPath);
                    setTimeout(() => {
                        this.processCallback(token, socket);
                    }, notificationDelay);
                }
            }
        });
    };

    /**
     * Register a watcher for the specified folder. Sends updates to the client using the socket.
     * @param {string} folderPath
     * @param {socket} socket
     */
    async registerFolderWatcher(folderPath: string, socket: WebSocket): Promise<void> {
        // this initial check helps us to prevent the server from crashing
        // when the function is erroneously invoked with wrong arguments
        if (!folderPath || !socket) {
            console.log(`(FolderWatcher) Warning: incorrect folderPath or socket (folderPath: ${JSON.stringify(folderPath)}, socket: ${JSON.stringify(socket)})`);
            return;
        }

        this.unregisterFolderWatcher(folderPath);
        if (folderPath.indexOf("pvsbin") > -1) { return; }
        try {
            this.fsWatchers[folderPath] = this.watch(folderPath, socket);
            // watch the sub-directories too
            const data: serverUtils.FileDescriptor[] = await serverUtils.getFolderTree(folderPath);
            const subFolders = data?.filter(function (f) {
                return f.isDirectory;
            }) || [];
            // watch all subfolders
            for (let i = 0; i < subFolders.length; i++) {
                const subFolder: serverUtils.FileDescriptor = subFolders[i];
                if (subFolder) {
                    if (!this.fsWatchers[subFolder.path]) {
                        this.fsWatchers[subFolder.path] = this.watch(subFolder.path, socket);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async readFolderContent(folderPath: string, socket: WebSocket): Promise<FileSystemUpdateToken> {
        const res: FileSystemUpdateToken = {
            socketId: -1,
            type: "FileSystemUpdate",
            event: "refresh",
            name: path.dirname(folderPath),
            path: folderPath,
            isDirectory: true,
            time: { server: {} }
        };
        const data: serverUtils.FileDescriptor[] = await serverUtils.getFolderTree(folderPath);
        res.subFiles = data?.filter((f: serverUtils.FileDescriptor) => {
            return (!f.isDirectory) && FileFilters.filesFilter?.indexOf(path.extname(f.path).toLowerCase()) > -1;
        }).map(this.toRelativePath(folderPath));
        res.subFolders = data?.filter((f: serverUtils.FileDescriptor) => {
            return f.isDirectory;
        }).map(this.toRelativePath(folderPath));
        this.processCallback(res, socket);
        return res;
    }


    /**
     * get function maps for client sockets
     */
    protected createClientFunctionMaps(): void {
        const initProcessMap = (socketid: number) => {
            if (!this.pvsioProcessMap[socketid]) {
                this.pvsioProcessMap[socketid] = new PvsProcess();
            }
            // console.debug(socketid);
        };
        this.functionMaps = {
            "keepAlive": async (token: Token, socket: WebSocket, socketid: number) => {
                // do nothing
                // console.log("Receiving keepAlive message...");
            },
            "setMainFile": async (token: SetMainFileToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                const mainFile = token.path.split("/").slice(1).join("/");
                if (mainFile !== "") {
                    await this.changeProjectSetting(token.projectName, "mainPVSFile", mainFile);
                    this.processCallback(token, socket);
                } else {
                    token.err = {
                        message: `Invalid token ${JSON.stringify(token)}`,
                        code: "ENOENT",
                        path: token.path
                    };
                    this.processCallback(token, socket);
                }
            },
            "changeProjectSetting": async (token: ChangeProjectSettingsToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                if (token && token.key && token.value) {
                    await this.changeProjectSetting(token.projectName, token.key, token.value);
                    this.processCallback(token, socket);
                } else {
                    token.err = {
                        message: `Invalid token ${JSON.stringify(token)}`,
                        code: "ENOENT",
                        path: token.path
                    };
                    this.processCallback(token, socket);
                }
            },
            "listProjects": async (token: ListProjectsToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                const res: ListProjectsToken = {
                    type: token.type,
                    id: token.id,
                    socketId: socketid,
                    time: token.time,
                    projects: await serverUtils.listProjects()
                };
                this.processCallback(res, socket);
            },
            "openProject": async (token: OpenProjectToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                const res: OpenProjectToken = {
                    id: token.id,
                    type: token.type,
                    socketId: socketid,
                    time: token.time,
                    projectName: token.projectName,
                    projectDesc: await serverUtils.openProject(token.name)
                };
                this.unregisterFolderWatchers();
                await this.registerFolderWatcher(path.join(baseProjectDir, token.name), socket);
                this.processCallback(res, socket);
            },
            "typeCheck": async (token: TypecheckToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                const fname: string = path.join(baseProjectDir, token?.path);
                this.typeCheck(fname, (err: ExecException, stdout: string, stderr: string) => {
                    token.err = {
                        code: `${err?.code}`,
                        message: err?.message
                    };
                    token.stdout = stdout;
                    token.stderr = stderr;
                    this.processCallback(token, socket);
                });
            },
            "sendCommand": async (token: SendCommandToken, socket: WebSocket, socketid: number) => {
                // console.log("received command: ", token);
                initProcessMap(socketid);
                token.socketId = socketid;
                this.pvsioProcessMap[socketid]?.sendCommand(token.command, (data: { pvsioOut: string, jsonOut: string }) => {
                    // console.log("callback");
                    if (data) {
                        token.data = data?.pvsioOut ? [ data.pvsioOut ] : [];
                        token.json = data?.jsonOut;
                        token.err = (data?.pvsioOut && typeof data.pvsioOut === "string" && data.pvsioOut.indexOf("Expecting an expression") === 0) ?
                                        { message: data.pvsioOut, failedCommand: token?.command } : null
                        this.processCallback(token, socket);
                    }
                });
            },
            "ping": async (token: PingToken, socket: WebSocket, socketid: number) => {
                setTimeout(() => {
                    initProcessMap(socketid);
                    console.log("..sending pong response..");
                    const res: PongToken = {
                        id: token.id,
                        data: ["<pong>"],
                        socketId: socketid,
                        type: "pong",
                        time: token.time
                    };
                    this.processCallback(res, socket);
                }, 500);
            },
            "pong": async (token: PongToken, socket: WebSocket, socketid: number) => {
                setTimeout(() => {
                    initProcessMap(socketid);
                    console.log("..sending ping response..");
                    const res: PingToken = {
                        id: token.id,
                        data: ["<ping>"],
                        socketId: socketid,
                        type: "ping",
                        time: token.time
                    };
                    this.processCallback(res, socket);
                }, 500);
            },
            "startProcess": async (token: StartProcessToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                console.info("Calling start process for client... " + socketid);
                const root: string = token.data.projectName ?
                    path.join(baseProjectDir, token.data.projectName)
                        : token.data.demoName ? path.join(baseDemosDir, token.data.demoName) : "";
                // close the process if it exists and recreate it
                if (this.pvsioProcessMap[socketid]) {
                    this.pvsioProcessMap[socketid].close('SIGTERM', true);
                    delete this.pvsioProcessMap[socketid];
                }
                // recreate the pvsio process
                this.pvsioProcessMap[socketid] = new PvsProcess();
                // set the workspace dir and start the pvs process with a callback for processing process ready and exit
                // messages from the process
                this.pvsioProcessMap[socketid].workspaceDir(root).start(token.data.name, (args: CallbackArgs) => {
                    this.processCallback(token, socket);
                });
            },
            "closeProcess": async (token: CloseProcessToken, socket: WebSocket, socketid: number) => {
                //closes pvs process
                initProcessMap(socketid);
                token.socketId = socketid;
                if (this.pvsioProcessMap[socketid]) {
                    this.pvsioProcessMap[socketid].close();
                    delete this.pvsioProcessMap[socketid];
                    token.message = "process closed";
                } else {
                    token.err = {
                        message: "attempting to close undefined process"
                    };
                }
                this.unregisterFolderWatchers();
                this.processCallback(token, socket);
            },
            "readFile": async (token: ReadFileToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                let encoding = token.encoding || "utf8";
                if (path.isAbsolute(token.path)) {
                    // remove all ../ to avoid writing in arbitrary parts of the file system
                    token.path = token.path.replace(/\.\./g, "");
                    token.path = path.join(baseExamplesDir, token.path);
                } else {
                    token.path = path.join(baseProjectDir, token.path);
                }
                console.log("reading file " + token.path);
                token.content = await serverUtils.readFile(token.path, encoding);
                this.processCallback(token, socket);
            },
            "writeFile": async (token: WriteFileToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                if (path.isAbsolute(token.path)) {
                    // remove all ../ to avoid writing in arbitrary parts of the file system
                    token.path = token.path.replace(/\.\./g, "");
                    token.path = path.join(baseExamplesDir, token.path);
                } else {
                    token.path = path.join(baseProjectDir, token.path);
                }
                console.log("writing file " + token.path);
                const desc: serverUtils.FileDescriptor = await serverUtils.writeFile(token.path, token.content, token.encoding, token.opt);
                if (!desc || desc.err) {
                    token.err = (desc) ? desc.err : { message: `Unhandled error code` };
                }
                this.processCallback(token, socket);
            },
            "deleteFile": async (token: DeleteFileToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                token.path = path.join(baseProjectDir, token.path);
                try {
                    this.pvsioProcessMap[socketid].removeFile(token.path, (error: ExecException | null, stdout?: string, stderr?: string) => {
                        if (error) {
                            token.err = {
                                path: token.path,
                                message: error.message,
                                code: `${error.code}`
                            };
                        }
                        this.processCallback(token, socket);
                    });
                } catch (err) {
                    token.err = err;
                    this.processCallback(token, socket);
                }
            },
            "renameFile": async (token: RenameFileToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                const fileExists: boolean = serverUtils.fileExists(token.newPath);
                const success: boolean = (fileExists) ? false : await serverUtils.renameFile(token.oldPath, token.newPath);
                if (!success) {
                    let message: string = "Error while renaming " + token.oldPath + " into " + token.newPath;
                    if (fileExists) { message += " (file already exists)"; }
                    console.warn(message);
                    token.err = {
                        path: token.oldPath,
                        message
                    }
                }
                this.processCallback(token, socket);
            },
            "fileExists": async (token: FileExistsToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                const fname: string = path.join(baseProjectDir, token.path);
                token.exists = serverUtils.fileExists(fname);
                this.processCallback(token, socket);
            },
            "readDirectory": async (token: ReadDirectoryToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                const fname: string = token.path.indexOf("~") === 0 ? path.join(process.env.HOME, token.path.substr(1))
                    : path.isAbsolute(token.path) ? token.path : path.join(baseProjectDir, token.path);
                console.log("\n>> Reading folder " + fname);
                token.files = await this.readDirectory(fname);
                this.processCallback(token, socket);
            },
            "readExamplesFolder": async (token: ReadExamplesFolderToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                console.log("\n>> Reading examples folder " + baseExamplesDir);
                token.socketId = socketid;
                token.path = baseExamplesDir;
                token.files = await this.readDirectory(baseExamplesDir);
                this.processCallback(token, socket);
            },
            "writeDirectory": async (token: WriteDirectoryToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                if (token.path) {
                    const folder: string = path.join(baseProjectDir, token.path);
                    console.log(`[pvsioweb-server] Creating folder ${folder}`);
                    let exists: boolean = serverUtils.fileOrFolderExists(folder);
                    if (!exists) {
                        exists = await serverUtils.mkdirRecursive(folder);
                    }
                    if (exists) {
                        // directory exists: refresh content and send message EEXIST to client
                        // Note: we refresh the content because this is an existing folder
                        // that is visible to the client (the client might not have info about it)
                        await serverUtils.stat(folder);
                        this.unregisterFolderWatcher(folder);
                        await this.readFolderContent(folder, socket);
                        await this.registerFolderWatcher(folder, socket);
                    } else {
                        token.err = {
                            path: token.path,
                            message: "Directory Exists",
                            code: "EEXIST"
                        };
                    }
                } else {
                    token.err = {
                        path: token.path,
                        message: "Write directory error: property 'path' is undefined.",
                        code: "ENOENT"
                    };
                }
                this.processCallback(token, socket);
            },
            "deleteDirectory": async (token: DeleteDirectoryToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                try {
                    const folder: string = path.join(baseProjectDir, token.path);
                    this.pvsioProcessMap[socketid].removeFile(folder, (error: ExecException) => {
                        if (error) {
                            token.err = {
                                code: `${error.code}`,
                                message: error.message,
                                path: token.path
                            };
                        }
                    });
                } catch (err) {
                    token.err = err;
                } finally {
                    this.processCallback(token, socket);
                }
            },
            "renameProject": async (token: RenameProjectToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                const oldProjectPath: string = path.join(baseProjectDir, token.oldPath);
                const newProjectPath: string = path.join(baseProjectDir, token.newPath);
                this.unregisterFolderWatcher(oldProjectPath);
                let success: boolean = !serverUtils.fileOrFolderExists(newProjectPath);
                if (success) {
                    success = await serverUtils.renameFile(token.oldPath, token.newPath);
                }
                if (success) {
                    this.unregisterFolderWatcher(oldProjectPath);
                    await this.registerFolderWatcher(newProjectPath, socket);
                } else {
                    const message: string = "Error while renaming " + token.oldPath + " into " + token.newPath;
                    console.warn(message);
                    token.err = {
                        path: token.oldPath,
                        message
                    };
                }
                this.processCallback(token, socket);
            },
            "ctrl": async (token: CtrlToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                console.log(token);
                this.broadcast(token);
                // try {
                //     let opts = {
                //         argv: token.data.argv,
                //         basePath: token.data.basePath
                //     };
                //     java(token.data.javaFile, opts, function (err, stdout, stderr) {
                //         res.stdout = stdout;
                //         res.stderr = stderr;
                //         console.log("java err:" + err);
                //         console.log("java stderr:" + stderr);
                //         console.log("java stdout:" + stdout);
                //         processCallback(res, socket);
                //     });
                // } catch (err) {
                //     res.type = token.type + "_error";
                //     res.err = err.message;
                //     processCallback(res, socket);
                // }
            },
            "java": async (token: JavaToken, socket: WebSocket, socketid: number) => {
                // console.log(token);
                initProcessMap(socketid);
                token.socketId = socketid;
                try {
                    const opts: { argv: string[], basePath: string } = {
                        argv: token.data.argv,
                        basePath: token.data.basePath
                    };
                    this.java(token.data.javaFile, opts, (error: ExecException, stdout: string, stderr: string) => {
                        token.stdout = stdout;
                        token.stderr = stderr;
                        console.log("java err:" + error);
                        console.log("java stderr:" + stderr);
                        console.log("java stdout:" + stdout);
                        this.processCallback(token, socket);
                    });
                } catch (err) {
                    token.err = err;
                    this.processCallback(token, socket);
                }
            },
            "startSapereEE": async (token: StartSapereEEToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                try {
                    this.startSapereEE((error: ExecException, stdout: string, stderr: string) => {
                        token.stdout = stdout;
                        token.stderr = stderr;
                        console.log("glassfish err:" + error);
                        console.log("glassfish stderr:" + stderr);
                        console.log("glassfish stdout:" + stdout);
                        this.processCallback(token, socket);
                    });
                } catch (err) {
                    if (err.code === 1 && err.killed === false) {
                        // glassfish is already running, it's not an error
                        token.stdout = "PVSio-web Network Controller already started.";
                    } else {
                        token.err = err;
                    }
                    this.processCallback(token, socket);
                }
            },
            "startIVY": async (token: StartIVYToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                try {
                    this.startIVY((error: ExecException, stdout: string, stderr: string) => {
                        token.stdout = stdout;
                        token.stderr = stderr;
                        console.log("IVY err:" + error);
                        console.log("IVY stderr:" + stderr);
                        console.log("IVY stdout:" + stdout);
                        this.processCallback(token, socket);
                    });
                } catch (err) {
                    token.err = err.message;
                    this.processCallback(token, socket);
                }
            },
            "stopSapereEE": async (token: StopSapereEEToken, socket: WebSocket, socketid: number) => {
                initProcessMap(socketid);
                token.socketId = socketid;
                try {
                    this.stopSapereEE((error: ExecException, stdout: string, stderr: string) => {
                        if (error) {
                            token.err = {
                                message: error.message,
                                code: `${error.code}`
                            };
                        }
                        this.processCallback(token, socket);
                    });
                } catch (err) {
                    token.err = err;
                    this.processCallback(token, socket);
                }
            }
        };
    }
}

// create the server
const server: PvsiowebServer = new PvsiowebServer();
server.activate();