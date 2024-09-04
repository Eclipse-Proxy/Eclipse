window.addEventListener = new Proxy(window.addEventListener, {
	apply(target, thisArg, [type, func, ...argArray]) {
		if (["message", "messageerror"].includes(type)) {
			const wrappedFunc = function (event) {
				Object.defineProperty(event, "origin", {
					value: new URL(self.__eclipse$rewrite.url.decode(window.location.href))
						.origin,
				});

				return func.call(this, event);
			};

			return Reflect.apply(target, thisArg, [type, wrappedFunc, ...argArray]);
		} else if (type == "hashchange") {
			const wrappedFunc = function (event) {
				Object.defineProperty(event, "newURL", {
					value: self.__eclipse$rewrite.url.decode(event.newURL),
				});
				Object.defineProperty(event, "oldURL", {
					value: self.__eclipse$rewrite.url.decode(event.oldURL),
				});

				return func.call(this, event);
			};

			return Reflect.apply(target, thisArg, [type, wrappedFunc, ...argArray]);
		}

		return Reflect.apply(target, thisArg, [type, func, ...argArray]);
	},
});
