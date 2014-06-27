/**
 *  Contains utility functions for handling files
 * @author Patrick Oladimeji, Enrico D'Urso, Paolo Masci
 * @date 11/14/13 8:15:57 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Promise, FileReader*/
define(function (require, exports, module) {
	"use strict";
	var WSManager = require("websockets/pvs/WSManager"),
		ws = WSManager.getWebSocket(),
        openFilesForm = require("pvsioweb/forms/openFiles"),
        openJSON = require("util/forms/openTextFile");

	
	/**
	 *	Deletes the file specified in the path and invokes the callback function once deleted.
	 *	If an error occurs during deletion, first parameter of callback will be the error.
	 */
	function deleteFile(path, callback) {
		ws.send({type: "deleteFile", fileName: path}, callback);
	}

    /**
	 *
	 */
	function createFileLoadFunction(file, onFileLoaded) {
        return function (cb) {
            var fr = new FileReader();
            fr.onload = function (event) {
                var content = event.target.result;
				if (onFileLoaded && typeof onFileLoaded === "function") {
					onFileLoaded(file, content);
				}
				if (cb && typeof cb === "function") { cb(); }
            };
            fr.readAsText(file);
        };
    }
	
	function readLocalFileAsText(file) {
        var p = new Promise(function (resolve, reject) {
            var fr = new FileReader();
            fr.onload = function (event) {
                var content = event.target.result;
                resolve({fileName: file.name, fileContent: content});
            };
            fr.onerror = function (event) {
                reject(event);
            };
            fr.readAsText(file);
        });
        return p;
    }
    
	/**
	 * Opens text files and returns JSON objects
     * @param callback is the callback function invoked when the files are open
	 * @param opt is a descriptor containing { query, fileExt }, 
     * where query is the title of the created open window, and FileExt specifies the file extensions (e.g., ".txt,.json")
	 * @returns { fileName, fileContent }, where filename is a string, and content is a JSON object
	 * @memberof fileHandler
	 */
	function openLocalFileAsJSON(callback, opt) {
        if (!callback || typeof callback !== "function") { return; }
        openJSON.create({
            header: opt.header || "Open JSON file...",
            extensions: opt.extensions || ".json"
        }).on("cancel", function (event, view) {
            view.remove();
            return { event: event };
        }).on("ok", function (event, view) {
            view.remove();
            if (event.data && event.data.file && event.data.file.length > 0) {
                var file = event.data.file[0];
                var fr = new FileReader();
                fr.onload = function (event) {
                    callback(null, {
                        fileName: file.name,
                        fileContent: JSON.parse(event.target.result)
                    });
                };
                fr.onerror = function (event) {
                    callback(event.target.err);
                };
                fr.readAsText(file);
            }
        });
	}
        

	/**
	 * Opens text files
     * @param callback is the callback function invoked when the files are open
	 * @param opt is a descriptor containing { query, fileExt }, 
     * where query is the title of the created open window, and FileExt specifies the file extensions (e.g., ".txt,.json")
	 * @returns { fileName, fileContent }, where fileName and fileContent are strings
	 * @memberof fileHandler
	 */
	function openLocalFileAsText(callback, opt) {
        if (!callback || typeof callback !== "function") { return; }
        openJSON.create({
            header: opt.header || "Open text file...",
            extensions: opt.extensions || ".txt"
        }).on("cancel", function (event, view) {
            view.remove();
            return { event: event };
        }).on("ok", function (event, view) {
            view.remove();
            if (event.data && event.data.file && event.data.file.length > 0) {
                var file = event.data.file[0];
                var fr = new FileReader();
                fr.onload = function (event) {
                    callback(null, {
                        fileName: file.name,
                        fileContent: event.target.result
                    });
                };
                fr.onerror = function (event) {
                    callback(event.target.err);
                };
                fr.readAsText(file);
            }
        });
	}

    function readLocalFileAsDataURL(file) {
        var p = new Promise(function (resolve, reject) {
            var fr = new FileReader();
            fr.onload = function (event) {
                var content = event.target.result;
                resolve({filePath: file.name, fileContent: content});
            };
            
            fr.onerror = function (event) {
                reject(event);
            };
            fr.readAsDataURL(file);
        });
        return p;
    }
	
	/************* Exported Function ************************************************/
    // openXXX return pairs { fileName, fileContent }
    // readXXX return a Promise
	module.exports = {
        openLocalFileAsJSON: openLocalFileAsJSON, // fileContent is a JSON object
        openLocalFileAsText: openLocalFileAsText, // fileContent is a string
		deleteFile: deleteFile,
		createFileLoadFunction: createFileLoadFunction,
        readLocalFileAsText: readLocalFileAsText,
        readLocalFileAsDataURL: readLocalFileAsDataURL
	
	};
});