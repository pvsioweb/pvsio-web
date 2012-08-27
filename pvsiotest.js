/**
 *
 * @author hogfather
 * @date Jul 27, 2012 11:48:34 AM
 * @project JSLib
 */

var pvsio = require('./pvsprocess')();

pvsio.start("pvscode/alarisGP_oldFW", function(data){
	console.log(JSON.stringify(data, null, ' '));
	
	if(data.type === "processReady"){
		//pvsio process ready
		console.log("process ready!");
		pvsio.sendCommand("init(0);");
	}
});