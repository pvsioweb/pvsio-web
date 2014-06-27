/**
 * 
 * @author Patrick Oladimeji
 * @date 4/27/14 15:54:08 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3 */
define(function (require, exports, module) {
    "use strict";
    var data,
        el,
        listHeight = 28,
        childIndent = 10,
        duration = 200,
        contextMenuItems = ["New File", "New Folder", "Rename", "Delete"],
        selectedData;
    var globalId = 0;
    var eventDispatcher = require("util/eventDispatcher");
    
    /**
        Find the node with the give id
    */
    function find(f, root) {
        if (root) {
            if (f(root)) {
                return root;
            } else if (root.children && root.children.length) {
                var i, child, res;
                for (i = 0; i < root.children.length; i++) {
                    child = root.children[i];
                    res = find(f, root.children[i]);
                    //break out of loop if we have found it
                    if (res) {
                        return res;
                    }
                }
            }
        }
        return null;
    }
    
    function TreeList(d, _el) {
        eventDispatcher(this);
        var fst = this;
        data = d;
        el = _el || "body";
      
        this.render(data);
        
        function createMenu(menuItems, sourceEvent, selectedData) {
            var div = d3.select("body").append("div").attr("class", "contextmenu")
                .style("position", "absolute")
                .style("top", sourceEvent.pageY + "px")
                .style("left", sourceEvent.pageX + "px");
            var ul = div.append("ul").style("list-style", "none");
            
            var menus = ul.selectAll("li.menuitem").data(menuItems).enter()
                .append("li").attr("class", "menuitem")
                .html(String);
            
            menus.on("click", function (d) {
                //we want to rename or delete the actually selected data but we need to add items to the selected data
                //only if the selected item is a directory, if not a directory we want to add to the parent
                var data = ["Rename", "Delete"].indexOf(d) > -1 ? selectedData :
                            selectedData.isDirectory ? selectedData : selectedData.parent;
                var event = {type: d, data: data};
                console.log(event);
                fst.fire(event);
                div.remove();
            });
        }
        
        //create custom context menu for the list item
        d3.select(el).node().oncontextmenu = function (event) {
            event.preventDefault();
            d3.select("div.contextmenu").remove();
            createMenu(contextMenuItems, event, selectedData);
            return false;
        };
        //create event to clear any context menu items
        document.onclick = function () {
            d3.select("div.contextmenu").remove();
        };
    }
    
    TreeList.prototype.render =   function (parent, noAnimation) {
        var fst = this;
        
        function toggleChildren(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }
        
        var tree = d3.layout.treelist().childIndent(childIndent).nodeHeight(listHeight);
        var nodes = tree.nodes(data);
        var ul = d3.select(el).select("ul");
        if (ul.empty()) {
            ul = d3.select(el).append("ul");
        }
        ul.attr("class", "treelist").style("position", "relative")
            .style("list-style", "none");

        var nodeEls = ul.selectAll("li.node").data(nodes, function (d) {
            d.id = d.id || ++globalId;
            return d.id;
        });

        var enteredNodes = nodeEls.enter()
            .append("li")
            .style("position", "absolute")
            .style("top", parent.y + "px")
            .style("opacity", 0)
            .style("height", tree.nodeHeight() + "px")
            .on("click", function (d) {
//                toggleChildren(d);
//                fst.render(d);
                if (selectedData !== d) {
                    selectedData = d;
                    ul.selectAll("li.node").classed("selected", function (d) {
                        return selectedData === d;
                    });
                    var event = {type: "SelectedItemChanged", data: d};
                    // clear all editable flags
                    ul.selectAll("li.node").select(".label").attr("contentEditable", false);
                    console.log(event);
                    fst.fire(event);
                }
            });

        var listWrap = enteredNodes.append("div").classed("line", true);
        var updatedNodes = nodeEls, exitedNodes = nodeEls.exit();
        var chevron = listWrap.append("span").attr("class", function (d) {
            var icon = d.children ? " glyphicon-chevron-down"
                : d._children ? "glyphicon-chevron-right" : "";
            return "chevron glyphicon " + icon;
        });
        chevron.on("click", function (d) {
            toggleChildren(d);
            fst.render(d);
            if (selectedData !== d) {
                selectedData = d;
                ul.selectAll("li.node").classed("selected", function (d) {
                    return selectedData === d;
                });
                var event = {type: "SelectedItemChanged", data: d};
                // clear all editable flags
                ul.selectAll("li.node").select(".label").attr("contentEditable", false);
                console.log(event);
                fst.fire(event);
            }
        });

        
        //add icons for folder for file
        listWrap.append("span").attr("class", function (d) {
            var icon = d.isDirectory ? "glyphicon-folder-close"
                : "glyphicon-file";
            return "glyphicon " + icon;
        });
        //add text
        listWrap.append("span").attr("class", "label")
            .html(function (d) { return d.name; });

        //update chevron direction
        nodeEls.select("span.chevron").attr("class", function (d) {
            var icon = d.children ? " glyphicon-chevron-down"
                : d._children ? "glyphicon-chevron-right" : "";
            return "chevron glyphicon " + icon;
        });
        //update list class
        nodeEls.attr("class", function (d, i) {
            var c = i % 2 === 0 ? "node even" : "node odd";
            if (selectedData && d.path === selectedData.path) {
                c = c.concat(" selected");
            }
            return c;
        });

        if (!noAnimation) {
            updatedNodes = updatedNodes.transition().duration(duration);
        }
        updatedNodes.style("top", function (d) {
            return (d.y - tree.nodeHeight()) + "px";
        }).style("opacity", 1);
        updatedNodes.selectAll(".line").style("left", function (d) { return d.x + "px"; });
        //remove hidden nodes
        exitedNodes.remove();
    };
       
    TreeList.prototype.selectItem = function (path) {
        var fst = this;
        if (!selectedData || selectedData.path !== path) {
            var nodes = d3.select(el).selectAll(".node");
            nodes.classed("selected", function (d) {
                if (d.path === path) {
                    selectedData = d;
                    return true;
                } else {
                    return false;
                }
            });
            if (selectedData) {
                //fire selected item changed event
                fst.fire({type: "SelectedItemChanged", data: selectedData});

                setTimeout(function () {
                    d3.select(el).node().scrollTop = selectedData.y;
                }, duration);
            }
        }
    };
    
    /** 
     * given a selected node, this function selects the next in the hierarchy
     * FIXME: implement this function! now we just select the parent node
     */
    TreeList.prototype.selectNext = function (nodePath, index) {
        var fst = this;
        var nodes = d3.select(el).selectAll(".node");
        var parent = nodePath.substring(0, nodePath.lastIndexOf("/"));
        var path = parent;
        nodes.classed("selected", function (d) {
            if (d.path === path) {
                selectedData = d;
                return true;
            } else {
                return false;
            }
        });
        //fire selected item changed event
        fst.fire({type: "SelectedItemChanged", data: selectedData});

        setTimeout(function () {
            d3.select(el).node().scrollTop = selectedData.y;
        }, duration);
    };

    TreeList.prototype.markDirty = function (path, sign) {
        d3.select(el).selectAll(".node")
            .filter(function (d) {
                return d.path === path;
            }).classed("dirty", sign ? true : false);
    };
    
    /**
        adds the data to the parent
    */
    TreeList.prototype.addItem = function (item, parent) {
        parent = parent || selectedData || data;
        if (!parent.isDirectory) {
            parent = parent.parent;
        }
        parent.children = parent.children || parent._children || [];
        parent.children.push(item);
        this.render(parent);
        return item;
    };
    
    TreeList.prototype.removeItem = function (path) {
        var fst = this, toRemove = find(function (node) {
            return node.path === path;
        }, data);
        if (toRemove) {
            var index = toRemove.parent.children ? toRemove.parent.children.indexOf(toRemove) : -1;
            if (index > -1) {
                toRemove.parent.children.splice(index, 1);
                fst.render(toRemove.parent);
            }
        }
        // clear selected data
        selectedData = null;
    };
    
    TreeList.prototype.nodeExists = function (nodePath) {
        var nodes = d3.select(el).selectAll(".node .label").filter(function (d) {
            return d.path === nodePath;
        });
        if (!nodes.node()) {
            return false;
        }
        return true;
    };
    
    TreeList.prototype.createNodeEditor = function (node, onEnter, onCancel) {
        var fst = this,
            n = find(function (t) { return t.path === node.path; }, data) || selectedData;
        
        var nodes = d3.select(el).selectAll(".node").filter(function (d) {
            return d === n;
        });
                
        // an input text element is temporarily appended to let the user type the label
        nodes.select(".label").html("")
            .append("input").attr("class", "input_text")
            .attr("type", "text")
            .attr("placeholder", node.name)
            .attr("value", node.name);
        
        var input_text = nodes.select(".input_text"),
            oldPath = node.path;

        function doCreate(elem, newLabel) {
            if (newLabel === "") { newLabel = node.name; }
            d3.select(elem.parentNode).html(newLabel);
            fst.renameItem(n, newLabel);
            if (onEnter && typeof onEnter === "function") {
                onEnter(n, oldPath);
            }
        }
        
        var label = d3.select(input_text.node().parentNode).node();
        var input = d3.select(input_text.node()).node();
        input.focus();
        input.onblur = function () {
            doCreate(this, input.value);
            input_text.node().onblur = null;
        };
        input.onkeydown = function (event) {
            if (event.which === 13) { // enter key pressed
                event.preventDefault();
                doCreate(this, input.value);
                input_text.node().onkeydown = null;
                input_text.node().onblur = null;
            } else if (event.which === 27) { // escape key pressed
                event.preventDefault();
                if (onCancel && typeof onCancel === "function") {
                    onCancel(n, oldPath);
                }
                input_text.node().onkeydown = null;
                input_text.node().onblur = null;
            }
        };
    };
                
    TreeList.prototype.renameItem = function (item, newName) {
        // FIXME: it's note safe to use replace because the string to be replaced could be (part of) the name of subdirectories listed in the path
        item.path = item.path.replace(item.name, newName);
        item.name = newName;
    };
    
    TreeList.prototype.getSelectedItem = function () {
        return selectedData;
    };

    TreeList.prototype.renameRoot = function (newName) {
        // we assume here that the first label in the tree is always the project name
        this.renameItem(d3.select(el).select(".label").data()[0], newName);
        d3.select(el).select(".label").text(newName);
    };

    module.exports = TreeList;

});
