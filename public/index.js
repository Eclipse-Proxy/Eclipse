(async () => {
    if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/sw.js");
    }

    const connection = new window.BareMux.BareMuxConnection("/baremux/worker.js");
    await connection.setTransport("/libcurl/index.mjs", [{ wisp: (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/" }]);

    const search = document.querySelector("#search");

    search.addEventListener("keyup", function(e) {
        if (e.target.value && e.key == "Enter") {
          e.preventDefault();
          window.location.href = self.__eclipse$config.prefix + self.__eclipse$config.codec.encode(e.target.value);
          e.target.value = "";
        }
      });
})();