const plain = {
    encode: (url) => {
        return encodeURIComponent(url);
    },
    decode: (url) => {
        return decodeURIComponent(url);
    },
};

export { plain };