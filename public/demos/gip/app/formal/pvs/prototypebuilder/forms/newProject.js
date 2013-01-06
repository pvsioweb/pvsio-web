/**
 * model for new project
 * @author Patrick Oladimeji
 * @date Jan 3, 2013 : 12:56:03 PM
 */
define(["./formBuilder"], function(formBuilder){
	var model = {
			legend:{value:"New Project", classes:"header"},
			data:[
			      {label:"Project Name", name:"projectName", other:['required']},
			      {label:"Prototype Image", name:"prototypeImage", inputType:"file", other:['required']},
			      {label:"PVS Spec", name:"pvsSpec", inputType:"file", other:['required']}
			      ]
		};
	
	return{
		create:function(){
			return formBuilder.create(model);
		}
	}
});