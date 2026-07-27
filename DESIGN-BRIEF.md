# Design brief pentru Figma AI

Versiunea 2. Modificări față de prima: fără calculator interactiv, recenzii cu
5 stele și poză de profil, plus o secțiune despre direcția vizuală care cere
dinamică și un tratament tipografic mai puternic.

Copiază tot ce e între ghilimelele triple de mai jos.
E scris în engleză pentru că modelele lucrează sensibil mai bine așa.

---

## PROMPT

```
Design a single-page marketing website for an Italian roofing contractor.
Deliver two artboards: desktop at 1440px wide and mobile at 375px wide.

You decide the entire visual direction: layout, composition, typography,
imagery treatment, section order, use of space. What follows is context and
constraints, not instructions on how it should look. Make it good.

── THE COMPANY ──

MDA Impresa Edile. A roofing contractor in Italy. Small, owner-run, does the
work with its own crew rather than subcontracting. It has been operating for
around 17 years. It does one thing only: roofs.

Five services:
1. Roof maintenance and repair (manutenzione tetto). Fixing leaks, replacing
   broken tiles, small interventions before damage spreads.
2. Complete roof replacement (rifacimento tetto). Strip to the timber, repair
   the structure, add thermal insulation, lay a new covering. The big job.
3. Waterproofing membranes (impermeabilizzazione, guaine). Flat roofs,
   terraces, the layer that keeps water out of the apartment below.
4. Gutters and sheet metal work (grondaie e lattonerie). Copper, aluminium,
   custom-folded on site.
5. Roof coating and painting (verniciatura tetto). This one needs more depth
   than the others: it is a four-stage treatment (wash and biocide, repair
   the substrate, consolidating primer, two coats of finish), not just paint.
   The company wants this service explained properly because customers
   underestimate it and cheap competitors do it wrong.

── WHO VISITS THIS PAGE ──

Italian homeowners, roughly 40 to 65 years old, plus condominium
administrators. Not design-literate. Not patient. Most arrive on a phone,
from a Google search, in one of two states:

A) Something is wrong right now. There is water coming through the ceiling.
   They are stressed and they want to find someone who will pick up the
   phone and who will not rip them off.

B) They are planning. A renovation, or they noticed the roof looks bad, and
   they are collecting two or three quotes to compare. They are cautious
   about who they let onto their roof and who they hand a large sum of money
   to.

Both types are deciding one thing above all: is this a serious company or a
cowboy? Roofing in Italy has a bad reputation for exactly this. The design's
main job is to answer that question before a single word is read.

── WHAT THE PAGE MUST ACHIEVE ──

Get the visitor to request a free inspection, by one of three routes: filling
in the quote form, tapping to call, or opening WhatsApp. Everything else is
secondary. Every screen should keep at least one of those three within reach.

── VISUAL DIRECTION ──

The result must feel dynamic and alive. Not a static stack of centred blocks
separated by equal padding. Build rhythm and momentum down the page: vary the
structure between sections, use depth and layering, let imagery break out of
its container where it earns attention, use considered asymmetry. The visitor
should feel pulled downward rather than presented with a list.

Typography must carry personality and hierarchy, not only legibility. Avoid
one neutral sans used at three sizes with nothing else happening. Contrast in
weight, scale, case and treatment is wanted. Headlines should have presence.

The overall impression should read as premium and confident, closer to a
well-funded architecture or construction studio than to a local trades
website. Professional in the sense of expensive and assured, not in the sense
of corporate and safe.

Choose the style itself. Just make it distinctive, and do not settle for the
first obvious layout.

── CONTENT THAT MUST BE PLACED ──

Work with this material. Group it, order it and weight it however you judge
best.

- A quote request flow, presented as a short step-by-step questionnaire
  rather than one long form. Six steps: type of work needed, type of
  building, roof surface size, when they want to start, where the property
  is, then finally name and phone number. Personal details come last, on
  purpose. It needs a sense of progress and it must feel effortless.

- Trust and reassurance material: free on-site inspection, written itemised
  quote, price locked once signed, in-house crew, full liability insurance,
  written 10 year guarantee, help with the tax paperwork.

- How the company works, as a sequence: free inspection, written quote,
  clean and safe site, handover with guarantee.

- A portfolio of completed jobs. Roofing sells visually. Before and after is
  more persuasive than after alone.

- Customer reviews. Each review shows a five star rating, a circular profile
  photograph of the customer, their name, and the town they are from. All
  reviews are five stars. The photographs matter: they make the reviews read
  as real people rather than filler text.

- Frequently asked questions with real answers. Roughly eight of them,
  covering cost, tax deductions, duration, permits, inspection frequency.

- Italian tax incentives, presented as plain information rather than a
  calculator or a tool. Roof work qualifies for a tax deduction of up to 50%
  of the spend. Keep it factual and brief, but do not hide it in small print,
  because every Italian customer asks about it.

- Contact details and the list of towns served. Local relevance is how this
  business is found at all.

── BRAND CONSTRAINTS ──

These are fixed. Everything else is yours.

- The logo is a black silhouette of two pitched roofs with a chimney, a
  brushstroke line beneath, and the wordmark "MDA" in heavy letterspaced
  capitals next to "IMPRESA EDILE" in lighter letterspaced capitals.
- The palette is beige and black. Warm sand tones and deep black. The client
  asked for this specifically. You choose the exact values, the proportions
  and whether anything else appears alongside them.
- All copy is in Italian. Include accents correctly (è, à, più, unità, così).
- The tone should read as established and unhurried. This company has been
  on roofs for seventeen years. It is not a startup and should not look like
  one.

── PLATFORM REQUIREMENTS ──

Desktop, 1440px:
- The visitor is comparing this against two other companies in other tabs.
  Give them room to read and reasons to stay.

Mobile, 375px:
- This is where most traffic lands, so treat it as the primary design rather
  than a squeezed version of the desktop one.
- Calling and WhatsApp must be reachable without hunting, at any scroll
  position.
- Tap targets sized for a 55 year old holding a phone in one hand.
- Long content sections need to stay scannable when they become a single
  column.
- The sense of movement must survive the single column. A mobile layout that
  becomes a flat vertical list of identical cards is a failure.

Show the quote questionnaire in at least one intermediate step, not only its
first screen, so the flow through it is visible.

── WHAT WOULD MAKE THIS FAIL ──

- Looking like a generic construction template: hard hats, orange and yellow,
  stock diagonal stripes, cheap gradients.
- Looking like a tech product or a design agency. This is a trade business
  and it must feel like one, just a good one.
- A flat, evenly spaced, static page where every section is the same shape.
- Timid typography with no contrast and no point of view.
- Burying the phone number.
- A quote form that looks like paperwork.
```

---

## Cum să-l folosești

**În Figma Make** lipești tot blocul dintr-o dată.

**În Figma AI / First Draft**, dacă limita de text e mai mică, taie-l în două rulări:
prima cu THE COMPANY, WHO VISITS, WHAT THE PAGE MUST ACHIEVE, VISUAL DIRECTION și
BRAND CONSTRAINTS, ca să obții direcția vizuală. A doua cu CONTENT THAT MUST BE PLACED,
ca să populeze secțiunile.

**Dacă prima variantă nu îți place**, nu rescrie brief-ul. Adaugă o singură propoziție
la final cu ce te deranjează, de exemplu:

- `Still too static. Push the layout further, more contrast between sections.`
- `Too busy now. Keep the energy but strip back the number of elements.`
- `The typography is still flat. Give the headlines much more presence.`
- `Try a completely different direction from the previous attempt.`

Un brief bun plus o corecție scurtă dă rezultate mai bune decât un brief rescris de la zero.

## De verificat la recenzii

Pozele de profil sunt corecte la nivel de design. Când se ajunge la site-ul live,
trebuie să fie oameni reali care chiar au fost clienți, nu portrete generate.
Recenziile inventate cu fețe inventate încalcă regulile Google și normele italiene
de publicitate. Cel mai simplu: recenziile de pe profilul Google al firmei, cu poza
de profil reală a fiecăruia.

## După ce alegi designul

Trimite-mi fișierul Figma. Codul actual e construit ca să nu depindă de aspect:
textele sunt în `src/config/content.ts`, datele firmei în `src/config/site.ts`,
iar logica chestionarului e independentă de stil. Se schimbă tot stratul vizual
fără să rescriu conținutul sau funcționalitatea.
