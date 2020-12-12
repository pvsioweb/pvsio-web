/**
 * Player APIs for automated playback of recorded user actions
 * Uses Google Chrome Speech Synthesis APIs for voice feedback -- see https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
 * Available voices:
 *  - de-DE (German)
 *  - en-US (US English)
 *  - en-GP (UK English Female/Male)
 *  - es-ES (Español)
 *  - es-US (Español de Estados Unidos)
 *  - fr-FR (Français)
 *  - hi-IN (हिन्दी)
 *  - id-ID (Bahasa Indonesia)
 *  - it-IT (Italiano)
 *  - ja-JP (日本語)
 *  - ko-KR (한국의)
 *  - nl-NL (Nederlands)
 *  - pl-PL (Polski)
 *  - pt-BR (Português do Brasil)
 *  - ru-RU (русский)
 *  - zh-CN (普通话（中国大陆))
 *  - zh-HK (粤語（香港))
 *  - zh-TW (國語（臺灣))
 *
 * @author Paolo Masci
 * @date Nov 5, 2017
 */

export type Lang = "en-US" | "en-GB" | "it-IT";
const SELECT_TIMEOUT = 800; //msec

function console_log(msg) {
    console.log(msg);
}

import { Coords, WidgetEVO } from "../../plugins/PrototypeBuilder/widgets/core/WidgetEVO";
import { ButtonEVO } from "../../plugins/PrototypeBuilder/widgets/core/ButtonEVO";
import { MouseCursor } from "../../plugins/PrototypeBuilder/widgets/media/MouseCursor";
import { Stylus } from "../../plugins/PrototypeBuilder/widgets/media/Stylus";

export type Action = {
    timeStamp: number,
    duration?: number,
    timeout?: number,
    reveal?: string | WidgetEVO,
    hide?: string | WidgetEVO,
    move?: string | WidgetEVO,
    click?: string | WidgetEVO,
    select?: string | WidgetEVO,
    deselect?: string | WidgetEVO,
    cursor?: {
        longpress?
        speed?: number,
        type?: MouseCursor,
        offset?: {
            top?: number,
            left?: number
        }
    },
    speak?: string,
    input?: string,
    value?: string,
    lineFeed?: boolean,
    scroll?: string | {
        id: string,
        offset?: number
    },
    blink?: string,
    offset?: number | {
        top?: number,
        left?: number
    },
    trans?: string,
    transform?: string,
    zIndex?: number,
    borderColor?: string,
    classed?: string,
    opacity?: number,
    top?: number,
    left?: number
};
export type Playlist = {
    seq: Action[],
    curr: number
}
export type LogElem = {
    time: Date, state: string
};

export type Log = LogElem[];


export class Player {
    protected playlist: Playlist = {
        seq: [],
        curr: 0
    };
    protected now: number = 0;
    protected timer: NodeJS.Timer = null;
    protected lang: Lang;
    protected pitch: number;
    protected rate: number;
    protected voice: SpeechSynthesisVoice;
    protected gender: "male" | "female";
    protected _log: Log;

    protected prevAttr: { [widgetId: string]: { [attr: string]: string } } = {};

    /**
     * @constructor
     */
    constructor (opt?: { lang?: Lang, pitch?: number, rate?: number, gender?: "male" | "female" }) {
        opt = opt || {};
        this.lang = opt.lang || "en-GB";
        this.pitch = opt.pitch || 1.04;
        this.rate = opt.rate || 1.03;
        this.gender = opt.gender || "female";
        const voices: SpeechSynthesisVoice[] =  window.speechSynthesis.getVoices().filter(voice => {
            return voice.lang === this.lang && (this.gender === "female" && (voice.name.endsWith("a") || voice.name.endsWith("e")));
        });
        this.voice = (voices && voices.length) ? voices[0] : null;
        // log-related attributes
        this._log = [];
        return this;
    }

    /**
     * @function load Loads the list of actions that needs to be played
     * @param actionList {Object} JSON object containing the list of actions to be executed
     *          The object is an array of actions. Each action contains (at least) the following attributes:
     *              - click: the input widget that needs to be clicked
     *              - timestamp: indicates when the action needs to be executed. The value of time is expressed as an absolute value wrt the beginning of time (which is 0)
     */
    load (actionList: Action[]): Player {
        this.playlist = {
            seq: actionList,
            curr: 0
        };
        return this;
    };

    log (state: string): Player {
        this._log.push({
            time: new Date(),
            state: state
        });
        return this;
    };

    getLog (): Log {
        return this._log;
    };

    //---  utility functions  ----
    viz(id: string, opt?: { duration?: number, fade?: boolean }) {
        // console_log("revealing " + id);
        opt = opt || {};
        opt.duration = opt.duration || 300;
        if ($(id)[0]) {
            if (opt.fade && $(id).css("display") !== "block") {
                $(id).css("opacity", 0).css("display", "block").animate({ "opacity": 1 }, opt.duration);
            } else {
                $(id).css({ "opacity": 1, "display": "block" });
            }
        }
    }
    hide(id: string) {
        // console_log("hiding " + id);
        $(id).css("display", "none");
    }

    /**
     * @function play Plays the action file opened in the player
     */
    play (opt?: { from?: number, borderColor?: string, transitionTimingFunction?: "ease-out" | "ease-in" }) {
        opt = opt || {};
        const select_widget = (action: Action, widget: WidgetEVO | string) => {
            if (action.deselect) {
                if (typeof widget === "string") {
                    $(widget).css(this.prevAttr[widget]);
                } else {
                    widget.deselect();
                }
            } else {
                if (typeof widget === "string") {
                    const attr = {
                        "border-color": action.borderColor || "white",
                        "class": action.classed
                    }
                    this.prevAttr[widget] = {
                        "border-color": $(widget).css("border-color"),
                        "class": $(widget).attr("class")
                    };
                    $(widget).css({ "border-color": attr["border-color"] });
                    $(widget).attr("class", attr.class);
                } else {
                    widget.select({
                        borderColor: action.borderColor || "white",
                        classed: action.classed
                    });
                }
            }
        }
        const click_widget = (action: Action, widget: WidgetEVO | string ) => {
            if (action.click) {
                if (typeof widget === "string") {

                } else {
                    if (typeof widget["click"] === "function") {
                        widget["click"]({
                            borderColor: opt.borderColor || "white"
                        });        
                    }
                }
            }
        }
        const cursor_move = (action: Action, widget: WidgetEVO | string) => {
            action.cursor.offset = action.cursor.offset || {};
            const height: number = (typeof widget === "string") ? parseFloat($(widget).css("height")) : widget.getSize().height;
            const width: number = (typeof widget === "string") ? parseFloat($(widget).css("width")) : widget.getSize().width;
            const top: number = (typeof widget === "string") ? parseFloat($(widget).css("top")) : widget.getPosition().top;
            const left: number = (typeof widget === "string") ? parseFloat($(widget).css("left")) : widget.getPosition().left;
            const yy: number = (isNaN(action.cursor.offset.top)) ? height * 0.2 : action.cursor.offset.top;
            const xx: number = (isNaN(action.cursor.offset.left)) ? width * 0.8 : action.cursor.offset.left;
            action.cursor.type.move({
                top: top + yy,
                left: left + xx
            }, { duration: action.cursor.speed || 1000 });
        }
        const cursor_click = (action: Action, widget: WidgetEVO | string) => {
            const height: number = (typeof widget === "string") ? parseFloat($(widget).css("height")) : widget.getSize().height;
            const width: number = (typeof widget === "string") ? parseFloat($(widget).css("width")) : widget.getSize().width;
            action.cursor.type.click({ fw_move: Math.min( height / 4, width / 4) });
            setTimeout(() => {
                select_widget(action, widget);
            }, 250);
            setTimeout(() => {
                click_widget(action, widget);
            }, action.timeout);
        }
        const cursor_longpress = (action: Action, widget: WidgetEVO |  string) => {
            action.cursor.type.longPress();
            window.setTimeout(() => {
                select_widget(action, widget);
            }, 250);
            window.setTimeout(() => {
                click_widget(action, widget);
            }, action.timeout);
        }
        try {
            if (this.playlist.curr < this.playlist.seq.length) {
                console_log("Playback: action " + (this.playlist.curr + 1) + " of " + this.playlist.seq.length);
                const action: Action = this.playlist.seq[this.playlist.curr];
                const duration: number = action.duration || 1000;
                const transitionTimingFunction: "ease-in" | "ease-out" = opt.transitionTimingFunction || "ease-out";
                action.timeout = (action.timeout && action.timeout >= 0)? action.timeout : SELECT_TIMEOUT;
                let when: number = action.timeStamp - this.now;
                if (when < 0) {
                    console.error("Timestamp is out of order");
                    when = 0;
                }
                let skip_speech: boolean = false;
                if (opt.from && !isNaN(opt.from)) {
                    when = when - (opt.from - this.now);
                    if (when < 0) {
                        when = 0;
                        skip_speech = true;
                    }
                }

                if ((action.hide || action.reveal) && !isNaN(when) && when >= 0) {
                    this.timer = setTimeout(() => {
                        if (action.hide) {
                            if (typeof action.hide === "string") {
                                console_log("Hiding " + action.hide);
                                this.hide(action.hide);
                            } else if (action.hide.widget) {
                                action.hide.hide();
                            }
                        } else if (action.reveal){
                            if (typeof action.reveal === "string") {
                                console_log("Revealing " + action.reveal);
                                this.viz(action.reveal, { fade: true, duration: 1000 });
                            } else if (action.reveal.widget) {
                                action.reveal.reveal();
                            }
                        }
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    }, when);
                }
                if ((action.click || action.select || action.deselect) && !isNaN(when) && when >= 0) {
                    const widget: WidgetEVO | string = action.click || action.select || action.deselect;
                    this.timer = setTimeout(() => {
                        if (action.cursor && action.cursor.type) {
                            cursor_move(action, widget);
                            setTimeout(() => {
                                if (action.cursor.longpress) {
                                    cursor_longpress(action, widget);
                                } else {
                                    cursor_click(action, widget);
                                }
                            }, action.cursor.speed || 1250);
                        } else {
                            select_widget(action, widget);
                            setTimeout(() => {
                                click_widget(action, widget);
                            }, action.timeout);
                        }
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    }, when);
                }
                if (action.speak && !isNaN(when) && when >= 0) {
                    if (skip_speech) {
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    } else {
                        this.timer = setTimeout(() => {
                            const msg: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(action.speak);
                            msg.lang = this.lang;
                            // msg.localService = true;
                            msg.voice = this.voice;
                            msg.rate = this.rate;
                            msg.pitch = this.pitch;
                            console_log("Speaking: " + action.speak);
                            window.speechSynthesis.speak(msg);
                            this.now = action.timeStamp;
                            this.playlist.curr++;
                            this.play(opt);
                        }, when);
                    }
                }
                if (action.input && !isNaN(when) && when >= 0) {
                    console.log("input " + action.input + ": " + action.value);
                    this.timer = setTimeout(() => {
                        if ($(action.input)[0]) {
                            this.fill(action.input, action.value, {
                                    timeStamp: action.timeStamp,
                                    lineFeed: action.lineFeed
                                });
                            if (action.scroll && typeof action.scroll !== "string") {
                                this.scrollTop(action.scroll.id, action.scroll.offset);
                            }
                        }
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    }, when);
                }
                if (action.scroll && !isNaN(when) && when >= 0) {
                    console.log("scrolling " + action.scroll + " by " + action.offset + "px");
                    this.timer = setTimeout(() => {
                        this.scrollTop(action.scroll, action.offset);
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    }, when);
                }
                if (action.trans && !isNaN(when) && when >= 0) {
                    this.timer = setTimeout(() => {
                        let zIndex = action.zIndex || "inherit";
                        if (action.trans.startsWith(".")) {
                            $(action.trans).css("z-index", zIndex).css("display", "block").css("opacity", 1).css("transform", action.transform).css("transition-duration", duration + "ms");
                        } else {
                            $(action.trans).css("z-index", zIndex).css("display", "block").css("opacity", 1).css("transform", action.transform).css("transition-duration", duration + "ms");
                        }
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    }, when);
                }
                if (action.reveal && !isNaN(when) && when >= 0) {
                    this.timer = setTimeout(() => {
                        if (typeof action.reveal === "string") {
                            let opacity = isNaN(action.opacity) ? 1 : action.opacity;
                            if (action.reveal.startsWith(".")) {
                                $(action.reveal).css("display", "block").css("opacity", opacity)
                                    .css("transition-duration", duration + "ms")
                                    .css("transition-timing-function", transitionTimingFunction);
                            } else {
                                $(action.reveal).css("display", "block").css("opacity", opacity)
                                    .css("transition-duration", duration + "ms")
                                    .css("transition-timing-function", transitionTimingFunction);
                            }
                        } else if (action.reveal.widget && typeof action.reveal.reveal === "function") {
                            action.reveal.reveal();
                        }
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    }, when);
                }
                if (action.move && !isNaN(when) && when >= 0) {
                    this.timer = setTimeout(() => {
                        if (typeof action.move === "string") {
                            $(action.move).css("display", "block").css("opacity", 1)
                                .css("top", action.top + "px").css("left", action.left + "px")
                                .css("transition-duration", duration + "ms")
                                .css("transition-timing-function", transitionTimingFunction);
                        } else if (action.move.widget && typeof action.move.move === "function") {
                            action.move.move({ top: action.top, left: action.left }, {
                                duration: duration,
                                transitionTimingFunction: transitionTimingFunction
                            });
                        }
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    }, when);
                }
                if (action.blink && !isNaN(when) && when >= 0) {
                    this.timer = setTimeout(() => {
                        if ($(action.blink)[0]) {
                            $(action.blink).addClass("blink");
                        }
                        this.now = action.timeStamp;
                        this.playlist.curr++;
                        this.play(opt);
                    }, when);
                }
            }
        } catch(play_error) {
            console.error(play_error);
        }
        return this;
    };

    scrollTop(id: string | { offset?: number }, scrollHeight: number | { top?: number, left?: number }) {
        // function scrollTopTween(scrollTop) {
        //     return function() {
        //         var i = d3.interpolateNumber(this.scrollTop, scrollTop);
        //         return function(t) { this.scrollTop = i(t); };
        //     };
        // }
        // d3.select(id).transition()
        //     .duration(500)
        //     .tween("PlayerScroller", scrollTopTween(scrollHeight));
    }

    fill(id: string, val: string, opt?) {
        opt = opt || {};
        if (val && typeof val === "string") {
            if (opt.lineFeed) {
                $(id).attr("value", val);
                $(id).text(val);
            } else {
                let current_value: string = $(id).attr("value") || $(id).text();
                let elapse: number = opt.delay || 250;
                val.split("").forEach((c) => {
                    setTimeout(() => {
                        // for input fields
                        $(id).attr("value", current_value + c);
                        // for text areas & DIVs
                        $(id).text(current_value + c);
                        // console_log(current_value);
                        current_value = $(id).attr("value");
                    }, elapse);
                    elapse += (c === "@")? 400 : (Math.random() * (150 - 200) + 100);
                });
            }
        }
    }


    /**
     * @function pause Pauses playback
     */
    pause () {
        clearInterval(this.timer);
        return this;
    };

    /**
     * @function stop Stops playback
     */
    stop () {
        this.pause();
        this.playlist.curr = 0;
        return this;
    };
}
