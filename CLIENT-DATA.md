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

Detaliile complete, în italiană, ca să le poți trimite clientului sau
contabilului lui: [`docs/CONFORMITA-LEGALE.md`](docs/CONFORMITA-LEGALE.md).

Un site de firmă în Italia trebuie să afișeze datele de identificare (art. 7
D.Lgs. 70/2003, iar pentru societăți și art. 2250 Cod Civil). Structura e
completă, **valorile sunt încă provizorii**.

**Cel mai mare risc chiar acum:** partita IVA din config e `IT00000000000`, adică
inventată. Codul o ascunde peste tot, deci pe build-ul nou nu se publică. Dar
versiunea de pe domeniul live e mai veche și o **afișează**: `P.IVA e C.F.
00000000000 | REA BS-000000`. Se rezolvă cu un deploy al versiunii curente.

Ce e gata în cod:

- Cinci pagini legale: `/privacy/`, `/cookie/`, `/termini/`, `/recesso/`,
  `/crediti/`, toate legate din footer și între ele
- Datele societare apar doar dacă sunt reale; ce lipsește pur și simplu nu se
  afișează, iar în locul lor apare o notă onestă cu „cereți-ne datele"
- Consimțământ GDPR bifabil în **ambele** formulare, cu link spre informativă
- Banner de cookie-uri **scris și testat**, dar care apare doar dacă e setat
  `PUBLIC_GA_ID`. Fără Google Analytics nu se instalează nimic care să ceară
  consimțământ, iar un banner atunci ar fi o declarație falsă
- Recenziile inventate: **șterse**. Secțiunea nu se mai desenează deloc până nu
  există recenzii reale în panou
- Portofoliul: pozele rămân, dar secțiunea nu le mai prezintă ca șantiere
  executate. Localitățile inventate au dispărut, etichetele spun „tipic", iar
  deasupra pozelor e un avertisment vizibil
- „Dal 2009" și „da N anni" nu mai apar nicăieri până nu confirmă clientul anul

### Cum se pornește Google Analytics

O singură variabilă pe Vercel:

```
PUBLIC_GA_ID=G-XXXXXXXXXX
```

Restul se aprinde singur: bannerul, secțiunile despre GA din cookie policy și
privacy policy, butonul „Gestisci i cookie" din footer. GA nu se încarcă înainte
de accept, Consent Mode v2 pleacă de la `denied`, iar refuzul ține șase luni.
CSP-ul din `vercel.json` are deja domeniile Google trecute.

Recomandare: privacy, cookie, termeni și recesso să fie citite de contabilul sau
consulentul clientului înainte de lansare. Sunt scrise corect, dar cine semnează
pentru ele e firma.

## Conținut de cerut

| # | Ce | De ce |
|---|---|---|
| 17 | **6 până la 10 poze reale de șantier** | Secțiunea "Lavori realizzati" prezintă lucrări ca fiind ale firmei. Poze AI acolo înseamnă portofoliu fals, ceea ce în Italia e publicitate înșelătoare. Poze făcute cu telefonul sunt perfect suficiente și convertesc mai bine decât randări |
| 18 | **Recenzii reale** | La fel. Recenziile inventate încalcă regulile Google și pot atrage penalizare manuală. Ideal: link către profilul Google al firmei, de unde le luăm |
| 19 | Logo-ul în format vectorial (SVG sau AI), dacă îl are | Acum e reconstruit în SVG din poza trimisă. Merge foarte bine, dar originalul e mereu mai sigur |

Pozele reale și recenziile reale se încarcă din panou, nu din cod. După ce
clientul pune primul șantier real, avertismentul și etichetele „tipic" dispar
singure; după prima recenzie reală, secțiunea de recenzii reapare singură.

`reviews` din [`src/config/content.ts`](src/config/content.ts) rămâne **gol
intenționat**. Nu se pun recenzii scrise de noi: e practică comercială
înșelătoare în sine (anexa I din Codul consumului, după D.Lgs. 26/2023), cu
amendă AGCM de la 5.000 €.

---

## Servicii externe de configurat

| # | Ce | Cum |
|---|---|---|
| 20 | **Resend** | Cont pe [resend.com](https://resend.com), domeniu verificat, apoi `RESEND_API_KEY`, `RICHIESTE_A` și `RICHIESTE_DA` ca variabile pe Vercel. Fără ele formularul arată o eroare onestă și niciun email nu pleacă |
| 21 | ~~Cheie Gemini~~ | Nu mai e necesară: pozele vin din designul Figma |
| 22 | **Google Business Profile** | Cel mai important punct din toată lista pentru a aduce clienți. Vezi README, secțiunea Marketing |

---

## Verificare finală înainte de publicare

- [ ] Toate `TODO CLIENTE` din `site.ts` sunt înlocuite
- [ ] `npm run build` trece fără erori
- [ ] Pozele reale de șantier sunt puse și steagurile pe `false`
- [ ] Resend e configurat și un test de formular ajunge pe email
- [ ] Numărul de WhatsApp e testat cu un mesaj real
- [ ] Domeniul e actualizat în cele trei locuri (vezi punctul 16)
- [ ] Privacy și cookie policy citite de client, ideal validate de contabilul sau consulentul lui
- [ ] Profilul Google Business e revendicat și completat
