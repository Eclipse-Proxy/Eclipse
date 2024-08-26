importScripts("/eclipse/eclipse.codecs.js");
importScripts("/eclipse/eclipse.config.js");
importScripts("/eclipse/eclipse.rewrite.js");
importScripts("/eclipse/eclipse.worker.js");

const eclipse = new EclipseServiceWorker();

async function handleRequest(e) {
	if (eclipse.route(e)) {
		return await eclipse.fetch(e);
	}

	return await fetch(e.request);
}

self.addEventListener("fetch", (e) => {
	e.respondWith(handleRequest(e));
});
