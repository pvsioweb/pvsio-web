function getLastState() { return ws.lastState(); }

document.getElementById("btnUp").onclick = 
function(){
	ws.sendGuiAction("click_up(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnDown").onclick = 
function(){
	ws.sendGuiAction("click_dn(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnLeft").onclick = 
function(){
	ws.sendGuiAction("click_lf(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnRight").onclick = 
function(){
	ws.sendGuiAction("click_rt(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnOk").onclick = 
function(){
	ws.sendGuiAction("click_ok(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}


document.getElementById("btnCancel").onclick = 
function(){
	ws.sendGuiAction("click_cancel(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}

document.getElementById("btnStop").onclick = 
function(){
	ws.sendGuiAction("click_stop(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}

document.getElementById("btnEdit").onclick = 
function(){
	ws.sendGuiAction("click_edit(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnBolus").onclick = 
function(){
	ws.sendGuiAction("click_bolus(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnStart").onclick = 
function(){
	ws.sendGuiAction("click_start(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}

document.getElementById("btnOn").onclick = 
function(){
	ws.sendGuiAction("click_on(" + prettyprintPVSioOutput(getLastState()) + ");");
	GUI_ACTION = 1;
}

