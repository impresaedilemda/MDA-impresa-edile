import { site } from './site'

/* ===========================================================================
 *  CONTENUTI DEL SITO
 *  Testi ripresi 1:1 dal design Figma (mda-desktop-v2 / mda-mobile-v2),
 *  con due sole differenze deliberate:
 *   - ogni riferimento a detrazioni fiscali e stato rimosso (non richiesto
 *     dal cliente);
 *   - i dati variabili (telefono, citta, anni) vengono da site.ts.
 * ======================================================================== */

/* --- HERO ---------------------------------------------------------------- */

/* La riga "badge" del Figma (Da N Anni) e stata tolta: non e usata da
   Hero.astro e mostrava un'anzianita calcolata da un anno di fondazione
   non ancora confermato dal cliente. */
export const hero = {
  phoneLabel: 'Sopralluogo Diretto:',
  /* Il corsivo del design e la parte "italic". Titolo accorciato su
     richiesta del cliente (10/09/2026): prima era "L'arte delle coperture
     italiane, eseguita a regola d'arte." */
  headlinePlain: 'Coperture',
  headlineItalic: 'eseguite a regola d’arte.',
  /* Il sottotitolo porta le parole chiave della pagina (rifacimento, tetti,
     citta) che il titolo di design non contiene. Nessun anno di fondazione:
     va pubblicato solo dopo la conferma del cliente. */
  sub: `Rifacimento e manutenzione tetti a ${site.city} e provincia con squadra interna specializzata. Nessun subappalto, preventivi bloccati e ${site.warrantyYears} anni di garanzia scritta.`,
  cta: 'Richiedi Sopralluogo Gratuito',
  /* La riga "Squadra disponibile questa settimana fra Veneto e Friuli" con
     il pallino verde e stata tolta dal cliente (10/09/2026). */
}

/* --- TRUST, sei carte in due righe --------------------------------------- */

export type TrustCard = {
  icon: string
  title: string
  text: string
}

export const trust = {
  eyebrow: 'La sicurezza di un unico referente',
  title: 'Perché i proprietari esigenti scelgono MDA Impresa Edile',
  intro:
    'Non siamo una rete commerciale o intermediari. Siamo artigiani costruttori con attrezzature proprietarie e responsabilità diretta.',
  cards: [
    {
      icon: 'users-2',
      title: 'Squadra Interna',
      text: 'Carpentieri e lattonieri dipendenti diretti, formati in azienda. Zero subappalti.',
    },
    {
      icon: 'shield-check',
      title: `Garanzia Scritta ${site.warrantyYears} Anni`,
      /* Prima qui si prometteva una "polizza postuma decennale su ogni
         intervento strutturale": e un prodotto assicurativo specifico che
         non si emette per qualsiasi lavoro. Si dichiara cio che davvero
         si rilascia, come gia si fa in servizi-pagine.ts.
         Il "in aggiunta" non e un dettaglio di stile: presentare come
         propria offerta un diritto che la legge gia riconosce (artt. 1667 e
         1669 c.c.) e una pratica commerciale scorretta in se, allegato I
         del Codice del consumo. */
      text: 'Garanzia scritta nostra sul lavoro eseguito, in aggiunta alle garanzie di legge e a quelle dei produttori sui materiali posati.',
    },
    /* Qui c'era "Prezzo Bloccato" (il preventivo firmato non cambia in corso
       d'opera): il cliente l'ha sostituita con la sicurezza in cantiere
       (10/09/2026). Il prezzo bloccato resta citato nel sottotitolo dell'hero. */
    {
      icon: 'hard-hat',
      title: 'Sicurezza ai Massimi Livelli',
      text: 'Ponteggi, linee vita e dispositivi a norma. Squadra formata per lavorare in quota senza rischi per voi e per la casa.',
    },
    /* Nel design qui c'era una carta sulle pratiche fiscali: sostituita,
       il cliente non ha richiesto quel tema. */
    {
      icon: 'file-text',
      title: 'Materiali Dichiarati',
      text: 'Nel preventivo trovate marca e modello di ogni materiale, verificabili prima della posa.',
    },
    {
      icon: 'calculator',
      title: 'Preventivo Dettagliato',
      text: 'Voci di costo chiare ed esaminate capitolo per capitolo, senza sorprese finali.',
    },
    {
      icon: 'stamp',
      /* "RC Totale" e "copertura totale" sono affermazioni assolute: ogni
         polizza ha massimali, franchigie ed esclusioni. Si dichiara che la
         polizza c'e ed e verificabile, non che copre tutto. */
      title: 'Assicurazione RC Terzi',
      text: 'Polizza di responsabilità civile verso terzi, con compagnia e numero indicati nel contratto e verificabili prima della firma.',
    },
  ] satisfies TrustCard[],
}

/* --- SERVIZI, quattro carte + approfondimento verniciatura ---------------- */

export type Service = {
  id: string
  keyword: string
  title: string
  text: string
  image: string
  alt: string
}

export const servicesSection = {
  eyebrow: 'Interventi professionali certificati',
  title: 'Soluzioni su misura per ogni tipologia di copertura',
}

export const services: Service[] = [
  {
    id: 'manutenzione-tetto',
    keyword: 'manutenzione tetto',
    title: 'Manutenzione Tetto',
    text: 'Localizzazione infiltrazioni d’acqua, riparazione guaine compromesse, sostituzione di tegole rotte o canali ostruiti per proteggere subito la tua casa.',
    image: '/images/servizio-manutenzione.webp',
    alt: `Manutenzione tetto a ${site.city}: tegole in ardesia dopo la pioggia`,
  },
  {
    id: 'rifacimento-tetto',
    keyword: 'rifacimento tetto',
    title: 'Rifacimento Tetto',
    text: 'Intervento completo: rimozione del vecchio manto, consolidamento strutturale in legno, isolamento termico moderno ad alte prestazioni e posa nuove coperture.',
    image: '/images/servizio-rifacimento.webp',
    alt: `Rifacimento tetto a ${site.city}: nuova orditura in legno con squadra al lavoro`,
  },
  {
    id: 'impermeabilizzazione-guaine',
    keyword: 'impermeabilizzazione tetto e guaine',
    title: 'Impermeabilizzazione',
    text: 'Sistemi all’avanguardia per tetti piani, terrazzi e garage. Posa professionale di membrane bituminose (guaine) certificate resistenti all’usura.',
    image: '/images/servizio-guaine.webp',
    alt: `Impermeabilizzazione con guaina su terrazzo piano a ${site.city}`,
  },
  {
    id: 'grondaie-lattonerie',
    keyword: 'grondaie e lattonerie',
    title: 'Grondaie e Lattoneria',
    text: 'Installazione e piegatura in cantiere di canali di gronda, pluviali e scossaline in rame, alluminio o zinco titanio, per un deflusso perfetto.',
    image: '/images/servizio-grondaie.webp',
    alt: `Grondaie e pluviali in rame installati a ${site.city}`,
  },
]

export const verniciatura = {
  id: 'verniciatura-tetto',
  keyword: 'verniciatura tetto',
  badge: 'Trattamento specializzato',
  titlePlain: 'Verniciatura e Protezione Tetto in',
  titleAccent: '4 Fasi Cruciali',
  intro:
    'Non è una semplice rinfrescata estetica. Trattiamo le tue tegole con un ciclo protettivo completo in quattro fasi, con finitura silossanica che respinge l’acqua e lascia uscire il vapore.',
  image: '/images/servizio-verniciatura.webp',
  alt: `Verniciatura tetto a ${site.city}: applicazione a spruzzo su tegole`,
  steps: [
    { n: '01', title: 'Lavaggio e Biocida', text: 'Idropulizia profonda a 250 bar e applicazione di principio attivo anti-muschio.' },
    { n: '02', title: 'Ripristino Substrato', text: 'Sostituzione manuale delle parti rotte e stuccatura crepe strutturali.' },
    { n: '03', title: 'Primer Consolidante', text: 'Applicazione di speciale fondo ancorante ad alta penetrazione.' },
    { n: '04', title: 'Doppia Mano Finitura', text: 'Verniciatura elastomera impermeabilizzante ad alto spessore.' },
  ],
}

/* --- COME LAVORIAMO ------------------------------------------------------- */

export const processSection = {
  eyebrow: 'Nessuna improvvisazione',
  title: 'Come realizziamo il tuo nuovo tetto',
}

export const processSteps = [
  { n: '01', icon: 'eye', title: 'Sopralluogo', text: 'Rilievo dettagliato sul tetto e analisi strutturale.' },
  { n: '02', icon: 'file-text', title: 'Preventivo', text: 'Computo metrico analitico, voce per voce, nero su bianco.' },
  { n: '03', icon: 'sparkles', title: 'Cantiere Pulito', text: 'Allestimento ponteggi propri e pulizia giornaliera.' },
  /* "polizza" e una parola tecnica: significa contratto di assicurazione.
     Quello che si consegna e un certificato di garanzia dell'impresa, che
     e un'altra cosa. Chiamarla polizza sarebbe una informazione falsa sulla
     natura della tutela offerta. */
  { n: '04', icon: 'shield', title: 'Garanzia', text: `Fine lavori con collaudo e certificato di garanzia ${site.warrantyYears} anni.` },
]

/* --- PORTFOLIO ------------------------------------------------------------
 *  Le immagini di questa sezione sono elaborazioni grafiche realizzate da
 *  noi, non fotografie di cantieri conclusi. Finche e cosi, la sezione NON
 *  puo presentarle come lavori eseguiti: attribuire a se stessi opere mai
 *  realizzate e una pratica commerciale ingannevole (art. 21 e 23 del Codice
 *  del consumo, d.lgs. 206/2005) e per le immagini vale anche l'art. 2598
 *  c.c. sulla concorrenza sleale.
 *
 *  Per questo:
 *   - i testi parlano di "esempi di intervento", non di cantieri svolti;
 *   - le localita inventate sono sparite: erano l'affermazione piu netta,
 *     perche indicavano un cantiere preciso in un comune preciso;
 *   - durata e materiali restano, ma dichiarati come valori tipici della
 *     lavorazione, non come consuntivo di un lavoro;
 *   - sopra la sezione compare un avviso visibile, non una nota in fondo.
 *
 *  Appena il cliente carica cantieri veri dal pannello, tutto questo sparisce
 *  da solo: Lavori.astro mostra solo quelli e riprende le etichette normali.
 * ------------------------------------------------------------------------ */

export const portfolioIsPlaceholder = true // TODO CLIENTE: false con foto vere

export const portfolioSection = {
  eyebrow: 'Come interveniamo',
  title: 'Prima e dopo, tipologia per tipologia',
  intro:
    'Cinque situazioni che troviamo di continuo sui tetti, con il risultato che il nostro tipo di intervento porta a casa.',
  beforeLabel: 'La situazione di partenza',
  afterLabel: 'Il risultato dell’intervento',
  /** Avviso mostrato in cima alla sezione finche le foto sono illustrazioni. */
  avviso:
    'Le immagini di questa sezione sono illustrazioni realizzate da noi per mostrare le tipologie di intervento: non sono fotografie di cantieri conclusi e non rappresentano lavori specifici. Le foto dei nostri cantieri reali arrivano qui appena disponibili.',
  /** Etichette usate finche i contenuti sono illustrativi. */
  etichettaEsempio: 'Esempio di intervento',
  durataLabel: 'Tempo di posa tipico',
  materialiLabel: 'Materiali tipici',
  /** Etichette usate quando i cantieri arrivano dal pannello e sono reali. */
  durataLabelReale: 'Tempo di posa',
  materialiLabelReale: 'Materiali usati',
}

/* Cinque tipologie, una per servizio, con le coppie prima/dopo elaborate a
   partire dal file Figma. `place` e volutamente vuoto: un comune scritto qui
   diventerebbe l'affermazione che in quel comune abbiamo fatto quel lavoro.
   Lavori.astro, in mancanza di localita, mostra l'etichetta neutra. */
export const portfolio = [
  {
    place: '', // TODO CLIENTE: il comune si scrive solo per un cantiere davvero eseguito
    title: 'Rifacimento completo della copertura',
    text: 'Rimozione del vecchio manto, isolamento termico in lana di roccia e posa di tegole portoghesi: è la sequenza con cui affrontiamo un tetto arrivato a fine vita.',
    days: '8 Giorni Lavorativi',
    materials: 'Lana Minerale, Rame, Tegole Wierer',
    before: '/images/progetto-1-prima.webp',
    after: '/images/progetto-1-dopo.webp',
    altPrima: 'Illustrazione: copertura ammalorata con tegole rotte e listelli scoperti',
    altDopo: 'Illustrazione: copertura nuova in tegole portoghesi dopo il rifacimento',
  },
  {
    /* Nel Figma questa scheda aveva il testo dell'amianto ma le foto di un
       tetto piano impermeabilizzato: testo allineato alle immagini. */
    place: '',
    title: 'Impermeabilizzazione di un lastrico solare',
    text: 'Quando l’acqua ristagna e la guaina è degradata si rifà il pacchetto: nuova membrana, risvolti sui parapetti e scarichi rifatti, che sono il punto dove quasi sempre ricomincia la perdita.',
    days: '6 Giorni Lavorativi',
    materials: 'Membrana PVC, Scossaline, Nuovi Scarichi',
    before: '/images/progetto-2-prima.webp',
    after: '/images/progetto-2-dopo.webp',
    altPrima: 'Illustrazione: lastrico solare con ristagni d’acqua e guaina degradata',
    altDopo: 'Illustrazione: lastrico solare impermeabilizzato con nuova membrana e risvolti perimetrali',
  },
  {
    place: '',
    title: 'Verniciatura e protezione del manto',
    text: 'Su tegole invase da muschio il ciclo completo prevede lavaggio, biocida, primer e doppia mano di finitura: è quello che cambia l’aspetto del tetto senza rifarlo.',
    days: '5 Giorni Lavorativi',
    materials: 'Primer Consolidante, Vernice Protettiva',
    before: '/images/progetto-3-prima.webp',
    after: '/images/progetto-3-dopo.webp',
    altPrima: 'Illustrazione: tegole in cemento invase da muschio e licheni',
    altDopo: 'Illustrazione: manto verniciato con finitura protettiva uniforme',
  },
  {
    place: '',
    title: 'Sostituzione di grondaie e lattonerie',
    text: 'Canali e pluviali in rame piegati su misura direttamente in cantiere, così il pezzo segue la linea reale della falda invece del contrario.',
    days: '4 Giorni Lavorativi',
    materials: 'Rame, Alluminio, Guarnizioni',
    before: '/images/progetto-4-prima.webp',
    after: '/images/progetto-4-dopo.webp',
    altPrima: 'Illustrazione: vecchia grondaia ostruita da detriti e vegetazione',
    altDopo: 'Illustrazione: nuovo canale di gronda e pluviale in rame piegati su misura',
  },
  {
    place: '',
    title: 'Manutenzione straordinaria e camino',
    text: 'Tegole rotte sostituite, listelli ripristinati e camino sigillato con nuova scossalina: l’intervento breve che evita il rifacimento qualche anno dopo.',
    days: '3 Giorni Lavorativi',
    materials: 'Tegole Wierer, Malta, Guaina',
    before: '/images/progetto-5-prima.webp',
    after: '/images/progetto-5-dopo.webp',
    altPrima: 'Illustrazione: tegole rotte e scivolate sotto il camino, vecchia scossalina sollevata e muschio sul manto',
    altDopo: 'Illustrazione: manto ripristinato, camino ripuntato con nuova scossalina in piombo e comignolo',
  },
]

/* --- RECENSIONI -----------------------------------------------------------
 *  VUOTO DI PROPOSITO. Qui c'erano sei recensioni scritte da noi, con nomi,
 *  localita e volti generati. Sono state rimosse il 9 settembre 2026.
 *
 *  Perche non possono tornare: pubblicare recensioni che non provengono da
 *  clienti reali, o dichiararle tali senza aver fatto verifiche ragionevoli,
 *  e una pratica commerciale ingannevole in ogni caso, senza bisogno di
 *  provare il danno. Lo dice l'allegato I del Codice del consumo dopo il
 *  d.lgs. 26/2023 (direttiva Omnibus): la sanzione dell'AGCM parte da 5.000
 *  euro. In piu viola le linee guida di Google sulle recensioni e i dati
 *  strutturati, che costa una penalizzazione manuale.
 *
 *  Come si riempie, nell'ordine giusto:
 *   1. il cliente rivendica il profilo Google Business dell'impresa;
 *   2. chiede la recensione ai clienti veri, a lavoro finito;
 *   3. le ricopia nel pannello (sezione Recensioni), con nome e localita
 *      come li ha scritti chi le ha lasciate.
 *
 *  Finche questo array resta vuoto e il pannello non ha recensioni visibili,
 *  Recensioni.astro non disegna la sezione e lo Schema non dichiara nessun
 *  AggregateRating: nessuna stella finta nei risultati di Google.
 * ------------------------------------------------------------------------ */

export const reviewsArePlaceholder = true // TODO CLIENTE: false con recensioni vere

export const reviewsSection = {
  eyebrow: 'La parola ai nostri clienti',
  title: 'Cosa dicono di noi i proprietari di casa',
}

export type Review = {
  name: string
  place: string
  avatar: string
  text: string
  /** da 1 a 5. Senza voto reale lo Schema non dichiara AggregateRating. */
  rating?: number
}

export const reviews: Review[] = []

/* --- FAQ ------------------------------------------------------------------
 *  Le prime tre vengono dal design (la quarta del design era sulle
 *  detrazioni fiscali ed e stata tolta); le altre completano i temi che i
 *  clienti chiedono davvero e alimentano lo schema FAQPage.
 * ------------------------------------------------------------------------ */

export const faqSection = {
  eyebrow: 'Trasparenza totale',
  title: 'Domande frequenti e chiarimenti tecnici',
}

export const faqs = [
  {
    q: 'Quanto tempo occorre per rifare completamente un tetto di 120 mq?',
    a: 'In condizioni meteo normali, la nostra squadra interna completa lo smantellamento, l’isolamento e la nuova posa in circa 8-10 giorni lavorativi.',
  },
  {
    q: 'Il preventivo iniziale può subire variazioni durante i lavori?',
    a: 'No. Il prezzo del computo metrico firmato non cambia. Eventuali imprevisti strutturali documentati vengono quantificati per iscritto e si procede solo dopo la vostra approvazione, mai a voce durante i lavori.',
  },
  {
    q: 'Utilizzate squadre esterne o lavoratori in subappalto?',
    a: 'Assolutamente no. Tutta la forza lavoro impiegata in cantiere è formata da operai edili regolarmente assunti come dipendenti diretti di MDA Impresa Edile.',
  },
  {
    q: 'Quanto costa rifare un tetto?',
    a: 'Il prezzo si costruisce su cinque voci, le stesse che deve contenere ogni preventivo serio: lo stato della struttura portante e del tavolato, il tipo di manto, il pacchetto isolante, l’accessibilità del cantiere e le lattonerie. Chiedete a ogni impresa queste cinque righe separate e i preventivi diventano confrontabili davvero. Il nostro sopralluogo e il computo metrico analitico sono gratuiti e senza impegno, e il prezzo firmato non cambia in corso d’opera.',
  },
  {
    q: 'Servono permessi per rifare il tetto?',
    a: 'Se non si modificano sagoma, altezza e volume, il rifacimento rientra di solito nella manutenzione straordinaria e si procede con una CILA. Se invece si alza la quota, si cambia la forma della falda o si interviene in zona vincolata, servono titoli più impegnativi. Verifichiamo la situazione durante il sopralluogo e vi diciamo subito cosa serve.',
  },
  {
    q: 'Quanto dura una guaina impermeabilizzante?',
    a: 'Una guaina bituminosa ardesiata posata a regola d’arte dura fra i quindici e i venticinque anni, le membrane sintetiche in PVC o TPO arrivano oltre i venticinque. La differenza la fanno la corretta posa dei risvolti e la cura dei punti di scarico, non tanto il prodotto in sé.',
  },
  {
    q: 'Lavorate anche per i condomini?',
    a: 'Sì. Seguiamo interventi su condomini e edifici plurifamiliari, con preventivi nel formato richiesto dagli amministratori, cronoprogramma dei lavori e tutta la documentazione per la ripartizione delle spese fra i condomini.',
  },
  {
    q: 'In quali zone intervenite?',
    a: `Operiamo a ${site.city} e in tutta la provincia di ${site.provinceName}, tra cui ${site.areaServed.slice(1, 6).join(', ')} e i comuni limitrofi. Per cantieri di dimensioni rilevanti valutiamo anche zone più distanti: chiamateci e vi diciamo subito se rientrate.`,
  },
]

/* --- PREVENTIVO, configuratore in 6 passi --------------------------------- */

export const quoteSection = {
  eyebrow: 'Calcolo rapido',
  title: 'Richiedi un preventivo dettagliato senza impegno',
  intro:
    'Compila i brevi passaggi per farci comprendere la natura del tuo tetto. Alla fine vedi subito una forbice di mercato calcolata sulle tue risposte, utile per orientarti. Il prezzo vero, quello che firmiamo, nasce solo dal sopralluogo gratuito.',
  phoneQuestion: 'Preferisci parlare subito con noi?',
  phoneLabel: 'Chiama direttamente:',
  cardLabel: 'Configuratore Tetto',
}

export type QuizOption = { label: string; icon?: string }

export const quizSteps: { key: string; question: string; options: QuizOption[] }[] = [
  {
    key: 'intervento',
    question: 'Di che intervento hai bisogno?',
    options: [
      { label: 'Manutenzione e riparazione' },
      { label: 'Rifacimento completo del tetto' },
      { label: 'Impermeabilizzazione e guaine' },
      { label: 'Grondaie e lattoneria' },
      { label: 'Verniciatura del tetto' },
      { label: 'Non lo so, vorrei un sopralluogo' },
    ],
  },
  {
    key: 'edificio',
    question: 'Qual è la tipologia dell’immobile?',
    options: [
      { label: 'Villa Singola / Indipendente', icon: 'home' },
      { label: 'Condominio / Edificio Plurifamiliare', icon: 'building' },
      { label: 'Capannone Industriale / Commerciale', icon: 'briefcase' },
      { label: 'Rustico / Casale Storico', icon: 'leaf' },
    ],
  },
  {
    key: 'superficie',
    question: 'Quanto è grande la superficie del tetto?',
    options: [
      { label: 'Fino a 50 mq' },
      { label: 'Da 50 a 100 mq' },
      { label: 'Da 100 a 200 mq' },
      { label: 'Oltre 200 mq' },
      { label: 'Non lo so' },
    ],
  },
  {
    key: 'urgenza',
    question: 'Quando vorresti iniziare i lavori?',
    options: [
      { label: 'Il prima possibile, ho un problema attivo' },
      { label: 'Entro un mese' },
      { label: 'Entro tre mesi' },
      { label: 'Sto solo valutando' },
    ],
  },
]
