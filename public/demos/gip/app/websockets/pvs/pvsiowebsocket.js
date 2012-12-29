/**
 * Client library to make a Websocket connection to a pvsio-web server
 * @author patrick
 * @date 28 Jul 2012 23:14:53
 *
 */

define(['util/eventDispatcher', 'formal/pvs/prototypebuilder/events', 'websockets/events', 'util/property'], 
		function(eventDispatcher, pvsEvents, wsEvents, property){
	
	/**
	 * parses pvs output into a json object map
	 */
	function parseState(state){
		var st = state[0].substr(2, state[0].length - 4);
		var props = st.split(",");
		var res = {};
		props.forEach(function(p){
			var args = p.split(":=");
			res[args[0].trim()] = args[1] ? args[1].trim() : args[1];
		});
		
		return res;
	}
	
	return function() {
		var o = eventDispatcher({}), ws, url = "ws://localhost:8080";
		o.serverUrl = property.call(o, url);
		
		o.lastState = property.call(o, "init(0)");
		o.value = property.call(o, "0");
		/**
		 * creates a connection to the pvsio webserver
		 * This emits the 'ConnectionOpened' event when the connection has been established
		 * 				'ConnectionClosed' event when the connection has been closed
		 * 				'ProcessReady' event when the pvsio process is ready
		 * 				'OutputUpdated' event when there is some response data from the server
		 * 				'SourceCodeReceived' event when the source code has been received
		 */
		o.logon = function(){
			if(!ws){
				ws = new WebSocket(o.serverUrl());
				ws.onopen = function(event){
					o.fire({type:wsEvents.ConnectionOpened, event:event});
				};
				ws.onclose = function(event){
					o.fire({type:wsEvents.ConnectionClosed, event:event});
				};
				//add on message received event
				///TODO fix this block so that the type in the server token matches the event type emitted by
				///the event listener.
				ws.onmessage = function(event){
					var token = JSON.parse(event.data);
					switch(token.type){
					case "processReady":
						o.fire({type:pvsEvents.ServerReady, data: token.data});
						break;
					case "pvsoutput":
						o.lastState(token.data);
						o.value(parseState(token.data).display);
						o.fire({type:pvsEvents.OutputUpdated, data:token.data});
						//fire state changed as well
						o.fire({type:pvsEvents.StateChanged, display:o.value()});
						break;
					case "sourcecode":
						o.fire({type:pvsEvents.SourceCodeReceived, data:token.data});
						break;
					case "processExited":
						o.fire({type:pvsEvents.ProcessExited, data:token.data, code:token.code});
						break;
					case "sourceCodeSaved":
						o.fire({type:pvsEvents.SourceCodeSaved, data:token.data});
						break;
					}
				};
			}
			return o;
		};
		
		/**
		 * closes the websocket connection to the server
		 */
		o.close = function(){
			if(ws){
				ws.close();
			}
		};
		
		/**
		 * Starts the PVSProcess on the server
		 * @param sourceFile The source file to initiate the pvsio process with. This file should be 
		 * relative to the workspace directory. The workspace directory is a folder on the server that contains 
		 * all the pvs source code that the client can access
		 */
		o.startPVSProcess = function(sourceFile){
			sourceFile = sourceFile || "pvscode/alarisGP_oldFW";
			var token = {type:"startProcess", data:{fileName:sourceFile}};
			ws.send(JSON.stringify(token));
			return o;
		};
		/**
		 * Sends a pvsio command to the server
		 * @action the command to send
		 */
		o.sendGuiAction = function(action){
			var token = {type:"sendCommand", data:{command:action}};
			ws.send(JSON.stringify(token));
			o.fire({type:pvsEvents.InputUpdated, data:action});
			return o;
		};
		
		/**
		 * Retrieves the source code of the file the pvsio process was initiated with
		 */
		o.getSourceCode = function(){
			var token = {type:"getSourceCode"};
			ws.send(JSON.stringify(token));
			return o;
		};
		
		/**
		 * saves the source code back to the server
		 * @param data details containing fileName:String and fileContent:String of
		 * what to save
		 */
		o.saveSourceCode = function(data){
			var token = {type:"saveSourceCode", data:data};
			ws.send(JSON.stringify(token));
			return o;
		};
		
		/**
		 * Special function used to maintain state on the client side.
		 * Particularly useful in the hold_down mode of the alaris
		 */
		o.resetLastState = function(){
			o.lastState("init(" + o.value() + ")");
			return o;
		};
		
		return o;
	};
});