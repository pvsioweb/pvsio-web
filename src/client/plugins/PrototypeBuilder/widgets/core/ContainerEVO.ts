/**
 * @module ContainerEVO
 * @version 1.0
 * @description Renders a widget container, can add MultiDisplayEVO, MenuEVO and TracingDisplayEVO, can also provide other widgets.
 *              This module provide APIs for setting up the visual appearance of the widget, e.g., font size and color.
 * @author João Linhares
 * @date August 15, 2026
 *
 */
import Handlebars = require("handlebars");
import { Connection, PVSioWebCallBack } from "../../../../common/interfaces/Connection";
import { CSS, Coords, Renderable, WidgetOptions } from "../../../../common/interfaces/Widgets";
import { MenuEVO, MenuOptions } from "./MenuEVO";
import { MultiDisplayEVO, MultiDisplayOptions } from "./MultiDisplayEVO";
import { TracingDisplayEVO, TracingDisplayOptions } from "./TracingDisplayEVO";
import { WidgetAttr, WidgetEVO } from "./WidgetEVO";

export const widget_template_title: string = `
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:0; overflow:hidden;"
    class=" noselect ">
    <span style="width:100%; height:100%; {{#each css}} {{@key}}:{{this}};{{/each}}">{{text}}</span>
</div>`;

export interface ContainerOptions extends WidgetOptions {
    containerName?: string,
    title?: Title,
    displays?: Displays,
    menu?: Menu,
    simpleTraceDisplays?: TraceDisplays,
    // Must be an array of factory functions rather than widget instances: the container's DOM element does not exist yet at construction time,
    // so any sub-widget constructed inline would fail to find its parent node.
    widgets?: { (): WidgetEVO; }[]
};

export type Menu = Omit<MenuOptions, keyof WidgetOptions | 'menuName'> & {
    position?: Position,
    size?: Size,
}

export type Displays = Omit<MultiDisplayOptions, keyof WidgetOptions | 'multiDisplaysName'> & {
    position?: Position,
    size?: Size,
}

export interface TraceDisplays {
    spacing?: number,
    traceSize?: Size,
    tracePosition?: Position,
    tracedisplays?: TraceDisplay[],
    traceCss?: CSS
}

export type TraceDisplay = Omit<TracingDisplayOptions, keyof WidgetOptions | 'tracingDisplayName'> & {
    tracingDisplayName: string,
    traceCss?: CSS,
}

export interface ContainerAttr extends WidgetAttr {
    containerName: string
};


export interface Title {
    text?: string,
    size?: Size,
    position?: Position,
    css?: CSS
}

export interface Size {
    height: number,
    width: number
}

export interface Position {
    top: number,
    left: number
}

export class ContainerEVO extends WidgetEVO {
    /**
     * Container attributes
     */
    protected attr!: ContainerAttr;

    // title

    protected titleBoolean: boolean;

    protected title: Title;

    protected callback: PVSioWebCallBack;

    protected connection: Connection | undefined;

    // Menu

    protected menu: Menu;

    protected menuWidget: WidgetEVO | null;

    // MultiDisplay

    protected multiDisplays: Displays;

    protected multiDisplaysWidget: WidgetEVO | null;

    protected traceDisplays: WidgetEVO[];

    protected traceDisplaysObject: TraceDisplays;

    // Other Widgets

    protected widgets: { (): WidgetEVO; }[]
    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = "ContainerEVO";
    getConstructorName(): string {
        return ContainerEVO.constructorName;
    }
    getDescription(): string {
        return "Suitable for rendering multiple displays for all variables of a device.";
    }
    renderSample(): void {
        this.render();
    }

    /**
     * Constructor
     */
    constructor(id: string, coords: Coords, opt?: ContainerOptions) {
        opt = opt || {};
        super(id, coords, opt);
        this.kind = "Container";
        opt.css = opt.css || {};
        this.css = { ...opt.css }
        this.css.background = opt.css?.background || opt.css["background-color"] || "transparent";
        this.css.color = opt.css?.color || "white";
        this.css.cursor = opt.css?.cursor || "default";
        this.css.overflow = opt.css?.overflow || "hidden";


        // set attributes
        this.attr.containerName = opt.containerName || id;

        // Title

        this.titleBoolean = opt?.title ? true : false;

        this.title = opt.title || { text: "Container" }
        this.title.css = this?.title?.css || {};
        this.title.css['display'] = this?.title.css['display'] || 'block'
        this.title.css['vertical-align'] = this?.title.css['vertical-align'] || 'middle'
        const titleSizeWidthOpt = Number(this.title?.size?.width);
        const titleSizeHeightOpt = Number(this.title?.size?.height);
        this.title.size = {
            width: (isNaN(titleSizeWidthOpt) || titleSizeWidthOpt <= 0) ? 200 : titleSizeWidthOpt,
            height: (isNaN(titleSizeHeightOpt) || titleSizeHeightOpt <= 0) ? 100 : titleSizeHeightOpt
        };
        const titlePositionTopOpt = Number(this.title?.position?.top);
        const titlePositionLeftOpt = Number(this.title?.position?.left);
        this.title.position = {
            top: isNaN(titlePositionTopOpt) ? 0 : titlePositionTopOpt,
            left: isNaN(titlePositionLeftOpt) ? (this.width / 2 - this.title.size.width / 2) : titlePositionLeftOpt
        };



        // Menu

        this.menu = opt?.menu || {}

        this.menuWidget = null

        // MultiDisplay

        this.multiDisplays = opt?.displays || {}

        this.multiDisplaysWidget = null

        this.connection = opt.connection;

        this.callback = opt.callback || ((err, res) => { console.warn("[container-widget] Warning: " + this.id + " does not have a callback :/"); });

        // TraceDisplays
        this.traceDisplays = []

        this.traceDisplaysObject = opt.simpleTraceDisplays || {
            tracedisplays: []
        }
        this.traceDisplaysObject.tracedisplays = this.traceDisplaysObject.tracedisplays || []

        const traceSpacingOpt = Number(opt?.simpleTraceDisplays?.spacing);
        this.traceDisplaysObject.spacing = isNaN(traceSpacingOpt) ? 0 : traceSpacingOpt;
        this.traceDisplaysObject.traceSize = opt?.simpleTraceDisplays?.traceSize || {
            width: 200,
            height: 200
        }
        this.traceDisplaysObject.tracePosition = opt?.simpleTraceDisplays?.tracePosition || {
            top: 0,
            left: 0
        }

        this.widgets = opt?.widgets || []
    }

    /**
    * Internal function, renders title
    * @param title Title options
    */
    private renderTitle(title: Title): void {

        // Build title div
        const stringTitle = Handlebars.compile(widget_template_title, { noEscape: true })({
            id: this.id + "Title",
            width: title.size?.width,
            height: title.size?.height,
            text: title?.text,
            css: title?.css,
            top: title.position?.top,
            left: title.position?.left
        });

        // get current widget menu div
        const $currentDiv = this.$base ? this.$base : this.sel2jquery(this.id)
        // append div
        $currentDiv.append(stringTitle)
    }

    /**
    * Internal function, renders displays
    * @param displays Displays options
    * @param state state
    */
    private renderDisplays(displays: Displays, state: Renderable): void {
        const topOpt = Number(displays?.position?.top);
        const leftOpt = Number(displays?.position?.left);
        const widthOpt = Number(displays?.size?.width);
        const heightOpt = Number(displays?.size?.height);
        const top = isNaN(topOpt) ? this.multiDisplays?.position?.top : topOpt;
        const left = isNaN(leftOpt) ? this.multiDisplays?.position?.left : leftOpt;
        const width = (isNaN(widthOpt) || widthOpt <= 0) ? this.multiDisplays?.size?.width : widthOpt;
        const height = (isNaN(heightOpt) || heightOpt <= 0) ? this.multiDisplays?.size?.height : heightOpt;

        this.multiDisplaysWidget = new MultiDisplayEVO(this.id + 'Displays', {
            top: top || 0,
            left: left || 0,
            width: width || this.width,
            height: height || this.height,
        }, {
            ...displays,
            parent: this.$base ? this.$base : this.id,
            renderMode: !this.matchStateFlag ? 'string' : 'state',
            callback: this.callback,
            connection: this.connection
        })

        this.multiDisplaysWidget.render(state)
    }

    /**
   * Internal function, renders menu
   * @param menu Menu options
   * @param state state
   */
    private renderMenu(menu: Menu, state: Renderable): void {

        const topOpt = Number(menu?.position?.top);
        const leftOpt = Number(menu?.position?.left);
        const widthOpt = Number(menu?.size?.width);
        const heightOpt = Number(menu?.size?.height);
        const top = isNaN(topOpt) ? this.menu?.position?.top : topOpt;
        const left = isNaN(leftOpt) ? this.menu?.position?.left : leftOpt;
        const width = (isNaN(widthOpt) || widthOpt <= 0) ? this.menu?.size?.width : widthOpt;
        let height = (isNaN(heightOpt) || heightOpt <= 0) ? this.menu?.size?.height : heightOpt;


        const buttonSizeWidthOpt = Number(menu.buttonSize?.width);
        const buttonSizeWidth = (isNaN(buttonSizeWidthOpt) || buttonSizeWidthOpt <= 0) ? 200 : buttonSizeWidthOpt;

        //Calculate Container Height if height not given
        if (!height) {
            const buttonSizeHeightOpt = Number(menu.buttonSize?.height);
            const buttonSizeHeight = (isNaN(buttonSizeHeightOpt) || buttonSizeHeightOpt <= 0) ? 200 : buttonSizeHeightOpt;
            const spacingOpt = Number(menu.spacing ?? this.menu?.spacing);
            const spacing = isNaN(spacingOpt) ? 20 : spacingOpt;
            height = buttonSizeHeight * menu.buttons!.length + spacing * (menu.buttons!.length - 1)
        }

        this.menuWidget = new MenuEVO(this.id + 'Menu', {
            top: top ?? 21,
            left: left ?? this.width - 12 - buttonSizeWidth,
            width: width || buttonSizeWidth,
            height: height,
        }, {
            ...menu,
            parent: this.$base ? this.$base : this.id,
            renderMode: !this.matchStateFlag ? 'string' : 'state',
            callback: this.callback,
            connection: this.connection
        })

        this.menuWidget.render(state)
    }

    /**
     * Renders the widget
     */
    render(state?: Renderable, opt?: ContainerOptions): void {
        opt = opt || {};

        const displays: Displays = { ...this.multiDisplays };
        Object.entries(opt?.displays || {}).forEach(([key, value]) => {
            if (value !== undefined) {
                (displays as Record<string, unknown>)[key] = value;
            }
        });
        displays.displays = opt?.displays?.displays === null ? this.multiDisplays?.displays : displays.displays
        const menu: Menu = { ...this.menu };
        Object.entries(opt?.menu || {}).forEach(([key, value]) => {
            if (value !== undefined) {
                (menu as Record<string, unknown>)[key] = value;
            }
        });
        menu.buttons = opt?.menu?.buttons === null ? this.menu?.buttons : menu.buttons

        const traceDisplaysObject = opt.simpleTraceDisplays || this.traceDisplaysObject
        traceDisplaysObject.tracedisplays = traceDisplaysObject.tracedisplays || this.traceDisplaysObject.tracedisplays!

        const traceSpacingRenderOpt = Number(traceDisplaysObject?.spacing);
        traceDisplaysObject.spacing = isNaN(traceSpacingRenderOpt) ? 0 : traceSpacingRenderOpt;
        traceDisplaysObject.traceSize = traceDisplaysObject?.traceSize || {
            width: 200,
            height: 200
        }
        traceDisplaysObject.tracePosition = traceDisplaysObject?.tracePosition || {
            top: 0,
            left: 0
        }

        const titleBoolean = opt?.title ? true : this.titleBoolean

        const title = opt.title || this.title
        title.css = title?.css || {};
        const titleSizeWidthOpt = Number(title?.size?.width);
        const titleSizeHeightOpt = Number(title?.size?.height);
        title.size = {
            width: (isNaN(titleSizeWidthOpt) || titleSizeWidthOpt <= 0) ? this.title.size!.width : titleSizeWidthOpt,
            height: (isNaN(titleSizeHeightOpt) || titleSizeHeightOpt <= 0) ? this.title.size!.height : titleSizeHeightOpt
        };
        const titlePositionTopOpt = Number(title?.position?.top);
        const titlePositionLeftOpt = Number(title?.position?.left);
        title.position = {
            top: isNaN(titlePositionTopOpt) ? this.title.position!.top : titlePositionTopOpt,
            left: isNaN(titlePositionLeftOpt) ? this.title.position!.left : titlePositionLeftOpt
        };

        this.remove()
        this.rendered = false
        // create the html element
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();

        // Remove if exists
        const titleDiv = document.getElementById(this.id + "Title")
        if (titleDiv) {
            titleDiv.parentNode?.removeChild(titleDiv);
        }
        // Render Title
        if (titleBoolean) {
            this.renderTitle(title)
        }
        //  Remove menu widget
        if (this.menuWidget != null) {
            this.menuWidget.remove()
        }
        //  Remove multi display widget
        if (this.multiDisplaysWidget != null) {
            this.multiDisplaysWidget.remove()
        }
        //  Remove tracing widgets
        if (this.traceDisplays.length > 0) {
            this.traceDisplays.forEach(t => t.remove())
            this.traceDisplays = []
        }

        //  render displays
        if (displays && displays?.displays !== null && displays?.displays !== undefined && displays?.displays.length > 0) {
            this.renderDisplays(displays, state ?? '')
        }

        //  render menu
        if (menu && menu?.buttons !== null && menu?.buttons !== undefined && menu?.buttons.length > 0) {
            this.renderMenu(menu, state ?? '')
        }

        // Render Trace Display if any
        let offset = 0
        if (traceDisplaysObject.tracedisplays.length > 0) {
            traceDisplaysObject.tracedisplays.forEach((t, i) => {
                const heightOpt = Number(traceDisplaysObject.traceSize?.height);
                const widthOpt = Number(traceDisplaysObject.traceSize?.width);
                const topOpt = Number(traceDisplaysObject.tracePosition?.top);
                const leftOpt = Number(traceDisplaysObject.tracePosition?.left);
                const height = (isNaN(heightOpt) || heightOpt <= 0) ? 200 : heightOpt;
                const width = (isNaN(widthOpt) || widthOpt <= 0) ? 200 : widthOpt;
                const top = isNaN(topOpt) ? 0 : topOpt;
                const left = isNaN(leftOpt) ? 0 : leftOpt;
                offset = i * height + i * traceDisplaysObject.spacing!
                const tracewidget = new TracingDisplayEVO(this.id + 'TraceDisplay' + i + t.tracingDisplayName,
                    {
                        width: width, height: height,
                        top: top + offset, left: left
                    },
                    {
                        ...t,
                        parent: this.$base ? this.$base : this.id,
                        renderMode: !this.matchStateFlag ? 'string' : 'state',
                        css: { ...traceDisplaysObject.traceCss, ...t.traceCss }
                    })
                tracewidget.render(state)
                this.traceDisplays.push(tracewidget)
            })
        }

        const widgets = opt?.widgets || this.widgets
        widgets.forEach(w => {
            const widget = w()
            if (!this.matchStateFlag) {
                widget.stringRenderer()
            } else {
                widget.stateRenderer()
            }
            widget.render(state)
        })
    }

    /**
     * Internal function, updates the display style
     * @param opt 
     */
    protected updateDisplayStyle(opt?: CSS): void {
        opt = opt || {};
        // set style
        this.applyCSS({ ...this.css, ...opt });
        // set line height so text is properly centered
        const lineHeight: number = parseFloat(this.css["line-height"] ?? '') || this.height;
        this.$base.css("line-height", `${lineHeight}px`);
    }

}