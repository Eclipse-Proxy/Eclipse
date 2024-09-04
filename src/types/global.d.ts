import { BareClient } from "@mercuryworkshop/bare-mux";
import { WebAppManifest } from "web-app-manifest";

interface Codec {
	encode: (url: string) => string;
	decode: (url: string) => string;
}

declare global {
	interface Window {
		__eclipse$config: {
			prefix: string;
			codec: Codec;
			codecs: string;
			config: string;
			rewrite: string;
			worker: string;
			client: string;
		};
		__eclipse$codecs: {
			plain: Codec;
			xor: Codec;
			base64: Codec;
			hex: Codec;
            comp: Codec;
		};
		__eclipse$rewrite: {
			url: {
                encode: (url: string, origin: string) => string;
                decode: (url: string) => string;
            };
			headers: {
                request: (oldHeaders: Headers, origin: string) => Promise<Headers>;
                response: (oldHeaders: Headers, origin: string) => Promise<Headers>;
            };
			css: (code: string, context: "stylesheet" | "declarationList", origin: string) => string;
			html: (code: string, origin: string, fragment?: boolean) => string;
			javascript: (code: string, origin: string) => string;
			srcset: (set: string, origin: string) => string;
			cookie: {
                request: (origin: string) => Promise<string>;
                response: (heade: string, origin: string) => Promise<void>;
            };
			manifest: (code: WebAppManifest, origin: string) => string;
		};
        __eclipse$scope: (identifier: any) => any;
		EclipseServiceWorker: any;
	}
}
