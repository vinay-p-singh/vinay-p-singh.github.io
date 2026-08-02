/* Shared site chrome for article pages.
   Injects its own styles so it can never clobber an article's design. */
(function () {
  "use strict";

  var HOME = "/";
  var LABEL = "Articles";

  function inject() {
    if (document.querySelector(".site-back")) { return; }

    var css = document.createElement("style");
    css.textContent = [
      ".site-back{",
      "  position:fixed; top:1.1rem; right:1.4rem; z-index:30;",
      "  display:inline-flex; align-items:center; gap:.4rem;",
      "  padding:.34rem .7rem; border-radius:999px;",
      "  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;",
      "  font-size:.7rem; letter-spacing:.08em; text-transform:uppercase; font-weight:600;",
      "  color:#9aa7b4; text-decoration:none;",
      "  background:rgba(22,27,34,.82); border:1px solid #30363d;",
      "  backdrop-filter:blur(6px); opacity:.55; transition:opacity .18s, color .18s, border-color .18s;",
      "}",
      ".site-back:hover,.site-back:focus-visible{opacity:1; color:#58a6ff; border-color:rgba(88,166,255,.45)}",
      ".site-back:focus-visible{outline:2px solid #58a6ff; outline-offset:2px}",
      "@media print{.site-back{display:none}}",
      "@media (max-width:640px){.site-back{top:.6rem; right:.6rem; font-size:.62rem}}"
    ].join("\n");
    document.head.appendChild(css);

    // Deck pages advance slides on click but skip anchors, so this needs no guard.
    var a = document.createElement("a");
    a.className = "site-back";
    a.href = HOME;
    a.setAttribute("aria-label", "Back to all articles");
    a.textContent = "\u2190 " + LABEL;
    document.body.appendChild(a);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
