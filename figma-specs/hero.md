# Figma spec: hero (node 4:25)

File key: `za3YRMJqYkYXGVjYF2u3H4`
Frame size: 1440 x 780 px (screenshot: `figma-specs/shots/hero.png`)

## Reference code (verbatim from get_design_context — React+Tailwind, adapt to Astro)

```tsx
const imgHero = "https://www.figma.com/api/mcp/asset/bc1a474a-07f8-4869-8708-a871e978b3f2";
const imgPhoneCall = "https://www.figma.com/api/mcp/asset/b3f738f2-09fc-452d-bf86-f90557118068";

export default function Hero() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between p-[80px] relative size-full" data-node-id="4:25" data-name="hero">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgHero} />
        <div className="absolute bg-[rgba(21,22,19,0.45)] inset-0" />
      </div>
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="4:26" data-name="hero-top-info">
        <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.11)] border border-[rgba(255,255,255,0.25)] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[100px] shrink-0" data-node-id="4:27" data-name="Frame">
          <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[12px] text-white uppercase whitespace-nowrap" data-node-id="4:28">
            Specialisti in Coperture · Da 17 Anni
          </p>
        </div>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="4:29" data-name="Frame">
          <div className="relative shrink-0 size-[18px]" data-node-id="4:539" data-name="phone-call">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhoneCall} />
          </div>
          <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[0] relative shrink-0 text-[18px] text-white whitespace-nowrap" data-node-id="4:31">
            <span className="leading-[normal]">{`Sopralluogo Diretto: `}</span>
            <span className="font-['Manrope:ExtraBold'] font-extrabold leading-[normal]">+39 02 8410 9920</span>
          </p>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[920px]" data-node-id="4:32" data-name="hero-headings">
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[0] min-w-full relative shrink-0 text-[80px] text-white w-[min-content]" data-node-id="4:33">
          <span className="leading-[1.05]">{`L'arte delle coperture italiane, `}</span>
          <span className="font-['Cormorant_Garamond:Italic'] font-normal italic leading-[1.05] text-[#eae5da]">{`eseguita a regola d'arte.`}</span>
        </p>
        <p className="font-['Manrope:Regular'] font-normal leading-[1.6] relative shrink-0 text-[#f7f4eb] text-[20px] w-[720px]" data-node-id="4:34">
          Dal 2008 costruiamo e restauriamo tetti con squadra interna specializzata. Nessun subappalto, preventivi bloccati e 10 anni di garanzia scritta.
        </p>
      </div>
      <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="4:35" data-name="hero-actions">
        <div className="bg-white content-stretch drop-shadow-[0px_4px_8px_rgba(0,0,0,0.2)] flex items-start px-[36px] py-[20px] relative rounded-[4px] shrink-0" data-node-id="4:36" data-name="Frame">
          <p className="[word-break:break-word] font-['Manrope:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[#151613] text-[15px] uppercase whitespace-nowrap" data-node-id="4:37">
            Richiedi Sopralluogo Gratuito
          </p>
        </div>
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="4:38" data-name="Frame">
          <div className="bg-[#22c55e] relative rounded-[6px] shrink-0 size-[12px]" data-node-id="4:39" data-name="Frame" />
          <p className="[word-break:break-word] font-['Manrope:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="4:40">
            Squadra disponibile questa settimana a Milano e provincia
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Downloaded assets

All paths relative to project root `/Users/artiom/LUCRU/Claude Code/mda-impresa-edile/`.

| File | Element | Notes |
|---|---|---|
| `public/images/figma/hero-1.png` | `imgHero` background photo of the whole hero frame (code URL suffix `bc1a474a-07f8-4869-8708-a871e978b3f2`) | Raw source fill, 1344x768 PNG (RGB), terracotta roof + brick chimney at golden hour. USE THIS ONE for the background. |
| `public/images/figma/hero-2.png` | Same roof photo, second image fill found in the subtree | 512x292 PNG (RGBA), lower-res duplicate of hero-1. Redundant, ignore or delete. |
| `public/images/figma/hero-phone-call.svg` | Phone icon, node 4:539 `phone-call` (code URL suffix `b3f738f2-09fc-452d-bf86-f90557118068`) | 18x18 viewBox, stroke `white`, stroke-width 2, round linecap (Lucide-style `phone-call` glyph). |
| `figma-specs/shots/hero.png` | Full-frame reference screenshot | 1440x780, includes the dark overlay. |

## Colors (exact)

| Hex / rgba | Usage |
|---|---|
| `rgba(21,22,19,0.45)` | Full-bleed dark overlay on the background photo (base color `#151613` at 45%) |
| `#FFFFFF` | Badge text, phone text, headline (regular span), availability text, CTA button background, phone icon stroke |
| `rgba(255,255,255,0.11)` | Badge pill background (with `backdrop-blur: 4px`) |
| `rgba(255,255,255,0.25)` | Badge pill 1px border |
| `#EAE5DA` | Italic span of the headline ("eseguita a regola d'arte.") |
| `#F7F4EB` | Subheading paragraph |
| `#151613` | CTA button text |
| `#22C55E` | Availability dot (12x12, border-radius 6px = circle) |
| `rgba(0,0,0,0.2)` | CTA drop shadow: `0px 4px 8px` |

## Typography (exact)

| Element | Font | Weight | Size | Line height | Case |
|---|---|---|---|---|---|
| Badge "Specialisti in Coperture · Da 17 Anni" | Manrope | Bold (700) | 12px | normal | UPPERCASE |
| Phone label "Sopralluogo Diretto: " | Manrope | Bold (700) | 18px | normal | none |
| Phone number "+39 02 8410 9920" | Manrope | ExtraBold (800) | 18px | normal | none |
| Headline "L'arte delle coperture italiane," | Cormorant Garamond | Light (300) | 80px | 1.05 | none |
| Headline italic span "eseguita a regola d'arte." | Cormorant Garamond | Italic (400 italic) | 80px | 1.05 | none |
| Subheading | Manrope | Regular (400) | 20px | 1.6 | none |
| CTA "Richiedi Sopralluogo Gratuito" | Manrope | ExtraBold (800) | 15px | normal | UPPERCASE |
| Availability line | Manrope | SemiBold (600) | 14px | normal | none |

## Layout facts

- Frame 1440x780, padding 80px on all sides, flex column, `justify-between` (3 rows: top-info / headings / actions).
- Top-info row: full width, `justify-between` (badge left, phone right). Badge pill: padding 16px/8px, radius 100px. Phone group gap 8px, icon 18x18.
- Headings block: width 920px, column gap 24px. Subheading constrained to 720px.
- Actions row: gap 24px. CTA: padding 36px/20px, radius 4px. Availability group gap 12px, dot 12x12.
