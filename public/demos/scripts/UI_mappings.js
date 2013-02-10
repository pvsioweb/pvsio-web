function getLastState() { return ws.lastState(); }

document.getElementById("btnUp").onclick = 
function(){
	ws.sendGuiAction("click_up(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnDown").onclick = 
function(){
	ws.sendGuiAction("click_dn(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnLeft").onclick = 
function(){
	ws.sendGuiAction("click_lf(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnRight").onclick = 
function(){
	ws.sendGuiAction("click_rt(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnOn").onclick = 
function(){
	ws.sendGuiAction("gpcaui_on(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnStart").onclick = 
function(){
	ws.sendGuiAction("click_start(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnStop").onclick = 
function(){
	ws.sendGuiAction("click_stop(" + prettyprintPVSioOutput(getLastState()) + ");");
}
document.getElementById("btnOk").onclick = 
function(){
	ws.sendGuiAction("click_ok(" + prettyprintPVSioOutput(getLastState()) + ");");
}
