/**
 * 
 * @author Enrico D'Urso
 * @date 11/25/13 11:18:10 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */



/**
     * @fileOverview Utility Functions to create file and add them in file list.
     * @version 0.1
     */


/**
     * 
     * @module fileHandler
 */

/** 
 * Create a new file and add it in the project passed as parameter.The New file will be shown in file list box.   
 *  
 *  @param  currentProject            - project reference where file will be added 
 *  @param  editor                    - reference to editor 
 *  @param  ws                        - reference to webSocket
 *  @param  {string} [name]           - name of the file. If undefined a default name will be used     
 *  @param  {string} [content]        - textual content of the file. If undefined a default content will be used  
 *
 *  @returns void 
 *	      
 */

define(function (require, exports, module) {
	"use strict";

function new_file(currentProject, editor, ws, name, content, pm )
{
	var default_name = "MyTheory";
	var default_content = " THEORY BEGIN \nEND " ;
    var init_content ;

	if( ! name ) 
    {   
        init_content = default_name + counter;
	    name = init_content + ".pvs"; 

        if( counter == "" )
            counter = 0;
        
	    counter = counter + 1;
	
	}
	
	if( ! content ){ content = init_content + default_content + init_content; }   

    currentProject.addSpecFile(name, content);
        
    //FIXME: Maybe we needn't call renderSourceFileList each time
    pm.renderSourceFileList();
}

    module.exports = {
          new_file : new_file              
    };

});


