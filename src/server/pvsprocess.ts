/**
Copyright (c) 2012

Patrick Oladimeji
This file is part of pvsio-web.

pvsio-web is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pvsio-web is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * javascript nodejs lib for communicating with pvs process
 * @author hogfather
 * @date Jul 27, 2012 12:54:38 AM
 */

import * as util from 'util';
import * as path from 'path';
import { ProcessWrapper } from './processwrapper';
import { ExecException } from 'child_process';

export type CallbackArgs = { type: "processReady" | "processExited", data: string[], error?: NodeJS.ErrnoException };
export type Callback = (args: CallbackArgs) => void;

export class PvsProcess {

	protected pvs: ProcessWrapper;
	protected contextFolder: string = path.join(__dirname, "../../examples/");
	protected output: string[] = [];
	protected filename: string;
	protected processReady: boolean = false;

	protected _silentMode: boolean = false; // used to turn off log messages when restarting pvsio
	

	readonly readyString: string = "<PVSio>";
	readonly garbageCollector: string[] = [";;; GC:", ";;; Finished GC"];
	readonly wordsIgnored: string[] = ["==>", this.readyString].concat(this.garbageCollector);


	constructor () {
		this.pvs = new ProcessWrapper();
	}

	/**
	 * get or set the workspace dir. this is the base directory of the pvs source code
	 * @param {String} dir
	 * @return {String} the current workspace directory
	 */
	workspaceDir (dir: string): PvsProcess {
		if (dir) {
			//logger.log(dir);
			dir = dir.substr(-1) !== "/" ? (dir + "/") : dir;
			this.contextFolder = dir;
			console.log("Workspace directory: " + this.contextFolder + "\n");
            process.chdir(this.contextFolder);
		}
		return this;
	};
	protected filterLines(lines: string[]): string[] {
		return lines?.filter(function (d) {
			return this.wordsIgnored.indexOf(d.trim()) < 0;
		});
	}

	protected arrayToOutputString(lines: string[]): string {
		return lines?.join("").replace(/,/g, ", ").replace(/\s+\:\=/g, ":=").replace(/\:\=\s+/g, ":=");
	}

	/**
	 * @function processDataFunc
	 * @desc This function is responsible for processing stream data from PVSio.
	 *       Supports parsing of one block of JSON output produced by PVSio within tags <JSON> .. </JSON>
     */
	processDataFunc () {
		let res = [];
		let json = [];
		let jsonStream = false;
		return (data, cb) => {			
			// console.log("processDataFunc()");
			if (data.indexOf("<JSON>") >= 0) {
				// console.log("json start");
				jsonStream = true;
				data = data.split("<JSON>").slice(1);
				data = data.join("");
				// console.log("init data: " + data);
			}
			if (jsonStream) {
				let complete = (data.indexOf("</JSON>") >= 0);
				if (complete) {
					let finalData = data.split("</JSON>")[0];
					data = data.split("</JSON>").slice(1).join("");
					// console.log("end data: " + data);
					json = json.concat(finalData);
					// console.log("rest: ", data);
					// callback is done in the other branch, when pvsio responds with the ready prompt <PVSio>
					jsonStream = false;
					// console.log("json end");
				} else {
					// console.log("data: " + data);
					json = json.concat(data);
					return false;
				}
			}
			let lines = data.trim().split("\n");
			// console.log("receiving pvsio output...", data);
			if (data.indexOf(this.readyString) >= 0) {
				// console.log("pvsio output complete");
				if (cb && typeof cb === "function") {
					res = res.concat(this.filterLines(lines));
					cb({
						pvsioOut: this.arrayToOutputString(res),
						jsonOut: (json.length > 0) ? json.join("") : null
					});
					res = [];
					json = [];
					return true;
				}
			} else {
				res = res.concat(this.filterLines(lines));
			}
			return false;
		};
	}

    async removeFile (file: string, callBack?: (error: ExecException) => void): Promise<void> {
        var np = path.normalize(file);
        if (np.indexOf(path.dirname(this.contextFolder)) === 0) {
            this.pvs.exec({ command: "rm -rf \"" + np + "\"", callBack });
        } else {
            const message: string = "cannot delete a folder outside the context of the current project";
            console.error(message);
            console.error(util.format("path: %s, workspace: %s, normalised Path: %s", file, this.contextFolder, np));
            callBack({
				name: "removeFile",
				message
			});
        }
    };
	/**
	 * starts the pvs process with the given sourcefile, then registers a data processor with the processwrapper.
     * The data processor function is used internally to match a command sent to the process with the corresponding
     * callback.
	 * @param {String} filename source file to load with pvsio
	 * @param {function} callback to call when process is ready or process exited
	 */
	start (file: string, callback: Callback): void {
		this.filename = file;
        const onDataReceived = (data: string) => {
			// this shows the original PVSio output
			console.log(data?.trim());
            if (!this.processReady) {
                const lines: string[] = data?.split("\n").map((d) => {
                    return d.trim();
                }) || [];
                const lastLine: string = lines[lines.length - 1];
                //copy lines into the output list ignoring the exit string, the startoutput string '==>'
                //and any blank lines
                this.output = this.output.concat(lines.filter((d) => {
                    return this.wordsIgnored.indexOf(d) < 0;
				}));
				
                if (lastLine.indexOf(this.readyString) >= 0) {
					//last line of the output is the ready string
                    callback({ type: "processReady", data: this.output });
                    this.processReady = true;
					this.pvs.dataProcessor(this.processDataFunc());
                }
            }
            this.output = [];
		}

		const onProcessExited = (error: NodeJS.ErrnoException) => {
			this.processReady = false;
			let msg = "";
            if (!this._silentMode) {
                if (error) {
                    if (error.code === "ENOENT") {
                        msg = "\n\n\n---------------------------------------------------\n\n\nError: PVS executable files are not on your PATH.\nPlease add the PVS executable files (pvs, pvsio and proveit) to your PATH.\n\nA way to do this is to create symbolic links to those files, and place the symbolic links in /usr/bin. For instance, if PVS is installed in /opt/PVS/pvs, the following commands executed in a Terminal window create the required symbolic links (note that you need to specify absolute paths):\n\nsudo ln -s /opt/PVS/pvs /usr/bin/pvs\nsudo ln -s /opt/PVS/pvsio /usr/bin/pvsio\nsudo ln -s /opt/PVS/proveit /usr/bin/proveit\n\n\n---------------------------------------------------";
                    } else {
                        msg = (error.code) ? "pvsio process exited with error code " + error.code + ".\n" + this.output.join("")
									: "pvsio process exited with error code " + error + ".\n" + this.output.join("");
                    }
                } else { msg = "pvsio process exited cleanly.\n" + this.output.join(""); }
                console.error(msg);
            }
            this._silentMode = false;
			callback({ type: "processExited", data: [ msg ], error });
		}

		if (process.env.PORT) { // this is for the PVSio-web version installed on the heroku cloud -- !!NB!! the pvsio script needs to be manually updated to point to /app/PVS (the relocate script does not work with heroku)
		    this.pvs.start({
				processName: "/app/PVS/pvsio", 
				args: [ this.filename ],
				onDataReceived,
				onProcessExited
			});
		} else if (process.env.pvsdir) {
		    this.pvs.start({
				processName: path.join(process.env.pvsdir, "pvsio"), 
				args: [ this.filename ],
				onDataReceived,
				onProcessExited
			});
        } else {
		    this.pvs.start({
				processName: "pvsio", 
				args: [ this.filename ],
				onDataReceived,
				onProcessExited
			});
		}

		console.info("\n-------------------------------------\nPVSio process started with theory "
            + this.filename + "\n-------------------------------------");
        console.log("\nProcess context is " + this.contextFolder + "\n");
	};

	/**
	 * sends a command to the pvsio process. This method returns immediately. The result of the command
	 * will be by the 'on data' event of the process standard output stream
	 * @param {string} command the command to send to pvsio
	 */
	sendCommand (command: string, callback): void {
        console.log(command);
		this.pvs.sendCommand(command, callback);
	};

	/**
	 * closes the pvsio process
     * @param {string} signal The signal to send to the kill process. Default is 'SIGTERM'
	 */
	close (signal?: string, silentMode?: boolean) {
        this._silentMode = silentMode;
		signal = signal || 'SIGTERM';
		this.pvs.kill(signal);
	};
};
