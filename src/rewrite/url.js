function encode(url) {
    if (url.startsWith("javascript:")) {
        return self.__eclipse$rewrite.javascript(url);
    } else if (/^(#|about|data|mailto|blob)/.test(url)) {
        return url;
    } else {
        if (location.pathname.startsWith(self.__eclipse$config.prefix)) {
            let origin = self.__eclipse$rewrite.url.decode(location.href).origin;
            url = new URL(url, origin).toString();
        }

        return location.origin + self.__eclipse$config.prefix + self.__eclipse$config.codec.encode(url);
    }
}

function decode(url) {
    if (/^(#|about|data|mailto|javascript|blob)/.test(url)) {
        return url;
    } else {
        return self.__eclipse$config.codec.decode(url.split(self.__eclipse$config.prefix)[1]);
    }
}

const url = { encode, decode };

export { url };