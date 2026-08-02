---
name: article-ux-review
description: "Measure a published slide-deck article at every supported viewport and report which slides clip, shrink past legibility, or fail to collapse their columns. Use when asked to review an article's layout, check responsiveness, find slides that break on small screens, verify a deck before publishing, or diagnose a slide that looks wrong."
---

# Article UX Review

Walks a deck article slide by slide at seven viewport sizes, measures what a reader actually sees, and reports the slides that fail — with the number that proves it and the CSS line to change.

## Overview

Eyeballing screenshots finds symptoms and hides causes. A slide that looks cramped at 1366×768 and fine at 1920×1080 is not a slide problem; it is a layout-contract problem that will recur on the next article. So this skill measures rather than looks:

* **Post-transform.** Every measurement is taken after `fit()` has scaled the slide. A 14px heading shrunk to 0.6 is a 8.4px heading, and that is what gets reported.
* **Clipping is a hard failure.** `.slide` is `overflow:hidden` and `body` is `overflow:hidden`. Content past the content box is not scrolled to — it is gone. There is no "the reader can scroll to it".
* **Screenshots only on failure.** A passing slide produces no image and no prose.

Read [references/failure-modes.md](references/failure-modes.md) for what each failure name means and the usual fix.

## Prerequisites

* Run from the repository root.
* The article must load `assets/deck.js`, which exposes `window.deck`. If it does not, the audit returns an error — run `article-structure-check` first; a missing `window.deck` almost always means the deck JS is still inlined.
* Browser tools available: `open_browser_page`, `run_playwright_code`, `screenshot_page`.

## Viewport matrix

All seven are measured. Six are enforced; the phone is **advisory**, because a viewport under 700px opens in reading mode by default — deck mode there is an explicit reader choice, and reading mode cannot clip or shrink.

| Viewport | Stands for | Weight |
|---|---|---|
| 1920×1080 | Projector, full HD presentation | enforced |
| 1440×900 | MacBook | enforced |
| 1366×768 | The cramped laptop that breaks things first | enforced |
| 1280×800 | Half-screen, side-by-side with notes | enforced |
| 1024×768 | iPad landscape | enforced |
| 768×1024 | iPad portrait | enforced |
| 390×844 | Phone, tapped through from a social link | **advisory** |

Report the phone column separately and say plainly that reading mode is what a phone actually gets. Do not let 390 dominate a report about the deck.

## Modes

A deck article renders two ways, set by `data-mode` on `<html>`. These thresholds describe **deck mode only** — reading mode flows, never transforms, and never clips, so measuring it against a clipping threshold reports a clean sheet that means nothing.

`scripts/measure.js` forces deck mode before it measures and restores the previous mode afterwards. Never disable that: a report taken in reading mode is not a report.

## Thresholds

| Name | Verdict | Trips when |
|---|---|---|
| `clipped-horizontally` | FAIL | Any node's box extends past the slide content box. Content is lost, not scrollable. |
| `clipped-vertically` | FAIL | Same, below the content box. |
| `font-below-floor` | FAIL | Smallest effective text < **11px** after the fit transform. |
| `scale-clamp-hit` | FAIL | Fit scale reached the 0.5 floor — `deck.js` stopped shrinking and the remainder is off-slide. |
| `columns-did-not-collapse` | FAIL | A `.cols` or `.depth` grid still renders ≥ 2 tracks below 700px wide. |
| `heavy-shrink` | WARN | Fit scale < 0.75 without any hard failure. The slide is carrying too much. |
| `pre-needs-horizontal-scroll` | WARN | A `<pre>` has hidden horizontal content. Nobody drags a code block sideways mid-talk. |
| `design-token-below-floor` | DECK | Smallest **authored** type is under the floor at scale 1. Reported once for the whole deck, never per slide — it is one decision in `deck.css`, not N defects. |

The distinction in that last row is the one that makes the report usable. Type that is small because the design says so is a token conversation. Type that is small because the slide had to shrink is a defect on that slide — so once fit scale drops below 1, the floor applies again regardless of the authored size.

The 11px floor is a starting value. If reports come back either noisy or too permissive, change `fontFloorPx` in [scripts/measure.js](scripts/measure.js) — one place, all articles.

## Waivers

A slide can be dense on purpose. `articles/<slug>/ux-waivers.json` records that decision, keyed by slide number:

```json
{
  "16": {
    "reason": "Six-practice summary table. Dense by design; reads correctly in reading mode.",
    "accept": ["scale-clamp-hit", "clipped-vertically", "font-below-floor"],
    "viewports": ["1024x768"]
  }
}
```

Pass the file's contents as `__uxAudit({ waivers })`. Rules that make a waiver honest rather than a mute button:

* A waived failure is **still reported**, under a `WAIVED` verdict, with its reason quoted.
* Only the failure names on `accept` are waived. A slide that starts failing a **different** way still fails.
* `viewports` is optional. Omit it to waive everywhere; list them to waive narrowly.
* A waiver needs a reason in prose. "Known issue" is not a reason.

Never add a waiver during a review. Report first, let the author decide, then record it.

## Required Steps

### Step 1: Resolve the article

Read `articles.json` at the repository root. Match the request against `title` and `slug`; "the latest" means the most recent `date`. If nothing matches, list the titles and stop.

### Step 2: Open the deck

Open `articles/<slug>/index.html` as a `file://` URL with `open_browser_page`. Confirm the deck booted before measuring:

```js
await page.evaluate(() => ({ deck: !!window.deck, slides: window.deck && window.deck.count }));
```

A `false` here means the assets did not load. Stop and report that — do not measure a broken page and blame the layout.

### Step 3: Inject the measurement script

Read [scripts/measure.js](scripts/measure.js) and evaluate its contents in the page. It defines `window.__uxAudit` and returns nothing on its own.

Re-inject after every navigation or reload. It does not survive one.

### Step 4: Run the matrix

Read `articles/<slug>/ux-waivers.json` if it exists. For each of the seven viewports:

1. Set the viewport size.
2. Wait for the deck's 120ms resize debounce to settle, then a little more — 250ms is enough.
3. Call `window.__uxAudit({ waivers })`. It forces deck mode, walks all slides, measures each, restores the original slide and mode, and returns a result object.
4. Keep the returned `summary` and the full entries for any slide whose verdict is not `PASS`.

Do not re-run a viewport to "check again". If a result looks surprising, read the numbers in the entry — they say exactly which node overflowed and by how many pixels.

### Step 5: Capture evidence for failures only

For each distinct `slide × viewport` that returned FAIL, navigate to that slide, set that viewport, and take one screenshot. Skip WARN unless asked. Never screenshot a PASS.

If the same slide fails at four viewports with the same failure name, capture the narrowest one only, and say the others share it.

### Step 6: Report

Lead with the matrix, so the shape of the problem is visible before any detail:

```text
slide │ 1920 1440 1366 1280 1024  768  390
──────┼────────────────────────────────────
   10 │  ok   ok   !!   !!   !!   !!   !!
   18 │  ok   ok   ok   !!   !!   !!   !!
```

Then, per failing slide: the failure names, the measured numbers, and the specific CSS rule responsible. Name the file and line — a report that says "slide 18 is cramped" has done nothing that looking at it would not have done.

Close with the fix set, grouped by root cause rather than by slide. Five slides failing for one missing media query is one fix, not five.

## Rules

* Report only what was measured. Never state that a slide "looks fine" at a viewport that was not run.
* Never widen a threshold to make a report come back clean. If a threshold is wrong, say so and change it deliberately.
* Do not fix anything during a review. The review produces evidence; fixing is a separate, agreed step.
* If the audit returns an error object, report the error. An audit that could not run is not a pass.
