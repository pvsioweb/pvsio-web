/**
 * handles creating a form for opening a project
 * @author Patrick Oladimeji
 * @date Jan 5, 2013 : 6:42:35 AM
 */
define(["./formBuilder"], function(formBuilder){
	return {
		create:function(options, labelFunc){
			labelFunc = labelFunc || function(d){
				return d.label;
			};
			
			var model = {
					legend:{value:"Open Project", classes:"header"},
					data:[{label:"Select Project", name:"projectName", element:"select", 
						options:options, labelFunction:labelFunc}]
					};
			return formBuilder.create(model);
		}
	};
	}
);