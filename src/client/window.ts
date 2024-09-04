import { createDocumentProxy } from "./document.ts";
import { createLocationProxy } from "./location.ts";

function createWindowProxy(win: Window = window): any {
	return new Proxy(win, {
		get(target, prop: string) {
			const value: any = target[prop];

			if (prop == "location") {
				return createLocationProxy(value);
			} else if (prop == "document") {
				return createDocumentProxy(value);
			} else if (
				["window", "self", "globalThis", "parent", "top", "frames"].includes(
					prop
				)
			) {
				return createWindowProxy(value);
			}

			if (typeof value == "function") {
				return value.bind(target);
			} else {
				return value;
			}
		},
		//@ts-ignore
		set(target, prop, newValue) {
			if (prop == "location") {
				return (win.location = self.__eclipse$rewrite.url.encode(
					newValue,
					window.location.href
				));
			}
			target[prop] = newValue;
			return true;
		},
	});
}

export { createWindowProxy };
