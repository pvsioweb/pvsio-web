import { PVSioWebPlugin, MouseEventHandlers } from "../env/PVSioWeb";
import { WidgetsData } from "../plugins/PrototypeBuilder/views/BuilderView";

/**
 * Creates a collapsible panel on the client app
 * @param opt
 * {
 * headerText: string to display in panel header
 * owner: <string> the name of the plugin that owns the panel
 * ownerObject: <object> main class of the plugin that owns the panel. Used for forwarding key events.
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
export interface SplitPanel extends Panel {
    $left: JQuery<HTMLDivElement>,
    $central: JQuery<HTMLDivElement>,
    $resizeBar: JQuery<HTMLDivElement>,
    onResize (size: { width: string, height: string }): void,
    disableResize?: boolean
};
export interface StickyPanel extends Panel {
    $content: JQuery<HTMLDivElement>,
    $navbar: JQuery<HTMLElement>
};
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
};
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
    return $("body").find("#pvsioweb-modal").css({ position: "absolute", overflow: "auto" });
}
export function revealDialog (): JQuery<HTMLElement> {
    return $("body").find("#pvsioweb-modal").css("display", "block");
}
export function setDialogTitle (title: string): JQuery<HTMLElement> {
    return $("body").find("#pvsioweb-modal-title").html(title);
}
/**
 * Basic dialog with Yes Cancel buttons
 * @param message 
 */
export type YesCancel = "yes" | "cancel";
export async function showYesCancelDialog (message: string): Promise<YesCancel> {
    const $dialog: JQuery<HTMLElement> = createDialog({
        content: message
    });
    return new Promise ((resolve, reject) => {
        $dialog.find(".ok-btn").on("click", (evt: JQuery.ClickEvent) => {
            $dialog.remove();
            resolve("yes");
        });
        $dialog.find(".cancel-btn").on("click", (evt: JQuery.ClickEvent) => {
            $dialog.remove();
            resolve("cancel");
        });
    });
}
export const DBLCLICK_TIMEOUT: number = 300; //ms -- if two consecutive clicks are registered in a time frame lower than this timeout, then it's a double click
export const dialogTemplate: string = `
<div class="modal fade show" id="{{dialogId}}" tabindex="-1" role="dialog" aria-labelledby="{{dialogId}}-title" aria-hidden="true" style="display:{{#if hidden}}none{{else}}block{{/if}};">
    <div class="modal-dialog-shadow" style="width:100%; height:100%; position:fixed; background: black; opacity: 0.8;"></div>
    <div class="modal-dialog modal-dialog-centered{{#if largeModal}} modal-lg{{/if}}" role="document">
        <div class="modal-content" style="transform:scale(0.8); transform-origin:top;">
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
const stickyPanelTemplate: string = `
<style>
.pvsioweb-sticky-panel {
    display: block;
    position: sticky;
    top: {{top}}px;
}
.pvsioweb-sticky-panel span {
    font-size: small;
}
.pvsioweb-sticky-panel-content {
    top: {{top}}px;
    margin-top: {{margin-top}}px;
}
.navbar .btn {
    font-size: small;
}
.navbar .btn-group {
    border: 1px solid white;
    border-radius: 4px;
}
</style>
<div id="{{id}}-panel" class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap py-0 px-1 shadow pvsioweb-sticky-panel">
    <span class="navbar navbar-brand container-fluid px-1">
        <div class="btn-group" role="group">
            {{navbarLeft}}
        </div>
        <div class="btn-group" role="group">
            {{navbarCentral}}
        </div>
        {{#if navbarRight}}
        <div class="btn-group" role="group">
            {{navbarRight}}
        </div>
        {{else}}
        <div></div>
        {{/if}}
    </span>
</div>
<div id="{{id}}-content" class="content collapsible-panel pvsioweb-sticky-panel-content {{#if showContent}}show{{/if}}"></div>
`;
const menuTemplate: string = `
<div id="{{menuId}}" class="fade show" style="position:absolute;width:0px;height:0px;top:{{top}}px;left:{{left}}px;">
    <div class="dropdown-menu show">
        {{#each items}}
        {{#if name}}<a class="dropdown-item{{#if disabled}} disabled{{/if}}" href="#" action="{{name}}">{{icon}}{{name}}</a>{{else}}<div class="dropdown-divider"></div>{{/if}}
        {{/each}}
    </div>
</div>
`;
export interface MenuData {
    id?: string,
    top?: number | string,
    left?: number | string,
    title?: string,
    items: MenuItem[]
};
export type MenuItem = string | { name: string, icon?: string, disabled?: boolean };
export function createMenu (data: MenuData): JQuery<HTMLElement> {
    if (data) {
        const top: number = parseFloat(`${data.top}`);
        const left: number = parseFloat(`${data.left}`);
        const menuView: string = Handlebars.compile(menuTemplate, { noEscape: true })({
            menuId: "pvsioweb-menu", 
            top,
            left,
            items: data.items.map((item: MenuItem) => {
                return typeof item === "string" ? item 
                    : item.disabled ? { name: item.name, icon: item.icon, disabled: true }
                        : { name: item.name, icon: item.icon };
            })
        });
        // remove old dialog, if any
        $("body").find("#pvsioweb-menu").remove();
        // append new dialog
        $("body").append(menuView);
    }
    return $("body").find("#pvsioweb-menu");
}
export function openContextMenu (): JQuery<HTMLElement> {
    return $("body").find("#pvsioweb-menu").css("display", "block");
}
export function closeContextMenu (): JQuery<HTMLElement> {
    return $("body").find("#pvsioweb-menu").css("display", "none");
}
export function deleteContextMenu (): JQuery<HTMLElement> {
    return $("body").find("#pvsioweb-menu").remove();
}
/**
 * Utility function, returns the height of the pvsioweb navbar
 */
export function getToolkitNavbarHeight (): number {
    const isVisible: boolean = $(document).find(".toolkit-navbar").css("display") !== "none";
    if (isVisible) {
        const height: string = $(document).find(".toolkit-navbar").css("height");
        const ans: number = parseFloat(height);
        return isNaN(ans) ? 0 : ans;
    }
    return 0;
}
/**
 * Utility function, creates a panel with a sticky navbar
 * @param owner 
 * @param opt 
 */
export function createStickyPanel (owner: PVSioWebPlugin, opt?: { 
    parent?: string, 
    handlers?: MouseEventHandlers,
    navbarLeft?: string,
    navbarCentral?: string,
    navbarRight?: string,
    width?: string,
    top?: number
}): StickyPanel {
    opt = opt || {};
    const parent: string = opt.parent && opt.parent !== "body" ? `#${opt.parent}` : "body";
    const pluginId: string = owner.getId() || "";
    const pluginName: string = owner.getName() || "";
    const width: string = opt.width || "100%";
    const top: number = opt.top || getToolkitNavbarHeight() || 0;

    console.log(`[pvsioweb-utils] Creating panel, parent is ${parent}`);
    
    const panel: string = Handlebars.compile(stickyPanelTemplate, { noEscape: true })({
        ...opt,
        width,
        top,
        "margin-top": top,
        id: pluginId,
        name: pluginName
    });
    $(parent).append(panel);
    const $div: JQuery<HTMLDivElement> = $(`#${pluginId}-panel`);
    const $content: JQuery<HTMLDivElement> = $(`#${pluginId}-content`);
    const $navbar: JQuery<HTMLElement> = $div.find(".navbar");

    $div.on("mouseover", (evt: JQuery.MouseOverEvent) => {
        $div.attr("active-panel", pluginId);
    });

    return { $div, $content, $navbar };
};

export function enableResizeLeft (desc: SplitPanel, opt?: { initialWidth?: number }): SplitPanel {
    opt = opt || {};
    if (desc) {
        const min: number = 10;
        // const initialWindowWidth: number = $(window).width();
        const initialPanelWidth: number = desc.$div.width();
        // const initialMaxWidth: number = initialPanelWidth < initialWindowWidth ? 
        //         initialPanelWidth : initialWindowWidth;
        const padding: number = parseFloat(desc.$resizeBar.css("width")) * 2;
        let leftWidth: number = opt.initialWidth || initialPanelWidth / 4;
        const adjustPanels = (opt?: { leftWidth?: number }) => {
            opt = opt || {};
            opt.leftWidth = opt.leftWidth ||  desc.$left.width();
            const windowWidth: number = $(window).width();
            const panelWidth: number = desc.$div.width();
            const maxWidth: number = panelWidth < windowWidth ? panelWidth : windowWidth;
            const rightWidth: number = maxWidth - leftWidth - 2 * padding;
            leftWidth = opt.leftWidth < min ? min 
                : opt.leftWidth > maxWidth ? maxWidth
                : opt.leftWidth;
            desc.$left.css("width", leftWidth);
            desc.$central.css({
                "width": rightWidth
            });
        }
        desc.$left.css("width", leftWidth);
        // make side panel resizeable
        desc.$resizeBar.on("mousedown", (evt: JQuery.MouseDownEvent) => {
            evt.preventDefault();
            $('html').css({ cursor: "col-resize" });
            const onMouseMove = (evt: JQuery.MouseMoveEvent) => {
                evt.preventDefault();
                adjustPanels({ leftWidth: evt.pageX });
                if (desc?.onResize) {
                    desc.onResize({ width: desc.$central.css("width"), height: desc.$central.css("height") });
                }
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
            if (!desc.disableResize) {
                evt.preventDefault();
                desc.$resizeBar.css({ cursor: "col-resize" });
            }
        });
        $(window).on("resize", (evt: JQuery.ResizeEvent) => {
            if (!desc.disableResize) {
                adjustPanels({ leftWidth });
            }
        });
        adjustPanels({ leftWidth });
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
    format = format || 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx';
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

export const transparentGif: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export function removeSpaceDash (str: string): string {
    if (str) {
        return str.replace(/[\s|-]/g, "");
    }
    return str;
}

export interface DropdownMenuData {
    id: string,
    name: string,
    content: string,
    style?: string
};
export const dropdownMenuTemplate = `
<div class="dropdown mr-1 panel-menu">
    <button type="button" class="btn btn-sm btn-dark dropdown-toggle" id="{{id}}" data-toggle="dropdown">{{name}}</button>
    {{#if style}}<style>{{style}}</style>{{/if}}
    <div class="dropdown-menu {{id}}" aria-labelledby="{{id}}">
        {{content}}
    </div>
</div>
`;

export interface InlineMenuData {
    id: string,
    name: string,
    buttons: string[],
    style?: string
};
export const inlineMenuTemplate = `
<div class="mr-2 panel-menu dropdown">
    {{#if style}}<style>{{style}}</style>{{/if}}
    {{#each buttons}}
        {{this}}
    {{/each}}
</div>
`;

/**
 * JQuery.MouseDownEvent.button
 */
export const mouseButtons = { left: 0, middle: 1, right: 2 };

/**
 * JQuery.KeyDownEvent.code
 */
export enum keyCodes {
    Backspace = "Backspace",
    Tab = "Tab",
    Enter = "Enter",
    ShiftLeft = "ShiftLeft",
    ShiftRight = "ShiftRight",
    ControlLeft = "ControlLeft",
    ControlRight = "ControlRight",
    AltLeft = "AltLeft",
    AltRight = "AltRight",
    MetaLeft = "MetaLeft",
    MetaRight = "MetaRight",
    CapsLock = "CapsLock",
    Escape = "Escape",
    SPACE = "Space",
    ArrowLeft = "ArrowLeft",
    ArrowUp = "ArrowUp",
    ArrowRight = "ArrowRight",
    ArrowDown = "ArrowDown",
    Semicolon = "Semicolon",
    Equal = "Equal",
    Comma = "Comma",
    Minus = "Minus",
    Period = "Period", // '.'
    Slash = "Slash",
    Backslash = "Backslash", // '\'
}
/**
 * standard CSS colors
 */
export const cssColors = {
    "aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
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
    "yellow":"#ffff00","yellowgreen":"#9acd32"
};
/**
 * Selected animate.css classes
 */
export const animateCssClasses: string[] = [
    "animated flash",
    "animated pulse",
    "animated fadeIn",
    "animated flip",
    "animated zoomIn",
];
/**
 * CSS cursor styles
 */
export const cssCursorClasses: string[] = [
    "default",
    "alias",
    "all-scroll",
    "auto",    
    "cell",    
    "context-menu",
    "col-resize",
    "copy",
    "crosshair",    
    "e-resize",
    "ew-resize",
    "grab",
    "grabbing",    
    "help",
    "move",
    "n-resize",
    "ne-resize",
    "nesw-resize",
    "ns-resize",
    "nw-resize",
    "nwse-resize",
    "no-drop",
    "none",
    "not-allowed",
    "pointer",
    "progress",
    "row-resize",
    "s-resize",
    "se-resize",
    "sw-resize",
    "text",
    "url",
    "w-resize",
    "wait",
    "zoom-in",
    "zoom-out"
];
/**
 * Utility function, finds out the hex values of a given color
 * @param color 
 */
export function colorNameToHex(color: string): string {
    const name: string = color.toLowerCase();
    if (cssColors[name]) {
        return cssColors[name];
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
    return `
    -webkit-text-fill-color: transparent; -webkit-text-stroke: 1px ${col};`;
}

export const colors = {
    blue: "#007bff"
};