# Attivazione del pannello di amministrazione

Il pannello sta su `/admin/` del sito. Il codice è pronto e va online a ogni push su `main`. Restano cinque passi che si fanno dai pannelli di Supabase e di Vercel, con gli account del cliente. Nessuno di questi tocca il codice.

## 1. Aggiornare il database (Supabase, 1 minuto)

1. Entra in Supabase con l'account del cliente, progetto `nqaolmdwefolrguvsnzt`.
2. Apri **SQL Editor**, **New query**.
3. Incolla tutto il contenuto di `supabase/aggiornamento-2026-09.sql` e premi **Run**.
4. In fondo compare una tabella con sei righe di tipo `tabella` e una di tipo `bucket`: è andata.

Il file si può lanciare più volte senza rompere nulla. Crea le tabelle `richieste`, `recensioni`, `lavori`, `impostazioni`, `pubblicazione`, il deposito immagini `immagini` e aggiunge le due email autorizzate ad amministrare.

## 2. Creare l'utente che entra (Supabase, 1 minuto)

1. **Authentication**, **Users**, **Add user**, **Create new user**.
2. Email `impresaedilemda@gmail.com`, una password scelta con il cliente (almeno 8 caratteri), spunta **Auto Confirm User**.
3. Se serve anche l'accesso di chi ha costruito il sito, stessa cosa con `ark4su@gmail.com`.

Il permesso lo dà la tabella `admin_email`, non l'utente: un utente creato con un'altra email non entra. La password si può cambiare dal pannello (Impostazioni, Il tuo accesso) oppure con "Password dimenticata" nella pagina di accesso.

## 3. Chiudere le registrazioni (Supabase, 30 secondi)

**Authentication**, **Sign In / Providers**, **Email**: spegni **Allow new users to sign up** e salva. Senza questo chiunque può crearsi un account sul progetto. Non entrerebbe comunque nel pannello, ma è una porta in più che non serve.

## 4. Le due variabili su Vercel (2 minuti)

Senza queste il sito online va in "modalità di prova": il pannello non salva nulla e i moduli non arrivano nel pannello.

1. Vercel, team `impresaedilemdas-projects`, progetto `mda-impresa-edile`, **Settings**, **Environment Variables**.
2. Aggiungi, per tutti gli ambienti (Production, Preview, Development):
   - `PUBLIC_SUPABASE_URL` = l'URL del progetto (in Supabase: Project Settings, Data API)
   - `PUBLIC_SUPABASE_ANON_KEY` = la chiave *publishable* / *anon* (stessa pagina)
   I due valori sono già nel file `.env` locale del progetto: si possono incollare con **Import .env**.
3. **Deployments**, ultimo deploy, **Redeploy**: le variabili valgono solo per i deploy fatti dopo.

La chiave anon è pubblica per costruzione (finisce nel browser di ogni visitatore): a proteggere i dati sono le policy del database, già attive. La chiave `service_role` NON va mai messa su Vercel né nel codice.

## 5. La pubblicazione automatica (Vercel + pannello, 2 minuti)

Il sito è statico: articoli, cantieri, recensioni e dati dell'impresa vanno online quando Vercel lo rigenera. Con un Deploy Hook il cliente lo fa da solo con il pulsante **Pubblica** del pannello.

1. Vercel, progetto, **Settings**, **Git**, sezione **Deploy Hooks**: **Create Hook**, nome `Pannello`, branch `main`.
2. Copia l'indirizzo generato (inizia con `https://api.vercel.com/v1/integrations/deploy/`).
3. Nel pannello, **Impostazioni**, **Pubblicazione**: incolla l'indirizzo e premi **Salva l'indirizzo**.

Da quel momento, ogni volta che ci sono modifiche non ancora online, in cima al pannello compare la fascia con **Pubblica sul sito**. La build dura circa due minuti.

Le **richieste** dei moduli e le **statistiche** non hanno bisogno di pubblicazione: arrivano nel pannello in tempo reale.

## 6. Le email delle richieste (facoltativo)

Le richieste dei moduli finiscono comunque nel pannello, sotto **Richieste**, con il pulsante per chiamare o scrivere su WhatsApp. Se il cliente vuole anche l'email a ogni richiesta: chiave gratuita su web3forms.com per `impresaedilemda@gmail.com`, da mettere in `src/config/site.ts` alla voce `formAccessKey`, poi push.

## 7. Il dominio (quando si decide)

`mdaimpresaedile.it` è comprato ma non collegato. Al collegamento: Vercel, **Domains**, aggiungere il dominio e seguire le istruzioni DNS; poi variabile `PUBLIC_SITE_URL=https://www.mdaimpresaedile.it` su Vercel e redeploy. Canonical, sitemap, schema e robots seguono da soli.

## Cosa fa il pannello

| Sezione | Cosa gestisce | Va online |
| --- | --- | --- |
| Pannello | numeri del giorno, richieste da leggere, curva del mese, scorciatoie | subito |
| Richieste | i contatti arrivati dai moduli: chiama, WhatsApp, stato, appunti | subito |
| Blog | articoli con foto, bozza/pubblicato, anteprima | con Pubblica |
| Lavori | cantieri prima/dopo con foto caricate dal telefono | con Pubblica |
| Recensioni | recensioni vere con stelle e foto | con Pubblica |
| Statistiche | visite, pagine, provenienza, dispositivi, link | subito |
| Link | indirizzi tracciati per volantini e annunci (`/l/codice`) | subito |
| Impostazioni | telefono, WhatsApp, email, sede, P.IVA, REA, social, pubblicazione, password | con Pubblica |

Finché il cliente non aggiunge almeno un cantiere e una recensione, il sito continua a mostrare gli esempi scritti nel codice. Appena ne aggiunge uno visibile, gli esempi spariscono.
