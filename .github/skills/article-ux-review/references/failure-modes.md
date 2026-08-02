# Failure modes

What each failure name means, why it is graded the way it is, and the fix that usually resolves it.

## clipped-horizontally · FAIL

A node's box extends past the slide's content box on the left or right.

`.slide` is `overflow:hidden` and `body` is `overflow:hidden`. There is no scrollbar and no gesture that reaches the hidden part. The content is not "below the fold" — it does not exist for the reader.

The fit engine in `assets/deck.js` measures **height only**: it compares `inner.scrollHeight` against available height and scales down. Width never enters the calculation, so a slide can be perfectly fitted vertically and still be losing its right-hand column.

**Usual causes**

* A grid child containing a `<pre>`. `white-space:pre` refuses to wrap and a grid track's implicit minimum is `auto`, so the track grows to fit the code and pushes the grid past its container. The framework sets `.cols > *{min-width:0}` to prevent this — a new grid component that forgets it will reintroduce the bug.
* `td:first-child{white-space:nowrap}` widening a table beyond its column.
* A component that sets an explicit `min-width` larger than the container it lands in.

**Usual fixes**

* Add `min-width:0` to the grid or flex child, which lets `overflow-x:auto` on the `<pre>` engage instead of the track growing.
* Give the component a container-query collapse point, the way `.cols` has one.

## clipped-vertically · FAIL

Same, past the bottom of the content box. Usually a companion to `scale-clamp-hit` rather than an independent problem: the fit engine tried to shrink, hit its floor, and the remainder went off-slide.

## font-below-floor · FAIL

The smallest text with a direct text node measures under 11px **after** the fit transform, on a slide that has shrunk.

Authored size is not the number that matters. A `--fs-label` of `.68rem` is about 10.9px before scaling; at a fit scale of 0.5 it renders around 5.5px. That is the size the reader gets.

**Usual fixes**

* Cut content on the slide. A slide that has to shrink to 0.7 is carrying two slides of material.
* Raise `--fs-label` for narrow viewports.
* Reduce `.slide` padding at narrow widths to buy back space without shrinking type.

## design-token-below-floor · deck-level

The smallest authored type in `deck.css` is already under the floor at scale 1.

This is deliberately not a per-slide failure. `--fs-label:.68rem` computes to 10.88px, and every slide has an `.eyebrow`, so grading it per slide reports one design decision twenty-five times and buries every real defect underneath it.

Raise the token, or lower `fontFloorPx` — but decide once, in one place.

## scale-clamp-hit · FAIL

The fit scale reached `Math.max(0.5, …)` — the floor in `fit()`. Past this point the engine stops shrinking, so whatever still does not fit is simply cut off.

Hitting the clamp is always a content or layout problem, never a scaling problem. Raising the clamp only shrinks text further and trades this failure for `font-below-floor`.

## columns-did-not-collapse · FAIL

A `.cols` or `.depth` grid still renders two or more tracks below 700px.

Two 280px-minimum columns cannot fit in a 390px phone viewport. When they do not collapse, each track is squeezed to roughly 170px and every card inside becomes a narrow ribbon of text — the "blocks way out of place, very long" symptom.

The framework collapses `.cols` at a **container** width of 640px, measured against `.inner` rather than the viewport, so the component behaves the same wherever it is placed. `.depth` uses flex with `min-width:280px` and `flex-wrap:wrap`, so it collapses on its own.

If this fires, something declared its own grid without a collapse point. Give it one — do not special-case the slide.

**Note on the trade.** Collapsing to one column makes a slide taller, which means more shrink, which can turn a horizontal failure into `font-below-floor`. That is not a regression: it converts "content you cannot see" into "content that is too small", which is an honest signal that the slide is carrying too much for that screen.

## heavy-shrink · WARN

Fit scale under 0.75 with no hard failure. Everything is on screen and legible, but the slide is compensating for density. Treat as a content signal, not a bug: it is usually the slide before the one that fails outright.

## pre-needs-horizontal-scroll · WARN

A `<pre>` has content wider than its box, with `overflow-x:auto` making it reachable by scrolling.

Not a hard failure — the content is technically reachable. It is still wrong for a deck, because nobody drags a code block sideways during a presentation, and on a phone the gesture competes with the deck's own tap-to-advance handler.

**Usual fixes**

* Shorten the code sample. Deck code should be signatures, not implementations.
* Drop `pre` font-size at narrow viewports.
* Allow wrapping with a continuation indent for prose-like blocks, never for code where alignment carries meaning.
