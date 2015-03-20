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
        RemoteFileBrowser = require("pvsioweb/RemoteFileBrowser");
    
    function imageFilter(d) {
        var imageExts = ['.jpg', '.png', '.gif'];
        var ext = d.path.substring(d.path.lastIndexOf("."));
        return d.isDirectory || imageExts.indexOf(ext.toLowerCase()) > -1;
    }
    
    
	var CreateProjectView = BaseDialog.extend({
		render: function () {
			var template = Handlebars.compile(createProjectTemplate);
			this.$el.html(template());
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
            new RemoteFileBrowser(imageFilter).open("")
                .then(function (files) {
                    var paths = files.map(function (f) {
                        return f.path;
                    }).join(",");
                    $("#prototypeImage").val(paths);
                });
        },
        chooseSpec: function (event) {
            new RemoteFileBrowser(null).open("")
                .then(function (files) {
                    var paths = files.map(function (f) {
                        return f.path;
                    }).join(",");
                    $("#pvsSpec").val(paths);
                });
        }
	});
	
	module.exports = {
		create: function () {
			return new CreateProjectView();
		}
	};
});