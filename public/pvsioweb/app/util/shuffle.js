/**
 * 
 * shuffles an array into a random order
 * @author hogfather
 * @date May 2, 2012
 * @project JSLib
 */
define([], function(){
	return function(array){
		return array.map(function(d){
			return d;
		}).sort(function(a, b){
			return Math.random() - Math.random();
		});
	};
});