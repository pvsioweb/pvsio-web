/**
    Now we load the websocket library to use for connection to the pvsio webserver
    for more info on this see http://requirejs.org
*/
var ws;
var consolee = document.getElementById('console');
var uiConsole = document.getElementById('TCAS_console');

var ctrl_clock;
var ctrl_clock_interval = 512; //ms

// this variables contains the state that will be rendered in the log window
var pvsio_response;

// The value of these variables depends on the position of the TCAS display in the loaded picture and on the canvas resolution
var canvas = document.getElementById("canvas_tcas");
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

// utility functions, used to have a uniform output for the gpcaui state and the messages from the controller
var prettyprintPVSioOutput = function(obj) {
  return obj[0].replace(new RegExp("[d]0,","g"), ",").replace(new RegExp("[d]0\\)","g"), ")");
}
var prettyprintReceivedData = function(obj) {
  ans = obj.toString().substring(
        obj.toString().indexOf("(#"),
        obj.toString().lastIndexOf("#)") + 2);
  ans = ans.replace(new RegExp("[d]0,","g"), ",").replace(new RegExp("[d]0\\)","g"), ")");
  return ans;
}


function log(msg){
    consolee.innerHTML = "[ " + (new Date()).toTimeString() + " ] " + msg + "<br><br>" + consolee.innerHTML;
}

//-- TCAS Symbols
function draw_amber_circle(posIntruderX, posIntruderY)  {
    var radius = 350;
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(posIntruderX + radius/2, posIntruderY + radius/2, radius, 0, 2*Math.PI, false);
    ctx.fillStyle = "#FFBF00"; // Amber
    ctx.fill();
    ctx.stroke();
}

function draw_red_square(x, y) {
    var radius = 70;
    var w = 640; // width
    var h = 640; // height
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arcTo(x+w, y,   x+w, y+h, radius);
    ctx.arcTo(x+w, y+h, x,   y+h, radius);
    ctx.arcTo(x,   y+h, x,   y,   radius);
    ctx.arcTo(x,   y,   x+w, y,   radius);
    ctx.closePath();
     ctx.fillStyle = "#CC0000";
    ctx.fill();
    ctx.stroke();
}

function draw_white_diamond(x, y)  {
    var thickness = 70;
    var w = 480; // width
    var h = 510; // height
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo( x + w/2, y);
    ctx.lineTo(x + w, y +h/2 );
    ctx.lineTo(x + w/2 , y + h);
    ctx.lineTo(x , y+h/2);
    ctx.closePath();
    ctx.lineWidth = thickness;
     ctx.strokeStyle = 'white';
    ctx.stroke();
}

function draw_text(x, y, text, colour )
{
    var offsetX = 0;
    var offsetY = -350;
    if( parseFloat(text) < 0 )
        offsetY = -offsetY;
    var ctx  = canvas.getContext("2d");
    ctx.fillStyle = colour.toString();
    ctx.font = "normal bold 400px Arial";
        ctx.fillText(text, eval(x+offsetX), eval(y +offsetY));
}

//-- Start/Stop/Pause demo buttons -------------------------------------------------------------------------------------------------------
var ticking = 0;

function TCAS_tick() {
    ws.sendGuiAction("tick(" + (getLastState()) + ");", function(err, res) {

    });
}

function hide_button(btn) {
    var button = document.getElementById(btn);
    //button.style.visibility = "hidden";
    button.disabled = true;
}

function reveal_button(btn) {
    var button = document.getElementById(btn);
    //button.style.visibility = "visible";
    button.disabled = false;
}


function start_TCAS_demo() {
    if(ticking == 0) {
        ticking = 1;
        ctrl_clock = setInterval(TCAS_tick, ctrl_clock_interval);
        hide_button('start_demo_button');
        hide_button('resume_demo_button');
        reveal_button('pause_demo_button');
    }
}

function pause_TCAS_demo() {
    clearInterval(ctrl_clock);
    ticking = 0;
    hide_button('pause_demo_button');
    hide_button('start_demo_button');
    reveal_button('resume_demo_button');


}

function stop_TCAS_demo() {
    window.location.reload(false);
    reveal_button("start_demo_button");
    hide_button('pause_demo_button');
    hide_button('resume_demo_button' );
}

function init() {
    reveal_button("start_demo_button");
    hide_button("resume_demo_button");
    hide_button("pause_demo_button");

}

//-- Main rendering function -------------------------------------------------------------------------------------------------------
function draw_intruder(positionX_i, positionY_i, positionX_o, positionY_o, ta, range, converging ) {
    console.log("Intruder position = " + "(" + positionX_i + ", " + positionY_i + ")");
    console.log("Own position      = " + "(" + positionX_o + ", " + positionY_o + ")");

    // Compute relative position of intruder with respect to own aircraft, and center position with respect to TCAS display
    positionX_i  =  positionX_i - positionX_o + centerX;
    positionY_i  =  canvas.height - (positionY_i - positionY_o + centerY); // The canvas is flipped upside down with respect to Cartesian system


    // Draw intruder using one of the following symbols:
    //  - red square, when ta is TRUE and converging is TRUE
    //  - amber circle, when ta is TRUE and converging is FALSE
    //  - white diamond, when ta is FALSE
    if( ta == "TRUE") {
        if( converging == 'TRUE' )  {
            draw_red_square(positionX_i, positionY_i);
            draw_text(positionX_i , positionY_i, range, 'red');
        }
        else
        {
            draw_amber_circle(positionX_i, positionY_i);
            draw_text(positionX_i , positionY_i, range, '#FFBF00');
        }

    }
    else {
        draw_white_diamond(positionX_i, positionY_i);
        draw_text(positionX_i , positionY_i, range, 'white');

    }
}

function clear_canvas() {
    canvas.width = canvas.width;
}

var render_pvs_state = function(stateString) {
    // parse the state and initialise corresponding variables
    console.log(stateString);
    var allElements = stateString.split(',');
    var positionX_i = eval( allElements[3].replace(/[^\d-./]/g, "") );
    var positionY_i = eval( allElements[4].replace(/[^\d-./]/g, "") );
    var positionX_o = eval( allElements[6].replace(/[^\d-./]/g, "") );
    var positionY_o = eval( allElements[7].replace(/[^\d-./]/g, "") );
    var range = eval( allElements[2].replace(/[^\d-./]/g, "") );
    var ta =  allElements[9].substring(allElements[9].indexOf('=' ) +1);
    var converging = allElements[0].substring(allElements[0].indexOf('=' ) +1);

    clear_canvas();

    draw_intruder(positionX_i, positionY_i, positionX_o, positionY_o, ta, range, converging);

    // Update TCAS Console
    uiConsole.innerHTML = "[ " + (new Date()).toTimeString() + " ] " + stateString + "<br><br>" + uiConsole.innerHTML;

}


//configuration
require.config({
    //specify base url where require js will start looking when module paths are specified
    baseUrl: "../../../../pvsioweb/app",
    //specify shortcut names for regularly used paths
    paths: {
        "ace": "../lib/ace",
        "d3": "../lib/d3",
        "pvsioweb": "formal/pvs/prototypebuilder"
    }
});

var onOutPutUpdated = function(e){
            render_pvs_state(e);
};
require(["websockets/pvs/pvsWSClient"], function(pvsws){
      var url = window.location.origin.indexOf("file") === 0 ?
            "ws://localhost:8082" : ("ws://" + window.location.hostname + ":8082");
    ws = pvsws()
        .lastState("init(0)")
        .serverUrl(url)
        .addListener('ConnectionOpened', function(e){
            ws.startPVSProcess("top", "../demos/TCAS" ,
                function (e) {
                ws.sendGuiAction("init(0);");
                log("TCAS-demo ready");});
            init();
            consolee.style.display = "block";
            consolee.innerHTML = "";
            log("Starting simulation...");
        }).addListener("ConnectionClosed", function(e){
            consolee.style.display = "block";
            consolee.innerHTML = "";
            log("Simulator back-end disconnected<br>Please type pvsio-web in a terminal to start the simulator back-end.");
            clearInterval(ctrl_clock);
        }).addListener("InputUpdated", function(e){
        }).addListener("pvsoutput", function (e) {
            var output = e.data.join("").replace(/d0/g, "");
            ws.lastState(output);
            onOutPutUpdated(output);
        }).logon();
});

