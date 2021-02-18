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
}
export declare interface PVSioWebPluginDescriptor {
    cons: Constructable<PVSioWebPlugin>,
    autoload?: boolean
}
// export declare interface WidgetData {
//     id: string,
//     cons: string,
//     kind: string,
//     attr: { [key: string]: any },
//     css: { [key: string]: any },
//     coords: { [key: string]: any }
// }
export declare interface PVSioWebFile {
    main: {
        fname: string // file name, including extension
    },
    picture: {
        fname: string,
        width: number,
        height: number
    },
    widgets: WidgetsData
}
export declare interface PrototypeData extends PVSioWebFile {
    contextFolder: string,
    // "main-data": string,
    "picture-data": string
} 