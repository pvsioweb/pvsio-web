//#!/usr/bin/env node

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
        wsbase                  = require("./websocketserver"),
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
        httpServer              = http.createServer(webserver);
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
     * Creates a project
     * @param {Request} req
     * @param {Response} res
     */
    function createProject(opt) {
        var uploadSpecPath = __dirname + uploadDir + "/" + opt.uploadedSpecFileName;
        var projectName = opt.projectName;
        var prototypeImage = opt.prototypeImage;
        var uploadImagePath = __dirname + uploadDir + "/" + opt.uploadedImageFileName;
        var projectPath = __dirname + "/public/projects/" + projectName;
        var newImagePath = projectPath + "/" + opt.clientImageFileName,
            newSpecPath = projectPath + "/" + opt.clientSpecFileName;
        var obj = {type: "projectCreated"};
        try {
            if (fs.existsSync(projectPath)) {
                obj.err = "Project with the same name exists. Please choose a different name. Old project name was " + projectPath;
            } else {
                //create a project folder
                fs.mkdirSync(projectPath);
                fs.renameSync(uploadImagePath, newImagePath);
                fs.renameSync(uploadSpecPath, newSpecPath);
                obj.image = newImagePath.split("/").slice(-1).reduce(function (a, b) {return a.concat(b); });
                obj.projectPath = projectPath;
                obj.imageFullPath = newImagePath;
                obj.name = projectName;
                obj.spec = newSpecPath.split("/").slice(-1).reduce(function (a, b) {return a.concat(b); });
                obj.specFullPath = newSpecPath;
                util.log("Source code has been saved.");
            }
        } catch (err) {
            obj.err = err;
        }
        return obj;
    }
    
    /**
     * Lists all the projects on the server
     * @return {Array<string>} A list of project names
     */
    function listProjects() {
        var imageExts = ["jpg", "jpeg", "png"],
            specExts = ["pvs"];
        var projectDir = __dirname + "/public/projects/";
        var res = fs.readdirSync(projectDir).map(function (d, i) {
            var p = {name: d, projectPath: projectDir + d, other: []};
            var stat = fs.statSync(projectDir + d);
            if (stat.isDirectory()) {
                fs.readdirSync(projectDir + d).forEach(function (f) {
                    stat = fs.statSync(projectDir + d + "/" + f);
                    if (stat.isFile()) {
                        var ext = f.indexOf(".") > -1 ? f.split(".")[1].toLowerCase() : "";
                        if (imageExts.indexOf(ext) > -1) {
                            p.image = f;
                            p.imageFullPath = projectDir + d + "/" + f;
                        } else if (specExts.indexOf(ext) > -1) {
                            p.spec = f;
                            p.specFullPath = projectDir + d + "/" + f;
                        } else if (f === "widgetDefinition.json") {
                            p.widgetDefinition = JSON.parse(fs.readFileSync(projectDir + d + "/" + f, "utf8"));
                        } else {
                            p.other.push(f);
                        }
                    }
                });
                return p;
            } else {
                return null;
            }
        }).filter(function (d) {return d !== null; });
        return res;
    }
    
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
            "saveTempFile": function (token, socket, socketid) {
                saveTempFile(token, function (res) {
                    res.id = token.id;
                    res.serverSent = new Date().getTime();
                    processCallback(res, socket);
                });
            },
            "listProjects": function (token, socket, socketid) {
                var projects = listProjects();
                var res = {id: token.id, serverSent: new Date().getTime(), projects: projects};
                processCallback(res, socket);
            },
            "createProject": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid] || pvsio();
                pvsioProcessMap[socketid] = p;
                
                util.log(JSON.stringify(token));
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
                p.sendCommand(token.data.command);
                console.log(p.workspaceDir());
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
                p.readFile(token.fileName, function (err, content) {
                    var res = {id: token.id, serverSent: new Date().getTime(), fileContent: content};
                    processCallback(res, socket);
                });
            },
            "writeFile": function (token, socket, socketid) {
                p = pvsioProcessMap[socketid];
                p.writeFile(token.data.fileName, token.data.fileContent, function (err) {
                    util.log("back from write file ...");
                    var res = {id: token.id, serverSent: new Date().getTime()};
                    ///continue here !!! files saved need to inform client about need to restart pvsioweb with appropriate files
                    if (!err) {
                        util.log("Source code has been saved. Closing process ... " + socketid);
                        res.type = "fileSaved";
                    } else {
                        res.type = "error";
                        res.err = err;
                        util.log(err);
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