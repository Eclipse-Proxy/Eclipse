function createLocationProxy(loc = window.location) {
    return new Proxy({}, {
        get(_target, prop) {
            const decodedLocation = new URL(__eclipse$rewrite.url.decode(loc.href));

            switch (prop) {
                case "constructor":
                    return loc.constructor;
                case "assign":
                    return url => loc.assign(__eclipse$rewrite.url.encode(url, window.location.href));
                case "reload":
                    return () => loc.reload();
                case "replace":
                    return url => loc.replace(__eclipse$rewrite.url.encode(url, window.location.href));
                case "toString":
                    return () => decodedLocation.toString();
                default:
                    return decodedLocation[prop];
            }
        },
        set(_target, prop, value) {
            const decodedLocation = new URL(__eclipse$rewrite.url.decode(loc.href));

            if (!(prop in decodedLocation)) {
                return false;
            }

            decodedLocation[prop] = value;
            loc.href = __eclipse$rewrite.url.encode(decodedLocation.href, window.location.href);
            return true;
        }
    });
}

export { createLocationProxy };