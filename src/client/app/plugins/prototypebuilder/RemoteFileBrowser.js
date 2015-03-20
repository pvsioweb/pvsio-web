/**
 * Allows readonly access to the file system.
 * @author Patrick Oladimeji
 * @date 3/17/15 22:30:00 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, require, brackets, Promise, Handlebars, $ */
define(function (require, exports, module) {
    "use strict";
    var TreeList = require("./TreeList"),
        WSManager = require("websockets/pvs/WSManager");

    var template = require("text!pvsioweb/forms/templates/fileBrowser.handlebars"),
        BaseDialog = require("pvsioweb/forms/BaseDialog"),
        FormUtils = require("pvsioweb/forms/FormUtils");
		
    var timerId, rfb;
    
	var OpenFilesView = BaseDialog.extend({
		render: function (data) {
			var t = Handlebars.compile(template);
			this.$el.html(t(data));
			$("body").append(this.el);
			return this;
		},
		events: {
			"click #btnOk": "ok",
			"click #btnCancel": "cancel",
            "input #baseDirectory": "onTextChanged"
		},
        onTextChanged: function (event) {
            clearTimeout(timerId);
            timerId = setTimeout(function () {
                rfb.rebaseDirectory($("#baseDirectory").val());
            }, 100);
        }
	});
	
    
    function RemoteFileBrowser(filterFunc, selectMutliple) {
        rfb = this;
        this.selectMultiple = selectMutliple;
        this.filterFunc = filterFunc || function (d) { return true; };
    }
    
    RemoteFileBrowser.prototype._treeList = null;
    
    function getRemoteDirectory(path) {
        var ws = WSManager.getWebSocket();
        return new Promise(function (resolve, reject) {
            ws.send({type: "readDirectory", path: path}, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.files.filter(rfb.filterFunc));
                }
            });
        });
    }
    
    RemoteFileBrowser.prototype.rebaseDirectory = function (path) {
        var self = this;
        getRemoteDirectory(path)
            .then(function (files) {
                var data = {name: path, path: path, children: files, isDirectory: true};
                self._treeList.data = data;
                self._treeList.render(data);
            }).catch(function (err) {
                self._treeList.data = [];
            });
    };
    
    /**
     Opens a dialog to browse a remote directory.
    */
    RemoteFileBrowser.prototype.open = function (path) {
        var view = new OpenFilesView({baseDirectory: path});
        var self = this;
        getRemoteDirectory(path)
            .then(function (files) {
                var data = {name: path, path: path, children: files, isDirectory: true};
                self._treeList = new TreeList(data, "#file-browser", true);
                self._treeList.addListener("SelectedItemChanged", function (event) {
                    var data = event.data;
                    if (data.isDirectory && !data.children && !data._children) {
                        getRemoteDirectory(data.path)
                            .then(function (files) {
                                data.children = files;
                                self._treeList.render(data);
                            }).catch(function (err) {
                                console.log(err);
                            });
                    }
                });
            });
        return new Promise(function (resolve, reject) {
            view.on("cancel", function (event, view) {
                view.remove();
                reject();
            }).on("ok", function (event, view) {
                var selectedFiles = self._treeList.getSelectedItems();
                resolve(selectedFiles);
                view.remove();
            });
        });
    };
    
    
    module.exports = RemoteFileBrowser;
});
