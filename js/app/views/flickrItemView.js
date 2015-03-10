"use strict";

function ItemView (item) {

	var template = document.getElementById("flickr-picture-item").innerHTML,
		self = this,
		onClickItem = function (e) {

			var show_cs_event;

			e.preventDefault();

			show_cs_event = document.createEvent('Event');
			show_cs_event.initEvent('flickr-carousel', true, true);
			show_cs_event.data = {};
			show_cs_event.data.item = self.item;

			document.dispatchEvent(show_cs_event);

			show_cs_event = null;

		};

	// render item view template
	this.html = COMMON.renderTemplate(template, item); 
	this.item = item;

	this.html.addEventListener('click', onClickItem, true);

}
