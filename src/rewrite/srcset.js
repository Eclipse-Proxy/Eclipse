function srcset(set, context) {
    const sources = set.split(",");

    const updatedSources = sources.map((source) => {
        let [url, descriptor] = source.trim().split(" ");
        url = self.__eclipse$rewrite.url.encode(url, context);
        return descriptor ? `${url} ${descriptor}` : url;
    });

    return updatedSources.join(", ");
}

export { srcset };