import { WidgetsData } from "../plugins/PrototypeBuilder/views/BuilderView";
import { Connection } from "./Connection";

export declare interface PVSioWebPlugin {
    getName: () => string;
    getId: () => string;
    getDependencies?: () => string[];
    activate(opt?: { connection?: Connection, parent?: string, top?: number }): Promise<boolean>;
    isActive(): boolean
}
export declare interface MouseEventHandlers {
    handleKeyDownEvent?: (evt: JQuery.Event) => void;
    handleKeyUpEvent?: (evt: JQuery.Event) => void;
}

export declare interface Constructable<T> {
    new (...args: any) : T;
    constructorName: string;
}
export declare interface PVSioWebPluginDescriptor {
    cons: Constructable<PVSioWebPlugin>;
}