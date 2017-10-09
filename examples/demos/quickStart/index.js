require.config({
    baseUrl: "../../client/app",
    paths: {
        d3: "../lib/d3",
        lib: "../lib"
    }
});
require(["PVSioWebClient",
        "widgets/BasicDisplay","widgets/NumericDisplay", "widgets/TouchscreenButton", "widgets/TouchscreenDisplay",
        "widgets/ToggleButton", "widgets/SliderWidget", "widgets/car/Gauge"],
function (PVSioWebClient,
            BasicDisplay, NumericDisplay, TouchscreenButton, TouchscreenDisplay,
            ToggleButton, SliderWidget, Gauge) {
     "use strict";
     var device = {};

     device.disp = new BasicDisplay("disp", {
       top: 100, left: 120, height: 24, width: 120
     }, {
       displayKey: "disp"
     });
     device.disp.render( { disp: 10.5 }); // the display renders 10.5
     console.log(device.disp.toJSON());

     device.dispNumeric = new NumericDisplay("dispNumeric", {
       top: 150, left: 120, height: 24, width: 120
     }, {
       displayKey: "disp",
       cursorName: "cur"
     });
     device.dispNumeric.render({ disp: 10.5, cur: -1 }); // the display value is 10.5 and the cursor highlights the first fractional digit
     console.log(device.dispNumeric.toJSON());

     device.touchscreenOk = new TouchscreenButton("touchscreenOk", {
       top: 200, left: 120, height: 24, width: 120
     }, {
       softLabel: "Ok",
       fontColor: "black",
       backgroundColor: "blue",
       fontsize: 16,
       callback: function (err, data) { console.log("Ok button clicked"); console.log(data); }
     });
     device.touchscreenOk.render(); // The touchscreen button is rendered. Clicking the button has the effect of sending a command "click_touchscreenOk(<current state>)" to the pvs back-end
     console.log(device.touchscreenOk.toJSON());

     device.touchdisp = new TouchscreenDisplay("touchdisp", {
       top: 250, left: 120, height: 24, width: 120
     }, {
       displayKey: "touchdisp",
       fontColor: "yellow",
       backgroundColor: "black",
       fontsize: 12,
       callback: function (err, data) { console.log("Touchscreen display touched"); console.log(data); }
     });
    device.touchdisp.render({ touchdisp: "touch display" }); // The touchscreen display is rendered. Clicking the button has the effect of sending a command "click_touchdisp(<current state>)" to the pvs back-end
    console.log(device.touchdisp.toJSON());

    device.togglebtn = new ToggleButton("togglebtn", {
      top: 300, left: 120, height: 24, width: 120
     }, {
      callback: function (err, data) { console.log("toggle button clicked"); console.log(data); }
     });
   device.togglebtn.on(); // The toggle button is rendered. The state is On. Clicking the button has the effect of sending a command "togglebtn(<current state>)" to the pvs back-end
   console.log(device.togglebtn.toJSON());

   device.slider = new SliderWidget("slider", {
     top: 350, left: 120, width: 120
    }, {
     max: 340,
     min: 0,
     init: 100, // initial value selected by the slider
     callback: function (err, data) { console.log("adjusting slider"); console.log(data); }
   });
   device.slider.render(); // The slider is rendered. Adjusting the slider has the effect of sending a command "slide(<current val>)(<current state>)" to the pvs back-end
   console.log(device.slider.toJSON());

   var speedGauge = new Gauge("speedGauge", {
      top: 100, left: 320, width: 220
    }, {
      style: 'classic',
      max: 360,
      majorTicks: 13,
      min: 0,
      size: 360,
      redZones: [],
      rotation: -45,
      gap:90,
      roundValueBeforeRender: true
   });
   speedGauge.render(10.5); // The gauge is rendered and the pointer indicates 10.5


   //--------------- the following code takes care of connecting the javascript front-end to the pvs back-end
   var demoFolder = "quickStart";
   var client = PVSioWebClient.getInstance();
   //register event listener for websocket connection from the client
   client.addListener('WebSocketConnectionOpened', function (e) {
       console.log("web socket connected");
       //start pvs process
       client.getWebSocket()
           .startPVSProcess({name: "main.pvs", demoName: demoFolder + "/pvs"}, function (err, event) {
               // first thing, initialise the pvs model
               client.getWebSocket().sendGuiAction("init;", function (err, data) { console.log(event); });
       });
   }).addListener("WebSocketConnectionClosed", function (e) {
       console.log("web socket closed");
   }).addListener("processExited", function (e) {
       var msg = "Warning!!!\r\nServer process exited. See console for details.";
       console.log(msg);
   });
   client.connectToServer();

});
