# De făcut, scurt

Site-ul e live și legal curat. Au mai rămas patru lucruri.
Primele trei se fac în același loc: **variabile de mediu pe Vercel**.

---

## 1. Formularul trimite email — **GATA, 10 septembrie**

Verificat cap la cap: cerere pe `/api/richiesta` → 200, iar in Resend emailul
apare **Delivered** catre `impresaedilemda@gmail.com`.

Ce e configurat:

- cont Resend `impresaedilemda`, domeniu **`send.mdaimpresaedile.it`**,
  regiune Irlanda (eu-west-1), status **Verified**, „Enable Receiving" oprit
- DNS la Dynadot: DKIM, doua CNAME pentru SPF, DMARC. Inregistrarea A si
  `www` (Vercel) neatinse
- Vercel: `RESEND_API_KEY` (Secret, Production), `RICHIESTE_A` si
  `RICHIESTE_DA` (Config, Production and Preview)

**De verificat cand se schimba ceva:** `RICHIESTE_DA` trebuie sa ramana pe
`@send.mdaimpresaedile.it`. Fara `send.` Resend refuza trimiterea.

## 2. Panoul de administrare (dacă vrei să-l pornești acum)

Acum `/admin/` e închis și scrie „Pannello non configurato". E intenționat:
fără bază de date s-ar fi intrat cu un buton, fără parolă.

Tot în **Settings → Environment Variables**, cele două chei din `.env` local:

```
PUBLIC_SUPABASE_URL       = https://nqaolmdwefolrguvsnzt.supabase.co
PUBLIC_SUPABASE_ANON_KEY  = (cea din .env)
```

Apoi Redeploy. **Atenție:** înainte trebuie rulat SQL-ul din
`supabase/aggiornamento-2026-09.sql` în proiectul Supabase al clientei, altfel
panoul se deschide dar tabelele lipsesc. Pașii sunt în
`docs/ATTIVAZIONE-PANNELLO.md`.

---

## 3. Google Analytics (când vrei)

Aceeași pagină de variabile:

```
PUBLIC_GA_ID = G-XXXXXXXXXX
```

Redeploy, și se aprind singure: bannerul de consimțământ, secțiunile despre GA
din cookie policy și privacy policy, butonul „Gestisci i cookie" din footer.
Nu trebuie atins niciun fișier.

---

## 4. Datele reale ale firmei (de cerut clientei)

Astea nu se pot inventa. Până vin, rândurile pur și simplu nu apar pe site și
în locul lor scrie „cereți-ne datele".

Ce ceri, dintr-o vizură camerală sau de pe o factură de-a lor:

- Partita IVA
- Ragione sociale exactă și forma juridică (S.r.l.? ditta individuale?)
- ~~Adresa sediului + CAP~~ primită 10 sep: Via Mantica Princivalle 32, 33170 Pordenone (de confirmat că e și sediul legal)
- Numărul REA și registrul (ex. „Registro delle Imprese di Venezia")
- Capitalul social vărsat — **doar dacă e societate de capitaluri**
- Anul înființării
- ~~Orașul real de operare~~ Pordenone, confirmat 10 sep

Se scriu în `src/config/site.ts`, sunt marcate acolo cu `TODO CLIENTE`, apoi
commit + push. Lista completă și de ce contează fiecare: `CLIENT-DATA.md` și
`docs/CONFORMITA-LEGALE.md`.

---

## Bonus, când ai timp

- Revendică profilul **Google Business** al firmei și cere recenzii reale.
  Secțiunea de recenzii reapare singură la prima recenzie adevărată pusă în
  panou.
- Pozele reale de șantier: primul șantier încărcat din panou face să dispară
  avertismentul „sunt ilustrații" de pe secțiunea lavori.
- Trimite `docs/CONFORMITA-LEGALE.md` clientei, pentru contabilul ei.

## Verificare în doi pași, Google Authenticator (TERMINAT 11 sep 2026)

LIVE. Pop-up la intrare cu QR + cheie, cod de 6 cifre la login și la resetarea
parolei, bloc Activează/Dezactivează în Impostazioni, Il tuo accesso.

- cod pushuit și publicat (commit `b27ab10`)
- `supabase/aggiornamento-2026-09-due-fattori.sql` RULAT pe proiectul clientei:
  `e_admin()` cere acum `aal2` dacă userul are un factor confirmat
- Supabase, Authentication, Multi-Factor: TOTP era deja pornit
- testat cu telefonul pe contul real, apoi factorul de test a fost șters din
  Authentication, Users, Danger zone, Remove MFA factors

**De reținut:** ștergerea din aplicația Google Authenticator NU scoate factorul
de pe server. Se scoate doar din Supabase, de la Remove MFA factors. Supabase nu
are coduri de rezervă: telefon pierdut = Artiom șterge factorul, clientul îl
leagă din nou.

## Google Analytics (TERMINAT 11 sep 2026)

Proprietate GA4 creată pe contul clientei (`impresaedilemda@gmail.com`):

- cont "MDA Impresa Edile", proprietate `mdaimpresaedile.it`, Italia, GMT+2, euro
- flux web `https://www.mdaimpresaedile.it`, ID de măsurare **G-LMK70C6FRW**
- pe Vercel: `PUBLIC_GA_ID` = `G-LMK70C6FRW`, tip Config, doar Production
  (traficul de preview nu trebuie să intre în statisticile clientei)
- partajarea datelor cu Google pentru produsele lor și pentru oferte: OPRITĂ
- Analytics se încarcă doar după acceptarea cookie-urilor în banner, cum cere
  legea italiană; paginile privacy și cookie se adaptează singure

Datele apar în 24 până la 48 de ore.

## Google Business Profile (BLOCAT, așteaptă răspunsul clientei)

Pe Maps există deja fișa **"MDA Impresa Edile - Riparazione tetti"**, verificată,
5,0 cu o recenzie, telefonul corect, dar:

- site-ul trecut pe ea e `riparazionetetti.com`, nu al nostru
- contul Google al clientei are **0 companii**, deci nu ea o controlează
- Google nu oferă fișa ca revendicabilă, semn că e revendicată de altcineva

De aflat de la clientă cu ce adresă a fost creată sau cine i-a făcut-o. Mesajul
e scris în `MESAJ-CLIENT.md`. A NU se crea o fișă nouă între timp: două fișe
pentru aceeași firmă își strică poziția una alteia.
