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
import express = require('express');
import * as http from 'http';
import * as FileFilters from './FileFilters';
import * as serverUtils from './ServerUtils';
import { exec, ExecException } from 'child_process';
import { PvsioResponse, PvsProxy } from './PVSioProxy';
import WebSocket = require ('ws');
import { AddressInfo } from 'net';
import * as Connection from '../client/env/Connection';

const clientDir: string = path.join(__dirname, "../client");
const examplesDir: string = path.join(__dirname, "../examples");
const projectsDir: string = path.join(examplesDir, "projects");
const demosDir: string = path.join(examplesDir, "demos");
const tutorialsDir: string = path.join(examplesDir, "tutorials");
const bundleDir: string = path.join(__dirname, "../../bundle");

const helpMsg: string = `
    Usage: node PVSioWebServer.js [options]
    Options:
      -pvs <path>          (Specifies location of pvs executables)
      -port <port number>  (Specifies the server port where clients connect)
`;
  
class PvsiowebServer {
    protected port: number = +process.env.PORT || 8082;
    protected pvsPath: string = process.env.pvsdir || "";
    protected pvsioProcessMap: { [key: string]: PvsProxy } = {}; //each client should get its own process
    protected httpServer: http.Server;
    protected wsServer: ws.Server;
    protected clientid: number = 0;
    protected fsWatchers: { [folder: string]: fs.FSWatcher } = {};
    protected socketRegistry = {};
    protected functionMaps: Map<Connection.RequestType, (token: Connection.Token, socket: WebSocket, socketid: number) => Promise<void>> = new Map();

    constructor () {
        // create pvs process wrapper
        this.createClientFunctionMaps();
    }

    getAddress (): string {
        const addressInfo: AddressInfo | string = this.httpServer.address();
        const address: string = (addressInfo) ? 
            (typeof addressInfo === "string") ? addressInfo : `${addressInfo.address}:${addressInfo.port}`
            : `http://localhost:${this.port}`;
        return address;
    }

    testConfiguration (): boolean {
        // test if the pvs executable are actually there
        const pvsio: string = path.join(this.pvsPath, "pvsio");
        const success: boolean = serverUtils.fileExists(pvsio);
        if (success) {
            console.log(`[pvsioweb-server] PVSio executable found at ${pvsio}`);
            return true;
        }
        const msg: string = `
================================================================
================================================================
====   Warning: Failed to locate PVS executables            ====
================================================================
====   Please indicate the correct path to the PVS folder   ====
====   when launching the server, using the -pvs option     ====
====   Alternatively place the PVS executable files on      ====
====   your PATH (see README.md for installation details).  ====
================================================================
================================================================

`;
        console.warn(msg);
        return false;
    }

    protected parseCliArgs (args: string[]): void {
        if (args) {
            for (let i = 0; i < args.length; i++) {
                const elem: string = args[i].toLocaleLowerCase();
                switch (elem) {
                    case "-pvs": {
                        if ((i + 1) < args.length && !args[i + 1].startsWith("-")) {
                            i++;
                            this.pvsPath = args[i];
                            console.log("[pvsioweb-server] PVS path: ", this.pvsPath);
                        }
                        break;
                    }
                    case "-port": {
                        if ((i + 1) < args.length && !isNaN(+args[i + 1])) {
                            i++;
                            this.port = +args[i];
                            console.info(`[pvsioweb-server] Server port: ${this.port}`)
                        } else {
                            console.warn("Warning: port number not provided, using default port " + this.port);
                        }
                    }
                    case "-help": {
                        console.log(helpMsg);
                        process.exit(1);
                    }
                    default: {
                        console.warn("[daa-server] Warning: unrecognized option ", args[i]);
                    }
                }
            }
        }
    }

    activate () {
        // parse command line arguments, if any
        const args: string[] = process.argv.slice(2);
        console.log("args: ", args);
        this.parseCliArgs(args);

        // test the configuration -- this will print warnings if, e.g., pvs is not installed
        this.testConfiguration();

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
        // create the express static server serve contents in the client directory and the demos directory
        webserver.use(express.static(clientDir));
        webserver.use("/demos", express.static(demosDir));
        // console.log(`[pvsioweb-server] Serving ${demosDir}`);
        webserver.use("/tutorials", express.static(tutorialsDir));
        // console.log(`[pvsioweb-server] Serving ${tutorialsDir}`);
        webserver.use("/projects", express.static(projectsDir));
        // console.log(`[pvsioweb-server] Serving ${projectsDir}`);
        // create a pathname prefix for client so that demo css and scripts can be loaded from the client dir
        webserver.use("/client", express.static(clientDir));

        // routing necessary for backbone
        webserver.use(/(\/demos\/[^\/]+)?\/backbone\.js/, express.static(path.join(clientDir, `node_modules/backbone/backbone.js`)));
        webserver.use(/(\/demos\/[^\/]+)?\/underscore\.js/, express.static(path.join(clientDir, `node_modules/underscore/underscore-min.js`)));
        webserver.use(/(\/demos\/[^\/]+)?\/jquery\.js/, express.static(path.join(clientDir, `node_modules/jquery/dist/jquery.min.js`)));

        webserver.use(/(\/demos\/[^\/]+)?\/builder\.min\.js/, express.static(path.join(bundleDir, `client/builder.min.js`)));
        webserver.use(/(\/demos\/[^\/]+)?\/pvsioweb\.min\.js/, express.static(path.join(bundleDir, `client/pvsioweb.min.js`)));
        webserver.use(/(\/demos\/[^\/]+)?\/widgetLibDials\.min\.js/, express.static(path.join(bundleDir, `client/widgetLibDials.min.js`)));

        this.wsServer = new ws.Server({ server: this.httpServer });
        this.wsServer.on("connection", (socket: WebSocket) => {
            const socketid: number =  this.clientid++;
            this.socketRegistry[socketid] = socket;
            
            console.info("opening websocket client " + socketid);
            socket.on("message", async (m: string) => {
                try {
                    const token: Connection.Token = JSON.parse(m);
                    console.log(`[pvsioweb-server] Request`, m);
                    token.time = token.time || {};
                    token.time.server = { received: new Date().getTime() };
                    // const type: string = token?.type.split(" ")[0];
                    const f: (token: Connection.Token, socket: WebSocket, socketid: number) => Promise<void> = this.functionMaps.get(token.type);
                    if (f && typeof f === 'function') {
                        console.log(`[pvsioweb-server] received request '${token.type}' from client...`);
                        console.dir(token);        
                        // call the function with token and socket as parameter
                        try {
                            await f(token, socket, socketid);
                        } catch (eval_error) {
                            const cmd: string = token?.data?.command || JSON.stringify(token);
                            console.error("[pvsioweb-server] unable to evaluate command " + cmd + " in PVSio (" + eval_error + ")");
                            token.err = eval_error;
                            this.processCallback(token, socket);
                        }
                    } else {
                        console.warn(`[pvsioweb-server] Warning: message type ${token.type} has no handler`);
                    }
                } catch (error) {
                    console.error(error.message);
                    console.error(m);
                    console.error("[pvsioweb-server] Error while parsing token " + JSON.stringify(m).replace(/\\/g,""));
                    const res: Connection.ErrorToken = {
                        type: "error",
                        err: error,
                        time: { server: { sent: new Date().getTime() } },
                        socketId: socketid
                    };
                    this.processCallback(res, socket);
                }
            });
    
            socket.on("close", () => {
                console.info("[pvsioweb-server] Closing websocket client " + socketid);
                const p: PvsProxy = this.pvsioProcessMap[socketid];
                p?.close();
                delete this.pvsioProcessMap[socketid];
            });
    
            socket.on("error", (err: NodeJS.ErrnoException) => {
                console.error("[pvsioweb-server] Abrupt websocket close operation from client " + socketid);
                console.error(err);
                const p: PvsProxy = this.pvsioProcessMap[socketid];
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

        console.log("----------------------------------------------");
        console.log(`Starting up PVSio-web server on ${this.getAddress()}...`);
        this.httpServer.listen(this.port, () => {
            console.log("PVSio-web server ready!");
            console.log("----------------------------------------------");
        });
    }

    /**
     * Utility function that dispatches responses to websocket clients
     * @param {{type:string, data}} token The token to send to the client
     * @param {Socket} socket The websocket to use to send the token
     */
    protected processCallback(token: Connection.Token, socket: WebSocket): void {
        try {
            //called when any data is recieved from pvs process
            //if the type of the token is 'processExited' then send message to client if the socket is still open
            token.time = token.time || { };
            token.time.server = { sent: new Date().getTime() };

            //always send relative directories to the client
            if (token.name && token.name.indexOf(projectsDir) === 0) {
                token.name = token.name.replace(projectsDir, "");
            }
            if (token.path && token.path.indexOf(projectsDir) === 0) {
                token.path = token.path.replace(projectsDir, "");
            }
            if (token.files) {
                token.files.forEach((file: serverUtils.NodeJSFileDescriptor) => {
                    if (file && file.path && file.path.indexOf(projectsDir) === 0) {
                        file.path = file.path.replace(projectsDir, "");
                    }
                });
            }
            if (token.err) {
                if (token.err.path) {
                    token.err.path = token.err.path.replace(new RegExp(projectsDir, "g"), "");
                }
                if (token.err.message) {
                    token.err.message = token.err.message.replace(new RegExp(projectsDir, "g"), "");
                }
            }
            if (socket && socket.readyState === 1) {
                console.log("[pvsioweb-server] sending data back to client...");
                console.dir({ type: token.type, data: token.data }, { depth: null });
                socket.send(JSON.stringify(token));
                console.log("[pvsioweb-server] data sent!\n");
            }
        } catch (processCallbackError) {
            console.error("[pvsioweb-server] Error: process callback triggered an exception " + JSON.stringify(processCallbackError));
        }
    }
    protected broadcast(token: Connection.Token): void {
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
            const file: string = path.join(projectsDir, projectName, "/pvsioweb.json");
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
        console.log("[pvsioweb-server] typechecking file " + file + " ...");
        if (process.env.PORT) { // this is for the PVSio-web version installed on the heroku cloud
            const cmd: string = `/app/PVS/proveit -T -l -v ${file}`;
            console.log(cmd);
            exec(cmd, cb);
        } 
        // else if (process.env.pvsdir) {
        //     const cmd: string = `${path.join(process.env.pvsdir, "proveit")} -T -l -v ${file}`;
        //     console.log(cmd);
        //     exec(cmd, cb);
        // } 
        else {
            const cmd: string = `${path.join(this.pvsPath, "proveit")} -T -l -v ${file}`;
            console.log(cmd);
            exec(cmd, cb);
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
            const basePath: string = (options.basePath && path.isAbsolute(options.basePath)) ? options.basePath : path.join(examplesDir, options.basePath);
            const argv: string[] = options.argv || [];
            const javaOptions: string[] = options.javaOptions || [];
            // console.log(javaFile, argv, basePath);
            const command = `cd ${basePath} && java ${javaOptions.join(" ")} ${javaFile} ${argv.join(" ")}`;
            console.log("Executing command: ", command);
            exec(command, cb);
        } catch (execError) {
            console.error(execError);
        }
    }

    async startSapereEE(cb: (error: ExecException, stdout: string, stderr: string) => void): Promise<void> {
        const command: string = path.join(__dirname, "lib/glassfish4/bin/asadmin") + " restart-domain --force=true";
        exec(command, cb);
    }

    async stopSapereEE(cb: (error: ExecException, stdout: string, stderr: string) => void): Promise<void> {
        const command: string = path.join(__dirname, "lib/glassfish4/bin/asadmin") + "  stop-domain";
        exec(command, cb);
    }

    async startIVY(cb: (error: ExecException, stdout: string, stderr: string) => void): Promise<void> {
        const command: string = `cd ${path.join(__dirname, "ext/IVY")} && java -Dlog4j.configuration=file:log4j.properties -jar lib/jpf-boot.jar -interactive`;
        console.log(command);
        exec(command);
        // This delayed callback is a workaround to wait for IVY to start up.
        // We can remove this workaround as soon as the IVY tool implements a way to start IVY and return control to the caller.
        setTimeout(cb, 2000);
    }

    /**
     * Creates a function that updates the path of the parameter object such that it is relative to the specified basePath
     */
    toRelativePath(basePath: string): (d: serverUtils.NodeJSFileDescriptor) => serverUtils.NodeJSFileDescriptor {
        basePath = basePath || projectsDir;
        return (desc: serverUtils.NodeJSFileDescriptor) => {
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
    async readDirectory(folderPath: string): Promise<serverUtils.NodeJSFileDescriptor[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(folderPath, async (err: NodeJS.ErrnoException, files: string[]) => {
                if (!err) {
                    //get stat attributes for all the files using an async call
                    const promises: Promise<serverUtils.NodeJSFileDescriptor>[] = files.map((name: string) => {
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

                    const res: serverUtils.NodeJSFileDescriptor[] = await Promise.all(promises);
                    const result: serverUtils.NodeJSFileDescriptor[] = res.map((d, i) => {
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
                const token: Connection.FileSystemUpdateToken = {
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
            const data: serverUtils.NodeJSFileDescriptor[] = await serverUtils.getFolderTree(folderPath);
            const subFolders = data?.filter(function (f) {
                return f.isDirectory;
            }) || [];
            // watch all subfolders
            for (let i = 0; i < subFolders.length; i++) {
                const subFolder: serverUtils.NodeJSFileDescriptor = subFolders[i];
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

    async readFolderContent(folderPath: string, socket: WebSocket): Promise<Connection.FileSystemUpdateToken> {
        const res: Connection.FileSystemUpdateToken = {
            socketId: -1,
            type: "FileSystemUpdate",
            event: "refresh",
            name: path.dirname(folderPath),
            path: folderPath,
            isDirectory: true,
            time: { server: {} }
        };
        const data: serverUtils.NodeJSFileDescriptor[] = await serverUtils.getFolderTree(folderPath);
        res.subFiles = data?.filter((f: serverUtils.NodeJSFileDescriptor) => {
            return (!f.isDirectory) && FileFilters.filesFilter?.indexOf(path.extname(f.path).toLowerCase()) > -1;
        }).map(this.toRelativePath(folderPath));
        res.subFolders = data?.filter((f: serverUtils.NodeJSFileDescriptor) => {
            return f.isDirectory;
        }).map(this.toRelativePath(folderPath));
        this.processCallback(res, socket);
        return res;
    }

    protected initProcessMap (socketid: number): void {
        if (!this.pvsioProcessMap[socketid]) {
            this.pvsioProcessMap[socketid] = new PvsProxy({ pvsPath: this.pvsPath });
        }
        // console.debug(socketid);
    };

    /**
     * Handlers for client requests
     */
    protected async activateServerHandler (token: Connection.StartServerToken, socket: WebSocket, socketid: number): Promise<void> {
        console.log(`[pvsioweb-server] Activating server...`);
        this.initProcessMap(socketid);
        token.socketId = socketid;
        token.data = path.normalize(path.join(__dirname, "../client"));
        console.log(`[pvsioweb-server] Client folder is ${token.data}`);
        this.processCallback(token, socket);
    }
    protected async setMainFileHandler (token: Connection.SetMainFileToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        const mainFile = token.path.split("/").slice(1).join("/");
        if (mainFile !== "") {
            await this.changeProjectSetting(token.name, "mainPVSFile", mainFile);
            this.processCallback(token, socket);
        } else {
            token.err = {
                message: `Invalid token ${JSON.stringify(token)}`,
                code: "ENOENT",
                path: token.path
            };
            this.processCallback(token, socket);
        }
    }
    protected async changeProjectSettingsHandler (token: Connection.ChangeProjectSettingsToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        if (token && token.key && token.value) {
            await this.changeProjectSetting(token.name, token.key, token.value);
            this.processCallback(token, socket);
        } else {
            token.err = {
                message: `Invalid token ${JSON.stringify(token)}`,
                code: "ENOENT",
                path: token.path
            };
            this.processCallback(token, socket);
        }
    }
    protected async listProjectsHandler (token: Connection.ListProjectsToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        const projects: serverUtils.ProjectDescriptor[] = await serverUtils.listProjects();
        const res: Connection.ListProjectsToken = {
            type: token.type,
            id: token.id,
            socketId: socketid,
            time: token.time,
            projects
        };
        // console.log("[pvsiowebServer] listProjects", projects);
        this.processCallback(res, socket);
    }
    protected async openProjectHandler (token: Connection.OpenProjectToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        const res: Connection.OpenProjectToken = {
            id: token.id,
            type: token.type,
            socketId: socketid,
            time: token.time,
            name: token.name,
            project: await serverUtils.openProject(token.name)
        };
        this.unregisterFolderWatchers();
        await this.registerFolderWatcher(path.join(projectsDir, token.name), socket);
        this.processCallback(res, socket);
    }
    protected async typecheckFileHandler (token: Connection.TypecheckToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        const fname: string = path.join(projectsDir, token?.path);
        this.typeCheck(fname, (err: ExecException, stdout: string, stderr: string) => {
            token.err = {
                code: `${err?.code}`,
                message: err?.message
            };
            token.stdout = stdout;
            token.stderr = stderr;
            this.processCallback(token, socket);
        });
    }
    /**
     * Sends the PVS command specified in the token to the PVSio process
     * @param token 
     * @param socket 
     * @param socketid 
     */
    protected async sendCommandHandler (token: Connection.SendCommandToken, socket: WebSocket, socketid: number): Promise<void> {
        // console.log("received command: ", token);
        this.initProcessMap(socketid);
        token.socketId = socketid;
        
        const res: PvsioResponse = await this.pvsioProcessMap[socketid]?.sendCommand(token.command, { useLastState: true });
        if (res) {
            let extras: {} = {};
            if (res?.jsonOut) {
                try {
                    extras = JSON.parse(res?.jsonOut);
                } catch (err) {
                    console.warn(`[pvsioweb-server] Warning: unable to parse jsonOut`, res.jsonOut);
                }
            }
            token.data = { ...res?.state, ...extras };
            token.raw = res?.pvsioOut;
            token.err = res?.error ? { message: res.error, failedCommand: token?.command } : null;
            this.processCallback(token, socket);
        }
    }
    protected async pingHandler (token: Connection.PingToken, socket: WebSocket, socketid: number): Promise<void> {
        setTimeout(() => {
            this.initProcessMap(socketid);
            console.log("..sending pong response..");
            const res: Connection.PongToken = {
                id: token.id,
                data: ["<pong>"],
                socketId: socketid,
                type: "<pong>",
                time: token.time
            };
            this.processCallback(res, socket);
        }, 500);
    }
    protected async pongHandler (token: Connection.PongToken, socket: WebSocket, socketid: number): Promise<void> {
        setTimeout(() => {
            this.initProcessMap(socketid);
            console.log("..sending ping response..");
            const res: Connection.PingToken = {
                id: token.id,
                data: ["<ping>"],
                socketId: socketid,
                type: "<ping>",
                time: token.time
            };
            this.processCallback(res, socket);
        }, 500);
    }
    protected async startPvsProcessHandler (token: Connection.StartProcessToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        if (token?.data?.fileName && token?.data?.contextFolder && token?.data?.fileExtension) {
            console.info("Starting PVSio process for client... " + socketid);
            const root: string = path.join(examplesDir, token?.data?.contextFolder);
            // close the process if it exists and recreate it
            if (this.pvsioProcessMap[socketid]) {
                this.pvsioProcessMap[socketid].close();
                delete this.pvsioProcessMap[socketid];
            }
            // recreate the pvsio process
            this.pvsioProcessMap[socketid] = new PvsProxy();
            // set the workspace dir and start the pvs process with a callback for processing process ready and exit
            // messages from the process
            const res: boolean = await this.pvsioProcessMap[socketid].start({ contextFolder: root, fileName: token.data.fileName, fileExtension: ".pvs" });
            console.log(`[pvsioweb-server] PVSio process started`);
        } else {
            console.warn(`[pvsioweb-server] Warning: token does not specify required fields contextFolder, fileName, fileExtension`, token);
        }
        this.processCallback(token, socket);
    }
    protected async stopPvsProcessHandler (token: Connection.StopProcessToken, socket: WebSocket, socketid: number): Promise<void> {
        //closes pvs process
        this.initProcessMap(socketid);
        token.socketId = socketid;
        if (this.pvsioProcessMap[socketid]) {
            this.pvsioProcessMap[socketid].close();
            delete this.pvsioProcessMap[socketid];
            token.message = "process closed";
        } else {
            token.err = {
                message: "process already closed"
            };
        }
        this.unregisterFolderWatchers();
        this.processCallback(token, socket);
    }
    protected async readFileHandler (token: Connection.ReadFileToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        let encoding = token.encoding || "utf8";
        if (path.isAbsolute(token.path)) {
            // remove all ../ to avoid writing in arbitrary parts of the file system
            token.path = token.path.replace(/\.\./g, "");
        } else {
            token.path = path.join(projectsDir, token.path);
        }
        console.log("reading file " + token.path);
        token.content = await serverUtils.readFile(token.path, encoding);
        this.processCallback(token, socket);
    }
    protected async writeFileHandler (token: Connection.WriteFileToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        if (path.isAbsolute(token.path)) {
            // remove all ../ to avoid writing in arbitrary parts of the file system
            token.path = token.path.replace(/\.\./g, "");
            token.path = path.join(examplesDir, token.path);
        } else {
            token.path = path.join(projectsDir, token.path);
        }
        console.log("writing file " + token.path);
        const desc: serverUtils.NodeJSFileDescriptor = await serverUtils.writeFile(token.path, token.content, token.encoding, token.opt);
        if (!desc || desc.err) {
            token.err = (desc) ? desc.err : { message: `Unhandled error code` };
        }
        this.processCallback(token, socket);
    }
    protected async deleteFileHandler (token: Connection.DeleteFileToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        token.path = path.join(projectsDir, token.path);
        try {
            const contextFolder: string = this.pvsioProcessMap[socketid].getContextFolder();
            serverUtils.removeFile(token.path, { contextFolder });
            this.processCallback(token, socket);
        } catch (err) {
            token.err = err;
            this.processCallback(token, socket);
        }
    }
    protected async renameFileHandler (token: Connection.RenameFileToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
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
    }
    protected async fileExistsHandler (token: Connection.FileExistsToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        const fname: string = path.join(projectsDir, token.path);
        token.exists = serverUtils.fileExists(fname);
        this.processCallback(token, socket);
    }
    protected async readFolderHandler (token: Connection.ReadFolderToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        const fname: string = token.path.indexOf("~") === 0 ? path.join(process.env.HOME, token.path.substr(1))
            : path.isAbsolute(token.path) ? token.path : path.join(projectsDir, token.path);
        console.log("\n>> Reading folder " + fname);
        token.files = await this.readDirectory(fname);
        this.processCallback(token, socket);
    }
    protected async readExampleFolderHandler (token: Connection.ReadExamplesFolderToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        console.log("\n>> Reading examples folder " + examplesDir);
        token.socketId = socketid;
        token.path = examplesDir;
        token.files = await this.readDirectory(examplesDir);
        this.processCallback(token, socket);
    }
    protected async writeFolderHandler (token: Connection.WriteFolderToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        if (token.path) {
            const folder: string = path.join(projectsDir, token.path);
            // console.log(`[pvsiowebServer] Creating folder ${folder}`);
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
    }
    protected async deleteFolderHandler (token: Connection.DeleteFolderToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        try {
            const folder: string = path.join(projectsDir, token.path);
            serverUtils.removeFile(folder);
        } catch (err) {
            token.err = err;
        } finally {
            this.processCallback(token, socket);
        }
    }
    protected async renameProjectHandler (token: Connection.RenameProjectToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
        token.socketId = socketid;
        const oldProjectPath: string = path.join(projectsDir, token.oldPath);
        const newProjectPath: string = path.join(projectsDir, token.newPath);
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
    }
    protected async controlHandler (token: Connection.CtrlToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
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
    }
    protected async execJavaHandler (token: Connection.JavaToken, socket: WebSocket, socketid: number): Promise<void> {
        // console.log(token);
        this.initProcessMap(socketid);
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
    }
    protected async startSapereHandler (token: Connection.StartSapereEEToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
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
    }
    protected async startIvyHandler (token: Connection.StartIVYToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
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
    }
    protected async stopSapereHandler (token: Connection.StopSapereEEToken, socket: WebSocket, socketid: number): Promise<void> {
        this.initProcessMap(socketid);
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
    /**
     * Utility function, creates the hashmap with the functions for handling client requests
     */
    protected createClientFunctionMaps(): void {
        this.functionMaps.set("activate-server", async (token: Connection.StartServerToken, socket: WebSocket, socketid: number) => {
            await this.activateServerHandler(token, socket, socketid);
        });
        this.functionMaps.set("keepAlive", async (token: Connection.Token, socket: WebSocket, socketid: number) => {
                // do nothing
                // console.log("Receiving keepAlive message...");
        });
        this.functionMaps.set("setMainFile", async (token: Connection.SetMainFileToken, socket: WebSocket, socketid: number) => {
            await this.setMainFileHandler(token, socket, socketid);
        });
        this.functionMaps.set("changeProjectSettings", async (token: Connection.ChangeProjectSettingsToken, socket: WebSocket, socketid: number) => {
            await this.changeProjectSettingsHandler(token, socket, socketid);
        });
        this.functionMaps.set("listProjects", async (token: Connection.ListProjectsToken, socket: WebSocket, socketid: number) => {
            await this.listProjectsHandler(token, socket, socketid);
        });
        this.functionMaps.set("openProject", async (token: Connection.OpenProjectToken, socket: WebSocket, socketid: number) => {
            await this.openProjectHandler(token, socket, socketid);
        });
        this.functionMaps.set("typeCheck", async (token: Connection.TypecheckToken, socket: WebSocket, socketid: number) => {
            this.typecheckFileHandler(token, socket, socketid);
        });
        this.functionMaps.set("sendCommand", async (token: Connection.SendCommandToken, socket: WebSocket, socketid: number) => {
            await this.sendCommandHandler(token, socket, socketid);
        });
        this.functionMaps.set("<ping>", async (token: Connection.PingToken, socket: WebSocket, socketid: number) => {
            await this.pingHandler(token, socket, socketid);
        });
        this.functionMaps.set("<pong>", async (token: Connection.PongToken, socket: WebSocket, socketid: number) => {
            await this.pongHandler(token, socket, socketid);
        });
        this.functionMaps.set("startProcess", async (token: Connection.StartProcessToken, socket: WebSocket, socketid: number) => {
            await this.startPvsProcessHandler(token, socket, socketid);
        });
        this.functionMaps.set("stopProcess", async (token: Connection.StopProcessToken, socket: WebSocket, socketid: number) => {
            await this.stopPvsProcessHandler(token, socket, socketid);
        });
        this.functionMaps.set("readFile", async (token: Connection.ReadFileToken, socket: WebSocket, socketid: number) => {
            await this.readFileHandler(token, socket, socketid);
        });
        this.functionMaps.set("writeFile", async (token: Connection.WriteFileToken, socket: WebSocket, socketid: number) => {
            await this.writeFileHandler(token, socket, socketid);
        });
        this.functionMaps.set("deleteFile", async (token: Connection.DeleteFileToken, socket: WebSocket, socketid: number) => {
            await this.deleteFileHandler(token, socket, socketid);
        });
        this.functionMaps.set("renameFile", async (token: Connection.RenameFileToken, socket: WebSocket, socketid: number) => {
            await this.renameFileHandler(token, socket, socketid);
        });
        this.functionMaps.set("fileExists", async (token: Connection.FileExistsToken, socket: WebSocket, socketid: number) => {
            await this.fileExistsHandler(token, socket, socketid);
        });
        this.functionMaps.set("readFolder", async (token: Connection.ReadFolderToken, socket: WebSocket, socketid: number) => {
            await this.readFolderHandler(token, socket, socketid);
        });
        this.functionMaps.set("readExamplesFolder", async (token: Connection.ReadExamplesFolderToken, socket: WebSocket, socketid: number) => {
            await this.readExampleFolderHandler(token, socket, socketid);
        });
        this.functionMaps.set("writeFolder", async (token: Connection.WriteFolderToken, socket: WebSocket, socketid: number) => {
            await this.writeFolderHandler(token, socket, socketid);
        });
        this.functionMaps.set("deleteFolder", async (token: Connection.DeleteFolderToken, socket: WebSocket, socketid: number) => {
            await this.deleteFolderHandler(token, socket, socketid);
        });
        this.functionMaps.set("renameProject", async (token: Connection.RenameProjectToken, socket: WebSocket, socketid: number) => {
            await this.renameProjectHandler(token, socket, socketid);
        });
        this.functionMaps.set("ctrl", async (token: Connection.CtrlToken, socket: WebSocket, socketid: number) => {
            await this.controlHandler(token, socket, socketid);
        });
        this.functionMaps.set("execJava", async (token: Connection.JavaToken, socket: WebSocket, socketid: number) => {
            await this.execJavaHandler(token, socket, socketid);
        });
        this.functionMaps.set("startSapereEE", async (token: Connection.StartSapereEEToken, socket: WebSocket, socketid: number) => {
            await this.startSapereHandler(token, socket, socketid);
        });
        this.functionMaps.set("startIVY", async (token: Connection.StartIVYToken, socket: WebSocket, socketid: number) => {
            await this.startIvyHandler(token, socket, socketid);
        });
        this.functionMaps.set("stopSapereEE", async (token: Connection.StopSapereEEToken, socket: WebSocket, socketid: number) => {
            await this.stopSapereHandler(token, socket, socketid);
        });
    }
}

// create the server
const server: PvsiowebServer = new PvsiowebServer();
server.activate();