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
        WSManager				= require("websockets/pvs/WSManager");
    
    var folderData, elementId, project, ws = WSManager.getWebSocket(), fileCounter = 0;
    
    /**
        utility function to convert filenames to valid html ids
        @param {string} fileName the path to convert
        @return {string} a string valid for use as an html element id
    */
    function fileNameToId(fileName) {
        var res = fileName.replace(/[\s\.\$\/]/gi, "_");
        return res;
    }
    
    function removeNode(node) {
        var t = $(elementId).jstree(true);
        //show confirmation dialog
        
        //send request to remove file using the wsmanager
        ws.send({type: "deleteFile", fileName: node.original.file}, function (err, res) {
            if (!err) {
                t.delete_node(node);
            } else {
                //show error
                console.log(err);
            }
        });
    }
    
    function renameNode(node) {
        var t = $(elementId).jstree(true);
        t.edit(node);
    }
    
    function addNode(node, nodetype) {
        var t = $(elementId).jstree(true);
        var newNode = t.create_node(node, nodetype);
        if (newNode) {
            t.edit(newNode);
        }
    }
    
    function addFolder(node) {
        addNode(node, {text: "Unititled" + fileCounter++, isDirectory: true});
    }
    
    function addFile(node) {
        addNode(node, {text: "Unititled" + fileCounter++, isDirectory: false});
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
                    
                }
            },
            newFolder: {
                label: "New Folder",
                action: function () {
                    
                }
            }
        };
        if (node.original.isDirectory) {
            delete items.deleteItem;
        }
        return items;
    }
    
    //set default tree property
    $.jstree.defaults.core = {
        themes: { variant: "small", stripes: true, icons: true},
        multiple: false,
        check_callback: true// function (op, node, node_parent, node_position) {
            //op can be create_node, rename_node, delete_node, move_node or copy_node
            //only allow rename node for now
//            return true; //op === "rename_node" ? true : false;
//        }
    };
   
    /**
        parses the folderstructure and returns a tree that can be used by jstree
    */
    function jsTreeData(folderStructure, parent, project) {
        var id = fileNameToId(folderStructure.name.substr(project.path().length + 1));
        var res = {text: folderStructure.isDirectory ? folderStructure.name.substr(parent.length) :
                    folderStructure.name.substr(parent.length + 1),
                   file: folderStructure.name, id: id,
                   isDirectory: folderStructure.isDirectory};
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
        folderData = jsTreeData(folderStructure, folderStructure.name, project);
        $(elementId).jstree({
            core: {
                data: folderData.children
            },
            types: {
                dirty: {icon: "glyphicon glyphicon-asterisk"},
                main: {icon: "glyphicon glyphicon-star"},
                "default" : {icon: "glyphicon "}
            },
            plugins: ["types", "contextmenu"],
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
            if (data.old.indexOf("Untitled") === 0) {
               // var newName
            } else {
                var fileRef = project.getSpecFile(data.node.original.file);
                if (fileRef.name() !== data.text) {
                    //rename file on disk
                    project.renameFile(fileRef, data.text);
                }
            }
        });
        //if there is a project add listener to changes to files etc
        if (project) {
            project.addListener("SpecDirtyFlagChanged", function (event) {
                console.log(event);
                var file = event.file;
                var t = $(elementId).jstree(true);
                var selection = t.get_selected(true);
                var flag = file.dirty() ? "dirty" : "default";
                flag += project.mainPVSFile() === file ? " main" : "";
                if (selection) {
                    t.set_type(selection, flag);
                }
            });
        }
    }
    
    FileTreeView.prototype.selectItem = function (item) {
        var t = $(elementId).jstree(true);
        var id = project ? item.path().substr(project.path().length + 1) : item.name();
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
