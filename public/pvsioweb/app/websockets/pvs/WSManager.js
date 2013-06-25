/**
 * manages websocket connection to the pvsio-web server
 * @author Patrick Oladimeji
 * @date 6/20/13 10:45:57 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var ws      = require("./pvsWSClient")();
    
    module.exports = function () {
        return ws;
    };
});