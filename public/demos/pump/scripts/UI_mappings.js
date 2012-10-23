function getLastState() { return ws.lastState(); }

document.getElementById("btnUp").onclick = 
function(){
	ws.sendGuiAction("bbraun_up(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnDown").onclick = 
function(){
	ws.sendGuiAction("bbraun_dn(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnLeft").onclick = 
function(){
	ws.sendGuiAction("bbraun_lf(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnRight").onclick = 
function(){
	ws.sendGuiAction("bbraun_rt(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnOn").onclick = 
function(){
	connectGIP();
	ws.sendGuiAction("bbraun_on(" + prettyprintPVSioOutput(getLastState()) + ");");
}

var device_tick;
document.getElementById("btnStart").onclick = 
function(){
	ws.sendGuiAction("bbraun_start(" + prettyprintPVSioOutput(getLastState()) + ");");
	if(display_canvas.firstChild.nodeValue  > 0 && volume > 0 && infusing == 0) {
		device_tick = setInterval(function(){tick()},1000);
	}
	else {
		clearInterval(device_tick);
	}
}
document.getElementById("btnOk").onclick = 
function(){
	gip.send("NewCommand");
	ws.sendGuiAction("bbraun_ok(" + prettyprintPVSioOutput(getLastState()) + ");");
}

function tick() {
	ws.sendGuiAction("bbraun_tick(" + prettyprintPVSioOutput(getLastState()) + ");");
}

