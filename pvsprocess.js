/**
Copyright (c) 2012

Patrick Oladimeji

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
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
module.exports = function () {
    "use strict";
    var pvs = procWrapper();
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
            process.chdir(workspaceDir);
			return o;
		}
		return workspaceDir;
	};
	
	function filterLines(lines) {
		return lines.filter(function (d) {
			return wordsIgnored.indexOf(d.trim()) < 0;
		});
	}
	
	function arrayToOutputString(lines) {
		return lines.join("").replace(/,/g, ", ").replace(/\s+\:\=/g, ":=").replace(/\:\=\s+/g, ":=");
	}
	
	function processDataFunc() {
		var res = [];
		return function (data, cb) {
			var lines = data.split("\n");
			if (readyString === lines[lines.length - 1].trim()) {
				if (cb && typeof cb === "function") {
					lines.pop();//get rid of last line
					res = res.concat(filterLines(lines));
					cb(arrayToOutputString(res));
					res = [];
					return true;
				}
			} else {
				res = res.concat(filterLines(lines));
			}
			return false;
		};
	}
	/**
	 * starts the pvs process with the given sourcefile 
	 * @param {String} filename source file to load with pvsio
	 * @param {function({type:string, data:array})} callback function to call when any data is received  in the stdout
	 * @param {function} callback to call when processis ready
	 */
	o.start = function (file, callback, processReadyCallback) {
		filename = file;
        function onDataReceived(data) {
			// this shows the original PVSio output
			util.log(data);
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
				var outString = arrayToOutputString(output);
				//This is a hack to remove garbage collection messages from the output string before we send to the client
				///TODO not sure if this works as intended
				var croppedString = outString.substring(0, outString.indexOf("(#"));
				outString = outString.substring(outString.indexOf("(#"));
				callback({type: "pvsoutput", data: [outString]});
				//clear the output
				output  = [];
			} else if (lastLine.indexOf(readyString) > -1) {
				//last line of the output is the ready string
				processReadyCallback({type: "processReady", data: output});
				processReady = true;
				output = [];
				pvs.dataProcessor(processDataFunc());
			}
		}
		
		function onProcessExited(code) {
			processReady = false;
			var msg = "pvsio process exited with code " + code + ".\n" + output.join("");
			util.log(msg);
			callback({type: "processExited", data: msg, code: code});
		}
		
        pvs.start({processName: "pvsio", args: [filename],
			onDataReceived: onDataReceived,
			onProcessExited: onProcessExited});
		
		util.log("pvsio process started with file " + filename + "; process working directory is :" + o.workspaceDir());
		return o;
	};
	
	/**
	 * sends a command to the pvsio process. This method returns immediately. The result of the command
	 * will be by the 'on data' event of the process standard output stream
	 * @param {string} command the command to send to pvsio
	 */
	o.sendCommand = function (command, callback) {
		util.log("sending command " + command + " to process");
		pvs.sendCommand(command, callback);
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
