   /**
     * @fileOverview Utility functions used to handle file (create/open/delete ...)
     * @version 0.2
     */


   /**
     * 
     * @module fileHandler
     */
   
define(function (require, exports, module) {
	"use strict";


   /************* 	Exported Function 	                   ************************************************/


   module.exports = {
		
	createFileLoadFunction : createFileLoadFunction,

        /**  Delete file, which is passed as parameter, from the project    */
	deleteFileFs : deleteFileFs

   };

   /**************     State Variables                              ************************************************/

	
    /**************  Exported Functions Definition 		    ************************************************/            


/** 
 *  TODO please, fill me  
 *
 *  @param file     ???   
 *  @param currentProject   ???                   
 *
 *  @returns ???
 *	      
 */
function createFileLoadFunction(file, currentProject) {
            return function (cb) {
                var fr = new FileReader();
                fr.onload = function (event) {
		    var a = event.target.result;
                    currentProject.addSpecFile(file.name, event.target.result);
                    cb();
                };
                fr.readAsText(file);
            };
}

/** 
 *  Delete file, which is passed as parameter, from the project  
 *
 *  @param {string} fileName        -  name of the file which has to be deleted 
 *  @param ws                       -  reference to webSocket
 *
 *  @returns void 
 *	      
 */
function deleteFileFs(fileName, ws)
{

	ws.send({type: "deleteFile", file_name: fileName}, function (err, res) {
		console.log("DELETE FILE, err, res ", err, res );
	
	});

	console.log(fileName + " deleted ");


}

    /**************  Utility Functions private to the module    ************************************************/  
	



});
