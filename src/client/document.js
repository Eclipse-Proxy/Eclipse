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

			if (typeof value == "function") {
                return value.bind(target);
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
