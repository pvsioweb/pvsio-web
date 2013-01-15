/**
 * 
 * @author Patrick Oladimeji
 * @date Jan 10, 2013 : 11:47:37 AM
 */
define(["./formBuilder"], function(formBuilder){
	var model = {
			legend:{value:"Save Project As", classes:"header"},
			data:[
			      {label:"Project Name", name:"projectName", other:['required']}
			      ]
		};
	
	return{
		create:function(){
			return formBuilder.create(model);
		}
	}
});