import { CentralView, CentralViewOptions } from "../../PrototypeBuilder/views/CentralView";
import { Connection } from '../../../common/interfaces/Connection';
import { DEFAULT_PICTURE_SIZE, PictureSize } from "../../PrototypeBuilder/BuilderUtils";
import {  DEFAULT_TOOLBAR_BTN_HEIGHT, DEFAULT_TOOLBAR_BTN_WIDTH, EditorMode, EmuchartsEditor } from "./editors/EmuchartsEditor";
import { Coords } from "../../../common/interfaces/Widgets";

export interface EmuchartsEditorViewOptions extends CentralViewOptions {
};
// TODO: move style to a .css file
const contentTemplate: string = `
<style>
.view-div {
    position:absolute;
    padding-left:0;
}
.emucharts-toolbar {
    position:absolute; 
    transform:scale(0.8);
    transform-origin:left;
}
.emucharts-toolbar .btn {
    height:2.5em;
}
.canvas-frame {
    position: absolute;
    cursor: default;
}
.canvas-overlay {
    position: absolute;
    cursor: default;
}
.canvas-toolbar {
    z-index: 1;
    transform: scale(0.5);
    transform-origin: top left;
    width: ${DEFAULT_TOOLBAR_BTN_WIDTH}px;
    background-color: #343a40;
    top:40px;
}
.canvas {
    transform-origin: top left;
}
.browse-icon {
    transform: scale(1.5);
    color:white;
}
.new-node-icon {
    width: 20px;
    height: 22px;
    border: 1px solid black;
    background: white;
    margin: auto;
    border-radius: 4px;
    box-shadow: lightgray 3px 3px;
}
.new-edge-icon {
    color: white;
    transform: translateY(-12px);
}
.new-self-edge-icon {
    color: white;
    transform:rotate(45deg);
}
.emucharts-toolbar-button {
    width: ${DEFAULT_TOOLBAR_BTN_WIDTH}px !important;
    height: ${DEFAULT_TOOLBAR_BTN_HEIGHT}px !important;
    border: 1px solid white;
}
</style>
<div class="canvas row">
    <div class="canvas-toolbar view-div container-fluid p-0">
        <div class="btn-group btn-group-vertical" role="group" style="overflow:hidden;">
            <button class="btn btn-sm btn-outline-primary emucharts-toolbar-button browse active" title="Browse"><i class="browse-icon fa fa-mouse-pointer"></i></button>
            <button class="btn btn-sm btn-outline-primary emucharts-toolbar-button new-node" title="New node"><div class="new-node-icon"></div></button>
            <button class="btn btn-sm btn-outline-primary emucharts-toolbar-button new-edge" title="New edge">
                <i class="new-edge-icon fa fa-2x fa-long-arrow-right fa-stack-2x"></i>
            </button>
            <button class="btn btn-sm btn-outline-primary emucharts-toolbar-button new-self-edge hue-rotate" title="New self-edge">
                <span class="fa-stack new-self-edge-icon">
                    <i class="fa fa-2x fa-repeat fa-stack-2x" style="transform:rotate(80deg);"></i>
                    <i class="fa fa-square fa-stack-1x" aria-hidden="true" style="transform:scale(0.6)translate(0px, 24px); color:white;"></i>
                </span>
            </button>
        </div>
    </div>
    <div class="canvas-frame view-div container-fluid p-0"></div>
    <div class="canvas-overlay container-fluid p-0"></div>
</div>`;

type ToolbarButton = "browse" | "new-edge" | "new-self-edge" | "new-node"; // classes associated to the toolbar buttons


/**
 * Emucharts events
 */
export enum EmuchartsEvents {
    DidSwitchToBrowserMode = "DidSwitchToBrowserMode",
    DidSwitchToNewNodeMode = "DidSwitchToNewNodeMode",
    DidSwitchToNewEdgeMode = "DidSwitchToNewEdgeMode",
    DidSwitchToNewSelfEdgeMode = "DidSwitchToNewSelfEdgeMode"
}

export class EmuchartsEditorView extends CentralView {

    // DOM elements for the editor
    protected $editorFrame: JQuery<HTMLElement>;
    protected $editorOverlay: JQuery<HTMLElement>;
    protected $editorCoords: JQuery<HTMLElement>;
    protected $editorToolbar: JQuery<HTMLElement>;

    // editor instance
    protected editor: EmuchartsEditor;

    /**
     * Default panel size
     */
    readonly defaultPanelSize: PictureSize = DEFAULT_PICTURE_SIZE;


    /**
     * Builder view constructor
     * @param data 
     * @param connection 
     */
    constructor (data: EmuchartsEditorViewOptions, connection: Connection) {
        super(data, connection);
    }

    /**
     * Renders the view
     * The view includes two layers:
     * - a frame layer (canvas-frame) for rendering the diagram
     * - an overlay layer (canvas-overlay) shows hotspot areas. This layer becomes hidden in simulator view.  
     */
    async renderView (): Promise<EmuchartsEditorView> {
        const content: string = Handlebars.compile(contentTemplate, { noEscape: true })({});
        await super.renderView({ ...this.viewOptions, content });
        this.$editorFrame = this.$el.find(".canvas-frame");
        this.$editorOverlay = this.$el.find(".canvas-overlay");
        this.$editorCoords = $(document).find(".emucharts-coords");
        this.$editorToolbar = this.$el.find(".emucharts-toolbar");
        // update frame layer
        await this.updateFrameLayer();
        // install handlers
        this.installHandlers();
        // resize view to fit current window size
        this.resizeView();
        // create emucharts editor
        this.createEmuchartsEditor();
        return this;
    }

    /**
     * @override
     */
    resizeView (coords?: Coords): void {
        super.resizeView(coords);
        this.editor?.resizeView(coords);
    }

    /**
     * Internal function, creates the editor
     */
     protected createEmuchartsEditor (): void {
        this.editor = new EmuchartsEditor({
            el: this.$editorFrame[0],
            panel: this.$panelDiv[0],
            parent: this.$editorFrame[0],
            coords: this.$editorCoords[0]
        });
        this.editor.renderView();
    }

    /**
     * Switch to editor view
     */
    editorView (): void {
        this.revealView();
        this.revealCoords();
        this.revealToolbar();
    }

    /**
     * Updates the size of the frame for drawing the diagram
     */
    async updateFrameLayer (): Promise<PictureSize> {
        const size: PictureSize = this.getCurrentCanvasSize() || this.defaultPanelSize;
        this.$editorFrame.css({ height: size.height, width: size.width });
        return size;
    }

    /**
     * Hide coordinates
     */
    hideCoords (): void {
        this.$editorCoords?.css("display", "none");
    }

    /**
     * Reveal coordinates
     */
    revealCoords (): void {
        this.$editorCoords?.css("display", "block");
    }

    /**
     * Hide toolbar
     */
    hideToolbar (): void {
        this.$editorToolbar?.css("display", "none");
    }

    /**
     * Reveal toolbar
     */
    revealToolbar (): void {
        this.$editorToolbar?.css("display", "block");
    }

    /**
     * Internal function, install event handlers
     */
    protected installHandlers (): void {
        // handlers for toolbar widgets
        $(".emucharts-toolbar-button.browse").on("click", () => { this.browseMode(); });
        $(".emucharts-toolbar-button.new-node").on("click", () => { this.newNodeMode(); });
        $(".emucharts-toolbar-button.new-edge").on("click", () => { this.newEdgeMode(); });
        $(".emucharts-toolbar-button.new-self-edge").on("click", () => { this.newSelfEdgeMode(); });
    }

    /**
     * Selects browse widget from the toolbar, switches to browse mode, and fires an event EmuchartsEvents.DidSwitchToBrowserMode
     */
    browseMode (): void {
        this.activateToolbarButton("browse");
        this.editor.setMode(EditorMode.BROWSE);
        this.defaultCursor();
        this.trigger(EmuchartsEvents.DidSwitchToBrowserMode);
        console.log(`[EmuchartsEditorView] DidSwitchToBrowserMode`);
    }

    /**
     * Selects new node widget from the toolbar, switches to add node mode, and fires an event EmuchartsEvents.DidSwitchToNewNodeMode
     */
    newNodeMode (): void {
        this.activateToolbarButton("new-node");
        this.editor.setMode(EditorMode.NEW_NODE);
        this.crosshairCursor();
        this.trigger(EmuchartsEvents.DidSwitchToNewNodeMode);
        console.log(`[EmuchartsEditorView] DidSwitchToNewNodeMode`);
    }

    /**
     * Selects new node widget from the toolbar, switches to add edge mode, and fires an event EmuchartsEvents.DidSwitchToNewEdgeMode
     */
    newEdgeMode (): void {
        this.activateToolbarButton("new-edge");
        this.editor.setMode(EditorMode.NEW_EDGE);
        this.crosshairCursor();
        this.trigger(EmuchartsEvents.DidSwitchToNewEdgeMode);
        console.log(`[EmuchartsEditorView] DidSwitchToNewEdgeMode`);
    }

    /**
     * Selects new node widget from the toolbar, switches to add edge mode, and fires an event EmuchartsEvents.DidSwitchToNewEdgeMode
     */
    newSelfEdgeMode (): void {
        this.activateToolbarButton("new-self-edge");
        this.editor.setMode(EditorMode.NEW_SELF_EDGE);
        this.crosshairCursor();
        this.trigger(EmuchartsEvents.DidSwitchToNewSelfEdgeMode);
        console.log(`[EmuchartsEditorView] DidSwitchToNewSelfEdgeMode`);
    }

    /**
     * Utility function, deactivates all buttons in the toolbar
     */
    deactivateAllToolbarButtons (): void {
        $(".emucharts-toolbar-button").removeClass("active");
    }

    /**
     * Utility function, activates a given toolbar button
     */
    activateToolbarButton (btn: ToolbarButton): boolean {
        if (btn) {
            const $btn: JQuery<HTMLElement> = $(`.emucharts-toolbar-button.${btn}`);
            if ($btn[0]) {
                this.deactivateAllToolbarButtons();
                $btn.addClass("active");
                return true;
            }
        }
        return false;
    }

    /**
     * Utility function, sets the cursor to crosshair
     */
    crosshairCursor (): void {
        $(".canvas-frame").css("cursor", "crosshair")
    }

    /**
     * Utility function, sets the cursor to default
     */
    defaultCursor (): void {
        $(".canvas-frame").css("cursor", "default")
    }

    /**
     * Returns the current frame size
     */
    getCurrentCanvasSize (): PictureSize {
        // console.log(img);
        return {
            width: this.getCurrentCanvasWidth(),
            height: this.getCurrentCanvasHeight()
        };
    }

    /**
     * Returns the current frame width
     */
    getCurrentCanvasWidth (): number {
        const box: DOMRect = this.$editorFrame[0]?.getBoundingClientRect();
        const width: number = box.width || 0;
        return width;
    }

    /**
     * Returns the current picture height
     */
    getCurrentCanvasHeight (): number {
        const box: DOMRect = this.$editorFrame[0]?.getBoundingClientRect();
        const height: number = box.height || 0;
        return height;
    }    
}