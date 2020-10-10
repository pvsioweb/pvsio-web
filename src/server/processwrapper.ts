/**
Copyright (c) 2012

Patrick Oladimeji
This file is part of pvsio-web.

pvsio-web is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

pvsio-web is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 *
 * A generic wrapper for spawning a process, sending messages to a process and shutting down a process
 *
 * @author Patrick Oladimeji
 * @date Dec 2, 2012 : 10:28:48 PM
 */

import { spawn, exec, ExecException } from 'child_process';

export class ProcessWrapper {

    protected proc;
    protected _dataProcessor;
    protected cbQueue = [];

    /**
     * Starts an interactive process with the specified parameters. The opt variable should contain
     * at least the name of the process to start
     * @param opt - parameters for starting up the process. May contain the following properties
     *      processName: String
     *      args: Array
     *      onDataReceived: function to be called when the process sends something to its stdout
            onErrorReceived: function to be called when the process encounters an error
     *      onProcessExited: function to be called when the process exits
     *
     * @returns {___anonymous325_326}
     */
    start (opt?: { 
        processName: string, 
        args?: string[], 
        onDataReceived: (data: string) => void, 
        onProcessExited: (err: NodeJS.ErrnoException) => void, 
        onErrorReceived?: (err: NodeJS.ErrnoException) => void 
    }): ProcessWrapper {
        if (opt) {
            try {
                this.proc = spawn(opt.processName, opt.args, {
                    uid: process.getuid(), 
                    gid: process.getgid()
                });

                this.proc.stdout.setEncoding('utf8');
                this.proc.stderr.setEncoding("utf8");

                this.proc.stdout.on("data", function (data) {
                    const f = this.dataProcessor();
                    //call any callback and forward the data to onDataReceived if it exists
                    if (f) {
                        if (f(data, this.cbQueue[0])) {
                            this.cbQueue.shift();
                        }
                    }
                    if (opt.onDataReceived) { opt.onDataReceived(data); }
                });
                if (opt.onErrorReceived) {
                    this.proc.stderr.on("data", opt.onErrorReceived);
                }
                if (opt.onProcessExited) {
                    this.proc.on('close', opt.onProcessExited);
                    this.proc.on('error', opt.onProcessExited);
                }
            } catch (err) {
                console.log(err);
            } finally {
                return this;
            }
        }
    };
    /**
	 * A function that is parses the data stream and forwards the result to a callback function as appropriate.
	 * This would typically be when a specified token is found in the output stream.
	 * The function takes a string and a callback function as parameter and should return true if the callback function
	 * has been invoked
	 */
	dataProcessor (f) {
		if (f) {
			this._dataProcessor = f;
		}
		return this._dataProcessor;
	};
    /**
     * execute a self terminating process and calls the callback with the output of the stdout
     * @param {String} opt A space separated string containing the process to execute and any arguments
     * @returns {___anonymous364_365}
     */
    exec (opt?: { command: string, callBack?: (error: ExecException | null, stdout?: string, stderr?: string) => void }): ProcessWrapper {
        exec(opt.command, opt.callBack);
        return this;
    };
    /**
     * stop the process spawned
     * @returns {___anonymous364_365}
     */
    kill (signal: string): ProcessWrapper {
        signal = signal || 'SIGTERM';
        if (this.proc) {
            this.proc.kill(signal);
            this.proc.stdout.destroy();
            this.proc.stdin.destroy();
            this.proc.stderr.destroy();
            this.proc = undefined;
        }
        return this;
    };

	write(msg: string, cb): ProcessWrapper {
		this.cbQueue.push(cb);
        this.proc.stdin.write(msg);
        return this;
	}

    /**
     * send a command to the running process
     * @param command
     * @returns {___anonymous364_365}
     */
    sendCommand (command: string, cb): ProcessWrapper {
		this.write(command, cb);
        return this;
    };
};
