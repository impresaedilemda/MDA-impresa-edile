# Mobile A specs (mobile-header, mobile-hero, mobile-trust)

Figma file key: `za3YRMJqYkYXGVjYF2u3H4`. Frame width 375px. Reference code below is Figma-generated React+Tailwind, saved verbatim; adapt to Astro/HTML/CSS. Asset URLs in the code have EXPIRED; use the local files listed per section.

---

## mobile-header (node 4:416)

Screenshot: `figma-specs/shots/mobile-header.png` (375x70)

### Assets
- house logo icon: SAME GLYPH as desktop `public/images/figma/header-house.svg`, rendered at 29x24 on mobile (desktop version is 36x30; SVG scales, reuse it). The `imgHouse` constant maps to it.
- hamburger menu icon: `public/images/figma/mobile-header-1.svg` (20x20, three horizontal lines, stroke white 2px round caps). The `imgMenu` constant maps to it. Mobile-only, no desktop equivalent.

### Reference code (verbatim)

```jsx
const imgHouse = "https://www.figma.com/api/mcp/asset/a3580e46-74ac-41ed-aede-efd104021f26";
const imgMenu = "https://www.figma.com/api/mcp/asset/6c8530fb-d155-4a93-b229-87a9a1dee405";

export default function MobileHeader() {
  return (
    <div className="bg-[#f7f4eb] border-[rgba(21,22,19,0.08)] border-b border-solid content-stretch flex items-center justify-between px-[16px] py-[15px] relative size-full" data-node-id="4:416" data-name="mobile-header">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="4:417" data-name="logo-container">
        <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[35px]" data-node-id="4:418" data-name="logo-icon-wrapper">
          <div className="h-[24px] relative shrink-0 w-[29px]" data-node-id="4:704" data-name="house">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHouse} />
          </div>
        </div>
        <div className="[word-break:break-word] content-stretch flex gap-[8px] items-baseline leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="4:420" data-name="logo-text">
          <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[#151613] text-[16px]" data-node-id="4:421">
            MDA
          </p>
          <p className="font-['Manrope:Light'] font-light relative shrink-0 text-[#8e7e6a] text-[9px] uppercase" data-node-id="4:422">
            IMPRESA EDILE
          </p>
        </div>
      </div>
      <div className="bg-[#151613] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[36px]" data-node-id="4:423" data-name="Frame">
        <div className="relative shrink-0 size-[20px]" data-node-id="4:695" data-name="menu">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMenu} />
        </div>
      </div>
    </div>
  );
}
```

### Colors
- background: `#f7f4eb`
- bottom border: `rgba(21,22,19,0.08)` 1px solid
- logo "MDA": `#151613`
- logo "IMPRESA EDILE": `#8e7e6a`, uppercase
- menu button: bg `#151613`, radius 4px, 36x36; icon stroke white

### Fonts
- Manrope ExtraBold 16px ("MDA")
- Manrope Light 9px uppercase ("IMPRESA EDILE")

### Layout notes
- Bar: flex row, space-between, padding 16px horizontal / 15px vertical (total height 70px incl. border).
- Logo group: gap 12px between icon wrapper (35x35, icon 29x24 centered) and text; text baseline-aligned with 8px gap.

---

## mobile-hero (node 4:425)

Screenshot: `figma-specs/shots/mobile-hero.png` (375x446)

### Assets
- background photo: `public/images/figma/mobile-hero-1.png` (896x1152 portrait, roof with brick chimney). This is a DIFFERENT crop/photo from desktop hero-1.png/hero-2.png (those are landscape). Figma also served a 398x512 low-res duplicate of the same photo; not saved.
- object-cover full-bleed, with dark overlay `rgba(21,22,19,0.55)` on top.

### Reference code (verbatim)

```jsx
const imgMobileHero = "https://www.figma.com/api/mcp/asset/3f87abf6-0035-4fe7-8761-1ffb33a07673";

export default function MobileHero() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start px-[20px] py-[48px] relative size-full" data-node-id="4:425" data-name="mobile-hero">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgMobileHero} />
        <div className="absolute bg-[rgba(21,22,19,0.55)] inset-0" />
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:426" data-name="Frame">
        <div className="bg-[rgba(255,255,255,0.13)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[100px] shrink-0" data-node-id="4:427" data-name="Frame">
          <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[11px] text-white uppercase whitespace-nowrap" data-node-id="4:428">
            DA 17 ANNI SPECIALISTI IN TETTI
          </p>
        </div>
        <p className="[word-break:break-word] font-['Cormorant_Garamond:Light'] font-light leading-[1.1] min-w-full relative shrink-0 text-[44px] text-white w-[min-content]" data-node-id="4:429">{`L'arte delle coperture italiane.`}</p>
        <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#f7f4eb] text-[15px] w-[min-content]" data-node-id="4:430">
          Costruiamo e restauriamo tetti con squadra interna specializzata. Nessun subappalto e 10 anni di garanzia scritta.
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:431" data-name="Frame">
        <div className="bg-white content-stretch flex items-start justify-center px-[24px] py-[16px] relative rounded-[4px] shrink-0 w-full" data-node-id="4:432" data-name="Frame">
          <p className="[word-break:break-word] font-['Manrope:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#151613] text-[14px] uppercase whitespace-nowrap" data-node-id="4:433">
            Sopralluogo Gratuito
          </p>
        </div>
        <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full" data-node-id="4:434" data-name="Frame">
          <div className="bg-[#22c55e] relative rounded-[4px] shrink-0 size-[8px]" data-node-id="4:435" data-name="Frame" />
          <p className="[word-break:break-word] font-['Manrope:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="4:436">
            Operativi in Lombardia
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Colors
- overlay over photo: `rgba(21,22,19,0.55)`
- eyebrow badge: bg `rgba(255,255,255,0.13)`, radius 100px, text white
- headline: white
- body: `#f7f4eb`
- CTA button: bg white, radius 4px, text `#151613`
- status dot: `#22c55e`, 8x8, radius 4px (circle); label white

### Fonts
- Manrope Bold 11px uppercase (badge "DA 17 ANNI SPECIALISTI IN TETTI")
- Cormorant Garamond Light 44px, line-height 1.1 (headline "L'arte delle coperture italiane.")
- Manrope Regular 15px, line-height 1.6 (body)
- Manrope ExtraBold 14px uppercase (CTA "Sopralluogo Gratuito")
- Manrope SemiBold 12px ("Operativi in Lombardia")

### Layout notes
- Section: padding 20px horizontal / 48px vertical, column gap 40px between text block and CTA block; total 375x446.
- Text block: column, gap 16px. CTA block: column, gap 16px; button full-width py 16px; dot row centered horizontally.
- Copy uses accented Italian (GARANZIA etc.); keep the apostrophe in "L'arte".

---

## mobile-trust (node 4:437)

Screenshot: `figma-specs/shots/mobile-trust.png` (375x878)

### Assets
All three card icons are the SAME GLYPHS as the desktop trust icons, served at 18x18 instead of 22x22 — reuse the existing files, rendered at 18px inside a 40x40 dark circle:
- `public/images/figma/trust-users-2.svg` (imgUsers2)
- `public/images/figma/trust-lock.svg` (imgLock)
- `public/images/figma/trust-file-text.svg` (imgFileText)
No new files saved for this section.

### Reference code (verbatim)

```jsx
const imgUsers2 = "https://www.figma.com/api/mcp/asset/2dada71d-4e03-48ae-96d9-263a79a1dd24";
const imgLock = "https://www.figma.com/api/mcp/asset/3bb3dde4-9b1b-4a2a-89b7-b85760c6e032";
const imgFileText = "https://www.figma.com/api/mcp/asset/6bade3d3-b29d-40e0-afa5-d5c716e9867c";

export default function MobileTrust() {
  return (
    <div className="bg-[#f7f4eb] content-stretch flex flex-col gap-[40px] items-start px-[20px] py-[64px] relative size-full" data-node-id="4:437" data-name="mobile-trust">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="4:438" data-name="Frame">
        <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[11px] uppercase whitespace-nowrap" data-node-id="4:439">
          GARANZIE DI QUALITÀ
        </p>
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.2] min-w-full relative shrink-0 text-[#151613] text-[32px] w-[min-content]" data-node-id="4:440">
          Perché scegliere la nostra impresa
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-node-id="4:441" data-name="Frame">
        <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:442" data-name="Frame">
          <div className="bg-[#151613] content-stretch flex items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="4:443" data-name="Frame">
            <div className="relative shrink-0 size-[18px]" data-node-id="4:641" data-name="users-2">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUsers2} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[22px] whitespace-nowrap" data-node-id="4:445">
            Squadra Interna
          </p>
          <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.5] min-w-full relative shrink-0 text-[#151613] text-[14px] w-[min-content]" data-node-id="4:446">
            Dipendenti diretti qualificati, nessun subappalto ambiguo.
          </p>
        </div>
        <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:447" data-name="Frame">
          <div className="bg-[#151613] content-stretch flex items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="4:448" data-name="Frame">
            <div className="relative shrink-0 size-[18px]" data-node-id="4:632" data-name="lock">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLock} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[22px] whitespace-nowrap" data-node-id="4:450">
            Prezzo Bloccato
          </p>
          <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.5] min-w-full relative shrink-0 text-[#151613] text-[14px] w-[min-content]" data-node-id="4:451">
            Il preventivo contrattualizzato non subisce variazioni.
          </p>
        </div>
        <div className="bg-[#f1ece0] border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[6px] shrink-0 w-full" data-node-id="4:452" data-name="Frame">
          <div className="bg-[#151613] content-stretch flex items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="4:453" data-name="Frame">
            <div className="relative shrink-0 size-[18px]" data-node-id="4:692" data-name="file-text">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFileText} />
            </div>
          </div>
          <p className="[word-break:break-word] font-['Cormorant_Garamond:Regular'] font-normal leading-[normal] relative shrink-0 text-[#151613] text-[22px] whitespace-nowrap" data-node-id="4:455">
            Detrazione al 50%
          </p>
          <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.5] min-w-full relative shrink-0 text-[#151613] text-[14px] w-[min-content]" data-node-id="4:456">
            Burocrazia fiscale inclusa per il recupero della spesa.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Colors
- section background: `#f7f4eb`
- eyebrow "GARANZIE DI QUALITÀ": `#8e7e6a`
- heading and all card text: `#151613`
- card background: `#f1ece0`, border `rgba(21,22,19,0.08)` 1px, radius 6px
- icon circle: bg `#151613`, 40x40, radius 20px (full circle); icon stroke white/cream 18px

### Fonts
- Manrope Bold 11px uppercase (eyebrow)
- Cormorant Garamond Light 32px, line-height 1.2 (section heading "Perché scegliere la nostra impresa")
- Cormorant Garamond Regular 22px (card titles)
- Manrope Regular 14px, line-height 1.5 (card body)

### Layout notes
- Section: padding 20px horizontal / 64px vertical; heading block gap 12px; 40px gap to card stack; cards stacked vertically gap 20px, each full-width, padding 24px, internal column gap 16px. Total 375x878.
- Card copy uses accented Italian: QUALITÀ, Perché.
