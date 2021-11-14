import { Connection } from "./Connection";

/**
 * Interface implemented by pvsioweb plugins
 */
export declare interface PVSioWebPlugin {
    getName: () => string;
    getId: () => string;
    getDependencies?: () => string[];
    activate(opt?: { connection?: Connection, parent?: string, top?: number }): Promise<boolean>;
    isActive(): boolean
}
/**
 * pvsioweb plugin descriptor
 */
export declare interface PVSioWebPluginDescriptor {
    cons: Constructable<PVSioWebPlugin>;
}
/**
 * Interface for creating classes dynamically --- the object is constructable, i.e., invocable via new
 */
export declare interface Constructable<T> {
    new (...args: any) : T;
    constructorName: string;
}
/**
 * Mouse event handlers
 */
export declare interface MouseEventHandlers {
    handleKeyDownEvent?: (evt: JQuery.Event) => void;
    handleKeyUpEvent?: (evt: JQuery.Event) => void;
}