/* Slide-deck framework runtime.

   The same markup renders two ways, chosen by data-mode on <html>:
    deck  one section at a time, with readable scrolling for dense content
     read  every section stacked and flowing, nothing scaled, nothing clipped

   Theme is data-theme on <html>. Both switches persist in localStorage.
   Exposes window.deck so tooling can drive it deterministically. */
(function () {
  var KEY_MODE = "deck:mode";
  var KEY_THEME = "deck:theme";
  var NARROW = 700;

  var root = document.documentElement;
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var bar = document.getElementById("bar");
  var cur = document.getElementById("cur");
  var hint = document.getElementById("hint");
  document.getElementById("tot").textContent = slides.length;

  var i = 0;
  var mode = "deck";
  var userChoseMode = false;

  slides.forEach(function (s, index) {
    var inner = document.createElement("div");
    inner.className = "inner";
    var content = document.createElement("div");
    content.className = "slide-content";
    content.tabIndex = 0;
    content.setAttribute("role", "region");
    content.setAttribute("aria-label", "Section " + (index + 1));
    while (s.firstChild) { content.appendChild(s.firstChild); }
    inner.appendChild(content);
    s.id = "s" + (index + 1);
    s.appendChild(inner);
  });

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  function recall(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- themes ---------- */

  // A linked theme can expose named variants through data-themes on the root.
  var themes = Array.prototype.slice.call(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(function (l) { return /theme-([a-z0-9-]+)\.css/.exec(l.getAttribute("href") || ""); })
    .filter(Boolean)
    .map(function (m) { return m[1]; });
  if (root.getAttribute("data-themes")) {
    themes = root.getAttribute("data-themes").split(/\s+/);
  }

  function setTheme(name) {
    if (themes.indexOf(name) < 0) { return; }
    root.setAttribute("data-theme", name);
    store(KEY_THEME, name);
    if (name === "light" || name === "dark") { store("writing:theme", name); }
    paintControls();
  }

  function nextTheme() {
    var at = themes.indexOf(root.getAttribute("data-theme"));
    return themes[(at + 1) % themes.length];
  }

  /* ---------- modes ---------- */

  function setMode(m, byUser) {
    mode = m === "read" ? "read" : "deck";
    if (byUser) { userChoseMode = true; store(KEY_MODE, mode); }
    root.setAttribute("data-mode", mode);
    if (mode === "deck") { show(i); }
    else {
      fitReset();
      if (byUser) { show(i); }
    }
    paintControls();
  }

  function fitReset() {
    slides.forEach(function (s) {
      var inner = s.querySelector(".inner");
      inner.style.transform = "";
      inner.style.height = "";
      inner.style.minHeight = "";
    });
  }

  /* ---------- deck behaviour ---------- */

  function fit(s) {
    if (mode !== "deck") { return; }
    var inner = s.querySelector(".inner");
    var wasHidden = !s.classList.contains("active");
    if (wasHidden) { s.style.visibility = "hidden"; s.classList.add("active"); }
    inner.style.transform = "none";
    inner.style.minHeight = "0";
    var cs = getComputedStyle(s);
    var avail = s.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    inner.style.height = Math.max(0, avail) + "px";
    if (wasHidden) { s.classList.remove("active"); s.style.visibility = ""; }
  }

  function fitAll() { slides.forEach(fit); }

  function show(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    if (mode === "read") {
      slides[i].scrollIntoView({ behavior: "instant", block: "start" });
      return;
    }
    slides.forEach(function (s, k) { s.classList.toggle("active", k === i); });
    fit(slides[i]);
    bar.style.width = ((i + 1) / slides.length * 100) + "%";
    cur.textContent = i + 1;
    try { location.hash = "s" + (i + 1); } catch (e) { /* file:// without history */ }
  }

  /* ---------- controls ---------- */

  var controls, btnMode, btnTheme;

  function buildControls() {
    controls = document.createElement("div");
    controls.id = "controls";

    btnMode = document.createElement("button");
    btnMode.type = "button";
    btnMode.addEventListener("click", function () {
      setMode(mode === "deck" ? "read" : "deck", true);
    });
    controls.appendChild(btnMode);

    if (themes.length > 1) {
      btnTheme = document.createElement("button");
      btnTheme.type = "button";
      btnTheme.addEventListener("click", function () { setTheme(nextTheme()); });
      controls.appendChild(btnTheme);
    }

    document.body.appendChild(controls);
  }

  function paintControls() {
    if (!btnMode) { return; }
    var toRead = mode === "deck";
    btnMode.textContent = toRead ? "Read" : "Present";
    btnMode.title = (toRead ? "Read as an article" : "Present as a deck") + "  (R)";
    btnMode.setAttribute("aria-label", btnMode.title);
    if (btnTheme) {
      var next = nextTheme();
      var label = next.charAt(0).toUpperCase() + next.slice(1);
      btnTheme.textContent = label + " mode";
      btnTheme.title = "Switch to the " + label + " theme  (T)";
      btnTheme.setAttribute("aria-label", btnTheme.title);
    }
    if (hint) {
      hint.innerHTML = "<kbd>\u2190</kbd> <kbd>\u2192</kbd> navigate \u00b7 <kbd>R</kbd> read mode \u00b7 " +
        (themes.length > 1 ? "<kbd>T</kbd> theme \u00b7 " : "") +
        "<kbd>F</kbd> fullscreen \u00b7 <kbd>P</kbd> print to PDF";
    }
  }

  /* ---------- events ---------- */

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // A phone-width viewport opens as an article unless the reader said otherwise.
      if (!userChoseMode && window.innerWidth < NARROW && mode !== "read") { setMode("read"); return; }
      if (mode === "deck") { fit(slides[i]); }
    }, 120);
  });
  window.addEventListener("beforeprint", function () { if (mode === "deck") { fitAll(); } });

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey ||
      (e.target && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(e.target.tagName)))) { return; }
    var k = e.key.toLowerCase();

    if (k === "r") { setMode(mode === "deck" ? "read" : "deck", true); return; }
    if (k === "t" && themes.length > 1) { setTheme(nextTheme()); return; }
    if (k === "f") {
      if (document.fullscreenElement) { document.exitFullscreen(); }
      else { document.documentElement.requestFullscreen(); }
      return;
    }
    if (k === "p") { window.print(); return; }

    if (mode !== "deck") { return; }
    if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
    else if (e.key === "Home") { show(0); }
    else if (e.key === "End") { show(slides.length - 1); }
  });

  document.addEventListener("click", function (e) {
    if (mode !== "deck") { return; }
    if (e.target.closest("a, pre, table, button, #controls") || String(window.getSelection()).length) { return; }
    show(e.clientX < window.innerWidth * 0.25 ? i - 1 : i + 1);
  });

  /* ---------- boot ---------- */

  window.deck = {
    slides: slides,
    show: show,
    fit: fit,
    fitAll: fitAll,
    count: slides.length,
    themes: themes,
    current: function () { return i; },
    mode: function () { return mode; },
    setMode: setMode,
    setTheme: setTheme
  };

  var savedTheme = recall(KEY_THEME);
  var initialTheme = root.getAttribute("data-theme");
  setTheme(themes.indexOf(initialTheme) >= 0 ? initialTheme
    : (themes.indexOf(savedTheme) >= 0 ? savedTheme : themes[0]));

  buildControls();

  var savedMode = recall(KEY_MODE);
  var startMode = window.innerWidth < NARROW ? "read"
    : (savedMode === "read" || savedMode === "deck" ? savedMode : (root.getAttribute("data-mode") || "deck"));
  root.setAttribute("data-mode", startMode);
  mode = startMode;

  var start = parseInt((location.hash || "").replace("#s", ""), 10);
  i = isNaN(start) ? 0 : Math.max(0, Math.min(slides.length - 1, start - 1));
  setMode(startMode);
  if (!isNaN(start) && mode === "read") { show(i); }
  window.addEventListener("hashchange", function () {
    var match = /^#s(\d+)$/.exec(location.hash);
    if (match) { show(Number(match[1]) - 1); }
  });
})();
