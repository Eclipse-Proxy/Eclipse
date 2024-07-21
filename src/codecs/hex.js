const hex = {
    encode: (url = "") => {
        var s = encodeURIComponent(url)
        var h = ""
        for (var i = 0; i < s.length; i++) {
            h += s.charCodeAt(i).toString(16)
        }
        return h
    },
    decode: (url = "") => {
        var s = ""
        for (var i = 0; i < url.length; i += 2) {
            s += String.fromCharCode(parseInt(url.substr(i, 2), 16))
        }
        return decodeURIComponent(s)
    }
};

export { hex };