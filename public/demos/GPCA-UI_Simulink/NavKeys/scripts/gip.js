function GIPlog(msg){
	var c = document.getElementById('GIP-Controller_console');
	c.innerHTML = msg + "<br>" + c.innerHTML;
}

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
	GIPlog("[ " + timestamp.toTimeString() + " ] ");
	gip.send("MONITOR_TICK");
}

function stop_ctrl_monitor() {
	GIPlog("Controller disconnected");
	clearInterval(ctrl_monitor);
	ctrl_monitor_active = 0;
}

var gip;
var connectGIP = function() {
  if ("WebSocket" in window) {
    var location =  document.getElementById('ControllerAddress').value + ":2317";
    GIPlog("Trying to estrablish connection with controller at " + location);
    gip = new WebSocket("ws://" + location, "GIP");		
    // open event: create messages and send data using send()
    gip.onopen = function() {
	  log("Controller connected!");
          start_ctrl_monitor();
    };

    // receive event
    gip.onmessage = function (evt) { 
      GIPlog("Message received: " + prettyprintReceivedData(evt.data));
      ws.forwardControllerResponse("controller_response( " 
                                   + prettyprintReceivedData(evt.data) 
                                   + " )( " 
                                   + prettyprintPVSioOutput(getLastState()) 
                                   + " );"); 
    };
    
    // close event
    gip.onclose = function() { 
      // websocket is closed.
      log("Controller disconnected"); 
      stop_ctrl_monitor();
    };
  }
  else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
  }
}	

