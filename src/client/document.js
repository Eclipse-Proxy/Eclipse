import { createLocationProxy } from "./location.js";
import { createWindowProxy } from "./window.js";

function createDocumentProxy(doc = window.document) {
	return new Proxy(doc, {
		get(target, prop) {
			const value = target[prop];

			if (prop == "location") {
				return createLocationProxy(value);
			} else if (prop == "defaultView") {
				return createWindowProxy(value);
			}

			if (
				typeof value == "function" &&
				value.toString == self.Object.toString
			) {
				return new Proxy(value, {
					apply(t, g, a) {
						return Reflect.apply(t, doc, a);
					},
				});
			} else {
				return value;
			}
		},
		set(target, prop, newValue) {
			target[prop] = newValue;
			return true;
		},
	});
}

export { createDocumentProxy };
