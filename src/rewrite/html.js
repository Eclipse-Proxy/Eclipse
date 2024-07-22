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

    const urlAttributes = ["href", "src", "action", "formaction", "ping", "profile", "movie", "poster", "background", "data"];

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

    return serialize(dom);
}

export { html };