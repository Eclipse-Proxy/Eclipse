const xor = {
	encode(url: string = ""): string {
		return encodeURIComponent(
			url
				.toString()
				.split("")
				.map((char, ind) =>
					ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
				)
				.join("")
		);
	},
	decode(url: string = ""): string {
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
