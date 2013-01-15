#!/usr/bin/env node

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

var pvsio = require("./pvsprocess"),
	wsbase = require("./websocketserver"),
	util = require("util"),
	args = require("optimist")
			.usage("Start a PVSIO process")
			.alias({"host":"h", "workspace":"w", "port":"p"})
			.default({"host":"0.0.0.0", "port":"8080", "workspace":__dirname + "/public"})
			.demand(["host","workspace", "port"])
			.describe({"host":"The IP address to bind the server to - defaults to 0.0.0.0 to listen on all addresses",
						"port":"The port to listen at - defaults to 8080",
						"workspace":"The base directory of all your pvs source code."})
			.argv;
var http = require("http");
var fs = require("fs");
var express = require('express');
var webserver = express();
var procWrapper = require("./processwrapper");
var uploadDir = "/public/uploads";
var host = args.host, port = args.port, workspace = args.workspace;
var pvsioProcessMap = {};//each client should get his own process

var httpServer = http.createServer(webserver);
var p;
	
	//create the express static server and use public dir as the default serving directory
	webserver.use(express.static(__dirname + "/public"));
	webserver.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + uploadDir}));

	//add image upload path
	webserver.all("/uploadfile", function(req, res){
		util.log(JSON.stringify(req.files));
		var fileName = req.files.file.path.split("/").slice(-1).join("");
		res.send({fileName:fileName});
	});
	
	webserver.all("/saveWidgetDefinition", function(req, res){
		var fileName = __dirname + "/public/projects/" + req.body.fileName, 
			fileContent = req.body.fileContent;
		fs.writeFile(fileName, fileContent, function(err){
			if(err){
				console.log(err);
				res.send({error:"Problem saving widget definition file", err:err});
			}else{
				res.send({success:"file saved", fileName:fileName});
			}
		});
	});
	
	webserver.all("/typecheck", function(req, res){
		var file = req.body.file;
		procWrapper().exec({command:"proveit "  + file, 
			callBack:function(err, stdout, stderr){
				res.send({err:err, stdout:stdout, stderr:stderr});
			}
		});
	});
	
	webserver.all("/newProject", function(req, res){
		var pvsSpecName = req.files.pvsSpec.name;
		var imageFullPath = req.files.prototypeImage.path;
		var prototypeImage = imageFullPath.split("/").slice(-1).join("");
		req.body.pvsSpecName = pvsSpecName;
		req.body.prototypeImage = prototypeImage;
		createProject(req, res);		
	});
	
	webserver.all("/openProject", function(req, res){
		var projects = listProjects();
		res.send(projects);
	});
	
	webserver.all("/createProject", createProject);
	
	webserver.all("/saveTempFile", saveTempFile);
	
	function listProjects(){
		var imageExts = "jpg,jpeg,png".split(","),
			specExts = ["pvs"];
		var projectDir = __dirname + "/public/projects/";
		var res = fs.readdirSync(projectDir).map(function(d, i){
			var p = {name:d, projectPath:projectDir + d, other:[]};
			var stat = fs.statSync(projectDir + d);
			if(stat.isDirectory()){
				fs.readdirSync(projectDir + d).forEach(function(f){
					stat = fs.statSync(projectDir + d + "/" + f);
					if(stat.isFile()){
						var ext = f.indexOf(".") > -1 ? f.split(".")[1].toLowerCase() : "";
						if(imageExts.indexOf(ext) > -1){
							p.image = f;
							p.imageFullPath = projectDir + d + "/" + f;
						}else if(specExts.indexOf(ext) > -1){
							p.spec = f;
							p.specFullPath = projectDir + d + "/" + f;
						}
						else if(f === "widgetDefinition.json") {
							p.widgetDefinition = JSON.parse(fs.readFileSync(projectDir + d + "/" + f, "utf8"));
						}else{
							p.other.push(f);
						}
					}
				});
				return p;
			}else{
				return null;
			}
		}).filter(function(d){return d!== null;});
		return res;
	}
	httpServer.listen(8081);
	
var wsServer = wsbase("PVSIO")
	.bind("sendCommand", function(token, socket, socketid){
		p = pvsioProcessMap[socketid];
		p.sendCommand(token.data.command);
	}).bind("startProcess", function(token, socket, socketid){
		util.log("Calling start process for client... " + socketid);
		p = pvsioProcessMap[socketid];
		if(!p){
			p = pvsio();
			//set the workspace dir and start the pvs process with a callback for processing any responses from
			//the process
			p.workspaceDir(__dirname + "/public/projects/" + token.data.projectName)
			.start(token.data.fileName, function(tok){
				//called when any data is recieved from pvs process
				//if the type of the token is 'processExited' then close the socket if it is still open
				tok.socketId = socketid;
				processCallback(tok, socket);
			});
			//add to map
			pvsioProcessMap[socketid] = p;
		}else{
			util.log("using existing pvsio process!");
		}
		//hsndle close event of socket to release resources
		socket.on("close", onsocketClose(socketid));
		
		/**
		 * handler for socket closed event
		 * @param sid
		 * @returns
		 */
		function onsocketClose(sid){
			return function(e){
				util.log("closing websocket client " + sid);
				p = pvsioProcessMap[sid];
				if(p)
					p.close();
				delete pvsioProcessMap[sid];
			};
		}
		
	}).bind("getSourceCode", function(token, socket, socketid){
		p = pvsioProcessMap[socketid];
		p.getSourceCode(function(res){
			socket.send(JSON.stringify(res));
		});
	}).bind("saveSourceCode", function(token, socket, socketid){
		p = pvsioProcessMap[socketid];
		p.saveSourceCode(token.data, function(token){
			//sourcecode has been saved so restart the server
			if(token.type === "sourceCodeSaved") {
				util.log("Source code has been saved. Closing process ... " + socketid);
				p.close();
				delete pvsioProcessMap[socketid];
				socket.send(JSON.stringify(token));
			}else{
				socket.send(JSON.stringify(token));
			}
		});
	})/*.bind("createProject", function(token, socket, socketid){
		createProject(token, socket);
	}).bind("saveTempFile", function(token, socket, socketid){
		saveTempFile(token, socket);
	})*/;
	
//set the port
wsServer.port  = port;
wsServer.start({server:httpServer});	


	function processCallback(tok, socket){
		//called when any data is recieved from pvs process
		//if the type of the token is 'processExited' then send message to client if the socket is still open
		if(tok.type === 'processExited') {
			if(socket.readyState === 1)
				socket.send(JSON.stringify(tok));
		}else{//send the message normally
			socket.send(JSON.stringify(tok));
		}
	}
	
	/**
	 * save the file described in request parameter into the uploads directory
	 * @param req
	 * @param res
	 * @returns
	 */
	function saveTempFile(req, res){
		var fileContent = req.body.fileContent;
		var fileName = req.body.newFileName;
		var oldFileName = req.body.oldFileName, oldFilePath = __dirname + uploadDir + "/" + oldFileName;
		var destName = __dirname + uploadDir + "/" + fileName;
		if(fileContent && fileName){
			fs.writeFileSync(destName, fileContent);
		}else if(oldFileName && fileName){
			fs.renameSync(oldFilePath, destName);
		}
		
		res.send({fileName: fileName});
	}
	
	/**
	 * 
	 * @param req
	 * @param res
	 * @returns
	 */
	function createProject(req, res){
		var pvsFileName = req.body.pvsSpecName, pvsSpecFullPath = __dirname + uploadDir + "/" + pvsFileName;
		var projectName = req.body.projectName;
		var prototypeImage = req.body.prototypeImage;
		var imageFullPath = __dirname + uploadDir + "/" + prototypeImage;
		util.log(JSON.stringify(req.body));
		var projectPath = __dirname + "/public/projects/" + projectName;
		var response = {type:"projectCreated"};
		try{
			if(fs.existsSync(projectPath)){
				response.err = "Project with the same name exists. Please choose a different name. Old project name was " + projectPath;
			}else{
				//create a project folder
				fs.mkdirSync(projectPath);
				fs.renameSync(imageFullPath, projectPath + "/image." + prototypeImage.split(".")[1]);
				//copy sourcecode to the project directory
				var data = fs.readFileSync(pvsSpecFullPath,'utf8');
				fs.writeFileSync(projectPath + "/" + pvsFileName, data);
				var obj = {};
				obj.image = "image." + prototypeImage.split(".")[1];
				obj.projectPath = projectPath;
				obj.imageFullPath = obj.projectPath + "/" + obj.image;
				obj.name = projectName; 
				obj.sourceCode = data;
				obj.spec = pvsFileName;
				obj.specFullPath = obj.projectPath + "/" + obj.spec;
				util.log("Source code has been saved.");
				response.data = obj;
			}
		}catch(err){
			response.err = err;
		}
		var result = JSON.stringify(response);
		util.log(result);
		res.send(response);
		
	}