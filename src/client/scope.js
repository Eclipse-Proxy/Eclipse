import { createWindowProxy } from "./window.js";
import { createLocationProxy } from "./location.js";
import { createDocumentProxy } from "./document.js";

self.__eclipse$scope = (identifier) => {
    const globals = ["window", "self", "globalThis", "parent", "top", "document", "frames"];

    if (globals.filter(global => window[global].Window ? identifier instanceof window[global].Window : false).length > 0) {
        return createWindowProxy(identifier);
    } else if (identifier instanceof Location) {
        return createLocationProxy(identifier);
    } else if (identifier instanceof Document) {
        return createDocumentProxy(identifier);
    }

    return identifier;
}