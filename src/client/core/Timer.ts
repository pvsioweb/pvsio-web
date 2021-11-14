/**
 * @author paolo masci
 * @date Nov 2020
 */
import * as Backbone from 'backbone';

export type TimerEvent = "TimerTicked";
const MIN_RATE: number = 250; //ms

export class Timer extends Backbone.Model {
    protected rate: number; //ms
    timer: NodeJS.Timer;
    tick: () => void;

    constructor (rate: number) {
        super();
        rate = rate || MIN_RATE;
        this.rate = rate < MIN_RATE ? MIN_RATE : rate;
    }

    addListener (evt: TimerEvent, callback: () => void): void {
        this.on(evt, callback);
    }
    removeListener (evt: TimerEvent, callback: () => void): void {
        this.off(evt, callback);
    }

    start (): Timer {
        this.timer = setInterval(() => {
            this.trigger("TimerTicked")
        }, this.rate);
        return this;
    }

    interval (rate: number): Timer {
        this.rate = rate < MIN_RATE ? MIN_RATE : rate;
        return this;
    }

    stop (): Timer {
        clearInterval(this.timer);
        this.timer = null;
        return this;
    }

    reset (): Timer {
        this.stop();
        return this;
    }

    restart (): Timer {
        this.stop();
        return this.start();
    }
}