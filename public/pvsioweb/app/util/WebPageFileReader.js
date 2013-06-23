/**
 * 
 * @author Patrick Oladimeji
 * @date 6/21/13 8:41:34 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global document, define, d3, require, $, brackets, window, MouseEvent, FileReader, FileList, File, Blob, WebSocket */
define(function (require, exports, module) {
    "use strict";
    var property                    = require("util/property");
       
    function fileReader() {
        var o = {};
        o.onProgress = property.call(o);
        o.onError = property.call(o);
        o.onAbort = property.call(o);
        o.onLoadStart = property.call(o);
        o.onLoad = property.call(o);
        
        function getReader() {
            var reader = new FileReader();
            reader.onprogress = o.onProgress();
            reader.onerror = o.onError();
            reader.onload = o.onLoad();
            reader.onabort = o.onAbort();
            reader.onloadstart = o.onLoadStart();
            return reader;
        }
        
        o.readAsText = function (f) {
            getReader().readAsText(f);
        };
        
        o.readAsBinaryString = function (f) {
            getReader().readAsBinaryString(f);
        };
        return o;
    }
    
    function allowDragAndDrop(elId, callback) {
        function onFilesDropped(event) {
            event.stopPropagation();
            event.preventDefault();
            
            var files = event.dataTransfer.files;
            callback(files);
        }
        
        function onFilesDraggedOver(event) {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
        }
        
        //add listeners to the element
        var container = document.getElementById(elId);
        container.addEventListener("dragover", onFilesDraggedOver, false);
        container.addEventListener("drop", onFilesDropped, false);
    }
    
    module.exports.FileReader = fileReader;
});