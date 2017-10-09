/**
 * View that provides inputs for creating a new PIM widget or editing an existing one
 * @author Nathaniel Watson
 */
/*global define */
define(function (require, exports, module) {
    var BaseDialog = require("pvsioweb/forms/BaseDialog"),
        ScreenDropdownView = require("./ScreenDropdownView"),
        d3 = require("d3/d3"),
		FormUtils = require("pvsioweb/forms/FormUtils"),
        template = require("text!./templates/WidgetConfigView.handlebars");

    var WIDGET_IMAGES_FOLDER = "widget-images/";

    var WidgetConfigView = BaseDialog.extend({

        events: {
            "click .btn-cancel": "cancel",
            "click .btn-create": "ok",
            "click .btn-choose-widget-image": "onChooseImage"
        },

        /**
         * Creates a new view and renders it
         * @param {object} data Options for the view
         * @param {ScreenCollection} data.screenCollection Collection of screens to display as targets
         * @param {PIMWidget} [data.widget] Widget whose data should be used to pre-populate the form
         * @param {string} [data.title] Text to display as the dialog title
         * @param {string} [data.okText] Text to display on the OK button
         */
        initialize: function (data) {
            var _this = this;

            this._d3El = d3.select(this.el);
            this._d3El.attr("class", "overlay").style("top", self.scrollY + "px");

            this._screenDropdown = new ScreenDropdownView({
                collection: data.screenCollection,
                up: false,
                buttonClasses: ""
            });

            this.listenTo(this._screenDropdown, "screenSelected", function (selected) {
                _this._screen = selected;
                this._screenDropdown.setSelected(selected);
            });

            this._template = Handlebars.compile(template);
            this._data = data;
            this.render();
            this.focus();
        },

        render: function () {
            this.$el.html(this._template(this._data));
            this._screenDropdown.setElement(this._d3El.select(".dropdown-container").node()).render();
            if (this._data.widget != null) {
                this._screenDropdown.setSelected(this._data.widget.targetScreen());
            }
            $("body").append(this.el);
            return this;
        },

        onChooseImage: function () {
            return new Promise (function (resolve, reject) {
                require("filesystem/FileSystem").getInstance().readFileDialog({
                    encoding: "base64",
                    title: "Select a picture",
                    filter: require("util/MIME").imageFilter
                }).then(function (descriptors) {
                    if (descriptors && descriptors[0] && descriptors[0].content) {
                        d3.select(".widget-image-alt").style("display", "none");
                        d3.select(".widget-image")
                            .attr("path", descriptors[0].path)
                            .attr("name", descriptors[0].name)
                            .attr("src", descriptors[0].content)
                            .style("height", "20px");
                    }
                    resolve(descriptors);
                }).catch(function (err) { reject(err); });
            });
        },

        ok: function (event) {
            if (this._validate()) {
                var _this = this;
				var form = _this.el;
                var formdata = FormUtils.serializeForm(form);
				formdata.targetScreen = _this._screen;
                var img = d3.select(form).select(".widget-image").node();
                if (img && img.src) {
                    var name = formdata.name + img.name.substring(img.name.lastIndexOf("."));
                    require("project/ProjectManager").getInstance().project()
                        .addFile(WIDGET_IMAGES_FOLDER + name, img.src, { overWrite: true, encoding: "base64" }).then(function (image) {
                            formdata.image = image.path;
                            _this.trigger("ok", {data: formdata, el: _this.el, event: event}, _this);
                        }).catch(function (err) {
                            _this.trigger("ok", {data: formdata, el: _this.el, event: event}, _this);
                        });
                } else {
                    _this.trigger("ok", {data: formdata, el: _this.el, event: event}, _this);
                }
            }
        },

        _validate: function () {
            return this._d3El.select("form").node().checkValidity();
        },

        remove: function () {
            this._screenDropdown.remove();
            BaseDialog.prototype.remove.apply(this);
        }
    });

    return WidgetConfigView;
});
