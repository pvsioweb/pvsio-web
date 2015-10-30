/**
 *
 * @author Paolo Masci
 * @date 30/10/15
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, d3*/
define(function (require, exports, module) {
    "use strict";
    
    function ExportDiagram() {
        return this;
    }
    
    function getBoundingBox(diagram) {
        var states = diagram.emuchartsManager.getStates();
        var minX = (states.length > 0) ? Math.min.apply(Math, states.map(function (data) { return data.x; })) : 0;
        var minY = (states.length > 0) ? Math.min.apply(Math, states.map(function (data) { return data.y; })) : 0;
        var maxX = (states.length > 0) ? Math.max.apply(Math, states.map(function (data) { return data.x; })) : 0;
        var maxY = (states.length > 0) ? Math.max.apply(Math, states.map(function (data) { return data.y; })) : 0;
        return {
            minX: (minX < 0) ? -minX : minX,
            maxX: (maxX < 0) ? -maxX : maxX,
            minY: (minY < 0) ? -minY : minY,
            maxY: (maxY < 0) ? -maxY : maxY
        };
    }
    
    function getImageSize(diagram, offset) {
        offset = offset || { x: 0, y: 0};
        var boundingBox = getBoundingBox(diagram);
        return {
            width: (boundingBox.minX + boundingBox.maxX + offset.x) * 1.2,
            height: (boundingBox.minY + boundingBox.maxY + offset.y) * 1.2
        };
    }
    
    function centerDiagram(diagram, offset) {
        offset = offset || { x: 0, y: 0};
        var boundingBox = getBoundingBox(diagram);
        var minBoxSize = { x: 200, y: 0 };
        var translate = [ boundingBox.minX + minBoxSize.x + offset.x, boundingBox.minY + minBoxSize.y + offset.y];
        diagram.svg.selectAll("#InitialTransitions").attr("transform", "translate(" + translate.join(",") + ")");
        diagram.svg.selectAll("#Transitions").attr("transform", "translate(" + translate.join(",") + ")");
        diagram.svg.selectAll("#States").attr("transform", "translate(" + translate.join(",") + ")");
    }
    
    function getImageData(diagram) {
        var SVGContent = (new window.XMLSerializer()).serializeToString(diagram.svg.node());
        // this workaround is needed to define the xlink namespace
        // d3 for some reason does not allow to define it but we need it to export the svg as an image
        SVGContent = SVGContent.replace("xmlns=\"http://www.w3.org/2000/svg\"",
                                        "xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"");
        return "data:image/svg+xml;base64," + window.btoa(SVGContent);
    }
    
//    function appendContextTable(diagram) {
//        diagram.svg.append("foreignObject")
//                    .attr("x", 10).attr("y", 10).attr("width", 100).attr("height", 100)
//                    .attr("requiredExtension", "http://www.w3.org/1999/xhtml")
//                    .append("div").attr("xmlns", "http://www.w3.org/1999/xhtml")
//                    .html(diagram.emuchartsManager.getVariables()
//                          .map(function (v) {
//                            return v.name + ", " + v.type + ", " + v.value + "<br/>";
//                            }));
//        return { width: 0, height: 0 };
//    }
    
    ExportDiagram.prototype.toVectorialImage = function(_emuchartsManager) {
        var diagram = {
            svg: d3.select("#ContainerStateMachine").select("svg").node().cloneNode(true),
            emuchartsManager: _emuchartsManager
        };
        
        diagram.svg = d3.select(diagram.svg).attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .style("background", "#ffffff");

//        var tableSize = appendContextTable(diagram);
        centerDiagram(diagram);
        var imageSize = getImageSize(diagram);
        diagram.svg.attr("width", imageSize.width + "px").attr("height", imageSize.height + "px");
        
        var imgsrc = getImageData(diagram);
        d3.select("#toolbarViewExportedImage").select("a").attr("href", imgsrc).on("click", function() {
            document.getElementById("toolbarViewExportedImage").setAttribute("style", "display:none");
        });
        d3.select("#toolbarViewExportedImage").style("display", "block");
        return this;
    };
    
    ExportDiagram.prototype.toPNG = function() {
//            var img = '<img src="' + imgsrc + '">';
//            d3.select("#svgdataurl").html(img).style("display", "block");
//            var canvas = document.querySelector("canvas");
//            var context = canvas.getContext("2d");
//            var image = new Image();
//
//            // restore background colour
//            d3.select("#ContainerStateMachine").select("svg").style("background", "white");
//            
//            // append Context table
//            d3.select("#ContainerStateMachine").select("svg").append("foreignObject")
//                .attr("x", 10).attr("y", 10).attr("width", 100).attr("height", 100)
//                .attr("requiredExtension", "http://www.w3.org/1999/xhtml")
//                .append("body").attr("xmlns", "http://www.w3.org/1999/xhtml")
//                .append("table").html(d3.select("#StateAttributes").select("table").node().innerHTML);
//
//            function imageLoadError(res) {
//                displayNotification("Failed to export chart");
//            }
//            function imageLoadComplete(res) {
//                context.drawImage(image, 0, 0);
//                //-- this solution with download element is not good enough because only chrome supports this feature
//                //var canvasdata = canvas.toDataURL("image/png");
//                //var pngimg = '<img src="' + canvasdata + '">';
//                //var a = d3.select("#pngdataurl");
//                //a.node().download = projectManager.project().name() + "_emuChart.png";
//                //a.node().href = canvasdata;
//                //a.node().click();
//                //-- this solution with window.open is not good enough because of pop-up blockers
//                //window.open(canvasdata);
//            }
//
//            image.onload = imageLoadComplete;
//            image.onerror = imageLoadError;
//            image.src = imgsrc;
        return this;
    };
    
    module.exports = ExportDiagram;
});
