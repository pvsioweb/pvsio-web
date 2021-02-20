import { PVSioWebPlugin, PrototypeData } from '../../env/PVSioWeb';
import { BackboneConnection, Connection } from '../../env/Connection';

import * as Utils from '../../utils/pvsiowebUtils';
import { BuilderView, Picture, PictureData, WidgetsData } from './views/BuilderView';
import { WidgetsListView } from './views/WidgetsListView';
import { Settings, SettingsView } from './views/SettingsView';
import { BuilderEvents, CreateWidgetEvent, DeleteWidgetEvent, CutWidgetEvent, SelectWidgetEvent, CentralView, CentralViewEvents, WidgetsMap } from './views/CentralView';
import { SideView } from './views/SideView';
import { SimulatorView } from './views/SimulatorView';

import * as fsUtils from "../../utils/fsUtils";

const prototypeBuilderBody: string = `
<style>
.builder-sidebar-heading {
    color: white;
    display: block;
    background-color: #4c4c4c;
    height: 40px;
    width: 200%;
}
.left-panel {
    overflow-x:hidden;
    width:30%; 
    min-width:10px; 
    position:relative;
    border: 1px solid lightgray;
}
.widget-list {
    margin-left: 0px;
    width: 100%;
}
.widget-list-item.active::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;

    border-bottom: 20px solid transparent;    
    border-left: 16px solid whitesmoke;

    clear: both;
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
    overflow:hidden;
}
.central-panel-inner {
    overflow:auto;
}
.central-panel-inner-header {
    margin-top:-8px;
    font-size:small;
}
.prototype-screens {
    margin:0px;
}
</style>
<div id="{{id}}" class="row d-flex">
    <div id="{{id}}-left" class="left-panel container-fluid no-gutters">
        <div class="builder-sidebar-heading"></div>
        <div id="{{id}}-widget-list" class="widget-list list-group"></div>
        <div id="{{id}}-timers-list" class="list-group"></div>
    </div>
    <div id="{{id}}-resize-bar" class="resize-bar"></div>
    <div id="{{id}}-central" class="flex-grow-1 no-gutters central-panel">
        <div class="card central-panel-inner">
            <div class="card-header central-panel-inner-header">
                <ul class="nav nav-tabs card-header-tabs d-flex flex-nowrap prototype-screen-list">
                </ul>
            </div>
            <div class="card-body prototype-screens tab-content py-0">
            </div>
        </div>
    </div>
</div>`;

const toolbar: string = `
<div class="btn-group builder-controls" role="group" aria-label="Toggle View">
<button type="button" class="btn btn-primary btn-sm toggle-builder-view">
    Builder View
</button>
<button type="button" class="btn btn-outline-secondary btn-sm toggle-simulator-view">
    Simulator View
</button>
</div>
`;

const menu: string = `
<button type="button" class="btn btn-sm btn-outline-light fa fa-bars" id="{{id}}-dropdown-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
<div class="dropdown-menu dropdown-menu-right" aria-labelledby="{{id}}-dropdown-menu">
    <button type="button" class="dropdown-item btn-sm new-prototype">New Prototype..</button>
    <div class="dropdown-divider"></div>
    <button type="button" class="dropdown-item btn-sm open">Open..</button>
    <div class="dropdown-divider"></div>
    <button type="button" class="dropdown-item btn-sm save">Save</button>
    <button type="button" class="dropdown-item btn-sm save-as">Save As..</button>
</div>`;

export interface CentralViews {
    Settings: SettingsView,
    Builder: BuilderView,
    Simulator: SimulatorView
};
export interface SideViews {
    Builder: SideView
};
export const PrototypeBuilderEvents = {
    DidActivatePlugin: "DidActivatePlugin",
    NewPrototype: "NewPrototype",
    SavePrototype: "SavePrototype",
    SaveAs: "SaveAs",
    OpenPrototype: "OpenPrototype"
};
import * as Backbone from 'backbone';
import { WidgetData } from './widgets/core/WidgetEVO';

export class PrototypeBuilder extends Backbone.Model implements PVSioWebPlugin {
    readonly name: string = "Prototype Builder";
    readonly id: string = Utils.removeSpaceDash(this.name);

    protected activeFlag: boolean = false;
    protected parent: string = "body";

    // the connection is public, so objects using PrototypeBuilder can set listeners and trigger events on the connection
    connection: Connection;

    protected panel: Utils.CollapsiblePanel;
    protected body: Utils.ResizableLeftPanel;

    protected $menu: JQuery<HTMLElement>;

    protected width: string = "0px"; // side panel width

    protected collapsed: boolean = false;

    protected sideViews: SideViews;
    protected centralViews: CentralViews;

    /**
     * Activate the plugin, i.e., create the panel and install event handlers
     * @param opt 
     */
    async activate (opt?: { connection?: Connection, parent?: string, top?: number, settings?: Settings[] }): Promise<boolean> {
        opt = opt || {};
        this.parent = opt.parent || this.parent;

        // use connection indicated in the options of the constructor, or use a basic backbone connection
        this.connection = opt.connection || new BackboneConnection();

        // create panel, toolbar, and body
        this.panel = Utils.createCollapsiblePanel(this, {
            parent: this.parent,
            showContent: true,
            "dropdown-menu": menu
        });
        this.body = this.createPanelBody({
            parent: this.panel.$content
        });
        // install menu handlers
        this.panel.$dropdownMenu.find(".new-prototype").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            // send information on the current prototype, so the user can choose to save the current prototype before creating the new prototype
            console.log(`[prototype-builder] NewPrototypeRequest`, req);
            this.connection?.trigger(PrototypeBuilderEvents.NewPrototype, req);
        });
        this.panel.$dropdownMenu.find(".open").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            // send information on the current prototype, so the user can choose to save the current prototype before opening a new prototype
            console.log(`[prototype-builder] OpenPrototypeRequest`, req);
            this.connection?.trigger(PrototypeBuilderEvents.OpenPrototype, req);
        });
        this.panel.$dropdownMenu.find(".save").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            console.log(`[prototype-builder] SavePrototypeRequest`, req);
            this.connection?.trigger(PrototypeBuilderEvents.SavePrototype, req);
        });
        this.panel.$dropdownMenu.find(".save-as").on("click", (evt: JQuery.ClickEvent) => {
            const req: PrototypeData = this.getPrototypeData();
            console.log(`[prototype-builder] SaveAsRequest`, req);
            this.connection?.trigger(PrototypeBuilderEvents.SaveAs, req);
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
                settings: opt.settings
            }, this.connection),
            Builder: new BuilderView({
                label: "Builder View",
                viewId: "builder-view",
                panelId: "builder-view",
                el: bodyDiv,
                headerDiv,
                active: true,
                parentDiv: this.body.$central[0]
            }, this.connection),
            Simulator: new SimulatorView({
                label: "Simulator View",
                viewId: "simulator-view",
                panelId: "builder-view",
                externalPanel: true,
                el: bodyDiv,
                headerDiv,
                parentDiv: this.body.$central[0],
            }, this.connection)
        };
        // render views
        await this.renderViews();
        // install handlers
        this.installHandlers();
        // refresh the view
        this.onResizeCentralView();
        // signal ready
        this.trigger(PrototypeBuilderEvents.DidActivatePlugin);
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
     * Internal function, creates the html content of the panel
     * @param desc 
     */
    protected createPanelBody (desc: { parent: JQuery<HTMLElement> }): Utils.ResizableLeftPanel {
        const id: string = `${this.id}-panel`;
        const content: string = Handlebars.compile(prototypeBuilderBody)({
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
    switchToBuilderView(): void {
        this.centralViews?.Builder?.builderView();
        // this.widgetManager.stopTimers();
        this.expandSidePanel();
    }

    /**
     * Switches the simulator view
     */
    async switchToSimulatorView(): Promise<void> {
        this.centralViews?.Builder?.simulatorView();
        this.collapseSidePanel();
        const settings: Settings[] = this.centralViews?.Settings?.getSettings();
        const widgets: WidgetsMap = this.centralViews?.Builder?.getWidgets();
        const success: boolean = await this.centralViews?.Simulator?.initSimulation({
            settings,
            widgets 
        });
        // this.widgetManager.initWidgets();
        // this.widgetManager.startTimers();
    }

    /**
     * Collapses side panel
     */
    collapseSidePanel (): void {
        this.body.disableResize = true;
        this.width = this.body.$left.css("width");
        this.body.$left?.animate({ width: "0px" }, 500);
    }

    /**
     * Expands side panel
     */
    expandSidePanel (): void {
        this.body.disableResize = false;
        this.body.$left?.animate({ width: this.width }, 500);
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
            if (data.picture && data['picture-data']) {
                const fname: string = data.picture.fname;
                const picture: Picture = {
                    fileName: fsUtils.getFileName(fname),
                    fileExtension: fsUtils.getFileExtension(fname),
                    fileContent: data['picture-data']
                }
                await this.centralViews.Builder.loadPicture(picture);
            }
            // load widgets
            if (data.widgets) {
                for (let i = 0; i < data.widgets.length; i++) {
                    const wdata: WidgetData = data.widgets[i];
                    await this.centralViews.Builder.loadWidget(wdata);
                    this.centralViews.Builder.createHotspot(wdata);
                }
            }
        } else {
            console.warn(`[pvsio-web] Warning: prototype data is null`);   
        }
    }

    /**
     * Returns the prototype data currently loaded in Builder view
     */
    getPrototypeData (): PrototypeData {
        if (this.centralViews) {
            const contextFolder: string = this.centralViews.Settings?.getValue("contextFolder");
            const mainFile: string = this.centralViews.Settings?.getValue("mainFile");
            const pictureData: PictureData = this.centralViews.Builder?.getPictureData();
            const widgetsData: WidgetsData = this.centralViews.Builder?.getWidgetsData();
            const data: PrototypeData = {
                version: 3.0,
                contextFolder,
                main: {
                    fname: mainFile
                },
                widgets: widgetsData,
                picture: {
                    fname: pictureData?.fileName && pictureData?.fileExtension ? `${pictureData.fileName}${pictureData.fileExtension}` : "",
                    width: pictureData?.width,
                    height: pictureData?.height,
                },
                "picture-data": pictureData?.fileContent || ""
            };
            return data;
        }
        return null;
    }
}

