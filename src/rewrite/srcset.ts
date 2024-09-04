function srcset(set: string, origin: string): string {
	const sources: Array<string> = set.split(",");

	const updatedSources = sources.map((source: string) => {
		let [url, descriptor] = source.trim().split(" ");
		url = self.__eclipse$rewrite.url.encode(url, origin);
		return descriptor ? `${url} ${descriptor}` : url;
	});

	return updatedSources.join(", ");
}

export { srcset };
