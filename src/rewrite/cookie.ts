import { parse } from "set-cookie-parser";
import { serialize } from "cookie";
import IDBMap from "@webreflection/idb-map";

async function request(origin: string) {
	const cookiesJar: IDBMap = new IDBMap(
		new URL(self.__eclipse$rewrite.url.decode(origin)).host,
		{
			durability: "relaxed",
			prefix: "@eclipse/cookies",
		}
	);

	return (await cookiesJar.entries())
		.map((cookie: any) => serialize(cookie[1].name, cookie[1].value, cookie[1]))
		.join("; ");
}

async function response(header: string, origin: string) {
	const cookiesJar: IDBMap = new IDBMap(
		new URL(self.__eclipse$rewrite.url.decode(origin)).host,
		{
			durability: "relaxed",
			prefix: "@eclipse/cookies",
		}
	);

	const cookies: any = parse(header, {
		silent: true,
	});

	for (const cookie of cookies) {
		await cookiesJar.set(cookie.name, cookie);
	}
}

const cookie = {
	request,
	response,
};

export { cookie };
