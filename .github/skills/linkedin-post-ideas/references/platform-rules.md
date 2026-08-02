# LinkedIn platform rules

Evidence behind the rules in `SKILL.md`. Each claim carries its source so it can be re-checked when the platform changes again.

*Compiled: 2026-07-31*

## What changed, and when

LinkedIn removed **hashtag following** in late 2024, along with public hashtag follower counts, hashtag display on profiles, and hashtag suggestions in the search dropdown. Company Pages lost hashtags entirely — the "Specialisms" field replaced them.

The audience that used to browse a hashtag feed no longer exists. Any advice written before 2025 that treats hashtags as a discovery channel is describing a platform that is gone.

## How the feed ranks now

Ranking runs through **360Brew**, a 150-billion-parameter model that replaced thousands of separate recommendation systems. It reads posts, profiles, and interactions as natural language, matching content to people by topic relevance and demonstrated expertise rather than by metadata.

Source: LinkedIn Foundation AI Technologies, [arXiv 2501.16450](https://arxiv.org/abs/2501.16450).

Two consequences drive the drafting rules:

* **Your words do the work hashtags used to.** Naming the subject plainly in the opening lines gives the model more signal than five tags.
* **Topic consistency compounds.** The model cross-checks whether a post's topic matches the expertise in your headline, About section, and history. Posting inside your lane distributes better than wandering.

## Do hashtags still do anything

Yes, modestly, and the honest framing is that they are a hygiene factor rather than a growth lever.

| Study | Scale | Finding |
| --- | --- | --- |
| Metricool, June 2026 | 673,658 posts, 63,108 accounts | Posts with at least one hashtag: **+85% impressions**, +85–88% interactions vs. platform average |
| Usera & Durham, *Business and Professional Communication Quarterly*, May 2025 | 991 posts, peer-reviewed | Hashtags: **≈ +6%** reactions. Tagging people: **≈ +15%**. Recommends 2–3 tags |

The counterpoint deserves recording: strategist Chris Donnelly, after analysing 300,000 posts, told Forbes in January 2026 that "hashtags haven't worked in years." He is right about discovery and wrong about categorisation. Both readings coexist — dead as a discovery channel, alive as a cheap labelling signal.

Note the gap the Metricool data exposes: the lift comes from using *a few* rather than *none*. The average account already over-tags at 5.85 (Company Pages) and 6.72 (Personal Profiles), both above the effective range.

## The operating rules

| Rule | Detail |
| --- | --- |
| Count | 3–5. LinkedIn's own guidance. Below 3 under-labels; above 5 risks spam filtering |
| Structure | 1 broad + 2 mid + 2 niche (the "1-2-2"), or 1 broad + 2–3 niche for a tighter set |
| Case | PascalCase — readability, screen-reader accessibility, and it looks professional |
| Placement | End of the post only. Never scattered mid-sentence, never in the first line |
| Comments | Hashtags in comments do nothing for discoverability |
| Sponsored posts | LinkedIn removed hashtags from promoted posts entirely |
| Outbound links | Suppress organic reach. Put the link in the first comment |
| Rotation | Keep 15–20 vetted tags in 3–4 themed sets and rotate sets, not individual tags |
| Editing | Posts can be edited after publishing to fix tags — three dots, Edit post |

## Format does not change the count

3–5 applies to text, video, carousel, poll, and article alike. What changes is emphasis: text posts lean hardest on tags because there is no media signal to read; carousels and video already carry a dwell-time advantage. Link posts do well with 3, since extra tags will not offset the link penalty.

## Verifying a tag is alive

The only live signal available today is **LinkedIn's own composer autocomplete**. Type `#` plus the topic and the composer surfaces what the platform is currently indexing. External generators are brainstorming aids; they return the same generic set and cannot see current activity.

Watch for **dead tags** — high historical follower counts with no recent posts. Recency of posts matters more than any legacy count.

Other discovery routes worth using:

* Study which tags high-performing creators in the field use consistently.
* Search the topic and filter to Posts, sorted by Recent, to see what real activity looks like.

## Sources

* ConnectSafely, *LinkedIn Hashtags 2026: How Many to Use & Best Practices*, updated 20 July 2026
* Sprout Social, *LinkedIn Hashtags: How to Use Them in 2026*
* Metricool, *Do Hashtags Work on LinkedIn?*, 9 June 2026
* Usera & Durham, *Business and Professional Communication Quarterly*, 16 May 2025
* LinkedIn Foundation AI Technologies, *360Brew*, [arXiv 2501.16450](https://arxiv.org/abs/2501.16450)
* Forbes, *The LinkedIn Algorithm Changed Again*, 12 January 2026
* Wild & Free Tools, *Best LinkedIn Hashtags for Tech, AI, and Startup Posts*, March 2026
