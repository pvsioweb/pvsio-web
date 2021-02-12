/**
 *
 * @author Paolo Masci
 * @date 2020/12/16
 */
import { LoopbackConnection as Connection } from '../../../client/env/Connection';

import { BasicDisplayEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/BasicDisplayEVO';
import { SelectorEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/SelectorEVO';
import { fontOutlineStyle } from '../../../client/utils/pvsiowebUtils';

function kg2lb (kg: number): number {
    return Math.floor(kg * 2.205);
}
function cm2in (cm: number): number {
    return cm / 2.54;
}

type Screen = "off" | "on";
type Setting = {
    label: string, 
    val?: string, 
    label2?: string, 
    val2?: string, 
    label3?: string, 
    val3?: string, 
    alm?: { max?: string, min?: string, label?: string },
    outline?: boolean
};
const labelTemplate1: string = `
<div style="position:absolute; top:0px; left:0px; height:100%; width:100%; color:black; opacity:0.6; border-bottom:1px solid black; border-top:1px solid black; letter-spacing:-1px; font-weight:bold;">
    <div style="position:absolute; top:-12px; left:2px; font-size:15px;">{{label}}</div>
    <div style="position:absolute; top:8px; left:16px; font-size:20px; text-align:right; width:47px; {{#if outline}}${fontOutlineStyle("black")}{{/if}}">{{val}}</div>
    {{#if alm}}
    <div style="position:absolute; top:-12px; left:72px; font-size:12px;">{{#if alm.label}}{{alm.label}}{{else}}<i class="fa fa-bell"></i>{{/if}}</div>
    {{#if alm.max}}<div style="position:absolute; top:2px; left:62px; width:22px; text-align:right; font-size:12px;">{{alm.max}}</div>{{/if}}
    {{#if alm.min}}<div style="position:absolute; top:12px; left:62px; width:22px; text-align:right; font-size:12px;">{{alm.min}}</div>{{/if}}
    {{/if}}
</div>
`;
const labelTemplate2: string = `
<div style="position:absolute; top:0px; left:0px; height:100%; width:100%; color:black; opacity:0.6; border-bottom:1px solid black; border-top:1px solid black; letter-spacing:-1px; font-weight:bold;">
    <div style="position:absolute; top:-11px; left:2px; font-size:15px;">{{label}}</div>
    <div style="position:absolute; top:-9px; left:16px; font-size:20px; text-align:right; width:47px; {{#if outline}}${fontOutlineStyle("black")}{{/if}}">{{val}}</div>
    <div style="position:absolute; top:10px; left:2px; font-size:12px;">{{label2}}</div>
    <div style="position:absolute; top:10px; left:42px; font-size:12px;">{{val2}}</div>
    <div style="position:absolute; top:-11px; left:72px; font-size:12px;">{{#if alm.label}}{{alm.label}}{{else}}<i class="fa fa-bell"></i>{{/if}}</div>
    {{#if alm.max}}<div style="position:absolute; top:2px; left:62px; width:22px; text-align:right; font-size:12px;">{{alm.max}}</div>{{/if}}
    {{#if alm.min}}<div style="position:absolute; top:12px; left:62px; width:22px; text-align:right; font-size:12px;">{{alm.min}}</div>{{/if}}
</div>
`;
const labelTemplate3: string = `
<div style="position:absolute; top:0px; left:0px; height:100%; width:100%; color:black; opacity:0.6; border-bottom:1px solid black; border-top:1px solid black; letter-spacing:-1px; font-weight:bold;">
    <div style="position:absolute; top:-11px; left:2px; font-size:15px;">{{label}}</div>
    <div style="position:absolute; top:-9px; left:16px; font-size:18px; text-align:right; width:47px;">{{val}}</div>
    <div style="position:absolute; top:10px; left:36px; font-size:20px; {{#if outline}}${fontOutlineStyle("black")}{{/if}}">{{val2}}</div>
    <div style="position:absolute; top:2px; left:2px; font-size:12px;">{{label3}}</div>
    <div style="position:absolute; top:12px; left:2px; font-size:12px;">{{val3}}</div>
    <div style="position:absolute; top:-11px; left:72px; font-size:12px;">{{#if alm.label}}{{alm.label}}{{else}}<i class="fa fa-bell"></i>{{/if}}</div>
    {{#if alm.max}}<div style="position:absolute; top:2px; left:62px; width:22px; text-align:right; font-size:12px;">{{alm.max}}</div>{{/if}}
    {{#if alm.min}}<div style="position:absolute; top:12px; left:62px; width:22px; text-align:right; font-size:12px;">{{alm.min}}</div>{{/if}}
</div>
`;
const labelTemplateSmall: string = `
<div style="position:absolute; top:0px; left:0px; height:100%; width:100%; color:black; opacity:0.6; border-right:1px solid black; border-top:1px solid black; letter-spacing:-1px; font-weight:bold;">
    <div style="position:absolute; top:-6px; left:2px; font-size:10px; width:30px;">{{label}}</div>
    <div style="position:absolute; top:3px; left:2px; font-size:12px; width:30px;">{{val}}</div>
</div>
`;


class Zoll {
    protected connection: Connection = new Connection();

    // gui layout
    protected gui: {
        selector: SelectorEVO,
        mainScreen: {
        },
        ventSetupScreen: {
            hr: BasicDisplayEVO,
            spo2: BasicDisplayEVO,
            fio2: BasicDisplayEVO,
            pip: BasicDisplayEVO,
            vt: BasicDisplayEVO,
            bpm: BasicDisplayEVO,
            mode: BasicDisplayEVO,

            vmin: BasicDisplayEVO,
            ct: BasicDisplayEVO,
            map: BasicDisplayEVO,
            ti: BasicDisplayEVO,

            spacer1: BasicDisplayEVO,
            spacer2: BasicDisplayEVO,
            spacer3: BasicDisplayEVO,
            trigger: BasicDisplayEVO
        }
    };

    // ventilator state
    protected state: {
        ready: boolean,
        screen: Screen,
        hr: Setting,
        spo2: Setting,
        fio2: Setting,
        pip: Setting,
        vt: Setting,
        bpm: Setting,
        mode: Setting,
        vmin: Setting,
        ct: Setting,
        map: Setting,
        ti: Setting,
        trigger: Setting,
        spacer1: Setting,
        spacer2: Setting,
        spacer3: Setting
    } = {
        ready: false,
        screen: "off",
        hr: { label: "HR", val: "stby", alm: { min: "40", max: "120" }, outline: false },
        spo2: { label: "SpO2", val: "stby", alm: { min: "94" }, outline: false },
        fio2: { label: "FIO2", val: "21", alm: { max: "0.0", label: `<sup style="margin-left:-12px;">O2 use</sup>` }, outline: false },
        pip: { label: "PIP", val: "33", label2: "PEEP", val2: "5", alm: { min: "10", max: "35" }, outline: true },
        vt: { label: "Vt", val: "450", outline: false },
        bpm: { label: "BPM", val: "12", val2: "12", label3: "I:E", val3: "1:3.0", alm: { min: "8", max: "25" }, outline: true },
        mode: { label: "Mode", val: "AC (v)", outline: false },
        vmin: { label: "Vmin", val: "2.9" },
        ct: { label: "CT", val: "off" },
        map: { label: "MAP", val: "9.8" },
        ti: { label: "Ti", val: "2.50" },
        trigger: { label: "Trigger", val: "-2.0" },
        spacer1: { label: "" },
        spacer2: { label: "" },
        spacer3: { label: "" }
    };

    readonly range: { [key: string]: { min: number, max: number, step: number, units: string }} = {
    }
    

    /**
     * Constructor, creates the gui layout
     */
    constructor () {
        this.gui = {
            mainScreen: {
            },
            ventSetupScreen: {
                hr: new BasicDisplayEVO("hr", { top: -1, left: 0, width: 86, height: 42 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                spo2: new BasicDisplayEVO("spo2", { top: 40, left: 0, width: 86, height: 42 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                fio2: new BasicDisplayEVO("fio2", { top: 83, left: 0, width: 86, height: 42 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                pip: new BasicDisplayEVO("pip", { top: 124, left: 0, width: 86, height: 42 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                vt: new BasicDisplayEVO("vt", { top: 165, left: 0, width: 86, height: 42 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                bpm: new BasicDisplayEVO("bpm", { top: 206, left: 0, width: 86, height: 42 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }), 
                mode: new BasicDisplayEVO("mode", { top: 247, left: 0, width: 86, height: 42 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                vmin: new BasicDisplayEVO("vmin", { top: 247, left: -132, width: 33, height: 21 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                ct: new BasicDisplayEVO("ct", { top: 247, left: -99, width: 33, height: 21 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                map: new BasicDisplayEVO("map", { top: 247, left: -66, width: 33, height: 21 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                ti: new BasicDisplayEVO("ti", { top: 247, left: -33, width: 33, height: 21 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                spacer1: new BasicDisplayEVO("spacer1", { top: 267, left: -132, width: 33, height: 21 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                spacer2: new BasicDisplayEVO("spacer2", { top: 267, left: -99, width: 33, height: 21 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                spacer3: new BasicDisplayEVO("spacer3", { top: 267, left: -66, width: 33, height: 21 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                }),
                trigger: new BasicDisplayEVO("trigger", { top: 267, left: -33, width: 33, height: 21 }, {
                    parent: "ventSetupScreen",
                    css: {
                        "background-color": "transparent"
                    }
                })
            },
            selector: new SelectorEVO("selector", { top: 606, left: 488, width: 112, height: 112 }, {
                connection: this.connection,
                turns: [ -20, 20 ],
                callback: (err?, res?: { command?: string }) =>  {
                    const p: number = this.gui.selector.getIndex();
                    this.state.screen = p ? "on" : "off";
                    this.render();
                }
            })
        }
    }

    /**
     * Renders the gui elements based on the current state
     */
    render () {
        // adjust screen visibility based on current mode
        switch (this.state.screen) {
            case "off": {
                $("#screen").css("display", "none");
                break;
            }
            case "on": {
                $("#screen").css("display", "block");
                break;
            }
            default: {
                break;
            }
        }
        // render buttons
        for (let i in this.gui.mainScreen) {
            this.gui.mainScreen[i].render();
        }
        for (let i in this.gui.ventSetupScreen) {
            switch (i) {
                case "hr":
                case "spo2":
                case "fio2": 
                case "vt":
                case "mode": {
                    const label: string = Handlebars.compile(labelTemplate1, { noEscape: true })(this.state[i]);
                    this.gui.ventSetupScreen[i].render(label);
                    break;
                }
                case "pip": {
                    const label: string = Handlebars.compile(labelTemplate2, { noEscape: true })(this.state[i]);
                    this.gui.ventSetupScreen[i].render(label);
                    break;
                }
                case "bpm": {
                    const label: string = Handlebars.compile(labelTemplate3, { noEscape: true })(this.state[i]);
                    this.gui.ventSetupScreen[i].render(label);
                    break;
                }
                case "vmin":
                case "ct":
                case "map":
                case "ti":
                case "trigger": 
                case "spacer1": 
                case "spacer2": 
                case "spacer3": {
                    const label: string = Handlebars.compile(labelTemplateSmall, { noEscape: true })(this.state[i]);
                    this.gui.ventSetupScreen[i].render(label);
                    break;
                }
                default: {
                    this.gui.ventSetupScreen[i].render();
                    break;
                }
            }
        }
        this.gui.selector.render();
    }

    async activate(): Promise<void> {
        await this.connection.activate();
        this.render();
    }
}

const demo: Zoll = new Zoll();
demo.activate();
