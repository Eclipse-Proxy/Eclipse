function encode(url) {
    return self.__eclipse$config.codec.encode(url);
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