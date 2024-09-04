Object.defineProperty(window, "origin", {
	get() {
		return new URL(self.__eclipse$rewrite.url.decode(window.location.href))
			.origin;
	},
	set(value) {
		return value;
	},
});
