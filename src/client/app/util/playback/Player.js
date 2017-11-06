/**
 * Player APIs for automated playback of recorded user actions
 * @author Paolo Masci
 * @date Nov 5, 2017
 */
define(function (require, exports, module) {
    "use strict";
    var SELECT_TIMEOUT = 800; //msec

    /**
     * @constructor
     */
    function Player () {
        this.actions = {
            seq: [],
            curr: 0
        };
        this.now = 0;
        this.timer = null;
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
            var timeout = (opt.timeout >= 0)? opt.timeout : SELECT_TIMEOUT;
            var when = parseFloat(action.timeStamp - _this.now);
            if (action.button && !isNaN(when)) {
                _this.timer = window.setTimeout(function () {
                    action.button.select({
                        borderColor: "white"
                    });
                    window.setTimeout(function () {
                        action.button.click({
                            borderColor: "white"
                        });
                        _this.now = action.timeStamp;
                        _this.actions.curr++;
                        _this.play(opt);
                    }, timeout);
                }, when);
            }
        }
    };

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
