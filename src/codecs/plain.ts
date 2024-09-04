const plain = {
	encode: (url: string = ""): string => {
		return encodeURIComponent(url);
	},
	decode: (url: string = ""): string => {
		return decodeURIComponent(url);
	},
};

export { plain };
