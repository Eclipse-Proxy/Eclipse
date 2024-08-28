import { parse } from "acorn";
import { parse as parseLoose } from "acorn-loose";
import { ancestor as walk } from "acorn-walk";
import { generate } from "astring";

const globals = [
	"window",
	"self",
	"globalThis",
	"this",
	"parent",
	"top",
	"location",
	"document",
	"opener",
];

const acornOptions = {
	sourceType: "module",
	allowImportExportEverywhere: true,
	allowAwaitOutsideFunction: true,
	allowReturnOutsideFunction: true,
	allowSuperOutsideMethod: true,
	checkPrivateFields: false,
	locations: false,
	ranges: false,
	ecmaVersion: "latest",
	preserveParens: false,
	allowReserved: true,
};

export function javascript(code, origin) {
	let ast;
	try {
		ast = parse(code, acornOptions);
	} catch {
		ast = parseLoose(code, acornOptions);
	}

	function shouldReplaceIdentifier(node, parent) {
		if (globals.includes(node.name)) {
			if (parent && parent.type === "Property" && parent.key === node) {
				return false;
			}

			if (
				parent &&
				parent.type === "MemberExpression" &&
				parent.property === node
			) {
				return false;
			}

			if (
				parent &&
				(parent.type === "VariableDeclarator" ||
					parent.type === "AssignmentExpression" ||
					parent.type === "BinaryExpression")
			) {
				return false;
			}

			return true;
		}
		return false;
	}

	walk(ast, {
		Identifier(node, ancestors) {
			const parent = ancestors[ancestors.length - 2];
			if (shouldReplaceIdentifier(node, parent)) {
				node.name = `__eclipse$scope(${node.name})`;
			}
		},

		ImportDeclaration(node) {
			if (node.source) {
				node.source.value = self.__eclipse$rewrite.url.encode(
					node.source.value,
					origin
				);
			}
		},

		ExportNamedDeclaration(node) {
			if (node.source) {
				node.source.value = self.__eclipse$rewrite.url.encode(
					node.source.value,
					origin
				);
			}
		},

		ExportAllDeclaration(node) {
			if (node.source) {
				node.source.value = self.__eclipse$rewrite.url.encode(
					node.source.value,
					origin
				);
			}
		},

		ImportExpression(node) {
			if (node.source.type === "Literal") {
				node.source.value = self.__eclipse$rewrite.url.encode(
					node.source.value,
					origin
				);
			} else {
				node.source = {
					type: "CallExpression",
					callee: {
						type: "Identifier",
						name: "__eclipse$rewrite.url.encode",
					},
					arguments: [node.source],
				};
			}
		},
	});

	return generate(ast);
}

export { javascript };
