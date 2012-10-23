function GIPlog(msg){
	var c = document.getElementById('GIPconsole');
	c.innerHTML = msg + "<br>" + c.innerHTML;
}

var gip;
function connectGIP() {
  if ("WebSocket" in window) {
    GIPlog("Opening websocket...");
    gip = new WebSocket("ws://localhost:1234", "GIP");		
    // open event: create messages and send data using send()
    gip.onopen = function() {
	  GIPlog("Connection established!");
	  gip.send("PowerButton");
	  gip.send("NewCommand");
    };

    // receive event
    gip.onmessage = function (evt) { 
      var received_msg = evt.data;
      GIPlog("Message is received...");
    };
    
    // close event
    gip.onclose = function() { 
      // websocket is closed.
      GIPlog("Connection is closed..."); 
    };
  }
  else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
  }
}	

