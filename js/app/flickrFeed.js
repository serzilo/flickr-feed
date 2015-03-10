"use strict";

function FlickrViewer (instance_name, el) {

	var view;

	// init collection of images
	window[instance_name] = new FlickrImageCollection(instance_name),
	// init list
	view = new ListView(window[instance_name], document.querySelector(el));		

}


window.onload = function () {

	var fv = new FlickrViewer("recent_photos", ".list");

};
