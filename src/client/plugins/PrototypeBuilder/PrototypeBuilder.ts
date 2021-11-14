
import * as Backbone from 'backbone';

import * as Utils from '../../common/utils/pvsiowebUtils';
import * as fsUtils from "../../common/utils/fsUtils";
import { Renderable, WidgetData, WidgetOptions } from '../../common/interfaces/Widgets';
import { PVSioWebPlugin } from '../../common/interfaces/Plugins';
import { Connection } from '../../common/interfaces/Connection';

import * as builderView from './views/BuilderView';
import { BuilderEvents, BuilderView, CreateWidgetEvent, DeleteWidgetEvent, CutWidgetEvent, SelectWidgetEvent } from './views/BuilderView';
import { WidgetsListView } from './views/WidgetsListView';
import { SettingsEvents, SettingsView } from './views/SettingsView';
import { CentralViewEvents, WidgetsMap } from './views/CentralView';
import { SideView } from './views/SideView';
import { SimulatorView } from './views/SimulatorView';
import { WidgetClassManager } from './WidgetClassManager';
import { DidChangePictureEventData, IoFile, PrototypeData, DataAttribute, WebFile, defaultIoSettings, defaultWebSettings, PictureSize, getWebFile, getIoFile, PrototypeBuilderEvents, Picture, DidRemovePictureEventData, whiteboardFile  } from './BuilderUtils';
import { SplashScreenView } from './views/SplashScreenView';
import { BackboneConnection } from '../../core/ConnectionImpl';

export interface DidChangePictureData extends DidChangePictureEventData, PrototypeData {};

const MIN_WIDTH_LEFT: number = 10; //px

const prototypeBuilderBody: string = `
<style>
.builder-sidebar-heading {
    color: white;
    display: block;
    background-color: #4c4c4c;
    border-bottom:1px solid;
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
.builder-content {
    height:100%;
    margin-left:0;
}
.builder-coords {
    color: white;
    font-size: small;
    font-family: monospace;
    position:absolute;
}
.dropdown-menu .dropdown-item {
    padding-top:4px !important;
}
.dropdown-item .btn {
    width:100%;
}
.btn-sm {
    white-space:nowrap;
}
</style>
<div id="{{id}}" class="builder-content row d-flex p-0">
    <div id="{{id}}-left" class="left-panel container-fluid no-gutters p-0">
        <div class="builder-sidebar-heading p-2">
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
    <div class="builder-coords px-2">(top:0, left:0)</div>
</div>`;

const navbarCentral: string = `
<button class="btn btn-sm btn-dark builder-navbar simulator">Simulator</button>
<button class="btn btn-sm btn-dark builder-navbar builder">Builder</button>
<button class="btn btn-sm btn-dark builder-navbar settings">Settings</button>`;

export const changePictureTemplate: string = `
<form class="load-picture-form">
    <div class="custom-file">
        <input class="change-picture custom-file-input" type="file" accept="image"">
        <label class="custom-file-label">Change Picture</label>
    </div>
</form>`;

export const removePictureTemplate: string = `
<div class="btn btn-sm btn-outline-danger remove-picture">Remove Picture</div>`;

export const compactDropdownButtonTemplate: string = `
<button class="btn btn-sm btn-dark builder-navbar dropdown-toggle" data-toggle="dropdown"></button>`;

export const dropDownMenuTemplate: string = `
<div class="dropdown-menu px-2">
    {{#each items}}
        {{#if divider}}<div class="dropdown-divider"></div>
        {{else}}<div class="dropdown-item input-group p-0">{{this}}</div>
        {{/if}}
    {{/each}}
</div>`;

/**
 * Toolbar menus
 */
// export const fileMenu: string = Handlebars.compile(dropDownMenuTemplate, { noEscape: true })({
//     items: [
//         `<div class="dropdown-item btn btn-sm save">Save Prototype</div>`
//     ]
// });
export const pictureMenu: string = Handlebars.compile(dropDownMenuTemplate, { noEscape: true })({
    items: [
        changePictureTemplate,
        { divider: true },
        removePictureTemplate
    ]
});
export const runMenu: string = Handlebars.compile(dropDownMenuTemplate, { noEscape: true })({
    items: [
        // `<div class="btn btn-sm btn-outline-dark pause-simulation">Pause Simulation</div>`,
        // { divider: true },
        `<div class="reboot-simulator btn btn-sm btn-outline-danger">Reboot Simulation</div>`
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
    <button class="btn btn-sm btn-dark builder-navbar dropdown-toggle" data-toggle="dropdown">Picture</button>
    ${pictureMenu}
</div>
<div class=""dropdown">
    <button class="btn btn-sm btn-dark builder-navbar dropdown-toggle" data-toggle="dropdown">Run</button>
    ${runMenu}
</div>
`;

export interface CentralViews {
    Settings: SettingsView,
    Builder: BuilderView,
    Simulator: SimulatorView,
    Splash: SplashScreenView
};
export interface SideViews {
    Builder: SideView
};

export class PrototypeBuilder extends Backbone.Model implements PVSioWebPlugin {
    readonly name: string = "Prototype Builder";
    readonly id: string = Utils.removeSpaceDash(this.name);
    static readonly constructorName: string = "PrototypeBuilder";
    static readonly version: string = "3.0";

    protected mode: "simulator" | "builder" | "settings" | "splash" = "splash";

    protected activeFlag: boolean = false;
    protected parent: string = "body";
    protected $menu: JQuery<HTMLElement>;

    /**
     * Widget class manager
     */
    protected widgetClassManager: WidgetClassManager = new WidgetClassManager();

    /**
     * The connection but is public, so objects using PrototypeBuilder can set listeners and trigger events on the connection
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
    protected centralViews: CentralViews;

    /**
     * Activate the plugin, i.e., create the panel and install event handlers
     * @param opt 
     */
    async activate (opt?: {
        connection?: Connection, 
        parent?: string, 
        top?: number, 
        settings?: {
            io: IoFile,
            web: WebFile,
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
        this.sideViews = {
            Builder: new WidgetsListView({
                el: this.panel.$content.find(".widget-list")[0]
            })
        };
        this.centralViews = {
            Settings: new SettingsView({
                label: "Settings",
                viewId: "settings-view",
                panelId: "settings-view",
                el: bodyDiv,
                parentDiv: this.body.$central[0],
                settings: {
                    io: opt.settings?.io || defaultIoSettings,
                    web: opt.settings?.web || defaultWebSettings,
                    contextFolder: opt.settings?.contextFolder || ""
                }
            }, this.connection),
            Builder: new BuilderView({
                label: "Builder",
                viewId: "builder-view",
                panelId: "builder-view",
                el: bodyDiv,
                // active: true,
                parentDiv: this.body.$central[0],
                widgetClassMap: this.widgetClassManager?.getWidgetClassMap() || {}
            }, this.connection),
            Simulator: new SimulatorView({
                label: "Simulator",
                viewId: "simulator-view",
                panelId: "builder-view",
                el: bodyDiv,
                parentDiv: this.body.$central[0],
            }, this.connection),
            Splash: new SplashScreenView({
                label: "",
                viewId: "splash-screeen-view",
                panelId: "splash-screen-view",
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
        console.log(`[prototype-builder] DidActivatePlugin`);
        this.trigger(PrototypeBuilderEvents.DidActivatePlugin);
        // switch to builder view
        this.switchToSplashScreenView();
        // update active flag
        this.activeFlag = true;
        return this.activeFlag;
    }

    /**
     * Deactivates the plugin
     * @return current prototype data, so interested listeners can save the prototype before closing prototype builder
     */
    deactivate (): PrototypeData {
        // clear delayed triggers in builder and settings view
        this.centralViews.Builder.clearDelayedTriggers();
        this.centralViews.Settings.clearDelayedTriggers();
        // return prototype data
        const data: PrototypeData = this.getPrototypeData();
        return data;
    }


    /**
     * Utility function, imports widget library
     */
    importWidgetLibrary (widgetLib: any): void {
        if (this.widgetClassManager) {
            console.log(`[pvsio-web] Importing widget library`, widgetLib);
            if (widgetLib) {
                const libNames = Object.keys(widgetLib);
                for (let i = 0; i < libNames.length; i++) {
                    const name: string = libNames[i];
                    console.log(`[pvsio-web] Importing ${name}`, widgetLib[name]);
                    try {
                        this.widgetClassManager.importWidgetClassMap(widgetLib[name]);
                        console.log(`[pvsio-web] Library ${name} imported successfully!`);
                    } catch (error) {
                        console.warn(`[pvsio-web] Warning: unable to load widget library`, widgetLib);
                    }
                }
            }
        }
    }

    /**
     * Returns a view
     * @param name 
     */
    getView (name: string): SettingsView | BuilderView | SimulatorView {
        return this.centralViews[name];
    }

    /**
     * Returns true if the plugin is active
     */
    isActive (): boolean {
        return this.activeFlag;
    }

    /**
     * Hide builder menus
     */
    hideBuilderMenu (): void {
        this.$menu?.find(".builder-menu").css("display", "none");
    }

    /**
     * Reveal builder menus
     */
    revealBuilderMenu (): void {
        this.$menu?.find(".builder-menu").css("display", "inline-block");
    }

    /**
     * Hide builder menus
     */
    hideSimulatorMenu (): void {
        this.$menu?.find(".simulator-menu").css("display", "none");
    }

    /**
     * Reveal builder menus
     */
    revealSimulatorMenu (): void {
        this.$menu?.find(".simulator-menu").css("display", "inline-block");
    }

    /**
     * Remove prototype picture
     */
    async removePicture (): Promise<void> {
        if (!this.isWhiteboard()) {
            const old: Picture = this.centralViews.Builder.getCurrentPicture();
            await this.centralViews.Builder.createWhiteboard();
            const data: PrototypeData = this.getPrototypeData();
            const evt: DidRemovePictureEventData = {
                old, ...data
            };
            console.log(`[prototype-builder] DidRemovePicture`, evt);
            this.trigger(PrototypeBuilderEvents.DidRemovePicture, { pictureFile: evt });
        }
    }

    /**
     * Renders all widgets
     * @param state 
     */
    async renderState (state: Renderable, opt?: WidgetOptions): Promise<void> {
        console.log(`[pvsio-web] Render state`, state, opt);
        return await this.centralViews?.Simulator?.renderState(state, opt);
    }

    /**
     * Internal function, creates the html content of the panel
     * @param desc 
     */
    protected createPanelBody (desc: { parent: JQuery<HTMLElement> }): Utils.SplitPanel {
        const id: string = `${this.id}-panel`;
        const content: string = Handlebars.compile(prototypeBuilderBody, { noEscape: true })({
            id
        });
        desc.parent.append(content);
        const $div: JQuery<HTMLDivElement> = $(`#${id}`);
        const $left: JQuery<HTMLDivElement> = $(`#${id}-left`);
        const $central: JQuery<HTMLDivElement> = $(`#${id}-central`);
        const $resizeBar: JQuery<HTMLDivElement> = $(`#${id}-resize-bar`);

        const body: Utils.SplitPanel = Utils.enableResizeLeft({ $div, $left, $central, $resizeBar, onResize: this.onResizeCentralView });
        return body;
    }

    /**
     * Internal function, adjusts the size of the central panel
     * @param desc Width and height of the panel
     */
    protected onResizeCentralView (desc?: { width: string, height: string }): void {
        for (let i in this.centralViews) {
            this.centralViews[i].resizeView(desc);
        }
        this.width = this.body?.$left.css("width");
    };

    /**
     * Utility function, checks if a picture is loaded in the view
     */
    isWhiteboard (): boolean {
        const currentPicture: Picture = this.centralViews.Builder.getCurrentPicture();
        return !(currentPicture?.fileName && currentPicture?.fileExtension && `${currentPicture.fileName}${currentPicture.fileExtension}` !== whiteboardFile);
    }

    /**
     * Internal function, highlights builder view button
     */
    protected highlightBuilderButton (): void {
        this.deselectNavbarButtons();
        this.panel.$navbar.find(".builder-navbar.builder").removeClass("btn-dark").addClass("btn-primary");
    }

    /**
     * Internal function, highlights simulator view button
     */
    protected highlightSimulatorButton (): void {
        this.deselectNavbarButtons();
        this.panel.$navbar.find(".builder-navbar.simulator").removeClass("btn-dark").addClass("btn-primary");
    }

    /**
     * Internal function, highlights settings view button
     */
    protected highlightSettingsButton (): void {
        this.deselectNavbarButtons();
        this.panel.$navbar.find(".builder-navbar.settings").removeClass("btn-dark").addClass("btn-primary");
    }

    /**
     * Internal function, deselects all navbar buttons
     */
    protected deselectNavbarButtons (): void {
        this.panel.$navbar.find(".builder-navbar").removeClass("btn-primary").addClass("btn-dark");
    }

    /**
     * Internal function, install event handlers
     */
    protected installHandlers (): void {
        // buttons for the three main views (no button is provided for splash screen)
        this.centralViews.Simulator.on(CentralViewEvents.DidShowView, () => {
            this.switchToSimulatorView();
        });
        this.centralViews.Builder.on(CentralViewEvents.DidShowView, () => {
            this.switchToBuilderView();
        });
        this.centralViews.Settings.on(CentralViewEvents.DidShowView, () => {
            this.switchToSettingsView();
        });

        // more builder events
        this.centralViews.Builder.on(CentralViewEvents.DidChangePictureSize, (size: PictureSize) => {
            this.centralViews.Settings.updatePictureSize(size); 
        });
        this.centralViews.Builder.on(BuilderEvents.DidLoadPicture, (evt: WebFile) => {
            this.centralViews.Settings.updateSettings({ web: evt }); 
        })
        this.centralViews.Builder.on(BuilderEvents.DidChangePicture, (evt: builderView.DidChangePictureEventData) => {
            // send prototype data on the connection, so interested listeners can save the prototype if they use autosave
            const data: PrototypeData = this.getPrototypeData();
            // update settings view
            this.centralViews.Settings.updateSettings({ web: getWebFile(data) });
            // send information on the current prototype, so the user can choose to save the current prototype before creating the new prototype
            const evtData: DidChangePictureData = { ...data, ...evt };
            console.log(`[prototype-builder] DidChangePicture`, evtData);
            this.trigger(PrototypeBuilderEvents.DidChangePicture, evtData);
        });

        // settings events
        this.centralViews.Settings.on(CentralViewEvents.DidChangePictureSize, (size: PictureSize) => {
            this.centralViews.Builder.resizePicture(size);
        });
        this.centralViews.Settings.on(SettingsEvents.DidUpdateSettings, () => {
            // send prototype data on the connection, so interested listeners can save the prototype if they use autosave
            const req: PrototypeData = this.getPrototypeData();
            // send information on the current prototype, so the user can choose to save the current prototype before opening a new prototype
            console.log(`[prototype-builder] DidUpdateSettings`, req);
            this.trigger(PrototypeBuilderEvents.DidUpdateSettings, req);
        });

        // left navbar handlers / file menu
        this.panel.$navbar.find(".new-prototype").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            // send information on the current prototype, so the user can choose to save the current prototype before creating the new prototype
            console.log(`[prototype-builder] NewPrototype`, req);
            this.trigger(PrototypeBuilderEvents.NewPrototype, req);
        });
        this.panel.$navbar.find(".open").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            // send information on the current prototype, so the user can choose to save the current prototype before opening a new prototype
            console.log(`[prototype-builder] OpenPrototype`, req);
            this.trigger(PrototypeBuilderEvents.OpenPrototype, req);
        });
        this.panel.$navbar.find(".save").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            console.log(`[prototype-builder] SavePrototype`, req);
            this.trigger(PrototypeBuilderEvents.SavePrototype, req);
        });
        this.panel.$navbar.find(".save-as").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            console.log(`[prototype-builder] SaveAs`, req);
            this.trigger(PrototypeBuilderEvents.SaveAs, req);
        });

        // edit menu items, in navbar and settings view
        $(document).find(".remove-picture").on("click", async (evt: JQuery.ClickEvent) => {
            if (!this.isWhiteboard()) {
                const ans: Utils.YesCancel = await Utils.showYesCancelDialog("Remove prototype picture?");
                if (ans === "yes") {
                    await this.removePicture();
                }
            }
            if (this.mode === "splash") {
                this.switchToBuilderView();
            }
        });
        $(document).find(".change-picture").on("input", async (evt: JQuery.ChangeEvent) => {
            await this.centralViews.Builder.onDidChangePicture(evt);
            if (this.mode === "splash") {
                this.switchToBuilderView();
            }
        });

        // run menu items
        $(document).find(".pause-simulation").on("click", async (evt: JQuery.ClickEvent) => {
            this.pauseSimulation();
        });
        $(document).find(".reboot-simulator").on("click", async (evt: JQuery.ClickEvent) => {
            await this.rebootSimulation();
        });

        // central navbar handlers
        this.panel.$navbar.find(".settings").on("click", (evt: JQuery.ClickEvent) => {
            this.switchToSettingsView();
            this.panel.$navbar.find(".builder-navbar").removeClass("btn-primary").addClass("btn-dark");
            $(evt.target).removeClass("btn-dark").addClass("btn-primary");
        });
        this.panel.$navbar.find(".builder").on("click", (evt: JQuery.ClickEvent) => {
            this.switchToBuilderView();
            this.panel.$navbar.find(".builder-navbar").removeClass("btn-primary").addClass("btn-dark");
            $(evt.target).removeClass("btn-dark").addClass("btn-primary");
        });
        this.panel.$navbar.find(".simulator").on("click", (evt: JQuery.ClickEvent) => {
            this.switchToSimulatorView();
            this.panel.$navbar.find(".builder-navbar").removeClass("btn-primary").addClass("btn-dark");
            $(evt.target).removeClass("btn-dark").addClass("btn-primary");
        });
    }

    /**
     * Internal function, renders the panels (central panel and side panel)
     */
    protected async renderViews (): Promise<void> {
        for (let i in this.centralViews) {
            await this.centralViews[i].renderView();
            // add listeners for side views, so they can he shown/hidden together with the corresponding central view
            this.centralViews[i].on(CentralViewEvents.DidShowView, (data: { id: string }) => {
                for (let j in this.sideViews) {
                    this.sideViews[j]?.hide();
                }
                this.sideViews[i]?.reveal();
            });
            this.centralViews[i].on(BuilderEvents.DidUpdateWidgets, (evt: DeleteWidgetEvent) => {
                // send prototype data on the connection, so interested listeners can save the prototype if they use autosave
                const data: PrototypeData = this.getPrototypeData();
                // send information on the current prototype, so the user can choose to save the current prototype before creating the new prototype
                console.log(`[prototype-builder] DidUpdateWidgets`, data);
                this.trigger(PrototypeBuilderEvents.DidUpdateWidgets, data);
            });
            this.centralViews[i].on(BuilderEvents.DidCreateWidget, (evt: CreateWidgetEvent) => {
                (<WidgetsListView> this.sideViews[i])?.refresh(evt?.widgets);
                (<WidgetsListView> this.sideViews[i])?.selectWidget({ id: evt?.id });
            });
            this.centralViews[i].on(BuilderEvents.DidDeleteWidget, (evt: DeleteWidgetEvent) => {
                (<WidgetsListView> this.sideViews[i])?.refresh(evt?.widgets);
            });
            this.centralViews[i].on(BuilderEvents.DidCutWidget, (evt: CutWidgetEvent) => {
                (<WidgetsListView> this.sideViews[i])?.refresh(evt?.widgets);
            });
            this.centralViews[i].on(BuilderEvents.DidSelectWidget, (evt: SelectWidgetEvent) => {
                (<WidgetsListView> this.sideViews[i])?.selectWidget({ id: evt?.id });
            });
            this.sideViews[i]?.on(BuilderEvents.DidSelectWidget, (evt: SelectWidgetEvent) => {
                (<BuilderView> this.centralViews[i]).selectWidget({ id: evt?.id });
            });
            this.sideViews[i]?.on(BuilderEvents.DidDeselectWidget, (evt: SelectWidgetEvent) => {
                (<BuilderView> this.centralViews[i]).deselectWidget({ id: evt?.id });
            });
            this.sideViews[i]?.on(BuilderEvents.WillEditWidget, (evt: SelectWidgetEvent) => {
                (<BuilderView> this.centralViews[i]).editWidget({ id: evt?.id });
            });
        }
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
     * Switches the builder view
     */
    switchToBuilderView (): void {
        this.$menu
        this.centralViews?.Builder?.builderView();
        this.highlightBuilderButton();
        if (this.sidePanelIsHidden) {
            this.revealSidePanel();
        }
        if (this.sidePanelIsCollapsed) {
            this.expandSidePanel();
        }
        this.revealBuilderMenu();
        this.hideSimulatorMenu();
        this.mode = "builder";
        // the following event can be used by interested listeners to save the prototype data
        const data: PrototypeData = this.getPrototypeData();
        this.trigger(PrototypeBuilderEvents.DidSwitchToBuilderView, data);
        console.log(`[prototype-builder] DidSwitchToBuilderView`, data);
    }

    /**
     * Switches the simulator view
     */
    switchToSimulatorView (): void {
        this.centralViews?.Builder?.simulatorView();
        this.highlightSimulatorButton();
        if (!this.sidePanelIsHidden) {
            this.collapseSidePanel();
        }
        this.revealSimulatorMenu();
        this.hideBuilderMenu();
        const widgets: WidgetsMap = this.centralViews?.Builder?.getWidgets();
        this.centralViews?.Simulator?.importWidgets(widgets);
        this.mode = "simulator";
        // the following event can be used by interested listeners to save the prototype data
        const data: PrototypeData = this.getPrototypeData();
        this.trigger(PrototypeBuilderEvents.DidSwitchToSimulatorView, data);
        console.log(`[prototype-builder] DidSwitchToSimulatorView`, data);
    }

    /**
     * Switch to settings view
     */
    switchToSettingsView (): void {
        this.centralViews?.Settings?.revealView();
        this.highlightSettingsButton();
        this.hideSidePanel();
        this.hideBuilderMenu();
        this.hideSimulatorMenu();
        this.mode = "settings";
        // the following event can be used by interested listeners to save the prototype data
        const data: PrototypeData = this.getPrototypeData();
        this.trigger(PrototypeBuilderEvents.DidSwitchToSettingsView, data);
        console.log(`[prototype-builder] DidSwitchToSettingsView`, data);
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
        const data: PrototypeData = this.getPrototypeData();
        this.trigger(PrototypeBuilderEvents.DidSwitchToSplashScreenView, data);
        console.log(`[prototype-builder] DidSwitchToSplashScreenView`, data);
    }

    /**
     * Send a request to pause the simulation
     */
    pauseSimulation (): void {
        const settings: IoFile = this.centralViews?.Settings?.getCurrentIoSettings();
        this.trigger(PrototypeBuilderEvents.PauseSimulation, settings);
        console.log(`[prototype-builder] PauseSimulation`, settings);
    }

    /**
     * Send a request to reboot the simulation environment
     */
    async rebootSimulation (): Promise<void> {
        const ans: Utils.YesCancel = await Utils.showYesCancelDialog("Reboot Simulation?");
        if (ans === "yes") {
            const settings: IoFile = this.centralViews?.Settings?.getCurrentIoSettings();
            this.trigger(PrototypeBuilderEvents.RebootSimulation, settings);
            console.log(`[prototype-builder] RebootSimulation`, settings);
        }
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
     * Loads prototype data
     * @param data prototype data to be loaded
     * @returns true if the prototype has been loaded successfully
     */
    async loadPrototypeData (data: PrototypeData): Promise<PrototypeData> {
        console.log(`[pvsio-web] loading prototype data`, data);
        if (data) {
            let loaded: boolean = false;
            // load picture
            if (data.pictureFile && data.pictureData) {
                console.log(`[pvsio-web] loading picture`, data.pictureFile);
                const fname: string = data.pictureFile;
                const picture: Picture = {
                    fileName: fsUtils.getFileName(fname),
                    fileExtension: fsUtils.getFileExtension(fname),
                    fileContent: data.pictureData
                }
                await this.centralViews?.Builder?.loadPicture(picture);
                loaded = true;
            }
            // load widgets
            if (data.widgets) {
                console.log(`[pvsio-web] loading widgets`, data.widgets);
                for (let i = 0; i < data.widgets.length; i++) {
                    const wdata: WidgetData = data.widgets[i];
                    await this.centralViews?.Builder?.loadWidget(wdata);
                    this.centralViews?.Builder?.createHotspot(wdata);
                }
                loaded = data.widgets.length > 0;
            }
            // load settings
            const settingsData = {
                io: getIoFile(data),
                web: getWebFile(data),
                contextFolder: data.contextFolder
            };
            console.log(`[pvsio-web] loading settings`, settingsData);
            this.centralViews?.Settings?.updateSettings(settingsData);
            // show builder view if anything has been loaded
            if (loaded) {
                this.switchToBuilderView();
            }
            // return loaded data
            const ans: PrototypeData = this.getPrototypeData();
            return ans;
        }
        console.warn(`[pvsio-web] Warning: prototype data is null`);   
        return null;
    }

    /**
     * Returns the prototype data currently loaded in Builder view
     */
    getPrototypeData (): PrototypeData {
        if (this.centralViews) {
            const contextFolder: string = this.centralViews.Settings?.getValue(DataAttribute.contextFolder);
            const settings: IoFile = this.centralViews.Settings?.getCurrentIoSettings();
            const data: PrototypeData = {
                version: PrototypeBuilder.version,
                contextFolder,
                ...settings
            };
            data.pictureFile = this.centralViews?.Builder.getCurrentPictureFileName();
            data.pictureWidth = this.centralViews?.Builder.getCurrentPictureWidth();
            data.pictureHeight = this.centralViews?.Builder.getCurrentPictureHeight();
            data.pictureData = this.centralViews?.Builder.getCurrentPictureData();
            data.widgets = this.centralViews?.Builder.getCurrentWidgetsData();
            return data;
        }
        return null;
    }
}

