/**
 * @module MouseCursor
 * @version 1.0
 * @description Renders a mouse cursor.
 *              The widget is implemented using a png image embedded in a div.
 * @author Paolo Masci
 * @date Dec 23, 2017
 *
 * @example <caption>Example use of the widget.</caption>
 // Example pvsio-web demo that uses MouseCursor
 // The following configuration assumes the pvsio-web demo is stored in a folder within pvsio-web/examples/demo/
 require.config({
     baseUrl: "../../client/app",
     paths: {
         d3: "../lib/d3",
         lib: "../lib",
         text: "../lib/text",
         stateParser: "./util/PVSioStateParser"
     }
 });
 require(["widgets/core/MouseCursor"], function (MouseCursor) {
      "use strict";
      var device = {};
      device.cursor = new MouseCursor("cursor", {
        top: 200, left: 120, height: 24, width: 120
      });
     device.cursor.render(); // The cursor is rendered.
     device.cursor.move( { top: 100, left: 300 }, { duration: 1000 }); // The cursor is moved to position (100,300), and the animation duration is 1 second.
 });
 *
 */

import { Coords, WidgetEVO, img_template, WidgetOptions } from "../core/WidgetEVO";

export const mouse_template: string = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="26px" height="26px" viewBox="0 0 26 26" enable-background="new 0 0 26 26" xml:space="preserve">  <image id="image0" width="26" height="26" x="0" y="0"
    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
cwAADdcAAA3XAUIom3gAAAAHdElNRQfiAQsEJhc6PRCnAAABT0lEQVQ4y5XRsWqTURgG4NfGenRQ
EEUcBB2cRXBw9ALEWZzUG/AeBAeXioPSUZyKzooILgV1cnHQQYcWi6bQQSVYa5OcxyE1lJik+b/p
wPkeXs55k+G4bMUnV9JkfAU9N5ogHITqViMUperjrn0NUJRqG4vmZkF1gKJUm1gy3wBFqX7imUMN
UJRqA8uOTEf93ShKtYZ3jjdAUarP+OjUZNQbRVGq91hxtgGKUr1F27nxqDsOHdDiNdadnxlFS3iJ
tjLYnKH1fpKsppeTOfF/0vZokrbd8+Lf5v6pIQ9yJ508ynra+ZLlcW8aJukMTz9wcVq5fwarfoHn
ERbwZE/kN57a0t9pqavr9GTURhcPzXmMhQhLuD8ZXbel53aSuIDvEQU6jk5mhx0bnt8MP+MVbu7d
ZxJX8SHCJq7Nhuat7ZTas6g1E0pc8s2Ge86M3vwFYrCYxMbsK/8AAAAldEVYdGRhdGU6Y3JlYXRl
ADIwMTgtMDEtMTFUMDQ6Mzg6MjMtMDc6MDBP2SliAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAx
LTExVDA0OjM4OjIzLTA3OjAwPoSR3gAAAABJRU5ErkJggg==" />
</svg>
`;

export class MouseCursor extends WidgetEVO {
    /**
     * @function <a name="MouseCursor">MouseCursor</a>
     * @description Constructor.
     * @param id {String} The ID of the touchscreen button.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) widget area.
     *        Default is { top: 0, left: 0, width: 32, height: 20 }.
     * @param opt {Object} Options:
     *          <li>opacity (Number): opacity of the button. Valid range is [0..1], where 0 is transparent, 1 is opaque (default is opaque)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     *          <li>visibleWhen (string): boolean expression indicating when the display is visible. The expression can use only simple comparison operators (=, !=) and boolean constants (true, false). Default is true (i.e., always visible).</li>
     *          <li>zIndex (String): z-index property of the widget (default is 1)</li>
     * @memberof module:MouseCursor
     * @instance
     */
    constructor (id: string, coords: Coords, opt?: WidgetOptions) {
        super(id, coords, opt);
        opt = opt || {};
        opt.css = opt.css || {};

        // set widget type
        this.type = this.type || "MouseCursor";

        // override default style options of WidgetEVO as necessary before creating the DOM element with the constructor of module WidgetEVO
        this.css["background-color"] = "transparent";
        this.css.opacity = opt.css.opacity || 0.9;

        // invoke createHTMLElement to create the widget
        super.createHTMLElement();

        // append the pointer image to the base layer
        const dom: string = Handlebars.compile(img_template, { noEscape: true })({
            svg: mouse_template
        });
        this.base.append(dom);
    }

    /**
     * @function <a name="render">render</a>
     * @description Rendering function for button widgets.
     * @memberof module:MouseCursor
     * @instance
     */
    render (): void {
        return this.reveal();
    };

    /**
     * @function <a name="click">click</a>
     * @description Simulates a click -- this function does nothing for now.
     * @memberof module:MouseCursor
     * @instance
     */
    click (opt?: { fw_move?: number }): void {
        return this.reveal();
    };

    longPress (opt?) {
        opt = opt || {};
        opt.fw_move = opt.fw_move || 20;
        this.move({ top: this.top + opt.fw_move, left: this.left - opt.fw_move }, {
            duration: 200
        });
        setTimeout(() => {
            this.move({ top: this.top - opt.fw_move, left: this.left + opt.fw_move }, {
                duration: 500
            });
        }, 2500);
        return this.reveal();
    }

}
