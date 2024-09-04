function createLocationProxy(loc: Location = window.location): any {
	return new Proxy(
		{},
		{
			get(_target, prop) {
				const decodedLocation: URL = new URL(
					self.__eclipse$rewrite.url.decode(loc.href)
				);

				switch (prop) {
					case "constructor":
						return loc.constructor;
					case "assign":
						return (url) =>
							loc.assign(
								self.self.__eclipse$rewrite.url.encode(
									url,
									window.location.href
								)
							);
					case "reload":
						return () => loc.reload();
					case "replace":
						return (url) =>
							loc.replace(
								self.__eclipse$rewrite.url.encode(url, window.location.href)
							);
					case "toString":
						return () => decodedLocation.toString();
					default:
						return decodedLocation[prop];
				}
			},
			set(_target, prop, value) {
				const decodedLocation: URL = new URL(
					self.__eclipse$rewrite.url.decode(loc.href)
				);

				if (prop in decodedLocation) {
					decodedLocation[prop] = new URL(
						value,
						decodedLocation.href
					).toString();
					loc.href = self.__eclipse$rewrite.url.encode(
						decodedLocation.href,
						window.location.href
					);
					return true;
				}
				return false;
			},
		}
	);
}

export { createLocationProxy };
