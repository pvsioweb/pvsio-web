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
 	baseProjectDir          = path.join(__dirname, "../../examples/projects/"),
	filesFilter = [".pvs", ".tex", ".txt", ".i", ".json"].concat(imageExts);

var noop = function () {};
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
    Reads the content of the file at the specified fullPath
    @param {String} fullPath the full path to the file to read
    @param {String} encoding the encoding of the file being read (default is utf8)
    @returns {Promise} a promise that resolves with the content of the file
*/
function readFile(fullPath, encoding) {
    encoding = encoding || "utf8";
    return new Promise(function (resolve, reject) {
        fs.readFile(fullPath, {encoding: encoding}, function (err, content) {
            if (err) {
                reject(err);
            } else {
                resolve(content);
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
///TODO clean up these parameters - propose to make into one json object with the parameters as properties of the object
function writeFile(fullPath, fileContent, fileEncoding, opt) {
	fileEncoding = fileEncoding || "utf8";
	//remove prefixes from file content before saving images
	var ext = path.extname(fullPath);
	if (imageExts.indexOf(ext.toLowerCase()) > -1) {
		fileContent = fileContent.replace(/^data:image\/(\w+);base64,/, "");
	}
	return new Promise(function (resolve, reject) {
		if (typeof fullPath !== "string" || typeof fileContent !== "string") {
			reject("Both fullPath and fileContent must be strings");
		} else {
			var folder = fullPath.substring(0, fullPath.lastIndexOf(path.sep));
			mkdirRecursive(folder, function (err) {
				if ((!err || err.code === "EEXIST") &&
                        (!fs.existsSync(fullPath) || opt !== undefined && opt.overWrite)) {
					fs.writeFile(fullPath, fileContent, fileEncoding, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve({filePath: fullPath, fileContent: fileContent, encoding: fileEncoding});
						}
					});
				} else {
                    logger.debug("Error: file " + fullPath + " already exists");
					reject(err);
				}

			});

		}
	});
}
/**
	Recursively reads the files in a directory using promises
	@param {string} fullPath the path to the directory to read
    @param {array} filter a list of extensions for files whose contents we wish to get. If filter is null, false or undefined then no content will be returned for any files
	@returns {Promise} a promise that resolves with an array of objects  for the files in the given directory.
    The object may contain just filePath prooperties or may include fileContent if the getContent parameter was passed
*/
function getFilesInDirectory(fullPath, filter) {
        return stat(fullPath).then(function (f) {
            if (f.isDirectory()) {
                return new Promise(function (resolve, reject) {
                    fs.readdir(fullPath, function (err, files) {
                        if (err) {
                            reject(err);
                        } else {
                            var promises = files.map(function (name) {
                                var filePath = path.join(fullPath, name);
                                return getFilesInDirectory(filePath, filter);
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
                //resolve with the filename and content
                return new Promise(function (resolve, reject) {
                    var ext = path.extname(fullPath).toLowerCase(),
                        isImage = imageExts.indexOf(ext) > -1;
                    var opt = {encoding: isImage ? "base64" : "utf8"};
                    if (filter && filter.indexOf(ext) > -1) {
                        fs.readFile(fullPath, opt, function (err, data) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({filePath: fullPath, fileContent: isImage ?
                                         ("data:image/" + ext.substr(1).toLowerCase() + ";base64," + data) : data, encoding: opt.encoding});
                            }
                        });
                    } else {
                        resolve({filePath: fullPath, encoding: opt.encoding});
                    }
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
					var ext = path.extname(file.filePath).toLowerCase();
					if (imageExts.indexOf(ext.toLowerCase()) > -1) {
						file.fileContent = file.fileContent.replace(/^data:image\/(\w+);base64,/, "");
					}
					if (file.filePath.indexOf(projectName) === 0) {
						file.filePath = path.join(baseProjectDir, file.filePath);
					} else {
						logger.debug("Warning, deprecated filenames (project name not included in the filename)");
						file.filePath = path.join(projectPath, file.filePath);
					}
					return writeFile(file.filePath, file.fileContent, file.encoding, { overWrite: true });
				});

				//exec promises and invoke callback function
				Promise.all(promises)
					.then(function (files) {
						obj.projectFiles = files.map(function (f) {
							f.filePath = f.filePath.replace(projectPath, projectName);
							return f;
						});
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
		getFilesInDirectory(projectPath, filesFilter)
			.then(function (files) {
				res.projectFiles = files.map(function (f) {
					f.filePath = f.filePath.replace(projectPath, projectName);
					return f;
				});
				resolve(res);
			}, reject);
	});
}

/**
 * Lists all the projects on the server by listing folder names in the projects directory
 * @return {Promise} a promise that resolves with a list of project names
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
							if (f.isDirectory() && file !== "defaultProject") {
								return new Promise(function (resolve, reject) {
									//get the image in the directory if any also dont return empty folders as projects
									fs.readdir(path.join(baseProjectDir, file), function (err, files) {
										if (err) {
											reject(err);
										} else {
											var image = files.filter(function (f) {
												return imageExts.indexOf(path.extname(f).toLowerCase()) > -1;
											})[0];
											var result = files.length ? {name: file, image: image} : null;
											resolve(result);
										}
									});
								});								
							} else { return Promise.resolve(null); }
						});
				})).then(function (files) {
					resolve(files.filter(function (f) { return f; }));
				}, reject);
			}
		});
	});
}

/**
 	renames the oldpath into the newPath
	@returns {Promise} a promise that resolves with the new path name
*/
function renameFile(oldPath, newPath) {
	oldPath = path.join(baseProjectDir, oldPath);
	newPath = path.join(baseProjectDir, newPath);

	return new Promise(function (resolve, reject) {
		stat(newPath).then(function () {
			reject("ENOTEMPTY");
		}, function () {
			//file does not exist so ok to rename
			fs.rename(oldPath, newPath, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve(newPath);
				}
			});
		});
	});
}

module.exports = {
	renameFile: renameFile,
	mkdirRecursive: mkdirRecursive,
	stat: stat,
    readFile: readFile,
	writeFile: writeFile,
	getFilesInDirectory: getFilesInDirectory,
	createProject: createProject,
	openProject: openProject,
	listProjects: listProjects
};
