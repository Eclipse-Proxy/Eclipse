import { parseModule } from "meriyah";
import { generate } from "astring";

function javascript(code, origin) {
    const globals = ["window", "self", "globalThis", "parent", "top", "location", "document", "frames"];

    //Todo: Fix this.location.href and location.href
    return `(function(${globals.join(", ")}) {${code}})(${globals.map((global) => "__eclipse$scope(" + global + ")").join(", ")});`
    /*
    try {
        const ast = parseModule(code, {
            module: true,
            webcompat: true,
            globalReturn: true,
            specDeviation: true,
        })

        const globals = ["window", "self", "globalThis", "this", "parent", "top", "location", "document"];

        function shouldReplaceIdentifier(node, parent) {
            if (globals.includes(node.name)) {
                if (parent && parent.type == "Property" && parent.key == node) {
                    return false;
                }

                if (parent && (parent.type == "MemberExpression" && parent.property == node)) {
                    return false;
                }

                if (parent && (parent.type == "VariableDeclarator" || parent.type == "AssignmentExpression" || parent.type == "BinaryExpression")) {
                    return false;
                }

                return true;
            }
            return false;
        }

        function traverse(node, parent = null) {
            if (!node) return;

            if (node.type == "Identifier" && shouldReplaceIdentifier(node, parent)) {
                node.name = `__eclipse$scope(${node.name})`;
            }

            if (["ImportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration"].includes(node.name) && node.source) {
                node.source.value = self.__eclipse$rewrite.url.encode(node.source.value, origin);
            }

            if (node.type == "ImportExpression") {
                if (node.source.type == "Literal") {
                    node.source.value = self.__eclipse$rewrite.url.encode(node.source.value, origin);
                } else {
                    node.source = {
                        "type": "CallExpression",
                        "callee": {
                            "type": "Identifier",
                            "name": "__eclipse$rewrite.url.encode"
                        },
                        "arguments": [
                            node.source
                        ]
                    }
                }
            }

            for (let key in node) {
                if (node[key] && typeof node[key] == "object") {
                    traverse(node[key], node);
                }
            }
        }

        traverse(ast);

        return generate(ast);
    } catch {
        return "";
    }
    */
}

export { javascript };