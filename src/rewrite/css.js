import * as csstree from "css-tree";

function css(code, context = "stylesheet", origin) {
	const ast = csstree.parse(code, { context, parseCustomProperty: true });

	csstree.walk(ast, (node) => {
		if (node.type == "Url") {
			node.value = self.__eclipse$rewrite.url.encode(node.value, origin);
		}
	});

	return csstree.generate(ast);
}

export { css };
