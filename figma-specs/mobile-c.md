# Mobile C — figma specs (mobile-portfolio 4:500, mobile-footer 4:510, mobile-sticky-bar 4:528)

File key: `za3YRMJqYkYXGVjYF2u3H4`. Frame width 375px. Reference code below is the VERBATIM React+Tailwind output of `get_design_context` — adapt to Astro/HTML/CSS, do not paste as-is.

---

## mobile-portfolio (node 4:500)

Screenshot: `figma-specs/shots/mobile-portfolio.png` (375x601)

### Layout summary
- Section: bg `#151613`, vertical flex, gap 40px, padding 64px top/bottom, 20px left/right, full width.
- Heading block: gap 12px. Eyebrow "LAVORI RECENTI" (Manrope Bold 11px uppercase, `#eae5da`), title "Progetti Prima e Dopo" (Cormorant Garamond Light 32px, line-height 1.2, white).
- Single project card (mobile shows ONE card vs the desktop grid): image 220px tall, full width, border-radius 6px, object-fit cover; then text block gap 8px:
  - "ABBIATEGRASSO (MI)" Manrope Bold 12px uppercase `#eae5da`
  - "Rifacimento Completo" Cormorant Garamond Regular 24px white
  - Body: Manrope Regular 14px, line-height 1.5, `#eae5da` at 80% opacity: "Tetto smantellato a telaio, coibentato ad alte prestazioni e rifinito con tegole portoghesi ad incastro."

### Assets
- `public/images/figma/mobile-portfolio-1.png` (1248x832) — roof photo with wooden battens over dark slate shingles (the card image). Figma also served a 512x341 downscale of the SAME photo; only the high-res copy was kept. Note: this photo is NOT one of the desktop `portfolio-1..8.png` images — it is unique to the mobile frame.

### Reference code (verbatim)

```jsx
const imgRectangle = "https://www.figma.com/api/mcp/asset/5fbfc652-3f5b-491f-9fb2-40de244285d7";

export default function MobilePortfolio() {
  return (
    <div className="bg-[#151613] content-stretch flex flex-col gap-[40px] items-start px-[20px] py-[64px] relative size-full" data-node-id="4:500" data-name="mobile-portfolio">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="4:501" data-name="Frame">
        <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#eae5da] text-[11px] uppercase whitespace-nowrap" data-node-id="4:502">
          LAVORI RECENTI
        </p>
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.2] min-w-full relative shrink-0 text-[32px] text-white w-[min-content]" data-node-id="4:503">
          Progetti Prima e Dopo
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="4:504" data-name="Frame">
        <div className="h-[220px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:505" data-name="Rectangle">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgRectangle} />
        </div>
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="4:506" data-name="Frame">
          <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#eae5da] text-[12px] uppercase whitespace-nowrap" data-node-id="4:507">
            ABBIATEGRASSO (MI)
          </p>
          <p className="font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] min-w-full relative shrink-0 text-[24px] text-white w-[min-content]" data-node-id="4:508">
            Rifacimento Completo
          </p>
          <p className="font-['Manrope:Regular'] font-normal leading-[1.5] min-w-full opacity-80 relative shrink-0 text-[#eae5da] text-[14px] w-[min-content]" data-node-id="4:509">
            Tetto smantellato a telaio, coibentato ad alte prestazioni e rifinito con tegole portoghesi ad incastro.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## mobile-footer (node 4:510)

Screenshot: `figma-specs/shots/mobile-footer.png` (375x657)

### Layout summary
- Section: bg `#151613`, vertical flex, gap 48px, padding-top 64px, **padding-bottom 120px** (leaves room for the fixed sticky bar), 20px left/right.
- Logo row: gap 12px; 44x44 wrapper centering a 36x30 house outline icon (white, stroke-width 2); text baseline row gap 8px: "MDA" Manrope ExtraBold 20px white + "IMPRESA EDILE" Manrope Light 11px uppercase `#eae5da`.
- INFORMAZIONI block: heading Manrope ExtraBold 12px white; body Manrope Regular 13px `#eae5da`, line-height 1.6: "MDA Impresa Edile · Specialisti in coperture residenziali in Lombardia. squadra interna altamente formata e sicura." (copy is verbatim from Figma, incl. lowercase "squadra" after the period).
- SERVIZIO RAPIDO block, gap 16px: heading Manrope ExtraBold 12px white; phone "+39 02 8410 9920" Manrope ExtraBold 16px white; email "info@mdaimpresaedile.it" Manrope Regular 14px `#eae5da`.
- Divider: full-width 1px line, white at 10% opacity (in Figma an SVG line 335x1; use `border-top: 1px solid rgba(255,255,255,0.1)` in code).
- Legal block: Manrope Regular 11px `#eae5da` at 40% opacity, gap 8px: "© 2025 MDA Impresa Edile | Sede: Via della Moscova 12, 20121 Milano (MI)" and "P.IVA 08249510963".

### Assets
- House icon: SAME glyph as existing `public/images/figma/footer-house.svg` (desktop, 43x36) — reuse it scaled to 36x30; no new file saved.
- Divider line: same as `footer-line.svg` at 335px width — reproduce with CSS border instead of an asset; no new file saved.

### Reference code (verbatim)

```jsx
const imgHouse = "https://www.figma.com/api/mcp/asset/c875d53a-e2b1-41fa-879c-311a07b2a2e6";
const imgLine = "https://www.figma.com/api/mcp/asset/65c2cb2f-7de9-40f4-9197-754e906c4907";

export default function MobileFooter() {
  return (
    <div className="bg-[#151613] content-stretch flex flex-col gap-[48px] items-start pb-[120px] pt-[64px] px-[20px] relative size-full" data-node-id="4:510" data-name="mobile-footer">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="4:511" data-name="logo-container">
        <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[44px]" data-node-id="4:512" data-name="logo-icon-wrapper">
          <div className="h-[30px] relative shrink-0 w-[36px]" data-node-id="4:707" data-name="house">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHouse} />
          </div>
        </div>
        <div className="[word-break:break-word] content-stretch flex gap-[8px] items-baseline leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="4:514" data-name="logo-text">
          <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[20px] text-white" data-node-id="4:515">
            MDA
          </p>
          <p className="font-['Manrope:Light'] font-light relative shrink-0 text-[#eae5da] text-[11px] uppercase" data-node-id="4:516">
            IMPRESA EDILE
          </p>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:517" data-name="Frame">
        <p className="font-['Manrope:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="4:518">
          INFORMAZIONI
        </p>
        <p className="font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#eae5da] text-[13px] w-[min-content]" data-node-id="4:519">
          MDA Impresa Edile · Specialisti in coperture residenziali in Lombardia. squadra interna altamente formata e sicura.
        </p>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-node-id="4:520" data-name="Frame">
        <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[12px] text-white" data-node-id="4:521">
          SERVIZIO RAPIDO
        </p>
        <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[16px] text-white" data-node-id="4:522">
          +39 02 8410 9920
        </p>
        <p className="font-['Manrope:Regular'] font-normal relative shrink-0 text-[#eae5da] text-[14px]" data-node-id="4:523">
          info@mdaimpresaedile.it
        </p>
      </div>
      <div className="h-0 relative shrink-0 w-full" data-node-id="4:524" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine} />
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col font-['Manrope:Regular'] font-normal gap-[8px] items-start leading-[normal] relative shrink-0 text-[#eae5da] text-[11px] w-full" data-node-id="4:525" data-name="Frame">
        <p className="min-w-full opacity-40 relative shrink-0 w-[min-content]" data-node-id="4:526">
          © 2025 MDA Impresa Edile | Sede: Via della Moscova 12, 20121 Milano (MI)
        </p>
        <p className="opacity-40 relative shrink-0 whitespace-nowrap" data-node-id="4:527">
          P.IVA 08249510963
        </p>
      </div>
    </div>
  );
}
```

---

## mobile-sticky-bar (node 4:528)

Screenshot: `figma-specs/shots/mobile-sticky-bar.png` (375x76)

### Layout summary
- Fixed bottom bar (this is why the footer has 120px bottom padding): bg white, `border-top: 1px solid rgba(21,22,19,0.08)`, horizontal flex, gap 12px, padding 12px top/bottom, 16px left/right.
- Two equal-width buttons (`flex: 1 0 0`), each: gap 8px, padding 14px all sides, border-radius 6px, centered content, 16x16 icon + label Manrope ExtraBold 14px white uppercase.
  - Button 1 "CHIAMA ORA": bg `#151613`, phone icon (white stroke).
  - Button 2 "WHATSAPP": bg `#25d366` (WhatsApp green), circle-x icon (white stroke). NOTE: Figma's layer is literally named "circle-x" — an X in a circle, not a real WhatsApp glyph. Faithful build = use the exported circle-x asset; flag to the user if a real WhatsApp logo is wanted.

### Assets
- `public/images/figma/mobile-sticky-bar-1.svg` — phone icon, 16x16, stroke white, stroke-width 2 (same lucide "phone" glyph as `quote-form-phone.svg` but that one is dark `#151613`; white variant saved separately).
- `public/images/figma/mobile-sticky-bar-2.svg` — circle-x icon, 16x16, stroke white, stroke-width 2 (same glyph as `footer-circle-x.svg` but that one is green `#25D366`; white variant saved separately).

### Reference code (verbatim)

```jsx
const imgPhone = "https://www.figma.com/api/mcp/asset/d3632240-5685-4372-ac13-fab3e800a2dc";
const imgCircleX = "https://www.figma.com/api/mcp/asset/79cf66d6-b07d-4ca7-9bfa-a2b78bf7a1d4";

export default function MobileStickyBar() {
  return (
    <div className="bg-white border-[rgba(21,22,19,0.08)] border-solid border-t content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full" data-node-id="4:528" data-name="mobile-sticky-bar">
      <div className="bg-[#151613] content-stretch flex flex-[1_0_0] gap-[8px] items-center justify-center min-w-px p-[14px] relative rounded-[6px]" data-node-id="4:529" data-name="Frame">
        <div className="relative shrink-0 size-[16px]" data-node-id="4:635" data-name="phone">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
        </div>
        <p className="[word-break:break-word] font-['Manrope:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white uppercase whitespace-nowrap" data-node-id="4:531">
          CHIAMA ORA
        </p>
      </div>
      <div className="bg-[#25d366] content-stretch flex flex-[1_0_0] gap-[8px] items-center justify-center min-w-px p-[14px] relative rounded-[6px]" data-node-id="4:532" data-name="Frame">
        <div className="relative shrink-0 size-[16px]" data-node-id="4:713" data-name="circle-x">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleX} />
        </div>
        <p className="[word-break:break-word] font-['Manrope:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white uppercase whitespace-nowrap" data-node-id="4:534">
          WHATSAPP
        </p>
      </div>
    </div>
  );
}
```

---

## Shared tokens across these three sections

Colors:
- `#151613` near-black (section bg, CHIAMA ORA button bg, sticky-bar border tint)
- `#eae5da` warm cream (eyebrows, body text, secondary logo text; used at 100%, 80%, 40% opacity)
- `#ffffff` white (titles, button labels, icon strokes, sticky-bar bg)
- `#25d366` WhatsApp green (WHATSAPP button)
- `rgba(21,22,19,0.08)` sticky-bar top border
- `rgba(255,255,255,0.1)` footer divider line

Fonts:
- Manrope: Light (300), Regular (400), Bold (700), ExtraBold (800)
- Cormorant Garamond: Light (300), Regular (400)
