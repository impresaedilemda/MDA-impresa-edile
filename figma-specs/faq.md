# FAQ section — Figma spec (node 4:347, file za3YRMJqYkYXGVjYF2u3H4)

Screenshot: `figma-specs/shots/faq.png` (1440 x 1052 px, node natural size)

## Reference code (verbatim from get_design_context — React+Tailwind, adapt to Astro)

```tsx
const imgMinus = "https://www.figma.com/api/mcp/asset/eeb24e38-2a87-44b7-8efe-9ae7909f209c";

export default function Faq() {
  return (
    <div className="bg-[#f7f4eb] content-stretch flex flex-col gap-[80px] items-start px-[80px] py-[120px] relative size-full" data-node-id="4:347" data-name="faq">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[800px]" data-node-id="4:348" data-name="Frame">
        <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase whitespace-nowrap" data-node-id="4:349">
          Trasparenza Totale
        </p>
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.1] min-w-full relative shrink-0 text-[#151613] text-[52px] w-[min-content]" data-node-id="4:350">
          Domande frequenti e chiarimenti tecnici
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-node-id="4:351" data-name="Frame">
        <div className="bg-[#f1ece0] content-stretch flex flex-col gap-[16px] items-start p-[32px] relative rounded-[8px] shrink-0 w-full" data-node-id="4:352" data-name="Frame">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:353" data-name="Frame">
            <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#151613] text-[22px] whitespace-nowrap" data-node-id="4:354">
              Quanto tempo occorre per rifare completamente un tetto di 120 mq?
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="4:608" data-name="minus">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMinus} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] opacity-80 relative shrink-0 text-[#151613] text-[15px] whitespace-nowrap" data-node-id="4:356">{`In condizioni meteo normali, la nostra squadra interna completa lo smantellamento, l'isolamento e la nuova posa in circa 8-10 giorni lavorativi.`}</p>
        </div>
        <div className="bg-[#f1ece0] content-stretch flex flex-col gap-[16px] items-start p-[32px] relative rounded-[8px] shrink-0 w-full" data-node-id="4:357" data-name="Frame">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:358" data-name="Frame">
            <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#151613] text-[22px] whitespace-nowrap" data-node-id="4:359">
              Quali detrazioni fiscali posso richiedere per i lavori di copertura?
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="4:611" data-name="minus">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMinus} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] opacity-80 relative shrink-0 text-[#151613] text-[15px] whitespace-nowrap" data-node-id="4:361">{`È possibile accedere alla detrazione ristrutturazioni del 50% in 10 anni. Se si migliora notevolmente l'efficienza energetica, si può optare per l'Ecobonus.`}</p>
        </div>
        <div className="bg-[#f1ece0] content-stretch flex flex-col gap-[16px] items-start p-[32px] relative rounded-[8px] shrink-0 w-full" data-node-id="4:362" data-name="Frame">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:363" data-name="Frame">
            <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#151613] text-[22px] whitespace-nowrap" data-node-id="4:364">
              Il preventivo iniziale può subire variazioni durante i lavori?
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="4:614" data-name="minus">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMinus} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] opacity-80 relative shrink-0 text-[#151613] text-[15px] whitespace-nowrap" data-node-id="4:366">
            No. Il prezzo stabilito nel computo metrico iniziale è blindato. Eventuali imprevisti strutturali sono a nostro carico, salvo accordi diversi preventivi.
          </p>
        </div>
        <div className="bg-[#f1ece0] content-stretch flex flex-col gap-[16px] items-start p-[32px] relative rounded-[8px] shrink-0 w-full" data-node-id="4:367" data-name="Frame">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:368" data-name="Frame">
            <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#151613] text-[22px] whitespace-nowrap" data-node-id="4:369">
              Utilizzate squadre esterne o lavoratori in subappalto?
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="4:617" data-name="minus">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMinus} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] opacity-80 relative shrink-0 text-[#151613] text-[15px] whitespace-nowrap" data-node-id="4:371">
            Assolutamente no. Tutta la forza lavoro impiegata in cantiere è formata da operai edili regolarmente assunti come dipendenti diretti di MDA Impresa Edile.
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Downloaded assets

| File | Element | Notes |
| --- | --- | --- |
| `public/images/figma/faq-minus.svg` | `imgMinus` — the minus icon in every FAQ row (nodes 4:608, 4:611, 4:614, 4:617, layer name "minus") | Only asset in the section; no rawImages exist. Reference-code URL suffix `eeb24e38-2a87-44b7-8efe-9ae7909f209c`; download_assets served the identical vector as `ff2d3c1d-8754-4ade-895b-f638e45c2e7c`. 20x20 viewBox, single path `M4.166 10H15.834`, stroke `#151613`, stroke-width 2, round linecap. |
| `figma-specs/shots/faq.png` | Full-section screenshot | 1440 x 1052 px, node natural size. |

The design shows only the minus (open) state for all four accordion items; there is no plus/closed icon in the Figma node. For a working accordion the implementer must derive the closed-state icon (e.g. rotate/cross the same stroke) in the same style: 2px stroke, round caps, color #151613.

## Colors (exact hex)

| Hex | Usage |
| --- | --- |
| `#F7F4EB` | Section background |
| `#F1ECE0` | FAQ card background |
| `#151613` | Headline, question text, answer text (answers at 80% opacity), minus-icon stroke |
| `#8E7E6A` | Eyebrow label "Trasparenza Totale" |

## Typography

| Element | Font | Weight/Style | Size | Line height | Extras |
| --- | --- | --- | --- | --- | --- |
| Eyebrow "Trasparenza Totale" | Manrope | Bold (700) | 13px | normal | uppercase, color #8E7E6A |
| Section headline | Cormorant Garamond | Light (300) | 52px | 1.1 | color #151613, max width 800px |
| Question titles | Cormorant Garamond | SemiBold (600) | 22px | normal | color #151613 |
| Answers | Manrope | Regular (400) | 15px | 1.6 | color #151613 at opacity 0.8 |

## Layout metrics

- Section: bg #F7F4EB, padding 120px vertical / 80px horizontal, column gap 80px between header block and FAQ list. Node natural width 1440px.
- Header block: 800px wide, 16px gap between eyebrow and headline.
- FAQ list: full width, 20px gap between cards.
- Card: bg #F1ECE0, radius 8px, padding 32px, 16px gap between question row and answer.
- Question row: flex, space-between, items centered; minus icon 20x20 on the right.
