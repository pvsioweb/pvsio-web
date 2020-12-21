import { PushButtonEVO, PushButtonOptions } from "./PushButtonEVO";
import { Coords } from "./WidgetEVO";

export class ToggleButtonEVO extends PushButtonEVO {

    protected activeFlag: boolean = false; // false means disabled, true means enabled

    protected activeColor: string = "black";
    protected inactiveColor: string;

    constructor (id: string, coords: Coords, opt?: PushButtonOptions) {
        super(id, coords, opt);
        this.type = opt?.type || "togglebutton";
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
        return `Touchscreen display, renders touch-screen elements.
            Click events are emitted when the element is released.`;
    }
}