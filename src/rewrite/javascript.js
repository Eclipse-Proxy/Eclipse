import { parseModule } from "meriyah";
import { generate } from "astring";

function javascript(code, origin) {
    try {
        const ast = parseModule(code, {
            module: true,
            webcompat: true,
            globalReturn: true
        })

        const globals = ["window", "self", "globalThis", "this", "parent", "top", "location", "document"];

        function traverse(node) {
            if (!node) return;

            if (node.type == "Identifier" && globals.includes(node.name)) {
                node.name = `__eclipse$scope(${node.name})`;
            }

            for (let key in node) {
                if (node[key] && typeof node[key] == "object") {
                    traverse(node[key]);
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