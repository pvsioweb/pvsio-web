/**
 * Utility functions used by the pvsiowebServer for dealing with filesystem etc
 * @author Patrick Oladimeji, Paolo Masci
 * @date 6/26/14 11:29:07 AM
 */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const imageExts: string[] = [".jpg", ".jpeg", ".png"];
const baseProjectDir: string = path.join(__dirname, "../../examples/projects/");
const filesFilter: string[] = [".pvs", ".tex", ".txt", ".i", ".json"].concat(imageExts);

/**
 * Recursively creates a directory structure while ensuring that any non-existent parent folders
 * are created as necessary. E.g., to create /temp/foo/foo/test in the directory /temp without a foo
 * directory, the function ensures that the appropriate parent directories foo/foo are created
 * @param {string} dirPath the path to the directory to create
 * @param {function (err)} cb the callback function to invoke when the directory creation is complete
 */
export async function mkdirRecursive(dirPath: string, cb?: (error?: NodeJS.ErrnoException) => void): Promise<boolean> {
   try {
        execSync(`mkdir -p ${dirPath}`);
        return true;
    } catch (mkdirErr) {
        console.error(mkdirErr);
        return false;
    }
}
/**
 * Get the stat for the file in the specified path
 * @returns {Promise} a promise that resolves with the stat object of the file
 * see http://nodejs.org/api/fs.html#fs_class_fs_stats for details
 */
export async function stat(fullPath: string): Promise<fs.Stats> {
    console.log(`[server-functions] stat ${fullPath}`);
    return fs.statSync(fullPath);
}
/**
 * Reads the content of the file at the specified fullPath
 * @param {String} fullPath the full path to the file to read
 * @param {String} encoding the encoding of the file being read (default is utf8)
 * @returns {Promise} a promise that resolves with the content of the file
*/
export async function readFile(fullPath: string, encoding?: "base64" | "utf8"): Promise<string> {
    encoding = encoding || "utf8";
    return new Promise((resolve, reject) => {
        fs.readFile(fullPath, { encoding }, (err, content) => {
            if (err) {
                console.error(err);
                resolve("");
            } else {
                if (encoding === "base64") {
                    const ext: string = path.extname(fullPath).toLowerCase();
                    resolve("data:image/" + ext.substr(1).toLowerCase() + ";base64," + content);
                } else {
                    resolve(content);
                }
            }
        });
    });
}

/**
 * Checks whether or not a path points to an image
 * @param   {String} fullPath The full path to the file
 * @returns {boolean} true if the path points to a recognised image
 */
export function isImage(fullPath: string): boolean {
    if (fullPath) {
        const ext: string = path.extname(fullPath).toLowerCase();
        return imageExts.indexOf(ext) > -1;
    }
    return false;
}

export declare type NodeJSFileDescriptor = {
    path: string,
    name?: string,
    content?: string,
    encoding?: "base64" | "utf8",
    isDirectory?: boolean,
    size?: number,
    modified?: Date,
    created?: Date,
    err?: NodeJS.ErrnoException 
};

export function fileExists (fullPath: string): boolean {
    if (fs.existsSync(fullPath)) {
        try {
            const ans: fs.Stats = fs.statSync(fullPath);
            return !!ans?.isFile();
        } catch (error) {
            return false;
        }
    }
    return false;
}

export function fileOrFolderExists (fullPath: string): boolean {
    return fs.existsSync(fullPath);
}

/**
 * Writes a file with the specified content to the specified path. If the parent folders of the specified path
 * do not exist, they are created
 * @param {string} fullPath the full path to the file
 * @param {string} content the content of the file
 * @param {string?} encoding the encoding to use for writing the file (defaults to utf8)
 * @returns {Promise} a promise that resolves when file has been written or rejects when an error occurs
 */
export async function writeFile(fullPath: string, content: string, encoding?: "base64" | "utf8", opt?: { overWrite?: boolean }): Promise<NodeJSFileDescriptor> {
    encoding = encoding || "utf8";
    opt = opt || {};
    //remove prefixes from file content before saving images
    if (content && isImage(fullPath)) {
        content = content.replace(/^data:image\/(\w+);base64,/, "");
    }
    return new Promise((resolve, reject) => {
        const folder: string = fullPath.substring(0, fullPath.lastIndexOf(path.sep));
        mkdirRecursive(folder, (err: NodeJS.ErrnoException) => {
            if (!err || (err && err.code === "EEXIST")) {
                if ((opt.overWrite) || !fileExists(fullPath)) {
                    try {
                        fs.writeFileSync(fullPath, content, encoding);
                        resolve({ path: fullPath, content: content, encoding });
                    } catch (writeFileErr) {
                        console.error(writeFileErr);
                        resolve({ path: fullPath, err: writeFileErr });
                    }
                }
            }
            resolve({ path: fullPath, err });
        });
    });
}

export function removeFile (file: string, opt?: { contextFolder?: string }): boolean {
    const np: string = path.normalize(file);
    opt = opt || {};
    if (opt.contextFolder && !(np.indexOf(path.dirname(opt.contextFolder)) === 0)) {
        return false;
    }
    execSync(`rm -rf "${np}"`);
    return true;
};


/**
 * Recursively reads the files in a directory using promises
 * @param {string} fullPath the path to the directory to read
 * @param {array} filter a list of extensions for files whose contents we wish to get. If filter is null, false or undefined then no content will be returned for any files
 * @returns {Promise} a promise that resolves with an array of objects  for the files in the given directory.
 * The object may contain just path property or may include content if the getContent parameter was passed
 */
export async function getFolderTree(fullPath: string, filter?: string[]): Promise<NodeJSFileDescriptor[]> {
    const stats: fs.Stats =  await stat(fullPath);
    if (stats.isDirectory()) {
        return new Promise((resolve, reject) => {
            fs.readdir(fullPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    const promises = files.map((name) => {
                        const file: string = path.join(fullPath, name);
                        return getFolderTree(file, filter);
                    });

                    Promise.all(promises).then((res) => {
                        const flattened: NodeJSFileDescriptor[] = res.reduce((a: NodeJSFileDescriptor[], b: NodeJSFileDescriptor | NodeJSFileDescriptor[]) => {
                            if (Array.isArray(b)) {
                                return a.concat(b);
                            } else {
                                a.push(b);
                                return a;
                            }
                        }, []);
                        // we need to include the directory as well,
                        // otherwise the client will not see the directory it if it's empty
                        flattened.push({ path: fullPath, isDirectory: true });
                        resolve(flattened);
                    }, reject);
                }
            });
        });
    } else {
        //resolve with filename and content only for model files and images (they are listed in filter)
        return new Promise((resolve, reject) => {
            const ext: string = path.extname(fullPath).toLowerCase();
            const encoding: "base64" | "utf8" = isImage(fullPath) ? "base64" : "utf8";
            if (filter && filter.indexOf(ext) > -1) {
                fs.readFile(fullPath, { encoding }, (err: NodeJS.ErrnoException, data: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve([{
                            path: fullPath,
                            content: isImage(fullPath) ? ("data:image/" + ext.substr(1).toLowerCase() + ";base64," + data) : data,
                            encoding
                        }]);
                    }
                });
            } else {
                resolve([{
                    path: fullPath,
                    encoding
                }]);
            }
        });
    }
}

export type ProjectDescriptor = { name: string, descriptors?: NodeJSFileDescriptor[], image?: string }

/**
 * open a project with the specified projectName
 * @param {string} projectName the name of the project to open
 * @returns {Promise} a promise that resolves with data for the opened project
 */
export async function openProject(projectName: string): Promise<ProjectDescriptor> {
    console.debug("Opening project " + projectName + " ...");
    const projectPath: string = path.join(baseProjectDir, projectName);
    const res: ProjectDescriptor = { name: projectName };

    //get filepaths and their contents
    const files: NodeJSFileDescriptor[] = await getFolderTree(projectPath, filesFilter);
    if (files) {
        res.descriptors = files.filter((desc: NodeJSFileDescriptor) => {
            return !desc.isDirectory;
        }).map((desc: NodeJSFileDescriptor) => {
            desc.name = desc.path.split("/").slice(-1).join("");
            desc.path = desc.path.replace(projectPath, projectName);
            return desc;
        });
    }
    return res;
}

/**
 * Lists all the projects on the server by listing folder names in the projects directory
 * @return {Promise} a promise that resolves with a list of project names
 */
export async function listProjects(): Promise<ProjectDescriptor[]> {
    return new Promise((resolve, reject) => {
        const projects: ProjectDescriptor[] = [];
        fs.readdir(baseProjectDir, async (err: NodeJS.ErrnoException, files: string[]) => {
            if (err) {
                reject(err);
                return;
            }
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const file: string = files[i];
                    const stats: fs.Stats = await stat(path.join(baseProjectDir, file));
                    if (stats.isDirectory()) {
                        //get the image in the directory if any
                        const desc: ProjectDescriptor = await new Promise((res, rej) => {
                            fs.readdir(path.join(baseProjectDir, file), (err: NodeJS.ErrnoException, files: string[]) => {
                                if (!err) {
                                    const images: string[] = files?.filter((f: string) => {
                                        return isImage(f);
                                    });
                                    res({ name: file, image: (images && images.length) ? images[0] : null });
                                } else {
                                    res({ name: file, image: null });
                                }
                            });
                        });
                        if (desc) {
                            projects.push(desc);
                        }
                    }
                }
            }
            resolve(projects);
        });
    });
}

/**
 * renames the oldpath into the newPath
 * @returns {Promise} a promise that resolves with the new path name
 */
export async function renameFile(oldPath: string, newPath: string): Promise<boolean> {
    oldPath = path.join(baseProjectDir, oldPath);
    newPath = path.join(baseProjectDir, newPath);

    return new Promise((resolve, reject) => {
        stat(newPath).then((res: fs.Stats) => {
            resolve(false);
        }).catch((err: NodeJS.ErrnoException) => {
            if (err && err.code === "ENOENT") {
                //file does not exist so ok to rename
                fs.rename(oldPath, newPath, (err: NodeJS.ErrnoException) => {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            } else {
                resolve(false);
            }
        });
    });
}
