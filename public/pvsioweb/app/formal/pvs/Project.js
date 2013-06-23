/**
 * Represents a pvsio web project
 * @author Patrick Oladimeji
 * @date 6/20/13 9:45:59 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var property            = require("util/property"),
        eventDispatcher     = require("util/eventDispatcher");
    
    var propertyChangedEvent = "PropertyChanged";
    
    function ProjectFile() {
        ProjectFile.dirty = property.call(ProjectFile, true);
        ProjectFile.type = property.call(ProjectFile, "text");
        ProjectFile.content = property.call(ProjectFile);
        ProjectFile.name = property.call(ProjectFile);
        
        return eventDispatcher(ProjectFile);
    }
    
    function Project(name) {
        var _dirty = false;
        Project.path = property.call(Project);
        Project.name = property.call(Project, name);
        Project.mainPVSFile = property.call(Project);
        Project.widgetDefinitions = property.call(Project);
        Project.image = property.call(Project);
        Project.pvsFiles = property.call(Project);
        
        //add event listeners
        Project.name.addListener(propertyChangedEvent, function (event) {
            _dirty = true;
            Project.fire({type: "ProjectNameChanged", previous: event.old, current: event.fresh});
        });
        
        Project.mainPVSFile.addListener(propertyChangedEvent, function (event) {
            _dirty = true;
            Project.fire({type: "ProjectMainSpecFileChanged", previous: event.old, current: event.fresh});
        });
        
        Project.image.addListener(propertyChangedEvent, function (event) {
            _dirty = true;
            Project.fire({type: "ProjectImageChanged", previous: event.old, current: event.fresh});
        });
        
        Project.widgetDefinitions.addListener(propertyChangedEvent, function (event) {
            _dirty = true;
            Project.fire({type: "WidgetDefinitionChanged", previous: event.old, current: event.fresh});
        });
        
        Project.save = function () {
            _dirty = false;
            //do save
            
        };
        
        Project.open = function (name) {
        
        };
        
        return eventDispatcher(Project);
    }
    
   
    
    module.exports = Project;
    
});