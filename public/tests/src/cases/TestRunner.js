/**
 * Main entry for test runner
 * @author Patrick Oladimeji
 * @date 5/1/14 13:38:56 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */

require.config({
    baseUrl: "../../../../public/pvsioweb/app",
    paths: {
        "test": "../../tests/src/cases",
        "ace": "../lib/ace",
        "d3": "../lib/d3",
        "jsTree": "../lib/jstree",
        "pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "../lib/imagemapper",
        "text": "../lib/text",
        "lib": "../lib"
    }
});

require(["main", "test/Project"], function () {
    "use strict";
    
});