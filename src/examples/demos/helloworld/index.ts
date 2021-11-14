/**
 *
 * @author Paolo Masci
 * @date 2020/12/16
 */
import { LoopbackConnection as Connection } from '../../../client/core/ConnectionImpl';

import { BasicDisplayEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/BasicDisplayEVO';
import { SelectorEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/SelectorEVO';
import { ButtonEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/ButtonEVO';

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

    // user interface state (type declaration and initial values)
    protected state: {
        powered_on: boolean
    } = {
        powered_on: false
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
                    callback: () => {
                        // power off the device
                        this.state.powered_on = true;
                        // update all display elements
                        this.render();
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
                    callback: () => {
                        // power off the device
                        this.state.powered_on = false;
                        // update all display elements
                        this.render();
                    },
                    connection: this.connection
                }),
                switch: new SelectorEVO("switch", { top: 240, left: 120, width: 80, height: 80 }, {
                    parent: "#panel",
                    callback: () => {
                        // toggles the power
                        this.state.powered_on = !this.state.powered_on;
                        // update all display elements
                        this.render();
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
    render () {
        // render buttons on the panel
        for (let i in this.layout.panel) {
            this.layout.panel[i].render();
        }
        // render display screen elements
        for (let i in this.layout.display) {
            switch (i) {
                case "center": {
                    this.layout.display[i].render(this.state.powered_on ? "Hi there :)" : "");
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
        await this.connection.activate();
        this.render();
    }
}

// create an instance of the prototype and activate the prototype
const demo: HelloWorld = new HelloWorld();
demo.activate();
