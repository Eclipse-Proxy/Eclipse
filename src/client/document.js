import { createLocationProxy } from "./location.js";

function createDocumentProxy(doc = window.document) {
    return new Proxy(doc, {
        get(_target, prop) {
            if (prop == "location") {
                return createLocationProxy(doc[prop]);
            }

            const value = doc[prop];

            if (typeof value == "function" && value.toString == self.Object.toString) {
                return new Proxy(value, {
                    apply(target, _thisArg, args) {
                        return Reflect.apply(target, doc, args);
                    }
                });
            }

            return value;
        },
        set(_target, prop, newValue) {
            doc[prop] = newValue;
            return true;
        }
    });
}

export { createDocumentProxy };