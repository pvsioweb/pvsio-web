/**
 * @module BasicDisplayEVO
 * @version 1.0
 * @description Renders a digital display for rendering text.
 *              This module provide APIs for setting up the visual appearance of the widget, e.g., font size and color.
 * @author Paolo Masci
 * @date Dec 11, 2017
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses BasicDisplayEVO
import { BasicDisplayEVO } from './BasicDisplayEVO';
const disp: BasicDisplayEVO = new BasicDisplayEVO("disp", {
    top: 200, left: 120, height: 24, width: 120
}, {
    fontColor: "black",
    fontsize: 16,
    backgroundColor: "blue"
});
disp.render("Hello World!"); // The display shows Hello World!
 *
 */

import { Coords, WidgetEVO, WidgetOptions, CSS, WidgetAttr, Renderable, MatchState, rat2real, ratNumberMatch } from "./WidgetEVO";

export interface DisplayOptions extends WidgetOptions {
    displayName?: string
};

export interface DisplayAttr extends WidgetAttr {
    displayName: string
};

export class BasicDisplayEVO extends WidgetEVO {
    /**
     * Display attributes
     */
    protected attr: DisplayAttr;

    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = "BasicDisplayEVO";
    getConstructorName (): string {
        return BasicDisplayEVO.constructorName;
    }
    getDescription (): string {
        return "Suitable for rendering text and numbers.";
    }
    renderSample (): void {
        let st = {};
        st[this.attr.displayName] = "ABC12";
        this.render(JSON.stringify(st));
    }

    /**
     * Constructor
     */
    constructor (id: string, coords: Coords, opt?: DisplayOptions) {
        super(id, coords, opt);
        this.kind = "Display";

        opt = opt || {};
        opt.css = opt.css || {};

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css["background"] = opt.css["background"] || "black";
        this.css.color = opt.css.color || "white";
        this.css.cursor = opt.css.cursor || "default";
        this.css.overflow = opt.css.overflow || "hidden";

        // set display key
        this.attr.displayName = opt.displayName || id;
    }

    /**
     * Renders the widget
     */
    render (state?: Renderable, opt?: DisplayOptions): void {
        opt = opt || {};
        // console.log(`[NumericDisplay] rendering ${this.getName()}`, state);
        // create the html element
        super.render();
        // update style
        this.updateDisplayStyle(opt.css);
        // reveal the widget
        this.reveal();
        // render the content if state is non-null
        if (state !== undefined && state !== null) {
            // check if the state contains a field named after the widget
            if (this.matchStateFlag) {
                if (typeof state === "string") {
                    const match: MatchState = this.matchState(state);
                    if (match) {
                        // check if this is a rational number -- don't use directly rat2real 
                        // because the state may be a string that resembles a number, e.g., "2.", 
                        // and rat2real would translate it into number 2 (i.e., the '.' gets removed, 
                        // which is not what we want for non-numeric displays)
                        const matchRat: RegExpMatchArray = new RegExp(ratNumberMatch).exec(match.val);
                        if (matchRat) {
                            const val: number = rat2real(match.val);
                            const disp: string = isNaN(val) ? `${match.val}` : `${val}`;
                            this.$base.html(disp);
                        } else {
                            this.$base.html(match.val);
                        }
                        // const name: string = this.getName();
                        // console.log(`[BasicDisplay] ${name} render`, state);
                    }
                }
            } else {
                // render string or number
                this.$base.html(`${state}`);
            }
        }
    }

    /**
     * Internal function, updates the display style
     * @param opt 
     */
    protected updateDisplayStyle (opt?: CSS): void {
        opt = opt || {};
        // set style
        this.applyCSS({ ...this.css, ...opt });
        // set line height so text is properly centered
        const lineHeight: number = parseFloat(this.css["line-height"]) || this.height;
        this.$base.css("line-height", `${lineHeight}px`);
    }

}