#!/usr/bin/env node

/**
 * 
 * @author patrick
 * @date 28 Jul 2012 21:52:31
 *
 */

var pvsio = require("./pvsprocess"),
	wsbase = require("./websocketserver"),
	util = require("util");

var host = process.argv[2] || "0.0.0.0";
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
			p.start(token.fileName, function(tok){
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
	
	server.start({host:host});	