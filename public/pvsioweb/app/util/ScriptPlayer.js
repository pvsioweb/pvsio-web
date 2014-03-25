/**
 * plays a series of recorded user actions
 * @author Patrick Oladimeji
 * @date 3/24/14 17:51:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, setTimeout */
define(function (require, exports, module) {
    "use strict";
    var ws = require("websockets/pvs/WSManager").getWebSocket(),
        PlayListView = require("pvsioweb/forms/PlayListView"),
        WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager();
    var scripts = [];
    var playList = PlayListView.create(scripts);
       
    function render(stateString, display) {
        display.render(stateString);
    }
    
    function play(actions, display) {
        var action = actions.shift();
        var command = action.action + "_" + action.functionText + "(" + ws.lastState().toString().replace(/,,/g, ",") + ");";
        ws.sendGuiAction(command, function (err, res) {
            var stateString = res.data.join("");
            render(stateString, display);
        });
        if (actions.length) {
            var interval = actions[0].ts - action.ts;
            setTimeout(function () {
                play(actions, display);
            }, interval);
        }
    }
    
    function addScript(name, actions, startState) {
        var time = actions[actions.length - 1].ts - actions[0].ts;
        scripts.push({name: name, actions: actions, time: (time / 1000).toFixed(1) + "s", startState: startState});
        playList = PlayListView.create(scripts);
        var display = WidgetManager.getDisplayWidgets()[0];
        
        playList.on("scriptClicked", function (name) {
            var script = scripts.filter(function (d) {return d.name === name; });
            ws.lastState(startState);
            script = script ? script[0] : [];
            play(script.actions.map(function (d) {return d; }), display);
        });
    }
      
    module.exports = {
        play: play,
        addScript: addScript
    };
});
