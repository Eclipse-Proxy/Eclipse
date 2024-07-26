window.document.open = new Proxy(window.document.open, {
    apply(target, thisArg, argArray) {
        if (argArray.length === 3) {
            argArray[0] = __eclipse$rewrite.url.encode(argArray[0], window.location.href);
            return window.open(...args);
        }

        return Reflect.apply(target, thisArg, argArray);
    },
});

Object.defineProperty(window.document, "domain", {
    get() {
        return new URL(__eclipse$rewrite.url.decode(window.location.href)).host;
    },
    set(value) {
        return value;
    }
});

let originalDocumentbaseURI = window.document.baseURI;
Object.defineProperty(window.document, "baseURI", {
    get() {
        return __eclipse$rewrite.url.decode(originalDocumentbaseURI);
    },
    set(value) {
        return value;
    }
});