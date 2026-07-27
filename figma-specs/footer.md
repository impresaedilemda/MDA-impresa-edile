# Footer — node 4:372 (file za3YRMJqYkYXGVjYF2u3H4)

Frame size: 1440 x 546. Screenshot: `figma-specs/shots/footer.png` (1440x546 PNG).

## Reference code (verbatim from get_design_context — React+Tailwind, adapt to Astro)

```tsx
const imgHouse = "https://www.figma.com/api/mcp/asset/be093450-0829-475f-acef-cd1ed2e615ec";
const imgFacebook = "https://www.figma.com/api/mcp/asset/fb33116b-2fba-4570-b46b-eca1b9abb4ea";
const imgInstagram = "https://www.figma.com/api/mcp/asset/a003db33-d15b-49cb-8e4d-fa0ec3fde090";
const imgPhone = "https://www.figma.com/api/mcp/asset/0a440e3d-d4ec-40c9-8c35-eedecc158f5c";
const imgCircleX = "https://www.figma.com/api/mcp/asset/d96225de-158d-45b9-8078-2ec6b3c26640";
const imgMail = "https://www.figma.com/api/mcp/asset/4d5dc6c1-239b-419d-9af8-2b07b5b26445";
const imgLine = "https://www.figma.com/api/mcp/asset/15046653-025b-4f6e-aedb-bbad259cf775";

export default function Footer() {
  return (
    <div className="bg-[#151613] content-stretch flex flex-col gap-[80px] items-start pb-[40px] pt-[100px] px-[80px] relative size-full" data-node-id="4:372" data-name="footer">
      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="4:373" data-name="Frame">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[400px]" data-node-id="4:374" data-name="Frame">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="4:375" data-name="logo-container">
            <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[53px]" data-node-id="4:376" data-name="logo-icon-wrapper">
              <div className="h-[36px] relative shrink-0 w-[43px]" data-node-id="4:701" data-name="house">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHouse} />
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex gap-[8px] items-baseline leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="4:378" data-name="logo-text">
              <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[24px] text-white" data-node-id="4:379">
                MDA
              </p>
              <p className="font-['Manrope:Light'] font-light relative shrink-0 text-[#eae5da] text-[13px] uppercase" data-node-id="4:380">
                IMPRESA EDILE
              </p>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full opacity-80 relative shrink-0 text-[#eae5da] text-[14px] w-[min-content]" data-node-id="4:381">
            Dal 2008 specializzati esclusivamente nella progettazione, posa, manutenzione e rifacimento di coperture residenziali e industriali in Lombardia.
          </p>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="4:382" data-name="Frame">
            <div className="bg-[rgba(255,255,255,0.07)] content-stretch flex items-start p-[12px] relative rounded-[4px] shrink-0" data-node-id="4:383" data-name="Frame">
              <div className="relative shrink-0 size-[20px]" data-node-id="4:620" data-name="facebook">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFacebook} />
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.07)] content-stretch flex items-start p-[12px] relative rounded-[4px] shrink-0" data-node-id="4:385" data-name="Frame">
              <div className="relative shrink-0 size-[20px]" data-node-id="4:623" data-name="instagram">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgInstagram} />
              </div>
            </div>
          </div>
        </div>
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start leading-[normal] relative shrink-0 w-[240px] whitespace-nowrap" data-node-id="4:387" data-name="Frame">
          <p className="font-['Manrope:ExtraBold'] font-extrabold relative shrink-0 text-[12px] text-white uppercase" data-node-id="4:388">
            ZONA OPERATIVA
          </p>
          <div className="content-stretch flex flex-col font-['Manrope:Regular'] font-normal gap-[8px] items-start relative shrink-0 text-[#eae5da] text-[14px] w-full" data-node-id="4:389" data-name="Frame">
            <p className="relative shrink-0" data-node-id="4:390">
              Milano e provincia
            </p>
            <p className="relative shrink-0" data-node-id="4:391">
              Monza e Brianza
            </p>
            <p className="relative shrink-0" data-node-id="4:392">
              Varese
            </p>
            <p className="relative shrink-0" data-node-id="4:393">
              Como
            </p>
            <p className="relative shrink-0" data-node-id="4:394">
              Pavia
            </p>
            <p className="relative shrink-0" data-node-id="4:395">
              Novara
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[320px]" data-node-id="4:396" data-name="Frame">
          <p className="[word-break:break-word] font-['Manrope:ExtraBold'] font-extrabold leading-[normal] relative shrink-0 text-[12px] text-white uppercase whitespace-nowrap" data-node-id="4:397">
            CONTATTI DIRETTI
          </p>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:398" data-name="Frame">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="4:399" data-name="Frame">
              <div className="relative shrink-0 size-[18px]" data-node-id="4:626" data-name="phone">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
              </div>
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[15px] text-white whitespace-nowrap" data-node-id="4:401">
                +39 02 8410 9920
              </p>
            </div>
            <div className="bg-[rgba(37,211,102,0.13)] content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[4px] shrink-0" data-node-id="4:402" data-name="Frame">
              <div className="relative shrink-0 size-[18px]" data-node-id="4:710" data-name="circle-x">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleX} />
              </div>
              <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#25d366] text-[14px] whitespace-nowrap" data-node-id="4:404">
                Scrivici su WhatsApp
              </p>
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="4:405" data-name="Frame">
              <div className="relative shrink-0 size-[18px]" data-node-id="4:629" data-name="mail">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
              </div>
              <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[normal] relative shrink-0 text-[#eae5da] text-[15px] whitespace-nowrap" data-node-id="4:407">
                info@mdaimpresaedile.it
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-0 relative shrink-0 w-full" data-node-id="4:408" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine} />
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex font-['Manrope:Regular'] font-normal items-center justify-between leading-[normal] relative shrink-0 text-[#eae5da] w-full whitespace-nowrap" data-node-id="4:409" data-name="Frame">
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-node-id="4:410" data-name="Frame">
          <p className="opacity-50 relative shrink-0 text-[12px]" data-node-id="4:411">
            © 2025 MDA Impresa Edile di Donato Albanese. Tutti i diritti riservati.
          </p>
          <p className="opacity-40 relative shrink-0 text-[11px]" data-node-id="4:412">
            Sede Legale: Via della Moscova 12, 20121 Milano (MI) | P.IVA 08249510963
          </p>
        </div>
        <p className="opacity-50 relative shrink-0 text-[12px]" data-node-id="4:413">
          Privacy Policy · Cookie Policy
        </p>
      </div>
    </div>
  );
}
```

## Downloaded assets (all in `public/images/figma/`)

All 7 assets from download_assets accounted for (byte sizes match 1:1; rawImages was empty — footer has no raster images).

| File | Element (data-name / node id) | Asset URL suffix | viewBox | Colors inside SVG |
|---|---|---|---|---|
| `footer-house.svg` (1033 B) | logo `house`, node 4:701, rendered 43x36 in 53x53 wrapper | `be093450-0829-475f-acef-cd1ed2e615ec` | 0 0 43 36 | stroke white |
| `footer-facebook.svg` (575 B) | social icon `facebook`, node 4:620, 20x20 in 12px-padded chip | `fb33116b-2fba-4570-b46b-eca1b9abb4ea` | 0 0 20 20 | stroke white |
| `footer-instagram.svg` (1125 B) | social icon `instagram`, node 4:623, 20x20 in 12px-padded chip | `a003db33-d15b-49cb-8e4d-fa0ec3fde090` | 0 0 20 20 | stroke white, fill white (dot) |
| `footer-phone.svg` (1378 B) | `phone` icon next to phone number, node 4:626, 18x18 | `0a440e3d-d4ec-40c9-8c35-eedecc158f5c` | 0 0 18 18 | stroke #EAE5DA, fill white |
| `footer-circle-x.svg` (640 B) | `circle-x` icon inside WhatsApp chip, node 4:710, 18x18 | `d96225de-158d-45b9-8078-2ec6b3c26640` | 0 0 18 18 | stroke #25D366, fill white |
| `footer-mail.svg` (647 B) | `mail` icon next to email, node 4:629, 18x18 | `4d5dc6c1-239b-419d-9af8-2b07b5b26445` | 0 0 18 18 | stroke #EAE5DA |
| `footer-line.svg` (250 B) | divider `Line`, node 4:408, full-width 1280x1 | `15046653-025b-4f6e-aedb-bbad259cf775` | 0 0 1280 1 | stroke white at opacity 0.1 (baked into the SVG) |

Screenshot: `figma-specs/shots/footer.png`.

## Exact colors

- `#151613` — footer background
- `#FFFFFF` — "MDA" logotype, column headings (ZONA OPERATIVA, CONTATTI DIRETTI), phone number, house/facebook/instagram icon strokes
- `#EAE5DA` — cream body text: "IMPRESA EDILE", description (at opacity 0.8), zone list, email, bottom bar text (opacity 0.5 / 0.4 / 0.5), phone+mail icon strokes
- `rgba(255,255,255,0.07)` — social icon chip backgrounds, radius 4px
- `#25D366` — WhatsApp green (chip text + circle-x icon stroke)
- `rgba(37,211,102,0.13)` — WhatsApp chip background, radius 4px
- Divider: white @ 10% opacity, 1px (equivalent to `rgba(255,255,255,0.1)`)

## Fonts

All Manrope:

- Manrope ExtraBold (800): "MDA" 24px; column headings 12px uppercase
- Manrope Bold (700): phone number 15px; "Scrivici su WhatsApp" 14px
- Manrope Light (300): "IMPRESA EDILE" 13px uppercase
- Manrope Regular (400): description 14px leading 1.6; zone list 14px (8px gap); email 15px; copyright 12px; legal line 11px; Privacy/Cookie 12px

## Layout summary

- Root: 1440 wide, padding 100px top / 80px sides / 40px bottom, vertical gap 80px between top row, divider, bottom bar
- Top row: 3 columns justify-between, widths 400px / 240px / 320px
- Column 1: logo row (53px icon wrapper + 12px gap + baseline-aligned wordmark), 24px column gap, socials row gap 16px
- Column 3: contact rows gap 16px, icon-to-text gap 12px; WhatsApp chip padding 12px
- Bottom bar: space-between, left stack gap 4px
