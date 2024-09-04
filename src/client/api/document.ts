window.document.open = new Proxy(window.document.open, {
	apply(target, thisArg, argArray) {
		if (argArray.length === 3) {
			return window.open(
				self.__eclipse$rewrite.url.encode(argArray[0], window.location.href)
			);
		}

		return Reflect.apply(target, thisArg, argArray);
	},
});

Object.defineProperty(window.document, "domain", {
	get() {
		return new URL(self.__eclipse$rewrite.url.decode(window.location.href))
			.host;
	},
	set(value) {
		return value;
	},
});

const originalDocumentbaseURI = window.document.baseURI;
Object.defineProperty(window.document, "baseURI", {
	get() {
		return self.__eclipse$rewrite.url.decode(originalDocumentbaseURI);
	},
	set(value) {
		return value;
	},
});

const originalDocumentdocumentURI = window.document.documentURI;
Object.defineProperty(window.document, "documentURI", {
	get() {
		return self.__eclipse$rewrite.url.decode(originalDocumentdocumentURI);
	},
	set(value) {
		return value;
	},
});

const originalDocumentreferrer = window.document.referrer;
Object.defineProperty(window.document, "referrer", {
	get() {
		return originalDocumentreferrer
			? self.__eclipse$rewrite.url.decode(originalDocumentreferrer)
			: originalDocumentreferrer;
	},
	set(value) {
		return value;
	},
});

const originalDocumentURL = window.document.URL;
Object.defineProperty(window.document, "URL", {
	get() {
		return self.__eclipse$rewrite.url.decode(originalDocumentURL);
	},
	set(value) {
		return value;
	},
});

window.document.write = new Proxy(window.document.write, {
	apply(target, thisArg, argArray) {
		if (argArray[0]) {
			argArray[0] = self.__eclipse$rewrite.html(
				argArray[0],
				window.location.href,
				true
			);
		}

		return Reflect.apply(target, thisArg, argArray);
	},
});

window.document.writeln = new Proxy(window.document.writeln, {
	apply(target, thisArg, argArray) {
		if (argArray[0]) {
			argArray[0] = self.__eclipse$rewrite.html(
				argArray[0],
				window.location.href,
				true
			);
		}

		return Reflect.apply(target, thisArg, argArray);
	},
});
