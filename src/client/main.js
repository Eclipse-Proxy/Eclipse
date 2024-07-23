import { createWindowProxy } from "./window.js";
import { createLocationProxy } from "./location.js";

self.__eclipse$scope = (identifier) => {
    if (identifier instanceof Window) {
        return createWindowProxy(identifier);
    } else if (identifier instanceof Location) {
        return createLocationProxy(identifier);
    } else if (identifier instanceof Document) {
        return document;
    }

    return identifier;
}