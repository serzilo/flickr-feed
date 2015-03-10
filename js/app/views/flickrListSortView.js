"use strict";

function ListSortView (collection) {

	var template = document.getElementById("flickr-feed-sort").innerHTML;
		
	this.html = COMMON.renderTemplate(template);
	this.collection = collection;
	
	this.html.addEventListener("click", this.onClick.bind(this));

	this.events = {};
	this.events.sort = document.createEvent('Event');
	this.events.sort.initEvent('flickr-sort', true, true);

}

ListSortView.prototype.onClick = function (e) {

	var current_a = e.target,
		prev_a = this.html.querySelector(".flickr-feed__sort-item_selected");

	e.stopPropagation();
	e.preventDefault();	

	if (current_a.nodeName !== "A") {
		return;
	}
	prev_a.className = prev_a.className.replace(/ flickr-feed__sort-item_selected/, "");

	this.events.sort.data = {
		field: COMMON.getJSHooks(current_a.className)[0],
		collection: this.collection
	};

	current_a.className += " flickr-feed__sort-item_selected";

	document.dispatchEvent(this.events.sort);

}