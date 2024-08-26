# Eclipse

An interception web proxy.

## Todo

- Cookies for all subdomains (".google.com" instead of "www.google.com")
- Client rewrites
- Manifest rewrites
- Better rewrites for "http-equiv"
- Auth header rewrites
- Fix: **eclipse$scope(location) = "https://example.com" (maybe **eclipse$scope(self).location = "https://example.com")
- Proxy "frames"
- Fix: new \_\_eclipse$scope(window).MutationObserver()
