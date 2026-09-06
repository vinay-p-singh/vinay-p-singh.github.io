# vinay-p-singh.github.io

Writing by Vinay Pratap Singh on software design and AI-assisted engineering.

Live at **https://vinay-p-singh.github.io**

## How it works

A flat static site with no build step and no generator. Each article is a self-contained HTML file in its own folder. The homepage renders itself from `articles.json`.

```text
.
├── index.html                    homepage — the only page at the root
├── articles.json                 the catalogue; edit this to publish
├── assets/
│   ├── site.css                  homepage stylesheet
│   └── site.js                   shared chrome injected into article pages
├── articles/
│   └── <slug>/
│       └── index.html            one folder per article, assets live beside it
└── .github/skills/
    └── linkedin-post-ideas/      turns an article into LinkedIn drafts
```

Article content lives in its HTML file. Shared structure and behavior live in
`assets/deck.css`, `assets/deck.js`, and `assets/site.js`. The current article uses
one `assets/theme-portfolio.css` file with light/dark variants, matching the portfolio's
ink-and-brass palette. `assets/article-theme.js` applies the theme before rendering
and recognizes the homepage preference plus the old Midnight/Paper preferences.

The [portfolio](https://vinay-p-singh.github.io/portfolio/) is the visual reference:
the homepage matches its ink-and-brass light/dark color tokens, sans-serif headings,
rounded article surfaces, navigation, and portrait treatment. Do not restyle the
portfolio to match a writing-page experiment. The two sites serve their own CSS;
keep the `--cp-*` token blocks aligned with the portfolio's `assets/css/style.css`.

The author portrait is served from the portfolio's public image URL.
The homepage's Appearance control follows the system by default;
manual light/dark choices use the `writing:theme` localStorage key. A valid
`?scoutTheme=light` or `?scoutTheme=dark` parameter overrides the saved preference.

Keep the public name consistent in homepage metadata, `articles.json`, and article
bylines. Changing presentation must not rename article slugs or remove their source
attribution. The article catalog still supplies the GitHub profile's latest-writing block.

## Publishing an article

1. Create `articles/<slug>/` and drop `index.html` in. Images, if any, go in the same folder.
2. For a deck article, use `data-mode="read" data-theme="light" data-themes="light dark"`
   on `<html>`. Link the shared assets with relative paths. Load the theme initializer
   and styles in the head, and the deferred runtime scripts before `</body>`:

   ```html
   <script src="../../assets/article-theme.js"></script>
   <link rel="stylesheet" href="../../assets/deck.css">
   <link rel="stylesheet" href="../../assets/theme-portfolio.css">
   <script defer src="../../assets/deck.js"></script>
   <script defer src="../../assets/site.js"></script>
   ```

3. Add an entry to `articles.json`:

   ```json
   {
     "slug": "your-article-slug",
     "title": "Your title",
     "summary": "One or two sentences.",
     "date": "2026-08-15",
     "format": "Deck",
     "length": "18 slides",
     "topics": ["Topic one", "Topic two"]
   }
   ```

The homepage sorts by `date` descending and picks it up on the next load. Nothing at the root moves, however many articles accumulate.

Slugs must match `^[a-z0-9][a-z0-9-]*$` — entries that do not are skipped by the homepage.

### Why articles are never categorised by folder

URLs stay `/articles/<slug>/` permanently. Categories live in `topics` in the catalogue, not in the path, so reclassifying an article never breaks a shared link. When the flat list outgrows itself, the homepage can filter on `topics` with no files moved.

## Previewing locally

The homepage fetches `articles.json` over HTTP, which the `file://` protocol blocks. Serve the folder:

```powershell
python -m http.server 8080
```

Then open http://localhost:8080. This matches how GitHub Pages serves the site.
Individual articles also open from disk; their back-link resolves to the local
homepage, whose article catalog still requires HTTP.

## The LinkedIn skill

`.github/skills/linkedin-post-ideas/` turns a published article into three LinkedIn post drafts with tiered hashtags and a pre-publish checklist.

Ask for it in natural language with this repository open:

```text
Draft LinkedIn posts for "Software fundamentals matter more than ever"
```

The hashtag corpus at `references/hashtag-corpus.md` carries a `last_verified` date. Refresh it roughly quarterly — the niche tier decays fastest. The refresh procedure is in that file.

To use the skill from Copilot CLI as well, copy or symlink the folder into `~/.copilot/skills/`.

## Deck articles

The current article opens in reading mode unless a desktop reader has saved a
presentation preference. Phones start in reading mode. Present/Read switches views;
the Light/Dark control shares the homepage's `writing:theme` preference.

In presentation mode, `←` / `→` navigate, `R` switches views, `T` changes theme,
`F` toggles fullscreen, and `P` prints. Dense sections scroll within a focusable
region instead of shrinking text. Space and Page Up/Down remain available for
scrolling, and shortcuts do not intercept form fields, links, or buttons.
Sections keep their `#s<N>` deep links in both views. Printing includes all sections
with scrolling removed and navigation hidden.

Before publishing, run the article structure and UX checks in `.github/skills/`.
Use all seven presentation viewports and check reading mode separately. Revise
claims against sources, distinguish examples from measured results, and record the
revision date without changing the original publication date or article URL.
