import { createLocationProxy } from "./location.ts";
import { createWindowProxy } from "./window.ts";

function createDocumentProxy(doc: Document = window.document): any {
	return new Proxy(doc, {
		get(target, prop) {
			const value: any = target[prop];

			if (prop == "location") {
				return createLocationProxy(value);
			} else if (prop == "defaultView") {
				return createWindowProxy(value);
			}

			if (typeof value == "function") {
				return value.bind(target);
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
