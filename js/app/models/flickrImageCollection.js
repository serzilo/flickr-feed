"use strict";

function FlickrImage (image) {
	this.large_image_url = image.media.m.replace(/_m.jpg/, "_b.jpg");
	this.small_image_url = image.media.m.replace(/_m.jpg/, "_s.jpg");
	this.small_image_width = 75;
	this.small_image_heght = 75;
	this.date_published = new Date(image.published);
	this.date_taken = new Date(image.date_taken);
	this.published = new Date(image.published).toLocaleString();
	this.taken = new Date(image.date_taken).toLocaleString();	
	this.author = image.author;
	this.title = image.title;
}

function FlickrImageCollection (collection_name) {

	this.items = [];
	this.url = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=0&jsoncallback=" + collection_name + ".fetch";
	this.requestFlickr();

	this.events = {};
	this.sort_field = "date_published";

	this.events.fetch = document.createEvent('Event');
	this.events.fetch.initEvent('flickr-fetch', true, true);

	document.addEventListener('flickr-sort', this.sort.bind(this), false);
	document.addEventListener('flickr-search', this.search.bind(this), false);

}

// Request Flickr API
FlickrImageCollection.prototype.requestFlickr = function (url) {

	var head = document.querySelector("head"),
		script = document.createElement("script"),
		script_url = url || this.url;

	script.src = script_url;
	head.appendChild(script);
	
	script.onload = function () {
		this.parentNode.removeChild(this);
	};

}

/* JSONP callback */
FlickrImageCollection.prototype.fetch = function (response) {

	var photo_length,
		image,
		div,
		img,
		i;

	this.items = [];

	photo_length = response.items.length;

	for (i = 0; i < photo_length; i++) {

		image = response.items[i];
		img = new FlickrImage(image);
		this.items.push(img);
	}

	this.sort();
	document.dispatchEvent(this.events.fetch);

}

// Sort collection
FlickrImageCollection.prototype.sort = function(e) {

	var field = (e) ? e.data.field : this.sort_field;

	if (e && e.data.collection !== this) {
		return;
	}

	this.sort_field = field;

	this.items.sort(function (a,b) {
		if(a[field] < b[field]) return 1;
	    if(a[field] > b[field]) return -1;
	    return 0;
	});

	document.dispatchEvent(this.events.fetch);

}

// Request Flickr API using filter by tags
FlickrImageCollection.prototype.search = function(e) {

	var tags = e.data.tags,
		tags_param = "",
		url = this.url;

	if (e.data.collection !== this) {
		return;
	}

	if (tags) {
		tags_param = "&tags=" + tags.join(",");
	}

	url += tags_param;
	this.requestFlickr(url);

}
