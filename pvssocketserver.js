#!/usr/bin/env node

/**
 * 
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
			.default({"host":"0.0.0.0", "port":"8080", "workspace":"public"})
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
		p.sendCommand(token.command);
	}).bind("startProcess", function(token, socket, socketid){
		util.log("Calling start process for client...");
		p = pvsioProcessMap[socketid];
		if(!p){
			p = pvsio();
			//start the pvs process
			p.workspaceDir(workspace)
			.start(token.fileName, function(tok){
				//called when any data is recieved from pvs process
				socket.send(JSON.stringify(tok));
			});
			//add to map
			pvsioProcessMap[socketid] = p;
		}else{
			util.log("using existing pvsio process!");
		}
		//hsndle close event of socket to release resources
		socket.on("close", onsocketClose(socketid));
		
		function onsocketClose(sid){
			return function(e){
				util.log("closing websocket client " + sid);
				p = pvsioProcessMap[sid];
				p.close();
				delete pvsioProcessMap[sid];
			};
		}
		
	}).bind("getSourceCode", function(token, socket, socketid){
		p = pvsioProcessMap[socketid];
		p.getSourceCode(function(res){
			socket.send(JSON.stringify(res));
		});
	});
	
	//set the port
	server.port  = port;
	server.start({host:host});	
	//create the express static server
	webserver.use(express.static(__dirname + "/public"));
	webserver.listen(8081);