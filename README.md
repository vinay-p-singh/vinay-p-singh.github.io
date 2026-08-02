# vinay-p-singh.github.io

Writing on software design, AI-assisted engineering, and the craft underneath both.

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

Article pages keep their own design. They load `site.js` and nothing else, so the site can evolve without touching published work.

## Publishing an article

1. Create `articles/<slug>/` and drop `index.html` in. Images, if any, go in the same folder.
2. Add one line before `</body>`:

   ```html
   <script defer src="/assets/site.js"></script>
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

Then open http://localhost:8080. This matches how GitHub Pages serves the site. Individual article pages open fine directly from disk, though the back-link needs the server to resolve.

## The LinkedIn skill

`.github/skills/linkedin-post-ideas/` turns a published article into three LinkedIn post drafts with tiered hashtags and a pre-publish checklist.

Ask for it in natural language with this repository open:

```text
Draft LinkedIn posts for "Software fundamentals matter more than ever"
```

The hashtag corpus at `references/hashtag-corpus.md` carries a `last_verified` date. Refresh it roughly quarterly — the niche tier decays fastest. The refresh procedure is in that file.

To use the skill from Copilot CLI as well, copy or symlink the folder into `~/.copilot/skills/`.

## Deck articles

Articles in deck format are keyboard-driven: `←` `→` to navigate, `F` for fullscreen, `P` to print to PDF. Slides are deep-linkable with `#s<N>` — for example `/articles/<slug>/#s14`.
