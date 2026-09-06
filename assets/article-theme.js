(function () {
  var theme = new URLSearchParams(location.search).get("scoutTheme");
  if (theme !== "light" && theme !== "dark") {
    try {
      theme = localStorage.getItem("writing:theme") || localStorage.getItem("deck:theme");
    } catch (error) {}
  }
  if (theme === "paper") { theme = "light"; }
  if (theme === "midnight") { theme = "dark"; }
  if (theme !== "light" && theme !== "dark") {
    theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
})();