/**
 * Utility functions used by the pvssocketserver for dealing with filesystem etc
 * @author Patrick Oladimeji
 * @date 6/26/14 11:29:07 AM
 */
/*jshint unused: true, undef: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, module, __dirname*/

var fs = require("fs"),
	path = require("path"),
	Promise                 = require("es6-promise").Promise,
	logger                  = require("tracer").console(),
	imageExts = [".jpg", ".jpeg", ".png"],
	baseProjectDir          = __dirname + "/public/projects/";

var noop = function () {};
function getFolderStructure(root) {
        var s = fs.statSync(root);
        var file = {path: root, name: root.substr(root.lastIndexOf("/") + 1)};
        if (s.isDirectory()) {
            var files = fs.readdirSync(root);
            file.isDirectory = true;
            file.children = files.map(function (f) {
                return getFolderStructure(path.join(root, f));
            });
            if (file.children) {
                file.children = file.children.filter(function (f) {
                    return (f.isDirectory && f.name !== "pvsbin") || f.name.split(".").slice(-1).join("") === "pvs";
                });
            }
            
            file.path = file.path.replace(baseProjectDir, "");
            return file;
        
        } else {
            file.path = file.path.replace(baseProjectDir, "");
            return file;
        }
    }
 /**
 * Recursively creates a directory structure while ensuring that any non-existent parent folders
 * are created as necessary. E.g., to create /temp/foo/foo/test in the directory /temp without a foo
 * directory, the function ensures that the appropriate parent directories foo/foo are created
 * @param {string} dirPath the path to the directory to create
 * @param {function (err)} cb the callback function to invoke when the directory creation is complete
 */
function mkdirRecursive(dirPath, cb) {
	cb = cb || noop;
	fs.mkdir(dirPath, function (error) {
		if (error && error.errno === 34) {
			// the callback will be invoked only by the first instance of mkdirRecursive
			var parentDirectory = dirPath.substr(0, dirPath.lastIndexOf("/"));
			mkdirRecursive(parentDirectory, function (err) {
				if (!err) {
					fs.mkdir(dirPath, cb);
				} else {
					cb(err);
				}
			});
		} else {
			// if the path has been created successfully, just invoke the callback function (if any)
			cb(error);
		}
	});
}
/**
 * Get the stat for the file in the specified path
 * @returns {Promise} a promise that resolves with the stat object of the file
  see http://nodejs.org/api/fs.html#fs_class_fs_stats for details
 */
function stat(fullPath) {
	return new Promise(function (resolve, reject) {
		fs.stat(fullPath, function (err, res) {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
}
/**
 Writes a file with the specified content to the specified path. If the parent folders of the specified path
 do not exist, they are created
 @param {string} fullPath the full path to the file
 @param {string} fileContent the content of the file
 @param {string?} fileEncoding the encoding to use for writing the file (defaults to utf8)
 @returns {Promise} a promise that resolves when file has been written or rejects when an error occurs
*/
function writeFile(fullPath, fileContent, fileEncoding) {
	fileEncoding = fileEncoding || "utf8";
	return new Promise(function (resolve, reject) {
		if (typeof fullPath !== "string" || typeof fileContent !== "string") {
			reject("Both fullPath and fileContent must be strings");
		} else {
			var folder = fullPath.substring(0, fullPath.lastIndexOf(path.sep));
			mkdirRecursive(folder, function (err) {
				if (!err || err.code === "EEXIST") {
					fs.writeFile(fullPath, fileContent, fileEncoding, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve({filePath: fullPath, fileContent: fileContent, encoding: fileEncoding});
						}
					});
				} else {
					reject(err);
				}

			});

		}
	});
}
/**
	Recursively reads the files in a directory using promises
	@param {string} fullPath the path to the directory to read
	@param {boolean} getContent a flag to set whehter or not to return the content of the file
	@returns {Promise} a promise that resolves with an array of objects  for the files in the given directory.
		The object may contain just filePath prooperties or may include fileContent if the getContent parameter was passed
*/
function getFilesInDirectory(fullPath, getContent) {
        return stat(fullPath).then(function (f) {
            if (f.isDirectory()) {
                return new Promise(function (resolve, reject) {
                    fs.readdir(fullPath, function (err, files) {
                        if (err) {
                            reject(err);
                        } else {
                            var promises = files.map(function (name) {
                                var filePath = path.join(fullPath, name);
                                return getFilesInDirectory(filePath, getContent);
                            });

                            Promise.all(promises)
                                .then(function (res) {
                                    var flattened = res.reduce(function (a, b) {
                                        if (Array.isArray(b)) {
                                            return a.concat(b);
                                        } else {
                                            a.push(b);
                                            return a;
                                        }
                                    }, []);
                                    resolve(flattened);
                                }, reject);
                        }
                    });
                });
            } else {
                if (!getContent) {
                    return Promise.resolve({filePath: fullPath});
                }
                //resolve with the filename and content
                return new Promise(function (resolve, reject) {
                    var ext = path.extname(fullPath),
                        isImage = imageExts.indexOf(ext.toLowerCase()) > -1;
                    var opt = {encoding: isImage ? "base64" : "utf8"};
                    fs.readFile(fullPath, opt, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({filePath: fullPath, fileContent: isImage ?
                                     ("data:image/" + ext.substr(1).toLowerCase() + ";base64," + data) : data, encoding: opt.encoding});
                        }
                    });
                });
            }
        }, function (err) {
            return Promise.reject(err);
        });
    }

/**
 * Creates a project
 * @param {Request} req
 * @param {Response} res
 */
function createProject(opt, cb, p) {
	var projectName = opt.projectName,
		projectPath = baseProjectDir + projectName,
		projectFiles = opt.projectFiles,
		overWrite = opt.overWrite;
	var obj = {type: "projectCreated"};

	function doCreate(cb) {
		cb = cb || noop;
		//create the project folder
		fs.mkdir(projectPath, function (err) {
			if (!err) {
				var promises = projectFiles.map(function (file) {
					var ext = path.extname(file.filePath);
					if (imageExts.indexOf(ext) > -1) {
						file.fileContent = file.fileContent.replace(/^data:image\/(\w+);base64,/, "");
					}
					if (file.filePath.indexOf(projectName) === 0) {
						file.filePath = path.join(baseProjectDir, file.filePath);
					} else {
						logger.debug("Warning, deprecated filenames (project name not included in the filename)");
						file.filePath = path.join(projectPath, file.filePath);
					}
					return writeFile(file.filePath, file.fileContent, file.encoding);
				});

				//exec promises and invoke callback function
				Promise.all(promises)
					.then(function (files) {
						obj.projectFiles = files.map(function (f) {
							f.filePath = f.filePath.replace(projectPath, projectName);
							return f;
						});
						// get project folder structure once all files have been wrtten
						obj.folderStructure = getFolderStructure(projectPath);
						// and make sure that the folder structure contains paths relative to baseProject
						obj.name = projectName;
						cb(obj);
					}, function (err) {
						obj.err = err;
						cb(obj);
					});

			} else {
				obj.err = err;
				cb(obj);
			}
		});
	}

	fs.mkdir(projectPath, function (err) {
		if (!err || (err.code === "EEXIST" && overWrite)) {
			p.removeFile(projectPath, function (err) {
				if (!err) {
					doCreate(cb);
				} else {
					obj.err = err;
					if (cb && typeof cb === "function") { cb(obj); }
				}
			});
		} else {
			obj.err = err;
			if (cb && typeof cb === "function") { cb(obj); }
		}
	});
}

/**
* open a project with the specified projectName
* @param {string} projectName the name of the project to open 
* @returns {Promise} a promise that resolves with data for the opened project
*/
function openProject(projectName) {
	logger.debug("Opening project " + projectName + " ...");
	var projectPath = path.join(baseProjectDir, projectName),
		res = { name: projectName };

	return new Promise(function (resolve, reject) {
		//get filepaths and their contents
		getFilesInDirectory(projectPath, true)
			.then(function (files) {
				res.projectFiles = files.map(function (f) {
					f.filePath = f.filePath.replace(projectPath, projectName);
					return f;
				});
				res.folderStructure = getFolderStructure(projectPath);
				resolve(res);
			}, reject);
	});
}

/**
 * Lists all the projects on the server by listing folder names in the projects directory
 * @return {Array<string>} A list of project names
 */
function listProjects() {
	return new Promise(function (resolve, reject) {
		fs.readdir(baseProjectDir, function (err, files) {
			if (err) {
				reject(err);
			} else {
				Promise.all(files.map(function (file) {
					return stat(path.join(baseProjectDir, file))
						.then(function (f) {
							if (f.isDirectory()) {
								return Promise.resolve(file);
							} else { return Promise.resolve(null); }
						});
				})).then(function (files) {
					resolve(files.filter(function (f) { return f; }));
				}, reject);
			}
		});
	});
}

module.exports = {
	getFolderStructure: getFolderStructure,
	mkdirRecursive: mkdirRecursive,
	stat: stat,
	writeFile: writeFile,
	getFilesInDirectory: getFilesInDirectory,
	createProject: createProject,
	openProject: openProject,
	listProjects: listProjects
};