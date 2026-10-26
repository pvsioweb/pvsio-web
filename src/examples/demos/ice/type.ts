/**
 * @version 1.0
 * @description Type declatation for ICE state and sub-objects for the received result state given by the pvsio environment
 * @author João Linhares
 * @date Jan 23, 2024
 *
 */

export type NumDisplay = {
    rte?: number,
    vtb?: number,
    tme?: number
}

export type EnumDisplay = {
    dpm?: string,
    er?: string
}

export type DispNumParams = {
    d: number;
    val: NumDisplay
}

export type DispENumParams = {
    d: number;
    val: EnumDisplay
}

export type ProductionConstraint = {
    vt: string,
    nc: {
        d: number,
        p: string,
        r: string,
        v: number
    },
    ec: {
        d: number,
        p: string,
        r: string,
        v: string
    }
}

export type IPState = {
    dev: number,
    pan: {
        cmds: string[],
        num_disp: NumDisplay,
        enum_disp: EnumDisplay,
        pars: string[]
    }
}

export type VitalSigns = {
    dev: number,
    nde?: number,
    power: string,
    HR: number,
    BPL: number,
    BPH: number,
    SPO2: number,
    RR: number,
    temp: number,
    pan: {
        pars: string[],
        enum_disp: Record<string, string | number>,
        num_disp: Record<string, string | number>,
        cmds: string[]
    },
    vs_error: string
}

export type PDB = {
    id: number,
    nde: number,
    pmode: string,
    emode: string,
    name_buffer: number,
    num_buffer: number,
    disp_focus: string,
    p_disp_top: {
        sel_device: {
            dv: number,
            dt: string
        },
        devs: {
            d: number,
            val: string
        }[],
        disp_enum_params: DispENumParams[],
        disp_num_params: DispNumParams[],
        menu_visible: string[],
        ent_device: {
            dv: number,
            dt: string
        },
        ent_par: string,
        ent_rel: string,
        ent_act: string,
        ent_enum: string,
    },
    p_disp_main: {
        disp_enum_params: DispENumParams[],
        disp_num_params: DispNumParams[],
        p_actions: {
            d: number;
            val: string[]
        }[]
    },
    p_disp_device: {
        pars: string[],
        enum_disp: EnumDisplay,
        num_disp: NumDisplay,
        cmds: string[],
    },
    p_rules_display: {
        rule_setup: {
            current_production_index: number,
            current_production: ProductionConstraint[],
            select_par: string,
            select_act: string
            select_rel: string
            select_num: number,
            select_enum: string
        }
        select_pars: string[],
        select_acts: string[],
        current_rule_index: number,
        rule_set: {
            rule: ProductionConstraint[],
            action: {
                dev: number,
                act: string
            }
        }[]
    },
    vital_signs: VitalSigns,
    ip_state: IPState[]
}

export type NdeState = {
    current_node: number,
    current_pan_msg: any,
    current_act_msg: any,
    pan_msg_waiting: any[],
    act_msg_waiting: any[],
    nw_error: any,
}

export type CoordDB = {
    p: number,
    val: {
        p_enum_params: DispENumParams[],
        p_num_params: DispNumParams[],
        p_actions: {
            d: number,
            val: string[]
        }[],
        p_av_actions: {
            d: number,
            val: string[]
        }[],
        p_devices: {
            d: number,
            val: string
        }[],
        coord_devices: {
            d: number,
            val: {
                pars: string[],
                enum_disp: Record<string, string | number>,
                num_disp: Record<string, string | number>,
                cmds: string[]
            }
        }[],
        d_available_actions: {
            d: number,
            val: string[]
        }[],
    }
}

export type CoordSt = {
    nde: number,
    mode: string,
    disp_focus: string,
    disp_top: {
        patients: number[],
        selected_patient: number,
        patients_enum_params: {
            p: number,
            val: DispENumParams[]
        }[],
        patients_num_params: {
            p: number,
            val: DispNumParams[]
        }[],
        menu_visible: string[],
        ent_device: number,
        ent_patient: number,
        ent_action: string
    },
    disp_alarm: {
        patient_updates: string[],
        device_update: string[],
        patient_connected: string[],
        patient_device_connected: string[][],
        constraint_alarms: {
            p: number,
            val: {
                dev: number,
                act: string
            }

        }[],
    },
    disp_patient: {
        current_patient: number,
        devices: {
            d: number,
            val: string
        }[],
        selected_device: number,
        patient_enum_params: DispENumParams[],
        patient_num_params: DispNumParams[],
        patient_actions: {
            d: number;
            val: string[]
        }[],
        av_main_act: {
            d: number;
            val: string[]
        }[],
        selected_action: string
    },
    disp_device: {
        current_device: number,
        e_disp: EnumDisplay,
        n_disp: NumDisplay,
        c_disp: string[],
        av_c_disp: string[],
        selected_action: string
    },
    coord_db: CoordDB[]
}

export type ICEState = {
    nde_state: NdeState,
    p_nodes: {
        node: number,
        patient: number
    }[],
    d_nodes: {
        node: number,
        pd: {
            pat: number,
            dev: number
        }
    }[],
    pdb: PDB[],
    coord_st: CoordSt
}
