# Figma spec: "trust" section (node 4:41)

File key: za3YRMJqYkYXGVjYF2u3H4
Canvas size: 1440 x 1000 px
Screenshot: figma-specs/shots/trust.png

## Reference code (verbatim from get_design_context — React+Tailwind, adapt to Astro)

```tsx
const imgUsers2 = "https://www.figma.com/api/mcp/asset/4dc81eef-eddc-405c-8573-57e57529c566";
const imgShieldCheck = "https://www.figma.com/api/mcp/asset/d86463a0-6ac9-4c56-91d0-60af42ea46d3";
const imgLock = "https://www.figma.com/api/mcp/asset/086aa468-b858-4eee-84b8-1c1536071d6e";
const imgFileText = "https://www.figma.com/api/mcp/asset/e07d7b80-7570-46fb-b311-2a57fa18ad5c";
const imgCalculator = "https://www.figma.com/api/mcp/asset/cfad2085-c858-464d-8014-ac976015ddcc";
const imgStamp = "https://www.figma.com/api/mcp/asset/e775363e-11f4-408e-ac63-e17a7b2d4a01";

export default function Trust() {
  return (
    <div className="bg-[#f7f4eb] content-stretch flex flex-col gap-[80px] items-start px-[80px] py-[120px] relative size-full" data-node-id="4:41" data-name="trust">
      <div className="[word-break:break-word] content-stretch flex items-end justify-between relative shrink-0 w-full" data-node-id="4:42" data-name="Frame">
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[680px]" data-node-id="4:43" data-name="Frame">
          <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase whitespace-nowrap" data-node-id="4:44">
            La Sicurezza di un Unico Referente
          </p>
          <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.1] min-w-full relative shrink-0 text-[#151613] text-[52px] w-[min-content]" data-node-id="4:45">
            Perché i proprietari esigenti scelgono MDA Impresa Edile
          </p>
        </div>
        <p className="font-['Manrope:Regular'] font-normal leading-[1.6] relative shrink-0 text-[#8e7e6a] text-[16px] w-[400px]" data-node-id="4:46">
          Non siamo una rete commerciale o intermediari. Siamo artigiani costruttori con attrezzature proprietarie e responsabilità diretta.
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-node-id="4:47" data-name="trust-grid">
        <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-node-id="4:48" data-name="Frame">
          <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[40px] relative rounded-[8px]" data-node-id="4:49" data-name="Frame">
            <div className="bg-[#151613] content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-node-id="4:50" data-name="Frame">
              <div className="relative shrink-0 size-[22px]" data-node-id="4:638" data-name="users-2">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUsers2} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[28px] whitespace-nowrap" data-node-id="4:52">
              Squadra Interna
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:53">
              Carpentieri e lattonieri dipendenti diretti, formati in azienda. Zero subappalti.
            </p>
          </div>
          <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[40px] relative rounded-[8px]" data-node-id="4:54" data-name="Frame">
            <div className="bg-[#151613] content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-node-id="4:55" data-name="Frame">
              <div className="relative shrink-0 size-[22px]" data-node-id="4:542" data-name="shield-check">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShieldCheck} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[28px] whitespace-nowrap" data-node-id="4:57">
              Garanzia Scritta 10 Anni
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:58">
              Rilasciamo polizza assicurativa postuma decennale su ogni intervento strutturale.
            </p>
          </div>
          <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[40px] relative rounded-[8px]" data-node-id="4:59" data-name="Frame">
            <div className="bg-[#151613] content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-node-id="4:60" data-name="Frame">
              <div className="relative shrink-0 size-[22px]" data-node-id="4:545" data-name="lock">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLock} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[28px] whitespace-nowrap" data-node-id="4:62">
              Prezzo Bloccato
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:63">{`Il preventivo firmato non subisce variazioni in corso d'opera. Massima trasparenza.`}</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-node-id="4:64" data-name="Frame">
          <div className="bg-[#eae5da] content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[40px] relative rounded-[8px]" data-node-id="4:65" data-name="Frame">
            <div className="bg-white content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-node-id="4:66" data-name="Frame">
              <div className="relative shrink-0 size-[22px]" data-node-id="4:689" data-name="file-text">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFileText} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[28px] whitespace-nowrap" data-node-id="4:68">
              Gestione Pratiche Fiscale
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:69">
              Sbrighiamo noi tutta la burocrazia per la detrazione fiscale al 50% senza stress.
            </p>
          </div>
          <div className="bg-[#eae5da] content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[40px] relative rounded-[8px]" data-node-id="4:70" data-name="Frame">
            <div className="bg-white content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-node-id="4:71" data-name="Frame">
              <div className="relative shrink-0 size-[22px]" data-node-id="4:548" data-name="calculator">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalculator} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[28px] whitespace-nowrap" data-node-id="4:73">
              Preventivo Dettagliato
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:74">
              Voci di costo chiare ed esaminate capitolo per capitolo, senza sorprese finali.
            </p>
          </div>
          <div className="bg-[#eae5da] content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[40px] relative rounded-[8px]" data-node-id="4:75" data-name="Frame">
            <div className="bg-white content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-node-id="4:76" data-name="Frame">
              <div className="relative shrink-0 size-[22px]" data-node-id="4:551" data-name="stamp">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStamp} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[28px] whitespace-nowrap" data-node-id="4:78">
              Assicurazione RC Totale
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:79">
              Copertura totale per danni a terzi durante tutte le fasi del cantiere edile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Downloaded assets

All 6 icons are 22x22 stroke SVGs (fill="none"), Lucide-style. The `download_assets` svgAssets were byte-identical (md5-matched) to the named asset URLs in the reference code, so names are exact. There were no rawImages in this node.

| File (public/images/figma/) | Element / node | Reference code constant (URL suffix) | Stroke color |
|---|---|---|---|
| trust-users-2.svg | "Squadra Interna" card icon, node 4:638, inside dark circle 4:50 | imgUsers2 (4dc81eef-eddc-405c-8573-57e57529c566) | white |
| trust-shield-check.svg | "Garanzia Scritta 10 Anni" card icon, node 4:542, inside dark circle 4:55 | imgShieldCheck (d86463a0-6ac9-4c56-91d0-60af42ea46d3) | white |
| trust-lock.svg | "Prezzo Bloccato" card icon, node 4:545, inside dark circle 4:60 | imgLock (086aa468-b858-4eee-84b8-1c1536071d6e) | white |
| trust-file-text.svg | "Gestione Pratiche Fiscale" card icon, node 4:689, inside white circle 4:66 | imgFileText (e07d7b80-7570-46fb-b311-2a57fa18ad5c) | #151613 |
| trust-calculator.svg | "Preventivo Dettagliato" card icon, node 4:548, inside white circle 4:71 | imgCalculator (cfad2085-c858-464d-8014-ac976015ddcc) | #151613 |
| trust-stamp.svg | "Assicurazione RC Totale" card icon, node 4:551, inside white circle 4:76 | imgStamp (e775363e-11f4-408e-ac63-e17a7b2d4a01) | #151613 |

Screenshot: figma-specs/shots/trust.png (1440x1000 PNG, full section render).

## Exact colors

| Hex / value | Usage |
|---|---|
| #f7f4eb | Section background |
| #f1ece0 | Row 1 card background (3 cards, with border) |
| #eae5da | Row 2 card background (3 cards, no border) |
| rgba(21,22,19,0.08) | 1px solid border on row 1 cards only |
| #151613 | Headline text, card titles, card body text, dark icon circles (row 1), dark icon strokes (row 2 SVGs) |
| #8e7e6a | Eyebrow/kicker text and intro paragraph (right column) |
| #ffffff (white) | Icon circles in row 2, icon strokes in row 1 SVGs |

## Typography

| Element | Font | Weight | Size | Line height | Extra |
|---|---|---|---|---|---|
| Eyebrow "La Sicurezza di un Unico Referente" (4:44) | Manrope | Bold (700) | 13px | normal | uppercase, color #8e7e6a |
| Headline "Perché i proprietari esigenti..." (4:45) | Cormorant Garamond | Light (300) | 52px | 1.1 | color #151613, container 680px wide |
| Intro paragraph (4:46) | Manrope | Regular (400) | 16px | 1.6 | color #8e7e6a, width 400px |
| Card titles (28px) | Cormorant Garamond | Regular (400) | 28px | normal | color #151613 |
| Card body text | Manrope | Regular (400) | 15px | 1.6 | color #151613 |

## Layout metrics

- Section: 1440x1000, padding 120px top/bottom, 80px left/right, column flex, gap 80px between header row and grid.
- Header row: flex, items-end, justify-between. Left block 680px (eyebrow + headline, gap 16px). Right paragraph 400px.
- Grid: 2 rows of 3 equal-width cards, 32px gap both directions.
- Cards: padding 40px, border-radius 8px, internal column gap 20px.
- Icon circle: 48x48, border-radius 24px (full circle). Icon inside: 22x22.
- Row 1 circles are dark (#151613) with white-stroke icons; row 2 circles are white with #151613-stroke icons.

## Content warnings for implementer

- Card 4 "Gestione Pratiche Fiscale" (node 4:68/4:69) body copy mentions "la detrazione fiscale al 50%" — tax/detrazioni/50% claim that must be stripped or rewritten per project rules.
- Note the Figma title itself reads "Gestione Pratiche Fiscale" (grammatically odd Italian; "Pratiche Fiscali" would be correct) — flag for copy review if the card is kept in any form.
- Headline uses the accented "Perché" correctly; keep accents intact (project rule: Italian copy needs accents).
