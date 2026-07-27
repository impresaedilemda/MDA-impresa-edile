import { site, yearsActive } from './site'

/* ===========================================================================
 *  CONTENUTI DEL SITO
 *  Testi ripresi 1:1 dal design Figma (mda-desktop-v2 / mda-mobile-v2),
 *  con due sole differenze deliberate:
 *   - ogni riferimento a detrazioni fiscali e stato rimosso (non richiesto
 *     dal cliente);
 *   - i dati variabili (telefono, citta, anni) vengono da site.ts.
 * ======================================================================== */

/* --- HERO ---------------------------------------------------------------- */

export const hero = {
  badge: `Specialisti in Coperture · Da ${yearsActive} Anni`,
  phoneLabel: 'Sopralluogo Diretto:',
  /* Il corsivo del design e la parte "italic" */
  headlinePlain: "L'arte delle coperture italiane,",
  headlineItalic: 'eseguita a regola d’arte.',
  sub: `Dal ${site.foundedYear} costruiamo e restauriamo tetti con squadra interna specializzata. Nessun subappalto, preventivi bloccati e ${site.warrantyYears} anni di garanzia scritta.`,
  cta: 'Richiedi Sopralluogo Gratuito',
  availability: 'Squadra disponibile questa settimana fra Veneto e Friuli-Venezia Giulia',
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
      text: 'Rilasciamo polizza assicurativa postuma decennale su ogni intervento strutturale.',
    },
    {
      icon: 'lock',
      title: 'Prezzo Bloccato',
      text: 'Il preventivo firmato non subisce variazioni in corso d’opera. Massima trasparenza.',
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
      title: 'Assicurazione RC Totale',
      text: 'Copertura totale per danni a terzi durante tutte le fasi del cantiere edile.',
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
    'Non è una semplice rinfrescata estetica. Trattiamo le tue tegole con un protocollo chimico e protettivo nanotecnologico per estendere la vita del tetto di altri 15 anni.',
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
  { n: '02', icon: 'file-text', title: 'Preventivo', text: 'Computo metrico analitico con costi bloccati.' },
  { n: '03', icon: 'sparkles', title: 'Cantiere Pulito', text: 'Allestimento ponteggi propri e pulizia giornaliera.' },
  { n: '04', icon: 'shield', title: 'Garanzia', text: `Fine lavori con collaudo e rilascio polizza ${site.warrantyYears} anni.` },
]

/* --- PORTFOLIO ------------------------------------------------------------
 *  ATTENZIONE: progetti segnaposto con immagini generate. Vanno sostituiti
 *  con cantieri reali e foto reali prima della pubblicazione.
 * ------------------------------------------------------------------------ */

export const portfolioIsPlaceholder = true // TODO CLIENTE: false con foto vere

export const portfolioSection = {
  eyebrow: 'I nostri lavori recenti',
  title: 'Coperture prima e dopo il nostro cantiere',
  intro: 'Ogni tetto è documentato accuratamente per mostrare lo standard esecutivo della nostra squadra interna.',
  beforeLabel: 'Prima dell’intervento',
  afterLabel: 'Dopo il nostro lavoro',
}

export const portfolio = [
  {
    place: 'Oderzo (TV)', // TODO CLIENTE: cantieri reali
    title: 'Progetto Oderzo',
    text: 'Rifacimento completo copertura in tegole portoghesi ed installazione isolamento termico in lana di roccia.',
    days: '8 Giorni Lavorativi',
    materials: 'Lana Minerale, Rame, Tegole Wierer',
    before: '/images/progetto-1-prima.webp',
    after: '/images/progetto-1-dopo.webp',
  },
  {
    place: 'Pordenone (PN)',
    title: 'Progetto Pordenone',
    text: 'Rimozione amianto e installazione tetto ventilato in legno lamellare a vista e finitura ardesia.',
    days: '12 Giorni Lavorativi',
    materials: 'Legno Lamellare, Ardesia, Zinco Titanio',
    before: '/images/progetto-2-prima.webp',
    after: '/images/progetto-2-dopo.webp',
  },
]

/* --- RECENSIONI -----------------------------------------------------------
 *  ATTENZIONE: recensioni e volti segnaposto (generati). Da sostituire con
 *  recensioni reali del profilo Google prima della pubblicazione; fino ad
 *  allora lo schema NON dichiara aggregateRating.
 * ------------------------------------------------------------------------ */

export const reviewsArePlaceholder = true // TODO CLIENTE: false con recensioni vere

export const reviewsSection = {
  eyebrow: 'La parola ai nostri clienti',
  title: 'Cosa dicono di noi i proprietari di casa',
}

export const reviews = [
  {
    name: 'Giovanni S.',
    place: 'San Donà di Piave (VE)',
    avatar: '/images/avatar-giovanni.webp',
    text: 'Squadra eccezionale, pulitissimi. Hanno rifatto il tetto della mia villa in 9 giorni esatti. Prezzo finale identico al centesimo al preventivo stipulato.',
  },
  {
    name: 'Maria Teresa B.',
    place: 'Portogruaro (VE)',
    avatar: '/images/avatar-maria.webp',
    text: 'Avevo continue perdite dal tetto del garage. Dopo l’impermeabilizzazione di MDA con doppia guaina il problema è risolto definitivamente. Consigliatissimi.',
  },
  {
    /* Nel design la recensione chiudeva con una frase sulle pratiche di
       detrazione fiscale: rimossa, tema non richiesto dal cliente. */
    name: 'Stefano R.',
    place: 'Pordenone (PN)',
    avatar: '/images/avatar-stefano.webp',
    text: 'La squadra interna è di una cortesia d’altri tempi. Cantiere pulito ogni sera prima di andarsene e lavoro consegnato nei tempi promessi.',
  },
  {
    name: 'Lucia M.',
    place: 'Latisana (UD)',
    avatar: '/images/avatar-lucia.webp',
    text: 'Professionalità assoluta. Hanno gestito tutto il rifacimento del tetto condominiale senza un intoppo. Ogni fase è stata documentata e comunicata. Davvero impeccabili.',
  },
  {
    name: 'Roberto F.',
    place: 'Conegliano (TV)',
    avatar: '/images/avatar-roberto.webp',
    text: 'Cercavamo qualcuno per la verniciatura del tetto e MDA ci ha spiegato il processo in quattro fasi. Risultato eccellente, il tetto sembra nuovo. Prezzo onesto e lavoro curato.',
  },
  {
    name: 'Anna P.',
    place: 'Sacile (PN)',
    avatar: '/images/avatar-anna.webp',
    text: 'Intervento rapido per una perdita urgente. Sono arrivati il giorno dopo la chiamata e hanno risolto il problema in mezza giornata. Serietà e competenza rare.',
  },
]

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
    a: 'No. Il prezzo stabilito nel computo metrico iniziale è blindato. Eventuali imprevisti strutturali sono a nostro carico, salvo accordi diversi preventivi.',
  },
  {
    q: 'Utilizzate squadre esterne o lavoratori in subappalto?',
    a: 'Assolutamente no. Tutta la forza lavoro impiegata in cantiere è formata da operai edili regolarmente assunti come dipendenti diretti di MDA Impresa Edile.',
  },
  {
    q: 'Quanto costa rifare un tetto?',
    a: 'Il costo dipende da superficie, tipo di manto, stato della struttura in legno e livello di isolamento richiesto. In Italia un rifacimento completo si colloca indicativamente fra 150 e 300 euro al metro quadro, mentre una manutenzione mirata parte da poche centinaia di euro. Qualsiasi cifra data al telefono senza aver visto la copertura è inaffidabile: per questo il nostro sopralluogo e il preventivo scritto sono gratuiti e senza impegno.',
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
    a: `Operiamo a ${site.city} e in tutta la provincia di ${site.province}, tra cui ${site.areaServed.slice(1, 6).join(', ')} e i comuni limitrofi. Per cantieri di dimensioni rilevanti valutiamo anche zone più distanti: chiamateci e vi diciamo subito se rientrate.`,
  },
]

/* --- PREVENTIVO, configuratore in 6 passi --------------------------------- */

export const quoteSection = {
  eyebrow: 'Calcolo rapido',
  title: 'Richiedi un preventivo dettagliato senza impegno',
  intro:
    'Compila i brevi passaggi per farci comprendere la natura del tuo tetto. Un nostro tecnico ti contatterà per definire i dettagli ed elaborare la proposta economica vincolante.',
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
