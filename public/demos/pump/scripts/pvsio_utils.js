/**
	Now we load the websocket library to use for connection to the pvsio webserver
	for more info on this see http://requirejs.org
*/
var ws;
var regex = /(\d+)/g;
var display_canvas;
var volume;
var infusing;
var pvsio_response;
var disp_field = new RegExp("d := [0-9\/.]+");
var on_field = new RegExp("on := [0-9\/.]");
var volume_field = new RegExp("v := [0-9\/.]+");
var infusing_field = new RegExp("inf := [0-9\/.]+");
var prettyprintPVSioOutput = function(obj) {
  return obj.toString().replace(new RegExp(",,", "g"), ",");
}
require(['pvsiowebsocketclient_dist'], function(){
	var pvsws = require('websockets/pvs/pvsiowebsocket');
	ws = pvsws()
		//.serverUrl("ws://192.168.43.158:8080") //edit the server url here if not using ws://localhost:8080
		.addListener('ConnectionOpened', function(e){
			log("connection to server established");
			this.startPVSProcess("pvscode/bbraun_space");
		}).addListener("ConnectionClosed", function(e){
			log("connection to server closed");
		}).addListener("ServerReady", function(e){
			log("pvsio process ready");
		}).addListener("OutputUpdated", function(e){
			pvsio_response = prettyprintPVSioOutput(e.data);
			pvsio_response_log(pvsio_response);
			display_canvas = document.getElementById("BBraun-rate");
			pvsio_response_log(disp_field.exec(pvsio_response));
			var isOn = on_field.exec(pvsio_response).toString().substring(
				      on_field.exec(pvsio_response).toString().indexOf(":=") + 2);
			display_canvas.firstChild.nodeValue = isOn;	
			if(isOn == 1) {
				display_canvas.firstChild.nodeValue 
				  = eval(disp_field.exec(pvsio_response).toString().substring(
					  disp_field.exec(pvsio_response).toString().indexOf(":=") + 2));
				volume 
				  = eval(volume_field.exec(pvsio_response).toString().substring(
					  volume_field.exec(pvsio_response).toString().indexOf(":=") + 2));
				infusing 
				  = eval(infusing_field.exec(pvsio_response).toString().substring(
					  infusing_field.exec(pvsio_response).toString().indexOf(":=") + 2));
				if(display_canvas.firstChild.nodeValue == 0) {
					clearInterval(device_tick);
				}
			}
			else {
				display_canvas.firstChild.nodeValue = " ";
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


