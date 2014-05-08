/**
 * Renders a folder and the list of files and any folders within it.
 * @author Patrick Oladimeji
 * @date 1/14/14 11:53:17 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, unparam: true*/
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var eventDispatcher = require("util/eventDispatcher"),
        property                = require("util/property"),
        WSManager				= require("websockets/pvs/WSManager"),
        QuestionForm            = require("pvsioweb/forms/displayQuestion"),
        TreeList                = require("./TreeList");
    
    var folderData, elementId, project, ws = WSManager.getWebSocket(), fileCounter = 0, unSavedName = "Untitled", treeList;
    
    /**
        utility function to convert filenames to valid html ids
        @param {string} fileName the path to convert
        @return {string} a string valid for use as an html element id
    */
    function fileNameToId(fileName) {
        var res = fileName.replace(/[\s\.\$\/]/gi, "_");
        return res;
    }
    
    function FileTreeView(_elId, folderData, _project) {
        eventDispatcher(this);
        var ftv = this;
        elementId = _elId;
        project = _project;
    
        treeList = new TreeList(folderData, elementId);
        treeList.addListener("SelectedItemChanged", function (event) {
            var e = {type: "SelectedFileChanged", selectedItem: event.data};
            ftv.fire(e);
        }).addListener("Rename", function (event) {
            var oldPath = event.data.path,
                f = project.pvsFiles()[oldPath];
            treeList.createNodeEditor(event.data, function (node) {
                if (event.data.isDirectory) {
                    project.renameFolder(oldPath, node.path, function () { 
                        if (oldPath == project.path()) {
                            // we are renaming the project
                            project.name(node.name);
                        }
                    });
                } else {
                    //rename file on disk
                    project.renameFile(f, node.name, function () {});
                }
            });
        }).addListener("New File", function (event) {
            var name = unSavedName + fileCounter++ + ".pvs";
            var newFileData = {name: name, path: event.data.path + "/" + name };
            newFileData = treeList.addItem(newFileData, event.data);
            treeList.selectItem(newFileData.path);
            treeList.createNodeEditor(newFileData, function (node) {
                ws.writeFile({fileName: node.path, fileContent: ""}, function (err, res) {
                    if (!err) {
                        //add the spec file to the project and supress the event so we dont create multiple files
                        project.addSpecFile(node.path, "", true);
                    } else { console.log(err); }
                });
            }, function (node) {
                treeList.removeItem(node.path);
            });
        }).addListener("New Folder", function (event) {
            var name = unSavedName + fileCounter++;
            var newFolderData = {name: name, path: event.data.path + "/" + name, children: [], isDirectory: true};
            newFolderData = treeList.addItem(newFolderData, event.data);
            treeList.createNodeEditor(newFolderData, function (node) {
                ws.writeDirectory(node.path, function (err, res) {
                    if (!err) {
                        console.log(res);
                    } else { console.log(err); }
                });
            }, function (node) {
                treeList.removeItem(node.path);
            });
        }).addListener("Delete", function (event) {
            var path = event.data.path;
            QuestionForm.create({header: "Confirm Delete", question: "Are you sure you want to delete " + path})
                .on("ok", function (e, view) {
                    //send request to remove file using the wsmanager
                    ws.send({type: "deleteFile", fileName: path}, function (err, res) {
                        if (!err) {
                            treeList.removeItem(path);
                        } else {
                            //show error
                            console.log(err);
                        }
                    });
                    view.remove();
                }).on("cancel", function (e, view) { view.remove(); });
        });

        //if there is a project add listener to changes to files etc
        if (project) {
            project.addListener("SpecDirtyFlagChanged", function (event) {
                console.log(event);
                var file = event.file;
                //set file as dirty
                treeList.markDirty(file.path(), file.dirty());
            }).addListener("ProjectMainSpecFileChanged", function (event) {
               //change the main file class
                
            }).addListener("SpecFileAdded", function (event) {
                //add the new file to the tree list data
                treeList.addItem({name: event.file.name(), path: event.file.path()});
            }).addListener("SpecFileRemoved", function (event) {
                //delete the removed file from the tree list data
                ftv.deleteItem(event.file);
            });
        }
    }
    
    FileTreeView.prototype.deleteItem = function (file) {
        var path = typeof file === "string" ? file : file.path();
        treeList.removeItem(path);
    };
    
    /**
        Gets the undlerying treeList object. This would be useful if a direct access to manipulating
        the data in the treeList node is needed. The following calls are available
        selectItem
        addItem
        removeItem
        renameItem
        getSelectedItem
    */
    FileTreeView.prototype.getTreeList = function () {
        return treeList;
    };
    /**
        selects the file passed
    */
    FileTreeView.prototype.selectItem = function (file) {
        var path = typeof file === "string" ? file : file.path();
        treeList.selectItem(path);
    };
    
    /**
     * Renames the selected file to the name specified
     * @param {string} newName The newName to give the file.
     */
    FileTreeView.prototype.renameSelected = function (newName) {
        treeList.renameItem(treeList.getSelectedItem(), newName);
    };
    
    /**
        Gets the selected file in the treeview
        @returns {String} The full path to the selected file
     */
    FileTreeView.prototype.getSelectedItem = function () {
        var res = treeList.getSelectedItem();
        return res ? res.path : undefined;
    };
    
    
    module.exports = FileTreeView;
});
