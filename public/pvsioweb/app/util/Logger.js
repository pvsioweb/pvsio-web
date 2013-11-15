/**
 * Handles logging functionality for the project
 * @author Patrick Oladimeji
 * @date 11/15/13 15:26:47 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent, document */
define(function (require, exports, module) {
	"use strict";
	
	  /**
     * log the message
     */
    function log(msg) {
        console.log(msg);
        d3.select("#console").insert('p', 'p').html(msg);
    }

	    /***
     * ##### dealing with logging input and output of pvs
     */
    function console_log(msg) {
        console.log(msg);
        var c = document.getElementById('console_log');
        c.innerHTML = msg + "<br>" + c.innerHTML;
    }

    function pvsio_commands_log(msg) {
        console.log(msg);
        var c = document.getElementById('pvsio_commands_log');
        c.innerHTML = msg + "<br>" + c.innerHTML;
    }

    function pvsio_response_log(msg) {
        console.log(msg);
        var c = document.getElementById('pvsio_response_log');
        c.innerHTML = msg + "<br>" + c.innerHTML;
    }

    function specification_log(msg) {
        console.log(msg);
        var c = document.getElementById('specification_log');
        c.innerHTML = msg + "<br>" + c.innerHTML;
    }

	module.exports = {
		log: log,
		console_log: console_log,
		pvsio_commands_log: pvsio_commands_log,
		pvsio_response_log: pvsio_response_log,
		specification_log: specification_log
	};
});
