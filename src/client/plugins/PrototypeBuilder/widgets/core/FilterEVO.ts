/**
 * @module FilterEVO
 * @version 1.0
 * @description Renders a filter widget with multiple buttons and an optional led to each variable to be filtered. Default colors are green led when its filtered, red when its not filtered
 *              This module provide APIs for setting up the visual appearance of the widget, e.g., font size and color.
 * @author João Linhares
 * @date August 15, 2026
 *
 */
import { Connection, PVSioWebCallBack } from "../../../../common/interfaces/Connection";
import { CSS, Coords, Renderable } from "../../../../common/interfaces/Widgets";
import { LedEVO } from "./LedEVO";
import { Button, MenuEVO, MenuOptions, Size } from "./MenuEVO";
import { MatchState, WidgetAttr, WidgetEVO, rat2real, ratNumberMatch } from "./WidgetEVO";


export interface FilterOptions extends Omit<MenuOptions, 'buttons' | 'menuName'> {
    filterName?: string,
    filters?: Filter[], // filters array
    filteredMode?: 'ledInside' | 'ledOutside' | 'buttonColor', // modes, led inside or outside or change button color
    positiveColor?: string, // color for when a button or led corresponding to button is filtered or enabled
    negativeColor?: string, // color for when a button or led corresponding to button is not filtered or disabled
    ledSize?: number, // led size
    filteredVariables?: string[] // variables of buttons that are enalbed or filtered
};

export interface FilterAttr extends WidgetAttr {
    filterName: string,
    positiveColor: string,
    negativeColor: string,
    filteredMode: 'ledInside' | 'ledOutside' | 'buttonColor'
};

export interface Filter extends Button {
    filterVar?: string
}

export class FilterEVO extends WidgetEVO {
    /**
     * Filter attributes
     */
    protected attr!: FilterAttr;


    protected menuOptions: FilterOptions;

    // LED

    protected ledSize: number;

    // Filters
    protected filters: Filter[];

    protected buttonSize: Size;

    protected callback: PVSioWebCallBack;

    protected connection: Connection | undefined;

    protected leds: WidgetEVO[];

    protected menu: WidgetEVO | null;

    protected filteredVariables: string[] | null

    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = "FilterEVO";
    getConstructorName(): string {
        return FilterEVO.constructorName;
    }
    getDescription(): string {
        return "Suitable for rendering filter to multiple variables with led indicators. Relies on menu and led widgets";
    }
    renderSample(): void {
        this.render();
    }

    /**
     * Constructor
     */
    constructor(id: string, coords: Coords, opt?: FilterOptions) {
        opt = opt || {};
        super(id, coords, opt);
        this.kind = "Filter";
        opt.css = opt.css || {};
        this.css = { ...opt.css };
        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css.background = opt.css?.background || opt.css["background-color"] || "transparent";
        this.css.color = opt.css?.color || "black";
        this.css.cursor = opt.css?.cursor || "default";
        this.css.overflow = opt.css?.overflow || "hidden";

        // set attributes
        this.attr.filterName = opt.filterName || id;
        this.filters = opt.filters || [];

        this.attr.positiveColor = opt.positiveColor || '#16D090'
        this.attr.negativeColor = opt.negativeColor || '#E74F48'

        this.menuOptions = { ...opt };

        const buttonSizeHeightOpt = Number(opt.buttonSize?.height);
        const buttonSizeWidthOpt = Number(opt.buttonSize?.width);
        this.buttonSize = {
            height: (isNaN(buttonSizeHeightOpt) || buttonSizeHeightOpt <= 0) ? 200 : buttonSizeHeightOpt,
            width: (isNaN(buttonSizeWidthOpt) || buttonSizeWidthOpt <= 0) ? 200 : buttonSizeWidthOpt
        };

        const ledSizeOpt = Number(opt.ledSize);
        this.ledSize = (isNaN(ledSizeOpt) || ledSizeOpt <= 0) ? this.buttonSize.width / 10 : ledSizeOpt;

        this.connection = opt.connection;

        this.callback = opt.callback || ((err, res) => { console.warn("[filter-widget] Warning: " + this.id + " does not have a callback :/"); });

        this.filteredVariables = opt.filteredVariables || null

        this.attr.filteredMode = opt.filteredMode || 'ledInside'

        this.leds = []
        this.menu = null
    }

    /**
    * Internal function, calculates positions of leds and creates them
    * @param filteredMode Filtered Mode
    * @param positiveColor Positive Color
    * @param negativeColor Negative Color
    * @param filtered With variables are filtered
    */
    private buildLeds(filteredMode: string, positiveColor: string, negativeColor: string, filtered: number[]) {
        const menuWidget = this.menu as MenuEVO
        // get button positions to place leds inside or outside them
        const buttonPositions = menuWidget.getButtonsPositions()
        buttonPositions.forEach((b, i) => {
            let coordinates = {}

            // offset to align the menu buttons shift to the left if mode is ledOutside
            const ledCompensation = filteredMode != 'ledOutside' ? 0 : 2 * this.ledSize + 0.05 * this.buttonSize.width

            // calculates offset so the led stays in correct position
            const leftOffSet = filteredMode === 'ledOutside' ? this.buttonSize.width + this.ledSize * 0.5 + 0.05 * this.buttonSize.width : this.buttonSize.width - this.ledSize - 0.05 * this.buttonSize.width

            const topOffSetCenter = this.buttonSize.height / 2 - this.ledSize * 0.5

            coordinates = {
                top: b.position.top + topOffSetCenter,
                left: b.position.left + leftOffSet + (ledCompensation / 2),
                height: this.ledSize,
                width: this.ledSize
            }
            this.leds.push(new LedEVO(this.id + 'LedNo' + i, coordinates,
                {
                    parent: this.id,
                    css: {
                        background: filtered.includes(i) ? positiveColor : negativeColor,
                        'z-index': 999999
                    }
                }
            ))
        })

    }

    /**
    * Internal function, calculates positions of the filters that are enabled or filtered
    * @param state State
    * @param filteredVariables Variables that are enabled
    * @param filters Filters
    */
    private getFilteredVariables(state?: Renderable, filteredVariables?: string[], filters?: Filter[]): number[] {

        const filtered: number[] = []
        filters?.forEach((f, i) => {
            const key = f.filterVar || f.buttonID
            // If filteredVariables exists, see if key of filter is filtered
            if (filteredVariables != null) {
                if (key && filteredVariables.includes(key)) {
                    filtered.push(i)
                }
            } else {
                // If not, checks value of filter key in state, if diferent from 0 or true it is considered enabled
                if (this.matchStateFlag) {
                    const name: string = key ?? ''
                    const match: MatchState | null = (typeof state === "string") ?
                        this.matchState(state, name)
                        // @ts-ignore: state is used as object at runtime; Renderable type is incomplete
                        : { name, val: state[name] };
                    if (match) {
                        // check if this is a rational number -- don't use directly rat2real 
                        // because the state may be a string that resembles a number, e.g., "2.", 
                        // and rat2real would translate it into number 2 (i.e., the '.' gets removed, 
                        // which is not what we want for non-numeric displays)
                        const matchRat: RegExpMatchArray | null = new RegExp(ratNumberMatch).exec(match.val);
                        if (matchRat) {
                            const val: number = rat2real(match.val);
                            if (val) {
                                filtered.push(i)
                            }
                        } else {
                            // Checks if true, false or null
                            if (match.val.toLowerCase() === 'true') {
                                filtered.push(i)
                            }
                        }
                    }
                }
            }
        })
        return filtered
    }
    /**
     * Renders the widget
     */
    render(state?: Renderable, opt?: FilterOptions): void {
        opt = opt || {}

        const filters = opt.filters || this.filters

        const filteredVariables = opt.filteredVariables || this.filteredVariables


        const menuOptions: FilterOptions = { ...this.menuOptions };
        Object.entries(opt).forEach(([key, value]) => {
            if (value !== undefined) {
                (menuOptions as Record<string, unknown>)[key] = value;
            }
        });

        const filteredMode = opt?.filteredMode || this.attr.filteredMode
        const positiveColor = opt?.positiveColor || this.attr.positiveColor
        const negativeColor = opt?.negativeColor || this.attr.negativeColor

        this.remove()
        this.rendered = false
        // create the html element
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();

        // Remove previous rendered widgets
        if (this.leds.length > 0) {
            this.leds.map(l => l.remove())
            this.leds = []
        }

        if (this.menu != null) {
            this.menu.remove()
        }

        const filtered = this.getFilteredVariables(state, filteredVariables ?? undefined, filters)

        // Get buttons to instantiate menu widget
        const buttons = filters.map((object, i) => {
            const b = object as Button
            if (filteredMode === 'buttonColor') {
                b.buttonCSS = { ...b?.buttonCSS ? b.buttonCSS : {}, ...{ background: filtered.includes(i) ? positiveColor : negativeColor } }
            }
            return b
        })

        // calculates menu width if led stays outside the button, so it doesnt position outside of the filter widget area
        const ledCompensation = filteredMode != 'ledOutside' ? 0 : 2 * this.ledSize + 0.05 * this.buttonSize.width
        const width = filteredMode != 'ledOutside' ? this.width : this.width - ledCompensation

        // horizontal spacing resolved as in the menu widget, increased if led stays outside the button and does not fit
        const spacingOpt = Number(menuOptions.spacing);
        const spacing = isNaN(spacingOpt) ? 20 : spacingOpt
        const spacingHorizontalOpt = Number(menuOptions.spacingHorizontal);
        let spacingHorizontal = isNaN(spacingHorizontalOpt) ? spacing : spacingHorizontalOpt
        spacingHorizontal = filteredMode != 'ledOutside' ? spacingHorizontal : (spacingHorizontal < ledCompensation ? ledCompensation : spacingHorizontal)

        this.menu = new MenuEVO(this.id + 'Menu', { height: this.height, width: width, top: 0, left: filteredMode != 'ledOutside' ? 0 : ledCompensation / 2 }, {
            ...menuOptions,
            // blacklist widget options, should not be applied to the internal menu
            css: undefined,
            viz: undefined,
            type: undefined,
            widget_template: undefined,
            parent: this.id,
            spacingHorizontal: spacingHorizontal,
            buttons: buttons,
            buttonSize: this.buttonSize,
            callback: this.callback,
            connection: this.connection,
            renderMode: !this.matchStateFlag ? 'string' : 'state'
        })

        this.menu.render(state)

        // if led mode, build and renders leds
        if (['ledInside', 'ledOutside'].includes(filteredMode)) {
            this.buildLeds(filteredMode, positiveColor, negativeColor, filtered)

            this.leds.map((l, i) => l.render(filtered.includes(i) ? positiveColor : negativeColor))
        }
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