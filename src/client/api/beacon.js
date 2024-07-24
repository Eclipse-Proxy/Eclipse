window.navigator.sendBeacon = new Proxy(window.navigator.sendBeacon, {
    apply(target, thisArg, argArray) {
        if (argArray[0]) {
            argArray[0] = __eclipse$rewrite.url.encode(argArray[0], window.location.href);
        }

        return Reflect.apply(target, thisArg, argArray);
    },
});