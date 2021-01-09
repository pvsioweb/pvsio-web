import { PVSioWebPlugin } from '../../env/PVSioWeb';
import { Connection } from '../../env/Connection';
// import { createCollapsiblePanel } from '../../../env/Utils';

// import { WidgetManager } from './WidgetManager';
// Recorder            = require("util/ActionRecorder"),
// Prompt              = require("pvsioweb/forms/displayPrompt"),

import * as Utils from '../../env/Utils';
import { BuilderView } from './views/BuilderView';
import { WidgetsListView } from './views/WidgetsListView';
import { SettingsView } from './views/SettingsView';
import { BuilderEvents, CreateWidgetEvent, DeleteWidgetEvent, CutWidgetEvent, SelectWidgetEvent, CentralView, CentralViewEvents } from './views/CentralView';
import { BackgroundView } from './views/BackgroundView';
import { SideView } from './views/SideView';

// import { WidgetEVO } from "../../widgets/core/WidgetEVO";
// import { BasicDisplayEVO } from "../../widgets/core/BasicDisplayEVO";
// import { NumericDisplayEVO } from "../../widgets/core/NumericDisplayEVO";
// import { LedEVO } from "../../widgets/core/LedEVO";
// import { ButtonEVO } from "../../widgets/core/ButtonEVO";
// import { TouchScreenEVO } from "../../widgets/core/TouchScreenEVO";

// TimersListView      = require("pvsioweb/forms/TimersListView"),
// NewWidgetView       = require("pvsioweb/forms/newWidget"),
// EditWidgetView      = require("pvsioweb/forms/editWidget"),
// ScriptPlayer        = require("util/ScriptPlayer"),
// PluginManager       = require("plugins/PluginManager"),
// fs                  = require("filesystem/FileSystem").getInstance(),
// Descriptor          = require("project/Descriptor"),

// const labelFunction = (widget: WidgetEVO) => {
//     switch (widget.type) {
//         case "display"       : { return "Display: " + (<BasicDisplayEVO>widget).displayKey; }
//         case "numericdisplay": { return "Numeric Display: " + (<NumericDisplayEVO>widget).displayKey; }
//         case "led"           : { return "LED: " + (<LedEVO>widget).ledKey; }
//         case "button"        : { return "Button: " + (<ButtonEVO>widget).functionText; }
//         case "touchscreenbutton": { return "Touch-Button: " + (<TouchScreenEVO>widget).functionText; }
//         case "touchscreendisplay": { return "Touch-Display: " + (<TouchScreenEVO>widget).functionText; }
//         default: { return widget.type + ": " + widget.id; }
//     }
// }

const prototypeBuilderBody: string = `
<div id="{{id}}" class="row d-flex">
    <div id="{{id}}-left" class="container-fluid no-gutters" style="overflow-x:hidden; width:30%; min-width:10px;">
        <div class="widgets"></div>
        <div id="{{id}}-widget-list" class="widget-list list-group"></div>
        <div id="{{id}}-timers-list" class="list-group"></div>
    </div>
    <div id="{{id}}-resize-bar" style="width:6px;background-color:#4c4c4c;"></div>
    <div id="{{id}}-central" class="flex-grow-1 no-gutters" style="position:relative; width:66%; overflow:hidden;">
        <div class="card">
            <div class="card-header" style="margin-top:-14px;">
                <ul class="nav nav-tabs card-header-tabs d-flex flex-nowrap prototype-screen-list">
                </ul>
            </div>
            <div class="card-body prototype-screens tab-content" style="margin:0px;">
            </div>
        </div>
    </div>
</div>`;

const prototypeBuilderToolbar: string = `
<div class="toolbar" id="{{id}}">
    <div class="btn-group" role="group" aria-label="Mode toggle">
        <button id="{{id}}-builder-view-btn" type="button" class="btn btn-primary">
            Builder View
        </button>
        <button id="{{id}}-simulator-view-btn" type="button" class="btn btn-outline-secondary">
            Simulator View
        </button>
    </div>
    <div class="toolbar-right">
        <button id="{{id}}-reboot-btn" class="btn btn-danger pim-convert-button">Reboot Prototype</button>
    </div>
</div>
`;

export interface PrototypeBuilderViews<T> {
    Settings?: T,
    Hotspots?: T,
    Picture?: T
};

export class PrototypeBuilder implements PVSioWebPlugin {
    readonly name: string = "Prototype Builder";
    readonly id: string = Utils.removeSpaceDash(this.name);

    protected connection: Connection;

    protected panel: Utils.CollapsiblePanel;
    protected toolbar: Utils.Panel;
    protected body: Utils.ResizableLeftPanel;

    protected onResizeCentralView: (desc?: { width: string, height: string }) => void;

    protected collapsed: boolean = false;

    protected sideViews: PrototypeBuilderViews<SideView>;
    protected centralViews: PrototypeBuilderViews<CentralView>;

    async activate (connection?: Connection): Promise<boolean> {
        this.connection = connection;

        this.onResizeCentralView = (desc?: { width: string, height: string }) => {
            for (let i in this.centralViews) {
                this.centralViews[i].resizeView(desc);
            }
        };

        this.panel = Utils.createCollapsiblePanel(this, {
            parent: "toolkit-body",
            showContent: true
        });
        this.toolbar = this.createPanelToolbar({
            parent: this.panel.$content
        });
        this.body = this.createPanelBody({
            parent: this.panel.$content
        });
        
        const bodyDiv: HTMLElement = this.panel.$content.find(`.prototype-screens`)[0];
        const headerDiv: HTMLElement = this.panel.$content.find(`.prototype-screen-list`)[0];
        this.sideViews = {
            Hotspots: new WidgetsListView({
                el: this.panel.$content.find(".widget-list")[0]
            })
        };
        this.centralViews = {
            Settings: new SettingsView({
                viewId: "Settings",
                screenName: "Settings",
                el: bodyDiv,
                headerDiv,
                parentDiv: this.body.$central[0],
            }, this.connection),
            Hotspots: new BuilderView({
                viewId: "Hotspots",
                screenName: "Hotspots",
                el: bodyDiv,
                headerDiv,
                parentDiv: this.body.$central[0],
            }, this.connection),
            Picture: new BackgroundView({
                viewId: "Picture",
                screenName: "Picture",
                el: bodyDiv,
                headerDiv,
                parentDiv: this.body.$central[0],
                active: true // only one tab should be active
            }, this.connection)
        };
        for (let i in this.centralViews) {
            this.centralViews[i].activate();
            // add listeners for side views, so they can he shown/hidden together with the corresponding central view
            this.centralViews[i].on(CentralViewEvents.DidShowView, (data: { id: string }) => {
                for (let j in this.sideViews) {
                    this.sideViews[j].hide();
                }
                this.sideViews[i]?.reveal();
            });
        }
        this.onResizeCentralView(); // this is done to refresh the initial view

        this.centralViews.Hotspots.on(BuilderEvents.DidCreateWidget, (evt: CreateWidgetEvent) => {
            (<WidgetsListView> this.sideViews.Hotspots).refresh(evt?.widgets);
            (<WidgetsListView> this.sideViews.Hotspots).selectWidget({ id: evt?.id });
        });
        this.centralViews.Hotspots.on(BuilderEvents.DidDeleteWidget, (evt: DeleteWidgetEvent) => {
            (<WidgetsListView> this.sideViews.Hotspots).refresh(evt?.widgets);
        });
        this.centralViews.Hotspots.on(BuilderEvents.DidCutWidget, (evt: CutWidgetEvent) => {
            (<WidgetsListView> this.sideViews.Hotspots).refresh(evt?.widgets);
        });
        this.centralViews.Hotspots.on(BuilderEvents.DidSelectWidget, (evt: SelectWidgetEvent) => {
            (<WidgetsListView> this.sideViews.Hotspots).selectWidget({ id: evt?.id });
        });
        this.sideViews.Hotspots.on(BuilderEvents.DidSelectWidget, (evt: SelectWidgetEvent) => {
            (<BuilderView> this.centralViews.Hotspots).selectWidget({ id: evt?.id });
        });
        this.sideViews.Hotspots.on(BuilderEvents.DidDeselectWidget, (evt: SelectWidgetEvent) => {
            (<BuilderView> this.centralViews.Hotspots).deselectWidget({ id: evt?.id });
        });
        this.sideViews.Hotspots.on(BuilderEvents.WillEditWidget, (evt: SelectWidgetEvent) => {
            (<BuilderView> this.centralViews.Hotspots).editWidget({ id: evt?.id });
        });

        return true;
    }
    getName (): string { return this.name; };
    getId (): string { return this.id };
    getDependencies (): string[] { return []; }

    /**
     * Switches the prototoyping layer to the builder layer
     */
    switchToBuilderView(): void {
        $("#prototype-builder-container .image-map-layer").css("opacity", 1).css("z-index", 190);
        $("#btnBuilderView").removeClass("btn-outline-secondary").addClass("btn-primary active");
        $("#btnSimulatorView").addClass("btn-outline-secondary").removeClass("btn-primary active");
        $("#btnRebootPrototype").addClass("disabled");
        // this.widgetManager.stopTimers();
        this.expandWidgetsList();
    }

    /**
     * Switches the prototyping layer to the simulator/testing layer
     */
    switchToSimulatorView(): void {
        $("#prototype-builder-container .image-map-layer").css("opacity", 0.1).css("z-index", -2);
        $("#btnBuilderView").addClass("btn-outline-secondary").removeClass("btn-primary active");
        $("#btnSimulatorView").removeClass("btn-outline-secondary").addClass("btn-primary active");
        $("#btnRebootPrototype").addClass("disabled");
        // this.widgetManager.initWidgets();
        // this.widgetManager.startTimers();
        this.collapseWidgetsList();
    }

    updateControlsHeight(): void {
        $("#builder-controls").css("height", $("#prototype-builder-container")[0].getBoundingClientRect().height + "px");
    }

    protected createPanelBody (desc: { parent: JQuery<HTMLElement> }): Utils.ResizableLeftPanel {
        const id: string = `${this.id}-panel`;
        const body: string = Handlebars.compile(prototypeBuilderBody)({
            id
        });
        desc.parent.append(body);
        const $div: JQuery<HTMLDivElement> = $(`#${id}`);
        const $left: JQuery<HTMLDivElement> = $(`#${id}-left`);
        const $central: JQuery<HTMLDivElement> = $(`#${id}-central`);
        const $resizeBar: JQuery<HTMLDivElement> = $(`#${id}-resize-bar`);

        const panel: Utils.ResizableLeftPanel = Utils.enableResizeLeft({ $div, $left, $central, $resizeBar, onResize: this.onResizeCentralView });
        return panel;
    }

    protected createPanelToolbar (desc: { parent: JQuery<HTMLElement> }): Utils.Panel {
        const id: string = `${this.id}-toolbar`;
        const toolbar: string = Handlebars.compile(prototypeBuilderToolbar)({
            id
        });
        desc.parent.append(toolbar);
        const $div: JQuery<HTMLDivElement> = $(`#${id}`);
        return { $div };
    }


//     PrototypeBuilder.prototype.unload = function () {
//         widgetListView.remove();
//         prototypeImageView.remove();
//         pvsioWebClient.removeCollapsiblePanel(pbContainer);
//         projectManager.removeListener("ProjectChanged", onProjectChanged);
//         projectManager.removeListener("WidgetsFileChanged", onWidgetsFileChanged);
//         projectManager.removeListener("SelectedFileChanged", onSelectedFileChanged);
//         require("widgets/ButtonHalo").getInstance().removeKeypressHandlers();
//         return Promise.resolve(true);
//     };

//     function updateImageAndLoadWidgets() {
//         var p = projectManager.project();
//         var image = p.getImage();
//         WidgetManager.clearWidgets();

//         if (prototypeImageView) {
//             prototypeImageView.clearWidgetAreas();
//         }

//         d3.select("div#body").style("display", null);
//         if (!image) {
//             // remove previous image, if any
//             if (prototypeImageView) {
//                 prototypeImageView.clearImage();
//             }
//             return Promise.resolve();
//         }
//         // else
//         function updateImageDescriptor(content) {
//             return new Promise(function (resolve, reject) {
//                 image.content = content;
//                 resolve(image);
//             });
//         }
//         function showImage() {
//             return new Promise(function (resolve, reject) {
//                 prototypeImageView.setImage(image).then(function (scale) {
//                     updateControlsHeight();
//                     prototypeImageView.updateMapCreator(scale, function () {
//                         var wdStr = p.getWidgetDefinitionFile().content;
//                         if (wdStr && wdStr !== "") {
//                             var wd = JSON.parse(wdStr);
//                             WidgetManager.restoreWidgetDefinitions(wd);
//                             //update the widget area map scales
//                             WidgetManager.scaleAreaMaps(scale);
//                             //select prototype builder
//                             switchToBuilderView();
//                         }
//                         resolve();
//                     });
//                 }).catch(function (err) {
//                     Logger.log(err);
//                     reject(err);
//                 });
//             });
//         }
//         return new Promise(function (resolve, reject) {
//             image.loadContent().then(function (res) {
//                 updateImageDescriptor(res);
//             }).then(function (res) {
//                 return showImage();
//             }).then(function (res) {
//                 resolve(image);
//             }).catch(function (err) {
//                 console.error(err);
//                 reject(err);
//             });
//         });
//     }

//     function onWidgetsFileChanged(event) {
//         updateImageAndLoadWidgets().then(function (res) {
//             widgetListView.update();
//         }).catch(function (err) { Logger.error(err); });
//         TimersListView.create(WidgetManager);
//     }

    collapseWidgetsList (): void {
        const elem = $("#builder-controls");
        if (elem[0]) {
            const width = elem[0].getBoundingClientRect().width;
            if (width > 0) {
                // this.widgetListView.width = width;
                $("#builder-controls").animate({ width: "0px" }, 300);
            }
        }
    }
    expandWidgetsList (): void {
        const elem = $("#builder-controls");
        if (elem[0]) {
            const width = elem[0].getBoundingClientRect().width;
            if (width === 0) {
                $("#builder-controls").animate({ width: "300px" }, 300);
            }
        }
    }

//     function restartPVSio() {
//         var ws = WSManager.getWebSocket();
//         ws.lastState("init(0)");
//         var project = projectManager.project();
//         if (project.mainPVSFile()) {
//             // the main file can be in a subfolder: we need to pass information about directories!
//             var mainFile = project.mainPVSFile().path.replace(project.name() + "/", "");
//             ws.startPVSProcess({name: mainFile, projectName: project.name()}, function (err) {
//                 //make projectManager bubble the process ready event
//                 if (!err) {
//                     projectManager.fire({type: "PVSProcessReady"});
//                 } else {
//                     projectManager.fire({type: "PVSProcessDisconnected", err: err});
//                 }
//             });
//         }
//     }

//     function onProjectChanged(event) {
//         var pvsioStatus = d3.select("#lblPVSioStatus");
//         pvsioStatus.select("span").remove();
//         restartPVSio();
//         switchToBuilderView();
//         WidgetManager.clearWidgets();
//         prototypeImageView.clearWidgetAreas();
//         ScriptPlayer.clearView();
//         onWidgetsFileChanged(event);
//     }

//     function onSelectedFileChanged(event) {
//         var desc = projectManager.project().getDescriptor(event.selectedItem.path);
//         if (desc) {
//             if (projectManager.project().mainPVSFile() && projectManager.project().mainPVSFile().path === desc.path) {
//                 d3.select("#btnSetMainFile").attr("disabled", true);
//             } else {
//                 d3.select("#btnSetMainFile").attr("disabled", null);
//             }
//         }
//     }

//     function bindListeners() {
//         var actions, recStartState, recStartTime, scriptName;
//         /**
//          * Add event listener for toggling the prototyping layer and the interaction layer
//          */
//         d3.select("#btnBuilderView").on("click", function () {
//             switchToBuilderView();
//         });
//         d3.select("#btnSimulatorView").on("click", function () {
//             var msg = "";
//             if (!prototypeImageView.hasImage()) {
//                 msg = "Please load a user interface picture before switching to Simulator View.\n\n " +
//                         "This can be done from within Builder View, using the \"Load Picture\" button.";
//                 return alert(msg);
//             }
//             if (!projectManager.project().mainPVSFile()) {
//                 msg = "Please set a Main File before switching to Simulator View.\n\n" +
//                         "This can be done using Model Editor:\n" +
//                         "  (i) select a file from the file browser shown on the right panel of the Model Editor\n" +
//                         "  (ii) click on \"Set as Main File\" to set the selected file as Main File.";
//                 return alert(msg);
//             }
//             switchToSimulatorView();
//         });
//         // d3.select("#btnSaveProject").on("click", function () {
//         //     projectManager.saveProject({ filter: function (desc) { return desc.name.indexOf(".emdl") !== (desc.name.length - 5); }});
//         //     // FIXME: implement API plugin.saveAll in all plugins that saves all files relevant to each plugin, and invoke the APIs here.
//         //     var emulink = require("plugins/PluginManager").getInstance()
//         //                     .getEnabledPlugins().filter(function (p) {
//         //                         return p.getId() === "EmuChartsEditor";
//         //                     });
//         //     if (emulink && emulink[0]) {
//         //         emulink[0].saveAllCharts();
//         //     }
//         // });
//         // d3.select("#btnSaveProjectAs").on("click", function () {
//         //     if (d3.select("#btn_menuSaveChart").node()) {
//         //         d3.select("#btn_menuSaveChart").node().click();
//         //     }
//         //     var name = projectManager.project().name();
//         //     var date = (new Date().getFullYear()) + "." +
//         //                     (new Date().getMonth() + 1) + "." + (new Date().getDate());
//         //     if (!name.endsWith(date)) {
//         //         name += "_" + date;
//         //     }
//         //     projectManager.saveProjectDialog(name);
//         // });
//         // d3.select("#openProject").on("click", function () {
//         //     function openProject() {
//         //         projectManager.openProjectDialog().then(function (project) {
//         //             var notification = "Project " + project.name() + " opened successfully!";
//         //             Logger.log(notification);
//         //         }).catch(function (err) {
//         //             if (err && err.error) {
//         //                 NotificationManager.error(err.error);
//         //             } else {
//         //                 Logger.log(JSON.stringify(err));
//         //             }
//         //         });
//         //     }
//         //     var currentProject = projectManager.project();
//         //     if (currentProject && currentProject._dirty()) {
//         //         //show save project dialog for the current project
//         //         SaveProjectChanges.create(currentProject)
//         //             .on("yes", function (e, view) {
//         //                 view.remove();
//         //                 projectManager.saveProject().then(function (res) {
//         //                     openProject();
//         //                 }).catch(function (err) { alert(err); });
//         //             }).on("no", function (e, view) {
//         //                 view.remove();
//         //                 openProject();
//         //             });
//         //     } else {
//         //         openProject();
//         //     }
//         // });
//         // d3.select("#newProject").on("click", function () {
//         //     projectManager.createProjectDialog().then(function (res) {
//         //         var notification = "Project " + res.project().name() + "created!";
//         //         Logger.log(notification);
//         //     });
//         // });
//         d3.select("#btnLoadPicture").on("click", function () {
//             prototypeImageView.onClickLoad();
//         });
//         d3.select("#btnRecord").on("click", function () {
//             if (!d3.select("#btnRecord").attr("active")) {
//                 d3.select("#btnRecord")
//                     .attr("active", "true")
//                     .style("cursor", "default")
//                     .style("color", "grey");
//                 d3.select("#btnStop")
//                     .style("cursor", "pointer")
//                     .style("color", "rgb(8, 88, 154)");
//                 Recorder.startRecording();
//                 recStartState = WSManager.getWebSocket().lastState();
//                 recStartTime = new Date().getTime();
//                 scriptName = "Script_" + recStartTime;
//             }
//         });
//         d3.select("#btnStop").on("click", function () {
//             if (d3.select("#btnRecord").attr("active")) {
//                 d3.select("#btnRecord")
//                     .attr("active", null)
//                     .style("color", "red")
//                     .style("cursor", "pointer");
//                 d3.select("#btnStop")
//                     .style("cursor", "default")
//                     .style("color", "grey");
//                 actions = Recorder.stopRecording();
//                 //do something with actions
//                 Logger.log(actions);
//                 //ask user to give name to script
//                 Prompt.create({header: "Would you like to save this script?",
//                                message: "Please enter a name for your script",
//                                buttons: ["Cancel", "Save"]})
//                     .on("save", function (e, view) {
//                         scriptName = e.data.prompt.trim() || scriptName;
//                         view.remove();
//                         var script = {name: scriptName, actions: actions, startState: recStartState};
//                         //add the script to the project
//                         projectManager.project().addScript(script);
//                     }).on("cancel", function (e, view) {
//                         view.remove();
//                     });
//             }
//         });
//         d3.select("#btnReconnect").on("click", function () {
//             projectManager.reconnectToServer();
//         });
//         d3.select("#btnRebootPrototype").on("click", function (){
//             //reboot is emulated by restarting the pvsioweb process on the server
//             restartPVSio();
//             switchToSimulatorView();
//         });
//         d3.select("#btnAddNewTimer").on("click", function () {
// //            WidgetManager.addTimer();
//         });
//         d3.select("#btnAddNewWidget").on("click", function () {

//         });
//     }

//     /////These are the api methods that the prototype builder plugin exposes
//     PrototypeBuilder.prototype.getDependencies = function () { return []; };

//     PrototypeBuilder.prototype.updateImageAndLoadWidgets = function () {
//         return updateImageAndLoadWidgets();
//     };

//     /**
//         Change the image in the current project to the one specified in the parameter
//         @param {string} imagePath image name, including path name (given as relative path, where the base path is the project name)
//         @param {string} imageData base64 encoded data
//         @returns {Promise} a promise that resolves when the image change process has completed
//     */
//     PrototypeBuilder.prototype.changeImage = function (imagePath, imageData) {
//         return new Promise(function (resolve, reject) {
//             var pm = projectManager, project = projectManager.project();
//             var oldImage = project.getImage(),
//                 newImage = new Descriptor(imagePath, imageData, { encoding: "base64" });
//             function done() {
//                 var token = {
//                     type: "changeProjectSetting",
//                     projectName: project.name(),
//                     key: "prototypeImage",
//                     value: newImage.path
//                 };
//                 WSManager.getWebSocket().send(token, function (err) {
//                     //if there was no error update the main file else alert user
//                     if (!err) {
//                         //project.prototypeImage = newImage;
//                         project.prototypeImage = new Descriptor(project + "/" + imagePath, imageData, { encoding: "base64" }); //FIXME: in the current implementation project.prototypeImage needs to start with the project name -- we need to check whether this is actually needed, if not we should remove this prefix as this makes things easier when renaming projects.
//                         resolve({
//                             path: newImage.path,
//                             content: newImage.content
//                         });
//                     } else {
//                         Logger.log(err);
//                         reject(err);
//                     }
//                 });
//             }
//             if (oldImage) {
//                 pm.project().removeFile(oldImage.path).then(function (res) {
//                     pm.project().addFile(newImage.path, newImage.content, { encoding: "base64", overWrite: true })
//                         .then(function (res) {
//                             done();
//                         }).catch(function (err) { console.log(err); reject(err); });
//                     }).catch(function (err) { console.log(err); reject(err); });
//             } else {
//                 pm.project().addFile(newImage.path, newImage.content, { encoding: "base64", overWrite: true }).then(function (res) {
//                     done();
//                 }).catch(function (err) { console.log(err); reject(err); });
//             }
//         });
//     };

//     /**
//      * @function preparePageForUmageUpload
//      * @description Sets up the handlers for dealing with the user choosing to change the prototype image
//      * @memberof module:PrototypeBuilder
//      * @instance
//      */
//     var preparePageForImageUpload = function () {
//         // FIXME: dont rely on extensions, use a "type" field in the Descriptor
//         // to specify whether the file is an image or a text file

//         prototypeImageView.on('loadImageClicked', function() {
//             return new Promise(function (resolve, reject) {
//                 if (PVSioWebClient.getInstance().serverOnLocalhost()) {
//                     fs.readFileDialog({
//                         encoding: "base64",
//                         title: "Select a picture",
//                         filter: MIME.imageFilter
//                     }).then(function (descriptors) {
//                         _prototypeBuilder.changeImage(descriptors[0].name, descriptors[0].content).then(function (res) {
//                             prototypeImageView.setImage(res).then(function (res) {
//                                 updateControlsHeight();
//                                 if (d3.select("#imageDiv svg").node() === null) {
//                                     // we need to create the svg layer, as it's not there
//                                     // this happens when a new project is created without selecting an image
//                                     prototypeImageView.updateMapCreator();
//                                 }
//                                 resolve(res);
//                             });
//                         });
//                     }).catch(function (err) { reject(err); });
//                 } else {
//                     d3.select("#btnSelectPicture").node().click();
//                     resolve();
//                 }
//             });
//         });





//         d3.selectAll("#btnEditStoryboard").on("click", function () {
//             WidgetManager.displayEditStoryboardDialog();
//         });

//         d3.select("#btnSelectPicture").on("change", function () {
//             var file = d3.event.currentTarget.files[0];
//             if (file && projectManager.isImage(file.name)) {
//                 _updateImage(file).then(function (res) {
//                     if (d3.select("#imageDiv svg").node() === null) {
//                         // we need to create the svg layer, as it's not there
//                         // this happens when a new project is created without selecting an image
//                         prototypeImageView.updateMapCreator();
//                     }
//                 });
//             }
//         });
//     };

//     /**
//      * Sets up listeners on child views that are used to communicate between the children and back to this class
//      * @private
//      */
//     PrototypeBuilder.prototype._setUpChildListeners = function() {
//         prototypeImageView.on("WidgetRegionDrawn", function(coord, region) {
//             NewWidgetView.create(coord)
//                 .on("ok", function (e, view) {
//                     view.remove();
//                     e.data.scale = prototypeImageView.resize();
//                     var widget = WidgetManager.addNewWidget(e.data, coord, function(w, renderResponse) {
//                         region.classed(w.type, true).attr("id", w.id);
//                         w.element(region);
//                         // if (w.needsImageMap()) {
//                         //     w.createImageMap({ callback: renderResponse });
//                         // }
//                     });
//                     widget.renderSample({ visibleWhen: "true" });

//                     widgetListView.selectWidget(widget, false);
//                 }).on("cancel", function (e, view) {
//                     view.remove();
//                     d3.select(region.node().parentNode).remove();
//                 });
//         });
//         function widgetEditRequest_handler(widgetID) {
//             var widget = WidgetManager.getWidget(widgetID);
//             EditWidgetView.create(widget)
//                 .on("ok", function (e, view) {
//                     view.remove();
//                     WidgetManager.editWidget(widget, e.data);
//                 }).on("cancel", function (e, view) {
//                     // remove dialog
//                     view.remove();
//                 });
//         }
//         prototypeImageView.on("WidgetEditRequested", function(widgetID) {
//             widgetEditRequest_handler(widgetID);
//         });
//         widgetListView.on("WidgetEditRequested", function(widgetID) {
//             widgetEditRequest_handler(widgetID);
//         });

//         prototypeImageView.on("WidgetSelected", function(widget, add) {
//             widgetListView.selectWidget(widget, add);
//         });
//         widgetListView.on("WidgetSelected", function(widget, add) {
//             prototypeImageView.selectWidget(widget, add);
//         });
//     };



//     PrototypeBuilder.prototype.handleKeyDownEvent = function (e) {
//         if (PluginManager.getInstance().isLoaded(this) && !this.collapsed) {
//             prototypeImageView._mapCreator.handleKeyDownEvent(e);
//             require("widgets/ButtonHalo").getInstance().handleKeyDownEvent(e);
//         }
//     };

//     PrototypeBuilder.prototype.handleKeyUpEvent = function (e) {
//         if (PluginManager.getInstance().isLoaded(this) && !this.collapsed) {
//             require("widgets/ButtonHalo").getInstance().handleKeyUpEvent(e);
//         }
//     };
//     /**
//         Gets an instance of the project manager
//         @deprecated use ProjectManager.getInstance()
//     */
//     PrototypeBuilder.prototype.getProjectManager = function () {
//         console.log("deprecated call to PrototypeBuilder.getProjectManager() use ProjectManager.getInstance() instead");
//         return projectManager;
//     };

//     module.exports = {
//         getInstance: function () {
//             if (!instance) {
//                 instance = new PrototypeBuilder();
//             }
//             return instance;
//         }
//     };
}

