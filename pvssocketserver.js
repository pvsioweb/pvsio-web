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
    function noop() {}
    
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
        baseProjectDir          = __dirname + "/public/projects/";
    var p, clientid = 0, WebSocketServer = ws.Server, imageExts = [".jpg", ".jpeg", ".png"];

    function getFolderStructure(root) {
        var s = fs.statSync(root);
        var file = {path: root, name: root.substr(root.lastIndexOf("/") + 1)};
        if (s.isDirectory()) {
            var files = fs.readdirSync(root);
            file.isDirectory = true;
            file.children = files.map(function (f) {
                return getFolderStructure(path.join(root, f));
            });
            if (file.children) {
                file.children = file.children.filter(function (f) {
                    return (f.isDirectory && f.name !== "pvsbin") || f.name.split(".").slice(-1).join("") === "pvs";
                });
            }
            
            file.path = file.path.replace(baseProjectDir, "");
            return file;
        
        } else {
            file.path = file.path.replace(baseProjectDir, "");
            return file;
        }
    }
     /**
     * Recursively creates a directory structure while ensuring that any non-existent parent folders
     * are created as necessary. E.g., to create /temp/foo/foo/test in the directory /temp without a foo
     * directory, the function ensures that the appropriate parent directories foo/foo are created
     * @param {string} dirPath the path to the directory to create
     * @param {function (err)} cb the callback function to invoke when the directory creation is complete
     */
    function mkdirRecursive(dirPath, cb) {
        cb = cb || noop;
        fs.mkdir(dirPath, function (error) {
            if (error && error.errno === 34) {
                // the callback will be invoked only by the first instance of mkdirRecursive
                var parentDirectory = dirPath.substr(0, dirPath.lastIndexOf("/"));
                mkdirRecursive(parentDirectory, function (err) {
                    if (!err) {
                        fs.mkdir(dirPath, cb);
                    } else {
                        cb(err);
                    }
                });
            } else {
                // if the path has been created successfully, just invoke the callback function (if any)
                cb(error);
            }
        });
    }
    /**
     * Get the stat for the file in the specified path
     * @returns {Promise} a promise that resolves with the stat object of the file
      see http://nodejs.org/api/fs.html#fs_class_fs_stats for details
     */
    function stat(fullPath) {
        return new Promise(function (resolve, reject) {
            fs.stat(fullPath, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
    /**
     Writes a file with the specified content to the specified path. If the parent folders of the specified path
     do not exist, they are created
     @param {string} fullPath the full path to the file
     @param {string} fileContent the content of the file
     @param {string?} fileEncoding the encoding to use for writing the file (defaults to utf8)
     @returns {Promise} a promise that resolves when file has been written or rejects when an error occurs
    */
    function writeFile(fullPath, fileContent, fileEncoding) {
        fileEncoding = fileEncoding || "utf8";
        return new Promise(function (resolve, reject) {
            if (typeof fullPath !== "string" || typeof fileContent !== "string") {
                reject("Both fullPath and fileContent must be strings");
            } else {
                var folder = fullPath.substring(0, fullPath.lastIndexOf(path.sep));
                mkdirRecursive(folder, function (err) {
                    if (!err || err.code === "EEXIST") {
                        fs.writeFile(fullPath, fileContent, fileEncoding, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({filePath: fullPath, fileContent: fileContent, encoding: fileEncoding});
                            }
                        });
                    } else {
                        reject(err);
                    }
                    
                });
                
            }
        });
    }
    /**
        Recursively reads the files in a directory using promises
        @param {string} fullPath the path to the directory to read
        @param {boolean} getContent a flag to set whehter or not to return the content of the file
        @returns {Promise} a promise that resolves with an array of objects  for the files in the given directory.
            The object may contain just filePath prooperties or may include fileContent if the getContent parameter was passed
    */
    function getFilesInDirectory(fullPath, getContent) {
        return stat(fullPath).then(function (f) {
            if (f.isDirectory()) {
                return new Promise(function (resolve, reject) {
                    fs.readdir(fullPath, function (err, files) {
                        if (err) {
                            reject(err);
                        } else {
                            var promises = files.map(function (name) {
                                var filePath = path.join(fullPath, name);
                                return getFilesInDirectory(filePath, getContent);
                            });

                            Promise.all(promises)
                                .then(function (res) {
                                    var flattened = res.reduce(function (a, b) {
                                        if (Array.isArray(b)) {
                                            return a.concat(b);
                                        } else {
                                            a.push(b);
                                            return a;
                                        }
                                    }, []);
                                    resolve(flattened);
                                }, reject);
                        }
                    });
                });
            } else {
                if (!getContent) {
                    return Promise.resolve({filePath: fullPath});
                }
                //resolve with the filename and content
                return new Promise(function (resolve, reject) {
                    var ext = path.extname(fullPath),
                        isImage = imageExts.indexOf(ext.toLowerCase()) > -1;
                    var opt = {encoding: isImage ? "base64" : "utf8"};
                    fs.readFile(fullPath, opt, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({filePath: fullPath, fileContent: isImage ?
                                     ("data:image/" + ext.substr(1).toLowerCase() + ";base64," + data) : data, encoding: opt.encoding});
                        }
                    });
                });
            }
        }, function (err) {
            return Promise.reject(err);
        });
    }
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
    
    /**
     * Creates a project
     * @param {Request} req
     * @param {Response} res
     */
    function createProject(opt, cb, p) {
        var projectName = opt.projectName,
            projectPath = baseProjectDir + projectName,
            projectFiles = opt.projectFiles,
            overWrite = opt.overWrite;
        var obj = {type: "projectCreated"};
            
        function doCreate(cb) {
            cb = cb || noop;
            //create the project folder
            fs.mkdir(projectPath, function (err) {
                if (!err) {
                    var promises = projectFiles.map(function (file) {
                        var ext = path.extname(file.filePath);
                        if (imageExts.indexOf(ext) > -1) {
                            file.fileContent = file.fileContent.replace(/^data:image\/(\w+);base64,/, "");
                        }
                        if (file.filePath.indexOf(projectName) === 0) {
                            file.filePath = path.join(baseProjectDir, file.filePath);
                        } else {
                            logger.debug("Warning, deprecated filenames (project name not included in the filename)");
                            file.filePath = path.join(projectPath, file.filePath);
                        }
                        return writeFile(file.filePath, file.fileContent, file.encoding);
                    });

                    //exec promises and invoke callback function
                    Promise.all(promises)
                        .then(function (files) {
                            obj.projectFiles = files.map(function (f) {
                                f.filePath = f.filePath.replace(projectPath, projectName);
                                return f;
                            });
                            // get project folder structure once all files have been wrtten
                            obj.folderStructure = getFolderStructure(projectPath);
                            // and make sure that the folder structure contains paths relative to baseProject
                            obj.name = projectName;
                            cb(obj);
                        }, function (err) {
                            obj.err = err;
                            cb(obj);
                        });
                    
                } else {
                    obj.err = err;
                    cb(obj);
                }
            });
        }
        
        fs.mkdir(projectPath, function (err) {
            if (!err || (err.code === "EEXIST" && overWrite)) {
                p.removeFile(projectPath, function (err) {
                    if (!err) {
                        doCreate(cb);
                    } else {
                        obj.err = err;
                        if (cb && typeof cb === "function") { cb(obj); }
                    }
                });
            } else {
                obj.err = err;
                if (cb && typeof cb === "function") { cb(obj); }
            }
        });
    }

    /**
    * open a project with the specified projectName
    * @param {string} projectName the name of the project to open 
    * @returns {Promise} a promise that resolves with data for the opened project
    */
    function openProject(projectName) {
        logger.debug("Opening project " + projectName + " ...");
        var projectPath = path.join(baseProjectDir, projectName),
            res = { name: projectName };
        
        return new Promise(function (resolve, reject) {
            //get filepaths and their contents
            getFilesInDirectory(projectPath, true)
                .then(function (files) {
                    res.projectFiles = files.map(function (f) {
                        f.filePath = f.filePath.replace(projectPath, projectName);
                        return f;
                    });
                    res.folderStructure = getFolderStructure(projectPath);
                    resolve(res);
                }, reject);
        });
    }

    /**
     * Lists all the projects on the server by listing folder names in the projects directory
     * @return {Array<string>} A list of project names
     */
    function listProjects() {
        return new Promise(function (resolve, reject) {
            fs.readdir(baseProjectDir, function (err, files) {
                if (err) {
                    reject(err);
                } else {
                    Promise.all(files.map(function (file) {
                        return stat(path.join(baseProjectDir, file))
                            .then(function (f) {
                                if (f.isDirectory()) {
                                    return Promise.resolve(file);
                                } else { return Promise.resolve(null); }
                            });
                    })).then(function (files) {
                        resolve(files.filter(function (f) { return f; }));
                    }, reject);
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
                changeProjectSetting(token.projectName, "mainPVSFile", token.fileName, function (res) {
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
                    p.close();
                    delete pvsioProcessMap[socketid];
                }
                //recreate the pvsio process
                p = pvsio();
                pvsioProcessMap[socketid] = p;
                //set the workspace dir and start the pvs process with a callback for processing any responses from
                //the process
                p.workspaceDir(__dirname + root)
                    .start(token.data.fileName, function (token) {
                        token.socketId = socketid;
                        processCallback(token, socket);
                    },
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