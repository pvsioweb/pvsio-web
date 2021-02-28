import { PVSioWebPlugin } from '../../env/PVSioWeb';
import { BackboneConnection, Connection } from '../../env/Connection';

import * as Utils from '../../utils/pvsiowebUtils';
import { BuilderEvents, BuilderView, Picture, CreateWidgetEvent, DeleteWidgetEvent, CutWidgetEvent, SelectWidgetEvent, DidChangePictureEventData } from './views/BuilderView';
import { WidgetsListView } from './views/WidgetsListView';
import { SettingsEvents, SettingsView } from './views/SettingsView';
import { CentralViewEvents, WidgetsMap } from './views/CentralView';
import { SideView } from './views/SideView';
import { SimulatorEvents, SimulatorView } from './views/SimulatorView';
// import { SettingsElem, SettingsMap } from './views/SettingsView';

import * as fsUtils from "../../utils/fsUtils";

export enum PrototypeBuilderEvents {
    DidActivatePlugin = "DidActivatePlugin",
    NewPrototype = "NewPrototype",
    SavePrototype = "SavePrototype",
    SaveAs = "SaveAs",
    OpenPrototype = "OpenPrototype",
    DidSwitchToSimulatorView = "DidSwitchToSimulatorView",
    DidSwitchToBuilderView = "DidSwitchToBuilderView",
    DidUpdateWidgets = "DidUpdateWidgets",
    DidUpdateSettings = "DidUpdateSettings",
    DidRebootPrototype = "DidRebootPrototype",
    DidChangePicture = "DidChangePicture"
};

export interface DidChangePictureData extends DidChangePictureEventData, PrototypeData {};

const MIN_WIDTH_LEFT: number = 10; //px

const prototypeBuilderBody: string = `
<style>
.builder-sidebar-heading {
    color: white;
    display: block;
    background-color: #4c4c4c;
    height: 40px;
}
.left-panel {
    overflow-x:hidden;
    width:30%; 
    min-width:${MIN_WIDTH_LEFT}px; 
    position:relative;
    border: 1px solid lightgray;
    background:whitesmoke;
}
.widget-list {
    margin-left: 0px;
    width: 100%;
}
.widget-list-item {
    padding: 10px 0 10px 22px !important;
    border: 1px solid black !important;
}
.builder-controls {
    position: absolute;
    background-color: white;
    border-radius: 4px;
    top: 2px;
    left: 32px;
    transform: scale(0.8);
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
    height:100%;
}
.prototype-screens {
    margin:0px;
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
    height:0 !important;
    color: white;
    font-size: small;
    font-family: monospace;
    position:absolute;
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
        <div class="card-body prototype-screens tab-content py-1"></div>
    </div>
    <div class="builder-coords p-2">(top:0, left:0)</div>
</div>`;

const navbarCentral: string = `
<button class="btn btn-sm btn-dark builder-navbar settings">Settings</button>
<button class="btn btn-sm btn-primary builder-navbar builder">Builder</button>
<button class="btn btn-sm btn-dark builder-navbar simulator">Simulator</button>
`;

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
    <button class="btn btn-sm btn-dark builder-navbar dropdown-toggle" data-toggle="dropdown">File</button>
    <div class="dropdown-menu px-2">
        <div class="dropdown-item" class="save">Save</div>
    </div>
</div>
<div class=""dropdown">
    <button class="btn btn-sm btn-dark builder-navbar dropdown-toggle" data-toggle="dropdown">Edit</button>
    <div class="dropdown-menu px-2">
        <div class="dropdown-item input-group p-0">
            <form class="load-picture-form">
                <div class="custom-file">
                    <input class="change-picture custom-file-input" type="file" accept="image"">
                    <label class="custom-file-label">Change Picture</label>
                </div>
            </form>
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item btn-outline-danger remove-picture">Remove Picture</div>
    </div>
</div>
`;

export interface CentralViews {
    Settings: SettingsView,
    Builder: BuilderView,
    Simulator: SimulatorView
};
export interface SideViews {
    Builder: SideView
};
import * as Backbone from 'backbone';
import { Renderable, WidgetData, CSS } from './widgets/core/WidgetEVO';
import { WidgetClassManager } from './WidgetClassManager';
import { IoFile, PrototypeData, DataAttribute, defaultSettings, IoData  } from '../../utils/pvsiowebFileUtils';

export class PrototypeBuilder extends Backbone.Model implements PVSioWebPlugin {
    readonly name: string = "Prototype Builder";
    readonly id: string = Utils.removeSpaceDash(this.name);
    static readonly constructorName: string = "PrototypeBuilder";
    static readonly version: string = "3.0";

    protected mode: "simulator" | "builder" | "settings" = "builder";

    protected activeFlag: boolean = false;
    protected parent: string = "body";
    protected $menu: JQuery<HTMLElement>;

    /**
     * Widget class manager
     */
    widgetClassManager: WidgetClassManager = new WidgetClassManager();

    // the connection is public, so objects using PrototypeBuilder can set listeners and trigger events on the connection
    connection: Connection;

    protected panel: Utils.StickyPanel;
    protected body: Utils.ResizableLeftPanel;

    protected width: string = "0px"; // side panel width

    protected sidePanelCollapsed: boolean = false;

    protected sideViews: SideViews;
    protected centralViews: CentralViews;

    /**
     * Activate the plugin, i.e., create the panel and install event handlers
     * @param opt 
     */
    async activate (opt?: { connection?: Connection, parent?: string, top?: number, settings?: IoData }): Promise<boolean> {
        opt = opt || {};
        this.parent = opt.parent || this.parent;

        // use connection indicated in the options of the constructor, or use a basic backbone connection
        this.connection = opt.connection || new BackboneConnection();

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
        const bodyDiv: HTMLElement = this.panel.$content.find(`.prototype-screens`)[0];
        const headerDiv: HTMLElement = this.panel.$content.find(`.prototype-screen-list`)[0];
        this.sideViews = {
            Builder: new WidgetsListView({
                el: this.panel.$content.find(".widget-list")[0]
            })
        };
        this.centralViews = {
            Settings: new SettingsView({
                label: "Settings",
                viewId: "settings",
                panelId: "settings",
                el: bodyDiv,
                headerDiv,
                parentDiv: this.body.$central[0],
                settings: opt.settings || defaultSettings
            }, this.connection),
            Builder: new BuilderView({
                label: "Builder",
                viewId: "builder-view",
                panelId: "builder-view",
                el: bodyDiv,
                headerDiv,
                active: true,
                parentDiv: this.body.$central[0],
                widgetClassMap: this.widgetClassManager?.getWidgetClassMap() || {}
            }, this.connection),
            Simulator: new SimulatorView({
                label: "Simulator",
                viewId: "simulator-view",
                panelId: "builder-view",
                el: bodyDiv,
                headerDiv,
                parentDiv: this.body.$central[0],
            }, this.connection)
        };
        // render views
        await this.renderViews();
        // create whiteboard
        this.centralViews?.Builder?.createWhiteboard();
        // initialize pointer to the menu
        this.$menu = this.panel?.$content.find(".panel-menu");
        // install handlers
        this.installHandlers();
        // refresh the view
        this.onResizeCentralView();
        // signal ready
        this.trigger(PrototypeBuilderEvents.DidActivatePlugin);
        // switch to builder view
        this.switchToBuilderView();
        // update active flag
        this.activeFlag = true;
        return this.activeFlag;
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
     * Renders all widgets with the given state
     * @param desc 
     */
    async renderState (state: Renderable, opt?: CSS): Promise<void> {
        console.log(`[pvsio-web] Render state`, state, opt);
        return await this.centralViews?.Simulator?.renderState(state, opt);
    }

    /**
     * Internal function, creates the html content of the panel
     * @param desc 
     */
    protected createPanelBody (desc: { parent: JQuery<HTMLElement> }): Utils.ResizableLeftPanel {
        const id: string = `${this.id}-panel`;
        const content: string = Handlebars.compile(prototypeBuilderBody, { noEscape: true })({
            id
        });
        desc.parent.append(content);
        const $div: JQuery<HTMLDivElement> = $(`#${id}`);
        const $left: JQuery<HTMLDivElement> = $(`#${id}-left`);
        const $central: JQuery<HTMLDivElement> = $(`#${id}-central`);
        const $resizeBar: JQuery<HTMLDivElement> = $(`#${id}-resize-bar`);

        const body: Utils.ResizableLeftPanel = Utils.enableResizeLeft({ $div, $left, $central, $resizeBar, onResize: this.onResizeCentralView });
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
     * Internal function, install event handlers
     */
    protected installHandlers (): void {
        this.centralViews?.Simulator?.on(CentralViewEvents.DidShowView, () => {
            this.switchToSimulatorView();
        });
        this.centralViews?.Builder?.on(CentralViewEvents.DidShowView, () => {
            this.switchToBuilderView();
        });
        this.centralViews?.Settings?.on(CentralViewEvents.DidShowView, () => {
            this.switchToSettingsView();
        });
        this.centralViews?.Builder?.on(BuilderEvents.DidChangePicture, (evt: DidChangePictureEventData) => {
            // send prototype data on the connection, so interested listeners can save the prototype if they use autosave
            const data: PrototypeData = this.getPrototypeData();
            // send information on the current prototype, so the user can choose to save the current prototype before creating the new prototype
            const evtData: DidChangePictureData = { ...data, ...evt };
            console.log(`[prototype-builder] DidChangePicture`, evtData);
            this.connection?.trigger(PrototypeBuilderEvents.DidChangePicture, evtData);
        });
        this.centralViews?.Simulator?.on(SimulatorEvents.DidRebootPrototype, () => {
            this.rebootPrototype();
        });
        this.centralViews?.Settings?.on(SettingsEvents.DidUpdateSettings, (data: IoFile) => {
            // trigger update on the connection
            this.connection?.trigger(PrototypeBuilderEvents.DidUpdateSettings, data);
        });

        // left navbar handlers / file menu
        this.panel.$navbar.find(".new-prototype").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            // send information on the current prototype, so the user can choose to save the current prototype before creating the new prototype
            console.log(`[prototype-builder] NewPrototypeRequest`, req);
            this.connection?.trigger(PrototypeBuilderEvents.NewPrototype, req);
        });
        this.panel.$navbar.find(".open").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            // send information on the current prototype, so the user can choose to save the current prototype before opening a new prototype
            console.log(`[prototype-builder] OpenPrototypeRequest`, req);
            this.connection?.trigger(PrototypeBuilderEvents.OpenPrototype, req);
        });
        this.panel.$navbar.find(".save").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            console.log(`[prototype-builder] SavePrototypeRequest`, req);
            this.connection?.trigger(PrototypeBuilderEvents.SavePrototype, req);
        });
        this.panel.$navbar.find(".save-as").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            console.log(`[prototype-builder] SaveAsRequest`, req);
            this.connection?.trigger(PrototypeBuilderEvents.SaveAs, req);
        });

        // left navbar handlers / edit menu
        this.panel.$navbar.find(".remove-picture").on("click", async (evt: JQuery.ClickEvent) => {
            await this.centralViews?.Builder.createWhiteboard();
        });
        this.panel.$navbar.find(".change-picture").on("input", async (evt: JQuery.ChangeEvent) => {
            await this.centralViews?.Builder.onDidChangePicture(evt);
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
                this.connection?.trigger(PrototypeBuilderEvents.DidUpdateWidgets, data);
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
        console.log(`[prototype-builder] BuilderView`);
        this.centralViews?.Builder?.builderView();
        // this.widgetManager.stopTimers();
        if (this.sidePanelCollapsed) {
            this.expandSidePanel();
        }
        this.revealBuilderMenu();
        this.hideSimulatorMenu();
        this.mode = "builder";
        this.connection?.trigger(PrototypeBuilderEvents.DidSwitchToBuilderView);
    }

    /**
     * Switches the simulator view
     */
    switchToSimulatorView (): void {
        console.log(`[prototype-builder] SimulatorView`);
        this.centralViews?.Builder?.simulatorView();
        this.collapseSidePanel();
        this.revealSimulatorMenu();
        this.hideBuilderMenu();
        const widgets: WidgetsMap = this.centralViews?.Builder?.getWidgets();
        this.centralViews?.Simulator?.importWidgets(widgets);
        this.mode = "simulator";
        // this.rebootPrototype();
    }

    /**
     * Switch to settings view
     */
    switchToSettingsView (): void {
        console.log(`[prototype-builder] SettingsView`);
        this.centralViews?.Settings?.revealView();
        if (this.sidePanelCollapsed) {
            this.expandSidePanel();
        }
        this.revealBuilderMenu();
        this.hideSimulatorMenu();
        this.mode = "settings";
    }


    /**
     * Reboot the prototype, i.e., sends the init command to the simulator
     */
    rebootPrototype (): void {
        const settings: IoFile = this.centralViews?.Settings?.getCurrentSettings();
        this.connection?.trigger(PrototypeBuilderEvents.DidSwitchToSimulatorView, settings);
    }

    /**
     * Collapses side panel
     */
    collapseSidePanel (): void {
        this.saveSidePanelWidth();
        this.body.$left?.animate({ "min-width": 0, width: 0 }, 500);
        this.body.$resizeBar?.css({ display: "none" });
        this.sidePanelCollapsed = true;
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
     * Expands side panel
     */
    expandSidePanel (): void {
        this.body.disableResize = false;
        this.body.$left?.animate({ "min-width": `${MIN_WIDTH_LEFT}px`, width: this.width }, 500);
        this.body.$resizeBar?.css({ display: "block" });
        this.sidePanelCollapsed = false;
    }

    /**
     * Loads prototype data
     * @param data prototype data to be loaded
     * @returns true if the prototype has been loaded successfully
     */
    async loadPrototypeData (data: PrototypeData): Promise<void> {
        console.log(`[pvsio-web] loading prototype data`, data);
        if (data) {
            // load picture
            if (data.pictureFile && data.pictureData) {
                const fname: string = data.pictureFile;
                const picture: Picture = {
                    fileName: fsUtils.getFileName(fname),
                    fileExtension: fsUtils.getFileExtension(fname),
                    fileContent: data.pictureData
                }
                await this.centralViews?.Builder?.loadPicture(picture);
            }
            // load widgets
            if (data.widgets) {
                for (let i = 0; i < data.widgets.length; i++) {
                    const wdata: WidgetData = data.widgets[i];
                    await this.centralViews?.Builder?.loadWidget(wdata);
                    this.centralViews?.Builder?.createHotspot(wdata);
                }
            }
            // load settings
            this.centralViews?.Settings?.updateSettings(data);
        } else {
            console.warn(`[pvsio-web] Warning: prototype data is null`);   
        }
    }

    /**
     * Returns the prototype data currently loaded in Builder view
     */
    getPrototypeData (): PrototypeData {
        if (this.centralViews) {
            const contextFolder: string = this.centralViews.Settings?.getValue(DataAttribute.contextFolder);
            const settings: IoFile = this.centralViews.Settings?.getCurrentSettings();
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

