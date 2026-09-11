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

## Verificare în doi pași, Google Authenticator (11 sep 2026, LOCAL, nepushuit)

Codul e gata local: pop-up la intrare cu QR + cheie, codul de 6 cifre cerut la
login și la resetarea parolei, bloc Activează/Dezactivează în Impostazioni,
Il tuo accesso. Ca să fie pornit pe live:

- push + deploy (după ce cealaltă sesiune termină frâna de parole din `accesso.ts`)
- SQL Editor, pe proiectul Supabase al clientului:
  `supabase/aggiornamento-2026-09-due-fattori.sql` (fără el, codul se cere în
  pagină dar baza de date nu-l impune)
- Supabase, Authentication, Multi-Factor: TOTP pornit (e implicit)
- test cu contul meu `ark4su@gmail.com` (are rând în `admin_email`): intru,
  scanez, ies, reintru cu cod
- telefon pierdut: Authentication, Users, utilizatorul, Multi-factor
  authentication, șterge factorul; Supabase nu are coduri de rezervă
