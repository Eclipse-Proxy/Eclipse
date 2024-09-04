import { BareClient } from "@mercuryworkshop/bare-mux";

const client: BareClient = new BareClient();

window.WebSocket = new Proxy(window.WebSocket, {
	construct(target, args) {
		return client.createWebSocket(
			args[0],
			args[1],
			target,
			{
				"User-Agent": navigator.userAgent,
			},
			ArrayBuffer.prototype
		);
	},
});
