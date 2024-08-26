import { parse } from "set-cookie-parser";
import IDBMap from "@webreflection/idb-map";

const originalCookieDescriptor = Object.getOwnPropertyDescriptor(
	Document.prototype,
	"cookie"
);

Object.defineProperty(window.document, "cookie", {
	get() {
		return originalCookieDescriptor.get.call(window.document);
	},
	async set(cookie) {
		const cookiesJar = new IDBMap(
			new URL(self.__eclipse$rewrite.url.decode(window.location.href)).host,
			{
				durability: "relaxed",
				prefix: "@eclipse/cookies",
			}
		);

		const cookies = parse(cookie, {
			silent: true,
		});

		for (const cookie of cookies) {
			await cookiesJar.set(cookie.name, cookie);
		}

		let proxiedCookie = cookie;
		originalCookieDescriptor.set.call(document, proxiedCookie);
	},
});
