/* Shared site chrome for article pages.
   Injects its own styles so it can never clobber an article's design. */
(function () {
  "use strict";

  var HOME = new URL("../index.html", document.currentScript.src).href;
  var LABEL = "Articles";

  function inject() {
    if (document.querySelector(".site-back")) { return; }

    var css = document.createElement("style");
    css.textContent = [
      ".site-back{",
      "  position:fixed; top:var(--control-offset); right:var(--control-offset); z-index:30;",
      "  display:inline-flex; align-items:center; gap:.4rem;",
      "  padding:var(--control-pad); border-radius:var(--radius-sm); min-height:44px;",
      "  font-family:var(--font-sans);",
      "  font-size:var(--fs-label); letter-spacing:0; font-weight:600;",
      "  color:var(--fg); text-decoration:none;",
      "  background:var(--surface); border:1px solid var(--border);",
      "}",
      ".site-back:hover,.site-back:focus-visible{color:var(--accent); border-color:var(--accent)}",
      ".site-back:focus-visible{outline:2px solid var(--accent); outline-offset:2px}",
      "@media print{.site-back{display:none}}"
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
