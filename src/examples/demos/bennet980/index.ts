/**
 *
 * @author Paolo Masci
 * @date 2020/12/16
 */
import { TouchScreenEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/TouchScreenEVO';
import { Player } from '../../../client/util/playback/Player';

import { WebSocketConnection } from '../../../client/env/WebSocketConnection';
import { KnobEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/KnobEVO';

type Mode = "mainScreen" | "ventSetupScreen" | "ventSetupScreenGW" | "ventSetupScreenW"
    | "ventSetupPeep" | "ventSetupO2" | "ventSetupVsens" | "ventSetupPpeak"
    | "ventSetupVmax" | "ventSetupVt" | "ventSetupF" | "ventSetupTpl"
    | "connectPatientScreen";

function kg2lb (kg: number): number {
    return Math.floor(kg * 2.205);
}

class Bennet980 {
    protected connection: WebSocketConnection = new WebSocketConnection();

    // gui layout
    protected gui: {
        knob: KnobEVO,
        mainScreen: {
            newPatient: TouchScreenEVO,
            samePatient: TouchScreenEVO,
            sst: TouchScreenEVO
        },
        ventSetupScreen: {
            cancel: TouchScreenEVO,
            quickStart: TouchScreenEVO,
            weight: TouchScreenEVO,
            male: TouchScreenEVO,
            female: TouchScreenEVO
        },
        ventSetup: {
            peep: TouchScreenEVO,
            o2: TouchScreenEVO,
            vsens: TouchScreenEVO,
            ppeak: TouchScreenEVO
            vmax: TouchScreenEVO,
            vt: TouchScreenEVO,
            f: TouchScreenEVO,
            ramp: TouchScreenEVO,
            tpl: TouchScreenEVO
        },
        connectPatientScreen: {
            confirmPatientConnected: TouchScreenEVO
        }
    };

    // ventilator state
    protected state: {
        mode: Mode,
        weight: number,
        units: "kg" | "lb",
        peep: number,
        o2: number,
        vsens: number,
        ppeak: number,
        vmax: number,
        vt: number,
        f: number,
        ramp: boolean,
        tpl: number,
        patientConnected: boolean
    } = {
        mode: "mainScreen",
        weight: 50,
        units: "kg",
        peep: 3.0,
        o2: 100,
        vsens: 3.0,
        ppeak: 40,
        vmax: 44,
        vt: 300,
        f: 10,
        ramp: false,
        tpl: 0.0,
        patientConnected: false
    }

    // Function automatically invoked by PVSio-web when the back-end sends states updates
    onMessageReceived(err?: string | null, event?): void {
        switch (this.state.mode) {
            case "mainScreen": {
                $(".screen").css("display", "none");
                $("#mainScreen").css("display", "block");
                break;
            }
            case "ventSetupScreen": {
                $(".screen").css("display", "none");
                $("#ventSetupScreen").css("display", "block");
                break;
            }
            // the following two are sub-modes of ventSetupScreen
            case "ventSetupScreenW":
            case "ventSetupScreenGW": {
                $("#ventSetup").css("display", "block");
                break;
            }
            case "connectPatientScreen": {
                $(".screen").css("display", "none");
                $("#connectPatientScreen").css("display", "block");
                break;
            }
            default: {
                break;
            }
        }
        this.render();
    }

    deselectButtons (): void {
        for (let i in this.gui.ventSetupScreen) {
            (<TouchScreenEVO> this.gui.ventSetupScreen[i]).deselect();
        }
    }
    deselectVentSetupButtons (): void {
        for (let i in this.gui.ventSetup) {
            // ramp is treated specially
            if (i !== "ramp") {
                (<TouchScreenEVO> this.gui.ventSetup[i]).deselect();
            }
        }
    }

    constructor () {
        this.gui = {
            mainScreen: {
                newPatient: new TouchScreenEVO("newPatient", {
                    top: 159, left: 139, width: 80, height: 50
                }, { 
                    connection: this.connection,
                    customLabel: "New Patient",
                    css: {
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        opacity: 0.9,
                        parent: "mainScreen",
                        "font-size": "16px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "22px"
                    },
                    callback: (err?, res?) =>  {
                        // move to next screen
                        this.state.mode = "ventSetupScreen";
                        this.onMessageReceived(err, res);
                    }
                }),
                samePatient: new TouchScreenEVO("samePatient", {
                    top: 221, left: 139, width: 80, height: 50
                }, { 
                    connection: this.connection,
                    customLabel: "Same Patient",
                    css: {
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        opacity: 0.9,
                        parent: "mainScreen",
                        "font-size": "16px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "22px"
                    },
                    callback: (err?, res?) =>  { this.onMessageReceived(err, res); }
                }),
                sst: new TouchScreenEVO("sst", {
                    top: 308, left: 139, width: 80, height: 50
                }, { 
                    connection: this.connection,
                    customLabel: "SST",
                    css: {
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        opacity: 0.9,
                        parent: "mainScreen",
                        "font-size": "16px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "22px",
                        "padding-top": "12px"
                    },
                    callback: (err?, res?) =>  { this.onMessageReceived(err, res); }
                })
            },
            ventSetupScreen: {
                cancel: new TouchScreenEVO("cancel", {
                    top: 401, left: 498, width: 78, height: 36
                }, { 
                    connection: this.connection,
                    customLabel: "Cancel",
                    css: {
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        opacity: 0.9,
                        parent: "ventSetupScreen",
                        "font-size": "20px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "30px"
                    },
                    callback: (err?, res?) =>  { this.onMessageReceived(err, res); }
                }),
                quickStart: new TouchScreenEVO("quickStart", {
                    top: 401, left: 580, width: 140, height: 36
                }, { 
                    connection: this.connection,
                    css: {
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        opacity: 0.9,
                        parent: "ventSetupScreen",
                        "font-size": "20px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "30px"
                    },
                    callback: (err?, res?) =>  {
                        if (this.state.mode !== "mainScreen" && this.state.mode !== "ventSetupScreen") {
                            // move to next screen
                            this.state.mode = "connectPatientScreen";
                            // move ventSetup buttons to the lower panel
                            this.gui.ventSetup.f.move({ top: 391, left: -110 });
                            this.gui.ventSetup.vt.move({ top: 391, left: -48 });
                            this.gui.ventSetup.vmax.move({ top: 391, left: 14 });
                            this.gui.ventSetup.ramp.move({ top: 456, left: 14 });
                            this.gui.ventSetup.tpl.move({ top: 456, left: -48 });
                            this.gui.ventSetup.vsens.move({ top: 391, left: 146 });
                            this.gui.ventSetup.o2.move({ top: 391, left: 208 });
                            this.gui.ventSetup.peep.move({ top: 4561, left: 208 });
                            this.gui.ventSetup.ppeak.move({ top: 4561, left: 146 });
                            this.gui.ventSetup.ppeak.hide();
                            this.onMessageReceived(err, res);
                        }
                    }
                }),
                weight: new TouchScreenEVO("weight", {
                    top: 154, left: 139, width: 66, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetupScreen",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        // select button
                        this.deselectButtons();
                        this.gui.ventSetupScreen.weight.select({ borderColor: "yellow"});
                        // enter weight
                        this.state.mode = "ventSetupScreenW";
                        this.onMessageReceived(err, res);
                    }
                }),
                male:  new TouchScreenEVO("male", {
                    top: 293, left: 137, width: 38, height: 48
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "transparent",
                        "border-radius": "8px",
                        parent: "ventSetupScreen"
                    },
                    callback: (err?, res?) =>  {
                        // select button
                        this.deselectButtons();
                        this.gui.ventSetupScreen.male.select({ borderColor: "yellow"});
                        // enter gender and weight                        
                        this.state.mode = "ventSetupScreenGW";
                        this.onMessageReceived(err, res);
                    }
                }),
                female:  new TouchScreenEVO("female", {
                    top: 293, left: 183, width: 38, height: 48
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "transparent",
                        "border-radius": "8px",
                        parent: "ventSetupScreen"
                    },
                    callback: (err?, res?) =>  {
                        // select button
                        this.deselectButtons();
                        this.gui.ventSetupScreen.female.select({ borderColor: "yellow"});
                        // enter gender and weight                        
                        this.state.mode = "ventSetupScreenGW";
                        this.onMessageReceived(err, res);
                    }
                }),
            },
            ventSetup: {
                peep: new TouchScreenEVO("peep", {
                    top: 230, left: 310, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.deselectVentSetupButtons();
                        this.gui.ventSetup.peep.select({ borderColor: "yellow"});
                        this.state.mode = "ventSetupPeep";
                        this.onMessageReceived(err, res);
                    }
                }),
                o2: new TouchScreenEVO("o2", {
                    top: 167, left: 310, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.deselectVentSetupButtons();
                        this.gui.ventSetup.o2.select({ borderColor: "yellow"});
                        this.state.mode = "ventSetupO2";
                        this.onMessageReceived(err, res);
                    }
                }),
                vsens: new TouchScreenEVO("vsens", {
                    top: 167, left: 246, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.deselectVentSetupButtons();
                        this.gui.ventSetup.vsens.select({ borderColor: "yellow"});
                        this.state.mode = "ventSetupVsens";
                        this.onMessageReceived(err, res);
                    }
                }),
                ppeak: new TouchScreenEVO("ppeak", {
                    top: 167, left: 373, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.deselectVentSetupButtons();
                        this.gui.ventSetup.ppeak.select({ borderColor: "yellow"});
                        this.state.mode = "ventSetupPpeak";
                        this.onMessageReceived(err, res);
                    }
                }),
                vmax: new TouchScreenEVO("vmax", {
                    top: 167, left: 132, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.deselectVentSetupButtons();
                        this.gui.ventSetup.vmax.select({ borderColor: "yellow"});
                        this.state.mode = "ventSetupVmax";
                        this.onMessageReceived(err, res);
                    }
                }),
                vt: new TouchScreenEVO("vt", {
                    top: 167, left: 70, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.deselectVentSetupButtons();
                        this.gui.ventSetup.vt.select({ borderColor: "yellow"});
                        this.state.mode = "ventSetupVt";
                        this.onMessageReceived(err, res);
                    }
                }),
                f: new TouchScreenEVO("f", {
                    top: 167, left: 8, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.deselectVentSetupButtons();
                        this.gui.ventSetup.f.select({ borderColor: "yellow"});
                        this.state.mode = "ventSetupF";
                        this.onMessageReceived(err, res);
                    }
                }),
                ramp: new TouchScreenEVO("ramp", {
                    top: 230, left: 132, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.state.ramp = !this.state.ramp; // toggle button
                        // select button
                        if (this.state.ramp) {
                            this.gui.ventSetup.ramp.select({ borderColor: "yellow"});
                        } else {
                            this.gui.ventSetup.ramp.deselect();
                        }
                        this.onMessageReceived(err, res);
                    }
                }),
                tpl: new TouchScreenEVO("tpl", {
                    top: 230, left: 70, width: 60, height: 54
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    css: {
                        opacity: 0.9,
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        parent: "ventSetup",
                        "font-size": "24px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "24px"
                    },
                    callback: (err?, res?) =>  {
                        this.deselectVentSetupButtons();
                        this.gui.ventSetup.tpl.select({ borderColor: "yellow"});
                        this.state.mode = "ventSetupTpl";
                        this.onMessageReceived(err, res);
                    }
                })
            },
            connectPatientScreen: {
                confirmPatientConnected: new TouchScreenEVO("confirmPatientConnected", {
                    top: 201, left: 219, width: 140, height: 36
                }, { 
                    connection: this.connection,
                    customLabel: "Confirm",
                    css: {
                        "background-color": "#073b80",
                        "border-color": "steelblue",
                        opacity: 0.9,
                        parent: "connectPatientScreenDialog",
                        "font-size": "20px",
                        "border-radius": "8px",
                        "white-space": "normal",
                        "line-height": "30px"
                    },
                    callback: (err?, res?) =>  {
                        switch (this.state.mode) {
                            case "ventSetupScreenGW":
                            case "ventSetupScreenW": {
                                // move to next screen
                                this.state.mode = "connectPatientScreen";
                                // move ventSetup buttons to the lower panel
                                this.gui.ventSetup.f.move({ top: 391, left: -110 });
                                this.gui.ventSetup.vt.move({ top: 391, left: -48 });
                                this.gui.ventSetup.vmax.move({ top: 391, left: 14 });
                                this.gui.ventSetup.ramp.move({ top: 456, left: 14 });
                                this.gui.ventSetup.tpl.move({ top: 456, left: -48 });
                                this.gui.ventSetup.vsens.move({ top: 391, left: 146 });
                                this.gui.ventSetup.o2.move({ top: 391, left: 208 });
                                this.gui.ventSetup.peep.move({ top: 4561, left: 208 });
                                this.gui.ventSetup.ppeak.move({ top: 4561, left: 146 });
                                this.gui.ventSetup.ppeak.hide();
                                break;
                            }
                            case "connectPatientScreen": {
                                // mark patient connected
                                this.state.patientConnected = true;
                                // hide confirmation dialog
                                $("#connectPatientScreenDialog").css("display", "none");
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        this.onMessageReceived(err, res);
                    }
                })
            },
            knob: new KnobEVO("knob", { top: 795, left: 538, width: 105, height: 105 }, {
                connection: this.connection,
                callback: (err?, res?: { command?: string }) =>  {
                    if (res?.command === "rotate_knob") {
                        const val: number = this.gui.knob.getDelta();
                        switch (this.state.mode) {
                            case "ventSetupScreenW":
                            case "ventSetupScreenGW": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.weight + delta;
                                this.state.weight = ( newVal >= 0) ? newVal : 0; 
                                break;
                            }
                            case "ventSetupPeep": {
                                const delta = val * 0.1;
                                const newVal: number = this.state.peep + delta;
                                this.state.peep = ( newVal >= 0) ? newVal : 0; 
                                break;
                            }
                            case "ventSetupO2": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.o2 + delta;
                                this.state.o2 = (newVal >= 0 && newVal <= 100) ? newVal 
                                    : newVal < 0 ? 0 : 100; 
                                break;
                            }
                            case "ventSetupVsens": {
                                const delta = val * 0.1;
                                const newVal: number = this.state.vsens + delta;
                                this.state.vsens = ( newVal >= 0) ? newVal : 0; 
                                break;
                            }
                            case "ventSetupPpeak": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.ppeak + delta;
                                this.state.ppeak = ( newVal >= 0) ? newVal : 0; 
                                break;
                            }
                            case "ventSetupVmax": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.vmax + delta;
                                this.state.vmax = ( newVal >= 0) ? newVal : 0; 
                                break;
                            }
                            case "ventSetupVt": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.vt + delta;
                                this.state.vt = ( newVal >= 0) ? newVal : 0; 
                                break;
                            }
                            case "ventSetupF": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.f + delta;
                                this.state.f = ( newVal >= 0) ? newVal : 0; 
                                break;
                            }
                            case "ventSetupTpl": {
                                const delta = val * 0.1;
                                const newVal: number = this.state.tpl + delta;
                                this.state.tpl = ( newVal >= 0) ? newVal : 0; 
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        this.onMessageReceived(err, res);
                    }
                }
            })
        }
    }

    render () {
        for (let i in this.gui.mainScreen) {
            this.gui.mainScreen[i].render();
        }
        for (let i in this.gui.ventSetupScreen) {
            switch (i) {
                case "weight": {
                    const label: string = `<div style="height:17px;">${this.state.weight.toFixed(0)}</div><div style="font-size:14px; color:grey; height:16px;">kg</div><div style="font-size:14px;">(${kg2lb(this.state.weight).toFixed(0)}lb)</span>`;
                    this.gui.ventSetupScreen.weight.render(label);
                    break;
                }
                case "quickStart": {
                    if (this.state.mode !== "mainScreen" && this.state.mode !== "ventSetupScreen") {
                        this.gui.ventSetupScreen.quickStart.render("Quick START");
                    } else {
                        this.gui.ventSetupScreen.quickStart.render("");
                    }
                    break;
                }
                default: {
                    this.gui.ventSetupScreen[i].render();
                }
            }
        }
        for (let i in this.gui.ventSetup) {
            switch (i) {
                case "peep": {
                    const label: string = `<div style="font-size:14px; height:16px;">PEEP</div><div style="height:17px;">${this.state.peep.toFixed(1)}</div><div style="font-size:14px;">cmH<sub>2</sub>O</span>`;
                    this.gui.ventSetup.peep.render(label);
                    break;
                }
                case "o2": {
                    const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">O<sub>2</sub></div><div style="height:17px;">${this.state.o2.toFixed(0)}</div><div style="font-size:14px;">%</span>`;
                    this.gui.ventSetup.o2.render(label);
                    break;
                }
                case "vsens": {
                    const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">V<sub>sens</sub></div><div style="height:17px;">${this.state.vsens.toFixed(1)}</div><div style="font-size:14px;">L/min</span>`;
                    this.gui.ventSetup.vsens.render(label);
                    break;
                }
                case "ppeak": {
                    const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">P<sub>peak</sub></div><div style="height:17px;">${this.state.ppeak.toFixed(0)}</div><div style="font-size:14px;">cmH<sub>2</sub>O</span>`;
                    this.gui.ventSetup.ppeak.render(label);
                    break;
                }
                case "vmax": {
                    const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">V<sub>MAX</sub></div><div style="height:17px;">${this.state.vmax.toFixed(0)}</div><div style="font-size:14px;">L/min</span>`;
                    this.gui.ventSetup.vmax.render(label);
                    break;
                }
                case "vt": {
                    const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">V<sub>T</sub></div><div style="height:17px;">${this.state.vt.toFixed(0)}</div><div style="font-size:14px;">mL</span>`;
                    this.gui.ventSetup.vt.render(label);
                    break;
                }
                case "f": {
                    const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">f</sub></div><div style="height:17px;">${this.state.f.toFixed(0)}</div><div style="font-size:14px;">1/min</span>`;
                    this.gui.ventSetup.f.render(label);
                    break;
                }
                case "ramp": {
                    const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">Ramp</div>
                        <div style="position:absolute; width:10px; height:20px; margin-top:3px; margin-left:12px; border-right:2px solid white; border-bottom:2px solid white;"></div>
                        <div style="position:absolute; transform:rotate(-45deg); width:10px; height:26px; margin-top:3px; margin-left:22px; border-right:2px solid white;"></div>
                        <div style="position:absolute; width:8px; height:20px; margin-top:3px; margin-left:39px; border-bottom:2px solid white;"></div>`;
                    this.gui.ventSetup.ramp.render(label);
                    break;
                }
                case "tpl": {
                    const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">T<sub>PL</sub></div><div style="height:17px;">${this.state.tpl.toFixed(1)}</div><div style="font-size:14px;">s</span>`;
                    this.gui.ventSetup.tpl.render(label);
                    break;
                }
                default: {
                    this.gui.ventSetup[i].render();
                }
            }
            for (let i in this.gui.connectPatientScreen) {
                this.gui.connectPatientScreen[i].render();
            }
        }
        this.gui.knob.render();
    }

    async activate(): Promise<void> {
        await this.connection.activate();
        this.render();
    }
}

const demo: Bennet980 = new Bennet980();
demo.activate();
