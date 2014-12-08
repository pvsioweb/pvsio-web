/**
 * Plugin to automatically save projects every x minutes
 * @author Patrick Oladimeji
 * @date 12/8/14 10:51:56 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, require, brackets, window */
define(function (require, exports, module) {
    "use strict";
    var instance, saveTimer, countdownTimer;
    var ProjectManager = require("project/ProjectManager"),
        Timer   = require("util/Timer");
    
    var saveInterval = 2 * 60 * 1000;
    
    function ProjectAutoSaver() {
        saveTimer = new Timer(saveInterval);
        countdownTimer = new Timer(1000);
    }
    
    function toTimeString(t) {
        var minutes = Math.floor(t / 60);
        var secs = t - (minutes * 60);
        if (minutes) {
            if (secs) {
                return minutes + "m " + secs + "s";
            } else {
                return minutes + "m";
            }
        } else {
            return secs + "s";
        }
    }
    
    function reset() {
        saveTimer.reset().start();
        countdownTimer.reset().start();
    }
    
    ProjectAutoSaver.prototype.initialise = function () {
        ProjectManager.getInstance().addListener("ProjectSaved", function (e) {
            reset();
        }).addListener("ProjectChanged", function (e) {
            reset();
        });
        saveTimer.addListener("TimerTicked", function (e) {
            saveTimer.stop();
            countdownTimer.reset();
            d3.select("#autoSaver").html("Saving ...");
            ProjectManager.getInstance().project().save(function (err) {
                saveTimer.reset().start();
                countdownTimer.start();
            });
        }).start();
        countdownTimer.addListener("TimerTicked", function (e) {
            var timeToNextSave = saveInterval - (e.currentCount * 1000);
            timeToNextSave /= 1000;
            var time = toTimeString(timeToNextSave);
            d3.select("#autoSaver").html("Project will auto-save in " + time);
        }).start();
    };
    
    ProjectAutoSaver.prototype.unload = function () {
        saveTimer.reset();
        countdownTimer.reset();
        d3.select("#autoSaver").html("");
    };
    
    ProjectAutoSaver.prototype.getDependencies = function () {
        return [];
    };
    
    module.exports = {
        getInstance: function () {
            instance = instance || new ProjectAutoSaver();
            return instance;
        }
    };
});
