export type PVSioWebCallBack = (...args: any[]) => void;
export declare type PVSioWebRequest = TokenId;
export declare type PVSioWebResponse = TokenId;
import * as serverUtils from '../../server/ServerUtils';

export declare type RequestType = TokenType;
export declare type ResponseType = TokenType;
export declare type TokenType = "startPvsProcess" | "stopPvsProcess" | "sendCommand" | "execJava"
    | "readFile" | "writeFile" | "deleteFile" | "deleteFolder" | "writeFolder" | "readFolder"
    | "keepAlive" | "activate-server" | "setMainFile" | "changeProjectSetting" | "listProjects"
    | "openProject" | "typeCheck" | "<ping>" | "<pong>" | "renameFile" | "fileExists"
    | "readExamplesFolder" | "renameProject" | "ctrl" | "startSapereEE" | "stopSapereEE"
    | "startIVY" | "error" | "changeProjectSettings" | "FileSystemUpdate";
export declare interface Connection {
    activate: () => Promise<boolean>;
    getUrl: () => string;
    sendRequest: (type: RequestType, req: PVSioWebRequest) => Promise<boolean>;
    onRequest: (type: RequestType, req: PVSioWebCallBack) => void;
}

export interface BasicToken {
    socketId?: number,
    name?: string,
    path?: string,
    files?: serverUtils.NodeJSFileDescriptor[],
    type: TokenType,
    time?: { 
        client?: { sent?: number, received?: number },
        server?: { sent?: number, received?: number }
    },
    data?: any,
    err?: {
        path?: string,
        message?: string,
        code?: string,
        failedCommand?: string
    }
}
export interface ErrorToken extends BasicToken {
    type: "error",
    err: {
        message: string,
        code: string,
        path?: string,
        failedCommand?: string
    }
}
export interface TokenId extends BasicToken {
    id: string;
}
export interface StartServerToken extends TokenId {
    data: string;
}
export interface SetMainFileToken extends TokenId {
    type: "setMainFile",
    name: string,
    project: serverUtils.ProjectDescriptor,
    key?: string,
    value?: string
}
export interface ChangeProjectSettingsToken extends TokenId {
    type: "changeProjectSettings",
    name: string,
    project: serverUtils.ProjectDescriptor,
    key?: string,
    value?: string
}
export interface OpenProjectToken extends TokenId {
    name: string,
    project: serverUtils.ProjectDescriptor,
    key?: string,
    value?: string
}
export interface TypecheckToken extends TokenId {
    path: string
    stdout?: string,
    stderr?: string
}
export interface SendCommandToken extends TokenId {
    type: "sendCommand",
    command: string,
    data?: {},
    raw?: string,
    json?: string
}
export interface ListProjectsToken extends TokenId {
    socketId: number,
    projects: serverUtils.ProjectDescriptor[]
}
export interface FileDescriptor {
    fileName: string,
    fileExtension: string,
    contextFolder: string
}

export interface StartPvsProcessToken extends TokenId {
    type: "startPvsProcess",
    data: FileDescriptor
}
export interface StopPvsProcessToken extends TokenId {
    type: "stopPvsProcess",
    data: FileDescriptor,
    message?: string
}
export interface ReadFileToken extends TokenId {
    path: string,
    encoding: "utf8" | "base64",
    content: string    
}
export interface WriteFileToken extends TokenId {
    type: "writeFile",
    encoding: "utf8" | "base64",
    content?: string,
    opt?: {
        overWrite?: boolean
    }
}
export interface DeleteFileToken extends TokenId {
    type: "deleteFile",
    encoding: "utf8" | "base64",
    content?: string
}
export interface RenameFileToken extends TokenId {
    type: "renameFile",
    encoding: "utf8" | "base64",
    oldPath: string,
    newPath: string
}
export interface FileExistsToken extends TokenId {
    type: "fileExists",
    encoding: "utf8" | "base64",
    path: string,
    exists?: boolean
}
export interface ReadFolderToken extends TokenId {
    type: "readFolder",
    files?: serverUtils.NodeJSFileDescriptor[]
}
export interface WriteFolderToken extends TokenId {
    type: "writeFolder"
}
export interface DeleteFolderToken extends TokenId {
    type: "deleteFolder"
}
export interface ReadExamplesFolderToken extends TokenId {
    type: "readExamplesFolder",
    files?: serverUtils.NodeJSFileDescriptor[]
}
export interface RenameProjectToken extends TokenId {
    type: "renameProject",
    oldPath: string,
    newPath: string
}
export interface CtrlToken extends TokenId {
    type: "ctrl"
}
export interface JavaToken extends TokenId {
    type: "execJava",
    data: {
        javaFile: string, 
        basePath?: string, 
        argv?: string[], 
        javaOptions?: string[] 
    },
    stdout?: string,
    stderr?: string
}
export interface StartSapereEEToken extends TokenId {
    type: "startSapereEE",
    stdout?: string,
    stderr?: string
}
export interface StopSapereEEToken extends TokenId {
    type: "stopSapereEE"
}
export interface StartIVYToken extends TokenId {
    type: "startIVY",
    stdout?: string,
    stderr?: string
}
export interface FileSystemUpdateToken extends BasicToken {
    socketId: -1,
    type: "FileSystemUpdate",
    event: "rename" | "change" | "delete" | "refresh",
    subFiles?: serverUtils.NodeJSFileDescriptor[],
    isDirectory?: boolean,
    subFolders?: serverUtils.NodeJSFileDescriptor[]
}
export interface PingToken extends TokenId {
    type: "<ping>",
    data?: string[]
} 
export interface PongToken extends TokenId {
    type: "<pong>",
    data?: string[]
} 

export type Token = PongToken | PingToken | FileSystemUpdateToken | StartIVYToken | StopSapereEEToken | StartSapereEEToken
    | JavaToken | CtrlToken | RenameProjectToken | DeleteFolderToken | WriteFolderToken | ReadFolderToken
    | FileExistsToken | RenameFileToken | DeleteFileToken | WriteFileToken | ReadFileToken | StopPvsProcessToken
    | StartPvsProcessToken | ListProjectsToken | SendCommandToken | TypecheckToken | OpenProjectToken | ReadExamplesFolderToken
    | ChangeProjectSettingsToken | SetMainFileToken | ErrorToken | StartServerToken;


// export declare interface ProcessData {
//     fileName: string
// }
// export declare interface PvsProcessData extends ProcessData {
//     fileName: string,
//     fileExtension: string,
//     contextFolder: string
// }
// export declare interface JavaProcessData extends ProcessData {
//     argv: string[],
//     javaOptions?: string[],
//     basePath: string
// }
// export declare interface StartPvsProcessRequest extends PVSioWebRequest {
//     data: PvsProcessData
// }
// export declare interface StartPvsProcessResponse extends PVSioWebResponse {
//     data: PvsProcessData
// }
// export declare interface StartJavaProcessRequest extends PVSioWebRequest {
//     data: JavaProcessData
// }
// export declare interface StopPvsProcessRequest extends PVSioWebRequest {
// }
// export declare interface SendCommandRequest extends PVSioWebRequest {
//     command: string
// }
// export declare interface ReadFileRequest extends PVSioWebRequest {
//     path: string,
//     encoding: "utf8" | "base64"
// }
// export interface ReadFileResponse extends ReadFileRequest {
//     content: string
// }
// export declare interface WriteFileRequest extends PVSioWebRequest {
//     path: string,
//     encoding: "utf8" | "base64",
//     content: string
// }
// export declare interface DeleteFileRequest extends PVSioWebRequest {
//     path: string
// }
// export declare interface DeleteDirectoryRequest extends PVSioWebRequest {
//     path: string
// }
// export declare interface WriteDirectoryRequest extends PVSioWebRequest {
//     path: string
// }
// export declare interface ReasDirectoryRequest extends PVSioWebRequest {
//     path: string
// }