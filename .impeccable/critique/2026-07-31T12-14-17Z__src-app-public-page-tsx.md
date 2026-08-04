---
target: site public Cotonou.events (landing + evenements + alertes + soumettre)
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-07-31T12-14-17Z
slug: src-app-public-page-tsx
---
Method: dual-agent (A: ac466c10dc0d3f909 · B: a41d7a14be62c407a)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Skeleton.tsx / EventCardSkeleton exist but are imported nowhere; no loading.tsx, no Suspense; Toast.tsx has no role="status" |
| 2 | Match System / Real World | 3 | PhoneInput shows fixed +229 next to placeholder "01 XX XX XX XX" — concatenated that is not a valid number; isWeekend matches ANY Saturday/Sunday, including one 3 months out |
| 3 | User Control and Freedom | 2 | Filter/search state is React-local, never in the URL: no shareable filtered view, back-from-detail resets everything |
| 4 | Consistency and Standards | 2 | Two subscribe experiences with different reward models; three labels for one action; spacing is one-off pixels, not a scale |
| 5 | Error Prevention | 2 | SubscribeForm defaults consent:true invisibly while /alertes demands an explicit checkbox for the identical action; "max 5MB" with no client-side check |
| 6 | Recognition Rather Than Recall | 3 | Mobile drawer collapses applied filters to a bare count with no chips above results; wizard has no review step before irreversible submit |
| 7 | Flexibility and Efficiency | 2 | No sort control, no URL state, no "près de moi" despite lat/long in DB; pagination renders one button per page with no truncation |
| 8 | Aesthetic and Minimalist Design | 3 | Genuinely restrained and brand-coherent — strongest heuristic. Undercut by an Operate browse widget bolted into a Persuade page |
| 9 | Error Recovery | 2 | No error.tsx anywhere; getPublishedEvents swallows Supabase errors and returns [] — failure disguised as emptiness |
| 10 | Help and Documentation | 3 | /alertes FAQ accordion is well-targeted; nothing equivalent on /soumettre or /evenements |
| **Total** | | **24/40** | **Acceptable — significant improvements needed** |

## Design Specificity Verdict

**LLM assessment: ~70% interchangeable SaaS template, ~30% genuinely authored.** Strip the WhatsApp mockup and the FCFA strings and this landing page could be rebranded for an unrelated startup in an afternoon. Nothing in the design LANGUAGE says Cotonou — only the DATA does.

Category-default choices: HowItWorksSection (3 cards, 01/02/03 green pill numerals, one Lucide icon each) is the most-cloned section on the web; StatsSection contributes zero information the hero didn't already state; the avatar-stack + 5-gold-stars trust cluster; the full-bleed gray-900 CTA band; the dark 4-column footer. Typography has no idea behind it — every section heading is the same text-[30px] font-extrabold tracking-[-0.03em], so the page has repetition instead of rhythm. JetBrains Mono is downloaded by every public visitor and used only in /admin.

EventDetailView.tsx:96-104 renders a FAKE map — a CSS grid pattern with a rotated red teardrop — while the DB already stores latitude/longitude. A decorative lie where the product has real data.

What IS authored: WhatsAppDigest / HeroPhone reproduce real WhatsApp chrome (#075E54 header, #DCF8C6 bubble, #ECE5DD canvas, asymmetric bubble radius, blue double-check); PhoneInput with the +229 lock; format-phone.ts absorbing the 2024 Benin renumbering across four input shapes; format-date.ts deriving Benin wall-clock time via Intl on Africa/Porto-Novo.

The gap: the WhatsApp-first thesis lives in ONE component and is decoration everywhere else.

**Deterministic scan (detect.mjs, exit 2):** 1 finding across 76 .tsx files — `side-tab` at src/components/ui/Toast.tsx:65 (4px inline left border keyed to variant colour). Not a false positive. The detector's near-silence is itself the signal: this codebase has no slop-pattern problem, it has a specificity and correctness problem that a mechanical scan cannot see.

**Browser:** a dev server was already running on :3000 with real Supabase data flowing (live fbcdn image URLs in the DOM). 5 routes fetched and DOM-checked. Screenshots out of scope this pass.

## Overall Impression

Clean surface, hollow underneath. The engineering fundamentals a template never gets right — Benin timezone handling, phone-number forgiveness, WhatsApp chrome fidelity — are done with real care. The things a live product cannot survive without — showing events that haven't happened yet, telling an outage apart from an empty database, a visible focus ring — are missing.

Biggest opportunity: the site is a generic events directory that mentions WhatsApp. It should be a WhatsApp channel that happens to have a website.

## What's Working

1. **WhatsAppDigest / HeroPhone — demonstration instead of description.** The target user has this exact interface open all day. Rendering the product inside chrome they already trust collapses the explanation to zero. The only component here that could not have been lifted from a template.
2. **format-phone.ts — local knowledge encoded as forgiveness.** beninCoreDigits absorbs the 2024 renumbering across four input shapes and normalises to the 8 digits WhatsApp keys on. No Cotonou user is ever told their own number is wrong.
3. **format-date.ts — timezone correctness as an invisible design decision.** getBeninParts derives Benin wall-clock time via Intl rather than trusting the render server's locale. Every event time is a promise about when to physically be somewhere; most templates get this wrong.

## Priority Issues

### [P0] The site shows expired events, oldest first
**Verified in code.** src/lib/supabase/events.ts — getPublishedEvents(), getEventById() and getSimilarEvents() have NO date floor; getPublishedEvents orders date_debut ascending. filterEvents (src/lib/utils/filter-events.ts) never excludes past dates either.
**Why it matters:** thirty days after launch the six cards on the landing page will be the six OLDEST events in the DB, all already past. A first-time visitor's first evidence of value is six things that already happened. Category-level failure of the core promise.
**Fix:** add `.gte("date_debut", new Date().toISOString())` to all three queries; add a date guard in filterEvents; make isWeekend() mean the UPCOMING weekend.
**Suggested command:** $impeccable harden

### [P0] Empty and error states do not exist on the primary surface
EventsPreviewSection renders visible.map(...) with no empty branch. getPublishedEvents catches Supabase errors and returns []. No error.tsx or loading.tsx under src/app/(public)/. Skeleton.tsx / EventCardSkeleton are written and never imported; the shimmer keyframe animates nothing.
**Why it matters:** pre-launch empty DB, over-filtered results, and a Supabase outage all render identically — "0 événements disponibles" and a void. On launch day that void IS the landing page, and an outage reads as "this site has nothing".
**Fix:** empty branch reusing the SearchX pattern from EventsBrowser.tsx:81-100 but with a subscribe CTA; add error.tsx with retry; return a discriminated result so empty != failed; wire the orphaned skeletons into loading.tsx.
**Suggested command:** $impeccable onboard

### [P1] The whole event corpus ships to the client on every page load
Both / and /evenements call getPublishedEvents() (all rows, full description) and pass the array into "use client" components, so every event is serialised into the RSC payload. Landing renders 6. Compounding: zero next/image usage — raw <img> with no lazy, no width/height, no sizes — and JetBrains Mono downloaded on every public page for /admin only.
**Why it matters:** stated user is on a mid-range Android over metered, patchy data. At the V1 target of 84+ events that is 100 KB+ of JSON for content never displayed, plus unsized posters reflowing the grid. The premise is "no app to install" while shipping app-sized payloads.
**Fix:** server-side .limit(6) for the landing; URL search params + server-side queries for /evenements; drop description from list-view columns; lazy + explicit dimensions on all img; move the mono font into the /admin layout.
**Suggested command:** $impeccable optimize

### [P1] The high-stakes moment is under-reassured and inconsistently rewarded
SubscribeForm.tsx:120 REMOVES the privacy/STOP line on the dark variant; line 47 defaults consent:true with no visible checkbox while /alertes demands an explicit one; success is a 4-second toast at the opposite corner from the button pressed. No surface names the sending number or the first-send date. HeroPhone and WhatsAppDigest hardcode "Sam 17 mai".
**Why it matters:** in Cotonou an unknown number messaging you on WhatsApp is indistinguishable from a scam. The one reassurance that would work — "vous recevrez un message de +229 XX XX XX XX" — is absent, and the trust content that does exist is styled as fine print (text-xs text-gray-400) directly under the highest-stakes input.
**Fix:** one subscribe experience — inline success state that swaps the form in place, naming the sending number and the concrete first-send date. Keep the privacy line in the dark variant; restyle, don't delete. Add role="status" to the toast region.
**Suggested command:** $impeccable clarify

### [P2] Dead filter controls, and the cookie banner covers mobile filtering
**Verified in code.** filterEvents handles only filters.date === "weekend" — "Cette semaine" and "Ce mois" change NOTHING while still incrementing countActiveFilters, so the button reads "Filtres (1)" over unfiltered results. Separately EventsBrowser mobile filter bar is z-[70]; CookieBanner is z-[110] fixed bottom — on every first visit the banner sits on top of the only filter control on mobile.
**Fix:** implement the ranges or remove those options; raise the filter bar above the banner.
**Suggested command:** $impeccable adapt

### [P3] The hand-rolled design system is keyboard- and screen-reader-hostile
:focus-visible ring commented out in globals.css:13-16. **Verified:** Checkbox.tsx renders type="radio" with NO name attribute, so each radio is its own group — arrow-key navigation impossible, screen readers announce "1 of 1". FieldLabel used without htmlFor for PhoneInput, leaving the WhatsApp number field unlabelled.
**Contrast failures (computed):** text-white/35 = 3.22:1 and text-white/40 = 3.81:1 on gray-900 (Footer.tsx:57,77,81); text-white/40 on white/[0.08] = 3.58:1 (dark-variant placeholders); text-gray-400 = 2.54:1 on white and 2.43:1 on gray-50, carrying REAL text at 14 sites.
**Motion:** the globals.css reduced-motion block overrides only CSS animation/transition. Motion's initial/animate/exit are JS/WAAPI-driven inline transforms — 8 of 9 files are NOT covered. No MotionConfig, no useReducedMotion.
**Fix:** uncomment the focus block; add name to Checkbox; id + htmlFor on PhoneInput; darken the failing tokens; wrap the app in MotionConfig reducedMotion="user".
**Suggested command:** $impeccable audit

## Persona Red Flags

**Jordan (first-timer):** three different labels for one action — nav "Recevoir les alertes" navigates, hero "Recevoir les alertes chaque vendredi" submits in place, CTA "S'abonner gratuitement" submits in place. Subscribes in the hero; toast fires bottom-right while his eyes are on the button; reset() clears the form; four seconds later no trace. Submits again — subscribeToAlerts upserts silently and returns identical success, no "vous êtes déjà abonné". OrganizersSection promises "Validation manuelle sous 24h" and the confirmation page promises a WhatsApp/email confirmation — neither exists in the architecture.

**Casey (one-handed mobile, slow connection):** the primary CTA is invisible to her — Navbar.tsx:65 is hidden md:inline-flex, so on mobile the sticky bar is a logo and a hamburger. The cookie banner covers the Filtres button on first visit. Six unsized posters load eagerly and reflow the grid under her thumb. The first six cards are the oldest events in the DB. The filter-drawer close affordance is a bare 20px X at the TOP of a max-h-[82vh] sheet — the hardest pixel to reach one-handed.

**Riley (stress tester):** "Cette semaine" changes nothing but the counter increments. "Ce week-end" in October returns a Saturday in December. Types +229 into a field already prefixed +229; validates green. Tabs the whole site: zero visible focus. Arrow-keys the date radios: nothing moves. Uploads a 40 MB PNG against a "max 5MB" label with no check. Applies four filters, opens an event, hits back — all filters gone. Kills the network: "0 événements disponibles" with no error and no retry.

**Aïcha (Cotonou, mid-range Android, patchy data, never heard of the site):** before she sees a word she downloads Plus Jakarta Sans (5 weights), JetBrains Mono (used only in /admin), the Motion runtime, and an RSC payload containing every published event's full description — to see six cards that may already be in the past. The social proof aimed at her is three gradient blobs and five gold stars: no Beninese face, no recognisable venue, no landmark. The digest mockup is dated "Sam 17 mai". At the number field, nothing tells her which number will message her — in her WhatsApp, an unknown +229 number sending a list of links is exactly what a scam looks like. This is the conversion-killer, and it is a design problem, not a copy problem.

## Minor Observations

- EventCardMobile (EventCard.tsx:97-132) is fully built and unused — including the only date-block treatment in the codebase, better than the variant that IS used.
- filter-events.ts:10 still defaults `source: CotonouEvent[] = EVENTS` — a leftover import of the mock dataset.
- EventsPreviewSection:46 prints the UNFILTERED total directly above a chip row that filters. Select "Sport", see 2 cards under "84 événements disponibles".
- The landing chip row exposes 7 categories; /evenements exposes 12. Religieux, Vie nocturne, Mode & Beauté, Famille and Communautaire silently don't exist on the landing.
- mapEvent falls back to "Organisateur inconnu", so the detail page will display "Organisateur: Organisateur inconnu" for most scraped events.
- mapEvent collapses prix:'donation' into a numeric price; the donation case is unrepresentable in the UI.
- Heading order: /evenements goes h1 -> h3 (skips h2). /soumettre/confirmation has h2 and no h1. /admin renders h3 first, no h1 or h2.
- 485 arbitrary-value + 180 half-step Tailwind classes = 665 off-scale occurrences across 58 of 76 files. 21 distinct arbitrary font sizes including half-pixel steps; 7 distinct tracking values.
- 21 tap targets under 44px; worst are EventsBrowser.tsx:178 (20px) and Toast.tsx:85 (16px).
- Accordion opens item 0 by default and uses aria-expanded without aria-controls/id pairing.
- CountUp animates from 0 on every viewport entry — once wired to real data it will animate up to "3 abonnés".
- HeroSection uses md:min-h-[560px] with no mobile equivalent, so the phone mockup — the best asset on the site — lands below the fold on 375x667.
- The page ends in two near-identical dark bands (CtaSection then Footer) separated only by white OrganizersSection.

## Questions to Consider

1. If the product is a Friday WhatsApp message, why is the website an events directory at all? /evenements is the most-engineered surface here — 28 filter controls, pagination, a drawer — serving a user who by definition prefers not to browse.
2. What if the hero showed THIS Friday's real digest, generated live from Supabase, instead of a mock dated "Sam 17 mai"? It would kill the stale-date problem, replace fabricated social proof with proof-of-life, and give the landing a reason to be fresh weekly.
3. The real distribution channel is a WhatsApp forward, not a Google search — so what is the artifact that gets forwarded? If growth happens through someone pasting an event into a neighbourhood group, the forwarded card is the primary interface.
4. What is the honest pre-launch proof, and would honesty convert better than the fake 127?
