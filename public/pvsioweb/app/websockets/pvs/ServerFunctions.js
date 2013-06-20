/**
 * object literal representing pvsio-web server functions
 * @author Patrick Oladimeji
 * @date 6/4/13 22:12:22 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    
    module.exports = {
        SendUICommand: "sendCommand",
        StartProcess: "startProcess",
        WriteFile: "writeFile",
        ReadFile: "readFile"
    };
});