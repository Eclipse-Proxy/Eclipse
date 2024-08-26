# Eclipse

An interception web proxy.

## Todo

- Cookies for all subdomains (".google.com" instead of "www.google.com")
- Manifest rewrites
- Auth rewrites
- Better rewrites for "http-equiv"
- Fix: eclipse$scope(location) = "https://example.com" (eclipse$scope(self).location = "https://example.com")
- Fix: new \_\_eclipse$scope(window).MutationObserver() throwing error
