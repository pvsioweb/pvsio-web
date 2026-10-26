/**
 * @module FormEVO
 * @version 1.0
 * @description Renders a form widget with a multiple inputs and a submit button.
 *              This module provide APIs for setting up the visual appearance of the widget, e.g., font size and color.
 * @author João Linhares
 * @date August 15, 2026
 *
 */

import { Connection, PVSioWebCallBack, SendCommandToken } from '../../../../common/interfaces/Connection';
import { CSS, Coords, Renderable, WidgetOptions } from "../../../../common/interfaces/Widgets";
import { uuid } from '../../../../common/utils/uuidUtils';
import { ButtonEVO, ButtonOptions } from "./ButtonEVO";
import { MatchState, WidgetAttr, WidgetEVO, WidgetEvent, WidgetEventData, rat2real, ratNumberMatch } from "./WidgetEVO";

// Input Template
export const widget_template_input_bar: string = `
{{#if template_description}}<!--
    Basic widget template. Provides a base layer for rendering the visual appearance of the widget
    The widget has the following layers:
      - an outer div layer defining position and size of the widget
      - an inner base layer renders the visual appearance
      - an inner img layer renders images
      - an inner transparent overlay layer captures user interactions with the widget -->{{/if}}
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:1; overflow:hidden; {{#each cssDiv}} {{@key}}:{{this}};{{/each}}"
    class=" noselect ">
    {{#if label}}<label for="{{name}}" style="{{#each cssLabel}} {{@key}}:{{this}};{{/each}}">{{label}}</label>{{/if}}
    {{#if words}}<input style="{{#each cssInput}} {{@key}}:{{this}};{{/each}}" type="{{type}}" id="{{inputId}}" name="{{name}}" placeholder="{{placeholder}}" {{#if size}} size="{{size}}"{{/if}} {{#if value}} value="{{value}}"{{/if}}>{{/if}}
    {{#if numbers}}<input style="{{#each cssInput}} {{@key}}:{{this}};{{/each}}" type="{{type}}" id="{{inputId}}" name="{{name}}" placeholder="{{placeholder}}" {{#if step}} step="{{step}}"{{/if}} {{#if max}} max="{{max}}"{{/if}} {{#if min}} min="{{min}}"{{/if}} {{#if value}} value="{{value}}"{{/if}}>{{/if}}
    {{#if colors}}<input style="{{#each cssInput}} {{@key}}:{{this}};{{/each}}" type="{{type}}" id="{{inputId}}" name="{{name}}" placeholder="{{placeholder}}" {{#if value}} value="{{value}}"{{/if}}>{{/if}}
</div>`;

// Select Template
export const widget_template_select_input_bar: string = `
{{#if template_description}}<!--
    Basic widget template. Provides a base layer for rendering the visual appearance of the widget
    The widget has the following layers:
      - an outer div layer defining position and size of the widget
      - an inner base layer renders the visual appearance
      - an inner img layer renders images
      - an inner transparent overlay layer captures user interactions with the widget -->{{/if}}
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:1; overflow:hidden; {{#each cssDiv}} {{@key}}:{{this}};{{/each}}"
    class=" noselect ">
    {{#if label}}<label for="{{name}}" style="{{#each cssLabel}} {{@key}}:{{this}};{{/each}}">{{label}}</label>{{/if}}
    <select id="{{inputId}}" name="{{name}}" style="{{#each cssInput}} {{@key}}:{{this}};{{/each}}">
    {{#each option}}
    <option value="{{this.value}}">{{this.name}}</option>
    {{/each}}
    </select>
</div>`;

// Textarea Template

export const widget_template_textarea: string = `
{{#if template_description}}<!--
    Basic widget template. Provides a base layer for rendering the visual appearance of the widget
    The widget has the following layers:
      - an outer div layer defining position and size of the widget
      - an inner base layer renders the visual appearance
      - an inner img layer renders images
      - an inner transparent overlay layer captures user interactions with the widget -->{{/if}}
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:1; overflow:hidden; {{#each cssDiv}} {{@key}}:{{this}};{{/each}}"
    class=" noselect ">
    {{#if label}}<label for="{{name}}" style="{{#each cssLabel}} {{@key}}:{{this}};{{/each}}">{{label}}</label>{{/if}}
    <textarea id="{{inputId}}" rows="{{rows}}" cols="{{cols}}" name="{{name}}" style="{{#each cssInput}} {{@key}}:{{this}};{{/each}}" placeholder="{{placeholder}}">
    {{#if value}}{{value}}{{/if}}
    </textarea>
</div>`;
// Radio Tempalte
export const widget_template_radio_input_bar: string = `
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:1; overflow:hidden; {{#each cssDiv}} {{@key}}:{{this}};{{/each}}"
    class=" noselect ">
    {{#if label}}<label for="{{inputId}}" style="{{#each cssLabel}} {{@key}}:{{this}};{{/each}}">{{label}}</label>{{/if}}
    <input type="radio" id="{{inputId}}" name="{{name}}" value="{{value}}" style="{{#each cssInput}} {{@key}}:{{this}};{{/each}}"/>
</div>`;

// CheckBox Tempalte
export const widget_template_checkbox_input_bar: string = `
{{#if template_description}}<!--
    Basic widget template. Provides a base layer for rendering the visual appearance of the widget
    The widget has the following layers:
      - an outer div layer defining position and size of the widget
      - an inner base layer renders the visual appearance
      - an inner img layer renders images
      - an inner transparent overlay layer captures user interactions with the widget -->{{/if}}
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:1; overflow:hidden; {{#each cssDiv}} {{@key}}:{{this}};{{/each}}"
    class=" noselect ">
    {{#if label}}<label for="{{name}}" style="{{#each cssLabel}} {{@key}}:{{this}};{{/each}}">{{label}}</label>{{/if}}
    <input type="checkbox" id="{{inputId}}" name="{{name}}" style="{{#each cssInput}} {{@key}}:{{this}};{{/each}}" {{#if check}}checked{{/if}}/>
</div>`;

export interface FormOptions extends WidgetOptions {
    formName?: string, // input widget name
    spacing?: number, // spacing between inputs
    globalInputCss?: CSS, // input CSS
    globalLabelCss?: CSS, // label css
    globalInputSize?: Size, // input size
    inputLabelDivCss?: CSS, // input and label div css
    button?: SubmitButton, // submit button
    orientation?: 'vertical' | 'horizontal',
    inputs: Input[], // list of inputs,
    triggerOnChange?: boolean // When input value changes, triggers a function call to pvsio and a callback function
};

export interface FormAttr extends WidgetAttr {
    formName: string,
    orientation: 'vertical' | 'horizontal'
};

export interface SubmitButton extends Omit<ButtonOptions, 'parent' | 'viz' | 'type' | 'widget_template' | 'renderMode' | 'connection' | 'css' | 'buttonName'> {
    buttonCSS?: CSS,
    buttonID?: string,
    size?: Size,
    position?: Position
}
export interface Input {
    label?: string, // label for input
    labelCss?: CSS,
    position?: Position,
    inputSize?: Size // Object to set input size
    inputCss?: CSS, // input Props
    inputID: string, // input ID
    placeholder?: string, // placeholder string
    inList?: string[], // in list input validator
    regex?: RegExp, // regex validator
    required?: boolean, // required
    type?: "text" | "password" | "select" | "color" | "date" | "datetime-local" | "email" | "month" | "number" | "range" | "search" | "tel" | "time" | "url" | "week" | 'checkbox' | 'radio' | 'textarea', // deafault text
    options?: {
        value: string,
        name: string
    }[],
    min?: Object,
    max?: Object,
    step?: number,
    size?: number,
    cols?: number,
    rows?: number,
    callback?: PVSioWebCallBack,
    customFunction?: {
        functionName: string,
        args?: string[]
    },
    sendAsString?: boolean
}

// Auxiliar input group array

const input_words = ["text", "password", "email", "search", "tel", "url"]

const input_numbers = ["date", "datetime-local", "month", "number", "range", "time", "week"]

export interface Size {
    height: number,
    width: number
}

export interface Position {
    top?: number,
    left?: number
}

export class FormEVO extends WidgetEVO {
    /**
     * Form attributes
     */
    protected attr!: FormAttr;

    protected globalInputCss: CSS;
    protected globalLabelCss: CSS;

    protected inputLabelDivCss: CSS;

    protected globalInputSize: Size;

    protected spacing: number;

    // Button Properties
    protected button!: SubmitButton

    protected buildButton: boolean;

    // Inputs
    protected inputs: Input[] // list of inputs

    protected submitButton: WidgetEVO | null;

    protected currentInputs: Input[]

    protected triggerOnChange: boolean

    protected connection: Connection | undefined;

    protected callback: PVSioWebCallBack;

    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = "FormEVO";
    getConstructorName(): string {
        return FormEVO.constructorName;
    }
    getDescription(): string {
        return "Suitable for rendering a form widget with multiple inputs with a submit button.";
    }
    renderSample(): void {
        const st: Record<string, string> = {};
        st[this.attr.formName] = "ABC12";
        this.render(JSON.stringify(st));
    }

    /**
     * Constructor
     */
    constructor(id: string, coords: Coords, opt: FormOptions) {
        super(id, coords, opt);
        this.kind = "Form";
        opt.css = opt.css || {};
        this.css = { ...opt.css };
        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css["background"] = opt.css.background || opt.css["background-color"] || "black";
        this.css.color = opt.css.color || "white";
        this.css.cursor = opt.css.cursor || "default";
        this.css.overflow = opt.css.overflow || "hidden";

        // set attributes
        this.attr.formName = opt.formName || id;

        this.attr.orientation = opt?.orientation || 'vertical'


        this.buildButton = opt?.button ? true : false
        if (this.buildButton) {
            this.button = opt.button || {}
            this.button.buttonCSS = this.button.buttonCSS || {};
            const buttonSizeWidthOpt = Number(this.button.size?.width);
            const buttonSizeHeightOpt = Number(this.button.size?.height);
            this.button.size = {
                width: (isNaN(buttonSizeWidthOpt) || buttonSizeWidthOpt <= 0) ? 120 : buttonSizeWidthOpt,
                height: (isNaN(buttonSizeHeightOpt) || buttonSizeHeightOpt <= 0) ? 50 : buttonSizeHeightOpt
            };
        }

        // Spacing between inputs

        const spacingOpt = Number(opt.spacing);
        this.spacing = isNaN(spacingOpt) ? 20 : spacingOpt;

        // Label Input pair div css

        this.inputLabelDivCss = opt?.inputLabelDivCss || {};

        // Check if there is at least an input

        if (opt.inputs.length == 0) console.warn("[form-widget] Warning: " + this.id + " does not have any inputs :/");


        // Check if all input ids are different
        const inputIDS = opt.inputs.map(input => { return input.inputID });
        const uniqueInputs = inputIDS.filter((v, i, a) => a.indexOf(v) === i);

        if (uniqueInputs.length !== opt.inputs.length) console.warn("[form-widget] Warning: " + this.id + " contains inputs with the same input id :/");

        // Store inputs

        this.inputs = []
        this.currentInputs = []
        this.globalLabelCss = opt.globalLabelCss || {};
        this.globalInputCss = opt.globalInputCss || {};

        const globalInputSizeWidthOpt = Number(opt?.globalInputSize?.width);
        const globalInputSizeHeightOpt = Number(opt?.globalInputSize?.height);
        this.globalInputSize = {
            width: (isNaN(globalInputSizeWidthOpt) || globalInputSizeWidthOpt <= 0) ? 200 : globalInputSizeWidthOpt,
            height: (isNaN(globalInputSizeHeightOpt) || globalInputSizeHeightOpt <= 0) ? 200 : globalInputSizeHeightOpt
        };

        opt.inputs.forEach(input => {
            // create style options for input
            input.inputCss = input.inputCss || {}
            input.labelCss = input.labelCss || {}

            // Input Size

            const inputSizeWidthOpt = Number(input.inputSize?.width);
            const inputSizeHeightOpt = Number(input.inputSize?.height);
            input.inputSize = {
                width: (isNaN(inputSizeWidthOpt) || inputSizeWidthOpt <= 0) ? this.globalInputSize.width : inputSizeWidthOpt,
                height: (isNaN(inputSizeHeightOpt) || inputSizeHeightOpt <= 0) ? this.globalInputSize.height : inputSizeHeightOpt
            };

            // Validators

            input.inList = input.inList || [];

            input.regex = input.regex || /[\s\S]*/;

            input.type = input.type || 'text';

            if (input.type === 'select') {
                input.options = input?.options || [];
                if (input.options.length === 0) {
                    console.warn("[form-widget] Warning: " + this.id + ": input " + input.inputID + " needs a list of options :/");
                }
            }

            if (input.type === 'radio') {
                input.options = input?.options || [];
                if (input.options.length === 0) {
                    console.warn("[form-widget] Warning: " + this.id + ": input " + input.inputID + " needs a list of options :/");
                }
            }

            if (input.type === 'textarea') {
                const colsOpt = Number(input?.cols);
                input.cols = (isNaN(colsOpt) || colsOpt < 1) ? 50 : Math.floor(colsOpt);
                const rowsOpt = Number(input?.rows);
                input.rows = (isNaN(rowsOpt) || rowsOpt < 1) ? 5 : Math.floor(rowsOpt);
            }

            input.label = input.label || "";
            input.required = input.required ?? true


            this.inputs.push(input)
            this.currentInputs.push(input)
        })

        this.triggerOnChange = opt.triggerOnChange ?? true

        // Connection and callback

        this.submitButton = null
        this.connection = opt.connection;

        this.callback = opt.callback || ((err, res) => { console.warn("[form-widget] Warning: " + this.id + " does not have a callback :/"); });
    }

    /**
    * Internal function, clears inputs
    */
    public clearInputs() {

        for (let i = 0; i < this.currentInputs.length; i++) {
            const input = this.currentInputs[i]

            if (input.type === 'radio') {
                input.options?.forEach((r, i) => {
                    const choice = <HTMLInputElement>document.getElementById(this.id + "Div" + input.inputID + 'Id' + 'Choice' + i)
                    if (choice !== null) {
                        choice.checked = false
                    }
                })
                continue
            }

            const inp = (<HTMLInputElement>document.getElementById(this.id + "Div" + input.inputID + 'Id'));

            if (inp != null) {
                inp.value = ''
                if (input.type === 'checkbox') {
                    inp.checked = false
                } else {
                    inp.value = ''
                }
            }

        }
    }

    /**
    * Internal function, gets all values from inputs and validates them. returns an object with wach inputId and its value
    */
    public getValueWithValidation(): { values: Record<string, unknown>, errors: Record<string, string> } {
        const res: Record<string, unknown> = {}

        const errors: Record<string, string> = {}

        for (let i = 0; i < this.currentInputs.length; i++) {
            const input = this.currentInputs[i]

            if (input.type === 'checkbox') {
                res[input.inputID] = (<HTMLInputElement>document.getElementById(this.id + "Div" + input.inputID + 'Id')).checked
                continue
            }

            if (input.type === 'radio') {

                let radioInputs = ''
                input.options?.forEach((r, i) => {
                    radioInputs += r.name + (i < (input.options!.length - 1) ? ',' : '')
                    if ((<HTMLInputElement>document.getElementById(this.id + "Div" + input.inputID + 'Id' + 'Choice' + i)).checked) {
                        res[input.inputID] = r.value
                    }
                })

                if (input.required && !res[input.inputID]) {
                    errors[input.inputID] = "A radio box needs to be selected please pick one of these radio inputs: " + radioInputs + "."
                }
                continue
            }

            const value = (<HTMLInputElement>document.getElementById(this.id + "Div" + input.inputID + 'Id')).value;

            if (input.required) {
                if (value === null || value === "") {
                    errors[input.inputID] = "Input \"" + input.label + "\" a value is required."
                    continue
                }
            }

            if (value !== null && value !== "" && input.inList!.length > 0) {
                if (!input.inList?.includes(value)) {
                    errors[input.inputID] = "Input \"" + input.label + "\", the value is invalid."
                    continue
                }
            }

            if (input.regex?.test(value.toString())) { //value != "" && input.regex.test(value.toString())
                res[input.inputID] = value;
            } else {
                errors[input.inputID] = "Input \"" + input.label + "\", the value is invalid."
                continue
            }
        }

        return { values: res, errors };
    }

    /**
    * Internal function, gets value from state given a key
    * @param state State
    * @param buttonKey Button Key
    */
    private getButtonValue(state: Renderable, buttonKey: string): string {
        if (buttonKey === undefined || buttonKey === null) {
            return 'Submit'
        }

        if (state !== undefined && state !== null) {
            if (this.matchStateFlag) {
                // Return match from state
                const name: string = buttonKey
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
                return 'Submit'
            }
        }
        return 'Submit'
    }

    /**
    * Internal function, renders submite button
    * @param state State
    * @param button Button properties
    */
    protected renderButton(state: Renderable, button: SubmitButton) {
        const buttonSizeWidthOpt = Number(button.size?.width);
        const buttonSizeHeightOpt = Number(button.size?.height);
        const buttonWidth = (isNaN(buttonSizeWidthOpt) || buttonSizeWidthOpt <= 0) ? (this.button?.size?.width ?? 120) : buttonSizeWidthOpt;
        const buttonHeight = (isNaN(buttonSizeHeightOpt) || buttonSizeHeightOpt <= 0) ? (this.button?.size?.height ?? 50) : buttonSizeHeightOpt;

        const positionTopOpt = Number(button?.position?.top);
        const positionLeftOpt = Number(button?.position?.left);
        const position = {
            top: isNaN(positionTopOpt) ? (this.height - buttonHeight) : positionTopOpt,
            left: isNaN(positionLeftOpt) ? (this.width - buttonWidth) : positionLeftOpt
        }

        const coordinates = { ...position, width: buttonWidth, height: buttonHeight }

        button.customLabel = button?.customLabel || this.getButtonValue(state, button.buttonID ?? '')

        const buttonCss = { 'box-shadow': '10px 10px 10px rgba(0, 0, 0, 0)', ...button.buttonCSS } // Remove default WidgetEVO box shadow, matching MenuEVO's own button reset

        this.submitButton = new ButtonEVO(button.buttonID ? this.id + button.buttonID : this.id + "SubmitButton", coordinates,
            {
                ...button,
                buttonName: button.buttonID,
                css: buttonCss,
                parent: this.$base ? this.$base : this.id,
                connection: this.connection,
                callback: button.callback ? button.callback : this.callback
            })

        //Render Button
        this.submitButton.render(state, { css: buttonCss })
    }

    /**
    * Internal function, gets value from state given a key
    * @param state State
    * @param key Key
    */
    private getValue(state?: Renderable, key?: string): string | null {
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
                return null
            }
        }
        return null
    }


    /**
    * Internal function, gets value from state given a key for checked inputs, if value is a string reprsenting True or if a number diferent than 0, the checkbox is checked
    * @param state State
    * @param key Key
    */
    private getValueCheckBox(state?: Renderable, key?: string): boolean {
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
                        if (val) {
                            return true
                        }
                    } else {
                        // Checks if true, false or null
                        if (match.val.toLowerCase() === 'true') {
                            return true
                        }
                    }
                }
                // If it doesnt match returns key
                return false
            }
        }
        return false
    }

    /**
     * Renders the widget
     */
    render(state?: Renderable, opt?: FormOptions): void {
        opt = opt || { inputs: this.inputs };
        const inputs = opt.inputs
        inputs.map(input => {
            // create style options for input
            input.inputCss = input.inputCss || {}
            input.labelCss = input.labelCss || {}

            // Input Size

            const inputSizeWidthRenderOpt = Number(input.inputSize?.width);
            const inputSizeHeightRenderOpt = Number(input.inputSize?.height);
            input.inputSize = {
                width: (isNaN(inputSizeWidthRenderOpt) || inputSizeWidthRenderOpt <= 0) ? this.globalInputSize.width : inputSizeWidthRenderOpt,
                height: (isNaN(inputSizeHeightRenderOpt) || inputSizeHeightRenderOpt <= 0) ? this.globalInputSize.height : inputSizeHeightRenderOpt
            };

            // Validators

            input.inList = input.inList || [];

            input.regex = input.regex || /[\s\S]*/;

            input.type = input.type || 'text';

            if (input.type === 'select') {
                input.options = input?.options || [];
                if (input.options.length === 0) {
                    console.warn("[form-widget] Warning: " + this.id + ": input " + input.inputID + " needs a list of options :/");
                }
            }

            if (input.type === 'radio') {
                input.options = input?.options || [];
                if (input.options.length === 0) {
                    console.warn("[form-widget] Warning: " + this.id + ": input " + input.inputID + " needs a list of options :/");
                }
            }

            if (input.type === 'textarea') {
                const colsRenderOpt = Number(input?.cols);
                input.cols = (isNaN(colsRenderOpt) || colsRenderOpt < 1) ? 50 : Math.floor(colsRenderOpt);
                const rowsRenderOpt = Number(input?.rows);
                input.rows = (isNaN(rowsRenderOpt) || rowsRenderOpt < 1) ? 5 : Math.floor(rowsRenderOpt);
            }

            input.label = input.label || "";
            input.required = input?.required !== null && input?.required !== undefined ? input.required : true


            return input

        })
        this.currentInputs = inputs
        const globalInputCss = opt?.globalInputCss || this.globalInputCss
        const globalLabelCss = opt?.globalLabelCss || this.globalLabelCss
        const cssDiv = opt?.inputLabelDivCss || this.inputLabelDivCss

        const orientation = opt?.orientation || this.attr.orientation

        const buildButton = opt?.button ? true : this.buildButton

        let button: SubmitButton | null = null

        if (buildButton) {
            button = opt.button || this.button
            button.buttonCSS = button.buttonCSS || {};
            const buttonSizeWidthRenderOpt = Number(button.size?.width);
            const buttonSizeHeightRenderOpt = Number(button.size?.height);
            button.size = {
                width: (isNaN(buttonSizeWidthRenderOpt) || buttonSizeWidthRenderOpt <= 0) ? (this.button?.size?.width ?? 120) : buttonSizeWidthRenderOpt,
                height: (isNaN(buttonSizeHeightRenderOpt) || buttonSizeHeightRenderOpt <= 0) ? (this.button?.size?.height ?? 50) : buttonSizeHeightRenderOpt
            };
        }

        this.remove()
        this.rendered = false
        // create the html element
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();

        let accum = 0;
        const spacingRenderOpt = Number(opt?.spacing);
        const spacing = isNaN(spacingRenderOpt) ? this.spacing : spacingRenderOpt
        // Render Inputs

        inputs.forEach((input, i) => {
            // Remove if exists
            const inputDiv = document.getElementById(this.id + "Div" + input.inputID)
            if (inputDiv) {
                inputDiv.parentNode?.removeChild(inputDiv);
            }

            // Build input bar div ADD VALUE
            let stringInputBar: string = '';

            const cssInput = { ...globalInputCss, ...input.inputCss ? input.inputCss : {} }

            cssInput['width'] = cssInput['width'] || (input?.label ? '' : '100%')
            cssInput['height'] = cssInput['height'] || (input?.label ? '' : '100%')

            const cssLabel = { ...globalLabelCss, ...input.labelCss ? input.labelCss : {} }

            const id = this.id + "Div" + input.inputID
            const inputId = id + 'Id'
            const name = id + "Name"

            const triggerOnChange = opt?.triggerOnChange ?? this.triggerOnChange

            const positionTopOpt = Number(input?.position?.top);
            const positionLeftOpt = Number(input?.position?.left);
            const top = isNaN(positionTopOpt) ? (orientation === 'vertical' ? accum : 0) : positionTopOpt
            const left = isNaN(positionLeftOpt) ? (orientation === 'vertical' ? 0 : accum) : positionLeftOpt
            const placeholder = input.placeholder ? input.placeholder : "Input value"

            if (input_words.includes(input.type ?? '')) {
                stringInputBar = Handlebars.compile(widget_template_input_bar, { noEscape: true })({
                    id: id,
                    inputId: inputId,
                    name: name,
                    width: input.inputSize!.width,
                    height: input.inputSize!.height,
                    label: input.label,
                    cssLabel: cssLabel,
                    cssInput: cssInput,
                    cssDiv: cssDiv,
                    top: top,
                    left: left,
                    type: input.type,
                    placeholder: placeholder,
                    size: input.size,
                    words: true,
                    value: this.getValue(state, input.inputID)
                });
            }

            if (input_numbers.includes(input.type ?? '')) {
                stringInputBar = Handlebars.compile(widget_template_input_bar, { noEscape: true })({
                    id: id,
                    inputId: inputId,
                    name: name,
                    width: input.inputSize!.width,
                    height: input.inputSize!.height,
                    label: input.label,
                    placeholder: placeholder,
                    cssLabel: cssLabel,
                    cssInput: cssInput,
                    cssDiv: cssDiv,
                    top: top,
                    left: left,
                    type: input.type,
                    step: input.step,
                    min: input.min,
                    max: input.max,
                    numbers: true,
                    value: this.getValue(state, input.inputID)
                });
            }

            if (input.type === 'color') {
                stringInputBar = Handlebars.compile(widget_template_input_bar, { noEscape: true })({
                    id: id,
                    inputId: inputId,
                    name: name,
                    width: input.inputSize!.width,
                    height: input.inputSize!.height,
                    cssDiv: cssDiv,
                    placeholder: placeholder,
                    label: input.label,
                    cssLabel: cssLabel,
                    cssInput: cssInput,
                    top: top,
                    left: left,
                    type: input.type,
                    colors: true,
                    value: this.getValue(state, input.inputID)
                });
            }

            if (input.type === 'select') {
                stringInputBar = Handlebars.compile(widget_template_select_input_bar, { noEscape: true })({
                    id: id,
                    inputId: inputId,
                    name: name,
                    width: input.inputSize!.width,
                    height: input.inputSize!.height,
                    label: input.label,
                    cssLabel: cssLabel,
                    cssInput: cssInput,
                    cssDiv: cssDiv,
                    top: top,
                    left: left,
                    type: input.type,
                    step: input.step,
                    min: input.min,
                    max: input.max,
                    numbers: true,
                    option: input.options
                });
            }

            if (input.type === 'textarea') {
                stringInputBar = Handlebars.compile(widget_template_textarea, { noEscape: true })({
                    id: id,
                    inputId: inputId,
                    name: name,
                    width: input.inputSize!.width,
                    height: input.inputSize!.height,
                    cssDiv: cssDiv,
                    placeholder: placeholder,
                    label: input.label,
                    cssLabel: cssLabel,
                    cssInput: cssInput,
                    top: top,
                    left: left,
                    rows: input.rows,
                    cols: input.cols,
                    value: this.getValue(state, input.inputID)
                });
            }

            if (input.type === 'checkbox') {
                stringInputBar = Handlebars.compile(widget_template_checkbox_input_bar, { noEscape: true })({
                    id: id,
                    inputId: inputId,
                    name: name,
                    width: input.inputSize!.width,
                    height: input.inputSize!.height,
                    cssDiv: cssDiv,
                    placeholder: placeholder,
                    label: input.label,
                    cssLabel: cssLabel,
                    cssInput: cssInput,
                    top: top,
                    left: left,
                    check: this.getValueCheckBox(state, input.inputID)
                });
            }

            if (input.type === 'radio') {

                stringInputBar = ''

                let topRadioAccum = top
                let leftRadioAccum = left

                let i = 0
                input.options!.forEach(r => {

                    stringInputBar += Handlebars.compile(widget_template_radio_input_bar, { noEscape: true })({
                        id: id + 'Choice' + i,
                        width: input.inputSize!.width,
                        height: input.inputSize!.height,
                        top: topRadioAccum,
                        left: leftRadioAccum,
                        cssDiv: cssDiv,
                        inputId: inputId + 'Choice' + i,
                        name: input.inputID,
                        cssLabel: cssLabel,
                        label: r.name,
                        value: r.value,
                        cssInput: cssInput,
                    });

                    topRadioAccum += orientation === 'vertical' ? spacing + input.inputSize!.height : 0
                    leftRadioAccum += orientation === 'vertical' ? 0 : spacing + input.inputSize!.width
                    i++
                })

                accum += orientation === 'vertical' ? i * (spacing + input.inputSize!.height) : i * (spacing + input.inputSize!.width)
            }

            if (!input?.position && input.type !== 'radio') {
                accum += spacing + (orientation === 'vertical' ? input.inputSize!.height : input.inputSize!.width)
            }

            // get current widget menu div
            const $currentDiv = this.$base ? this.$base : this.sel2jquery(this.id);
            // append div
            $currentDiv.append(stringInputBar);

            const $divInput = <HTMLInputElement>document.getElementById(inputId)

            if (input.type === 'select') {

                $divInput.value = this.getValue(state, input.inputID) ?? ''
            }

            if (input.type === 'radio') {

                const valueSelected = this.getValue(state, input.inputID)
                const index = input.options!.findIndex(o => o.value === valueSelected)
                if (index !== -1) {
                    const $radioInput = <HTMLInputElement>document.getElementById(inputId + 'Choice' + index)
                    if ($radioInput) {
                        $radioInput.checked = true
                    }
                }
            }

            if (triggerOnChange) {

                const onChangeFunc = () => {

                    const $div = <HTMLInputElement>document.getElementById(inputId)

                    let func = ''

                    const numbArgs = input?.customFunction?.args?.length || 0

                    const funcName = input?.customFunction?.functionName || 'onchange_' + input.inputID


                    let value
                    const sendAsString = input.sendAsString ?? false

                    switch (input.type) {
                        case 'checkbox': {
                            value = (sendAsString ? '\"' : '') + $div.checked.toString().toLocaleUpperCase() + (sendAsString ? '\"' : '')
                            break
                        }
                        case 'radio': {
                            input.options!.forEach((r, i) => {
                                if ((<HTMLInputElement>document.getElementById(this.id + "Div" + input.inputID + 'Id' + 'Choice' + i)).checked) {
                                    value = (sendAsString ? '\"' : '') + r.value + (sendAsString ? '\"' : '')
                                }
                            })
                            break
                        }
                        default: {
                            value = (sendAsString ? '\"' : '') + $div.value + (sendAsString ? '\"' : '')
                        }
                    }

                    func += funcName + '(' + value + (numbArgs > 0 ? ',' : '')

                    input.customFunction?.args?.forEach((p, i) => {
                        func += p + (i < numbArgs - 1 ? ',' : '')
                    })

                    func += ')'

                    const action: string = func;
                    const callback: PVSioWebCallBack = input.callback || this.callback;

                    const req: SendCommandToken = {
                        id: uuid(),
                        type: 'sendCommand',
                        command: action
                    };
                    this.connection?.sendRequest('sendCommand', req);
                    if (callback) {
                        this.connection?.onRequest('sendCommand', (err, res) => {
                            callback(err, res);
                        });
                    }

                    const data: WidgetEventData = { evt: WidgetEvent.release, fun: action };
                    this.trigger(WidgetEvent.release, data);
                }

                if (input.type !== 'radio') {
                    $divInput.onchange = onChangeFunc
                } else {
                    input.options!.forEach((r, i) => {
                        const $radioDiv = (<HTMLInputElement>document.getElementById(this.id + "Div" + input.inputID + 'Id' + 'Choice' + i))

                        $radioDiv.onchange = onChangeFunc
                    })
                }
            }

            if (this.submitButton != null) this.submitButton.remove(); // Clear submit button

            if (buildButton) {
                this.renderButton(state ?? '', button!)
            }

        })
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
        this.$base.css("line-height", `${lineHeight} px`);
    }

}