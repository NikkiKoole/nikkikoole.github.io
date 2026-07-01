# Mipolai studio — plan (as of 2026-07-01)

Notes from a thinking-out-loud session, written up so the direction doesn't
get lost. Nothing here is being executed yet — see "Not doing now" at the
bottom for what's explicitly parked.

## The shift

Mipolai stops being "the kids-app product" and becomes **the studio name**.
Underneath it sit separate brands, each with its own audience:

- **Mipo** — hand-drawn, kids-oriented. This is what mipolai.com currently
  *is* end-to-end (Mipo Puppetmaker, the Mipos characters, this whole site's
  current copy and content).
- **TinyJam** *(working name, unannounced/secret)* — a music app, not
  kid-oriented. Planned to have many tiny in-app-purchasable sound toys/racks.
  Built with dreamengine.
- **A GTA1-inspired game** — another release being carved out of the
  dreamengine cart pile.
- **Adult-oriented art/creative software** — early, unnamed. Not sexual
  content, just not aimed at children the way Mipo is.
- A dreamengine "football manager" cart that Nikki's son Theo already likes —
  a candidate future Mipo release (validated with the actual target audience
  before any polish work started).

Underneath all of it: **dreamengine** (`~/Projects/dreamengine`), the
hand-built fantasy console/engine. It now has hundreds of small carts and a
working native iOS builder — it's the production pipeline feeding every
brand above, not just a hobby project anymore.

## The positioning: a toy maker, for small kids and big kids

The umbrella idea for the studio homepage (2026-07-01): **Nikki Koole is a
toy maker — he makes toys for small kids and toys for big kids.** "Toy"
here means playful, handcrafted, non-cynical, no ads/tricks/manipulation —
not literally a plaything for children. This resolves the audience-split
tension cleanly without it reading as a jarring pivot on one domain:

- **Mipo** = toys for small kids (what mipolai.com already is).
- **TinyJam**, the GTA1-inspired game, the adult art software = toys for
  big kids — grown-ups who still want to play, not a "serious/adult"
  rebrand away from the studio's actual voice.

It's not a new voice to adopt — it's naming what's already there. The
existing About/interview copy is already full of toy/play language
("Mipos," handcrafted whimsy, "good apps... just make things you would
have liked when you were young yourself"). This becomes the actual
positioning language for the homepage rework flagged as a prerequisite
under "Decided architecture" below — e.g. a root pitch along the lines of
*"Nikki Koole makes toys — for small kids and big kids,"* with `/mipo/`
and `/tinyjam/` etc. each being "here's a toy for [audience]."

**Chosen root tagline (2026-07-01): "One dad, two kid-testers, and a pile
of weird little apps."** Landed on after rejecting more generic options
("good apps made with love," "good apps for you and your kids" — both
sound like every other solo indie studio's tagline and don't actually
sound like Nikki specifically). This one leans into what's genuinely
distinctive across the existing site copy: self-aware weird humor (the
fake AI interview, the poem about smelling weird, Mipos who "moan, humf,
fart, and breathe") and the fact that Herman and Theo are real, named
co-workers here (bug-finder and rollercoaster-artist/cart-tester), not
abstract "for children everywhere" marketing language. Also note: "for
you and your kids" was specifically rejected as the *root* tagline because
it re-implies a family/co-play framing that undersells/contradicts TinyJam
living one click away — it may still be worth reusing at the `/mipo/`
level specifically, where that framing is accurate.

## Site/domain architecture

- **GitHub Pages subfolders work fine on one domain.** `mipolai.com/mipo/`,
  `mipolai.com/tinyjam/` etc. is no different from the `/makes/`, `/apps/`
  subfolders this site already has. No technical blocker there — this is
  the shape actually chosen, see "Decided architecture" below.
- **The constraint that matters for subfolders**: one repo = one GitHub
  Pages deployment = one domain. Subfolders under `mipolai.com` all have to
  come out of *this one repo's* build — there's no way for a different
  repo's content to just appear at a subpath of mipolai.com without that
  content physically landing inside this repo's `docs/` first.
- **dreamengine demonstrates the git-push-to-deploy pattern via a custom
  GitHub Actions workflow** (`pages.yml`) — it needs one because its WASM
  build step can't run in GitHub's environment, so it builds locally and
  commits the output, and the workflow just uploads `site/` on push.
- **This repo (nikkikoole.github.io) already has the same "push and it's
  live" behavior, with even less setup than dreamengine — confirmed
  2026-07-01.** Checked via `gh api repos/NikkiKoole/nikkikoole.github.io/pages`:
  Pages is already enabled, `status: built`, source = `master` branch's
  `/docs` folder, no custom Actions workflow involved at all — this is
  GitHub's own built-in ("legacy") Pages builder, which just republishes
  `docs/` automatically on every push. Verified live: `https://nikkikoole.github.io/`
  is serving today's exact content, including this session's fixes. No
  workflow needs to be written for this repo — it was already doing the
  thing the whole time.
- **mipolai.com's live traffic is NOT on this pattern yet** — the *domain*
  still points at Hostnet, deployed by hand via FTP (`cname: null` in the
  Pages API response confirms no custom domain is attached to this repo's
  Pages site). The only remaining gap is attaching `mipolai.com` as this
  repo's custom domain (a `CNAME` file + a DNS record) — not building any
  new automation.
- **The static site generator (`main.lua`, hand-rolled Lua) is not the
  bottleneck** and doesn't need replacing. The bugs found and fixed this
  session (sitemap URLs, canonical tags, stale domain) were logic-drift
  bugs, not architecture problems. Give it the same CI treatment
  dreamengine already has, rather than migrating to a different generator.
- **`nikkikoole.com` doesn't exist** — not registered, no DNS. Any old
  reference to it (there was one, in `main.lua`) has already been corrected
  to the real domain, `nikkikoole.nl`.

## Cloudflare Pages as an alternative to GitHub Pages

Cloudflare has its own git-push-to-deploy static hosting — **Cloudflare
Pages** (branding increasingly merged into "Workers & Pages"). Connect a
GitHub repo, push to a branch, it auto-builds and deploys — same category
as GitHub Pages, not a reason on its own to prefer one over the other.

Where it differs, relevant to the multi-brand/multi-domain question above:

- **Multiple custom domains CAN attach to one Pages project** — free plan
  allows up to **100 custom domains per project** (confirmed via
  Cloudflare's own docs). But by default they all serve the *identical*
  deployed content — attaching a second domain doesn't give you a second,
  different site.
- **The useful trick: a custom domain can be pinned to a specific branch.**
  One repo, multiple branches (e.g. `mipo` and `tinyjam`), each branch gets
  its own custom domain showing that branch's build. This is a real
  "one repo, several domains, different content" pattern Cloudflare
  supports natively — GitHub Pages has no equivalent (one repo = one
  custom domain, period).
- **True path-based routing** (`Host` header decides which folder gets
  served, all from one deployment) isn't a built-in toggle on either
  platform — would need a Workers/Pages-Functions script doing the routing
  yourself. More moving parts; not recommended unless there's a strong
  reason to keep everything in one repo.
- **Not the path taken**: the actual decision (see "Decided architecture"
  below) went with subdirectories of one repo, not per-brand repos/domains
  — so neither the multi-domain-per-project trick nor the branch-to-domain
  trick end up in use for Mipolai's own brands. Kept here as reference in
  case a specific brand later gets pulled out to its own domain.

**Free plan limits** (from Cloudflare's own docs, checked 2026-07-01): 500
builds/month (1 build at a time, 20 min timeout), 20,000 files per site,
25 MiB max file size, a `_headers` file supporting up to 100 rules (this is
the thing GitHub Pages can't do at all — custom response headers like
COOP/COEP, relevant to the earlier WebAudio/dreamengine discussion),
2,000 static + 100 dynamic redirects, 100 projects per account. Bandwidth
isn't capped on the free plan (Cloudflare's CDN model, not metered like
typical hosting). If the 500 builds/month free cap is ever hit, Cloudflare's
paid Workers plan starts around $5/month — exact paid-tier build caps
weren't independently verified against official docs, so treat that number
as directional, not confirmed.

**Which is easier for an AI agent (Claude) to drive:** GitHub Pages, even
more so than first thought — for this repo there's nothing to build at all,
it's already live (see above). `git`/`gh` are already authenticated and
usable from the terminal, so an agent can verify/manage it entirely without
touching a browser. Cloudflare Pages would need either the human clicking
through Cloudflare's dashboard, or `wrangler` + a Cloudflare API token set
up first so an agent can drive it via CLI too — not a hard limitation of
Cloudflare, just a setup gap that doesn't exist for GitHub today. DNS
changes are unavoidable manual/dashboard work either way, regardless of
which hosting is picked. This tipped the decision below toward using
Cloudflare only for domains/DNS, not for hosting.

## Decided architecture (2026-07-01, updated same day)

Went back and forth between subdomains and subdirectories — landed on
**subdirectories**, deliberately, after weighing both:

- **Mipolai.com is the studio, full stop.** The root `index.html` becomes
  the studio homepage — not Mipo's homepage wearing a studio label. It's
  the map: it links out to whichever brands are ready to be shown.
- **Every brand is a subdirectory of mipolai.com**: `/mipo/` (kids,
  hand-drawn — this is where the *current* mipolai.com content and copy
  moves to), `/tinyjam/`, and whatever the GTA1 game and adult-art brand end
  up called. All served out of **this one repo** (nikkikoole.github.io),
  one GitHub Pages deployment, one domain, one cert.
- **Why subdirectories over subdomains**, honestly weighed: subdomains
  would've meant every brand is a fully independent repo/deploy with zero
  coordination — simpler plumbing, and it would have preserved the
  audience-separation that was the original reason for splitting into
  brands (a subdomain reads as more distinct than a subpath, both to users
  and to search engines). Subdirectories consolidate SEO/domain authority
  onto one cert and one sitemap and are just easier for Nikki to reason
  about day to day. Trade-off accepted: since everything lives under one
  domain, keeping Mipo (kids) and TinyJam (not-kids) from bleeding into
  each other is now a matter of *deliberate navigation design*
  (don't surface TinyJam from anywhere in `/mipo/`'s pages or vice versa),
  not something the domain boundary enforces for free. Worth remembering
  if this ever feels like it's causing brand confusion in practice — the
  subdomain option is still there to fall back to per-brand, later, without
  much rework, since nothing here prevents *one specific* brand from being
  pulled out to its own domain/repo if it outgrows the subdirectory.
- **Content built in a separate repo (e.g. TinyJam via dreamengine) has to
  land inside this repo's `docs/tinyjam/` to exist at that subpath.**
  Decided approach: **fetch-and-copy in this repo's own deploy workflow**
  (checkout or download the other repo's latest build output, `cp` it into
  `docs/<brand>/`, then deploy) — always fresh on every run, no manual step.
  **Not git submodules** — both this session and a separate Claude session
  independently landed on the same reasoning: submodules are a known rough
  edge for a solo dev working with an AI agent (empty folders on plain
  clone, a separate "bump the pointer" step that's easy to forget, agents
  tripping on detached-HEAD states inside them). A plain copy-step in a
  script is just one more line in a build script Nikki already knows how
  to read, not a new git subsystem to learn.
- **Cloudflare**: domain registration (where possible — see `.nl`
  restriction below) + DNS + free SSL/CDN for `mipolai.com`, fronting...
- **GitHub Pages**: ...the actual hosting backend for the one, unified
  mipolai.com deployment — chosen over Cloudflare Pages specifically for
  agent-friendliness (see above), now more relevant than ever since a
  human-in-the-loop AI agent is expected to do most of the wiring/building.
- **Unlisted/experimental things stay separate from all of this** — plain,
  un-custom-domained GitHub project pages, `nikkikoole.github.io/<reponame>/`,
  not linked from mipolai.com's root at all, reachable only with the direct
  URL. This is exactly the pattern dreamengine already uses today
  (`nikkikoole.github.io/dreamengine/`) and is unaffected by the
  subdirectory decision above — it's a separate axis (findable vs. not),
  not competing with it.
- **Consequence this locks in**: reworking mipolai.com's root homepage/about
  copy from "kids app company" to "studio, here's what we make" (with
  `/mipo/` becoming the place that carries the current kids-specific
  messaging) stops being a someday nice-to-have and becomes a real
  prerequisite for this structure to make sense — the root page can't
  keep being Mipo's pitch once other brands live one level down from it.
  Still not being done now (see "Not doing now"), but it's a blocking
  dependency of this plan now, not an independent item.

## Moving off Hostnet to Cloudflare

Both `mipolai.com` and `nikkikoole.nl` currently sit on Hostnet (registrar
+ DNS + mail). Nikki wants off Hostnet generally. Checked as of 2026-07-01:

- **`.nl` can't move registrars to Cloudflare** — confirmed via Cloudflare's
  TLD list and an active community thread (Feb 2026) of people still
  requesting `.nl` support. `nikkikoole.nl` would need to stay at Hostnet or
  move to another `.nl`-accredited registrar (e.g. TransIP) if a registrar
  change is ever wanted. Its DNS/SSL can still move to Cloudflare
  independent of the registrar — Cloudflare DNS works for any TLD
  regardless of who holds the registration. That DNS-only move is what
  actually fixes its expired-cert problem (see `TODO.md`).
- **`.com` has no such restriction** — `mipolai.com` can move both DNS and
  registration to Cloudflare.
- **Email is not actually in use** on `mipolai.com` despite MX/SPF/DMARC
  records existing (DMARC is `p=reject`, which would matter a lot if mail
  were live — it isn't, so this is a low-risk migration, not a delicate
  one). No DKIM record was found under common selector names; irrelevant
  given no live mail.
- Current `mipolai.com` DNS snapshot for reference: `A` → `77.111.243.35`
  (Hostnet's own server — the FTP-deploy target, not GitHub Pages), TTL
  3600s (fast propagation, no need to pre-lower it), no CAA record, Google
  Search Console verified via TXT.

**Planned staging — reordered 2026-07-01 to de-risk further: prove GitHub
Pages *before* touching DNS at all**, rather than moving DNS first and
figuring out hosting after. Turns out step 1 below is already done, not a
setup task:

1. ~~Set up GitHub Pages hosting for this repo~~ **Already done, confirmed
   2026-07-01** — this repo has had GitHub's built-in Pages builder enabled
   the whole time (`master` branch, `/docs` source, no custom workflow
   needed), and `https://nikkikoole.github.io/` is live and current.
   `mipolai.com`'s DNS still points at Hostnet, so this has been running in
   parallel, invisibly, with zero effect on live traffic — exactly the
   de-risking this reordering was going for, just already true by accident
   of how the repo was originally set up.
2. **Verify it end-to-end** — spot checks done this session look correct
   (site renders, sitemap/canonical tags correct, no broken links).
3. **Tried and reverted, 2026-07-01: `docs/CNAME` containing `mipolai.com`.**
   This was NOT the safe, zero-risk prep step it was expected to be —
   attaching a custom domain made GitHub start 301-redirecting the *entire*
   `nikkikoole.github.io` namespace to `mipolai.com`, including other
   repos' project pages. Broke `nikkikoole.github.io/dreamengine/` (dead-
   ended in a 404 on Hostnet, which has no `/dreamengine/` content) for as
   long as the file was live. Reverted immediately. **Corrected learning:
   adding a `CNAME` has an immediate, real side effect independent of
   whatever DNS is doing — it is NOT safe to stage ahead of time. It needs
   to go back in as part of the SAME step as the actual DNS cutover (step 7
   below), atomically, not in advance.** Also added `docs/.nojekyll` in the
   same session while debugging an unrelated GitHub Pages build error
   (turned out to be a stale-API-status red herring, not a real build
   failure — see build history for the full story) — harmless and correct
   to keep regardless of whether it was the actual fix.

**From here on, every remaining step needs Nikki's own hands** — Cloudflare
account access and Hostnet's domain panel aren't things an agent can drive:

4. Sign up for Cloudflare (if not already), add `mipolai.com` as a site.
5. Let Cloudflare auto-scan the existing DNS, then double-check it actually
   caught the MX/SPF/DMARC records correctly (see snapshot above) before
   trusting it — worth re-verifying with `dig` afterward.
6. Grab the two Cloudflare-assigned nameservers, switch them over in
   Hostnet's domain panel. This is the one real point-of-no-return-feeling
   moment, though it's still reversible by pointing nameservers back.
7. Once propagated: re-add `docs/CNAME` (`mipolai.com`) AND add either the
   4 GitHub Pages `A` records
   (`185.199.108.153` / `.109.153` / `.110.153` / `.111.153`) or use
   Cloudflare's CNAME-flattening to point the apex at
   `nikkikoole.github.io` — this is the actual cutover, where mipolai.com
   starts serving from GitHub Pages instead of Hostnet. Re-adding the
   `CNAME` file at this exact moment (not before) lets GitHub verify and
   activate the custom domain once DNS resolves, without any window where
   it's redirecting the whole `nikkikoole.github.io` namespace to a domain
   that isn't pointed at GitHub yet. Reversible by pointing DNS back at
   Hostnet's IP if anything looks wrong.
8. **Same DNS-only move for `nikkikoole.nl`**, same way, which incidentally
   fixes its expired Plesk cert via Cloudflare's free auto-SSL. Registration
   stays at Hostnet (no `.nl` alternative on Cloudflare).
9. **(Optional, later) Registrar transfer for `mipolai.com` only** — EPP
   code from Hostnet, unlock domain, transfer via Cloudflare Registrar
   (~1 week, includes a 1-year renewal at cost price). Not required for the
   DNS/SSL benefits above; can be done anytime, or never.

## Curated beta/marketing showcase

Nikki wants a small, low-friction page of a handful of curated WASM cart
builds to send to people he's reaching out to for marketing/beta-testing.
This fits naturally inside dreamengine's existing `site/` + GitHub Pages
setup (it already has the WASM build pipeline, gallery tooling, and the
`coi-serviceworker` audio fix working) — not something to build fresh on
mipolai.com's pipeline. This is a dreamengine-repo task; the cart
triage/curation conversation for it is already happening over there.

## Not doing now (explicitly parked)

- Reworking mipolai.com's root homepage/about copy from "kids app company"
  to "studio, here's what we make" + migrating the current kid-specific
  content/copy down to `/mipo/` — now a real prerequisite of the decided
  architecture (see above), not just a someday nice-to-have, but still not
  started. Blocked on TinyJam etc. being further along publicly.
- Actually creating the per-brand subdirectories and their content
  (`/tinyjam/`, the GTA1 game, the adult art brand) — shape is decided
  (subdirectory of this repo, fetch-and-copy for content built elsewhere
  like dreamengine), but none exist yet; waiting on those brands being
  further along.
- Adding the fetch-and-copy CI step for brands whose content lives in
  another repo (e.g. TinyJam via dreamengine) — needed once a brand
  actually has content to pull in, not before. (No general-purpose deploy
  workflow needed beyond this — GitHub's built-in Pages builder already
  handles the base case, see "Site/domain architecture" above.)
- Wiring `mipolai.com`'s DNS to this repo's already-working Pages site — a
  concrete, low-risk next step, offered but not yet greenlit.
- The Cloudflare migration staged above — plan is written, nothing clicked
  through yet.
