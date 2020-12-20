import { ButtonEVO, ButtonOptions } from "./ButtonEVO";
import { Coords } from "./WidgetEVO";

export interface PushButtonOptions extends ButtonOptions {
    activeColor?: string
};

export class PushButtonEVO extends ButtonEVO {

    protected activeFlag: boolean = false; // false means disabled, true means enabled

    protected activeColor: string = "black";
    protected inactiveColor: string;

    constructor (id: string, coords: Coords, opt?: PushButtonOptions) {
        super(id, coords, opt);
        opt = opt || {};
        opt.css = opt.css || {};

        // override default button style
        this.activeColor = opt.activeColor || "black";
        this.inactiveColor = this.css["background-color"];
        this.type = opt.type || "pushbutton";

        // override default button style
        this.setCSS(this.css);
    }

    /**
     * select allows to activate the button programmatically
     */
    select (): void {
        if (!this.activeFlag) {
            this.activeFlag = true;
            this.refresh();
        }
    }
    /**
     * deselect allows to deactivate the button programmatically
     */
    deselect (): void {
        if (this.activeFlag) {
            this.activeFlag = false;
            this.refresh();
        }
    }

    // the refresh function is used to ensure the visual appearance reflects the toggle state
    protected refresh (): void {
        const backgroundColor: string = this.activeFlag ? this.activeColor : this.inactiveColor;
        this.css["background-color"] = backgroundColor;
        this.activeFlag || this.hoverFlag ? super.select({ "background-color": backgroundColor }) : super.deselect();
    }

    protected onMouseOver (): void {
        this.refresh();
    }
    protected onMouseOut (): void {
        this.refresh();
    }
    protected onMouseDown (): void {
        // mouse down events toggle the button status
        this.activeFlag = true;
        this.click();
    }
    protected onMouseUp (): void {
        this.refresh();
    }
    protected onBlur (): void {
        this.refresh();
    }


    /**
     * @function <a name="renderSample">renderSample</a>
     * @description Version of the render function that demonstrates the functionalities of the widget.
     * @memberof module:TouchScreenEVO
     * @instance
     */
    renderSample () {
        return this.render();
    }

    getDescription (): string {
        return `Touchscreen display, renders touch-screen elements.
            Click events are emitted when the element is released.`;
    }
}