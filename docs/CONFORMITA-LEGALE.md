# Conformità legale del sito

Stato al 9 settembre 2026. Da consegnare al cliente insieme al sito, e da far
leggere al suo commercialista o consulente prima della pubblicazione.

Questo documento non è un parere legale. Descrive cosa il sito fa, quali norme
sono state prese in considerazione e cosa manca ancora dalla parte del cliente.

---

## 1. Cosa c'è nel sito

| Pagina | Indirizzo | A cosa risponde |
|---|---|---|
| Privacy Policy | `/privacy/` | Artt. 13 e 14 GDPR (Reg. UE 2016/679) |
| Cookie Policy | `/cookie/` | Art. 122 d.lgs. 196/2003 e linee guida Garante 10/06/2021 |
| Termini e condizioni | `/termini/` | Art. 7 d.lgs. 70/2003, informazioni precontrattuali |
| Diritto di recesso e rimborsi | `/recesso/` | Artt. 47-59 d.lgs. 206/2005 (Codice del consumo) |
| Crediti e licenze | `/crediti/` | Diritto d'autore su immagini, caratteri e icone |

Tutte e cinque sono raggiungibili dal piede di ogni pagina e sono collegate fra
loro. Sono nella sitemap e indicizzabili.

---

## 2. Cookie e consenso

**Oggi il sito non installa alcun cookie.** Nessuna pagina scrive `document.cookie`.

Usa invece `sessionStorage` e `localStorage`, elencati uno per uno nella cookie
policy. Servono al contatore di visite interno, che è costruito per non
identificare nessuno: nessun indirizzo IP, nessuna impronta del browser, del
referrer si tiene solo il dominio, e il contatore si spegne da solo se il browser
invia "Do Not Track" o Global Privacy Control. Per queste caratteristiche rientra
fra gli strumenti assimilabili ai cookie tecnici secondo le linee guida del
Garante del 10 giugno 2021, e non richiede consenso.

**Per questo il banner dei cookie non compare.** Non è una dimenticanza: un banner
che chiede il consenso quando non c'è nulla da consentire è a sua volta una
dichiarazione non veritiera.

### Quando si attiva Google Analytics

Il banner è già scritto, testato e pronto. Si accende da solo nel momento in cui
su Vercel viene impostata la variabile d'ambiente:

```
PUBLIC_GA_ID=G-XXXXXXXXXX
```

Da quel momento, in automatico:

- il banner compare alla prima visita, con "Rifiuta" e "Accetta" della stessa
  dimensione e dello stesso rilievo, come chiede il Garante;
- Google Analytics **non viene caricato** prima della scelta, e il Consent Mode v2
  parte da `denied` su tutte le categorie;
- la X in alto a destra chiude senza acconsentire, e lo scorrimento della pagina
  non vale come consenso;
- dopo un rifiuto la domanda non torna per sei mesi;
- il consenso è revocabile in ogni momento dal collegamento "Gestisci i cookie"
  nel piede di pagina;
- la cookie policy e la privacy policy aggiungono da sole le sezioni su Google
  Analytics, senza bisogno di riscrivere niente.

La CSP in `vercel.json` autorizza già i domini di Google Analytics, quindi non
serve toccare nessun header.

---

## 3. Cosa è stato rimosso e perché

### Recensioni

Le sei recensioni presenti fino all'8 settembre 2026 erano scritte da noi, con
nomi, località e volti generati. **Sono state rimosse.**

Pubblicare recensioni che non provengono da consumatori reali, o presentarle come
tali senza aver adottato misure ragionevoli di verifica, è una pratica commerciale
ingannevole di per sé, elencata nell'allegato I del Codice del consumo dopo il
d.lgs. 26/2023 (direttiva Omnibus). Le sanzioni dell'AGCM vanno da 5.000 euro fino
a 10 milioni. In più viola le linee guida di Google sulle recensioni e sui dati
strutturati, con rischio di penalizzazione manuale.

La sezione oggi non viene disegnata affatto. Ricompare da sola appena il cliente
pubblica una recensione vera dal pannello. Fino ad allora i dati strutturati non
dichiarano nessun `aggregateRating`: nessuna stella inventata nei risultati di
Google.

**Come riempirla, nell'ordine giusto:** rivendicare il profilo Google Business
dell'impresa, chiedere la recensione ai clienti a lavoro finito, ricopiarle nel
pannello alla voce Recensioni.

### Anno di fondazione

"Dal 2009" e "da N anni" non compaiono più da nessuna parte: né nel piede di
pagina, né nelle pagine di zona, né nei dati strutturati. L'anzianità dichiarata è
un'affermazione di fatto e va pubblicata solo se vera. Tornano tutte insieme
mettendo in `src/config/site.ts` l'anno reale e `foundedYearConfermato: true`.

### Portfolio

Le immagini restano, ma la sezione non le presenta più come cantieri eseguiti:

- le località inventate (Oderzo, Sacile, Latisana...) sono sparite: indicavano un
  lavoro preciso in un comune preciso, ed erano l'affermazione più netta;
- i titoli descrivono il tipo di intervento, non un "Progetto";
- le etichette dicono "tempo di posa tipico" e "materiali tipici";
- sopra le foto c'è un avviso visibile che dichiara che sono illustrazioni
  realizzate da noi, non fotografie di cantieri conclusi.

Avviso ed etichette spariscono da soli appena il cliente carica un cantiere vero
dal pannello.

### Altre correzioni ai testi

- La garanzia di 10 anni è ora dichiarata come garanzia commerciale **che si
  aggiunge** a quelle di legge. Presentare come propria offerta un diritto che la
  legge già riconosce è una pratica scorretta elencata nell'allegato I del Codice
  del consumo.
- "Rilascio polizza 10 anni" è diventato "certificato di garanzia": una polizza è
  un contratto di assicurazione, il certificato di garanzia è un'altra cosa.
- L'assicurazione RC verso terzi è dichiarata come verificabile nel contratto,
  senza promettere una copertura totale che nessuna polizza ha.
- Il pulsante "Ricevi il preventivo" è diventato "Invia la richiesta": premendolo
  si manda una richiesta, il preventivo nasce dal sopralluogo.

---

## 4. Dati che il sito raccoglie

Solo quelli necessari a richiamare la persona:

- **modulo rapido:** tipo di intervento, telefono, messaggio facoltativo. Nessun
  nome, nessun indirizzo;
- **configuratore:** risposte sul tetto, comune e CAP, nome, telefono. Email e note
  facoltative. **Non** viene chiesto l'indirizzo civico: serve solo al momento di
  fissare il sopralluogo e viene detto a voce.

Nessuna registrazione, nessun dato di pagamento, nessuna categoria particolare di
dati, nessuna decisione automatizzata. La casella da spuntare nei moduli è una
presa visione dell'informativa, non un consenso: la base giuridica è l'esecuzione
di misure precontrattuali richieste dall'interessato (art. 6.1.b GDPR).

---

## 5. Cosa manca, e sta al cliente

Finché questi dati non arrivano, il sito **non li inventa**: le voci restano
semplicemente nascoste. Una partita IVA finta pubblicata è un dato identificativo
falso, ed è più grave di un campo assente.

| # | Cosa serve | Dove va | Perché |
|---|---|---|---|
| 1 | **Partita IVA reale** | `site.ts` → `vat`, o dal pannello | Art. 7 d.lgs. 70/2003. **Bloccante** |
| 2 | **Sede legale e CAP** | `street`, `postalCode` | Art. 7 d.lgs. 70/2003. **Bloccante** |
| 3 | **Ragione sociale esatta** | `legalName` | Come sopra |
| 4 | **Forma giuridica** | `formaGiuridica` | Decide se serve il capitale sociale |
| 5 | **Registro imprese e REA** | `registroImprese`, `rea` | Art. 2250 c.c., per le società iscritte |
| 6 | **Capitale sociale versato** | `capitaleSociale` | Art. 2250 c.c., **solo** se è una società di capitali |
| 7 | **PEC** | `pec` | Non obbligatoria sul sito, ma attesa |
| 8 | **Anno di fondazione** | `foundedYear` + `foundedYearConfermato: true` | Sblocca "dal 20xx" |
| 9 | **Città e provincia reali** | `city`, `province`, `provinceName` | Oggi sono un segnaposto ragionato, non un dato |
| 10 | **Chiave Web3Forms** | `formAccessKey` | Senza, le email dei moduli non partono |
| 11 | **Estremi della polizza RC** | `assicurazione` | Solo se il cliente vuole pubblicarli |

Durante `npm run dev` un pannello rosso in basso a destra elenca esattamente cosa
manca; lo stesso avviso compare nel terminale a ogni `npm run build`. Il pannello
non finisce mai nel sito pubblicato.

---

## 6. Cosa va fatto fuori dal codice

1. **Far leggere privacy, cookie, termini e recesso al commercialista o al
   consulente del cliente.** I testi sono scritti con attenzione, ma chi risponde
   davanti al Garante e all'AGCM è l'impresa, non chi ha fatto il sito.
2. **Tenere gli accordi sul trattamento dei dati (art. 28 GDPR)** con Vercel,
   Supabase e Web3Forms, insieme alle clausole contrattuali tipo. Vanno esibiti se
   il Garante li chiede.
3. **Mettere per iscritto nel preventivo** l'informazione sul diritto di recesso e,
   quando i lavori devono partire prima dei 14 giorni, la richiesta espressa del
   cliente su supporto durevole. È il punto in cui le imprese edili perdono le
   cause: senza quella richiesta scritta, chi recede a lavori iniziati non deve
   pagare nulla di quanto è stato fatto (art. 57, comma 3, Codice del consumo).
4. **Rivendicare il profilo Google Business** e raccogliere recensioni vere.

---

## 7. Cosa è stato verificato e non serve

- **Piattaforma ODR europea:** dismessa il 20 luglio 2025 dal regolamento UE
  2024/3228. L'obbligo di inserirne il link è decaduto. Non è stato inserito, e se
  qualcuno lo trova in un modello scaricato da internet va tolto.
- **Foro competente:** nessuna clausola di foro esclusivo. Per i consumatori è
  competente il giudice del luogo di residenza o domicilio, e una clausola diversa
  sarebbe vessatoria e nulla (art. 33, comma 2, lettera u, Codice del consumo).
- **European Accessibility Act** (d.lgs. 82/2022, in vigore dal 28 giugno 2025):
  riguarda i servizi di commercio elettronico. Questo sito non conclude contratti
  online e l'impresa rientra con ogni probabilità fra le microimprese, quindi
  l'obbligo non si applica. Il sito è comunque costruito con testi alternativi,
  contrasti verificati, navigazione da tastiera e struttura semantica.
- **Cookie wall:** non presente, e non va introdotto.
