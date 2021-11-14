import { ButtonEVO, ButtonOptions } from "./ButtonEVO";
import { Coords } from "../../../../common/interfaces/Widgets";

export interface PushButtonOptions extends ButtonOptions {
    activeColor?: string
};

export class SelectionButtonEVO extends ButtonEVO {
    static readonly constructorName: string = "SelectionButtonEVO";
    getConstructorName (): string {
        return SelectionButtonEVO.constructorName;
    }

    // button state (active/inactive)
    protected activeFlag: boolean = false;

    // background color for active and inactive states
    protected activeColor: string = "black";
    protected inactiveColor: string;

    constructor (id: string, coords: Coords, opt?: PushButtonOptions) {
        super(id, coords, opt);
        opt = opt || {};
        opt.css = opt.css || {};

        // override default button style
        this.activeColor = opt.activeColor || "black";
        this.inactiveColor = this.css["background"];
    }

    isActive (): boolean {
        return this.activeFlag;
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
        this.css["background"] = backgroundColor;
        this.activeFlag || this.hoverFlag ? super.select({ "background": backgroundColor }) : super.deselect();
    }

    protected onMouseOver (): void {
        this.refresh();
    }
    protected onMouseOut (): void {
        this.refresh();
    }
    protected onMouseDown (): void {
        // mouse down events toggle the button status
        if (!this.activeFlag) {
            this.activeFlag = true;
            this.click();    
        }
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
        return `Becomes enabled when pressed, and remains enabled.`;
    }
}