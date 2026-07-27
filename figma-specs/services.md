# services — node 4:103 (file za3YRMJqYkYXGVjYF2u3H4)

Screenshot: `figma-specs/shots/services.png` (1440x1861, node natural size)

## Reference code (verbatim from get_design_context — React+Tailwind, ADAPT to Astro/HTML/CSS, do not paste as-is)

```jsx
const imgRectangle = "https://www.figma.com/api/mcp/asset/4a392146-6c6e-4022-90ca-795f8c010578";
const imgRectangle1 = "https://www.figma.com/api/mcp/asset/7f96056d-0512-404d-9caa-715a88ef9e78";
const imgRectangle2 = "https://www.figma.com/api/mcp/asset/94fb0a7b-ce8e-4baa-b6c9-06b69a86ddd2";
const imgRectangle3 = "https://www.figma.com/api/mcp/asset/a3effde9-7a6b-4ac3-9db1-86ba36cad4ef";
const imgRectangle4 = "https://www.figma.com/api/mcp/asset/450ab9c3-05ce-4f3c-8bc7-4c1bb9a3334d";
const imgArrowRight = "https://www.figma.com/api/mcp/asset/02b2b4ac-8b58-4d01-b477-5d13444ea564";

export default function Services() {
  return (
    <div className="bg-[#f7f4eb] content-stretch flex flex-col gap-[100px] items-start px-[80px] py-[120px] relative size-full" data-node-id="4:103" data-name="services">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[800px]" data-node-id="4:104" data-name="Frame">
        <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase whitespace-nowrap" data-node-id="4:105">
          Interventi Professionali Certificati
        </p>
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.1] min-w-full relative shrink-0 text-[#151613] text-[52px] w-[min-content]" data-node-id="4:106">
          Soluzioni su misura per ogni tipologia di copertura
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="4:107" data-name="services-grid">
        <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-node-id="4:108" data-name="Frame">
          <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] h-[320px] items-start min-w-px overflow-clip relative rounded-[8px]" data-node-id="4:109" data-name="Frame">
            <div className="h-full relative shrink-0 w-[240px]" data-node-id="4:110" data-name="Rectangle">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-w-px p-[32px] relative" data-node-id="4:111" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:112" data-name="Frame">
                <p className="font-['Cormorant_Garamond:Regular'] leading-[normal] relative shrink-0 text-[32px] whitespace-nowrap" data-node-id="4:113">
                  Manutenzione Tetto
                </p>
                <p className="font-['Manrope:Regular'] leading-[1.6] min-w-full relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:114">{`Localizzazione infiltrazioni d'acqua, riparazione guaine compromesse, sostituzione di tegole rotte o canali ostruiti per proteggere subito la tua casa.`}</p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="4:115" data-name="Frame">
                <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase whitespace-nowrap" data-node-id="4:116">
                  Richiedi Info
                </p>
                <div className="relative shrink-0 size-[14px]" data-node-id="4:563" data-name="arrow-right">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowRight} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] h-[320px] items-start min-w-px overflow-clip relative rounded-[8px]" data-node-id="4:118" data-name="Frame">
            <div className="h-full relative shrink-0 w-[240px]" data-node-id="4:119" data-name="Rectangle">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle1} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-w-px p-[32px] relative" data-node-id="4:120" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:121" data-name="Frame">
                <p className="font-['Cormorant_Garamond:Regular'] leading-[normal] relative shrink-0 text-[32px] whitespace-nowrap" data-node-id="4:122">
                  Rifacimento Tetto
                </p>
                <p className="font-['Manrope:Regular'] leading-[1.6] min-w-full relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:123">
                  Intervento completo: rimozione del vecchio manto, consolidamento strutturale in legno, isolamento termico moderno ad alte prestazioni e posa nuove coperture.
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="4:124" data-name="Frame">
                <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase whitespace-nowrap" data-node-id="4:125">
                  Richiedi Info
                </p>
                <div className="relative shrink-0 size-[14px]" data-node-id="4:566" data-name="arrow-right">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowRight} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-node-id="4:127" data-name="Frame">
          <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] h-[320px] items-start min-w-px overflow-clip relative rounded-[8px]" data-node-id="4:128" data-name="Frame">
            <div className="h-full relative shrink-0 w-[240px]" data-node-id="4:129" data-name="Rectangle">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle2} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-w-px p-[32px] relative" data-node-id="4:130" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:131" data-name="Frame">
                <p className="font-['Cormorant_Garamond:Regular'] leading-[normal] relative shrink-0 text-[32px] whitespace-nowrap" data-node-id="4:132">
                  Impermeabilizzazione
                </p>
                <p className="font-['Manrope:Regular'] leading-[1.6] min-w-full relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:133">{`Sistemi all'avanguardia per tetti piani, terrazzi e garage. Posa professionale di membrane bituminose (guaine) certificate resistenti all'usura.`}</p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="4:134" data-name="Frame">
                <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase whitespace-nowrap" data-node-id="4:135">
                  Richiedi Info
                </p>
                <div className="relative shrink-0 size-[14px]" data-node-id="4:569" data-name="arrow-right">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowRight} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] h-[320px] items-start min-w-px overflow-clip relative rounded-[8px]" data-node-id="4:137" data-name="Frame">
            <div className="h-full relative shrink-0 w-[240px]" data-node-id="4:138" data-name="Rectangle">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle3} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-w-px p-[32px] relative" data-node-id="4:139" data-name="Frame">
              <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[12px] items-start relative shrink-0 text-[#151613] w-full" data-node-id="4:140" data-name="Frame">
                <p className="font-['Cormorant_Garamond:Regular'] leading-[normal] relative shrink-0 text-[32px] whitespace-nowrap" data-node-id="4:141">
                  Grondaie e Lattoneria
                </p>
                <p className="font-['Manrope:Regular'] leading-[1.6] min-w-full relative shrink-0 text-[14px] w-[min-content]" data-node-id="4:142">
                  Installazione e piegatura in cantiere di canali di gronda, pluviali e scossaline in rame, alluminio o zinco titanio, per un deflusso perfetto.
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="4:143" data-name="Frame">
                <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase whitespace-nowrap" data-node-id="4:144">
                  Richiedi Info
                </p>
                <div className="relative shrink-0 size-[14px]" data-node-id="4:572" data-name="arrow-right">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowRight} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#151613] content-stretch flex items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-node-id="4:146" data-name="verniciatura-deep-dive">
        <div className="relative self-stretch shrink-0 w-[400px]" data-node-id="4:147" data-name="Rectangle">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle4} />
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[40px] items-start min-w-px p-[56px] relative" data-node-id="4:148" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:149" data-name="Frame">
            <div className="bg-[rgba(255,255,255,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[4px] shrink-0" data-node-id="4:150" data-name="Frame">
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#eae5da] text-[12px] uppercase whitespace-nowrap" data-node-id="4:151">
                Trattamento Specializzato
              </p>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Light'] font-light leading-[0] min-w-full relative shrink-0 text-[44px] text-white w-[min-content]" data-node-id="4:152">
              <span className="leading-[normal]">{`Verniciatura e Protezione Tetto in `}</span>
              <span className="leading-[normal] text-[#eae5da]">4 Fasi Cruciali</span>
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] relative shrink-0 text-[#eae5da] text-[15px] w-[680px]" data-node-id="4:153">
              Non è una semplice rinfrescata estetica. Trattiamo le tue tegole con un protocollo chimico e protettivo nanotecnologico per estendere la vita del tetto di altri 15 anni.
            </p>
          </div>
          <div className="[word-break:break-word] content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-node-id="4:154" data-name="Frame">
            <div className="bg-[#282924] content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[20px] relative rounded-[6px]" data-node-id="4:155" data-name="Frame">
              <p className="font-['Cormorant_Garamond:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[32px] whitespace-nowrap" data-node-id="4:156">
                01
              </p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="4:157" data-name="Frame">
                <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[16px] text-white w-full" data-node-id="4:158">
                  Lavaggio e Biocida
                </p>
                <p className="font-['Manrope:Regular'] font-normal leading-[1.5] opacity-80 relative shrink-0 text-[#eae5da] text-[13px] w-full" data-node-id="4:159">
                  Idropulizia profonda a 250 bar e applicazione di principio attivo anti-muschio.
                </p>
              </div>
            </div>
            <div className="bg-[#282924] content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[20px] relative rounded-[6px]" data-node-id="4:160" data-name="Frame">
              <p className="font-['Cormorant_Garamond:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[32px] whitespace-nowrap" data-node-id="4:161">
                02
              </p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="4:162" data-name="Frame">
                <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[16px] text-white w-full" data-node-id="4:163">
                  Ripristino Substrato
                </p>
                <p className="font-['Manrope:Regular'] font-normal leading-[1.5] opacity-80 relative shrink-0 text-[#eae5da] text-[13px] w-full" data-node-id="4:164">
                  Sostituzione manuale delle parti rotte e stuccatura crepe strutturali.
                </p>
              </div>
            </div>
            <div className="bg-[#282924] content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[20px] relative rounded-[6px]" data-node-id="4:165" data-name="Frame">
              <p className="font-['Cormorant_Garamond:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[32px] whitespace-nowrap" data-node-id="4:166">
                03
              </p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="4:167" data-name="Frame">
                <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[16px] text-white w-full" data-node-id="4:168">
                  Primer Consolidante
                </p>
                <p className="font-['Manrope:Regular'] font-normal leading-[1.5] opacity-80 relative shrink-0 text-[#eae5da] text-[13px] w-full" data-node-id="4:169">
                  Applicazione di speciale fondo ancorante ad alta penetrazione.
                </p>
              </div>
            </div>
            <div className="bg-[#282924] content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[20px] relative rounded-[6px]" data-node-id="4:170" data-name="Frame">
              <p className="font-['Cormorant_Garamond:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[32px] whitespace-nowrap" data-node-id="4:171">
                04
              </p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="4:172" data-name="Frame">
                <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[16px] text-white w-full" data-node-id="4:173">
                  Doppia Mano Finitura
                </p>
                <p className="font-['Manrope:Regular'] font-normal leading-[1.5] opacity-80 relative shrink-0 text-[#eae5da] text-[13px] w-full" data-node-id="4:174">
                  Verniciatura elastomera impermeabilizzante ad alto spessore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Downloaded assets — element mapping

All raw images live in `public/images/figma/`. Figma returned each photo twice: a hi-res RGB original and a smaller RGBA variant (the fill crop). Use the hi-res one; the small variant is a fallback. Mapping was verified visually against the screenshot.

| File | Size (px) | Element / node | Reference-code URL constant |
|---|---|---|---|
| `services-1.png` | 864x1184 | Card 1 "Manutenzione Tetto" photo (dark slate tiles with raindrops), node 4:110 | `imgRectangle` (asset 4a392146...) — HI-RES, use this |
| `services-8.png` | 373x512 | Same photo, small RGBA variant of card 1 | duplicate of above |
| `services-5.png` | 864x1184 | Card 2 "Rifacimento Tetto" photo (timber roof structure under construction), node 4:119 | `imgRectangle1` (asset 7f96056d...) — HI-RES, use this |
| `services-2.png` | 373x512 | Same photo, small RGBA variant of card 2 | duplicate of above |
| `services-3.png` | 864x1184 | Card 3 "Impermeabilizzazione" photo (flat roof terrace with dark membrane), node 4:129 | `imgRectangle2` (asset 94fb0a7b...) — HI-RES, use this |
| `services-4.png` | 373x512 | Same photo, small RGBA variant of card 3 | duplicate of above |
| `services-7.png` | 864x1184 | Card 4 "Grondaie e Lattoneria" photo (copper gutter/downspout on ornate facade), node 4:138 | `imgRectangle3` (asset a3effde9...) — HI-RES, use this |
| `services-9.png` | 373x512 | Same photo, small RGBA variant of card 4 | duplicate of above |
| `services-10.png` | 832x1248 | Deep-dive "verniciatura" photo (worker spray-painting red roof tiles), node 4:147 | `imgRectangle4` (asset 450ab9c3...) — HI-RES, use this |
| `services-6.png` | 341x512 | Same photo, small RGBA variant of deep-dive | duplicate of above |
| `services-arrow-right.svg` | 14x14 | "Richiedi Info" arrow icon, nodes 4:563 / 4:566 / 4:569 / 4:572 (same asset reused 4x) | `imgArrowRight` (asset 02b2b4ac...) |

Arrow SVG content: 14x14 viewBox, path `M2.9162 7H11.0838M7 11.0838L11.0838 7L7 2.9162`, stroke `#8E7E6A`, stroke-width 2, stroke-linecap round, fill none.

## Colors (exact hex)

| Color | Usage |
|---|---|
| `#f7f4eb` | Section background (warm off-white) |
| `#151613` | Headline text, card body text, deep-dive panel background |
| `#8e7e6a` | Eyebrow text, "Richiedi Info" links, arrow icon stroke, step numbers 01-04 (warm taupe accent) |
| `#ffffff` | Card backgrounds, deep-dive main headline (first span), step titles |
| `rgba(21,22,19,0.08)` | 1px card borders |
| `#eae5da` | Deep-dive: badge text, headline second span ("4 Fasi Cruciali"), paragraph, step descriptions (light beige) |
| `rgba(255,255,255,0.08)` | Deep-dive badge background |
| `#282924` | Step card backgrounds inside deep-dive |

## Typography

| Font | Weight | Size / line-height | Usage |
|---|---|---|---|
| Manrope | Bold (700) | 13px / normal, uppercase | Eyebrow "Interventi Professionali Certificati", "Richiedi Info" links |
| Cormorant Garamond | Light (300) | 52px / 1.1 | Section headline |
| Cormorant Garamond | Regular (400) | 32px / normal | Card titles |
| Manrope | Regular (400) | 14px / 1.6 | Card body copy |
| Manrope | Bold (700) | 12px / normal, uppercase | Deep-dive badge "Trattamento Specializzato" |
| Cormorant Garamond | Light (300) | 44px / normal | Deep-dive headline |
| Manrope | Regular (400) | 15px / 1.6 | Deep-dive intro paragraph (width 680px) |
| Cormorant Garamond | Bold (700) | 32px / normal | Step numbers 01-04 |
| Manrope | Bold (700) | 16px / normal | Step titles |
| Manrope | Regular (400) | 13px / 1.5, opacity 0.8 | Step descriptions |

## Layout facts

- Section: 1440px design width, padding 120px top/bottom, 80px sides, column gap 100px between header / grid / deep-dive.
- Header block fixed 800px wide, 16px gap between eyebrow and headline.
- Services grid: 2 rows x 2 cards, 40px gaps both axes. Card: white, height 320px, radius 8px, 1px border rgba(21,22,19,0.08), overflow hidden. Left photo column fixed 240px wide full height (object-cover); right content 32px padding, space-between column (title+body on top, "Richiedi Info" link pinned to bottom).
- "Richiedi Info" row: 8px gap, 14px arrow icon.
- Deep-dive panel: full width, bg #151613, radius 12px, overflow hidden. Left photo fixed 400px wide, full height, object-cover. Right content padding 56px, 40px gap. Badge padding 12x6, radius 4px. Headline uses two spans: white then #eae5da.
- 4 step cards in one row, 24px gap, each flex-1, bg #282924, radius 6px, padding 20px, 16px gap number-to-text, 8px gap title-to-description.
