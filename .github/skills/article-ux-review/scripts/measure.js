/* Slide-deck viewport audit.
 *
 * Injected into a deck page by the article-ux-review skill. Defines
 * window.__uxAudit(), which walks every slide at the CURRENT viewport size and
 * returns a plain array of per-slide measurements plus a verdict.
 *
 * Requires window.deck (exposed by assets/deck.js). All measurements are taken
 * AFTER the fit() transform is applied, so they describe what a reader actually
 * sees, not what the unscaled markup would have been.
 */
(function () {
  var DEFAULTS = {
    fontFloorPx: 11,      // FAIL below this effective size
    scaleClamp: 0.5,      // deck.js refuses to shrink past this; hitting it means content is lost
    scaleWarn: 0.75,      // WARN below this: technically visible, practically squinting
    narrowPx: 700,        // below this width a multi-column grid must have collapsed
    tolerancePx: 1        // sub-pixel rounding slack
  };

  function scaleOf(inner) {
    var t = getComputedStyle(inner).transform;
    if (!t || t === "none") { return 1; }
    var m = t.match(/matrix\(([^)]+)\)/);
    return m ? parseFloat(m[1].split(",")[0]) : 1;
  }

  function contentBox(slide) {
    var cs = getComputedStyle(slide);
    var r = slide.getBoundingClientRect();
    return {
      left: r.left + parseFloat(cs.paddingLeft),
      right: r.right - parseFloat(cs.paddingRight),
      top: r.top + parseFloat(cs.paddingTop),
      bottom: r.bottom - parseFloat(cs.paddingBottom)
    };
  }

  // Content inside a scrolling box is reachable, so it is not clipped. Without
  // this, every span inside a horizontally scrolling <pre> reads as a failure.
  function scrollHost(el, stop) {
    var p = el.parentElement;
    while (p && p !== stop) {
      var ox = getComputedStyle(p).overflowX;
      if (ox === "auto" || ox === "scroll") { return p; }
      p = p.parentElement;
    }
    return null;
  }

  function describe(el) {
    var tag = el.tagName.toLowerCase();
    var cls = el.className && typeof el.className === "string"
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
      : "";
    var text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48);
    return tag + cls + (text ? ' "' + text + '"' : "");
  }

  function auditSlide(slide, index, cfg) {
    var inner = slide.querySelector(".inner");
    var k = scaleOf(inner);
    var box = contentBox(slide);
    var vw = window.innerWidth;

    var heading = slide.querySelector("h1, h2");
    var title = heading ? heading.textContent.trim().replace(/\s+/g, " ").slice(0, 60) : "(untitled)";

    var clippedX = [];
    var clippedY = [];
    var preScroll = [];
    var minAuthored = Infinity;
    var minAuthoredEl = null;

    var nodes = inner.querySelectorAll("*");
    for (var n = 0; n < nodes.length; n++) {
      var el = nodes[n];
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) { continue; }
      var scrolled = scrollHost(el, inner);

      // Horizontal clipping. .slide has overflow:hidden, so anything past the
      // content box is not scrolled to — it is simply gone.
      if (!scrolled && (r.right > box.right + cfg.tolerancePx || r.left < box.left - cfg.tolerancePx)) {
        clippedX.push({
          el: describe(el),
          overflowRightPx: Math.round(r.right - box.right),
          overflowLeftPx: Math.round(box.left - r.left)
        });
      }
      if (!scrolled && r.bottom > box.bottom + cfg.tolerancePx) {
        clippedY.push({ el: describe(el), overflowBottomPx: Math.round(r.bottom - box.bottom) });
      }

      // A <pre> that scrolls horizontally is unreadable in a deck: nobody drags
      // a code block sideways mid-presentation.
      if (el.tagName === "PRE" && el.scrollWidth > el.clientWidth + cfg.tolerancePx) {
        preScroll.push({
          el: describe(el),
          hiddenPx: Math.round(el.scrollWidth - el.clientWidth)
        });
      }

      // Authored size, recorded unscaled. Effective size is this shrunk by k.
      // Keeping them apart matters: type that is small because the design says
      // so is one deck-wide decision, while type that is small because the slide
      // had to shrink is a defect on that slide.
      if (el.childNodes.length && el.textContent.trim()) {
        var hasDirectText = false;
        for (var c = 0; c < el.childNodes.length; c++) {
          if (el.childNodes[c].nodeType === 3 && el.childNodes[c].textContent.trim()) {
            hasDirectText = true;
            break;
          }
        }
        if (hasDirectText) {
          var authored = parseFloat(getComputedStyle(el).fontSize);
          if (authored < minAuthored) { minAuthored = authored; minAuthoredEl = describe(el); }
        }
      }
    }

    // Grid tracks actually rendered, not the tracks the CSS asked for.
    var grids = [];
    var cols = inner.querySelectorAll(".cols, .depth");
    for (var g = 0; g < cols.length; g++) {
      var gcs = getComputedStyle(cols[g]);
      var tracks = gcs.display === "grid"
        ? gcs.gridTemplateColumns.trim().split(/\s+/).length
        : null;
      grids.push({
        el: describe(cols[g]).slice(0, 40),
        display: gcs.display,
        renderedColumns: tracks
      });
    }
    var uncollapsed = vw < cfg.narrowPx && grids.some(function (x) { return x.renderedColumns >= 2; });

    var minEffective = minAuthored === Infinity ? Infinity : minAuthored * k;

    var failures = [];
    var warnings = [];

    if (clippedX.length) {
      failures.push("clipped-horizontally (" + clippedX.length + " node(s), worst " +
        Math.max.apply(null, clippedX.map(function (x) { return Math.max(x.overflowRightPx, x.overflowLeftPx); })) + "px)");
    }
    if (clippedY.length) {
      failures.push("clipped-vertically (" + clippedY.length + " node(s))");
    }
    // Only shrink-induced illegibility is a slide defect. Type that is already
    // below the floor at scale 1 is a token problem, raised once per deck — but
    // once a slide starts shrinking, the result is that slide's problem again.
    var shrunk = k < 0.99;
    if (minEffective < cfg.fontFloorPx && (shrunk || minAuthored >= cfg.fontFloorPx)) {
      failures.push("font-below-floor (" + minEffective.toFixed(1) + "px < " + cfg.fontFloorPx +
        "px on " + minAuthoredEl + ", authored " + minAuthored.toFixed(1) + "px shrunk by " + k.toFixed(2) + ")");
    }
    if (k <= cfg.scaleClamp + 0.001) {
      failures.push("scale-clamp-hit (" + k.toFixed(2) + ") — deck.js stopped shrinking, remainder is lost");
    }
    if (uncollapsed) {
      failures.push("columns-did-not-collapse at " + vw + "px wide");
    }
    if (!failures.length && k < cfg.scaleWarn) {
      warnings.push("heavy-shrink (" + k.toFixed(2) + ")");
    }
    if (preScroll.length) {
      warnings.push("pre-needs-horizontal-scroll (" + preScroll.length + " block(s), worst " +
        Math.max.apply(null, preScroll.map(function (x) { return x.hiddenPx; })) + "px hidden)");
    }

    return {
      slide: index + 1,
      title: title,
      viewport: window.innerWidth + "x" + window.innerHeight,
      scale: Number(k.toFixed(3)),
      minAuthoredFontPx: minAuthored === Infinity ? null : Number(minAuthored.toFixed(1)),
      minEffectiveFontPx: minEffective === Infinity ? null : Number(minEffective.toFixed(1)),
      minFontOn: minAuthoredEl,
      grids: grids,
      clippedX: clippedX,
      clippedY: clippedY,
      preScroll: preScroll,
      verdict: failures.length ? "FAIL" : (warnings.length ? "WARN" : "PASS"),
      failures: failures,
      warnings: warnings
    };
  }

  window.__uxAudit = function (options) {
    var cfg = Object.assign({}, DEFAULTS, options || {});
    if (!window.deck) {
      return { error: "window.deck missing — assets/deck.js did not load. Check the script path." };
    }
    // Deck mode is what these thresholds describe. Reading mode cannot clip or
    // shrink, so measuring it here would report a clean sheet that means nothing.
    var enteredMode = document.documentElement.getAttribute("data-mode");
    if (enteredMode !== "deck") { window.deck.setMode("deck"); }
    var start = window.deck.current();
    var out = [];
    for (var n = 0; n < window.deck.count; n++) {
      window.deck.show(n);
      out.push(auditSlide(window.deck.slides[n], n, cfg));
    }
    window.deck.show(start);
    if (enteredMode && enteredMode !== "deck") { window.deck.setMode(enteredMode); }

    // A waived failure is recorded, never hidden. Anything NOT on the accept
    // list still fails, so a slide that gets worse in a new way still surfaces.
    out.forEach(function (s) {
      var w = cfg.waivers && cfg.waivers[String(s.slide)];
      if (!w || s.verdict !== "FAIL") { return; }
      if (w.viewports && w.viewports.indexOf(s.viewport) < 0) { return; }
      var accept = w.accept || [];
      var named = function (f) { return accept.indexOf(f.split(" ")[0]) >= 0; };
      s.waived = s.failures.filter(named);
      s.waiverReason = w.reason;
      s.failures = s.failures.filter(function (f) { return !named(f); });
      if (!s.failures.length) { s.verdict = s.warnings.length ? "WARN" : "WAIVED"; }
    });

    // Deck-level: authored type below the floor is one decision, not N defects.
    var tokenOffenders = out.filter(function (s) {
      return s.minAuthoredFontPx !== null && s.minAuthoredFontPx < cfg.fontFloorPx;
    });
    var deckFindings = [];
    if (tokenOffenders.length) {
      deckFindings.push({
        finding: "design-token-below-floor",
        detail: "Smallest authored type is " + tokenOffenders[0].minAuthoredFontPx + "px (floor " +
          cfg.fontFloorPx + "px), on " + tokenOffenders[0].minFontOn +
          ". Affects " + tokenOffenders.length + " of " + out.length + " slides at scale 1.",
        fix: "Raise --fs-label in assets/deck.css, or lower fontFloorPx if this size is intended."
      });
    }

    return {
      viewport: window.innerWidth + "x" + window.innerHeight,
      config: cfg,
      deckFindings: deckFindings,
      slides: out,
      summary: {
        fail: out.filter(function (s) { return s.verdict === "FAIL"; }).map(function (s) { return s.slide; }),
        warn: out.filter(function (s) { return s.verdict === "WARN"; }).map(function (s) { return s.slide; }),
        waived: out.filter(function (s) { return s.waived && s.waived.length; }).map(function (s) { return s.slide; }),
        pass: out.filter(function (s) { return s.verdict === "PASS"; }).length
      }
    };
  };
})();
