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
define(function (require, exports, module) {
    "use strict";
    var SELECT_TIMEOUT = 800; //msec

    /**
     * @constructor
     */
    function Player (opt) {
        opt = opt || {};
        this.actions = {
            seq: [],
            curr: 0
        };
        this.now = 0;
        this.timer = null;
        this.lang = opt.lang || "en-GB";
        this.pitch = opt.pitch || 1.04;
        this.rate = opt.rate || 1.03;
        return this;
    }

    /**
     * @function load Loads the list of actions that needs to be played
     * @param actionList {Object} JSON object containing the list of actions to be executed
     *          The object is an array of actions. Each action contains (at least) the following attributes:
     *              - button: the input widget that needs to be clicked
     *              - timestamp: indicates when the action needs to be executed. The value of time is expressed as an absolute value wrt the beginning of time (which is 0)
     */
    Player.prototype.load = function (actionList) {
        this.actions = {
            seq: actionList,
            curr: 0
        };
        return this;
    };

    /**
     * @function play Plays the action file opened in the player
     */
    Player.prototype.play = function(opt) {
        opt = opt || {};
        if (this.actions.curr < this.actions.seq.length) {
            console.log(this.actions.curr);
            console.log(this.actions.seq.length);
            var _this = this;
            var action = this.actions.seq[this.actions.curr];
            var timeout = (action.timeout && action.timeout >= 0)? action.timeout : SELECT_TIMEOUT;
            var when = parseFloat(action.timeStamp - _this.now);
            if (action.button && !isNaN(when) && when >= 0) {
                _this.timer = window.setTimeout(function () {
                    action.button.select({
                        borderColor: action.borderColor || "white",
                        classed: action.classed
                    });
                    window.setTimeout(function () {
                        if (!action.stutter) {
                            action.button.click({
                                borderColor: "white"
                            });
                        } else {
                            action.button.deselect();
                        }
                    }, timeout);
                    _this.now = action.timeStamp;
                    _this.actions.curr++;
                    _this.play(opt);
                }, when);
            }
            if (action.speak) {
                _this.timer = window.setTimeout(function () {
                    var msg = new SpeechSynthesisUtterance(action.speak);
                    msg.lang = _this.lang;
                    msg.localService = true;
                    msg.rate = _this.rate;
                    msg.pitch = _this.pitch;
                    window.speechSynthesis.speak(msg);
                    _this.now = action.timeStamp;
                    _this.actions.curr++;
                    _this.play(opt);
                }, when);
            }
            if (action.input) {
                _this.timer = window.setTimeout(function () {
                    if (d3.select(action.input).node() && d3.select(action.input).node().value === "") {
                        fill(action.input, action.value, action.timeStamp);
                    }
                    _this.now = action.timeStamp;
                    _this.actions.curr++;
                    _this.play(opt);
                }, when);
            }
        }
    };

    function fill(id, val, opt) {
        opt = opt || {};
        if (val && typeof val === "string") {
            var current_value = d3.select(id).attr("value");
            var i = 1;
            var elapse = opt.delay || 250;
            val.split("").forEach(function (c) {
                setTimeout(function () {
                    d3.select(id).attr("value", current_value + c);
                    // console.log(current_value);
                    current_value = d3.select(id).attr("value");
                }, elapse);
                elapse += (c === "@")? 400 : (Math.random() * (150 - 200) + 100);
            });
        }
    }


    /**
     * @function pause Pauses playback
     */
    Player.prototype.pause = function() {
        clearInterval(this.timer);
        return this;
    };

    /**
     * @function stop Stops playback
     */
    Player.prototype.stop = function() {
        this.pause();
        this.actions.curr = 0;
        return this;
    };

    module.exports = Player;
});
