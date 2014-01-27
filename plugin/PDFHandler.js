/**
 * 
 * @author Enrico D'Urso
 * @date 27/01/14 11:26:11 AM
 */


/**
     * @fileOverview Module that handles the Emulink PDF Report Server-Side
     * @version 0.3
     */


/**
     * 
     * @module PDFHandler (Server-Side)
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, require, module, process */


module.exports = function () {
    "use strict";

    var fs           = require('fs'),
        PDFDocument  = require ("pdfkit"),
        util         = require("util"),
        o            = {};
        
    /** 
     *  This function is called to create a PDF, 
     *  @param token - An Object which has xmlSvg and contentFiles properties
     *  @returns integer - 0 if the creation has been ok, else -1 
     *        
    */
    o.createPDF = function(token, path, callback)
    {   

        if( !fs.existsSync(path)) { fs.mkdirSync(path); }               
        /*Getting number of property, that is number of files */
        var numberFiles = Object.keys(token.contentFiles).length;
        /*New PDF Document */
        var doc = new PDFDocument;
        var arrayNameFile = new Array();
        for( var nameFile in token.contentFiles )
             arrayNameFile.push(nameFile);

        startCreationPDF(token, numberFiles, arrayNameFile, 0, path, callback);    
    }; 
    function startCreationPDF(token, numberFiles, arrayNameFile, counter, path, callback, doc) 
    {
        if(! doc) 
        {  /* doc is undefined at the beginning */
           doc = new PDFDocument;
           doc.info['Title'] = 'Emulink PDF Report';
           doc.info['Author'] = 'PVSIO-Web ';
           doc.fontSize(55).fill('red');
           doc.font('Times-Roman')
               .text('Emulink PDF Report',{align: 'center'}).stroke();
           doc.moveDown().moveDown();
           doc.fontSize(12);
           
        }
        var nameFile = arrayNameFile[counter++]; /*Getting name of the file to process */
        var xmlString = token.xmlSvg[nameFile];  /*Getting svg-xml if it exists */ 
        var fileContent = token.contentFiles[nameFile]; /*Getting content of the file, it should always be present */
 
        if( xmlString) 
        {  /* Processing case where the SVG diagram is present */

            var nameSVGPicture = path + nameFile + ".svg";
            fs.writeFile(nameSVGPicture, xmlString, function(err) {
                if( !err) 
                {
                    /* Converting tmp svg file in png file using batik (apache plugin) */
                    var namePNGPicture = path + nameFile + ".png";  
                    //var path = "/home/edge7/Scrivania/Tesi/EmulinkNew/pvsio-web/tmp/" + nameFile + ".svg";
                    var spawn = require('child_process').spawn,
                    svgToPng  = spawn('java', ['-jar', './batik/batik-rasterizer.jar', nameSVGPicture, '-d', namePNGPicture]);

                    /* On error event listener */
                    svgToPng.stderr.on('data', function (data) {
                           util.log("Error svgToPng: " + data);
                           callback(-1);
                    });
                    /* On close event listener */
                    svgToPng.on('close', function (code) {  
                          util.log("SVG CLOSE CODE " + code)
                          fs.unlink(nameSVGPicture);                        
                          doc.addPage(); /* Adding page to PDF */
                          doc.fontSize(18).fill('blue');
                          doc.image(namePNGPicture, 40, 40, {fit: [500, 500]}).rect(40, 40, 500, 500).stroke().
                                   text("StateCharts Diagram: " + nameFile, 0, 15); /*Adding png image */
                          doc.addPage();
                          doc.fontSize(18).fill('blue').text("PVS code for " + nameFile, {align: 'center'});
                          doc.moveDown();
                          doc.fontSize(12).fill('black').text(fileContent); /* Adding file content */
                          fs.unlink(namePNGPicture);
                          /* If this is the last file, just create pdf */
                          if( counter === numberFiles)
                          {   doc.write(path + 'out.pdf', function fn() { callback(0);});
                              return;
                          }
                         else /* else, recursive call */
                            return startCreationPDF(token, numberFiles, arrayNameFile, counter, path, callback, doc)
                    });
                }    
                else
                {
                    callback(-1);
                }
            }); //End fs.writeFile
       } // END if(xmlString)

        else {  /* Here if there is no diagram to add in the PDF */
                 doc.addPage();
                 doc.fontSize(18).fill('red');
                 doc.text("PVS code: " + nameFile, {align: 'center'});
                 doc.moveDown();
                 doc.text(fileContent);
                 if( counter === numberFiles) 
                 {   doc.write(path + 'out.pdf', function fn() { callback(0);});
                     return;
                 }
                 else
                   return startCreationPDF(token, numberFiles, arrayNameFile, counter, path, callback, doc);
             }


    } /* End Function */

    return o;
};

