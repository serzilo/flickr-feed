// Всё обёрнуто в вызов анонимной функции, гуд!
var COMMON = (function () {
	// Тоже круто
	"use strict";

	/*
	    // Переменная и функция для хранения созданных регулярных выражений
	    // смотри код ниже
		var regExpCache = {},
			getRegExp = function (key) {
				var regExp = regExpCache[key];

				if (!regExp) {
					regExp = new RegExp("{{ " + key + " }}", "g");
					regExpCache[key] = regExp;
				}

				return regExp;
			};
	*/

	return {

		// собственный шаблонизатор! Ничего себе!)
		renderTemplate: function (tpl, data) {

			var key,
				value,
				i,
				re,
				fragment,
				div,
				// я не понял зачем нужна новая переменная
				// можно использовать tpl вместо str
				str = tpl,
				object_keys,
				length;

			if (!data) {

				str = str.replace(/\{+(.*?)\}+/g, "");

			} else {

				/*
					// Можно цикл так написать:

					for (key in data) {
						// Это хитрая проверка, тут документация:
						// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
						if (data.hasOwnProperty(key)) {
							value = data[key];

							re = new RegExp("{{ " + key + " }}", "g");
							str = str.replace(re, value);
						}
					}
				*/

				object_keys = Object.keys(data);
				length = object_keys.length;

				for (i = 0; i < length; i++) {

					key = object_keys[i];
					value = data[key];

					/*
						// Есть вариант сохранять созданные регулярные выражения в объект,
						// а потом брать оттуда
						re = getRegExp(key);
					*/
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