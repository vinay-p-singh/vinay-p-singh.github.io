---
name: article-structure-check
description: "Verify an article folder follows the site's file-structure contract before it is published: no inlined CSS or JS, shared deck assets linked by working relative paths, an accurate articles.json entry, and the required meta tags. Use when creating a new article, before publishing or committing one, or when asked to check an article's structure, layout contract, or file organisation."
---

# Article Structure Check

A hard gate. An article that fails does not get published until it passes or is explicitly overridden.

## Overview

The first article on this site was a single 1197-line `index.html` with its stylesheet, its navigation JavaScript, and twenty-five slides of content in one file. Everything worked. It was still wrong, for one reason that only shows up on article two: a fix to the fit engine or the layout contract has to be made once per article, by hand, forever.

So the contract is: **content lives in the article, behaviour and appearance live in `assets/`.**

This check enforces that contract, and a few things that are cheap to verify and expensive to discover after publishing — a broken asset path, a slide count that drifted from `articles.json`, a missing Open Graph tag that makes a shared link render as a bare URL.

Read [references/layout-contract.md](references/layout-contract.md) for the full file layout and how to scaffold a new article correctly.

## Prerequisites

* Run from the repository root.
* Filesystem reads only. No browser, no scripts, no network.

## Rules

Every rule is a hard failure. There are no warnings — a warning in a publish gate is a rule nobody enforces.

| ID | Rule | Fails when |
|---|---|---|
| R1 | No inlined stylesheet | An article `index.html` contains a `<style>` block longer than **5 lines**. Short critical-path blocks are allowed; a stylesheet is not. |
| R2 | No inlined script | An article `index.html` contains a `<script>` block without `src` longer than **10 lines**. |
| R3 | Shared assets linked | A deck article does not link `assets/deck.css`, a `assets/theme-*.css`, and `assets/deck.js`. |
| R4 | Paths resolve both ways | An asset is referenced with a root-absolute path (`/assets/...`). These resolve on GitHub Pages and **silently 404 when the file is opened locally**, which is exactly how the UX review runs. Use relative paths (`../../assets/...`). |
| R5 | Catalogued accurately | The slug has no `articles.json` entry, or the entry's `length` slide count does not match the number of `<section class="slide">` elements in the file. |
| R6 | Meta complete | Missing any of: `viewport`, `description`, `author`, `og:type`, `og:title`, `og:description`, `og:url`. |
| R7 | No duplicated rules | A per-article `article.css` restates a selector already defined in `assets/deck.css`. Overrides are fine; copies drift. |
| R8 | Exactly one theme | An article links zero themes, or more than one. Two themes means the cascade decides your design, not you. |
| R9 | Theme contract complete | A `theme-*.css` omits any token from the contract, or defines a selector other than `:root`. A missing token falls back silently to whatever the browser inherits. |
| R10 | Framework holds no literals | `deck.css` contains a literal colour, font size, or slide padding instead of a token. That is the rule that keeps themes able to change anything. |

## Required Steps

### Step 1: Resolve the article

Take the slug from the request, or from the file currently being edited. If the request is ambiguous, list the slugs under `articles/` and stop.

### Step 2: Read and count

Read `articles/<slug>/index.html` and `articles.json`. Count `<section class="slide">` occurrences. Extract every `<style>`, every `<script>`, every `href`/`src`, and the meta tags.

### Step 3: Evaluate every rule

Evaluate all ten. Do not stop at the first failure — a partial list means a second round trip for the author.

### Step 4: Report

State **PASS** or **FAIL** in the first line. On failure, one row per broken rule:

```text
FAIL · 2 rules broken

R1  inlined stylesheet, 159 lines          index.html:13-172
    → move to assets/deck.css, link with ../../assets/deck.css

R5  articles.json says "24 slides", file has 25    articles.json:14
    → correct the entry, or find the slide that was added without being counted
```

Every row names the file, the line, and the correction. A gate that says "structure is wrong" without saying where is a gate people learn to route around.

## Override

The gate can be bypassed, deliberately and on the record. The author must write:

```text
publish anyway: <reason>
```

When overridden, restate the broken rules, record the reason verbatim in the report, and proceed. Never infer an override from impatience, from "just publish it", or from silence. If the reason is missing, ask for it — the point of the phrase is that a bypass leaves a trace.

## Rules for this skill

* Report only what was read. Never assume a file exists because the convention says it should.
* Do not fix during a check. Report, then fix as a separate agreed step.
* When a new article is being created, run this **before** writing content, so the scaffold is right and the content is never entangled with the styles.
