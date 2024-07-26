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

        const files = ["codecs", "config", "rewrite", "worker", "client"];

        for (let file of files) {
            if (request.url == location.origin + self.__eclipse$config[file]) {
                return await fetch(request);
            }
        }

        try {
            const url = self.__eclipse$rewrite.url.decode(request.url);

            const requestHeaders = await self.__eclipse$rewrite.headers.request(Object.assign({}, request.headers), request.url);

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

            const responseHeaders = await self.__eclipse$rewrite.headers.response(response.rawHeaders, request.url);

            let body;

            if (response.body) {
                let contentType = responseHeaders.has("content-type") && responseHeaders.get("content-type");
                switch (request.destination) {
                    case "iframe":
                    case "document":
                        if (contentType) {
                            if (contentType.startsWith("text/html")) {
                                body = self.__eclipse$rewrite.html(await response.text(), request.url);
                            } else if (contentType.startsWith("text/css")) {
                                body = self.__eclipse$rewrite.css(await response.text(), "stylesheet", request.url);
                            } else if (contentType.startsWith("text/javascript") || contentType.startsWith("application/javascript")) {
                                body = self.__eclipse$rewrite.javascript(await response.text(), request.url);
                            } else {
                                body = response.body;
                            }
                        } else {
                            body = response.body
                        }
                        break;
                    case "sharedworker":
                    case "worker":
                    case "serviceworker":
                    case "script":
                        body = self.__eclipse$rewrite.javascript(await response.text(), request.url);
                        break;
                    case "style":
                        body = self.__eclipse$rewrite.css(await response.text(), "stylesheet", request.url);
                        break;
                    case "manifest":
                        //Todo
                        body = await response.text();
                    default:
                        if (contentType) {
                            if (contentType.startsWith("text/html")) {
                                body = self.__eclipse$rewrite.html(await response.text(), request.url);
                            } else if (contentType.startsWith("text/css")) {
                                body = self.__eclipse$rewrite.css(await response.text(), "stylesheet", request.url);
                            } else if (contentType.startsWith("text/javascript") || contentType.startsWith("application/javascript")) {
                                body = self.__eclipse$rewrite.javascript(await response.text(), request.url);
                            } else {
                                body = response.body;
                            }
                        } else {
                            body = response.body
                        }
                        break;
                }
            }

            if (["document", "iframe"].includes(request.destination)) {
                const contentDisposition = responseHeaders.get("content-disposition");

                if (!/\s*?((inline|attachment);\s*?)filename=/i.test(contentDisposition)) {
                    const type = /^\s*?attachment/i.test(contentDisposition) ? "attachment" : "inline";
                    const [filename] = response.finalURL.split("/").reverse();
                    responseHeaders.set("content-disposition", `${type}; filename=${JSON.stringify(filename)}`);
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