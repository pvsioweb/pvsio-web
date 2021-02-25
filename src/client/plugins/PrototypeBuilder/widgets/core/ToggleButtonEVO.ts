import { SelectionButtonEVO, PushButtonOptions } from "./SelectionButtonEVO";
import { Coords } from "./WidgetEVO";

export class ToggleButtonEVO extends SelectionButtonEVO {
    static readonly constructorName: string = "ToggleButtonEVO";
    getConstructorName (): string {
        return ToggleButtonEVO.constructorName;
    }


    protected activeFlag: boolean = false; // false means disabled, true means enabled

    protected activeColor: string = "black";
    protected inactiveColor: string;

    constructor (id: string, coords: Coords, opt?: PushButtonOptions) {
        super(id, coords, opt);
    }

    /**
     * toggle allows to toggle the button programmatically
     */
    toggle (): void {
        this.activeFlag ? this.deselect() : this.select();
    }

    protected onMouseDown (): void {
        // mouse down events toggle button status
        this.toggle();
        this.click();
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
        return `On/Off toggle button.`;

    }
}