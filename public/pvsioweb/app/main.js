/**
 * Main entry point for pvsioweb module
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true*/
/*global define, d3, require, $, brackets, _, window, MouseEvent, FormData, document, setTimeout, clearInterval, FileReader */

define(function (require, exports, module) {
    "use strict";
    var pvsws                   = require("websockets/pvs/pvsWSClient"),
        ace                     = require("ace/ace"),
        ListView                = require("pvsioweb/ListView"),
        Project                 = require("project/Project"),
        d3                      = require("d3/d3"),
        queue                   = require("d3/queue"),
        WidgetManager            = require("pvsioweb/WidgetManager").getWidgetManager(),
		ProjectManager			= require("project/ProjectManager"),
		Logger					= require("util/Logger"),
		ui						= require("./interface"),
     
        pvsLanguage                = require("lib/statemachine/pvsLanguage");

    var editor = ace.edit("editor");
    var currentProject = new Project(""), ws, pvsFilesListBox, fileContents = {},
		projectManager = new ProjectManager(currentProject, editor);
    var tempImageName, tempSpecName, mapCreator;
    editor.getSession().setMode('ace/mode/pvsLanguage');
	/**
     * utitlity function to pretty print pvsio output
     */
    function prettyPrint(msg) {
        return msg ? msg.toString().replace(/,,/g, ",") : msg;
    }
     /**
     * parses pvs output into a json object map
     */
    function parseState(state) {
        var st = state[0].substr(2, state[0].length - 4);
        var props = st.split(",");
        var res = {};
        props.forEach(function (p) {
            var args = p.split(":=");
            res[args[0].trim()] = args[1] ? args[1].trim() : args[1];
        });
        return res;
    }

    /**
     * create pvs websocket connection
     * add listeners for pvs process events
     */
    var port = 8082;
    var url = window.location.origin.indexOf("file") === 0 ?
            ("ws://localhost:" + port) : ("ws://" + window.location.hostname + ":" +  port);
    ws = pvsws()
        .serverUrl(url)
        .addListener('ConnectionOpened', function (e) {
            Logger.log("connection to pvsio server established");
            d3.select("#btnRestartPVSioWeb").attr("disabled", null);
            d3.select("#lblWebSocketStatus").select("span").attr("class", "glyphicon glyphicon-ok");
        }).addListener("ConnectionClosed", function (e) {
            Logger.log("connection to pvsio server closed");
            d3.select("#btnRestartPVSioWeb").attr("disabled", true);
            d3.select("#lblWebSocketStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
        }).addListener("pvsoutput", function (e) {
            console.log(e);
            var response = prettyPrint(e.data), tmp;
            ws.lastState(e.data);
            ws.value(parseState(e.data).display);
            console.log(response);
            Logger.pvsio_response_log(response);
        }).addListener("InputUpdated", function (e) {
            Logger.pvsio_commands_log(JSON.stringify(e.data));
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            Logger.log("Server process exited -- server message was ...");
            Logger.log(JSON.stringify(e));
            d3.select("#lblPVSioStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
        }).logon();

	ui.bindListeners(projectManager);
    projectManager.preparePageForImageUpload();
    projectManager.prepareListBoxForFileDrag();
//    projectManager.updateProjectName(default_project_name);
});