# De făcut, scurt

Site-ul e live și legal curat. Au mai rămas patru lucruri.
Primele trei se fac în același loc: **variabile de mediu pe Vercel**.

---

## 1. Formularul să trimită email — Resend (cel mai important)

Acum formularul e cinstit — arată eroare și trimite omul la telefon — dar tot
nu ajunge niciun lead pe email.

**a. Verifică domeniul în Resend.** https://resend.com/domains → Add Domain →
`mdaimpresaedile.it`. Îți dă 3 înregistrări DNS (MX, TXT/SPF, TXT/DKIM) pe care
le pui la **Dynadot**, unde e domeniul. Fără domeniu verificat, Resend livrează
doar către adresa contului tău, nu către clientă.

**b. Cheia.** https://resend.com/api-keys → Create API Key, permisiune
**Sending access**.

**c. Vercel** → proiectul `mda-impresa-edile` → Settings → Environment
Variables, trei variabile (fără prefix `PUBLIC_`, rămân pe server):

```
RESEND_API_KEY = re_...
RICHIESTE_A    = impresaedilemda@gmail.com
RICHIESTE_DA   = Sito MDA Impresa Edile <sito@mdaimpresaedile.it>
```

`RICHIESTE_DA` trebuie să fie pe domeniul verificat la punctul a.
La `RICHIESTE_A` poți pune mai multe adrese, separate prin virgulă.

**d.** Deployments → ultimul → Redeploy.

Apoi testezi formularul de pe telefon. Emailul ajunge la clientă, iar butonul
„Răspunde" din Gmail duce direct la client, nu la noi.

---

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
