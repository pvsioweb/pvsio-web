/**
 * This file defines the data structures used by the prototype builder plugin to store/share information about the prototypes
 * Information is conceptually split in two elements: 'io' and 'web'
 * - io elements are for pvsio-related elements (e.g., theory name, pvs file name, etc)
 * - web elements are for web-related elements (e.g., picture, widgets, etc.)
 * File attributes is information to be stored in files
 * Data attributes extends file attributes with information necessary to complete the loading of a prototype (e.g., base64 data of the picture image, current context folder)
 */
export enum IoFileAttribute {
    description = "description",
    mainFile = "mainFile",
    mainModule = "mainModule",
    initFunction = "initFunction",
    tickFunction = "tickFunction",
    tickInterval = "tickInterval",
    toStringFunction = "toStringFunction"
};
export enum WebFileAttribute {
    pictureFile = "pictureFile",
    pictureWidth = "pictureWidth",
    pictureHeight = "pictureHeight",
    widgets = "widgets"
}
export enum DataAttribute {
    contextFolder = "contextFolder",
    pictureData = "pictureData"
};
export type PVSioWebDataAttribute = IoFileAttribute | WebFileAttribute | DataAttribute;
export interface ValueLabel { value: string, label?: string };
export declare interface IoFile {
    version?: string, // file version
    description?: ValueLabel, // brief description of the prototype
    mainFile?: ValueLabel, // name of the main file, including extension
    mainModule?: ValueLabel, // main function -- this is a theory in PVS
    initFunction?: ValueLabel // init function name
    tickFunction?: ValueLabel, // tick function name
    tickInterval?: ValueLabel // tick interval
    toStringFunction?: ValueLabel // name of print function for converting states returned by the server in json format
}
export declare interface IoData extends IoFile {
    contextFolder: string
}
export declare interface WebFile {
    version?: string, // file version
    pictureFile?: string, // file name, including extension
    pictureWidth?: number,
    pictureHeight?: number,
    widgets?: any
}
export declare interface PVSioWebFile extends IoFile, WebFile {};
export declare interface WebData extends WebFile {
    pictureData?: string
}
export declare interface PrototypeData extends IoData, WebData {};

/**
 * Utility function, returns io attributes
 */
export function getIoFile (data: PrototypeData): IoFile {
    if (data) {
        const ans: IoFile = { };
        for (let key in IoFileAttribute) {
            ans[key] = data[key];
        }
        return ans;
    }
    return null;
}
/**
 * Utility function, returns web attributes
 */
export function getWebFile (data: PrototypeData): WebFile {
    if (data) {
        const ans: WebFile = { };
        for (let key in WebFileAttribute) {
            ans[key] = data[key];
        }
        return ans;
    }
    return null;
}

/**
 * Prototype Builder events
 */
export enum PrototypeBuilderEvents {
    DidActivatePlugin = "DidActivatePlugin",
    NewPrototype = "NewPrototype",
    SavePrototype = "SavePrototype",
    SaveAs = "SaveAs",
    OpenPrototype = "OpenPrototype",
    DidSwitchToSimulatorView = "DidSwitchToSimulatorView",
    DidSwitchToBuilderView = "DidSwitchToBuilderView",
    DidSwitchToSettingsView = "DidSwitchToSettingsView",
    DidChangePicture = "DidChangePicture",
    RebootPrototype = "RebootPrototype",
    DidUpdateWidgets = "DidUpdateWidgets",
    DidUpdateSettings = "DidUpdateSettings",
    DidRemovePicture = "DidRemovePicture"
};
/**
 * Picture file descriptor
 */
export interface Picture {
    fileName: string,
    fileExtension: string,
    fileContent: string
};
/**
 * Picture data
 */
export type PictureData = Picture & PictureSize;

/**
 * Name used to identify the whiteboard used when no picture is loaded
 */
export const whiteboardFile: string = "whiteboard.gif";

/**
 * Event data produced by prototype builder
 */
export interface DidChangePictureEventData {
    new: Picture,
    old: Picture
};
export interface DidRemovePictureEventData {
    old: string // file name
};


/**
 * Constants and data structures for pictures
 */
export const MIN_WIDTH: number = 800; //px
export const MIN_HEIGHT: number = 600; //px
export interface PictureSize {
    width: number,
    height: number
}
export const DEFAULT_PICTURE_SIZE: PictureSize = { width: MIN_WIDTH, height: MIN_HEIGHT };

/**
 * Default settings
 */
export const defaultIoSettings: IoFile = {
    description: { label: "Description", value: "" },
    mainModule: { label: "Theory Name", value: "" },
    mainFile: { label: "Main File", value: "" },
    initFunction: { label: "Init Function", value: "init" },
    tickFunction: { label: "Tick Function (optional)", value: "" },
    tickInterval: { label: "Tick Interval (optional)", value: "" },
    toStringFunction: { label: "toString Function (optional)", value: "" }
};
export const defaultWebSettings: WebFile = {
    pictureFile: "",
    pictureWidth: DEFAULT_PICTURE_SIZE.width,
    pictureHeight: DEFAULT_PICTURE_SIZE.height
};