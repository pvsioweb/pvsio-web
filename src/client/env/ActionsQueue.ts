/**
 * Manages a queue of messages to send to the server
 */
import { Connection, RequestType, SendCommandToken } from './Connection';
export type ActionCallback = (err: string | null, res: {}) => void;
export class ActionsQueue {
    static guiActions: Promise<any> = Promise.resolve();

    protected static getGUIActionPromise(action: string, widgetId: string, connection: Connection, cb: ActionCallback) {
        return new Promise((resolve, reject) => {
            const req: SendCommandToken = {
                id: widgetId,
                type: "sendCommand",
                command: action
            };
            if (connection) {
                const type: RequestType = "sendCommand";
                connection?.sendRequest(type, req);
                connection?.onRequest(type, (err?: string | null, res?: { id?: string }) => {
                    if (err) {
                        console.warn("[actions-queue] Warning: ", err);
                        resolve(null);
                    }
                    if (cb && res && res.id && res.id === widgetId) {
                        cb(err, res);
                        // console.log(res);
                    }
                    resolve(res);
                });
            } else {
                console.warn(`[actions-queue] Warning: connection is null`);
                resolve(req);
            }
        });
    }

    /**
     * Queue the next gui action onto the promise chain. This ensures that actions are
     * executed on the server in the same order as they are sent on the client
     * @param {string} action the concatenation of button action and function name to call in pvs on the server
     * e.g., "click_bigUP"
     */
    static queueGUIAction (action: string, source: string, connection: Connection, cb: ActionCallback) {
        ActionsQueue.guiActions = ActionsQueue.guiActions.then((res) => {
            return ActionsQueue.getGUIActionPromise(action, source, connection, cb);
        });
    };

    static sendINIT (connection: Connection, source: string, cb: ActionCallback) {
        return ActionsQueue.queueGUIAction("", source, connection, cb);
    };

    static send (action: string, source: string, connection: Connection, cb: ActionCallback) {
        return ActionsQueue.queueGUIAction(action, source, connection, cb);
    };

}
