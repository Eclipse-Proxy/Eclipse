import { BareClient } from "@mercuryworkshop/bare-mux";

self.EclipseServiceWorker = class EclipseServiceWorker {
    constructor() {
        this.client = new BareClient();
    }
    route({ request }) {
        return request.url.startsWith(location.origin + self.__eclipse$config.prefix);
    }
    async fetch({ request }) {
        if (!request.url.startsWith(location.origin + self.__eclipse$config.prefix)) {
            return await fetch(request);
        }

        const files = ["codecs", "config", "rewrite", "worker"];

        for (let file of files) {
            if (request.url == location.origin + self.__eclipse$config[file]) {
                return await fetch(request);
            }
        }

        try {
            const url = self.__eclipse$rewrite.url.decode(request.url);

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

            let body;
            if (response.body) {
                //Only rewrites when added with a script/style tag etc.
                switch (request.destination) {
                    case "iframe":
                    case "document":
                        //Maybe add more content-types to debug rewriting
                        if (responseHeaders.get("content-type").startsWith("text/html")) {
                            body = self.__eclipse$rewrite.html(await response.text());
                        } else {
                            body = response.body;
                        }
                        break;
                    case "script":
                        body = self.__eclipse$rewrite.javascript(await response.text());
                        break;
                    case "style":
                        body = self.__eclipse$rewrite.css(await response.text());
                        break;
                    case "sharedworker":
                    case "worker":
                        //Todo
                        body = await response.text();
                        break;
                    default:
                        body = response.body;
                        break;
                }
            }

            return new Response(body, {
                headers: responseHeaders,
                status: response.status,
                statusText: response.statusText,
            });
        } catch (error) {
            return new Response(error, {
                headers: {
                    "content-type": "text/plain",
                },
                status: 500,
            });
        }
    }
}