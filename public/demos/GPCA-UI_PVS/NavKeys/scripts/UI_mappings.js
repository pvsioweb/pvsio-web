function getLastState() { return ws.lastState(); }

document.getElementById("btnUp").onclick = 
function(){
	ws.sendGuiAction("gpca_click_up(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnDown").onclick = 
function(){
	ws.sendGuiAction("gpca_click_dn(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnLeft").onclick = 
function(){
	ws.sendGuiAction("gpca_click_lf(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnRight").onclick = 
function(){
	ws.sendGuiAction("gpca_click_rt(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnOk").onclick = 
function(){
	ws.sendGuiAction("gpca_click_ok(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}


document.getElementById("btnCancel").onclick = 
function(){
	ws.sendGuiAction("gpca_click_cancel(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}

document.getElementById("btnStop").onclick = 
function(){
	ws.sendGuiAction("gpca_click_stop(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}

document.getElementById("btnEdit").onclick = 
function(){
	ws.sendGuiAction("gpca_click_edit(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnBolus").onclick = 
function(){
	ws.sendGuiAction("gpca_click_bolus(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}
document.getElementById("btnStart").onclick = 
function(){
	ws.sendGuiAction("gpca_click_start(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}

document.getElementById("btnOn").onclick = 
function(){
	ws.sendGuiAction("gpca_click_on(" + (getLastState()) + ");");
	GUI_ACTION = 1;
}
