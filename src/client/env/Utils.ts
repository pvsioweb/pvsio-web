import { PVSioWebPlugin, MouseEventHandlers } from "./PVSioWeb";

/**
 * Creates a collapsible panel on the client app
 * @param opt
 * {
 * headerText: string to display in panel header
 * owner: <string> the name of the plugin that owns the panel
 * ownerObject: <object> Main class of the plugin that owns the panel. Used for forwarding key events.
 * onClick: function - handler to invoke when the panel is toggled. Argument passed to the function identifies
 * whether the panel is now collapsed (true) or not (false).
 * showContent: Whether the default initial state of the panel is open (showContent == true) or closed (showContent == true or undefined)
 * parent: the html element selector for the parent i.e., where the panel should be created
 * }
 */
export interface Panel {
    $div: JQuery<HTMLDivElement>
};
export interface TopCentralPanel extends Panel {
    $top: JQuery<HTMLDivElement>,
    $central: JQuery<HTMLDivElement>
};
export interface ResizableLeftPanel extends Panel {
    $left: JQuery<HTMLDivElement>,
    $central: JQuery<HTMLDivElement>,
    $resizeBar: JQuery<HTMLDivElement>,
};
export interface CollapsiblePanel extends Panel {
    $content: JQuery<HTMLDivElement>,
    $label: JQuery<HTMLElement>,
    $collapseBtn?: JQuery<HTMLElement>
}
/**
 * The dialog template creates a modal dialog with bootstrap. 
 * The template should be compiled with Handlebars, using option { noEscape: true }.
 * The template parameters are 'id', 'title', 'content' and 'buttons' (optional).
 * - id is a unique dialog ID. If not provided, the default id is pvsioweb-modal-center
 * - title is the title of the dialog. The title element can be found using class .modal-title
 * - content is a string providing the html elements of the main body of the dialog
 * - buttons is a string providing the html elements for the buttons. 
 *   If buttons are not specified, the dialog provides the standard Ok / Cancel buttons.
 *   The Ok / Cancel buttons can be found using classes .ok-btn / .cancel-btn
 */
export interface DialogOptions {
    id?: string,
    title?: string,
    content: HTMLElement | string,
    buttons?: HTMLElement,
    largeModal?: boolean,
    hidden?: boolean
}
export function createDialog (data: DialogOptions): JQuery<HTMLElement> {
    if (data) {
        const dialogView: string = Handlebars.compile(dialogTemplate, { noEscape: true })({
            dialogId: "pvsioweb-modal", 
            ...data
        });
        // remove old dialog, if any
        $("body").find("#pvsioweb-modal").remove();
        // append new dialog
        $("body").append(dialogView);
    }
    return $("body").find("#pvsioweb-modal");
}
export function revealDialog (): JQuery<HTMLElement> {
    return $("body").find("#pvsioweb-modal").css("display", "block");
}
export function setDialogTitle (title: string): JQuery<HTMLElement> {
    return $("body").find("#pvsioweb-modal-title").html(title);
}
export const DBLCLICK_TIMEOUT: number = 300; //ms -- if two consecutive clicks are registered in a time frame lower than this timeout, then it's a double click
export const dialogTemplate: string = `
<div class="modal fade show" id="{{dialogId}}" tabindex="-1" role="dialog" aria-labelledby="{{dialogId}}-title" aria-hidden="true" style="display:{{#if hidden}}none{{else}}block{{/if}}; opacity:0.98;">
    <div class="modal-dialog-shadow" style="width: 100%; height: 100%; position: absolute; background: black; opacity: 0.8;"></div>
    <div class="modal-dialog modal-dialog-centered{{#if largeModal}} modal-lg{{/if}}" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title tile" id="{{dialogId}}-title">{{title}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" class="cancel-btn">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                {{content}}
            </div>
            <div class="modal-footer">
                {{#if buttons}}
                {{buttons}}
                {{else}}
                    <button type="button" class="cancel-btn btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="ok-btn btn btn-primary">Ok</button>
                {{/if}}
            </div>
        </div>
    </div>
</div>`;
const collapsiblePanelTemplate: string = `
<div id="{{id}}-panel" class="collapsible-panel-parent" style="width:{{width}};">
    <div id="{{id}}-title" class="header">
        <i id="{{id}}-collapse-icon" class="icon toggle-collapse fa {{#if showContent}}fa-minus-square{{else}}fa-plus-square{{/if}}"></i>
        <span id="{{id}}-label" class="label">{{name}} {{#if showContent}}{{else}}(click to expand){{/if}}</span>
    </div>
    <div id="{{id}}-content" class="content collapsible-panel" style="display:block;"></div>
</div>
`;
export function createCollapsiblePanel (owner: PVSioWebPlugin, opt?: { 
    parent?: string, 
    showContent?: boolean, 
    isDemo?: boolean,
    handlers?: MouseEventHandlers,
    headerText?: string,
    width?: string
}): CollapsiblePanel {
    opt = opt || {};
    const parent: string = opt.parent ? `#${opt.parent}` : "body";
    const pluginId: string = owner.getId() || "";
    const pluginName: string = owner.getName() || "";
    const width: string = opt.width || "100%";
    
    const panel: string = Handlebars.compile(collapsiblePanelTemplate)({
        showContent: !!opt?.showContent,
        width: width,
        id: pluginId,
        name: pluginName
    });
    $(parent).append(panel);
    const $div: JQuery<HTMLDivElement> = $(`#${pluginId}-panel`);
    const $content: JQuery<HTMLDivElement> = $(`#${pluginId}-content`);
    const $collapseBtn: JQuery<HTMLElement> = $(`#${pluginId}-collapse-icon`);
    const $label: JQuery<HTMLElement> = $(`#${pluginId}-label`);

    if (!opt?.isDemo) {
        $collapseBtn.on("click", () => {
            console.log("click");
            if ($content.css("display") === "block") {
                $label.text(`${pluginName} (click to expand)`);
                $content.attr("style", "display: none");
                $collapseBtn.addClass("fa-plus-square").removeClass("fa-minus-square");
            } else {
                $label.text(pluginName);
                $content.attr("style", "display: block");
                $collapseBtn.removeClass("fa-plus-square").addClass("fa-minus-square");
            }
        });
    }

    $div.on("mouseover", (evt: JQuery.MouseOverEvent) => {
        $div.attr("active-panel", pluginId);
    });

    return { $div, $collapseBtn, $content, $label };
};

export function enableResizeLeft (desc: ResizableLeftPanel, opt?: { initialWidth?: number }): ResizableLeftPanel {
    opt = opt || {};
    if (desc) {
        const min: number = 20;
        const adjustPanels = (opt?: { leftWidth?: number }) => {
            opt = opt || {};
            opt.leftWidth = opt.leftWidth ||  desc.$left.width();
            const windowWidth: number = $(window).width();
            const panelWidth: number = desc.$div.width();
            const maxWidth: number = panelWidth < windowWidth ? panelWidth : windowWidth;
            const leftWidth: number = opt.leftWidth < min ? min 
                : opt.leftWidth > maxWidth ? maxWidth
                : opt.leftWidth;
            const padding: number = parseFloat(desc.$resizeBar.css("width")) * 2;
            desc.$left.css("width", leftWidth + padding);
            desc.$central.css({ "width": maxWidth - leftWidth });
        }
        const maxWidth: number = desc.$div.width();
        const leftWidth: number = opt.initialWidth || maxWidth / 4;
        desc.$left.css("width", leftWidth);
        // make side panel resizeable
        desc.$resizeBar.on("mousedown", (evt: JQuery.MouseDownEvent) => {
            evt.preventDefault();
            $('html').css({ cursor: "col-resize" });
            const onMouseMove = (evt: JQuery.MouseMoveEvent) => {
                evt.preventDefault();
                adjustPanels({ leftWidth: evt.pageX });
            };
            const onMouseUp = (evt: JQuery.MouseUpEvent | JQuery.KeyDownEvent) => {
                evt.preventDefault();
                $(window).off("mousemove", onMouseMove);
                $(window).off("mouseup", onMouseUp);
                $('html').css({ cursor: "default" });
                adjustPanels({ leftWidth: evt.pageX });
            };
            $(window).on("mousemove", onMouseMove);
            $(window).on("mouseup", onMouseUp);
            $(window).on("keydown", (evt: JQuery.KeyDownEvent) => {
                const key: string = evt.key;
                if (key === "Escape") {
                    onMouseUp(evt);
                }
            });
        });
        desc.$resizeBar.on("mouseover", (evt: JQuery.MouseOverEvent) => {
            evt.preventDefault();
            desc.$resizeBar.css({ cursor: "col-resize" });
        });
        // $(window).on("resize", (evt: JQuery.ResizeEvent) => {
        //     adjustPanels();
        // });
    }
    return desc;
}

/**
 * universal user id generator
 * @author Patrick Oladimeji
 * @date 6/4/13 15:35:54 PM
 */
export function uuid (format?: string) {
    let d: number = new Date().getTime();
    format = format || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    const uuid = format.replace(/[xy]/g, (c: string) => {
        const r: number = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

/**
 * Web Browser type utils
 */
const chrome: boolean = /Chrome\//.test(navigator.userAgent);
const firefox: boolean = /Firefox\//.test(navigator.userAgent);

export function getBrowserVersion(browserName: string): number {
    const info = navigator.userAgent.split(" ").filter((name: string) => {
        return name.indexOf(browserName) >= 0;
    }).toString().split("/");
    if (info && info.length === 2) {
        return parseFloat(info[1]);
    }
    return -1;
}

export function isBrowserSupported(): boolean {
    return chrome && getBrowserVersion("Chrome") >= 42 ||
        firefox && getBrowserVersion("Firefox") >= 37;
}

export function getVersion(): string {
    if (chrome || firefox) {
        return navigator.userAgent.split(" ").filter((name: string) => {
            return name.indexOf("Chrome") >= 0 || name.indexOf("Firefox") >= 0;
        }).toString().split("/").join(" ");
    }
    return navigator.userAgent;
}

export function requiredBrowser(): string {
    return "PVSio-web requires Chome 42 or greater, or Firefox 37 or greater";
}

export function requiredBrowserWarning(): string {
    return "Warning: " + requiredBrowser() + " (your browser is " + getVersion() + ")";
}


/**
 * MIME type utils
 */
const imageExtensions: string[] = [".jpg", ".jpeg", ".png"];
const modelExtensions: string[] = [".pvs", ".muz", ".tex", ".i", ".emdl", ".vdmsl", ".aadl", ".adb", ".ads", ".c", ".h", ".smv", ".als"];
const otherExtensions: string[] = [".txt" ]; //, ".json"];
const fileExtensions: string[] = modelExtensions.concat(imageExtensions).concat(otherExtensions);

export type FileDescriptor = { contextFolder: string, fileName: string, fileExtension: string, fileContent?: string };

export function getFileName (fname: string): string {
    return fname ? fname.substr(fname.lastIndexOf("/") + 1) : "";
}
export function getFileExtension (fname: string, opt?: { toLowerCase?: boolean }): string {
    const ans: string = fname ? fname.substr(fname.lastIndexOf(".") + 1) : "";
    return (opt?.toLowerCase) ? ans.toLocaleLowerCase() : ans;
}
export function getContextFolder (fname: string): string {
    return fname ? fname.substr(0, fname.lastIndexOf("/") + 1) : "";
}
export function desc2fname (desc: FileDescriptor): string | null {
    if (desc) {
        return `${desc.contextFolder}/${desc.fileName}${desc.fileExtension}`;
    }
    return null;
}
export const whiteGif: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const blackGif: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

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

export function removeSpaceDash (str: string): string {
    if (str) {
        return str.replace(/[\s|-]/g, "");
    }
    return str;
}

export type SimpleExpression = { type: "boolexpr" | "constexpr", binop?: string, attr?: string, constant: string };
/**
 * Lightweight parser for simple expressions with boolean constants (true/false)
 * and equality/inequality operators between attributes and constants, e.g., attr = const, attr != const
 */
export function simpleExpressionParser (expr: string | boolean): {
    res: SimpleExpression,
    err?: string
} {
    const ans = { res: null, err: null };
    if (typeof expr === "string") {
        if (expr.indexOf("!=") >= 0) {
            ans.res = expr.split("!=");
            ans.res = { type: "boolexpr", binop: "!=", attr: ans.res[0].trim(), constant: ans.res[1].trim() };
        } else if (expr.indexOf("=") >= 0) {
            ans.res = expr.split("=");
            ans.res = { type: "boolexpr", binop: "=", attr: ans.res[0].trim(), constant: ans.res[1].trim() };
        } else if (expr.toLowerCase() === "true") {
            ans.res = { type: "constexpr", constant: "true" };
        } else if (expr.toLowerCase() === "false") {
            ans.res = { type: "constexpr", constant: "false" };
        }
    } else {
        // boolean expression
        ans.res = { type: "constexpr", constant: `${expr}` };
    } 
    return ans;
}

export function resolve(state: string | {}, property: string): string {
    const pChain = property.split(".");
    let obj = state;
    let key: string = "";

    for (let i = 0; i < pChain.length && obj; i++) {
        key = pChain[i];
        obj = obj[key];
    }
    return (obj) ? (typeof obj === "string") ? obj : JSON.stringify(obj) : "";
}

/**
 * Evaluates the number contained in the string passed as argument.
 * If the value is in the form a/b, where a and b are numbers, then the funtion performs the division and returns a string representing the evaluated real value.
 * Otherwise the string is simply trimmed to remove initial and trailing white spaces.
*/
export function evaluate(str: string | number): string {
    if (str !== null && str !== undefined) {
        if (typeof str === "string") {
            str = str.trim();
            const args: string[] = str.split("/");
            if (args.length === 2 && !isNaN(+args[0]) && !isNaN(+args[1])) {
                return (+args[0] / +args[1]).toString();
            }
            return str;
        }
        return str.toString().trim();
    }
    return "";
}

/**
 * Key bindings
 * @author Paolo Masci
 * @date 2016/04/25
 */
export function getKey(charCode: number): string {
    if (charCode === 8) return "backspace"; //  backspace
    if (charCode === 9) return "tab"; //  tab
    if (charCode === 13) return "enter"; //  enter
    if (charCode === 16) return "shift"; //  shift
    if (charCode === 17) return "ctrl"; //  ctrl
    if (charCode === 18) return "alt"; //  alt
    if (charCode === 19) return "pause/break"; //  pause/break
    if (charCode === 20) return "caps lock"; //  caps lock
    if (charCode === 27) return "esc"; //  esc
    if (charCode === 32) return "space bar";
    if (charCode === 33) return "page up"; // page up, to avoid displaying alternate character and confusing people
    if (charCode === 34) return "page down"; // page down
    if (charCode === 35) return "end"; // end
    if (charCode === 36) return "home"; // home
    if (charCode === 37) return "left arrow"; // left arrow
    if (charCode === 38) return "up arrow"; // up arrow
    if (charCode === 39) return "right arrow"; // right arrow
    if (charCode === 40) return "down arrow"; // down arrow
    if (charCode === 45) return "insert"; // insert
    if (charCode === 46) return "delete"; // delete
    if (charCode === 91) return "left window"; // left window
    if (charCode === 92) return "right window"; // right window
    if (charCode === 93) return "select key"; // select key
    if (charCode === 96) return "numpad 0"; // numpad 0
    if (charCode === 97) return "numpad 1"; // numpad 1
    if (charCode === 98) return "numpad 2"; // numpad 2
    if (charCode === 99) return "numpad 3"; // numpad 3
    if (charCode === 100) return "numpad 4"; // numpad 4
    if (charCode === 101) return "numpad 5"; // numpad 5
    if (charCode === 102) return "numpad 6"; // numpad 6
    if (charCode === 103) return "numpad 7"; // numpad 7
    if (charCode === 104) return "numpad 8"; // numpad 8
    if (charCode === 105) return "numpad 9"; // numpad 9
    if (charCode === 106) return "multiply"; // multiply
    if (charCode === 107) return "add"; // add
    if (charCode === 109) return "subtract"; // subtract
    if (charCode === 110) return "decimal point"; // decimal point
    if (charCode === 111) return "divide"; // divide
    if (charCode === 112) return "F1"; // F1
    if (charCode === 113) return "F2"; // F2
    if (charCode === 114) return "F3"; // F3
    if (charCode === 115) return "F4"; // F4
    if (charCode === 116) return "F5"; // F5
    if (charCode === 117) return "F6"; // F6
    if (charCode === 118) return "F7"; // F7
    if (charCode === 119) return "F8"; // F8
    if (charCode === 120) return "F9"; // F9
    if (charCode === 121) return "F10"; // F10
    if (charCode === 122) return "F11"; // F11
    if (charCode === 123) return "F12"; // F12
    if (charCode === 144) return "num lock"; // num lock
    if (charCode === 145) return "scroll lock"; // scroll lock
    if (charCode === 186) return ";"; // semi-colon
    if (charCode === 187) return "="; // equal-sign
    if (charCode === 188) return ","; // comma
    if (charCode === 189) return "-"; // dash
    if (charCode === 190) return "."; // period
    if (charCode === 191) return "/"; // forward slash
    if (charCode === 192) return "`"; // grave accent
    if (charCode === 219) return "["; // open bracket
    if (charCode === 220) return "\\"; // back slash
    if (charCode === 221) return "]"; // close bracket
    if (charCode === 222) return "'"; // single quote
    return String.fromCharCode(charCode);
}
export const mouseButtons = { left: 0, middle: 1, right: 2 };
export function logKeyCode(event: JQuery.KeyboardEventBase): void {
    const key: string | number = event.key || event.keyCode;
    if (typeof key === "number") {
        console.log(getKey(key));
    } else {
        console.log(key);
    }
}
export function colorNameToHex(color: string): string {
    const colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (colors[color.toLowerCase()]) {
        return colors[color.toLowerCase()];
    }
    return color;
}
export function rgb2hex(col: string){
    const rgb: RegExpMatchArray = col.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ?
                ("#" + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2)) : col;
}
export function dimColor(col: string, level?: number) {
    level = level || 48;
    col = rgb2hex(colorNameToHex(col)).slice(1) || "0";
    const num: number = parseInt(col, 16);

    let r: number = (num >> 16) - level;
    r = (r > 255) ? 255 : ((r < 0) ? 0 : r);

    let b: number = ((num >> 8) & 0x00FF) - level;
    b = (b > 255) ? 255 : ((b < 0) ? 0 : b);

    let g: number = (num & 0x0000FF) - level;
    g = (g > 255) ? 255 : ((g < 0) ? 0 : g);

    return "#" + (g | (b << 8) | (r << 16)).toString(16);
}
export function fontOutlineStyle (col: string): string {
    col = col || "black";
    return `-webkit-text-fill-color: transparent; -webkit-text-stroke: 1px ${col};`;
}
