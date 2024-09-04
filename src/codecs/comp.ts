import { inflateSync, deflateSync } from "fflate";

const comp = {
	encode: (url: string = ""): string => {
		const encoded = new TextEncoder().encode(url);
		const zip = deflateSync(encoded, { level: 9 });
		return encodeURIComponent(btoa(String.fromCharCode(...zip)));
	},
	decode: (url: string = ""): string => {
		const array = Uint8Array.from(decodeURIComponent(atob(url)), (c) =>
			c.charCodeAt(0)
		);
		const unzip = inflateSync(array);
		return new TextDecoder().decode(unzip);
	},
};

export { comp };
