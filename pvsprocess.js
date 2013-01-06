/**
 * javascript nodejs lib for communicating with pvs process
 * @author hogfather
 * @date Jul 27, 2012 12:54:38 AM
 * @project JSLib
 */

var childprocess = require("child_process"),
	util = require("util"),
	fs = require("fs");
var procWrapper = require("./processwrapper");
var spawn = childprocess.spawn;
var pvs = procWrapper();
module.exports = (function(){
	var o = {}, output = [], readyString = "<PVSio>", wordsIgnored = ["","==>",readyString],
	restarting = false;
	var sourceCode, filename, processReady = false, pvsio, workspaceDir = process.cwd() + "/public/";
	
	/**
	 * get or set the workspace dir. this is the base directory of the pvs source code
	 * @param dir
	 * @returns
	 */
	o.workspaceDir = function(dir){
		if(dir){
			dir = dir.substr(-1) !== "/" ? dir + "/": dir;
			workspaceDir = dir; 
			return o;
		}
		return workspaceDir;		
	};
	
	/**
	 * starts the pvs process with the given sourcefile 
	 * @param filename source file to load with pvsio
	 * @param callback function to call when any data is received  in the stdout
	 */
	o.start = function(file, callback){
		filename = o.workspaceDir() + file;
		pvs.start({processName:"pvsio", args:[filename],
			onDataReceived:onDataReceived,
			onProcessExited:onProcessExited});
		
		util.log("pvsio process started with file " + filename);

		function onDataReceived(data){
			var lines = data.split("\n").map(function(d){
				return d.trim();
			});
			var lastLine = lines[lines.length -1];
			//copy lines into the output list ignoring the exit string, the startoutput string '==>'
			//and any blank lines
			output = output.concat(lines.filter(function(d){
				return wordsIgnored.indexOf(d) < 0;
			}));
			
			if(processReady && lastLine.indexOf(readyString) > -1){
				callback({type:"pvsoutput", data:output});
				//clear the output
				output  = [];
			}
			else if(lastLine.indexOf(readyString) > -1){//last line of the output is the ready string
				callback({type:"processReady", data:output});
				processReady = true;
				output = [];
			}else{
				//maybe process has stalled
				callback({type:"processStalled",data:output});
			}
		}
		
		function onProcessExited(code){
			processReady = false;
			var msg = "pvsio process exited with code " + code;
			util.log(msg);
			callback({type:"processExited", data:msg, code:code});
		}
		return o;
	};
	

	/**
	 * sends a command to the pvsio process. This method returns immediately. The result of the command
	 * will be by the 'on data' event of the process standard output stream
	 * @param command the command to send to pvsio
	 */
	o.sendCommand = function (command){
		util.log("sending command " + command + " to process");
		pvs.sendCommand(command);
		return o;
	};
	
	/**
	 * gets the source code pvs io is executing
	 * @param callback callback to execute when sourcecode has been loaded
	 * @returns {___anonymous435_436}
	 */
	o.getSourceCode = function(callback){
		if(sourceCode){
			callback({type:"sourcecode", data:sourceCode});
		}else{
			//append a .pvs extension if there isnt one already
			var fname = filename.split(".")[1] === "pvs" ? filename : filename + ".pvs";
			fs.readFile(fname, 'utf8', function(err, data){
				if(err){
					var msg = util.format("Error reading file %s", filename);
					util.log(msg);
					callback({type:'error', message:msg});
					throw err;
				}else{
					sourceCode = data;
					callback({type:"sourcecode", data:data});
				}
			});
		}
		return o;
	};
	
	/**
	 * saves the source code that pvsio is executing using information from data
	 * this also updates the name of the file being executed by pvsio
	 */
	o.saveSourceCode = function(data, callback){
		if(data){
			var fname = data.fileName && data.fileName.substring(data.fileName.indexOf(".")) === ".pvs" ?
					data.fileName : data.fileName + ".pvs";
			save( fname, data.fileContent, callback);
		}
	};
	
	/**
	 * private utility function for saving a file
	 * @param fname name to use to save file
	 * @param source text content of the file
	 * @callback function to call when save is complete. An object containing type:String and data:{fileName:String}
	 * is passed into the callback. 
	 */
	function save(fname, source, callback){
		//util.log("about to write file " + fname + " with data of type " + typeof source);
		fs.writeFile(o.workspaceDir() + fname, source, function(err){
			if(err){
				util.log(err);
				callback({type:"sourceCodeNotSaved"});
			}else{
				callback({type:"sourceCodeSaved", data:{fileName:fname.split(".pvs")[0]}});
			}
		})
	}
	/**
	 * closes the pvsio process
	 */
	o.close = function(signal){
		signal = signal || 'SIGTERM';
		pvs.kill(signal);
		return o;
	};
	
	return o;
});