import { Connection, PVSioWebCallBack } from "./Connection";

/**
 * Interface implemented by pvsioweb widgets
 */
export declare interface Widget {
    /**
     * Returns the constructor name -- this is used by pvsioweb for dynamic loading of widget classes
     */ 
    getConstructorName (): string;
    /**
     * Returns the widget ID 
     */
    getId (): string;
    /**
     * Returns a human-readable string defining the widget type
     */
    getName (): string;
     /**
     * Returns the widget kind, e.g., "Touchscreen", "Button", useful for grouping together similar widgets.
     */
    getKind (): string;
    /**
     * Renders the widget
     */
    render (state?: Renderable, opt?: WidgetOptions): void;
    /**
     * Renders the widget using a pre-defined renderable, useful for demonstrating the look&feel of the widget
     */
    renderSample (opt?: CSS): void;
    /**
     * Returns a description of the widget, e.g., display for text and numbers, touchscreen, button, etc
     */
    getDescription (): string;
    /**
     * Returns the widget options
     */
    getOptions (): WidgetOptions
    /**
     * Returns a JSON representation of the characteristics of the widget
     */
    toJSON (): WidgetData;
    /**
     * Reveals the widget
     */
    reveal (): void;
    /**
     * Hides the widget
     */
    hide (): void;
    /**
     * Moves the widget
     */
    move (coords: Coords, opt?: CSS): void;
    /**
     * Resizes the widget
     */
    resize (coords: Coords, opt?: CSS): void;
    /**
     * Rotates the widget
     */
    rotate (deg: string | number, opt?: CSS): void;
    /**
     * Deletes the widget
     */
    remove (): void;
    /**
     * Selects the widget
     */
    select (opt?: CSS): void;
    /**
     * Deselects the widget
     */
    deselect (): void;
}
/**
 * JSON description of a widget
 */
export declare interface WidgetData extends HotspotData {
    name: string,
    kind: string,
    cons?: string, // constructor name
    opt?: WidgetOptions,
    evts?: string[]
}
export declare type WidgetsData = WidgetData[];
export declare interface HotspotData {
    id: string,
    coords: Coords
}
/**
 * Widget options
 */
export declare interface WidgetOptions {
    parent?: "body" | string | JQuery<HTMLElement>,
    css?: CSS,
    viz?: VizOptions,
    type?: string, // widget type, e.g., "Button", "Display"
    widget_template?: string, // HTML template for rendering the widget
    callback?: PVSioWebCallBack,
    renderMode?: "string" | "state",
    connection?: Connection
}
/**
 * Visualization options
 */
export declare type VizOptions =  {
    visible?: string | boolean,
    enabled?: string | boolean
}
/**
 * Renderable object passed as argument to the render function
 */
export declare type Renderable = string | number;
/**
 * Position and size of a widget
 */
export declare type Coords<T = string | number> = { top?: T, left?: T, width?: T, height?: T };
/**
 * CSS stylesheet
 */
export declare interface CSS {
    position?: "absolute" | "relative",
    cursor?: string,
    background?: string, // examples: "green", "#FAFAFA", "border-box red", "url('test.jpg') repeat-y"
    "background-color"?: string, // this is an alias of background
    
    "font-size"?: string,
    "font-family"?: string,

    color?: string,
    "text-align"?: string,
    border?: string,
    "border-radius"?: string,
    overflow?: "hidden" | "visible",
    opacity?: number,

    "z-index"?: number,
    "letter-spacing"?: string,
    "white-space"?: "normal" | "nowrap",
    "line-height"?: string,

    margin?: string,
    padding?: string,

    // css class
    class?: string,

    // css box-shadow
    "box-shadow"?: string, // e.g., "0px 0px 10px yellow"

    // animation options
    duration?: number,
    rotation?: string,
    transitionTimingFunction?: "ease-in" | "ease-out",
    transformOrigin?: "center",

    // the following allows to add more keys
    [key: string]: string | number
}
