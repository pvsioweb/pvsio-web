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

var express = require('express');
var webserver = express();

var host = args.host, port = args.port, workspace = args.workspace;
var pvsioProcessMap = {};//each client should get his own process

	var p;
	var server = wsbase("PVSIO")
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
			p.workspaceDir(workspace)
			.start(token.data.fileName, function(tok){
				//called when any data is recieved from pvs process
				//if the type of the token is 'processExited' then close the socket if it is still open
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
	});
	
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
	
	//set the port
	server.port  = port;
	server.start({host:host});	
	//create the express static server and use public dir as the default serving directory
	webserver.use(express.static(__dirname + "/public"));
	webserver.listen(8081);