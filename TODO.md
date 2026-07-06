# TODO

Notes from an SEO/findability pass (2026-07-01). Not urgent unless marked.

## Infra

- [x] **Fix the SSL cert on nikkikoole.nl — DONE 2026-07-02.** Was an
      expired Plesk placeholder cert (expired 2025-03-07), `https://` threw
      a hard TLS error, only `http://` worked. Fixed by moving DNS to
      Cloudflare and setting the two `A` records (apex + wildcard) to
      Proxied. Cloudflare's SSL/TLS mode auto-selected **Full** (works —
      Full is non-strict, so it ignores the origin's still-expired cert
      while serving browsers a valid edge cert; do NOT switch to Flexible or
      Full-strict). Verified: edge serves a valid **Google Trust Services**
      cert (valid 2026-07-01 → 2026-09-29, auto-renews), HTTP 200. See
      `PLAN.md` "Status at a glance" for the full move record.
- [x] Switch `nikki.md`'s `metaUrl` and the `canon` value in `main.lua`
      (the `general-canonical-nikki` call) from `http://nikkikoole.nl` to
      `https://nikkikoole.nl`. Done 2026-07-02, now that the cert works.
- [x] **Hostnet wind-down for mipolai.com — DONE 2026-07-06** (full record
      in `PLAN.md` § "HOSTNET WIND-DOWN DONE"): Webhosting Mini + PHP
      Extended Support cancelled (run out at end of term), `*.mipolai.com`
      wildcard `A` deleted in Cloudflare + verified, domain registration
      kept, nikkikoole.nl confirmed a separate dienst.
- [ ] **Mail-DNS cleanup for mipolai.com** (any time before 10-10-2026,
      when the cancelled hosting actually ends): in Cloudflare delete the
      MX records, `autoconfig`/`webmail` CNAMEs, `_autodiscover` SRV;
      harden SPF to `v=spf1 -all` and keep DMARC `p=reject` (anti-spoofing
      for a domain that never sends mail).

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
      for the pattern). (The 2026-07-06 studio-split pages `/mipo/` and
      `/tinyjam/` shipped with correct meta blocks — pattern followed.)

## Housekeeping

- [x] Commit the pending changes from the SEO pass (sitemap fix, canonical
      tags, meta tags, orphan-page redirects, deleted stale sitemap.xml).
      Done 2026-07-01.
- [x] `git add` the new `docs/assets/images/track1.jpg` / `track2.jpg` /
      `track3.jpg`. Done 2026-07-01.
