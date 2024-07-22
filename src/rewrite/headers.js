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

function request(oldHeaders, origin) {
    let newHeaders = new Headers(oldHeaders);

    return newHeaders;
}

function response(oldHeaders, origin) {
    let newHeaders = new Headers(oldHeaders);

    for (let cspHeader of cspHeaders) {
        if (newHeaders.has(cspHeader)) {
            newHeaders.delete(cspHeader)
        }
    }

    for (let urlHeader of urlHeaders) {
        if (newHeaders.has(urlHeader)) {
            newHeaders.set(urlHeader, self.__eclipse$config.codec.encode(newHeaders.get(urlHeader), origin));
        }
    }

    if (newHeaders.has("link")) {
        newHeaders.set("link", newHeaders[header].replace(/<(.*?)>/gi, (match) => {
            return self.__eclipse$config.codec.encode(match);
        }));
    }

    return newHeaders;
}

const headers = { request, response };

export { headers };