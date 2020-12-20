/**
 *
 * @author Paolo Masci
 * @date 2020/12/16
 */
import { WebSocketConnection } from '../../../client/env/WebSocketConnection';

import { ToggleButtonEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/ToggleButtonEVO';
import { KnobEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/KnobEVO';

type Mode = "mainScreen" | "ventSetupScreen" | "ventSetupScreenGH" | "ventSetupScreenW"
    | "ventSetupPeep" | "ventSetupO2" | "ventSetupVsens" | "ventSetupPpeak"
    | "ventSetupVmax" | "ventSetupVt" | "ventSetupF" | "ventSetupTpl"
    | "connectPatientScreen" | "ventSetupRamp";

function kg2lb (kg: number): number {
    return Math.floor(kg * 2.205);
}
function cm2in (cm: number): number {
    return cm / 2.54;
}

class Bennet980 {
    protected connection: WebSocketConnection = new WebSocketConnection();

    // gui layout
    protected gui: {
        knob: KnobEVO,
        mainScreen: {
            newPatient: ToggleButtonEVO,
            samePatient: ToggleButtonEVO,
            sst: ToggleButtonEVO
        },
        ventSetupScreen: {
            cancel: ToggleButtonEVO,
            start: ToggleButtonEVO,
            weight: ToggleButtonEVO,
            male: ToggleButtonEVO,
            female: ToggleButtonEVO,
            height: ToggleButtonEVO
        },
        ventSetup: {
            peep: ToggleButtonEVO,
            o2: ToggleButtonEVO,
            vsens: ToggleButtonEVO,
            ppeak: ToggleButtonEVO
            vmax: ToggleButtonEVO,
            vt: ToggleButtonEVO,
            f: ToggleButtonEVO,
            ramp: ToggleButtonEVO,
            tpl: ToggleButtonEVO
        },
        connectPatientScreen: {
            confirmPatientConnected: ToggleButtonEVO
        }
    };

    // ventilator state
    protected state: {
        ready: boolean,
        screen: Mode,
        quickStartFlag: boolean,
        weight: number,
        height: number,
        gender: "male" | "female" | null,
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
        ready: false,
        screen: "mainScreen",
        quickStartFlag: true,
        weight: 50,
        height: 174,
        gender: null,
        peep: 3.0,
        o2: 100,
        vsens: 3.0,
        ppeak: 40,
        vmax: 44,
        vt: 300,
        f: 10,
        ramp: true,
        tpl: 0.0,
        patientConnected: false
    };

    readonly range: { [key: string]: { min: number, max: number, step: number, units: string }} = {
        peep: { min: 0, max: 45, step: 0.5, units: "cmH20" },
        o2: { min: 21, max: 100, step: 1, units: "%"}
    }
    

    /**
     * utility functions
     */
    deselectButtons (opt?: { exclude?: string[] }): void {
        opt = opt || {};
        for (let i in this.gui.ventSetupScreen) {
            if (!(opt.exclude && opt.exclude.includes(i))) {
                (<ToggleButtonEVO> this.gui.ventSetupScreen[i]).deselect();
            }
        }
        for (let i in this.gui.ventSetup) {
            if (!(opt.exclude && opt.exclude.includes(i))) {
                (<ToggleButtonEVO> this.gui.ventSetup[i]).deselect();
            }
        }
    }

    deselectVentSetupButtons (): void {}

    /**
     * Constructor, creates the gui layout
     */
    constructor () {
        this.gui = {
            mainScreen: {
                newPatient: new ToggleButtonEVO("newPatient", {
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
                        this.state.screen = "ventSetupScreen";
                        this.render();
                    }
                }),
                samePatient: new ToggleButtonEVO("samePatient", {
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
                    callback: (err?, res?) =>  { this.render(); }
                }),
                sst: new ToggleButtonEVO("sst", {
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
                    callback: (err?, res?) =>  { this.render(); }
                })
            },
            ventSetupScreen: {
                cancel: new ToggleButtonEVO("cancel", {
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
                    callback: (err?, res?) =>  {
                        this.state.quickStartFlag = false;
                        this.render();
                    }
                }),
                start: new ToggleButtonEVO("start", {
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
                        this.state.quickStartFlag = false;
                        if (this.state.ready) {
                            // move to next screen
                            this.state.screen = "connectPatientScreen";
                            // move ventSetup buttons to the lower panel
                            this.gui.ventSetup.f.move({ top: 391, left: -110 });
                            this.gui.ventSetup.vt.move({ top: 391, left: -48 });
                            this.gui.ventSetup.vmax.move({ top: 391, left: 14 });
                            this.gui.ventSetup.ramp.move({ top: 456, left: 14 });
                            this.gui.ventSetup.tpl.move({ top: 456, left: -48 });
                            this.gui.ventSetup.vsens.move({ top: 391, left: 146 });
                            this.gui.ventSetup.o2.move({ top: 391, left: 208 });
                            this.gui.ventSetup.peep.move({ top: 456, left: 208 });
                            this.gui.ventSetup.ppeak.move({ top: 456, left: 146 });
                            this.gui.ventSetup.ppeak.hide();
                            // deselect all buttons
                            this.deselectButtons({ exclude: ["male", "female"] });
                            this.render();
                        }
                    }
                }),
                weight: new ToggleButtonEVO("weight", {
                    top: 154, left: 145, width: 66, height: 54
                }, { 
                    connection: this.connection,
                    toggleButton: true,
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
                        this.state.ready = true;
                        // select button
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetupScreen.weight.select();
                        // enter weight
                        this.state.screen = "ventSetupScreenW";
                        this.render();
                    }
                }),
                male:  new ToggleButtonEVO("male", {
                    top: 293, left: 137, width: 38, height: 48
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    activeColor: "transparent",
                    css: {
                        opacity: 0.9,
                        "background-color": "transparent",
                        "border-radius": "8px",
                        parent: "ventSetupScreen"
                    },
                    callback: (err?, res?) =>  {
                        this.state.ready = true;
                        this.state.gender = "male";
                        // select button
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetupScreen.male.select();
                        this.gui.ventSetupScreen.female.deselect();
                        this.gui.ventSetupScreen.height.select();
                        // enter gender and weight                        
                        this.state.screen = "ventSetupScreenGH";
                        this.render();
                    }
                }),
                female:  new ToggleButtonEVO("female", {
                    top: 293, left: 183, width: 38, height: 48
                }, { 
                    connection: this.connection,
                    pushButton: true,
                    activeColor: "transparent",
                    css: {
                        opacity: 0.9,
                        "background-color": "transparent",
                        "border-radius": "8px",
                        parent: "ventSetupScreen"
                    },
                    callback: (err?, res?) =>  {
                        this.state.ready = true;
                        this.state.gender = "female";
                        // select button
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetupScreen.female.select();
                        this.gui.ventSetupScreen.male.deselect();
                        this.gui.ventSetupScreen.height.select();
                        // enter gender and weight                        
                        this.state.screen = "ventSetupScreenGH";
                        this.render();
                    }
                }),
                height: new ToggleButtonEVO("height", {
                    top: 352, left: 145, width: 66, height: 54
                }, { 
                    connection: this.connection,
                    toggleButton: true,
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
                        this.state.ready = true;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        if (this.state.gender === "male") {
                            this.gui.ventSetupScreen.male.select();
                            this.gui.ventSetupScreen.female.deselect();
                        } else {
                            this.gui.ventSetupScreen.female.select();
                            this.gui.ventSetupScreen.male.deselect();
                        }
                        this.gui.ventSetupScreen.height.select();
                    }
                })
            },
            ventSetup: {
                peep: new ToggleButtonEVO("peep", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.peep.select();
                        this.state.screen = "ventSetupPeep";
                        this.render();
                    }
                }),
                o2: new ToggleButtonEVO("o2", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.o2.select();
                        this.state.screen = "ventSetupO2";
                        this.render();
                    }
                }),
                vsens: new ToggleButtonEVO("vsens", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.vsens.select();
                        this.state.screen = "ventSetupVsens";
                        this.render();
                    }
                }),
                ppeak: new ToggleButtonEVO("ppeak", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.ppeak.select();
                        this.state.screen = "ventSetupPpeak";
                        this.render();
                    }
                }),
                vmax: new ToggleButtonEVO("vmax", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.vmax.select();
                        this.state.screen = "ventSetupVmax";
                        this.render();
                    }
                }),
                vt: new ToggleButtonEVO("vt", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.vt.select();
                        this.state.screen = "ventSetupVt";
                        this.render();
                    }
                }),
                f: new ToggleButtonEVO("f", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.f.select();
                        this.state.screen = "ventSetupF";
                        this.render();
                    }
                }),
                ramp: new ToggleButtonEVO("ramp", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.ramp.select();
                        this.state.screen = "ventSetupRamp";
                        this.render();
                    }
                }),
                tpl: new ToggleButtonEVO("tpl", {
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
                        this.state.quickStartFlag = false;
                        this.deselectButtons({ exclude: ["male", "female"] });
                        this.gui.ventSetup.tpl.select();
                        this.state.screen = "ventSetupTpl";
                        this.render();
                    }
                })
            },
            connectPatientScreen: {
                confirmPatientConnected: new ToggleButtonEVO("confirmPatientConnected", {
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
                        this.state.quickStartFlag = false;
                        switch (this.state.screen) {
                            case "ventSetupScreenGH":
                            case "ventSetupScreenW": {
                                // move to next screen
                                this.state.screen = "connectPatientScreen";
                                // move ventSetup buttons to the lower panel
                                this.gui.ventSetup.f.move({ top: 391, left: -110 });
                                this.gui.ventSetup.vt.move({ top: 391, left: -48 });
                                this.gui.ventSetup.vmax.move({ top: 391, left: 14 });
                                this.gui.ventSetup.ramp.move({ top: 456, left: 14 });
                                this.gui.ventSetup.tpl.move({ top: 456, left: -48 });
                                this.gui.ventSetup.vsens.move({ top: 391, left: 146 });
                                this.gui.ventSetup.o2.move({ top: 391, left: 208 });
                                this.gui.ventSetup.peep.move({ top: 456, left: 208 });
                                this.gui.ventSetup.ppeak.move({ top: 456, left: 146 });
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
                        this.render();
                    }
                })
            },
            knob: new KnobEVO("knob", { top: 795, left: 538, width: 105, height: 105 }, {
                connection: this.connection,
                callback: (err?, res?: { command?: string }) =>  {
                    if (res?.command === "rotate_knob") {
                        const val: number = this.gui.knob.getDelta();
                        switch (this.state.screen) {
                            case "ventSetupScreenW": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.weight + delta;
                                this.state.weight = ( newVal >= 0) ? newVal : 0;
                                break;
                            }
                            case "ventSetupScreenGH": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.height + delta;
                                this.state.height = ( newVal >= 0) ? newVal : 0;
                                break;
                            }
                            case "ventSetupPeep": {
                                const delta = val * 0.1;
                                const newVal: number = this.state.peep + delta;
                                this.state.peep = newVal < this.range.peep.min ? this.range.peep.min
                                    : newVal > this.range.peep.max ? this.range.peep.max
                                        : newVal; 
                                break;
                            }
                            case "ventSetupO2": {
                                const delta = val * 0.5;
                                const newVal: number = this.state.o2 + delta;
                                this.state.o2 = newVal < this.range.o2.min ? this.range.o2.min
                                    : newVal > this.range.o2.max ? this.range.o2.max
                                        : newVal; 
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
                            case "ventSetupRamp": {
                                this.state.ramp = val <= 0; 
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        this.render();
                    }
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
            case "ventSetupScreenGH": {
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
        // render buttons
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
                case "height": {
                    const label: string = `<div style="height:17px;">${this.state.height.toFixed(0)}</div><div style="font-size:14px; color:grey; height:16px;">cm</div><div style="font-size:14px;">(${cm2in(this.state.height).toFixed(1)}In)</span>`;
                    if (this.state.gender) {
                        this.gui.ventSetupScreen.height.render(label);
                    } else {
                        this.gui.ventSetupScreen.height.hide();
                    }
                    break;
                }
                case "start": {
                    if (this.state.ready) {
                        const label: string = this.state.quickStartFlag ? "Quick START" : "START";
                        this.gui.ventSetupScreen.start.render(label);
                    } else {
                        this.gui.ventSetupScreen.start.render("");
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
                    if (this.state.ramp) {
                        // render ramp
                        const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">Ramp</div>
                            <div style="position:absolute; width:10px; height:20px; margin-top:3px; margin-left:12px; border-right:2px solid white; border-bottom:2px solid white;"></div>
                            <div style="position:absolute; transform:rotate(-45deg); width:10px; height:26px; margin-top:3px; margin-left:22px; border-right:2px solid white;"></div>
                            <div style="position:absolute; width:8px; height:20px; margin-top:3px; margin-left:39px; border-bottom:2px solid white;"></div>`;
                        this.gui.ventSetup.ramp.render(label);
                    } else {
                        // render square
                        const label: string = `<div style="font-size:14px; height:16px; line-height:16px;">Square</div>
                            <div style="position:absolute; width:10px; height:20px; margin-top:3px; margin-left:12px; border-bottom:2px solid white;"></div>
                            <div style="position:absolute; width:17px; height:20px; margin-top:3px; margin-left:22px; border-right:2px solid white; border-top:2px solid white; border-left:2px solid white;"></div>
                            <div style="position:absolute; width:8px; height:20px; margin-top:3px; margin-left:39px; border-bottom:2px solid white;"></div>`;
                        this.gui.ventSetup.ramp.render(label);
                    }
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
