var COMMON = (function () {
	"use strict";

	return {

		renderTemplate: function (tpl, data) {

			var key,
				value,
				i,
				re,
				fragment,
				div,
				str = tpl,
				object_keys,
				length;

			if (!data) {

				str = str.replace(/\{+(.*?)\}+/g, "");		

			} else {

				object_keys = Object.keys(data);
				length = object_keys.length;

				for (i = 0; i < length; i++) {

					key = object_keys[i];
					value = data[key];

					re = new RegExp("{{ " + key + " }}", "g");
					str = str.replace(re, value);

				}

			}

			div = document.createElement("div");
			div.innerHTML = str;

			return div.children[0];

		},

		getJSHooks: function (str) {

			var result = str.match(/(js-\w*)/g);

			if (!result) {
				throw "No JS hooks founded in class names."
			}

			result.forEach(function (e, i, a) {
				a[i] = e.replace(/js-/, "");
			});

			return result;

		},

		unique: function (list) {

		    var result = [];

		    if (list === null) {
		    	return result;	
		    }

		    list.forEach(function(e) {
		        if (result.indexOf(e) === -1) { 
		        	result.push(e);
		        }
		    });
		    
		    return result;

		}


	}

}());