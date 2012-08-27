/**
 * A wrapper around ws: a nodejs websocket library
 * 
 * depends on ws see https://github.com/einaros/ws
 * depends on requirejs see http://requirejs.org
 * @author hogfather
 * @date Jul 27, 2012 2:05:11 PM
 * @project JSLib
 */

var ws = require("ws"),
	util = require('util');


var WebSocketServer = ws.Server;

module.exports = function(name){
	var messageFunctionMap = {};
	var o = {}, server, name = name || "", clientid = 0;
	o.port = 8080;
	
	/**
	 * starts a websocket server
	 * @param options may contain keys specifying host:String,port:Number,server:http.Server, 
	 * verifyClient:Function, path:String, noServer:Boolean, disableHixie:Boolean, clientTracking:Boolean
	 * @returns {___anonymous500_501}
	 */
	o.start = function(options){
		options = options || {};
		options.port = options.port || o.port;		
		server = new WebSocketServer(options);
		util.log("server instantiated. waiting for connection ...");
		server.on("connection", function(s){
			var socketid = clientid++;
			util.log(util.format("client %d connected", socketid));
			/*handle messages from the client tokenstr should be a json str containing type and data*/
			s.on("message", function(tokenstr){
				var token = JSON.parse(tokenstr);
				var f = messageFunctionMap[token.type];
				if(f && typeof f === 'function') {
					//call the function with token and socket as parameter
					f(token, s, socketid);
				}else{
					util.log("f is something unexpected -- " + typeof f);
				}
			});
			
		});
		
		server.on("error", function(err){
			util.log(JSON.stringify(err));
		});
		
		util.log(util.format("%s websocket server started . Listening on host address %s", name, options.host));
		return o;
	};
	
	/**
	 * binds a type of message to a custom function
	 * @param type
	 * @param f
	 */
	o.bind = function(type, f){
		messageFunctionMap[type] = f;
		return o;
	};
	
	return o;
	
};
