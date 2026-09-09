/* ===========================================================================
 *  PAGINE DEDICATE AI SERVIZI
 *  Una pagina completa per ogni servizio, con lo stesso slug degli id usati
 *  nella sezione servizi della home: i collegamenti interni restano coerenti.
 *  Regole: niente temi fiscali, niente trattini lunghi, accenti corretti.
 * ======================================================================== */

import type { PaginaSEO } from './guide'

export const serviziPagine: PaginaSEO[] = [
  {
    slug: 'rifacimento-tetto',
    metaTitle: 'Rifacimento Tetto in Veneto e Friuli | MDA',
    metaDescription:
      'Rifacimento tetto completo con squadra interna: smontaggio, verifica della struttura, isolamento, ventilazione e nuovo manto. Preventivo scritto gratuito.',
    eyebrow: 'Il servizio',
    h1: 'Rifacimento tetto completo, dalla struttura al manto finito',
    intro:
      'Quando le riparazioni non bastano più, il rifacimento è l’intervento che chiude la partita per trent’anni. Lo eseguiamo con squadra interna dal primo smontaggio all’ultimo colmo, fra Veneto e Friuli-Venezia Giulia, con computo metrico analitico e prezzo bloccato alla firma.',
    sezioni: [
      {
        h2: 'Cosa comprende il rifacimento completo',
        paragrafi: [
          'Smontiamo il vecchio manto e lo smaltiamo in modo tracciato, verifichiamo l’orditura in legno trave per trave e ripristiniamo le parti ammalorate, poi ricostruiamo il pacchetto moderno: freno al vapore sigillato sui giunti, isolamento con spessore e marca dichiarati nel computo, doppia listellatura per la camera di ventilazione, membrana traspirante e infine il manto scelto, in tegole, coppi o lamiera aggraffata.',
          'Le lattonerie fanno parte del lavoro, non sono un extra: canali, scossaline, converse e raccordi dei camini vengono piegati su misura in cantiere dai nostri lattonieri. Il tetto tiene per i suoi dettagli, ed è lì che si vede la differenza fra una posa e una posa fatta bene.',
        ],
      },
      {
        h2: 'Come lavoriamo in cantiere',
        paragrafi: [
          'Il cantiere apre con ponteggio e linee vita a norma e procede per fasce di falda: apriamo solo la porzione che chiudiamo entro sera, così la casa non passa mai una notte scoperta. La squadra è la nostra, formata in azienda: le stesse persone dal primo all’ultimo giorno, un unico referente per voi.',
          'Ogni sera l’area viene messa in ordine e i materiali coperti. Vi aggiorniamo sull’avanzamento con foto, senza che dobbiate chiedere: chi rifà un tetto ha il diritto di sapere ogni giorno a che punto è il proprio cantiere.',
        ],
      },
      {
        h2: 'Materiali che dichiariamo per iscritto',
        paragrafi: [
          'Nel computo trovate marca, modello e spessore di ogni strato: l’isolante, la membrana, i listelli, il manto, le lattonerie. Non scriviamo mai "isolamento termico" e basta, perché fra un pannello economico e uno ad alta densità passano prestazioni e prezzo, e avete il diritto di sapere cosa state comprando.',
          'Lavoriamo con produttori consolidati del Nord-Est e scegliamo i materiali in funzione del clima locale: gelo e umidità invernale, grandine e caldo estivo. La copertura giusta qui non è la stessa che si monta in Sicilia.',
        ],
      },
      {
        h2: 'Tempi di cantiere e cosa determina davvero il costo',
        paragrafi: [
          'Una villetta media dai 120 ai 160 metri quadri di falda si chiude fra gli 8 e i 15 giorni lavorativi, ponteggio compreso, meteo permettendo. Sul costo pesano cinque fattori: lo stato dell’orditura portante, che si scopre davvero solo a manto smontato, il tipo di manto scelto, lo spessore e la qualità del pacchetto isolante, l’accessibilità del cantiere per ponteggio e mezzi, e le lattonerie, che i preventivi bassi alleggeriscono per prime ed è quasi sempre lì che le sorprese arrivano dopo.',
          'Per questo il prezzo del vostro tetto esce dal sopralluogo, che è gratuito e senza impegno: saliamo, misuriamo, fotografiamo, e il preventivo arriva per iscritto, voce per voce, con computo metrico analitico, così lo potete confrontare riga per riga.',
        ],
      },
      {
        h2: 'La garanzia che resta a voi',
        paragrafi: [
          'Su ogni rifacimento rilasciamo garanzia scritta di 10 anni sul lavoro eseguito, oltre alle garanzie dei produttori sui materiali. Non una promessa a voce: un documento che resta a voi e vale anche se la casa cambia proprietario.',
          'A fine cantiere ricevete la documentazione completa: foto delle fasi, schede dei materiali posati e certificazioni. Il fascicolo del vostro tetto, utile domani per qualsiasi pratica o vendita.',
        ],
      },
    ],
    faq: [
      {
        q: 'La casa resta abitabile durante il rifacimento?',
        a: 'Sì, in quasi tutti i cantieri residenziali: lavoriamo dall’esterno per fasce di falda e la copertura non resta mai aperta di notte. Rumore e ponteggio sono l’unico vero disagio, e durano il tempo del cantiere.',
      },
      {
        q: 'Rifate anche solo una falda o una porzione di tetto?',
        a: 'Sì, quando ha senso tecnico: su danni localizzati o su edifici a schiera è una richiesta frequente. Durante il sopralluogo vi diciamo con onestà se la porzione basta o se il resto del manto arriverà a fine vita fra pochi anni.',
      },
      {
        q: 'Chi si occupa delle pratiche edilizie?',
        a: 'Collaboriamo con i tecnici per la CILA o i titoli necessari e forniamo tutta la documentazione di cantiere. Se avete già un geometra o architetto di fiducia, lavoriamo volentieri con lui.',
      },
      {
        q: 'Montate anche linee vita permanenti?',
        a: 'Sì, e il rifacimento è il momento ideale per installarle: gli ancoraggi si fissano alla struttura a tetto aperto. Con la linea vita, ogni futura manutenzione sarà più semplice e più sicura.',
      },
    ],
    correlati: {
      servizi: ['manutenzione-tetto', 'verniciatura-tetto'],
      guide: ['costo-rifacimento-tetto', 'tetto-ventilato-coibentazione', 'tegole-coppi-lamiera'],
    },
  },

  {
    slug: 'manutenzione-tetto',
    metaTitle: 'Manutenzione Tetto e Riparazioni | MDA',
    metaDescription:
      'Manutenzione tetto e riparazioni mirate: sostituzione tegole, ricerca infiltrazioni, sigillature e pulizia del manto. Sopralluogo gratuito in Veneto e Friuli.',
    eyebrow: 'Il servizio',
    h1: 'Manutenzione tetto: riparazioni mirate prima che diventino cantieri',
    intro:
      'La manutenzione è l’intervento più redditizio che esista per una copertura: una tegola crepata oggi si sostituisce in mezza giornata, la stessa tegola lasciata dov’è diventa una porzione di tavolato da rifare dopo due inverni. Interveniamo su tutta l’area fra Veneto e Friuli-Venezia Giulia con riparazioni rapide e documentate.',
    sezioni: [
      {
        h2: 'Cosa ripariamo ogni settimana',
        paragrafi: [
          'Tegole e coppi rotti o scivolati, colmi con la malta sgretolata, sigillature secche attorno a camini e lucernari, scossaline sollevate dal vento, guaine puntualmente compromesse, canali ostruiti che tracimano. Sono i danni tipici che troviamo nei sopralluoghi, e quasi tutti si chiudono in una giornata di lavoro.',
          'Ogni riparazione parte dalla diagnosi sul manto, non da terra: saliamo, fotografiamo, vi mostriamo il problema reale e ripariamo solo ciò che serve. Se il tetto è a fine vita ve lo diciamo chiaramente, senza vendervi riparazioni che non hanno futuro.',
        ],
      },
      {
        h2: 'La ricerca delle infiltrazioni',
        paragrafi: [
          'La macchia sul soffitto non indica quasi mai il punto d’ingresso: l’acqua viaggia lungo membrane e travi anche per metri prima di affiorare. La nostra ricerca ripercorre il flusso a ritroso sul manto, ispeziona ogni attraversamento e nei casi ostinati usa la prova d’acqua controllata, zona per zona, fino alla conferma.',
          'Trovato il punto, la riparazione è mirata: conversa rifatta, tegole sostituite, sigillatura a regola d’arte. Niente interventi a tappeto pagati per nulla.',
        ],
      },
      {
        h2: 'Pulizia del manto e trattamento antimuschio',
        paragrafi: [
          'Il muschio non è solo estetica: trattiene umidità contro la tegola, la disgrega col gelo e ostruisce i canali. La rimozione corretta si fa con idropulizia a pressione controllata e trattamento biocida che uccide le spore, mai con la lancia ad alta pressione libera che erode la superficie del manto.',
          'Sui manti in cemento invecchiati, dopo la pulizia vale la pena valutare il ciclo di verniciatura protettiva: è il passaggio che allunga la vita del manto di altri quindici anni.',
        ],
      },
      {
        h2: 'In quanto tempo interveniamo e da cosa dipende la spesa',
        paragrafi: [
          'Una riparazione puntuale si chiude quasi sempre in mezza giornata o in una giornata di lavoro, con un impegno economico minimo rispetto a un rifacimento completo: è la ragione per cui conviene chiamarci alla prima tegola scivolata e non alla terza macchia sul soffitto. Per le urgenze con acqua in casa diamo priorità al sopralluogo e, dove serve, mettiamo subito in sicurezza con copertura provvisoria.',
          'Il preventivo è scritto anche per i lavori piccoli: cifra chiara prima di iniziare, fattura regolare dopo. La serietà non dipende dalla dimensione del cantiere.',
        ],
      },
    ],
    faq: [
      {
        q: 'Fate interventi urgenti per infiltrazioni attive?',
        a: 'Sì: le urgenze con acqua in casa hanno priorità sul calendario e nei casi seri mettiamo in sicurezza la zona con telo o copertura provvisoria in attesa della riparazione definitiva.',
      },
      {
        q: 'Sostituite anche solo poche tegole?',
        a: 'Certo, ed è anzi l’intervento che consigliamo di non rimandare: poche tegole oggi evitano il tavolato marcio domani. Nessun lavoro è troppo piccolo per essere fatto bene.',
      },
      {
        q: 'Come capisco se serve riparare o rifare?',
        a: 'La regola pratica: danni localizzati su un manto complessivamente sano si riparano; danni diffusi su un manto poroso e sfogliato sono il segnale del fine vita. Il sopralluogo vi dà una risposta onesta con foto alla mano, e se il tetto ha ancora anni davanti ve lo diciamo.',
      },
      {
        q: 'Rilasciate garanzia anche sulle riparazioni?',
        a: 'Sì, ogni riparazione ha la sua garanzia scritta sul lavoro eseguito. Se il problema riparato si ripresenta, torniamo noi, senza discussioni.',
      },
    ],
    correlati: {
      servizi: ['rifacimento-tetto', 'grondaie-lattonerie'],
      guide: ['infiltrazioni-tetto', 'manutenzione-programmata-tetto'],
    },
  },

  {
    slug: 'impermeabilizzazione-guaine',
    metaTitle: 'Impermeabilizzazione Tetti e Guaine | MDA',
    metaDescription:
      'Impermeabilizzazione di tetti piani, terrazzi e lastrici solari: guaine bituminose e membrane PVC o TPO, risvolti e scarichi curati. Preventivo gratuito.',
    eyebrow: 'Il servizio',
    h1: 'Impermeabilizzazione di tetti piani, terrazzi e lastrici solari',
    intro:
      'Su una copertura piana l’impermeabilizzazione è tutto: è l’unico strato fra il cielo e l’appartamento di sotto. Nove infiltrazioni su dieci nascono nei dettagli, cioè risvolti, scarichi e giunzioni, ed è esattamente lì che si concentra il nostro lavoro.',
    sezioni: [
      {
        h2: 'Guaina bituminosa o membrana sintetica',
        paragrafi: [
          'La doppia guaina bituminosa con finitura ardesiata resta la soluzione più diffusa: affidabile, riparabile, con un rapporto fra costo e durata onesto, fra i 15 e i 25 anni se posata a regola d’arte. Le membrane sintetiche in PVC o TPO, saldate ad aria calda, superano i 25 anni, pesano meno e si prestano ai tetti praticabili e alle geometrie complesse.',
          'La scelta dipende da uso della superficie, pendenze, budget e stato del supporto. Ve le proponiamo a confronto nel preventivo, con i pro e i contro scritti, non raccontati.',
        ],
      },
      {
        h2: 'I dettagli che decidono la tenuta',
        paragrafi: [
          'I risvolti verticali sui parapetti con la giusta altezza e il fissaggio meccanico in testa, i bocchettoni di scarico integrati a membrana e non semplicemente appoggiati, i giunti sormontati e saldati nel verso corretto dell’acqua, gli angoli rinforzati con pezzi speciali. Sono i punti dove i cantieri frettolosi risparmiano minuti e i proprietari pagano anni.',
          'Prima della consegna facciamo la verifica finale della superficie e dei punti critici, e sui lavori che lo richiedono la prova di tenuta con battente d’acqua: il collaudo che dimostra, non promette.',
        ],
      },
      {
        h2: 'Terrazzi praticabili e pavimentati',
        paragrafi: [
          'Sui terrazzi calpestabili l’impermeabilizzazione lavora sotto pavimento e massetto: rifarla significa gestire anche smontaggio e ripristino degli strati sopra. Progettiamo il pacchetto completo, con pendenze corrette verso gli scarichi, strato di separazione e finitura a scelta, dalla piastrella al galleggiante su supporti.',
          'Dove il pavimento esistente è sano valutiamo anche le soluzioni liquide armate, che impermeabilizzano sopra la superficie esistente senza demolizioni: non sono adatte ovunque, ma dove lo sono fanno risparmiare tempo e denaro.',
        ],
      },
      {
        h2: 'Tempi, durata e garanzia',
        paragrafi: [
          'Un lastrico solare condominiale medio si impermeabilizza fra i 4 e gli 8 giorni lavorativi in funzione di superficie e stratigrafia; un terrazzo privato anche in meno. Il meteo comanda: si lavora su superfici asciutte, ed è per questo che programmiamo con margini.',
          'La garanzia scritta di 10 anni copre il lavoro eseguito, e sui condomini consegniamo la documentazione nel formato che serve all’amministratore per il fascicolo e il riparto.',
        ],
      },
    ],
    faq: [
      {
        q: 'Si può posare la guaina nuova sopra quella vecchia?',
        a: 'A volte sì, se la vecchia è stabile, asciutta e ben ancorata: si risparmia smontaggio e smaltimento. Quando invece è imbolsata o umida va rimossa, perché ciò che resta sotto lavora contro il nuovo manto. Lo verifichiamo con saggi durante il sopralluogo.',
      },
      {
        q: 'Il terrazzo si può usare durante i lavori?',
        a: 'La zona di cantiere no, ma organizziamo le fasi per lasciare accessi e vie di passaggio dove possibile, soprattutto nei condomini. I tempi di ogni fase vi vengono comunicati prima.',
      },
      {
        q: 'Che manutenzione richiede una impermeabilizzazione?',
        a: 'Poca ma regolare: scarichi liberi da foglie, controllo annuale di risvolti e giunzioni, nessuna fioriera appoggiata sugli angoli della membrana. Con questo minimo, la durata dichiarata si raggiunge davvero.',
      },
      {
        q: 'Lavorate anche su coperture industriali piane?',
        a: 'Sì, su capannoni e coperture piane di attività: membrane sintetiche in teli di grande formato, fissaggio meccanico calcolato per il vento e cantiere organizzato per non fermare la produzione.',
      },
    ],
    correlati: {
      servizi: ['rifacimento-tetto', 'manutenzione-tetto'],
      guide: ['infiltrazioni-tetto', 'costo-rifacimento-tetto'],
    },
  },

  {
    slug: 'grondaie-lattonerie',
    metaTitle: 'Grondaie e Lattoneria su Misura | MDA',
    metaDescription:
      'Grondaie, pluviali, scossaline e converse piegate su misura in cantiere: rame, alluminio e zinco titanio. Installazione e sostituzione in Veneto e Friuli.',
    eyebrow: 'Il servizio',
    h1: 'Grondaie e lattoneria su misura, piegate in cantiere',
    intro:
      'La lattoneria è la difesa perimetrale della casa: canali, pluviali, scossaline e converse decidono dove va l’acqua quando lascia il manto. Le pieghiamo su misura in cantiere, in rame, alluminio o zinco titanio: meno giunti, pezzi che calzano al millimetro, impianti che durano decenni.',
    sezioni: [
      {
        h2: 'Perché su misura e non a catalogo',
        paragrafi: [
          'Ogni giunto di un impianto di gronda è un punto debole futuro: guarnizioni che invecchiano, sormonti che si aprono col movimento termico. Con la piegatrice in cantiere realizziamo canali e pezzi speciali nella lunghezza reale del fronte, riducendo i giunti al minimo fisico e adattando ogni raccordo alla geometria vera della casa.',
          'È la differenza fra montare un prodotto e costruire un impianto. Sul tetto si vede poco, negli anni si vede tutto.',
        ],
      },
      {
        h2: 'Rame, alluminio o zinco titanio',
        paragrafi: [
          'Il rame è il materiale nobile: giunzioni saldate a stagno, durata oltre i cinquant’anni, la patina che lo protegge da solo. L’alluminio preverniciato offre il miglior rapporto fra prezzo e durata per l’edilizia contemporanea, con decine di colori. Lo zinco titanio unisce la longevità dei nobili a un’estetica grigia contemporanea molto richiesta sulle architetture moderne.',
          'Vi proponiamo il materiale coerente con l’edificio e il budget, con sezioni e spessori scritti nel preventivo: sono i numeri che distinguono un impianto serio da uno qualsiasi.',
        ],
      },
      {
        h2: 'Dimensionamento per i temporali di oggi',
        paragrafi: [
          'I nubifragi del Nord-Est scaricano in mezz’ora l’acqua che un tempo cadeva in un pomeriggio: molti impianti dimensionati trent’anni fa oggi tracimano a ogni temporale serio. Calcoliamo sezione dei canali, numero e diametro dei pluviali sulla superficie reale delle falde servite, con le pendenze costanti che fanno correre l’acqua invece di lasciarla ristagnare.',
          'Nella sostituzione integriamo dove serve parafoglie rigidi, bocchettoni maggiorati e troppo pieni: i dettagli che nei temporali estremi fanno la differenza fra un impianto che regge e una facciata allagata.',
        ],
      },
      {
        h2: 'Scossaline, converse e finiture del tetto',
        paragrafi: [
          'Oltre ai canali realizziamo tutta la lattoneria di finitura: scossaline dei parapetti, converse dei camini, compluvi, copertine dei muretti, raccordi dei lucernari. Sono i punti dove il manto incontra gli ostacoli, e dove nascono quasi tutte le infiltrazioni: la qualità della piega e del fissaggio qui vale più che ovunque.',
          'Interveniamo sia in cantieri completi di rifacimento sia in sostituzioni dedicate della sola lattoneria, un lavoro che tipicamente si chiude in pochi giorni con un impatto minimo sulla casa.',
        ],
      },
    ],
    faq: [
      {
        q: 'Potete sostituire solo le grondaie senza toccare il tetto?',
        a: 'Sì, è un intervento a sé che facciamo spesso: si lavora dal bordo con piattaforma o ponteggio leggero. Se la prima fila di tegole merita una revisione, ve lo segnaliamo, perché è il momento più economico per farla.',
      },
      {
        q: 'Quanto dura la sostituzione completa su una villetta?',
        a: 'Di norma da 2 a 4 giorni lavorativi, piegatura in cantiere compresa. Sui condomini dipende dallo sviluppo dei fronti e dall’accessibilità, e il cronoprogramma è parte del preventivo.',
      },
      {
        q: 'Il rame si può montare vicino ad altri metalli?',
        a: 'Con attenzione sì: il contatto diretto fra rame e alluminio o acciaio zincato genera corrosione galvanica sul metallo meno nobile. Progettiamo i punti di contatto con separazioni e sormonti corretti, un dettaglio che i lattonieri esperti gestiscono d’istinto.',
      },
      {
        q: 'Fate anche la manutenzione degli impianti esistenti?',
        a: 'Sì: pulizia dei canali, ripristino delle pendenze, sigillatura o rifacimento dei giunti, sostituzione dei ganci. Molti impianti buoni si recuperano; quando non conviene più, ve lo diciamo con i numeri davanti.',
      },
    ],
    correlati: {
      servizi: ['manutenzione-tetto', 'rifacimento-tetto'],
      guide: ['grondaie-rame-guida', 'manutenzione-programmata-tetto'],
    },
  },

  {
    slug: 'verniciatura-tetto',
    metaTitle: 'Verniciatura Tetto in 4 Fasi | MDA',
    metaDescription:
      'Verniciatura e protezione del tetto in 4 fasi: lavaggio e biocida, ripristino, primer consolidante e doppia finitura. Il ciclo completo, non una mano di colore.',
    eyebrow: 'Il servizio',
    h1: 'Verniciatura tetto in 4 fasi: protezione vera, non una mano di colore',
    intro:
      'Un manto in tegole che si è opacizzato e ha iniziato ad assorbire acqua non è da rifare: è da proteggere, adesso. Il nostro ciclo in quattro fasi ferma il degrado, blocca il muschio e restituisce alla copertura idrorepellenza e colore per un altro decennio abbondante.',
    sezioni: [
      {
        h2: 'Le quattro fasi del ciclo',
        paragrafi: [
          'Uno: idropulizia profonda a pressione controllata, circa 250 bar, e trattamento biocida che uccide le spore di muschio e licheni annidate nelle porosità. Due: ripristino del substrato, con sostituzione delle tegole rotte e stuccatura delle crepe. Tre: primer consolidante ad alta penetrazione, che compatta la superficie e crea l’aggancio per la finitura. Quattro: doppia mano incrociata di finitura, applicata a spruzzo airless.',
          'Ogni fase esiste per una ragione tecnica e saltarne una si paga in stagioni, non in decenni: verniciare senza biocida significa sigillare il muschio vivo sotto la pellicola, e vederla sollevarsi a placche entro due o tre inverni.',
        ],
      },
      {
        h2: 'Finitura acrilica o silossanica',
        paragrafi: [
          'L’acrilica è la soluzione economica: buona pellicola idrorepellente, traspirabilità limitata. La silossanica, che consigliamo su quasi tutte le coperture, unisce le due proprietà che contano: respinge l’acqua liquida e lascia uscire il vapore, quindi lavora bene anche su manti che respirano.',
          'Per i sottotetti che soffrono il caldo esiste la versione riflettente in tinte chiare, che abbassa sensibilmente la temperatura del manto nelle ore di sole. Colori a campionario, in tinta con facciata e contesto, con verifica del regolamento comunale nei centri storici.',
        ],
      },
      {
        h2: 'Su quali tetti ha senso e su quali no',
        paragrafi: [
          'Il candidato giusto è il manto in tegole di cemento o laterizio strutturalmente sano: completo, senza infiltrazioni attive, con superficie opaca e porosa. Su tegole che si sfaldano a strati o su coperture con la membrana a fine vita, la verniciatura è denaro sprecato, e ve lo diciamo al sopralluogo senza girarci intorno.',
          'La visita serve proprio a questo: distinguere il tetto da proteggere dal tetto da riparare prima, e dal tetto per cui conviene accantonare per il rifacimento. Tre risposte diverse, tre spese molto diverse.',
        ],
      },
      {
        h2: 'Cantiere, tempi e garanzia',
        paragrafi: [
          'Su una villetta media il ciclo completo dura fra i 4 e i 6 giorni lavorativi, meteo permettendo: servono superfici asciutte e temperature miti, quindi la stagione utile va da tarda primavera a inizio autunno. Lavoriamo con linee vita temporanee o ponteggio secondo la copertura.',
          'A fine lavoro ricevete il report fotografico del ciclo applicato, fase per fase, e la garanzia scritta sul lavoro eseguito. Il prodotto dichiarato nel preventivo è quello che sale sul tetto: marca e scheda tecnica alla mano.',
        ],
      },
    ],
    faq: [
      {
        q: 'Quanto costa la verniciatura rispetto al rifacimento?',
        a: 'Molto meno, ed è esattamente il suo senso economico: si spende una frazione di quello che costerebbe rifare la copertura e si rimanda la spesa grande di una quindicina di anni. Quanto valga sul vostro tetto dipende da superficie, stato del manto e accessibilità, e lo scriviamo voce per voce nel preventivo dopo il sopralluogo, che è gratuito.',
      },
      {
        q: 'Il tetto cambia colore in modo uniforme?',
        a: 'Sì: la doppia mano a spruzzo copre in modo omogeneo anche manti con tegole sbiadite a macchia. Il campione colore si approva prima dell’applicazione, sulla vostra copertura reale.',
      },
      {
        q: 'Quanto dura il trattamento?',
        a: 'Su supporto sano e con ciclo completo, dai 12 ai 18 anni in funzione dell’esposizione. Le zone d’ombra con ricrescita di muschio si trattano puntualmente durante i normali controlli di manutenzione.',
      },
      {
        q: 'Verniciate anche coppi antichi o lamiere?',
        a: 'Sui coppi antichi in cotto sconsigliamo la pellicola coprente: meglio pulizia e idrorepellente trasparente che preserva la patina. Sulle lamiere usiamo cicli specifici per metallo, con primer dedicato: è un lavoro diverso ma lo facciamo.',
      },
    ],
    correlati: {
      servizi: ['manutenzione-tetto', 'rifacimento-tetto'],
      guide: ['verniciatura-tetto-guida', 'manutenzione-programmata-tetto'],
    },
  },
]

/** Ricerca rapida per slug. */
export const servizioPerSlug = (slug: string) => serviziPagine.find((s) => s.slug === slug)
