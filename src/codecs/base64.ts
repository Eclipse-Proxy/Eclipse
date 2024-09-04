const base64 = {
	encode: (url: string = ""): string => {
		return encodeURIComponent(btoa(url));
	},
	decode: (url: string = ""): string => {
		return decodeURIComponent(atob(url));
	},
};

export { base64 };
