/**
	Now we load the websocket library to use for connection to the pvsio webserver
	for more info on this see http://requirejs.org
*/
var ws;
var display_val = document.getElementById("GIP-rate"); //rate value
var display_unit = document.getElementById("GIP-rate-unit"); //rate unit
var display_cmd = document.getElementById("GIP-cmd");
var display_status = document.getElementById("GIP-status");
var infusing_tick_period = 1000; //ms
var ctrl_tick_period = 250; //ms

// variables linked to the UI model state fields; they are used to render the field state.
var bullet = "&#8226;"
var vtbi = 0;
var infusing = 0;
var ctrl_cmd = "CINIT";
var isOn = 0;
var ctrl_ready = 0;
var pvsio_response;
var cursor = 0;
var disp_field = new RegExp("display := [0-9\/.]+");
var cursor_field = new RegExp("cursor := [0-9\/.-]+");
var unit_field = new RegExp("unit := [0-9A-Za-z]+");
var is_on_field = new RegExp("is_on := [0-9\/.]+");
var vtbi_field = new RegExp("vtbi := [0-9\/.]+");
var infusing_field = new RegExp("is_infusing := [0-9\/.]+");
var ctrl_cmd_field = new RegExp("ctrl_cmd := [0-9A-Za-z]+");
var ctrl_ready_field = new RegExp("ctrl_ready := [0-9A-Za-z]+");
var prettyprintPVSioOutput = function(obj) {
  return obj.toString().replace(new RegExp(",,", "g"), ", ");
}
var device_tick = 0;
var tick_enabled = 0;
function tick() {
	ws.sendGuiAction("gpcaui_tick(" + prettyprintPVSioOutput(getLastState()) + ");");
	if(ctrl_cmd != undefined) {
		GIPlog("Sending message " + ctrl_cmd + " to GPCA state controller...");
		gip.send(ctrl_cmd);
	}
}

var render_cursor = function(val) {
  obj = display_val;
  obj.innerHTML = "";
  var disp = val.toString();
  // display from left to right
  var decimal_place = disp.indexOf(".");
  var cursor_rendered = false;
  for(var i = 0; i < disp.length; i++) {
	var digit = disp.charAt(i);
	if(digit == ".") {
		digit = bullet;
	}
	var close_span = false;
	if(decimal_place > 0 ) {
		if(cursor < 0) {
			if(cursor == decimal_place - i) { 
				obj.innerHTML = obj.innerHTML + "<span class = decimaldigit><span class = \"invertedcolor\">" + digit + "</span></span>"; 
				cursor_rendered = true;
			}
			else {
				if(i > decimal_place) { obj.innerHTML = obj.innerHTML + "<span class = decimaldigit>" + digit + "</span>"; } 
				else { obj.innerHTML = obj.innerHTML + digit; }
			}
		}
		else { 
			if(cursor == decimal_place - i - 1) { 
				obj.innerHTML = obj.innerHTML + "<span class = \"invertedcolor\">" + digit + "</span>"; 
				cursor_rendered = true;
			}
			else { 
				if(i > decimal_place) { obj.innerHTML = obj.innerHTML + "<span class = decimaldigit>" + digit + "</span>"; } 
				else { obj.innerHTML = obj.innerHTML + digit; }
			}
		}
	}
	else {
		if(cursor == disp.length - i - 1) { 
			obj.innerHTML = obj.innerHTML + "<span class = \"invertedcolor\">" + digit + "</span>"; 
			cursor_rendered = true;
		}
		else { obj.innerHTML = obj.innerHTML + digit; }
	}
  }
  if(cursor_rendered == false) {
	if(cursor < 0) {
		if(decimal_place < 0) {
			// the cursor has not been rendered because the decimal part is 0
			obj.innerHTML = obj.innerHTML + bullet; 
			var gaps = cursor * -1;
			for(var i = 0; i < gaps; i++) {
				if(i == gaps - 1) { obj.innerHTML = obj.innerHTML + "<span class = decimaldigit><span class = \"invertedcolor\">" + "_" + "</span></span>"; }
				else { obj.innerHTML = obj.innerHTML + "_"; }
			}
		}
		else {
			// the cursor has not been rendered because the number has just one decimal digit (this rendering is specific to the case with 2 decimals)
			obj.innerHTML = obj.innerHTML + "<span class = decimaldigit><span class = \"invertedcolor\">" + "_" + "</span></span>";
		}
	}
	else { // the cursor is has been not rendered because it's beyond the max non-zero integer digit
		if(decimal_place < 0) {
			var gaps = cursor - disp.length;
			for(var i = 0; i< gaps; i++) {
				if(i > decimal_place) {
					obj.innerHTML = "<span class = decimaldigit>" + "_" + "</span>" + obj.innerHTML;
				}
				else {
					obj.innerHTML = "_" + obj.innerHTML;
				}
			}
		}
		else {
			var gaps = cursor - decimal_place;
			for(var i = 0; i < gaps; i++) {
				obj.innerHTML = "_" + obj.innerHTML;
			}
		}
		obj.innerHTML = "<span class = \"invertedcolor\">" + "_" + "</span>" + obj.innerHTML;
	}
  }
}

require(['pvsiowebsocketclient_dist'], function(){
	var pvsws = require('websockets/pvs/pvsiowebsocket');
	ws = pvsws()
		//.serverUrl("ws://192.168.43.158:8080") //edit the server url here if not using ws://localhost:8080
		.addListener('ConnectionOpened', function(e){
			log("connection to server established");
			this.startPVSProcess("pvscode/gpcaui");
			connectGIP();
		}).addListener("ConnectionClosed", function(e){
			log("connection to server closed");
		}).addListener("ServerReady", function(e){
			log("pvsio process ready");
			display_val.firstChild.nodeValue = "powered off";
		}).addListener("OutputUpdated", function(e){
			pvsio_response = prettyprintPVSioOutput(e.data);
			pvsio_response_log(pvsio_response);
			isOn = is_on_field.exec(pvsio_response).toString().substring(
				      is_on_field.exec(pvsio_response).toString().indexOf(":= ") + 3);
			ctrl_ready = ctrl_ready_field.exec(pvsio_response).toString().substring(
				      ctrl_ready_field.exec(pvsio_response).toString().indexOf(":= ") + 3);
			ctrl_cmd
			  = ctrl_cmd_field.exec(pvsio_response).toString().substring(
				  ctrl_cmd_field.exec(pvsio_response).toString().indexOf(":= ") + 3);
			cursor
			  = cursor_field.exec(pvsio_response).toString().substring(
				  cursor_field.exec(pvsio_response).toString().indexOf(":= ") + 3);
			display_cmd.firstChild.nodeValue = ctrl_cmd;
			if(isOn == 1 && ctrl_ready == 1) {
				display_status.firstChild.nodeValue = "";
				// power on the display
/*				display_val.firstChild.nodeValue 
				  = eval(disp_field.exec(pvsio_response).toString().substring(
					  disp_field.exec(pvsio_response).toString().indexOf(":= ") + 3));*/
				render_cursor(eval(disp_field.exec(pvsio_response).toString().substring(
					 	   disp_field.exec(pvsio_response).toString().indexOf(":= ") + 3)));
				display_unit.firstChild.nodeValue
				  = unit_field.exec(pvsio_response).toString().substring(
					  unit_field.exec(pvsio_response).toString().indexOf(":= ") + 3);
				vtbi 
				  = eval(vtbi_field.exec(pvsio_response).toString().substring(
					  vtbi_field.exec(pvsio_response).toString().indexOf(":= ") + 3));
				infusing 
				  = eval(infusing_field.exec(pvsio_response).toString().substring(
					  infusing_field.exec(pvsio_response).toString().indexOf(":= ") + 3));
				if(infusing == 1) {
					display_status.firstChild.nodeValue = "<<< infusing";
					if(tick_enabled == 0) {
						// start periodic events
						device_tick = setInterval(function(){tick()},infusing_tick_period);
						tick_enabled = 1;
					}
				}
				else {
					// stop periodic events
					clearInterval(device_tick);
					// reset periodic events
					tick_enabled = 0;
				}
				
			}
			else if(isOn == 1 && ctrl_ready == 0) {
				// power off the display
				display_val.firstChild.nodeValue = "powering up..";
				// start periodic events
				if(tick_enabled == 0) {
					device_tick = setInterval(function(){tick()},ctrl_tick_period);
					tick_enabled = 1;
				}
			}
			else {
				display_val.innerHTML = "powered off";
				display_unit.firstChild.nodeValue = "";
				// stop periodic events
				clearInterval(device_tick);
				// reset periodic events
				tick_enabled = 0;
			}
		}).addListener("InputUpdated", function(e){
			pvsio_commands_log(JSON.stringify(e.data));
		}).addListener("SourceCodeReceived", function(e){
			var spec = JSON.stringify(e.data).replace(/(\\n)/g, "<br />");
			specification_log(spec);
		}).logon();
	/**
	* write code to bind ui elements to calls to pvs process
	  i would normally used a library to bind ui elements to functions
	  but this does not require any library
	  e.g
	  var btnUp = document.getElementById("btnUp");
	  btnUp.onclick(function(e){
		 ws.sendGuiAction("click_UP(init(3))"); 
	  });
	*/	
});

function log(msg){
	console.log(msg);
	var c = document.getElementById('console');
	c.innerHTML = msg + "<br>" + c.innerHTML;
}

function console_log(msg){
	console.log(msg);
	var c = document.getElementById('console_log');
	c.innerHTML = msg + "<br>" + c.innerHTML;
}

function pvsio_commands_log(msg){
	console.log(msg);
	var c = document.getElementById('pvsio_commands_log');
	c.innerHTML = msg + "<br>" + c.innerHTML;
}

function pvsio_response_log(msg){
	console.log(msg);
	var c = document.getElementById('pvsio_response_log');
	c.innerHTML = msg + "<br>" + c.innerHTML;
}

function specification_log(msg){
	console.log(msg);
	var c = document.getElementById('specification_log');
	c.innerHTML = msg + "<br>" + c.innerHTML;
}


