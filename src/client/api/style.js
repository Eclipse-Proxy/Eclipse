let originalElementStyle = Object.getOwnPropertyDescriptor(
	HTMLElement.prototype,
	"style"
);

Object.defineProperty(HTMLElement.prototype, "style", {
	get() {
		let styles = originalElementStyle.get.call(this);

		return new Proxy(styles, {
			get(target, property) {
				const value = target[property];

				if (typeof value == "function") {
					return value.bind(target);
				}

				const urlRegex = /url\(["']?([^)"']+)["']?\)/;
				if (urlRegex.test(value)) {
					return value.replace(urlRegex, (match, url) => {
						return `url(${__eclipse$rewrite.url.decode(url)})`;
					});
				}

				return value;
			},
			set(target, property, value) {
				const urlRegex = /url\(["']?([^)"']+)["']?\)/;
				if (urlRegex.test(value)) {
					target[property] = value.replace(urlRegex, (match, url) => {
						return `url(${__eclipse$rewrite.url.encode(
							url,
							window.location.href
						)})`;
					});
					return true;
				}

				target[property] = value;
				return true;
			},
		});
	},
});

let originalGetProperty = CSSStyleDeclaration.prototype.getPropertyValue;
CSSStyleDeclaration.prototype.getPropertyValue = function (property) {
	const value = originalGetProperty.call(this, property);

	const urlRegex = /url\(["']?([^)"']+)["']?\)/;
	if (urlRegex.test(value)) {
		return value.replace(urlRegex, (match, url) => {
			return `url(${__eclipse$rewrite.url.decode(url)})`;
		});
	}

	return value;
};

//setProperty
//cssText