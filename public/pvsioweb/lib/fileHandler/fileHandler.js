   /**
    * @fileOverview Utility functions used to handle file (create/open/delete ...)
    * @version 0.2
    */
/**
 * 
 * @author Enrico D'Urso, Patrick Oladimeji
 * @date 11/14/13 8:15:57 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, FileReader */

   /**
    *
    * @module fileHandler
    */

define(function (require, exports, module) {
	"use strict";
	var WSManager = require("websockets/pvs/WSManager"),
		ws = WSManager.getWebSocket();
	
	/**
	 * Reads the content of the specified file and invokes the callback function with the 
	 * contents of the file (if no errors occurred or null if an error occurred.
	 * @param {String} fileName Full path of the file whose content should be read
	 * @param {Function} cb A callback function to invoke when the content of the file has been received from the server
	 */
	function readFile(fileName, cb) {
		ws.send({type: "readFile", fileName: fileName}, function (err, res) {
			if (!err) {
				cb(res.fileContent);
			} else {
				cb(null);
			}
		});
	}
	
	/**
		Deletes the file specified in the path and invokes the callback function once deleted.
		If an error occurs during deletion, first parameter of callback will be the error.
	*/
	function deleteFile(path, callback) {
		ws.send({type: "deleteFile", fileName: path}, callback);
	}

	/**
	
	*/
	function createFileLoadFunction(file, onFileLoaded) {
        return function (cb) {
            var fr = new FileReader();
            fr.onload = function (event) {
                var content = event.target.result;
				if (onFileLoaded && typeof onFileLoaded === "function") {
					onFileLoaded(file.name, content);
				}
				cb();
            };
            fr.readAsText(file);
        };
    }
	
	function openClientFiles(callback) {
		
	}
	
	/************* Exported Function ************************************************/
	module.exports = {
		readFile: readFile,
		/**  Delete file, which is passed as parameter, from the project    */
		deleteFile: deleteFile,
		createFileLoadFunction: createFileLoadFunction
	
	};
});