# Figma spec: header (node 4:6)

File key: za3YRMJqYkYXGVjYF2u3H4
Frame size: 1440 x 90 px
Screenshot: figma-specs/shots/header.png

## Reference code (verbatim from get_design_context — React+Tailwind, adapt to Astro)

```jsx
const imgHouse = "https://www.figma.com/api/mcp/asset/e721d2cc-d514-4579-8b8a-7c56664e5e35";
const imgPhoneCall = "https://www.figma.com/api/mcp/asset/50252f4f-6b2d-4859-b090-f0246bc44065";

export default function Header() {
  return (
    <div className="bg-[#f7f4eb] border-[rgba(21,22,19,0.08)] border-b border-solid content-stretch flex items-center justify-between px-[80px] py-[20px] relative size-full" data-node-id="4:6" data-name="header">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="4:7" data-name="logo-container">
        <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[44px]" data-node-id="4:8" data-name="logo-icon-wrapper">
          <div className="h-[30px] relative shrink-0 w-[36px]" data-node-id="4:698" data-name="house">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHouse} />
          </div>
        </div>
        <div className="[word-break:break-word] content-stretch flex gap-[8px] items-baseline leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="4:10" data-name="logo-text">
          <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[#151613] text-[20px]" data-node-id="4:11">
            MDA
          </p>
          <p className="font-['Manrope:Light'] font-light relative shrink-0 text-[#8e7e6a] text-[11px] uppercase" data-node-id="4:12">
            IMPRESA EDILE
          </p>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex font-['Manrope:SemiBold'] font-semibold gap-[40px] items-center leading-[normal] relative shrink-0 text-[#151613] text-[14px] whitespace-nowrap" data-node-id="4:13" data-name="nav-links">
        <p className="relative shrink-0" data-node-id="4:14">
          I Nostri Servizi
        </p>
        <p className="relative shrink-0" data-node-id="4:15">
          Detrazioni
        </p>
        <p className="relative shrink-0" data-node-id="4:16">
          Come Lavoriamo
        </p>
        <p className="relative shrink-0" data-node-id="4:17">
          Portfolio
        </p>
        <p className="relative shrink-0" data-node-id="4:18">
          FAQ
        </p>
      </div>
      <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-node-id="4:19" data-name="header-cta">
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="4:20" data-name="Frame">
          <div className="relative shrink-0 size-[16px]" data-node-id="4:536" data-name="phone-call">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhoneCall} />
          </div>
          <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#151613] text-[15px] whitespace-nowrap" data-node-id="4:22">
            +39 02 8410 9920
          </p>
        </div>
        <div className="bg-[#151613] content-stretch flex items-start px-[20px] py-[12px] relative rounded-[4px] shrink-0" data-node-id="4:23" data-name="Frame">
          <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[13px] text-white uppercase whitespace-nowrap" data-node-id="4:24">
            Preventivo Gratuito
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Downloaded assets

download_assets returned no rawImages; both assets are SVGs. The two svgAssets are byte-identical to the two asset URLs referenced in the code (verified with cmp).

| File | Element (node) | Asset URL suffix in code | Details |
|---|---|---|---|
| public/images/figma/header-house.svg | logo house icon, node 4:698 "house" (inside logo-icon-wrapper 4:8) | e721d2cc-d514-4579-8b8a-7c56664e5e35 | 36x30 viewBox, stroke #151613, fill none |
| public/images/figma/header-phone-call.svg | phone icon, node 4:536 "phone-call" (in header-cta) | 50252f4f-6b2d-4859-b090-f0246bc44065 | 16x16 viewBox, stroke #8E7E6A, fill none (one white fill in clip) |

## Colors

| Hex / value | Usage |
|---|---|
| #F7F4EB | header background |
| rgba(21,22,19,0.08) | 1px bottom border |
| #151613 | primary dark: "MDA" logo text, nav links, phone number, CTA button background, house icon stroke |
| #8E7E6A | muted brown: "IMPRESA EDILE" logo subtitle, phone icon stroke |
| #FFFFFF | CTA button text |

## Typography (all Manrope)

| Element | Weight | Size | Transform |
|---|---|---|---|
| "MDA" | ExtraBold (800) | 20px | none |
| "IMPRESA EDILE" | Light (300) | 11px | uppercase |
| Nav links | SemiBold (600) | 14px | none |
| Phone number "+39 02 8410 9920" | Bold (700) | 15px | none |
| CTA "Preventivo Gratuito" | Bold (700) | 13px | uppercase, white |

All text uses leading-[normal].

## Layout metrics

- Frame 1440 x 90; padding 20px vertical, 80px horizontal; flex row, items-center, justify-between
- Logo container: gap 12px; icon wrapper 44x44 (house SVG 36x30 centered inside); logo text row gap 8px, items-baseline
- Nav: gap 40px between links
- Header CTA group: gap 24px; phone group gap 8px (icon 16x16)
- CTA button: padding 12px vertical, 20px horizontal, border-radius 4px, bg #151613

## Implementer notes

- FLAG (tax content to strip): nav link "Detrazioni" (node 4:15) refers to tax deductions. Per project direction, strip or replace it and renumber nav accordingly. No other tax/50% mentions in this section.
- The remote asset URLs in the reference code expire in ~7 days; use the committed local files in public/images/figma/ instead.
