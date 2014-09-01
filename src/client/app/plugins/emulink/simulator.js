/**
 * 
 * @author Enrico D'Urso
 * @date 12/11/13 14:38:10 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */



/**
     * @fileOverview Module that renders a simulation
     * @version 0.1
     */


/**
     * 
     * @module simulator
 */
 
 define(function (require, exports, module) {
	"use strict";
    
    
    /**************     State Variables                         ****************************************************/
    var drawer = require("plugins/emulink/stateMachine");
    var simulator;
    var simulationIsActive = false;
    /**************  Exported Functions Definition               *****************************************************/
        
    /** 
     *  This function is called to init. simulator module    
     *  @returns void 
     *	      
    */
    function init(ws) 
    {
       if( simulationIsActive)
       {   simulationIsActive = false;
           drawer.restoreColorNodesAndEdges();
           return simulationIsActive;
       }
       else
           simulationIsActive = true;
        
       if( ! simulator)
           simulator = new Simulator(ws);
        
       return simulationIsActive;
    }
     
        
     /**************  Utility Functions private to the module    ******************************************************/ 
    function prettyPrint(msg) 
    {
           return msg ? msg.toString().replace(/,,/g, ",") : msg;
    }
     
    function Simulator(ws)
    {
        this.ws = ws;
        this.currentState = "Ready"; //FIXME 
        this.newState = "";
        this.previousState = "";
        
        this.currentStateString = "current_state:=";
        this.previousStateString = "previous_state:=";

        
        this.setInitState = function(state)
        {
            this.currentState = state;
        }
        this.ws.addListener("pvsoutput", function (e) 
        {
            if( ! simulationIsActive)
                return;
            var response = prettyPrint(e.data);
            console.log("Simulator", response);
            var current_state = response.match(simulator.currentStateString+"(.*?)[, #]");
            var previous_state = response.match(simulator.previousStateString+"(.*?)[, #]");
            
            if( !previous_state || !current_state )
                return;

            simulator.previous_state = previous_state[1];
            simulator.newState = current_state[1];
            
            simulator.render();    
	    })
        
        this.render = function()
        {
            var arrayNode = new Array();
            arrayNode.push(this.currentState, this.previous_state, this.newState);
            drawer.highlightElements(arrayNode);
            this.currentState = this.newState;
        }
     }
        
        
        module.exports = {
                        init : init

   };




});

