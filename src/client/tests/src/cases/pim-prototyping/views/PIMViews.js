/**
 * Aggregates the various tests for the PIM prototyping mode views
 * @author Nathaniel Watson <nathaniel@nwatson.nz>
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, describe */

define(function (require, exports, module) {
    "use strict";

    module.exports = {
        run: function () {
            describe("The PIM Prototyping views",
			
			function() {
				require("./ScreenControlsView_UnitTest")();
			}
		);
        }
    };
});
