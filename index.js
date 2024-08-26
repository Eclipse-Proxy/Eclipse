import { spawn } from "node:child_process";
import { createServer } from "node:http";
import express from "express";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";

spawn("pnpm", ["rspack", "-w"], {
	detached: true,
});

logging.set_level(logging.ERROR);

const port = process.env.PORT || 4000;
const server = createServer();
const app = express();

app.use("/eclipse/", express.static("dist"));
app.use(
	express.static("public", {
		index: "index.html",
		extensions: ["html"],
	})
);
app.use("/baremux/", express.static(baremuxPath));
app.use("/libcurl/", express.static(libcurlPath));

server.on("request", (req, res) => {
	app(req, res);
});

server.on("upgrade", (req, socket, head) => {
	if (req.url && req.url.endsWith("/wisp/")) {
		wisp.routeRequest(req, socket, head);
	} else {
		socket.end();
	}
});

server.listen(port, () => {
	console.log(`Eclipse listening on port ${port}`);
});
