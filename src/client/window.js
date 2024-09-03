import { createDocumentProxy } from "./document.js";
import { createLocationProxy } from "./location.js";

function createWindowProxy(win = window) {
	return new Proxy(win, {
		get(target, prop) {
			const value = target[prop];

			if (prop == "location") {
				return createLocationProxy(value);
			} else if (prop == "document") {
				return createDocumentProxy(value);
			} else if (
				["window", "self", "globalThis", "parent", "top", "frames"].includes(
					prop
				)
			) {
				return createWindowProxy(value);
			}

			if (typeof value == "function") {
				return value.bind(target);
			} else {
				return value;
			}
		},
		set(target, prop, newValue) {
			if (prop == "location") {
				return (win.location = __eclipse$rewrite.url.encode(
					newValue,
					window.location.href
				));
			}
			target[prop] = newValue;
			return true;
		},
	});
}

export { createWindowProxy };
