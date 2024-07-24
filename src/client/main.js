import { createWindowProxy } from "./window.js";
import { createLocationProxy } from "./location.js";
import { createDocumentProxy } from "./document.js";

self.__eclipse$scope = (identifier) => {
    if (identifier instanceof Window) {
        return createWindowProxy(identifier);
    } else if (identifier instanceof Location) {
        return createLocationProxy(identifier);
    } else if (identifier instanceof Document) {
        return createDocumentProxy(identifier);
    }

    return identifier;
}