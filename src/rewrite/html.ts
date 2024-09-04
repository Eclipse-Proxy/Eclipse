import { parse, parseFragment, serialize } from "parse5";

function html(code: string, origin: string, fragment: boolean = false): string {
	const dom: any = fragment ? parseFragment(code) : parse(code);
	const elements: Array<any> = [];

	function addNode(node: any) {
		elements.push(node);
		if (node.childNodes) {
			for (const childNode of node.childNodes) {
				addNode(childNode);
			}
		}
		return node;
	}

	for (const node of dom.childNodes) {
		addNode(node);
	}

	const scripts: Set<string> = new Set([
		"client",
		"rewrite",
		"config",
		"codecs",
	]);
	const urlAttributes: Set<string> = new Set([
		"href",
		"src",
		"action",
		"formaction",
		"ping",
		"profile",
		"movie",
		"poster",
		"background",
		"data",
	]);
	const deleteAttributes: Set<string> = new Set([
		"http-equiv",
		"nonce",
		"integrity",
		"crossorigin",
		"sandbox",
		"csp",
	]);
	const srcSetAttributes: Set<string> = new Set(["srcset", "imagesrcset"]);
	const htmlAttributes: Set<string> = new Set(["srcdoc"]);
	const cssAttributes: Set<string> = new Set(["style"]);
	const javascriptAttributes: Set<string> = new Set([
		"onafterprint",
		"onbeforeprint",
		"onbeforeunload",
		"onerror",
		"onhashchange",
		"onload",
		"onmessage",
		"onoffline",
		"ononline",
		"onpagehide",
		"onpopstate",
		"onstorage",
		"onunload",
		"onblur",
		"onchange",
		"oncontextmenu",
		"onfocus",
		"oninput",
		"oninvalid",
		"onreset",
		"onsearch",
		"onselect",
		"onsubmit",
		"onkeydown",
		"onkeypress",
		"onkeyup",
		"onclick",
		"ondblclick",
		"onmousedown",
		"onmousemove",
		"onmouseout",
		"onmouseover",
		"onmouseup",
		"onmousewheel",
		"onwheel",
		"ondrag",
		"ondragend",
		"ondragenter",
		"ondragleave",
		"ondragover",
		"ondragstart",
		"ondrop",
		"onscroll",
		"oncopy",
		"oncut",
		"onpaste",
		"onabort",
		"oncanplay",
		"oncanplaythrough",
		"oncuechange",
		"ondurationchange",
		"onemptied",
		"onended",
		"onerror",
		"onloadeddata",
		"onloadedmetadata",
		"onloadstart",
		"onpause",
		"onplay",
		"onplaying",
		"onprogress",
		"onratechange",
		"onseeked",
		"onseeking",
		"onstalled",
		"onsuspend",
		"ontimeupdate",
		"onvolumechange",
		"onwaiting",
	]);
	const cssElements: Set<string> = new Set(["style"]);
	const javascriptElements: Set<string> = new Set(["script"]);

	const elementsWithAttrs: any = elements.filter((elem) => elem.attrs);

	const head: any = elements.find(
		(elem) => elem.tagName && elem.tagName.toLowerCase() == "head"
	);
	if (head) {
		for (const script of scripts) {
			head.childNodes.unshift({
				tagName: "script",
				nodeName: "script",
				childNodes: [],
				attrs: [
					{
						name: "src",
						value: location.origin + self.__eclipse$config[script],
					},
				],
			});
		}
	}

	for (const item of elementsWithAttrs) {
		for (const attribute in item.attrs) {
			const attrName = item.attrs[attribute].name;
			const attrValue = item.attrs[attribute].value;

			if (urlAttributes.has(attrName)) {
				item.attrs.push({
					name: `data-eclipse-attr-${attrName}`,
					value: attrValue,
				});
				item.attrs[attribute].value = self.__eclipse$rewrite.url.encode(
					attrValue,
					origin
				);
			}

			if (deleteAttributes.has(attrName)) {
				item.attrs[attribute].name = `data-eclipse-attr-${attrName}`;
			}

			if (srcSetAttributes.has(attrName)) {
				item.attrs.push({
					name: `data-eclipse-attr-${attrName}`,
					value: attrValue,
				});
				item.attrs[attribute].value = self.__eclipse$rewrite.srcset(
					attrValue,
					origin
				);
			}

			if (htmlAttributes.has(attrName)) {
				item.attrs.push({
					name: `data-eclipse-attr-${attrName}`,
					value: attrValue,
				});
				item.attrs[attribute].value = self.__eclipse$rewrite.html(
					attrValue,
					origin
				);
			}

			if (cssAttributes.has(attrName)) {
				item.attrs.push({
					name: `data-eclipse-attr-${attrName}`,
					value: attrValue,
				});
				item.attrs[attribute].value = self.__eclipse$rewrite.css(
					attrValue,
					"declarationList",
					origin
				);
			}

			if (javascriptAttributes.has(attrName)) {
				item.attrs.push({
					name: `data-eclipse-attr-${attrName}`,
					value: attrValue,
				});
				item.attrs[attribute].value = self.__eclipse$rewrite.javascript(
					attrValue,
					origin
				);
			}
		}
	}

	for (const item of elements) {
		if (cssElements.has(item.tagName?.toLowerCase())) {
			for (const childNode of item.childNodes) {
				if (childNode.value) {
					childNode.value = self.__eclipse$rewrite.css(
						childNode.value,
						"stylesheet",
						origin
					);
				}
			}
		}

		if (javascriptElements.has(item.tagName?.toLowerCase())) {
			if (
				!item.attrs.filter((attr) => attr.name == "type")[0] ||
				item.attrs.filter((attr) => attr.name == "type")[0].value !==
					"application/json"
			) {
				for (const childNode of item.childNodes) {
					if (childNode.value) {
						childNode.value = self.__eclipse$rewrite.javascript(
							childNode.value,
							origin
						);
					}
				}
			}
		}
	}

	return serialize(dom);
}

export { html };
