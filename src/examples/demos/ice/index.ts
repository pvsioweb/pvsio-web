/**
 * @version 1.0
 * @description Prototype for an Integrated Clinical Environment model.
 * @author João Linhares
 * @date 15/08/2026
 *
 */

import { SendCommandToken, StartProcessToken } from '../../../client/common/interfaces/Connection';
import { uuid } from '../../../client/common/utils/uuidUtils';
import { WebSocketConnection as Connection } from '../../../client/core/ConnectionImpl';

import { CSS } from '../../../client/common/interfaces/Widgets';
import { AlertEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/AlertEVO';
import { BasicDisplayEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/BasicDisplayEVO';
import { ContainerEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/ContainerEVO';
import { Filter, FilterEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/FilterEVO';
import { FormEVO, Input } from '../../../client/plugins/PrototypeBuilder/widgets/core/FormEVO';
import { LedEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/LedEVO';
import { Button, MenuEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/MenuEVO';
import { Display, MultiDisplayEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/MultiDisplayEVO';
import { RuleDisplayEVO } from '../../../client/plugins/PrototypeBuilder/widgets/core/RuleDisplayEVO';

import * as Colors from './colors';
import * as Enum from './enum';
import { ICEState } from './type';
import * as Props from './widgetProperties';

/*
    Constant values declarations. In the ICE pvs model, the value 16 represents the null value for the ids of the patients and the devices.
*/
const P_NULL_VALUE = 16
const D_NULL_VALUE = 16

// Loading HTML element for the loading screen
const loadingHTML = '<div class="loadingTimerTitlle">Initiating ICE Model</div><div class="loadingTimerSubTitlle">Elapsed time</div><div class="loadingTimerInsideBox" style="top: 390px; left: 574px;"><div id="loadingTimerMinutes" class="loadingTimerInsideBoxTimer">00</div><div class="loadingTimerInsideBoxText">Minutes</div></div><div class="loadingTimerInsideBox" style="top: 390px; left: 966px;"><div id="loadingTimerSeconds" class="loadingTimerInsideBoxTimer">00</div><div class="loadingTimerInsideBoxText">Seconds</div></div><div class="loadingTimerWarning">Warning: The initiation of the ICE model may take a while. To execute the model, do not close the browser or the server until the initiation is complete.</div>'

// Coordinator Error HTML element for the error mode in coordinator
const coordErrorHTML = '<div class="errorTitle" style="top: 0px; left: 0px; width: 1886px; height: 126px;">Error</div><div class="errorText" style="top: 446px; left: 737px; width: 411pxpx; height: 198px;">An error has occurred.</div>'

// Patient Layer Error HTML element for the error mode in patient layer
const plErrorHTML = '<div class="errorTitle" style="top: 0px; left: 0px; width: 828px; height: 105px;">Error</div><div id="plErrorPatientNotConnected" class="errorText" style="top: 561px; left: 0px; width: 828px; height: 100px;">Patient not connected to coordinator.</div>'

const ipkeysOrder = ['chooserate', 'choosevtbi', 'choosetime', 'createNewDose', 'powr', 'confirm', 'bolus', 'hold', 'start']
/**
 * ICE model: ICE prototype
 */
class ICE {
    // Connection to the backend
    protected connection: Connection = new Connection();

    // Loading timer timeout
    protected timerSetInterval: NodeJS.Timeout | null = null

    // Timeout to repeatly call tick function in a set interval
    protected tickInterval: NodeJS.Timeout | null = null

    // Timeout to update countdown timer until next tick
    protected timerUntilNextTick: NodeJS.Timeout | null = null

    // GUI layout, stores all widgets
    protected layout: {
        loading: AlertEVO,
        loadingSuccessMessage: AlertEVO,
        tickMessage: AlertEVO,
        coordinator: {
            error: AlertEVO,
            sidebar: MenuEVO,
            mainMenu: MenuEVO,
            constraintAlarm: AlertEVO[],
            topInfo: {
                selectedPatient: BasicDisplayEVO,
                currentMode: BasicDisplayEVO,
                currentDisplay: BasicDisplayEVO
            },
            topMode: {
                patients: {
                    patientName: BasicDisplayEVO,
                    devices: ContainerEVO[]
                }[]
            },
            patientMode: {
                devices: ContainerEVO[]
            },
            deviceMode: {
                currentDevice: BasicDisplayEVO,
                deviceDisplay: ContainerEVO
            },
            sharedDevicePatientModes: {
                currentPatient: BasicDisplayEVO,
                selectDevice: MenuEVO,
                executeButton: MenuEVO,
                actionInfo: MultiDisplayEVO
            }
        },
        patientLayer: {
            error: AlertEVO,
            topbar: MenuEVO,
            mainMenu: MenuEVO,
            topInfo: {
                selectedDevice: BasicDisplayEVO,
                currentPatient: BasicDisplayEVO,
                currentDisplay: BasicDisplayEVO
            },
            topMode: {
                devicesTopDisplay: ContainerEVO[],
                devicesMainDisplay: ContainerEVO[],
                rules: RuleDisplayEVO[],
                deviceName: FormEVO
            },
            deviceMode: {
                deviceName: BasicDisplayEVO,
                device: ContainerEVO,
                rules: RuleDisplayEVO[]
            },
            edit: {
                title: BasicDisplayEVO,
                ok: MenuEVO,
                editDisplays: {
                    paramEntry: BasicDisplayEVO,
                    filterParams: FilterEVO,
                    actionEntry: BasicDisplayEVO,
                    filterActions: FilterEVO
                },
                editConstraint: {
                    prevConstraints: RuleDisplayEVO,
                    editInfo: MultiDisplayEVO,
                    numForm: FormEVO,
                    enumForm: FormEVO,
                    numValidation: BasicDisplayEVO
                },
                editRules: {
                    currentConstraints: RuleDisplayEVO,
                    rules: RuleDisplayEVO[],
                    editInfo: MultiDisplayEVO,
                    actionForm: FormEVO
                }
            }
        },
        deviceLayerIP: {
            screen: MultiDisplayEVO,
            keys: MenuEVO,
            arrowKeys: MenuEVO
        },
        deviceLayerVS: {
            screen: ContainerEVO,
            power: MenuEVO,
            led: LedEVO
        },
        console: {
            modeChanger: MenuEVO,
            connect: MenuEVO,
            choosePatient: FormEVO,
            chooseDevice: FormEVO,
            chooseSyncMode: MenuEVO,
            populate: MenuEVO,
            tickFunctions: MenuEVO,
            currPatient: BasicDisplayEVO,
            currDevice: BasicDisplayEVO,
            stateMode: MenuEVO,
            chooseInterval: FormEVO,
            currInterval: BasicDisplayEVO,
            stateCurrMode: BasicDisplayEVO,
            currSyncMode: BasicDisplayEVO,
        }
    };

    // Variable that stores the received state from the ICE pvs model
    protected ICEState!: ICEState

    //user interface state (type declaration and initial values)
    protected helperVariables: {
        mode: string,
        currPatient: number,
        numPatients: number,
        stateMode: string,
        currDevice: number,
        timer: number,
        syncMode: string,
        timerUntilNextTick: number,
        currInterval: number
    } = {
            timer: 0,
            mode: 'coord',
            currPatient: 0,
            numPatients: 0,
            currDevice: 0,
            stateMode: 'full',
            syncMode: 'auto',
            currInterval: 20,
            timerUntilNextTick: 20
        };

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

    private parseState(res: SendCommandToken): ICEState {
        const raw = res?.raw ?? ''
        const s = raw.slice(1, -1).replace(/\r?\n|\r/g, ' ').replace(/\\\"/g, '\"')
        return JSON.parse(s.replace(/\r?\n|\r/g, ' ').replace(/FALSE/g, '\"FALSE\"').replace(/TRUE/g, '\"TRUE\"'))
    }

    // Callback function shared between all widgets, gets state from response and renders widgets based on new state
    protected callback = (err: Error | null, res: SendCommandToken) => {
        const state: ICEState = this.parseState(res)
        this.ICEState = state;
        this.render(state);
    }

    // Loads the loading timer by adding 1 seconds to the timer and updating the timer display
    loadingUpdate() {
        const $timerMin = document.getElementById('loadingTimerMinutes')!
        const $timerSec = document.getElementById('loadingTimerSeconds')!
        $timerMin.innerHTML = ('0' + Math.floor(this.helperVariables.timer / 60)).slice(-2)
        $timerSec.innerHTML = ('0' + (this.helperVariables.timer % 60)).slice(-2)
        this.helperVariables.timer++
    }


    // Stops timer and removes loading screen alert
    closeTimer() {
        if (this.timerSetInterval) clearInterval(this.timerSetInterval)
        this.timerSetInterval = null
        this.layout.loading.hide()
    }

    /**
     * Constructor, creates the widgets 
     */
    constructor() {
        this.layout = {
            loading: new AlertEVO('Loading', { height: 1044, width: 1886, top: 53, left: 267 }, {
                parent: 'content',
                alertElement: loadingHTML,
                css: {
                    "z-index": 99999,
                    'border-radius': '10px',
                    'border': '5px solid #6CFFAF',
                    'background': '#3E3E3E',
                },
            }
            ),
            loadingSuccessMessage: new AlertEVO('LoadingSuccesMessage', { width: 550, height: 82, top: 15, left: 30 }, {
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
                    this.render(this.ICEState)
                }
            }
            ),
            tickMessage: new AlertEVO('tickMessage', { width: 550, height: 82, top: 112, left: 30 }, {
                parent: 'content',
                css: {
                    "z-index": 99999,
                    'border-radius': '10px',
                    'border': '3px solid #37433E',
                    'background': '#FAC032'
                }
            }),
            coordinator: {
                error: new AlertEVO('coordErrorMode', { height: 1044, width: 1886, top: 0, left: 0 }, {
                    parent: 'coordBlackBox',
                    alertElement: coordErrorHTML,
                    css: {
                        "z-index": 99998,
                        'border-radius': '10px',
                        'border': '3px solid var(--Dark, #E74F48)',
                        'background': 'var(--Red-Default, #FF6760)',
                    }
                }),
                sidebar: new MenuEVO('coordSelectPatient', { height: 893, width: 211, top: 155, left: 21 }, {
                    parent: 'coordSidebar',
                    buttonSize: Props.buttonSidebarSize,
                    css: {
                        background: 'transparent',
                        'overflow': 'hidden'
                    },
                    spacing: 31,
                    globalButtonCSS: Props.buttonSidebarCSS,
                    callback: this.callback,
                    //@ts-ignore
                    connection: this.connection
                }),
                mainMenu: new MenuEVO('coordMainMenu', { height: 47, width: 1144, top: 1126, left: 313 }, {
                    parent: 'coordScreen',
                    buttonSize: Props.buttonSize,
                    mode: 'horizontal',
                    spacing: 38,
                    globalButtonCSS: Props.buttonCSS,
                    callback: this.callback,
                    //@ts-ignore
                    connection: this.connection
                }),
                constraintAlarm: [],
                topInfo: {
                    selectedPatient: new BasicDisplayEVO('coordSelectedPatient', { height: 24, width: 300, top: 25, left: 313 }, {
                        parent: 'coordScreen',
                        renderMode: 'string'
                    }),
                    currentMode: new BasicDisplayEVO('coordCurrentMode', { height: 70, width: 421, top: 3, left: 1045 }, {
                        parent: 'coordScreen',
                        renderMode: 'string'
                    }),
                    currentDisplay: new BasicDisplayEVO('coordCurrentDisplay', { height: 24, width: 200, top: 25, left: 1994 }, {
                        parent: 'coordScreen',
                        renderMode: 'string'
                    })
                },
                topMode: {
                    patients: []
                },
                patientMode: {
                    devices: []
                },
                deviceMode: {
                    currentDevice: new BasicDisplayEVO('coordCurrentDevice', { height: 42, width: 822, top: 257, left: 532 }, {
                        parent: 'coordDeviceMode',
                        renderMode: 'string'
                    }),
                    deviceDisplay: null as unknown as ContainerEVO
                },
                sharedDevicePatientModes: {
                    currentPatient: new BasicDisplayEVO('coordCurrentPatient', { height: 68, width: 1886, top: 0, left: 0 }, {
                        parent: 'coordSharedBetweenPatDevModes',
                        renderMode: 'string'
                    }),
                    selectDevice: new MenuEVO('coordSelectDevice', { height: 48, width: 1863, top: 28, left: 0 }, {
                        parent: 'coordSelDeviceBox',
                        buttonSize: Props.selectDeviceButtonSize,
                        css: {
                            background: 'transparent',
                            'overflow': 'hidden'
                        },
                        spacing: 34,
                        mode: 'horizontal',
                        center: true,
                        globalButtonCSS: Props.selectDeviceButtonCSS,
                        callback: this.callback,
                        //@ts-ignore
                        connection: this.connection
                    }),
                    executeButton: new MenuEVO('coordExecuteButton', { width: 133, height: 47, top: 974, left: 1727 }, {
                        parent: 'coordSharedBetweenPatDevModes',
                        buttons: [],
                        buttonSize: Props.buttonSize,
                        globalButtonCSS: Props.buttonCSS,
                        //@ts-ignore
                        connection: this.connection,
                        callback: this.callback
                    }),
                    actionInfo: new MultiDisplayEVO('coordActionInfo', { top: 973, left: 1500, width: 174, height: 48 }, {
                        parent: 'coordSharedBetweenPatDevModes',
                        globalDisplaySize: {
                            width: 174,
                            height: 24
                        },
                        mode: 'vertical',
                        spacing: 0,
                        css: {
                            background: 'transparent'
                        },
                        globalDisplayCss: Props.smallDisplayCSS
                    }),
                }
            },
            patientLayer: {
                error: new AlertEVO('plErrorMode', { height: 1161, width: 827, top: 0, left: 0 }, {
                    parent: 'plBlackBox',
                    alertElement: plErrorHTML,
                    css: {
                        "z-index": 99998,
                        'border-radius': '10px',
                        'border': '3px solid var(--Dark, #E74F48)',
                        'background': 'var(--Red-Default, #FF6760)',
                    }
                }),
                topbar: new MenuEVO('plSelectDevice', { height: 49, width: 840, top: 80, left: 0 }, {
                    parent: 'plTopbar',
                    center: true,
                    buttonSize: Props.buttonSidebarPLSize,
                    css: {
                        background: 'transparent',
                        'overflow': 'hidden'
                    },
                    mode: 'horizontal',
                    spacing: 19,
                    globalButtonCSS: Props.buttonSidebarCSS,
                    callback: this.callback,
                    //@ts-ignore
                    connection: this.connection
                }),
                mainMenu: new MenuEVO('plMainMenu', { height: 47, width: 840, top: 1407, left: 0 }, {
                    parent: 'plScreen',
                    center: true,
                    buttonSize: Props.buttonSizeMainMenuPL,
                    mode: 'horizontal',
                    spacing: 2,
                    globalButtonCSS: Props.buttonCSS,
                    callback: this.callback,
                    //@ts-ignore
                    connection: this.connection
                }),
                topInfo: {
                    selectedDevice: new BasicDisplayEVO('plSelectedDevice', { height: 24, width: 300, top: 195, left: 6 }, {
                        parent: 'plScreen',
                        renderMode: 'string'
                    }),
                    currentPatient: new BasicDisplayEVO('plCurrentPatient', { height: 70, width: 840, top: 172, left: 0 }, {
                        parent: 'plScreen',
                        renderMode: 'string'
                    }),
                    currentDisplay: new BasicDisplayEVO('plCurrentDisplay', { height: 24, width: 200, top: 195, left: 621 }, {
                        parent: 'plScreen',
                        renderMode: 'string'
                    })
                },
                topMode: {
                    devicesTopDisplay: [],
                    devicesMainDisplay: [],
                    rules: [],
                    deviceName: new FormEVO('plDeviceName', { width: 497, height: 47, top: 1106, left: 318 }, {
                        parent: 'plTopMode',
                        orientation: 'horizontal',
                        spacing: 53,
                        globalInputSize: {
                            height: 43,
                            width: 344
                        },
                        globalLabelCss: {
                            ...Props.formHeaderCSS,
                            'width': '123px',
                        },
                        globalInputCss: {
                            ...Props.formInputCSS,
                            'height': '43px',
                        },
                        inputLabelDivCss: {
                            'display': 'flex',
                            'gap': '3px',
                            'flex-direction': 'row'
                        },
                        css: {
                            background: 'transparent'
                        },
                        inputs: [],
                        //@ts-ignore
                        //@ts-ignore
                        connection: this.connection,
                        callback: this.callback
                    }),
                },
                deviceMode: {
                    deviceName: new BasicDisplayEVO('plDeviceModeDeviceName', { height: 68, width: 827, top: 58, left: 0 }, {
                        parent: 'plDeviceMode',
                        renderMode: 'string'
                    }),
                    device: null as unknown as ContainerEVO,
                    rules: []
                },
                edit: {
                    title: new BasicDisplayEVO('plEditTitle', { height: 48, width: 827, top: 0, left: 0 }, {
                        parent: 'plEdit',
                        renderMode: 'string'
                    }),
                    ok: new MenuEVO('plEditOk', { width: 133, height: 47, top: 1091, left: 661 }, {
                        parent: 'plEdit',
                        buttonSize: Props.buttonSize,
                        globalButtonCSS: Props.buttonCSS,
                        //@ts-ignore
                        connection: this.connection,
                        callback: this.callback
                    }),
                    editDisplays: {
                        paramEntry: new BasicDisplayEVO('plEditDisplaysParamEntry', { height: 23, width: 300, top: 106, left: 515 }, {
                            parent: 'plEditDisplays',
                            renderMode: 'string'
                        }),
                        filterParams: new FilterEVO('plEditDisplaysParamsFilter', { width: 827, height: 202, top: 174, left: 0 }, {
                            parent: 'plEditDisplays',
                            positiveColor: Colors.dark_green,
                            negativeColor: Colors.red,
                            ledSize: 16,
                            mode: 'grid',
                            center: true,
                            numberOfColumns: 2,
                            numberOfRows: 3,
                            spacingHorizontal: 82,
                            spacingVertical: 29,
                            gridPriority: 'fillRowFirst',
                            buttonSize: Props.filterButtonSize,
                            globalButtonCSS: Props.filterButtonCSS,
                            //@ts-ignore
                            connection: this.connection,
                            callback: this.callback
                        }),
                        actionEntry: new BasicDisplayEVO('plEditDisplaysActionEntry', { height: 23, width: 300, top: 429, left: 515 }, {
                            parent: 'plEditDisplays',
                            renderMode: 'string'
                        }),
                        filterActions: new FilterEVO('plEditDisplaysActionsFilter', { width: 827, height: 279, top: 524, left: 0 }, {
                            parent: 'plEditDisplays',
                            positiveColor: Colors.dark_green,
                            negativeColor: Colors.red,
                            ledSize: 16,
                            center: true,
                            mode: 'grid',
                            numberOfColumns: 3,
                            numberOfRows: 4,
                            spacingHorizontal: 82,
                            spacingVertical: 29,
                            gridPriority: 'fillRowFirst',
                            buttonSize: Props.filterButtonSize,
                            globalButtonCSS: Props.filterButtonCSS,
                            //@ts-ignore
                            connection: this.connection,
                            callback: this.callback
                        })
                    },
                    editConstraint: {
                        prevConstraints: new RuleDisplayEVO('plEditConstraintPrevConstraint', { top: 685, left: 74, width: 680, height: 68 }, {
                            parent: 'plEditConstraint',
                            css: Props.greenBorder,
                            constraints: [],
                            textCss: Props.constraintTextCSS as CSS,
                            constraintCss: {
                                color: Colors.yellow
                            },
                            constraintSeparator: 'AND'

                        }),
                        editInfo: new MultiDisplayEVO('plEditConstraintEditInfo', { top: 1030, left: 15, width: 251, height: 120 }, {
                            parent: 'plEditConstraint',
                            globalDisplaySize: {
                                width: 251,
                                height: 24
                            },
                            mode: 'vertical',
                            spacing: 0,
                            css: {
                                background: 'transparent'
                            },
                            displays: [
                                {
                                    label: 'Selected parameter:',
                                    displayName: 'select_par',
                                    mapName: Enum.ParamNameEnum
                                },
                                {
                                    label: 'Selected relation:',
                                    displayName: 'select_rel',
                                    mapName: Enum.RelationNameEnum
                                },
                                {
                                    label: 'Selected numeric value:',
                                    displayName: 'select_num'
                                },
                                {
                                    label: 'Selected enumeration:',
                                    displayName: 'select_enum',
                                    mapName: Enum.EnumParamEnum
                                },
                                {
                                    label: 'Current Production Index:',
                                    displayName: 'current_production_index'
                                }
                            ],
                            globalDisplayCss: Props.editInfoDisplayCSS
                        }),
                        numForm: new FormEVO('plEditConstraintNumForm', { width: 769, height: 86, top: 157, left: 30 }, {
                            parent: 'plEditConstraint',
                            orientation: 'horizontal',
                            spacing: 53,
                            globalInputSize: Props.formInputSize,
                            globalLabelCss: Props.formHeaderCSS,
                            globalInputCss: Props.formInputCSS,
                            inputLabelDivCss: Props.formHeaderInputPairCSS,
                            css: {
                                background: 'transparent'
                            },
                            inputs: [],
                            //@ts-ignore
                            connection: this.connection,
                            callback: this.callback
                        }),
                        enumForm: new FormEVO('plEditConstraintEnumForm', { width: 769, height: 86, top: 395, left: 30 }, {
                            parent: 'plEditConstraint',
                            orientation: 'horizontal',
                            spacing: 53,
                            globalInputSize: Props.formInputSize,
                            globalLabelCss: Props.formHeaderCSS,
                            globalInputCss: Props.formInputCSS,
                            inputLabelDivCss: Props.formHeaderInputPairCSS,
                            css: {
                                background: 'transparent'
                            },
                            inputs: [],
                            //@ts-ignore
                            connection: this.connection,
                            callback: this.callback
                        }),
                        numValidation: new BasicDisplayEVO('plEditConstraintNumFormValidation', { height: 24, width: 203, top: 249, left: 596 }, {
                            parent: 'plEditConstraint',
                            renderMode: 'string'
                        }),
                    },
                    editRules: {
                        currentConstraints: new RuleDisplayEVO('plEditRulesConstraints', { top: 400, left: 73, width: 680, height: 68 }, {
                            parent: 'plEditRules',
                            css: Props.greenBorder,
                            constraints: [],
                            textCss: Props.constraintTextCSS as CSS,
                            constraintCss: {
                                color: Colors.yellow
                            },
                            constraintSeparator: 'AND'

                        }),
                        rules: [],
                        editInfo: new MultiDisplayEVO('plEditRulesEditInfo', { top: 1076, left: 15, width: 251, height: 72 }, {
                            parent: 'plEditRules',
                            globalDisplaySize: {
                                width: 251,
                                height: 24
                            },
                            mode: 'vertical',
                            spacing: 0,
                            css: {
                                background: 'transparent'
                            },
                            globalDisplayCss: Props.editInfoDisplayCSS,
                            displays: [
                                {
                                    label: 'Selected action:',
                                    displayName: 'select_act',
                                    mapName: Enum.ActionEnum
                                },
                                {
                                    label: 'Current Production Index:',
                                    displayName: 'current_production_index'
                                },
                                {
                                    label: 'Current Rule Index:',
                                    displayName: 'current_rule_index'
                                }
                            ]
                        }),
                        actionForm: new FormEVO('plEditRulesFormActionForm', { width: 350, height: 86, top: 160, left: 38 }, {
                            parent: 'plEditRules',
                            globalInputSize: Props.formActionInputSize,
                            globalLabelCss: Props.formActionHeaderCSS,
                            globalInputCss: Props.formActionInputCSS,
                            inputLabelDivCss: Props.formHeaderInputPairCSS,
                            css: {
                                background: 'transparent'
                            },
                            inputs: [],
                            //@ts-ignore
                            connection: this.connection,
                            callback: this.callback
                        })
                    }
                }
            },
            deviceLayerIP: {
                screen: new MultiDisplayEVO('devLayerIPScreen', { width: 414, height: 121, top: 409, left: 140 }, {
                    parent: 'deviceLayerIP',
                    center: true,
                    spacing: 0,
                    numberOfColumns: 3,
                    gridPriority: 'fillRowFirst',
                    mode: 'grid',
                    globalDisplaySize: {
                        width: 138,
                        height: 55
                    },
                    globalValueCss: {
                        ...Props.ipDisplayCSS, ...{
                            'color': Colors.mountain_meadow
                        }
                    },
                    globalLabelCss: Props.ipDisplayCSS,
                    css: {
                        background: 'black',
                        'border-radius': '10px'
                    }
                }),
                keys: new MenuEVO('devLayerIPKeys', { width: 314, height: 156, top: 428, left: 731 }, {
                    parent: 'deviceLayerIP',
                    buttonSize: Props.deviceLayerButtonSize,
                    css: {
                        background: 'transparent',
                        'overflow': 'hidden'
                    },
                    mode: 'grid',
                    spacingHorizontal: 14,
                    spacingVertical: 20,
                    numberOfColumns: 4,
                    numberOfRows: 2,
                    callback: this.callback,
                    //@ts-ignore
                    connection: this.connection
                }),
                arrowKeys: new MenuEVO('devLayerIPArrowKeys', { width: 68, height: 156, top: 428, left: 632 }, {
                    parent: 'deviceLayerIP',
                    buttonSize: Props.deviceLayerButtonSize,
                    css: {
                        background: 'transparent',
                        'overflow': 'hidden'
                    },
                    mode: 'vertical',
                    spacing: 20,
                    callback: this.callback,
                    //@ts-ignore
                    connection: this.connection
                }),
            },
            deviceLayerVS: {
                screen: null as unknown as ContainerEVO,
                power: new MenuEVO('devLayerVSPower', { width: 68, height: 68, top: 1120, left: 197 }, {
                    parent: 'deviceLayerVS',
                    buttonSize: Props.deviceLayerButtonSize,
                    css: {
                        background: 'transparent',
                        'overflow': 'hidden'
                    },
                    //@ts-ignore
                    connection: this.connection,
                    callback: this.callback
                }),
                led: new LedEVO('devLayerVSLed', { width: 20, height: 20, top: 1089, left: 244 }, {
                    parent: 'deviceLayerVS',
                    renderMode: 'string'
                }),
            },
            console: {
                modeChanger: new MenuEVO('modeChanger', { height: 30, width: 310, top: 110, left: 26 }, {
                    parent: 'console',
                    spacing: 5,
                    mode: 'horizontal',
                    buttonSize: Props.consoleButtonSize,
                    globalButtonCSS: Props.consoleButtonCSS,
                    buttons: [{
                        customLabel: 'Coordinator',
                        buttonID: 'coordinatorMode',
                        callback: () => {
                            this.helperVariables.mode = 'coord'
                            this.render(this.ICEState)
                        }
                    }, {
                        customLabel: 'Patient Layer',
                        buttonID: 'plMode',
                        callback: () => {
                            this.helperVariables.mode = 'pat'
                            this.helperVariables.currPatient = this.ICEState.pdb.length > 0 ? this.ICEState.pdb[this.ICEState.pdb.length - 1].id : this.helperVariables.numPatients
                            this.render(this.ICEState)
                        }
                    }, {
                        customLabel: 'Device Layer',
                        buttonID: 'devMode',
                        callback: () => {
                            const numDev = this.ICEState.pdb.find(p => p.id === this.helperVariables.currPatient)?.p_disp_top.devs.length ?? 0

                            if (numDev > 0) {
                                this.helperVariables.mode = 'dev'
                                this.helperVariables.currDevice = this.ICEState.pdb.find(p => p.id === this.helperVariables.currPatient)!.p_disp_top.devs[numDev - 1].d
                                this.render(this.ICEState)
                            } else {
                                alert('Add Device to patient ' + this.helperVariables.currPatient)
                            }
                        }
                    }],
                    //@ts-ignore
                    connection: this.connection
                }),
                chooseSyncMode: new MenuEVO('chooseSyncMode', { height: 30, width: 415, top: 730, left: 26 }, {
                    parent: 'console',
                    spacing: 5,
                    mode: 'horizontal',
                    buttonSize: Props.consoleButtonSize,
                    globalButtonCSS: Props.consoleButtonCSS,
                    buttons: [{
                        customLabel: 'Manual',
                        buttonID: 'manualSyncMode',
                        callback: () => {
                            this.helperVariables.syncMode = 'manual'
                            this.stopTick()
                            this.render(this.ICEState)
                        }
                    }, {
                        customLabel: 'Automatic',
                        buttonID: 'autoSyncMode',
                        callback: () => {
                            this.helperVariables.syncMode = 'auto'
                            this.render(this.ICEState)
                            this.initTick()
                        }
                    }, {
                        customLabel: 'Stop Timer',
                        buttonID: 'stopTimer',
                        callback: () => {
                            this.stopTick()
                            this.render(this.ICEState)
                        }
                    }, {
                        customLabel: 'Start Timer',
                        buttonID: 'startTimer',
                        callback: () => {
                            this.stopTick()
                            this.render(this.ICEState)
                            this.initTick()
                        }
                    }],
                    //@ts-ignore
                    connection: this.connection
                }),
                connect: new MenuEVO('connect', { height: 30, width: 310, top: 184, left: 26 }, {
                    parent: 'console',
                    spacing: 5,
                    mode: 'horizontal',
                    buttonSize: Props.consoleButtonSize,
                    globalButtonCSS: Props.consoleButtonCSS,
                    buttons: [{
                        customLabel: 'Patient',
                        buttonID: 'patientConnect',
                        callback: () => {
                            const enter_patient: SendCommandToken = {
                                id: uuid(),
                                type: 'sendCommand',
                                command: 'click_connect_patient(' + this.helperVariables.numPatients + ')'
                            }
                            this.connection.sendRequest('sendCommand', enter_patient);
                            this.connection.onRequest('sendCommand', (err, res: SendCommandToken) => {
                                const state: ICEState = this.parseState(res)
                                this.helperVariables.numPatients += 1
                                this.ICEState = state
                                this.render(state)
                            });
                        }
                    }, {
                        customLabel: 'Infusion Pump',
                        buttonID: 'ipConnect',
                        callback: () => {
                            const deviceID = this.ICEState.pdb.find(obj => obj.id === this.helperVariables.currPatient)!.p_disp_top.devs.filter(d => d.val === 'infusion_pump').length + 1
                            const enter_device: SendCommandToken = {
                                id: uuid(),
                                type: 'sendCommand',
                                command: 'click_connect_device_to_patient(' + this.helperVariables.currPatient + ',' + deviceID + ')'
                            }
                            this.connection.sendRequest('sendCommand', enter_device);
                            this.connection.onRequest('sendCommand', (err, res: SendCommandToken) => {
                                const state: ICEState = this.parseState(res)
                                this.ICEState = state
                                this.render(state)
                            });
                        }
                    }, {
                        customLabel: 'Vital Signs',
                        buttonID: 'vsConnect',
                        callback: () => {
                            const enter_device: SendCommandToken = {
                                id: uuid(),
                                type: 'sendCommand',
                                command: 'click_connect_device_to_patient_vs(' + this.helperVariables.currPatient + ',' + 0 + ')'
                            }
                            this.connection.sendRequest('sendCommand', enter_device);
                            this.connection.onRequest('sendCommand', (err, res: SendCommandToken) => {
                                const state: ICEState = this.parseState(res)
                                this.ICEState = state
                                this.render(state)
                            });
                        }
                    }],
                    //@ts-ignore
                    connection: this.connection,
                    callback: () => { }
                }),
                choosePatient: new FormEVO('choosePatient', { width: 246, height: 30, top: 364, left: 26 }, {
                    parent: 'console',
                    orientation: 'horizontal',
                    globalInputSize: Props.consoleFormInputSize,
                    globalInputCss: Props.consoleFormInputCSS,
                    css: {
                        background: 'transparent'
                    },
                    triggerOnChange: false,
                    button: {
                        customLabel: 'Change',
                        size: Props.consoleButtonSize,
                        buttonCSS: Props.consoleButtonCSS
                    },
                    inputs: [
                        {
                            inputID: 'currPatient',
                            placeholder: 'Patient',
                            type: 'number'
                        }
                    ],
                    //@ts-ignore
                    connection: this.connection,
                    callback: () => {
                        const value = this.layout.console.choosePatient.getValueWithValidation()
                        if (Object.keys(value.errors).length === 0 && value.values['currPatient'] != null) {
                            const id: number = +(value.values['currPatient'] as string)
                            if (this.ICEState.pdb.find(obj => obj.id === id)) {
                                this.helperVariables.currPatient = this.ICEState.pdb.find(obj => obj.id === id)!.id
                            } else if (this.ICEState.pdb.length > 0) {
                                this.helperVariables.currPatient = this.ICEState.pdb[this.ICEState.pdb.length - 1].id
                            }
                            this.layout.console.choosePatient.clearInputs()
                            this.render(this.ICEState);
                        }
                    }
                }),
                chooseDevice: new FormEVO('chooseDevice', { width: 246, height: 30, top: 424, left: 26 }, {
                    parent: 'console',
                    orientation: 'horizontal',
                    globalInputSize: Props.consoleFormInputSize,
                    globalInputCss: Props.consoleFormInputCSS,
                    css: {
                        background: 'transparent'
                    },
                    triggerOnChange: false,
                    button: {
                        customLabel: 'Change',
                        size: Props.consoleButtonSize,
                        buttonCSS: Props.consoleButtonCSS
                    },
                    inputs: [
                        {
                            inputID: 'currDevice',
                            placeholder: 'Device',
                            type: 'number'
                        }
                    ],
                    //@ts-ignore
                    connection: this.connection,
                    callback: () => {
                        const value = this.layout.console.chooseDevice.getValueWithValidation()
                        if (Object.keys(value.errors).length === 0 && value.values['currDevice'] != null) {
                            const id: number = +(value.values['currDevice'] as string)
                            const numDev = this.ICEState.pdb.find(p => p.id === this.helperVariables.currPatient)?.p_disp_top.devs.length ?? 0
                            const dev = this.ICEState.pdb.find(p => p.id === this.helperVariables.currPatient)?.p_disp_top.devs.find(obj => obj.d === id) ?? null
                            if (dev) {
                                this.helperVariables.currDevice = dev.d
                                this.layout.console.chooseDevice.clearInputs()
                                this.render(this.ICEState);
                                return
                            }

                            if (numDev > 0) {
                                this.helperVariables.currDevice = this.ICEState.pdb.find(p => p.id === this.helperVariables.currPatient)!.p_disp_top.devs[numDev - 1].d
                                this.layout.console.chooseDevice.clearInputs()
                                this.render(this.ICEState);
                                return
                            }


                            alert('Add Device to patient ' + this.helperVariables.currPatient)
                        }
                    }
                }),
                chooseInterval: new FormEVO('chooseInterval', { width: 246, height: 30, top: 843, left: 26 }, {
                    parent: 'console',
                    orientation: 'horizontal',
                    globalInputSize: Props.consoleFormInputSize,
                    globalInputCss: Props.consoleFormInputCSS,
                    css: {
                        background: 'transparent'
                    },
                    button: {
                        customLabel: 'Change',
                        size: Props.consoleButtonSize,
                        buttonCSS: Props.consoleButtonCSS
                    },
                    inputs: [
                        {
                            inputID: 'currInterval',
                            placeholder: 'Interval',
                            type: 'number'
                        }
                    ],
                    //@ts-ignore
                    connection: this.connection,
                    callback: () => {
                        const value = this.layout.console.chooseInterval.getValueWithValidation()
                        if (Object.keys(value.errors).length === 0 && value.values['currInterval'] != null) {

                            const interval: number = +(value.values['currInterval'] as string)
                            this.helperVariables.currInterval = interval
                            this.layout.console.chooseInterval.clearInputs()
                            this.stopTick()
                            this.render(this.ICEState)
                            this.initTick()
                        }
                    }
                }),
                populate: new MenuEVO('populate', { height: 30, width: 322, top: 258, left: 26 }, {
                    parent: 'console',
                    mode: 'horizontal',
                    spacing: 11,
                    buttonSize: Props.consoleButtonSize,
                    globalButtonCSS: Props.consoleButtonCSS,
                    //@ts-ignore
                    connection: this.connection,
                    callback: this.callback
                }),
                tickFunctions: new MenuEVO('tickFunctions', { height: 65, width: 370, top: 489, left: 26 }, {
                    parent: 'console',
                    spacing: 5,
                    mode: 'grid',
                    center: true,
                    numberOfColumns: 3,
                    gridPriority: 'fillRowFirst',
                    buttonSize: Props.consoleTickButtonSize,
                    globalButtonCSS: Props.consoleButtonCSS,
                    //@ts-ignore
                    connection: this.connection,
                    callback: this.callback
                }),
                currPatient: new BasicDisplayEVO('currPatient', { height: 24, width: 300, top: 336, left: 31 }, {
                    parent: 'console',
                    renderMode: 'string'
                }),
                currDevice: new BasicDisplayEVO('currDevice', { height: 24, width: 300, top: 396, left: 31 }, {
                    parent: 'console',
                    renderMode: 'string'
                }),
                currInterval: new BasicDisplayEVO('currInterval', { height: 24, width: 432, top: 815, left: 31 }, {
                    parent: 'console',
                    renderMode: 'string'
                }),
                currSyncMode: new BasicDisplayEVO('currSyncMode', { height: 24, width: 300, top: 696, left: 236 }, {
                    parent: 'console',
                    renderMode: 'string'
                }),
                stateMode: new MenuEVO('stateModeChanger', { height: 71, width: 322, top: 590, left: 26 }, {
                    parent: 'console',
                    spacing: 11,
                    mode: 'grid',
                    center: true,
                    numberOfColumns: 3,
                    gridPriority: 'fillRowFirst',
                    buttonSize: Props.consoleButtonSize,
                    globalButtonCSS: Props.consoleButtonCSS,
                    buttons: [{
                        customLabel: 'Full',
                        buttonID: 'stateModeFull',
                        callback: () => {
                            this.helperVariables.stateMode = 'full'
                            this.render(this.ICEState)

                        }
                    },
                    {
                        customLabel: 'Curr PL Patient',
                        buttonID: 'stateModePL',
                        callback: () => {
                            this.helperVariables.stateMode = 'pl'
                            this.render(this.ICEState)
                        }
                    },
                    {
                        customLabel: 'Coordinator',
                        buttonID: 'stateModeCoord',
                        callback: () => {
                            this.helperVariables.stateMode = 'coord'
                            this.render(this.ICEState)

                        }
                    },
                    {
                        customLabel: 'Messages',
                        buttonID: 'stateMessages',
                        callback: () => {
                            this.helperVariables.stateMode = 'nde'
                            this.render(this.ICEState)

                        }
                    },
                    {
                        customLabel: 'Coord DB',
                        buttonID: 'stateModeCoordDB',
                        callback: () => {
                            this.helperVariables.stateMode = 'coordDB'
                            this.render(this.ICEState)

                        }
                    }],
                    //@ts-ignore
                    connection: this.connection,
                }),
                stateCurrMode: new BasicDisplayEVO('currStateMode', { height: 24, width: 400, top: 76, left: 549 }, {
                    parent: 'console',
                    renderMode: 'string'
                })
            }
        }
    }

    tickDevice(devices: { p: number, d: number }[]) {

        if (devices.length === 0) {
            this.layout.tickMessage.hide()
            return
        }

        const dev = devices.pop()!

        const tick: SendCommandToken = {
            id: uuid(),
            type: 'sendCommand',
            command: `click_tick_device(${dev.p}, ${dev.d})`
        }
        this.connection.sendRequest('sendCommand', tick);
        this.connection.onRequest('sendCommand', (err, res: SendCommandToken) => {
            const state: ICEState = this.parseState(res)
            this.ICEState = state
            if (devices.length > 0) {
                this.tickDevice(devices)
            } else {
                this.layout.tickMessage.hide()
                this.render(state)
            }
        });
    }

    // Function that sends tick action to the pvs model
    tick() {
        const patDev: { p: number, d: number }[] = []

        this.ICEState.pdb.forEach(p => {
            const pID = p.id

            p.p_disp_top.devs.forEach(d =>
                patDev.push({ p: pID, d: d.d })
            )
        })

        this.tickDevice(patDev)

    }

    // Function to update the timer counter until next tick
    timeUntilNextTick() {
        if (this.timerUntilNextTick !== null && this.timerUntilNextTick !== undefined) {
            clearInterval(this.timerUntilNextTick)
        }
        const $timeUntilNextTick = document.getElementById('timeUntilNextTick')!

        $timeUntilNextTick.innerHTML = 'Time until next tick (in seconds): ' + this.helperVariables.currInterval + ' s'

        this.helperVariables.timerUntilNextTick = this.helperVariables.currInterval
        this.timerUntilNextTick = setInterval(() => {
            const $timeUntilNextTick = document.getElementById('timeUntilNextTick')!
            this.helperVariables.timerUntilNextTick -= 1
            $timeUntilNextTick.innerHTML = 'Time until next tick (in seconds): ' + this.helperVariables.timerUntilNextTick + ' s'

        }, 1000)
    }

    // Renders alert for when the prototype is executing the tick function
    renderTickMessage() {
        const tickMessage = '<div class="waitTickTitle">ICE Model Is Performing Ticking Action</div><div class="waitTickText">Just wait until tick as been completed.</div>'
        this.layout.tickMessage.render('', { alertElement: tickMessage })
    }

    // Initiates tick process
    initTick() {
        // begin timer
        this.timeUntilNextTick()

        if (this.tickInterval !== null && this.tickInterval !== undefined) {
            clearInterval(this.tickInterval)
        }
        this.tickInterval = setInterval(() => {
            // timer reset
            this.timeUntilNextTick()
            // load wait for tick to finish message
            this.renderTickMessage()
            // tick
            this.tick()

        }, this.helperVariables.currInterval * 1000)
    }

    // Stops tick process
    stopTick() {
        if (this.tickInterval !== null && this.tickInterval !== undefined) {
            clearInterval(this.tickInterval)
        }

        if (this.timerUntilNextTick !== null && this.timerUntilNextTick !== undefined) {
            clearInterval(this.timerUntilNextTick)
        }
        const $timeUntilNextTick = document.getElementById('timeUntilNextTick')!

        $timeUntilNextTick.innerHTML = 'Time until next tick (in seconds): ' + this.helperVariables.currInterval + ' s'

        this.helperVariables.timerUntilNextTick = this.helperVariables.currInterval

    }

    // Renders loading succes message with the time took to initialize the model
    renderLoadingSuccessMessage() {
        const minutes = Math.floor(this.helperVariables.timer / 60)
        const minutesText = minutes + ' minute' + (minutes === 1 ? '' : 's')
        const seconds = this.helperVariables.timer % 60
        const secondsText = seconds + ' second' + (seconds === 1 ? '' : 's')
        const loadingSuccessMessage = '<div class="loadSuccessTitle">ICE Model Loaded Successfully</div><div class="loadSuccessText">ICE Model has been loaded with ' + minutesText + ' and ' + secondsText + ' of elapsed time.</div>'
        this.layout.loadingSuccessMessage.render('', { alertElement: loadingSuccessMessage })
    }

    buildRuleDisplay(state: ICEState, mode: string, topOffSet: number): RuleDisplayEVO[] {

        const parent = {
            'top': 'plTopModeRulesDisplay',
            'dev': 'plDeviceModeRulesDisplay',
            'rule': 'plEditRulesModeRulesDisplay'
        }

        const id = {
            'top': 'plTopModeRules',
            'dev': 'plDeviceModeRules',
            'rule': 'plEditRules'
        }

        const parDiv = document.getElementById(parent[mode as keyof typeof parent])!

        parDiv.style.top = topOffSet + 'px'


        const removeFromHeight = {
            'top': 56,
            'dev': 0,
            'rule': 85
        }

        parDiv.style.height = (1161 - topOffSet - removeFromHeight[mode as keyof typeof removeFromHeight]) + 'px'


        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        let rules = patientData.p_rules_display.rule_set

        if (mode === 'dev') {
            rules = rules.filter(r => r.action.dev === patientData.p_disp_top.sel_device.dv || r.rule.find(c => c.vt === 'numeral' ? c.nc.d === patientData.p_disp_top.sel_device.dv : c.ec.d === patientData.p_disp_top.sel_device.dv))
        }

        const rulesArray: RuleDisplayEVO[] = []

        const space = mode === 'top' ? 8 : 15

        rules.forEach((r, i) => {
            const ruleDisplay = new RuleDisplayEVO(id[mode as keyof typeof id] + i, { height: 85, width: 805, top: i * 85 + i * space, left: 11 }, {
                parent: parent[mode as keyof typeof parent],
                title: {
                    text: 'Rule ' + i,
                    size: {
                        width: 805,
                        height: 42
                    },
                    position: {
                        top: 0,
                        left: 0
                    },
                    css: Props.deviceCardTitleCSS
                },
                css: Props.greenBorder,
                constraints: r.rule.map(c => {
                    if (c.vt === 'numeral') {
                        const dt = patientData.p_disp_top.devs.find(d => d.d === c.nc.d)!.val
                        let text: string = Enum.DeviceTypeEnum[dt as keyof typeof Enum.DeviceTypeEnum]
                        text += (dt === 'infusion_pump' ? ' ' + c.nc.d : '') + ' ' + Enum.ParamEnum[c.nc.p as keyof typeof Enum.ParamEnum] + ' ' + Enum.RelationEnum[c.nc.r as keyof typeof Enum.RelationEnum] + ' ' + c.nc.v
                        return text
                    }
                    if (c.vt === 'enumerated') {
                        const dt = patientData.p_disp_top.devs.find(d => d.d === c.ec.d)!.val
                        let text: string = Enum.DeviceTypeEnum[dt as keyof typeof Enum.DeviceTypeEnum]
                        text += (dt === 'infusion_pump' ? ' ' + c.ec.d : '') + ' ' + Enum.ParamEnum[c.ec.p as keyof typeof Enum.ParamEnum] + ' ' + Enum.RelationEnum[c.ec.r as keyof typeof Enum.RelationEnum] + ' ' + Enum.EnumParamEnum[c.ec.v as keyof typeof Enum.EnumParamEnum]
                        return text
                    }
                    return 'error'
                }),
                textCss: Props.ruleTextCSS as CSS,
                constraintCss: {
                    color: Colors.yellow
                },
                action: Enum.ActionEnum[r.action.act as keyof typeof Enum.ActionEnum],
                actionCss: {
                    color: Colors.aquamarine
                },
                predecessorActionText: ': ' + Enum.DeviceTypeEnum[patientData.p_disp_top.devs.find(d => d.d === r.action.dev)!.val as keyof typeof Enum.DeviceTypeEnum] + (patientData.p_disp_top.devs.find(d => d.d === r.action.dev)!.val === 'infusion_pump' ? ' ' + r.action.dev : '') + ' will',
                predecessorConstraintsText: 'If',
                constraintSeparator: 'AND'
            })

            ruleDisplay.render(JSON.stringify(state))

            rulesArray.push(ruleDisplay)
        })


        return rulesArray
    }

    renderCoordSideBar(state: ICEState) {
        // render sidebar buttons
        const buttons = [] as Button[]
        const coordDisplayTop = state.coord_st.disp_top
        const selectedPatient = coordDisplayTop.selected_patient
        const enteredPatient = coordDisplayTop.ent_patient

        for (let i = 0; i < coordDisplayTop.patients.length; i++) {
            const patient = coordDisplayTop.patients[i]
            buttons.push({
                customLabel: 'Patient ' + coordDisplayTop.patients[i],
                buttonCSS: {
                    background: (selectedPatient === patient && selectedPatient != P_NULL_VALUE) ? Colors.dark_green : ((enteredPatient === patient && enteredPatient != P_NULL_VALUE) ? Colors.yellow : Colors.mountain_meadow)
                },
                customFunction: `click_coord_enter_patient(${coordDisplayTop.patients[i]})`
            })
        }


        this.layout.coordinator.sidebar.render(JSON.stringify(state), { buttons: buttons })
    }

    renderCoordMainMenu(state: ICEState) {
        const buttons = [] as Button[]
        const coordMenu = state.coord_st.disp_top.menu_visible

        for (let i = 0; i < coordMenu.length; i++) {
            buttons.push({
                customLabel: Enum.MenuEnum[coordMenu[i] as keyof typeof Enum.MenuEnum],
                customFunction: `click_coord_menu_act(${coordMenu[i]})`
            })
        }


        this.layout.coordinator.mainMenu.render(JSON.stringify(state), { buttons: buttons })
    }

    renderCoordTopInfo(state: ICEState) {
        const coord = state.coord_st

        // Render selected patient
        // 16 is equivalent to null value in this model
        let text = 'Selected Patient: ' + (coord.disp_top.selected_patient != P_NULL_VALUE ? coord.disp_top.selected_patient : 'No patient selected')
        this.layout.coordinator.topInfo.selectedPatient.render(text as string, { css: Props.leftDisplayCSS })

        if (coord.mode !== 'error') {
            this.layout.coordinator.topInfo.currentMode.render(Enum.ModeEnum[coord.mode as keyof typeof Enum.ModeEnum] as string, { css: Props.titleDisplayCSS })
        } else {
            this.layout.coordinator.topInfo.currentMode.hide()
        }
        text = 'Display Focus: ' + Enum.DisplayFocusTypeEnum[coord.disp_focus as keyof typeof Enum.DisplayFocusTypeEnum]
        this.layout.coordinator.topInfo.currentDisplay.render(text as string, { css: Props.rightDisplayCSS })
    }

    buildCoordTopModeDevices(state: ICEState) {

        const topModDiv = document.getElementById('coordTopMode')!

        const noDevices = document.getElementById('coordTopModeNoDevices')!

        const coord = state.coord_st
        const patients = coord.disp_top.patients
        // render patients

        const patientsNumParams = coord.disp_top.patients_num_params
        const patientsEnumParams = coord.disp_top.patients_enum_params

        if (patientsEnumParams.length > 0 || patientsNumParams.length > 0) {
            let offSet = 59

            patients.forEach(p => {
                const patientEnumParams = patientsEnumParams.find(enumPars => enumPars.p === p)
                const patientNumParams = patientsNumParams.find(numPars => numPars.p === p)
                const patientDevices = coord.coord_db.find(cdb => cdb.p === p)?.val.p_devices ?? []
                // create and render display for each device

                if ((patientEnumParams?.val || patientNumParams?.val) && patientDevices.length > 0) {

                    type PatientWidget = {
                        patientName: BasicDisplayEVO,
                        devices: ContainerEVO[]
                    }

                    let patientWidgets: PatientWidget

                    //  render patient name 
                    patientWidgets = {
                        devices: [],
                        patientName: new BasicDisplayEVO('coordTopModePatientTitle' + p, { height: 68, width: 324, top: offSet, left: 781 }, {
                            parent: 'coordTopMode',
                            renderMode: 'string'
                        })
                    }

                    patientWidgets.patientName.render('Patient ' + p as string, { css: Props.coordPatientNameDisplayCSS })


                    offSet += 68

                    let incDev = 0

                    const vitalSignsID = patientDevices.find(d => d.val === 'vital_signs_device')?.d
                    const hasVitalSigns = patientEnumParams?.val.find(enumPars => enumPars.d === vitalSignsID) || patientNumParams?.val.find(numPars => numPars.d === vitalSignsID)

                    patientDevices.forEach(dev => {
                        const enumParams = patientEnumParams?.val.find(enumPars => enumPars.d === dev.d)
                        const numParams = patientNumParams?.val.find(numPars => numPars.d === dev.d)

                        if (enumParams || numParams) {
                            const stateData: Record<string, any> = { ...(numParams ? numParams.val : {}), ...(enumParams ? enumParams.val : {}) }

                            const displays = [] as Display[]

                            const isInfusionPump = dev.val === 'infusion_pump'

                            const vsPowerOff = !isInfusionPump && state.pdb.find(pi => pi.id === p)?.vital_signs.power === 'FALSE'

                            Object.keys(stateData).forEach((key: string) => {
                                displays.push({
                                    displayName: key,
                                    unit: ['rte', 'vtb', 'tme', 'hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                                    label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                                    mapName: ['dpm', 'er', 'mde'].includes(key) ? Enum.EnumParamEnum : undefined,
                                    valueCss: (key === 'dpm' && stateData[key] === 'xdblank') || (key === 'mde' && stateData[key] === 'xoff') ? { 'color': Colors.red } : undefined
                                })

                                if (['hrte', 'blpl', 'blph', 'sp', 'rkrt'].includes(key)) {
                                    stateData[key] = Math.round(stateData[key])
                                }
                                if (key === 'ptmp') {
                                    stateData[key] = Math.round(stateData[key] * 10) / 10
                                }
                                if (vsPowerOff && ['hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key)) {
                                    stateData[key] = '-'
                                }
                            })

                            //  render devices display for a patient

                            let col, row

                            col = incDev % 2
                            row = Math.floor(incDev / 2)
                            const vsOffSet = hasVitalSigns ? (82 + 9) : 0
                            const top = offSet + (isInfusionPump ? vsOffSet + (82 + 9) * row : 0)
                            const left = 386 + (isInfusionPump ? (550 + 14) * col : 0)
                            const width = isInfusionPump ? 550 : 1114

                            const deviceDisplay = new ContainerEVO('coordTopModePatient' + p + 'Device' + dev.d, { width: width, height: 82, top: top, left: left }, {
                                parent: 'coordTopMode',
                                displays: {
                                    center: true,
                                    spacing: isInfusionPump ? 0 : 30,
                                    mode: 'horizontal',
                                    globalDisplaySize: {
                                        width: 110,
                                        height: 30
                                    },
                                    position: {
                                        top: 42,
                                        left: 0
                                    },
                                    size: {
                                        width: width,
                                        height: 30
                                    },
                                    globalValueCss: Props.deviceCardDisplayCSS,
                                    globalLabelCss: Props.deviceCardLabelCSS
                                },
                                css: Props.greenBorder,
                                title: {
                                    text: Enum.DeviceTypeEnum[dev.val as keyof typeof Enum.DeviceTypeEnum] + (isInfusionPump ? ' ' + dev.d : ''),
                                    position: {
                                        top: 0,
                                        left: 0
                                    },
                                    size: {
                                        width: width,
                                        height: 42

                                    },
                                    css: Props.deviceCardTitleCSS
                                }
                            })


                            deviceDisplay.render(JSON.stringify(stateData), { displays: { displays: displays } })

                            patientWidgets.devices.push(deviceDisplay)
                            incDev += isInfusionPump ? 1 : 0
                        }

                    });

                    // Render line

                    const numbOfRows = Math.ceil(incDev / 2)

                    offSet += (82 + 9) * numbOfRows + (hasVitalSigns ? (82 + 9) : 0)

                    const line = document.createElement('div')
                    line.className = 'lineCoord'
                    line.style.top = offSet + 'px'
                    line.style.position = 'absolute'

                    topModDiv.appendChild(line)

                    offSet += 8

                    this.layout.coordinator.topMode.patients.push(patientWidgets)
                }
            })

            noDevices.style.display = 'none'
        } else {
            noDevices.style.display = 'block'
        }
    }

    renderCoordTopMode(state: ICEState) {
        //  remove widgets
        this.layout.coordinator.topMode.patients.forEach(p => {
            p.devices.forEach(d => d.remove())
            p.patientName.remove()
        })

        // clean array
        this.layout.coordinator.topMode.patients = []

        const topModDiv = document.getElementById('coordTopMode')!

        // clean all lines

        const lines = topModDiv.querySelectorAll('.lineCoord')
        lines.forEach((l, i) => {
            if (i > 0) {
                l.remove()
            }
        })

        // Build devices

        this.buildCoordTopModeDevices(state)

    }

    renderCoordPatientMode(state: ICEState) {

        const coord = state.coord_st

        const dispPatient = coord.disp_patient

        const selectedDev = dispPatient.selected_device

        const patientEnumParams = dispPatient.patient_enum_params
        const patientNumParams = dispPatient.patient_num_params
        const actions = dispPatient.av_main_act
        const devices = dispPatient.devices

        const noDevices = document.getElementById('coordPatientModeNoDevices')!
        // render devices display

        this.layout.coordinator.patientMode.devices.forEach(d => d.remove())

        if (patientEnumParams.length > 0 || patientNumParams.length > 0 || actions.length > 0) {

            const selDevBoolean = selectedDev != D_NULL_VALUE && (patientEnumParams.find(ep => ep.d === selectedDev) || patientNumParams.find(np => np.d === selectedDev) || actions.find(a => a.d === selectedDev))
            let inc = selDevBoolean ? 1 : 0
            devices.forEach(d => {
                const enumPars = patientEnumParams.find(enumPars => enumPars.d === d.d)
                const numPars = patientNumParams.find(numPars => numPars.d === d.d)
                const cmds = actions.find(a => a.d === d.d)

                if (numPars || enumPars || cmds) {
                    const stateData: Record<string, any> = { ...(numPars ? numPars.val : {}), ...(enumPars ? enumPars.val : {}) }
                    const displays = [] as Display[]

                    const isInfusionPump = d.val === 'infusion_pump'

                    const vsPowerOff = !isInfusionPump && state.pdb.find(pi => pi.id === dispPatient.current_patient)?.vital_signs.power === 'FALSE'

                    Object.keys(stateData).forEach((key: string) => {
                        displays.push({
                            displayName: key,
                            unit: ['rte', 'vtb', 'tme', 'hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                            label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                            mapName: ['dpm', 'er', 'mde'].includes(key) ? Enum.EnumParamEnum : undefined,
                            valueCss: (key === 'dpm' && stateData[key] === 'xdblank') || (key === 'mde' && stateData[key] === 'xoff') ? { 'color': Colors.red } : undefined
                        })

                        if (['hrte', 'blpl', 'blph', 'sp', 'rkrt'].includes(key)) {
                            stateData[key] = Math.round(stateData[key])
                        }
                        if (key === 'ptmp') {
                            stateData[key] = Math.round(stateData[key] * 10) / 10
                        }
                        if (vsPowerOff && ['hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key)) {
                            stateData[key] = '-'
                        }
                    })

                    const buttons = [] as Button[]

                    if (cmds) {
                        cmds.val.forEach(a => {
                            if (!['tick', 'openclamp', 'closeclamp'].includes(a)) {
                                buttons.push({
                                    customLabel: Enum.ActionEnum[a as keyof typeof Enum.ActionEnum],
                                    buttonCSS: a === 'powr' ? { background: Colors.red, 'border': '2px solid var(--Red-Default, #FF6760)' } : (a === 'start' ? { background: Colors.mountain_meadow, 'border': '2px solid var(--Mountain-Meadow, #22C084)' } : (a === 'hold' ? { background: Colors.yellow, 'border': '2px solid var(--Yellow-Default, #FAC032)' } : undefined)),
                                    customFunction: `click_coord_enter_action(${a})`
                                })
                            }
                        })
                    }

                    const top = selDevBoolean && selectedDev === d.d ? 317 : 317 + inc * 174 + 7 * inc

                    let deviceDisplay = null as unknown as ContainerEVO

                    if (isInfusionPump) {
                        // Infusion Pumps
                        deviceDisplay = new ContainerEVO('coordPatientModeDevice' + (selDevBoolean && selectedDev === d.d ? 0 : inc), { width: 859, height: 174, top: top, left: 513 }, {
                            parent: 'coordPatientMode',
                            displays: {
                                center: true,
                                spacing: 0,
                                numberOfColumns: 3,
                                gridPriority: 'fillRowFirst',
                                mode: 'grid',
                                globalDisplaySize: {
                                    width: 138,
                                    height: 55
                                },
                                globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '14px' } },
                                globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '14px' } },
                                position: {
                                    top: 42,
                                    left: 0
                                },
                                size: {
                                    width: 441,
                                    height: 132
                                },
                            },
                            menu: {
                                numberOfColumns: 4,
                                numberOfRows: 3,
                                mode: 'grid',
                                gridPriority: 'fillColumnsFirst',
                                spacing: 8,
                                center: true,
                                buttonSize: Props.deviceCardSmallButtonSize,
                                globalButtonCSS: Props.deviceSmallButtonCSS,
                                buttons: buttons,
                                position: {
                                    top: 43,
                                    left: 441
                                },
                                size: {
                                    width: 404,
                                    height: 106
                                }
                            },
                            css: {
                                background: Colors.mine_shaft2,
                                'border': '3px solid ' + (selectedDev === d.d ? '#006448' : '#6CFFAF'),
                                'border-radius': '10px'
                            },
                            title: {
                                text: Enum.DeviceTypeEnum[d.val as keyof typeof Enum.DeviceTypeEnum] + ' ' + d.d,
                                position: {
                                    top: 0,
                                    left: 0
                                },
                                size: {
                                    width: 859,
                                    height: 42

                                },
                                css: Props.deviceCardTitleCSS
                            },
                            //@ts-ignore
                            connection: this.connection,
                            callback: this.callback
                        })
                    } else {
                        // Vital Signs Monitor
                        deviceDisplay = new ContainerEVO('coordPatientModeDevice' + (selDevBoolean && selectedDev === d.d ? 0 : inc), { width: 859, height: 174, top: top, left: 513 }, {
                            parent: 'coordPatientMode',
                            displays: {
                                center: true,
                                spacing: 0,
                                spacingHorizontal: 28,
                                numberOfColumns: 3,
                                gridPriority: 'fillRowFirst',
                                mode: 'grid',
                                globalDisplaySize: {
                                    width: 138,
                                    height: 42
                                },
                                globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '14px' } },
                                globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '14px' } },
                                position: {
                                    top: 42,
                                    left: 195
                                },
                                size: {
                                    width: 470,
                                    height: 126
                                },
                            },
                            menu: {
                                mode: 'horizontal',
                                spacing: 0,
                                center: true,
                                buttonSize: Props.deviceCardSmallButtonSize,
                                globalButtonCSS: Props.deviceSmallButtonCSS,
                                buttons: buttons,
                                position: {
                                    top: 134,
                                    left: 756
                                },
                                size: {
                                    width: 95,
                                    height: 30
                                }
                            },
                            css: {
                                background: Colors.mine_shaft2,
                                'border': '3px solid ' + (selectedDev === d.d ? '#006448' : '#6CFFAF'),
                                'border-radius': '10px'
                            },
                            title: {
                                text: Enum.DeviceTypeEnum[d.val as keyof typeof Enum.DeviceTypeEnum],
                                position: {
                                    top: 0,
                                    left: 0
                                },
                                size: {
                                    width: 859,
                                    height: 42

                                },
                                css: Props.deviceCardTitleCSS
                            },
                            //@ts-ignore
                            connection: this.connection,
                            callback: this.callback
                        })
                    }

                    deviceDisplay.render(JSON.stringify(stateData), { displays: { displays: displays } })

                    this.layout.coordinator.patientMode.devices.push(deviceDisplay)
                    inc += selDevBoolean && selectedDev === d.d ? 0 : 1
                }
            })

            noDevices.style.display = 'none'
        } else {
            noDevices.style.display = 'block'
        }

    }

    buildCoordDeviceModeDevice(state: ICEState, isInfusionPump: boolean) {
        const coord = state.coord_st

        const dispDevice = coord.disp_device

        const deviceEnum = dispDevice.e_disp
        const deviceNum = dispDevice.n_disp

        const stateData: Record<string, any> = { ...(deviceNum ? deviceNum : {}), ...(deviceEnum ? deviceEnum : {}) }

        const displays = [] as Display[]
        let displaysVert = [] as Display[]

        const vsTracingProp = {
            'hrte': { 'color': Colors.aquamarine },
            'sp': { 'color': Colors.white },
            'ibp': { 'color': Colors.red },
            'rkrt': { 'color': Colors.lightblue },
        }

        if (!isInfusionPump) {
            if (stateData['hrte'] == null) {
                stateData['hrte'] = '-'
            }

            if (stateData['sp'] == null) {
                stateData['sp'] = '-'
            }

            if (stateData['rkrt'] == null) {
                stateData['rkrt'] = '-'
            }

            if (stateData['blpl'] == null) {
                stateData['blpl'] = '-'
            }

            if (stateData['blph'] == null) {
                stateData['blph'] = '-'
            }
        }

        const vsPowerOff = !isInfusionPump && state.pdb.find(pi => pi.id === coord.disp_patient.current_patient)?.vital_signs.power === 'FALSE'


        Object.keys(stateData).forEach((key: string) => {
            if (['hrte', 'sp', 'rkrt'].includes(key)) {
                displaysVert.push({
                    displayName: key,
                    unit: ['rte', 'vtb', 'tme', 'hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                    label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                    valueCss: vsTracingProp[key as keyof typeof vsTracingProp]
                })
            } else {
                displays.push({
                    displayName: key,
                    unit: ['rte', 'vtb', 'tme', 'hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                    label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                    mapName: ['dpm', 'er', 'mde'].includes(key) ? Enum.EnumParamEnum : undefined,
                    valueCss: ((key === 'dpm' && stateData[key] === 'xdblank') || (key === 'mde' && stateData[key] === 'xoff') ? { 'color': Colors.red } : undefined),
                })
            }

            if (['hrte', 'blpl', 'blph', 'sp', 'rkrt'].includes(key) && stateData[key] != '-') {
                stateData[key] = Math.round(stateData[key])
            }
            if (key === 'ptmp') {
                stateData[key] = Math.round(stateData[key] * 10) / 10
            }
            if (vsPowerOff && ['hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key)) {
                stateData[key] = '-'
            }
        })

        if (!isInfusionPump) {
            stateData['ibp'] = stateData['blph'] + ' / ' + stateData['blpl']

            displaysVert.push({
                displayName: 'ibp',
                unit: Enum.ParamUnitsENum['blpl' as keyof typeof Enum.ParamUnitsENum],
                label: 'IBP:',
                valueCss: vsTracingProp['ibp']
            })
        }

        displaysVert = [displaysVert.filter(d => d.displayName === 'hrte').pop()!, displaysVert.filter(d => d.displayName === 'sp').pop()!, displaysVert.filter(d => d.displayName === 'ibp').pop()!, displaysVert.filter(d => d.displayName === 'rkrt').pop()!]
        const buttons = [] as Button[]

        const actions = dispDevice.av_c_disp

        if (actions) {
            actions.forEach(a => {
                if (!['tick', 'openclamp', 'closeclamp'].includes(a)) {
                    buttons.push({
                        customLabel: Enum.ActionEnum[a as keyof typeof Enum.ActionEnum],
                        buttonCSS: a === 'powr' ? { background: Colors.red, 'border': '2px solid var(--Red-Default, #FF6760)' } : (a === 'start' ? { background: Colors.mountain_meadow, 'border': '2px solid var(--Mountain-Meadow, #22C084)' } : (a === 'hold' ? { background: Colors.yellow, 'border': '2px solid var(--Yellow-Default, #FAC032)' } : undefined)),
                        customFunction: `click_coord_enter_action(${a})`
                    })
                }
            })
        }

        let deviceDisplay = null as unknown as ContainerEVO

        if (isInfusionPump) {
            deviceDisplay = new ContainerEVO('coordDModeDevice', { width: 822, height: 423, top: 324, left: 532 }, {
                parent: 'coordDeviceMode',
                displays: {
                    center: true,
                    spacing: 0,
                    numberOfColumns: 3,
                    gridPriority: 'fillRowFirst',
                    mode: 'grid',
                    globalDisplaySize: {
                        width: 184,
                        height: 55
                    },
                    position: {
                        top: 0,
                        left: 0
                    },
                    size: {
                        width: 822,
                        height: 170
                    },
                    globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '20px' } },
                    globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '20px' } }
                },
                menu: {
                    numberOfColumns: 3,
                    numberOfRows: 4,
                    mode: 'grid',
                    gridPriority: 'fillRowFirst',
                    spacing: 8,
                    center: true,
                    buttonSize: Props.deviceCardButtonSize,
                    globalButtonCSS: Props.deviceButtonCSS,
                    buttons: [],
                    position: {
                        top: 170,
                        left: 244
                    },
                    size: {
                        width: 334,
                        height: 216
                    }
                },
                css: Props.greenBorder,
                //@ts-ignore
                connection: this.connection,
                callback: this.callback
            })
        } else {
            deviceDisplay = new ContainerEVO('coordDModeDevice', { width: 822, height: 522, top: 324, left: 532 }, {
                parent: 'coordDeviceMode',
                displays: {
                    center: true,
                    spacing: 0,
                    mode: 'horizontal',
                    globalDisplaySize: {
                        width: 184,
                        height: 55
                    },
                    position: {
                        top: 455,
                        left: 19
                    },
                    size: {
                        width: 736,
                        height: 55
                    },
                    globalDisplayCss: {
                        'justify-content': 'start'
                    },
                    globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '20px' } },
                    globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '20px' } },
                },
                menu: {
                    mode: 'horizontal',
                    center: true,
                    buttonSize: Props.deviceCardButtonSize,
                    globalButtonCSS: Props.deviceButtonCSS,
                    buttons: [],
                    position: {
                        top: 462,
                        left: 702
                    },
                    size: {
                        height: 48,
                        width: 106
                    }
                },
                css: Props.greenBorder,
                simpleTraceDisplays: {
                    traceSize: {
                        height: 99,
                        width: 553
                    },
                    traceCss: {
                        'z-index': 4,
                        background: Colors.mine_shaft
                    },
                    tracePosition: {
                        top: 35,
                        left: 31
                    },
                    tracedisplays: [
                        {
                            label: false,
                            mode: 'ecg',
                            tracingDisplayName: 'hrte',
                            traceCss: {
                                color: Colors.aquamarine
                            },
                            range: {
                                max: 200,
                                min: 0
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'hrte',
                            mode: 'pleth',
                            traceCss: {
                                color: Colors.white
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'hrte',
                            sibp: 'blph',
                            dibp: 'blpl',
                            mode: 'ibp',
                            traceCss: {
                                color: Colors.red
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'rkrt',
                            mode: 'resp',
                            traceCss: {
                                color: Colors.lightblue
                            }
                        }
                    ]
                },
                widgets: [
                    () => {
                        return new MultiDisplayEVO('coordDModeDeviceTracingsDisplay', { width: 197, height: 396, top: 38, left: 591 }, {
                            parent: 'coordDModeDevice',
                            center: true,
                            spacing: 0,
                            mode: 'vertical',
                            displays: displaysVert,
                            globalDisplaySize: {
                                width: 197,
                                height: 99
                            },
                            css: Props.greenBorder,
                            globalDisplayCss: {
                                'justify-content': 'start',
                                'flex-direction': 'column',
                                'gap': '0px',
                            },
                            globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '25px', 'justify-content': 'center', 'height': '48px', 'width': '197px' } },
                            globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '30px', 'padding-left': '15px', 'height': '48px', 'width': '197px' } },
                        })
                    }
                ],
                //@ts-ignore
                connection: this.connection,
                callback: this.callback
            })
        }

        this.layout.coordinator.deviceMode.deviceDisplay = deviceDisplay

        this.layout.coordinator.deviceMode.deviceDisplay.render(JSON.stringify(stateData), { displays: { displays: displays }, menu: { buttons: buttons } })

    }

    renderCoordDeviceMode(state: ICEState) {
        const coord = state.coord_st

        const dispDevice = coord.disp_device

        // render current device name

        const deviceType = coord.disp_patient.devices.find(d => d.d === dispDevice.current_device)!.val

        const isInfusionPump = deviceType === 'infusion_pump'
        const text = Enum.DeviceTypeEnum[deviceType as keyof typeof Enum.DeviceTypeEnum] + (isInfusionPump ? ' ' + dispDevice.current_device : '')

        this.layout.coordinator.deviceMode.currentDevice.render(text as string, { css: Props.greenTitleDisplayCSS })

        // render device display

        if (this.layout.coordinator.deviceMode.deviceDisplay) {
            this.layout.coordinator.deviceMode.deviceDisplay.remove()
        }

        this.buildCoordDeviceModeDevice(state, isInfusionPump)
    }

    renderCoordPatientAndDeviceMode(state: ICEState) {

        const coord = state.coord_st
        const dispPatient = coord.disp_patient

        //render curr patient

        const text = 'Patient ' + dispPatient.current_patient
        this.layout.coordinator.sharedDevicePatientModes.currentPatient.render(text as string, { css: Props.titleDisplayCSS })

        // render select device menu

        const buttons = [] as Button[]
        const selectedDevice = dispPatient.selected_device
        const enteredDevice = coord.disp_top.ent_device

        for (let i = 0; i < dispPatient.devices.length; i++) {
            const dev = dispPatient.devices[i]
            const isInfusionPump = dev.val === 'infusion_pump'
            buttons.push({
                customLabel: Enum.DeviceTypeEnum[dev.val as keyof typeof Enum.DeviceTypeEnum] + (isInfusionPump ? ' ' + dev.d : ''),
                buttonCSS: {
                    background: (selectedDevice === dev.d && selectedDevice != D_NULL_VALUE) ? Colors.dark_green : ((enteredDevice === dev.d && enteredDevice != D_NULL_VALUE) ? Colors.yellow : Colors.mine_shaft2)
                },
                customFunction: `click_coord_enter_device(${dev.d})`
            })
        }


        this.layout.coordinator.sharedDevicePatientModes.selectDevice.render(JSON.stringify(state), { buttons: buttons })

        //  render executeButton button


        const dev = state.coord_st.disp_focus === 'patient_focus' ? coord.disp_patient.selected_device : coord.disp_device.current_device
        const pvsFunction = {
            'auto': 'click_coord_act_mono_sync(' + coord.disp_patient.current_patient + ',' + dev + ')',
            'manual': 'click_coord_act_mono'
        }

        this.layout.coordinator.sharedDevicePatientModes.executeButton.render(JSON.stringify(state), {
            buttons: [{
                customLabel: 'Execute',
                customFunction: pvsFunction[this.helperVariables.syncMode as keyof typeof pvsFunction]
            }]
        })

        //  render action info

        const displays = [
            {
                label: 'Entered action:',
                displayName: 'ent_action',
                mapName: Enum.ActionEnum
            },
            {
                label: 'Selected action:',
                displayName: 'selected_action',
                mapName: Enum.ActionEnum
            }
        ] as Display[]

        const selectedAct = {
            'p_mode': dispPatient.selected_device != D_NULL_VALUE ? dispPatient.selected_action : 'sel_dev',
            'd_mode': coord.disp_device.selected_action
        }

        this.layout.coordinator.sharedDevicePatientModes.actionInfo.render(JSON.stringify({
            ent_action: coord.disp_top.ent_action,
            selected_action: selectedAct[coord.mode as keyof typeof selectedAct]
        }), { displays: displays })
    }

    renderCoordDispAlarm(state: ICEState) {

        const alarms = state.coord_st.disp_alarm.constraint_alarms
        const coordDB = state.coord_st.coord_db

        alarms.forEach((a, i) => {

            const deviceType = coordDB.find(db => db.p === a.p)?.val.p_devices.find(d => d.d === a.val.dev)?.val ?? null
            const device = deviceType ? Enum.DeviceTypeEnum[deviceType as keyof typeof Enum.DeviceTypeEnum] + (deviceType === 'infusion_pump' ? ' ' + a.val.dev : '') : 'Device Error'
            const element = '<div class="alarmTitle">Alarm</div><div class="alarmText">Rule has been triggered for patient ' + a.p + '. ' + device + ' executed: ' + Enum.ActionEnum[a.val.act as keyof typeof Enum.ActionEnum] + '.</div>'

            const alarmWidget = new AlertEVO('alert_' + i, { width: 550, height: 82, top: 1091 - (82 + 8) * i, left: 1666 }, {
                parent: 'coordScreen',
                closeButton: true,
                alertElement: element,
                audioSrc: 'sounds/alert_simple.wav',
                audioTime: 10000,
                blink: 1000,
                css: {
                    "z-index": 99999,
                    'border-radius': '10px',
                    'border': '3px solid var(--Dark, #E74F48)',
                    'background': 'var(--Red-Default, #FF6760)',
                },
                customFunction: `click_alarm_clean(${a.p})`,
                //@ts-ignore
                connection: this.connection,
                callback: this.callback
            })

            alarmWidget.render(JSON.stringify(state))
            this.layout.coordinator.constraintAlarm.push(alarmWidget)
        })
    }

    renderCoordinator(state: ICEState) {
        // render sidebar buttons
        this.renderCoordSideBar(state)
        // render main menu
        this.renderCoordMainMenu(state)
        // render top info
        this.renderCoordTopInfo(state)

        // render constraint alarms
        this.renderCoordDispAlarm(state)

        const mode = state.coord_st.mode
        //render current mode

        // Render error mode
        if (mode === 'error') {
            this.layout.coordinator.error.render()
        } else {
            this.layout.coordinator.error.hide()
        }


        const topMode = document.getElementById('coordTopMode')!

        // render top mode
        if (mode === 'top') {
            topMode.style.display = 'block'
            this.renderCoordTopMode(state)
        } else {
            topMode.style.display = 'none'
        }

        const shared = document.getElementById('coordSharedBetweenPatDevModes')!

        //  render widgets shared between device and patient mode
        if (mode === 'p_mode' || mode === 'd_mode') {
            shared.style.display = 'block'
            this.renderCoordPatientAndDeviceMode(state)
        } else {
            shared.style.display = 'none'
        }

        const patientMode = document.getElementById('coordPatientMode')!

        // render patient mode
        if (mode === 'p_mode') {
            patientMode.style.display = 'block'
            this.renderCoordPatientMode(state)
        } else {
            patientMode.style.display = 'none'
        }

        const deviceMode = document.getElementById('coordDeviceMode')!

        // render device mode
        if (mode === 'd_mode') {
            deviceMode.style.display = 'block'
            this.renderCoordDeviceMode(state)
        } else {
            deviceMode.style.display = 'none'
        }
    }

    renderPatientLayerTopBar(state: ICEState) {
        const patient = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        const notVisible = ['edit_top', 'edit_patient', 'edit_device', 'edit_constraint'].includes(patient.emode) || patient.pmode === 'error'

        // Render topbar helper if you can select a device
        const topbarChooseDeviceDiv = document.getElementById('plTopbarChooseDevice')!

        topbarChooseDeviceDiv.style.display = notVisible ? 'none' : 'block'

        // RENDER MENU ENTER DEVICE
        if (!notVisible) {

            const buttons = [] as Button[]
            const patientDevice = patient.p_disp_top.devs
            const selectedDevice = patient.p_disp_top.sel_device
            const enteredDevice = patient.p_disp_top.ent_device

            for (let i = 0; i < patientDevice.length; i++) {
                const isInfusionPump = patientDevice[i].val === 'infusion_pump'
                buttons.push({
                    customLabel: Enum.DeviceTypeEnum[patientDevice[i].val as keyof typeof Enum.DeviceTypeEnum] + (isInfusionPump ? ' ' + patientDevice[i].d : ''),
                    buttonCSS: {
                        background: selectedDevice.dv === patientDevice[i].d && selectedDevice.dt != 'no_device' ? Colors.dark_green : (enteredDevice.dv === patientDevice[i].d && enteredDevice.dt ? Colors.yellow : Colors.mountain_meadow)
                    },
                    customFunction: 'click_patient_enter_device(' + this.helperVariables.currPatient + ',' + patientDevice[i].d + ')',
                })
            }


            this.layout.patientLayer.topbar.render(JSON.stringify(state), { buttons: buttons })
        } else {
            this.layout.patientLayer.topbar.hide()
        }
    }

    renderPatientLayerMainMenu(state: ICEState) {
        const buttons = [] as Button[]
        const patientMenu = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!.p_disp_top.menu_visible
        for (let i = 0; i < patientMenu.length; i++) {
            buttons.push({
                customLabel: Enum.MenuEnum[patientMenu[i] as keyof typeof Enum.MenuEnum],
                customFunction: 'click_patient_menu_act(' + patientMenu[i] + ',' + this.helperVariables.currPatient + ')',
            })
        }


        this.layout.patientLayer.mainMenu.render(JSON.stringify(state), { buttons: buttons })
    }

    renderPatientLayerTopInfo(state: ICEState) {
        const patient = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        const mode = patient.pmode

        if (mode !== 'error') {
            // Render selected device
            const typeName = {
                'no_device': 'No device selected',
                'infusion_pump': Enum.DeviceTypeEnum[patient.p_disp_top.sel_device.dt as keyof typeof Enum.DeviceTypeEnum] + ' ' + patient.p_disp_top.sel_device.dv,
                'vital_signs_device': Enum.DeviceTypeEnum[patient.p_disp_top.sel_device.dt as keyof typeof Enum.DeviceTypeEnum]
            }

            let text = 'Selected Device: ' + typeName[patient.p_disp_top.sel_device.dt as keyof typeof typeName]
            this.layout.patientLayer.topInfo.selectedDevice.render(text as string, { css: Props.leftDisplayCSS })

            text = 'Patient Number ' + this.helperVariables.currPatient
            this.layout.patientLayer.topInfo.currentPatient.render(text as string, { css: Props.titleDisplayCSS })

            text = 'Display Focus: ' + Enum.DisplayFocusTypeEnum[patient.disp_focus as keyof typeof Enum.DisplayFocusTypeEnum]
            this.layout.patientLayer.topInfo.currentDisplay.render(text as string, { css: Props.rightDisplayCSS })
        } else {
            this.layout.patientLayer.topInfo.selectedDevice.hide()
            this.layout.patientLayer.topInfo.currentPatient.hide()
            this.layout.patientLayer.topInfo.currentDisplay.hide()
        }

    }

    buildPLTopModeTopDevices(state: ICEState) {
        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        const noDeviceTop = document.getElementById('plTopModeNoTopDisplay')!

        const devicesEnum = patientData.p_disp_top.disp_enum_params
        const devicesNum = patientData.p_disp_top.disp_num_params

        if (devicesEnum.length > 0 || devicesNum.length > 0) {
            let inc = 0

            const vitalSignsID = patientData.p_disp_top.devs.find(d => d.val === 'vital_signs_device')?.d
            const hasVitalSigns = devicesEnum?.find(enumPars => enumPars.d === vitalSignsID) || devicesNum?.find(numPars => numPars.d === vitalSignsID)


            patientData.p_disp_top.devs.forEach(dev => {
                const devNum = devicesNum.find(n => n.d === dev.d)
                const devEnum = devicesEnum.find(e => e.d === dev.d)
                const isInfusionPump = dev.val === 'infusion_pump'

                if (!isInfusionPump && dev.d !== vitalSignsID) return

                if (devNum || devEnum) {
                    const stateData: Record<string, any> = { ...(devNum ? devNum.val : {}), ...(devEnum ? devEnum.val : {}) }
                    const vsPowerOff = !isInfusionPump && patientData.vital_signs.power === 'FALSE'

                    let params = ''

                    Object.keys(stateData).forEach((key: string, i) => {
                        const isEnumParam = ['dpm', 'er', 'mde'].includes(key)
                        const unit = ['rte', 'vtb', 'tme', 'hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key)
                            ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum]
                            : undefined
                        const rawValue = vsPowerOff && ['hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? '-' : stateData[key] ?? '-'

                        const truncatedValue = typeof rawValue !== 'number' ? rawValue
                            : ['hrte', 'blpl', 'blph', 'sp', 'rkrt'].includes(key) ? Math.round(rawValue)
                                : key === 'ptmp' ? Math.round(rawValue * 10) / 10
                                    : rawValue
                        const value = isEnumParam
                            ? Enum.EnumParamEnum[rawValue as keyof typeof Enum.EnumParamEnum] ?? rawValue
                            : truncatedValue
                        const entry = Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ` (${value}${unit ? ' ' + unit : ''})`
                        params += i === 0 ? entry : ', ' + entry
                    })

                    const vsOffSet = hasVitalSigns ? 39 + 8 : 0

                    let row

                    row = inc

                    const top = (39 + 8) * row + vsOffSet
                    const left = 38
                    let deviceDisplay = null as unknown as ContainerEVO

                    if (isInfusionPump) {
                        deviceDisplay = new ContainerEVO('plTopModeDeviceTopDisplay' + inc, { width: 751, height: 39, top: top, left: left }, {
                            parent: 'plTopModeTopDisplay',
                            displays: {
                                spacing: 0,
                                mode: 'horizontal',
                                globalDisplaySize: {
                                    width: 588,
                                    height: 39
                                },
                                position: {
                                    top: 0,
                                    left: 163
                                },
                                globalDisplayCss: {
                                    'display': 'flex',
                                    'align-items': 'center',
                                    'justify-content': 'start',
                                },
                                globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '12px' } },
                                globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '12px' } },
                            },
                            css: Props.greenBorder,
                            title: {
                                text: Enum.DeviceTypeEnum[dev.val as keyof typeof Enum.DeviceTypeEnum] + ' ' + dev.d,
                                position: {
                                    top: 0,
                                    left: 0
                                },
                                size: {
                                    width: 163,
                                    height: 39

                                },
                                css: {
                                    ...Props.deviceCardTitleCSS, ...{
                                        'font-size': '12px',
                                        'line-height': '18px',
                                        'letter-spacing': '0.2px',
                                    }
                                }
                            }
                        })
                    } else {
                        deviceDisplay = new ContainerEVO('plTopModeDeviceTopDisplayVS', { width: 751, height: 39, top: 0, left: 38 }, {
                            parent: 'plTopModeTopDisplay',
                            displays: {
                                spacing: 0,
                                mode: 'horizontal',
                                globalDisplaySize: {
                                    width: 588,
                                    height: 39
                                },
                                position: {
                                    top: 0,
                                    left: 163
                                },
                                globalDisplayCss: {
                                    'display': 'flex',
                                    'align-items': 'center',
                                    'justify-content': 'start',
                                },
                                globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '12px' } },
                                globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '12px' } },
                            },
                            css: Props.greenBorder,
                            title: {
                                text: Enum.DeviceTypeEnum[dev.val as keyof typeof Enum.DeviceTypeEnum],
                                position: {
                                    top: 0,
                                    left: 0
                                },
                                size: {
                                    width: 163,
                                    height: 39
                                },
                                css: {
                                    ...Props.deviceCardTitleCSS, ...{
                                        'font-size': '12px',
                                        'line-height': '18px',
                                        'letter-spacing': '0.2px',
                                    }
                                }
                            },
                        })
                    }

                    deviceDisplay.render(JSON.stringify({
                        params: params
                    }), {
                        displays: {
                            displays: [{
                                displayName: 'params',
                                label: 'Parameters:'
                            }]
                        }
                    })

                    this.layout.patientLayer.topMode.devicesTopDisplay.push(deviceDisplay)
                    inc += isInfusionPump ? 1 : 0
                }
            })
            noDeviceTop.style.display = 'none'
        } else {
            noDeviceTop.style.display = 'block'
        }

    }

    buildPLTopModePatientDevices(state: ICEState) {
        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        const noDeviceMain = document.getElementById('plTopModeNoMainDisplay')!

        const devicesEnum = patientData.p_disp_main.disp_enum_params
        const devicesNum = patientData.p_disp_main.disp_num_params
        const pActions = patientData.p_disp_main.p_actions


        if (devicesEnum.length > 0 || devicesNum.length > 0 || pActions.length > 0) {
            let inc = 0
            const vitalSignsID = patientData.p_disp_top.devs.find(d => d.val === 'vital_signs_device')?.d
            const hasVitalSigns = devicesEnum?.find(e_p => e_p.d === vitalSignsID) || devicesNum?.find(n_p => n_p.d === vitalSignsID) || pActions?.find(p => p.d === vitalSignsID)

            patientData.p_disp_top.devs.forEach(dev => {
                const devNum = devicesNum.find(n => n.d === dev.d)
                const devEnum = devicesEnum.find(e => e.d === dev.d)
                const actions = patientData.p_disp_main.p_actions.find(a => a.d === dev.d)
                const isInfusionPump = dev.val === 'infusion_pump'

                if (!isInfusionPump && dev.d !== vitalSignsID) return

                if (devNum || devEnum || actions) {
                    const stateData: Record<string, any> = { ...(devNum ? devNum.val : {}), ...(devEnum ? devEnum.val : {}) }
                    const vsPowerOff = !isInfusionPump && patientData.vital_signs.power === 'FALSE'

                    let params = ''
                    Object.keys(stateData).forEach((key: string, i) => {
                        const isEnumParam = ['dpm', 'er', 'mde'].includes(key)
                        const unit = ['rte', 'vtb', 'tme', 'hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key)
                            ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum]
                            : undefined
                        const rawValue = vsPowerOff && ['hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? '-' : stateData[key] ?? '-'

                        const truncatedValue = typeof rawValue !== 'number' ? rawValue
                            : ['hrte', 'blpl', 'blph', 'sp', 'rkrt'].includes(key) ? Math.round(rawValue)
                                : key === 'ptmp' ? Math.round(rawValue * 10) / 10
                                    : rawValue
                        const value = isEnumParam
                            ? Enum.EnumParamEnum[rawValue as keyof typeof Enum.EnumParamEnum] ?? rawValue
                            : truncatedValue
                        const entry = Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ` (${value}${unit ? ' ' + unit : ''})`
                        params += i === 0 ? entry : ', ' + entry
                    })

                    let actionsString = ''
                    if (actions) {
                        let i = 0
                        actions.val.forEach(a => {
                            if (!['tick', 'openclamp', 'closeclamp'].includes(a)) {
                                actionsString += i === 0 ? Enum.ActionEnum[a as keyof typeof Enum.ActionEnum] : ', ' + Enum.ActionEnum[a as keyof typeof Enum.ActionEnum]
                                i++
                            }
                        })
                    }

                    let col, row

                    col = inc % 2
                    row = Math.floor(inc / 2)

                    const vsOffSet = hasVitalSigns ? 107 + 8 : 0
                    const top = (115 + 8) * row + vsOffSet
                    const left = 38 + (366 + 33) * col
                    let deviceDisplay = null as unknown as ContainerEVO

                    if (isInfusionPump) {
                        deviceDisplay = new ContainerEVO('plTopModeDeviceMainDisplay' + inc, { width: 366, height: 115, top: top, left: left }, {
                            parent: 'plTopModeMainDisplay',
                            displays: {
                                spacing: 0,
                                mode: 'vertical',
                                globalDisplaySize: {
                                    width: 352,
                                    height: 48
                                },
                                position: {
                                    top: 34,
                                    left: 14
                                },
                                size: {
                                    width: 352,
                                    height: 80
                                },
                                globalDisplayCss: {
                                    'display': 'flex',
                                    'align-items': 'start',
                                    'justify-content': 'start',
                                },
                                globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '10px' } },
                                globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '10px' } },
                            },
                            css: Props.greenBorder,
                            title: {
                                text: Enum.DeviceTypeEnum[dev.val as keyof typeof Enum.DeviceTypeEnum] + ' ' + dev.d,
                                position: {
                                    top: 0,
                                    left: 0
                                },
                                size: {
                                    width: 366,
                                    height: 34

                                },
                                css: {
                                    ...Props.deviceCardTitleCSS, ...{
                                        'font-size': '12px',
                                        'line-height': '18px',
                                        'letter-spacing': '0.2px',
                                    }
                                }
                            }
                        })
                    } else {
                        deviceDisplay = new ContainerEVO('plTopModeDeviceMainDisplayVS', { width: 751, height: 107, top: 0, left: 38 }, {
                            parent: 'plTopModeMainDisplay',
                            displays: {
                                spacing: 0,
                                mode: 'vertical',
                                globalDisplaySize: {
                                    width: 721,
                                    height: 30
                                },
                                position: {
                                    top: 27,
                                    left: 14
                                },
                                size: {
                                    width: 721,
                                    height: 80
                                },
                                globalDisplayCss: {
                                    'display': 'flex',
                                    'align-items': 'center',
                                    'justify-content': 'start',
                                },
                                globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '11px' } },
                                globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '11px' } }
                            },
                            css: Props.greenBorder,
                            title: {
                                text: Enum.DeviceTypeEnum[dev.val as keyof typeof Enum.DeviceTypeEnum],
                                position: {
                                    top: 0,
                                    left: 0
                                },
                                size: {
                                    width: 751,
                                    height: 34
                                },
                                css: {
                                    ...Props.deviceCardTitleCSS, ...{
                                        'font-size': '12px',
                                        'line-height': '18px',
                                        'letter-spacing': '0.2px',
                                    }
                                }
                            }
                        })
                    }

                    deviceDisplay.render(JSON.stringify({
                        params: params ? params : 'No Parameters',
                        acts: actionsString ? actionsString : 'No Actions'
                    }), {
                        displays: {
                            displays: [{
                                displayName: 'params',
                                label: 'Parameters:'
                            }, {
                                displayName: 'acts',
                                label: 'Actions:',
                                valueCss: isInfusionPump ? {
                                    color: Colors.aquamarine,
                                    'height': '40px',
                                    'align-items': 'start'
                                } : { color: Colors.aquamarine },
                                position: isInfusionPump ? {
                                    top: 28,
                                    left: 0
                                } : undefined,
                                labelCss: isInfusionPump ? {
                                    'height': '40px',
                                    'align-items': 'start'
                                } : undefined
                            }]
                        }
                    })

                    this.layout.patientLayer.topMode.devicesMainDisplay.push(deviceDisplay)
                    inc += isInfusionPump ? 1 : 0
                }
            })
            noDeviceMain.style.display = 'none'
        } else {
            noDeviceMain.style.display = 'block'
        }
    }

    renderPatientLayerTopMode(state: ICEState) {
        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        // Render devices
        this.layout.patientLayer.topMode.devicesTopDisplay.forEach(r => r.remove())

        this.buildPLTopModeTopDevices(state)

        // Render Patients Display
        this.layout.patientLayer.topMode.devicesMainDisplay.forEach(r => r.remove())

        this.buildPLTopModePatientDevices(state)


        // Render Rules
        const rules = patientData.p_rules_display.rule_set

        this.layout.patientLayer.topMode.rules.forEach(r => r.remove())

        const noRule = document.getElementById('plTopModeNoRules')!

        if (rules.length > 0) {

            this.layout.patientLayer.topMode.rules = this.buildRuleDisplay(state, 'top', 793)

            noRule.style.display = 'none'
        } else {
            noRule.style.display = 'block'
        }


        let inputsNum = [
            {
                label: 'Enter Device:',
                inputID: 'name_buffer',
                placeholder: 'Enter numeric value',
                type: 'number',
                customFunction: {
                    functionName: 'click_patient_enter_name',
                    args: [this.helperVariables.currPatient.toString()]
                }
            }
        ] as Input[]

        this.layout.patientLayer.topMode.deviceName.render(JSON.stringify({
            name_buffer: patientData.name_buffer != 16 ? patientData.name_buffer : undefined
        }), {
            inputs: inputsNum,
            button: {
                position: { top: 0, left: 364 },
                size: Props.buttonSize,
                customLabel: 'Connect',
                buttonCSS: Props.buttonCSS,
                customFunction: 'click_patient_connect_device(' + this.helperVariables.currPatient + ')'
            }
        })
    }

    buildPLDeviceModeDevice(state: ICEState, isInfusionPump: boolean) {
        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        const deviceEnum = patientData.p_disp_device.enum_disp
        const deviceNum = patientData.p_disp_device.num_disp

        const stateData: Record<string, any> = { ...(deviceNum ? deviceNum : {}), ...(deviceEnum ? deviceEnum : {}) }

        const displays = [] as Display[]
        let displaysVert = [] as Display[]


        const vsTracingProp = {
            'hrte': { 'color': Colors.aquamarine },
            'sp': { 'color': Colors.white },
            'ibp': { 'color': Colors.red },
            'rkrt': { 'color': Colors.lightblue },
        }

        if (!isInfusionPump) {
            if (stateData['hrte'] == null) {
                stateData['hrte'] = '-'
            }

            if (stateData['sp'] == null) {
                stateData['sp'] = '-'
            }

            if (stateData['rkrt'] == null) {
                stateData['rkrt'] = '-'
            }

            if (stateData['blpl'] == null) {
                stateData['blpl'] = '-'
            }

            if (stateData['blph'] == null) {
                stateData['blph'] = '-'
            }
        }

        const vsPowerOff = !isInfusionPump && patientData.vital_signs.power === 'FALSE'

        Object.keys(stateData).forEach((key: string) => {
            if (['hrte', 'sp', 'rkrt'].includes(key)) {
                displaysVert.push({
                    displayName: key,
                    unit: ['rte', 'vtb', 'tme', 'hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                    label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                    valueCss: vsTracingProp[key as keyof typeof vsTracingProp]
                })
            } else {
                displays.push({
                    displayName: key,
                    unit: ['rte', 'vtb', 'tme', 'hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                    label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                    mapName: ['dpm', 'er', 'mde'].includes(key) ? Enum.EnumParamEnum : undefined,
                    valueCss: ((key === 'dpm' && stateData[key] === 'xdblank') || (key === 'mde' && stateData[key] === 'xoff') ? { 'color': Colors.red } : undefined),
                })
            }

            if (['hrte', 'blpl', 'blph', 'sp', 'rkrt'].includes(key) && stateData[key] != '-') {
                stateData[key] = Math.round(stateData[key])
            }
            if (key === 'ptmp') {
                stateData[key] = Math.round(stateData[key] * 10) / 10
            }
            if (vsPowerOff && ['hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key)) {
                stateData[key] = '-'
            }
        })

        if (!isInfusionPump) {
            stateData['ibp'] = stateData['blph'] + ' / ' + stateData['blpl']

            displaysVert.push({
                displayName: 'ibp',
                unit: Enum.ParamUnitsENum['blpl' as keyof typeof Enum.ParamUnitsENum],
                label: 'IBP:',
                valueCss: vsTracingProp['ibp']
            })
        }

        displaysVert = [displaysVert.filter(d => d.displayName === 'hrte').pop()!, displaysVert.filter(d => d.displayName === 'sp').pop()!, displaysVert.filter(d => d.displayName === 'ibp').pop()!, displaysVert.filter(d => d.displayName === 'rkrt').pop()!]
        const buttons = [] as Button[]

        const actions = patientData.p_disp_device.cmds

        const pvsFunction = {
            'auto': 'click_patient_device_exec_sync',
            'manual': 'click_patient_device_exec'
        }

        if (actions) {
            actions.forEach(a => {
                if (!['tick', 'openclamp', 'closeclamp'].includes(a)) {
                    buttons.push({
                        customLabel: Enum.ActionEnum[a as keyof typeof Enum.ActionEnum],
                        buttonCSS: a === 'powr' ? { background: Colors.red, 'border': '2px solid var(--Red-Default, #FF6760)' } : (a === 'start' ? { background: Colors.mountain_meadow, 'border': '2px solid var(--Mountain-Meadow, #22C084)' } : (a === 'hold' ? { background: Colors.yellow, 'border': '2px solid var(--Yellow-Default, #FAC032)' } : undefined)),
                        customFunction: `${pvsFunction[this.helperVariables.syncMode as keyof typeof pvsFunction]}(${a}, ${this.helperVariables.currPatient}, ${patientData.p_disp_top.sel_device.dv})`
                    })
                }
            })
        }

        let deviceDisplay = null as unknown as ContainerEVO

        if (isInfusionPump) {
            deviceDisplay = new ContainerEVO('plDeviceModeDevice', { width: 800, height: 423, top: 126, left: 14 }, {
                parent: 'plDeviceMode',
                displays: {
                    center: true,
                    spacing: 0,
                    numberOfColumns: 3,
                    gridPriority: 'fillRowFirst',
                    mode: 'grid',
                    globalDisplaySize: {
                        width: 184,
                        height: 55
                    },
                    position: {
                        top: 0,
                        left: 0
                    },
                    size: {
                        width: 800,
                        height: 174
                    },
                    globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '20px' } },
                    globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '20px' } },
                },
                menu: {
                    numberOfColumns: 3,
                    numberOfRows: 4,
                    mode: 'grid',
                    gridPriority: 'fillRowFirst',
                    spacing: 8,
                    center: true,
                    buttonSize: Props.deviceCardButtonSize,
                    globalButtonCSS: Props.deviceButtonCSS,
                    buttons: [],
                    position: {
                        top: 174,
                        left: 233
                    },
                    size: {
                        width: 334,
                        height: 216
                    }
                },
                css: Props.greenBorder,
                //@ts-ignore
                connection: this.connection,
                callback: this.callback
            })
        } else {
            deviceDisplay = new ContainerEVO('plDeviceModeDevice', { width: 800, height: 522, top: 126, left: 14 }, {
                parent: 'plDeviceMode',
                displays: {
                    center: true,
                    spacing: 0,
                    mode: 'horizontal',
                    globalDisplaySize: {
                        width: 184,
                        height: 55
                    },
                    position: {
                        top: 455,
                        left: 19
                    },
                    size: {
                        width: 736,
                        height: 55
                    },
                    globalDisplayCss: {
                        'justify-content': 'start'
                    },
                    globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '20px' } },
                    globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '20px' } },
                },
                menu: {
                    mode: 'horizontal',
                    center: true,
                    buttonSize: Props.deviceCardButtonSize,
                    globalButtonCSS: Props.deviceButtonCSS,
                    buttons: [],
                    position: {
                        top: 462,
                        left: 680
                    },
                    size: {
                        height: 48,
                        width: 106
                    }
                },
                css: Props.greenBorder,
                simpleTraceDisplays: {
                    traceSize: {
                        height: 99,
                        width: 553
                    },
                    traceCss: {
                        'z-index': 4,
                        background: Colors.mine_shaft
                    },
                    tracePosition: {
                        top: 35,
                        left: 20
                    },
                    tracedisplays: [
                        {
                            label: false,
                            mode: 'ecg',
                            tracingDisplayName: 'hrte',
                            traceCss: {
                                color: Colors.aquamarine
                            },
                            range: {
                                max: 200,
                                min: 0
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'hrte',
                            mode: 'pleth',
                            traceCss: {
                                color: Colors.white
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'hrte',
                            sibp: 'blph',
                            dibp: 'blpl',
                            mode: 'ibp',
                            traceCss: {
                                color: Colors.red
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'rkrt',
                            mode: 'resp',
                            traceCss: {
                                color: Colors.lightblue
                            }
                        }
                    ]
                },
                widgets: [
                    () => {
                        return new MultiDisplayEVO('plDeviceModeDeviceTracingsDisplay', { width: 197, height: 396, top: 38, left: 580 }, {
                            parent: 'plDeviceModeDevice',
                            center: true,
                            spacing: 0,
                            mode: 'vertical',
                            displays: displaysVert,
                            globalDisplaySize: {
                                width: 197,
                                height: 99
                            },
                            css: Props.greenBorder,
                            globalDisplayCss: {
                                'justify-content': 'start',
                                'flex-direction': 'column',
                                'gap': '0px',
                            },
                            globalValueCss: { ...Props.deviceCardDisplayCSS, ...{ 'font-size': '25px', 'justify-content': 'center', 'height': '48px', 'width': '197px' } },
                            globalLabelCss: { ...Props.deviceCardLabelCSS, ...{ 'font-size': '30px', 'padding-left': '15px', 'height': '48px', 'width': '197px' } },
                        })
                    }
                ],
                //@ts-ignore
                connection: this.connection,
                callback: this.callback
            })
        }

        this.layout.patientLayer.deviceMode.device = deviceDisplay
        this.layout.patientLayer.deviceMode.device.render(JSON.stringify(stateData), { displays: { displays: displays }, menu: { buttons: buttons } })


    }

    renderPatientLayerDeviceMode(state: ICEState) {
        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        // Render Title
        const selectedDevice = patientData.p_disp_top.sel_device
        const isInfusionPump = selectedDevice.dt === 'infusion_pump'
        const text = patientData.p_disp_top.sel_device.dt != 'no_device' ? Enum.DeviceTypeEnum[selectedDevice.dt as keyof typeof Enum.DeviceTypeEnum] + (isInfusionPump ? ' ' + selectedDevice.dv : '') : 'Error: Invalid Device'
        this.layout.patientLayer.deviceMode.deviceName.render(text as string, { css: { ...Props.titleDisplayCSS, ...{ 'color': Colors.mountain_meadow } } })

        // Render device
        if (this.layout.patientLayer.deviceMode.device) {
            this.layout.patientLayer.deviceMode.device.remove()
        }

        this.buildPLDeviceModeDevice(state, isInfusionPump)

        // Render Rules
        let rules = patientData.p_rules_display.rule_set

        this.layout.patientLayer.deviceMode.rules.forEach(r => r.remove())

        const noRule = document.getElementById('plDeviceModeNoRules')!

        rules = rules.filter(r => r.action.dev === patientData.p_disp_top.sel_device.dv || r.rule.find(c => c.vt === 'numeral' ? c.nc.d === patientData.p_disp_top.sel_device.dv : c.ec.d === patientData.p_disp_top.sel_device.dv))

        const rulesAssociatedTitle = document.getElementById('plDeviceModeRulesAssociated')!

        rulesAssociatedTitle.style.top = isInfusionPump ? '581px' : '680px'

        if (rules.length > 0) {

            this.layout.patientLayer.deviceMode.rules = this.buildRuleDisplay(state, 'dev', isInfusionPump ? 658 : 757)

            noRule.style.display = 'none'
        } else {
            noRule.style.top = isInfusionPump ? '713px' : '812px'
            noRule.style.display = 'block'
        }
    }

    renderPatientLayerEditDisplays(state: ICEState) {
        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        // Render Param entry

        let text = 'Parameter Entry: ' + Enum.ParamNameEnum[patientData.p_disp_top.ent_par as keyof typeof Enum.ParamNameEnum]
        this.layout.patientLayer.edit.editDisplays.paramEntry.render(text as string, { css: { ...Props.rightDisplayCSS, ...Props.entryCSS, ...{ 'align-items': 'end' } } })

        let filters = [] as Filter[]

        const isInfusionPump = patientData.p_disp_top.sel_device.dt === 'infusion_pump'

        if (isInfusionPump) {
            filters = [
                {
                    customLabel: 'Rate',
                    filterVar: 'rte',
                    customFunction: 'click_patient_enter_params(rte,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'Display Mode',
                    filterVar: 'dpm',
                    customFunction: 'click_patient_enter_params(dpm,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'VTBI',
                    filterVar: 'vtb',
                    customFunction: 'click_patient_enter_params(vtb,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'Error',
                    filterVar: 'er',
                    customFunction: 'click_patient_enter_params(er,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'Time',
                    filterVar: 'tme',
                    customFunction: 'click_patient_enter_params(tme,' + this.helperVariables.currPatient + ')'
                }
            ]
        } else {
            filters = [
                {
                    customLabel: 'Heart Rate',
                    filterVar: 'hrte',
                    customFunction: 'click_patient_enter_params(hrte,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'BP Dia',
                    filterVar: 'blpl',
                    customFunction: 'click_patient_enter_params(blpl,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'BP Sys',
                    filterVar: 'blph',
                    customFunction: 'click_patient_enter_params(blph,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'SpO2',
                    filterVar: 'sp',
                    customFunction: 'click_patient_enter_params(sp,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'Respiratory Rate',
                    filterVar: 'rkrt',
                    customFunction: 'click_patient_enter_params(rkrt,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'Temperature',
                    filterVar: 'ptmp',
                    customFunction: 'click_patient_enter_params(ptmp,' + this.helperVariables.currPatient + ')'
                },
                {
                    customLabel: 'Mode',
                    filterVar: 'mde',
                    customFunction: 'click_patient_enter_params(mde,' + this.helperVariables.currPatient + ')'

                }
            ]
        }

        this.layout.patientLayer.edit.editDisplays.filterParams.render(JSON.stringify(state), {
            filteredVariables: patientData.p_rules_display.select_pars, filters: filters,
            numberOfColumns: !isInfusionPump ? 3 : 2,
            spacingHorizontal: !isInfusionPump ? 82 : 196
        })

        // Actions title and actions entry display and actions filter only avaiable if patientData.emode === 'edit_patient' || patientData.emode === 'edit_device'

        const actionsTitle = document.getElementById('plEditDisplaysActionsTitle')!

        if (patientData.emode === 'edit_patient' || patientData.emode === 'edit_device') {
            actionsTitle.style.display = 'block'

            // Action entry display
            text = 'Action Entry: ' + Enum.ActionEnum[patientData.p_disp_top.ent_act as keyof typeof Enum.ActionEnum]
            this.layout.patientLayer.edit.editDisplays.actionEntry.render(text as string, { css: { ...Props.rightDisplayCSS, ...Props.entryCSS, ...{ 'align-items': 'end' } } })

            let filters = [] as Filter[]
            if (isInfusionPump) {
                filters = [
                    {
                        customLabel: 'Power',
                        filterVar: 'powr',
                        customFunction: 'click_patient_enter_action(powr,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Choose Rate',
                        filterVar: 'chooserate',
                        customFunction: 'click_patient_enter_action(chooserate,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Increment',
                        filterVar: 'incr',
                        customFunction: 'click_patient_enter_action(incr,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Start',
                        filterVar: 'start',
                        customFunction: 'click_patient_enter_action(start,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Choose VTBI',
                        filterVar: 'choosevtbi',
                        customFunction: 'click_patient_enter_action(choosevtbi,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Decrement',
                        filterVar: 'decr',
                        customFunction: 'click_patient_enter_action(decr,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Hold',
                        filterVar: 'hold',
                        customFunction: 'click_patient_enter_action(hold,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Choose Time',
                        filterVar: 'choosetime',
                        customFunction: 'click_patient_enter_action(choosetime,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Confirm',
                        filterVar: 'confirm',
                        customFunction: 'click_patient_enter_action(confirm,' + this.helperVariables.currPatient + ')'
                    },
                    {
                        customLabel: 'Bolus',
                        filterVar: 'bolus',
                        customFunction: 'click_patient_enter_action(bolus,' + this.helperVariables.currPatient + ')'
                    }
                ]
            } else {
                filters = [
                    {
                        customLabel: 'Power',
                        filterVar: 'powr',
                        customFunction: 'click_patient_enter_action(powr,' + this.helperVariables.currPatient + ')'
                    }
                ]
            }

            // Action filter
            this.layout.patientLayer.edit.editDisplays.filterActions.render(JSON.stringify(state), {
                filteredVariables: patientData.p_rules_display.select_acts, filters: filters
            })

        } else {
            actionsTitle.style.display = 'none'
            this.layout.patientLayer.edit.editDisplays.actionEntry.hide()
            this.layout.patientLayer.edit.editDisplays.filterActions.hide()
        }

    }

    renderPatientLayerEditConstraint(state: ICEState) {
        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        const constraints = patientData.p_rules_display.rule_setup

        this.layout.patientLayer.edit.editConstraint.editInfo.render(JSON.stringify(constraints))

        // IF any previous constraints exist
        const editConstraintTulesTitle = document.getElementById('plEditConstraintRules')!


        if (constraints.current_production.length > 0 && constraints.current_production_index > 0) {
            editConstraintTulesTitle.style.display = 'block'

            const constraints_group = constraints.current_production.map(c => {
                if (c.vt === 'numeral') {
                    const dt = patientData.p_disp_top.devs.find(d => d.d === c.nc.d)!.val
                    let text: string = Enum.DeviceTypeEnum[dt as keyof typeof Enum.DeviceTypeEnum]
                    text += (dt === 'infusion_pump' ? ' ' + c.nc.d : '') + ' ' + Enum.ParamEnum[c.nc.p as keyof typeof Enum.ParamEnum] + ' ' + Enum.RelationEnum[c.nc.r as keyof typeof Enum.RelationEnum] + ' ' + c.nc.v
                    return text
                }
                if (c.vt === 'enumerated') {
                    const dt = patientData.p_disp_top.devs.find(d => d.d === c.ec.d)!.val
                    let text: string = Enum.DeviceTypeEnum[dt as keyof typeof Enum.DeviceTypeEnum]
                    text += (dt === 'infusion_pump' ? ' ' + c.ec.d : '') + ' ' + Enum.ParamEnum[c.ec.p as keyof typeof Enum.ParamEnum] + ' ' + Enum.RelationEnum[c.ec.r as keyof typeof Enum.RelationEnum] + ' ' + Enum.EnumParamEnum[c.ec.v as keyof typeof Enum.EnumParamEnum]
                    return text
                }
                return 'error'
            })
            this.layout.patientLayer.edit.editConstraint.prevConstraints.render(JSON.stringify(state), { constraints: constraints_group })

        } else {
            editConstraintTulesTitle.style.display = 'none'
            this.layout.patientLayer.edit.editConstraint.prevConstraints.hide()

        }

        const isInfusionPump = patientData.p_disp_top.sel_device.dt === 'infusion_pump'

        const inputsNum: Input[] = [
            {
                label: 'Parameter:',
                inputID: 'ent_par',
                placeholder: 'Choose Parameter',
                type: 'select',
                options: isInfusionPump ? Enum.ParamNumIPForm : Enum.ParamNumVSForm,
                customFunction: {
                    functionName: 'click_patient_enter_params',
                    args: [this.helperVariables.currPatient.toString()]
                }
            },
            {
                label: 'Relation:',
                inputID: 'ent_rel',
                placeholder: 'Enter Relation',
                type: 'select',
                options: Enum.RelationNumFilter,
                customFunction: {
                    functionName: 'click_patient_enter_relation',
                    args: [this.helperVariables.currPatient.toString()]
                }
            },
            {
                label: 'Numeric Value:',
                inputID: 'num_buffer',
                placeholder: 'Enter numeric value',
                type: 'number',
                customFunction: {
                    functionName: 'click_patient_enter_num_value',
                    args: [this.helperVariables.currPatient.toString()]
                }
            }
        ]

        this.layout.patientLayer.edit.editConstraint.numForm.render(JSON.stringify({
            ent_par: patientData.p_disp_top.ent_par,
            ent_rel: patientData.p_disp_top.ent_rel,
            num_buffer: patientData.num_buffer
        }), {
            inputs: inputsNum
        })

        if (patientData.num_buffer === 16) {
            this.layout.patientLayer.edit.editConstraint.numValidation.render('Numeric value 16 is not valid!', { css: Props.numFormValidatorCSS })
        } else {
            this.layout.patientLayer.edit.editConstraint.numValidation.hide()
        }

        const inputsEnum: Input[] = [
            {
                label: 'Parameter:',
                inputID: 'ent_par',
                placeholder: 'Choose Parameter',
                type: 'select',
                options: isInfusionPump ? Enum.ParamEnumIPForm : Enum.ParamEnumVSForm,
                customFunction: {
                    functionName: 'click_patient_enter_params',
                    args: [this.helperVariables.currPatient.toString()]
                }
            },
            {
                label: 'Relation:',
                inputID: 'ent_rel',
                placeholder: 'Enter Relation',
                type: 'select',
                options: Enum.RelationEnumFilter,
                customFunction: {
                    functionName: 'click_patient_enter_relation',
                    args: [this.helperVariables.currPatient.toString()]
                }
            },
            {
                label: 'Enumeration Value:',
                inputID: 'ent_enum',
                placeholder: 'Enter enumeration value',
                type: 'select',
                options: isInfusionPump ? Enum.EnumFormIP : Enum.EnumFormVS,
                customFunction: {
                    functionName: 'click_patient_enter_enum_value',
                    args: [this.helperVariables.currPatient.toString()]
                }
            }
        ]

        this.layout.patientLayer.edit.editConstraint.enumForm.render(JSON.stringify(patientData.p_disp_top), {
            inputs: inputsEnum
        })
    }

    renderPatientLayerEditRules(state: ICEState) {

        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        const isInfusionPump = patientData.p_disp_top.sel_device.dt === 'infusion_pump'

        const inputs: Input[] = [
            {
                label: 'Action:',
                inputID: 'ent_act',
                placeholder: 'Choose Action',
                type: 'select',
                options: isInfusionPump ? Enum.ActionFormIP : Enum.ActionFormVS,
                customFunction: {
                    functionName: 'click_patient_enter_action',
                    args: [this.helperVariables.currPatient.toString()]
                }
            }
        ]

        this.layout.patientLayer.edit.editRules.actionForm.render(JSON.stringify(patientData.p_disp_top), {
            inputs: inputs
        })

        const constraints = patientData.p_rules_display.rule_setup

        // Current constraints
        this.layout.patientLayer.edit.editRules.editInfo.render(JSON.stringify({
            'current_production_index': constraints.current_production_index,
            'current_rule_index': patientData.p_rules_display.current_rule_index,
            'select_act': constraints.select_act
        }))

        const constraints_group = constraints.current_production.map(c => {
            if (c.vt === 'numeral') {
                const dt = patientData.p_disp_top.devs.find(d => d.d === c.nc.d)!.val
                let text: string = Enum.DeviceTypeEnum[dt as keyof typeof Enum.DeviceTypeEnum]
                text += (dt === 'infusion_pump' ? ' ' + c.nc.d : '') + ' ' + Enum.ParamEnum[c.nc.p as keyof typeof Enum.ParamEnum] + ' ' + Enum.RelationEnum[c.nc.r as keyof typeof Enum.RelationEnum] + ' ' + c.nc.v
                return text
            }
            if (c.vt === 'enumerated') {
                const dt = patientData.p_disp_top.devs.find(d => d.d === c.ec.d)!.val
                let text: string = Enum.DeviceTypeEnum[dt as keyof typeof Enum.DeviceTypeEnum]
                text += (dt === 'infusion_pump' ? ' ' + c.ec.d : '') + ' ' + Enum.ParamEnum[c.ec.p as keyof typeof Enum.ParamEnum] + ' ' + Enum.RelationEnum[c.ec.r as keyof typeof Enum.RelationEnum] + ' ' + Enum.EnumParamEnum[c.ec.v as keyof typeof Enum.EnumParamEnum]
                return text
            }
            return 'error'
        })
        this.layout.patientLayer.edit.editRules.currentConstraints.render(JSON.stringify(state), { constraints: constraints_group })


        // Render Rules
        const rules = patientData.p_rules_display.rule_set

        this.layout.patientLayer.edit.editRules.rules.forEach(r => r.remove())

        const noRule = document.getElementById('plEditRulesNoRules')!

        if (rules.length > 0) {

            this.layout.patientLayer.edit.editRules.rules = this.buildRuleDisplay(state, 'rule', 600)

            noRule.style.display = 'none'
        } else {
            noRule.style.display = 'block'
        }
    }

    renderPatientLayerEdit(state: ICEState) {
        const patientData = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!

        const emode = patientData.emode

        // Render Title and ok button
        const typeDisplay = {
            'edit_top': 'top display',
            'edit_patient': 'main display',
            'edit_device': 'device display',
            'edit_rule': 'rule mode',
            'edit_constraint': 'constraint mode'
        }

        const isInfusionPump = patientData.p_disp_top.sel_device.dt === 'infusion_pump'

        const display = patientData.emode === 'edit_none' ? patientData.pmode : patientData.emode
        const text = 'Edit ' + typeDisplay[display as keyof typeof typeDisplay] + ' for ' + Enum.DeviceTypeEnum[patientData.p_disp_top.sel_device.dt as keyof typeof Enum.DeviceTypeEnum] + (isInfusionPump ? ' ' + patientData.p_disp_top.sel_device.dv : '')
        this.layout.patientLayer.edit.title.render(text as string, {
            css: {
                ...Props.titleDisplayCSS, ...{
                    'display': 'flex',
                    'justify-content': 'center',
                    'align-items': 'center'
                }
            }
        })

        const pvsFunction = {
            'auto': 'click_patient_ok_sync(',
            'manual': 'click_patient_ok('
        }
        this.layout.patientLayer.edit.ok.render(JSON.stringify(state), {
            buttons: [{
                customLabel: 'Ok',
                customFunction: pvsFunction[this.helperVariables.syncMode as keyof typeof pvsFunction] + this.helperVariables.currPatient + ')'
            }]
        })


        const editDisplays = document.getElementById('plEditDisplays')!

        if (emode === 'edit_top' || emode === 'edit_patient' || emode === 'edit_device') {
            editDisplays.style.display = 'block'
            this.renderPatientLayerEditDisplays(state)
        } else {
            editDisplays.style.display = 'none'
        }

        const editConstraint = document.getElementById('plEditConstraint')!

        if (emode === 'edit_constraint') {
            editConstraint.style.display = 'block'
            this.renderPatientLayerEditConstraint(state)
        } else {
            editConstraint.style.display = 'none'
        }

        const editRules = document.getElementById('plEditRules')!

        if (emode === 'edit_rule') {
            editRules.style.display = 'block'
            this.renderPatientLayerEditRules(state)
        } else {
            editRules.style.display = 'none'
        }
    }

    renderPatientLayer(state: ICEState) {
        this.layout.console.choosePatient.render(JSON.stringify(state))
        const patient = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)

        if (!patient || patient.pmode === 'error') {
            this.layout.patientLayer.error.render('', {
                alertElement: plErrorHTML.replace('Patient not connected', 'Patient ' + this.helperVariables.currPatient + ' not connected')
            })
            return
        }
        this.layout.patientLayer.error.hide()

        // Render patient layer topbar and main menu
        this.renderPatientLayerTopBar(state)
        this.renderPatientLayerMainMenu(state)

        // Render top displays
        this.renderPatientLayerTopInfo(state)

        const mode = patient.pmode

        const emode = patient.emode

        const topMode = document.getElementById('plTopMode')!

        if (emode === 'edit_none' && mode === 'top') {
            topMode.style.display = 'block'
            this.renderPatientLayerTopMode(state)
        } else {
            topMode.style.display = 'none'
        }


        const deviceMode = document.getElementById('plDeviceMode')!

        if (emode === 'edit_none' && mode === 'd_mode') {
            deviceMode.style.display = 'block'
            this.renderPatientLayerDeviceMode(state)
        } else {
            deviceMode.style.display = 'none'
        }

        const edit = document.getElementById('plEdit')!

        if (emode != 'edit_none') {
            edit.style.display = 'block'
            this.renderPatientLayerEdit(state)
        } else {
            edit.style.display = 'none'
        }

    }

    renderConsole(state: ICEState) {

        // Display Console
        const console = document.getElementById('console')!
        console.style.display = 'block'

        this.layout.console.modeChanger.render(JSON.stringify(state))
        this.layout.console.connect.render(JSON.stringify(state))

        // Render populate Menu


        const populateButtons = [
            {
                customLabel: 'Reset State',
                buttonID: 'populateReset',
                customFunction: 'click_reset',
                callback: (err, res: SendCommandToken) => {
                    const state: ICEState = this.parseState(res)
                    this.ICEState = state;
                    this.helperVariables.currPatient = 0
                    this.helperVariables.mode = 'coord'
                    this.helperVariables.numPatients = 0
                    this.helperVariables.stateMode = 'full'
                    this.render(state);
                }
            }, {
                customLabel: 'Populate +1',
                buttonID: 'populatePlus1',
                customFunction: `click_populate_single_patient(${this.helperVariables.numPatients})`,
                callback: (err, res: SendCommandToken) => {
                    const state: ICEState = this.parseState(res)
                    this.ICEState = state;

                    this.helperVariables.numPatients += this.helperVariables.numPatients < 4 ? 1 : 0
                    this.render(state);
                }
            }, {
                customLabel: 'Populate Multi',
                buttonID: 'populateMulti',
                customFunction: 'click_populate_multi',
                callback: (err, res: SendCommandToken) => {
                    const state: ICEState = this.parseState(res)
                    this.ICEState = state;
                    this.helperVariables.numPatients = 5
                    this.render(state);
                }
            }
        ] as Button[]



        this.layout.console.populate.render(JSON.stringify(state), { buttons: populateButtons })

        this.layout.console.tickFunctions.render(JSON.stringify(state), {
            buttons: [{
                customLabel: 'Coordinator',
                buttonID: 'coordinatorModeTF',
                customFunction: 'click_tick_coordinator'
            }, {
                customLabel: 'Curr Pan Patient',
                buttonID: 'plModeTFPan',
                customFunction: 'click_tick_pan_patient(' + this.helperVariables.currPatient + ')'
            }, {
                customLabel: 'Curr Act Patient',
                buttonID: 'plModeTFAct',
                customFunction: 'click_tick_act_patient(' + this.helperVariables.currPatient + ')'
            }, {
                customLabel: 'Curr Pan Device',
                buttonID: 'plModeTFDevPan',
                customFunction: 'click_tick_pan_device(' + this.helperVariables.currPatient + ',' + this.helperVariables.currDevice + ')'
            }, {
                customLabel: 'Curr Act Device',
                buttonID: 'plModeTFDevAct',
                customFunction: 'click_tick_act_device(' + this.helperVariables.currPatient + ',' + this.helperVariables.currDevice + ')'
            }]
        })
        this.layout.console.choosePatient.render(JSON.stringify(state))
        this.layout.console.chooseDevice.render(JSON.stringify(state))
        this.layout.console.chooseSyncMode.render(JSON.stringify(state))
        this.layout.console.chooseInterval.render(JSON.stringify(state))
        //Render Current Sync Mode
        let text = 'Current Sync Mode: ' + (this.helperVariables.syncMode === 'auto' ? 'Automatic' : 'Manual')
        this.layout.console.currSyncMode.render(text as string, { css: Props.leftDisplayCSS })

        // Render selected device
        text = 'Current Patient: ' + this.helperVariables.currPatient
        this.layout.console.currPatient.render(text as string, { css: Props.leftDisplayCSS })

        text = 'Current Device: ' + this.helperVariables.currDevice
        this.layout.console.currDevice.render(text as string, { css: Props.leftDisplayCSS })

        text = 'Current Tick Interval: ' + this.helperVariables.currInterval + ' s. Default is 20 s.'
        this.layout.console.currInterval.render(text as string, { css: Props.leftDisplayCSS })

        // Print State
        const printState = document.getElementById('consoleState')!

        const { coord_db: _unused, ...coordSt } = state.coord_st

        const stateModeObj = {
            'full': state,
            'pl': state.pdb.find(obj => obj.id === this.helperVariables.currPatient),
            'coord': coordSt,
            'nde': {
                'nde_state': state.nde_state,
                'p_nodes': state.p_nodes,
                'd_nodes': state.d_nodes
            },
            'coordDB': state.coord_st.coord_db
        }

        printState.innerHTML = JSON.stringify(stateModeObj[this.helperVariables.stateMode as keyof typeof stateModeObj], null, 4)

        const stateMode = {
            'full': 'Full',
            'pl': 'Patient Layer State - Patient: ' + this.helperVariables.currPatient,
            'coord': 'Coordinator State',
            'nde': 'Messages State',
            'coordDB': 'Coordinator DB'
        }

        text = 'State Mode: ' + stateMode[this.helperVariables.stateMode as keyof typeof stateMode]
        this.layout.console.stateCurrMode.render(text as string, { css: Props.rightDisplayCSS })

        this.layout.console.stateMode.render(JSON.stringify(JSON.stringify(state)))
    }

    renderDeviceLayerIP(state: ICEState) {
        const ip = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!.ip_state.find(obj => obj.dev === this.helperVariables.currDevice)!

        let cmds = ip.pan.cmds.filter(cmd => !['tick', 'openclamp', 'closeclamp', 'incr', 'decr'].includes(cmd))

        cmds = this.sortList(cmds, ipkeysOrder) as string[]

        let buttons = [] as Button[]

        const pvsFunction = {
            'auto': 'click_patient_device_exec_sync',
            'manual': 'click_patient_device_exec'
        }

        cmds.forEach(cmd => {
            buttons.push({
                customFunction: `${pvsFunction[this.helperVariables.syncMode as keyof typeof pvsFunction]}(${cmd},${this.helperVariables.currPatient},${this.helperVariables.currDevice})`,
                customLabel: ''
            })
        });

        this.layout.deviceLayerIP.keys.render(JSON.stringify(state), { buttons: buttons })

        let cmdsArrows = ip.pan.cmds.filter(cmd => ['incr', 'decr'].includes(cmd))

        cmdsArrows = this.sortList(cmdsArrows, ['incr', 'decr']) as string[]

        buttons = [] as Button[]
        cmdsArrows.forEach(cmd => {
            buttons.push({
                customFunction: `${pvsFunction[this.helperVariables.syncMode as keyof typeof pvsFunction]}(${cmd},${this.helperVariables.currPatient},${this.helperVariables.currDevice})`,
                customLabel: ''
            })
        });

        this.layout.deviceLayerIP.arrowKeys.render(JSON.stringify(state), { buttons: buttons })

        const displays = [] as Display[]

        const stateData: Record<string, any> = {
            'rte': ip.pan.num_disp['rte'],
            'vtb': ip.pan.num_disp['vtb'],
            'tme': ip.pan.num_disp['tme'],
            'dpm': ip.pan.enum_disp['dpm'],
            'er': ip.pan.enum_disp['er']
        }

        if (ip.pan.enum_disp['dpm'] != 'xdblank') {
            const displayData = ip.pan.pars

            console.log(stateData)
            console.log(displayData)
            displayData.forEach((key: string) => {
                displays.push({
                    displayName: key,
                    unit: ['rte', 'vtb', 'tme'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                    label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                    mapName: ['dpm', 'er'].includes(key) ? Enum.EnumParamEnum : undefined,
                    valueCss: ((key === 'dpm' && stateData[key] === 'xdblank') ? { 'color': Colors.red } : undefined),
                })
            }
            )
        }


        this.layout.deviceLayerIP.screen.render(JSON.stringify(stateData), { displays: displays })

    }

    renderDeviceLayerVS(state: ICEState) {
        const vs = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)!.vital_signs

        const cmds = vs.pan.cmds.filter(cmd => cmd === 'powr')

        const buttons = [] as Button[]

        const pvsFunction = {
            'auto': 'click_patient_device_exec_sync',
            'manual': 'click_patient_device_exec'
        }

        if (cmds.length > 0) {
            buttons.push({
                customFunction: `${pvsFunction[this.helperVariables.syncMode as keyof typeof pvsFunction]}(${cmds[0]},${this.helperVariables.currPatient},${this.helperVariables.currDevice})`,
                customLabel: ''
            })
        }

        this.layout.deviceLayerVS.power.render(JSON.stringify(state), { buttons: buttons })

        this.layout.deviceLayerVS.led.render(vs.pan.enum_disp['mde'] === 'xoff' ? Colors.red : Colors.aquamarine)

        if (this.layout.deviceLayerVS.screen !== null) {
            this.layout.deviceLayerVS.screen.remove()
        }

        const stateData: Record<string, any> = { ...vs.pan.num_disp, ...vs.pan.enum_disp }

        const displays = [] as Display[]
        let displaysVert = [] as Display[]

        const vsTracingProp = {
            'hrte': { 'color': Colors.aquamarine },
            'sp': { 'color': Colors.white },
            'ibp': { 'color': Colors.red },
            'rkrt': { 'color': Colors.lightblue },
        }

        const vsPowerOff = vs.pan.enum_disp['mde'] === 'xoff'

        if (!vsPowerOff) {
            delete stateData['mde']

            Object.keys(stateData).forEach((key: string) => {
                if (['hrte', 'sp', 'rkrt'].includes(key)) {
                    displaysVert.push({
                        displayName: key,
                        unit: ['hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                        label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                        valueCss: vsTracingProp[key as keyof typeof vsTracingProp]
                    })
                } else {
                    displays.push({
                        displayName: key,
                        unit: ['hrte', 'blpl', 'blph', 'sp', 'rkrt', 'ptmp'].includes(key) ? Enum.ParamUnitsENum[key as keyof typeof Enum.ParamUnitsENum] : undefined,
                        label: Enum.ParamEnum[key as keyof typeof Enum.ParamEnum] + ':',
                    })
                }


                if (['hrte', 'blpl', 'blph', 'sp', 'rkrt'].includes(key)) {
                    stateData[key] = Math.round(stateData[key])
                }
                if (key === 'ptmp') {
                    stateData[key] = Math.round(stateData[key] * 10) / 10
                }
            })

            stateData['ibp'] = stateData['blph'] + ' / ' + stateData['blpl']

            displaysVert.push({
                displayName: 'ibp',
                unit: Enum.ParamUnitsENum['blpl' as keyof typeof Enum.ParamUnitsENum],
                label: 'IBP:',
                valueCss: vsTracingProp['ibp']
            })


            console.log("displaysVert", displaysVert)
            displaysVert = [displaysVert.filter(d => d.displayName === 'hrte').pop()!, displaysVert.filter(d => d.displayName === 'sp').pop()!, displaysVert.filter(d => d.displayName === 'ibp').pop()!, displaysVert.filter(d => d.displayName === 'rkrt').pop()!]

            this.layout.deviceLayerVS.screen = new ContainerEVO('devLayerVSScreen', { width: 1293, height: 940, top: 109, left: 129 }, {
                parent: 'deviceLayerVS',
                displays: {
                    center: true,
                    spacing: 0,
                    mode: 'horizontal',
                    globalDisplaySize: {
                        width: 431,
                        height: 99
                    },
                    position: {
                        top: 841,
                        left: 0
                    },
                    size: {
                        width: 1293,
                        height: 99
                    },
                    globalDisplayCss: {
                        'justify-content': 'center'
                    },
                    globalValueCss: Props.vsScreenValueCSS,
                    globalLabelCss: Props.vsScreenLabelCSS,
                },
                css: {
                    background: 'black',
                    'border-radius': '10px'
                },
                simpleTraceDisplays: {
                    traceSize: {
                        height: 178,
                        width: 953
                    },
                    traceCss: {
                        'z-index': 4,
                        background: 'black'
                    },
                    tracePosition: {
                        top: 35,
                        left: 0
                    },
                    tracedisplays: [
                        {
                            label: false,
                            mode: 'ecg',
                            tracingDisplayName: 'hrte',
                            traceCss: {
                                color: Colors.aquamarine
                            },
                            range: {
                                max: 200,
                                min: 0
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'hrte',
                            mode: 'pleth',
                            traceCss: {
                                color: Colors.white
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'hrte',
                            sibp: 'blph',
                            dibp: 'blpl',
                            mode: 'ibp',
                            traceCss: {
                                color: Colors.red
                            }
                        },
                        {
                            label: false,
                            tracingDisplayName: 'rkrt',
                            mode: 'resp',
                            traceCss: {
                                color: Colors.lightblue
                            }
                        }
                    ]
                },
                widgets: [
                    () => {
                        return new MultiDisplayEVO('deviceLayerVSVerticalDisp', { width: 309, height: 712, top: 38, left: 953 }, {
                            parent: 'devLayerVSScreen',
                            center: true,
                            spacing: 0,
                            mode: 'vertical',
                            displays: displaysVert,
                            globalDisplaySize: {
                                width: 309,
                                height: 178
                            },
                            css: {
                                background: 'black',
                                'border': '3px solid #6CFFAF',
                                'border-radius': '10px'
                            },
                            globalDisplayCss: {
                                'justify-content': 'start',
                                'flex-direction': 'column',
                                'gap': '0px',
                            },
                            globalValueCss: Props.vsSideScreenValueCSS,
                            globalLabelCss: Props.vsSideScreenLabelCSS,
                        })
                    }
                ],
                //@ts-ignore
                connection: this.connection,
                callback: this.callback
            })

            this.layout.deviceLayerVS.screen.render(JSON.stringify(stateData), { displays: { displays: displays } })
        } else {
            this.layout.deviceLayerVS.screen = new ContainerEVO('devLayerVSScreen', { width: 1293, height: 940, top: 109, left: 129 }, {
                parent: 'deviceLayerVS',
                css: {
                    background: 'black',
                    'border-radius': '10px'
                }
            })

            this.layout.deviceLayerVS.screen.render(JSON.stringify(stateData))
        }


    }

    /**
     * Renders the layout elements
     */
    render(state: ICEState) {
        console.log(this.ICEState)

        // Remove all constraint alarms 
        this.layout.coordinator.constraintAlarm.forEach(c => c.remove())

        const content = document.getElementById('content')!

        const consoleDiv = document.getElementById('console')!

        // render coordinator
        const coordinator = document.getElementById('coordinator')!
        if (this.helperVariables.mode == 'coord') {
            coordinator.style.display = 'block'
            content.style.width = '3419px'
            content.style.height = '1582px'
            consoleDiv.style.left = '2459px'
            consoleDiv.style.top = '41px'
            this.renderCoordinator(state)
        } else {
            coordinator.style.display = 'none'
        }

        // render patientLayer
        const patientLayer = document.getElementById('patientLayer')!
        if (this.helperVariables.mode == 'pat') {
            patientLayer.style.display = 'block'
            content.style.width = '2189px'
            content.style.height = '1730px'
            consoleDiv.style.left = '1229px'
            consoleDiv.style.top = '115px'
            this.renderPatientLayer(state)
        } else {
            patientLayer.style.display = 'none'
        }

        // render device layer
        const devLayerIP = document.getElementById('deviceLayerIP')!
        const devLayerVS = document.getElementById('deviceLayerVS')!

        devLayerIP.style.display = 'none'
        devLayerVS.style.display = 'none'

        if (this.helperVariables.mode === 'dev') {
            const dev = state.pdb.find(obj => obj.id === this.helperVariables.currPatient)?.p_disp_top.devs.find(obj => obj.d === this.helperVariables.currDevice)
            console.log(dev)
            if (dev && dev.val === 'infusion_pump') {
                devLayerIP.style.display = 'block'
                content.style.width = '2750px'
                content.style.height = '1500px'
                consoleDiv.style.left = '1790px'
                consoleDiv.style.top = '0px'
                devLayerIP.style.top = '303px'
                this.renderDeviceLayerIP(state)
            }

            if (dev && dev.val === 'vital_signs_device') {
                devLayerVS.style.display = 'block'
                content.style.width = '2610px'
                content.style.height = '1500px'
                consoleDiv.style.left = '1650px'
                consoleDiv.style.top = '0px'
                devLayerVS.style.top = '31px'
                this.renderDeviceLayerVS(state)
            }
        }

        this.renderConsole(state)
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
                type: 'startProcess',
                data: {
                    contextFolder: 'demos/ice/pvs',
                    fileName: 'sim',
                    fileExtension: '.pvs'
                },
                useLastState: false // sim.pvs keeps its own state
            };

            // Start Timer
            this.layout.loading.render()
            // Set timer clock update
            this.timerSetInterval = setInterval(() => this.loadingUpdate(), 1000)

            this.connection.sendRequest('startProcess', proc);
            this.connection.onRequest('startProcess', (err, data) => {
                console.log('PVSio environment ready!', data);
                // initialize the model
                const init: SendCommandToken = {
                    id: uuid(),
                    type: 'sendCommand',
                    command: 'get_state_st'
                }
                this.connection.sendRequest('sendCommand', init);
                this.connection.onRequest('sendCommand', (err, res: SendCommandToken) => {
                    console.log('Model initialized!', res);
                    const state: ICEState = this.parseState(res)
                    this.ICEState = state

                    // Close loading timer
                    this.closeTimer()

                    // Render loading success message
                    this.renderLoadingSuccessMessage()

                    this.render(state)

                    // Init tick process
                    this.initTick()
                });
            });
        }
    }
}

// create an instance of the prototype and activate the prototype
const demo: ICE = new ICE();
demo.activate();