export declare type NodeJSFileDescriptor = {
    path: string,
    name?: string,
    content?: string,
    encoding?: "base64" | "utf8",
    isDirectory?: boolean,
    size?: number,
    modified?: Date,
    created?: Date,
    err?: NodeJS.ErrnoException 
}
export declare type ProjectDescriptor = {
    name: string, 
    descriptors?: NodeJSFileDescriptor[], 
    image?: string
}