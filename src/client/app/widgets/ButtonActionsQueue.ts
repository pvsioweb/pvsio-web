/**
 * Manages a queue of messages to send to the server
 */
import { WSManager } from "../WSManager";

export class ButtonActionsQueue {
    static guiActions: Promise<any> = Promise.resolve();

    protected static getGUIActionPromise(action: string, cb: (err, res) => void) {
        const ws = WSManager.getWebSocket();
        return new Promise((resolve, reject) => {
            ws.sendGuiAction(action, (err, res) => {
                if (cb) { cb(err, res); }
                if (err) {
                    reject(err);
                } else {
                    console.log(res.command);
                    console.log(res.data);
                    resolve(res);
                }
            });
        });
    }

    /**
     * Queue the next gui action onto the promise chain. This ensures that actions are
     * executed on the server in the same order as they are sent on the client
     * @param {string} action the concatenation of button action and function name to call in pvs on the server
     * e.g., "click_bigUP"
     */
    static queueGUIAction (action: string, cb: (err, res) => void) {
        const ws = WSManager.getWebSocket();
        ButtonActionsQueue.guiActions = ButtonActionsQueue.guiActions.then((res) => {
            let guiAction = action;
            if (action !== "<ping>" && action !== "<pong>") {
                guiAction += "(" + ws.lastState().toString().replace(/,,/g, ",") + ");";
            }
            const guiActionPromise = this.getGUIActionPromise(guiAction, cb);
            return guiActionPromise;
        }).catch(function (err) {
            if (!(typeof err.message === "string" && err.message.indexOf("No resolution for tick") >= 0)) {
                if (err.code === "EPIPE") {
                    console.log("Unable to evaluate command in PVSio :/");
                } else {
                    console.error(err);
                }
            }
        });
    };

    static sendINIT (cb: (err, res) => void) {
        return ButtonActionsQueue.queueGUIAction("", cb);
    };

    static send (action: string, cb: (err, res) => void) {
        return ButtonActionsQueue.queueGUIAction(action, cb);
    };

}
