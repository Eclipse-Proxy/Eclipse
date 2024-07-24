window.history.pushState = new Proxy(window.history.pushState, {
    apply(target, thisArg, argArray) {
        if (argArray[3]) {
            argArray[3] =  __eclipse$rewrite.url.encode(argArray[3], window.location.href);
        }

        return Reflect.apply(target, thisArg, argArray);
    },
});

window.history.replaceState = new Proxy(window.history.replaceState, {
    apply(target, thisArg, argArray) {
        if (argArray[3]) {
            argArray[3] =  __eclipse$rewrite.url.encode(argArray[3], window.location.href);
        }

        return Reflect.apply(target, thisArg, argArray);
    },
});