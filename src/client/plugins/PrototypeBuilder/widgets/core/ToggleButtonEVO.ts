/**
 * @module TouchScreenEVO
 * @version 1.0
 * @description Renders a touchscreen display.
 * @author Paolo Masci
 * @date Jul 25, 2018
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses TouchScreenEVO
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: { d3: "../lib/d3", text: "../lib/text" }
 });
 require(["widgets/core/TouchScreenEVO"], function (TouchScreenEVO) {
      "use strict";
      var disp = new TouchScreenEVO("touch", {
        top: 200, left: 120, height: 24, width: 120
      }, {
        callback: function (err, data) { console.log("Ok button clicked"); console.log(data); }
      });
     disp.render("touch me!"); // The display shows touch me!
 });
 *
 */

import { ButtonEVO, ButtonOptions } from "./ButtonEVO";
import { Coords } from "./WidgetEVO";

export interface ToggleButtonOptions extends ButtonOptions {
    activeColor?: string
};

export class ToggleButtonEVO extends ButtonEVO {

    protected activeFlag: boolean = false; // false means disabled, true means enabled

    protected activeColor: string = "black";
    protected inactiveColor: string;

    constructor (id: string, coords: Coords, opt?: ToggleButtonOptions) {
        super(id, coords, opt);
        opt = opt || {};
        opt.css = opt.css || {};

        // override default button style
        this.activeColor = opt.activeColor || "black";
        this.inactiveColor = this.css["background-color"];
        this.type = opt.type || "togglebutton";

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
    /**
     * toggle allows to toggle the button programmatically
     */
    toggle (): void {
        this.activeFlag ? this.deselect() : this.select();
    }

    // the refresh function is used to ensure the visual appearance reflects the toggle state
    protected refresh (): void {
        const backgroundColor: string = this.activeFlag ? this.activeColor : this.inactiveColor;
        this.css["background-color"] = backgroundColor;
        this.activeFlag || this.hover ? super.select({ "background-color": backgroundColor }) : super.deselect();
    }

    protected onMouseOver (): void {
        this.refresh();
    }
    protected onMouseOut (): void {
        this.refresh();
    }
    protected onMouseDown (): void {
        // mouse down events toggle the button status
        this.toggle();
        if (this.activeFlag) { 
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
        return `Touchscreen display, renders touch-screen elements.
            Click events are emitted when the element is released.`;
    }
}