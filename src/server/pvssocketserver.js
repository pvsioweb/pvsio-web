//#!/usr/bin/env node
/**
Copyright (c) 2012

Patrick Oladimeji
This file is part of pvsio-web.

pvsio-web is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pvsio-web is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
/*jshint unused: true, undef: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, undef: true, node: true */
/*global __dirname*/

function run() {
    "use strict";
    
    var pvsio                   = require("./pvsprocess"),
        path                    = require("path"),
        ws                      = require("ws"),
        http                    = require("http"),
        fs                      = require("fs"),
        express                 = require("express"),
        webserver               = express(),
        procWrapper             = require("./processwrapper"),
        FileFilters             = require("./FileFilters"),
        port                    = 8082,
        pvsioProcessMap         = {},//each client should get his own process
        httpServer              = http.createServer(webserver),
        Promise                 = require("es6-promise").Promise,
        logger                  = require("tracer").console(),
		serverFuncs				= require("./serverFunctions"),
        baseProjectDir          = path.join(__dirname, "../../examples/projects/"),
		baseDemosDir			= path.join(__dirname, "../../examples/demos/"),
		clientDir				= path.join(__dirname, "../client");
    var p, clientid = 0, WebSocketServer = ws.Server;
    var fsWatchers = {}, eventStream = [];
	var writeFile = serverFuncs.writeFile,
		stat = serverFuncs.stat,
		renameFile = serverFuncs.renameFile,
		createProject = serverFuncs.createProject,
		openProject = serverFuncs.openProject,
		listProjects = serverFuncs.listProjects;
    
    /**
     * Utility function that dispatches responses to websocket clients
     * @param {{type:string, data}} token The token to send to the client
     * @param {Socket} socket The websocket to use to send the token
     */
    function processCallback(tok, socket) {
        //called when any data is recieved from pvs process
        //if the type of the token is 'processExited' then send message to client if the socket is still open
        tok.time  = tok.time || {server: {}};
        tok.time.server.sent = new Date().getTime();
        if (tok.type === 'processExited') {
            if (socket.readyState === 1) {
                socket.send(JSON.stringify(tok));
            }
        } else {//send the message normally
            socket.send(JSON.stringify(tok));
        }
    }

    /**
     * reads and changes the settings in the .pvsioweb file in the project root
     * @param {string} projectName the name of the project
     * @param {string} key the key of the setting to write
     * @param {object} value the value of the setting to write
     * @returns {Promise} a promise that is resolved when the settings file has been written.
    */
    function changeProjectSetting(projectName, key, value) {
        var file = path.join(baseProjectDir, projectName, "/pvsioweb.json"),
            props = {};
        return new Promise(function (resolve, reject) {
            //if file does not exist, create it. Else read the property file and update just the key value specified
            fs.exists(file, function (exists) {
                if (!exists) {
                    props[key] = value;
                    writeFile(file, JSON.stringify(props, null, " "))
                        .then(resolve, reject);
                } else {
                    fs.readFile(file, {encoding: "utf8"}, function (err, res) {
                        props = {err: err};
                        if (!err) {
                            props =  JSON.parse(res) || props;
                            props[key] = value;
                            //write the file back
                            writeFile(file, JSON.stringify(props, null, " "), "utf8", { overWrite: true })
                                .then(resolve, reject);
                        } else {//there was an error so reject the promise
                            reject(err);
                        }
                    });
                }
            });
        });
        
    }
    
    //create logger
    webserver.use("/demos", function (req, res, next) {
        logger.log('Method: %s,  Url: %s, IP: %s', req.method, req.url, req.connection.remoteAddress);
        next();
    });
	
	
    //create the express static server serve contents in the client directory and the demos directory
    webserver.use(express.static(clientDir));
	webserver.use("/demos", express.static(baseDemosDir));
	webserver.use("/projects", express.static(baseProjectDir));
	//creating a pathname prefix for client so that demo css and scripts can be loaded from the client dir
	webserver.use("/client", express.static(clientDir));

    function typeCheck(filePath, cb) {
        procWrapper().exec({
            command: "proveit -l -v " + filePath,
            callBack: cb
        });
    }
    
    /**
        Reads the contents of a directory.
        @param {string} folderPath
        @returns {Promise} a promise that resolves with a list of objects representing the files in the directory
            each object contains {fileName: <string>, filePath: <string>, isDirectory: <boolean>}
    */
    function readDirectory(folderPath) {
        return new Promise(function (resolve, reject) {
            fs.readdir(folderPath, function (err, files) {
                if (!err) {
                    //get stat attributes for all the files using an async call
                    var promises = files.map(function (f) {
                        return new Promise(function (resolve, reject) {
                            fs.stat(path.join(folderPath, f), function (err, res) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(res);
                                }
                            });
                        });
                    });

                    Promise.all(promises)
                        .then(function (res) {
                            var result = res.map(function (d, i) {
                                return {fileName: files[i], filePath: path.join(folderPath, files[i]), isDirectory: d.isDirectory()};
                            });
                            resolve(result);
                        }, function (err) {
                            reject(err);
                        });
                } else {
                    reject(err);
                }
            });
        });
    }
    
    function unregisterFolderWatcher(folderPath) {
        var watcher = fsWatchers[folderPath];
        if (watcher) {
            watcher.close();  
            delete fsWatchers[folderPath];
        }
    }
    
    function unregisterFolderWatchers() {
        Object.keys(fsWatchers).forEach(function (path) {
            unregisterFolderWatcher(path);
        });
        fsWatchers = {};
    }
    
    /**
        Register a watcher for the specified folder. Sends updates to the client using the socket.
        @param {string} folderPath
        @param {socket} socket
    */
    function registerFolderWatcher(folderPath, socket) {
        var notificationDelay = 200;
        unregisterFolderWatcher(folderPath);
        if (folderPath.indexOf("pvsbin") > -1) { return; }
        
        logger.debug("watching changes to .. " + folderPath);
        var watcher = fs.watch(folderPath, {persistent: false}, function (event, fileName) {
            var extension = path.extname(fileName).toLowerCase();
            if (fileName && fileName !== ".DS_Store" && event === "rename") {
                var fullPath = path.join(folderPath, fileName), tId;
                var token = {type: "FileSystemUpdate", event: event, fileName: fileName,
                             filePath: fullPath.replace(baseProjectDir, ""),
                            time: {server: {}}};
                stat(fullPath)
                    .then(function (res) {
                        if (res.isDirectory()) {
                            registerFolderWatcher(fullPath, socket);
                            token.isDirectory = true;
                        }
                        if (eventStream.length) {
                            token.old = eventStream.pop();
                            clearTimeout(tId);
                            tId = null;
                        }
                        if (token.isDirectory || FileFilters.indexOf(extension) > -1) {
                            setTimeout(function () {
                                processCallback(token, socket);
                            }, notificationDelay);
                        }
                    }).catch(function (err) {
                        token.event = err.code === "ENOENT" ? "delete" : event;
                        if (token.event === "delete") {
                            unregisterFolderWatcher(fullPath);   
                        }
                        eventStream.push(token);
                        tId = setTimeout(function () {
                            if (tId && eventStream.length) {
                                token = eventStream.pop();
                                if (token.isDirectory || FileFilters.indexOf(extension) > -1) {
                                    setTimeout(function () {
                                        processCallback(token, socket);
                                    }, notificationDelay);
                                }
                            }
                        }, 50);
                    });
            }
        });
        fsWatchers[folderPath] = watcher;
        //if the folder contains subdirectories, then watch changes to those as well
        readDirectory(folderPath).then(function (files) {
            files.filter(function (f) {
                return f.isDirectory;
            }).forEach(function (f) {
                registerFolderWatcher(f.filePath, socket);
            });
        });
    }
    
    /**
        get function maps for client sockets
    */
    function createClientFunctionMaps() {
        var map = {
            "renameFile": function (token, socket, socketid) {
				renameFile(token.oldPath, token.newPath).then(function () {
					processCallback({id: token.id, socketId: socketid, time: token.time}, socket);
				}, function (err) {
					 logger.debug("warning, error while renaming " + token.oldPath +
                                    " into " + token.newPath + " (" + err + ")");
					processCallback({id: token.id, socketId: socketid, time: token.time,
									 err: {oldPath: token.oldPath, newPath: token.newPath, message:err}}, socket);
				});
            },
            "readDirectory": function (token, socket, socketid) {
                readDirectory(token.path)
                    .then(function (files) {
                        //send relative directories to the client
                        files.forEach(function (f) {
                            f.filePath = f.filePath.replace(baseProjectDir + "/", "");
                        });
                        processCallback({id: token.id, socketId: socketid, files: files, err: err, time: token.time}, socket);
                    }).catch(function (err) {
                        processCallback({id: token.id, socketId: socketid, err: err, time: token.time}, socket);
                    });
            },
            "writeDirectory": function (token, socket, socketid) {
				token.path = path.join(baseProjectDir, token.path);
				stat(token.path).then(function () {
					//directory exists throw error
					processCallback({id: token.id, socketId: socketid, time: token.time,
									 err: {path: token.path, message: "Directory Exists"}}, socket);
				}, function () {
					fs.mkdir(token.path, function (err) {
                        //when we create a directory we want to watch for changes on that directory
                        registerFolderWatcher(token.path, socket);
						processCallback({id: token.id, socketId: socketid, err: err, time: token.time}, socket);
					});
				});
                
            },
            "setMainFile": function (token, socket, socketid) {
                changeProjectSetting(token.projectName, "mainPVSFile", token.fileName)
                    .then(function (res) {
                        res.id = token.id;
                        res.socketId = socketid;
                        res.time = token.time;
                        processCallback(res, socket);
                    });
            },
            "listProjects": function (token, socket, socketid) {
                var result = {id: token.id, socketId: socketid, time: token.time};
                listProjects()
                    .then(function (projects) {
                        result.projects = projects;
                        processCallback(result, socket);
                    }, function (err) {
                        result.err = err;
                        processCallback(result, socket);
                    });
            },
            "openProject": function (token, socket, socketid) {
                var res = {id: token.id, socketId: socketid, time: token.time};
                openProject(token.name)
                    .then(function (data) {
                        res.project = data;
                        unregisterFolderWatchers();
                        registerFolderWatcher(path.join(baseProjectDir, token.name), socket);
                        processCallback(res, socket);
                    }, function (err) {
                        res.err = err;
                        processCallback(res, socket);
                    });
            },
            "createProject": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid] || pvsio();
                pvsioProcessMap[socketid] = p;
                createProject(token, function (res) {
                    res.id = token.id;
                    res.socketId = socketid;
                    res.time = token.time;
                    unregisterFolderWatchers();
                    registerFolderWatcher(path.join(baseProjectDir, token.projectName), socket);
                    processCallback(res, socket);
                }, p);
                
            },
            "typeCheck": function (token, socket, socketid) {
                typeCheck(token.filePath, function (err, stdout, stderr) {
                    var res = {id: token.id, err: err, stdout: stdout, stderr: stderr, socketId: socketid, time: token.time};
                    processCallback(res, socket);
                });
            },
            "sendCommand": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                p.sendCommand(token.data.command, function (data) {
                    var res = {id: token.id, data: [data], socketId: socketid, type: "commandResult", time: token.time};
                    processCallback(res, socket);
                });
            },
            "startProcess": function (token, socket, socketid) {
                logger.info("Calling start process for client... " + socketid);
				var root = token.data.projectName ?
                            path.join(baseProjectDir, token.data.projectName)
                            : token.data.demoName ? path.join(baseDemosDir, token.data.demoName) : "";
                p = pvsioProcessMap[socketid];
                //close the process if it exists and recreate it
                if (p) {
                    p.close('SIGTERM', true);
                    delete pvsioProcessMap[socketid];
                }
                //recreate the pvsio process
                p = pvsio();
                pvsioProcessMap[socketid] = p;
                //set the workspace dir and start the pvs process with a callback for processing process ready and exit
                //messages from the process
                p.workspaceDir(root)
                    .start(token.data.fileName,
                        function (res) {
                            res.id = token.id;
                            res.socketId = socketid;
                            res.time = token.time;
                            processCallback(res, socket);
                        });
            },
            "closeProcess": function (token, socket, socketid) {//closes pvs process
                p = pvsioProcessMap[socketid];
                var res = {id: token.id, socketId: socketid, time: token.time};
                if (p) {
                    p.close();
                    delete pvsioProcessMap[socketid];
                    res.message = "process closed";
                } else {
                    res.type = "attempting to close undefined process";
                }
                processCallback(res, socket);
                
            },
            "readFile": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                var encoding = token.encoding || "utf8";
                token.filePath = path.join(baseProjectDir, token.filePath);
                fs.readFile(token.filePath, encoding, function (err, content) {
                    var res = err ? {err: err} : {id: token.id, fileContent: content, socketId: socketid};
                    res.time = token.time;
                    processCallback(res, socket);
                });
            },
            "writeFile": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                var res = {id: token.id, socketId: socketid, time: token.time};
                token.filePath = path.join(baseProjectDir, token.filePath);
                
                writeFile(token.filePath, token.fileContent, token.encoding, token.opt)
                    .then(function () {
                        processCallback(res, socket);
                    }, function (err) {
                        res.err = err;
                        processCallback(res, socket);
                    });
            },
            "deleteFile": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                var res = {id: token.id, socketId: socketid, time: token.time};
                token.filePath = path.join(baseProjectDir, token.filePath);
                p.removeFile(token.filePath, function (err) {
                    if (!err) {
                        res.type = "fileDeleted";
                    } else {
                        res.err = err;
                    }
                    processCallback(res, socket);
                });
            },
            "fileExists": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                var res = {id: token.id, socketId: socketid, time: token.time};
                token.filePath = path.join(baseProjectDir, token.filePath);
                fs.exists(token.filePath, function (exists) {
                    res.exists = exists;
                    processCallback(res, socket);
                });
            }
        };

        return map;
    }

    var wsServer = new WebSocketServer({server: httpServer});
    wsServer.on("connection", function (socket) {
        var socketid =  clientid++;
        var functionMaps = createClientFunctionMaps();
        socket.on("message", function (m) {
            var token = JSON.parse(m);
            token.time.server = {received: new Date().getTime()};
            var f = functionMaps[token.type];
            if (f && typeof f === 'function') {
                //call the function with token and socket as parameter
                f(token, socket, socketid);
            } else {
                logger.warn("f is something unexpected -- I expected a function but got type " + typeof f);
            }
        });

        socket.on("close", function () {
            logger.info("closing websocket client " + socketid);
            var _p = pvsioProcessMap[socketid];
            if (_p) {
                _p.close();
            }
            delete pvsioProcessMap[socketid];
        });
    });

    wsServer.on("error", function (err) {
        logger.error(JSON.stringify(err));
    });

    httpServer.listen(port);
    logger.info("http server started .." + "now listening on port " + port);
}
run();