export type PVSioWebCallBack = (...args: any[]) => void;
export declare interface PVSioWebRequest { 
    type: string,
    [key: string]: any
}
export declare interface Connection {
    activate: () => Promise<boolean>;
    getUrl: () => string;
    sendRequest: (token: PVSioWebRequest, cb?: PVSioWebCallBack) => Promise<boolean>;
}

export declare interface ProcessData {
    fileName: string;
}
export declare interface PvsProcessData extends ProcessData {
    fileName: string;
    fileExtension: ".pvs";
    contextFolder: string;
}
export declare interface JavaProcessData extends ProcessData {
    argv: string[];
    javaOptions?: string[];
    basePath: string;
}
export declare interface StartPvsProcessRequest extends PVSioWebRequest {
    type: "startProcess",
    data: PvsProcessData
}
export declare interface StartJavaProcessRequest extends PVSioWebRequest {
    type: "java",
    data: JavaProcessData
}
export declare interface ClosePvsProcessRequest extends PVSioWebRequest {
    type: "closeProcess"
}
export declare interface SendCommandRequest extends PVSioWebRequest {
    type: "sendCommand",
    command: string
}
export declare interface OpenFileDialog extends PVSioWebRequest {
    type: "openFileDialog",
    image?: boolean
}
export declare interface ReadFileRequest extends PVSioWebRequest {
    type: "readFile",
    path: string,
    encoding: "utf8" | "base64"
}
export interface ReadFileResponse extends ReadFileRequest {
    content: string
}
export declare interface WriteFileRequest extends PVSioWebRequest {
    type: "writeFile",
    path: string,
    encoding: "utf8" | "base64",
    content: string
}
export declare interface DeleteFileRequest extends PVSioWebRequest {
    type: "deleteFile",
    path: string
}
export declare interface DeleteDirectoryRequest extends PVSioWebRequest {
    type: "deleteDirectory",
    path: string
}
export declare interface WriteDirectoryRequest extends PVSioWebRequest {
    type: "writeDirectory",
    path: string
}
export declare interface ReasDirectoryRequest extends PVSioWebRequest {
    type: "readDirectory",
    path: string
}