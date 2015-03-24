
/**
 * @function logOnDiv
 * @description Utility function, sends messages to different div elements in the html page
 * @memberof module:Pacemaker-Simulink
 */
function logOnDiv(msg, logger) {
    var newP = document.createElement("p");
    newP.innerHTML = msg;
    var node = document.getElementById(logger);
    node.appendChild(newP);
    node.scrollTop = node.scrollHeight;
    //$("#" + logger).animate({ scrollTop: $("#" + logger)[0].scrollHeight}, 500);
}

var timestamp = new Date();


var ctrl_monitor = 0;
var ctrl_monitor_active = 0;
var ctrl_tick_interval = 2048; //ms
function start_ctrl_monitor() {
	if(ctrl_monitor_active == 0) {
		// start periodic events
		ctrl_monitor = setInterval(function(){ctrl_monitor_tick()}, ctrl_tick_interval);
		ctrl_monitor_active = 1;
	}
}

function ctrl_monitor_tick() {
	//ws.sendGuiAction("gpcaui_tick(" + prettyprintPVSioOutput(getLastState()) + ");");
	logOnDiv("[ " + timestamp.toTimeString() + " ] ", 'GIP-Controller_console');
	gip.send("MONITOR_TICK");
}

function stop_ctrl_monitor() {
	logOnDiv("Controller disconnected", 'GIP-Controller_console');
	clearInterval(ctrl_monitor);
	ctrl_monitor_active = 0;
}

var gip;
var connectGIP = function() {
  if ("WebSocket" in window) {
    var location =  document.getElementById('ControllerAddress').value + ":2317";
    logOnDiv("Trying to estrablish connection with controller at " + location, 'GIP-Controller_console');
    gip = new WebSocket("ws://" + location, "GIP");		
    // open event: create messages and send data using send()
    gip.onopen = function() {
	  logOnDiv("Controller connected!", 'console');
          start_ctrl_monitor();
    };

    // receive event
    gip.onmessage = function (evt) { 
      logOnDiv("Message received: " + prettyprintReceivedData(evt.data));
      ws.forwardControllerResponse("controller_response( " 
                                   + prettyprintReceivedData(evt.data) 
                                   + " )( " 
                                   + prettyprintPVSioOutput(getLastState()) 
                                   + " );", 'GIP-Controller_console');
    };
    
    // close event
    gip.onclose = function() { 
      // websocket is closed.
      logOnDiv("Controller disconnected", 'console');
      stop_ctrl_monitor();
    };
  }
  else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
  }
}	

