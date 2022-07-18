import * as Backbone from 'backbone';
import { Connection } from '../../common/interfaces/Connection';
import { PVSioWebPlugin } from '../../common/interfaces/Plugins';
import * as Utils from '../../common/utils/pvsiowebUtils';
import { BackboneConnection } from '../../core/ConnectionImpl';
import { PrototypeBuilderEvents } from '../PrototypeBuilder/BuilderUtils';
import { CentralViews, dropDownMenuTemplate, SideViews } from '../PrototypeBuilder/PrototypeBuilder';
import { SettingsView } from '../PrototypeBuilder/views/SettingsView';
import { SplashScreenView } from './views/SplashScreenView';
import { EmuchartsEditorView } from './views/EmuchartsEditorView';

// min width of the left panel
const MIN_WIDTH_LEFT: number = 10; //px

const emuchartsBody: string = `
<style>
.emucharts-coords {
    color: white;
    font-size: small;
    font-family: monospace;
    position:absolute;
}
.content {
    height: 100%;
}
.full-height {
    height: 100%;
}
.left-panel {
    overflow-x:hidden;
    width:30%; 
    min-width:${MIN_WIDTH_LEFT}px; 
    position:relative;
    border: 1px solid lightgray;
    background:whitesmoke;
}
.resize-bar {
    width:6px;
    background-color:#4c4c4c;
}
.central-panel {
    position:relative;
    width:66%;
    height:100%;
    background:whitesmoke;
}
.central-panel-inner {
    width:100% !important;
    min-height:600px;
}
.card-header-dropdown-menu {
    position:absolute;
    top:10px;
    border: 0px;
    z-index:0;
}
.r-10 {
    right:10px !important;
    margin-top:-3px !important; 
}
</style>
<div id="{{id}}" class="emucharts-content row d-flex p-0 full-height">
    <div id="{{id}}-left" class="left-panel container-fluid no-gutters p-0">
        <div class="emucharts-sidebar-heading p-2">
        </div>
        <div id="{{id}}-widget-list" class="widget-list list-group"></div>
        <div id="{{id}}-timers-list" class="list-group"></div>
    </div>
    <div id="{{id}}-resize-bar" class="resize-bar"></div>
    <div id="{{id}}-central" class="flex-grow-1 no-gutters p-0 central-panel">
        <div class="card-header central-panel-header" style="display:none;"></div>
        <div class="card-body central-panel-inner tab-content p-1 m-0"></div>
    </div>
    <!-- the coordinates div need to be placed outside the panel, otherwise the panel flickers because the scroll bars sometimes may appear when the coordinates are updates -->
    <div class="emucharts-coords px-2">(top:0, left:0)</div>
</div>`;

const navbarCentral: string = `
<button class="btn btn-sm btn-dark emucharts-navbar simulator">Simulator</button>
<button class="btn btn-sm btn-dark emucharts-navbar editor">Editor</button>
<button class="btn btn-sm btn-dark emucharts-navbar settings">Settings</button>`;

export const FileMenu: string = Handlebars.compile(dropDownMenuTemplate, { noEscape: true })({
    items: [
        `<div class="new-emuchart btn btn-sm btn-outline-dark">New Emuchart</div>`
    ]
});

const navbarLeft: string = `
<style>
.custom-file {
    min-width:220px;
}
.dropdown-item {
    font-size: small;
    cursor:default;
}
</style>
<div class="dropdown">
    <button class="btn btn-sm btn-dark emucharts-navbar dropdown-toggle" data-toggle="dropdown">File</button>
    ${FileMenu}
</div>
`;

export interface EmuchartCentralViews extends CentralViews {
    Editor: EmuchartsEditorView
}

// TODO: use this base class to create a pvsioweb plugin base class
export class Emucharts extends Backbone.Model implements PVSioWebPlugin {
    readonly name: string = "Emucharts";
    readonly id: string = Utils.removeSpaceDash(this.name);
    static readonly constructorName: string = "Emucharts";
    static readonly version: string = "3.0";

    protected mode: "editor" | "settings" | "splash" = "splash";

    protected activeFlag: boolean = false;
    protected parent: string = "body";
    protected $menu: JQuery<HTMLElement>;

    /**
     * The connection but is public, so objects using Emucharts can set listeners and trigger events on the connection
     */
    connection: Connection;

    /**
     * Panel containing the view
     */
    protected panel: Utils.StickyPanel;

    /**
     * Body of the view
     */
    protected body: Utils.SplitPanel;

    /**
     * Last non-zero width of the side panel, useful for collapse/expand operations when switching between builder and simulator views
     */
    protected width: string = "0px";

    /**
     * Flag indicating whether the side view is collapsed/hidden
     */
    protected sidePanelIsCollapsed: boolean = false;
    protected sidePanelIsHidden: boolean = false;

    /**
     * Pointers to side views and central view
     */
    protected sideViews: SideViews;
    protected centralViews: EmuchartCentralViews;

    /**
     * Activate the plugin, i.e., create the panel and install event handlers
     * @param opt 
     */
    async activate (opt?: {
        connection?: Connection, 
        parent?: string, 
        top?: number, 
        settings?: {
            contextFolder: string
        }
    }): Promise<boolean> {
        opt = opt || {};
        this.parent = opt.parent || this.parent;

        // use connection indicated in the options of the constructor, or use a basic backbone connection
        this.connection = opt.connection || new BackboneConnection();
        console.log(`Browser version: ${Utils.getVersion()}`);
        // @ts-ignore
        console.log(`Bootstrap version`, $?.fn?.tooltip?.Constructor?.VERSION);

        // create panel, toolbar, and body
        this.panel = Utils.createStickyPanel(this, {
            parent: this.parent,
            navbarCentral,
            navbarLeft
        });
        this.body = this.createPanelBody({
            parent: this.panel.$content
        });
        
        // create central view and side view
        const bodyDiv: HTMLElement = this.panel.$content.find(`.central-panel-inner`)[0];
        this.sideViews = null; // TODO
        this.centralViews = {
            Settings: new SettingsView({
                label: "Settings",
                viewId: `${this.id}-settings-view`,
                panelId: `${this.id}-settings-view`,
                el: bodyDiv,
                parentDiv: this.body.$central[0],
                settings: {
                    contextFolder: opt.settings?.contextFolder || ""
                }
            }, this.connection),
            Builder: null,
            Simulator: null,
            Editor: new EmuchartsEditorView({
                label: "",
                viewId: `${this.id}-editor-screeen-view`,
                panelId: `${this.id}-editor-screeen-view`,
                active: true,
                el: bodyDiv,
                parentDiv: this.body.$central[0],
            }, this.connection),
            Splash: new SplashScreenView({
                label: "",
                viewId: `${this.id}-splash-screeen-view`,
                panelId: `${this.id}-splash-screeen-view`,
                active: true,
                el: bodyDiv,
                parentDiv: this.body.$central[0],
            }, this.connection)
        };
        // render views
        await this.renderViews();
        // create whiteboard
        this.centralViews?.Builder?.createWhiteboard();
        // initialize pointer to the menu
        this.$menu = this.panel?.$navbar;
        // install handlers
        this.installHandlers();
        // refresh the view
        this.onResizeCentralView();
        // signal ready
        console.log(`[${this.id}] DidActivatePlugin`);
        this.trigger(PrototypeBuilderEvents.DidActivatePlugin);
        // switch to builder view
        this.switchToSplashScreenView();
        // update active flag
        this.activeFlag = true;
        return this.activeFlag;
    }

    /**
     * Internal function, creates the html content of the panel
     */
    protected createPanelBody (desc: { parent: JQuery<HTMLElement> }): Utils.SplitPanel {
        const id: string = `${this.id}-panel`;
        const content: string = Handlebars.compile(emuchartsBody, { noEscape: true })({
            id
        });
        desc.parent.append(content);
        const $div: JQuery<HTMLDivElement> = $(`#${id}`);
        const $left: JQuery<HTMLDivElement> = $(`#${id}-left`);
        const $central: JQuery<HTMLDivElement> = $(`#${id}-central`);
        const $resizeBar: JQuery<HTMLDivElement> = $(`#${id}-resize-bar`);

        const body: Utils.SplitPanel = Utils.enableResizeLeft({
            $div, 
            $left, 
            $central, 
            $resizeBar, 
            onResize: (desc?: { width: string, height: string }) => {
                this.onResizeCentralView(desc);
            }
        });
        return body;
    }

    /**
     * Returns the name of the plugin
     */
    getName (): string { return this.name; };

    /**
     * Returns the id of the plugin
     */
    getId (): string { return this.id };

    /**
     * Returns the dependencies of the plugin
     */
    getDependencies (): string[] { return []; }

    /**
     * Returns true if the plugin is active
     */
    isActive (): boolean {
        return this.activeFlag;
    }

    /**
     * Internal function, adjusts the size of the central panel
     * @param desc Width and height of the panel
     */
    protected onResizeCentralView (desc?: { width: string, height: string }): void {
        for (let i in this.centralViews) {
            this.centralViews[i]?.resizeView(desc);
        }
        this.width = this.body?.$left.css("width");
    };

    /**
     * Internal function, renders the panels (central panel and side panel)
     */
    protected async renderViews (): Promise<void> {
        for (let i in this.centralViews) {
            await this.centralViews[i]?.renderView();
            // add listeners for side views, so they can be shown/hidden together with the corresponding central view
            // TODO
        }
    }

    /**
     * Internal function, install event handlers
     */
    protected installHandlers (): void {
        // edit menu items, in navbar and settings view
        $(document).find(".new-emuchart").on("click", async (evt: JQuery.ClickEvent) => {
            if (this.mode === "splash") {
                this.switchToEditorView();
            }
        });
    }

    /**
     * Shows editor screen
     */
    switchToEditorView (): void {
        this.centralViews?.Editor?.editorView();
        this.highlightEditorButton();
        if (this.sidePanelIsHidden) {
            this.revealSidePanel();
        }
        if (this.sidePanelIsCollapsed) {
            this.expandSidePanel();
        }
        this.revealEmuchartsMenu();
        this.mode = "editor";
        // the following event can be used by interested listeners to save the prototype data
        this.trigger(PrototypeBuilderEvents.DidSwitchToBuilderView);
        console.log(`[${this.id}] DidSwitchToEditorView`);
    }

    /**
     * Internal function, highlights editor view button
     */
    protected highlightEditorButton (): void {
        this.deselectNavbarButtons();
        this.panel.$navbar.find(".emucharts-navbar.editor").removeClass("btn-dark").addClass("btn-primary");
    }


    /**
     * Shows splash screen
     */
    switchToSplashScreenView (): void {
        this.centralViews?.Splash?.revealView();
        this.deselectNavbarButtons();
        this.hideSidePanel();
        this.mode = "splash";
        // this can be used by interested listeners to save the prototype data
        // const data: PrototypeData = this.getPrototypeData();
        // this.trigger(PrototypeBuilderEvents.DidSwitchToSplashScreenView, data);
        // console.log(`[emucharts] DidSwitchToSplashScreenView`, data);
    }

    /**
     * Collapse side panel
     */
    collapseSidePanel (): void {
        this.saveSidePanelWidth();
        this.body.$left?.css({ display: "block" });
        this.body.$left?.animate({ "min-width": 0, width: 0 }, 500);
        this.body.$resizeBar?.css({ display: "none" });
        this.sidePanelIsCollapsed = true;
    }

    /**
     * Expands side panel
     */
    expandSidePanel (): void {
        this.body.disableResize = false;
        this.body.$left?.css({ display: "block" });
        this.body.$left?.animate({ "min-width": `${MIN_WIDTH_LEFT}px`, width: this.width }, 500);
        this.body.$resizeBar?.css({ display: "block" });
        this.sidePanelIsCollapsed = false;
        this.sidePanelIsHidden = false;
    }

    /**
     * Hides side panel
     */
    hideSidePanel (): void {
        this.body.$left?.css({ display: "none" });
        this.body.$resizeBar?.css({ display: "none" });
        this.sidePanelIsHidden = true;
    }

    /**
     * Reveals side panel
     */
    revealSidePanel (): void {
        this.body.$left?.css({ display: "block" });
        this.body.$resizeBar?.css({ display: "block" });
        this.sidePanelIsHidden = false;
    }

    /**
     * Utility function, saves side panel width
     */
    saveSidePanelWidth (): void {
        this.body.disableResize = true;
        const width: string = this.body.$left.css("width");
        if (parseFloat(width) > 2 * MIN_WIDTH_LEFT) {
            this.width = width;
        }
    }

    /**
     * Internal function, deselects all navbar buttons
     */
    protected deselectNavbarButtons (): void {
        this.panel.$navbar.find(".emucharts-navbar").removeClass("btn-primary").addClass("btn-dark");
    }

    /**
     * Hide emucharts menus
     */
    hideEditorrMenu (): void {
        this.$menu?.find(".emucharts-menu").css("display", "none");
    }

    /**
     * Reveal emucharts menus
     */
    revealEmuchartsMenu (): void {
        this.$menu?.find(".emucharts-menu").css("display", "inline-block");
    }


}