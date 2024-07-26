window.navigator.sendBeacon = new Proxy(window.navigator.sendBeacon, {
    apply(target, thisArg, argArray) {
        if (argArray[0]) {
            argArray[0] = __eclipse$rewrite.url.encode(argArray[0], window.location.href);
        }

        return Reflect.apply(target, thisArg, argArray);
    },
});

window.navigator.serviceWorker.register = new Proxy(window.navigator.serviceWorker.register, {
    apply(target, thisArg, argArray) {
        if (argArray[0]) {
            argArray[0] = __eclipse$rewrite.url.encode(argArray[0], window.location.href);
        }

        if (argArray[1]) {
            if (typeof argArray[1] == "object" && !Array.isArray(argArray[1])) {
                if (argArray[1].scope) {
                    argArray[1].scope = __eclipse$rewrite.url.encode(argArray[1].scope, window.location.href);
                }
            }
        }

        return Reflect.apply(target, thisArg, argArray);
    },
});