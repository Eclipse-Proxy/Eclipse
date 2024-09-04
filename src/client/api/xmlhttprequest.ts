window.XMLHttpRequest.prototype.open = new Proxy(
	window.XMLHttpRequest.prototype.open,
	{
		apply(target, thisArg, argArray) {
			if (argArray[1]) {
				argArray[1] = self.__eclipse$rewrite.url.encode(
					argArray[1],
					window.location.href
				);
			}

			return Reflect.apply(target, thisArg, argArray);
		},
	}
);
