/*global layoutjs */
define(function (require, exports, module) {
    "use strict";
    var PVSioWebClient = require("PVSioWebClient"),
        ScreenControlsView = require("./forms/ScreenControlsView"),
        Screen = require("./Screen"),
        ScreenCollection = require("./ScreenCollection"),
        PIMWidgetManager = require("./PIMWidgetManager"),
        PrototypeImageView = require("pvsioweb/forms/PrototypeImageView"),
        template = require("text!./forms/templates/PIMPrototyperPanel.handlebars"),
        FileSystem = require("filesystem/FileSystem"),
        MIME = require("util/MIME").getInstance();

    var instance;

    var PIMPrototyper = function() {
    };

    /**
     * Initialises the PIM prototyping panel and adds it to the DOM
     * @param {(string|Element)} parentElement Element to add the PIM panel to
     * @private
     */
    PIMPrototyper.prototype._init = function (parentElement) {
        var opts = {
            headerText: "PIM Prototyper",
            owner: this.getName()
        };

        if (parentElement) {
            opts.parent = parentElement;
        }

        this._container = PVSioWebClient.getInstance().createCollapsiblePanel(opts);
        this._container.html(Handlebars.compile(template)());

        this._fileSystem = new FileSystem();
        this._widgetManager = new PIMWidgetManager();

        this._screens = new ScreenCollection();
        this._screenControlsView = new ScreenControlsView({
            el: this._container.select(".panel-footer").node(),
            collection: this._screens
         });

         this._prototypeImageView = new PrototypeImageView({
             el: this._container.select(".prototype-image-container").node(),
             widgetManager: this._widgetManager,
             mapID: "prototypeMap"
         });

         // Set up listeners on the sub-views
         this._prototypeImageView.on("loadImageClicked", this._showLoadImageDialog, this);
         this._screenControlsView.on("changeImageClicked", this._showLoadImageDialog, this);
         this._screens.on("selectionChanged", this._onSelectedScreenChange, this);

         layoutjs({el: "#body"});
    };

    PIMPrototyper.prototype.getName = function () {
        return "PIM Prototyper";
    };

    PIMPrototyper.prototype.initialise = function () {
        this._init();
        return Promise.resolve(true);
    };

    PIMPrototyper.prototype.unload = function () {
        PVSioWebClient.getInstance().removeCollapsiblePanel(this._container);
        return Promise.resolve(true);
    };

    PIMPrototyper.prototype.getDependencies = function () {
        return [];
    };

    /**
     * Change the image fpr the active screen (or create a screen if none are currently selected)
     * @param {string} imagePath
     * @param {string} imageData base64 encoded data
     */
    PIMPrototyper.prototype.changeImage = function (descriptor) {
        // TODO: nwatson: copy the image into the project directory
        var selected = this._screens.getSelected();

        // The user is changing the image with no screen selected, so add a new screen
        if (selected == null) {
            selected = new Screen({ name: "New screen" });
            this._screens.add(selected);
            this._screens.setSelected(selected);
        }

        selected.set("image", descriptor);
    };

    PIMPrototyper.prototype._showLoadImageDialog = function () {
        var _this = this;

        return new Promise(function (resolve, reject) {
            if (PVSioWebClient.getInstance().serverOnLocalhost()) {
                _this._fileSystem.readFileDialog({
                    encoding: "base64",
                    title: "Select a picture",
                    filter: MIME.imageFilter
                }).then(function (descriptors) {
                    _this.changeImage(descriptors[0]);

                    _this._prototypeImageView.setImage(descriptors[0]).then(function (res) {
                        _this.updateControlsHeight();
                        if (d3.select("#imageDiv svg").node() === null) {
                            // we need to create the svg layer, as it's not there
                            // this happens when a new project is created without selecting an image
                            _this._prototypeImageView.updateMapCreator();
                        }
                        resolve(res);
                    });
                }).catch(function (err) { reject(err); });
            } else {
                // TODO: nwatson: implement/hook into file upload functionality
            }
        });
    }

    PIMPrototyper.prototype._onSelectedScreenChange = function (selectedScreen) {
        // TODO: nwatson: update the WidgetManager with the new data
        var img = selectedScreen.get("image");

        if (img == null) {
            this._prototypeImageView.clearImage();
        } else {
            this._prototypeImageView.setImage(img);
        }
    }

    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new PIMPrototyper();
            }
            return instance;
        }
    };
});
