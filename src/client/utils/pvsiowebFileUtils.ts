/**
 * This file defines the data structures used by pvsioweb to store information about the prototypes
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
export interface IoFileValue { value: string, label?: string };
export declare interface IoFile {
    version?: string, // file version
    description?: IoFileValue, // brief description of the prototype
    mainFile?: IoFileValue, // name of the main file, including extension
    mainModule?: IoFileValue, // main function -- this is a theory in PVS
    initFunction?: IoFileValue // init function name
    tickFunction?: IoFileValue, // tick function name
    tickInterval?: IoFileValue // tick interval
    toStringFunction?: IoFileValue // name of print function for converting states returned by the server in json format
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

// export type SettingsElemValue = string;
// export interface Settings {
//     id: PVSioWebDataAttribute,
//     value: SettingsElemValue // initial value of the setting
// };
// export interface SettingsElem extends Settings {
//     label?: string,
//     placeholder?: string
// };
// export interface SettingsMap { 
//     [key: string]: Settings
// };
export const defaultSettings: IoData = {
    contextFolder: "",
    description: { label: "Description", value: "" },
    mainModule: { label: "Theory Name", value: "" },
    mainFile: { label: "Main File", value: "" },
    initFunction: { label: "Init Function", value: "init" },
    tickFunction: { label: "Tick Function (optional)", value: "" },
    tickInterval: { label: "Tick Interval (optional)", value: "" },
    toStringFunction: { label: "toString Function (optional)", value: "" }
};
