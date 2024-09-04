import { BareClient, BareResponse } from "@mercuryworkshop/bare-mux";

self.EclipseServiceWorker = class EclipseServiceWorker {
	client: BareClient;
	constructor() {
		this.client = new BareClient();
	}
	route({ request }): boolean {
		return request.url.startsWith(
			location.origin + self.__eclipse$config.prefix
		);
	}
	async fetch({ request }): Promise<Response> {
		if (
			!request.url.startsWith(location.origin + self.__eclipse$config.prefix)
		) {
			return await fetch(request);
		}

		const files: Array<string> = [
			"codecs",
			"config",
			"rewrite",
			"worker",
			"client",
		];

		for (const file of files) {
			if (request.url == location.origin + self.__eclipse$config[file]) {
				return await fetch(request);
			}
		}

		try {
			const url: string = self.__eclipse$rewrite.url.decode(request.url);

			const requestHeaders: Headers =
				await self.__eclipse$rewrite.headers.request(
					Object.assign({}, request.headers),
					request.url
				);

			interface ClientResponse extends BareResponse {
				finalURL: string;
			}

			const response: ClientResponse = await this.client.fetch(url, {
				method: request.method,
				body: request.body,
				headers: requestHeaders,
				credentials: "omit",
				mode: request.mode === "cors" ? request.mode : "same-origin",
				cache: request.cache,
				redirect: request.redirect,
				//@ts-ignore
				duplex: "half",
			});

			const responseHeaders: Headers =
				await self.__eclipse$rewrite.headers.response(
					//@ts-ignore
					response.rawHeaders,
					request.url
				);

			let body: any;

			if (response.body) {
				const contentType: string =
					responseHeaders.has("content-type") &&
					responseHeaders.get("content-type");
				switch (request.destination) {
					case "iframe":
					case "document":
						if (contentType) {
							if (contentType.startsWith("text/html")) {
								body = self.__eclipse$rewrite.html(
									await response.text(),
									request.url
								);
							} else if (contentType.startsWith("text/css")) {
								body = self.__eclipse$rewrite.css(
									await response.text(),
									"stylesheet",
									request.url
								);
							} else if (
								contentType.startsWith("text/javascript") ||
								contentType.startsWith("application/javascript")
							) {
								body = self.__eclipse$rewrite.javascript(
									await response.text(),
									request.url
								);
							} else {
								body = response.body;
							}
						} else {
							body = response.body;
						}
						break;
					case "sharedworker":
					case "worker":
					case "serviceworker":
					case "script":
						body = self.__eclipse$rewrite.javascript(
							await response.text(),
							request.url
						);
						break;
					case "style":
						body = self.__eclipse$rewrite.css(
							await response.text(),
							"stylesheet",
							request.url
						);
						break;
					case "manifest":
						body = self.__eclipse$rewrite.manifest(
							await response.json(),
							request.url
						);
						break;
					default:
						if (contentType) {
							if (contentType.startsWith("text/html")) {
								body = self.__eclipse$rewrite.html(
									await response.text(),
									request.url
								);
							} else if (contentType.startsWith("text/css")) {
								body = self.__eclipse$rewrite.css(
									await response.text(),
									"stylesheet",
									request.url
								);
							} else if (
								contentType.startsWith("text/javascript") ||
								contentType.startsWith("application/javascript")
							) {
								body = self.__eclipse$rewrite.javascript(
									await response.text(),
									request.url
								);
							} else {
								body = response.body;
							}
						} else {
							body = response.body;
						}
						break;
				}
			}

			if (["document", "iframe"].includes(request.destination)) {
				const contentDisposition: string = responseHeaders.get(
					"content-disposition"
				);

				if (
					!/\s*?((inline|attachment);\s*?)filename=/i.test(contentDisposition)
				) {
					const type = /^\s*?attachment/i.test(contentDisposition)
						? "attachment"
						: "inline";
					const [filename] = response.finalURL.split("/").reverse();
					responseHeaders.set(
						"content-disposition",
						`${type}; filename=${JSON.stringify(filename)}`
					);
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
};
