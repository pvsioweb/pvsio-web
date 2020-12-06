/**
 * @module BasicDisplay
 * @version 2.1
 * @description Renders a basic digital display.
 *              This module provide APIs for changing the look and feel of
 *              the rendered text, including: cursors, background color, font, size, alignment.
 * @author Paolo Masci, Patrick Oladimeji, Henrique Pacheco
 * @date May 12, 2017
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses BasicDisplay
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: {
         d3: "../lib/d3",
         lib: "../lib"
     }
 });
 require(["widgets/BasicDisplay"], function (BasicDisplay) {
      "use strict";
      var device = {};
      device.disp = new BasicDisplay("disp", {
        top: 100, left: 120, height: 24, width: 120
      }, {
        displayKey: "disp"
      });
      device.disp.render( { disp: 10.5 }); // the display renders 10.5
 });
 *
 */

import * as Widget from './Widget';
const StateParser = require("util/PVSioStateParser");

export interface WidgetOptions extends Widget.WidgetOptions {
    displayKey?: string,
    audioFeedback?: boolean,
    borderColor?: string,
    borderWidth?: string,
    borderStyle?: string,
    fontSize?: number,
    fontFamily?: string,
    letterSpacing?: number,
    align?: string,
    backgroundColor?: string,
    fontColor?: string,
    inverted?: boolean,
    blinking?: boolean,
    borderRadius?: string,
    opacity?: number,
    format?: "mm:ss",
    example?: string
}

export class BasicDisplay extends Widget.BasicWidget {

    protected borderColor: string;
    protected borderWidth: string;
    protected borderStyle: string;
    protected fontSize: number;
    protected fontFamily: string;
    protected letterSpacing: number;
    protected align: string;
    protected backgroundColor: string;
    protected fontColor: string;
    protected blinking: boolean;
    protected textBaseline: CanvasTextBaseline = "middle";
    protected borderRadius: string;
    protected opacity: number;
    protected displayKey: string;
    protected format: "mm:ss";
    protected audioFeedback: boolean = false;

    protected txt: string[];
    protected example: string;

    /**
     * @function <a name="BasicDisplay">BasicDisplay</a>
     * @description Constructor.
     * @param id {String} The ID of the display.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 200, height: 80 }.
     * @param opt {Object} Options:
     *          <li>align (String): text alignment (available options are "left", "right", anc "center". Default is "center")</li>
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
     *          <li>borderWidth (Number): border width (default is 0, i.e., no border, unless option borderColor has been specified -- in this case, the border is 2px)</li>
     *          <li>borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid" (default is "none")</li>
     *          <li>borderColor (String): border color, must be a valid HTML5 color (default color used in the widget is "black")</li>
     *          <li>blinking (Bool): true means the display is blinking (default is false, i.e., not blinking)</li>
     *          <li>displayKey (string): name of the state attribute defining the display content. This information will be used by the render method. Default is the ID of the display.</li>
     *          <li>fontSize (Number): font size (default is 0.8 * coords.height)</li>
     *          <li>fontFamily (String): font family, must be a valid HTML5 font name (default is "sans-serif")</li>
     *          <li>fontColor (String): font color, must be a valid HTML5 color (default is "white", i.e., "#fff")</li>
     *          <li>format (String): sets the display format. When this option is set to "mm:ss", the display value represents seconds, and format to be displayed is mm:ss</li>
     *          <li>inverted (Bool): if true, the text has inverted colors,
     *              i.e., fontColor becomes backgroundColor, and backgroundColor becomes fontColor (default is false)</li>
     *          <li>letterSpacing (Number): spacing between characters, in pixels (default is 0)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>visibleWhen (string): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     * @memberof module:BasicDisplay
     * @instance
     */
    constructor (id: string, coords: Widget.WidgetCoordinates, opt?: WidgetOptions) {
        super(id, "display", coords, opt);

        opt.displayKey = opt.displayKey || id;
        opt.audioFeedback = opt.audioFeedback;
        opt.visibleWhen = opt.visibleWhen || "true";

        this.borderColor = opt.borderColor || "inherit";
        this.borderWidth = (opt.borderColor) ? ((opt.borderWidth) ? opt.borderWidth : "2") : "0";
        this.borderStyle = (opt.borderColor) ? ((opt.borderStyle) ? opt.borderStyle : "solid") : "none";

        this.fontSize = opt.fontSize || this.height * 0.8;
        this.fontFamily = opt.fontFamily || "sans-serif";
                
        this.letterSpacing = opt.letterSpacing;
        this.align = opt.align || "center";
        this.backgroundColor = opt.backgroundColor || "black";
        this.fontColor = opt.fontColor || "white";
        this.cursor = opt.cursor || "default";
        if (opt.inverted) {
            const tmp: string = this.backgroundColor;
            this.backgroundColor = this.fontColor;
            this.fontColor = tmp;
        }
        this.blinking = opt.blinking || false;
        this.div?.addClass(`displayWidget`)
        if (this.blinking) { this.div?.addClass("blink"); }

        this.borderRadius = opt.borderRadius || "2px";
        this.opacity = opt.opacity || 1;
        this.format = opt.format;
        this.div?.css({
            "border-radius": this.borderRadius,
            "background-color": this.backgroundColor,
            "border-width": `${this.borderWidth}px`,
            "border-style": this.borderStyle,
            "border-color": this.borderColor,
            opacity: this.opacity,
            display: "none"
        });
        const span: HTMLSpanElement = document.createElement("span");
        $(span).attr("id", id + "_span").attr("class", id + "_span")
            .attr("width", this.width).attr("height", this.height)
            .css("margin", 0).css("padding", 0)
            .css("vertical-align", "top")
            .css("border-radius", opt.borderRadius);
        this.div.append(span)
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        $(canvas).attr("id", id + "_canvas").attr("class", id + "_canvas")
            .attr("width", this.width - +this.borderWidth).attr("height", this.height - +this.borderWidth)
            .css("margin", 0).css("padding", 0).css("border-radius", opt.borderRadius)
            .css("vertical-align", "top");
        this.div.append(canvas);
        this.txt = [ "" ]; // txt is used to store the current text rendered on the display
        this.displayKey = opt.displayKey;
        this.example = opt.example || "test"; // example is used in the prototype builder to demonstrate the font style of the display
    }

    /**
     * @function <a name="render">render</a>
     * @param data {Object} JSON object representing the display to be rendered.
     *                      The display value is specified in the attribute <displayKey>
     *                      (the actual value of <displayKey> is instantiated when creating the widget, see constructor's options)
     * @param opt {Object} Override options for the display style, useful to dynamically change the display style during simulations. Available options include:
     *              <li> fontSize (string): the font size of the display
     *              <li> fontColor (string): the font color of the display
     *              <li> backgroundColor (string): the background color of the display
     *              <li> borderWidth (Number): border width (default is 0, i.e., no border, unless option borderColor has been specified -- in this case, the border is 2px)</li>
     *              <li> borderStyle (String): border style, must be a valid HTML5 border style, e.g., "solid" (default is "none")</li>
     *              <li> borderColor (String): border color, must be a valid HTML5 color (default color used in the widget is "black")</li>
     *              <li> blinking (Bool): true means the text is blinking
     * @memberof module:BasicDisplay
     * @instance
     */
    render (txt: string, opt?: {
        borderStyle?: string,
        borderColor?: string,
        borderWidth?: string,
        visibleWhen?: string,
        align?: string,
        blinking?: boolean
    }) {
        opt = opt || {};
        const visibleWhen: string = opt.visibleWhen || this.visibleWhen;
        const isVisible: boolean = this.isVisible({ visibleWhen, txt });
        if (isVisible) {
            opt.borderWidth = opt.borderWidth || this.borderWidth;
            opt.borderStyle = opt.borderStyle || this.borderStyle;
            opt.borderColor = opt.borderColor || this.borderColor;
            this.div.css("border-width", opt.borderWidth + "px")
                    .css("border-style", opt.borderStyle)
                    .css("border-color", opt.borderColor);

            txt = txt || "";
            if (typeof txt === "object") {
                // txt in this case is a PVS state that needs to be parsed
                // var disp = StateParser.resolve(txt, this.displayKey);
                // if (disp) {
                //     if (typeof disp === "object") {
                //         disp = JSON.stringify(disp);
                //     }
                //     this.txt = StateParser.evaluate(disp);
                //     if (typeof this.txt === "string") {
                //         this.txt = this.txt.replace(new RegExp("\"", "g"), "");
                //     }
                // }
            } else {
                this.txt = [ txt ];
            }
            if (this.format === "mm:ss" && !isNaN(parseFloat(this.txt.join(" ")))) {
                // value represents seconds, and format to be displayed is mm:ss
                var val = parseFloat(this.txt?.join(" "));
                var minutes = Math.floor(val / 60);
                var seconds = Math.floor(val - (minutes * 60));
                var minutes_txt = (minutes < 10)? "0" + minutes : minutes;
                var seconds_txt = (seconds < 10)? "0" + seconds : seconds;
                this.txt = [ minutes_txt + ":" + seconds_txt ];
            }
            this.example = this.txt?.join(" ");
            // set blinking
            if(opt.blinking || this.blinking) {
                this.div.addClass("blink");
            } else {
                this.div.removeClass("blink");
            }
            // render content
            const elem: JQuery<HTMLCanvasElement> = $(`#${this.id}_canvas`);
            if (elem && elem[0]) {
                const context: CanvasRenderingContext2D = elem[0].getContext("2d");
                context.textBaseline = this.textBaseline;
                var align = opt.align || this.align;
                context.font = `${this.fontSize}px`;
                this.renderln({
                    txt: this.txt?.join(" "),
                    context: context,
                    align: align,
                    height: this.height,
                    width: this.width - 2 * +this.borderWidth
                }, opt);
                $(`#${this.id}_canvas`).css("display", "block");
                $(`#${this.id}_span`).css("display", "none");
            }
            this.reveal();
        } else {
            this.hide();
        }
    };

    protected renderln (data: {
        txt: string,
        context: CanvasRenderingContext2D,
        align: string,
        height: number,
        width: number
    }, opt?) {
        const filltext = (data: { 
            txt: string, context: CanvasRenderingContext2D, align: string, height: number, width: number 
        }, align: string) => {
            for (let i = 0; i < data.txt.length; i++) {
                if (align === "right") {
                    data.context.fillText(data.txt[data.txt.length - 1 - i], data.width - this.letterSpacing * i, data.height / 2);
                } else if (align === "left") {
                    data.context.fillText(data.txt[data.txt.length - 1 - i], this.letterSpacing * data.txt.length - this.letterSpacing * i, data.height / 2);
                } else { // align === center
                    data.context.fillText(data.txt[data.txt.length - 1 - i], this.letterSpacing * data.txt.length / 2 + data.width / 2 - this.letterSpacing * i, data.height / 2);
                }
            }
        }
        opt = opt || {};
        data.context.clearRect(0, 0, data.width, data.height);
        data.context.fillStyle = opt.backgroundColor || this.backgroundColor;
        if (data.context.fillStyle !== "transparent") {
            data.context.fillRect(0, 0, data.width, data.height);
        }
        data.context.fillStyle = opt.fontColor || this.fontColor;
        if (data.align === "left") {
            data.context.textAlign = "start";
            if (this.letterSpacing) {
                filltext(data, "left");
            } else {
                data.context.fillText(data.txt, 0, data.height / 2);
            }
        } else if (data.align === "right") {
            data.context.textAlign = "end";
            if (this.letterSpacing) {
                filltext(data, "right");
            } else {
                data.context.fillText(data.txt, data.width, data.height / 2);
            }
        } else {
            data.context.textAlign = "center";
            if (this.letterSpacing) {
                filltext(data, "center");
            } else {
                data.context.fillText(data.txt, data.width / 2, data.height / 2);
            }
        }
    }

    /**
     * @function <a name="setColors">setColors</a>
     * @description Sets the font color and background color.
     * @param colors {Object} Font color and background color. Attributed of the object are fontColor: (string) and backgroundColor (string).
     * @param opt {Object} Override options for the display style, useful to dynamically change the display style during a simulation. Available options include:
     *              <li> fontSize (string): the font size of the display
     *              <li> fontColor (string): the font color of the display
     *              <li> backgroundColor (string): the background color of the display
     *              <li> blinking (Bool): true means the text is blinking
     * @memberof module:BasicDisplay
     * @instance= function 
     */
    setColors (colors: { fontColor?: string, backgroundColor?: string, opacity?: number }, opt?): void {
        colors = colors || {};
        opt = opt || {};
        this.fontColor = colors.fontColor || this.fontColor;
        this.backgroundColor = colors.backgroundColor || this.backgroundColor;
        if (colors.opacity !== null && colors.opacity !== undefined) {
            this.div.css("opacity", colors.opacity);
        }
        this.render(this.txt.join(" "), opt);
    };
    /**
     * @function <a name="invertColors">invertColors</a>
     * @description Inverts the colors of the display (as in a negative).
     * @memberof module:BasicDisplay
     * @instance
     */
    invertColors (): void {
        const tmp: string = this.backgroundColor;
        this.backgroundColor = this.fontColor;
        this.fontColor = tmp;
        return this.render(this.txt.join(" "));
    };
    /**
     * @function <a name="invertGlyphiconColors">invertGlyphiconColors</a>
     * @description Inverts the colors of the glyphicond rendered with the display widget.
     * @memberof module:BasicDisplay
     * @instance
     */
    invertGlyphiconColors (): void {
        var tmp = this.backgroundColor;
        this.backgroundColor = this.fontColor;
        this.fontColor = tmp;
        return this.renderGlyphicon(this.txt.join(" "));
    };
    renderSample (opt?: { txt?: string }) {
        opt = opt || {};
        const txt: string = opt.txt || this.example;
        return this.render(txt, { visibleWhen: "true" });
    };

    /**
     * @function <a name="renderGlyphicon">renderGlyphicon</a>
     * @description Renders a glyphicon.
     * @param icon (String) Name of the glyphicon to be rendered, e.g., glyphicon-time. Glyphicon names are those of the bootstrap library (https://getbootstrap.com/docs/3.3/components/)
     * @param opt {Object} Override options. Same options available for the render() method.
     * @memberof module:BasicDisplay
     * @instance
     */
    renderGlyphicon (icon: string, opt?): void {
        opt = opt || {};
        this.txt = [ icon ];
        const elem: JQuery<HTMLElement> = $(`#${this.id}_span`);
        elem?.addClass("glyphicon");
        if (opt.blinking || this.blinking) {
            elem?.addClass("blink");
        } else {
            elem?.removeClass("blink");
        }
        elem?.css({
            color: opt.fontColor || this.fontColor,
            "background-color": opt.backgroundColor || this.backgroundColor,
            "border-radius": "2px",
            width: this.width,
            height: this.height,
            fontSize: `${0.7 * this.height}px`
        });
        $(`#${this.id}_canvas`).css("display", "none");
        $(`#${this.id}_span`).css("display", "block");
        this.reveal();
    };


    /**
     * @function <a name="renderMultiline">renderMultiline</a>
     * @description Renders an array of display elements. Useful for displaying menus.
     * @example var disp = new BasicDisplay("disp");
                disp.renderMultiline([ res.bagsval0 + " ml",
                                       res.bagsval1 + " ml",
                                       res.bagsval2 + " ml",
                                       res.bagsval3 + " ml",
                                       res.bagsval4 + " ml",
                                       res.bagsval5 + " ml",
                                       res.bagsval6 + " ml",
                                       res.bagsval7 + " ml",
                                       res.bagsval8 + " ml",
                                       res.bagsval9 + " ml" ], { selected: 0, direction: "inverted" });
     * @param opt {Object} Override options
     *           <li>blinking (bool) Whether the widget is blinking (default: false, i.e., not blinking)</li>
     *           <li>direction (String) Whether the display elements are rendered from top to bottom,
     *               or from bottom to top. Default direction is top to bottom. Use "inverted" to render from bottom to top.</li>
     *           <li>selected (Number) A number representing the index of the selected display element.</li>
     * @memberof module:BasicDisplay
     * @instance
     */
    renderMultiline (txt: string[], opt?) {
        const clearContext = (context: CanvasRenderingContext2D, width: number, height: number) => {
            context.save();
            context.fillStyle = opt.backgroundColor;
            context.fillRect(0, 0, width, height);
            context.restore();
        }
        const renderln = (data: {
            txt: string,
            context: CanvasRenderingContext2D,
            align: string,
            height: number,
            width: number,
            y: number,
            x: number
        }, opt?) => {
            opt = opt || {};
            data.context.fillStyle = (opt.inverted) ? opt.fontColor : opt.backgroundColor;
            data.context.fillRect(0, data.y, data.width, data.height);
            data.context.fillStyle = (opt.inverted) ? opt.backgroundColor : opt.fontColor;
            var y_offset = data.y || 0;
            if (data.align === "left") {
                data.context.textAlign = "start";
                data.context.fillText(data.txt, 0, data.height / 2 + y_offset);
            } else if (data.align === "right") {
                data.context.textAlign = "end";
                data.context.fillText(data.txt, data.width, data.height / 2 + y_offset);
            } else {
                data.context.textAlign = "center";
                data.context.fillText(data.txt, data.width / 2, data.height / 2 + y_offset);
            }
        }
        opt = opt || {};
        opt.backgroundColor = opt.backgroundColor || this.backgroundColor;
        opt.fontColor = opt.fontColor || this.fontColor;
        this.txt = txt;
        const elem: JQuery<HTMLCanvasElement> = $(`#${this.id}_canvas`);
        if (elem && elem[0]) {
            const context: CanvasRenderingContext2D = elem[0].getContext("2d");
            clearContext(context, this.width, this.height);
            context.textBaseline = this.textBaseline;
            var align = opt.align || this.align;
            if (typeof txt === "object" && txt.length) {
                const fontSize: number = opt.menuFontSize || (this.height / txt.length);
                context.font = `${fontSize}px`;
                var i = 0;
                for (i = 0; i < txt.length; i++) {
                    var offset = (opt.direction === "inverted") ? txt.length - i - 1 : i;
                    renderln({
                        txt:  txt[i],
                        context: context,
                        align: align,
                        width: this.width,
                        height: (this.height / txt.length),
                        x: 0,
                        y: (offset * (this.height / txt.length))
                    }, { inverted: (+opt.selected === i) ? true : false });
                }
            }
        }
        // set blinking
        if (opt.blinking || this.blinking) {
            this.div.addClass("blink");
        } else {
            this.div.removeClass("blink");
        }
        $(`#${this.id}_canvas`).css("display", "block");
        $(`#${this.id}_span`).css("display", "none");
        this.reveal();
    };

    /**
     * @function <a name="toJSON">toJSON</a>
     * @description Returns a serialised version of the widget in JSON format.
     *              This is useful for saving/loading a specific instance of the widget.
     *              In the current implementation, the following attributes are included in the JSON object:
     *              <li> type (string): widget type, i.e., "display" in this case
     *              <li> id (string): the unique identifier of the widget instance
     *              <li> fontSize (string): the font size of the display
     *              <li> fontColor (string): the font color of the display
     *              <li> backgroundColor (string): the background color of the display
     *              <li> displayKey (string): the name of the state attribute defining the display content.
     *              <li> visibleWhen (string): a booloan expression defining when the condition under which the widget is visible
     *              <li> auditoryFeedback (string): whether display readback is enabled
     * @returns JSON object
     * @memberof module:BasicDisplay
     * @instance
     */
    toJSON (): {
        id: string, type: string, 
        evts?: string[], displayKey?: string, visibleWhen?: string, 
        fontSize?: number, fontColor?: string, backgroundColor?: string } {
        return {
            type: this.type,
            id: this.id,
            displayKey: this.displayKey,
            visibleWhen: this.visibleWhen,
            fontSize: this.fontSize,
            fontColor: this.fontColor,
            backgroundColor: this.backgroundColor
        };
    };
    /**
    * Updates the location and size of the widget according to the given position and size
     */
    updateLocationAndSize (pos: { x?: number, y?: number, width?: number, height?: number }, opt?): void {
        super.updateLocationAndSize(pos);
        this.div.css("font-size", this.fontSize + "px");
        $(`#${this.id} span`).attr("width", this.width + "px").attr("height", this.height + "px"); // used for glyphicon
        $(`#${this.id} canvas`).attr("width", this.width + "px").attr("height", this.height + "px"); // used for standard text and numbers
        this.render(this.txt.join(" "), opt);
    };
    updateStyle (data: { fontSize?: number, backgroundColor?: string, fontColor?: string }): void {
        data = data || {};
        this.fontSize = data.fontSize || this.fontSize;
        // this.font = [this.fontSize, "px ", this.fontFamily];
        // this.smallFont = [(this.fontSize * 0.7), "px ", this.fontFamily];
        this.fontColor = data.fontColor || this.fontColor;
        this.backgroundColor = data.backgroundColor || this.backgroundColor;
        this.render(this.txt.join(" "));
    };
}
