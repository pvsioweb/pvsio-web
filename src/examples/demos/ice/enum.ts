export enum DeviceTypeEnum {
    infusion_pump = 'Infusion Pump',
    vital_signs_device = 'Vital Signs Monitor',
    no_device = 'No Device'
}

export enum ModeEnum {
    error = 'Error',
    top = 'Top Mode',
    p_mode = 'Main Mode',
    d_mode = 'Device Mode'
}

export enum MenuEnum {
    no_action = 'No Action',
    delete = 'Delete',
    cursor_up = 'Cursor Up',
    cursor_down = 'Cursor Down',
    select = 'Select',
    enter = 'Enter',
    top = 'Top',
    main = 'Main',
    patient = 'Patient',
    device = 'Device',
    region = 'Region',
    rule = 'Rule',
    constraint = 'Constraint',
    edit = 'Edit',
    clear = 'Clear',
    display = 'Display',
    parameter = 'Parameter',
    action = 'Action',
    relation = 'Relation',
    num_value = 'Num Value',
    enum_value = 'Enum Value',
    escape = 'Escape',
    pump = 'Pump',
    vs_device = 'VS Monitor',
}

export enum DisplayFocusTypeEnum {
    no_focus = 'No Focus',
    top_focus = 'Top',
    patient_focus = 'Main',
    device_focus = 'Device',
    edit_top = 'Edit Top Display',
    edit_patient = 'Edit Main Display',
    edit_device = 'Edit Device Display',
    edit_rule = 'Edit Rule Display',
    edit_rule_1 = 'Edit Rule Display',
    edit_rule_2 = 'Edit Rule Display',
    edit_constraint = 'Edit Constraint Display'
}

export enum DisplayTypeEnum {
    no_focus = 'No Focus',
    top_focus = 'Top Display',
    patient_focus = 'Main Display',
    device_focus = 'Device Display',
    edit_top = 'Edit Top Display',
    edit_patient = 'Edit Main Display',
    edit_device = 'Edit Device Display',
    edit_rule = 'Edit Rule Display',
    edit_rule_1 = 'Edit Rule Display',
    edit_rule_2 = 'Edit Rule Display',
    edit_constraint = 'Edit Constraint Display'
}

export var RelationNumFilter = [{ value: 'lt', name: '<' }, { value: 'le', name: '<=' },
{ value: 'gt', name: '>' }, { value: 'ge', name: '>=' }, { value: 'eq', name: '=' }, { value: 'neq', name: '=/=' }, { value: 'no_rel', name: 'No Relation' }]

export var RelationEnumFilter = [{ value: 'eq', name: '=' }, { value: 'neq', name: '=/=' }, { value: 'no_rel', name: 'No Relation' }]

export enum RelationEnum {
    lt = '<',
    le = '<=',
    gt = '>',
    ge = '>=',
    eq = '=',
    neq = '=/=',
    no_rel = 'No Relation'
}

export enum RelationNameEnum {
    lt = 'Less',
    le = 'Less or Equals',
    gt = 'Greater',
    ge = 'Greater or Equals',
    eq = 'Equal',
    neq = 'Not Equal',
    no_rel = 'No Relation'
}

export enum ParamEnum {
    rte = 'Rate',
    vtb = 'VTBI',
    tme = 'Time',
    dpm = 'Display',
    er = 'Error',
    mde = 'Mode',
    hrte = 'HR',
    blpl = 'BP Dia',
    blph = 'BP Sys',
    sp = 'SpO2',
    rkrt = 'RR',
    ptmp = 'Temp',
}

export enum ParamNameEnum {
    rte = 'Rate',
    vtb = 'VTBI',
    tme = 'Time',
    dpm = 'Display Mode',
    er = 'Error',
    mde = 'Mode',
    hrte = 'Heart Rate',
    blpl = 'Blood Pressure Diastolic',
    blph = 'Blood Pressure Systolic',
    sp = 'Oxygen saturation',
    rkrt = 'Respiratory Rate',
    ptmp = 'Temperature',
}

export var ParamNumIPForm = [
    { value: 'rte', name: 'Rate' },
    { value: 'vtb', name: 'VTBI' },
    { value: 'tme', name: 'Time' }
]

export var ParamNumVSForm = [
    { value: 'hrte', name: 'Heart Rate' },
    { value: 'blpl', name: 'Blood Pressure Diastolic' },
    { value: 'blph', name: 'Blood Pressure Systolic' },
    { value: 'sp', name: 'Oxygen saturation' },
    { value: 'rkrt', name: 'Respiratory Rate' },
    { value: 'ptmp', name: 'Temperature' },
]

export var ParamEnumIPForm = [
    { value: 'dpm', name: 'Display' },
    { value: 'er', name: 'Error' }
]

export var ParamEnumVSForm = [
    { value: 'mde', name: 'Mode' },
]

export enum ParamUnitsENum {
    rte = 'ml/h',
    vtb = 'ml',
    tme = 'units',
    hrte = 'bpm',
    blpl = 'mmHg',
    blph = 'mmHg',
    sp = '%',
    rkrt = 'brpm',
    ptmp = 'ºC',
}

export var EnumFormIP = [
    { value: 'xoff', name: 'Off' },
    { value: 'xpause', name: 'Pause' },
    { value: 'xinfuse', name: 'Infuse' },
    { value: 'xdblank', name: 'Display Off' },
    { value: 'xmainmenu', name: 'Main Menu' },
    { value: 'xdvtbi', name: 'D VTBI' },
    { value: 'xdrate', name: 'D Rate' },
    { value: 'xdtime', name: 'D Time' },
    { value: 'xdinfusing', name: 'Infusing' },
    { value: 'xdalarm', name: 'D Alarm' },
    { value: 'xdkvo', name: 'D KVO' },
    { value: 'xopen', name: 'Open' },
    { value: 'xclosed', name: 'Closed' },
    { value: 'xrte', name: 'Rate' },
    { value: 'xtme', name: 'Time' },
    { value: 'xisconnected', name: 'Is Connected' },
    { value: 'xactive', name: 'Active' },
    { value: 'xnumeral', name: 'Numeral' },
    { value: 'xenumerated', name: 'Enumerated' },
    { value: 'xalarm', name: 'Alarm' },
    { value: 'xok', name: 'Ok' },
    { value: 'xnilval', name: 'No Value' }
]

export var EnumFormVS = [
    { value: 'xoff', name: 'Off' },
    { value: 'xok', name: 'Ok' },
    { value: 'xnilval', name: 'No Value' }
]

export var EnumParamEnum = {
    'xoff': 'Off',
    'xpause': 'Pause',
    'xinfuse': 'Infuse',
    'xdblank': 'Display Off',
    'xmainmenu': 'Main Menu',
    'xdvtbi': 'D VTBI',
    'xdrate': 'D Rate',
    'xdtime': 'D Time',
    'xdinfusing': 'Infusing',
    'xdalarm': 'D Alarm',
    'xdkvo': 'D KVO',
    'xopen': 'Open',
    'xclosed': 'Closed',
    'xrte': 'Rate',
    'xtme': 'Time',
    'xisconnected': 'Is Connected',
    'xactive': 'Active',
    'xnumeral': 'Numeral',
    'xenumerated': 'Enumerated',
    'xalarm': 'Alarm',
    'xok': 'Ok',
    'xnilval': 'No Value',
}

export var ActionFormIP = [
    { value: 'powr', name: 'Power' },
    { value: 'incr', name: 'Increment' },
    { value: 'decr', name: 'Decrement' },
    { value: 'bolus', name: 'Bolus' },
    { value: 'confirm', name: 'Confirm' },
    { value: 'choosetime', name: 'Choose Time' },
    { value: 'choosevtbi', name: 'Choose VTBI' },
    { value: 'chooserate', name: 'Choose Rate' },
    { value: 'start', name: 'Start' },
    { value: 'hold', name: 'Hold' },
    // { value: 'tick', name: 'Tick' },
    // { value: 'openclamp', name: 'Open Clamp' },
    // { value: 'closeclamp', name: 'Close Clamp' },
    { value: 'nil_action', name: 'No Action' }
]

export var ActionFormVS = [
    { value: 'powr', name: 'Power' },
    { value: 'nil_action', name: 'No Action' }
]

export enum ActionEnum {
    powr = 'Power',
    incr = 'Increment',
    decr = 'Decrement',
    bolus = 'Bolus',
    confirm = 'Confirm',
    choosetime = 'Choose Time',
    choosevtbi = 'Choose VTBI',
    chooserate = 'Choose Rate',
    start = 'Start',
    hold = 'Hold',
    tick = 'Tick',
    openclamp = 'Open Clamp',
    closeclamp = 'Close Clamp',
    nil_action = 'No Action',
    sel_dev = 'Select Device'
}