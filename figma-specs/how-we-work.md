# how-we-work (node 4:218)

File key: za3YRMJqYkYXGVjYF2u3H4
Screenshot: figma-specs/shots/how-we-work.png (1440x622, natural canvas size 1440x622)

## Reference code (verbatim from get_design_context — React+Tailwind, adapt to Astro)

```tsx
const imgEye = "https://www.figma.com/api/mcp/asset/b5932d67-6257-4d09-b303-83432b1d289e";
const imgFileText = "https://www.figma.com/api/mcp/asset/e59a865a-02b1-48f6-a400-9ea91be4791d";
const imgSparkles = "https://www.figma.com/api/mcp/asset/b7e6191a-3f18-43a9-a2b1-57c5ab3399b0";
const imgShield = "https://www.figma.com/api/mcp/asset/13f9b862-3f54-4ff5-a15e-98c1ec75c6ae";

export default function HowWeWork() {
  return (
    <div className="bg-[#f7f4eb] content-stretch flex flex-col gap-[80px] items-start px-[80px] py-[120px] relative size-full" data-node-id="4:218" data-name="how-we-work">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[800px] whitespace-nowrap" data-node-id="4:219" data-name="Frame">
        <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase" data-node-id="4:220">
          Nessuna Improvvisazione
        </p>
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.1] relative shrink-0 text-[#151613] text-[52px]" data-node-id="4:221">
          Come realizziamo il tuo nuovo tetto
        </p>
      </div>
      <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-node-id="4:222" data-name="Frame">
        <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px p-[32px] relative rounded-[8px]" data-node-id="4:223" data-name="Frame">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:224" data-name="Frame">
            <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[40px] whitespace-nowrap" data-node-id="4:225">
              01
            </p>
            <div className="relative shrink-0 size-[24px]" data-node-id="4:590" data-name="eye">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEye} />
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:227" data-name="Frame">
            <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[18px] whitespace-nowrap" data-node-id="4:228">
              Sopralluogo
            </p>
            <p className="font-['Manrope:Regular'] font-normal leading-[1.5] min-w-full opacity-80 relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:229">
              Rilievo dettagliato sul tetto e analisi strutturale.
            </p>
          </div>
        </div>
        <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px p-[32px] relative rounded-[8px]" data-node-id="4:230" data-name="Frame">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:231" data-name="Frame">
            <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[40px] whitespace-nowrap" data-node-id="4:232">
              02
            </p>
            <div className="relative shrink-0 size-[24px]" data-node-id="4:593" data-name="file-text">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFileText} />
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:234" data-name="Frame">
            <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[18px] whitespace-nowrap" data-node-id="4:235">
              Preventivo
            </p>
            <p className="font-['Manrope:Regular'] font-normal leading-[1.5] min-w-full opacity-80 relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:236">
              Computo metrico analitico con costi bloccati.
            </p>
          </div>
        </div>
        <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px p-[32px] relative rounded-[8px]" data-node-id="4:237" data-name="Frame">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:238" data-name="Frame">
            <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[40px] whitespace-nowrap" data-node-id="4:239">
              03
            </p>
            <div className="relative shrink-0 size-[24px]" data-node-id="4:596" data-name="sparkles">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSparkles} />
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:241" data-name="Frame">
            <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[18px] whitespace-nowrap" data-node-id="4:242">
              Cantiere Pulito
            </p>
            <p className="font-['Manrope:Regular'] font-normal leading-[1.5] min-w-full opacity-80 relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:243">
              Allestimento ponteggi propri e pulizia giornaliera.
            </p>
          </div>
        </div>
        <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px p-[32px] relative rounded-[8px]" data-node-id="4:244" data-name="Frame">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:245" data-name="Frame">
            <p className="[word-break:break-word] font-['Cormorant_Garamond:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[40px] whitespace-nowrap" data-node-id="4:246">
              04
            </p>
            <div className="relative shrink-0 size-[24px]" data-node-id="4:599" data-name="shield">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShield} />
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:248" data-name="Frame">
            <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[18px] whitespace-nowrap" data-node-id="4:249">
              Garanzia
            </p>
            <p className="font-['Manrope:Regular'] font-normal leading-[1.5] min-w-full opacity-80 relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:250">
              Fine lavori con collaudo e rilascio polizza 10 anni.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Downloaded assets

All saved to `public/images/figma/`. The Figma asset URLs in the code are expired-soon remotes; use these local files instead. download_assets returned zero rawImages and 4 svgAssets, which are byte-identical (by size) to the 4 icon URLs referenced in the code.

| Local file | Element in code | Code constant / asset URL suffix | Card | Bytes |
|---|---|---|---|---|
| `public/images/figma/how-we-work-eye.svg` | node 4:590 `eye`, card 01 Sopralluogo | `imgEye` -> `.../asset/b5932d67-6257-4d09-b303-83432b1d289e` (= svgAsset `ba11389a-...`, 758 B) | 01 | 758 |
| `public/images/figma/how-we-work-file-text.svg` | node 4:593 `file-text`, card 02 Preventivo | `imgFileText` -> `.../asset/e59a865a-02b1-48f6-a400-9ea91be4791d` (= svgAsset `6f1e1e3b-...`, 1030 B) | 02 | 1030 |
| `public/images/figma/how-we-work-sparkles.svg` | node 4:596 `sparkles`, card 03 Cantiere Pulito | `imgSparkles` -> `.../asset/b7e6191a-3f18-43a9-a2b1-57c5ab3399b0` (= svgAsset `c630a2d1-...`, 1804 B) | 03 | 1804 |
| `public/images/figma/how-we-work-shield.svg` | node 4:599 `shield`, card 04 Garanzia | `imgShield` -> `.../asset/13f9b862-3f54-4ff5-a15e-98c1ec75c6ae` (= svgAsset `cb425f4b-...`, 808 B) | 04 | 808 |

Icons are 24x24 lucide-style stroke icons; render each inside a fixed 24px square container.

## Colors (exact hex)

| Color | Usage |
|---|---|
| `#f7f4eb` | section background |
| `#f1ece0` | card background |
| `rgba(21,22,19,0.08)` | card 1px solid border |
| `#8e7e6a` | eyebrow text, card step numbers (01-04) |
| `#151613` | H2 heading, card titles, card body text (body at opacity 0.8) |

## Typography

| Element | Font | Weight | Size | Line height | Extras |
|---|---|---|---|---|---|
| Eyebrow "Nessuna Improvvisazione" | Manrope | Bold (700) | 13px | normal | uppercase, color #8e7e6a |
| H2 "Come realizziamo il tuo nuovo tetto" | Cormorant Garamond | Light (300) | 52px | 1.1 | color #151613, container width 800px |
| Step numbers 01-04 | Cormorant Garamond | SemiBold (600) | 40px | normal | color #8e7e6a |
| Card title (Sopralluogo etc.) | Manrope | Bold (700) | 18px | normal | color #151613 |
| Card body | Manrope | Regular (400) | 14px | 1.5 | color #151613 at opacity 0.8 |

## Layout facts

- Section: 1440px design width, padding 120px top/bottom, 80px left/right, column flex with 80px gap between header block and card row. Background #f7f4eb.
- Header block: column, 16px gap, width 800px.
- Card row: 4 equal-width cards (flex 1) in a row, 32px gap.
- Card: background #f1ece0, 1px border rgba(21,22,19,0.08), radius 8px, padding 32px, column with 24px gap. Top row: step number left, 24px icon right (space-between, center-aligned). Text block: title + body with 8px gap.

## Copy (exact, keep Italian accents)

- Eyebrow: "Nessuna Improvvisazione"
- H2: "Come realizziamo il tuo nuovo tetto"
- 01 Sopralluogo: "Rilievo dettagliato sul tetto e analisi strutturale."
- 02 Preventivo: "Computo metrico analitico con costi bloccati."
- 03 Cantiere Pulito: "Allestimento ponteggi propri e pulizia giornaliera."
- 04 Garanzia: "Fine lavori con collaudo e rilascio polizza 10 anni."

No tax/detrazioni/50% claims appear anywhere in this section's copy.
