/**
 *
 * @author Paolo Masci
 * @date 2020/12/16
 */
import { WebSocketConnection as Connection } from '../../../client/core/ConnectionImpl';

import { BasicDisplayEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/BasicDisplayEVO';
import { SelectorEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/SelectorEVO';
import { ButtonEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/ButtonEVO';
import { PVSioWebResponse, SendCommandToken, StartProcessToken } from '../../../client/common/interfaces/Connection';
import { uuid } from '../../../client/common/utils/uuidUtils';

/**
 * This state definition is based on the datatype defined in hellopvsio.pvs
 */
export type HelloWorldState = {
    powered_on: string // all fields are currently encoded as strings, in this case the field is associated with a boolean, so the value is either TRUE or FALSE
};

/**
 * Helloworld example: introduces the use of display elements and buttons
 */
class HelloWorld {
    // connection to the backend
    protected connection: Connection = new Connection();

    // gui layout, stores all widgets
    protected layout: {
        // panel with the on/off buttons
        panel: {
            on: ButtonEVO,
            off: ButtonEVO,
            switch: SelectorEVO
        },
        // display elements
        display: {
            center: BasicDisplayEVO
        }
    };

    /**
     * Constructor, creates the widgets
     */
    constructor () {
        this.layout = {
            panel: {
                on: new ButtonEVO("on", { top: 200, left: 0, width: 80, height: 80 }, {
                    parent: "#panel",
                    css: {
                        "background-color": "green",
                        color: "white",
                        "font-size": "20px"
                    },
                    customLabel: "ON",
                    callback: (err, res: PVSioWebResponse) => {
                        console.log(res);
                        const state: HelloWorldState = res?.data;
                        // update all display elements
                        this.render(state);
                    },
                    connection: this.connection
                }),
                off: new ButtonEVO("off", { top: 280, left: 0, width: 80, height: 80 }, {
                    parent: "#panel",
                    css: {
                        "background-color": "red",
                        color: "white",
                        "font-size": "20px"
                    },
                    customLabel: "OFF",
                    callback: (err, res: PVSioWebResponse) => {
                        console.log(res);
                        const state: HelloWorldState = res?.data;
                        // update all display elements
                        this.render(state);
                    },
                    connection: this.connection
                }),
                switch: new SelectorEVO("switch", { top: 240, left: 120, width: 80, height: 80 }, {
                    parent: "#panel",
                    callback: (err, res: PVSioWebResponse) => {
                        console.log(res);
                        const state: HelloWorldState = res?.data;
                        // update all display elements
                        this.render(state);
                    },
                    connection: this.connection
                })
            },
            display: {
                center: new BasicDisplayEVO("center", { top: 0, left: 0, width: 600, height: 240 }, {
                    parent: "#screen .center",
                    css: {
                        "background-color": "black",
                        color: "blue",
                        "font-size": "40px"
                    },
                    renderMode: "string" // this indicates that the widget should simply print the string passed to the render function,
                                         // without attempting to treat it as a JSON encoding of a state
                })
            }
        }
    }

    /**
     * Renders the layout elements
     */
    render (state: HelloWorldState): void {
        // render buttons on the panel
        for (let i in this.layout.panel) {
            this.layout.panel[i].render();
        }
        // render display screen elements
        for (let i in this.layout.display) {
            switch (i) {
                case "center": {
                    this.layout.display[i].render(state?.powered_on === "TRUE" ? "Hi there :)" : "");
                    break;
                }
                default: {
                    this.layout.display[i].render();
                    break;
                }
            }
        }
    }

    /**
     * Activate the prototype, i.e., connects to the back-end and renders the user interface
     */
    async activate(): Promise<void> {
        // activate the connection with the server
        const success: boolean = await this.connection.activate();
        if (success) {
            // start pvsio
            const proc: StartProcessToken = {
                id: uuid(),
                type: "startProcess",
                data: {
                    contextFolder: "demos/hellopvsio",
                    fileName: "hellopvsio",
                    fileExtension: ".pvs"
                }
            };
            this.connection.sendRequest("startProcess", proc);
            this.connection.onRequest("startProcess", (err, data) => {
                console.log("PVSio environment ready!", data);
                // initialize the model
                const init: SendCommandToken = {
                    id: uuid(),
                    type: "sendCommand",
                    command: "init"
                }
                this.connection.sendRequest("sendCommand", init);
                this.connection.onRequest("sendCommand", (err, res: PVSioWebResponse) => {
                    console.log("Model initialized!", res);
                    const state: HelloWorldState = res?.data;
                    // update all display elements
                    this.render(state);
                });
            });
        }
    }
}

// create an instance of the prototype and activate the prototype
const demo: HelloWorld = new HelloWorld();
demo.activate();
