import { parse, walk, generate } from "css-tree";

function css(
	code: string,
	context: "stylesheet" | "declarationList" = "stylesheet",
	origin: string
) {
	const ast: any = parse(code, { context, parseCustomProperty: true });

    interface Node {
        type: string;
        value: string;
    }

	walk(ast, (node: Node) => {
		if (node.type == "Url") {
			node.value = self.__eclipse$rewrite.url.encode(node.value, origin);
		}
	});

	return generate(ast);
}

export { css };
