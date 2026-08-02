# Layout contract

The file layout every article follows, the cascade layers the framework declares, the token contract a theme must fill, and how to scaffold a new article.

## Shape

```text
assets/
  deck.css              framework — structure only, no colours or sizes
  deck.js               navigation, the fit engine, window.deck
  theme-midnight.css    theme — dark, the default
  theme-paper.css       theme — light, bright rooms and print
  site.css              the home page and article index
  site.js               home page behaviour
articles/
  <slug>/
    index.html          content only: <head> meta, then <section class="slide"> ×N
    article.css         optional — overrides for this article, never copies
articles.json           the catalogue; every published slug has an entry
```

## Cascade layers

The framework declares its layer order once, and repeats the same declaration at the top of every framework file, so whichever file the browser parses first establishes the same cascade. Link order does not matter.

```css
@layer reset, theme, base, components, chrome, article;
```

| Layer | Holds | Lives in |
|---|---|---|
| `reset` | Box model, document reset, body defaults | `deck.css` |
| `theme` | Every token — colour, type scale, shape, density | `theme-*.css` |
| `base` | Deck structure and element typography | `deck.css` |
| `components` | Cards, grids, tables, code, tags, depth diagram, vocab | `deck.css` |
| `chrome` | Progress bar, HUD, hint, print rules | `deck.css` |
| `article` | Per-article overrides | `articles/<slug>/article.css` |

Because `article` is last, a per-article rule wins over the framework **regardless of specificity**. No `!important`, no selector escalation.

## Theme token contract

A theme file supplies `@layer theme { :root { … } }` and must define every token below. A missing token silently falls back to whatever the browser inherits — the kind of bug that only surfaces on one slide, at one viewport.

| Group | Tokens |
|---|---|
| Surfaces | `--bg` `--surface` `--surface-2` `--surface-3` |
| Text | `--fg` `--fg-muted` `--fg-subtle` `--code-fg` |
| Lines | `--border` `--border-subtle` |
| Accent | `--accent` `--accent-soft` `--accent-border` |
| Semantic | `--good` `--good-soft` `--good-border` `--warn` `--warn-soft` `--warn-border` `--bad` `--bad-soft` `--bad-border` |
| Shape | `--radius` `--radius-sm` |
| Type | `--font-sans` `--mono` `--fs-label` `--fs-sm` `--fs-base` `--fs-lg` `--fs-xl` |
| Density | `--slide-pad-top` `--slide-pad-inline` `--slide-pad-bottom` |

The density row is what stops a theme being the same deck in different colours. `theme-paper` runs tighter than `theme-midnight` and measurably fits more content per slide as a result.

To add a theme: copy `theme-midnight.css`, change the values, link it. No structural change is permitted — if a new theme needs one, the framework is missing a token and that is the thing to fix.

## Division of responsibility

| File | Owns | Never contains |
|---|---|---|
| `assets/deck.css` | Structure: layout, components, chrome | A literal colour, a literal font size, a literal padding |
| `assets/theme-*.css` | The full token contract, nothing else | A selector other than `:root` |
| `assets/deck.js` | Slide navigation, the fit engine, `window.deck` | Article content or copy |
| `articles/<slug>/index.html` | The slides | A stylesheet. A navigation script. |
| `articles/<slug>/article.css` | Rules for this article and no other | Any selector already in `deck.css` |

The test for whether something belongs in `deck.css`: **would the next article want it?** If yes, it is shared, even if only one article uses it today. The test for whether it belongs in a theme: **would a different-looking deck change it?**

## Paths

Use relative paths from the article to the assets:

```html
<link rel="stylesheet" href="../../assets/deck.css" />
<link rel="stylesheet" href="../../assets/theme-midnight.css" />
<script defer src="../../assets/deck.js"></script>
```

Not `/assets/deck.css`. A root-absolute path works on GitHub Pages and resolves to `file:///C:/assets/deck.css` when the file is opened directly — which fails silently, with no console error loud enough to notice, and makes the deck look broken for reasons that have nothing to do with the deck.

## Scaffolding a new article

1. Create `articles/<slug>/index.html` with the head block below.
2. Write slides as `<section class="slide">`. The first one carries `class="slide active"`.
3. Add the nav chrome and the script tag before `</body>`.
4. Add the `articles.json` entry, with `length` matching the real slide count.
5. Run `article-structure-check`, then `article-ux-review`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TITLE</title>
<meta name="description" content="SUMMARY" />
<meta name="author" content="Vinay Bhadauria" />
<meta property="og:type" content="article" />
<meta property="og:title" content="TITLE" />
<meta property="og:description" content="SUMMARY" />
<meta property="og:url" content="https://vinay199129.github.io/articles/SLUG/" />
<link rel="stylesheet" href="../../assets/deck.css" />
<link rel="stylesheet" href="../../assets/theme-midnight.css" />
</head>
<body>

<div id="deck">
<section class="slide active">
  <p class="eyebrow">EYEBROW</p>
  <h1>HEADLINE</h1>
</section>
</div>

<div id="bar"></div>
<div id="hud"><b id="cur">1</b> / <span id="tot">0</span></div>
<div id="hint"><kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>F</kbd> fullscreen · <kbd>P</kbd> print to PDF</div>

<script defer src="../../assets/deck.js"></script>
<script defer src="../../assets/site.js"></script>
</body>
</html>
```

## Building blocks available in deck.css

`.eyebrow` · `p.lead` · `.cols` / `.cols.two` / `.cols.tight` · `.card` with `.accent` `.good` `.bad` `.warn`, plus `.k` `.v` `.sub` inside · `.tag` with `.on` `.off` `.mid` · `pre` with `.hi` `.dim` `.red` `.grn` spans · `.depth` / `.dpanel` / `.unit` / `.blob` for the module-depth diagram · `.vocab` · `.footnote`

`.cols` collapses to one column below a **container** width of 640px — measured against `.inner`, not the viewport — so it keeps working anywhere it is placed, including in a future article that is not a full-screen deck.

Reach for these before writing a new rule. A new visual idea that earns its place belongs in `deck.css`, not in a `style=""` attribute — and any colour or size it needs belongs in the token contract, not inline.
