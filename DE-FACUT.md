# De făcut, scurt

Site-ul e live și legal curat. Au mai rămas patru lucruri.
Primele trei se fac în același loc: **variabile de mediu pe Vercel**.

---

## 1. Formularul să trimită email — Resend

**Făcut deja de mine:** cont Resend `impresaedilemda`, domeniul de trimitere
**`send.mdaimpresaedile.it`** adăugat, regiune Irlanda (eu-west-1), „Enable
Receiving" oprit. Subdomeniu, nu domeniul principal, ca la Expert Parket: așa
reputația de trimitere stă separat și nu atingem nimic pe `mdaimpresaedile.it`.

Pagina domeniului:
https://resend.com/domains/b3e7586f-9008-4aa3-a3e0-62369170f979

### a. DNS la Dynadot — **e nevoie, nu se poate ocoli**

Nameserverele domeniului sunt `ns1.dyna-ns.net` / `ns2.dyna-ns.net`, deci
zona DNS e la Dynadot. Resend doar *spune* ce înregistrări trebuie; nu le
poate scrie el. Nici Vercel nu le poate, pentru că nu el ține zona.

Domeniul principal **nu are MX**, deci nu se strică niciun email existent.

În Dynadot → Domains → `mdaimpresaedile.it` → DNS Settings, patru înregistrări:

| Tip | Host | Valoare |
|---|---|---|
| TXT | `resend._domainkey.send` | cheia DKIM, **copiaz-o cu butonul Copy din Resend** (221 caractere, nu o scrie de mână) |
| CNAME | `rsend.send` | `rsend-euw1.forge.rmta.net` |
| CNAME | `send.send` | `send.forge.rmta.net` |
| TXT | `_dmarc` | `v=DMARC1; p=none;` |

Apoi în Resend apeși **Verify DNS Records** și aștepți să scrie **Verified**.

### b. Cheia API

https://resend.com/api-keys → Create API Key → permisiune **Sending access**.

**Asta o faci tu, nu eu.** O cheie API pe care o văd eu ajunge în transcriptul
conversației. Copiaz-o direct din Resend în Vercel, să nu treacă prin mine.

### c. Vercel

Settings → Environment Variables:

```
RESEND_API_KEY = re_...
RICHIESTE_A    = impresaedilemda@gmail.com
RICHIESTE_DA   = Sito MDA Impresa Edile <sito@send.mdaimpresaedile.it>
```

Atenție la `RICHIESTE_DA`: **`@send.mdaimpresaedile.it`**, cu `send.`, pentru
că ăsta e domeniul verificat. Fără `send.` Resend refuză trimiterea.

Apoi Deployments → ultimul → **Redeploy**.

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
- Adresa sediului + CAP
- Numărul REA și registrul (ex. „Registro delle Imprese di Venezia")
- Capitalul social vărsat — **doar dacă e societate de capitaluri**
- Anul înființării
- Orașul real de operare (acum e Portogruaro, pus de noi ca aproximare)

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
