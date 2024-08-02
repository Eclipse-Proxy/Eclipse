import { createDocumentProxy } from "./document.js";
import { createLocationProxy } from "./location.js";

function createWindowProxy(win = window) {
    return new Proxy(win, {
        get(_target, prop) {
            if (prop == "location") {
                return createLocationProxy(win[prop]);
            } else if (prop == "document") {
                return createDocumentProxy(win[prop]);
            } else if (["window", "self", "globalThis", "parent", "top"].includes(prop)) {
                return createWindowProxy(win[prop])
            }

            const value = win[prop];

            if (typeof value == "function" && value.toString == self.Object.toString) {
                return new Proxy(value, {
                    apply(target, _thisArg, args) {
                        return Reflect.apply(target, win, args);
                    }
                });
            }

            return value;
        },
        set(_target, prop, newValue) {
            //Todo rewrite location
            win[prop] = newValue;
            return true;
        },
        
    });
}

export { createWindowProxy };