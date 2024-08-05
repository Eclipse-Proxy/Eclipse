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
            } else if (["window", "self", "globalThis", "parent", "top", "frames"].includes(prop)) {
                return createWindowProxy(value);
            }

            if (typeof value == "function") {
                return function(...args) {
                    return value.apply(target, args);
                };
            }

            return value;
        },
        set(target, prop, newValue) {
            if (prop == "location") {
                //Todo rewrite location
                return false;
            }
            target[prop] = newValue;
            return true;
        }
    });
}

export { createWindowProxy };
