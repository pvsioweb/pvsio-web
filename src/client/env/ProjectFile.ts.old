/**
 * @module Descriptor
 * @desc Descriptor for files and directories included in PVSio-web projects.
 * @author Patrick Oladimeji, Paolo Masci
 * @date 11/15/13 10:19:27 AM
 */

import { EventDispatcher } from './EventDispatcher';
import * as Utils from './Utils';
import { Connection, ReadFileRequest, WriteFileRequest } from './Connection';

export type FileEncoding = "utf8" | "base64";

export class ProjectFile extends EventDispatcher {
    protected dirtyFlag: boolean = false;
    protected visible: boolean = true;

    protected connection: Connection;

    protected fname: string;
    protected isDirectory: boolean;

    protected fileType: string;
    protected fileContent: string;
    protected fileEncoding: FileEncoding;

    // protected contentGenerator: () => string;
    
    /**
     * @constructor
     * @param {string} path The name of the file, i.e., the *relative path* from the project directory
     * @param {string} content the content of the file.
     */
    constructor (fname: string, fileContent: string, opt?: { isDirectory?: boolean, encoding?: FileEncoding }) {
        super();

        opt = opt || {};
        this.fname = fname;
        this.isDirectory = !!opt.isDirectory;

        if (!this.isDirectory) {
            this.fileType = "text/plain";
            this.fileContent = fileContent;
            this.fileEncoding = opt.encoding || this.getFileEncoding();
        }
    }

    activate (connection: Connection): void {
        this.connection = connection;
    }

    protected getFileEncoding (): FileEncoding {
        return this.isImage() ? "base64" : "utf8";
    }

    protected dirty (evt: { oldName: string, newName: string }): void {
        this.dirtyFlag = true;
        //fire event whenever the dirty flag changes
        this.fire({ type: "DirtyFlagChanged",  previous: evt.oldName, current: evt.newName, path: this.fname });
    }

    getFileExtension (): string {
        return Utils.getFileExtension(this.fname);
    }
    getFileName (): string {
        return Utils.getFileName(this.fname);
    }
    getFilePath (): string {
        return this.fname;
    }

    isImage (): boolean {
        return this.fileEncoding === "base64";
    };

    isPVSFile (): boolean {
        const ext: string = Utils.getFileExtension(this.fname);
        return ext === ".pvs";
    };
    /**
     * Overrides toString for Descriptor
     * @returns {String}
     */
    toString (): string {
        return JSON.stringify(this);
    };

    /**
     * @function getContent
     * @description Returns the file content. Clients should always use this function to retrieve the file content,
     * rather than reading field content --- field content can be null because the server does not always pass the file
     * content to optimise communication, and this function automatically handles this situation as follows:
     * if the descriptor's field content is non-null, then the value of field content is returned;
     * otherwise, the a request is sent to the server to retrieve the file content from disk. The exception to this is
     * if a content generator has been set for the Descriptor, in which case the generator function will always be used.
     */
    async getContent (): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.fileContent) {
                resolve(this.fileContent);
            } 
            // else if (this.contentGenerator) {
            //     // Generate the content if we have been provided with a generator function
            //     if (this.contentGenerator) {
            //         this.fileContent = this.contentGenerator();
            //     }
            //     resolve(_this.content);
            // } 
            else {
                const req: ReadFileRequest = {
                    type: "readFile",
                    encoding: this.fileEncoding,
                    path: this.fname
                }
                this.connection.sendRequest(req, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.fileContent = res.content;
                        resolve(this.fileContent);
                    }
                });
            }
        });
    };

    /**
     * @function setContentGenerator
     * @description Sets the function that should be used to lazily generate the descriptor's content. This can be used
     * with descriptors that represent content that is expensive to serialise, allowing the content to only be generated
     * when it is requested (when #getContent is called).
     * @param {function} generator Function that will be used to lazily generate the descriptor's content. Should return
     * a string.
     */
    // setContentGenerator (generator) {
    //     this.contentGenerator = generator;
    // };

    /**
     * @function saveFile
     * @description Saves the file descriptor on disk.
     * @param opt {?Object} Options
     *        <li>overwrite {bool} Defines whether the project can be overwritten. Default: false.</li>
     * @returns {Promise(Descriptor)} A Promise that resolves to the saved content.
     */
    async saveFile (opt?: { overwrite?: boolean }): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const content: string = await this.getContent();
            if (content) {
                const req: WriteFileRequest = {
                    type: "writeFile",
                    path: this.fname,
                    content: this.fileContent,
                    encoding: this.fileEncoding || "utf8",
                    opt: opt
                }
                this.connection.sendRequest(req, (err, res) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else {
                        this.dirtyFlag = false;
                        this.fire({ type: "DirtyFlagChanged", file: this });
                        resolve(true);
                    }
                });
            }
        });
    };
}
