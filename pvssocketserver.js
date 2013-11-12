#!/usr/bin/env node
/**
Copyright (c) 2012

Patrick Oladimeji

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/

function run() {
    "use strict";

    var pvsio                   = require("./pvsprocess"),
        ws                      = require("ws"),
        util                    = require("util"),
        http                    = require("http"),
        fs                      = require("fs"),
        express                 = require("express"),
        webserver               = express(),
        procWrapper             = require("./processwrapper"),
        uploadDir               = "/public/uploads",
        host                    = "0.0.0.0",
        port                    = 8082,
        workspace               = __dirname + "/public",
        pvsioProcessMap         = {},//each client should get his own process
        httpServer              = http.createServer(webserver),
        baseProjectDir              = __dirname + "/public/projects/";
    var p, clientid = 0, WebSocketServer = ws.Server;
    
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
     * save the file described in request parameter into the uploads directory
     * @param {object} token
     */
    function saveTempFile(token, cb) {
        var fileContent = token.fileContent;
        var fileName = token.newFileName;
        var oldFileName = token.oldFileName, oldFilePath = __dirname + uploadDir + "/" + oldFileName;
        var destName = __dirname + uploadDir + "/" + fileName;
        if (fileContent && fileName) {
            fs.writeFileSync(destName, fileContent);
        } else if (oldFileName && fileName) {
            fs.renameSync(oldFilePath, destName);
        }
        cb({fileName: fileName});
    }
    /**
     * reads and changes the settings in the .pvsioweb file in the project root
    */
    function changeProjectSetting(projectName, key, value, callback) {
        var file = baseProjectDir + projectName + "/.pvsioweb", props = {};
        //write the property file in the project root
        function writeFile(props, cb) {
            fs.writeFile(file, JSON.stringify(props, null, " "), function (err) {
                if (err) {
                    props.err = err;
                }
                if (cb) {
                    cb(props);
                }
            });
        }
        //if file does not exist, create it. Else read the property file and update just the key value specified
        fs.exists(file, function (exists) {
            if (!exists) {
                props[key] = value;
                writeFile(props, callback);
            } else {
                fs.readFile(file, {encoding: "utf8"}, function (err, res) {
                    props = {err: err};
                    if (!err) {
                        props =  JSON.parse(res) || props;
                        props[key] = value;
                        //write the file back
                        writeFile(props, callback);
                    } else {
                        if (callback) {
                            callback(props);
                        }
                    }
                });
            }
        });
    }
    
    /**
     * Creates a project
     * @param {Request} req
     * @param {Response} res
     */
    function createProject(opt) {
        var projectName = opt.projectName,
            imageName = opt.imageFileName,
            imageData = opt.imageData,
            projectPath = baseProjectDir + projectName,
            specFiles = opt.specFiles,
            mainPVSFile = opt.mainPVSFile,
            widgetDefinitions = opt.widgetDefinitions;
        var obj = {type: "projectCreated"};
        try {
            if (fs.existsSync(projectPath)) {
                obj.err = "Project with the same name exists. Please choose a different name. Old project name was " + projectPath;
            } else {
                //create a project folder
                fs.mkdirSync(projectPath);
                obj.projectPath = projectPath;
                obj.name = projectName;
                
                if (imageName && imageData) {
                    var imageString = imageData.replace(/^data:image\/(\w+);base64,/, "");
                    fs.writeFileSync(projectPath + "/" + imageName, imageString, "base64");
                    obj.image = imageName;
                    obj.imageData = imageData;
                }
                
                if (specFiles) {
                    specFiles.forEach(function (f) {
                        fs.writeFileSync(projectPath + "/" + f.fileName, f.fileContent);
                    });
                    obj.pvsFiles = specFiles;
                }
                
                if (mainPVSFile) {
                    obj.mainPVSFile = mainPVSFile;
                    //create a main file in the project settings
                    changeProjectSetting(projectName, "mainPVSFile", mainPVSFile);
                }
            }
        } catch (err) {
            obj.err = err;
        }
        return obj;
    }
    
    /**
    * open a project with the specified name
    */
    function openProject(name) {
        console.log('opening project..' + name);
        var imageExts = ["jpg", "jpeg", "png"], specExts = ["pvs"],
            projectPath = baseProjectDir + name,  stat = fs.statSync(projectPath),
            res =  {name: name, projectPath: projectPath};
        if (stat.isDirectory()) {
            fs.readdirSync(projectPath).forEach(function (file) {
                stat = fs.statSync(projectPath + "/" + file);
                if (stat.isFile()) {
                    var ext = file.indexOf(".") > -1 ? file.split(".")[1].toLowerCase() : "";
                    if (imageExts.indexOf(ext) > -1) {
                        res.image = file;
                        res.imageData = "data:image/" + ext + ";base64," + fs.readFileSync(projectPath + "/" + file, "base64");
                    } else if (specExts.indexOf(ext) > -1) {
                        res.pvsFiles = res.pvsFiles || [];
                        res.pvsFiles.push(file);
                    } else if (file === "widgetDefinition.json") {
                        res.widgetDefinition = JSON.parse(fs.readFileSync(projectPath + "/" + file, "utf8"));
                    } else if (file === ".pvsioweb") {
                        var config = JSON.parse(fs.readFileSync(projectPath + "/" + file, "utf8"));
                        res.mainPVSFile = config.mainPVSFile;
                    } else {
                        res.other = res.other || [];
                        res.other.push(file);
                    }
                }
            });
            //load the first file if there is no .pvsioweb file in the root of the project
            if (!res.mainPVSFile && res.pvsFiles && res.pvsFiles.length) {
                res.pvsFiles.sort();
                res.mainPVSFile = res.pvsFiles[res.pvsFiles.length - 1];
            }
            return res;
        } else {
            return null;
        }
    }
    
    /**
     * Lists all the projects on the server by listing folder names in the projects directory
     * @return {Array<string>} A list of project names
     */
    function listProjects() {
        var res;
        try {
            res = fs.readdirSync(baseProjectDir).map(function (d, i) {
                var stat = fs.statSync(baseProjectDir + d);
                if (stat.isDirectory()) {
                    return d;
                } else {
                    return null;
                }
            }).filter(function (d) {return d !== null; });
        } catch (err) {
            res = { err: err };
        }
        return res;
    }
    
    //create logger
    webserver.use("/demos", function (req, res, next) {
        console.log('Method: %s,  Url: %s, IP: %s', req.method, req.url, req.connection.remoteAddress);
        next();
    });
    //create the express static server and use public dir as the default serving directory
    webserver.use(express.static(__dirname + "/public"));
    webserver.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + uploadDir}));
    
    /**
     * used to manage file upload process for pvsio-web
     */
    webserver.all("/upload", function (req, res) {
        util.log(JSON.stringify(req.files));
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
            "setMainFile": function (token, socket, socketid) {
                changeProjectSetting(token.projectName, "mainPVSFile", token.fileName, function (res) {
                    res.id = token.id;
                    res.serverSent = new Date().getTime();
                    processCallback(res, socket);
                });
            },
            "saveTempFile": function (token, socket, socketid) {
                saveTempFile(token, function (res) {
                    res.id = token.id;
                    res.serverSent = new Date().getTime();
                    processCallback(res, socket);
                });
            },
            "listProjects": function (token, socket, socketid) {
                var projects = listProjects();
                var res = projects.err ? projects : {id: token.id, serverSent: new Date().getTime(), projects: projects};
                processCallback(res, socket);
            },
            "openProject": function (token, socket, socketid) {
                var project = openProject(token.name);
                var res = {project: project, id: token.id, serverSent: new Date().getTime()};
                processCallback(res, socket);
            },
            "createProject": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid] || pvsio();
                pvsioProcessMap[socketid] = p;
                var res = createProject(token);
                res.id = token.id;
                res.serverSent = new Date().getTime();
                processCallback(res, socket);
            },
            "typeCheck": function (token, socket, socketid) {
                typeCheck(token.filePath, function (err, stdout, stderr) {
                    var res = {id: token.id, err: err, stdout: stdout, stderr: stderr};
                    processCallback(res, socket);
                });
            },
            "sendCommand": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                p.sendCommand(token.data.command, function (data) {
					var res = {id: token.id, data: data};
					processCallback(res, socket);
				});
            },
            "startProcess": function (token, socket, socketid) {
                util.log("Calling start process for client... " + socketid);
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
                p.workspaceDir(__dirname + "/public/projects/" + token.data.projectName)
                    .start(token.data.fileName, function (token) {
                        token.socketId = socketid;
                        processCallback(token, socket);
                    },
                        function (res) {
                            res.id = token.id;
                            res.serverSent = new Date().getTime();
                            processCallback(res, socket);
                        });
            },
            "readFile": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                var encoding = token.encoding || "utf8";
                fs.readFile(token.fileName, encoding, function (err, content) {
                    var res = err ? {err: err} : {id: token.id, serverSent: new Date().getTime(), fileContent: content};
                    processCallback(res, socket);
                });
            },
            ///TODO rethink logic of what happens when files are written and saved
            "writeFile": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                var encoding = token.encoding || "utf8";
                fs.writeFile(token.data.fileName, token.data.fileContent, encoding, function (err) {
                    var res = {id: token.id, serverSent: new Date().getTime()};
                    ///continue here !!! files saved need to inform client about need to restart pvsioweb with appropriate files
                    if (!err) {
                        util.log("Source code has been saved. Closing process ... " + socketid);
                        res.type = "fileSaved";
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
                util.log("f is something unexpected -- I expected a function but got type " + typeof f);
            }
        });
        
        socket.on("close", function (e) {
            util.log("closing websocket client " + socketid);
            var _p = pvsioProcessMap[socketid];
            if (_p) {
                _p.close();
            }
            delete pvsioProcessMap[socketid];
        });
    });
    
    wsServer.on("error", function (err) {
        util.log(JSON.stringify(err));
    });
    
    httpServer.listen(port);
    console.log("http server started .." + "now listening on port " + port);
}

run();