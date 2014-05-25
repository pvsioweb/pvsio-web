/**
 * Useful Utilities for working with html forms
 * @author Patrick Oladimeji
 * @date 11/5/13 9:22:48 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */

define(function (require, exports, module) {
	"use strict";
    
	function serializeForm(el, inputSelectors) {
        return d3.select(el).select(".panel-body").select("#label").text().trim();
    }
	
	function validate(form, inputSelectors) {
		return true;
	}
   
	module.exports = {
		serializeForm:	serializeForm,
		validateForm: validate
	};
});
