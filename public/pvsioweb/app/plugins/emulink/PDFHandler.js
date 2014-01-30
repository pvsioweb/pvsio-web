/**
 * 
 * @author Enrico D'Urso
 * @date 27/01/14 10:46:11 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */



/**
     * @fileOverview Module that handles the Emulink PDF Report Client-Side
     * @version 0.3
     */


/**
     * 
     * @module PDFHandler (Client-Side)
 */

 define(function (require, exports, module) {
	"use strict";
    
    
    /**************     State Variables                         ****************************************************/
   
    /**************  Exported Functions Definition               *****************************************************/
        
    /** 
     *  This function is called to init. PDF creation task
     *  @param currentProject  - Current Project reference  
     *  @param stateMachine - State Machine module  reference
     *  @param ws	- WebSocket Reference 
     *  @returns void 
     *	      
    */
   function toPDF(currentProject, stateMachine, ws)
   {
   		var xmlSvg = stateMachine.getXMLSVG();
        var contentFileArray = currentProject.pvsFiles();
        if( contentFileArray.length == 0 && xmlSvg === null )
        {
        	alert("PDF creation has been aborted, content would be empty");
        	return;
        }
        var filesObject = {};
        contentFileArray.forEach(function(currentFile)
        {
            filesObject[currentFile.name()] = currentFile.content();
        });
        ws.send({type: "toPDF", xmlSvg: xmlSvg, contentFiles: filesObject}, function (err, res) 
        {
              if( err)
              {
                  console.log('ERR: ', err);
                  alert(err);
                  return;
              }
              var downloadButton = document.getElementById('downloadPDF');
              downloadButton.href = res.path;
              console.log('PDF READY');
              downloadButton.click();  
        });
        console.log("Request PDF Sent to Server")

    }
     
        
     /**************  Utility Functions private to the module    ******************************************************/ 
    
        
        
        module.exports = {
                        toPDF: toPDF

   };




});

