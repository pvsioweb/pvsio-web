import { ActionCallback, ActionsQueue } from "../../../../env/ActionsQueue";
import { ButtonEVO, ButtonOptions } from "./ButtonEVO";
import { Coords, img_template, CSS, BasicEvent } from "./WidgetEVO";

export type DialEvent = BasicEvent | "rotate";
export type DialStyle = "modern" | "multimeter";
export interface DialOptions extends ButtonOptions {
    svg?: (size: number) => string
}
export type DialEventData = {
    evt: DialEvent,
    val: number, // current dial rotation, in deg
    fun: string // name of the prototype function to be invoked when a given event is triggered
};

export class DialEVO extends ButtonEVO {
    protected rotation: number = 0;
    protected delta: number = 0;
    
    protected size: number;
    protected step: number = 10; // deg
    protected svg: (size: number) => string;
    
    constructor (id: string, coords: Coords, opt?: DialOptions) {
        super(id, { width: 64, height: 64, ...coords }, { keyCodes: "ArrowUp, ArrowDown", ...opt });

        opt = opt || {};
        opt.css = opt.css || {};

        this.size = Math.min(this.width, this.height) || 64;
        this.svg = opt.svg || dialImage;

        // reset css
        this.css["border-radius"] = `${this.size}px`;
        this.css.opacity = opt.css.opacity || 1;
        this.css["font-size"] = "0px";        
    }

    protected createHTMLElement (): void {
        super.createHTMLElement();
        const size: number = Math.min(this.width, this.height) || 64;
        // append the pointer image to the base layer
        const img: string = Handlebars.compile(img_template, { noEscape: true })({
            svg: this.svg(this.size)
        });
        this.$img.append(img);
        this.recenter();
    }

    protected recenter (): void {
        this.$div.css({ "padding-left": `${(this.width - this.size) / 2}px` });
        this.$img.css({ height: `${this.size}px`, width: `${this.size}px` });
        this.$base.css({ height: `${this.size}px`, width: `${this.size}px` });
        this.$overlay.css({ height: `${this.size}px`, width: `${this.size}px`, "margin-left": `${(this.width - this.size) / 2}px`, "border-radius": `${this.size}px` });
    }

    getRotation (): number {
        return this.rotation;
    }
    getDelta (): number {
        return this.delta;
    }

    //@override
    resize (coords: Coords, opt?: CSS): void {
        if (coords) {
            super.resize(coords);
            this.size = Math.min(this.width, this.height) || 64;
            const img: string = Handlebars.compile(img_template, { noEscape: true })({
                svg: this.svg(this.size)
            });
            this.$img.html(img);
            this.recenter();
        }
    }

    protected onMouseWheel (): void {
        if (this.delta) {
            // compute rotation
            this.rotation += this.delta * this.step; // deg
            // rotate the dial
            this.rotate(this.rotation);
            // send rotate action over the connection
            const fun: string = this.attr.customFunction || ("rotate_" + this.attr.buttonName);
            const callback: ActionCallback = this.callback;
            ActionsQueue.queueGUIAction(fun, this.connection, callback);
            // trigger rotate event
            const data: DialEventData = {
                evt: "rotate",
                fun,
                val: this.rotation
            };
            this.trigger("rotate", data);
        }
    };

    // @override
    protected onKeyDown (evt: JQuery.KeyDownEvent): void {
        if (this.hoverFlag) {
            evt.preventDefault();
            this.delta = evt.key === "ArrowUp" ? 1
                : evt.key === "ArrowDown" ? -1
                    : 0;
            this.onMouseWheel();
            // console.log(evt.key);
        }
    }

    // @override
    protected onKeyUp (evt: JQuery.KeyUpEvent): void {
        evt.preventDefault();
    }
    
    // @override -- this will be called automatically by the base class
    protected installHandlers() {
        super.installHandlers();
        // bind mouse wheel events
        this.$overlay[0].addEventListener("wheel", (evt: WheelEvent) => {
            evt.preventDefault();
            this.delta = evt.deltaY > 0 ? 1
                : evt.deltaY < 0 ? -1
                    : 0;
            this.onMouseWheel();
        });
    }

    // @override
    protected onMouseDrag (evt?: JQuery.MouseMoveEvent | JQuery.TouchMoveEvent): void {
        // console.log("mousedrag");
        if (this.dragStart) {
            const top: number = evt.pageY;
            const left: number = evt.pageX;
            const deltaX: number = left - this.dragStart.left;
            if (Math.abs(deltaX) > 8) {
                this.delta = deltaX > 0 ? 1
                    : deltaX < 0 ? -1
                        : 0;
                this.onMouseWheel();
                this.dragStart.top = top;
                this.dragStart.left = left;
            }
        } else if (this.touchStart) {
            if (evt.changedTouches?.length) {
                const top: number = evt.changedTouches[0].pageY;
                const left: number = evt.changedTouches[0].pageX;
                const deltaX: number = left - this.touchStart.left;
                if (Math.abs(deltaX) > 32) {
                    this.delta = deltaX > 0 ? 1
                        : deltaX < 0 ? -1
                            : 0;
                    this.onMouseWheel();
                    this.touchStart.top = top;
                    this.touchStart.left = left;
                }
            }
        }
    }

    // @override
    getDescription (): string {
        return `Dial widget, emulates buttons that can be rotated and pressed.
            The mouse wheel can be used to rotate the dial.
            Rotate events are emitted when the button is pressed.`;
    }

}

function dialImage (size: number): string {
    return `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${size}px" height="${size}px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">  <image id="image0" width="64" height="64" x="0" y="0"
    xlink:href="data:image/png;base64,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" />
</svg>
`
};
