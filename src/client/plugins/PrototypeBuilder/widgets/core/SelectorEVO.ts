import { Connection, PVSioWebCallBack, SendCommandToken } from "../../../../env/Connection";
import { ButtonOptions } from "./ButtonEVO";
import { DialEventData, DialEVO, DialOptions } from "./DialEVO";
import { Coords, CSS } from "./WidgetEVO";

export interface SelectorOptions extends DialOptions {
    turns?: number[] // angles (deg) identifying selector rotations. First value is treated as initial rotation value.
}

export class SelectorEVO extends DialEVO {

    protected turns: number[];
    protected tIndex: number = 0; // current position, must be a valid index in turns

    constructor (id: string, coords: Coords, opt?: SelectorOptions) {
        super(id, { width: 64, height: 64, ...coords }, { svg: selectorImage, ...opt });

        opt.css = opt.css || {};
        opt = opt || {};
        this.turns = opt.turns || [0, 45];
        const size: number = Math.min(this.width, this.height) || 64;
        this.css["border-radius"] = `${size}px`;
        this.css.opacity = opt.css.opacity || 1;
        this.css["font-size"] = "0px";        
    }

    protected createHTMLElement (opt?: SelectorOptions): void {
        super.createHTMLElement();
        const initialRotation: number = this.turns?.length ? this.turns[0] : 0;
        if (initialRotation) {
            this.rotate(initialRotation)
        }
    }

    /**
     * Turns the selector to position p
     * @param p 
     * @param opt 
     */
    turn (p: number, opt?: CSS): void {
        if (p >= 0 && p < this.turns?.length) {
            this.tIndex = p;
            this.rotate(this.turns[this.tIndex], opt);
        }
    }

    /**
     * Returns the current value of the turn index
     */
    getIndex (): number {
        return this.tIndex;
    }

    // @override
    protected onMouseWheel (): void {
        if (this.delta) {
            const p: number = this.delta > 0 ? this.tIndex < this.turns.length ? this.tIndex + 1 : this.turns.length
                : this.tIndex > 0 ? this.tIndex - 1 : 0;
            this.turn(p);
            // send rotate action over the connection
            const action: string = this.attr.customFunction || ("rotate_" + this.attr.buttonName);
            const callback: PVSioWebCallBack = this.callback;

            const req: SendCommandToken = {
                id: this.id,
                type: "sendCommand",
                command: action
            };
            this.connection?.sendRequest("sendCommand", req);
            if (callback) {
                this.connection?.onRequest("sendCommand", (err, res) => {
                    callback(err, res);
                });
            }
    
            // ActionsQueue.queueGUIAction(fun, this.id, this.connection, callback);
            // trigger rotate event
            const data: DialEventData = {
                evt: "rotate",
                fun: action,
                val: this.rotation
            };
            this.trigger("rotate", data);            
        }
    }

    // @override
    click (opt?: ButtonOptions): void {
        super.click(opt);
        this.turn((this.tIndex + 1) % this.turns.length);
    }

    // @override
    getDescription (): string {
        return `N-positions rotary switch.`;
    }

}

function selectorImage (size: number): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${size}px" height="${size}px" viewBox="0 0 112 112" enable-background="new 0 0 112 112" xml:space="preserve">  <image id="image0" width="112" height="112" x="0" y="0"
xlink:href="data:image/png;base64,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
OjUzOjUzKzAzOjAwFVd3CwAAAABJRU5ErkJggg==" />
</svg>
`;
}