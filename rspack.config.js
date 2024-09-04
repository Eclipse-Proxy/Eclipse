import { defineConfig } from "@rspack/cli";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	mode: "development",
	entry: {
		codecs: join(__dirname, "src/codecs/index.ts"),
		config: join(__dirname, "src/config/index.ts"),
		rewrite: join(__dirname, "src/rewrite/index.ts"),
		worker: join(__dirname, "src/worker/index.ts"),
		client: join(__dirname, "src/client/index.ts"),
	},
	output: {
		filename: "eclipse.[name].js",
		path: join(__dirname, "dist"),
		clean: true,
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				loader: "builtin:swc-loader",
				options: {
					jsc: {
						parser: {
							syntax: "typescript",
						},
					},
				},
				type: "javascript/auto",
			},
		],
	},
});
