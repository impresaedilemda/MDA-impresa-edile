/* ===========================================================================
 *  GUIDE ALLE COPERTURE
 *  Otto pagine di approfondimento, ognuna su un gruppo di ricerche reali del
 *  settore. Testi utili e specifici, non riempitivo: e cio che fa uscire un
 *  sito nelle panoramiche AI e nei risultati organici.
 *  Regole: niente temi fiscali, niente trattini lunghi, accenti corretti.
 * ======================================================================== */

export type PaginaSEO = {
  slug: string
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  intro: string
  sezioni: { h2: string; paragrafi: string[] }[]
  faq: { q: string; a: string }[]
  correlati: { servizi: string[]; guide: string[] }
}

export const guide: PaginaSEO[] = [
  {
    slug: 'costo-rifacimento-tetto',
    metaTitle: 'Costo Rifacimento Tetto: da Cosa Dipende Davvero',
    metaDescription:
      'Quanto costa rifare un tetto: cosa incide davvero sul prezzo al metro quadro fra tegole, coppi e lamiera, quali voci deve contenere il computo metrico e come leggere un preventivo serio.',
    eyebrow: 'Guida ai costi',
    h1: 'Quanto costa rifare un tetto: i fattori che decidono il preventivo',
    intro:
      'Due tetti della stessa metratura possono avere preventivi molto distanti, e la differenza quasi mai sta nel margine dell’impresa: sta in cinque voci che si misurano solo salendo sulla copertura. Lo stato della struttura portante, il tipo di manto, il pacchetto isolante, l’accessibilità del cantiere e le lattonerie. Un preventivo serio le mette nero su bianco una per una.',
    sezioni: [
      {
        h2: 'Quanto pesa il tipo di manto sul costo finale',
        paragrafi: [
          'A parità di pacchetto isolante, le tegole in laterizio o cemento restano la soluzione più contenuta: prodotto diffuso, posa rapida, ricambi reperibili ovunque. I coppi tradizionali salgono, perché la posa è più lenta e spesso una parte dei coppi vecchi si recupera come strato di coperta, il che richiede selezione manuale pezzo per pezzo. La lamiera aggraffata è la più impegnativa delle tre, soprattutto nelle finiture in zinco titanio: incide il materiale, ma incide molto di più la manodopera specializzata di lattoneria.',
          'Su un tetto piano il confronto cambia del tutto. Il rifacimento dell’impermeabilizzazione con doppia guaina bituminosa resta la via più economica, mentre una membrana sintetica in PVC o TPO richiede un investimento maggiore, sia nel materiale sia nella saldatura eseguita da posatori certificati. Sono lavorazioni diverse da un tetto a falde e vanno confrontate solo fra loro, mai con il prezzo di una copertura in tegole.',
        ],
      },
      {
        h2: 'I cinque fattori che spostano davvero il prezzo',
        paragrafi: [
          'Primo: lo stato della struttura portante. Se travi e tavolato sono sani si lavora sopra; se il legno è marcito in gronda o attorno al camino, il ripristino strutturale diventa una voce a sé che da sola può pesare quanto una parte consistente del manto nuovo. Secondo: il tipo di manto, di cui abbiamo appena visto il peso fra tegole, coppi e lamiera. Terzo: il pacchetto isolante, perché 12 centimetri di lana di roccia costano meno di 20 di fibra di legno ad alta densità, e con l’isolante va contata la ventilazione, cioè listellatura doppia e colmo ventilato.',
          'Quarto: l’accessibilità del cantiere. Un tetto a due falde su una villetta con giardino permette ponteggio e gru senza problemi; un centro storico con vicoli stretti impone piattaforme, permessi di occupazione suolo e tempi doppi di movimentazione. Quinto: le lattonerie, la voce più sottovalutata dei preventivi bassi, perché canali, scossaline e converse in rame pesano sul totale molto più di quanto ci si aspetti, ed è quasi sempre la prima riga che viene alleggerita per far scendere il numero finale.',
        ],
      },
      {
        h2: 'Come leggere un computo metrico serio',
        paragrafi: [
          'Un preventivo affidabile elenca le voci separate: smontaggio e smaltimento del vecchio manto, eventuale ripristino strutturale a misura, barriera al vapore, isolamento con spessore e marca dichiarati, listellatura, manto nuovo con modello preciso, lattonerie al metro lineare, ponteggio e sicurezza, e l’aliquota IVA applicata. Se leggete una riga sola con un prezzo a corpo, non avete modo di confrontare nulla e ogni imprevisto diventerà un extra.',
          'Nel nostro metodo il computo è analitico e il prezzo firmato è bloccato: gli imprevisti strutturali documentati si concordano per iscritto prima di proseguire, mai a voce durante i lavori.',
        ],
      },
      {
        h2: 'La trappola del preventivo troppo basso',
        paragrafi: [
          'Un preventivo molto più basso degli altri che avete raccolto di solito nasconde una di queste tre cose: lo smaltimento non incluso, che riappare a fine cantiere come sorpresa; l’isolamento sottodimensionato o assente, che si paga per vent’anni in bolletta; oppure manodopera in subappalto a cottimo, dove la velocità conta più della posa corretta. Un tetto rifatto male costa due volte: la seconda quando lo si rifà davvero.',
          'Il modo più semplice per proteggersi è chiedere a ogni impresa lo stesso elenco di voci e confrontare riga per riga. Le differenze vere emergono subito.',
        ],
      },
      {
        h2: 'Prezzo al metro quadro: quanto incidono dimensione e forma del tetto',
        paragrafi: [
          'Il prezzo al metro quadro scende leggermente sulle superfici grandi, perché ponteggio e organizzazione pesano meno per unità. Sale invece con la complessità: abbaini, compluvi, torrette e falde spezzate moltiplicano tagli, converse e punti critici. Una falda ampia e regolare può costare meno al metro quadro di una superficie più piccola ma piena di abbaini e compluvi.',
          'Per questo diffidiamo delle cifre date al telefono: senza salire sulla copertura e misurare falde, punti critici e stato del legno, qualsiasi numero è una scommessa. Il nostro sopralluogo con preventivo scritto è gratuito proprio per togliere questa incertezza.',
        ],
      },
    ],
    faq: [
      {
        q: 'Lo smaltimento del vecchio manto è incluso nel preventivo?',
        a: 'Nei nostri computi sì, ed è così che dovrebbe essere in ogni preventivo serio: lo smaltimento in discarica autorizzata con formulario è una voce esplicita, con la sua quantità e la sua riga. Se un preventivo non la cita, chiedete dove andrà a finire il materiale rimosso e chi lo paga.',
      },
      {
        q: 'Il prezzo firmato può cambiare durante i lavori?',
        a: 'Nel nostro metodo no: il computo metrico firmato è bloccato. Se aprendo il tetto emerge un danno strutturale non visibile prima, documentiamo con foto, quantifichiamo per iscritto e proseguiamo solo dopo la vostra approvazione.',
      },
      {
        q: 'I prezzi del preventivo sono IVA inclusa?',
        a: 'Nel nostro computo metrico l’aliquota IVA applicata è sempre indicata in modo esplicito, così sapete da subito come leggere le cifre che confrontate. L’aliquota corretta dipende dal tipo di intervento e dall’immobile, e la verifichiamo per il vostro caso in fase di preventivo.',
      },
      {
        q: 'Conviene rifare il tetto insieme ad altri lavori di casa?',
        a: 'Spesso sì, per una ragione pratica: il ponteggio. Montarlo una volta sola per tetto e facciata fa risparmiare per intero una delle voci più pesanti del computo. Se avete in programma entrambi gli interventi, pianificarli insieme è quasi sempre la scelta giusta.',
      },
      {
        q: 'Chiedete un acconto? Come funzionano i pagamenti?',
        a: 'I pagamenti seguono l’avanzamento del cantiere per stati di avanzamento concordati nel contratto, con fatturazione regolare a ogni tappa. Nessun saldo integrale anticipato: pagate ciò che è stato effettivamente eseguito.',
      },
    ],
    correlati: {
      servizi: ['rifacimento-tetto', 'impermeabilizzazione-guaine'],
      guide: ['tegole-coppi-lamiera', 'tetto-ventilato-coibentazione'],
    },
  },

  {
    slug: 'infiltrazioni-tetto',
    metaTitle: 'Infiltrazioni dal Tetto: Cause e Cosa Fare Subito',
    metaDescription:
      'Infiltrazioni dal tetto: i segnali d’allarme, perché la macchia non indica il punto d’ingresso, come si trova la vera origine e cosa succede se si aspetta.',
    eyebrow: 'Guida alle infiltrazioni',
    h1: 'Infiltrazioni dal tetto: come nascono e come si trovano davvero',
    intro:
      'La macchia sul soffitto è solo l’ultimo capitolo di una storia iniziata mesi prima, quasi mai nel punto in cui la vedete. Capire come l’acqua viaggia dentro una copertura è la differenza fra una riparazione mirata e mesi di tentativi a vuoto.',
    sezioni: [
      {
        h2: 'Perché la macchia non indica il punto d’ingresso',
        paragrafi: [
          'L’acqua che supera il manto non cade in verticale: scorre lungo la membrana, segue i listelli, corre dentro le onde della guaina e scende lungo i puntoni finché non trova un giunto, un foro di chiodo o una trave dove fermarsi e gocciolare. Fra il punto d’ingresso sul tetto e la macchia in casa possono esserci anche cinque o sei metri in orizzontale.',
          'Per questo sigillare il soffitto o la zona di tetto sopra la macchia raramente risolve: si sposta solo il percorso dell’acqua. La ricerca seria parte dal manto, non dal soffitto.',
        ],
      },
      {
        h2: 'I segnali d’allarme da non ignorare',
        paragrafi: [
          'Aloni giallastri che si allargano dopo ogni pioggia intensa, pittura che si gonfia a bolle, odore di umido nel sottotetto, muffa negli angoli alti delle stanze all’ultimo piano, legno scurito attorno al camino. Ognuno di questi segnali dice che l’acqua entra già da tempo: le prime settimane di infiltrazione sono quasi sempre invisibili dall’interno.',
          'D’inverno un segnale in più è il ghiaccio: se sulla falda si formano lame di ghiaccio in gronda, l’isolamento perde calore in modo non uniforme e lo scioglimento ricongelato può forzare l’acqua sotto le tegole.',
        ],
      },
      {
        h2: 'Dove entra l’acqua: i punti critici ricorrenti',
        paragrafi: [
          'Nei nostri cantieri i colpevoli sono quasi sempre gli stessi: le converse attorno ai camini con la sigillatura secca o la scossalina scollata; i compluvi dove due falde si incontrano e l’acqua corre concentrata; le tegole rotte o spostate dal vento; i lucernari con le guarnizioni invecchiate; le grondaie ostruite che fanno tracimare l’acqua all’indietro sotto la prima fila di tegole.',
          'Su tetti piani il punto debole sono i risvolti verticali della guaina sui parapetti e gli scarichi: quando il bocchettone si stacca dalla membrana, l’acqua entra direttamente nel pacchetto.',
        ],
      },
      {
        h2: 'Come si trova il punto esatto',
        paragrafi: [
          'La ricerca comincia salendo sul tetto e ripercorrendo il flusso dell’acqua a ritroso dal punto della macchia verso il colmo, ispezionando ogni attraversamento: camini, antenne, lucernari, compluvi. Fotografiamo ogni anomalia e, nei casi ostinati, facciamo una prova d’acqua controllata bagnando una zona per volta finché l’ingresso non si conferma.',
          'Solo a quel punto ha senso riparare: sostituire le tegole compromesse, rifare la conversa, sigillare a regola d’arte. Una riparazione mirata si esaurisce spesso in mezza giornata di lavoro e costa una frazione di un rifacimento completo: fatta bene, chiude la storia per anni.',
        ],
      },
      {
        h2: 'Cosa succede se si aspetta',
        paragrafi: [
          'Il legno bagnato non si asciuga mai del tutto dentro un pacchetto di copertura: marcisce. Una trave che oggi si risana con un intervento puntuale, dopo due inverni può richiedere il ripristino strutturale di un’intera porzione di falda. L’isolamento bagnato perde gran parte del potere isolante e non lo recupera: si sostituisce.',
          'La regola pratica è semplice: alla prima macchia che si allarga dopo la pioggia, far salire qualcuno sul tetto entro poche settimane. È l’intervento con il miglior rapporto fra tempestività e risparmio di tutta l’edilizia.',
        ],
      },
    ],
    faq: [
      {
        q: 'In quanto tempo intervenite per un’infiltrazione attiva?',
        a: 'Per le urgenze con acqua in casa cerchiamo di fare il sopralluogo entro pochi giorni lavorativi e, dove serve, mettiamo subito in sicurezza la zona con una copertura provvisoria in attesa della riparazione definitiva.',
      },
      {
        q: 'Come distinguo un’infiltrazione dalla condensa?',
        a: 'La condensa compare nei mesi freddi, in modo diffuso e spesso negli stessi punti ogni mattina, tipicamente su ponti termici. L’infiltrazione si attiva con la pioggia e si allarga dopo ogni evento. Il sopralluogo distingue i due casi in pochi minuti, e le soluzioni sono completamente diverse.',
      },
      {
        q: 'L’assicurazione casa copre i danni da infiltrazione?',
        a: 'Dipende dalla polizza: molte coprono i danni causati ai locali ma non la riparazione della copertura stessa. Vi forniamo relazione fotografica e preventivo dettagliato, che sono i documenti che la compagnia chiede per aprire la pratica.',
      },
      {
        q: 'Si può riparare d’inverno o bisogna aspettare?',
        a: 'Le riparazioni puntuali si fanno tutto l’anno, basta una finestra di tempo asciutto. Anzi, aspettare la primavera con un ingresso d’acqua attivo è la scelta peggiore: ogni pioggia aggiunge danno alla struttura.',
      },
    ],
    correlati: {
      servizi: ['manutenzione-tetto', 'impermeabilizzazione-guaine'],
      guide: ['manutenzione-programmata-tetto', 'grondaie-rame-guida'],
    },
  },

  {
    slug: 'tetto-ventilato-coibentazione',
    metaTitle: 'Tetto Ventilato e Coibentazione: Come Funziona',
    metaDescription:
      'Tetto ventilato e coibentazione: la camera d’aria, i materiali isolanti a confronto, gli spessori giusti per il Nord-Est e il problema della condensa.',
    eyebrow: 'Guida tecnica',
    h1: 'Tetto ventilato e coibentazione: come funzionano e perché convengono',
    intro:
      'Un tetto ben isolato ma senza ventilazione è un lavoro a metà: trattiene il calore d’inverno ma cuoce il sottotetto d’estate e rischia condensa nelle stagioni di mezzo. La camera d’aria sotto il manto è il dettaglio che trasforma una copertura corretta in una copertura eccellente.',
    sezioni: [
      {
        h2: 'Come funziona la camera di ventilazione',
        paragrafi: [
          'Il tetto ventilato ha un’intercapedine continua di almeno 4 centimetri, meglio 6, fra l’isolante e il manto, aperta in gronda e in colmo. L’aria entra dal basso, si scalda a contatto con le tegole e sale per effetto camino uscendo dal colmo ventilato: un flusso costante che d’estate smaltisce il calore prima che attraversi l’isolante e d’inverno porta via il vapore che migra dagli ambienti riscaldati.',
          'Il risultato misurabile: nei mesi caldi la temperatura all’intradosso può scendere sensibilmente rispetto a un tetto non ventilato, e nei mesi freddi l’isolante resta asciutto, quindi mantiene le prestazioni dichiarate. Un isolante umido lavora male, qualunque sia il materiale.',
        ],
      },
      {
        h2: 'I materiali isolanti a confronto',
        paragrafi: [
          'La lana di roccia è l’equilibrio più comune: buon isolamento invernale, ottimo comportamento al fuoco, prezzo ragionevole. La fibra di legno ad alta densità costa di più ma ha uno sfasamento termico superiore, cioè ritarda di parecchie ore l’ingresso del caldo estivo: sotto le falde abitate è la scelta che si sente di più in agosto. I pannelli sintetici come XPS e poliuretano isolano molto per centimetro e servono dove lo spessore disponibile è poco, ma d’estate lavorano peggio dei materiali massivi.',
          'Non esiste il materiale migliore in assoluto: esiste quello giusto per la stratigrafia, il budget e l’uso del sottotetto. Una mansarda abitata e un solaio freddo non si isolano allo stesso modo.',
        ],
      },
      {
        h2: 'Gli spessori giusti nel clima del Nord-Est',
        paragrafi: [
          'Fra Veneto e Friuli-Venezia Giulia gli inverni sono umidi e le estati sempre più calde: per una falda su ambiente abitato lavoriamo di norma fra 16 e 24 centimetri di isolante, in funzione del materiale e della stratigrafia esistente. Sotto i 12 centimetri su una mansarda abitata si sente, sia in bolletta sia in comfort.',
          'Lo spessore va sempre ragionato insieme alla ventilazione e al freno vapore: 20 centimetri posati senza gestione del vapore possono dare più problemi di 16 posati correttamente.',
        ],
      },
      {
        h2: 'Condensa e muffe: il nemico silenzioso',
        paragrafi: [
          'Il vapore prodotto in casa migra verso l’alto e attraversa i materiali. Se incontra una superficie fredda prima di poter uscire, condensa: gocce dentro il pacchetto, isolante bagnato, legno che ammuffisce. Il freno al vapore sul lato caldo, i nastri di sigillatura sui giunti e la camera ventilata sopra l’isolante sono i tre elementi che tengono il pacchetto asciutto.',
          'È il motivo per cui i tetti rifatti a risparmio, senza freno vapore e senza ventilazione, mostrano muffa al primo o al secondo inverno: non è sfortuna, è fisica.',
        ],
      },
      {
        h2: 'Quando conviene intervenire',
        paragrafi: [
          'Il momento ideale per coibentare e ventilare è il rifacimento del manto: il tetto è già aperto, il ponteggio già montato, e il sovrapprezzo del pacchetto completo si ripaga negli anni con i consumi. Rifare un tetto senza approfittarne per isolare correttamente è un’occasione persa che non torna per trent’anni.',
          'Se il manto è ancora buono, in alcuni casi si può isolare dall’interno o sull’estradosso del solaio del sottotetto non abitato: soluzioni meno invasive che valutiamo durante il sopralluogo gratuito.',
        ],
      },
    ],
    faq: [
      {
        q: 'Si può ventilare un tetto esistente senza rifarlo?',
        a: 'In modo completo no: la camera di ventilazione si crea con la doppia listellatura durante il rifacimento. Su tetti esistenti si può migliorare l’aerazione con colmi ventilati e griglie in gronda, ma è un palliativo rispetto a una ventilazione progettata.',
      },
      {
        q: 'Che differenza c’è fra barriera e freno al vapore?',
        a: 'La barriera blocca quasi del tutto il passaggio del vapore, il freno lo regola lasciando respirare la struttura. Nei tetti in legno del Nord-Est si usa quasi sempre il freno al vapore igrovariabile, che adatta la sua resistenza alla stagione.',
      },
      {
        q: 'La fibra di legno teme l’umidità?',
        a: 'Gestita correttamente no: i pannelli usati oggi sono idrofobizzati e dentro una stratigrafia con freno vapore e ventilazione lavorano asciutti per decenni. Il problema nasce solo nei pacchetti costruiti male, e in quel caso nessun materiale si salva.',
      },
      {
        q: 'Quanto si risparmia in bolletta con un tetto coibentato?',
        a: 'Dipende da casa e impianto, ma il tetto è di solito la prima voce di dispersione di una casa datata. Su edifici con sottotetto abitato e copertura non isolata, il salto di comfort e di consumi dopo il rifacimento coibentato è quello che i clienti notano di più al primo inverno.',
      },
    ],
    correlati: {
      servizi: ['rifacimento-tetto'],
      guide: ['costo-rifacimento-tetto', 'tegole-coppi-lamiera'],
    },
  },

  {
    slug: 'rimozione-amianto-eternit',
    metaTitle: 'Rimozione Amianto dal Tetto: Iter e Regole',
    metaDescription:
      'Rimozione amianto ed eternit dal tetto: quando è obbligatoria, chi può eseguirla, come funzionano piano di lavoro e smaltimento, con cosa si sostituisce.',
    eyebrow: 'Guida alla bonifica',
    h1: 'Rimozione amianto ed eternit dal tetto: come funziona la bonifica fatta bene',
    intro:
      'Le lastre in cemento-amianto posate fino agli anni Ottanta coprono ancora capannoni, ricoveri agricoli e qualche abitazione. Finché sono integre non emettono fibre, ma il degrado da gelo, grandine e muschio le rende friabili: da lì la bonifica non è più una scelta estetica.',
    sezioni: [
      {
        h2: 'Quando la rimozione è necessaria',
        paragrafi: [
          'Non esiste un obbligo generalizzato di rimuovere l’eternit integro, ma esiste l’obbligo di valutarne lo stato di conservazione e di intervenire quando è degradato. Lastre con superficie sfibrata, muschio radicato, crepe, bordi sbriciolati o affioramento evidente dei fasci di fibre sono i segnali che gli enti sanitari considerano critici.',
          'La valutazione si fa con un sopralluogo e, nei casi dubbi, con l’indice di degrado documentato fotograficamente. Su edifici in vendita o in ristrutturazione, la presenza di amianto va comunque dichiarata e gestita.',
        ],
      },
      {
        h2: 'Chi può eseguire la bonifica e con quale iter',
        paragrafi: [
          'La rimozione può essere eseguita solo da imprese iscritte all’apposita categoria dell’Albo Gestori Ambientali, con personale formato e sorveglianza sanitaria. Prima del cantiere si presenta un piano di lavoro all’organo di vigilanza territoriale, che descrive metodologia, protezioni, confinamento e destinazione dei rifiuti.',
          'In cantiere le lastre si trattano con incapsulante, si smontano intere senza romperle, si calano a terra senza scivoli e si confezionano in pallet sigillati ed etichettati. Ogni carico viaggia con formulario e la filiera si chiude con la quarta copia che certifica l’avvenuto smaltimento in impianto autorizzato.',
        ],
      },
      {
        h2: 'Incapsulamento e sovracopertura: le alternative',
        paragrafi: [
          'Quando le lastre sono ancora in condizioni discrete, la normativa ammette l’incapsulamento con prodotti certificati che bloccano il rilascio di fibre, oppure la sovracopertura con un nuovo manto metallico posato sopra l’esistente. Costano meno della rimozione, ma non eliminano il problema: lo congelano, con obbligo di controlli periodici e con il nodo che prima o poi la rimozione andrà comunque fatta.',
          'Il nostro consiglio onesto: sulle coperture a fine vita la rimozione con sostituzione è quasi sempre la scelta economicamente più sensata sul ciclo di vita dell’edificio.',
        ],
      },
      {
        h2: 'Con cosa si sostituisce una copertura in eternit',
        paragrafi: [
          'Su capannoni e ricoveri la sostituzione tipica è il pannello sandwich coibentato: leggero, veloce da posare, isolato di serie e adatto alle pendenze basse. Sulle abitazioni si valuta caso per caso fra pannello, lamiera aggraffata e manto in tegole, in base a struttura, pendenza e contesto.',
          'La sostituzione è anche l’occasione per correggere i difetti storici di queste coperture: niente isolamento, condensa a gocce nei mesi freddi, lucernari opachi. Il salto di qualità per chi lavora o vive sotto è immediato.',
        ],
      },
      {
        h2: 'Tempi e documenti che restano al committente',
        paragrafi: [
          'Fra presentazione del piano di lavoro, attesa tecnica e cantiere, una bonifica media si chiude in poche settimane; la rimozione fisica delle lastre su un capannone standard dura pochi giorni. A fine lavori il committente riceve i formulari con quarta copia e la documentazione fotografica: è il fascicolo che dimostra, anche in caso di vendita futura, che la bonifica è stata eseguita a norma.',
          /* La rimozione dell’amianto e riservata alle imprese iscritte
             all’Albo Gestori Ambientali: qui si dichiara esattamente quale
             parte eseguiamo noi e quale spetta all’impresa abilitata. */
          'Vi restiamo accanto lungo tutto il percorso: valutazione dello stato delle lastre, raccordo con l’impresa iscritta all’Albo Gestori Ambientali che esegue la bonifica, e poi la nuova copertura posata dalla nostra squadra interna a cantiere bonificato. Un solo interlocutore per voi, invece di due imprese da mettere d’accordo.',
        ],
      },
    ],
    faq: [
      {
        q: 'Come faccio a sapere se il mio tetto contiene amianto?',
        a: 'Le coperture ondulate grigie posate prima del 1994 sono le principali indiziate. La conferma si ha con l’analisi di un campione in laboratorio accreditato: un accertamento rapido che organizziamo noi durante la valutazione.',
      },
      {
        q: 'Posso rimuovere da solo poche lastre del mio capanno?',
        a: 'No. Anche piccole quantità richiedono impresa abilitata, piano di lavoro e smaltimento tracciato: il fai da te espone a fibre pericolose e a sanzioni rilevanti, e i frammenti abbandonati diventano un problema ambientale serio.',
      },
      {
        q: 'Il muschio sull’eternit è pericoloso?',
        a: 'È uno degli acceleratori di degrado peggiori: le radici disgregano la superficie del cemento e liberano le fibre. Un tetto in eternit coperto di muschio è tipicamente un tetto da bonificare, non da pulire, perché l’idropulizia su amianto è vietata.',
      },
      {
        q: 'Durante la rimozione devo lasciare l’edificio?',
        a: 'Di norma no: il lavoro avviene all’esterno con l’area di cantiere confinata e le lastre trattate a umido con incapsulante. Le prescrizioni specifiche vengono definite nel piano di lavoro approvato prima dell’apertura del cantiere.',
      },
    ],
    correlati: {
      servizi: ['rifacimento-tetto', 'impermeabilizzazione-guaine'],
      guide: ['costo-rifacimento-tetto', 'manutenzione-programmata-tetto'],
    },
  },

  {
    slug: 'tegole-coppi-lamiera',
    metaTitle: 'Tegole, Coppi o Lamiera: Quale Copertura Scegliere',
    metaDescription:
      'Tegole, coppi o lamiera aggraffata: confronto onesto fra i manti di copertura per durata, peso, pendenze minime, estetica e costi. Quando conviene ciascuno.',
    eyebrow: 'Guida ai materiali',
    h1: 'Tegole, coppi o lamiera: il confronto onesto fra i manti di copertura',
    intro:
      'Non esiste il manto migliore: esiste quello giusto per la pendenza della falda, il peso che la struttura può portare, il contesto in cui sta la casa e gli anni di servizio che vi aspettate. Ecco il confronto come lo faremmo a voce durante un sopralluogo.',
    sezioni: [
      {
        h2: 'Tegole in laterizio e cemento: lo standard che funziona',
        paragrafi: [
          'La tegola portoghese o marsigliese in laterizio è il compromesso più equilibrato dell’edilizia residenziale: dura dai 40 ai 60 anni, si ripara pezzo per pezzo, ha un costo di posa contenuto e un mercato di ricambi praticamente eterno. Le tegole in cemento costano un po’ meno e pesano un po’ di più, con una resa estetica più uniforme.',
          'Il limite è la pendenza: sotto il 30 per cento circa la tenuta all’acqua dipende sempre più dalla membrana sottostante, e sotto certe soglie il manto in tegole semplicemente non è più il prodotto giusto.',
        ],
      },
      {
        h2: 'Coppi: la scelta dei centri storici',
        paragrafi: [
          'Il coppo è il manto delle case venete e friulane di una volta, e in molti centri storici è di fatto obbligato dai regolamenti edilizi. Posato bene su schermo impermeabile moderno dura generazioni, e il coppo antico recuperato come strato superiore dà alla copertura una patina che nessun materiale nuovo imita davvero.',
          'Va messo in conto un costo di posa superiore, il peso rilevante e una manutenzione più frequente: i coppi si muovono con vento e gelo più delle tegole aggraffate ai listelli, e il controllo periodico dei ganci fa parte del gioco.',
        ],
      },
      {
        h2: 'Lamiera aggraffata: pendenze basse e linee moderne',
        paragrafi: [
          'La lamiera a doppia aggraffatura in alluminio, acciaio o zinco titanio tiene l’acqua anche su pendenze minime dove tegole e coppi non possono arrivare, pesa pochissimo e asseconda geometrie contemporanee e falde lunghe senza giunti trasversali. La durata dei metalli nobili supera i 50 anni con manutenzione minima.',
          'I contro onesti: il costo, la sensibilità estetica ad ammaccature da grandine forte, la rumorosità della pioggia se il pacchetto sottostante non è ben coibentato, e il fatto che la posa richiede lattonieri specializzati, non generici posatori.',
        ],
      },
      {
        h2: 'Peso, struttura e grandine: i vincoli concreti',
        paragrafi: [
          'Un manto in coppi con sottocoppo pesa dai 70 ai 90 chili al metro quadro, le tegole fra 40 e 50, la lamiera meno di 10. Su strutture datate o orditure leggere questa differenza decide da sola: alleggerire la copertura durante un rifacimento riduce il carico permanente e migliora il comportamento dell’edificio.',
          'Quanto alla grandine, sempre più frequente nel Nord-Est: il laterizio di qualità e i metalli spessi si difendono bene, i materiali economici e le lastre sottili no. È una domanda da fare esplicitamente su ogni prodotto, con la classe di resistenza alla mano.',
        ],
      },
      {
        h2: 'Come scegliamo insieme il manto giusto',
        paragrafi: [
          'Durante il sopralluogo misuriamo pendenze, verifichiamo la struttura e il contesto normativo del comune, poi restringiamo il campo a due opzioni con prezzi comparati voce per voce. Spesso la risposta è ovvia già dalla pendenza; quando non lo è, contano gli anni che pensate di restare nella casa e il budget di manutenzione che volete sostenere.',
          'Qualunque manto scegliate, la regola non cambia: la copertura tiene per lo strato che non si vede, cioè membrana, listellatura e lattonerie. Il manto è la pelle, non lo scheletro.',
        ],
      },
    ],
    faq: [
      {
        q: 'Qual è la pendenza minima per un tetto in tegole?',
        a: 'Indicativamente il 30 per cento per una posa standard; sotto questa soglia servono accorgimenti specifici e sotto ancora si passa a manti continui o metallici. La valutazione esatta dipende da esposizione al vento, lunghezza della falda e prodotto scelto.',
      },
      {
        q: 'Si possono riutilizzare i miei vecchi coppi?',
        a: 'Spesso sì, ed è una pratica che valorizza la casa: i coppi sani si selezionano a mano e si riposano come strato di coperta sopra elementi nuovi. Contate un recupero tipico fra il 40 e il 70 per cento, in base all’età e allo stato del manto.',
      },
      {
        q: 'La lamiera rende la casa più calda d’estate?',
        a: 'Il metallo scalda in superficie ma conta ciò che sta sotto: con ventilazione e coibentazione corrette, un tetto in lamiera ben progettato è fresco quanto uno in tegole. Senza pacchetto adeguato, qualsiasi manto scalda.',
      },
      {
        q: 'Posso cambiare tipo di manto rispetto a quello attuale?',
        a: 'Tecnicamente quasi sempre, normativamente dipende dal comune: nei centri storici il manto è spesso vincolato. Verifichiamo il regolamento edilizio del vostro comune durante il sopralluogo e vi diciamo subito cosa è ammesso.',
      },
    ],
    correlati: {
      servizi: ['rifacimento-tetto', 'grondaie-lattonerie'],
      guide: ['costo-rifacimento-tetto', 'tetto-ventilato-coibentazione'],
    },
  },

  {
    slug: 'manutenzione-programmata-tetto',
    metaTitle: 'Manutenzione Programmata del Tetto: la Checklist',
    metaDescription:
      'Manutenzione programmata del tetto: cosa controllare ogni anno e in quale stagione, la checklist del sopralluogo e perché i piccoli danni diventano grandi.',
    eyebrow: 'Guida alla prevenzione',
    h1: 'Manutenzione programmata del tetto: la checklist che evita i danni grossi',
    intro:
      'Quasi nessun tetto crolla di colpo: si consuma in silenzio, un inverno alla volta, finché quello che era un intervento da mezza giornata non è diventato un cantiere con ponteggio e settimane di lavoro. Il controllo annuale è la polizza più economica che una copertura possa avere.',
    sezioni: [
      {
        h2: 'Quando controllare: il calendario giusto',
        paragrafi: [
          'Il momento migliore è l’autunno, prima delle piogge lunghe: si sistemano i danni dell’estate, si liberano le grondaie dalle foglie e si arriva all’inverno con la copertura pronta. Un secondo controllo ha senso a primavera dopo gelate e neve, e uno straordinario dopo ogni grandinata seria o tempesta di vento.',
          'Fra Veneto e Friuli i temporali estivi con raffiche e grandine sono ormai la prima causa di danni puntuali: un controllo tempestivo dopo l’evento distingue il danno estetico da quello che farà entrare acqua al primo autunno.',
        ],
      },
      {
        h2: 'La checklist del controllo annuale',
        paragrafi: [
          'Sul manto: tegole o coppi rotti, scivolati o mancanti, colmi con malta sgretolata, muschio nelle zone in ombra. Sulle lattonerie: grondaie con foglie e detriti, pendenze che ristagnano, giunti che gocciolano, scossaline sollevate dal vento. Sui punti critici: sigillature di camini e lucernari, converse, antenne e i loro fissaggi.',
          'Nel sottotetto, se accessibile: aloni sul tavolato, odore di umido, ragnatele bagnate, luce che filtra dove non dovrebbe. Dieci minuti nel sottotetto dicono spesso più di un’ora sul manto.',
        ],
      },
      {
        h2: 'Perché i piccoli danni diventano grandi',
        paragrafi: [
          'Una tegola crepata lascia passare poca acqua: troppo poca per vederla in casa, abbastanza per bagnare listello e membrana a ogni pioggia. Il gelo allarga la crepa, il legno bagnato non si asciuga più, e dopo due o tre stagioni quella che era la sostituzione di una tegola è diventata la sostituzione di una porzione di tavolato, con ponteggio e giorni di cantiere.',
          'La matematica della manutenzione è tutta qui: intercettare il danno quando costa poco. Su un parco di coperture seguite con regolarità, gli interventi urgenti quasi spariscono.',
        ],
      },
      {
        h2: 'Il controllo professionale e il report fotografico',
        paragrafi: [
          'Il nostro controllo programmato prevede la salita in copertura in sicurezza, la verifica di manto, lattonerie e punti critici, la pulizia dei canali di gronda e un report fotografico datato con lo stato di ogni zona e le priorità di intervento. Nessuna diagnosi da terra col binocolo: sul tetto, ogni volta.',
          'Il report resta a voi: per un condominio è la documentazione che l’amministratore allega al fascicolo, per un’azienda è la prova di diligenza nella gestione dell’immobile, per un privato è la memoria storica della copertura che aumenta il valore della casa alla vendita.',
        ],
      },
      {
        h2: 'Contratti di manutenzione per condomini e aziende',
        paragrafi: [
          'Per condomini, capannoni e attività proponiamo contratti annuali con visita programmata, pulizia gronde inclusa, priorità di intervento in caso di urgenza e listino bloccato per le riparazioni minori. L’amministratore ha un referente unico e un costo prevedibile a bilancio, invece di rincorrere preventivi a ogni segnalazione.',
          'È la formula con cui i tetti che seguiamo da anni arrivano ai vent’anni di vita senza mai un intervento straordinario: la copertura più economica è quella che non fa mai notizia.',
        ],
      },
    ],
    faq: [
      {
        q: 'Quanto costa un controllo annuale del tetto?',
        a: 'Costa una frazione di qualsiasi riparazione, ed è tutto il suo senso. La visita comprende salita in sicurezza, verifica di manto, lattonerie e punti critici, pulizia dei canali di gronda e report fotografico datato. Quanto incida sul vostro tetto dipende da superficie, altezza e accessibilità della copertura, e lo scriviamo nel preventivo dopo averla vista. Nei contratti di manutenzione programmata la singola visita pesa ancora meno.',
      },
      {
        q: 'Il controllo col drone sostituisce la salita sul tetto?',
        a: 'Il drone è utile per una prima panoramica su coperture grandi o difficili, ma non tocca, non solleva e non prova: le sigillature si verificano con le mani. Lo usiamo come complemento, mai come sostituto della salita.',
      },
      {
        q: 'Ogni quanto vanno pulite le grondaie?',
        a: 'Almeno una volta l’anno in autunno; due se avete alberi ad alto fusto vicini. Una grondaia ostruita che tracima manda l’acqua esattamente dove fa più danno: dietro il canale, nel cornicione e sotto la prima fila di tegole.',
      },
      {
        q: 'Dopo una grandinata cosa devo far controllare?',
        a: 'Manto, lucernari e lattonerie: la grandine crepa tegole che a occhio da terra sembrano intere e ammacca canali compromettendone la pendenza. Un controllo documentato subito dopo l’evento serve anche per l’eventuale pratica assicurativa.',
      },
    ],
    correlati: {
      servizi: ['manutenzione-tetto', 'grondaie-lattonerie'],
      guide: ['infiltrazioni-tetto', 'verniciatura-tetto-guida'],
    },
  },

  {
    slug: 'grondaie-rame-guida',
    metaTitle: 'Grondaie in Rame, Alluminio o PVC: il Confronto',
    metaDescription:
      'Grondaie in rame, alluminio o PVC: confronto fra materiali, dimensionamento e pendenze corrette, perché i giunti sono il punto debole e quando vanno sostituite.',
    eyebrow: 'Guida alla lattoneria',
    h1: 'Grondaie in rame, alluminio o PVC: cosa scegliere e perché',
    intro:
      'Le grondaie sono il sistema di difesa perimetrale della casa: quando sbagliano qualcosa, l’acqua finisce esattamente dove fa più danno, cioè su cornicioni, facciate e fondazioni. La differenza fra un sistema che dura cinquant’anni e uno che perde dopo dieci sta in tre scelte: materiale, dimensionamento e numero di giunti.',
    sezioni: [
      {
        h2: 'Rame: il riferimento per durata',
        paragrafi: [
          'Il rame è il materiale nobile della lattoneria: non arrugginisce, si salda a stagno creando giunzioni monolitiche, si lavora a freddo in cantiere per adattarsi a qualsiasi geometria e con il tempo sviluppa la patina verde-bruna che lo protegge da solo. Una lattoneria in rame ben posata supera tranquillamente i cinquant’anni.',
          'Costa di più all’acquisto, e va detto: sulle case d’epoca e sui centri storici è spesso l’unica scelta coerente, mentre su un capannone industriale sarebbe un lusso senza ritorno. Il materiale giusto dipende dall’edificio.',
        ],
      },
      {
        h2: 'Alluminio e acciaio preverniciato: il compromesso moderno',
        paragrafi: [
          'L’alluminio preverniciato è leggero, non arrugginisce, arriva in decine di colori e con la profilatura in continuo si realizzano canali senza giunti intermedi anche su fronti lunghi. L’acciaio preverniciato è più rigido e regge meglio scale e carichi accidentali, con una gamma colori simile.',
          'Durata realistica: fra i 25 e i 40 anni in funzione dell’esposizione. Per la maggior parte dell’edilizia residenziale contemporanea è il miglior rapporto fra prestazioni e prezzo, a patto di non risparmiare sugli spessori.',
        ],
      },
      {
        h2: 'PVC: quando ha senso e quando no',
        paragrafi: [
          'Il PVC costa poco, si monta in fretta e non teme la corrosione. Ma si muove molto con il caldo e il freddo, e ogni movimento lavora sui giunti a incastro con le loro guarnizioni: dopo dieci o quindici anni di sole e gelo, le perdite ai giunti sono la norma, non l’eccezione. L’esposizione ai raggi solari inoltre lo infragilisce.',
          'Ha senso su tettoie, ricoveri e strutture secondarie dove la sostituzione periodica è accettabile. Sulla casa principale è un risparmio iniziale che si ripaga in manutenzione.',
        ],
      },
      {
        h2: 'Dimensionamento e pendenze: dove nascono i problemi',
        paragrafi: [
          'Ogni metro quadro di falda raccoglie acqua che il canale deve contenere e il pluviale smaltire: sezione del canale, numero e diametro dei pluviali si calcolano dalla superficie servita, non a sentimento. I temporali intensi degli ultimi anni hanno reso insufficienti molti impianti dimensionati con i criteri di trent’anni fa.',
          'La pendenza corretta del canale verso lo scarico, pochi millimetri al metro ma costanti, decide se l’acqua corre o ristagna. Un canale che ristagna trattiene fango e foglie, pesa, trabocca ai giunti e d’inverno spacca al gelo.',
        ],
      },
      {
        h2: 'I segnali che le grondaie vanno sostituite',
        paragrafi: [
          'Righe verdi o scure sulla facciata sotto il canale, gocciolamenti ai giunti durante la pioggia, ruggine passante sui canali in acciaio vecchio tipo, ristagni visibili dopo un temporale, intonaco del cornicione che si sfarina, distacchi dei ganci. Ognuno di questi segnali dice che il sistema non difende più la casa.',
          'La sostituzione completa con lattoneria piegata su misura in cantiere è un intervento di pochi giorni che si fa spesso insieme alla revisione della prima fila di tegole: il momento in cui i due lavori si aiutano a vicenda.',
        ],
      },
    ],
    faq: [
      {
        q: 'Perché piegate la lattoneria in cantiere invece di comprarla pronta?',
        a: 'Perché ogni casa ha misure sue: piegare canali, scossaline e converse su misura significa meno giunti, sormonti corretti e pezzi che calzano al millimetro. I giunti sono il punto debole di ogni impianto: meno ce ne sono, più a lungo dura.',
      },
      {
        q: 'Il rame si può abbinare a qualsiasi copertura?',
        a: 'Quasi: l’unica attenzione seria è il contatto diretto con alluminio o acciaio zincato, dove la coppia galvanica corrode il metallo meno nobile. Si risolve progettando bene i punti di contatto, cosa che un lattoniere esperto fa d’istinto.',
      },
      {
        q: 'Quanto costa rifare le grondaie di una casa media?',
        a: 'Dipende da tre cose: i metri lineari di sviluppo dei canali, il materiale scelto e il numero di pluviali e pezzi speciali da piegare. L’alluminio preverniciato è la soluzione più contenuta, il rame è il gradino più alto, per materiale e lavorazione. Nel preventivo trovate metri lineari, sezioni e spessori dichiarati, così potete confrontare le offerte voce per voce.',
      },
      {
        q: 'Le griglie parafoglie servono davvero?',
        a: 'Vicino ad alberi ad alto fusto sì: riducono di molto la frequenza di pulizia. Non la azzerano, perché il sedimento fine passa comunque, ma trasformano due pulizie l’anno in una. Vanno scelte rigide e ben fissate, altrimenti diventano loro il problema.',
      },
    ],
    correlati: {
      servizi: ['grondaie-lattonerie', 'manutenzione-tetto'],
      guide: ['manutenzione-programmata-tetto', 'infiltrazioni-tetto'],
    },
  },

  {
    slug: 'verniciatura-tetto-guida',
    metaTitle: 'Verniciatura del Tetto: Quando Conviene e Come',
    metaDescription:
      'Verniciatura del tetto, guida completa: quando ha senso e quando no, le quattro fasi del ciclo corretto, acrilico o silossanico e quanto dura il trattamento.',
    eyebrow: 'Guida alla verniciatura',
    h1: 'Verniciatura del tetto: quando conviene davvero e come si fa a regola d’arte',
    intro:
      'La verniciatura è l’intervento più frainteso del settore: venduta spesso come una mano di colore, è in realtà un ciclo tecnico che può regalare quindici anni di vita a una copertura sana, oppure essere denaro buttato via se applicata sul tetto sbagliato.',
    sezioni: [
      {
        h2: 'Quando la verniciatura ha senso',
        paragrafi: [
          'Il candidato ideale è un tetto in tegole di cemento o laterizio strutturalmente sano: niente infiltrazioni attive, manto completo, superficie che si è opacizzata, ha perso il colore e ha iniziato ad assorbire acqua e a farsi colonizzare dal muschio. In questo scenario il ciclo completo ferma il degrado, ripristina l’idrorepellenza e restituisce alla copertura un aspetto uniforme.',
          'Il momento giusto è proprio questo: quando il manto è ancora recuperabile. Aspettare che le tegole si sfoglino significa passare dalla verniciatura al rifacimento, cioè da un intervento di manutenzione a un cantiere completo, con tutta la differenza di impegno e di spesa che comporta.',
        ],
      },
      {
        h2: 'Quando è denaro sprecato',
        paragrafi: [
          'Su tegole che si sfaldano a strati, su manti con infiltrazioni attive o su coperture con la membrana sottostante a fine vita, la vernice è un cerotto su una frattura: copre l’aspetto del problema lasciando intatta la causa. Lo stesso vale per i coppi antichi in cotto, dove il valore sta proprio nella patina naturale.',
          'Parte del nostro sopralluogo serve esattamente a questo: dirvi con onestà se il vostro tetto è da verniciare, da riparare prima e poi verniciare, o se il denaro della verniciatura è meglio accantonato per il rifacimento.',
        ],
      },
      {
        h2: 'Le quattro fasi del ciclo corretto',
        paragrafi: [
          'Fase uno: idropulizia profonda a pressione controllata, circa 250 bar, per togliere muschio, licheni, smog e ogni parte incoerente, seguita dal trattamento biocida che uccide le spore rimaste nelle porosità. Fase due: ripristino del substrato, cioè sostituzione delle tegole rotte e stuccatura delle crepe, perché verniciare un elemento rotto significa solo nasconderlo.',
          'Fase tre: primer consolidante ad alta penetrazione, che compatta la superficie porosa e crea l’aggancio chimico per la finitura. Fase quattro: doppia mano incrociata di finitura applicata a spruzzo airless. Saltare una fase qualsiasi si paga entro due o tre stagioni, con la pellicola che si solleva a placche.',
        ],
      },
      {
        h2: 'Acrilico o silossanico: quale finitura scegliere',
        paragrafi: [
          'La finitura acrilica costa meno e forma una pellicola idrorepellente valida, ma meno traspirante: sulle coperture con anche minime risalite di vapore può gonfiarsi nel tempo. La silossanica costa di più e unisce le due proprietà che su un tetto contano davvero: respinge l’acqua liquida e lascia uscire il vapore.',
          'Sui manti in cemento consigliamo quasi sempre il ciclo silossanico, eventualmente nella versione riflettente nei sottotetti che soffrono il caldo: la superficie chiara ad alta riflettanza abbassa sensibilmente la temperatura del manto nelle ore di sole.',
        ],
      },
      {
        h2: 'Durata, stagioni e manutenzione del trattamento',
        paragrafi: [
          'Un ciclo completo eseguito su supporto sano dura indicativamente dai 12 ai 18 anni, in funzione di esposizione e finitura scelta. La stagione ideale va da tarda primavera a inizio autunno: servono superfici asciutte, niente gelo notturno e qualche giorno stabile per i tempi di ricopertura fra le mani.',
          'La manutenzione successiva è minima: un controllo periodico e la rimozione tempestiva di eventuali ricolonizzazioni di muschio nelle zone d’ombra. Il report fotografico di fine cantiere documenta il ciclo applicato, utile anche per la garanzia.',
        ],
      },
    ],
    faq: [
      {
        q: 'Si possono verniciare i coppi antichi in cotto?',
        a: 'Tecnicamente sì, ma lo sconsigliamo quasi sempre: il valore estetico del coppo antico sta nella sua patina e una pellicola uniforme lo snatura. Sul cotto storico preferiamo pulizia delicata e trattamenti idrorepellenti trasparenti.',
      },
      {
        q: 'Quanto dura il cantiere di una verniciatura?',
        a: 'Su una villetta media il ciclo completo si chiude fra i 4 e i 6 giorni lavorativi, meteo permettendo: un giorno di lavaggio e biocida, uno di ripristini, poi primer e le due mani di finitura con i loro tempi di asciugatura.',
      },
      {
        q: 'Che colori si possono scegliere?',
        a: 'Le finiture si tingono a campionario: dal rosso cotto classico all’antracite, fino alle tinte chiare riflettenti. Nei centri storici verifichiamo prima il regolamento comunale, che spesso vincola la gamma alle terre tradizionali.',
      },
      {
        q: 'La verniciatura risolve un tetto che perde?',
        a: 'No, e chi ve la propone per questo scopo vi sta vendendo il prodotto sbagliato: l’infiltrazione va trovata e riparata prima. La vernice protegge un tetto sano, non ripara un tetto rotto.',
      },
    ],
    correlati: {
      servizi: ['verniciatura-tetto', 'manutenzione-tetto'],
      guide: ['manutenzione-programmata-tetto', 'costo-rifacimento-tetto'],
    },
  },
]

/** Ricerca rapida per slug, usata dalle pagine e dai collegamenti interni. */
export const guidaPerSlug = (slug: string) => guide.find((g) => g.slug === slug)
