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
        bodyParser              = require("body-parser"),
        webserver               = express(),
        procWrapper             = require("./processwrapper"),
        uploadDir               = "/public/uploads",
        port                    = 8082,
        pvsioProcessMap         = {},//each client should get his own process
        httpServer              = http.createServer(webserver),
        Promise                 = require("es6-promise").Promise,
        logger                  = require("tracer").console(),
		serverFuncs				= require("./serverFunctions"),
        baseProjectDir          = __dirname + "/public/projects/";
    var p, clientid = 0, WebSocketServer = ws.Server;
	var writeFile = serverFuncs.writeFile,
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
        var file = path.join(baseProjectDir, projectName, "/.pvsioweb"),
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
                            writeFile(file, JSON.stringify(props, null, " "))
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
    //create the express static server and use public dir as the default serving directory
    webserver.use(express.static(__dirname + "/public"));
    webserver.use(bodyParser({ keepExtensions: true, uploadDir: __dirname + uploadDir}));

    /**
     * used to manage file upload process for pvsio-web
     */
    webserver.all("/upload", function (req, res) {
        logger.debug(JSON.stringify(req.files));
        var fileName = req.files.file.path.split("/").slice(-1).join("");
        //should return a map of oldname to new name for the uploaded files
        res.send({fileName: fileName});
    });

    function typeCheck(filePath, cb) {
        procWrapper().exec({
            command: "proveit " + filePath,
            callBack: cb
        });
    }
    
    /**
        get function maps for client sockets
    */
    function createClientFunctionMaps() {
        var map = {
            "renameFile": function (token, socket, socketid) {
                var oldPath = path.join(baseProjectDir, token.oldPath);
                var newPath = path.join(baseProjectDir, token.newPath);
                fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        logger.debug("warning, error while renaming " + token.oldPath +
                                    " into " + token.newPath + " (" + err + ")");
                    }
                    processCallback({id: token.id, socketId: socketid, err: err}, socket);
                });
            },
            "readDirectory": function (token, socket, socketid) {
                fs.readdir(token.path, function (err, files) {
                    if (!err) {
                        //get stat attributes for all the files using an async call
                        var promises = files.map(function (f) {
                            return new Promise(function (resolve, reject) {
                                fs.stat(f, function (err, res) {
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
                                        return {name: files[i], isDirectory: d.isDirectory()};
                                    });
                                processCallback({id: token.id, socketId: socketid, files: result, err: err}, socket);
                            }, function (err) {
                                processCallback({id: token.id, socketId: socketid, err: err}, socket);
                            });
                    } else {
                        processCallback({id: token.id, socketId: socketid, err: err}, socket);
                    }
                });
            },
            "writeDirectory": function (token, socket, socketid) {
                fs.mkdir(token.path, function (err) {
                    processCallback({id: token.id, socketId: socketid, err: err}, socket);
                });
            },
            "setMainFile": function (token, socket, socketid) {
                changeProjectSetting(token.projectName, "mainPVSFile", token.fileName)
                    .then(function (res) {
                        res.id = token.id;
                        res.socketId = socketid;
                        res.serverSent = new Date().getTime();
                        processCallback(res, socket);
                    });
            },
            "listProjects": function (token, socket, socketid) {
                var result = {id: token.id, serverSent: new Date().getTime(), socketId: socketid};
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
                var res = {id: token.id, serverSent: new Date().getTime(), socketId: socketid};
                openProject(token.name)
                    .then(function (data) {
                        res.project = data;
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
                    res.serverSent = new Date().getTime();
                    processCallback(res, socket);
                }, p);
                
            },
            "typeCheck": function (token, socket, socketid) {
                typeCheck(token.filePath, function (err, stdout, stderr) {
                    var res = {id: token.id, err: err, stdout: stdout, stderr: stderr, socketId: socketid};
                    processCallback(res, socket);
                });
            },
            "sendCommand": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                p.sendCommand(token.data.command, function (data) {
                    var res = {id: token.id, data: [data], socketId: socketid, type: "commandResult"};
                    processCallback(res, socket);
                });
            },
            "startProcess": function (token, socket, socketid) {
                logger.info("Calling start process for client... " + socketid);
				var root = token.data.projectName ?
                            "/public/projects/" + token.data.projectName
                            : token.data.demoName ? "/public/demos/" + token.data.demoName : "";
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
                p.workspaceDir(__dirname + root)
                    .start(token.data.fileName,
                        function (res) {
                            res.id = token.id;
                            res.serverSent = new Date().getTime();
                            res.socketId = socketid;
                            processCallback(res, socket);
                        });
            },
            "closeProcess": function (token, socket, socketid) {//closes pvs process
                p = pvsioProcessMap[socketid];
                var res = {id: token.id, socketId: socketid};
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
                fs.readFile(token.filePath, encoding, function (err, content) {
                    var res = err ? {err: err} : {id: token.id, serverSent: new Date().getTime(), fileContent: content, socketId: socketid};
                    processCallback(res, socket);
                });
            },
            "writeFile": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                var res = {id: token.id, serverSent: new Date().getTime(), socketId: socketid};
                token.filePath = path.join(baseProjectDir, token.filePath);
                
                writeFile(token.filePath, token.fileContent, token.encoding)
                    .then(function () {
                        processCallback(res, socket);
                    }, function (err) {
                        res.err = err;
                        processCallback(res, socket);
                    });
            },
            "deleteFile": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                var res = {id: token.id, serverSent: new Date().getTime(), socketId: socketid};
                token.filePath = path.join(baseProjectDir, token.filePath);
                p.removeFile(token.filePath, function (err) {
                    if (!err) {
                        res.type = "fileDeleted";
                    } else {
                        res.err = err;
                    }
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