# TODO

Notes from an SEO/findability pass (2026-07-01). Not urgent unless marked.

## Infra

- [ ] **Fix the SSL cert on nikkikoole.nl — in progress, see `PLAN.md`'s
      "Status at a glance" for the actual current state and exact next
      action (not repeated here to avoid the two docs drifting apart).**
      Originally: expired Plesk placeholder cert (expired 2025-03-07),
      `https://nikkikoole.nl` throws a hard TLS error, only `http://` works.
      Fix is a DNS-only move to Cloudflare (free auto-SSL) — underway.
- [ ] Once the cert is fixed, switch `nikki.md`'s `metaUrl` and the `canon`
      value in `main.lua` (the `general-canonical-nikki` call) from
      `http://nikkikoole.nl` to `https://nikkikoole.nl`.

## Content decisions (need you, not just code)

- [ ] Blog and Stuff sections have zero published content beyond their intro
      page — every post under `content/blog/` and `content/stuff/` is
      `draft=true`. Nav links to `/apps` and `/stuff` are commented out in
      `templates/header.template` for what looks like this reason. Decide:
      finish/publish some of these, or leave them commented until there's
      real content.
- [ ] `/apps` has real published content (puppetmaker) but still has no nav
      link. Worth adding back?
- [ ] `content/old-intro-more-text.md` isn't referenced by `main.lua` at all —
      dead content file. Delete it or fold it in somewhere.

## Follow-up once new content is published

- [ ] The meta-tag pass only touched published (non-draft) pages. If any
      draft post above gets published, it'll need its own `meta=true` +
      `metaDescription` + `metaImg` + `metaUrl` block (see `content/makes/achtbaan.md`
      for the pattern).

## Housekeeping

- [x] Commit the pending changes from the SEO pass (sitemap fix, canonical
      tags, meta tags, orphan-page redirects, deleted stale sitemap.xml).
      Done 2026-07-01.
- [x] `git add` the new `docs/assets/images/track1.jpg` / `track2.jpg` /
      `track3.jpg`. Done 2026-07-01.
