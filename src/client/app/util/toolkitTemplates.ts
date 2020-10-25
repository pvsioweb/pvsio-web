export const pluginToggle: string = `
<li class="list-group-item plugin-box" id="pluginBox_{{id}}" style="display:flex;">
<div class="toggle toggle-modern plugin-toggle" style="width:80px; height:32px;" id="pluginToggle_{{id}}"></div>
<label for="{{label}}" id="pluginLabel_{{id}}" style="margin: 6px 0 0 10px;">{{label}}</label>
</li>`;

export const toolkitInterface: string = `
<div id="warnings" class="warnings" style="display:none"><button type="button" id="dismissWarnings">Dismiss</button></div>
<div id="content" class="center prototypebuilder">
    <div id="header" class="btn-group toolkit-body">
        <div id="projectTitle">
            <div class="btn txtProjectName"><span id="txtProjectName" style="color:white;"></span></div>
            <div style="width:100%">
                <div class="btn-group pull-right" style="display:flex">
                    <button type="button" class="btn" id="newProject" style="color:white;">New Project</button>
                    <button type="button" class="btn" id="openProject" style="color:white;">Open Project</button>
    <!--
                    <a class="btn"
                       id="btnEditStoryboard">Edit Storyboard</a>
    -->
                    <input type="file" class="hide" id="btnSelectPicture" name="selectPicture" accept="image/*">
                    <div class="btn-group pull-right" style="display:flex; width:158px;">
                        <button type="button" class="btn btn" id="btnSaveProject" style="color:white;">Save Project</button>
                           <button type="button" class="btn btn dropdown-toggle" data-toggle="dropdown" style="color:white; width:32px;">
                               <span class="caret" style="color:white;"></span>
                           </button>
                        <div class="dropdown-menu dropdown-menu-right" role="menu" style="background-color:#08589a;">
                            <button class="btn" id="btnSaveProjectAs" style="color:white; border-radius:0; margin:-8px 0 -8px; padding-left:16px; width:100%; text-align:left;">Save As...</button>
                        </div>
                    </div>
                    <button type="button" class="btn" id="btnLoadPicture" style="color:white;">Change Picture</button>
                    <div class="pull-right" style="min-width: 260px; display:inline-flex;">
<!--
                        <a id="lblWebSocketStatus" class="btn status">WebSocket <span class="fa fa-check"></span></a>
                        <a id="lblPVSioStatus" class="btn status">PVSio <span class="fa fa-exclamation"></span></a>
-->
                        <a id="btnReconnect" class="btn" style="display:none;">Try to reconnect to WebServer <span class="fa fa-random"></span></a>
                        <a id="lblWebSocketStatus" class="btn status"
                           style="background:rgb(8, 88, 154); color:white; cursor:default;">
                            WebServer <span class="fa fa-check"></span></a>
                        <a id="logo" class="btn status"
                           style="background:rgb(8, 88, 154); color:white; cursor:default;">
                            <span>PVSio-web {{version}}</span></a>
                        <div id="autoSaver" class="pull-right"></div>
                        <a id="preferences" class="btn">
                            <span class="fa fa-bars"></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="ljs-hcontent content-body toolkit-body" style="opacity:0;">
        <div class="ljs-hcontent">
            <div id="body"></div>
        </div>
        <div id="rightPanel" class="ljs-right">
            <div id="plugins-group" class="plugins-group">
                <div class="plugins">PVSio-web Tools</div>
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
</div>
<div id="audio"></div>`;