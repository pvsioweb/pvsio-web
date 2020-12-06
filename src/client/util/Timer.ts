/**
 * @author paolo masci
 * @date Nov 2020
 */

export type TimerEvent = "TimerTicked";
const MIN_RATE: number = 250; //ms

// @ts-ignore
export class Timer implements Backbone.Events {
    protected rate: number; //ms
    timer: NodeJS.Timer;
    tick: () => void;

    constructor (rate: number) {
        rate = rate || MIN_RATE;
        this.rate = rate < MIN_RATE ? MIN_RATE : rate;
    }

    addListener (evt: TimerEvent, fn: () => void): void {
        // @ts-ignore
        this.on(evt, fn);
    }
    removeListener (fn: () => void): void {
        // @ts-ignore
        this.off(fn);
    }

    start (): Timer {
        this.timer = setInterval(() => {
            // @ts-ignore
            this.trigger("TimerTicked")
        }, this.rate);
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

// @ts-ignore
Object.assign(Timer.prototype, Backbone.Events);
