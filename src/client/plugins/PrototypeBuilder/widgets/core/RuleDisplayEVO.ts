/**
 * @module RuleDisplayEVO
 * @version 1.0
 * @description Renders a rule display widget with multiple constraints. Renders text in form 'predecessorConstraintsText' then 'constraints' seperated by 'constraintSeparator' finalized by 'predecessorActionText' and 'action'
 *              This module provide APIs for setting up the visual appearance of the widget, e.g., font size and color.
 * @author João Linhares
 * @date August 15, 2026
 *
 */
import Handlebars = require("handlebars");
import { CSS, Coords, Renderable, WidgetOptions } from "../../../../common/interfaces/Widgets";
import { MatchState, WidgetAttr, WidgetEVO, rat2real, ratNumberMatch } from "./WidgetEVO";

export const widget_template_title: string = `
<div id="{{id}}"
    style="user-select:none; position:absolute; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; z-index:0; overflow:hidden;"
    class=" noselect ">
    <span style="width:100%; height:100%; {{#each css}} {{@key}}:{{this}};{{/each}}">{{text}}</span>
</div>`;

export interface RuleDisplayOptions extends WidgetOptions {
    ruleName?: string,
    title?: Title, // title options
    predecessorConstraintsText?: string, // text before constraints
    constraints?: string[], // constraints
    constraintSeparator?: string, // separator between constraints
    predecessorActionText?: string, // tect befor action
    action?: string, // action if constraints are broken
    textCss?: CSS // css for all text
    constraintCss?: CSS, // css that is added on top of textCss only for constraints
    actionCss?: CSS, // css that is added on top of textCss only for action text
    textSize?: Size, // text box size
    textPosition?: Position // text box position
};

export interface RuleDisplayAttr extends WidgetAttr {
    ruleName: string,
    action: string,
    predecessorConstraintsText: string,
    predecessorActionText: string,
    constraintSeparator: string,
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

export class RuleDisplayEVO extends WidgetEVO {
    /**
     * RuleDisplay attributes
     */
    protected attr!: RuleDisplayAttr;

    // Constraints and actions

    protected constraints: string[];
    protected constraintCss: CSS;

    protected textSize: Size;

    protected textPosition: Position;

    protected actionCss: CSS;

    protected textCss: CSS;
    // title

    protected titleBoolean: boolean;

    protected title: Title;

    /**
     * Methods and attributes of the abstract class that require an implementation
     */
    static readonly constructorName: string = "RuleDisplayEVO";
    getConstructorName(): string {
        return RuleDisplayEVO.constructorName;
    }
    getDescription(): string {
        return "Suitable for rendering rule display with multiple constraints with template 'TEXT CONSTRAINT SEPARATOR CONSTRAINT TEXT ACTION'.";
    }
    renderSample(): void {
        const st: Record<string, string> = {};
        st[this.attr.ruleName] = "ABC12";
        this.render(JSON.stringify(st));
    }

    /**
     * Constructor
     */
    constructor(id: string, coords: Coords, opt?: RuleDisplayOptions) {
        opt = opt || { constraints: [] };
        super(id, coords, opt);
        this.kind = "Display";
        opt.css = opt.css || {};
        this.css = { ...opt.css }
        this.textCss = { ...opt.textCss }

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css.background = opt.css?.background || opt.css["background-color"] || "transparent";
        this.css.color = opt.css?.color || "white";
        this.css.cursor = opt.css?.cursor || "default";
        this.css.overflow = opt.css?.overflow || "hidden";
        this.css["font-size"] = this?.css["font-size"] || "16";


        this.textCss["font-size"] = this?.textCss["font-size"] || "16";

        // set attributes
        this.attr.ruleName = opt.ruleName || id;

        this.constraints = opt.constraints || []

        this.constraintCss = { ...opt.constraintCss }
        this.attr.action = opt.action || ''


        this.actionCss = { ...opt.actionCss }

        this.attr.predecessorActionText = opt.predecessorActionText || ''
        this.attr.constraintSeparator = opt.constraintSeparator || 'and'
        this.attr.predecessorConstraintsText = opt.predecessorConstraintsText || ''


        const textSizeWidthOpt = Number(opt?.textSize?.width);
        const textSizeHeightOpt = Number(opt?.textSize?.height);
        this.textSize = {
            width: (isNaN(textSizeWidthOpt) || textSizeWidthOpt <= 0) ? this.width : textSizeWidthOpt,
            height: (isNaN(textSizeHeightOpt) || textSizeHeightOpt <= 0) ? this.height : textSizeHeightOpt
        };

        const textPositionTopOpt = Number(opt?.textPosition?.top);
        const textPositionLeftOpt = Number(opt?.textPosition?.left);
        this.textPosition = {
            top: isNaN(textPositionTopOpt) ? 0 : textPositionTopOpt,
            left: isNaN(textPositionLeftOpt) ? 0 : textPositionLeftOpt
        };
        // Title defaults

        this.titleBoolean = opt?.title ? true : false;

        this.title = opt.title || { text: "Rule" }
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

    }

    /**
    * Internal function, gets value from state given a key
    * @param state State
    * @param key Key
    */
    private getValue(state?: Renderable, key?: string): string | null {

        // If key does not exist return null
        if (key === undefined || key === null) return null

        if (state !== undefined && state !== null) {
            if (this.matchStateFlag) {
                // Return match from state
                const name: string = key
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
                return key
            } else {
                // if string render mode return null
                return null
            }
        }
        return key
    }

    /**
    * Internal function, renders title
    * @param title Title options
    */
    private renderTitle(title: Title): void {

        // Build title div
        const stringTitle = Handlebars.compile(widget_template_title, { noEscape: true })({
            id: this.id + "Title",
            width: title.size!.width,
            height: title.size!.height,
            text: title?.text,
            css: title?.css,
            top: title.position!.top,
            left: title.position!.left
        });

        // get current widget menu div
        const $currentDiv = this.$base ? this.$base : this.sel2jquery(this.id)
        // append div
        $currentDiv.append(stringTitle)
    }

    /**
     * Renders the widget
     */
    render(state?: Renderable, opt?: RuleDisplayOptions): void {
        opt = opt || { constraints: this.constraints };

        const titleBoolean = opt?.title ? true : this.titleBoolean

        const title = opt.title || this.title
        title.css = title?.css || {};
        const titleSizeWidthRenderOpt = Number(title?.size?.width);
        const titleSizeHeightRenderOpt = Number(title?.size?.height);
        title.size = {
            width: (isNaN(titleSizeWidthRenderOpt) || titleSizeWidthRenderOpt <= 0) ? this.title.size!.width : titleSizeWidthRenderOpt,
            height: (isNaN(titleSizeHeightRenderOpt) || titleSizeHeightRenderOpt <= 0) ? this.title.size!.height : titleSizeHeightRenderOpt
        };
        const titlePositionTopRenderOpt = Number(title?.position?.top);
        const titlePositionLeftRenderOpt = Number(title?.position?.left);
        title.position = {
            top: isNaN(titlePositionTopRenderOpt) ? this.title.position!.top : titlePositionTopRenderOpt,
            left: isNaN(titlePositionLeftRenderOpt) ? this.title.position!.left : titlePositionLeftRenderOpt
        };

        const constraints = opt.constraints || this.constraints;

        const predecessorConstraintsText = opt?.predecessorConstraintsText || this.attr.predecessorConstraintsText
        const constraintSeparator = opt?.constraintSeparator || this.attr.constraintSeparator
        const predecessorActionText = opt?.predecessorActionText || this.attr.predecessorActionText
        const action = opt?.action || this.attr.action
        const textCss = opt?.textCss || this.textCss
        const constraintCss = opt?.constraintCss || this.constraintCss
        const actionCss = opt?.actionCss || this.actionCss

        const textSizeWidthRenderOpt = Number(opt?.textSize?.width);
        const textSizeHeightRenderOpt = Number(opt?.textSize?.height);
        const textSize = {
            width: (isNaN(textSizeWidthRenderOpt) || textSizeWidthRenderOpt <= 0) ? this.textSize.width : textSizeWidthRenderOpt,
            height: (isNaN(textSizeHeightRenderOpt) || textSizeHeightRenderOpt <= 0) ? this.textSize.height : textSizeHeightRenderOpt
        };

        const textPositionTopRenderOpt = Number(opt?.textPosition?.top);
        const textPositionLeftRenderOpt = Number(opt?.textPosition?.left);
        const textPosition = {
            top: isNaN(textPositionTopRenderOpt) ? this.textPosition.top : textPositionTopRenderOpt,
            left: isNaN(textPositionLeftRenderOpt) ? this.textPosition.left : textPositionLeftRenderOpt
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

        const constraintDiv = document.getElementById(this.id + "ConstraintDiv")
        if (constraintDiv) {
            constraintDiv.parentNode?.removeChild(constraintDiv);
        }


        let stringWidget
        if (state !== undefined && state !== null && !this.matchStateFlag) {
            stringWidget = Handlebars.compile(widget_template_title, { noEscape: true })({
                id: this.id + "ConstraintDiv",
                width: textSize.width,
                height: textSize.height,
                text: state,
                css: textCss,
                top: textPosition.top,
                left: textPosition.left
            });
        } else {
            let widgetTemplateDisplay: string = `
                        <div id="{{id}}" style=" user-select:none; width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px; overflow:hidden; position:{{pos}}; {{#each css}} {{@key}}:{{this}};{{/each}}"
                        class=" noselect ">{{#if predecessorConstraintsText}}<span>{{predecessorConstraintsText}}</span>&nbsp;{{/if}}`;

            constraints.forEach((c, i) => {
                if (i > 0) {
                    widgetTemplateDisplay += `&nbsp;<span>{{constraintSeparator}}</span>&nbsp;`
                }
                widgetTemplateDisplay += `<span style="{{#each constraintsCSS}} {{@key}}:{{this}};{{/each}}">` + this.getValue(state, c) + `</span>`
            })

            widgetTemplateDisplay += `{{#if predecessorActionText}}&nbsp;<span>{{predecessorActionText}}</span>{{/if}}{{#if action}}&nbsp;<span style="{{#each actionCSS}} {{@key}}:{{this}};{{/each}}">{{action}}</span>{{/if}}</div>`

            stringWidget = Handlebars.compile(widgetTemplateDisplay, { noEscape: true })({
                id: this.id + "ConstraintDiv",
                height: textSize.height,
                width: textSize.width,
                top: textPosition.top,
                left: textPosition.left,
                pos: textCss['position'] ? textCss['position'] : 'absolute',
                css: textCss,
                predecessorConstraintsText: this.getValue(state, predecessorConstraintsText),
                constraintSeparator: this.getValue(state, constraintSeparator),
                constraintsCSS: constraintCss,
                predecessorActionText: this.getValue(state, predecessorActionText),
                action: this.getValue(state, action),
                actionCSS: actionCss
            })
        }

        // get current widget menu div
        const $currentDiv = this.$base ? this.$base : this.sel2jquery(this.id);
        // append div
        $currentDiv.append(stringWidget)


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