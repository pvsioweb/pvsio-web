/**
 * @module Project
 * @description Specifies files and functionalities of a PVSio-web project.
 * @version 1.0
 * @author Patrick Oladimeji, Paolo Masci
 * @date 6/20/13 9:45:59 AM
 */
import { Connection } from "./Connection";
import { EventDispatcher } from "./EventDispatcher";
import { ProjectFile } from "./ProjectFile";
// import { PVSioWebContext } from "./PVSioWebClient";

export interface ProjectTree {
    path: string;
    name: string;
    children?: { [name: string]: ProjectTree };
    isDirectory?: boolean;
}

// WidgetManager       = require("pvsioweb/WidgetManager").getWidgetManager(),
// ScriptPlayer        = require("util/ScriptPlayer"),
// Descriptor			= require("../app/project/Descriptor"),
// Logger              = require("util/Logger"),
// MIME                = require("util/MIME"),
// fs                  = require("util/fileHandler"),
// Constants           = require("util/Constants"),
// NotificationManager = require("project/NotificationManager");

export class Project extends EventDispatcher {
    protected descriptors: { [fname: string]: ProjectFile } = {};
    // protected context: PVSioWebContext;
    protected connection: Connection;

    protected dirtyFlag: boolean = false;
    protected projectName: string;
    protected mainFile: string;
    protected prototypeImage: ProjectFile;

    /**
     * @description Constructor: creates a new PVSio-web project.
     * @param name {String} The PVSio-web project name.
     */
    constructor (name: string) {
        super();
        this.projectName = name;
    }

    activate (connection: Connection): boolean {
        this.connection = connection;
        this.installHandlers();
        return true;
    }

    dirty (flag?: boolean): void {
        if (flag !== undefined) {
            this.dirtyFlag = !!flag;
        } else {
            this.dirtyFlag = true;
        }
    }
    isDirty (): boolean {
        return this.dirtyFlag;
    }

    setProjectName (name: string): void {
        this.projectName = name;
    }
    getProjectName (): string {
        return this.projectName;
    }

    setMainFile (fname: string): void {
        const previous: string = this.mainFile;
        const current: string = fname;
        this.dirtyFlag = (previous !== current);
        this.mainFile = fname;
        if (this.dirtyFlag) {
            this.fire({ type: "ProjectMainSpecFileChanged", previous, current });
        }
    }

    /**
     * Sets up listeners for widget manager event for widget modification
     */
    protected installHandlers (): void {
        // this.context.widgetManager.on("WidgetModified", () => {
        //     this.dirtyFlag = true;
        //     const current: string = JSON.stringify(this.context.widgetManager.getWidgetDefinitions(), null, " ");
        //     this.fire({ type: "WidgetsFileChanged", current });
        // });
    };

    /**
     * @function saveFiles
     * @description Saves on disk the file descriptors passed as parameter.
     * @param descriptor {Array(Descriptor)} Array of file descriptor whose content needs to be saved on disk.
     * @param opt {Object} Options for the save function: overWrite (bool) defines whether the project can be overwritten.
     * @memberof module:Project
     * @instance
     */
    async saveFiles (descriptors: ProjectFile[], opt?: { overwrite?: boolean }): Promise<boolean> {
        let success: boolean = true;
        if (descriptors) {
            for (let i = 0; i < descriptors.length; i++) {
                success = success && await descriptors[i].saveFile(opt);
            }
        }
        return success;
    };

    /**
     * @function getImage
     * @description Gets the image file for the project
     * @returns {Descriptor} A project file descriptor specifying the prototype image defined in the project.
     * @memberof module:Project
     * @instance
     */
    getImage (): ProjectFile {
        return this.prototypeImage;
    };
    /**
     * @function getWidgetDefinitionFile
     * @description Gets the file in the project files list whose content is the definitions of widgets on the display
     * @returns {Descriptor} A project file descriptor specifying the input/output widgets defined in the project.
     * @memberof module:Project
     * @instance
     */
    getWidgetDefinitionFile (): ProjectFile {
        // const fname: string = path.join(this.projectName, Constants.widgetDefinitionsFile);
        // let res: ProjectFile = this.descriptors[fname];
        // if (!res) {
        //     res = new Descriptor(fname, "{}");
        //     this.descriptors[fname] = res;
        // }
        // return res;
        return null;
    };
    /**
     * @function getRecordedScripts
     * @description Gets the project file that represents the sequence of play scripts created for the project.
     * @returns {Descriptor} the project file representing a sequence of recording user actions
     * @memberof module:Project
     * @instance
     */
    getRecordedScripts (): ProjectFile {
        // const fname: string = path.join(this.projectName, Constants.scriptFile);
        // let res: ProjectFile = this.descriptors[fname];
        // if (!res) {
        //     res = new Descriptor(fname, "[]");
        //     this.descriptors[fname] = res;
        // }
        // return res;
        return null;
    };
    /**
     * @function getDescriptors
     * @description Gets the list of all file descriptors stored in the project.
     * @returns {Array<Descriptor>} a list of project files in the project
     * @memberof module:Project
     * @instance
     */
    getFiles (): ProjectFile[] {
        return Object.values(this.descriptors);
    };
    /**
     * @function getFolderStructure
     * @description Gets the folder structure of the project based on the list of file descriptors stored in the project._this function shows only file types specified in FilesFilter.
     * @returns {Object<{path: String, name: String, isDirectory: bool, children: Array<Object>}>}
     * @memberof module:Project
     * @instance
    */
    getFolderStructure () {
        // const root: ProjectTree = {
        //     path: this.projectName,
        //     name: this.projectName, 
        //     isDirectory: true
        // };
        // const fnames: string[] = Object.values(this.descriptors).filter((f: ProjectFile) => {
        //     return MIME.isSupportedFile(f.getFileExtension());
        // }).map((f: ProjectFile) => {
        //     return f.getPath();
        // }).sort();
        // for (let i = 0; i < fnames.length; i++) {
        //     const args = fnames[i].split("/");
        //     let ptr = root;
        //     args.forEach((d) => {
        //         ptr[d] = ptr[d] || {name: d, children: {}};
        //         ptr = ptr[d].children;
        //     });
        // }
        // const createStructure = (node: ProjectTree, parentName: string) => {
        //     if (node && node.children && Object.keys(node.children).length) {
        //         const res = Object.keys(node.children).map((key: string) => {
        //             let child: ProjectTree = node.children[key];
        //             child.path = parentName + "/" + child.name;
        //             child.children = getChildren(child.children, child.path);
        //             child.isDirectory = child.children !== undefined;
        //             return child;
        //         });
        //         return res;
        //     }
        //     return undefined;
        // }
        // if (tree[projectName]) {
        //     structure.children = getChildren(tree[projectName].children, projectName);
        // }
        // return structure;
    };
    /**
     * @function getFile
     * @description Gets the project file descriptor for the specified file.
     * @param path {String} File path of the file. The path is relative to the project folder.
     * @returns {Descriptor}
     * @memberof module:Project
     * @instance
     */
    getFile (fname: string): ProjectFile {
        const candidates: ProjectFile[] = Object.values(this.descriptors).filter((f: ProjectFile) => {
            return f.getFilePath() === fname;
        });
        return (candidates && candidates.length === 1) ? candidates[0] : null;
    };

    /**
     * @function fileExists
     * @description Checks if the file path passed as argument is stored on disk.
     * @param descriptor {Descriptor|String} The file descriptor whose existence shall be checked within the project.
     * @returns {Promise(bool)} The function returns a Promise that resolves to true if the file exists on disk, false otherwise.
     * @memberof module:Project
     * @instance
    */
    async fileExists (file: string | ProjectFile): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (file) {
                const path: string = (typeof file === "string") ? file : file.getFilePath();
                // WSManager.getWebSocket().send({
                //     type: "fileExists",
                //     path: path
                // }, (err, res) => {
                //     if (res) {
                //         console.log(res);
                //         resolve(res);
                //     } else {
                //         console.log(res);
                //         resolve(false);
                //     }
                // });
            } else {
                resolve(false);
            }
        });
    };

    /**
     * @function fileDescriptorExists
     * @description Checks if the file descriptor for the filepath passed as argument exists in the project.
     * @param descriptor {Descriptor|String} The file descriptor that shall be checked.
     *        Descriptors path is always relative to the folder of the current project.
     * @returns {Promise(bool)} The function returns true if the file descriptor is stored in the project, false otherwise.
     * @memberof module:Project
     * @instance
    */
    fileDescriptorExists (file: string | ProjectFile): boolean {
        if (file) {
            const fname: string = (typeof file === "string") ? file : file.getFilePath();
            return this.descriptors[fname] !== null;
        }
        return false;
    };


    // /**
    //  * @function addDescriptor
    //  * @description Adds a file descriptor to the current project.
    //  * @param newFile {Descriptor} The project file descriptor of the file.
    //  * @param suppressEvent {boolean} Flag for suppressing "FileAdded" events fired by the function.
    //  * @memberof module:Project
    //  * @instance
    //  */
    // //Project.prototype.addDescriptor = function (path, content, encoding, suppressEvent) {
    // Project.prototype.addDescriptor = function (newFile, suppressEvent) {
    //     var _this = this;
    //     var path, content, encoding;
    //     if (typeof arguments[0] === "string") {
    //         console.log("Deprecated: addDescriptor(string, string, string, boolean) is deprecated use addDescriptor(Descriptor, boolean) instead");
    //         path = arguments[0];
    //         content = arguments[1];
    //         encoding = arguments[2] || "utf8";
    //         suppressEvent = arguments[3];
    //         newFile = new Descriptor(path, content, { encoding: encoding });
    //     }
    //     // sanity check -- descriptors can be added to the current project only
    //     if (newFile.path.indexOf(_this.name()) !== 0) {
    //         var tmp = newFile.path.split("/").filter(function (e) { return e !== ""; });
    //         tmp = [_this.name()].concat(tmp);
    //         newFile.path = tmp.join("/");
    //     }
    //     if (!_this.getDescriptor(newFile.path)) {
    //         _descriptors.push(newFile);
    // //        } else {
    // //            console.log("Warning: Attempt to add a file with an existing path. '" +
    // //                            newFile.path + "' already exists in the project");
    //     }
    //     suppressEvent = suppressEvent;
    //     if (!suppressEvent) {
    //         _this.fire({type: "FileAdded", file: newFile});
    //     }
    //     //register event for the newspec and bubble up the dirty flag changed event from project
    //     newFile.addListener("DirtyFlagChanged", function () {
    //         _this.fire({type: "DirtyFlagChanged", file: newFile});
    //     });
    //     return newFile;
    // };

    // /**
    //  * @function addFolder
    //  * @description Creates the specified folder within the project folder.
    //  * @param dirPath {String} The path of the folder. The Project folder is used as base path.
    //  * @param opt {Object} Options: silentMode (bool) switches off messages from NotificationManager when true.
    //  * @returns {Promise} A Promise that resolves to the folder added.
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.addFolder = function (folderPath, opt) {
    //     var _this = this;
    //     return new Promise(function (resolve, reject) {
    //         var path = _this.name() + folderPath;
    //         WSManager.getWebSocket().writeDirectory(path, function (err, res) {
    //             if (err) {
    //                 var msg = "Folder " + err.path + " could not be created in project " +
    //                             _this.name() + JSON.stringify(err);
    //                 if (!opt || !opt.silentMode) {
    //                     NotificationManager.error(msg);
    //                 } else { Logger.log(msg); }
    //                 reject(err);
    //             } else {
    //                 var notification = "Folder " + res.path + " successfully added to project " + _this.name();
    //                 if (!opt || !opt.silentMode) {
    //                     NotificationManager.show(notification);
    //                 } else { Logger.log(notification); }
    //                 return resolve(new Descriptor(res.path, null, { isDirectory: true }));
    //             }
    //         });
    //     });
    // };

    // /**
    //  * @function addFile
    //  * @description Creates the specified file within the project folder.
    //  * @param file {Descriptor} The file to be added. Descriptor has the following properties:
    //  *           <li> path, a function that returns a String representing the file path.
    //  *                The path is relative to the current project folder.
    //  *                This property is mandatory, and the filename must be valid. </li>
    //  *           <li> content, a function that returns a String representing the content of the file.
    //  *                This property is mandatory.</li>
    //  *           <li> encoding, a function that returns a String representing the file encoding.
    //  *                Text files must have encoding "utf8". Image files must have encoding "base64".
    //  *                If unspecified, encoding "utf8" is used.</li>
    //  * @param opt {Object} Function options: overWrite, defines whether existing files shall be ovewritten when.
    //  *                     If overWrite is false or undefined and the file exists, the function returns an error
    //  *                     { type: "EEXIST", msg: String}
    //  * @returns {Promise(Descriptor)} A Promise that resolves to the descriptor passed as argument
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.addFile = function (name, content, opt) {
    //     var _this = this;
    //     if (!name) {
    //         return new Promise(function (resolve, reject) {
    //             console.log("ERROR while adding file: Incorrect file name (" + name + ")");
    //             reject({ type: "ERROR", msg: "Incorrect file name (" + name + ")"});
    //         });
    //     }
    //     var token = {
    //         path: _this.name() + "/" + name,
    //         name: name.split("/").slice(-1).join(""),
    //         content: content || "",
    //         encoding: (opt) ? (opt.encoding || "utf8") : "utf8",
    //         opt: opt
    //     };
    //     return new Promise(function (resolve, reject) {
    //         WSManager.getWebSocket().writeFile(token, function (err, res) {
    //             if (err) { return reject(err); }
    //             var notification = "File " + token.path + " added to project " + _this.name();
    //             NotificationManager.show(notification);
    //             resolve(new Descriptor(token.path, token.content, { encoding: token.encoding }));
    //         });
    //     });
    // };

    // Project.prototype.addFileDialog = function (name, content, opt) {
    //     var _this = this;
    //     return _this.addFile(name, content, opt).catch(function (err) {
    //         if (err.code === "EEXIST") {
    //             var overWrite = confirm("File " + name + " already exists. Overwrite file?");
    //             if (overWrite) {
    //                 opt = opt || {};
    //                 opt.overWrite = true;
    //                 return _this.addFile(name, content, opt);
    //             }
    //         }
    //     });
    // };

    // Project.prototype.importLocalFiles = function (fileList) {
    //     var _this = this;
    //     return new Promise(function (resolve, reject) {
    //         if (!fileList) { return resolve([]); }
    //         function addLocalFilesToProject(files) {
    //             return new Promise(function (resolve, reject) {
    //                 var promises = [];
    //                 files.forEach(function (file) {
    //                     var opt = {
    //                         encoding: file.encoding
    //                     };
    //                     promises.push(_this.addFileDialog(file.name, file.content, opt));
    //                 });
    //                 return Promise.all(promises).then(function (res) {
    //                     resolve(res);
    //                 });
    //             });
    //         }
    //         var promises = [], i = 0;
    //         for (i = 0; i < fileList.length; i++) {
    //             promises.push(fs.readLocalFile(fileList[i]));
    //         }
    //         return Promise.all(promises).then(function (res) {
    //             addLocalFilesToProject(res).then(function (res) {
    //                 resolve(res);
    //             });
    //         });
    //     });
    // };

    // /**
    //  * @function importRemoteFiles
    //  * @description Imports remote files into the current project.
    //  * @param {String} A comma-separated list of paths.
    //  *                 Paths can be either absolute (i.e., they start with "/") or relative to the projects folder
    //  * @memberof module:Project
    //  * @instance
    // */
    // Project.prototype.importRemoteFiles = function (paths) {
    //     var _this = this;
    //     if (paths) {
    //         paths = paths.split(",");
    //     }
    //     var imageExts = [".jpg", ".png", ".gif"];
    //     return new Promise(function (resolve, reject) {
    //         if (!paths) { return resolve([]); }

    //         function addFilesToProject(files) {
    //             var promises = files.map(function (file) {
    //                 return _this.addFileDialog(file.name, file.content, {encoding: file.encoding});
    //             });
    //             return Promise.all(promises);
    //         }

    //         var promises  = paths.map(function (d) {
    //             var ext = d.substr(d.lastIndexOf(".")).toLowerCase();
    //             var encoding = imageExts.indexOf(ext) > -1 ? "base64" : "utf8";
    //             return new Promise(function (resolve, reject) {
    //                 WSManager.getWebSocket().readFile({path: d, encoding: encoding}, function (err, res) {
    //                     if (err) {
    //                         reject(err);
    //                     } else { resolve(res); }
    //                 });
    //             });
    //         });

    //         Promise.all(promises).then(function (files) {
    //             return addFilesToProject(files);
    //         }).then(function (res) {
    //             resolve(res);
    //         }).catch(function (err) {
    //             reject(err);
    //         });
    //     });
    // };

    // /**
    //  * @function refreshDescriptor
    //  * @description Reloads property content of the descriptor if the property is non-null.
    //  * @param file {Descriptor} The refreshed file descriptor. File descriptors have the following properties:
    //  *           <li> path, a function that returns a String representing the file path.
    //  *                The path is relative to the current project folder.
    //  *                This property is mandatory, and the filename must be valid. </li>
    //  *           <li> content, a function that returns a String representing the content of the file.
    //  *                This property is mandatory.</li>
    //  *           <li> encoding, a function that returns a String representing the file encoding.
    //  *                Text files must have encoding "utf8". Image files must have encoding "base64".
    //  *                If unspecified, encoding "utf8" is used.</li>
    //  * @returns {Promise(Descriptor)} A Promise that resolves to the descriptor passed as argument
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.refreshDescriptor = function (descriptor) {
    //     var _this = this;
    //     if (descriptor && descriptor.path) {
    //         var f = _this.getDescriptors().filter(function (d) {
    //             return d.path === descriptor.path;
    //         });
    //         // refresh content only if the content was already loaded
    //         if (f.length > 0 && f[0].content) {
    //             return new Promise(function (resolve, reject) {
    //                 f[0].loadContent().then(function (content) {
    //                     f[0].content = content;
    //                     resolve(f[0]);
    //                 }).catch(function (err) {
    //                     reject(err);
    //                 });
    //             });
    //         }
    //         return new Promise(function (resolve, reject) {
    //             resolve(descriptor);
    //         });
    //     } else {
    //         return new Promise(function (resolve, reject) {
    //             reject({ type: "ERROR", msg: "Incorrect file descriptor " + JSON.stringify(descriptor)});
    //         });
    //     }
    // };

    // /**
    //  * @function removeFile
    //  * @description ...
    //  * ...
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.removeFile = function (name) {
    //     var _this = this;
    //     if (!name) {
    //         return new Promise(function (resolve, reject) {
    //             reject({ type: "ERROR", msg: "Incorrect file name " + name});
    //         });
    //     }
    //     var token = {
    //         name: name.split("/").slice(-1).join(""),
    //         path: _this.name() + "/" + name
    //     };
    //     return new Promise(function (resolve, reject) {
    //         WSManager.getWebSocket().deleteFile(token, function (err) {
    //             if (!err) {
    //                 // note: file system watcher will take care of populating file tree view
    //                 var notification = "File " + name + " removed from project.";
    //                 NotificationManager.show(notification);
    //                 // f.clearListeners(); --TODO: check if this is actually needed
    //                 resolve(name);
    //             } else {
    //                 // reject with error
    //                 reject(err);
    //                 NotificationManager.error(err);
    //             }
    //         });
    //     });
    // };

    // /**
    //  * @function removeFolder
    //  * @description Removes (that is, deletes) the specified folder from the project folder.
    //  * @param folderPath {String} The path to the folder that shall be removed.
    //  *        The path is relative to the folder of the current project.
    //  * @returns {Promise(String)} A Promise that resolves to a string specifying the removed folder path.
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.removeFolder = function (path) {
    //     return new Promise(function (resolve, reject) {
    //         WSManager.getWebSocket().deleteDirectory(path, function (err) {
    //             if (!err) {
    //                 var notification = "Folder " + path + " removed from project.";
    //                 NotificationManager.show(notification);
    //                 resolve(path);
    //             } else {
    //                 //show error
    //                 NotificationManager.error(err);
    //                 reject(err);
    //             }
    //         });
    //     });
    // };

    // /**
    //  * @function removeDescriptor
    //  * @description Removes the specified file descriptor from the project.
    //  * @param file {Descriptor} The file descriptor that shall be removed.
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.removeDescriptor = function (file) {
    //     var fileIndex = _descriptors.indexOf(file);
    //     if (fileIndex >= 0) {
    //         var deletedFile = _descriptors.splice(fileIndex, 1)[0];
    //         this.fire({ type: "FileRemoved", file: deletedFile});
    //         return deletedFile;
    //     } else {
    //         NotificationManager.error("Error deleting file. File not found in project.");
    //         return null;
    //     }
    // };

    // /**
    //  * @function setProjectName
    //  * @description Sets the project name.
    //  * @param projectName {String} The project name.
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.setProjectName = function (projectName) {
    //     this.name(projectName);
    // };

    // /**
    //  * @function updateDescriptorsPath
    //  * @description Updates the path specified in a folder descriptor.
    //  *              The function updates all descriptors of files and folder contained
    //  *              in the folder associated with the descriptor.
    //  * @param folderPath {String} The path to the folder whose descriptor should be updated.
    //  * @param newFolderPath {String} The new path that shall be used for the folder descriptor.
    //  */
    // Project.prototype._updateDescriptorsPath = function (folderPath, newFolderPath) {
    //     var descriptors = this.getDescriptors();
    //     if (descriptors) {
    //         var affectedFiles = this.getDescriptors().filter(function (f) {
    //             return f.path.indexOf(folderPath) === 0;
    //         });
    //         affectedFiles.forEach(function (f) {
    //             f.path = f.path.replace(folderPath, newFolderPath);
    //         });
    //     }
    //     return this;
    // };

    // /**
    //  * @function renameFolder
    //  * @description Renames a directory in the project folder.
    //  * @param oldPath {String} The current path of the folder.
    //  * @param newPath {String} The new path of the folder.
    //  * @param cb {function} Call back function to invoke when the server function has returned
    //  * @memberof module:Project
    //  * @instance
    // */
    // Project.prototype.renameFolder = function (oldPath, newPath, cb) {
    //     var _this = this;
    //     WSManager.getWebSocket().send({
    //         type: "renameFile", // files and folders are treated the same way on the server
    //         oldPath: oldPath,
    //         newPath: newPath
    //     }, function (err, res) {
    //         if (!err) {
    //             // check if we are renaming the project
    //             if (oldPath === _this.name()) {
    //                 _this.name(newPath);
    //             }
    //             //update the paths of descriptors saved in the project
    //             _this._updateDescriptorsPath(oldPath, newPath);
    //         } else {
    //             Logger.log(err);
    //         }
    //         if (cb && typeof cb === "function") {
    //             cb(err, res);
    //         }
    //     });
    // };

    // /**
    //  * @function renameProject
    //  * @description Changes the project name.
    //  * @param newName {String} The new project name.
    //  * @param cb {function} Call back function to invoke when the server function has returned. The second argument of the callback is the renamed project.
    //  * @memberof module:Project
    //  * @instance
    // */
    // Project.prototype.renameProject = function (newName, cb) {
    //     var _this = this;
    //     var oldName = _this.name();
    //     WSManager.getWebSocket().send({
    //         type: "renameProject",
    //         oldPath: oldName,
    //         newPath: newName
    //     }, function (err, res) {
    //         if (!err) {
    //             //update the paths of descriptors saved in the project
    //             _this._updateDescriptorsPath(oldName, newName);
    //             // update the project name and the dirty flag
    //             _this.name(newName);
    //             _this._dirty(false);
    //         } else {
    //             Logger.log(err);
    //         }
    //         if (cb && typeof cb === "function") {
    //             cb(err, _this);
    //         }
    //     });
    // };


    // /**
    //  * @function renameFile
    //  * @description Renames a file stored in the project folder.
    //  * @param file {Descriptor} The file that shall be renamed.
    //  * @param newName {String} The new name that shall be given to the file.
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.renameFile = function (file, newName, cb) {
    //     var _this = this;
    //     var ws = WSManager.getWebSocket();
    //     var baseDir = file.path.substring(0, file.path.lastIndexOf("/")),
    //         newPath = baseDir + "/" + newName,
    //         oldPath = file.path;
    //     ws.send({type: "renameFile", oldPath: oldPath, newPath: newPath}, function (err, res) {
    //         if (!err) {
    //             file.path = newPath;
    //             _this.fire({type: "SpecFileRenamed", file: file});
    //             Logger.log("File " + oldPath + " has been renamed to " + newPath);
    //         } else {
    //             Logger.log(err);
    //         }
    //         if (cb && typeof cb === "function") {
    //             cb(err, res);
    //         }
    //     });
    // };


    // /**
    //  * @function save
    //  * @description Saves all project files to disk.
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.saveProject = function (opt) {
    //     opt = opt || {};
    //     opt.filter = opt.filter || function (desc) { return true; };
    //     var _this = this;
    //     return new Promise(function (resolve, reject) {
    //         console.log(_this.getDescriptors().filter(opt.filter));
    //         _this.saveFiles(_this.getDescriptors().filter(opt.filter), { overWrite: true }).then(function (res) {
    //             _this._dirty(false);
    //             resolve(_this);
    //         }).catch(function (err) {
    //             console.error(err);
    //             reject(err);
    //         });
    //     });
    // };

    // /**
    // * Returns a list of project files that are pvs files
    // */
    // Project.prototype.pvsFilesList = function () {
    //     return _descriptors.filter(function (f) {
    //         return f.isPVSFile();
    //     });
    // };



    // /**
    //     Adds a script to the project
    // */
    // Project.prototype.addScript = function (script) {
    //     var scriptFile = this.getRecordedScripts(), scriptJson;
    //     if (!scriptFile.content || scriptFile.content.trim().length === 0) {
    //         scriptJson = [];
    //     } else {
    //         scriptJson = JSON.parse(scriptFile.content);
    //     }
    //     scriptJson.push(script);
    //     ScriptPlayer.addScriptToView(script);
    //     scriptFile.content = JSON.stringify(scriptJson, null, " ");
    //     scriptFile.dirty(true);
    //     this._dirty(true);
    // };
    // /**
    //  * Overrides toString() method for Project
    //  * @returns {string} project name
    //  */
    // Project.prototype.toString = function () {
    //     return this.name();
    // };

    // /**
    //  * @function initFromJSON
    //  * @description Initialises the project with the file descriptors passed as argument.
    //  * @param descriptors {Array(Descriptors)} File descriptors that shall be added to the project.
    //  * @return {Project}
    //  * @memberof module:Project
    //  * @instance
    //  */
    // Project.prototype.initFromJSON = function (descriptors) {
    //     var _this = this;

    //     if (descriptors && descriptors.length) {
    //         var name = _this.name();
    //         var mainFileName, prototypeImage, fileVersion;
    //         var imageDescriptors = [];
    //         descriptors.forEach(function (file) {
    //             if (file && file.path && file.name) {
    //                 _this.addDescriptor(file);
    //                 if (file.encoding === "base64") { imageDescriptors.push(file); }
    //                 if (file.name === "pvsioweb.json" && file.content) {
    //                     mainFileName = JSON.parse(file.content).mainPVSFile;
    //                     fileVersion = JSON.parse(file.content).version;
    //                     prototypeImage = JSON.parse(file.content).prototypeImage;
    //                 }
    //             }
    //         });
    //         if (fileVersion && parseFloat(fileVersion) >= 2) {
    //             // set the main pvs file descriptor
    //             if (mainFileName) {
    //                 var main = _this.getDescriptor(name + "/" + mainFileName);
    //                 if (main) { _this.mainPVSFile(main); }
    //             }
    //             // set the prototype image descriptor
    //             if (prototypeImage) {
    //                 var image = _this.getDescriptor(name + "/" + prototypeImage);
    //                 if (image) { _this.prototypeImage = image; }
    //             }
    //         } else { // this code is for backwards compatibility
    //             if (mainFileName) {
    //                 var mainX = _this.getDescriptor(name + "/" + mainFileName);
    //                 if (mainX) {
    //                     _this.mainPVSFile(mainX);
    //                 } else if (_this.pvsFilesList()[0]) {
    //                     _this.mainPVSFile(_this.pvsFilesList()[0]);
    //                 }
    //             } else if (_this.pvsFilesList()[0]) {
    //                 _this.mainPVSFile(_this.pvsFilesList()[0]);
    //             }
    //             // set the prototype image descriptor
    //             if (prototypeImage) {
    //                 var imageX = _this.getDescriptor(name + "/" + prototypeImage);
    //                 if (imageX) {
    //                     _this.prototypeImage = imageX;
    //                 } else if (imageDescriptors.length > 0) { // this is for backwards compatibility with old projects
    //                     _this.prototypeImage = imageDescriptors[0];
    //                 }
    //             } else if (imageDescriptors.length > 0) { // this is for backwards compatibility with old projects
    //                 _this.prototypeImage = imageDescriptors[0];
    //             }
    //         }
    //     }
    //     return _this;
    // };

    // Project.prototype.cleanup = function () {
    //     WidgetManager.off(null, null, this);
    // };
}
