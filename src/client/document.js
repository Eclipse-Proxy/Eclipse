import { createLocationProxy } from "./location.js";

function createDocumentProxy(doc = window.document) {
	return new Proxy(doc, {
		get(target, prop) {
			const value = target[prop];

			if (prop == "location") {
				return createLocationProxy(value);
			}

			if (typeof value == "function") {
				return function (...args) {
					return value.apply(target, args);
				};
			}

			return value;
		},
		set(target, prop, newValue) {
			target[prop] = newValue;
			return true;
		},
	});
}

export { createDocumentProxy };
