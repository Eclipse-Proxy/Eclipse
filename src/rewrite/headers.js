const cspHeaders = [
	"cross-origin-embedder-policy",
	"cross-origin-opener-policy",
	"cross-origin-resource-policy",
	"content-security-policy",
	"content-security-policy-report-only",
	"expect-ct",
	"feature-policy",
	"origin-isolation",
	"strict-transport-security",
	"upgrade-insecure-requests",
	"x-content-type-options",
	"x-download-options",
	"x-frame-options",
	"x-permitted-cross-domain-policies",
	"x-powered-by",
	"x-xss-protection",
	"clear-site-data",
];

const urlHeaders = ["location", "content-location", "referer"];

const requestHeaders = ["host", "origin", "referrer"];

async function request(oldHeaders, origin) {
	let newHeaders = new Headers(oldHeaders);

	for (let reqHeader of requestHeaders) {
		if (newHeaders.has(reqHeader)) {
			newHeaders.set(
				reqHeader,
				self.__eclipse$config.codec.encode(newHeaders.get(reqHeader), origin)[
					reqHeader
				]
			);
		}
	}

	if (newHeaders.has("authenticate")) {
		//Todo
	}

	newHeaders.set("cookie", await self.__eclipse$rewrite.cookie.request(origin));

	return newHeaders;
}

async function response(oldHeaders, origin) {
	let newHeaders = new Headers(oldHeaders);

	for (let cspHeader of cspHeaders) {
		if (newHeaders.has(cspHeader)) {
			newHeaders.delete(cspHeader);
		}
	}

	for (let urlHeader of urlHeaders) {
		if (newHeaders.has(urlHeader)) {
			newHeaders.set(
				urlHeader,
				self.__eclipse$config.codec.encode(newHeaders.get(urlHeader), origin)
			);
		}
	}

	if (newHeaders.has("link")) {
		newHeaders.set(
			"link",
			newHeaders.get("link").replace(/<(.*?)>/gi, (match) => {
				return self.__eclipse$config.codec.encode(match);
			})
		);
	}

	if (newHeaders.has("www-authenticate")) {
		//Todo
	}

	if (newHeaders.has("set-cookie")) {
		await __eclipse$rewrite.cookie.response(
			newHeaders.get("set-cookie"),
			origin
		);
	}

	return newHeaders;
}

const headers = { request, response };

export { headers };
