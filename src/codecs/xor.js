const xor = {
    encode(url = "") {
        return encodeURIComponent(
            url
                .toString()
                .split("")
                .map((char, ind) =>
                    ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char
                )
                .join("")
        );
    },
    decode(url = "") {
        let [input, ...search] = url.split("?");

        return (
            decodeURIComponent(input)
                .split("")
                .map((char, ind) =>
                    ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
                )
                .join("") + (search.length ? "?" + search.join("?") : "")
        );
    },
};

export { xor };