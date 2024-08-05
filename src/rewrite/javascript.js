import { parseModule } from "meriyah";
import { generate } from "astring";

function javascript(code, origin) {
    try {
        const ast = parseModule(code, {
            module: true,
            webcompat: true,
            globalReturn: true,
            specDeviation: true,
        })

        const globals = ["window", "self", "globalThis", "this", "parent", "top", "location", "document"];

        function shouldReplaceIdentifier(node, parent) {
            if (!globals.includes(node.name)) {
                return false;
            }

            if (parent && parent.type == "MethodDefinition" && parent.kind == "get") {
                return false;
            }

            if (parent && ["VariableDeclarator", "FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(parent.type)) {
                return false;
            }

            return true;
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
}

export { javascript };