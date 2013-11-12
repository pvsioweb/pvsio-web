/**
     * @fileOverview Utility functions to translate from a graphic specification to a pvs specification.
     * @version 0.2
     */


/**
     * 
     * @module stateToPvsSpecificationWriter
 */
   
define(function (require, exports, module) {
	"use strict";

  /************* 	Exported Function 	                   ************************************************/


   module.exports = {
	               newPVSSpecification : newPVSSpecification,
                       addState : addState,
		       addTransition : addTransition,
		       addConditionInTransition : addConditionInTransition,
		       noFocus : noFocus,
		       focusOn : focusOn,
		       focusOnFun : focusOnFun,
		       changeStateName : changeStateName
	               /*addEntryCondition : addEntryCondition,
		       setInitialState   : setInitialState,
		       userModification  : userModification,
	               addConditionInTransition : addConditionInTransition*/	

   };

  /**************     State Variables                              ************************************************/

	var writer;

  /**************  Exported Functions Definition 		    ************************************************/

/** 
 *  Create a new pvs specification   
 *
 *  @param nameTheory           - Name of the pvs theory which will be created    
 *  @param editor               - Reference to the editor where the pvs specification has to be written                    
 *
 *  @returns void 
 *	      
 */

function newPVSSpecification(nameTheory, editor )
{
	writer    = new writerOnContent(nameTheory, editor );

}

/** 
 *  Add a state in the specification  
 *
 *  @param newState             - Object having name and id property  
 *
 *  @returns void 
 *	      
 */
function addState(newState)
{
	writer.addState(newState.name);
	noFocus();
}

/** 
 *  Add a transition in the PVS Specification  
 *
 *  @param newTransition             - New transition function name  
 *
 *  @returns void 
 *	      
 */	
function addTransition(newTransition)
{
	writer.addTransition(newTransition );
	noFocus();       

}


/** 
 *  Add a condition for a transition function   
 *
 *  @param {string }   nameTransition    - Name of the transition has to be modified 
 *  @param source                        - source state for the condition is being added 
 *  @param target                        - target state for the condition is being added   
 *
 *  @returns void 
 *	      
 */
function addConditionInTransition(transitionName, source, target)
{
	writer.addConditionInTransition(transitionName, source.name, target.name );	
	noFocus();
}

/** 
 *  This function should be called when user clicks on canvas,so the focus on previously selected element will be lost     
 *  @returns void 
 *	      
 */
function noFocus()
{
	writer.editor.gotoLine(0);
	if( writer.lastMarker )
	{
	    writer.editor.removeSelectionMarker(writer.lastMarker);
	    writer.lastMarker = undefined;
	}

}

/** 
 *  Called when user clicks on an edge, the corresponding code in the editor will be highlighted    
 *  @param {object} edge  - Object which represents the edge, it should be at least 'name' property
 *  @returns void 
 *	      
 */
function focusOnFun(edge)
{
     noFocus();

     var range = writer.editor.getSelectionRange();
     var objectSearch = { 
  		        	wholeWord: false,
			        range: null,
                        }; 

     var init = "%{\"_block\": \"BlockStart\" , \"_id\" : \"" + edge.name + "(st: (per_" + edge.name +"))\"}";
     var end = " %{\"_block\": \"BlockEnd\" , \"_id\" : \"" + edge.name + "(st: (per_" + edge.name + "))\"}";
	
     var initSearch = writer.editor.find(init, objectSearch, true);
     var endSearch = writer.editor.find(end, objectSearch, true);
	
     
     range.start.row = initSearch.start.row;
     range.start.column = initSearch.start.column;
     range.end.row = endSearch.end.row;
     range.end.column = endSearch.end.column;

     objectSearch.range = range;
	
     init = "st`current_state = " + edge.source.name;
     end = "IN enter_into(" + edge.target.name + ")(new_st)";
     
     initSearch = writer.editor.find(init, objectSearch, true );
     endSearch = writer.editor.find(end, objectSearch, true ); 

     range.start.row = initSearch.start.row;
     range.start.column = initSearch.start.column;
     range.end.row = endSearch.end.row;
     range.end.column = endSearch.end.column;
     
     /// Saving range that is going to be highlighted
     writer.lastMarker = range;
  
     /// Highlighting text 
     writer.editor.addSelectionMarker(range);
     
	
}

/** 
 *  This function should be called when user clicks on an element (node). Its purpose is to highlight the corresponding code in the editor
 *  @param {object} node  - Node to be highlighted in the editor, it is an object having at least 'name' property        
 *  @returns void 
 *	      
 */
function focusOn(node)
{
	noFocus();

	var tmp = writer.editor.find("{" + node.name);

       	if( ! tmp )
	    writer.editor.find("," + node.name);
}

/** 
 *  This function is called when the user changes the name of a node, we need to change the PVS specification to be consistent with new name of node
 *  @param {string} oldName  - old name of the node  
 *  @param {string} newName  - new name of the node        
 *  @returns void 
 *	      
 */
function changeStateName(oldName, newName)
{
	var objectSearch = { 
  			     wholeWord: true,
			     caseSensitive : true,
			     range: null,
		           }; 

	writer.editor.find(oldName, objectSearch);
	writer.editor.replaceAll(newName);


}

  /**************  Utility Functions private to the module    ******************************************************/              
function writerOnContent(nameTheory, editor)
{
	this.nameTheory = nameTheory;
	this.delimitator = "";
	this.editor = editor;
	this.content = this.nameTheory + ": THEORY \n  BEGIN\n\n" +
		       "  %{\"_block\" : \"BlockStart\", \"_id\" : \"StateName\"  }\n" + 
	               "  StateName: TYPE\n" + 
		       "  %{\"_block\" : \"BlockEnd\", \"_id\" : \"StateName\"  }\n\n" +
		       "  %{\"_block\" : \"BlockStart\", \"_id\" : \"State\"}\n" +
		       "  State: TYPE = [#\n"+ 
                       "    current_state: StateName \n" +
                       "  #]\n" +
		       "  %{\"_block\" : \"BlockEnd\", \"_id\" : \"State\"]\n\n" +
		       "  %{ \"_block\" : \"BlockStart\", \"_id\" : \"initial_state\"}\n" +
	               "  initial_state: State \n" +
		       "  %{ \"_block\" : \"BlockEnd\", \"_id\" : \"initial_state\"}\n\n" +
                       " END " + this.nameTheory;

	editor.setValue(this.content);
	editor.clearSelection();
	editor.moveCursorTo(0,0);
	
	editor.content = undefined;   
	
	/********** END Constructor ********/	

	this.addState = function( newState )
	{
		var range = editor.getSelectionRange();
		var objectSearch = { 
  				     wholeWord: false,
				     range: null,
			           }; 

		var init = "%{\"_block\" : \"BlockStart\", \"_id\" : \"StateName\"  }";
		var end = "%{\"_block\" : \"BlockEnd\", \"_id\" : \"StateName\"  }";

		var initSearch = editor.find(init, objectSearch, true);
		var endSearch = editor.find(end, objectSearch, true);
		var content;	

		range.start.column = 0;
		range.end.column= 11111; ///FIXME
		range.start.row = initSearch.end.row + 1;
		range.end.row = endSearch.end.row - 1;
		
		//Content should be the list of the states
		content = editor.session.getTextRange(range); 

		var index;
                var symbol_beg = "";
		var newStateString;

		///Checking if a state has been already added 
		index = content.indexOf('}');
		if( index == -1 ) ///If not, add also the '{' at the beginning 
		{
		    symbol_beg = " = {";
		    index = content.indexOf('E') + 1;
	        }
		
		newStateString = content.substring(0, index);
		newStateString = newStateString + symbol_beg + this.delimitator + newState + '};';
		this.delimitator = ',';
		
		editor.find(content);
		editor.replace(newStateString);


	} 
	
	this.addTransition = function (newTransition)
	{
			
		var range = editor.getSelectionRange();
		var objectSearch = { 
  				     wholeWord: false,
				     range: null,
			           }; 

		//Before adding a Transition, we need to check if it has been already created
	
		var checkingString = "%{\"_block\": \"BlockStart\" , \"_id\" : \"" + newTransition + "(st: (per_" + newTransition + "))\"}\n";
		var checkingSearch = editor.find(checkingString, objectSearch, true);

		if( checkingSearch ) //If initial Tag is present, transition has been already created 
		    return;

		//Transition function has not been already created
		var end = "END " + this.nameTheory;

		var endSearch = editor.find(end, objectSearch, true);
		var content;	
	
		range.start.column = 0;
		range.end.column= 11111; ///FIXME
		range.start.row = endSearch.end.row - 1;
		range.end.row = endSearch.end.row - 1;
 
		editor.gotoLine(endSearch.end.row , 1000, true);
		content = "  %{\"_block\": \"BlockStart\" , \"_id\" : \"per_" + newTransition + "(st:State)\"}\n" + 
		          "  per_" + newTransition + "(st:State ) : bool = true\n" +
                          "  %{\"_block\": \"BlockEnd\" , \"_id\" : \"per_" + newTransition + "(st:State)\"}\n\n";  
	
		content = content + 
			  "  %{\"_block\": \"BlockStart\" , \"_id\" : \"" + newTransition + "(st: (per_" + newTransition + "))\"}\n" +
			  "  " + newTransition + "(st:(" + newTransition + " )):State = \n" +
			  "  COND\n" +
			  "  ENDCOND\n" +
			  "  %{\"_block\": \"BlockEnd\" , \"_id\" : \"" + newTransition + "(st: (per_" + newTransition + "))\"}\n\n"; 
			  
			
		editor.insert("\n" + content);
	}
	
	this.addConditionInTransition = function(nameTransition, sourceName, targetName )
	{
		// FIXME: Create a function that return this string passing nameTransition as parameter 
	
		var firstLine = "  %{\"_block\": \"BlockStart\" , \"_id\" : \"" + nameTransition + "(st: (per_" + nameTransition + "))\"}\n" +
			        "  " + nameTransition + "(st:(" + nameTransition + " )):State = \n" ;

		var endLine = "  %{\"_block\": \"BlockEnd\" , \"_id\" : \"" + nameTransition + "(st: (per_" + nameTransition + "))\"}\n\n";
		
		var objectSearch = { 
  				     wholeWord: false,
				     range: null,
			           }; 
		var endSearch = editor.find(endLine, objectSearch, true);
	
		//Attention to , (coma)!!! FIXME
		editor.gotoLine(endSearch.end.row -3 , 1000, true);

		editor.insert("\n     st`current_state = "  + sourceName + "\n    -> LET new_st = leave_state("+sourceName +")" +
                              "\n        IN enter_into("+ targetName + ")(new_st)");

		editor.find("st`current_state = "  + sourceName + "\n    -> LET new_st = leave_state("+sourceName +")" +
                              "\n        IN enter_into("+ targetName + ")(new_st)");
	
	}

}




});
