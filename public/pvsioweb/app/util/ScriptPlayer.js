/**
 * plays a series of recorded user actions
 * @author Patrick Oladimeji
 * @date 3/24/14 17:51:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, setTimeout */
define(function (require, exports, module) {
    "use strict";
    var ws = require("websockets/pvs/WSManager").getWebSocket(),
        WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager(),
        ScriptItemView = require("pvsioweb/forms/ScriptItemView"),
        d3 = require("d3/d3");

    function render(stateString, display) {
        display.render(stateString);
    }
    
    function getButtonPos(id) {
        var coords = d3.select("." + id).attr("coords");
        coords = coords.split(",");
        return {x1: +coords[0], y1: +coords[1], x2: +coords[2], y2: coords[3]};
    }

    function halo(pos) {
        var w = pos.x2 - pos.x1, hrad = w / 2, h = pos.y2 - pos.y1, vrad = h / 2, brad = hrad + "px " + vrad + "px";
        var mark = d3.select(".animation-halo");
        if (mark.empty()) {
            mark = d3.select("#imageDiv").append("div").attr("class", "animation-halo");
        }
        mark.style("top", pos.y1 + "px").style("left", pos.x1 + "px")
            .style("width", (pos.x2 - pos.x1) + "px").style("height", (pos.y2 - pos.y1) + "px")
            .style("border-top-left-radius", brad).style("border-top-right-radius", brad)
            .style("border-bottom-left-radius", brad).style("border-bottom-right-radius", brad);
        
    }
    
    function play(actions, display) {
        var action = actions.shift();
        var pos = getButtonPos(action.id);
        halo(pos);
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
        } else {
            //remove the halo at the end of the actions playback
            d3.select(".animation-halo").remove();
        }
    }

    
    /**
        Adds the specified script to the list view
    */
    function addScriptToView(script) {
        var actions = script.actions,
            startState = script.startState;
        var time = actions[actions.length - 1].ts - actions[0].ts;
        script.time = Math.round(time / 1000) + "s";
        script.startState = Array.isArray(startState) ? startState.join("") : startState;

        ScriptItemView.create(script).on("scriptClicked", function () {
            var display = WidgetManager.getDisplayWidgets()[0];
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
        addScriptToView: addScriptToView,
        clearView: function () {
            d3.select("#scripts ul").html("");
        }
    };
});