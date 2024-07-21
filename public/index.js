(async () => {
    if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/sw.js");
    }

    const connection = new window.BareMux.BareMuxConnection("/baremux/worker.js");
    await connection.setTransport("/libcurl/index.mjs", [{ wisp: (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/" }]);

    const example = document.querySelector("#example");
    example.href = self.__eclipse$config.prefix + self.__eclipse$config.codec.encode("https://example.com");
})();