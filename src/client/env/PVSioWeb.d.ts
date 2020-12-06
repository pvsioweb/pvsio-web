import { Connection } from "./Connection";

export declare interface PVSioWebPlugin {
    getName: () => string;
    getId: () => string;
    getDependencies?: () => string[];
    activate(connection?: Connection): Promise<boolean>;
}
export declare interface MouseEventHandlers {
    handleKeyDownEvent?: (evt: JQuery.Event) => void;
    handleKeyUpEvent?: (evt: JQuery.Event) => void;
}

export declare interface Constructable<T> {
    new (...args: any) : T;
}
export type PVSioWebPluginDescriptor = {
    cons: Constructable<PVSioWebPlugin>,
    autoload?: boolean
};
