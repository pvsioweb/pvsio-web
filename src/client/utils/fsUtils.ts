
/**
 * MIME type utils
 */
const imageExtensions: string[] = [".jpg", ".jpeg", ".png"];
const modelExtensions: string[] = [".pvs", ".muz", ".tex", ".i", ".emdl", ".vdmsl", ".aadl", ".adb", ".ads", ".c", ".h", ".smv", ".als"];
const otherExtensions: string[] = [".txt" ]; //, ".json"];
const fileExtensions: string[] = modelExtensions.concat(imageExtensions).concat(otherExtensions);

export type FileDescriptor = { contextFolder: string, fileName: string, fileExtension: string, fileContent?: string };

export function getFileName (fname: string): string {
    let ans: string = fname || "";
    ans = ans.includes("/") ? ans.substr(ans.lastIndexOf("/") + 1) : ans;
    ans = ans.includes(".") ? ans.substr(0, ans.lastIndexOf(".")) : ans;
    return ans.trim();
}
export function getFileExtension (fname: string, opt?: { toLowerCase?: boolean }): string {
    let ans: string = fname || "";
    ans = ans.includes("/") ? ans.substr(ans.lastIndexOf("/") + 1) : ans;
    ans = ans.includes(".") ? ans.substr(ans.lastIndexOf(".")) : "";
    return (opt?.toLowerCase) ? ans.toLocaleLowerCase().trim() : ans.trim();
}
export function getContextFolder (fname: string): string {
    let ans: string = fname || "";
    ans = ans.includes("/") ? ans.substr(0, ans.lastIndexOf("/") + 1) : ans;
    return ans.trim();
}
export function desc2fname (desc: FileDescriptor): string | null {
    if (desc) {
        return `${desc.contextFolder}/${desc.fileName}${desc.fileExtension}`;
    }
    return null;
}


export function isHiddenFile (fname: string): boolean {
    return fname ? getFileName(fname).indexOf(".") === 0 : false;
};
export function isSupportedFile (fname: string): boolean {
    const ext: string = fname ? getFileExtension(fname) : null;
    return ext && fileExtensions.includes(ext);
};

export function checkExt(fname: string, legalExts: string[]): boolean {
    if (fname && typeof fname === "string") {
        const ext: string = getFileExtension(fname, { toLowerCase: true });
        if (ext && ext.length > 0) {
            return legalExts.indexOf("." + ext[0].toLowerCase()) > -1;
        }
        return false;
    }
    return false;
}

export function isImageFile (fileName: string): boolean {
    return checkExt(fileName, imageExtensions);
};

export function isModelFile (fileName: string): boolean {
    return checkExt(fileName, modelExtensions);
};

export function isPvsFile (fileName: string): boolean {
    return checkExt(fileName, [".pvs"]);
};

export function isEmuchartsFile (fileName: string): boolean {
    return checkExt(fileName, [".emdl"]);
};

export function isPimFile (fileName: string): boolean {
    return checkExt(fileName, [".muz"]);
};

export function imageFilter (desc: { path: string, isDirectory: boolean }): boolean {
    return (isHiddenFile(desc.path) === false) && (desc.isDirectory || isImageFile(desc.path));
};

export function modelFilter (desc: { path: string, isDirectory: boolean }): boolean {
    return (isHiddenFile(desc.path) === false) && (desc.isDirectory || isModelFile(desc.path));
};

export function pvsFilter (desc: { path: string, isDirectory: boolean }): boolean {
    return (isHiddenFile(desc.path) === false) && (desc.isDirectory || isPvsFile(desc.path));
};

export function filter (exts: string[]): (desc: { path: string, isDirectory: boolean }) => boolean {
    return function (desc: { path: string, isDirectory: boolean }) {
        return (isHiddenFile(desc.path) === false) && (desc.isDirectory || checkExt(desc.path, exts));
    };
};
