/**
 * @module Widget
 * @desc Base widget implementation
 */

export type WidgetCoordinates = { top: number, left: number, width: number, height: number };
export interface WidgetOptions {
    position?: "absolute" | "relative",
    parent?: string,
    cursor?: string,
    visibleWhen?: string,
    zIndex?: number
};

const StateParser = require("util/PVSioStateParser");

export abstract class BasicWidget {

    id: string;
    type: string;

    protected parent: string;
    protected top: number;
    protected left: number;
    protected width: number;
    protected height: number;

    protected cursor: string;
    protected visibleWhen: string;
    protected zIndex: number;

    protected example: string;

    protected div: JQuery<HTMLElement>;
    protected marker;


    /**
     * Creates a new Widget
     * @constructor
     * @param {string} id The id for the widget's html element
     * @param {string} type The type of the widget
     */
    constructor (id: string, type: string, coords?: WidgetCoordinates, opt?: WidgetOptions) {
        this.id = id;
        this.type = type;

        opt = opt || {};
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";
        this.top = coords?.top || 0;
        this.left = coords?.left || 0;
        this.width = coords?.width || 12;
        this.height = coords?.height || 12;

        this.cursor = opt.cursor || "default";
        this.zIndex = opt.zIndex || 1;

        opt.position = opt.position || "absolute";

        const div: HTMLDivElement = document.createElement("div");
        $(div).attr("id", id).addClass(id).addClass("noselect");
        $(div).css({
            position: opt.position,
            top: `${this.top}px`,
            left: `${this.left}px`,
            width: `${this.width}px`,
            height: `${this.height}px`,
            margin: 0,
            padding: 0,
            display: "block",
            cursor: this.cursor,
            "z-index": this.zIndex
        });
        this.div = $(div);
        $(this.parent).append(this.div);

        this.visibleWhen = opt.visibleWhen || "true"; // default: always visible
    }

    imageMap (): JQuery<HTMLElement> {
        return null;
    }

    element (marker) {
        if (marker) {
            this.marker = marker;
        }
        return this.marker;
    }

    isVisible (opt?: { txt?: string, visibleWhen?: string }): boolean {
        const visibleWhen: string = opt.visibleWhen || this.visibleWhen;
        const expr: { res: { type: string, constant?: string, attr?: string, binop?: string }} = StateParser.simpleExpressionParser(visibleWhen);
        if (expr && expr.res) {
            if (expr.res.type === "constexpr" && expr.res.constant === "true") {
                return true;
            } else if (expr.res.type === "boolexpr" && expr.res.binop) {
                let str: string = StateParser.resolve(opt.txt, expr.res.attr);
                if (str) {
                    str = StateParser.evaluate(str);
                    if ((expr.res.binop === "=" && str === expr.res.constant) ||
                            (expr.res.binop === "!=" && str !== expr.res.constant)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getCoords(): {
        top: number, left: number, width: number, height: number
    } {
        const elem: JQuery<HTMLElement> = $(`#${this.id}`);
        if (elem && elem[0]) {
            return {
                top: +elem.attr("y"),
                left: +elem.attr("x"),
                width: +elem.attr("width"),
                height: +elem.attr("height")
            }
        }
        console.log(`[Widget] Warning: could not find widget ${this.id}`);
        return { top: 0, left: 0, width: 0, height: 0 };
    }

    /**
     * Removes the widget from the interface
     * @memberof Widget
     */
    remove (): void {
        $(`#${this.id}`)?.remove();
    };
    /**
     * Removes the widget from the interface
     * @memberof Widget
     */
    updateStyle (data): void {
        // this function is overloaded by widgets supporting style attributes, e.g., displays
        // for widgets without style (e.g. buttons), the function does nothing
    };
    /**
     * Updates the location and size of the widget to the new position
     * @param {{x: number, y: number, width: number, height: number}} pos The new position  and size of the widget
     * @returns {BasicWidget}
     * @memberof Widget
    */
    updateLocationAndSize (pos: { x?: number, y?: number, width?: number, height?: number }): void {
        if (pos) {
            this.top = isFinite(pos.y) ? pos.y : this.top;
            this.left = isFinite(pos.x) ? pos.x : this.left;
            this.width = isFinite(pos.width) ? pos.width : this.width;
            this.height = isFinite(pos.height) ? pos.height : this.height;
            $(`#${this.id}`).css({
                left: `${this.left}px`,
                top: `${this.top}px`,
                width: `${this.width}px`,
                height: `${this.height}px`
            });
        } else {
            console.warn(`[Widget] Warning: updateLocationAndSize invoked with null position`);
        }
    };

    hide (): void {
        this.div.css("display", "none");
    };

    reveal (): void {
        this.div.css("display", "block");
    };

    move (data: { top?: number, left?: number }): void {
        data = data || {};
        if (data.top !== null && data.top !== undefined) {
            this.top = data.top;
            this.div.css("top", `${this.top}px`);
        }
        if (data.left !== null && data.left !== undefined) {
            this.left = data.left;
            this.div.css("left", `${this.left}px`);
        }
    };



}
