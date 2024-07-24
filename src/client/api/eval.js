window.eval = new Proxy(window.eval, {
    apply(target, thisArg, argArray) {
        if (argArray[0]) {
            argArray[0] = __eclipse$rewrite.javascript(argArray[0], window.location.href);
        }

        return Reflect.apply(target, thisArg, argArray);
    },
});