# Reviews section — Figma node 4:300 ("reviews")

File key: za3YRMJqYkYXGVjYF2u3H4
Screenshot: figma-specs/shots/reviews.png (1440x699, natural size of the frame)

## Reference code (verbatim from get_design_context, React+Tailwind — adapt to Astro)

```tsx
const imgRectangle = "https://www.figma.com/api/mcp/asset/83eb8f2b-535c-4301-9eee-4814766d373c";
const imgRectangle1 = "https://www.figma.com/api/mcp/asset/d112c512-1e65-4535-b147-91859438d289";
const imgRectangle2 = "https://www.figma.com/api/mcp/asset/59083f15-9930-4e65-8516-258a25bc9f22";
const imgStar = "https://www.figma.com/api/mcp/asset/68c61ec8-1e7a-4851-afeb-d5977c11b8e8";

export default function Reviews() {
  return (
    <div className="bg-[#f7f4eb] content-stretch flex flex-col gap-[80px] items-start px-[80px] py-[120px] relative size-full" data-node-id="4:300" data-name="reviews">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[800px] whitespace-nowrap" data-node-id="4:301" data-name="Frame">
        <p className="font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#8e7e6a] text-[13px] uppercase" data-node-id="4:302">
          La Parola ai Nostri Clienti
        </p>
        <p className="font-['Cormorant_Garamond:Light'] font-light leading-[1.1] relative shrink-0 text-[#151613] text-[52px]" data-node-id="4:303">
          Cosa dicono di noi i proprietari di casa
        </p>
      </div>
      <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-node-id="4:304" data-name="Frame">
        <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-w-px p-[40px] relative rounded-[8px] self-stretch" data-node-id="4:305" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:306" data-name="Frame">
            <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-node-id="4:307" data-name="stars">
              <div className="relative shrink-0 size-[16px]" data-node-id="4:644" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:647" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:650" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:653" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:656" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:313">{`"Squadra eccezionale, pulitissimi. Hanno rifatto il tetto della mia villa in 9 giorni esatti. Prezzo finale identico al centesimo al preventivo stipulato."`}</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center pt-[24px] relative shrink-0" data-node-id="4:314" data-name="Frame">
            <div className="relative rounded-[28px] shrink-0 size-[56px]" data-node-id="4:315" data-name="Rectangle">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" src={imgRectangle} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="4:316" data-name="Frame">
              <p className="font-['Manrope:Bold'] font-bold relative shrink-0 text-[#151613] text-[15px]" data-node-id="4:317">
                Giovanni S.
              </p>
              <p className="font-['Manrope:Regular'] font-normal relative shrink-0 text-[#8e7e6a] text-[12px]" data-node-id="4:318">
                Magenta (MI)
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-w-px p-[40px] relative rounded-[8px] self-stretch" data-node-id="4:319" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:320" data-name="Frame">
            <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-node-id="4:321" data-name="stars">
              <div className="relative shrink-0 size-[16px]" data-node-id="4:659" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:662" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:665" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:668" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:671" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:327">{`"Avevo continue perdite dal tetto del garage. Dopo l'impermeabilizzazione di MDA con doppia guaina il problema è risolto definitivamente. Consigliatissimi."`}</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center pt-[24px] relative shrink-0" data-node-id="4:328" data-name="Frame">
            <div className="relative rounded-[28px] shrink-0 size-[56px]" data-node-id="4:329" data-name="Rectangle">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" src={imgRectangle1} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="4:330" data-name="Frame">
              <p className="font-['Manrope:Bold'] font-bold relative shrink-0 text-[#151613] text-[15px]" data-node-id="4:331">
                Maria Teresa B.
              </p>
              <p className="font-['Manrope:Regular'] font-normal relative shrink-0 text-[#8e7e6a] text-[12px]" data-node-id="4:332">
                Legnano (MI)
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[rgba(21,22,19,0.08)] border-solid content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-w-px p-[40px] relative rounded-[8px] self-stretch" data-node-id="4:333" data-name="Frame">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="4:334" data-name="Frame">
            <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-node-id="4:335" data-name="stars">
              <div className="relative shrink-0 size-[16px]" data-node-id="4:674" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:677" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:680" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:683" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
              <div className="relative shrink-0 size-[16px]" data-node-id="4:686" data-name="star">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStar} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Manrope:Regular'] font-normal leading-[1.6] min-w-full relative shrink-0 text-[#151613] text-[15px] w-[min-content]" data-node-id="4:341">{`"La squadra interna è di una cortesia d'altri tempi. Cantiere pulito ogni sera prima di andarsene. Ottimo supporto anche per le pratiche di detrazione fiscale."`}</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center pt-[24px] relative shrink-0" data-node-id="4:342" data-name="Frame">
            <div className="relative rounded-[28px] shrink-0 size-[56px]" data-node-id="4:343" data-name="Rectangle">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" src={imgRectangle2} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-node-id="4:344" data-name="Frame">
              <p className="font-['Manrope:Bold'] font-bold relative shrink-0 text-[#151613] text-[15px]" data-node-id="4:345">
                Stefano R.
              </p>
              <p className="font-['Manrope:Regular'] font-normal relative shrink-0 text-[#8e7e6a] text-[12px]" data-node-id="4:346">
                Melzo (MI)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Downloaded assets (public/images/figma/) — mapped by checksum to code constants

| File | Belongs to | Code constant | Details |
|---|---|---|---|
| reviews-2.png | Card 1 avatar, Giovanni S. (node 4:315) | `imgRectangle` (asset 83eb8f2b-...) | 1024x1024 PNG, man in navy suit. Render at 56x56, border-radius 28px (full circle), object-cover |
| reviews-1.png | Card 2 avatar, Maria Teresa B. (node 4:329) | `imgRectangle1` (asset d112c512-...) | 1024x1024 PNG, older woman in white blouse. 56x56 circle, object-cover |
| reviews-5.png | Card 3 avatar, Stefano R. (node 4:343) | `imgRectangle2` (asset 59083f15-...) | 1024x1024 PNG, younger man in dark shirt. 56x56 circle, object-cover |
| reviews-star.svg | Star icon, all 15 star nodes (4:644-4:686) | `imgStar` (asset 68c61ec8-...) | 16x16 OUTLINE star, no fill, stroke #8E7E6A, stroke-width 2, round linecap. Same asset repeated 5x per card, gap 3px |
| reviews-3.png | UNUSED alternate (raw fill found in subtree, not referenced in code) | none | 512x512 RGBA, craftsman in apron |
| reviews-4.png | UNUSED alternate (raw fill found in subtree, not referenced in code) | none | 512x512 RGBA, gray-haired man in navy blazer |
| reviews-6.png | UNUSED alternate (raw fill found in subtree, not referenced in code) | none | 512x512 RGBA, older woman with pearl necklace outdoors |

reviews-3/4/6 are extra source images Figma reported in the node subtree; the rendered design uses only reviews-1, reviews-2, reviews-5. Keep or delete at implementer's discretion.

## Colors (exact hex)

| Color | Usage |
|---|---|
| #F7F4EB | Section background (cream) |
| #FFFFFF | Card background |
| rgba(21,22,19,0.08) | Card border, 1px solid |
| #151613 | Heading, review body text, reviewer name (near-black) |
| #8E7E6A | Eyebrow text, location text, star icon stroke (warm taupe) |

## Typography

| Element | Font | Weight | Size | Line-height | Extra |
|---|---|---|---|---|---|
| Eyebrow "La Parola ai Nostri Clienti" | Manrope | Bold (700) | 13px | normal | uppercase, color #8E7E6A |
| Heading "Cosa dicono di noi i proprietari di casa" | Cormorant Garamond | Light (300) | 52px | 1.1 | color #151613 |
| Review body | Manrope | Regular (400) | 15px | 1.6 | color #151613, wrapped in straight double quotes |
| Reviewer name | Manrope | Bold (700) | 15px | normal | color #151613 |
| Location | Manrope | Regular (400) | 12px | normal | color #8E7E6A |

## Layout metrics

- Section: padding 120px top/bottom, 80px left/right; column flex, gap 80px between header block and cards row; frame natural size 1440x699
- Header block: width 800px, column gap 16px
- Cards row: 3 equal-width cards (flex 1 0 0), gap 32px, cards stretch to equal height (self-stretch, justify-between inside)
- Card: white bg, 40px padding all sides, border-radius 8px, 1px border rgba(21,22,19,0.08); content column justify-between so author row sits at the bottom
- Stars row: five 16x16 icons, 3px gap, 16px gap below to review text
- Author row: padding-top 24px, 16px gap between 56px circular avatar and name/location column (2px gap)

## CONTENT FLAG for implementer

Card 3 (Stefano R., node 4:341) review text ends with "Ottimo supporto anche per le pratiche di detrazione fiscale." — this references tax deductions (detrazioni) and must be STRIPPED/REWRITTEN per project rule removing tax/bonus claims. Suggest ending the review after "Cantiere pulito ogni sera prima di andarsene." or replacing the last sentence with a neutral compliment (e.g. about punctuality or communication). No other card mentions tax/50%/bonus.
