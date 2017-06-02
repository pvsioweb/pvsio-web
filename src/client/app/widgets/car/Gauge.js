/**
 * @module Gauge
 * @version 1.0.0
 * @description
 * Gauge renders a basic gauge object (using D3 Gauge Plus library). It assumes that this
 * library was already loaded (TODO fix this). The gauge will be rendered with the
 * pointer showing the current value. The initial value is 0. The render method can
 * then be called, passing the new value as parameter, and the widget will update the gauge
 * to show the new provided value.
 *
 * @author Henrique Pacheco
 * @date Mar 25, 2017
 *
 * @example <caption>Usage of Gauge within a PVSio-web project.</caption>
 * define(function (require, exports, module) {
 *     "use strict";
 *
 *     // Require the Gauge module
 *     require("widgets/car/Gauge");
 *
 *     function main() {
 *          // After Gauge module was loaded, initialize it
 *          var gauge = new Gauge(
 *               'speedometer-gauge', // id of the gauge element that will be created
 *               {
 *                   top: 251,
 *                   left: 53,
 *                   width: 360,
 *                   height: 360
 *               }, // coordinates object
 *               {
 *                   style: 'classic',
 *                   max: 360,
 *                   majorTicks: 13,
 *                   min: 0,
 *                   size: 360,
 *                   redZones: [],
 *                   rotation: -45,
 *                   gap:90,
 *                   drawGap: false,
 *                   cutOutPercetage: 0.45,
 *                   roundValueBeforeRender: true,
 *                   parent: 'dashboard-container-1'
 *               } // options to override the default ones
 *           );
 *
 *          // Re-render the Gauge, provinding a new value
 *          gauge.render(10);
 *     }
 * });
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3_gauge_plus*/
define(function (require, exports, module) {
    "use strict";

    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Gauge constructor.
     *
     * @param id {String} The ID of the element that will contain the gauge.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 200, height: 80 }.
     * @param opt {Object} Options:
     *        size - Size of the gauge (default is 400).
     *        rotation - defines the orientation of the gauge (a value between 0 and 360, defaults to 270).
     *        gap - defines the gap between the beginning and the end of the gauge (defaults to 90).
     *        drawOuterCircle - draw a circle around the gauge (defaults to false).
     *        outerStrokeColor - color of the outer stroke (defaults to "#fff").
     *        outerFillColor - color of the outer circle (defaults to "#fff").
     *        innerStrokeColor - color of the inner stroke (defaults to "#fff").
     *        innerFillColor - color of the inner circle (defaults to "#000").
     *        label - label presented inside the gauge (defaults to '').
     *        labelSize - font size of the label (as a percentage of the gauge radius, defaults to 0.1).
     *        labelColor - color of the label (defaults to "#888").
     *        min - minimum value of the gauge (defaults to 0).
     *        max - maximum value of the gauge (defaults to 200).
     *        initial - initial value of the gauge (defaults to 0).
     *        clampUnderflow - ?? (defaults to false).
     *        clampOverflow - ?? (defaults to false).
     *        majorTicks - number of major ticks to be drawn (defaults to 9).
     *        majorTickColor - color of the major ticks to be drawn (defaults to "#fff").
     *        majorTickWidth - width of the major ticks to be drawn (defaults to "3px").
     *        minorTicks - number of minor ticks to be drawn (defaults to 3).
     *        minorTickColor - color of minor ticks to be drawn (defaults to "#fff").
     *        minorTickWidth - width of the minor ticks to be drawn (defaults to "1px").
     *        greenColor - color for the green zones of the gauge (defaults to "#109618").
     *        yellowColor - color for the yellow zones of the gauge (defaults to "#FF9900").
     *        redColor - color for the red zones of the gauge (defaults to "#e31406").
     *        pointerFillColor - color of the gauge pointer (defaults to "#dc3912").
     *        pointerStrokeColor - color of the stroke of the gauge pointer (defaults to "#c63310").
     *        pointerUseBaseCircle - draw a circle as base of the pointer (defaults to false).
     *        pointerBaseCircleRadius - radius of the base circle (as percentage of total radius, defaults to 0.1).
     *        pointerBaseCircleFillColor - fill color of the base circle (defaults to "#fff").
     *        pointerBaseCircleStrokeColor - stroke color of the base circle (defaults to "red").
     *        pointerBaseCircleStrokeWidth - width of the stroke of the base circle (defaults to "1px").
     *        transitionDuration - duration of the pointer transition (defaults to 500).
     *        greenZones - green zones in the gauge (array of objects with from and to properties as values, defaults to []).
     *        yellowZones - yellow zones in the gauge (array of objects with from and to properties as values, defaults to []).
     *        redZones - red zones in the gauge (array of objects with from and to properties as values, defaults to [{ from - (200 - (200 * 0.125)), to - 200 }]).
     *        roundValueBeforeRender - whether pointer value should be rounded before re-rendering the gauge (defaults to false).
     *        style - apply a default style to the rendered gauge (one of 'classic', 'sport', 'grey' or 'blue', defaults 'classic').
     * @memberof module:Gauge
     * @instance
     */
    function Gauge(id, coords, opt) {
        opt = opt || {};

        // Handle coords
        coords = coords || {};
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 256;
        this.height = coords.height || 256;

        // Aux configurations and variables
        opt.position = opt.position || "absolute";
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";
        this.rendered = false;

        // Create the gauge element
        this.div = d3.select(this.parent)
            .append('div').attr('id', id)
            .style("position", opt.position)
            .style("top", this.top + "px").style("left", this.left + "px")
            .style("width", (this.width) + "px").style("height", (this.height) + "px");

        // D3 Gauge Plus object
        opt.size = (this.width > this.height) ? this.height : this.width;
        this.gauge_obj = this.createGauge(id, opt);

        return this;
    }

    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Create a gauge, apllying the default and style configurations.
     *
     * @param id {String} The ID of the element that will contain the gauge.
     * @param opt {Object} Options object.
     *
     * @memberof module:Gauge
     * @instance
     */
    Gauge.prototype.createGauge = function(id, opt) {

        // Get default configs
        var config = this.mergeConfigs({}, this.getDefaultConfigs());

        // Apply style configs if defined
        if(opt.style) {
            config = this.mergeConfigs(config, this.getStyleConfigs(opt.style));
        }

        // Merge the provided options
        config = this.mergeConfigs(config, opt);

        // Save configs for further usage
        this.config = config;

        // Return the created gauge plus pbject
        return new d3_gauge_plus.Gauge(id, config);
    };

    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Render method.
     *
     * @param new_value {Float} The new value to set the gauge pointer.
     * @param opt {Object} Override options when re-rendering. See constructor docs for
     * detailed docs on the available options.
     *
     * @memberof module:Gauge
     * @instance
     */
    Gauge.prototype.render = function(new_value, opt) {

        if(!this.rendered) {
            // display the gauge
            this.gauge_obj.render();
            this.rendered = true;
        }

        // Check if value needs rounding before rendering
        var valueToRender = (this.config.roundValueBeforeRender) ? Math.round(new_value) : new_value;
        if (valueToRender >= 0) {
            this.gauge_obj.setPointer(valueToRender);
        }

        return this;
    };

    Gauge.prototype.remove = function () {
        Gauge.prototype.parentClass.remove.apply(this);
        this.div.remove();
        return this;
    };

    Gauge.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    Gauge.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    Gauge.prototype.move = function (data) {
        data = data || {};
        if (data.top) {
            this.top = data.top;
            this.div.style("top", this.top + "px");
        }
        if (data.left) {
            this.left = data.left;
            this.div.style("left", this.left + "px");
        }
        return this;
    };

    Gauge.prototype.renderSample = function (opt) {
        // opt = opt || {};
        // var config = this.mergeConfigs(this.getDefaultConfigs(), opt);
        // var gaugeObj = this.createGauge('sample', config);
        // return this.render('sample', config);
        return this;
    };

    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Returns the default config object.
     *
     * @memberof module:Gauge
     * @instance
     */
    Gauge.prototype.getDefaultConfigs = function() {
        return {
            size: 400,
            rotation: 270,
            gap: 90,
            drawOuterCircle: false,
            outerStrokeColor: "#fff",
            outerFillColor: "#fff",
            innerStrokeColor: "#fff",
            innerFillColor: "#000",
            label: '',
            labelSize: 0.1, // Default font size is 10% of radius.
            labelColor: "#888",
            min: 0,
            max: 200,
            initial: 0,
            clampUnderflow: false,
            clampOverflow: false,
            majorTicks: 9,
            majorTickColor: "#fff",
            majorTickWidth: "3px",
            minorTicks: 3,
            minorTickColor: "#fff",
            minorTickWidth: "1px",
            greenColor: "#109618",
            yellowColor: "#FF9900",
            redColor: "#e31406",

            // Added settings
            pointerFillColor: "#dc3912",
            pointerStrokeColor: "#c63310",
            pointerUseBaseCircle: false,
            // Percentage of total radius
            pointerBaseCircleRadius: 0.1,
            pointerBaseCircleFillColor: "#fff",
            pointerBaseCircleStrokeColor: "red",
            pointerBaseCircleStrokeWidth: "1px",

            transitionDuration: 500,
            greenZones: [ ],
            yellowZones: [ ],
            redZones: [ { from: (200 - (200 * 0.125)), to: 200 } ],

            roundValueBeforeRender: false,
            style: 'classic',
        };
    };


    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Returns the style configs for the provided style identifier.
     *
     * @memberof module:Gauge
     * @instance
     */
    Gauge.prototype.getStyleConfigs = function(style_identifier) {
        var styles = {
            classic: {
                outerStrokeColor: "#fff",
                outerFillColor: "#fff",
                innerStrokeColor: "#fff",
                innerFillColor: "#2c2b30",
                majorTickColor: "#fff",
                majorTickWidth: "3px",
                minorTickColor: "#fff",
                minorTickWidth: "1px",
                greenColor: "#109618",
                yellowColor: "#FF9900",
                redColor: "#e31406",
                pointerFillColor: "#e93947",
                pointerStrokeColor: "#150507",
                pointerOpacity: 1,
                pointerShowLabel: false,
                pointerUseBaseCircle: true,
                pointerBaseCircleRadius: 0.1,
                pointerBaseCircleFillColor: "#65686d",
                pointerBaseCircleAbovePointer: true,
                pointerBaseCircleStrokeColor: "#000",
                pointerBaseCircleStrokeWidth: "2px",
            },
            sport: {
                innerFillColor: "#2c2b30",
                pointerFillColor: "#a2302d",
                pointerStrokeColor: "#e2d9df",
                pointerShowLabel: false,
                pointerUseBaseCircle: true,
                pointerBaseCircleFillColor: "#131418",
                pointerBaseCircleStrokeColor: "#131418",
                pointerBaseCircleRadius: 0.15
            },
            grey: {
                drawOuterCircle: true,
                outerStrokeColor: "#838286",
                outerFillColor: "#838286",
                innerStrokeColor: "888",
                innerFillColor: "#fff",
                majorTickColor: "#000",
                majorTickWidth: "2px",
                minorTickColor: "#000",
                pointerFillColor: "#dc555a",
                pointerStrokeColor: "#6f6e73",
                pointerShowLabel: false,
                pointerUseBaseCircle: true,
                pointerBaseCircleAbovePointer: true,
                pointerBaseCircleFillColor: "#838286",
                pointerBaseCircleStrokeColor: "#838286",
                pointerBaseCircleRadius: 0.2,
            },
            blue: {
                outerStrokeColor: "#599bcf",
                outerFillColor: "#599bcf",
                innerStrokeColor: "#599bcf",
                innerFillColor: "#599bcf",
                majorTickColor: "#000",
                majorTickWidth: "2px",
                minorTickColor: "#000",
                labelColor: "#000",
                pointerFillColor: "#290107",
                pointerStrokeColor: "#290107",
                pointerShowLabel: false,
                pointerUseBaseCircle: true,
                pointerBaseCircleFillColor: "#3f4552",
                pointerBaseCircleStrokeColor: "#3f4552",
                pointerBaseCircleRadius: 0.2,
            }
        };

        return (styles.hasOwnProperty(style_identifier)) ? styles[style_identifier] : {};
    };


    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Merges the two config objects provided, with conf2 overriding conf1 values.
     *
     * @memberof module:Gauge
     * @instance
     */
    Gauge.prototype.mergeConfigs = function(conf1, conf2) {
        // Second conf provided overrides the first one
        for (var attr in conf2) { conf1[attr] = conf2[attr]; }
        return conf1;
    };

    module.exports = Gauge;
});
