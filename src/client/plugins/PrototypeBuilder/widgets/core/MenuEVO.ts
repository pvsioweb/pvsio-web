/**
 * @module MenuEVO
 * @version 1.0
 * @description Renders a menu widget with multiple buttons.
 *              This module provide APIs for setting up the visual appearance of the widget, e.g., font size and color.
 * @author João Linhares
 * @date August 15, 2026
 *
 */

import { Connection, PVSioWebCallBack } from '../../../../common/interfaces/Connection';
import { CSS, Coords, Renderable, WidgetOptions } from '../../../../common/interfaces/Widgets';
import { ButtonEVO, ButtonOptions } from './ButtonEVO';
import { MatchState, WidgetAttr, WidgetEVO, rat2real, ratNumberMatch } from './WidgetEVO';

export interface MenuOptions extends WidgetOptions {
    menuName?: string, // menu name
    buttons?: Button[], // buttons array
    globalButtonCSS?: CSS, // global css for each button
    mode?: 'vertical' | 'horizontal' | 'grid', // orientation of buttons - horizontal, vertical and grid
    numberOfColumns?: number, // number of columns in case mode is grid
    numberOfRows?: number, // number of rows in case mode is grid
    spacing?: number, // spacing between buttons
    spacingVertical?: number, // vertical spacing between buttons, if not listed the value from spacing is used
    spacingHorizontal?: number, // horizontal spacing between buttons, if not listed the value from spacing is used
    buttonSize?: Size, // button size
    center?: boolean, // centers buttons in the main widget area
    gridPriority?: 'fillRowFirst' | 'fillColumnsFirst' // in grid mode, given its buttons fills row or column first, good for when center is true
};

export interface MenuAttr extends WidgetAttr {
    menuName: string,
    mode: 'vertical' | 'horizontal' | 'grid',
    gridPriority: 'fillRowFirst' | 'fillColumnsFirst'
};

export interface Button extends Omit<ButtonOptions, 'parent' | 'viz' | 'type' | 'widget_template' | 'renderMode' | 'connection' | 'css' | 'buttonName'> {
    buttonCSS?: CSS, // button css
    buttonID?: string,
}

export interface ButtonPositions {
    position: Position,
    buttonID?: string,
}

export interface Size {
    height: number,
    width: number
}

export interface Position {
    top: number,
    left: number
}

export class MenuEVO extends WidgetEVO {
    /**
     * Menu attributes
     */
    protected attr!: MenuAttr;

    protected numberOfColumns: number;

    protected numberOfRows: number;

    protected center: boolean;

    // Button IDs and callbacks
    protected buttons: Button[];

    // Button Properties
    protected globalButtonCSS: CSS;

    protected spacing: number;

    protected spacingVertical: number;

    protected spacingHorizontal: number;

    protected buttonSize: Size;

    protected connection: Connection | undefined;

    protected callback: PVSioWebCallBack;

    // Auxiliary widgets
    protected menuButtonsPositions: ButtonPositions[];

    protected menuButtons: WidgetEVO[];
    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = 'MenuEVO';
    getConstructorName(): string {
        return MenuEVO.constructorName;
    }
    getDescription(): string {
        return 'Suitable for rendering multiple buttons. Can automatically center all of the buttons in main widget div in vertical, horizontal and grid orientations.';
    }

    renderSample(): void {
        this.render();
    }

    /**
     * Returns a shallow copy of all button positions computed during the last render call.
     * Used by composite widgets (e.g., FilterEVO) to place decorative elements relative to buttons.
     * @returns Array of button positions
     */
    getButtonsPositions(): ButtonPositions[] {
        return this.menuButtonsPositions.map(object => ({ ...object }))
    }

    /**
     * Constructor
     */
    constructor(id: string, coords: Coords, opt?: MenuOptions) {
        opt = opt || {};
        super(id, coords, opt);
        this.kind = 'Menu';
        opt.css = opt.css || {};
        this.css = { ...opt.css };

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css.background = opt.css?.background || opt.css['background-color'] || 'transparent';
        this.css.color = opt.css?.color || 'black';
        this.css.cursor = opt.css?.cursor || 'default';
        this.css.overflow = opt.css?.overflow || 'hidden';

        // set attributes
        this.attr.menuName = opt.menuName || id;
        this.attr.mode = opt?.mode || 'vertical';
        this.attr.gridPriority = opt.gridPriority || 'fillRowFirst';
        this.center = opt.center || false;
        const numberOfColumnsOpt = Number(opt.numberOfColumns);
        this.numberOfColumns = (isNaN(numberOfColumnsOpt) || numberOfColumnsOpt < 1) ? 3 : Math.floor(numberOfColumnsOpt);
        const numberOfRowsOpt = Number(opt.numberOfRows);
        this.numberOfRows = (isNaN(numberOfRowsOpt) || numberOfRowsOpt < 1) ? 3 : Math.floor(numberOfRowsOpt);
        this.buttons = opt.buttons || [];

        // create style options for buttons of menu

        this.globalButtonCSS = { ...(opt.globalButtonCSS || {}) };
        this.globalButtonCSS['box-shadow'] = opt.globalButtonCSS?.['box-shadow'] || '10px 10px 10px rgba(0, 0, 0, 0)'; // Remove box shadow from buttons
        // Spacing between buttons and each button size

        const spacingOpt = Number(opt.spacing);
        this.spacing = isNaN(spacingOpt) ? 20 : spacingOpt;

        const spacingVerticalOpt = Number(opt.spacingVertical);
        this.spacingVertical = isNaN(spacingVerticalOpt) ? this.spacing : spacingVerticalOpt;

        const spacingHorizontalOpt = Number(opt.spacingHorizontal);
        this.spacingHorizontal = isNaN(spacingHorizontalOpt) ? this.spacing : spacingHorizontalOpt;


        const buttonSizeHeightOpt = Number(opt.buttonSize?.height);
        const buttonSizeWidthOpt = Number(opt.buttonSize?.width);
        this.buttonSize = {
            height: (isNaN(buttonSizeHeightOpt) || buttonSizeHeightOpt <= 0) ? 200 : buttonSizeHeightOpt,
            width: (isNaN(buttonSizeWidthOpt) || buttonSizeWidthOpt <= 0) ? 200 : buttonSizeWidthOpt
        };

        // Auxiliar Widget

        this.menuButtons = [];

        this.menuButtonsPositions = []

        // Connection and callback

        this.connection = opt.connection;

        this.callback = opt.callback || ((err, res) => { console.warn('[menu-widget] Warning: ' + this.id + ' does not have a callback :/'); });
    }

    /**
    * Internal function, calculates shift in pixels so that the buttons stay vertically centered in the main widget area
    * @param height Height of the main widget area
    * @param numberButtons Number of buttons
    * @param center Bool that determines if buttons have to be centered on the widget area
    * @param spacingVertical Vertical Spacing
    */
    private calculateCenterVerticalShift(height: number, numberButtons: number, center: boolean, spacingVertical: number): number {
        if (!center) return 0

        const sizeAllButtons = numberButtons * this.buttonSize.height + spacingVertical * (numberButtons - 1)

        return height / 2 - sizeAllButtons / 2

    }

    /**
    * Internal function, calculates shift in pixels so that the buttons stay horizontaly centered in the main widget area
    * @param width Width of the main widget area
    * @param numberButtons Number of buttons
    * @param center Bool that determines if buttons have to be centered on the widget area
    * @param spacingHorizontal Horizontal Spacing
    */
    private calculateCenterHorizontalShift(width: number, numberButtons: number, center: boolean, spacingHorizontal: number): number {
        if (!center) return 0

        const sizeAllButtons = numberButtons * this.buttonSize.width + spacingHorizontal * (numberButtons - 1)

        return width / 2 - sizeAllButtons / 2

    }

    /**
    * Internal function, gets value from state given a key
    * @param state State
    * @param button Button
    */
    private getValue(state: Renderable, button: Button): string {
        if (button?.customLabel) {
            return button.customLabel
        }

        if (!button?.buttonID) {
            return ''
        }

        if (state !== undefined && state !== null) {
            if (this.matchStateFlag) {
                // Return match from state
                const name: string = button.buttonID
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
                // If it doesnt match returns empty
                return ''
            }
        }
        return ''
    }

    /**
    * Renders the widget
    * @param state PVS state string or object used to resolve button labels
    * @param opt Options to override constructor settings for this render call
    */
    render(state?: Renderable, opt?: MenuOptions): void {
        opt = opt || {};

        const buttons = opt.buttons || this.buttons;

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
            : this.spacingHorizontal

        const center = opt?.center ?? this.center

        const globalButtonCSS = opt.globalButtonCSS || this.globalButtonCSS
        // create the html element
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();

        // Set accumulator to create spacing between widgets
        let accum = 0

        // Remove button widgets if they were rendered
        if (this.menuButtons.length > 0) this.menuButtons.forEach((menu, i) => menu.remove());  // Clean the menu
        this.menuButtons = []

        this.menuButtonsPositions = []


        // Helper variables
        let inc = 0
        let incHorizontal = 0
        let incVertical = 0
        let accumVertical = 0
        let accumHorizontal = 0

        let numberButtonsColumn
        let numberButtonsRow

        // Calculate number of buttons per row and column
        if (mode === 'vertical') {
            numberButtonsColumn = 1
            numberButtonsRow = buttons.length
        } else if (mode === 'horizontal') {
            numberButtonsColumn = buttons.length
            numberButtonsRow = 1
        } else {
            if (gridPriority === 'fillRowFirst') {
                numberButtonsColumn = numberOfColumns
                numberButtonsRow = Math.ceil(buttons.length / numberOfColumns)
            } else {
                numberButtonsColumn = Math.ceil(buttons.length / numberOfRows)
                numberButtonsRow = numberOfRows
            }
        }

        // Calculate shifts if center bool is true
        const centerVerticalShift = this.calculateCenterVerticalShift(this.height, numberButtonsRow, center, spacingVertical)
        const centerHorizontalShift = this.calculateCenterHorizontalShift(this.width, numberButtonsColumn, center, spacingHorizontal)

        buttons.forEach((op, i) => {
            // Calculate coordinates and create widget 
            let coordinates: { top?: number, left?: number, height?: number, width?: number };
            coordinates = {}

            // Calculate positional coordinates of each button
            switch (mode) {
                case 'vertical': {
                    coordinates = { top: centerVerticalShift + this.buttonSize.height * inc + accum, left: centerHorizontalShift, height: this.buttonSize.height, width: this.buttonSize.width };
                    accum += spacingVertical;
                    break;
                }
                case 'horizontal': {
                    coordinates = { top: centerVerticalShift, left: centerHorizontalShift + this.buttonSize.width * inc + accum, height: this.buttonSize.height, width: this.buttonSize.width };
                    accum += spacingHorizontal;
                    break;
                }
                case 'grid': {
                    //Fills row by row
                    if (gridPriority === 'fillRowFirst') {
                        const lastrow = Math.floor(buttons.length / numberOfColumns)
                        const lastcenterOffset = this.calculateCenterHorizontalShift(numberOfColumns * this.buttonSize.width + spacingHorizontal * (numberOfColumns - 1), buttons.length % numberOfColumns, center, spacingHorizontal)
                        coordinates = {
                            top: centerVerticalShift + this.buttonSize.height * incVertical + accumVertical,
                            left: centerHorizontalShift + this.buttonSize.width * incHorizontal + accumHorizontal + (center && lastrow === incVertical ? lastcenterOffset : 0),
                            height: this.buttonSize.height, width: this.buttonSize.width
                        }
                        incHorizontal++;
                        accumHorizontal += spacingHorizontal
                        if (incHorizontal >= numberOfColumns) {
                            incHorizontal = 0
                            accumHorizontal = 0
                            incVertical++
                            accumVertical += spacingVertical
                        }
                    } else {
                        //Fills column by column
                        const lastcolumn = Math.floor(buttons.length / numberOfRows)
                        const lastcenterOffset = this.calculateCenterVerticalShift(numberOfRows * this.buttonSize.height + spacingVertical * (numberOfRows - 1), buttons.length % numberOfRows, center, spacingVertical)
                        coordinates = {
                            top: centerVerticalShift + this.buttonSize.height * incVertical + accumVertical + (center && lastcolumn === incHorizontal ? lastcenterOffset : 0),
                            left: centerHorizontalShift + this.buttonSize.width * incHorizontal + accumHorizontal,
                            height: this.buttonSize.height, width: this.buttonSize.width
                        }
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
                    coordinates = { top: centerVerticalShift + this.buttonSize.height * inc + accum, left: centerHorizontalShift, height: this.buttonSize.height, width: this.buttonSize.width };
                    accum += spacingVertical;
                    break;
                }
            }

            const cssButton = { ...globalButtonCSS, ...op.buttonCSS ? op.buttonCSS : {} }

            // Instantiate Button
            const newButton = new ButtonEVO(op.buttonID ? this.id + 'Button' + i + op.buttonID : this.id + 'ButtonNo' + i,
                coordinates,
                {
                    ...op,
                    buttonName: op.buttonID,
                    css: cssButton,
                    parent: this.$base ? this.$base : this.id,
                    connection: this.connection,
                    callback: op.callback ? op.callback : this.callback,
                    renderMode: 'string'
                })

            //  Render Button
            newButton.render(this.getValue(state ?? '', op), { css: cssButton })
            this.menuButtonsPositions.push({
                buttonID: op.buttonID ? this.id + 'Button' + i + op.buttonID : this.id + 'ButtonNo' + i,
                position: {
                    top: coordinates?.top ?? 0,
                    left: coordinates?.left ?? 0
                }
            })
            // Save button widget to list
            this.menuButtons.push(newButton)
            inc++;

        });
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
        const lineHeight: number = parseFloat(this.css['line-height'] ?? '') || this.height;
        this.$base.css('line-height', `${lineHeight}px`);
    }

}