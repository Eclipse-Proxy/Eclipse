self.__eclipse$scope = (identifier) => {
    if (identifier instanceof Window) {
        return window;
    } else if (identifier instanceof Location) {
        return location;
    } else if (identifier instanceof Document) {
        return document;
    }

    return identifier;
}