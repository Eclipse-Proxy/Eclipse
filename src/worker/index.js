import { BareClient } from "@mercuryworkshop/bare-mux";

self.EclipseServiceWorker = class EclipseServiceWorker {
    constructor() {
        this.client = new BareClient();
    }
    route({ request }) {
        return request.url.startsWith(location.origin + self.__eclipse$config.prefix);
    }
    async fetch({ request }) {
        const url = self.__eclipse$rewrite.url.decode(request.url)

        const requestHeaders = self.__eclipse$rewrite.headers.request(Object.assign({}, request.headers));

        const response = await this.client.fetch(url, {
            method: request.method,
            body: request.body,
            headers: requestHeaders,
            credentials: "omit",
            mode: request.mode === "cors" ? request.mode : "same-origin",
            cache: request.cache,
            redirect: request.redirect,
            duplex: "half",
        });

        const responseHeaders = self.__eclipse$rewrite.headers.response(response.rawHeaders);

        return new Response(response.body, {
            headers: responseHeaders,
            status: response.status,
            statusText: response.statusText,
        });
    }
}