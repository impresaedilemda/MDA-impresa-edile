# Figma spec: "portfolio" (node 4:251)

File key: za3YRMJqYkYXGVjYF2u3H4
Node natural size: 1440 x 1340 px
Screenshot: figma-specs/shots/portfolio.png (1440x1340)

## Reference code (verbatim from get_design_context, React+Tailwind, adapt to Astro)

```tsx
const imgRectangle = "https://www.figma.com/api/mcp/asset/938ad709-b19e-4bc7-aa0b-33ca3c8bcbc7";
const imgRectangle1 = "https://www.figma.com/api/mcp/asset/416164c3-fe03-481b-9cfd-7b344c91edce";
const imgRectangle2 = "https://www.figma.com/api/mcp/asset/365545dd-8897-4224-882c-13e27f274d25";
const imgRectangle3 = "https://www.figma.com/api/mcp/asset/f2d2a31e-1445-4bfc-b660-7d7a20575dde";
const imgMapPin = "https://www.figma.com/api/mcp/asset/f7fa9f3e-32b8-4ae2-96dd-4339645ec9b1";

export default function Portfolio() {
  return (
    <div className="bg-[#151613] content-stretch flex flex-col gap-[80px] items-start px-[80px] py-[120px] relative size-full" data-node-id="4:251" data-name="portfolio">
      <div className="[word-break:break-word] content-stretch flex items-end justify-between relative shrink-0 w-full" data-node-id="4:252" data-name="Frame">
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[680px]" data-node-id="4:253" data-name="Frame">
          <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#eae5da] text-[13px] uppercase whitespace-nowrap" data-node-id="4:254">
            I Nostri Lavori Recenti
          </p>
          <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.1] min-w-full relative shrink-0 text-[52px] text-white w-[min-content]" data-node-id="4:255">
            Coperture prima e dopo il nostro cantiere
          </p>
        </div>
        <p className="font-['Manrope:Regular'] font-normal leading-[1.6] opacity-80 relative shrink-0 text-[#eae5da] text-[16px] w-[400px]" data-node-id="4:256">
          Ogni tetto è documentato accuratamente per mostrare lo standard esecutivo della nostra squadra interna.
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[56px] items-start relative shrink-0 w-full" data-node-id="4:257" data-name="Frame">
        <div className="border-[rgba(255,255,255,0.08)] border-b border-solid content-stretch flex gap-[48px] items-center pb-[48px] relative shrink-0 w-full" data-node-id="4:258" data-name="Frame">
          <div className="content-stretch flex gap-[24px] h-[360px] items-start relative shrink-0 w-[720px]" data-node-id="4:259" data-name="project-images">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] h-full items-start min-w-px relative" data-node-id="4:260" data-name="Frame">
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#a35c4e] text-[11px] uppercase whitespace-nowrap" data-node-id="4:261">{`PRIMA DELL'INTERVENTO`}</p>
              <div className="flex-[1_0_0] min-h-px relative rounded-[4px] w-full" data-node-id="4:262" data-name="Rectangle">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgRectangle} />
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] h-full items-start min-w-px relative" data-node-id="4:263" data-name="Frame">
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#22c55e] text-[11px] uppercase whitespace-nowrap" data-node-id="4:264">
                DOPO IL NOSTRO LAVORO
              </p>
              <div className="flex-[1_0_0] min-h-px relative rounded-[4px] w-full" data-node-id="4:265" data-name="Rectangle">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgRectangle1} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px relative" data-node-id="4:266" data-name="Frame">
            <div className="bg-[rgba(255,255,255,0.07)] content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[4px] shrink-0" data-node-id="4:267" data-name="Frame">
              <div className="relative shrink-0 size-[14px]" data-node-id="4:602" data-name="map-pin">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMapPin} />
              </div>
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#eae5da] text-[13px] whitespace-nowrap" data-node-id="4:269">
                Abbiategrasso (MI)
              </p>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[36px] text-white whitespace-nowrap" data-node-id="4:270">
              Abbiategrasso Project
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#eae5da] text-[15px] w-[min-content]" data-node-id="4:271">
              Rifacimento completo copertura in tegole portoghesi ed installazione isolamento termico in lana di roccia.
            </p>
            <div className="[word-break:break-word] content-stretch flex gap-[24px] items-start leading-[normal] pt-[12px] relative shrink-0 whitespace-nowrap" data-node-id="4:272" data-name="Frame">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-node-id="4:273" data-name="Frame">
                <p className="font-['Manrope:Regular'] font-normal opacity-60 relative shrink-0 text-[#eae5da] text-[12px]" data-node-id="4:274">
                  TEMPO DI POSA
                </p>
                <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[16px] text-white" data-node-id="4:275">
                  8 Giorni Lavorativi
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-node-id="4:276" data-name="Frame">
                <p className="font-['Manrope:Regular'] font-normal opacity-60 relative shrink-0 text-[#eae5da] text-[12px]" data-node-id="4:277">
                  MATERIALI USATI
                </p>
                <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[16px] text-white" data-node-id="4:278">
                  Lana Minerale, Rame, Tegole Wierer
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-[rgba(255,255,255,0.08)] border-b border-solid content-stretch flex gap-[48px] items-center pb-[48px] relative shrink-0 w-full" data-node-id="4:279" data-name="Frame">
          <div className="content-stretch flex gap-[24px] h-[360px] items-start relative shrink-0 w-[720px]" data-node-id="4:280" data-name="project-images">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] h-full items-start min-w-px relative" data-node-id="4:281" data-name="Frame">
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#a35c4e] text-[11px] uppercase whitespace-nowrap" data-node-id="4:282">{`PRIMA DELL'INTERVENTO`}</p>
              <div className="flex-[1_0_0] min-h-px relative rounded-[4px] w-full" data-node-id="4:283" data-name="Rectangle">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgRectangle2} />
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] h-full items-start min-w-px relative" data-node-id="4:284" data-name="Frame">
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#22c55e] text-[11px] uppercase whitespace-nowrap" data-node-id="4:285">
                DOPO IL NOSTRO LAVORO
              </p>
              <div className="flex-[1_0_0] min-h-px relative rounded-[4px] w-full" data-node-id="4:286" data-name="Rectangle">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgRectangle3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px relative" data-node-id="4:287" data-name="Frame">
            <div className="bg-[rgba(255,255,255,0.07)] content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[4px] shrink-0" data-node-id="4:288" data-name="Frame">
              <div className="relative shrink-0 size-[14px]" data-node-id="4:605" data-name="map-pin">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMapPin} />
              </div>
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#eae5da] text-[13px] whitespace-nowrap" data-node-id="4:290">
                Vimercate (MB)
              </p>
            </div>
            <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[36px] text-white whitespace-nowrap" data-node-id="4:291">
              Vimercate Project
            </p>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#eae5da] text-[15px] w-[min-content]" data-node-id="4:292">
              Rimozione amianto e installazione tetto ventilato in legno lamellare a vista e finitura ardesia.
            </p>
            <div className="[word-break:break-word] content-stretch flex gap-[24px] items-start leading-[normal] pt-[12px] relative shrink-0 whitespace-nowrap" data-node-id="4:293" data-name="Frame">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-node-id="4:294" data-name="Frame">
                <p className="font-['Manrope:Regular'] font-normal opacity-60 relative shrink-0 text-[#eae5da] text-[12px]" data-node-id="4:295">
                  TEMPO DI POSA
                </p>
                <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[16px] text-white" data-node-id="4:296">
                  8 Giorni Lavorativi
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-node-id="4:297" data-name="Frame">
                <p className="font-['Manrope:Regular'] font-normal opacity-60 relative shrink-0 text-[#eae5da] text-[12px]" data-node-id="4:298">
                  MATERIALI USATI
                </p>
                <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[16px] text-white" data-node-id="4:299">
                  Lana Minerale, Rame, Tegole Wierer
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

## Downloaded assets and element mapping

All paths relative to project root `mda-impresa-edile/`. Mapping verified by md5 checksum of the code asset URLs against the downloaded raw images.

Images USED by the design (1024x1024 PNG, AI-generated photos):

| File | Code constant | Figma node | Element |
|---|---|---|---|
| public/images/figma/portfolio-2.png | imgRectangle (asset 938ad709) | 4:262 | Project 1 Abbiategrasso, PRIMA DELL'INTERVENTO (mossy old tiled roof) |
| public/images/figma/portfolio-6.png | imgRectangle1 (asset 416164c3) | 4:265 | Project 1 Abbiategrasso, DOPO IL NOSTRO LAVORO (new terracotta roof on cream building) |
| public/images/figma/portfolio-3.png | imgRectangle2 (asset 365545dd) | 4:283 | Project 2 Vimercate, PRIMA DELL'INTERVENTO (old barn, grey corrugated roof, countryside) |
| public/images/figma/portfolio-4.png | imgRectangle3 (asset f2d2a31e) | 4:286 | Project 2 Vimercate, DOPO IL NOSTRO LAVORO (modern house, slate roof + exposed timber rafters) |

Extra raw fills found in the node subtree but NOT referenced by the reference code. They are 512x512 RGBA lower-resolution duplicates of the same four photos; safe to ignore or delete:

| File | Duplicate of |
|---|---|
| public/images/figma/portfolio-1.png | portfolio-2.png (project 1 before) |
| public/images/figma/portfolio-5.png | portfolio-6.png (project 1 after) |
| public/images/figma/portfolio-7.png | portfolio-3.png (project 2 before) |
| public/images/figma/portfolio-8.png | portfolio-4.png (project 2 after) |

SVG:

| File | Code constant | Figma nodes | Element |
|---|---|---|---|
| public/images/figma/portfolio-map-pin.svg | imgMapPin (asset f7fa9f3e, byte-identical to svgAsset f4323006) | 4:602 and 4:605 | 14x14 map-pin icon inside both location badges, stroke #EAE5DA, stroke-width 2, fill none |

Section screenshot: figma-specs/shots/portfolio.png (1440x1340 px, full node).

## Colors (exact)

| Hex / value | Usage |
|---|---|
| #151613 | Section background |
| #FFFFFF | H2 heading, project titles, stat values |
| #EAE5DA | Eyebrow, intro paragraph (at 80% opacity), badge text, descriptions, stat labels (at 60% opacity), map-pin stroke |
| #A35C4E | "PRIMA DELL'INTERVENTO" labels (terracotta) |
| #22C55E | "DOPO IL NOSTRO LAVORO" labels (green) |
| rgba(255,255,255,0.07) | Location badge background |
| rgba(255,255,255,0.08) | 1px bottom border under each project row |

Opacity modifiers: intro paragraph opacity 0.8; stat labels ("TEMPO DI POSA", "MATERIALI USATI") opacity 0.6.

## Typography (exact)

| Font | Weight | Size | Line-height | Case | Usage |
|---|---|---|---|---|---|
| Manrope | Bold (700) | 13px | normal | uppercase | Eyebrow "I Nostri Lavori Recenti" |
| Cormorant Garamond | Light (300) | 52px | 1.1 | none | Section heading "Coperture prima e dopo il nostro cantiere" |
| Manrope | Regular (400) | 16px | 1.6 | none | Intro paragraph (right side, 400px wide) |
| Manrope | Bold (700) | 11px | normal | uppercase | Before/after labels above images |
| Manrope | Bold (700) | 13px | normal | none | Location badge text "Abbiategrasso (MI)", "Vimercate (MB)" |
| Cormorant Garamond | Regular (400) | 36px | normal | none | Project titles |
| Manrope | Regular (400) | 15px | 1.6 | none | Project descriptions |
| Manrope | Regular (400) | 12px | normal | as-typed (already caps) | Stat labels |
| Manrope | ExtraBold (800) | 16px | normal | none | Stat values |

## Layout summary (desktop 1440)

- Section: padding 120px top/bottom, 80px left/right; column flex, gap 80px between header row and projects list.
- Header row: full width, flex, items-end, justify-between. Left block 680px wide, gap 16. Right paragraph 400px wide.
- Projects list: column, gap 56px.
- Each project row: flex row, gap 48px, items-center, padding-bottom 48px, border-bottom 1px rgba(255,255,255,0.08). Both rows have the border (including the last one).
- Image pair block: fixed 720px wide, 360px tall; two equal columns, gap 24px; each column = label (gap 8px below) + image filling remaining height, border-radius 4px, object-cover.
- Info column: fills remaining width, column gap 20px. Badge: padding 12px x / 6px y, radius 4px, icon 14px, gap 8px. Stats row: gap 24px, padding-top 12px; each stat = label + value, gap 4px.
