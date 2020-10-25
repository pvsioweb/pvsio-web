/**
 * Draws halo over buttons when the button is clicked
 */

import * as Widget from './Widget';

export class ButtonHalo2 {

    protected static keyCode2widget = {}; // this table stores information about the relation between keyCodes and widgets
    protected static widgetsCoords = {}; // this table maintains info about the coordinate and size of the widgets
    protected static evts = {};
    protected static noHalo = {};

    static installKeypressHandler (widget: Widget.BasicWidget, opt?: { 
        keyCode?: string, 
        coords?: Widget.WidgetCoordinates,
        evts?: string[],
        noHalo?: boolean
    }) {
        opt = opt || {};
        if (opt.keyCode) { ButtonHalo2.keyCode2widget[opt.keyCode] = widget; }
        if (opt.coords) { ButtonHalo2.widgetsCoords[widget.id] = opt.coords; }
        if (opt.evts) { ButtonHalo2.evts[widget.id] = opt.evts; }
        if (opt.noHalo) { ButtonHalo2.noHalo[widget.id] = opt.noHalo; }
        if (!$("#btnSimulatorView")[0]) {
            $(document).on("keydown", (event: JQuery.Event) => {
                ButtonHalo2.handleKeyDownEvent(event);
            });
            $(document).on("keyup", (event: JQuery.Event) => {
                ButtonHalo2.handleKeyUpEvent(event);
            });
        }
    };

    static removeKeypressHandlers (): void {
        ButtonHalo2.keyCode2widget = {};
        ButtonHalo2.widgetsCoords = {};
        ButtonHalo2.evts = {};
        ButtonHalo2.noHalo = {};
    };

    static halo (widgetID: string): void {
        const coords: Widget.WidgetCoordinates = ButtonHalo2.widgetsCoords[widgetID];
        if (coords) {
            let mark: JQuery<HTMLElement> = $(".animation-halo");
            if (!mark[0]) {
                const div: HTMLDivElement = document.createElement("div");
                mark = $(div).addClass("animation-halo");
                $("body").append(div);
            }

            const hrad: number = coords.width / 2;
            const vrad: number = coords.height / 2;
            const brad: string = hrad + "px " + vrad + "px ";

            mark.css("top", coords.top + "px").css("left", coords.left + "px")
                .css("width", coords.width + "px").css("height", coords.height + "px")
                .css("border-top-left-radius", brad).css("border-top-right-radius", brad)
                .css("border-bottom-left-radius", brad).css("border-bottom-right-radius", brad)
                .css("z-index", 9999);
        }
    };

    static haloOff (widgetID: string) {
        $(".animation-halo").remove();
    };

    static handleKeyDownEvent (e: JQuery.Event): void {
        var eventKeyCode = e.which;
        if (eventKeyCode) {
            if (!$("#btnSimulatorView")[0] || $("#btnSimulatorView").hasClass("active")) {
                const widget: Widget.BasicWidget = ButtonHalo2.keyCode2widget[eventKeyCode];
                if (widget) {
                    const id: string = widget.id;
                    const evts: string[] = ButtonHalo2.evts[id];
                    // if (evts && evts.indexOf('click') > -1 && widget["click"]) {
                    //     widget["click"]({ callback: widget.callback });
                    //     if (!instance._noHalo[id]) {
                    //         instance.halo(id);
                    //     }
                    //     d3.event.preventDefault();
                    //     d3.event.stopPropagation();
                    // } else if (widget && evts && (evts["press/release"] || typeof evts.indexOf === 'function' && evts.indexOf("press/release") > -1)) {
                    //     widget.pressAndHold({ callback: widget.callback });
                    //     if (!instance._noHalo[id]) {
                    //         instance.halo(id);
                    //     }
                    //     d3.event.preventDefault();
                    //     d3.event.stopPropagation();
                    // }
                }
            }
        }
    };

    static handleKeyUpEvent (e: JQuery.Event): void {
        // var eventKeyCode = e.which;
        // if (eventKeyCode) {
        //     if (!d3.select("#btnSimulatorView").node() || d3.select("#btnSimulatorView").classed("active")) {
        //         var widget = instance._keyCode2widget[eventKeyCode];
        //         if (widget) {
        //             var id = (typeof widget.id === "function") ? widget.id() : widget.id;
        //             var evts = instance._evts[id];
        //             if (evts && (evts["press/release"] || typeof evts.indexOf === 'function' && evts.indexOf("press/release") > -1)) {
        //                 widget.release({ callback: widget.callback });
        //             }
        //             if (!instance._noHalo[id]) {
        //                 instance.haloOff(widget);
        //             }
        //             d3.event.preventDefault();
        //             d3.event.stopPropagation();
        //         }
        //     }
        // }
    };

}
