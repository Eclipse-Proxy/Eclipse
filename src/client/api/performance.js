const originalGetEntriesByType = window.performance.getEntriesByType;

window.performance.getEntriesByType = function (type) {
	const entries = originalGetEntriesByType.call(this, type);

	if (["navigation", "resource"].includes(type)) {
		return entries.map((entry) => {
			return {
				...entry,
				name: __eclipse$rewrite.url.decode(entry.name),
			};
		});
	}

	return entries;
};
