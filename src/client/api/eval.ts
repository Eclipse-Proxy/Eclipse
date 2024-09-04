window.eval = new Proxy(window.eval, {
	apply(target, thisArg, argArray) {
		if (argArray[0]) {
			argArray[0] = self.__eclipse$rewrite.javascript(
				argArray[0],
				window.location.href
			);
		}

		return Reflect.apply(target, thisArg, argArray);
	},
});

window.Function = new Proxy(window.Function, {
	construct(target, argArray) {
		if (argArray[argArray.length - 1]) {
			argArray[argArray.length - 1] = self.__eclipse$rewrite.javascript(
				argArray[argArray.length - 1],
				window.location.href
			);
		}

		return Reflect.construct(target, argArray);
	},
});
