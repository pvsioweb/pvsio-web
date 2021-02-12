/**
 * @module LayoutManager
 */
import * as Utils from '../utils/pvsiowebUtils';
import { PVSioWebPlugin } from './PVSioWeb';
import * as Backbone from 'backbone';

const toolkitInterface: string = `
<div id="PVSio-web-logo" class="PVSio-web-logo">
    <div class="loader">
        <div class="version">PVSio-web {{version}}</div>
        <div class="bar">Loading<div></div><div></div><div></div><div></div></div>
        <div style="font-size:small;text-align:center;" id="loading-info"></div>
    </div>
</div>
<div id="warnings" class="warnings" style="display:none"><button type="button" id="dismissWarnings">Dismiss</button></div>
<div id="content" class="center pvsioweb-content" style="position:absolute; height:28px; top:28px;">
    <div class="container-fluid row no-gutters" style="padding:0;">
        <div id="toolkit-body" class="container-fluid col no-gutters">
        <!-- plugin panels go here -->
        </div>
        <div id="toolkit-plugin-list" class="container-fluid col-2 no-gutters" style="display:none;">
            <div id="plugins-group" class="plugins-group">
                <div class="plugins" style="min-height:37px;">PVSio-web Tools</div>
                {{!-- <ul>
                    {{#each plugins}}
                    <li class="list-group-item plugin-box" id="pluginBox_{{id}}" style="display:flex;">
                        <div class="toggle toggle-modern plugin-toggle" style="width:80px; height:32px;" id="pluginToggle_{{id}}"></div>
                        <label for="{{label}}" id="pluginLabel_{{id}}" style="margin: 6px 0 0 10px;">
                            <input type="checkbox"
                                   name="{{label}}"
                                   id="plugin_{{id}}"
                                   style="display:none;">
                                   {{label}}
                        </label>
                    </li>
                    {{/each}}
                </ul> --}}
            </div>
            <div class="expandable-panel">
                <script>
                    function toggle(elem, label) {
                        var text = document.getElementById(elem + "-label");
                        var c = document.getElementById(elem);
                        if (c.style.display === "none") {
                            c.style.display = "block";
                            text.textContent = label;
                        } else {
                            c.style.display = "none";
                            text.textContent = label + " (click to expand)";
                        }
                    }
                </script>
                <div class="expandable-panel-separator" style="height:4px; background-color: gray;"></div>
                <div class="expandable-panel-heading" onclick="toggle('scripts', 'Interactions recorder')">
                    <span id="scripts-label">Interactions recorder (click to expand)</span>
                </div>
                <div id="scripts" style="display:none">
                    <div id="scripts-toolbar">
                        <span id="btnRecord" class="glyphicon">&bull;</span>
                        <span id="btnStop" class="glyphicon glyphicon-stop"></span>
<!--
                        <span id="btnFastbackward" class="glyphicon glyphicon-circle-arrow-left"></span>
                        <span id="btnPlay" class="glyphicon glyphicon-play-circle"></span>
                        <span id="btnFastforward" class="glyphicon glyphicon-circle-arrow-right"></span>
                        <span id="btnRepeat" class="glyphicon glyphicon-repeat"></span>
-->
                    </div>
                    <ul class="list-group"></ul>
                </div>

                <div class="expandable-panel-separator" style="height:4px; background-color: gray;"></div>
                <div class="expandable-panel-heading" onclick="toggle('console', 'PVSio-web console')">
                    <span id="console-label">PVSio-web console (click to expand)</span>
                </div>
                <div id="console" style="display:none"><p>Log start...</p></div>
                <div class="expandable-panel-separator" style="height:4px; background-color: gray;"></div>
                <div id="project-notifications"></div>
            </div>
        </div>
    </div>
    <div id="toolkit-header" class="btn-group container-fluid p-0" style="position:fixed;top:0px;z-index:99999;">
        <div id="projectTitle">
            <div class="container-fluid px-1">
                <div class="toolkit-toolbar btn-group">
                    <button type="button" class="btn btn-sm" id="newProject">New Project</button>
                    <button type="button" class="btn btn-sm" id="openProject">Open Project</button>
                    <div class="btn-group pull-right">
                        <button type="button" class="btn btn-sm" id="btnSaveProject">Save Project</button>
                        <button type="button" class="btn btn-sm dropdown-toggle" data-toggle="dropdown"></button>
                        <div class="dropdown-menu dropdown-menu-right" role="menu" style="background-color:#08589a;">
                            <button class="btn btn-sm" id="btnSaveProjectAs" style="border-radius:0; margin:-8px 0 -8px; padding-right:2em; width:100%; text-align:right;">Save As...</button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm" id="btnLoadPicture" style="display:none;">Change Picture</button>
                    <div class="pull-right" style="min-width: 260px; display:none;">
                        <button id="btnReconnect" class="btn btn-sm" style="display:none;">Try to reconnect to WebServer <span class="fa fa-random"></span></button>
                        <button id="lblWebSocketStatus" class="btn btn-sm status" style="background:rgb(8, 88, 154); cursor:default;">WebServer <span class="fa fa-check"></span></button>
                        <button id="logo" class="btn btn-sm status" style="background:rgb(8, 88, 154); cursor:default;"><span>PVSio-web {{version}}</span></button>
                        <div id="autoSaver" class="pull-right"></div>
                        <button id="preferences" class="btn btn-sm"><span class="fa fa-bars"></span></button>
                    </div>
                </div>
            </div>
            <div class="btn prototype-name pull-right"></div>
        </div>
    </div>
</div>
<div id="audio"></div>`;

// the set of plugins is declared in pluginList
import { plugins } from '../plugins/pluginList';

export class LayoutManager extends Backbone.Model {

    protected version: string;
    protected collapsed: boolean = false;
    protected parent: string;

    constructor () {
        super();
    }

    async activate (opt?: { version?: string, parent?: string }): Promise<boolean> {
        this.version = opt?.version || "";
        this.parent = opt?.parent || "body";
        console.log(`Browser version: ${Utils.getVersion()}`);
        console.log(`Toolkit version: PVSio-web ${this.version}`);
        // console.log(`[layout-manager] Parent is ${this.parent}`);
        this.createHtmlElements();
        this.installHandlers();
        this.hideSplash({ fade: true });
        return true;
    }

    /**
     * Creates the user interface layout, which includes a top-level toolbar and a central panel where plugins will be appended
     * @param opt 
     */
    protected createHtmlElements (opt?: { removeSplash?: boolean }): void {
        const mainView: string = Handlebars.compile(toolkitInterface)({
            plugins,
            version: this.version
        });
        $(this.parent).html(mainView);
        // hide pvsio-web loading screen if noSplash is set in opt and make the tool visible
        if (opt?.removeSplash) {
            this.hideSplash();
        }
    }
    
    protected installHandlers (): void {
        // Forward key events to the active panel. By using this instead of registering their own global key listeners,
        // panels avoid breaking the functionality of other panels or causing behaviour that is confusing for the user.
        $("body").on("keydown.global", (evt: JQuery.Event) => {
            const activePanel: string = $("body").attr("active-panel");
            // if (!$("form")[0] && activePanel && typeof this.activePanel.handleKeyDownEvent === "function") {
            //     this.activePanel?.handleKeyDownEvent(evt);
            // }
        });
        $("body").on("keyup.global", (evt: JQuery.Event) => {
            const activePanel: string = $("body").attr("active-panel");
            // if (!$("form")[0] && activePanel && typeof this.activePanel.handleKeyUpEvent === "function") {
            //     this.activePanel?.handleKeyUpEvent(evt);
            // }
        });

        if (!Utils.isBrowserSupported()) {
            const msg: string = Utils.requiredBrowserWarning();
            console.log(msg);
            $(".warnings").css("display", "block").append(`<p>${msg}</p>`);
            $(".warnings #dismissWarnings").on("click", () => {
                $(".warnings").css("display", "none");
            });
        }

        // the following belong to ProjectManager
        // $("#btnSaveProject").on("click", () => {
        //     this.context.projectManager.saveProject({ filter: function (desc) { return desc.name.indexOf(".emdl") !== (desc.name.length - 5); }});
        //     // FIXME: implement API plugin.saveAll in all plugins that saves all files relevant to each plugin, and invoke the APIs here.
        //     // var emulink = require("plugins/PluginManager").getInstance().getEnabledPlugins().filter(function (p) {
        //     //     return p.getId() === "EmuChartsEditor";
        //     // });
        //     // if (emulink && emulink[0]) {
        //     //     emulink[0].saveAllCharts();
        //     // }
        // });
        // $("#btnSaveProjectAs").on("click", () => {
        //     if ($("#btn_menuSaveChart")[0]) {
        //         $("#btn_menuSaveChart")[0].click();
        //     }
        //     const date: string = `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`;
        //     let name: string = this.context.projectManager.getProject().name();
        //     if (!name.endsWith(date)) {
        //         name += "_" + date;
        //     }
        //     this.context.projectManager.saveProjectDialog(name);
        // });
        // $("#openProject").on("click", () => {
        //     // function openProject() {
        //     //     ProjectManager.openProjectDialog().then(function (project) {
        //     //         var notification = "Project " + project.name() + " opened successfully!";
        //     //         Logger.log(notification);
        //     //     }).catch(function (err) {
        //     //         if (err && err.error) {
        //     //             NotificationManager.error(err.error);
        //     //         } else {
        //     //             Logger.log(JSON.stringify(err));
        //     //         }
        //     //     });
        //     // }
        //     // const currentProject: Project = ProjectManager.project();
        //     // if (currentProject && currentProject._dirty()) {
        //     //     //show save project dialog for the current project
        //     //     SaveProjectChanges.create(currentProject)
        //     //         .on("yes", function (e, view) {
        //     //             view.remove();
        //     //             ProjectManager.saveProject().then(function (res) {
        //     //                 openProject();
        //     //             }).catch(function (err) { alert(err); });
        //     //         }).on("no", function (e, view) {
        //     //             view.remove();
        //     //             openProject();
        //     //         });
        //     // } else {
        //     //     openProject();
        //     // }
        // });
        // $("#newProject").on("click", () => {
        //     this.context.projectManager.createProjectDialog().then((res) => {
        //         const notification: string = "Project " + res.project().name() + "created!";
        //         console.log(notification);
        //     });
        // });
    }


    /**
     * Removes the collapsible specified in the parameter.
     * @param {d3.selection} container The div returned from a call to createCollapsiblePanel
     */
    removeCollapsiblePanel (container: JQuery<HTMLDivElement>) {
        if (container && container[0]) {
            const parent: JQuery<HTMLElement> = $(container[0].parentElement);
            if (parent && parent.hasClass("collapsible-panel-parent")) {
                parent.empty();
            }
        }
    };

    async hideSplash (opt?: { fade?: boolean }): Promise<void> {
        opt = opt || {};
        if (opt.fade) {
            $("#PVSio-web-logo").animate({ "opacity": 0 }, 500);
            $(".toolkit-body").animate({ "opacity": 1 }, 1000);
            return new Promise ((resolve, reject) => {
                setTimeout(() => {
                    $("#PVSio-web-logo").css("display", "none");
                }, 500);
            });    
        } else {
            $("#PVSio-web-logo").css("display", "none");
        }
    }

    jumpTo(elem: string): void {
        if (document.getElementById(elem)) {
            const scrollTop: number = document.getElementById(elem).offsetTop - 60; // 60 is the height of the PVSio-web tool bar
            $('html, body').animate({ scrollTop }, 2000);
            // window.scrollTo(0, top);
        }
    }

    /**
     * @description Selects a plugin (i.e., scrolls the page down to the plugin)
     * @param { string | Object} plugin the plugin to be selected, given as plugin name, or plugin object
     */
    selectPlugin (plugin: string | PVSioWebPlugin) {
        if (plugin) {
            if (typeof plugin === "string") {
                this.jumpTo(plugin);
            } else if (typeof plugin.getName === "function") {
                this.jumpTo(plugin.getName());
            }
        }
        return this;
    }



    // /**
    //  * Adds a stylesheet with the specified url to the page
    //  */
    // addStyleSheet (url, cb?): void {
    //     const link: JQuery<HTMLElement> = $(document.createElement("<link></link>")).attr("type", "text/css").attr("rel", "stylesheet").attr("href", url);
    //     $("html head").append(link);
    //     if (cb) {
    //         link.on("load", () => {
    //             cb(null, link);
    //         }).on("error", () => {
    //             cb("error");
    //         });
    //     }
    // };

    getVersion (): string {
        return this.version;
    };
}