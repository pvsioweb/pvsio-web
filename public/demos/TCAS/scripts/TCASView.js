/**
 * manages rendering tcas view
 * @author Patrick Oladimeji
 * @date 3/18/14 13:53:20 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var StateParser = require("util/PVSioStateParser"),
        d3 = require("d3/d3");
    
    var h = 1200, w = 1200;
    function drawIntruder(pos) {
        
    }
    
    function drawCross(canvas, pos) {
        var size = 5;
        canvas.save();
        canvas.beginPath();
        canvas.moveTo(pos.x, pos.y - size);
        canvas.lineTo(pos.x, pos.y + size);
        canvas.moveTo(pos.x - size, pos.y);
        canvas.lineTo(pos.x + size, pos.y);
        canvas.stroke();
        canvas.restore();
    }
    
    function drawCircle(c, pos, rad) {
        c.save();
        c.beginPath();
        c.strokeStyle = "#ddd";
        c.arc(pos.x, pos.y, rad, 0, 360 * Math.PI / 180);
        c.stroke();
        c.closePath();
        c.restore();
    }
    
    function drawRhombus(c, pos, color) {
        
    }
    
    function drawSelf(canvas, pos) {
        drawCross(canvas, pos);
        
    }
    
    function drawPointer() {
        
    }
    
    function normalisePos(pos) {
        pos.x = StateParser.evaluate(pos.x) + w / 2;
        pos.y = StateParser.evaluate(pos.y) + h / 2;
        return pos;
    }
    
    function render(state) {
        //create the canvas if it does not already exist
        var canvasEl = d3.select("canvas");
        if (canvasEl.empty()) {
            canvasEl = d3.select("#canvas").append("canvas").attr("width", w + "px").attr("height", h + "px");
        }
        var canvas = canvasEl.node().getContext("2d");
        canvas.clearRect(0, 0, w, h);
        if (!state.si || !state.so) {
            return;
        }
        var ipos = normalisePos(state.si);
        var opos = normalisePos(state.so);
        var center = {x: w / 2, y: h / 2};
        var iPosRel = {x: opos.x - ipos.x, y: opos.y - ipos.y};
        
        //draw the intruder position
        drawSelf(canvas, {x: center.x + iPosRel.x, y: center.y + iPosRel.y});
        //draw the own position
        drawSelf(canvas, center);
    }
    
    module.exports = {
        render: render
    };
});
