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
        QuestionForm            = require("pvsioweb/forms/displayQuestion");
    
    var folderData, elementId, project, ws = WSManager.getWebSocket(), fileCounter = 0, unSavedName = "Untitled";
    
    /**
        utility function to convert filenames to valid html ids
        @param {string} fileName the path to convert
        @return {string} a string valid for use as an html element id
    */
    function fileNameToId(fileName) {
        var res = fileName.replace(/[\s\.\$\/]/gi, "_");
        return res;
    }
    
    function removeFile(node) {
        var t = $(elementId).jstree(true);
        t.delete_node(node);
        t.redraw(true);
    }
    
    function removeNode(node) {
        //show confirmation dialog
        QuestionForm.create({header: "Confirm Delete", question: "Are you sure you want to delete " + node.text})
            .on("ok", function (e, view) {
                //send request to remove file using the wsmanager
                ws.send({type: "deleteFile", fileName: node.original.file}, function (err, res) {
                    if (!err) {
                        removeFile(node);
                    } else {
                        //show error
                        console.log(err);
                    }
                });
                view.remove();
            }).on("cancel", function (e, view) { view.remove(); });
    }

    function hideNode(node) {
        var t = $(elementId).jstree(true);
        // show confirmation dialog
        QuestionForm.create({
            header: "Confirm Hide",
            question: "Are you sure you want to hide " + node.text
        }).on("ok", function (e, view) {
            // remove node from treeview
            t.delete_node(node);
            view.remove();
        }).on("cancel", function (e, view) { view.remove(); });
    }
    
    function renameNode(node) {
        var t = $(elementId).jstree(true);
        t.edit(node);
    }
    
    function addNode(node, nodeData, edit) {
        var t = $(elementId).jstree(true);
        if (typeof node === "string") {
            node = t.get_node(node);
        }
        t.deselect_all(true);
        if (node.original && node.original.isDirectory) {
            nodeData.folder = node.original.file;
        } else {
            //selected node is a file so we need to create the new node as a sibling element
            nodeData.folder = node.original.file.substring(0, node.original.file.lastIndexOf("/"));
            node = node.parent;
        }
        nodeData.file = nodeData.folder + "/" + nodeData.text;
        var newNode = t.create_node(node, nodeData);
        if (newNode && edit) {
            t.edit(newNode);
        }
    }
    
    function addFolder(node) {
        addNode(node, {text: unSavedName + fileCounter++, isDirectory: true}, true);
    }
    
    function addFile(node) {
        addNode(node, {text: unSavedName + fileCounter++, isDirectory: false}, true);
    }
    
    function contextMenuItems(node) {
        var items = {
            renameItem: {
                label: "Rename",
                action: function () {
                    console.log("rename");
                    renameNode(node);
                }
            },
            hideItem: {
                label: "Hide",
                action: function () {
                    console.log("hide");
                    hideNode(node);
                }
            },
            deleteItem: {
                label: "Delete",
                action: function () {
                    console.log("delete");
                    removeNode(node);
                }
            },
            newFile: {
                label: "New File",
                action: function () {
                    addFile(node);
                }
            },
            newFolder: {
                label: "New Folder",
                action: function () {
                    addFolder(node);
                }
            }
        };
        return items;
    }
    
    //set default tree property
    $.jstree.defaults.core = {
        themes: { variant: "small", stripes: false, icons: false},
        multiple: false,
        check_callback: true
    };
   
    /**
        parses the folderstructure and returns a tree that can be used by jstree
    */
    function jsTreeData(folderStructure, parent, project) {
        var id = fileNameToId(folderStructure.name.substr(project.path().length + 1)) || "project_root";
        var res = {text: folderStructure.name.substr(parent.length + 1),
                   file: folderStructure.name, id: id,
                   isDirectory: folderStructure.isDirectory,
                  folder: (folderStructure.isDirectory ? folderStructure.name : folderStructure.name.substring(0, folderStructure.name.lastIndexOf("/")))};
        if (res.isDirectory) {
            res.li_attr = {"class": "directory"};
        } else {
            res.li_attr = {"class": "file"};
        }
        
        if (folderStructure.children) {
            //allow only directories and .pvs files
            res.children = folderStructure.children.map(function (child) {
                return jsTreeData(child, folderStructure.name, project);
            }).filter(function (f) {
                return f.text.split(".").slice(-1).join("") === "pvs" || f.isDirectory;
            });
        }
        return res;
    }

    
    function FileTreeView(_elId, folderStructure, _project) {
        eventDispatcher(this);
        var ftv = this;
        elementId = _elId;
        project = _project;
    
        $(elementId).jstree("destroy");
        folderData = jsTreeData(folderStructure,
                                folderStructure.name.substring(0, folderStructure.name.lastIndexOf("/")), project);
        $(elementId).jstree({
            core: {
                data: folderData
            },
            plugins: ["contextmenu"],
            contextmenu: {
                items: contextMenuItems
            }
        });
        $(elementId).on("changed.jstree", function (e, data) {
            var event = {type: "SelectedFileChanged"};
            if (data.node) {
                event.name = data.node.text;
                if (data.node.original) {
                    event.selectedItem = data.node.original;
                }
            }
            ftv.fire(event);
        }).on("rename_node.jstree", function (e, data) {
            //this is called whenever user renames or creates a new node
            //it is a new node if the data starts with Unititled
            var newPath = data.node.original.folder + "/" + data.text;
            //if the file item is unsaved then write the file to the server then add the file to the project
            if (data.node.original.text.indexOf(unSavedName) === 0) {
                var t = $(elementId).jstree(true);//change the id of the inserted object and 
                var newNodeId = fileNameToId(newPath.substr(project.path().length + 1));
                t.set_id(data.node, newNodeId);
                //if adding directory or file update the node data accordingly
                if (data.node.original.isDirectory) {
                    ws.writeDirectory(newPath, function (err, res) {
                        if (!err) {
                            data.node.original.text = data.text;
                            data.node.original.file = newPath;
                            t.select_node(newNodeId);
                        } else { console.log(err); }
                    });
                } else {
                    ws.writeFile({fileName: newPath, fileContent: ""}, function (err, res) {
                        if (!err) {
                            project.addSpecFile(newPath, "");
                            data.node.original.text = data.text;
                            data.node.original.file = newPath;
                            t.select_node(newNodeId);
                        } else { console.log(err); }
                    });
                }
            } else if (data.node.original.text.trim() !== data.text.trim()) {//file name should be different before we attempt saving
                if (data.node.original.isDirectory) {
                    var oldPath = data.node.original.file;
                    newPath = oldPath.substr(0, oldPath.lastIndexOf("/")) + "/" + data.text;
                    project.renameFolder(oldPath, newPath, function () {
                        data.node.original.text = data.text;
                        data.node.original.file = newPath;
                    });
                } else {
                    var fileRef = project.getSpecFile(data.node.original.file);
                    if (fileRef.name() !== data.text) {
                        //rename file on disk
                        project.renameFile(fileRef, data.text, function () {
                            data.node.original.text = data.text;
                            data.node.original.file = newPath;
                        });
                    }
                }
            }
        });
        
        //open the root node of the project
        $(elementId).jstree(true).open_node(folderData.id);
        //if there is a project add listener to changes to files etc
        if (project) {
            project.addListener("SpecDirtyFlagChanged", function (event) {
                console.log(event);
                var file = event.file;
                var t = $(elementId).jstree(true);
                var selection = t.get_selected(true);
                if (selection) {
                    selection.forEach(function (s) {
                        var el =  $("#" + s.id);
                        if (file.dirty()) {
                            el.addClass("dirty");
                        } else {
                            el.removeClass("dirty");
                        }
                    });
                }
            }).addListener("ProjectMainSpecFileChanged", function (event) {
                var prevId = event.previous.path().substr(project.path().length + 1);
                var currId = event.current.path().substr(project.path().length + 1);
                $("#" + fileNameToId(prevId)).removeClass("main-file");
                $("#" + fileNameToId(currId)).addClass("main-file");
            }).addListener("SpecFileAdded", function (event) {
                //select the parent node for the file in the project
                var f = event.file, parentNode = f.path().substring(0, f.path().lastIndexOf("/"));
                var parentId = fileNameToId(parentNode.substr(project.path().length + 1) || "project_root");
                addNode(parentId, {text: f.name(), isDirectory: false});
            }).addListener("SpecFileRemoved", function (event) {
                var f = event.file, parentNode = f.path().substring(0, f.path().lastIndexOf("/"));
                var parentId = fileNameToId(parentNode);
                removeFile(parentId);
            });
        }
    }
    
    FileTreeView.prototype.selectItem = function (item) {
        var t = $(elementId).jstree(true);
        var id = item.path().substr(project.path().length + 1);
        id = fileNameToId(id);
        t.select_node(id);
    };
    
    /**
     * Renames the selected file to the name specified
     * @param {string} newName The newName to give the file.
     */
    FileTreeView.prototype.renameSelected = function (newName) {
        var t = $(elementId).jstree(true);
        var selected = t.get_selected(true);
        return t.rename_node(selected, newName);
    };
    
    /**
     * Deletes the selected file
     */
    FileTreeView.prototype.deleteSelected = function () {
        var t = $(elementId).jstree(true);
        var selected = t.get_selected(true);
        return t.delete_node(selected);
    };
    
    /**
        Gets the selected file in the treeview
        @returns {String} The full path to the selected file
     */
    FileTreeView.prototype.getSelectedItem = function () {
        var t = $(elementId).jstree(true);
        var selection = t.get_selected(true);
        return selection ? selection[0].original.file : undefined;
    };
    
    
    module.exports = FileTreeView;
});
