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
        filesFilter = [".pvs", ".tex", ".txt", ".i", ".json", ".emdl", ".vdmsl"].concat(imageExts);
    
    function MIME() { return this; }
    
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
    
    MIME.prototype.getImageExts = function () {
        return imageExts;
    };
    
    MIME.prototype.getFilesFilter = function () {
        return filesFilter;
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