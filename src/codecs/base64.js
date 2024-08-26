const base64 = {
	encode: (url = "") => {
		return encodeURIComponent(btoa(url));
	},
	decode: (url = "") => {
		return decodeURIComponent(atob(url));
	},
};

export { base64 };
