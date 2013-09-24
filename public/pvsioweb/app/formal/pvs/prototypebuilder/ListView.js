/**
 * Simple list viewer
 * @author Patrick Oladimeji
 * @date 9/19/13 10:30:29 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var eventDispatcher = require("util/eventDispatcher");
    var property        = require("util/property"),
        d3              = require("d3/d3");
    
    function ListView(elementId, data, labelFunction, classFunction) {
        var o = eventDispatcher({});
        o.selectedIndex = property.call(o, -1);
        o.selectedItem = property.call(o);
        //define simple string based label function if none was given
        labelFunction = labelFunction || function (d) {
            return d.toString();
        };
        //define simple css classing function if none was given
        classFunction = classFunction || function (d, i) {
            var odd_even = i % 2 === 0 ? "even" : "odd";
            return "listItem " + "listItem" + i + " "  + odd_even;
        };
        //create elements
        var listBox = d3.select(elementId).html("").append("ul");
        var listItems = listBox.selectAll("li").data(data).enter()
            .append("li");
        listItems.append("span").attr("class", "list-icon list-icon-main");
        listItems.append("span").attr("class", "list-icon list-icon-dirty");
        listItems.append("span").attr("class", "file-label").html(labelFunction);
       
        
        
        function renderSelectedItem(index, el) {
            listItems.classed("selected", false);
            el.classed("selected", true);
        }
        
        //add listener for selection events
        listItems.on("click", function (d, i) {
            //only update the selected item if a different list item was selected
            if (o.selectedIndex() !== i) {
                renderSelectedItem(i, d3.select(this));
                var event = {type: "SelectedIndexChanged", selectedIndex: i,
                             oldSelectedIndex: o.selectedIndex(), selectedItem: d,
                             selectedItemString: labelFunction(d)};
                o.fire(event);
                o.selectedIndex(i);//update selected index
                o.selectedItem(d);//and selected item
            }
        });
        
        o.updateView = function () {
            //update the class information on all list itmes
            listItems.attr("class", classFunction);
            if (o.selectedItem()) {
                renderSelectedItem(o.selectedIndex(), d3.select(listItems[0][o.selectedIndex()]));
            }
            return o;
        };
        
        o.updateView();
        
        return o;
    }
    
    module.exports = ListView;
    
});
