/**
 * model for new project
 * @author Patrick Oladimeji, Paolo Masci
 * @date Jan 3, 2013 : 12:56:03 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, require, Handlebars, $*/
define(function (require, exports, module) {
    "use strict";
    var d3			= require("d3/d3"),
        createProjectTemplate = require("text!./templates/createProject.handlebars"),
        BaseDialog  = require("pvsioweb/forms/BaseDialog"),
        FormUtils   = require("pvsioweb/forms/FormUtils"),
        MIME        = require("util/MIME"),
        RemoteFileBrowser = require("pvsioweb/RemoteFileBrowser");

    function imageFilter(d) {
        var mime = MIME.getInstance();
        return !mime.isHiddenFile(d.path) && (d.isDirectory || mime.isImage(d.path));
    }
    function pvsFilter(d) {
        var mime = MIME.getInstance();
        return !mime.isHiddenFile(d.path) && (d.isDirectory || mime.isPVS(d.path));
    }

    var CreateProjectView = BaseDialog.extend({
        render: function (data) {
            var template = Handlebars.compile(createProjectTemplate);
            this.$el.html(template(data));
            $("body").append(this.el);
            return this;
        },
        events: {
            "click #btnOk": "ok",
            "click #btnCancel": "cancel",
            "click #btnChooseImage": "chooseImage",
            "click #btnChooseSpec": "chooseSpec"
        },
        chooseImage: function (event) {
            new RemoteFileBrowser(imageFilter)
                .open("~", { title: "Select a picture" })
                .then(function (files) {
                    var paths = files.map(function (f) {
                        return f.path;
                    }).join(",");
                    $("#prototypeImage").val(paths);
                });
        },
        chooseSpec: function (event) {
            new RemoteFileBrowser(pvsFilter)
                .open("~", { title: "Select .pvs files (use shift key to select multiple files)" })
                .then(function (files) {
                    var paths = files.map(function (f) {
                        return f.path;
                    }).join(",");
                    $("#pvsSpec").val(paths);
                });
        }
    });
    
    module.exports = {
        create: function (data) {
            return new CreateProjectView(data);
        }
    };
});
