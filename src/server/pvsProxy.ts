import { spawn, ChildProcess, execSync } from 'child_process';
import * as path from 'path';

export const readyString: string = "<PVSio>";
export const garbageCollector: string[] = [";;; GC:", ";;; Finished GC"];
export const wordsIgnored: string[] = ["==>", readyString].concat(garbageCollector);

/**
 * Wrapper class for PVSio: spawns a PVSio process, and exposes the PVSio REPL interface as an asyncronous server.
 */
class PvsProcess {
	protected pvsioProcess: ChildProcess = null;

	protected pvsPath: string = null;
	protected pvsLibraryPath: string = null;
	protected ready: boolean = false;
	protected data: string = "";
	protected cb: (data: string) => void;

	/**
	 * utility function for sending error messages over the connection (if any connection is available)
	 * @param msg message to be sent
	 */
	protected error(msg: string): void {
		if (msg) {
			console.error('[pvsio-process] pvs-error', msg);
		}
	}

	/**
	 * @constructor
	 * @param desc Information on the PVS execution environment.
	 * @param connection Connection with the language client
	 */
	constructor (desc: { pvsPath: string }) {
		if (desc && desc.pvsPath) {
			this.pvsPath =  path.normalize(desc.pvsPath);
			this.pvsLibraryPath = path.join(this.pvsPath, "lib");
		}
	}

	getData (): string { return this.data; }
	resetData (): void { this.data = ""; }


	//----------------------------------------------------------------------------------------------------
	//--------------------- The following functions are the main APIs provided by PvsIoProcess
	//----------------------------------------------------------------------------------------------------

	/**
	 * Sends an expression at the PVSio prompt
	 * @param data Expression to be evaluated at the PVSio prompt 
	 */
	async sendText (data: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.cb = (data: string) => {
				resolve(data);
			}
			this.resetData();
			this.pvsioProcess.stdin.write(data);
		});
	}
	/**
	 * Sends the quit command (followed by a confirmation) to PVSio
	 */
	quit (): void {
		this.pvsioProcess.stdin.write("exit; Y\n");
	}
	/**
	 * Creates a new pvsio process.
	 * @param desc Descriptor indicating the pvs file and theory for this pvsio process
	 * @returns true if the process has been created; false if the process could not be created.
	 */
	async activate (desc: {
		fileName: string, 
		fileExtension: string, 
		contextFolder: string, 
		theoryName: string 
	}): Promise<boolean> {
		return new Promise (async (resolve, reject) => {
			if (this.pvsioProcess) {
				// process already running, nothing to do
				return Promise.resolve(true);
			}
			const pvsioExecutable = (this.pvsPath) ? path.join(this.pvsPath, "pvsio") : "pvsio";
			const fname: string = path.join(desc.contextFolder, `${desc.fileName}${desc.fileExtension}`);
			const args: string[] = [ `${fname}@${desc.theoryName}` ];
			// pvsio args
			console.info(`${pvsioExecutable} ${args.join(" ")}`);
			const fileExists: boolean = true;//await fsUtils.fileExists(pvsioExecutable);
			if (fileExists && !this.pvsioProcess) {
				this.pvsioProcess = spawn(pvsioExecutable, args);
				// console.dir(this.pvsProcess, { depth: null });
				this.pvsioProcess.stdout.setEncoding("utf8");
				this.pvsioProcess.stderr.setEncoding("utf8");
				this.pvsioProcess.stdout.on("data", (data: string) => {
					console.log(data);
					this.data += data;
					// console.dir({ 
					// 	type: "memory usage",
					// 	data: process.memoryUsage()
					// }, { depth: null });
					// console.log(data);

					// wait for the pvs prompt, to make sure pvs-server is operational
					// const match: RegExpMatchArray = /\s*<PVSio>\s*/g.exec(data);
					if (this.data.trim().endsWith(readyString)) {
						console.log("[pvsproxy] PVSio ready!");
						if (!this.ready) {
							this.ready = true;
							resolve(true);
						}
						if (this.cb && typeof this.cb === "function") {
							for (let i = 0; i < wordsIgnored.length; i++) {
								this.data = this.data?.replace(new RegExp(wordsIgnored[i], "g"), "");
							}		 
							this.cb(this.data?.trim());
						}
					}
				});
				this.pvsioProcess.stdin.on("data", (data: string) => {
					console.log("stdin", data);
				});
				this.pvsioProcess.stderr.on("data", (data: string) => {
					console.log("[pvsio-process] Error: " + data);
					this.error(data);
					// resolve(false);
				});
				this.pvsioProcess.on("error", (err: Error) => {
					console.log("[pvsio-process] Process error", err);
					// console.dir(err, { depth: null });
				});
				this.pvsioProcess.on("exit", (code: number, signal: string) => {
					console.log("[pvsio-process] Process exited");
					// console.dir({ code, signal });
				});
				this.pvsioProcess.on("message", (message: any) => {
					console.log("[pvsio-process] Process message");
					// console.dir(message, { depth: null });
				});
			} else {
				console.log(`\n>>> PVSio executable not found at ${pvsioExecutable} <<<\n`);
				resolve(false);
			}
		});
	}
	/**
	 * Utility function. Returns a string representing the ID of the pvs process.
	 * @returns String representation of the pvs process ID.
	 */
	protected getProcessID (): string {
		if (this.pvsioProcess && !isNaN(this.pvsioProcess.pid)) {
			return this.pvsioProcess.pid.toString();
		}
		return null;
	}
	/**
	 * Kills the pvsio process.
	 * @returns True if the process was killed, false otherwise.
	 */
	async kill (): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this.pvsioProcess) {
				const pvs_shell: string = this.getProcessID();
				// before killing the process, we need to close & drain the streams, otherwisae an ERR_STREAM_DESTROYED error will be triggered
				// because the destruction of the process is immediate but previous calls to write() may not have drained
				// see also nodejs doc for writable.destroy([error]) https://nodejs.org/api/stream.html
				this.pvsioProcess.stdin.destroy();
				// try {
				// 	execSync(`kill -9 ${pid}`);
				// } finally {
				// 	setTimeout(() => {
				// 		resolve(true);
				// 	}, 1000);
				// }
				try {
					execSync(`kill -9 ${pvs_shell}`);
					this.pvsioProcess.on("close", (code: number, signal: string) => {
						console.log("[pvs-process] Process terminated");
						resolve(true);
						// console.dir({ code, signal }, { depth: null });
					});
				} catch (kill_error) {
					console.log(`[pvsProcess] Warning: Could not kill process id ${pvs_shell}.`);
					resolve(false);
				} finally {
					this.pvsioProcess = null;
				}
			} else {
				resolve(true);
			}
		});
	}
}

export type PvsioResponse = { pvsioOut?: string, jsonOut?: string, error?: string };
export type FileDescriptor = { contextFolder: string, fileName: string, fileExtension: string };

export class PvsProxy {
	protected pvsPath: string;
	protected pvsLibPath: string; // internal libraries
	protected pvsLibraryPath: string; // external libraries
	protected proc: PvsProcess;
	protected contextFolder: string;
	protected pvsFile: FileDescriptor

	constructor (opt?: { pvsPath?: string, pvsLibraryPath?: string }) {
		opt = opt || {};
		this.pvsPath = opt.pvsPath;
		this.pvsLibraryPath = opt.pvsLibraryPath || "";
		// this.pvsLibPath = path.join(pvsPath, "lib");
	}
	async start (desc: FileDescriptor): Promise<boolean> {
		this.pvsFile = desc;
		const pvsioProcess: PvsProcess = new PvsProcess({ pvsPath: this.pvsPath });
		const success: boolean = await pvsioProcess.activate({
			fileName: desc.fileName, 
			fileExtension: desc.fileExtension,
			contextFolder: desc.contextFolder,
			theoryName: desc.fileName // filename and theoryname should be the same
		});
		if (success) {
			this.proc = pvsioProcess;
			this.contextFolder = desc.contextFolder;
			const data: string = pvsioProcess.getData();
			pvsioProcess.resetData();
			return true;
		}
		return false;
	}
	async sendCommand (cmd: string): Promise<PvsioResponse> {
		let res: { pvsioOut?: string, jsonOut?: string, error?: string } = { };
		if (!this.proc) {
			await this.start(this.pvsFile);
		}
		if (this.proc && cmd) {
			if (cmd === ";") { cmd = `"";`; }
			const command: string = (cmd.endsWith(";") || cmd.endsWith("!")) ? cmd : `${cmd};`;
			console.dir(command);
			const result: string = await this.proc.sendText(command);
			if (result && result.indexOf("Expecting an expression") === 0) {
				res.error = result;
			} else {
				res.pvsioOut = result;
			}
		} else {
			res.error = "Error: PVSio could not be started. Please check pvs-server log for details.";
		}
		return res;
	}
	async close (): Promise<boolean> {
		return await this.proc?.kill();
	}
	getContextFolder (): string {
		return this.contextFolder;
	}
}