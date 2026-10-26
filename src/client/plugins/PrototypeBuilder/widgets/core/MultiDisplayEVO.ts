/**
 * @module MultiDisplayEVO
 * @version 1.0
 * @description Renders a multiple display widget.
 *              This module provide APIs for setting up the visual appearance of the widget, e.g., font size and color.
 * @author João Linhares
 * @date August 15, 2026
 *
 */
import Handlebars = require("handlebars");
import { CSS, Coords, Renderable, WidgetOptions } from "../../../../common/interfaces/Widgets";
import { MatchState, WidgetAttr, WidgetEVO, rat2real, ratNumberMatch } from "./WidgetEVO";

export const widget_template_display: string = `
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; {{#each css}} {{@key}}:{{this}};{{/each}};"
    class=" noselect ">
    {{#if label}}<span style="{{#each cssLabel}} {{@key}}:{{this}};{{/each}}">{{label}}</span>{{/if}}<span style="{{#each cssDisplay}} {{@key}}:{{this}};{{/each}}">{{value}}</span>
</div>`;

export interface MultiDisplayOptions extends WidgetOptions {
    multiDisplaysName?: string,
    displays?: Display[], // displays array
    globalValueCss?: CSS, // display value css  - adds and/or overrides custom css to displayCss
    globalLabelCss?: CSS, // display label css - adds and/or overrides custom css to displayCss
    globalDisplayCss?: CSS, // display value and label div css
    globalDisplaySize?: Size, // global display size
    mode?: 'vertical' | 'horizontal' | 'grid', // orientation of displays - horizontal, vertical and grid
    numberOfColumns?: number, // number of columns in case mode is grid
    numberOfRows?: number, // number of rows in case mode is grid
    spacing?: number, // spacing between displays
    spacingVertical?: number, // vertical spacing between displays, if not listed the value from spacing is used
    spacingHorizontal?: number, // horizontal spacing between displays, if not listed the value from spacing is used
    center?: boolean, // centers displays in the main widget area
    gridPriority?: 'fillRowFirst' | 'fillColumnsFirst' // in grid mode, given its displays fills row or column first, good for when center is true
    groupRegionSize?: Size, // Size of region where the group of displays without position set will stay, if not given it will be used the entire widget area
    groupRegionPosition?: Position, // Position of region where the group of displays without position set will stay, if not given it will be at (0,0) coordinates
};


export interface MultiDisplayAttr extends WidgetAttr {
    multiDisplaysName: string,
    mode: 'vertical' | 'horizontal' | 'grid',
    gridPriority: 'fillRowFirst' | 'fillColumnsFirst'
};

export interface Display {
    displayName: string,
    valueCss?: CSS, // display value css - adds and/or overrides custom css to globalValueCss
    labelCss?: CSS, // display label css - adds and/or overrides custom css to globalLabelCss
    displayCss?: CSS, // isplay value and label div css - adds and/or overrides custom css to globalDisplayCss
    position?: Position, // position - overrides calculated position by widget
    size?: Size, // size - overrides globalDisplaySize when position its set
    mapName?: Object, // maps its value into a Name
    mapColors?: Object, // maps its value into a certain color
    label?: string, // label text if any
    unit?: string // unit if any
}

export interface Size {
    height: number,
    width: number
}

export interface Position {
    top: number,
    left: number
}

export class MultiDisplayEVO extends WidgetEVO {
    /**
     * MultiDisplay attributes
     */
    protected attr!: MultiDisplayAttr;

    protected numberOfColumns: number;

    protected numberOfRows: number;

    protected center: boolean;

    protected spacing: number;

    protected spacingVertical: number;

    protected spacingHorizontal: number;

    // Displays
    protected displays: Display[];
    protected displaysWithoutPositionArray: Display[];

    // Global Display Properties
    protected globalValueCss: CSS // display prop,
    protected globalLabelCss: CSS
    protected globalDisplayCss: CSS
    protected globalDisplaySize: Size;

    protected numberDisplaysWithoutPosition: number;

    protected groupRegionSize: Size // Size of region where the group of displays without position set will stay, if not given it will be used the entire widget area
    protected groupRegionPosition: Position // Position of region where the group of displays without position set will stay, if not given it will be at (0,0) coordinates

    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = "MultiDisplayEVO";
    getConstructorName(): string {
        return MultiDisplayEVO.constructorName;
    }
    getDescription(): string {
        return "Suitable for rendering multiple displays.";
    }
    renderSample(): void {
        this.render();
    }

    /**
    * Internal function, calculates number of displays without position
    * @param displays Displays Array
    */
    private numberOfDisplayWithoutPosition(displays: Display[]): number {
        return displays.filter(d => !d?.position).length
    }

    /**
    * Internal function, returns filtered display array with displaus without positions
    * @param displays Displays Array
    */
    private displayWithoutPosition(displays: Display[]): Display[] {
        return displays.filter(d => !d?.position)
    }
    /**
     * Constructor
     */
    constructor(id: string, coords: Coords, opt?: MultiDisplayOptions) {
        opt = opt || { displays: [] };
        super(id, coords, opt);
        this.kind = "Display";
        opt.css = opt.css || {};
        this.css = { ...opt.css }
        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css.background = opt.css?.background || opt.css["background-color"] || "transparent";
        this.css.color = opt.css?.color || "white";
        this.css.cursor = opt.css?.cursor || "default";
        this.css.overflow = opt.css?.overflow || "hidden";


        this.globalDisplayCss = { ...opt.globalDisplayCss }
        this.globalDisplayCss["z-index"] = this?.globalDisplayCss["z-index"] || 0;
        this.globalDisplayCss["display"] = this?.globalDisplayCss["display"] || 'flex';
        this.globalDisplayCss["flex-direction"] = this?.globalDisplayCss["flex-direction"] || 'row';
        this.globalDisplayCss["align-items"] = this?.globalDisplayCss["align-items"] || 'center';
        this.globalDisplayCss["gap"] = this?.globalDisplayCss["gap"] || '4px';
        this.globalDisplayCss["justify-content"] = this?.globalDisplayCss["justify-content"] || 'center';

        // set attributes
        this.attr.multiDisplaysName = opt.multiDisplaysName || id;

        this.attr.mode = opt?.mode || 'vertical';
        this.attr.gridPriority = opt.gridPriority || 'fillRowFirst';
        this.center = opt.center || false;
        const numberOfColumnsOpt = Number(opt.numberOfColumns);
        this.numberOfColumns = (isNaN(numberOfColumnsOpt) || numberOfColumnsOpt < 1) ? 3 : Math.floor(numberOfColumnsOpt);
        const numberOfRowsOpt = Number(opt.numberOfRows);
        this.numberOfRows = (isNaN(numberOfRowsOpt) || numberOfRowsOpt < 1) ? 3 : Math.floor(numberOfRowsOpt);


        this.displays = opt.displays || [];
        this.numberDisplaysWithoutPosition = this.numberOfDisplayWithoutPosition(this.displays)
        this.displaysWithoutPositionArray = this.displayWithoutPosition(this.displays)

        // create style options for display

        this.globalValueCss = { ...opt.globalValueCss };

        // default display properties
        this.globalDisplayCss.background = this.globalDisplayCss?.background || this.globalDisplayCss["background-color"] || "transparent";
        this.globalDisplayCss.color = this.globalDisplayCss?.color || this?.globalDisplayCss["color"] || "black";
        this.globalDisplayCss["font-size"] = this?.globalDisplayCss["font-size"] || "16";
        this.globalDisplayCss.overflow = this?.globalDisplayCss?.overflow || "hidden";

        this.globalLabelCss = { ...opt.globalLabelCss };

        const groupRegionPositionTopOpt = Number(opt?.groupRegionPosition?.top);
        const groupRegionPositionLeftOpt = Number(opt?.groupRegionPosition?.left);
        this.groupRegionPosition = {
            top: isNaN(groupRegionPositionTopOpt) ? 0 : groupRegionPositionTopOpt,
            left: isNaN(groupRegionPositionLeftOpt) ? 0 : groupRegionPositionLeftOpt
        };
        const groupRegionSizeHeightOpt = Number(opt?.groupRegionSize?.height);
        const groupRegionSizeWidthOpt = Number(opt?.groupRegionSize?.width);
        this.groupRegionSize = {
            height: (isNaN(groupRegionSizeHeightOpt) || groupRegionSizeHeightOpt <= 0) ? this.height : groupRegionSizeHeightOpt,
            width: (isNaN(groupRegionSizeWidthOpt) || groupRegionSizeWidthOpt <= 0) ? this.width : groupRegionSizeWidthOpt
        };

        // Spacing between displays and each display size

        const spacingOpt = Number(opt.spacing);
        this.spacing = isNaN(spacingOpt) ? 20 : spacingOpt;

        const spacingVerticalOpt = Number(opt.spacingVertical);
        this.spacingVertical = isNaN(spacingVerticalOpt) ? this.spacing : spacingVerticalOpt;

        const spacingHorizontalOpt = Number(opt.spacingHorizontal);
        this.spacingHorizontal = isNaN(spacingHorizontalOpt) ? this.spacing : spacingHorizontalOpt;

        const globalDisplaySizeHeightOpt = Number(opt.globalDisplaySize?.height);
        const globalDisplaySizeWidthOpt = Number(opt.globalDisplaySize?.width);
        this.globalDisplaySize = {
            height: (isNaN(globalDisplaySizeHeightOpt) || globalDisplaySizeHeightOpt <= 0) ? 200 : globalDisplaySizeHeightOpt,
            width: (isNaN(globalDisplaySizeWidthOpt) || globalDisplaySizeWidthOpt <= 0) ? 200 : globalDisplaySizeWidthOpt
        };

    }

    /**
    * Internal function, calculates shift in pixels so that the displays stay vertically centered in the main widget area
    * @param height Height of the main widget area
    * @param numberDisplays Number of displays
    * @param center Bool that determines if displays  have to be centered on the widget area
    * @param spacingVertical Vertical Spacing
    */
    private calculateCenterVerticalShift(height: number, numberDisplays: number, center: boolean, spacingVertical: number): number {
        if (!center) return 0
        let sizeAllDisplays = spacingVertical * (numberDisplays - 1)

        sizeAllDisplays += this.globalDisplaySize.height * numberDisplays

        let skip = 0

        skip += height / 2 - sizeAllDisplays / 2

        return skip

    }

    /**
   * Internal function, calculates shift in pixels so that the displays stay horizontaly centered in the main widget area
   * @param width Width of the main widget area
   * @param numberDisplays Number of displays
   * @param center Bool that determines if displays  have to be centered on the widget area
   * @param spacingHorizontal Horizontal Spacing
   */
    private calculateCenterHorizontalShift(width: number, numberDisplays: number, center: boolean, spacingHorizontal: number): number {
        if (!center) return 0


        let sizeAllDisplays = spacingHorizontal * (numberDisplays - 1)

        sizeAllDisplays += this.globalDisplaySize.width * numberDisplays

        let skip = 0

        skip += width / 2 - sizeAllDisplays / 2

        return skip

    }

    /**
    * Internal function, gets value from state given a key
    * @param state State
    * @param key Key
    */
    private getValue(state?: Renderable, key?: string): string {

        if (state !== undefined && state !== null) {
            if (this.matchStateFlag) {
                // Return match from state
                const name: string = key ?? ''
                const match: MatchState | null = (typeof state === "string") ?
                    this.matchState(state, name)
                    // @ts-ignore: state is used as object at runtime
                    : { name, val: state[name] };
                if (match) {
                    // check if this is a rational number -- don't use directly rat2real 
                    // because the state may be a string that resembles a number, e.g., "2.", 
                    // and rat2real would translate it into number 2 (i.e., the '.' gets removed, 
                    // which is not what we want for non-numeric displays)
                    const matchRat: RegExpMatchArray | null = new RegExp(ratNumberMatch).exec(match.val);
                    if (matchRat) {
                        const val: number = rat2real(match.val);
                        const disp: string = isNaN(val) ? `${match.val}` : `${val}`;
                        return disp
                    } else {
                        return match.val
                    }
                }
                // If it doesnt match returns key
                return key ?? ''
            }
        }
        return key ?? ''
    }

    /**
    * Internal function, builds single display
    * @param display Display properties
    * @param top Top placement value
    * @param left Left placement value
    * @param i Display number
    * @param state State
    * @param opt MultiDisplauOptions
    */
    private buildDisplay(display: Display, top: number, left: number, i: number, state: Renderable, opt: MultiDisplayOptions): void {

        const globalValueCss = opt?.globalValueCss || this.globalValueCss

        const globalLabelCss = opt?.globalLabelCss || this.globalLabelCss

        const globalDisplayCss = opt?.globalDisplayCss || this.globalDisplayCss

        // Get value from state
        const value = this.getValue(state, display.displayName)

        // Get value Css, adds to globalValueCss the desired valueCss if its disired for that display value to be different from the others, and adds mapColors if its disired for the value display to have a color depending on value
        const cssValue = { ...globalValueCss, ...display.valueCss ? display.valueCss : {}, ...display.mapColors ? { color: (display.mapColors as Record<string, string>)[value] } : {} }

        // Get label Css, adds to globalLabelCss the desired labelCss if its disired for that display label to be different from the others
        const cssLabel = { ...globalLabelCss, ...display.labelCss ? display.labelCss : {} }

        const cssValueLabelDiv = { ...globalDisplayCss, ...display.displayCss ? display.displayCss : {} }
        // If there is a mapName with the value maps to a certain Name, gets the mapped name
        const valueString = display.mapName ? (display.mapName as Record<string, string>)[value] : value

        const displaySizeWidthOpt = Number(display.size?.width);
        const displaySizeHeightOpt = Number(display.size?.height);
        const width = display.position && display.size && !isNaN(displaySizeWidthOpt) && displaySizeWidthOpt > 0 ? displaySizeWidthOpt : this.globalDisplaySize.width;
        const height = display.position && display.size && !isNaN(displaySizeHeightOpt) && displaySizeHeightOpt > 0 ? displaySizeHeightOpt : this.globalDisplaySize.height;
        // Build title div
        const displayTitle = Handlebars.compile(widget_template_display, { noEscape: true })({
            id: display.displayName ? this.id + "Display" + i + display.displayName : this.id + "Display" + i,
            width: width,
            height: height,
            label: display.label,
            value: display.unit ? valueString + " " + display.unit : valueString,
            cssDisplay: cssValue,
            cssLabel: cssLabel,
            top: top,
            left: left,
            css: cssValueLabelDiv
        });

        // get current widget menu div
        const $currentDiv = this.$base ? this.$base : this.sel2jquery(this.id);
        // append div
        $currentDiv.append(displayTitle)
    }

    /**
    * Internal function, calculates position for all displays and builds them
    * @param state State
    * @param opt MultiDisplauOptions
    */
    private buildDisplays(state: Renderable, opt: MultiDisplayOptions): void {

        const displays = opt.displays || this.displays
        const numberDisplaysWithoutPosition = opt?.displays ? this.numberOfDisplayWithoutPosition(displays) : this.numberDisplaysWithoutPosition
        const mode = opt?.mode || this.attr.mode

        const gridPriority = opt?.gridPriority || this.attr.gridPriority

        const numberOfColumnsRenderOpt = Number(opt?.numberOfColumns);
        const numberOfColumns = (isNaN(numberOfColumnsRenderOpt) || numberOfColumnsRenderOpt < 1) ? this.numberOfColumns : Math.floor(numberOfColumnsRenderOpt)

        const numberOfRowsRenderOpt = Number(opt?.numberOfRows);
        const numberOfRows = (isNaN(numberOfRowsRenderOpt) || numberOfRowsRenderOpt < 1) ? this.numberOfRows : Math.floor(numberOfRowsRenderOpt)

        const spacingRenderOpt = Number(opt?.spacing);
        const spacing = isNaN(spacingRenderOpt) ? this.spacing : spacingRenderOpt;

        const spacingVerticalRenderOpt = Number(opt?.spacingVertical);
        const spacingVertical = !isNaN(spacingVerticalRenderOpt) ? spacingVerticalRenderOpt
            : !isNaN(spacingRenderOpt) ? spacing
                : this.spacingVertical;

        const spacingHorizontalRenderOpt = Number(opt?.spacingHorizontal);
        const spacingHorizontal = !isNaN(spacingHorizontalRenderOpt) ? spacingHorizontalRenderOpt
            : !isNaN(spacingRenderOpt) ? spacing
                : this.spacingHorizontal;

        const center = opt?.center ?? this.center

        const groupRegionPositionTopRenderOpt = Number(opt?.groupRegionPosition?.top);
        const groupRegionPositionLeftRenderOpt = Number(opt?.groupRegionPosition?.left);
        const groupRegionPosition = {
            top: isNaN(groupRegionPositionTopRenderOpt) ? this.groupRegionPosition.top : groupRegionPositionTopRenderOpt,
            left: isNaN(groupRegionPositionLeftRenderOpt) ? this.groupRegionPosition.left : groupRegionPositionLeftRenderOpt
        };
        const groupRegionSizeHeightRenderOpt = Number(opt?.groupRegionSize?.height);
        const groupRegionSizeWidthRenderOpt = Number(opt?.groupRegionSize?.width);
        const groupRegionSize = {
            height: (isNaN(groupRegionSizeHeightRenderOpt) || groupRegionSizeHeightRenderOpt <= 0) ? this.groupRegionSize.height : groupRegionSizeHeightRenderOpt,
            width: (isNaN(groupRegionSizeWidthRenderOpt) || groupRegionSizeWidthRenderOpt <= 0) ? this.groupRegionSize.width : groupRegionSizeWidthRenderOpt
        };

        let accum = 0 // accumulator for all the spacing between displays without position provided
        let inc = 0 // accumulator for number of displays without position provided
        let incHorizontal = 0 // accumulator for number of horizontal displays in grid mode without position provided
        let incVertical = 0 // accumulator for number of vertical displays in grid mode without position provided
        let accumVertical = 0 // accumulator for all the vertical spacing between displays without position provided
        let accumHorizontal = 0 // accumulator for all the horizontal spacing between displays without position provided
        const skip_x = groupRegionPosition.left // Skip x pixels so the group of displays without position stay in the correct area of the widget
        const skip_y = groupRegionPosition.top // Skip y pixels so the group of displays without position stay in the correct area of the widget

        let numberDisplayColumn
        let numberDisplayRow

        if (mode === 'vertical') {
            numberDisplayColumn = 1 // only one column
            numberDisplayRow = numberDisplaysWithoutPosition
        } else if (mode === 'horizontal') {
            numberDisplayColumn = numberDisplaysWithoutPosition
            numberDisplayRow = 1 // only one row
        } else {
            if (gridPriority === 'fillRowFirst') {
                numberDisplayColumn = numberOfColumns
                numberDisplayRow = Math.ceil(numberDisplaysWithoutPosition / numberOfColumns)
            } else {
                numberDisplayColumn = Math.ceil(numberDisplaysWithoutPosition / numberOfRows)
                numberDisplayRow = numberOfRows
            }
        }

        // Calculates shifts so the displays stay center in widget area if center is true
        const centerVerticalShift = this.calculateCenterVerticalShift(groupRegionSize.height, numberDisplayRow, center, spacingVertical)
        const centerHorizontalShift = this.calculateCenterHorizontalShift(groupRegionSize.width, numberDisplayColumn, center, spacingHorizontal)

        displays.forEach((di, i) => {
            // Calculate coordinates and create widget if it was searched
            let top = 0;
            let left = 0;

            //  if position provided its not needed to calculate position
            if (di?.position) {
                const positionTopOpt = Number(di.position.top);
                const positionLeftOpt = Number(di.position.left);
                this.buildDisplay(di, isNaN(positionTopOpt) ? 0 : positionTopOpt, isNaN(positionLeftOpt) ? 0 : positionLeftOpt, i, state, opt)
            } else {
                switch (mode) {
                    case "vertical": {
                        top = skip_y + centerVerticalShift + this.globalDisplaySize.height * inc + accum
                        left = skip_x + centerHorizontalShift
                        accum += spacingVertical
                        break;
                    }
                    case "horizontal": {
                        top = skip_y + centerVerticalShift
                        left = skip_x + centerHorizontalShift + this.globalDisplaySize.width * inc + accum
                        accum += spacingHorizontal;
                        break;
                    }
                    case "grid": {
                        //Fills row by row
                        if (gridPriority === 'fillRowFirst') {
                            const lastrow = Math.floor(numberDisplaysWithoutPosition / numberOfColumns)
                            const lastcenterOffset = this.calculateCenterHorizontalShift(numberOfColumns * this.globalDisplaySize.width + spacingHorizontal * (numberOfColumns - 1), numberDisplaysWithoutPosition % numberOfColumns, center, spacingHorizontal)
                            top = skip_y + centerVerticalShift + this.globalDisplaySize.height * incVertical + accumVertical
                            left = skip_x + centerHorizontalShift + this.globalDisplaySize.width * incHorizontal + accumHorizontal + (center && lastrow === incVertical ? lastcenterOffset : 0)
                            incHorizontal++;
                            accumHorizontal += spacingHorizontal
                            if (incHorizontal >= numberOfColumns) {
                                incHorizontal = 0
                                accumHorizontal = 0
                                incVertical++
                                accumVertical += spacingVertical
                            }
                        } else {
                            const lastcolumn = Math.floor(numberDisplaysWithoutPosition / numberOfRows)
                            const lastcenterOffset = this.calculateCenterVerticalShift(numberOfRows * this.globalDisplaySize.height + spacingVertical * (numberOfRows - 1), numberDisplaysWithoutPosition % numberOfRows, center, spacingVertical)
                            top = skip_y + centerVerticalShift + this.globalDisplaySize.height * incVertical + accumVertical + (center && lastcolumn === incHorizontal ? lastcenterOffset : 0)
                            left = skip_x + centerHorizontalShift + this.globalDisplaySize.width * incHorizontal + accumHorizontal
                            incVertical++;
                            accumVertical += spacingVertical
                            if (incVertical >= numberOfRows) {
                                incVertical = 0
                                accumVertical = 0
                                incHorizontal++
                                accumHorizontal += spacingHorizontal
                            }
                        }

                        break
                    }
                    default: {
                        top = skip_y + centerVerticalShift + this.globalDisplaySize.height * inc + accum
                        left = skip_x + centerHorizontalShift
                        accum += spacingVertical;
                        break;
                    }
                }
                this.buildDisplay(di, top, left, i, state, opt)
                inc++;
            }
        });
    }
    /**
     * Renders the widget
     */
    render(state?: Renderable, opt?: MultiDisplayOptions): void {
        opt = opt || {};

        this.remove()
        this.rendered = false
        // create the html element
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();

        this.buildDisplays(state ?? '', opt)
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