/**
 * 
 * @author Patrick Oladimeji
 * @date 4/27/14 15:54:08 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var data,
        el,
        listHeight = 10, //FIXME: this variable is never used!
        duration = 200,
        contextMenuItems = ["New File", "New Folder", "Rename", "Delete"],
        selectedData,
        cachedData;
    var globalId = 0;
    var eventDispatcher = require("util/eventDispatcher"),
        deepCopy = require("util/deepcopy");
//    var contextMenuCreated = false; // this is needed to avoid creeating multiple menus
    
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
            
            var menus = div.selectAll("li.menuitem").data(menuItems).enter()
                .append("li").attr("class", "menuitem")
                .html(String);
            
            cachedData = deepCopy(data, ["parent"]);
            menus.on("click", function (d, i) {
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
//            if (contextMenuCreated === true) {
            // delete existing context menu before creating a new one
            d3.select("div.contextmenu").remove();
//            }
            createMenu(contextMenuItems, event, selectedData);
//            contextMenuCreated = true;
            return false;
        };
        //create event to clear any context menu items
        document.onclick = function (event) {
            d3.select("div.contextmenu").remove();
//            contextMenuCreated === false;
        };
    }
    
    TreeList.prototype.render =   function (parent, noAnimation) {
        var fst = this;
        var tree = d3.layout.treelist().childIndent(10).nodeHeight(28);
        var nodes = tree.nodes(data);
        var links = tree.links(nodes);
        var size = tree.size();
        //add the nodes and edges

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
            .style("top", function (d) {
                return parent.y + "px";
            }).style("opacity", 0)
            .style("height", tree.nodeHeight() + "px");

        var updatedNodes = nodeEls,
            exitedNodes = nodeEls.exit();
        
        var nodeContainer = enteredNodes.append("div")
            .style("padding-left", function (d) { return d.x + "px"; });

        var icon = nodeContainer.append("span").attr("class", "glyphicon");

        var text = nodeContainer.append("span").attr("class", "label").html(function (d) {
            return d.name;
        }).style("margin-left", "10px");
        //update list class
        nodeEls.attr("class", function (d, i) {
            var c = i % 2 === 0 ? "node even" : "node odd";
            if (selectedData && d.path === selectedData.path) {
                c = c.concat(" selected");
            }
            return c;
        });
        nodeEls.selectAll("span.glyphicon").attr("class", function (d) {
            var base = "glyphicon ";
            var c = d.isDirectory && d.children ? "glyphicon-folder-open" :
                    d.isDirectory || d._children ? "glyphicon-folder-close" : "glyphicon-file";
            return base.concat(c);
        });

        if (!noAnimation) {
            updatedNodes = updatedNodes.transition().duration(duration);
            exitedNodes = exitedNodes.transition().duration(duration);
        }
        updatedNodes.style("top", function (d) {
            return (d.y - tree.nodeHeight()) + "px";
        }).style("opacity", 1);
        //remove hidden nodes
        exitedNodes
            .style("top", parent.y + "px")
            .style("opacity", 0)
            .remove();
        //register click handers for icons
        icon.on("click", function (d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            fst.render(d);
        });
        //register click handlers for text
        enteredNodes.on("click", function (d, i) {
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
            //fire selected item changed event
            fst.fire({type: "SelectedItemChanged", data: selectedData});
            
            setTimeout(function () {
                d3.select(el).node().scrollTop = selectedData.y;
            }, duration);
        }
    };
    
    TreeList.prototype.markDirty = function (path, sign) {
        var fst = this;
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
    };
    
    TreeList.prototype.createNodeEditor = function (node, onEnter, onCancel) {
        var fst = this, n = find(function (t) { return t.path === node.path; }, data) || selectedData;
        var nodes = d3.select(el).selectAll(".node").filter(function (d) {
            return d === n;
        });
        var ed = nodes.select(".label").attr("contentEditable", true);
        ed.each(function (d, i) {
            var sel = d3.select(this);
            this.focus();
//            this.click();
            this.onkeydown = function (event) {
                if (event.which === 13) {
                    event.preventDefault();
                    sel.attr("contentEditable", false);
                    fst.renameItem(n, sel.html());
                    if (onEnter && typeof onEnter === "function") {
                        onEnter(n);
                        sel.node().click();
                    }
                } else if (event.which === 27) {
                    event.preventDefault();
                    sel.attr("contentEditable", false).html(n.name);
                    if (onCancel && typeof onCancel === "function") {
                        onCancel(n);
                    }
                }
            };
        });
    };
    
    TreeList.prototype.renameItem = function (item, newName) {
        item.path = item.path.replace(item.name, newName);
        item.name = newName;
    };
    
    TreeList.prototype.getSelectedItem = function () {
        return selectedData;
    };
    module.exports = TreeList;

});
