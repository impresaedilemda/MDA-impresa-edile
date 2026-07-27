# Mobile B specs (Figma file za3YRMJqYkYXGVjYF2u3H4)

Sections covered: mobile-services (4:465), mobile-quote (4:479).
Reference code below is the verbatim React+Tailwind output of get_design_context. Adapt to Astro/HTML/CSS — do not paste as-is.

---

## mobile-services (node 4:465)

- Frame: 375 x 678 px
- Screenshot: `figma-specs/shots/mobile-services.png`
- Assets: NONE (no raw images, no SVGs in this node — cards are pure text)

### Layout summary

- Section: bg `#f7f4eb`, padding 64px top/bottom, 20px left/right, vertical flex, gap 40px.
- Heading block: gap 12px. Eyebrow "SERVIZI OFFERTI" (Manrope Bold 11px uppercase, `#8e7e6a`), title "Coperture su misura" (Cormorant Garamond Light 32px, line-height 1.2, `#151613`).
- Cards column: gap 20px, 3 cards, each full width.
- Card: bg white, border 1px `rgba(21,22,19,0.08)`, radius 6px, padding 24px, vertical flex gap 16px.
  - Card title: Cormorant Garamond Regular 24px, `#151613`.
  - Card body: Manrope Regular 14px, line-height 1.5, `#151613` at opacity 0.8.

### Copy (Italian, keep accents exactly)

1. Rifacimento Tetto — "Smantellamento e posa nuovo manto con isolamento termico certificato."
2. Impermeabilizzazione — "Fermiamo ogni infiltrazione con guaine elastomeriche bituminose."
3. Manutenzione & Tegole — "Interventi rapidi, sostituzione tegole rotte e sblocco canali."

### Reference code (verbatim)

```jsx
export default function MobileServices() {
  return (
    <div className="[word-break:break-word] bg-[#f7f4eb] content-stretch flex flex-col gap-[40px] items-start px-[20px] py-[64px] relative size-full" data-node-id="4:465" data-name="mobile-services">
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="4:466" data-name="Frame">
        <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[11px] uppercase whitespace-nowrap" data-node-id="4:467">
          SERVIZI OFFERTI
        </p>
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.2] min-w-full relative shrink-0 text-[#151613] text-[32px] w-[min-content]" data-node-id="4:468">
          Coperture su misura
        </p>
      </div>
      <div className="content-stretch flex flex-col font-normal gap-[20px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:469" data-name="Frame">
        <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:470" data-name="Frame">
          <p className="font-['Cormorant_Garamond:Regular'] leading-[normal] relative shrink-0 text-[24px] whitespace-nowrap" data-node-id="4:471">
            Rifacimento Tetto
          </p>
          <p className="font-['Manrope:Regular'] leading-[1.5] min-w-full opacity-80 relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:472">
            Smantellamento e posa nuovo manto con isolamento termico certificato.
          </p>
        </div>
        <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:473" data-name="Frame">
          <p className="font-['Cormorant_Garamond:Regular'] leading-[normal] relative shrink-0 text-[24px] whitespace-nowrap" data-node-id="4:474">
            Impermeabilizzazione
          </p>
          <p className="font-['Manrope:Regular'] leading-[1.5] min-w-full opacity-80 relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:475">
            Fermiamo ogni infiltrazione con guaine elastomeriche bituminose.
          </p>
        </div>
        <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:476" data-name="Frame">
          <p className="font-['Cormorant_Garamond:Regular'] leading-[normal] relative shrink-0 text-[24px] whitespace-nowrap" data-node-id="4:477">{`Manutenzione & Tegole`}</p>
          <p className="font-['Manrope:Regular'] leading-[1.5] min-w-full opacity-80 relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:478">
            Interventi rapidi, sostituzione tegole rotte e sblocco canali.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## mobile-quote (node 4:479)

- Frame: 375 x 688 px
- Screenshot: `figma-specs/shots/mobile-quote.png`
- Assets: NONE (no raw images, no SVGs — the option rows on mobile are text-only, unlike desktop quote-form which has icons)

### Layout summary

- Section: bg `#eae5da`, padding 64px top/bottom, 20px left/right, vertical flex, gap 32px.
- Heading block: gap 12px. Eyebrow "CONFIGURATORE RAPIDO" (Manrope Bold 11px uppercase, `#8e7e6a`), title "Richiedi preventivo in pochi passi" (Cormorant Garamond Light 32px, line-height 1.2, `#151613`).
- Dark quiz card: bg `#151613`, radius 8px, padding 24px, vertical flex, gap 24px, full width.
  - Progress header row: space-between; left "Fase 2 di 6" (Manrope ExtraBold 11px uppercase, `#eae5da`), right "30% completato" (Manrope Regular 11px, `#eae5da`).
  - Progress track: height 4px, radius 2px, bg `rgba(255,255,255,0.13)`; filled bar bg `#eae5da`, width 80px in the mock (~30% of track).
  - Question: "Qual è la tipologia dell'immobile?" — Cormorant Garamond Regular 22px, white.
  - Options column: gap 10px, each option padding 16px, radius 4px, full width, text 14px.
    - Selected option: bg `#eae5da`, border 1px `#eae5da`, text Manrope Bold `#151613` ("Villa Indipendente").
    - Unselected options: bg `#282924`, border 1px `rgba(255,255,255,0.06)`, text Manrope Medium white ("Condominio Plurifamiliare", "Capannone Industriale").
  - CTA button: bg white, padding 16px, radius 4px, centered text "PROCEDI" (Manrope ExtraBold 14px uppercase, `#151613`).

### Reference code (verbatim)

```jsx
export default function MobileQuote() {
  return (
    <div className="bg-[#eae5da] content-stretch flex flex-col gap-[32px] items-start px-[20px] py-[64px] relative size-full" data-node-id="4:479" data-name="mobile-quote">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="4:480" data-name="Frame">
        <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[11px] uppercase whitespace-nowrap" data-node-id="4:481">
          CONFIGURATORE RAPIDO
        </p>
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.2] min-w-full relative shrink-0 text-[#151613] text-[32px] w-[min-content]" data-node-id="4:482">
          Richiedi preventivo in pochi passi
        </p>
      </div>
      <div className="bg-[#151613] content-stretch flex flex-col gap-[24px] items-start p-[24px] relative rounded-[8px] shrink-0 w-full" data-node-id="4:483" data-name="Frame">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="4:484" data-name="Frame">
          <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[#eae5da] text-[11px] w-full whitespace-nowrap" data-node-id="4:485" data-name="Frame">
            <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 uppercase" data-node-id="4:486">
              Fase 2 di 6
            </p>
            <p className="font-['Manrope:Regular'] font-normal relative shrink-0" data-node-id="4:487">
              30% completato
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.13)] content-stretch flex h-[4px] items-start relative rounded-[2px] shrink-0 w-full" data-node-id="4:488" data-name="Frame">
            <div className="bg-[#eae5da] h-full relative shrink-0 w-[80px]" data-node-id="4:489" data-name="Rectangle" />
          </div>
        </div>
        <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[22px] text-white w-full" data-node-id="4:490">{`Qual è la tipologia dell'immobile?`}</p>
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-node-id="4:491" data-name="Frame">
          <div className="bg-[#eae5da] border border-[#eae5da] border-solid content-stretch flex items-center p-[16px] relative rounded-[4px] shrink-0 w-full" data-node-id="4:492" data-name="Frame">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:Bold'] font-bold leading-[normal] min-w-px relative text-[#151613] text-[14px]" data-node-id="4:493">
              Villa Indipendente
            </p>
          </div>
          <div className="bg-[#282924] border border-[rgba(255,255,255,0.06)] border-solid content-stretch flex items-center p-[16px] relative rounded-[4px] shrink-0 w-full" data-node-id="4:494" data-name="Frame">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:Medium'] font-medium leading-[normal] min-w-px relative text-[14px] text-white" data-node-id="4:495">
              Condominio Plurifamiliare
            </p>
          </div>
          <div className="bg-[#282924] border border-[rgba(255,255,255,0.06)] border-solid content-stretch flex items-center p-[16px] relative rounded-[4px] shrink-0 w-full" data-node-id="4:496" data-name="Frame">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:Medium'] font-medium leading-[normal] min-w-px relative text-[14px] text-white" data-node-id="4:497">
              Capannone Industriale
            </p>
          </div>
        </div>
        <div className="bg-white content-stretch flex items-start justify-center p-[16px] relative rounded-[4px] shrink-0 w-full" data-node-id="4:498" data-name="Frame">
          <p className="[word-break:break-word] font-['Manrope:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#151613] text-[14px] uppercase whitespace-nowrap" data-node-id="4:499">
            Procedi
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## Shared palette and fonts (both sections)

Colors:
- `#f7f4eb` cream section bg (services)
- `#eae5da` warm beige section bg (quote) — also selected option bg, progress fill, and progress-header text inside the dark card
- `#151613` near-black text / dark quiz card bg
- `#282924` unselected option bg inside dark card
- `#8e7e6a` taupe eyebrow text
- `#ffffff` card bg, question text, option text, CTA bg
- `rgba(21,22,19,0.08)` light card border
- `rgba(255,255,255,0.13)` progress track
- `rgba(255,255,255,0.06)` unselected option border

Fonts:
- Cormorant Garamond: Light (300) for 32px section titles, Regular (400) for 24px card titles and 22px quiz question
- Manrope: Regular (400), Medium (500), Bold (700), ExtraBold (800)
