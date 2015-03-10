"use strict";

function ListView (collection, nest) {

	var template = document.getElementById("flickr-feed").innerHTML,
		sort_view_container,
		sort_view = new ListSortView(collection),
		search_view_container,
		search_view = new ListSearchView(collection);

	this.collection = collection;
	this.nest = nest;
	this.item_views = [];

	this.html = COMMON.renderTemplate(template);
	this.list_container = this.html.querySelector(".list-container");

	sort_view_container = this.html.querySelector(".sort-container");
	sort_view_container.appendChild(sort_view.html);

	search_view_container = this.html.querySelector(".search-container");
	search_view_container.appendChild(search_view.html);	

	this.nest.appendChild(this.html);

	// listen to
	document.addEventListener('flickr-fetch', this.onFetchCollection.bind(this), false);
	document.addEventListener('flickr-carousel', this.showCarousel.bind(this), false);

};

// Update item views after collection fetched
ListView.prototype.onFetchCollection = function (e) {

	var collection_length = this.collection.items.length,
		i,
		image;

	this.item_views.forEach(function (i, e, a) {
		a[i] = null;
	});

	this.item_views = [];

	for (i = 0; i < collection_length; i++) {

		image = this.collection.items[i];
		this.item_views.push(new ItemView(image));

	}

	this.renderList();

};

// Render list
ListView.prototype.renderList = function () {

	var collection_length = this.item_views.length,
		item_view,
		i;

	while (this.list_container.firstChild) {
	    this.list_container.removeChild(this.list_container.firstChild);
	}	

	for (i = 0; i < collection_length; i++) {

		item_view = this.item_views[i];
		this.list_container.appendChild(item_view.html);

	}

};

// Show carousel
ListView.prototype.showCarousel = function (e) {

	var item_collection = this.collection.items,
		item_collection_len = item_collection.length,
		i,
		carousel,
		current_item,
		current_item_index,
		carousel_images = [];

	if (item_collection_len === 0) {
		return;
	}


	current_item = e.data.item || item_collection[0];
	current_item_index = item_collection.indexOf(current_item);

	if (current_item_index === -1) {
		return;
	}

	// create array of image urls to show in carousel
	for (i = 0; i < item_collection_len; i++) {

		carousel_images.push(item_collection[i].large_image_url);

	}

	// show image in carousel
	carousel = new Carousel({
		html_nest: document.querySelector("#carousel-nest"),
		images: carousel_images,
		current_image_index: current_item_index
	});

};
