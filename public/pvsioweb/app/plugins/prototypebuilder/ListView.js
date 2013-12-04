/**
 * Simple list viewer
 * @author Patrick Oladimeji <p.oladimeji@swansea.ac.uk>
 * @author Enrico D'Urso <e.durso7@gmail.com>
 * @date 9/19/13 10:30:29 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
	"use strict";
	var eventDispatcher = require("util/eventDispatcher");
	var property = require("util/property"),
		d3 = require("d3/d3"),
		queue = require("d3/queue");

	function renderSelectedItem(index, el, listItems) {
		listItems.classed("selected", false);
		el.classed("selected", true);
	}
	
	function selectItem(index, item, listView) {
		//only update the selected item if a different list item was selected
		var label = listView.labelFunction();
		if (listView.selectedIndex() !== index) {
			renderSelectedItem(index, d3.select(listView._listItems[0][index]), listView._listItems);
			var event = {
				type: "SelectedIndexChanged",
				selectedIndex: index,
				oldSelectedIndex: listView.selectedIndex(),
				selectedItem: item,
				selectedItemString: label(item)
			};
			listView.fire(event);
			listView.selectedIndex(index); //update selected index
			listView.selectedItem(item); //and selected item
		}
	}
	
	function ListView(elementId, data, labelFunction, classFunction) {
		eventDispatcher(this);
		this.selectedIndex = property.call(this, -1);
		this.selectedItem = property.call(this);

		//define simple string based label function if none was given
		labelFunction = labelFunction || function (d) {
			return d.toString();
		};
		//define simple css classing function if none was given
		classFunction = classFunction || function (d, i) {
			var odd_even = i % 2 === 0 ? "even" : "odd";
			return "listItem " + "listItem" + i + " " + odd_even;
		};
		
		this.labelFunction = property.call(this, labelFunction);
		this.classFunction = property.call(this, classFunction);
		//create elements
		var listBox = d3.select(elementId).html("").append("ul");
		this._listBox = listBox;
		this.updateView(data.filter(function (d) {return d.visible(); }));
	}
	
	ListView.prototype.updateView = function (data) {
		var lv = this;
		var listItems = this._listBox.selectAll("li");
		if (data) {
			var list = listItems.data(data);
			listItems = list.enter().append("li").attr("class", this.classFunction());
			listItems.append("span").attr("class", "list-icon list-icon-main");
			listItems.append("span").attr("class", "list-icon list-icon-dirty");
			listItems.append("span").attr("class", "file-label").html(this.labelFunction());
			listItems.on("click", function (d, i) {
				selectItem(i, d, lv);
			});
			list.exit().remove();
		}
		this._listItems = listItems;
		//update the class information on all list itmes
		listItems.attr("class", this.classFunction())
			.select("span.file-label").html(this.labelFunction());
		if (this.selectedItem()) {
			renderSelectedItem(this.selectedIndex(), d3.select(this._listItems[0][this.selectedIndex()]), this._listItems);
		}
		return this;
	};

	ListView.prototype.selectItem = function (item) {
		var data = this._listBox.selectAll("li").data();
		var itemIndex = data.indexOf(item);
		if (itemIndex > -1) {
			selectItem(itemIndex, item, this);
		}
		return this;
	};
	
	module.exports = ListView;
});