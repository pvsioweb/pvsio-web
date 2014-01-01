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
        
        this.defaultPosX = 100;
        this.defaultPosY = 100;
        
        
        this.listOfNodes = new Array();
        this.listOfEdges = new Array();
        this.listOfFunctions = {};        
        
        this.startParsing = function()
        {
            var content;
            var initialTag;
            var finalTag;
            var kindOfTag;
            var Range = require("ace/range").Range;
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
                                 range : null
				        
                               };
            this.editor.moveCursorTo(0, 0);
            var currentTag = this.editor.find(objectSearch);
            var currentTagEnd = this.editor.find(objectSearchEnd);
            
            while( currentTag != undefined )
            {            
                /* Get the entire line */
                initialTag = this.editor.session.getTextRange(new Range(currentTag.start.row, 0, 
                                                                        currentTag.start.row, 1000)).replace(/(\r\n|\n|\r)/gm,"");                
                /* Transform start Tag into end Tag */
                finalTag = initialTag.replace("BlockStart", "BlockEnd");
                
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
                
                initialTag.indexOf(this.kindOfTag);
                /*Getting which kind of tag is */
                kindOfTag = initialTag.substring(initialTag.indexOf(this.kindOfTag) + this.lengthKindOfTag, initialTag.indexOf('}'));
               
                this.dispatcher(content, kindOfTag);
                
                /* Updating search range */
                objectSearch.range = new Range(currentTagEnd.end.row, 0, lengthDocument, 1000);
                currentTag = this.editor.find(objectSearch);
            }
            
            this.createEdge();
            
        }
        
        this.dispatcher = function(content, kindOfTag)
        {
               kindOfTag = kindOfTag.replace(/\s+/g, "").replace(/\"/g, "");
               if( kindOfTag === "Nodes" )
               {   
                   this.parseNodes(content);
                   return;
               }            
               if( kindOfTag === "Edge" )
               {
                   this.parseEdge(content);
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
        this.parseEdge = function(content)
        {
            var nameEdge = content.substring(0, content.indexOf('(')).replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g,"");
            var condition = content.indexOf('BlockStart');
            var tagProcessing ;
            var source, target;
            this.listOfEdges.push(new Array());
            var array = this.listOfEdges[this.listOfEdges.length -1];
            array.push(nameEdge);
            while( condition != -1 )
            {
                /*Getting entire tag */
                tagProcessing = content.substring(content.indexOf('BlockStart'));
                tagProcessing = tagProcessing.substring(0,  tagProcessing.indexOf('}'));
                content = content.substring(content.indexOf('BlockStart') + 5);
                condition = content.indexOf('BlockStart');
                
                source = tagProcessing.substring(tagProcessing.indexOf(this.source) + this.lengthSource);
                source = source.substring(0, source.indexOf(','));
                source = source.replace(/\"/g, "").replace(/\s+/g,"");
                                                 
                target = tagProcessing.substring(tagProcessing.indexOf(this.target) + this.lengthTarget);
                target = target.substring(0, target.indexOf(',')); 
                target = target.replace(/\"/g, "").replace(/\s+/g,"");    
      
                array.push(source);
                array.push(target);
                
            }
            
        }
        this.createEdge = function()
        {   
            var currentEdge ;
            for( var i = 0; i < this.listOfEdges.length; i++ )
            {
                 currentEdge = this.listOfEdges[i];
                 for( var j = 1; j < currentEdge.length; j = j + 2)
                 {
                      this.drawer.add_edge(this.findCorrispondentNode(currentEdge[j]), this.findCorrispondentNode(currentEdge[j +1]), 
                                           currentEdge[0], 1);   
                     
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
        
    }
    
    
    
    module.exports = {
                        init : init

   };




});
