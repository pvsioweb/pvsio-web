/**
 * @module EmuTimer
 * @desc EmuTimer emulates periodic automatic transitions.
 * @author Paolo Masci
 * @date 2015/04/20
 */

import * as Widget from './Widget';
import { Recorder } from '../../../util/ActionRecorder';
import { Timer } from "../../../util/Timer";
import { ActionCallback, ActionsQueue } from "./ActionsQueue";
import { Connection } from '../../../env/Connection';

export interface WidgetOptions extends Widget.WidgetOptions {
    timerEvent?: string,
    timerRate?: number,
    evts?: string[],
    callback?: ActionCallback
}

export class EmuTimer {
    id: string;
    type: string;

    //define timer for sensing hold down actions on buttons
    protected btnTimer;

    protected timerTickFunction: () => void;
    protected callback: ActionCallback;

    protected evts: string[];
    protected timerEvent: string;
    protected timerRate: number;
    protected timerFunction: string;
    protected connection: Connection;

    constructor (id: string, connection: Connection, opt: WidgetOptions) {
        this.id = id;
        this.type = "timer";
        this.connection = connection;

        opt = opt || {};
        opt.timerEvent = opt.timerEvent || id;
        opt.timerRate = opt.timerRate || 1000;
        opt.evts = opt.evts || ["tick"];

        this.evts = opt.evts || [];
        this.timerEvent = opt.timerEvent;
        this.timerRate = opt.timerRate;
        this.timerFunction = opt.timerEvent;

        this.callback = opt.callback;

        this.btnTimer = new Timer(250);
        //add event listener for timer's tick
        this.btnTimer.addListener('TimerTicked', () => {
            if (this.timerTickFunction) {
                this.timerTickFunction();
            }
        });

    }

    // @override
    updateLocationAndSize (pos: { x?: number, y?: number, width?: number, height?: number }): void { }


    /**
     * @function boundFunctions
     * @returns {String} A comma separated string representing the PVS functions modelling automatic actions.
     * @memberof module:EmuTimer
     */
    boundFunctions (): string {
        const res: string = this.evts?.map((d: string) => {
            return d + "_" + this.timerFunction;
        }).join(", ");
        return res;
    };

    /**
     * Returns a JSON object representation of automatic actions.
     * @returns {object}
     * @memberof module:EmuTimer
    */
    toJSON (): { id: string, type: string, evts: string[], timerEvent: string, timerRate: number, timerFunction: string } {
        return {
            id: this.id,
            type: this.type,
            evts: this.evts,
            timerEvent: this.timerEvent,
            timerRate: this.timerRate,
            timerFunction: this.timerFunction
        };
    };
    
    /**
     * @function tick
     * @description API to simulate a single timer event
     * @memberof module:EmuTimer
     */
    tick () {
        console.log("automatic action fired: " + this.timerFunction);
        ActionsQueue.queueGUIAction(this.timerFunction, this.connection, this.callback);
        Recorder.addAction({
            id: this.id,
            timerEvent: this.timerEvent,
            timerFunction: this.timerFunction,
            ts: new Date().getTime()
        });
        return this;
    };
    
    /**
     * @function start
     * @description API to simulate periodic timer events
     * @memberof module:EmuTimer
     */
    start (opt?: { timerRate?: number }): void {
        opt = opt || {};
        this.tick();
        if (opt.timerRate && opt.timerRate > 100) {
            this.timerRate = opt.timerRate;
        }
        this.timerTickFunction = () => {
            ActionsQueue.queueGUIAction(this.timerFunction, this.connection, this.callback);
            //record action
            Recorder.addAction({
                id: this.id,
                timerEvent: this.timerEvent,
                timerFunction: this.timerFunction,
                ts: new Date().getTime()
            });
        };
        this.btnTimer?.interval(this.timerRate).start();
    };
    
    updateInterval (millis: number) {
        // minimum allowed interval is 100 millis
        if (millis > 100) {
            this.stop();
            this.start({ timerRate: millis });
        }
    };

    /**
     * @function stop
     * @description API to stop the timer
     * @memberof module:EmuTimer
     */
    stop (): void {
        this.btnTimer.reset();
    };
    
}
