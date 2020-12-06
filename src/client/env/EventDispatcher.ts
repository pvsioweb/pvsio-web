import { EventHandler, Events } from "backbone";

export type EventDispatcherEvent = {
    type: string,
    [  key: string ]: any
}

//@ts-ignore
export class EventDispatcher implements Events, EventsMixin {

    protected registry = {};

    constructor () {
        //@ts-ignore
        _.extend(this, Backbone.Events);
    }

    addListener (type: string, callback: EventHandler): EventDispatcher {
        this.registry[type] = true;
        //@ts-ignore
        this.on(type, () => {
            callback();
        });
        return this;
    }

    removeListener (type: string, callback: EventHandler): EventDispatcher {
        //@ts-ignore
        this.off(type, callback);
        return this;
    }

    clearListeners (): EventDispatcher {
        for (let type in this.registry) {
            //@ts-ignore
            this.off(type);
        }
        this.registry = {};
        return this;
    };

    fire (evt: EventDispatcherEvent): EventDispatcher {
        //@ts-ignore
        this.trigger(evt.type, evt);
        return this;
    }

    // protected registry = {};

    // // Fire an event on an object. The event can be either  a string
    // // containing the name of the event or an  object containing a type
    // // property containing the  name of the event. Handlers registered by
    // // the 'on' method that match the event name will be invoked.
    // fire (event: string | { type: string }) {
    //     const type = typeof event === 'string' ? event : event.type;
    //     // If an array of handlers exist for this event, then  loop through it
    //     // and execute the handlers in order.
    //     if (this.registry.hasOwnProperty(type)) {
    //         const array = this.registry[type];
    //         for (let i = 0; i < array.length; i++) {
    //             const handler = array[i];
    //             // A handler record contains a method and an optional  array
    //             // of parameters. If the method is a name, look up the
    //             // function.
    //             let func = handler.method;
    //             if (typeof func === 'string') {
    //                 func = this[func];
    //             }
    //             // Invoke a handler. If the record contained  parameters, then
    //             // pass them. Otherwise, pass the event object.
    //             func(handler.parameters || [ event ]);
    //         }
    //     }
    //     return this;
    // };
    
    // addListener (type: string, method: string, parameters: string[]) {
    //     // Register an event. Make a handler record. Put it  in a handler
    //     // array, making one if it doesn't yet exist for this type.
    //     const handler = { method, parameters };
    //     if (this.registry.hasOwnProperty(type)) {
    //         this.registry[type].push(handler);
    //     } else {
    //         this.registry[type] = [ handler ];
    //     }
    //     return this;
    // };

    // removeListener (type: string, method: string) {
    //     if (this.registry.hasOwnProperty(type)) {
    //         const array = this.registry[type];
    //         for (let i = 0; i < array.length; i++) {
    //             let handler = array[i];
    //             if (method === handler.method) {
    //                 array.splice(i, 1);
    //             }
    //         }
    //     }
    //     //do nothing if this event type has no listeners
    //     return this;
    // };

    // clearListeners () {
    //     this.registry = {};
    //     return this;
    // };
}

export function eventDispatcher (d: any): any {

    d.addListener = d.addListener || function (type: string, callback: EventHandler): EventDispatcher {
        d.registry = d.registry || {};
        d.registry[type] = true;
        //@ts-ignore
        d.on(type, callback);
        return d;
    }

    d.removeListener = d.removeListener || function (type: string, callback: EventHandler): EventDispatcher {
        //@ts-ignore
        d.off(type, callback);
        return d;
    }

    d.clearListeners = d.clearListeners || function (): EventDispatcher {
        for (let type in d.registry) {
            //@ts-ignore
            d.off(type);
        }
        d.registry = {};
        return d;
    };

    d.fire = d.fire || function (evt: EventDispatcherEvent): EventDispatcher {
        //@ts-ignore
        d.trigger(evt.type, evt);
        return d;
    }

    Object.assign(d, Events);

    return d;
}