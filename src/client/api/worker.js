window.Worker = new Proxy(window.Worker, {
	construct(target, argArray) {
		if (argArray[0]) {
			argArray[0] = __eclipse$rewrite.url.encode(
				argArray[0],
				window.location.href
			);
		}

		return Reflect.construct(target, argArray);
	},
});

Worklet.prototype.addModule = new Proxy(Worklet.prototype.addModule, {
	apply(target, thisArg, argArray) {
		if (argArray[0]) {
			argArray[0] = __eclipse$rewrite.url.encode(
				argArray[0],
				window.location.href
			);
		}

		return Reflect.apply(target, thisArg, argArray);
	},
});
