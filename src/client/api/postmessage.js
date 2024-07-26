window.postMessage = new Proxy(window.postMessage, {
    apply(target, thisArg, argArray) {
        if (argArray[1]) {
            argArray[1] = __eclipse$rewrite.url.encode(argArray[0], window.location.href);
        }

        return Reflect.apply(target, thisArg, argArray);
    },
});