/**
 * MIME type utils
 * @author Paolo Masci -- this module is the client-side equivalent of server/FileFilter
 * @date 3/12/14 3:09:12 PM
 */
/*jshint unused: false*/
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var instance = null,
        imageExts = [".jpg", ".jpeg", ".png"],
        modelFiles = [".pvs", ".tex", ".txt", ".i", ".json", ".emdl", ".vdmsl"];
    
    function MIME() { return this; }
    
    MIME.prototype.isHiddenFile = function (filename) {
        return (filename) ? filename.split("/").slice(-1)[0].indexOf(".") === 0 : false;
    };
    
    MIME.prototype.isImage = function (filename) {
        if (filename && typeof filename === "string") {
            var ext = filename.split(".").slice(-1);
            if (ext && ext.length > 0) {
                return imageExts.indexOf("." + ext[0].toLowerCase()) > -1;
            }
            return false;
        }
        return false;
    };
    
    MIME.prototype.isModel = function (filename) {
        if (filename && typeof filename === "string") {
            var ext = filename.split(".").slice(-1);
            if (ext && ext.length > 0) {
                return modelFiles.indexOf("." + ext[0].toLowerCase()) > -1;
            }
            return false;
        }
        return false;
    };
    
    MIME.prototype.isPVS = function (filename) {
        if (filename && typeof filename === "string") {
            var ext = filename.split(".").slice(-1);
            if (ext && ext.length > 0) {
                return ext[0].toLowerCase() === "pvs";
            }
            return false;
        }
        return false;
    };
    
    MIME.prototype.imageFilter = function (d) {
        return (instance.isHiddenFile(d.path) === false) && (d.isDirectory || instance.isImage(d.path));
    };
    
    MIME.prototype.modelFilter = function (d) {
        return (instance.isHiddenFile(d.path) === false) && (d.isDirectory || instance.isModel(d.path));
    };

    MIME.prototype.pvsFilter = function (d) {
        return (instance.isHiddenFile(d.path) === false) && (d.isDirectory || instance.isPVS(d.path));
    };
    
    MIME.prototype.getImageExts = function () {
        return imageExts;
    };
    
    MIME.prototype.getFilesFilter = function () {
        return modelFiles.concat(imageExts);
    };

    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new MIME();
            }
            return instance;
        }
    };
});