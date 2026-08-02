# Post formats

Archetypes, hook patterns, and writing rules for drafting from an article.

## The fold

Only the first two or three lines show before "…see more". Roughly 200 characters, varying by device. Everything that earns the expand has to happen there.

Two rules follow:

* **Name the subject in plain words up top.** The ranking model reads the text and the reader decides from it. Both are served by the same sentence.
* **No throat-clearing.** "I'm excited to share", "Thrilled to announce", "In today's fast-paced world" — these spend the entire visible portion saying nothing.

Post limit is 3,000 characters. The useful range is far below it; 800–1,300 reads well.

## Archetypes

### 1. Contrarian

Lead with the claim in the article most readers would argue with. State it flatly, then give the reasoning that makes it defensible.

Works when the article genuinely holds a position. Fails when the position is manufactured for the post — readers detect it and the comments turn hostile rather than curious.

> Code got cheaper to write. It did not get cheaper to own.

### 2. Receipts

Lead with the hardest number in the article. No setup, no context sentence first — the number is the hook.

Works when the article contains real measurements. Never invent or round one into something more impressive.

> One file went from 1,001 lines to 216. The behaviour did not change.

### 3. Honest failure

Lead with what the article admits went wrong. This consistently outperforms the polished version, and most articles already contain the material — it is usually the section the author was most tempted to cut.

Requires the failure to be genuine and specific. Fake humility reads worse than no post.

> We were not doing TDD. Here is what that cost us, in detail.

### 4. Teardown

Take one decision from the article and walk it: what the options were, what was chosen, what it cost. Narrow beats broad — one decision explained properly beats five listed.

> Two files. 3,250 lines. The question was not "how do we split this" but "along what seam".

### 5. Open question

End on something genuinely unresolved in the article, and ask it straight. Only use when the question is real — rhetorical questions posted as engagement bait are transparent.

> If the tests pass and the test was wrong, what exactly did the green tick buy you?

## Writing rules

| Rule | Why |
| --- | --- |
| One idea per post | Three ideas produce a post about nothing |
| Short paragraphs, one to two lines | Feed reading is scanning; walls of text collapse |
| Concrete over abstract | "216 lines" travels; "improved maintainability" does not |
| Author's voice | Direct, specific, willing to name what failed |
| No hashtags in the body | They go at the end, after the content |
| Link in the first comment | Outbound links in the body suppress organic reach |
| No emoji bullets | Reads as marketing on a technical post |

## Deep-linking deck articles

Articles with `format: Deck` support `#s<N>` on the URL — `.../articles/<slug>/#s14` opens directly at slide 14.

Pointing a post at the one slide it discusses converts better than pointing at a 24-slide deck and asking the reader to hunt. Use it especially with the Receipts and Teardown archetypes, where the post is about one specific piece of evidence.

## Anti-patterns

* **The summary post.** Restating the article's table of contents gives no reason to click.
* **The engagement-bait question.** "Thoughts?" appended to a statement is not a question.
* **The tag stack.** Eight hashtags below three lines of text signals a press release.
* **Borrowed authority.** Quoting a well-known name without engaging the argument. Name the source, then say what you actually think.
* **The identical trio.** Three drafts that differ only in wording. Different archetypes, or it is one post with variants.
