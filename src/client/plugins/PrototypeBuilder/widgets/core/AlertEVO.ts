/**
 * @module AlertEVO
 * @version 1.0
 * @description Renders an alert widget with an optional close button.
 *              This module provides APIs for setting up the visual appearance of the widget.
 * @author João Linhares
 * @date August 15, 2026
 *
 */

import { Connection, PVSioWebCallBack, SendCommandToken } from '../../../../common/interfaces/Connection';
import { CSS, Coords, Renderable, WidgetOptions } from '../../../../common/interfaces/Widgets';
import { uuid } from '../../../../common/utils/uuidUtils';
import { MatchState, WidgetAttr, WidgetEVO, WidgetEvent, WidgetEventData, rat2real, ratNumberMatch } from './WidgetEVO';
import Handlebars = require("handlebars");

/**
* Widget Template
*/
export const widget_template_alert: string = `
     <div id="{{id}}" class="alert {{alertType}} {{#if closeButton}}alert-dismissible fade show{{/if}} noselect" role="alert" style=" width:100%; height:100%; user-select:none; position:absolute; overflow:hidden; {{#each css}} {{@key}}:{{this}};{{/each}}">
        <div id="{{idBlink}}">
        {{#if element}}{{element}}
        {{else}}
        {{#if header}}<h4 class="alert-heading">{{header}}</h4>{{/if}}
        <p>{{bodyText}}</p>
        {{/if}}
        </div>
        {{#if closeButton}}<button type="button" class="close alert-close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>{{/if}}
      {{#if audio}}
      <audio id="{{audioID}}" {{#if loop}}loop{{/if}}>
            <source src="{{audioSrc}}" type="{{audioType}}">
            Your browser does not support the audio element.
        </audio>
      {{/if}}
    </div>`;

export interface AlertOptions extends WidgetOptions {
    alertName?: string, // alert widget name, necessary for getName
    header?: string, // header for alert
    bodyText?: string, // message for alert body
    closeButton?: boolean, // if closeButton exists
    customFunction?: string, // customFunction name for PVS mode
    type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark',
    timer?: number, // in ms, timer to close alert
    audioSrc?: string,
    audioType?: 'audio/mpeg' | 'audio/wav' | 'audio/ogg',
    audioTime?: number, // in ms, time that audio plays
    alertElement?: string, // custom element for card body, replaces header and message
    blink?: number // in ms
};

export interface AlertAttr extends WidgetAttr {
    alertName: string,
    bodyText: string,
    header: string,
    alertElement: string,
    alertType: string,
    audioType: string,
    audioSrc: string,
    customFunction: string
};

/**
* Enum for AlertType
*/
export enum AlertType {
    'primary' = 'alert-primary',
    'secondary' = 'alert-secondary',
    'success' = 'alert-success',
    'danger' = 'alert-danger',
    'warning' = 'alert-warning',
    'info' = 'alert-info',
    'light' = 'alert-light',
    'dark' = 'alert-dark'
}

/**
* Enum for AudioType
*/
export enum AudioType {
    'mp3' = 'audio/mpeg',
    'wav' = 'audio/wav',
    'ogg' = 'audio/ogg',
    'MP3' = 'audio/mpeg',
    'WAV' = 'audio/wav',
    'OGG' = 'audio/ogg'
}

export class AlertEVO extends WidgetEVO {
    /**
     * Alert attributes
     */
    protected attr!: AlertAttr;

    protected closeButton: boolean;

    protected timer: number;

    protected alertBlinkRate: number | null;

    protected audioTime: number;

    protected connection: Connection | undefined;

    protected closeTimeoutId: NodeJS.Timeout | null;

    protected audioTimeoutId: NodeJS.Timeout | null;

    protected callback: PVSioWebCallBack;

    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = 'AlertEVO';
    getConstructorName(): string {
        return AlertEVO.constructorName;
    }
    getDescription(): string {
        return 'Suitable for rendering an alert widget with a close button and/or a blinking animation. Can be given a header and a body text message through the widget constructor options or rendered with the visual appearance of a Bootstrap alert.\nAn optional close button can be set and there is also an option to close the widget automatically after a set time.\nAn audio can be played in loop for a determined duration of time. (Supports wav, ogg and mp3).\nThe widget can be fully customizable by providing a string in the alertElement option that corresponds to the desired HTML representing the alert content.';
    }
    renderSample(): void {
        this.render('', { header: 'Header Sample', bodyText: 'Body Sample', type: 'info' });
    }

    /**
    * Internal function, gets audio type given its source
    * @param src String containing the source of the audio
    * @returns audio type
    */
    private getAudioType(src: string): string {

        if (!src) return 'audio/mpeg'

        const split = src.split('.')

        return AudioType[split[split.length - 1] as keyof typeof AudioType] || 'audio/mpeg'
    }

    /**
    * Internal function, clear timeouts and pauses audio
    */
    private clearTimeouts(): void {
        if (this.closeTimeoutId != null) {
            clearTimeout(this.closeTimeoutId)
            this.closeTimeoutId = null
        }

        if (this.audioTimeoutId != null) {
            clearTimeout(this.audioTimeoutId)
            this.audioTimeoutId = null
        }

        // pause audio if exists
        try {
            $('#' + this.id + 'Audio').trigger('pause')
        } catch (err) {
            console.warn(err)
        }

    }

    /**
     * Constructor
     */
    constructor(id: string, coords: Coords, opt?: AlertOptions) {
        opt = opt || {};
        opt.renderMode = opt.renderMode ?? "string";
        super(id, coords, opt);
        this.kind = 'Alert';
        this.alertBlinkRate = null;
        this.closeTimeoutId = null;
        this.audioTimeoutId = null;

        // CSS
        opt.css = opt.css || {};
        this.css = { ...opt.css };
        this.css.cursor = opt.css.cursor || 'default';
        this.css.overflow = opt.css.overflow || 'hidden';

        // set key attributes
        this.attr.alertName = opt.alertName || id;

        this.attr.header = opt.header || 'Alert'
        this.attr.customFunction = opt.customFunction || ''
        this.attr.bodyText = opt.bodyText || ''

        this.attr.alertElement = opt.alertElement || ''


        // set blink
        this.alertBlinkRate = opt.blink && opt.blink > 0 ? opt.blink : null

        // set timer

        const timerOpt = Number(opt?.timer);
        this.timer = (isNaN(timerOpt) || timerOpt < 0) ? 0 : timerOpt

        // set Audio attributes

        this.attr.audioSrc = opt?.audioSrc || ''
        const audioTimeOpt = Number(opt?.audioTime);
        this.audioTime = (isNaN(audioTimeOpt) || audioTimeOpt < 0) ? 0 : audioTimeOpt

        // set audioTime so that it is not longer than closing timer
        if (this.timer && this.audioTime > 0 && this.audioTime > this.timer) {
            this.audioTime = this.timer
        }

        this.attr.audioType = opt?.audioType || this.getAudioType(this.attr.audioSrc)

        this.closeButton = opt.closeButton || false
        this.attr.alertType = opt.type ? AlertType[opt.type as keyof typeof AlertType] : 'alert-info'


        this.connection = opt.connection;

        this.callback = opt.callback || ((err, res) => { console.warn('[alert-widget] Warning: ' + this.id + ' does not have a callback :/'); });
    }

    /**
     * @function <a name="execClose">execClose</a>
     * @description Closes the alert: sends the close command to PVSio, clears any active timers, and removes the alert div from the DOM.
     * @memberof module:AlertEVO
     * @instance
     */
    public execClose() {
        const action: string = this.attr.customFunction || ('click_' + this.attr.alertName);
        const callback: PVSioWebCallBack = this.callback;

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

        const data: WidgetEventData = { evt: WidgetEvent.click, fun: action };
        this.trigger(WidgetEvent.click, data);

        // Clear timeouts
        this.clearTimeouts()

        // remove alert div
        const alert_div = document.getElementById(this.id + 'Alert')
        if (alert_div) {
            alert_div.parentNode?.removeChild(alert_div);
        }
        this.remove()
    }

    /**
     * Renders the widget
     */
    render(state?: Renderable, opt?: AlertOptions): void {

        opt = opt || {};

        // get all attrs from options or from the initial constructor call of the widget

        const css = { ...this.css, ...opt.css }

        const header = opt.header || this.attr.header
        const bodyText = opt.bodyText || this.attr.bodyText
        const element = opt.alertElement || this.attr.alertElement
        const alertType = opt.type ? AlertType[opt.type as keyof typeof AlertType] : this.attr.alertType

        const alertBlinkRate = opt?.blink && opt.blink > 0 ? opt.blink : this.alertBlinkRate

        const timerRenderOpt = Number(opt?.timer);
        const timer = (isNaN(timerRenderOpt) || timerRenderOpt < 0) ? this.timer : timerRenderOpt

        const audio = opt?.audioSrc || this.attr?.audioSrc ? true : false
        const audioSrc = opt?.audioSrc || this.attr.audioSrc
        const audioType = opt?.audioType || (opt?.audioSrc ? this.getAudioType(opt.audioSrc) : this.attr.audioType)
        const audioTimeRenderOpt = Number(opt?.audioTime);
        const audioTime = (isNaN(audioTimeRenderOpt) || audioTimeRenderOpt < 0) ? this.audioTime : audioTimeRenderOpt

        // create the html element
        this.clearTimeouts()
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();

        let bodyTextValue = ''

        if (bodyText || element) {
            bodyTextValue = bodyText
        } else if (state !== undefined && state !== null) {
            // Get body Text value from state
            if (this.matchStateFlag) {
                const name: string = this.getName();
                const match: MatchState | null = (typeof state === 'string') ?
                    this.matchState(state, name)
                    // @ts-ignore: state is used as object at runtime; Renderable type is incomplete
                    : { name, val: state[name] };
                // Get bodyTextValue by matching with state
                if (match) {
                    // check if this is a rational number -- don't use directly rat2real 
                    // because the state may be a string that resembles a number, e.g., '2.', 
                    // and rat2real would translate it into number 2 (i.e., the '.' gets removed, 
                    // which is not what we want for non-numeric displays)
                    const matchRat: RegExpMatchArray | null = new RegExp(ratNumberMatch).exec(match.val);
                    if (matchRat) {
                        const val: number = rat2real(match.val);
                        const disp: string = isNaN(val) ? `${match.val}` : `${val}`;
                        bodyTextValue = disp
                    } else {
                        bodyTextValue = match.val;
                    }
                }
            } else {
                // bodyTextValue gets value from state
                bodyTextValue = state.toString()
            }
        }

        // Remove if exists
        const alertDiv = document.getElementById(this.id + 'Alert')
        if (alertDiv) {
            alertDiv.parentNode?.removeChild(alertDiv);
        }

        //  Compile widget template
        const stringAlert = Handlebars.compile(widget_template_alert, { noEscape: true })({
            id: this.id + 'Alert',
            idBlink: this.id + 'Blink',
            css: css,
            alertType: alertType,
            closeButton: this.closeButton,
            header: header,
            bodyText: bodyTextValue,
            audio: audio,
            audioSrc: audioSrc,
            audioType: audioType,
            audioID: this.id + 'Audio',
            loop: audio,
            element: element
        });

        // get current widget div
        const $currentDiv = this.sel2jquery(this.id);
        // append div
        $currentDiv.append(stringAlert);


        $('#' + this.id + 'Alert').on('click', '.alert-close', () => {
            this.execClose()
        })

        if (alertBlinkRate) {
            const blinkDiv = document.getElementById(this.id + 'Blink')
            blinkDiv?.animate([
                { opacity: 0 }
            ], {
                duration: alertBlinkRate,
                iterations: Infinity,
            })

        }

        this.closeTimeoutId = null

        if (timer) {
            this.closeTimeoutId = setTimeout(() => {
                this.execClose()
            }, timer)
        }

        this.audioTimeoutId = null

        if (audio) {
            $('#' + this.id + 'Audio').trigger('load')
            $('#' + this.id + 'Audio').trigger('play')
            if (audioTime > 0) {
                this.audioTimeoutId = setTimeout(() => {
                    $('#' + this.id + 'Audio').trigger('pause')
                }, audioTime)
            }
        }

    }

    /**
     * @function <a name="remove">remove</a>
     * @description Removes the div elements of the widget from the html page -- useful to programmaticaly remove widgets from a page.
     */
    remove(): void {

        this.clearTimeouts()

        super.remove();
    }

    /**
     * @function <a name="hide">hide</a>
     * @description Hides the widget.
     */
    hide(): void {

        this.clearTimeouts()

        super.hide();
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
        const lineHeight: number = parseFloat(this.css['line-height'] ?? '') || this.height;
        this.$base.css('line-height', `${lineHeight}px`);
    }

}