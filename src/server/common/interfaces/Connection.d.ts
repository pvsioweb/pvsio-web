import { NodeJSFileDescriptor, ProjectDescriptor } from "./FileSystem";

export declare type PVSioWebRequest = TokenId;
export declare type PVSioWebResponse = TokenId;
export declare interface TokenId extends BasicToken {
    id: string;
}
export declare type PVSioWebCallBack = (err?: any, res?: any) => void
export declare interface BasicToken {
    socketId?: number,
    name?: string,
    path?: string,
    files?: NodeJSFileDescriptor[],
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
export declare interface ErrorToken extends BasicToken {
    type: "error",
    err: {
        message: string,
        code: string,
        path?: string,
        failedCommand?: string
    }
}
export declare interface Connection extends Backbone.EventsMixin {
    activate: () => Promise<boolean>;
    getUrl: () => string;
    sendRequest: (type: string, req: PVSioWebRequest) => Promise<boolean>;
    onRequest: (type: string, req: PVSioWebCallBack) => void;
}
export declare type RequestType = TokenType;
export declare type ResponseType = TokenType;

export declare type TokenType = "startProcess" | "stopProcess" | "sendCommand" | "execJava"
    | "readFile" | "writeFile" | "deleteFile" | "deleteFolder" | "writeFolder" | "readFolder"
    | "keepAlive" | "activate-server" | "setMainFile" | "changeProjectSetting" | "listProjects"
    | "openProject" | "typeCheck" | "<ping>" | "<pong>" | "renameFile" | "fileExists"
    | "readExamplesFolder" | "renameProject" | "ctrl" | "startSapereEE" | "stopSapereEE"
    | "startIVY" | "error" | "changeProjectSettings" | "FileSystemUpdate";

export declare interface StartServerToken extends TokenId {
    data: string;
}
export declare interface SetMainFileToken extends TokenId {
    type: "setMainFile",
    name: string,
    project: ProjectDescriptor,
    key?: string,
    value?: string
}
export declare interface ChangeProjectSettingsToken extends TokenId {
    type: "changeProjectSettings",
    name: string,
    project: ProjectDescriptor,
    key?: string,
    value?: string
}
export declare interface OpenProjectToken extends TokenId {
    name: string,
    project: ProjectDescriptor,
    key?: string,
    value?: string
}
export declare interface TypecheckToken extends TokenId {
    path: string
    stdout?: string,
    stderr?: string
}
export declare interface SendCommandToken extends TokenId {
    type: "sendCommand",
    command: string,
    data?: {},
    raw?: string,
    json?: string
}
export declare interface ListProjectsToken extends TokenId {
    socketId: number,
    projects: ProjectDescriptor[]
}
export declare interface FileDescriptor {
    fileName?: string,
    fileExtension?: string,
    contextFolder?: string
}
export declare interface PvsTheory extends FileDescriptor {
    theoryName: string
}
export declare interface StartProcessData extends FileDescriptor {
    [key: string]: string
}
export declare interface StartProcessToken extends TokenId {
    type: "startProcess",
    data: StartProcessData
}
export declare interface StopProcessToken extends TokenId {
    type: "stopProcess",
    data: StartProcessData,
    message?: string
}
export declare interface ReadFileToken extends TokenId {
    path: string,
    encoding: "utf8" | "base64",
    content: string    
}
export declare interface WriteFileToken extends TokenId {
    type: "writeFile",
    encoding: "utf8" | "base64",
    content?: string,
    opt?: {
        overWrite?: boolean
    }
}
export declare interface DeleteFileToken extends TokenId {
    type: "deleteFile",
    encoding: "utf8" | "base64",
    content?: string
}
export declare interface RenameFileToken extends TokenId {
    type: "renameFile",
    encoding: "utf8" | "base64",
    oldPath: string,
    newPath: string
}
export declare interface FileExistsToken extends TokenId {
    type: "fileExists",
    encoding: "utf8" | "base64",
    path: string,
    exists?: boolean
}
export declare interface ReadFolderToken extends TokenId {
    type: "readFolder",
    files?: NodeJSFileDescriptor[]
}
export declare interface WriteFolderToken extends TokenId {
    type: "writeFolder"
}
export declare interface DeleteFolderToken extends TokenId {
    type: "deleteFolder"
}
export declare interface ReadExamplesFolderToken extends TokenId {
    type: "readExamplesFolder",
    files?: NodeJSFileDescriptor[]
}
export declare interface RenameProjectToken extends TokenId {
    type: "renameProject",
    oldPath: string,
    newPath: string
}
export declare interface CtrlToken extends TokenId {
    type: "ctrl"
}
export declare interface JavaToken extends TokenId {
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
export declare interface StartSapereEEToken extends TokenId {
    type: "startSapereEE",
    stdout?: string,
    stderr?: string
}
export declare interface StopSapereEEToken extends TokenId {
    type: "stopSapereEE"
}
export declare interface StartIVYToken extends TokenId {
    type: "startIVY",
    stdout?: string,
    stderr?: string
}
export declare interface FileSystemUpdateToken extends BasicToken {
    socketId: -1,
    type: "FileSystemUpdate",
    event: "rename" | "change" | "delete" | "refresh",
    subFiles?: NodeJSFileDescriptor[],
    isDirectory?: boolean,
    subFolders?: NodeJSFileDescriptor[]
}
export declare interface PingToken extends TokenId {
    type: "<ping>",
    data?: string[]
} 
export declare interface PongToken extends TokenId {
    type: "<pong>",
    data?: string[]
} 

export declare type Token = PongToken | PingToken | FileSystemUpdateToken | StartIVYToken | StopSapereEEToken | StartSapereEEToken
    | JavaToken | CtrlToken | RenameProjectToken | DeleteFolderToken | WriteFolderToken | ReadFolderToken
    | FileExistsToken | RenameFileToken | DeleteFileToken | WriteFileToken | ReadFileToken | StopProcessToken
    | StartProcessToken | ListProjectsToken | SendCommandToken | TypecheckToken | OpenProjectToken | ReadExamplesFolderToken
    | ChangeProjectSettingsToken | SetMainFileToken | ErrorToken | StartServerToken;

export declare interface SendRequestDescriptor {
    type: RequestType,
    req: PVSioWebRequest
}
export declare interface ResponseDescriptor {
    type: ResponseType,
    err?: any,
    res?: any
}