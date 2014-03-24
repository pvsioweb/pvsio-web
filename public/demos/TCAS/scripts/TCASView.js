/**
 * manages rendering tcas view
 * @author Patrick Oladimeji
 * @date 3/18/14 13:53:20 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var StateParser = require("./PVSioStateParser");
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
//        pos.x = pos.x / 10;
//        pos.y = pos.y / 10;
        return pos;
    }
    
    function render(state) {
        var canvas = document.getElementById('canvas').getContext("2d");
        canvas.clearRect(0, 0, w, h);
        var ipos = normalisePos(state.si);
        var spos = normalisePos(state.so);
        
        drawSelf(canvas, ipos);
        drawSelf(canvas, spos);
    }
    
    module.exports = {
        render: render
    };
});
