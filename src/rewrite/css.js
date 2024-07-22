import * as csstree from "css-tree";

function css(code, context = "stylesheet", origin) {
    const ast = csstree.parse(code, { context });

    csstree.walk(ast, (node) => {
        if (node.type == "Url") {
            node.value = self.__eclipse$rewrite.url.encode(node.value, origin);
        } else if (node.type == "Declaration") {
            //Fix CSS variables
            if (node.property.startsWith("--")) {
                let tempAst = csstree.parse(`temp:${node.value.value};`, { context: "declarationList" });
                csstree.walk(tempAst, (node) => {
                    if (node.type == "Url") {
                        node.value = self.__eclipse$rewrite.url.encode(node.value, origin);
                    }
                })
                node.value = tempAst.children.head.data.value.children.tail.data;
            }
        }
    });

    return csstree.generate(ast);
}

export { css };