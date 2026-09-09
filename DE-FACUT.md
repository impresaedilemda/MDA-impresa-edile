# De făcut, scurt

Site-ul e live și legal curat. Au mai rămas patru lucruri, toate scurte.
Primele trei se fac în același loc: **variabile de mediu pe Vercel**.

---

## 1. Formularul să trimită email (5 minute, cel mai important)

Acum formularul e cinstit — arată eroare și trimite omul la telefon — dar tot
nu ajunge niciun lead pe email.

**a.** Intri pe https://web3forms.com, pui email-ul clientului
(`impresaedilemda@gmail.com`), apeși „Create Access Key". Cheia vine pe email,
arată așa: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`. Cont nu trebuie.

**b.** Intri pe Vercel, proiectul `mda-impresa-edile` → **Settings** →
**Environment Variables**, și adaugi:

```
PUBLIC_WEB3FORMS_KEY = cheia primită pe email
```

**c.** Deployments → ultimul deploy → `...` → **Redeploy**.

Gata. Testezi formularul de pe telefon și trebuie să pice email pe adresa
clientului.

---

## 2. Panoul de administrare (dacă vrei să-l pornești acum)

Acum `/admin/` e închis și scrie „Pannello non configurato". E intenționat:
fără bază de date s-ar fi intrat cu un buton, fără parolă.

Tot în **Settings → Environment Variables** pui cele două chei din `.env`:

```
PUBLIC_SUPABASE_URL       = https://nqaolmdwefolrguvsnzt.supabase.co
PUBLIC_SUPABASE_ANON_KEY  = (cea din .env local)
```

Apoi Redeploy. **Atenție:** înainte trebuie rulat SQL-ul din
`supabase/aggiornamento-2026-09.sql` în proiectul Supabase al clientului,
altfel panoul se deschide dar tabelele lipsesc. Pașii sunt în
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

## 4. Datele reale ale firmei (de cerut clientului)

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

- Revendică profilul **Google Business** al firmei și cere recenzii reale
  clienților. Secțiunea de recenzii reapare singură la prima recenzie
  adevărată pusă în panou.
- Pozele reale de șantier: primul șantier încărcat din panou face să dispară
  avertismentul „sunt ilustrații" de pe secțiunea lavori.
- Trimite `docs/CONFORMITA-LEGALE.md` clientului, pentru contabilul lui.
