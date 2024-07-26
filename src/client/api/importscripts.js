if ("importScripts" in self) {
    self.importScripts = new Proxy(self.importScripts, {
        apply(target, thisArg, argArray) {
            if (argArray) {
                argArray = argArray.map((arg) => __eclipse$rewrite.url.encode(arg, self.location.href));
            }

            return Reflect.apply(target, thisArg, argArray);
        }
    });
}