import { WebAppManifest } from "web-app-manifest";

const urlProps: Set<string> = new Set([
	"start_url",
	"id",
	"scope",
	"start_url",
]);
const srcChildren: Set<string> = new Set(["icons", "screenshots"]);
const urlChildren: Set<string> = new Set([
	"shortcuts",
	"protocol_handlers",
	"related_applications",
]);

function manifest(code: WebAppManifest, origin): string {
	try {
		for (const prop in code) {
			if (urlProps.has(prop)) {
				code[prop] = self.__eclipse$rewrite.url.encode(code[prop], origin);
			} else if (srcChildren.has(prop)) {
				for (const child of code[prop]) {
					if ("src" in child) {
						child.src = self.__eclipse$rewrite.url.encode(child.src, origin);
					}
				}
			} else if (urlChildren.has(prop)) {
				for (const child of code[prop]) {
					if ("url" in child) {
						child.url = self.__eclipse$rewrite.url.encode(child.url, origin);
					}
				}
			} else if (prop == "share_target") {
				if ("action" in code[prop]) {
					code[prop].action = self.__eclipse$rewrite.url.encode(
						code[prop].action,
						origin
					);
				}
			} else if (prop == "file_handlers") {
				for (const child of code[prop]) {
					if ("action" in child) {
						child.action = self.__eclipse$rewrite.url.encode(
							child.action,
							origin
						);
					}
				}
			}
		}

		return JSON.stringify(code, null, 2);
	} catch {
		return "{}";
	}
}

export { manifest };
