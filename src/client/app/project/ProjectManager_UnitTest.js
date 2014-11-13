/** @module ProjectManager_UnitTest */
/**
 * ProjectManager_UnitTest is a test module for ProjectManager
 * @author Paolo Masci
 * @date 13/11/14 4:09:12 PM
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/
define(function (require, exports, module) {
    "use strict";
    
    var ProjectManager		= require("project/ProjectManager");
    var pm;
    
    var projectChangedEvents;
    /**
	 * Constructor
	 */
    function ProjectManager_UnitTest(projectManager) {
        pm = projectManager;
        projectChangedEvents = 0;
        pm.addListener("ProjectChanged", function (event) {
            projectChangedEvents++;
        });
        return this;
    }
    
    ProjectManager_UnitTest.prototype.unitTest = function () {
        var success = 0, fail = 0, tot = 0;
        var txt, data;
        var summary = "\n------ Unit test for ProjectManager -------------------";

        // test 1
        data = {
            projectName: "test3",
            prototypeImage: null,
            pvsSpec: null
        };
        txt = "createProject(" + JSON.stringify(data, null, 2) + ")";
        summary += "\n\nTest " + (++tot) + ": '" + txt + "'";
        try {
            pm.createProject({
                projectName: "test1",
                prototypeImage: null,
                pvsSpec: null
            }, function cb(err, res) {
                console.log(err);
                console.log(res);
            });
        } catch (e1) {
            console.log(e1);
        } finally {
            if (projectChangedEvents === 1) {
                success++;
                summary += "[ok]";
            } else {
                fail++;
                summary += "[FAIL]";
            }
            projectChangedEvents = 0;
        }
        
        // test 2
        data = {
            projectName: "test3",
            prototypeImage: [],
            pvsSpec: []
        };
        txt = "createProject(" + JSON.stringify(data, null, 2) + ")";
        summary += "\n\nTest " + (++tot) + ": '" + txt + "'";
        try {
            pm.createProject({
                projectName: "test2",
                prototypeImage: [],
                pvsSpec: []
            }, function cb(err, res) {
                console.log(err);
                console.log(res);
            });
        } catch (e2) {
            console.log(e2);
        } finally {
            if (projectChangedEvents === 1) {
                success++;
                summary += "[ok]";
            } else {
                fail++;
                summary += "[FAIL]";
            }
            projectChangedEvents = 0;
        }

        // test 3
        data = {
            projectName: "test3",
            prototypeImage: [
                { webkitRelativePath : "",
                    lastModified: 1415725630000,
                    lastModifiedDate: "2014-11-11T17:07:10.000Z",
                    name: "image.jpg",
                    type: "image/jpeg",
                    size: 112933 }
            ],
            pvsSpec: [
                { webkitRelativePath: "",
                    lastModified: 1415725630000,
                    lastModifiedDate: "2014-11-11T17:07:10.000Z",
                    name: "alarisGP.pvs",
                    type: "",
                    size: 6585 }
            ]
        };
        
        txt = "createProject(" + JSON.stringify(data, null, 2) + ")";
        summary += "\n\nTest " + (++tot) + ": '" + txt + "'";
        try {
            pm.createProject(data, function cb(err, res) {
                console.log(err);
                console.log(res);
            }).then(function f(err, res) {
                console.log(err);
                console.log(err);
            });
        } catch (e3) {
            console.log(e3);
        } finally {
            if (projectChangedEvents === 1) {
                success++;
                summary += "[ok]";
            } else {
                fail++;
                summary += "[FAIL]";
            }
            projectChangedEvents = 0;
        }
        
        summary += "\n\n--------------------------------------------------------";
        summary += "\n Success: " + success + "/" + tot;
        summary += "\n Fail   : " + fail + "/" + tot;
        summary += "\n--------------------------------------------------------\n";
        return summary;
    };
   
    module.exports = ProjectManager_UnitTest;
});