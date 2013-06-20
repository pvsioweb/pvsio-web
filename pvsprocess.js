/**
 * javascript nodejs lib for communicating with pvs process
 * @author hogfather
 * @date Jul 27, 2012 12:54:38 AM
 * @project JSLib
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, require, module, process */

var childprocess = require("child_process"),
	util = require("util"),
	fs = require("fs");
var procWrapper = require("./processwrapper");
var spawn = childprocess.spawn;
var pvs = procWrapper();
module.exports = function () {
    "use strict";

    var o                                   = {},
        output                              = [],
        readyString                         = "<PVSio>",
        wordsIgnored                        = ["", "==>", readyString],
        restarting                          = false,
        sourceCode,
        filename,
        processReady                        = false,
        pvsio,
        workspaceDir                        = process.cwd() + "/public/";
	/**
	 * get or set the workspace dir. this is the base directory of the pvs source code
	 * @param {String} dir
	 * @return {String} the current workspace directory
	 */
	o.workspaceDir = function (dir) {
		if (dir) {
			dir = dir.substr(-1) !== "/" ? (dir + "/") : dir;
			workspaceDir = dir;
			return o;
		}
		return workspaceDir;
	};
	
	/**
	 * starts the pvs process with the given sourcefile 
	 * @param {String} filename source file to load with pvsio
	 * @param {function({type:string, data:array})} callback function to call when any data is received  in the stdout
     * @param {function} callback to call when processis ready
	 */
	o.start = function (file, callback, processReadyCallback) {
		filename = o.workspaceDir() + file;
        function onDataReceived(data) {
			var lines = data.split("\n").map(function (d) {
				return d.trim();
			});
			var lastLine = lines[lines.length - 1];
			//copy lines into the output list ignoring the exit string, the startoutput string '==>'
			//and any blank lines
			output = output.concat(lines.filter(function (d) {
				return wordsIgnored.indexOf(d) < 0;
			}));
			
			if (processReady && lastLine.indexOf(readyString) > -1) {
                var outString = output.join("");
				callback({type: "pvsoutput", data: [outString]});
				//clear the output
				output  = [];
			} else if (lastLine.indexOf(readyString) > -1) {
                //last line of the output is the ready string
				processReadyCallback({type: "processReady", data: output});
				processReady = true;
				output = [];
			} else {
				//maybe process has stalled
				callback({type: "processStalled", data: output});
			}
		}
		
		function onProcessExited(code) {
			processReady = false;
			var msg = "pvsio process exited with code " + code;
			util.log(msg);
			callback({type: "processExited", data: msg, code: code});
		}
		
        pvs.start({processName: "pvsio", args: [filename],
			onDataReceived: onDataReceived,
			onProcessExited: onProcessExited});
		
		util.log("pvsio process started with file " + filename);

		return o;
	};
	
	/**
	 * sends a command to the pvsio process. This method returns immediately. The result of the command
	 * will be by the 'on data' event of the process standard output stream
	 * @param {string} command the command to send to pvsio
	 */
	o.sendCommand = function (command, callback) {
		util.log("sending command " + command + " to process");
		pvs.sendCommand(command);
		return o;
	};
	
	/**
	 * gets the source code pvs io is executing
     * @param {string} path the path the to file whose content is to be fetched
	 * @param {function({type:string, data, message:string})} callback callback to execute when sourcecode has been loaded
	 * @returns {this}
	 */
	o.readFile = function (path, callback) {
        pvs.readFile(path, callback);
		return o;
	};
	
	/**
	 * writes  the file passed to the disk
     * @param {fileName:string, fileContent: string} data Object representing the sourcecode to save
     * @param {function ({type: string, data: {fileName: string}})} callback function to invoke when the file has been saved
	 */
	o.writeFile = function (data, callback) {
        pvs.writeFile(data, callback);
		return o;
	};
	
	
	/**
	 * closes the pvsio process
     * @param {string} signal The signal to send to the kill process. Default is 'SIGTERM'
	 */
	o.close = function (signal) {
		signal = signal || 'SIGTERM';
		pvs.kill(signal);
		return o;
	};
	
	return o;
};