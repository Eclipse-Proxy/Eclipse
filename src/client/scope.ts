import { createWindowProxy } from "./window.ts";
import { createLocationProxy } from "./location.ts";
import { createDocumentProxy } from "./document.ts";

function scope(identifier: any): any {
	const globals: Array<string> = [
		"window",
		"self",
		"globalThis",
		"parent",
		"top",
		"document",
		"frames",
	];

	if (
		globals.filter((global: string) =>
			window[global].Window
				? identifier instanceof window[global].Window
				: false
		).length > 0
	) {
		return createWindowProxy(identifier);
	} else if (identifier instanceof Location) {
		return createLocationProxy(identifier);
	} else if (identifier instanceof Document) {
		return createDocumentProxy(identifier);
	}

	return identifier;
}

self.__eclipse$scope = new Proxy(
	{},
	{
		get(_target, prop: string) {
			return scope(self[prop]);
		},
        //@ts-ignore
        set(target, prop, newValue) {
			if (prop == "location") {
                //@ts-ignore
				return (window.location = self.__eclipse$rewrite.url.encode(
					newValue,
					window.location.href
				));
			}
			target[prop] = newValue;
			return true;
		},
	}
);
