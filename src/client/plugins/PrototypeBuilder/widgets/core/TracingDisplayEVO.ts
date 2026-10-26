/**
 * @module TracingDisplayEVO
 * @version 1.0
 * @description Renders a tracing display widget given a variable.
 *              This module provide APIs for setting up the visual appearance of the widget.
 * @author João Linhares
 * @date August 15, 2026
 *
 */

import { Coords, CSS, Renderable, WidgetOptions } from "../../../../common/interfaces/Widgets";
import { BasicDisplayEVO } from "./BasicDisplayEVO";
import { MatchState, rat2real, ratNumberMatch, WidgetAttr, WidgetEVO } from "./WidgetEVO";


// Ecg waveform
const ecgWaveform = [
    18,
    23,
    30,
    30,
    24,
    18,
    18,
    18,
    12,
    57,
    89,
    48,
    6,
    18,
    18,
    27,
    36,
    42,
    42,
    27,
    36,
    18]


// Pleth waveform
const plethWaveform = [
    41,
    74,
    87,
    86,
    74,
    68,
    62,
    56,
    50,
    46,
    45,
    44,
    44,
    44,
    44
]

// IBP waveform in percentages to be multiplied by an height of the desired wave
const ibpWaveform = [
    0.47,
    0.85,
    1,
    1,
    0.92,
    0.90,
    0.87,
    0.84,
    0.82,
    0.77,
    0.54,
    0.54,
    0.57,
    0.57,
    0.57
]


export interface TracingDisplayOptions extends WidgetOptions {
    tracingDisplayName?: string, // tracing Display widget name
    range?: Range, // min and max values of tracingDislay, med is gonna be the medium value between the max and min
    label?: boolean, // set if its desired for the max, min and med values to be displayed next to the trace
    scanBarColor?: string, // scanbar color
    traceWidth?: number, // thickness of the tracing line
    scanBarSpaceWidth?: number,// scanbar spaceWidth to represent the corrant location where the current tracing value is being draw,
    speed?: number, // how many pixels the tracing line draws per frame
    keepState?: boolean, // if true previous values stay drawn in the trace display
    fps?: number, // refresh rate
    mode?: 'ecg' | 'pleth' | 'etco2mmHG' | 'etco2kPa' | 'ibp' | 'resp' | 'customWave' | 'draw',
    noise?: boolean, // if true adds noise to de line
    customWave?: number[], // customWave
    respirationRate?: string, // respiration rate value or key for modes 'etco2mmHG' and 'etco2kPa, if not provided default is 14
    sibp?: string, // systolic bp value or key for mode 'ibp', if not provided default is 110
    dibp?: string, // diastolic bp value or key for mode 'ibp', if not provided default is 70
    customPauseWaveValue?: number, // custom value for rest value between waves
};

export interface Range {
    min: number,
    max: number
}

export interface TracingDisplayAttr extends WidgetAttr {
    tracingDisplayName: string,
    mode: 'ecg' | 'pleth' | 'etco2mmHG' | 'etco2kPa' | 'ibp' | 'resp' | 'customWave' | 'draw'
};

export class TracingDisplayEVO extends WidgetEVO {
    /**
     * TracingDisplay attributes
     */
    protected attr!: TracingDisplayAttr;

    protected customPauseWaveValue: number
    protected range: Range;

    protected speed: number;

    protected keep: boolean;

    protected px: number;

    protected py: number;

    protected wave: number[]

    protected aux_px: number;

    protected aux_py: number;

    protected intervalAux: number;

    protected intervalPx: number;

    protected frame: number;

    protected loop: NodeJS.Timeout | null;

    protected canvas: JQuery<HTMLElement> | null;

    protected fps: number;

    protected label: boolean;

    protected maxLabel: number

    protected noise: boolean

    protected medLabel: number

    protected minLabel: number

    protected oldETCO2Value: number | null

    protected oldHRValue: number | null

    protected oldRespValue: number | null

    protected oldSBPValue: number | null

    protected oldDBPValue: number | null

    protected customWave: number[] | null

    protected scanBarColor: string // scanbar color
    protected traceWidth: number // thickness of the tracing line
    protected scanBarSpaceWidth?: number// scanbar spaceWidth to represent the corrant location where the current tracing value is being draw,


    protected respirationRate: string

    protected sibp: string

    protected dibp: string

    protected minDisplay: BasicDisplayEVO | null

    protected medDisplay: BasicDisplayEVO | null

    protected maxDisplay: BasicDisplayEVO | null

    protected displayWidth: number

    protected displayHeight: number

    protected canvasWidth: number

    protected canvasHeight: number

    protected canvasOffset: number

    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = "TracingDisplayEVO";
    getConstructorName(): string {
        return TracingDisplayEVO.constructorName;
    }
    getDescription(): string {
        return "Suitable for rendering a tracing display widget.";
    }
    renderSample(): void {
        const st: Record<string, string> = {};
        st[this.attr.tracingDisplayName] = "50";
        this.render(JSON.stringify(st));
    }

    /**
     * Constructor
     */
    constructor(id: string, coords: Coords, opt: TracingDisplayOptions) {
        super(id, coords, opt);
        this.kind = "Display";
        this.intervalPx = 0;
        opt.css = opt.css || {};
        this.css = { ...opt.css }
        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css["background"] = opt.css.background || opt.css["background-color"] || "black";
        this.css.color = opt.css.color || "white";
        this.css.cursor = opt.css.cursor || "default";
        this.css.overflow = opt.css.overflow || "hidden";
        this.css["font-family"] = opt.css["font-family"] || "Times"

        // set attributes
        this.attr.tracingDisplayName = opt.tracingDisplayName || id

        this.keep = opt.keepState ?? true

        //  Trace Mode
        this.attr.mode = opt?.mode || 'draw'

        // Label
        this.label = opt.label ?? true

        // Trace y axis ragne
        const rangeMinOpt = Number(opt.range?.min);
        const rangeMaxOpt = Number(opt.range?.max);
        this.range = (isNaN(rangeMinOpt) || isNaN(rangeMaxOpt) || rangeMaxOpt === rangeMinOpt) ? { max: 100, min: 0 } : { min: rangeMinOpt, max: rangeMaxOpt };

        // How many pixels are drawn by each frame
        this.speed = opt.speed || 2;
        this.scanBarColor = opt?.scanBarColor || this.css["background"];
        this.scanBarSpaceWidth = opt?.scanBarSpaceWidth || 4;
        if (this.scanBarSpaceWidth < this.speed) {
            this.scanBarSpaceWidth = 2.5 * this.speed
        }

        this.traceWidth = opt.traceWidth || 1;

        //  Custom Wave, for custom wave mode
        this.customWave = opt?.customWave || null

        this.oldETCO2Value = null

        this.oldHRValue = null

        this.oldRespValue = null

        this.oldSBPValue = null

        this.oldDBPValue = null

        //  Default values for auxiliary variables for ibp mode and etco2 modes
        this.respirationRate = opt?.respirationRate || '14'
        this.sibp = opt?.sibp || '110'
        this.dibp = opt?.dibp || '70'

        if (this.customWave) {
            this.attr.mode = 'customWave'
        }

        //  In modes bellow the range is set to [0, 100]
        if (['pleth', 'ecg', 'etco2mmHG', 'resp'].includes(this.attr.mode)) {
            this.range = { max: 100, min: 0 }
        }

        //  In mode ibp bellow the range is set to [0, 250], then depending on the sibp and dibp values this ranges are altered so it focuses on the ibp wave
        if (['ibp'].includes(this.attr.mode)) {
            this.range = { max: 250, min: 0 }
        }

        // In mode etco2kPa, the range is set to [0, 20]
        if (this.attr.mode === 'etco2kPa') {
            this.range = { max: 20, min: 0 }
        }

        // additional state variables necessary for rendering the trace
        this.py = (this.height - 5) * 0.5; // in the y axis starts at the middle of the display
        this.px = 0; // in the x axis starts at the begining of the display
        this.aux_px = this.px;
        this.aux_py = this.py;
        this.intervalAux = 0
        this.frame = 0
        this.loop = null;
        const fpsOpt = Number(opt?.fps);
        this.fps = (isNaN(fpsOpt) || fpsOpt <= 0) ? 30 : fpsOpt;

        if (this.fps > 60) {
            this.fps = 60
        }

        this.canvas = null

        this.customPauseWaveValue = opt?.customPauseWaveValue || 0

        this.noise = opt.noise ?? false
        //labels

        this.wave = []

        this.minLabel = this.range.min
        this.medLabel = this.range.min + ((this.range.max - this.range.min) / 2)
        this.maxLabel = this.range.max

        this.displayWidth = this.width * 0.1
        this.displayHeight = this.height / 6

        this.css["font-size"] = opt.css["font-size"] || (this.displayHeight / 6) * 4 + "px"

        this.canvasHeight = this.height - 8
        this.canvasWidth = this.label ? this.width - this.displayWidth - this.width * 0.01 : this.width
        this.canvasOffset = this.label ? this.displayWidth + this.width * 0.01 : 0

        this.minDisplay = null
        this.medDisplay = null
        this.maxDisplay = null
    }

    /**
    * Internal function, Restores canvas
    * @param context Canvas
    */
    private clearContext(context: CanvasRenderingContext2D) {
        context.save();
        context.fillStyle = this.css["background"] ?? '';
        context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        context.restore();
    }

    /**
    * Internal function, Generates random number between [min, max], if noise is set to true to add noise to the trace
    * @param min Minimun value
    * @param max Maximum value
    * @returns Random value between min and max
    */
    private randomIntFromInterval(min: number, max: number): number { // min and max included 
        return (this.noise ? Math.floor(Math.random() * (max - min + 1) + min) : 0)
    }

    /**
    * Internal function, render function called countinously with a set interval
    * @param context Canvas
    */
    protected render_aux(context: CanvasRenderingContext2D) {
        const _this = this
        return function () {
            _this.px += _this.speed;
            // Offsets for intervals between waves, or if there is no waves to be draw
            const modeOffset = {
                'pleth': 7,
                'ecg': 17,
                'etco2mmHG': 7,
                'etco2kPa': 0.4,
                'ibp': 7,
                'resp': 0,
                'customWave': _this.customPauseWaveValue,
                'draw': 0
            }
            const dataObj: Record<string, number[] | null> = {
                'ecg': ecgWaveform,
                'customWave': _this.customWave,
                'draw': null
            }
            // Get data array corresponding to the mode, if the mode is not on dataObj uses _this.wave that corresponds to the calculated wave depending on the missing modes from the object
            const data = dataObj[_this.attr.mode] ?? _this.wave

            const offset = modeOffset[_this.attr.mode]

            // if mode includes an repeting occurence of an wave
            if (_this.attr.mode != 'draw') {
                let dy = offset
                // Draw line without wave if interval is negative means that there is no wave given current state, 
                // if number of frames is bigger than data wave length, that means that is the wave was fully drawn and it will be drawn the space interval between the last and the next wave
                if (_this.intervalPx === -1 || _this.frame >= data.length) {
                    // repeat line without wave until the interval until the next wave finishes
                    if ((_this.intervalAux < _this.intervalPx && _this.intervalPx > 0) || _this.intervalPx === -1) {
                        dy = offset
                        _this.intervalAux += _this.speed;
                    } else {
                        // when interval is fully drawn, reset frame counter and intervalAux counter
                        _this.frame = 0
                        _this.intervalAux = 0
                    }
                }
                // Draw wave if the frame counter is lesser than the data wave length
                if (_this.frame < data.length && _this.intervalPx !== -1) {
                    _this.intervalAux = 0
                    // Draw wave
                    dy = data[_this.frame % data.length]
                    _this.frame++
                }
                // Sets y position to be correctly placed on the canvas
                const newValue = 100 / (_this.range.max - _this.range.min) * (dy - _this.range.min)
                _this.py = _this.canvasHeight - (newValue / 100) * _this.canvasHeight + _this.randomIntFromInterval(-1, 1);
            }
            context.clearRect(_this.aux_px, 0, _this.scanBarSpaceWidth ?? 0, _this.canvasHeight);
            context.fillStyle = _this.scanBarColor;
            context.fillRect(_this.px, 0, _this.scanBarSpaceWidth ?? 0, _this.canvasHeight);
            context.beginPath();
            context.moveTo(_this.aux_px, _this.aux_py);
            context.lineTo(_this.px, _this.py);
            context.stroke();
            _this.aux_px = _this.px;
            _this.aux_py = _this.py + _this.randomIntFromInterval(-1, 1);
            if (_this.aux_px > _this.canvasWidth) {
                _this.px = _this.aux_px = 0
            }
        };
    }

    /**
   * Internal function, Function that sets the loop to draw the trace, uses setInterval to call a drawing function thats called x number per times per second
   */
    public animate() {
        if (!this.loop) {
            const canvas = <HTMLCanvasElement>document.getElementById(this.id + "Canvas");
            const context = canvas.getContext('2d')!
            context.textBaseline = "middle";
            context.strokeStyle = this.css.color ?? '';
            context.lineWidth = this.traceWidth;
            context.font = [this.css["font-size"], " ", this.css["font-family"]].join("");

            this.render_aux(context)();
            this.loop = setInterval(this.render_aux(context), 1000 / this.fps);
            if (!this.keep) {
                this.px = this.aux_px = 0;
                this.clearContext(context);
            }
        }
    }

    /**
    * Internal function, gets value from state given a key
    * @param state State
    * @param key Key
    * @returns value
    */
    private getValue(state?: Renderable, key?: string): string {
        if (state !== undefined && state !== null) {
            if (this.matchStateFlag) {
                // Return match from state
                const name: string = key ?? ''
                const match: MatchState | null = (typeof state === "string") ?
                    this.matchState(state, name)
                    // @ts-ignore: state is used as object at runtime
                    : { name, val: state[name] };
                if (match) {
                    // check if this is a rational number -- don't use directly rat2real 
                    // because the state may be a string that resembles a number, e.g., "2.", 
                    // and rat2real would translate it into number 2 (i.e., the '.' gets removed, 
                    // which is not what we want for non-numeric displays)
                    const matchRat: RegExpMatchArray | null = new RegExp(ratNumberMatch).exec(match.val);
                    if (matchRat) {
                        const val: number = rat2real(match.val);
                        const disp: string = isNaN(val) ? `${match.val}` : `${val}`;
                        return disp
                    } else {
                        return match.val
                    }
                }
                // If it doesnt match returns key
            } else {
                return key === this.getName() ? state.toString() : key ?? ''
            }
        }
        return key === this.getName() ? (state?.toString() ?? '') : key ?? ''
    }

    /**
    * Internal function, Render pleth mode given an heart rate
    * @param heartRate heartRate value as string
    */
    private renderPleth(heartRate: string): void {
        // Get heart rate value
        let hr = (heartRate !== null && heartRate !== undefined && !isNaN(parseFloat(heartRate))) ? parseFloat(heartRate) : 0;

        hr = hr > 250 ? 250 : (hr < 0 ? 0 : hr)

        // If hr is different form oldValue of heart rate reset frame and intervalAux counter so it drawns the new state from the 0 position instead of continuing from old frame or interval position 
        let calculateNewArray
        if (hr !== this.oldHRValue) {
            calculateNewArray = true
            this.oldHRValue = hr
            this.frame = 0
            this.intervalAux = 0
        } else {
            calculateNewArray = false
        }

        // If there is a heartBeat, calculate pleth wave for a single heartbeat that will be constantly printed until a new heart beat value is given
        // If the heart rate value doenst change is not necessary to recalculate the array
        if (hr !== 0 && calculateNewArray) {
            // Simple calculation to determine the space between the heart beats. Not to represent reality, calulates the space in seconds between the heart beats with 60 / heartRate. 
            // Then is multiplied by the number of fps to calculate how many frames corresponds those calculated seconds
            const spaceBetweenHeartBeats = hr === 0 ? 0 : Math.floor(60 / hr * this.fps)
            // A pleth wave corresponds to a entire heartbeat plus the interval between the current heartbeat and the next
            const waveSize = spaceBetweenHeartBeats + ecgWaveform.length
            // Build wave
            this.wave = new Array(waveSize)

            // The pleth wave is built in 3 phases
            let i, auxI = 0, auxE = 0, intensity = 44
            const base = Math.pow(7 / 44, 1 / (waveSize - ecgWaveform.length))
            for (i = 0; i < this.wave.length; i++) {
                // First phase, with for the first 7 frames of the ecg wave, the pleth wave is at a rest state
                // Second phase, draws the spike of a normal case of a pleth wave
                if (i < ecgWaveform.length) {
                    this.wave[i] = i < 7 ? 7 : plethWaveform[auxI++]
                } else {
                    // Third phase connects the end of the spike of a normal case of a pleth wave to the rest state so it connects smoothly to the next wave using exponentional functions
                    this.wave[i] = intensity * Math.pow(base, auxE)
                    auxE++
                }
            }
        }


        // If there is no heartRate means that no wave is gonna be drawn, else the wave calculated previously will be drawn continuously
        this.intervalPx = hr === 0 ? -1 : 0

    }

    /**
    * Internal function, Render ecg mode given an heart rate
    * @param heartRate heartRate value as string
    */
    private renderECG(heartRate: string): void {
        // Get heart rate value
        let hr = (heartRate !== null && heartRate !== undefined && !isNaN(parseFloat(heartRate))) ? parseFloat(heartRate) : 0;

        hr = hr > 250 ? 250 : (hr < 0 ? 0 : hr)

        // If hr is different form oldValue of heart rate reset frame and intervalAux counter so it drawns the new state from the 0 position instead of continuing from old frame or interval position 
        if (hr !== this.oldHRValue) {
            this.oldHRValue = hr
            this.frame = 0
            this.intervalAux = 0
        }

        // If there is no heartRate means that no wave is gonna be drawn, else the interval is calculated by the time in seconds between waves and the number of pixels drwan per second so its calculated the size in pixels between waves
        this.intervalPx = hr === 0 ? -1 : 60 / hr * (this.speed * this.fps)
    }

    /**
    * Internal function, Render etco2 mode given an etco2 value, respiratoryRate and the type of units used in this trace mode
    * @param etco2 etco2 value as string
    * @param respiratoryRate respiratoryRate value as string
    * @param type type of unit of the etco3 'mmHG' or 'kPa'
    */
    private renderEtcO2(etco2: string, respiratoryRate: string, type: string): void {
        // Get respiration rate value from string
        let rr = (respiratoryRate !== null && respiratoryRate !== undefined && !isNaN(parseFloat(respiratoryRate))) ? parseFloat(respiratoryRate) : 0;

        rr = rr > 60 ? 60 : (rr < 0 ? 0 : rr)

        // Get etco2value from string
        let etco2Val = (etco2 !== null && etco2 !== undefined && !isNaN(parseFloat(etco2))) ? parseFloat(etco2) : 0;

        // If unit type mmHG the max value is 100, but so it fits onto the canvas is set to 99. Unit type kpa the max is 20, but to fit in canvas is set to 19
        const max = type === 'mmHG' ? 99 : 19

        etco2Val = etco2Val > max ? max : (etco2Val < 0 ? 0 : etco2Val)

        // If respiration rate or etco2 values are different from the old ones, reset frame and intervalAux counter so it drawns the new state from the 0 position instead of continuing from old frame or interval position 
        // If values remain is not necessary to recalculate the wave array
        let calculateNewArray
        if (rr !== this.oldRespValue || etco2Val !== this.oldETCO2Value) {
            calculateNewArray = true
            this.oldRespValue = rr
            this.oldETCO2Value = etco2Val
            this.frame = 0
            this.intervalAux = 0
        } else {
            calculateNewArray = false
        }

        // If respiration rate or etco2 values are not 0 and its necessary to calculate new array, calculate etco2 wave for a respiration cicle that will be constantly printed until new values are given
        // If values remain is not necessary to recalculate the wave array
        if (rr !== 0 && etco2Val !== 0 && calculateNewArray) {

            // The size of the wave is the number of frames that a respiration cicle is completed. Simple calculation to determine the seconds it takes to finish a breath cicle.
            // Then is multiplied by the number of fps to calculate how many frames corresponds those calculated seconds
            const size = rr ? Math.floor((60 / rr * (this.fps))) : 0
            this.wave = new Array(size)

            // The wave in the exhale phase, has two more phases, the first is an ascend until it stops in the gicen etco2 value, the other is descend a bit until it crashes onto the inhale phase
            const ascendHeight = etco2Val * 0.15 // How much lower than the etco2 value the ascend begins
            const descendHeight = etco2Val * 0.05 // How much lower than the etco2 value the descend colapse goes to

            const inhaleExhaleSize = this.wave.length / 2 // An inhale and an exhale correspondes each to the half of and respiration cicle
            const descendCurveSize = inhaleExhaleSize * 0.1 // The second phase of the exhale phase corresponds to 10% of the frames
            const descendCurveRate = descendHeight / descendCurveSize // Rate of the descend phase


            const ascendCurveSize = inhaleExhaleSize - descendCurveSize // The first phase of the exhale phase corresponds to rest of the frames
            const ascendCurveRate = ascendHeight / ascendCurveSize // Rate of the ascend phase

            for (let i = 0; i < this.wave.length; i++) {
                // First phase of the exhale
                if (i < inhaleExhaleSize && i < inhaleExhaleSize - descendCurveSize) {
                    this.wave[i] = etco2Val - ascendCurveRate * (inhaleExhaleSize - descendCurveSize - i)
                }
                // Second phase of the exhale
                if (i < inhaleExhaleSize && i >= inhaleExhaleSize - descendCurveSize) {
                    this.wave[i] = etco2Val - (i >= inhaleExhaleSize - descendCurveSize ? (descendCurveRate * (i - inhaleExhaleSize + descendCurveSize)) : 0)
                }
                // Inhale phase, whe the etco2 is at the rest point
                if (i >= inhaleExhaleSize) {
                    this.wave[i] = type === 'mmHG' ? 7 : 0.4
                }
            }
        }

        // If there is no respiration rate or etco2 value means that no wave is gonna be drawn, else the wave calculated previously will be drawn continuously
        this.intervalPx = rr === 0 || etco2Val === 0 ? -1 : 0
    }

    /**
    * Internal function, Render ibp mode given an heart rate, systolic blood pressure and diastolic blood presure
    * @param heartRate heartRate value as string
    * @param sibp sibp value as string
    * @param dibp dibp value as string
    */
    private renderIBP(heartRate: string, sibp: string, dibp: string): void {
        // Get heart rate value from string

        let hr = (heartRate !== null && heartRate !== undefined && !isNaN(parseFloat(heartRate))) ? parseFloat(heartRate) : 0;

        hr = hr > 250 ? 250 : (hr < 0 ? 0 : hr)

        // Get systolic and siastolica values from string
        let systolic = (sibp !== null && sibp !== undefined && !isNaN(parseFloat(sibp))) ? parseFloat(sibp) : 0;
        let diastolic = (dibp !== null && dibp !== undefined && !isNaN(parseFloat(dibp))) ? parseFloat(dibp) : 0;

        // Both have to be between than [0, 250]
        systolic = systolic > 250 ? 250 : (systolic < 0 ? 0 : systolic)
        diastolic = diastolic > 250 ? 250 : (diastolic < 0 ? 0 : diastolic)

        // Systolic has to have a higher or equal value than diastolic
        systolic = systolic < diastolic ? diastolic : systolic
        diastolic = diastolic > systolic ? systolic : diastolic

        // If there is an heart rate calculate the max and min range to be closer to the systolic and diastolic values so it zooms on the ibp wave
        if (hr !== 0) {
            this.range.max = systolic + 10 > 250 ? 250 : Math.ceil((systolic + 10) / 10) * 10

            this.range.min = diastolic - 10 < 0 ? 0 : Math.floor((diastolic - 10) / 10) * 10
        } else {
            this.range.max = 250

            this.range.min = 0
        }

        // Calculate label values given the range
        this.minLabel = this.range.min
        this.medLabel = this.range.min + ((this.range.max - this.range.min) / 2)
        this.maxLabel = this.range.max

        // If heart rate or blood pressure values are different from the old ones, reset frame and intervalAux counter so it drawns the new state from the 0 position instead of continuing from old frame or interval position 
        // If values remain is not necessary to recalculate the wave array
        let calculateNewArray
        if (hr !== this.oldHRValue || systolic !== this.oldSBPValue || diastolic !== this.oldDBPValue) {
            calculateNewArray = true
            this.oldHRValue = hr
            this.oldDBPValue = diastolic
            this.oldSBPValue = systolic
            this.frame = 0
            this.intervalAux = 0
        } else {
            calculateNewArray = false
        }

        // If heart rate or blood pressure values are not 0 and its necessary to calculate new array, calculate ibp wave for a single heartbeat that will be constantly printed until new values are given
        // If values remain is not necessary to recalculate the wave array
        if (hr !== 0 && systolic !== 0 && diastolic !== 0 && calculateNewArray) {
            // Simple calculation to determine the space between the heart beats. Not to represent reality, calulates the space in seconds between the heart beats with 60 / heartRate. 
            // Then is multiplied by the number of fps to calculate how many frames corresponds those calculated seconds
            const spaceBetweenHeartBeats = hr === 0 ? 0 : Math.floor(60 / hr * this.fps)
            // A ibp wave corresponds to a entire heartbeat plus the interval between the current heartbeat and the next
            const waveSize = spaceBetweenHeartBeats + ecgWaveform.length
            // Build wave
            this.wave = new Array(waveSize)

            // The ibp wave is built in 3 phases
            let i, auxI = 0, auxE = 0, height = systolic - diastolic, exponentionalStart = ibpWaveform[ibpWaveform.length - 1] * height
            const base = Math.pow(diastolic / (exponentionalStart + diastolic), 1 / (waveSize - ecgWaveform.length))
            for (i = 0; i < this.wave.length; i++) {
                // First phase, with for the first 7 frames of the ecg wave, the icg wave is at a diastolic value
                // Second phase, draws the spike of a normal case of a icg wave given the systolic and diastolic values
                if (i < ecgWaveform.length) {
                    this.wave[i] = i < 7 ? diastolic : diastolic + ibpWaveform[auxI++] * height
                } else {
                    // Third phase connects the end of the spike of a normal case of a icg wave to the diastolic value so it connects smoothly to the next wave using exponentional functions
                    this.wave[i] = (diastolic + exponentionalStart) * Math.pow(base, auxE)
                    auxE++
                }
            }

        }

        // If there is no heartRate and  no blood pressure means that no wave is gonna be drawn, else the wave calculated previously will be drawn continuously
        this.intervalPx = hr === 0 || systolic === 0 || diastolic === 0 ? -1 : 0

    }

    /**
    * Internal function, Render resp mode given an respiratoryRate
    * @param respiratoryRate respiratoryRate value as string
    */
    private renderResp(respiratoryRate: string): void {
        // Get respiration rate value from string
        let rr = (respiratoryRate !== null && respiratoryRate !== undefined && !isNaN(parseFloat(respiratoryRate))) ? parseFloat(respiratoryRate) : 0;

        rr = rr > 60 ? 60 : (rr < 0 ? 0 : rr)

        // If respiration rate is different from the old one, reset frame and intervalAux counter so it drawns the new state from the 0 position instead of continuing from old frame or interval position 
        // If values remain is not necessary to recalculate the wave array
        let calculateNewArray
        if (rr !== this.oldRespValue) {
            calculateNewArray = true
            this.oldRespValue = rr
            this.frame = 0
            this.intervalAux = 0
        } else {
            calculateNewArray = false
        }

        // If respiration rate is not 0 and its necessary to calculate new array, calculate resp wave for a respiration cicle that will be constantly printed until new values are given
        // If values remain is not necessary to recalculate the wave array
        if (rr !== 0 && calculateNewArray) {
            // The size of the wave is the number of frames that a respiration cicle is completed. Simple calculation to determine the seconds it takes to finish a breath cicle.
            // Then is multiplied by the number of fps to calculate how many frames corresponds those calculated seconds
            const size = rr ? Math.floor((60 / rr * (this.fps))) : 0 // size of exale and inhale time

            this.wave = new Array(size)

            // Utilizes cos function to represent a single respiration cicle that will be repeated until a new rr value is given, when the curve is ascending it represents the inhale phase, the opposite the exhale phase
            for (let i = 0; i < this.wave.length; i++) {
                const value = ((100 / this.wave.length) * i) / 100
                this.wave[i] = Math.cos(2 * Math.PI * value) * 49 + 49.5
            }
        }

        // If there is no respiration rate value means that no wave is gonna be drawn, else the wave calculated previously will be drawn continuously
        this.intervalPx = rr === 0 ? -1 : 0
    }

    /**
    * Internal function, Renders the label displays if option is true
    */
    private renderScreens(): void {
        // Instantiates if they dont exist
        if (this.label && this.maxDisplay === null && this.medDisplay === null && this.minDisplay === null) {
            this.maxDisplay = new BasicDisplayEVO(this.id + "LabelMax", {
                top: 0,
                left: 0,
                width: this.displayWidth,
                height: this.displayHeight

            }, {
                parent: this.$base ? this.$base : this.id,
                css: {
                    color: this.css.color ?? '',
                    "text-align": "center",
                    "font-family": this.css["font-family"] ?? '',
                    "font-size": this.css["font-size"] ?? '',
                    background: this.css.background ?? '',
                    "z-index": this.css["z-index"] ?? 0
                },
                renderMode: "string"

            })

            this.medDisplay = new BasicDisplayEVO(this.id + "LabelMed", {
                top: this.height / 2 - (this.displayHeight / 2),
                left: 0,
                width: this.displayWidth,
                height: this.displayHeight

            }, {
                parent: this.$base ? this.$base : this.id,
                css: {
                    color: this.css.color ?? '',
                    "text-align": "center",
                    "font-family": this.css["font-family"] ?? '',
                    "font-size": this.css["font-size"] ?? '',
                    background: this.css.background ?? '',
                    "z-index": this.css["z-index"] ?? 0
                },
                renderMode: "string"

            })

            this.minDisplay = new BasicDisplayEVO(this.id + "LabelMin", {
                top: this.height - this.displayHeight,
                left: 0,
                width: this.displayWidth,
                height: this.displayHeight

            }, {
                parent: this.$base ? this.$base : this.id,
                css: {
                    color: this.css.color ?? '',
                    "text-align": "center",
                    "font-family": this.css["font-family"] ?? '',
                    "font-size": this.css["font-size"] ?? '',
                    background: this.css.background ?? '',
                    "z-index": this.css["z-index"] ?? 0
                },
                renderMode: "string"

            })
        }

        // renders if label option is st to true
        if (this.label) {
            this.minDisplay!.render(this.minLabel.toString())
            this.medDisplay!.render(this.medLabel.toString())
            this.maxDisplay!.render(this.maxLabel.toString())
        }
    }

    /**
     * Renders the widget
     */
    render(state?: Renderable, opt?: TracingDisplayOptions): void {

        opt = opt || {};

        // create the html element
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();

        const rangeMinRenderOpt = Number(opt.range?.min);
        const rangeMaxRenderOpt = Number(opt.range?.max);
        this.range = (isNaN(rangeMinRenderOpt) || isNaN(rangeMaxRenderOpt) || rangeMaxRenderOpt === rangeMinRenderOpt) ? this.range : { min: rangeMinRenderOpt, max: rangeMaxRenderOpt };

        if (state !== undefined && state !== null) {                     // Render if state exists

            // Get value from state
            const value = this.getValue(state, this.getName())

            // Build canvas
            const canvasDiv = document.getElementById(this.id + "Canvas")
            if (!canvasDiv) {
                const cv = <HTMLCanvasElement>document.createElement("CANVAS")
                cv.id = this.id + "Canvas"
                cv.className = this.id + "Canvas"
                cv.width = this.canvasWidth
                cv.height = this.canvasHeight
                cv.style.top = "4px"
                cv.style.left = this.canvasOffset + "px"
                cv.style.position = "absolute"
                cv.style.margin = "0px"
                cv.style.padding = "0px"
                cv.style.verticalAlign = "top"
                this.canvas = this.$base ? this.$base.append(cv) : this.$div.append(cv)
            }

            // renders deppending of the mode set
            switch (this.attr.mode) {
                case 'pleth': {
                    this.renderPleth(value)
                    break
                }
                case 'ecg': {
                    this.renderECG(value)
                    break
                }
                case 'etco2mmHG': {
                    const respirationRate = this.getValue(state, this.respirationRate)
                    this.renderEtcO2(value, respirationRate, 'mmHG')
                    break
                }
                case 'etco2kPa': {
                    const respirationRate = this.getValue(state, this.respirationRate)
                    this.renderEtcO2(value, respirationRate, 'kPa')
                    break
                }
                case 'ibp': {
                    const sibp = this.getValue(state, this.sibp)
                    const dibp = this.getValue(state, this.dibp)
                    this.renderIBP(value, sibp, dibp)
                    break
                }
                case 'resp': {
                    this.renderResp(value)
                    break
                }
                case "customWave": {
                    // Custom wave mode, draws custom wave coutinously sperated  by an given an interval, the interval is calculated given a frequency received by state
                    // This frequency is how many intervals per minute
                    const finalValue = (value !== null && value !== undefined && !isNaN(parseFloat(value))) ? parseFloat(value) : 0;

                    this.intervalPx = finalValue <= 0 ? -1 : (60 / finalValue) * (this.speed * this.fps)
                    break
                }
                case "draw": {
                    // Draw mode, y axis of canvas depends on state value
                    const finalValue = (value !== null && value !== undefined && !isNaN(parseFloat(value))) ? parseFloat(value) : 0;

                    const newValue = 100 / (this.range.max - this.range.min) * (finalValue - this.range.min)
                    this.py = this.canvasHeight - (newValue / 100) * this.canvasHeight + this.randomIntFromInterval(-1, 1)

                    this.intervalPx = 0
                    break
                }
            }

            // Render screens
            this.renderScreens()

            // Animate function call
            this.animate()

        }

    }

    /**
     * @function <a name="hide">hide</a>
     * @description Hides the widget.
     */
    hide() {
        super.hide();
        if (this.maxDisplay !== null && this.medDisplay !== null && this.minDisplay !== null) {
            this.maxDisplay.hide()
            this.medDisplay.hide()
            this.minDisplay.hide()
        }
        if (this.loop) {
            clearInterval(this.loop);
            this.loop = null;
        }
    }

    /**
     * @function <a name="remove">remove</a>
     * @description Removes the div elements of the widget from the html page -- useful to programmaticaly remove widgets from a page.
     */
    remove(): void {

        if (this.loop) {
            clearInterval(this.loop);
            this.loop = null;
        }

        super.remove();
    }

    /**
    * Pause trace
    */
    pauseTrace() {
        if (this.loop) {
            clearInterval(this.loop);
            this.loop = null;
        }
    }

    /**
     * Internal function, updates the display style
     * @param opt 
     */
    protected updateDisplayStyle(opt?: CSS): void {
        opt = opt || {};
        // set style
        this.applyCSS({ ...this.css, ...opt });
        // set line height so text is properly centered
        const lineHeight: number = parseFloat(this.css["line-height"] ?? '') || this.height;
        this.$base.css("line-height", `${lineHeight}px`);
    }

}