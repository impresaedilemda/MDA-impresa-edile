# Date de cerut de la client

Toate valorile de mai jos se schimbă **într-un singur fișier**: [`src/config/site.ts`](src/config/site.ts).
Fiecare e marcat acolo cu `// TODO CLIENTE`.

---

## Blocant, fără asta nu pot scrie SEO-ul

| # | Ce | Unde intră | De ce contează |
|---|---|---|---|
| 1 | **Orașul principal** | `city` | Intră în title, H1, description și în tot textul. Fără el site-ul nu se poziționează local |
| 2 | **Sigla provinciei** (ex. BS, MI, TO) | `province` | Meta geo, schema, texte |
| 3 | **Regiunea** | `region` | Schema |
| 4 | **Comunele deservite** (6 până la 10) | `areaServed` | Fiecare comună e o interogare separată pe Google. Aici se ia traficul |

---

## Necesare pentru lansare

| # | Ce | Unde intră |
|---|---|---|
| ~~5~~ | ~~Telefon~~ | **Gata**, `+39 389 999 7498` |
| 6 | Confirmare că numărul are **WhatsApp activ** | `whatsapp`. Dacă e alt număr pentru WhatsApp, se schimbă doar acolo |
| 7 | Email | `email` |
| 8 | Ragione sociale completă | `legalName` |
| 9 | Partita IVA | `vat` |
| 10 | Numărul REA | `rea` |
| 11 | Adresa sediului + CAP | `street`, `postalCode` |
| 12 | Coordonate GPS ale sediului | `geo` (se iau din Google Maps, click dreapta pe pin) |
| 13 | Anul înființării | `foundedYear` (se calculează automat "da oltre X anni") |
| 14 | Orarul de lucru | `hours.label` și `hours.schema` |
| 15 | Ani de garanție oferiți | `warrantyYears` |
| 16 | Domeniul definitiv | `url` în `site.ts` **și** `SITE_URL` în `astro.config.mjs` **și** ultima linie din `public/robots.txt` |

---

## Partea legală, ca să nu iei amendă

Un site de firmă în Italia trebuie să afișeze datele de identificare (art. 7 D.Lgs. 70/2003, iar pentru societăți și art. 2250 Cod Civil). Site-ul are deja structura completă, dar **valorile sunt încă provizorii**.

**Cel mai mare risc chiar acum:** partita IVA afișată în footer e `00000000000`, adică inventată. O partita IVA falsă publicată e mai gravă decât una lipsă, pentru că apare ca dată de identificare falsă. Nu se publică până nu vine cea reală.

Ce e deja pus la punct:
- Footer cu ragione sociale, sediu legal, P.IVA și REA
- Privacy policy și cookie policy, pagini separate
- Consimțământ GDPR bifabil în **ambele** formulare, cu link către informativă
- Fără cookie-uri de profilare, deci nu e nevoie de banner de consimțământ (cookie policy descrie corect situația)
- Fără iframe Google Maps, care ar trimite date la Google înainte de consimțământ

Ce lipsește: valorile reale (punctele 8 până la 12 de mai sus).

**Ai un ajutor automat:** în timp ce lucrezi cu `npm run dev`, în colțul din dreapta jos apare un panou roșu care listează exact ce mai e provizoriu. La `npm run build` același avertisment apare în terminal. Panoul nu ajunge niciodată pe site-ul publicat.

Recomandare: privacy și cookie policy să fie citite de contabilul sau consulentul clientului înainte de lansare. Sunt scrise corect, dar cine semnează pentru ele e firma.

---

## Conținut de cerut

| # | Ce | De ce |
|---|---|---|
| 17 | **6 până la 10 poze reale de șantier** | Secțiunea "Lavori realizzati" prezintă lucrări ca fiind ale firmei. Poze AI acolo înseamnă portofoliu fals, ceea ce în Italia e publicitate înșelătoare. Poze făcute cu telefonul sunt perfect suficiente și convertesc mai bine decât randări |
| 18 | **Recenzii reale** | La fel. Recenziile inventate încalcă regulile Google și pot atrage penalizare manuală. Ideal: link către profilul Google al firmei, de unde le luăm |
| 19 | Logo-ul în format vectorial (SVG sau AI), dacă îl are | Acum e reconstruit în SVG din poza trimisă. Merge foarte bine, dar originalul e mereu mai sigur |

După ce sosesc pozele reale și recenziile, se pun pe `false` cele două steaguri din [`src/config/content.ts`](src/config/content.ts):

```
export const portfolioIsPlaceholder = false
export const reviewsArePlaceholder = false
```

Al doilea activează și datele structurate `AggregateRating`, care afișează stelele în rezultatele Google.

---

## Servicii externe de configurat

| # | Ce | Cum |
|---|---|---|
| 20 | **Cheie formular** | Cont gratuit pe [web3forms.com](https://web3forms.com), se pune cheia în `formAccessKey`. Fără ea formularul afișează confirmarea dar emailul nu pleacă |
| 21 | ~~Cheie Gemini~~ | Nu mai e necesară: pozele vin din designul Figma |
| 22 | **Google Business Profile** | Cel mai important punct din toată lista pentru a aduce clienți. Vezi README, secțiunea Marketing |

---

## Verificare finală înainte de publicare

- [ ] Toate `TODO CLIENTE` din `site.ts` sunt înlocuite
- [ ] `npm run build` trece fără erori
- [ ] Pozele reale de șantier sunt puse și steagurile pe `false`
- [ ] Cheia Web3Forms e activă și un test de formular ajunge pe email
- [ ] Numărul de WhatsApp e testat cu un mesaj real
- [ ] Domeniul e actualizat în cele trei locuri (vezi punctul 16)
- [ ] Privacy și cookie policy citite de client, ideal validate de contabilul sau consulentul lui
- [ ] Profilul Google Business e revendicat și completat
