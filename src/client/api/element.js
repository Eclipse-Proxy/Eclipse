import { createDocumentProxy } from "../document.js";
import { createWindowProxy } from "../window.js";

const htmlElements = new Set([
	"HTMLElement",
	"HTMLAnchorElement",
	"HTMLAreaElement",
	"HTMLAudioElement",
	"HTMLBaseElement",
	"HTMLBodyElement",
	"HTMLBRElement",
	"HTMLButtonElement",
	"HTMLCanvasElement",
	"HTMLDataElement",
	"HTMLDataListElement",
	"HTMLDialogElement",
	"HTMLDivElement",
	"HTMLDListElement",
	"HTMLEmbedElement",
	"HTMLFieldSetElement",
	"HTMLFontElement",
	"HTMLFormElement",
	"HTMLFrameElement",
	"HTMLFrameSetElement",
	"HTMLHeadingElement",
	"HTMLHeadElement",
	"HTMLHRElement",
	"HTMLHtmlElement",
	"HTMLIFrameElement",
	"HTMLImageElement",
	"HTMLInputElement",
	"HTMLLabelElement",
	"HTMLLegendElement",
	"HTMLLIElement",
	"HTMLLinkElement",
	"HTMLMapElement",
	"HTMLMarqueeElement",
	"HTMLMediaElement",
	"HTMLMenuElement",
	"HTMLMetaElement",
	"HTMLMeterElement",
	"HTMLModElement",
	"HTMLObjectElement",
	"HTMLOListElement",
	"HTMLOptGroupElement",
	"HTMLOptionElement",
	"HTMLOutputElement",
	"HTMLParagraphElement",
	"HTMLParamElement",
	"HTMLPictureElement",
	"HTMLPreElement",
	"HTMLProgressElement",
	"HTMLQuoteElement",
	"HTMLScriptElement",
	"HTMLSelectElement",
	"HTMLSlotElement",
	"HTMLSourceElement",
	"HTMLSpanElement",
	"HTMLStyleElement",
	"HTMLTableCaptionElement",
	"HTMLTableCellElement",
	"HTMLTableColElement",
	"HTMLTableElement",
	"HTMLTableRowElement",
	"HTMLTableSectionElement",
	"HTMLTemplateElement",
	"HTMLTextAreaElement",
	"HTMLTimeElement",
	"HTMLTitleElement",
	"HTMLTrackElement",
	"HTMLUListElement",
	"HTMLUnknownElement",
	"HTMLVideoElement",
]);
const urlAttributes = new Set([
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
const deleteAttributes = new Set([
	"http-equiv",
	"nonce",
	"integrity",
	"crossorigin",
	"sandbox",
	"csp",
]);
const srcSetAttributes = new Set(["srcset", "imagesrcset"]);
const htmlAttributes = new Set(["srcdoc"]);
const cssAttributes = new Set(["style"]);
const javascriptAttributes = new Set([
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
const allAttributes = new Set([
	...urlAttributes,
	...deleteAttributes,
	...srcSetAttributes,
	...htmlAttributes,
	...javascriptAttributes,
]);

Object.defineProperty(Node.prototype, "baseURI", {
	get() {
		return window.document.baseURI;
	},
});

let originalElementInnerHTML = Object.getOwnPropertyDescriptor(
	Element.prototype,
	"innerHTML"
);
Object.defineProperty(Element.prototype, "innerHTML", {
	set(value) {
		if (this instanceof HTMLScriptElement) {
			originalElementInnerHTML.set.call(
				this,
				__eclipse$rewrite.javascript(value, window.location.href)
			);
		} else if (this instanceof HTMLStyleElement) {
			originalElementInnerHTML.set.call(
				this,
				__eclipse$rewrite.css(value, window.location.href)
			);
		} else {
			originalElementInnerHTML.set.call(
				this,
				__eclipse$rewrite.html(value, window.location.href, true)
			);
		}

		return value;
	},
	get() {
		return originalElementInnerHTML.get.call(this);
	},
});

let originalElementInnerText = Object.getOwnPropertyDescriptor(
	Element.prototype,
	"innerText"
);
Object.defineProperty(Element.prototype, "innerText", {
	set(value) {
		if (this instanceof HTMLScriptElement) {
			originalElementInnerText.set.call(
				this,
				__eclipse$rewrite.javascript(value, window.location.href)
			);
		} else if (this instanceof HTMLStyleElement) {
			originalElementInnerText.set.call(
				this,
				__eclipse$rewrite.css(value, window.location.href)
			);
		} else {
			originalElementInnerText.set.call(this, value);
		}

		return value;
	},
	get() {
		return originalElementInnerText.get.call(this);
	},
});

let originalElementHasAttribute = HTMLElement.prototype.hasAttribute;
Object.defineProperty(Element.prototype, "hasAttribute", {
	value: function (attribute) {
		if (attribute.startsWith("data-eclipse-attr-")) {
			return null;
		} else {
			return originalElementHasAttribute.call(this, attribute);
		}
	},
});

let originalElementGetAttribute = HTMLElement.prototype.getAttribute;
Object.defineProperty(Element.prototype, "getAttribute", {
	value: function (attribute) {
		if (attribute.startsWith("data-eclipse-attr-")) {
			return null;
		} else if (
			originalElementHasAttribute.call(this, `data-eclipse-attr-${attribute}`)
		) {
			return originalElementGetAttribute.call(
				this,
				`data-eclipse-attr-${attribute}`
			);
		} else {
			return originalElementGetAttribute.call(this, attribute);
		}
	},
});

let originalElementSetAttribute = HTMLElement.prototype.setAttribute;
Object.defineProperty(Element.prototype, "setAttribute", {
	value: function (name, value) {
		if (urlAttributes.has(name)) {
			originalElementSetAttribute.call(
				this,
				`data-eclipse-attr-${name}`,
				value
			);
			return originalElementSetAttribute.call(
				this,
				name,
				value ? __eclipse$rewrite.url.encode(value, window.location.href) : ""
			);
		} else if (deleteAttributes.has(name)) {
			return originalElementSetAttribute.call(
				this,
				`data-eclipse-attr-${name}`,
				value
			);
		} else if (srcSetAttributes.has(name)) {
			originalElementSetAttribute.call(
				this,
				`data-eclipse-attr-${name}`,
				value
			);
			return originalElementSetAttribute.call(
				this,
				name,
				value ? __eclipse$rewrite.srcset(value, window.location.href, true) : ""
			);
		} else if (htmlAttributes.has(name)) {
			originalElementSetAttribute.call(
				this,
				`data-eclipse-attr-${name}`,
				value
			);
			return originalElementSetAttribute.call(
				this,
				name,
				value ? __eclipse$rewrite.html(value, window.location.href) : ""
			);
		} else if (cssAttributes.has(name)) {
			originalElementSetAttribute.call(
				this,
				`data-eclipse-attr-${name}`,
				value
			);
			return originalElementSetAttribute.call(
				this,
				name,
				value ? __eclipse$rewrite.css(value, window.location.href) : ""
			);
		} else if (javascriptAttributes.has(name)) {
			originalElementSetAttribute.call(
				this,
				`data-eclipse-attr-${name}`,
				value
			);
			return originalElementSetAttribute.call(
				this,
				name,
				value ? __eclipse$rewrite.javascript(value, window.location.href) : ""
			);
		} else {
			return originalElementSetAttribute.call(this, name, value);
		}
	},
});

let originalElementRemoveAttribute = HTMLElement.prototype.removeAttribute;
Object.defineProperty(Element.prototype, "removeAttribute", {
	value: function (attribute) {
		if (
			originalElementHasAttribute.call(this, `data-eclipse-attr-${attribute}`)
		) {
			originalElementRemoveAttribute.call(
				this,
				`data-eclipse-attr-${attribute}`
			);
		}
		return originalElementRemoveAttribute.call(this, attribute);
	},
});

let originalElementGetAttributeNames = HTMLElement.prototype.getAttributeNames;
Object.defineProperty(Element.prototype, "getAttributeNames", {
	value: function () {
		let attributes = originalElementGetAttributeNames
			.call(this)
			.filter((attr) => !attr.startsWith("data-eclipse-attr"));
		return attributes;
	},
});

for (let htmlElement of htmlElements) {
	if (window.hasOwnProperty(htmlElement)) {
		for (let attribute of allAttributes) {
			if (window[htmlElement].prototype.hasOwnProperty(attribute)) {
				Object.defineProperty(window[htmlElement].prototype, attribute, {
					set(value) {
						return this.setAttribute(attribute, value);
					},
					get() {
						return this.getAttribute(attribute);
					},
				});
			}
		}
	}
}

//getAttributeNS getAttributeNode getAttributeNodeNS setAttributeNS setAttributeNode setAttributeNodeNS outerHTML outerText

let originalContentWindow = Object.getOwnPropertyDescriptor(
	HTMLIFrameElement.prototype,
	"contentWindow"
).get;
Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
	get: function () {
		return createWindowProxy(originalContentWindow.call(this));
	},
});

let originalContentDocument = Object.getOwnPropertyDescriptor(
	HTMLIFrameElement.prototype,
	"contentDocument"
).get;
Object.defineProperty(HTMLIFrameElement.prototype, "contentDocument", {
	get: function () {
		return createDocumentProxy(originalContentDocument.call(this));
	},
});
