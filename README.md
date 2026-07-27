# MDA Impresa Edile

Landing page pe o singură pagină pentru o firmă de acoperișuri din Italia.
Astro static, Tailwind v4, zero framework JS.

```bash
npm install
npm run dev      # http://localhost:4331
npm run build    # generează dist/
```

---

## Unde se schimbă ce

| Vrei să schimbi | Fișier |
|---|---|
| Telefon, adresă, oraș, P.IVA, orar, garanție | `src/config/site.ts` |
| Texte servicii, FAQ, recenzii, pași chestionar | `src/config/content.ts` |
| Culori, fonturi, spațiere | `src/styles/global.css`, blocul `@theme` |
| Ordinea secțiunilor | `src/pages/index.astro` |
| Iconițe SVG din design | `public/images/figma/` + `src/components/Icona.astro` |

Datele clientului nu sunt împrăștiate prin componente. Tot ce e specific firmei stă în `site.ts`.

---

## Imagini

Fotografiile vin din designul Figma (generate acolo cu AI-ul Figma) si sunt convertite in WebP optimizat. Sursele si specificatiile complete ale designului sunt salvate in `figma-specs/` (cod de referinta per sectiune + screenshot-uri), iar iconitele SVG extrase din Figma stau in `public/images/figma/` si se incorporeaza prin componenta `src/components/Icona.astro` cu `currentColor`.

Pozele din portofoliu si avatarele recenziilor sunt marcate ca placeholder (vezi cele doua steaguri din `content.ts`) si trebuie inlocuite cu material real de la client inainte de lansare.


## Ce e construit pentru SEO

- Title și H1 conțin orașul, luat automat din `site.ts`
- Schema JSON-LD: `RoofingContractor` plus `GeneralContractor`, cu adresă, coordonate, `areaServed` pe fiecare comună, orar, catalog de servicii
- `FAQPage` din cele 8 întrebări. Asta te bagă în AI Overviews și în răspunsurile ChatGPT sau Perplexity, unde concurența locală lipsește complet
- Sitemap generat la build, `robots.txt` care lasă explicit să treacă GPTBot, PerplexityBot, ClaudeBot
- Fonturi self-hosted și subsetate, zero request către Google Fonts
- Imagini WebP cu `width` și `height` explicite, `fetchpriority=high` doar pe hero
- Fără iframe Google Maps: nicio cerere către Google înainte de consimțământ, și nimic care să încarce pagina
- `AggregateRating` se activează singur când pui `reviewsArePlaceholder = false`

`aggregateRating` este intenționat dezactivat cât timp recenziile sunt placeholder. Datele structurate cu recenzii inventate atrag penalizare manuală de la Google.

---

## Ce trebuie făcut ca site-ul să aducă efectiv clienți

Site-ul e unealta, nu strategia. În ordinea impactului real:

1. **Google Business Profile.** Pentru „impresa edile" local, profilul aduce mai multe telefoane decât site-ul. De revendicat, completat cu toate serviciile, poze reale, orar, zonă. Fiecare lucrare terminată înseamnă o cerere de recenzie către client.
2. **Recenzii.** Zece recenzii reale bat orice optimizare on-page. Cel mai simplu sistem: un QR pe factură care duce direct la formularul de recenzie Google.
3. **Chestionarul ca landing de Google Ads.** Pagina e deja construită pentru asta. O campanie pe „rifacimento tetto [oraș]" trimisă direct la `#preventivo` convertește mult mai bine decât una trimisă pe homepage.
4. **Portofoliul prima/dopo pe social.** Perechile de poze prima e dopo sunt formatul care performează cel mai bine pe Facebook și Instagram pentru meserii. Fiecare cantier terminat e o postare.
5. **Pagini per comună**, faza 2. Când pagina unică e stabilă, câte o pagină pentru fiecare comună din `areaServed` multiplică traficul local. Structura de conținut există deja, se reutilizează.

---

## Tracking

Evenimentele sunt deja emise în `window.dataLayer`, deci merg direct cu Google Tag Manager sau GA4, fără modificări în cod:

| Eveniment | Când |
|---|---|
| `preventivo_passo` | La fiecare pas din chestionar, cu numărul pasului. Arată exact unde pierzi oamenii |
| `preventivo_inviato` | La trimitere, cu tipul intervenției, suprafața și urgența |
| `contatto_diretto` | Click pe telefon sau WhatsApp din bara mobilă, cu canalul |

Deocamdată nu e instalat niciun script de analytics, deci site-ul nu pune cookie-uri și nu are nevoie de banner de consimțământ. Cookie policy descrie corect situația asta. Dacă se adaugă GA4 sau Meta Pixel, trebuie adăugat și un banner, iar `src/pages/cookie.astro` actualizat.

---

## Documente

- [`CLIENT-DATA.md`](CLIENT-DATA.md) — lista completă de date de cerut clientului, cu checklist de lansare
