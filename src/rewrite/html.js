import { parse, serialize } from "parse5";

function html(code, origin) {
    const dom = parse(code);
    const elements = [];

    function addNode(node) {
        elements.push(node);
        if (node.childNodes) {
            for (let childNode of node.childNodes) {
                addNode(childNode);
            }
        }
        return node;
    }

    for (let node of dom.childNodes) {
        addNode(node);
    }

    const scripts = ["client", "rewrite", "config", "codecs"];
    const urlAttributes = new Set(["href", "src", "action", "formaction", "ping", "profile", "movie", "poster", "background", "data"]);
    //Todo: Better rewrites for "http-equiv"
    const deleteAttributes = new Set(["http-equiv", "nonce", "integrity", "crossorigin", "sandbox", "csp"]);
    const srcSetAttributes = new Set(["srcset", "imagesrcset"]);
    const htmlAttributes = new Set(["srcdoc"]);
    const cssAttributes = new Set(["style"]);
    const javascriptAttributes = new Set([
        "onafterprint", "onbeforeprint", "onbeforeunload", "onerror", "onhashchange", "onload", "onmessage", "onoffline", "ononline",
        "onpagehide", "onpopstate", "onstorage", "onunload", "onblur", "onchange", "oncontextmenu", "onfocus", "oninput", "oninvalid",
        "onreset", "onsearch", "onselect", "onsubmit", "onkeydown", "onkeypress", "onkeyup", "onclick", "ondblclick", "onmousedown",
        "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onwheel", "ondrag", "ondragend", "ondragenter",
        "ondragleave", "ondragover", "ondragstart", "ondrop", "onscroll", "oncopy", "oncut", "onpaste", "onabort", "oncanplay",
        "oncanplaythrough", "oncuechange", "ondurationchange", "onemptied", "onended", "onerror", "onloadeddata", "onloadedmetadata",
        "onloadstart", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onseeked", "onseeking", "onstalled", "onsuspend",
        "ontimeupdate", "onvolumechange", "onwaiting"
    ]);
    const cssElements = new Set(["style"]);
    const javascriptElements = new Set(["script"]);

    const elementsWithAttrs = elements.filter(elem => elem.attrs);

    const head = elements.find(elem => elem.tagName && elem.tagName.toLowerCase() == "head");
    if (head) {
        for (let script of scripts) {
            head.childNodes.unshift({
                tagName: "script",
                nodeName: "script",
                childNodes: [],
                attrs: [{ name: "src", value: location.origin + self.__eclipse$config[script] }]
            });
        }
    }

    for (let item of elementsWithAttrs) {
        for (let attribute in item.attrs) {
            const attrName = item.attrs[attribute].name;
            const attrValue = item.attrs[attribute].value;

            if (urlAttributes.has(attrName)) {
                item.attrs.push({ name: `data-eclipse-attr-${attrName}`, value: attrValue });
                item.attrs[attribute].value = self.__eclipse$rewrite.url.encode(attrValue, origin);
            }

            if (deleteAttributes.has(attrName)) {
                item.attrs[attribute].name = `data-eclipse-attr-${attrName}`;
            }

            if (srcSetAttributes.has(attrName)) {
                item.attrs.push({ name: `data-eclipse-attr-${attrName}`, value: attrValue });
                item.attrs[attribute].value = self.__eclipse$rewrite.srcset(attrValue, origin);
            }

            if (htmlAttributes.has(attrName)) {
                item.attrs.push({ name: `data-eclipse-attr-${attrName}`, value: attrValue });
                item.attrs[attribute].value = self.__eclipse$rewrite.html(attrValue, origin);
            }

            if (cssAttributes.has(attrName)) {
                item.attrs.push({ name: `data-eclipse-attr-${attrName}`, value: attrValue });
                item.attrs[attribute].value = self.__eclipse$rewrite.css(attrValue, "declarationList", origin);
            }

            if (javascriptAttributes.has(attrName)) {
                item.attrs.push({ name: `data-eclipse-attr-${attrName}`, value: attrValue });
                item.attrs[attribute].value = self.__eclipse$rewrite.javascript(attrValue, origin);
            }
        }
    }

    for (let item of elements) {
        if (cssElements.has(item.tagName?.toLowerCase())) {
            for (let childNode of item.childNodes) {
                if (childNode.value) {
                    childNode.value = self.__eclipse$rewrite.css(childNode.value, "stylesheet", origin);
                }
            }
        }

        if (javascriptElements.has(item.tagName?.toLowerCase())) {
            for (let childNode of item.childNodes) {
                if (childNode.value) {
                    childNode.value = self.__eclipse$rewrite.javascript(childNode.value, origin);
                }
            }
        }
    }

    return serialize(dom);
}

export { html };