/**
 * utility function for defining a property inside a function
 * @author hogfather
 * @date Apr 25, 2012
 * @project JSLib
 */

import { eventDispatcher } from "../util/eventDispatcher";

export function call (obj: any, v: any) {
    obj = eventDispatcher(obj);
    if (v !== undefined && typeof obj === "object") {
        let p = function (fresh: any) {
            if (!arguments.length) {
                return v;
            }
            //fire property changed event if fresh (incoming) is not equal to v (old property)
            if (v !== fresh) {
                v = fresh;
                const event = { type: "PropertyChanged", old: v, fresh };
                //@ts-ignore
                obj.trigger("PropertyChanged", event);
            }
            return this;
        };
        return p;
    }
    return obj;
};
