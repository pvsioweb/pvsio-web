/**
 *
 * @author João Linhares
 * @date 15/08/2026
 */

// Imports
import { PVSioWebResponse, SendCommandToken, StartProcessToken } from '../../../client/common/interfaces/Connection';
import { uuid } from '../../../client/common/utils/uuidUtils';
import { WebSocketConnection as Connection } from '../../../client/core/ConnectionImpl';
import { AlertEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/AlertEVO';
import { BasicDisplayEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/BasicDisplayEVO';
import { ButtonEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/ButtonEVO';
import { FormEVO, Input } from '../../../client/plugins/PrototypeBuilder/widgets/core/FormEVO';
import { LedEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/LedEVO';
import { Button, MenuEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/MenuEVO';
import { Display, MultiDisplayEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/MultiDisplayEVO';
import * as Colors from './colors';
import * as Prop from './widgetProperties';

export interface Patient {
    name?: string,
    dob?: string,
    id_card?: string,
    carer?: string,
    mob?: string,
    id: string
}

export interface Medicine {
    medicine?: string,
    dosage?: number,
    validity?: string,
    quantity?: number,
    column?: number,
    id: string
}

export interface Script {
    name?: string,
    dosage?: number,
    quantity?: number,
    prescription?: string,
    dose?: Dose,
    id: string
}

export interface PatientScripts {
    patient?: string,
    scripts?: Script[]
}


export interface Dose {
    monthly?: string,
    weekly?: string,
    daily?: string,
    bidaily?: string,
    time1?: string,
    time2?: string,
    freq?: string
}


export type Field = {
    visible: string,
    entered: string,
    selected: string
}

export type Fields = {
    password: Field,
    dob: Field,
    medicine: Field,
    dosage: Field,
    id_card: Field,
    mob: Field,
    carer: Field,
    prescription: Field,
    name: Field,
    dose: Field,
    validity: Field,
    quantity: Field,
    column: Field,
    monthly: Field,
    weekly: Field,
    daily: Field,
    bidaily: Field,
    time1: Field,
    time2: Field
}

export type IDLine = {
    pos: string,
    val: string
}[]

export type ListScipt = {
    pos: string,
    val: Fields
}[]


export type PillboxState = {
    mode: string,
    action: {
        key1: string,
        key2: string,
        key3: string,
        confirm: string,
        create: string,
        quit: string,
        scan_action: string,
        medicines: string,
        tick: string,
        database: string,
        prescriptions: string
    },
    field: Fields,
    new_patient_record: Fields,
    patient_id_line: IDLine,
    med_id_line: IDLine,
    script_line: IDLine,
    scripts_db: {
        pos: string,
        val: {
            s_max: string,
            s_lines: ListScipt,
            s_doses: ListScipt
        }
    }[],
    patients_db: {
        pos: string,
        val: Fields
    }[],
    meds_db: {
        pos: string,
        val: Fields
    }[],
    p_max: string,
    p_lower: string,
    p_upper: string,
    p_current: string,
    m_max: string,
    m_lower: string,
    m_upper: string,
    m_current: string,
    s_lower: string,
    s_upper: string,
    s_current: string,
    scan_counter: string
};

const inputTypeMap = {
    'name': 'text',
    'dob': 'date',
    'id_card': 'text',
    'carer': 'text',
    'mob': 'text',
    'dosage': 'number',
    'quantity': 'number',
    'prescription': 'text',
    'monthly': 'checkbox',
    'weekly': 'checkbox',
    'daily': 'checkbox',
    'bidaily': 'checkbox',
    'freq': 'radio',
    'time1': 'time',
    'time2': 'time',
    'medicine': 'text',
    'validity': 'month',
    'column': 'number'
}

const radioOptions = [
    { value: 'monthly', name: 'Monthly: ' },
    { value: 'weekly', name: 'Weekly: ' },
    { value: 'daily', name: 'Daily: ' },
    { value: 'bidaily', name: 'Bidaily: ' },
]
const placeholderMap = {
    'name': 'Insert name',
    'dob': 'Insert date of birth',
    'id_card': 'Insert id card number',
    'carer': 'Insert carer id',
    'mob': 'Insert mobile number',
    'dosage': 'Insert dosage',
    'quantity': 'Insert quantity',
    'prescription': 'Insert prescription name',
    'medicine': 'Insert medicine name',
    'validity': 'Insert validity',
    'column': 'Insert column'
}

const varMap = {
    'name': 'Name: ',
    'dob': 'Date of birth: ',
    'id_card': 'ID: ',
    'carer': 'Carer: ',
    'mob': 'Mobile Number: ',
    'dosage': 'Dosage: ',
    'quantity': 'Quantity: ',
    'prescription': 'Prescription: ',
    'monthly': 'Monthly: ',
    'weekly': 'Weekly: ',
    'daily': 'Daily: ',
    'bidaily': 'Bidaily: ',
    'time1': 'Time 1: ',
    'time2': 'Time 2: ',
    'medicine': 'Medicine: ',
    'validity': 'Validity: ',
    'column': 'Column: ',
    'freq': 'Frequency: '
}

const unitMap = {
    'dosage': 'mg',
    'quantity': 'pill',
}

const colorMap = {
    'create': Colors.mountain_meadow,
    'createNewDose': Colors.mountain_meadow,
    'confirm': Colors.blue,
    'quit': Colors.red,
    'prescriptions': Colors.dark_green,
    'key1': Colors.mountain_meadow,
    'key2': Colors.yellow,
    'key3': Colors.red,
    'database': Colors.red
}

// Loading HTML element for the loading screen
const loadingHTML = '<div class="loadingTimerTitlle">Initiating Pillbox Model</div><div class="loadingTimerSubTitlle">Elapsed time</div><div class="loadingTimerInsideBox" style="top: 390px; left: 574px;"><div id="loadingTimerMinutes" class="loadingTimerInsideBoxTimer">00</div><div class="loadingTimerInsideBoxText">Minutes</div></div><div class="loadingTimerInsideBox" style="top: 390px; left: 966px;"><div id="loadingTimerSeconds" class="loadingTimerInsideBoxTimer">00</div><div class="loadingTimerInsideBoxText">Seconds</div></div><div class="loadingTimerWarning">Warning: The initiation of the pillbox model may take a coupe of seconds. To execute the model, do not close the browser or the server until the initiation is complete.</div>'

const P_LIMIT = 4
const M_LIMIT = 4
const S_LIMIT = 3


const menuOrder = ['prescriptions', 'confirm', 'create', 'createNewDose', 'quit']

const fieldOrder = ['password', 'name', 'dob', 'id_card', 'carer', 'mob', 'medicine', 'dosage', 'validity', 'quantity', 'column', 'prescription', 'freq', 'monthly', 'weekly', 'daily', 'bidaily', 'time1', 'time2']



/**
 * Pillbox model: Pillbox prototype
 */
class Pillbox {
    // connection to the backend
    protected connection: Connection = new Connection();

    // Loading timer timeout
    protected timerSetInterval: NodeJS.Timeout | null = null

    // gui layout, stores all widgets
    protected layout: {
        loading: AlertEVO,
        loadingSuccessMessage: AlertEVO,
        // Pillbox widgets
        console: {
            mode: BasicDisplayEVO,
            stateMode: BasicDisplayEVO,
            chooseMode: MenuEVO
        },
        mainMenu: MenuEVO,
        password: FormEVO,
        medicinesMenu: MenuEVO,
        listMenu: MenuEVO,
        scroll: MenuEVO,
        bottomMenu: MenuEVO,
        details: MultiDisplayEVO,
        form: FormEVO,
        alert: AlertEVO,
        scanLed: LedEVO,
        fingerprintScanner: ButtonEVO,

    }

    // Variable that stores the received state from the IVE pvs model
    protected PillboxState!: PillboxState

    protected medsDB: Medicine[] = new Array<Medicine>(M_LIMIT)

    protected scriptsDB: PatientScripts[] = new Array<PatientScripts>(P_LIMIT)

    protected patientsDB: Patient[] = new Array<Patient>(P_LIMIT)

    // user interface state (type declaration and initial values)
    protected helperVariables: {
        password: string,
        stateMode: string,
        addedPatient: Patient | null,
        added: string
        timer: number
    } = {
            stateMode: 'Full',
            timer: 0,
            password: "pass",
            addedPatient: null,
            added: ""
        };


    // Callback function shared between all widgets, gets state from response and renders widgets based on new state
    protected callback = (err: Error | null, res: PVSioWebResponse) => {
        const state: PillboxState = res?.data
        this.PillboxState = state;
        this.render(state);
    }

    // Loads the loading timer by adding 1 seconds to the timer and updating the timer display
    loadingUpdate() {
        const $timerMin = document.getElementById('loadingTimerMinutes')
        const $timerSec = document.getElementById('loadingTimerSeconds')
        if ($timerMin) $timerMin.innerHTML = ('0' + Math.floor(this.helperVariables.timer / 60)).slice(-2)
        if ($timerSec) $timerSec.innerHTML = ('0' + (this.helperVariables.timer % 60)).slice(-2)
        this.helperVariables.timer++
    }


    // Stops timer and removes loading screen alert
    closeTimer() {
        if (this.timerSetInterval !== null) clearInterval(this.timerSetInterval)
        this.timerSetInterval = null
        this.layout.loading.hide()
    }

    // Returns a sorted array given a list of strings that represents the order of possible strings
    sortList(array: string[], sortOrder: string[]): string[] {
        const res: string[] = []

        sortOrder.forEach(s => {
            if (array.includes(s)) {
                res.push(s)
            }
        })

        return res
    }


    /**
     * Constructor, creates the widgets
     */
    constructor() {
        this.layout = {
            loading: new AlertEVO('Loading', { height: 900, width: 1886, top: 0, left: 0 }, {
                parent: 'loader',
                alertElement: loadingHTML,
                css: {
                    "z-index": 99999,
                    'border-radius': '10px',
                    'border': '5px solid #6CFFAF',
                    'background': '#3E3E3E',
                },
            }
            ),
            loadingSuccessMessage: new AlertEVO('LoadingSuccesMessage', { width: 550, height: 82, top: 10, left: 690 }, {
                parent: 'content',
                closeButton: true,
                css: {
                    "z-index": 99999,
                    'border-radius': '10px',
                    'border': '3px solid #22C084',
                    'background': '#6CFFAF',
                },
                //@ts-ignore
                connection: this.connection,
                callback: () => {
                    this.layout.loadingSuccessMessage.remove()
                    this.render(this.PillboxState)
                }
            }
            ),
            mainMenu: new MenuEVO('mainMenu', { height: 205, width: 133, left: 695, top: 152 }, {
                parent: 'screen',
                mode: 'vertical',
                spacing: 20,
                //@ts-ignore
                connection: this.connection,
                buttonSize: Prop.buttonSize,
                globalButtonCSS: Prop.buttonCSS,
                callback: this.callback
            }),
            password: new FormEVO('password', { height: 154, width: 381, left: 229, top: 177 }, {
                parent: 'screen',
                globalInputSize: Prop.passwordInputSize,
                globalInputCss: Prop.passwordInputCSS,
                css: {
                    background: Colors.mine_shaft2
                },
                triggerOnChange: false,
                inputs: [{
                    placeholder: '**********',
                    type: 'password',
                    inputID: 'passwordEntry'
                }],
                //@ts-ignore
                connection: this.connection,
                callback: () => {
                    console.log("Click Button")
                    const value = this.layout.password.getValueWithValidation()
                    console.log("Value: " + JSON.stringify(value))
                    if (Object.keys(value.errors).length === 0) {
                        if (value.values["passwordEntry"] === this.helperVariables.password) {
                            const pass: SendCommandToken = {
                                id: "password_field",
                                type: "sendCommand",
                                command: "click_confirm"
                            }
                            this.connection.sendRequest("sendCommand", pass);
                            this.connection.onRequest("sendCommand", (err, res: PVSioWebResponse) => {
                                const state: PillboxState = res?.data
                                this.PillboxState = state;
                                this.render(state);
                            });
                        } else {
                            alert("Wrong Password")
                            this.render(this.PillboxState);
                        }
                    }
                },
                button: {
                    customLabel: 'Confirm',
                    buttonCSS: { ...Prop.buttonCSS, ...{ background: Colors.blue } },
                    size: Prop.buttonSize,
                    position: {
                        left: 120,
                        top: 99
                    }
                }
            }),
            medicinesMenu: new MenuEVO('medicinesMenu', { height: 200, width: 200, left: 320, top: 154 }, {
                parent: 'screen',
                //@ts-ignore
                connection: this.connection,
                buttonSize: Prop.medicinesButtonSize,
                globalButtonCSS: Prop.medicinesButtonCSS,
                buttons: [
                    {
                        buttonID: 'medicines',
                        customLabel: 'Medicines',
                    },
                ],
                callback: this.callback
            }),
            listMenu: new MenuEVO('listMenu', { height: 280, width: 574, left: 95, top: 114 }, {
                parent: 'screen',
                mode: 'vertical',
                spacing: 0,
                //@ts-ignore
                connection: this.connection,
                buttonSize: Prop.listButtonSize,
                globalButtonCSS: Prop.listButtonCSS,
                callback: this.callback
            }),
            scroll: new MenuEVO('scroll', { height: 397, width: 40, left: 29, top: 56 }, {
                parent: 'screen',
                mode: 'vertical',
                spacing: 317,
                //@ts-ignore
                connection: this.connection,
                buttonSize: Prop.scrollButtonSize,
                globalButtonCSS: Prop.scrollButtonCSS,
                buttons: [{
                    buttonID: 'scroll_up',
                    customLabel: 'v',
                    buttonCSS: {
                        'transform': 'rotate(180deg)'
                    }
                },
                {
                    buttonID: 'scroll_down',
                    customLabel: 'v'
                }],
                callback: this.callback
            }),
            bottomMenu: new MenuEVO('bottomMenu', { height: 55, width: 840, left: 0, top: 434 }, {
                parent: 'screen',
                mode: 'horizontal',
                center: true,
                spacing: 34,
                //@ts-ignore
                connection: this.connection,
                buttonSize: Prop.buttonSize,
                globalButtonCSS: Prop.buttonCSS,
                callback: this.callback
            }),
            details: new MultiDisplayEVO('detailsDisplay', { height: 434, width: 574, left: 95, top: 0 }, {
                parent: 'screen',
                mode: 'vertical',
                center: true,
                spacing: 15,
                css: {
                    background: Colors.mine_shaft2
                },
                globalDisplaySize: Prop.displaySize,
                globalDisplayCss: Prop.displayCSS,
            }),
            form: new FormEVO('form', { height: 310, width: 614, left: 55, top: 62 }, {
                parent: 'screen',
                spacing: 15,
                orientation: 'vertical',
                css: {
                    background: Colors.mine_shaft2
                },
                triggerOnChange: false,
                globalInputSize: Prop.inputSize,
                globalLabelCss: Prop.inputLabelCss,
                globalInputCss: Prop.inputCSS,
                inputLabelDivCss: Prop.inputLabelDivCss,
                inputs: []
            }),
            alert: new AlertEVO('alert', { width: 550, height: 82, top: 213, left: 145 }, {
                parent: 'screen',
                closeButton: false,
            }),
            scanLed: new LedEVO("scanLED", { top: 848, left: 689, height: 20, width: 20 }, {
                parent: "#content",
                renderMode: 'string'
            }),
            fingerprintScanner: new ButtonEVO("fingerprintScanner", { top: 830, left: 615, height: 40, width: 70 }, {
                parent: "#content",
                css: {
                    background: "transparent",
                },
                customFunction: 'tap_fingerprint_scanner',
                //@ts-ignore
                connection: this.connection,
                callback: this.callback
            }),
            console: {
                mode: new BasicDisplayEVO('mode', { height: 24, width: 265, top: 42, left: 6 }, {
                    parent: 'console',
                    renderMode: 'string'
                }),
                stateMode: new BasicDisplayEVO('stateMode', { height: 24, width: 469, top: 42, left: 162 }, {
                    parent: 'console',
                    renderMode: 'string'
                }),
                chooseMode: new MenuEVO('chooseMode', { height: 770, width: 140, top: 110, left: 11 }, {
                    parent: 'console',
                    mode: 'vertical',
                    //@ts-ignore
                    connection: this.connection,
                    globalButtonCSS: Prop.consoleButtonCSS,
                    buttonSize: Prop.consoleButtonSize,
                    spacing: 13,
                    buttons: [
                        {
                            customLabel: 'Full',
                            callback: () => {
                                this.helperVariables.stateMode = 'Full'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Simple',
                            callback: () => {
                                this.helperVariables.stateMode = 'Simple'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Fields',
                            callback: () => {
                                this.helperVariables.stateMode = 'Fields'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'New Patient Record',
                            callback: () => {
                                this.helperVariables.stateMode = 'New Patient Record'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Patient ID Line',
                            callback: () => {
                                this.helperVariables.stateMode = 'Patient ID Line'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Scripts ID Line',
                            callback: () => {
                                this.helperVariables.stateMode = 'Scripts ID Line'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Med ID Line',
                            callback: () => {
                                this.helperVariables.stateMode = 'Med ID Line'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Patiends DB',
                            callback: () => {
                                this.helperVariables.stateMode = 'Patiends DB'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Scripts DB',
                            callback: () => {
                                this.helperVariables.stateMode = 'Scripts DB'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Meds DB',
                            callback: () => {
                                this.helperVariables.stateMode = 'Meds DB'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Patients Local DB',
                            callback: () => {
                                this.helperVariables.stateMode = 'Patients Local DB'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Scripts Local DB',
                            callback: () => {
                                this.helperVariables.stateMode = 'Scripts Local DB'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Meds Local DB',
                            callback: () => {
                                this.helperVariables.stateMode = 'Meds Local DB'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Last Added Patient',
                            callback: () => {
                                this.helperVariables.stateMode = 'Last Added Patient'
                                this.render(this.PillboxState)
                            }
                        },
                        {
                            customLabel: 'Debug',
                            callback: () => {
                                this.helperVariables.stateMode = 'Debug'
                                this.render(this.PillboxState)
                            }
                        }
                    ],
                    callback: () => {
                        this.render(this.PillboxState)
                    }
                }),
            },
        }

    }

    tick() {
        const tick: SendCommandToken = {
            id: "tick",
            type: "sendCommand",
            command: "tick"
        }
        this.connection.sendRequest("sendCommand", tick);
        this.connection.onRequest("sendCommand", (err, res: PVSioWebResponse) => {
            const state: PillboxState = res?.data
            this.PillboxState = state;
            this.render(state);
        });
    }

    /**
     * Renders the console elements
     */
    renderConsole(state: PillboxState) {

        const consoleDiv = document.getElementById('console')

        if (consoleDiv) consoleDiv.style.display = 'block'

        let text = 'Mode: ' + state.mode
        this.layout.console.mode.render(text, {
            css: { ...Prop.consoleDisplay, ...{ 'text-align': 'left', 'z-index': 2 } }
        })

        text = 'State Mode: ' + this.helperVariables.stateMode
        this.layout.console.stateMode.render(text, {
            css: Prop.consoleDisplay
        })

        this.layout.console.chooseMode.render(JSON.stringify(state))


        // Print State
        const printState = document.getElementById('consoleState')

        const simple = { ...state }

        const removeFromOBJ = ['field', 'new_patient_record', 'patient_id_line', 'med_id_line', 'script_line', 'scripts_db', 'patients_db', 'meds_db']

        removeFromOBJ.forEach(del => {
            delete (simple as Record<string, unknown>)[del]
        })

        const script_dbSimple = [...state.scripts_db]

        const fields = ['password',
            'dob',
            'medicine',
            'dosage',
            'id_card',
            'mob',
            'carer',
            'prescription',
            'name',
            'dose',
            'validity',
            'quantity',
            'column',
            'monthly',
            'weekly',
            'daily',
            'bidaily',
            'time1',
            'time2']

        script_dbSimple.forEach((s, si) => {
            s.val.s_lines.forEach((sL, sLi) => {
                fields.forEach(f => {
                    const sLval = sL.val as Record<string, Field>
                    if (!(sLval[f]?.visible === 'TRUE' || sLval[f]?.entered === 'TRUE')) {
                        delete (script_dbSimple[si].val.s_lines[sLi].val as Record<string, Field>)[f]
                    }
                })
            })
            s.val.s_doses.forEach((sD, sDi) => {
                fields.forEach(f => {
                    const sDval = sD.val as Record<string, Field>
                    if (!(sDval[f]?.visible === 'TRUE' || sDval[f]?.entered === 'TRUE')) {
                        delete (script_dbSimple[si].val.s_doses[sDi].val as Record<string, Field>)[f]
                    }
                })
            })
        })

        const stateModeObj = {
            'Full': state,
            'Simple': simple,
            'Fields': state.field,
            'New Patient Record': state.new_patient_record,
            'Patient ID Line': { ...state.patient_id_line, ...{ 'p_max': state.p_max, 'p_lower': state.p_lower, 'p_upper': state.p_upper, 'p_current': state.p_current } },
            'Scripts ID Line': { ...state.script_line, ...{ 's_lower': state.s_lower, 's_upper': state.s_upper, 's_current': state.s_current } },
            'Med ID Line': { ...state.med_id_line, ...{ 'm_max': state.m_max, 'm_lower': state.m_lower, 'm_upper': state.m_upper, 'm_current': state.m_current } },
            'Patiends DB': state.patients_db,
            'Scripts DB': state.scripts_db,
            'Meds DB': state.meds_db,
            'Patients Local DB': this.patientsDB,
            'Scripts Local DB': this.scriptsDB,
            'Meds Local DB': this.medsDB,
            'Last Added Patient': this.helperVariables.addedPatient,
            'Debug': { ...simple, 'field': state.field, 'script_db': script_dbSimple }
        }

        console.log(state.mode, JSON.stringify({ ...simple, 'field': state.field, 'script_db': script_dbSimple }))
        if (printState) printState.innerHTML = JSON.stringify((stateModeObj as Record<string, unknown>)[this.helperVariables.stateMode], null, 4)

    }

    /**
     * Renders the layout elements
     */
    render(state: PillboxState) {
        // ---------------------- Console ------------------------------------
        this.renderConsole(state)


        // ---------------------- Right Menu ------------------------------------
        if (state.action.key1 === 'TRUE' || state.action.key2 === 'TRUE' || state.action.key3 === 'TRUE' || state.action.database === 'TRUE') {

            const menuButtons: Button[] = []

            if (state.action.key1 === 'TRUE') {
                menuButtons.push({
                    buttonID: 'key1',
                    customLabel: 'Home',
                    buttonCSS: {
                        background: colorMap['key1']
                    }

                })
            }

            if (state.action.key2 === 'TRUE') {
                menuButtons.push({
                    buttonID: 'key2',
                    customLabel: 'Patients',
                    buttonCSS: {
                        background: colorMap['key2']
                    }

                })
            }

            if (state.action.key3 === 'TRUE') {
                menuButtons.push({
                    buttonID: 'key3',
                    customLabel: 'Medicine',
                    buttonCSS: {
                        background: colorMap['key3']
                    }

                })
            }

            if (state.action.database === 'TRUE') {
                menuButtons.push({
                    buttonID: 'database',
                    customLabel: 'Database',
                    customFunction: 'click_act_database',
                    buttonCSS: {
                        background: colorMap['database']
                    }

                })
            }

            this.layout.mainMenu.render(JSON.stringify(state), { buttons: menuButtons })
        } else {
            this.layout.mainMenu.hide()
        }

        // ---------------------- Password ------------------------------------
        if (state.action.confirm === 'TRUE' && state.field.password.visible === 'TRUE') {
            this.layout.password.render(JSON.stringify(state))
        } else {
            this.layout.password.hide()
        }

        // ---------------------- Medicines Menu ------------------------------------
        if (state.action.medicines === 'TRUE') {
            this.layout.medicinesMenu.render(JSON.stringify(state))
        } else {
            this.layout.medicinesMenu.hide()
        }

        // ---------------------- List Menu (Patients / Scripts / Meds) ------------------------------------
        if (state.mode === 'patient_list' || state.mode === 'patient_scripts_list' || state.mode === 'db_med_list') {
            const listMenuConfig = {
                'patient_list': {
                    idLine: state.patient_id_line,
                    db: this.patientsDB as (Patient | Script | Medicine)[],
                    customFunction: 'click_patients'
                },
                'patient_scripts_list': {
                    idLine: state.script_line,
                    db: (this.scriptsDB.find(s => s?.patient === state.p_current)?.scripts ?? []) as (Patient | Script | Medicine)[],
                    customFunction: 'click_script'
                },
                'db_med_list': {
                    idLine: state.med_id_line,
                    db: this.medsDB as (Patient | Script | Medicine)[],
                    customFunction: 'click_med'
                }
            }

            const config = listMenuConfig[state.mode]
            const buttons: Button[] = []

            config.idLine.sort((a, b) => (+a.pos) - (+b.pos)).forEach(id => {
                if (id.val === 'TRUE') {
                    const entry = config.db.find(e => e?.id === id.pos)
                    const label = entry ? ((entry as Medicine).medicine ?? (entry as Patient | Script).name) : undefined
                    buttons.push({
                        buttonID: 'listMenu' + id.pos,
                        customFunction: entry ? `${config.customFunction}(${id.pos})` : undefined,
                        customLabel: entry ? id.pos + ': ' + label : id.pos + ': --------------'
                    })
                }
            })

            this.layout.listMenu.render(JSON.stringify(state), { buttons: buttons })
        } else {
            this.layout.listMenu.hide()
        }

        // ---------------------- Scroll bar ------------------------------------
        const scrollBarDiv = document.getElementById('scrollBar')

        if (['patient_list', 'patient_scripts_list', 'db_med_list'].includes(state.mode)) {
            if (scrollBarDiv) scrollBarDiv.style.display = 'block'
            this.layout.scroll.render(JSON.stringify(state))
        } else {
            if (scrollBarDiv) scrollBarDiv.style.display = 'none'
            this.layout.scroll.hide()
        }

        // ---------------------- Bottom Menu ------------------------------------
        const bottomButtons: Button[] = []

        const actionsFiltered: Record<string, string> = { ...state.action }

        const toRemoveActions = ['key1', 'key2', 'key3', 'medicines', 'database', 'scan_action', 'tick', "reload", "unload", "bottom", "drug_id_line"]

        toRemoveActions.forEach(rma => {
            delete actionsFiltered[rma]
        })

        if (state.action.confirm === 'TRUE' && state.field.password.visible === 'TRUE') {
            delete actionsFiltered['confirm']
        }

        if (state.action.create === 'TRUE' && state.mode === 'new_dose') {
            delete actionsFiltered['create']
        }

        Object.keys(actionsFiltered).forEach(a => {
            if (actionsFiltered[a] === 'FALSE') {
                delete actionsFiltered[a]
            }
        })

        let actions = Object.keys(actionsFiltered)

        if (state.action.create === 'TRUE' && state.mode === 'new_dose') {
            actions.push('createNewDose')
        }

        actions = this.sortList(actions, menuOrder)

        const callbackObj = {
            'confirm': (err: Error | null, res: PVSioWebResponse) => {
                if (this.PillboxState.mode === 'new_patient_details') {
                    console.log("Click new_patient_details")
                    const value = this.layout.form.getValueWithValidation()
                    console.log("Value: " + JSON.stringify(value))
                    if (Object.keys(value.errors).length === 0 && (['nameEntry', 'dobEntry', 'id_cardEntry', 'carerEntry', 'mobEntry'].every(k => value.values[k] != null && value.values[k] !== ''))) {
                        this.helperVariables.addedPatient = {
                            name: value.values["nameEntry"],
                            dob: value.values['dobEntry'],
                            id_card: value.values['id_cardEntry'],
                            carer: value.values['carerEntry'],
                            mob: value.values['mobEntry'],
                            id: ''
                        } as Patient
                        console.log(res)
                        const state: PillboxState = res?.data
                        this.PillboxState = state;
                        this.render(state);
                        return
                    } else {
                        this.render(this.PillboxState);
                        return
                    }
                }
                if (this.PillboxState.mode === 'new_med') {
                    console.log("Click new_med")
                    const value = this.layout.form.getValueWithValidation()
                    console.log("Value: " + JSON.stringify(value))
                    if (Object.keys(value.errors).length === 0 && (['medicineEntry', 'dosageEntry', 'validityEntry', 'quantityEntry', 'columnEntry'].every(k => value.values[k] != null && value.values[k] !== ''))) {
                        this.medsDB[+this.PillboxState.m_max] = {
                            medicine: value.values['medicineEntry'],
                            dosage: value.values["dosageEntry"],
                            validity: value.values['validityEntry'],
                            quantity: value.values['quantityEntry'],
                            column: value.values['columnEntry'],
                            id: this.PillboxState.m_max
                        } as Medicine
                        const state: PillboxState = res?.data
                        this.PillboxState = state;
                        this.render(state);
                        return
                    } else {
                        this.render(this.PillboxState);
                        return
                    }
                }
                const state: PillboxState = res?.data
                this.PillboxState = state;
                this.render(state);
            },
            'create': (err: Error | null, res: PVSioWebResponse) => {
                if (this.PillboxState.mode === 'new_patient_script') {
                    console.log("Click new_patient_script")
                    const value = this.layout.form.getValueWithValidation()
                    console.log("Value: " + JSON.stringify(value))
                    if (Object.keys(value.errors).length === 0 && (['nameEntry', 'dosageEntry', 'quantityEntry', 'prescriptionEntry'].every(k => value.values[k] != null && value.values[k] !== ''))) {
                        const scriptsEntry = this.scriptsDB.find(s => s?.patient === this.PillboxState.p_current)
                        const sMax = this.PillboxState.scripts_db.find(sDB => sDB?.pos === this.PillboxState.p_current)?.val?.s_max
                        if (scriptsEntry?.scripts && sMax !== undefined) {
                            scriptsEntry.scripts[+sMax] = {
                                name: value.values['nameEntry'],
                                dosage: value.values["dosageEntry"],
                                quantity: value.values['quantityEntry'],
                                prescription: value.values['prescriptionEntry'],
                                id: sMax
                            } as Script
                        }
                        const state: PillboxState = res?.data
                        this.PillboxState = state;
                        this.render(state);
                        return
                    } else {
                        this.render(this.PillboxState);
                        return
                    }
                }
                const state: PillboxState = res?.data
                this.PillboxState = state;
                this.render(state);
            },
            'quit': (err: Error | null, res: PVSioWebResponse) => {
                if (this.PillboxState.mode === 'creation_success') {
                    this.patientsDB[+this.PillboxState.p_max] = { ...this.helperVariables.addedPatient as Patient, ...{ id: this.PillboxState.p_max } }
                    this.scriptsDB[+this.PillboxState.p_max] = {
                        patient: this.PillboxState.p_max,
                        scripts: new Array<Script>(S_LIMIT)
                    } as PatientScripts
                }
                console.log('before', this.PillboxState)
                console.log('before', JSON.stringify(this.PillboxState))
                const state: PillboxState = res?.data
                this.PillboxState = state;
                console.log('after', this.PillboxState)
                console.log('after', JSON.stringify(this.PillboxState))
                this.render(state);
            },
            'createNewDose': (err: Error | null, res: PVSioWebResponse) => {
                console.log("Click new_dose")
                const value = this.layout.form.getValueWithValidation()
                console.log("Value: " + JSON.stringify(value))
                if (Object.keys(value.errors).length === 0 && (value.values['freqEntry'] && value.values['time1Entry'])) {
                    if (value.values['freqEntry'] !== 'bidaily' || (value.values['freqEntry'] === 'bidaily' && value.values['time2Entry'])) {
                        const pass: SendCommandToken = {
                            id: uuid(),
                            type: "sendCommand",
                            command: "click_create_" + value.values['freqEntry']
                        }
                        console.log('sending message ' + "click_create_" + value.values['freqEntry'])
                        this.connection.sendRequest("sendCommand", pass);
                        this.connection.onRequest("sendCommand", (err, res: PVSioWebResponse) => {
                            const safeValue = value.values as Record<string, string>
                            const sMaxDose = this.PillboxState.scripts_db.find(s => s?.pos === this.PillboxState.p_current)?.val?.s_max
                            const scriptEntry = this.scriptsDB.find(s => s?.patient === this.PillboxState.p_current)?.scripts?.find(s => s?.id === sMaxDose)
                            if (scriptEntry) {
                                scriptEntry.dose = {
                                    monthly: (safeValue['freqEntry'] === 'monthly').toString(),
                                    weekly: (safeValue['freqEntry'] === 'weekly').toString(),
                                    daily: (safeValue['freqEntry'] === 'daily').toString(),
                                    bidaily: (safeValue['freqEntry'] === 'bidaily').toString(),
                                    time1: safeValue['time1Entry'],
                                    time2: safeValue['time2Entry'] ? safeValue['time2Entry'] : null,
                                    freq: safeValue['freqEntry'].charAt(0).toUpperCase() + safeValue['freqEntry'].slice(1)
                                } as Dose
                            }
                            const state: PillboxState = res?.data
                            this.PillboxState = state;
                            this.render(state);
                        });
                        return
                    } else {
                        alert('Selected bidaily, add a value for Time 2.')
                        this.render(this.PillboxState)
                    }
                }

                this.render(this.PillboxState)
            }
        }

        console.log(actions)
        actions.forEach(a => {
            bottomButtons.push({
                buttonID: a,
                buttonCSS: { background: (colorMap as Record<string, string>)[a] },
                customLabel: a === 'createNewDose' ? 'Create' : a.charAt(0).toUpperCase() + a.slice(1),
                callback: (callbackObj as Record<string, ((err: Error | null, res: PVSioWebResponse) => void) | undefined>)[a] ?? undefined
            })
        })

        this.layout.bottomMenu.render(JSON.stringify(state), { buttons: bottomButtons })

        // ---------------------- Details ------------------------------------
        if (['patient_details', 'patient_script', 'dose', 'db_med_details'].includes(state.mode)) {
            const displays: Display[] = []

            let stateParsed: Patient | Script | Dose | Medicine | undefined

            switch (state.mode) {
                case 'patient_details': {
                    stateParsed = this.patientsDB.find(p => p?.id === state.p_current)
                    break
                }
                case 'patient_script': {
                    stateParsed = this.scriptsDB.find(s => s?.patient === state.p_current)?.scripts?.find(s => s?.id === state.s_current)
                    break
                }
                case 'dose': {
                    stateParsed = this.scriptsDB.find(s => s?.patient === state.p_current)?.scripts?.find(s => s?.id === state.s_current)?.dose
                    break
                }
                case 'db_med_details': {
                    stateParsed = this.medsDB.find(m => m?.id === state.m_current)
                    break
                }
            }

            let displaysFiltered: string[] = []
            const fieldMap = state.field as Record<string, Field>

            Object.keys(state.field).filter(i => i !== 'password' && i !== 'monthly' && i !== 'weekly' && i !== 'daily' && i !== 'bidaily' && i !== 'time2').forEach(f => {
                if (fieldMap[f].visible === 'TRUE' && fieldMap[f].entered === 'TRUE') {
                    displaysFiltered.push(f)
                }
            })

            const tempFields = ['monthly', 'weekly', 'daily', 'bidaily']
            let flag = true
            tempFields.forEach(f => {
                if (fieldMap[f].visible === 'TRUE' && fieldMap[f].entered === 'TRUE' && flag) {
                    displaysFiltered.push('freq')
                    flag = false
                }
            })

            if (fieldMap['time2'].visible === 'TRUE' && fieldMap['time2'].entered === 'TRUE' && (state.mode === 'dose' && (stateParsed as Dose | undefined)?.time2 != null)) {
                displaysFiltered.push('time2')
            }

            displaysFiltered = this.sortList(displaysFiltered, fieldOrder)

            displaysFiltered.forEach(o => {
                displays.push({
                    displayName: o,
                    label: (varMap as Record<string, string>)[o],
                    unit: (unitMap as Record<string, string>)[o] ? (unitMap as Record<string, string>)[o] + (o === 'quantity' && (stateParsed as { quantity?: number } | undefined)?.quantity !== 1 ? 's' : '') : undefined
                })
            })

            this.layout.details.render(JSON.stringify(stateParsed), { displays: displays })
        } else {
            this.layout.details.hide()
        }

        // ---------------------- Form ------------------------------------

        let fieldsFiltered: string[] = []
        const fieldMapForm = state.field as Record<string, Field>

        Object.keys(state.field).filter(i => !['password', 'monthly', 'weekly', 'daily', 'bidaily'].includes(i)).forEach(f => {
            if (fieldMapForm[f].visible === 'TRUE' && fieldMapForm[f].entered === 'FALSE') {
                fieldsFiltered.push(f)
            }
        })

        if (state.field.monthly.visible === 'TRUE' && state.field.monthly.entered === 'FALSE' &&
            state.field.weekly.visible === 'TRUE' && state.field.weekly.entered === 'FALSE' &&
            state.field.bidaily.visible === 'TRUE' && state.field.bidaily.entered === 'FALSE' &&
            state.field.daily.visible === 'TRUE' && state.field.daily.entered === 'FALSE') {
            fieldsFiltered.push('freq')
        }

        if (fieldsFiltered.length > 0) {
            switch (state.mode) {
                case 'new_patient_details': {
                    this.layout.form.setPositionAndSize({ height: 310, width: 614, left: 55, top: 62 })
                    break
                }
                case 'new_patient_script': {
                    this.layout.form.setPositionAndSize({ height: 245, width: 614, left: 55, top: 62 })
                    break
                }
                case 'new_dose': {
                    this.layout.form.setPositionAndSize({ height: 375, width: 614, left: 55, top: 50 })
                    break
                }
                case 'new_med': {
                    this.layout.form.setPositionAndSize({ height: 310, width: 614, left: 55, top: 62 })
                    break
                }
            }

            const inputs: Input[] = []

            fieldsFiltered = this.sortList(fieldsFiltered, fieldOrder)

            fieldsFiltered.forEach(i => {
                inputs.push({
                    label: (varMap as Record<string, string>)[i],
                    inputID: i + 'Entry',
                    type: (inputTypeMap as Record<string, Input['type']>)[i],
                    placeholder: (placeholderMap as Record<string, string | undefined>)[i],
                    required: i === 'time2' ? false : undefined,
                    options: i === 'freq' ? radioOptions : undefined
                })
            })

            this.layout.form.render(JSON.stringify(state), { inputs: inputs })

        } else {
            this.layout.form.hide()
        }

        // ---------------------- Scan Alert ------------------------------------
        if (state.mode === 'scan' || state.mode === 'scan_enabled' || state.mode === 'creation_success') {

            const alertObj = {
                'scan': {
                    alertElement: '<div class="scanTitle">Validation</div><div class="scanText">Please scan your fingerprint.</div>',
                    css: {
                        "z-index": 99999,
                        'border-radius': '10px',
                        'border': '3px solid var(--mine-shaft-darker, #303030)',
                        'background': Colors.yellow,
                    }
                },
                'scan_enabled': {
                    alertElement: '<div class="scanGreenTitle">Validated</div><div class="scanGreenText">Scan successful, please wait...</div>',
                    css: {
                        "z-index": 99999,
                        'border-radius': '10px',
                        'border': '3px solid var(--mountain-meadow, #22C084)',
                        'background': Colors.aquamarine,
                    }
                },
                'creation_success': {
                    alertElement: '<div class="scanGreenTitle">Success</div><div class="scanGreenText">Patient registered successfully!</div>',
                    css: {
                        "z-index": 99999,
                        'border-radius': '10px',
                        'border': '3px solid var(--mountain-meadow, #22C084)',
                        'background': Colors.aquamarine,
                    }
                }
            }


            this.layout.alert.render(JSON.stringify(state), alertObj[state.mode])
        } else {
            this.layout.alert.hide()
        }

        // ---------------------- Fingerprint Scanner ------------------------------------

        if (state.action.scan_action === 'TRUE') {

            this.layout.fingerprintScanner.render(JSON.stringify(state))
        } else {
            this.layout.fingerprintScanner.hide()
        }

        // ---------------------- Scan Led ------------------------------------
        this.layout.scanLed.render(state.mode === 'scan' ? Colors.aquamarine : Colors.red)

        // ---------------------- Tick ------------------------------------
        if (state.action.tick === 'TRUE') {
            this.tick()
        }
    }

    /**
     * Activate the prototype, i.e., connects to the back-end and renders the user interface
     */
    async activate(): Promise<void> {
        // Start Timer
        this.layout.loading.render()
        // Set timer clock update
        this.timerSetInterval = setInterval(() => this.loadingUpdate(), 1000)

        const success: boolean = await this.connection.activate();
        if (success) {
            // start pvsio
            const proc: StartProcessToken = {
                id: uuid(),
                type: "startProcess",
                data: {
                    contextFolder: "demos/pillbox/pvs",
                    fileName: "main",
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
                    command: "init(0)"
                }
                this.connection.sendRequest("sendCommand", init);
                this.connection.onRequest("sendCommand", (err, res: PVSioWebResponse) => {
                    console.log("Model initialized!", res);
                    const state: PillboxState = res?.data;
                    console.log(state)
                    this.PillboxState = state
                    if (this.timerSetInterval !== null) clearInterval(this.timerSetInterval)
                    this.timerSetInterval = null
                    const minutes = Math.floor(this.helperVariables.timer / 60)
                    const minutesText = minutes + ' minute' + (minutes === 1 ? '' : 's')
                    const seconds = this.helperVariables.timer % 60
                    const secondsText = seconds + ' second' + (seconds === 1 ? '' : 's')
                    const loadingSuccessMessage = '<div class="loadSuccessTitle">Pillbox Model Loaded Successfully</div><div class="loadSuccessText">Pillbox Model has been loaded with ' + minutesText + ' and ' + secondsText + ' of load time.</div>'
                    this.layout.loading.hide()
                    this.layout.loadingSuccessMessage.render('', { alertElement: loadingSuccessMessage })

                    const contentDiv = document.getElementById('content')
                    const loadertDiv = document.getElementById('loader')

                    if (contentDiv) contentDiv.style.display = 'block'
                    if (loadertDiv) loadertDiv.style.display = 'none'

                    // update all display elements
                    this.render(state);
                });
            });
        }
    }
}

// create an instance of the prototype and activate the prototype
const demo: Pillbox = new Pillbox();
demo.activate();
