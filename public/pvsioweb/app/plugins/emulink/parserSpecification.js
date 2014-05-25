/**
 * 
 * @author Enrico D'Urso
 * @date 12/3/13 11:35:50 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */



/**
     * @fileOverview Utility functions to translate from  a specification to a diagram .
     * @version 0.1
     */


/**
     * 
     * @module parserSpecification
 */


define(function (require, exports, module) {
	"use strict";
    
    /**************     State Variables                           ****************************************************/
    var drawer;
    var editor;
    var parser;
    var tagStateNameStart = "  %{\"_block\" : \"BlockStart\", \"_id\" : \"StateName\", \"_type\" : \"Nodes\"}";    
    var tagStateNameEnd = "  %{\"_block\" : \"BlockEnd\", \"_id\" : \"StateName\", \"_type\" : \"Nodes\"}";
    
    var tagStateStart = "  %{\"_block\" : \"BlockStart\", \"_id\" : \"State\", \"_type\": \"State\"}"; 
    var tagStateEnd = "  %{\"_block\" : \"BlockEnd\", \"_id\" : \"State\", \"_type\": \"State\"}";
    
    var tagFuncStart = "  %{\"_block\" : \"BlockStart\", \"_id\" : \"*nameFunc*\", \"_type\": \"Function\"}";
    var tagFuncEnd = "  %{\"_block\" : \"BlockEnd\", \"_id\" : \"*nameFunc*\", \"_type\": \"Function\"}";
    
    var tagPerStart = "  %{\"_block\": \"BlockStart\" , \"_id\" : \"*namePer*\", \"_type\": \"Permission\"}";
    var tagPerEnd = "  %{\"_block\": \"BlockEnd\" , \"_id\" : \"*namePer*\", \"_type\": \"Permission\"}";
    
    var tagEdgeStart = "  %{\"_block\": \"BlockStart\" , \"_id\" : \"*nameEdge*\", \"_type\": \"Edge\"}";
    var tagEdgeEnd = "  %{\"_block\": \"BlockEnd\" , \"_id\" : \"*nameEdge*\", \"_type\": \"Edge\"}";
    
    var tagCondStart = "  %{\"_block\": \"BlockStart\", \"_id\" : \"*nameCond*\", \"_source\" : *SRC*, \"_target\" : *TRT*, \"_type\": \"Transition\"}";    
    var tagCondEnd = "  %{\"_block\": \"BlockEnd\", \"_id\" : \"*nameCond*\", \"_source\" : *SRC*, \"_target\" : *TRT*, \"_type\": \"Transition\"}";

    var begin ;
    var end;
    /**************  Exported Functions Definition               *****************************************************/
    
    /** 
     *  This function is called when the user wants to create a diagram starting from a specification written in the editor 
     *  @param editor_  - editor where the specification is written  
     *  @param sm       - drawer module where the diagram will be drawn        
     *  @returns void 
     *	      
    */
    function init(editor_, sm, curProj, ws, pm, selectedFileChanged)
    {
        editor = editor_;
        drawer = sm;
        drawer.init(editor, ws, curProj, pm, false, selectedFileChanged);
        parser = new Parser(editor_, sm);
        parser.startParsing();
        drawer.emulink();
    }
    
    /**************  Utility Functions private to the module    ******************************************************/    
    
    function Parser(editor, sm)
    {
        this.editor = editor;
        this.drawer = sm;
        
        this.tagStart = ": \"BlockStart\"";
        this.tagEnd = "BlockEnd";
        
        this.source = "\"_source\" : ";
        this.lengthSource = this.source.length;
        
        this.target ="\"_target\" : ";
        this.lengthTarget = this.target.length;
        
        this.kindOfTag = "\"_type\":";
        this.lengthKindOfTag = this.kindOfTag.length;
        
        this.switchCond = "_switchCond";
        this.lengthSwitchCond = this.switchCond.length;

        this.sourceTag = "_source";
        this.targetTag = "_target";
        this.typeTag = "_type";
        this.idTag = "_id";
        this.transActTag = "_transAct";


        this.defaultPosX = 100;
        this.defaultPosY = 100;
        
        
        this.listOfNodes = new Array();
        this.listOfEdges = new Array();
        this.listOfFunctions = {}; 

        this.switchCondObject = {};
        this.transActionObject = {};
       
        this.transformKeyAndValueAvoidingSpaces = function(objectBlock)
        {
            var newObjectWithoutSpaces = {};
            for( var key in objectBlock)
            {    var value = objectBlock[key];
                 key = key.replace(/\s+/g, "");
                 if( typeof value === "string" )
                     newObjectWithoutSpaces[key] = value.replace(/\s+/g, "");
                 else
                     newObjectWithoutSpaces[key] = value;
            };
            return newObjectWithoutSpaces;

        }
        //FIXME: this function will have an undefined behaviour since we are no longer using ace
        this.startParsing = function()
        {   begin= new Date().getMilliseconds();
            var content;
            var initialTag;
            var finalTag;
            var kindOfTag;
           // var Range = require("ace/range").Range;
            var lengthDocument = this.editor.session.getLength();
            var objectSearch = { 
                                 needle: this.tagStart,
                                 wrap:true,
                                 wholeWord: false,
                                 range : null
				        
                               };
            var objectSearchEnd = { 
                                 needle: this.tagEnd,
                                 wrap: true,
                                 wholeWord: false,
                                 range : null,
                                 regExp: true
				        
                               };
            this.editor.moveCursorTo(0, 0);
            var currentTag = this.editor.find(objectSearch);
            var currentTagEnd = this.editor.find(objectSearchEnd);
            finalTag = this.tagEnd;


            while( currentTag != undefined )
            {            
                /* Get the entire line */
                initialTag = this.editor.session.getTextRange(new Range(currentTag.start.row, 0, 
                                                                        currentTag.start.row, 1000)).replace(/(\r\n|\n|\r)/gm,"");     
                var stringJson = initialTag.substring(initialTag.indexOf('{') );
                var objectBlock = JSON.parse(stringJson);   
                objectBlock = this.transformKeyAndValueAvoidingSpaces(objectBlock);        
                /* Transform start Tag into end Tag */
                finalTag = this.getFinalTagFromStartOne(initialTag);
                objectSearchEnd.needle = finalTag;
                objectSearchEnd.range = new Range(currentTag.start.row, 0, lengthDocument, 100);
                /* getting end tag from the content */
                currentTagEnd = this.editor.find(objectSearchEnd);
                
                /*Getting content between tags  */
                content = this.editor.session.getTextRange(new Range(currentTag.start.row +1, 0, currentTagEnd.start.row -1, 1000));
                
                if( content === undefined )
                {
                    console.log("unexpected Error in Parsing, aborting...");
                    return false;
                }
                
                
                /* In this new version we can safely get the kind of tag using _type property, simple! */
                kindOfTag = objectBlock[this.typeTag];

                this.dispatcher(content, kindOfTag, objectBlock[this.idTag]);
                
                /* Updating search range */
                objectSearch.range = new Range(currentTagEnd.end.row, 0, lengthDocument, 1000);
                currentTag = this.editor.find(objectSearch);
            }
            
            this.createEdge();

            end  = new Date().getMilliseconds();
            var diff = end - begin;
            console.log("\n******* " + diff + " *******\n" );
            
        }
        
        this.dispatcher = function(content, kindOfTag, id)
        {
               
               if( kindOfTag === "Nodes" )
               {   
                   this.parseNodes(content);
                   return;
               }            
               if( kindOfTag === "Edge" )
               {
                   this.parseEdge(content, id);
                   return;
               }            
        }
        
        this.parseNodes = function(content)
        {
            var tmp = content.substring(content.indexOf('{') +1, content.indexOf('}'));
            if( tmp == "" )
            {
                console.log("No nodes Found");
                return;
            }
            var listNodes = tmp.split(',');
            var length = listNodes.length;
            
            for( var i = 0; i<length; i++ )
            {
                 listNodes[i] = listNodes[i].replace(/\s+/g,"");
				 // FIXME: avoid magic numbers!
                 this.listOfNodes.push(drawer.add_node(Math.random() * 800, Math.random() * 800, listNodes[i], 1));
  
            }
            
        }
        this.parseEdge = function(content, nameOfEdge)
        {
            var nameEdge = nameOfEdge;
            var condition = content.indexOf('BlockStart');
            var tagProcessing ;
            var source, target;
            this.listOfEdges.push(new Array());
            var array = this.listOfEdges[this.listOfEdges.length -1];
            array.push(nameEdge);
            while( condition != -1 ) //Getting and processing each condition inside transition
            {
                /*Getting entire tag */
                tagProcessing = content.substring(content.indexOf("BlockStart"));
                tagProcessing = tagProcessing.substring(0,  tagProcessing.indexOf('\n'));
                tagProcessing = tagProcessing.substring(tagProcessing.indexOf("_id"));
                tagProcessing = "{\"" + tagProcessing; // Formatting in JSON String

                var objectBlock;
                try 
                {
                    objectBlock = JSON.parse(tagProcessing);

                }   
                catch(error)
                {
                    console.log("Error in ParseEdge\n" + error );
                    alert("Error in ParseEdge\n" + error);
                    alert("Please write to e.durso7@gmail.com about this error");
                    return;
                }
                objectBlock = this.transformKeyAndValueAvoidingSpaces(objectBlock); 

                
                content = content.substring(content.indexOf('BlockStart') + 5);
                condition = content.indexOf('BlockStart');
               
                source = objectBlock[this.sourceTag]; //Getting source of edge
                target = objectBlock[this.targetTag]; //Getting target of edge
                var allCond = objectBlock[this.switchCond];
                if( allCond ){ this.switchCondObject[nameEdge + "," + source + "," + target] = allCond; }

                var allTrans = objectBlock[this.transActTag];
                if( allTrans){ this.transActionObject[ nameEdge + "," + source + "," + target] = allTrans;}

                array.push(source);
                array.push(target);
                
            }
            
        }
        this.createEdge = function()
        {   
            var currentEdge ;
            var nameSource, nameTarget, nameEdge;
            for( var i = 0; i < this.listOfEdges.length; i++ )
            {
                 currentEdge = this.listOfEdges[i];
                 for( var j = 1; j < currentEdge.length; j = j + 2)
                 {
                      var edgeJustInsert = this.drawer.add_edge((nameSource = this.findCorrispondentNode(currentEdge[j])), 
                                                                 (nameTarget = this.findCorrispondentNode(currentEdge[j +1])), 
                                           currentEdge[0], 1);   
                      nameSource = nameSource.name;
                      nameTarget = nameTarget.name;
                      nameEdge = currentEdge[0];
                      var listCond = this.switchCondObject[nameEdge + "," + nameSource + "," + nameTarget ];
                      if( listCond )
                      {   if( edgeJustInsert.listConditions === undefined )
                              edgeJustInsert.listConditions = new Array();
                          listCond.forEach(function (item ) {
                              edgeJustInsert.listConditions.push(item);
                          });
                      }
                      var listTransAct = this.transActionObject[nameEdge + "," + nameSource + "," + nameTarget ];
                      if( listTransAct )
                      {  if( edgeJustInsert.listOfOperations === undefined )
                              edgeJustInsert.listOfOperations = new Array();
                         listTransAct.forEach(function (item ) {
                              edgeJustInsert.listOfOperations.push(item);
                          });
                     
                      }
                }
            }
            
        }
        this.findCorrispondentNode = function(nameNode)
        {
            for( var i = 0; i < this.listOfNodes.length; i++ )
                 if( this.listOfNodes[i].name === nameNode )
                     return this.listOfNodes[i];
            
            console.log("ERROR: findCorrispondentNode");
        }
        this.getFinalTagFromStartOne = function(initTag)
        {   
            var spaceRegex = "[\\s]*";
            var separatorRegex = spaceRegex + "," + spaceRegex;
            var type, typeTransitionNeedle, id;
            
            if( initTag.indexOf("_type") == -1)
                return initTag.replace("BlockStart", "BlockEnd");
            
            type = initTag.substring(initTag.indexOf("_type") + 5); //  :  " Type " ...
            type = type.substring(type.indexOf(':') +1); //  " Type " ..
            type = type.substring(type.indexOf('"') +1); //  Type  " ..
            type = type.substring(0, type.indexOf('"')); // Type 
            type = type.replace(/\s+/g,""); //Type
            type = spaceRegex + type + spaceRegex;
            typeTransitionNeedle = "\"_type\""  + spaceRegex + ":" + spaceRegex + "\"" + type + "\"";

            id = initTag.substring(initTag.indexOf("_id") + 3); // :  " ID ",  "_type..
            id = id.substring(id.indexOf(':') +1, id.indexOf(',')); //   " ID "
            id = id.replace(/\"/g, "").replace(/\s+/g,""); //ID
            id = spaceRegex +  id + spaceRegex ;
            

            var blockEndNeedle   = "%{\"_block\"" + spaceRegex + ":" + spaceRegex + "\"BlockEnd\"";
            var idNeedle         = "\"_id\""    + spaceRegex + ":" + spaceRegex + "\"" + id + "\"";
            


            var needle  =  blockEndNeedle   + separatorRegex 
                           + idNeedle       + separatorRegex 
                           + typeTransitionNeedle;

            return needle;


        }
        
    }
    
    
    
    module.exports = {
                        init : init

   };




});
