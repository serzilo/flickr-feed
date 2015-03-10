"use strict";

function ListSearchView (collection) {
	
	var template = document.getElementById("flickr-feed-search").innerHTML;
		
	this.html = COMMON.renderTemplate(template);
	this.collection = collection;
	this.tags = [];
	this.tags_string = "";
	
	this.el_field = this.html.querySelector(".flickr-feed__search-field");
	this.el_field.addEventListener("input", this.onInput.bind(this));

	this.el_tags = this.html.querySelector(".flickr-feed__search-tags");
	this.el_tags.addEventListener("click", this.onClickTag.bind(this));	

	this.events = {};
	this.events.search = document.createEvent('Event');
	this.events.search.initEvent('flickr-search', true, true);

}

ListSearchView.prototype.onInput = function (e) {

	var tag_str = "",
		i,
		tag_len;

	/* short timeout will prevent api query after each entered symbol*/
	if (this.timeout) {
		clearTimeout(this.timeout);
	}

	e.stopPropagation();
	e.preventDefault();	

	this.tags_string = this.el_field.value;

	if (this.tags_string) {

		this.tags = this.tags_string.match(/\w+/g);
		this.tags = COMMON.unique(this.tags);

	} else {

		this.tags = [];

	}

	tag_len = this.tags.length;

	for (i = 0; i < tag_len; i++) {
		tag_str += "<span class=\"flickr-feed__tagged\">" + this.tags[i] + "</span>";
	}

	this.el_tags.innerHTML = tag_str;

	this.events.search.data = {
		tags: this.tags,
		collection: this.collection
	};

	/* short timeout will prevent api query after each entered symbol*/
	this.timeout = setTimeout(function () {

		document.dispatchEvent(this.events.search);

	}.bind(this), 350);

}

ListSearchView.prototype.onClickTag = function (e) {

	var tag_text;

	if (e.target.tagName !== "SPAN") {
		return;
	}

	e.stopPropagation();
	e.preventDefault();

	tag_text = e.target.textContent;

	this.tags.splice(this.tags.indexOf(tag_text), 1);
	this.tags_string = this.tags.join(" ");

	this.el_field.value = this.tags_string;

	this.events.search.data = {
		tags: this.tags,
		collection: this.collection
	};
	document.dispatchEvent(this.events.search);

	e.target.parentNode.removeChild(e.target);

}
