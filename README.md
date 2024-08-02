# Eclipse
An interception web proxy.

## Todo
- Cookies for all subdomains (".google.com" instead of "www.google.com")
- Client rewrites
- Manifest rewrites
- Plugin system
- Better rewrites for "http-equiv"
- Auth header rewrites
- Fix: __eclipse$scope(location) = "https://example.com" (maybe __eclipse$scope(self).location = "https://example.com")
- Proxy "frames"
- Fix: new __eclipse$scope(window).MutationObserver()