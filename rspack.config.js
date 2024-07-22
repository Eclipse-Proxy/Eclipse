import { defineConfig } from "@rspack/cli";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    mode: "development",
    entry: {
        codecs: join(__dirname, "src/codecs/index.js"),
        config: join(__dirname, "src/config/index.js"),
        rewrite: join(__dirname, "src/rewrite/index.js"),
        worker: join(__dirname, "src/worker/index.js"),
        client: join(__dirname, "src/client/index.js"),
    },
    output: {
        filename: "eclipse.[name].js",
        path: join(__dirname, "dist"),
        clean: true,
    },
    watch: true,
});