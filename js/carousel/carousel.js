!function (global) {
	"use strict";

	function Carousel(opts) {

		this.gallery_images = opts.images;
		this.html_nest = opts.html_nest;
		this.current_image_index = opts.current_image_index || 0;
		this.template = opts.template;

		this.images = [];
		this.images_len = this.gallery_images.length;
		this.is_animating = false;
		this.carousel_image = undefined;
		this.image_dots = undefined;
		this.image_dots_elements = [];
		this.fragment = document.createDocumentFragment();
		this.next_image_index = this.current_image_index;
		this.animation = "crossfade";

		this.init();

	}


	Carousel.prototype.transition_end = (function () {
	// setup helper property: "transition-end" event name
	    var i,
	        el = document.createElement('div'),
	        transitions = {
	            'transition':'transitionend',
	            'OTransition':'otransitionend',
	            'MozTransition':'transitionend',
	            'WebkitTransition':'webkitTransitionEnd'
	        };

	    for (i in transitions) {

	        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {

	            return transitions[i];

	        }

	    }

	}())

	// setup helper property: "transform" css property name
	Carousel.prototype.css_transform = (function () {
	    
	    var i,
	    	p,
	    	el = document.createElement('div'),
	        transforms = ["-ms-transform", "-o-transform", "-moz-transform", "-webkit-transform", "transform"];

		i = transforms.length;
		while (i--) {

			p = transforms[i];
		    if (el.style[p] !== undefined) {

		        return p;

		    }

		}

	}())

	// init carousel view
	Carousel.prototype.init = function () {

		var i,
			image,
			button_left,
			button_right,
			carousel_container,
			div = document.createElement("div"),
			template = '<div class="crsl-container crsl-transparent crsl-transitioning">\
							<div class="crsl-image"></div>\
							<a class="crsl-button_left crsl-btn-circle"><div class="crsl-arrow_left"></div></a>\
							<a class="crsl-button_right crsl-btn-circle"><div class="crsl-arrow_right"></div></a>\
							<div class="crsl-image-dots"></div>\
						</div>';

		// create html view
		div.innerHTML = this.template || template;
		this.fragment.appendChild(div.childNodes[0]);

		this.carousel_image = this.fragment.querySelector(".crsl-image");

		for (i = 0; i < this.images_len; i++) {

			image = document.createElement("img");
			this.images[i] = image;

		}

		// load and show current image
		this.next_image_index = this.current_image_index;
		this.togglePicture(this.current_image_index);

		// display "dot" image selector
		this.createImageDots();

		// button events
		button_left = this.fragment.querySelector(".crsl-button_left");
		button_left.addEventListener("click", this.slideLeft.bind(this), false);

		button_right = this.fragment.querySelector(".crsl-button_right");
		button_right.addEventListener("click", this.slideRight.bind(this), false);

		// close carousel by click outside of its buttons
		carousel_container = this.fragment.querySelector(".crsl-container");
		carousel_container.addEventListener("click", this.destroy.bind(this), false);

		// Handle keyboard
		this.keyboardHandleListener = this.keyboardHandle.bind(this);
		document.addEventListener("keyup", this.keyboardHandleListener, false);

		this.show();

	}

	Carousel.prototype.loadContextImages = function (opts) {
		
		var image_index = opts.image_index,
			prev_image_index = this.getNextImageIndex({
				direction: "prev", 
				image_index: image_index
			}),
			next_image_index = this.getNextImageIndex({
				direction: "next", 
				image_index: image_index
			});

		if(!this.images[prev_image_index].src) {

			this.images[prev_image_index].src = this.gallery_images[prev_image_index];

		}

		if(!this.images[next_image_index].src) {

			this.images[next_image_index].src = this.gallery_images[next_image_index];

		}			

	}

	Carousel.prototype.showLoadingSpinner = function () {

		// show loading spinner
		var loading = document.createElement("div")
		loading.className = "crsl-loading";
		this.html_nest.appendChild(loading);

	}

	Carousel.prototype.removeLoadingSpinner = function () {

		//remove loading spinner after first image has been loaded
		var loading = this.html_nest.querySelector(".crsl-loading");

		if (loading) {

			loading.parentNode.removeChild(loading);

		}
		

	}

	Carousel.prototype.show = function () {
		
		// insert in DOM
		this.html_nest.appendChild(this.fragment);

		// fade in
		setTimeout(function () {

			var carousel_container = this.html_nest.querySelector(".crsl-container");
			carousel_container.className = "crsl-container crsl-transitioning";

		}.bind(this), 50);

	}

	Carousel.prototype.destroy = function () {

		document.removeEventListener("keyup", this.keyboardHandleListener);
		
		while (this.html_nest.firstChild) {

		    this.html_nest.removeChild(this.html_nest.firstChild);

		}

		this.html_nest.className = "";

		for (var key in this) {

			this[key] = null;

		}

	}

	// keyboard controls
	Carousel.prototype.keyboardHandle = function (e) {

		var codes = {
				27: this.destroy, // ESC
				37: this.slideLeft, // Left arrow
				39: this.slideRight, // Right arrow
			};

		if (codes[e.keyCode]) {

			codes[e.keyCode].bind(this)(e);

		}

	}

	Carousel.prototype.keyboardHandleListener = undefined

	Carousel.prototype.slideLeft = function (e) {

		e.stopPropagation();
		this.next_image_index = this.getNextImageIndex({ direction: "prev" });
		this.togglePicture();

	}

	Carousel.prototype.slideRight = function (e) {

		e.stopPropagation();
		this.next_image_index = this.getNextImageIndex({ direction: "next" });
		this.togglePicture();

	}

	Carousel.prototype.getNextImageIndex = function (opts) {

		var direction = opts.direction,
			image_index = opts.image_index,
			next_image_index = image_index || this.current_image_index,
			images_len = this.images_len,
			add = {"prev": -1,
					"next": 1};
		
		next_image_index += add[direction];
		next_image_index = next_image_index < 0 ? images_len - 1 : next_image_index === images_len ? 0 : next_image_index;

		return next_image_index;

	}

	// Helper function for "slide" animation
	Carousel.prototype.getDirection = function (opts) {

		var current_image_index = opts.current_image_index,
			next_image_index = opts.next_image_index,
			images_len = opts.images_len;
		
		if (next_image_index === 0 && current_image_index === images_len - 1) {

			return "next";

		} 

		if (next_image_index === images_len - 1 && current_image_index === 0) {

			return "prev";

		} 
		
		return current_image_index > next_image_index ? "prev" : "next";

	}

	Carousel.prototype.togglePicture = function () {

		var buffer = this.images[this.next_image_index];

		if (this.is_animating) {

			return;

		}

		this.is_animating = true;

		// check if image loaded
		if(!buffer.src) {

			buffer.src = this.gallery_images[this.next_image_index];

		}

		this.loadContextImages({
			image_index: this.next_image_index
		});

		// show loading spinner if image not loaded
		if (!(buffer.complete || buffer.error)) {

			buffer.addEventListener("load", this.togglePictureAnimationLaunch.bind(this), false);
			this.showLoadingSpinner();

		} else {

			this.togglePictureAnimationLaunch();

		}

	}

	// Function makes carousel spin
	Carousel.prototype.togglePictureAnimationLaunch = function () {

		var direction,
			next_image_index = this.next_image_index,
			buffer,
			current,
			current_image_index = this.current_image_index,
			images = this.images,
			animation = this.animation,
			images_len = this.images_len,
			carousel_image = this.carousel_image,
			animation_functions = {
				"crossfade": this.animationCrossfade,
			},
			animation_options,
			afterTransition = function (e) {

				e.stopPropagation();
				e.preventDefault();
				
				carousel_image.removeEventListener(this.transition_end, afterTransitionHandler);
				carousel_image.style.cssText = "";
				carousel_image.className = "crsl-image";

				current.parentNode.removeChild(current);
				buffer.className = "crsl-current";
				buffer.style.cssText = "";						
				this.is_animating = false;

			},
			afterTransitionHandler = afterTransition.bind(this);

		this.removeLoadingSpinner();
		direction = this.getDirection({ 
			current_image_index: current_image_index,
			next_image_index: next_image_index,
			images_len: images_len
		});

		// create buffer node for next image
		buffer = images[next_image_index].cloneNode();
		carousel_image.appendChild(buffer);

		current = this.html_nest.querySelector(".crsl-current");

		if (!current) {

			current = document.createElement("IMG");
			current.className = "crsl-current";
			carousel_image.appendChild(current);

		}

		// animate
		animation_options = {
			direction: direction,
			buffer: buffer,
			current: current,
			afterTransitionHandler: afterTransitionHandler
		};
		animation_functions[this.animation].bind(this)(animation_options);

		this.current_image_index = next_image_index;
		this.updateImageDots();

	}

	// GPU animation. Sliding by transitioning "transform" css property
	Carousel.prototype.animationCrossfade = function (opts) {

		var buffer = opts.buffer,
			current = opts.current,
			shift = opts.direction === "prev" ? 180: -180,
			afterTransitionHandler = opts.afterTransitionHandler,
			carousel_image = this.carousel_image;			

		buffer.className = "crsl-current crsl-transparent";
		buffer.style.cssText += this.css_transform + ": translate3d("+ (-shift) + "px, 0px, 0px)";
		buffer.className += " crsl-transitioning";
		current.className = "crsl-current crsl-transitioning";

		carousel_image.addEventListener(this.transition_end, afterTransitionHandler, false);

		setTimeout(function () {

			current.style.opacity = 0;

			buffer.className = "crsl-current crsl-transitioning";
			buffer.style.cssText = "";

		}, 50);

	}

	// "Dot" image selector
	Carousel.prototype.createImageDots = function () {

		var el,
			i,
			images_len = this.images_len;

		this.image_dots = this.fragment.querySelector(".crsl-image-dots");

		for (i=0; i < images_len; i++) {

			el = document.createElement("div");
			el.className = "crsl-image-dot" + (i === this.current_image_index ? " crsl-image-dot_selected" : "");
			this.image_dots.appendChild(el);
			this.image_dots_elements.push(el);

		}

		// delegate click event to dot container
		this.image_dots.onclick = this.imageDotsOnclick.bind(this);

	}

	Carousel.prototype.updateImageDots = function () {
		
		var prev_dot = this.html_nest.querySelector(".crsl-image-dots .crsl-image-dot_selected"),
			current_dot = this.image_dots_elements[this.current_image_index];

		if (!prev_dot || !current_dot) {

			return;

		}

		// remove mark
		prev_dot.className = "crsl-image-dot";
		// set mark
		current_dot.className = "crsl-image-dot crsl-image-dot_selected";

	}

	Carousel.prototype.imageDotsOnclick = function (e) {

		var image_index = this.image_dots_elements.indexOf(e.target);

		e.preventDefault();
		e.stopPropagation();

		if (image_index === -1 || image_index === this.current_image_index) { 

			return;

		}

		this.next_image_index = image_index;
		this.togglePicture();
	}

	global.Carousel = Carousel;

}(this);