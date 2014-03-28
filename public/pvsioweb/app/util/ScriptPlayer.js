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
        WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager(),
        ScriptItemView = require("pvsioweb/forms/ScriptItemView"),
        d3 = require("d3");

    function render(stateString, display) {
        display.render(stateString);
    }
    
    function getButtonCoords(id) {
        var coords = d3.select("." + id).attr("coords");
        coords = coords.split(",");
        return {x1: +coords[0], y1: +coords[1], x2: +coords[2], y2: coords[3]};
    }

    function halo(pos) {
            
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

    
    /**
        Adds the specified script to the list view
    */
    function addScriptToView(script) {
        var actions = script.actions,
            startState = script.startState;
        var time = actions[actions.length - 1].ts - actions[0].ts;
        script.time = (time / 1000) + "s";
        startState = Array.isArray(startState) ? startState.join("") : startState;
        var display = WidgetManager.getDisplayWidgets()[0];

        ScriptItemView.create(script).on("scriptClicked", function (name) {
            ws.lastState(script.startState);
            //render the last state
            if (script.startState !== "init(0)") {
                display.render(script.startState);
            }
            play(script.actions.map(function (d) {
                return d;
            }), display);
        });
    }
    module.exports = {
        play: play,
        addScriptToView: addScriptToView
    };
});