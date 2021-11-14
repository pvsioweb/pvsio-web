import { SelectionButtonEVO, PushButtonOptions } from "./SelectionButtonEVO";
import { Coords } from "../../../../common/interfaces/Widgets";

export class ToggleButtonEVO extends SelectionButtonEVO {
    static readonly constructorName: string = "ToggleButtonEVO";
    getConstructorName (): string {
        return ToggleButtonEVO.constructorName;
    }


    protected activeFlag: boolean = false; // false means disabled, true means enabled

    protected activeColor: string = "black";
    protected inactiveColor: string;

    /**
     * Constructor
     */
    constructor (id: string, coords: Coords, opt?: PushButtonOptions) {
        super(id, coords, opt);
    }

    /**
     * toggle allows to toggle the button programmatically
     */
    toggle (): void {
        this.activeFlag ? this.deselect() : this.select();
    }

    /**
     * Internal function, handles mouse down events
     */
    protected onMouseDown (): void {
        // mouse down events toggle button status
        this.toggle();
        this.click();
    }

    /**
     * Utility function, can be used to demonstrate the functionalities of the widget.
     */
    renderSample () {
        return this.render();
    }

    /**
     * Returns a short, human-readable description of the widget
     */
    getDescription (): string {
        return `On/Off toggle button.`;

    }
}