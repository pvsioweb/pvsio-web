/**
 * @module PIMWidget
 * @desc Widget within the PIM prototype editor
 * @author Nathaniel Watson
 */
import { WidgetEVO, Coords, WidgetOptions, WidgetDescriptor } from '../../../plugins/PrototypeBuilder/widgets/core/WidgetEVO';
import { TouchScreenEVO } from '../../../plugins/PrototypeBuilder/widgets/core/TouchScreenEVO';

export interface PIMWidgetOptions extends WidgetOptions {
    targetScreen?: { id: string },
    name?: string,
    image?: string,
    evts?: string[]
};

export interface PIMWidgetDescriptor extends WidgetDescriptor {
    name: string,
    targetScreen: string,
    image: string
};

export class PIMWidget extends TouchScreenEVO {
    protected name: string;
    protected targetScreen: { id: string };
    protected image: string;

    constructor (id: string, coords: Coords, opt: PIMWidgetOptions) {
        super(id, coords);
        // this.type = "pim-button";
        opt.evts = ["click"];

        this.name = opt.name || "New widget";
        this.targetScreen = opt.targetScreen;

        this.image = opt.image; // this is a path relative to the project folder
    };

    toJSON (): PIMWidgetDescriptor {
        const targetScreen: string = this.targetScreen?.id;
        const image: string = this.image?.split("/").splice(1).join("/"); // the image path starts with the project name, we need to remove it
        return {
            ...super.toJSON(),
            name: this.name,
            targetScreen,
            image
        };
    };


    /**
     * @function createWidgetImage
     * @description Creates the DOM element that embeds the widget image
     * @returns this
     * @memberof PIMWidget
     */
    createWidgetImage (): void {
        if(!$(".pim-prototyper .overlay-images")[0]) {
            const div: HTMLDivElement = document.createElement("div");
            $(div).addClass("overlay-images").css({ position: "absolute", top:0, left:0, "z-index":90 });
            $(".pim-prototyper .prototype-image-inner").append(div);
        }
        if (!$(".pim-prototyper .overlay-images #" + this.name)[0]) {
            const img: HTMLDivElement = document.createElement("img");
            $(img).css("position", "absolute")
                .css("max-height", this.height + "px")
                .css("max-width", this.width +"px")
                .css("left", this.left + "px")
                .css("top", this.top + "px")
                .css("id", this.name)
                .css("src", "projects/" + this.image);
            $(".pim-prototyper .overlay-images").append(img);
        }
    };


    /**
     * @override
     * @function createImageMap
     * @description Creates an image map area for this widget, which is used by the simulator mode
     * @param {function} opt.onClick Callback to call when the widget is clicked in the simulator
     * @returns {d3.selection} The image map area created for the widget
     * @memberof PIMWidget
     */
    createImageMap (opt?: { onClick? }) {
        if (this.image) {
            this.createWidgetImage();
        }

        this.$div.on("mousedown", (e: JQuery.Event) => {
            opt?.onClick(this, e);
        });
    };

    updateLocationAndSize (pos: { x?: number, y?: number, width?: number, height?: number }): void {
        super.updateLocationAndSize(pos);

        if (this.image && $(".pim-prototyper .overlay-images")[0]) {
            const img: JQuery<HTMLElement> = $(`.pim-prototyper .overlay-images #${this.name}`);
            if (img && img[0]) {
                img.css("position", "absolute")
                    .css("max-height", this.height + "px")
                    .css("max-width", this.width +"px")
                    .css("left", this.left + "px")
                    .css("top", this.top + "px");
            }
        }

    };

    /**
     *
     * Creates a new widget with the same attributes as the current widget
     * @return {PIMWidget} The copy of the widget
     */
    duplicate (): PIMWidget {
        const widget: PIMWidget = new PIMWidget(this.id, {
            top: this.top,
            left: this.left,
            width: this.width,
            height: this.height
        }, {
            name: this.name
        });
        widget.targetScreen = this.targetScreen;
        return widget;
    };

    /**
     * Creates a new widget from the data in the provided object.
     * @param {object} jsonObj JSON-style object with the data for the widget
     * @param {ScreenCollection} screens Collection of screens that the widget's targetScreen is contained within
     * @return {Widget} The new widget
     */
    initFromJSON (jsonObj, screens, projectFolder): PIMWidget {
        const widget: PIMWidget = new PIMWidget(jsonObj.id, {
            top: jsonObj.coords.y,
            left: jsonObj.coords.x,
            width: jsonObj.coords.width,
            height: jsonObj.coords.height
        }, {
            name: jsonObj.name,
            image: (jsonObj.image) ? projectFolder + jsonObj.image : null
        });

        if (jsonObj.targetScreen) {
            widget.targetScreen = screens.get(jsonObj.targetScreen);
        }

        return widget;
    };
}
