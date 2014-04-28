
/**
 * @author hogfather
 * @date Feb 29, 2012
 * @project JSNumberEntry
 */

/**
 * adapted from javascript the good parts
 * @param that
 */
define('util/eventDispatcher',[],function(){
	return function(that) {
		var registry = {};

		var fire = function(event) {
			// Fire an event on an object. The event can be either  a string
			// containing the name of the event or an  object containing a type
			// property containing the  name of the event. Handlers registered by
			// the 'on' method that match the event name will be invoked.
			var array, func, handler, i, type = typeof event === 'string' ? event
					: event.type;
			// If an array of handlers exist for this event, then  loop through it
			// and execute the handlers in order.
			if (registry.hasOwnProperty(type)) {
				array = registry[type];
				for (i = 0; i < array.length; i++) {
					handler = array[i];
					// A handler record contains a method and an optional  array
					// of parameters. If the method is a name, look up the
					// function.
					func = handler.method;
					if (typeof func === 'string') {
						func = this[func];
					}
					// Invoke a handler. If the record contained  parameters, then
					// pass them. Otherwise, pass the event object.
					func.apply(this, handler.parameters || [ event ]);
				}//end for
			}//end if
			return this;
		};
		that.fire = fire;
		
		var on = function(type, method, parameters) {
			// Register an event. Make a handler record. Put it  in a handler
			// array, making one if it doesn't yet exist for this type.
			var handler = {	method : method, parameters : parameters};
			if (registry.hasOwnProperty(type)) {
				registry[type].push(handler);
			} else {
				registry[type] = [ handler ];
			}
			
			return this;
		};
		
		that.addListener = on;
		
		var removeListener = function(type, method){
			var array, i, handler;
			if(registry.hasOwnProperty(type)){
				array = registry[type];
				for(i = 0; i< array.length; i++){
					handler = array[i];
					if(method === handler.method){
						array.splice(i, 1);
					}
				}//end for
			}
			//do nothing if this event type has no listeners
		};
		that.removeListener = removeListener;
		
		var clearListeners = function(){
			registry = {};
			return this;
		};
		that.clearListeners = clearListeners;
		
		return that;
	};
	}
);
/**
 *list of pvs number entry events
 * @author hogfather
 * @date Jul 18, 2012 2:50:50 PM
 * @project JSLib
 */

define('formal/pvs/numberentry/events',{
	ServerReady:"ServerReady",
	OutputUpdated:"OutputUpdated",
	InputUpdated:"InputUpdated",
	StateChanged:"StateChanged",
	SourceCodeReceived:"SourceCodeReceived"
});
/**
 * list of events for websocket servers
 * @author hogfather
 * @date Jul 18, 2012 2:46:11 PM
 * @project JSLib
 */
define('websockets/events',{
	ConnectionOpened:"ConnectionOpened",
	ConnnectionClosed:"ConnectionClosed",
	ConnectionTimedOut:"ConnectionTimedOut",
	UserAuthenticated:"UserAuthenticated",
	NoConnection:"NoConnection"
});
/**
 * global events
 * @author hogfather
 * @date Jul 3, 2012
 * @project JSLib
 */
define('util/events',{
	PropertyChanged:"PropertyChanged",
	ValueChanged:"ValueChanged",
	TimerTicked:"TimerTicked",
	TimerFinished:"TimerFinished"
});
/**
 * utility function for defining a property inside a function
 * @author hogfather
 * @date Apr 25, 2012
 * @project JSLib
 */

define('util/property',['util/eventDispatcher', 'util/events'], function(eventDispatcher, events){
	//defines property function
	return function (v){
		var p = function(_){
			if(!arguments.length)
				return v;
			//fire property changed event if _ (incoming) is not equal to v (old property)
			if(v !== _){
				var event = {type:events.PropertyChanged, old:v, fresh:_};
				v = _;
				p.fire(event);
			}
			return this;
		};
		p = eventDispatcher(p);
		return p;
	};
});
/**
 * Client library to make a Websocket connection to a pvsio-web server
 * @author patrick
 * @date 28 Jul 2012 23:14:53
 *
 */

define('websockets/pvs/pvsiowebsocket',['util/eventDispatcher', 'formal/pvs/numberentry/events', 'websockets/events', 'util/property'], 
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
		var o = eventDispatcher({}), ws, url = "ws://localhost:8082";
		o.serverUrl = property.call(o, url);
		
		o.lastState = property.call(o, "gpcaui_init(0)");
		o.value = property.call(o, "0");
		/**
		 * creates a connection to the pvsio webserver
		 * This emits the 'ConnectionOpened' event when the connection has been established
		 *	'ConnectionClosed' event when the connection has been closed
		 *	'ProcessReady' event when the pvsio process is ready
		 *	'OutputUpdated' event when there is some response data from the server
		 *	'SourceCodeReceived' event when the source code has been received
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
						o.fire({type:pvsEvents.ServerReady, data: token.data, socketId: token.socketId});
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
					case "projectCreated":
						o.fire({type:pvsEvents.ProjectCreated, data:token.data});
						break;
					case "tempFileSaved":
						o.fire({type:pvsEvents.TempFileSaved, data:token.data});
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
		o.startPVSProcess = function(){
			sourceFile = "gpcaUI";
			projectName = "../demos/GPCA-UI_Simulink";
			var token = {type:"startProcess", data:{fileName:sourceFile, projectName:projectName}};
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
		 * Sends a pvsio command to the server
		 * @action the command to send
		 */
		o.forwardControllerResponse = function(action){
			var token = {type:"sendCommand", data:{command:action}};
			ws.send(JSON.stringify(token));
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
		 * Special function used to maintain state on the client side.
		 * Particularly useful in the hold_down mode of the alaris
		 */
		o.resetLastState = function(){
			o.lastState("gpcaui_init(" + o.value() + ")");
			return o;
		};
		
		return o;
	};
});
