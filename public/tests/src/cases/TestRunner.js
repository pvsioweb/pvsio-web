/**
 * Main entry for test runner
 * @author Patrick Oladimeji
 * @date 5/1/14 13:38:56 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, jasmine*/

require.config({
    baseUrl: "../../../../public/pvsioweb/app",
    paths: {
        "test": "../../tests/src/cases",
        "d3": "../lib/d3",
        "pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "../lib/imagemapper",
        "text": "../lib/text",
        "lib": "../lib",
        "cm": "../lib/cm"
    }
});

require([/*"main", "test/Project", "test/ProjectFile"*/"test/FrontEnd"], function () {
    "use strict";
    jasmine.getEnv().execute();
});