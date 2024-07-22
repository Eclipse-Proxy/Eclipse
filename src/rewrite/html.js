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

    const urlAttributes = ["href", "src", "action", "formaction", "ping", "profile", "movie", "poster", "background", "data"];

    //Todo: Better rewrites for "http-equiv"
    const deleteAttributes = ["http-equiv", "nonce", "integrity", "crossorigin", "sandbox", "csp"];

    const srcSetAttributes = ["srcset", "imagesrcset"];

    const htmlAttributes = ["srcdoc"];

    const cssAttributes = ["style"];

    const javascriptAttributes = ["onafterprint", "onbeforeprint", "onbeforeunload", "onerror", "onhashchange", "onload", "onmessage", "onoffline", "ononline", "onpagehide", "onpopstate", "onstorage", "onunload", "onblur", "onchange", "oncontextmenu", "onfocus", "oninput", "oninvalid", "onreset", "onsearch", "onselect", "onsubmit", "onkeydown", "onkeypress", "onkeyup", "onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onwheel", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "onscroll", "oncopy", "oncut", "onpaste", "onabort", "oncanplay", "oncanplaythrough", "oncuechange", "ondurationchange", "onemptied", "onended", "onerror", "onloadeddata", "onloadedmetadata", "onloadstart", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onseeked", "onseeking", "onstalled", "onsuspend", "ontimeupdate", "onvolumechange", "onwaiting"];

    const cssElements = ["style"];

    const javascriptElements = ["script"];

    const head = elements.filter((elem) => elem.tagName && elem.tagName == "head")[0];
    for (let script of scripts) {
        head.childNodes.unshift({
            tagName: "script",
            nodeName: "script",
            childNodes: [],
            attrs: [
                { name: "src", value: location.origin + self.__eclipse$config[script] },
            ],
        })
    }

    for (let attr of urlAttributes) {
        let hasAttributes = elements.filter((elem) => elem.attrs);
        for (let item of hasAttributes) {
            for (let attribute in item.attrs) {
                if (item.attrs[attribute].name == attr) {
                    item.attrs.push({
                        name: "data-eclipse-attr-" + attr,
                        value: item.attrs[attribute].value
                    });
                    item.attrs[attribute].value = self.__eclipse$rewrite.url.encode(item.attrs[attribute].value, origin);
                }
            }
        }
    }

    for (let attr of deleteAttributes) {
        let hasAttributes = elements.filter((elem) => elem.attrs);
        for (let item of hasAttributes) {
            for (let attribute in item.attrs) {
                if (item.attrs[attribute].name == attr) {
                    item.attrs[attribute].name = "data-eclipse-attr-" + attr;
                }
            }
        }
    }

    for (let attr of srcSetAttributes) {
        let hasAttributes = elements.filter((elem) => elem.attrs);
        for (let item of hasAttributes) {
            for (let attribute in item.attrs) {
                if (item.attrs[attribute].name == attr) {
                    item.attrs.push({
                        name: "data-eclipse-attr-" + attr,
                        value: item.attrs[attribute].value
                    });
                    item.attrs[attribute].value = self.__eclipse$rewrite.srcset(item.attrs[attribute].value, origin);
                }
            }
        }
    }

    for (let attr of htmlAttributes) {
        let hasAttributes = elements.filter((elem) => elem.attrs);
        for (let item of hasAttributes) {
            for (let attribute in item.attrs) {
                if (item.attrs[attribute].name == attr) {
                    item.attrs.push({
                        name: "data-eclipse-attr-" + attr,
                        value: item.attrs[attribute].value
                    });
                    item.attrs[attribute].value = self.__eclipse$rewrite.html(item.attrs[attribute].value, origin);
                }
            }
        }
    }

    for (let attr of cssAttributes) {
        let hasAttributes = elements.filter((elem) => elem.attrs);
        for (let item of hasAttributes) {
            for (let attribute in item.attrs) {
                if (item.attrs[attribute].name == attr) {
                    item.attrs.push({
                        name: "data-eclipse-attr-" + attr,
                        value: item.attrs[attribute].value
                    });
                    item.attrs[attribute].value = self.__eclipse$rewrite.css(item.attrs[attribute].value, "declarationList", origin);
                }
            }
        }
    }

    for (let attr of javascriptAttributes) {
        let hasAttributes = elements.filter((elem) => elem.attrs);
        for (let item of hasAttributes) {
            for (let attribute in item.attrs) {
                if (item.attrs[attribute].name == attr) {
                    item.attrs.push({
                        name: "data-eclipse-attr-" + attr,
                        value: item.attrs[attribute].value
                    });
                    item.attrs[attribute].value = self.__eclipse$rewrite.javascript(item.attrs[attribute].value, origin);
                }
            }
        }
    }

    for (let tagName of cssElements) {
        let hasTagNames = elements.filter((elem) => elem.tagName)
        for (let item of hasTagNames) {
            if (item.tagName.toLowerCase() == tagName) {
                for (let childNode in item.childNodes) {
                    item.childNodes[childNode].value = self.__eclipse$rewrite.css(item.childNodes[childNode].value, "stylesheet", origin);
                }
            }
        }
    }

    for (let tagName of javascriptElements) {
        let hasTagNames = elements.filter((elem) => elem.tagName)
        for (let item of hasTagNames) {
            if (item.tagName.toLowerCase() == tagName) {
                for (let childNode in item.childNodes) {
                    item.childNodes[childNode].value = self.__eclipse$rewrite.javascript(item.childNodes[childNode].value, "stylesheet", origin);
                }
            }
        }
    }

    return serialize(dom);
}

export { html };