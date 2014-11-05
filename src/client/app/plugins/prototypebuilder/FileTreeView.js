/**
 * Renders a folder and the list of files and any folders within it.
 * @author Patrick Oladimeji
 * @date 1/14/14 11:53:17 AM
 */
/*jshint unused: false*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, unparam: true*/
/*global define, d3*/
define(function (require, exports, module) {
    "use strict";
    var eventDispatcher = require("util/eventDispatcher"),
        QuestionForm    = require("pvsioweb/forms/displayQuestion"),
		NotificationManager = require("project/NotificationManager"),
        TreeList        = require("./TreeList");
    
    var elementId, project, projectManager, fileCounter = 0, folderCounter = 0,
        unSavedFileName = "untitled_file", unSavedFolderName = "untitled_folder", treeList;
    
	///FIXME Sort out the use of alert dialogs to notify errors here --
	///also are there client side checks we can do to prevent some errors
    function FileTreeView(_elId, folderData, _projectManager) {
        eventDispatcher(this);
        var ftv = this;
        elementId = _elId;
        project = _projectManager.project();
		projectManager = _projectManager;
    
        treeList = new TreeList(folderData, elementId);
        treeList.addListener("SelectedItemChanged", function (event) {
            var e = {type: event.type, selectedItem: event.data};
            ftv.fire(e);
        }).addListener("Rename", function (event) {
            treeList.createNodeEditor(event.data, function (node, oldPath) {
                var f = project.getProjectFile(oldPath);
                if (event.data.isDirectory) {
					if (oldPath !== node.path) {//we only want to rename folder if the name has actually been changed
						project.renameFolder(oldPath, node.path, function (err, res) {
							if (err) {
								// alert user
								if (err.message === "ENOTEMPTY") {
									alert("Error: the folder could not be renamed into " + err.newPath + " (another folder with the same name already exists). Please choose a different name");
								} else { alert(err.message); }
								// revert to previous name
								var prevData = event.data;
								prevData.path = oldPath;
								prevData.name = oldPath.substring(oldPath.lastIndexOf("/") + 1);
								treeList.createNodeEditor(prevData);
								// and trigger blur event to remove the overlay node used for renaming
								treeList.blur();
							} else {
								// the path of all affected nodes is automatically updated in project.renameFolder
								var projectFiles = project.getProjectFiles();
								treeList.render(projectFiles);
							}
						});
					}
                 
                } else {//renaming a file
					project.renameFile(f, node.name, function (err, res) {
						if (err) {
							alert(JSON.stringify(err));
							var prevData = event.data;
							prevData.path = oldPath;
							prevData.name = oldPath.substring(oldPath.lastIndexOf("/") + 1);
							treeList.createNodeEditor(prevData);
						}
					});
				}
            });
        }).addListener("New File", function (event) {
            var name = (fileCounter === 0) ? unSavedFileName + ".pvs" : unSavedFileName + "_" + fileCounter + ".pvs";
            fileCounter++;
            // make sure that the path is relative to the project folder
            var path = event.data.path + "/" + name;
            var newFileData = {name: name, path: path };
            newFileData = treeList.addItem(newFileData, event.data);
			
            treeList.createNodeEditor(newFileData, function (node, oldPath) {
				var file = projectManager.newTheoryFile(node.name, node.path);
				projectManager.addFile(file, true)
					.then(function () {
						treeList.selectItem(node.path);
					})
					.catch(function (err) {
						var message = "Error: file " + err.path +
							" could not be created (another file with the same name already exists). Please choose a different name";
						NotificationManager.error(message);
						// remove the created node from filetreeview
						var enteredItem = treeList.getSelectedItem();
						treeList.removeItemByID(enteredItem.id);
					});
            }, function (node) {
                treeList.removeItem(node.path);
            });
        }).addListener("New Folder", function (event) {
            var name = (folderCounter === 0) ? unSavedFolderName : unSavedFolderName + "_" + folderCounter;
            folderCounter++;
            // make sure that the path is relative to the project folder
            var path = event.data.path + "/" + name;
            var newFolderData = {name: name, path: path, children: [], isDirectory: true};
            newFolderData = treeList.addItem(newFolderData, event.data);
            treeList.selectItem(newFolderData.path);
            treeList.createNodeEditor(newFolderData, function (node) {
				projectManager.addFolder(node.path)
					.catch(function (err) {
						var message = "Error: file " + err.path +
							" could not be created (another file with the same name already exists). Please choose a different name";
						NotificationManager.error(message);
						// remove the created node from filetreeview
						var enteredItem = treeList.getSelectedItem();
						treeList.removeItemByID(enteredItem.id);
					});
            }, function (node) {
                treeList.removeItem(node.path);
            });
        }).addListener("Delete", function (event) {
            var path = event.data.path, isDirectory = event.data.isDirectory;
            if (path === project.name()) {
                alert("Cannot delete project root directory.");
                return;
            }
            var isMainFile = (project.mainPVSFile()) ? (path === project.mainPVSFile().path()) : false;
            QuestionForm.create({
                header: "Confirm Delete",
                question: (isMainFile) ? (path + " is currently set as Main File for the project. Are you sure you want to delete it?")
                                : ("Are you sure you want to delete " + path + "?"),
                buttons: ["Cancel", "Delete"]
            }).on("ok", function (e, view) {
				if (isDirectory) {
					projectManager.removeFolder(path)
						.then(function () {
							ftv.deleteItem(path);
						});
				} else {
					//remove the file from the project
					var pf = project.getProjectFile(path);
					projectManager.removeFile(pf)
						.then(function (f) {
							console.log(f);
						}, function (err) {
							console.log(err);
						});
				}
                if (isMainFile) {
                    project.mainPVSFile(null);
                    d3.select("#btnSetMainFile").attr("disabled", false);
                }
                view.remove();
            }).on("cancel", function (e, view) { view.remove(); });
        });

        //if there is a project add listener to changes to files etc
        if (project) {
            project.addListener("DirtyFlagChanged", function (event) {
                var file = event.file;
                //set file as dirty
                treeList.markDirty(file.path(), file.dirty());
            }).addListener("ProjectMainSpecFileChanged", function () {
               //change the main file class
                
            }).addListener("FileAdded", function (event) {
                //add the new file to the tree list data
                treeList.addItem({name: event.file.name(), path: event.file.path()});
            }).addListener("FileRemoved", function (event) {
                //delete the removed file from the tree list data
                ftv.deleteItem(event.file);
            });
        }
    }
    
    FileTreeView.prototype.fileExists = function (filepath) {
        return treeList.nodeExists(filepath);
    };
    
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
    
    /**
     * Renames the project
     * @param {string} newName The new project name.
     */
    FileTreeView.prototype.renameProject = function (newProjectName) {
        treeList.renameRoot(newProjectName);
    };


    module.exports = FileTreeView;
});
