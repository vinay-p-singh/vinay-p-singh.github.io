---
name: linkedin-post-ideas
description: "Turn a published article on this site into LinkedIn post drafts with researched, tiered hashtags, @mention suggestions, and a pre-publish verification checklist. Use when asked to promote, share, or announce an article on LinkedIn, draft a LinkedIn post, or find hashtags for a post."
---

# LinkedIn Post Ideas

Turns an article published on this site into three distinct LinkedIn post drafts, each with a tiered hashtag set, @mention suggestions, and a checklist to verify before publishing.

## Overview

This skill exists because LinkedIn changed underneath most hashtag advice still circulating. Hashtag *following* was removed in late 2024, public follower counts went with it, and the feed is now ranked by a model that reads your post text directly. Hashtags survive as a categorisation and search signal — worth adding, not worth obsessing over.

The practical consequence shapes everything here:

* **The hook does the work, not the tags.** Name the subject in plain language in the first two lines.
* **Follower counts cannot be looked up.** This skill never states one. Tiers come from a curated corpus, and every tag is verified by you in the composer before publishing.
* **Three to five tags, tiered.** More is not better and can suppress distribution.

Read [references/platform-rules.md](references/platform-rules.md) for the evidence behind each rule, [references/hashtag-corpus.md](references/hashtag-corpus.md) for the tag corpus and banned list, and [references/post-formats.md](references/post-formats.md) for the post archetypes and hook patterns.

## Prerequisites

* Run from the repository root, so `articles.json` and `articles/` are reachable.
* No installation, no API keys, no scripts. This is a documentation-driven skill.

## Quick Start

Ask for a post using the article title, its slug, or "the latest":

```text
Draft LinkedIn posts for "Software fundamentals matter more than ever"
```

```text
LinkedIn post ideas for the latest article
```

The default output is three drafts. Ask for one archetype by name (see the post formats reference) to narrow it.

## Required Steps

### Step 1: Resolve the article

Read `articles.json` at the repository root. Match the user's request against `title` and `slug`. If the request says "the latest", take the entry with the most recent `date`.

If nothing matches, list the available titles and stop. Do not guess.

Record the `slug`, `title`, `summary`, `topics`, and `format`.

### Step 2: Read the article for substance

Read `articles/<slug>/index.html` in full. Extract:

* The central claim, in the author's own framing.
* Two or three concrete pieces of evidence — numbers, before/after measurements, named artefacts.
* Anything the article admits went wrong. Honest failure is the strongest post material available and it is usually already in the text.

Quote and paraphrase only what is actually in the article. Never invent a statistic, a result, or an anecdote to make a post land better.

If the article is `format: Deck`, note that slides are deep-linkable with `#s<N>` — for example `.../articles/<slug>/#s14`. A post that points at one specific slide converts better than one that points at the whole deck.

### Step 3: Choose three angles

Pick three genuinely different entry points into the same article, so the drafts are alternatives rather than rewrites of each other. Use [references/post-formats.md](references/post-formats.md) to select archetypes. Default mix:

1. **Contrarian** — the claim most readers would push back on.
2. **Receipts** — the hardest evidence in the piece, stated plainly.
3. **Honest failure** — what the article admits it got wrong.

State which archetype each draft uses.

### Step 4: Draft the posts

For each angle, follow the writing rules in [references/post-formats.md](references/post-formats.md). The non-negotiables:

* **First two lines carry the topic in plain words.** The ranking model reads the text; the tags are secondary. Assume everything past roughly the third line is hidden behind "see more" until someone expands it.
* One idea per post. No preamble, no "I'm excited to share".
* No hashtags inside the body. They go at the end only.
* Put the article link in the **first comment**, not in the post, because outbound links suppress organic reach. Note the intended comment text alongside the draft.
* Write in the author's voice: direct, concrete, willing to say what did not work.

### Step 5: Select and tier the hashtags

From [references/hashtag-corpus.md](references/hashtag-corpus.md), assemble **3 to 5** tags per post using the 1-2-2 structure:

| Tier | Count | Role |
| --- | --- | --- |
| Broad | 1 | Category placement |
| Mid | 2 | The actual audience |
| Niche | 2 | Precision, longer visibility |

Rules:

* PascalCase always — `#SoftwareEngineering`, not `#softwareengineering`.
* Every tag must match the post's real subject. A mismatched tag hurts more than the reach it buys.
* Screen every candidate against the banned list in the corpus. Drop anything on it.
* Vary the sets across the three drafts. Identical tags on every post is a pattern worth avoiding.

Check the `last_verified` date at the top of the corpus. If it is more than 90 days old, say so in the output and recommend a refresh pass before relying on the niche tiers.

### Step 6: Add @mentions

Tagging people measurably outperforms adding another hashtag. Suggest one or two genuinely relevant mentions — an author whose work the article builds on, or a project it cites.

Only suggest a mention where there is a real connection in the article. Flag each as needing confirmation that the person is on LinkedIn, since this skill cannot verify handles.

### Step 7: Emit the output

Produce, for each of the three drafts:

1. Archetype name and the angle in one line.
2. The post body, ready to paste.
3. Character count, and whether the hook survives the fold.
4. The hashtag set, labelled by tier.
5. Suggested @mentions, marked unverified.
6. The first-comment text containing the link.

Then one shared **pre-publish checklist**:

```text
[ ] Each hashtag typed into the LinkedIn composer to confirm it is live and active
[ ] @mention handles confirmed to exist
[ ] Link is in the first comment, not the post body
[ ] Hook reads well truncated at the fold
[ ] Tag count is between 3 and 5
```

The composer check is the only current source of live hashtag activity. This skill proposes; the composer confirms.

## Guardrails

| Never | Why |
| --- | --- |
| State a hashtag's follower count | LinkedIn removed public counts in late 2024. Any number would be fabricated. |
| Call a tag "trending" without a check | Trend claims need a live source this skill does not have. |
| Invent evidence not in the article | The article's credibility is the point of promoting it. |
| Exceed 5 hashtags | Past 5, returns decline and spam filtering becomes a risk. |
| Put the article link in the post body | Outbound links suppress organic reach. First comment instead. |

## Troubleshooting

| Problem | Cause | Fix |
| --- | --- | --- |
| No article matches the request | Title changed, or `articles.json` not updated | List available titles from `articles.json` and ask which one |
| Corpus is stale | `last_verified` older than 90 days | Refresh the niche tiers using the method in the corpus file |
| Drafts read the same | Angles too close together | Force three different archetypes from the post formats reference |
| A tag is rejected in the composer | Tag is dead or was renamed | Drop it and take the next candidate in the same tier |

> Brought to you by vinay199129/vinay199129.github.io
