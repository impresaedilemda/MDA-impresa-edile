# quote-form (node 4:175)

Figma file: za3YRMJqYkYXGVjYF2u3H4
Screenshot: figma-specs/shots/quote-form.png (1440 x 817, natural canvas size 1440 x 817)

## Reference code (verbatim from get_design_context — React+Tailwind, REFERENCE ONLY, convert to Astro)

```jsx
const imgPhone = "https://www.figma.com/api/mcp/asset/ce76c640-dafd-411f-bf7b-4ab00f8901e8";
const imgHome = "https://www.figma.com/api/mcp/asset/1f84c694-e931-406e-a511-1f8c8fc2ecd3";
const imgBuilding = "https://www.figma.com/api/mcp/asset/83362f4f-9a79-4cf0-a0d2-1214469f6f68";
const imgBriefcase = "https://www.figma.com/api/mcp/asset/4c643475-8144-442c-b371-2571ec92ac3d";
const imgLeaf = "https://www.figma.com/api/mcp/asset/2dd16bf5-545b-47f6-be58-ae743b9e1e99";

export default function QuoteFormSection() {
  return (
    <div className="bg-[#eae5da] content-stretch flex gap-[80px] items-center px-[80px] py-[120px] relative size-full" data-node-id="4:175" data-name="quote-form-section">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-w-px relative" data-node-id="4:176" data-name="Frame">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 whitespace-nowrap" data-node-id="4:177" data-name="Frame">
          <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase" data-node-id="4:178">
            Calcolo Rapido
          </p>
          <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.1] relative shrink-0 text-[#151613] text-[52px]" data-node-id="4:179">
            Richiedi un preventivo dettagliato senza impegno
          </p>
        </div>
        <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full opacity-80 relative shrink-0 text-[#151613] text-[16px] w-[min-content]" data-node-id="4:180">
          Compila i brevi passaggi per farci comprendere la natura del tuo tetto. Un nostro tecnico ti contatterà per definire i dettagli ed elaborare la proposta economica vincolante.
        </p>
        <div className="bg-[#f7f4eb] content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[6px] shrink-0" data-node-id="4:181" data-name="Frame">
          <div className="relative shrink-0 size-[24px]" data-node-id="4:575" data-name="phone">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="4:183" data-name="Frame">
            <p className="font-['Manrope:SemiBold'] font-semibold relative shrink-0 text-[#8e7e6a] text-[13px]" data-node-id="4:184">
              Preferisci parlare subito con noi?
            </p>
            <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[#151613] text-[16px]" data-node-id="4:185">
              Chiama direttamente: +39 02 8410 9920
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#151613] content-stretch drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)] flex flex-col gap-[32px] items-start p-[48px] relative rounded-[12px] shrink-0 w-[540px]" data-node-id="4:186" data-name="Frame">
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="4:187" data-name="Frame">
          <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[#eae5da] text-[12px] w-full whitespace-nowrap" data-node-id="4:188" data-name="Frame">
            <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 uppercase" data-node-id="4:189">
              Configuratore Tetto
            </p>
            <p className="font-['Manrope:Bold'] font-bold relative shrink-0" data-node-id="4:190">
              Fase 2 di 6
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.13)] content-stretch flex h-[4px] items-start relative rounded-[2px] shrink-0 w-full" data-node-id="4:191" data-name="Frame">
            <div className="bg-[#eae5da] h-full relative shrink-0 w-[180px]" data-node-id="4:192" data-name="Rectangle" />
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="4:193" data-name="Frame">
          <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[28px] text-white whitespace-nowrap" data-node-id="4:194">{`Qual è la tipologia dell'immobile?`}</p>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="4:195" data-name="Frame">
            <div className="bg-[#eae5da] border border-[#eae5da] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:196" data-name="Frame">
              <div className="relative shrink-0 size-[20px]" data-node-id="4:578" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:Bold'] font-bold leading-[normal] min-w-px relative text-[#151613] text-[15px]" data-node-id="4:198">
                Villa Singola / Indipendente
              </p>
              <div className="bg-[#151613] border-2 border-[#151613] border-solid content-stretch flex items-center justify-center relative rounded-[9px] shrink-0 size-[18px]" data-node-id="4:199" data-name="Frame">
                <div className="bg-[#eae5da] relative rounded-[4px] shrink-0 size-[8px]" data-node-id="4:200" data-name="Frame" />
              </div>
            </div>
            <div className="bg-[#282924] border border-[rgba(255,255,255,0.08)] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:201" data-name="Frame">
              <div className="relative shrink-0 size-[20px]" data-node-id="4:581" data-name="building">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBuilding} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:Medium'] font-medium leading-[normal] min-w-px relative text-[15px] text-white" data-node-id="4:203">
                Condominio / Edificio Plurifamiliare
              </p>
              <div className="bg-[rgba(0,0,0,0)] border-2 border-solid border-white relative rounded-[9px] shrink-0 size-[18px]" data-node-id="4:204" data-name="Frame" />
            </div>
            <div className="bg-[#282924] border border-[rgba(255,255,255,0.08)] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:205" data-name="Frame">
              <div className="relative shrink-0 size-[20px]" data-node-id="4:584" data-name="briefcase">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBriefcase} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:Medium'] font-medium leading-[normal] min-w-px relative text-[15px] text-white" data-node-id="4:207">
                Capannone Industriale / Commerciale
              </p>
              <div className="bg-[rgba(0,0,0,0)] border-2 border-solid border-white relative rounded-[9px] shrink-0 size-[18px]" data-node-id="4:208" data-name="Frame" />
            </div>
            <div className="bg-[#282924] border border-[rgba(255,255,255,0.08)] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:209" data-name="Frame">
              <div className="relative shrink-0 size-[20px]" data-node-id="4:587" data-name="leaf">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLeaf} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Manrope:Medium'] font-medium leading-[normal] min-w-px relative text-[15px] text-white" data-node-id="4:211">
                Rustico / Casale Storico
              </p>
              <div className="bg-[rgba(0,0,0,0)] border-2 border-solid border-white relative rounded-[9px] shrink-0 size-[18px]" data-node-id="4:212" data-name="Frame" />
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:213" data-name="Frame">
          <div className="border border-[rgba(255,255,255,0.25)] border-solid content-stretch flex flex-[1_0_0] items-start justify-center min-w-px px-[24px] py-[16px] relative rounded-[4px]" data-node-id="4:214" data-name="Frame">
            <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[14px] text-white uppercase whitespace-nowrap" data-node-id="4:215">
              Indietro
            </p>
          </div>
          <div className="bg-white content-stretch flex flex-[1_0_0] items-start justify-center min-w-px px-[24px] py-[16px] relative rounded-[4px]" data-node-id="4:216" data-name="Frame">
            <p className="[word-break:break-word] font-['Manrope:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#151613] text-[14px] uppercase whitespace-nowrap" data-node-id="4:217">
              Avanti
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Downloaded assets

All assets in /Users/artiom/LUCRU/Claude Code/mda-impresa-edile/public/images/figma/. The node has zero rawImages; all 5 assets are SVG icons (stroke-based, fill="none", stroke-width ~1.67-2). The download_assets svgAssets were byte-identical (md5-verified) to the get_design_context asset URLs, so each file below covers both.

| File | Element / node | Reference-code constant (URL suffix) | Size in design | Stroke color |
|---|---|---|---|---|
| quote-form-phone.svg | "phone" icon, node 4:575, inside the beige callout card 4:181 (left column) | imgPhone (asset/ce76c640-dafd-411f-bf7b-4ab00f8901e8) | 24x24 | #151613 |
| quote-form-home.svg | "home" icon, node 4:578, inside the selected option row 4:196 (Villa Singola) | imgHome (asset/1f84c694-e931-406e-a511-1f8c8fc2ecd3) | 20x20 | #151613 |
| quote-form-building.svg | "building" icon, node 4:581, option row 4:201 (Condominio) | imgBuilding (asset/83362f4f-9a79-4cf0-a0d2-1214469f6f68) | 20x20 | white |
| quote-form-briefcase.svg | "briefcase" icon, node 4:584, option row 4:205 (Capannone) | imgBriefcase (asset/4c643475-8144-442c-b371-2571ec92ac3d) | 20x20 | white |
| quote-form-leaf.svg | "leaf" icon, node 4:587, option row 4:209 (Rustico) | imgLeaf (asset/2dd16bf5-545b-47f6-be58-ae743b9e1e99) | 20x20 | white (one path fill="white") |

Screenshot: /Users/artiom/LUCRU/Claude Code/mda-impresa-edile/figma-specs/shots/quote-form.png

Note for the implementer: icons look like lucide phone / home / building-2 / briefcase / leaf. Stroke color is baked into the SVGs (dark #151613 for icons on light backgrounds, white for icons on dark rows). If you inline them or use lucide, drive color via currentColor so selected vs unselected states swap correctly.

## Colors (exact hex)

- #eae5da  section background; card progress-bar fill; selected option background and border; step-header text on dark card; radio inner dot on selected
- #151613  primary dark: heading text, body text, dark form card background, selected-option text, selected radio bg/border, Avanti button text, phone number text
- #f7f4eb  beige phone-callout card background (left column)
- #8e7e6a  taupe accent: "Calcolo Rapido" eyebrow, "Preferisci parlare subito con noi?" label
- #282924  unselected option row background (on dark card)
- #ffffff  white: card question text, unselected option text, unselected radio border, Avanti button background, Indietro button text
- rgba(255,255,255,0.13)  progress bar track
- rgba(255,255,255,0.08)  unselected option row border
- rgba(255,255,255,0.25)  Indietro button border
- rgba(0,0,0,0.25)  card drop shadow: 0px 16px 16px rgba(0,0,0,0.25)

## Typography

- Cormorant Garamond Light 52px, line-height 1.1, color #151613 — section heading "Richiedi un preventivo dettagliato senza impegno"
- Cormorant Garamond Regular 28px, line-height normal, white — card question "Qual è la tipologia dell'immobile?"
- Manrope Bold 13px uppercase, #8e7e6a — eyebrow "Calcolo Rapido"
- Manrope Regular 16px, line-height 1.6, #151613 at 80% opacity — intro paragraph
- Manrope SemiBold 13px, #8e7e6a — callout label
- Manrope ExtraBold 16px, #151613 — callout phone number
- Manrope ExtraBold 12px uppercase, #eae5da — "Configuratore Tetto"
- Manrope Bold 12px, #eae5da — "Fase 2 di 6"
- Manrope Bold 15px, #151613 — selected option label
- Manrope Medium 15px, white — unselected option labels
- Manrope Bold 14px uppercase, white — "Indietro"
- Manrope ExtraBold 14px uppercase, #151613 — "Avanti"

## Layout facts

- Section: 1440x817, flex row, gap 80, padding 120 vertical / 80 horizontal, items-center, bg #eae5da
- Left column: flex-1, column, gap 32
- Right card: fixed width 540, bg #151613, radius 12, padding 48, column gap 32, drop-shadow 0 16px 16px rgba(0,0,0,0.25)
- Progress: track h-4px radius 2 rgba(255,255,255,0.13); fill #eae5da width 180px (of 444px inner = ~40.5%, consistent with "Fase 2 di 6" visual)
- Option rows: padding 20, radius 6, gap 16, icon 20px, radio 18px circle (radius 9); selected radio: bg #151613 border-2 #151613 with 8px #eae5da inner dot (radius 4); unselected: transparent bg, border-2 white
- Callout card: padding 20, radius 6, gap 16, icon 24px
- Buttons: two equal flex-1, padding 16 vertical / 24 horizontal, radius 4, gap 16 between

## Content notes

- Heading in the screenshot overflows its column ("...dettagliato se" visibly clipped by the card at 1440px); treat as flex row where card overlaps heading area — implementer should let text wrap naturally instead of reproducing the clipping
- Phone number in design: +39 02 8410 9920 (appears in callout)
- The design shows step 2 of 6 of a configurator (typology step) with a pre-selected first option
- No tax/detrazioni/50% wording appears anywhere in this node's text
