import { site } from './site'

/**
 * =============================================================================
 *  PAGINE PER COMUNE (SEO locale, fase 2)
 * =============================================================================
 *  Una pagina per ogni comune servito: "rifacimento tetto <comune>" e le
 *  ricerche affini si vincono con una pagina dedicata, non con la home.
 *
 *  L'elenco viene da site.areaServed. Ogni comune richiede anche un contesto
 *  verificato qui sotto, prima di generare pagina, link e voce nella sitemap.
 *
 *  ONESTA DEI CONTENUTI: queste pagine dichiarano che l'impresa LAVORA nel
 *  comune (vero, e la zona di intervento). Non inventano cantieri, recensioni
 *  o sedi locali. Niente "i nostri progetti a X" finche non esistono davvero.
 * =============================================================================
 */

/** Trasforma "Palazzolo sull'Oglio" in "palazzolo-sull-oglio". */
export function slugify(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // accenti
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export type Zona = {
  nome: string
  slug: string
  /** "a" oppure "ad" davanti ai nomi che iniziano per A: "ad Azzano Decimo". */
  prep: string
  /** Preposizione e nome insieme, in una stringa sola: Astro mangia lo
   *  spazio fra due espressioni affiancate. */
  aNome: string
  provincia: string
  regione: string
  taglio: string
  approfondimento: { titolo: string; paragrafi: string[]; guida: string; blog: string }
}

// Contesto editoriale esplicito: nessuna sede, opera o prestazione locale
// viene inventata. Per un nuovo comune vanno prima verificati zona e contenuto.
const contesti: Record<string, Omit<Zona, 'nome' | 'slug' | 'prep' | 'aNome'>> = {
  /* Comuni della provincia di Pordenone attorno alla sede, aggiunti il
     14/11/2026: il cliente ha confermato che lavora in tutto il Friuli
     e il Veneto. Ogni pagina ha un argomento diverso dalle altre. */
  Cordenons: {
    provincia: 'Pordenone', regione: 'Friuli-Venezia Giulia',
    taglio: 'Cordenons è in provincia di Pordenone, a pochi chilometri dalla nostra sede. Se state valutando il rifacimento, indicate il materiale attuale del manto e quello che vorreste, anche se non siete ancora sicuri.',
    approfondimento: {
      titolo: 'Tegole, coppi o lamiera a Cordenons: scegliere il nuovo manto',
      paragrafi: [
        'Quando il manto va rifatto, la scelta del materiale non riguarda solo l’aspetto. Coppi, tegole e lamiera richiedono pendenze minime, pesi e dettagli di posa diversi, e devono essere compatibili con la struttura esistente e con le eventuali prescrizioni urbanistiche della zona. Per questo la scelta si fa dopo aver visto il tetto, non sul catalogo.',
        'Per il sopralluogo a Cordenons sono utili fotografie del tetto scattate da terra, l’anno approssimativo dell’ultimo intervento e le parti da conservare, come comignoli, finestre per tetti o pannelli. Chiedete che il preventivo indichi materiale, colore, accessori e lattonerie previste: solo così due offerte diventano davvero confrontabili.',
      ],
      guida: 'tegole-coppi-lamiera', blog: 'preventivo-rifacimento-tetto-pordenone-veneto',
    },
  },
  Porcia: {
    provincia: 'Pordenone', regione: 'Friuli-Venezia Giulia',
    taglio: 'Porcia è in provincia di Pordenone, a pochi minuti dalla nostra sede. Per un tetto con muschio, tegole sbiadite o lamiere ossidate indicate da quanto tempo notate il problema e se l’acqua entra già in casa.',
    approfondimento: {
      titolo: 'Muschio e manto sbiadito a Porcia: pulire, verniciare o sostituire?',
      paragrafi: [
        'Muschio, licheni e colore spento sono segnali diversi da una tegola rotta. La pulizia rimuove i depositi, la verniciatura protegge e rinnova un manto ancora integro, mentre gli elementi fessurati, deformati o porosi vanno sostituiti prima di qualsiasi finitura. Verniciare sopra un difetto lo nasconde per una stagione, non lo risolve.',
        'Per una richiesta a Porcia indicate il materiale del manto, l’esposizione delle falde e la presenza di alberi vicini. Nel preventivo chiedete come verrà eseguita la pulizia, quale prodotto è previsto, quante mani e in quali condizioni meteo si può lavorare: la verniciatura ha bisogno di superfici asciutte e di temperature adatte.',
      ],
      guida: 'verniciatura-tetto-guida', blog: 'manutenzione-tetto-autunno-pordenone',
    },
  },
  'Fiume Veneto': {
    provincia: 'Pordenone', regione: 'Friuli-Venezia Giulia',
    taglio: 'Fiume Veneto è in provincia di Pordenone, vicino alla nostra sede. Dopo neve, vento forte o grandine indicate cosa avete notato e da quando: è il primo passo per capire quanto è urgente l’intervento.',
    approfondimento: {
      titolo: 'Dopo neve, vento o grandine a Fiume Veneto: cosa osservare in sicurezza',
      paragrafi: [
        'Dopo una nevicata abbondante, una raffica forte o una grandinata il controllo si fa da terra e dall’interno, mai salendo sul tetto. Guardate se ci sono tegole spostate o cadute, lattonerie piegate, grondaie staccate e macchie nuove sul soffitto dell’ultimo piano o nel sottotetto. Fotografate tutto con la data: aiuta a descrivere il danno al sopralluogo.',
        'Se l’acqua entra già, scrivetelo subito nella richiesta per l’immobile a Fiume Veneto: una protezione provvisoria e la riparazione definitiva sono due lavori diversi, e conviene che il preventivo li distingua. Segnalate anche come si accede al cortile o al giardino e se sul tetto ci sono pannelli o antenne da considerare nell’organizzazione del cantiere.',
      ],
      guida: 'manutenzione-programmata-tetto', blog: 'neve-ghiaccio-tetto-quattro-punti-deboli',
    },
  },
  'Azzano Decimo': {
    provincia: 'Pordenone', regione: 'Friuli-Venezia Giulia',
    taglio: 'Azzano Decimo è in provincia di Pordenone, a sud della città. Per grondaie che traboccano o pluviali che perdono, indicate il lato dell’edificio e se il problema compare a ogni pioggia o solo con i temporali.',
    approfondimento: {
      titolo: 'Grondaie e pluviali ad Azzano Decimo: riparare o sostituire?',
      paragrafi: [
        'Una grondaia che trabocca può essere ostruita, avere una pendenza sbagliata o essere troppo piccola per la falda che raccoglie. Un giunto che gocciola, un sostegno piegato o un pluviale staccato sono invece difetti puntuali. Capire quale sia il caso evita di sostituire tutto quando basta una riparazione, o di riparare più volte un sistema che non riesce a smaltire l’acqua.',
        'Per la richiesta ad Azzano Decimo sono utili fotografie da terra dei punti in cui l’acqua esce, il materiale attuale, se lo conoscete, e la presenza di alberi vicino al tetto. Se valutate la sostituzione, chiedete che il preventivo indichi materiale, spessore, sviluppo del canale, numero dei pluviali e tipo di sostegni: sono le voci che distinguono due offerte.',
      ],
      guida: 'grondaie-rame-guida', blog: 'manutenzione-tetto-autunno-pordenone',
    },
  },
  'Roveredo in Piano': {
    provincia: 'Pordenone', regione: 'Friuli-Venezia Giulia',
    taglio: 'Roveredo in Piano è in provincia di Pordenone, a nord della città. Se l’immobile è affittato, indicate nella richiesta chi è il proprietario e chi può aprire per il sopralluogo.',
    approfondimento: {
      titolo: 'Il tetto di una casa in affitto a Roveredo: organizzare il sopralluogo',
      paragrafi: [
        'Quando chi abita la casa non è il proprietario, le segnalazioni arrivano spesso in ritardo o incomplete. Chiedete a chi vive nell’immobile di annotare dove compare l’umidità, dopo quale tipo di pioggia e da quanto tempo, con qualche fotografia dall’interno. Così il sopralluogo parte da informazioni precise e non da una descrizione riportata a voce.',
        'Per l’immobile a Roveredo in Piano concordate prima chi sarà presente alla visita e a chi va inviato il preventivo. Se serve liberare una stanza o il sottotetto per l’accesso, avvisate l’inquilino con anticipo. Nel preventivo chiedete di distinguere la ricerca della causa dalla riparazione: aiuta anche a pianificare tempi e disagi per chi abita la casa.',
      ],
      guida: 'infiltrazioni-tetto', blog: 'infiltrazioni-tetto-pioggia-portogruaro-latisana',
    },
  },
  Fontanafredda: {
    provincia: 'Pordenone', regione: 'Friuli-Venezia Giulia',
    taglio: 'Fontanafredda è in provincia di Pordenone, sulla strada verso Sacile. Se d’inverno il sottotetto è molto freddo o compare condensa, scrivetelo già nella prima richiesta.',
    approfondimento: {
      titolo: 'Condensa e sottotetto freddo a Fontanafredda: cosa verificare',
      paragrafi: [
        'Gocce sulle travi, muffa negli angoli o un sottotetto gelido d’inverno non indicano per forza un’infiltrazione dal manto. Possono dipendere da un isolamento insufficiente, da una ventilazione assente o ostruita, o dall’umidità che sale dagli ambienti abitati. Per questo il sopralluogo guarda sia la copertura sia il sottotetto, prima di proporre una soluzione.',
        'Prima della visita all’immobile di Fontanafredda annotate quando compare il fenomeno, se peggiora con il freddo o dopo la pioggia, e come vengono riscaldati e arieggiati gli ambienti sotto il tetto. Se valutate la coibentazione, chiedete che il preventivo indichi materiale isolante, spessore, barriera al vapore e soluzione per la ventilazione: sono gli elementi che decidono il risultato.',
      ],
      guida: 'tetto-ventilato-coibentazione', blog: 'neve-ghiaccio-tetto-quattro-punti-deboli',
    },
  },
  Portogruaro: {
    provincia: 'Venezia', regione: 'Veneto',
    taglio: 'Portogruaro è nella Città metropolitana di Venezia. La nostra sede resta a Pordenone: nel contatto indicate l’indirizzo del cantiere per organizzare il sopralluogo.',
    approfondimento: {
      titolo: 'Infiltrazioni a Portogruaro: come preparare la verifica',
      paragrafi: [
        'Se il problema compare dopo la pioggia, annotate la posizione della macchia e quando cambia. Un alone vicino al camino, acqua attorno a una finestra per tetti e una grondaia che trabocca richiedono verifiche diverse. Le fotografie dall’interno e da terra aiutano a descrivere il fenomeno senza esporsi ai rischi di una salita sulla copertura.',
        'Per un immobile con accesso da una corte o da un passaggio condiviso, segnalate anche come si raggiunge l’edificio e chi può aprire gli spazi necessari. Il sopralluogo serve a valutare origine dell’acqua, condizioni del manto e accessi: solo dopo si distingue una riparazione puntuale da un intervento più ampio.',
      ],
      guida: 'infiltrazioni-tetto', blog: 'infiltrazioni-tetto-pioggia-portogruaro-latisana',
    },
  },
  'San Donà di Piave': {
    provincia: 'Venezia', regione: 'Veneto',
    taglio: 'Per gli immobili a San Donà di Piave valutiamo il lavoro partendo dallo stato della copertura, dalle parti da conservare e dall’accessibilità del cantiere.',
    approfondimento: {
      titolo: 'Rifare il tetto a San Donà: cosa confrontare nelle offerte',
      paragrafi: [
        'Prima di confrontare il totale, controllate se le offerte comprendono gli stessi strati: manto, membrane, isolamento e lattonerie. Anche la superficie delle falde va distinta dalla superficie dell’abitazione. Un prezzo al metro quadrato senza queste informazioni non permette di capire quale lavoro sia effettivamente previsto.',
        'Per il sopralluogo a San Donà di Piave indicate se si tratta di una casa, un condominio o un edificio utilizzato per un’attività. Comunicate gli orari di accesso e gli spazi che devono restare disponibili. La proposta può così distinguere lavorazioni, organizzazione del cantiere, esclusioni ed eventuali verifiche da completare dopo l’apertura del tetto.',
      ],
      guida: 'costo-rifacimento-tetto', blog: 'preventivo-rifacimento-tetto-pordenone-veneto',
    },
  },
  Latisana: {
    provincia: 'Udine', regione: 'Friuli-Venezia Giulia',
    taglio: 'Latisana è in provincia di Udine. Per valutare infiltrazioni o ristagni, specificate se il problema riguarda un tetto a falde, una terrazza o una copertura piana.',
    approfondimento: {
      titolo: 'Coperture piane a Latisana: guaina, raccordi e scarichi',
      paragrafi: [
        'Se su una parte piana resta acqua, la proposta non dovrebbe limitarsi al nome di una nuova guaina. Vanno valutati lo stato del supporto, i raccordi con le pareti, il percorso dell’acqua e gli scarichi. Una terrazza praticabile richiede inoltre di chiarire quali pavimentazioni o finiture siano coinvolte nel lavoro.',
        'Prima della visita raccogliete eventuali fotografie scattate in sicurezza, informazioni sulle riparazioni precedenti e indicazioni sui locali sottostanti. Se non abitate stabilmente nell’immobile a Latisana, concordate chi sarà presente per consentire l’accesso. Questi elementi aiutano a formulare una proposta comprensibile, con parti da ripristinare e lavorazioni escluse esplicite.',
      ],
      guida: 'infiltrazioni-tetto', blog: 'infiltrazioni-tetto-pioggia-portogruaro-latisana',
    },
  },
  Sacile: {
    provincia: 'Pordenone', regione: 'Friuli-Venezia Giulia',
    taglio: 'Per la manutenzione a Sacile partiamo dai segnali osservati sull’immobile, distinguendo pulizia, riparazione e sostituzione delle parti deteriorate.',
    approfondimento: {
      titolo: 'Manutenzione a Sacile: preparare il controllo delle grondaie',
      paragrafi: [
        'Una colatura sotto il cornicione o un canale che trabocca sono informazioni utili da comunicare, ma non identificano da sole la causa. Nel controllo si valutano depositi, giunti, sostegni e percorso dell’acqua. Se vicino all’edificio ci sono alberi, segnalatelo per concordare una manutenzione adatta alle condizioni reali.',
        'Per la richiesta a Sacile sono utili fotografie da terra, indicazione del lato interessato e data dell’ultima pulizia, se nota. Chiedete che il preventivo distingua controllo, rimozione dei depositi e riparazioni eventualmente necessarie. Se una parte del manto presenta anomalie, andrà valutata insieme alla lattoneria: una nuova grondaia non risolve automaticamente un difetto del tetto.',
      ],
      guida: 'manutenzione-programmata-tetto', blog: 'manutenzione-tetto-autunno-pordenone',
    },
  },
  Conegliano: {
    provincia: 'Treviso', regione: 'Veneto',
    taglio: 'Conegliano è in provincia di Treviso. Nel progetto di rifacimento valutiamo insieme manto, isolamento e raccordi, in funzione dell’edificio e del lavoro richiesto.',
    approfondimento: {
      titolo: 'Tetto e isolamento a Conegliano: chiarire il pacchetto previsto',
      paragrafi: [
        'Se il sottotetto è abitato, indicate come viene utilizzato e quali problemi volete affrontare: ingresso d’acqua, comfort degli ambienti o rinnovo della copertura. Sono obiettivi diversi. La scelta dell’isolamento e dell’eventuale ventilazione va inserita nella valutazione dell’intero sistema, senza dedurre la soluzione soltanto dall’aspetto delle tegole.',
        'Per confrontare due proposte chiedete tipologia e caratteristiche dei materiali, spessori previsti e parti della struttura da conservare. Se sull’immobile a Conegliano sono già presenti finestre per tetti o impianti in copertura, segnalateli prima del sopralluogo: raccordi e accessi devono essere considerati nelle lavorazioni e nell’organizzazione del cantiere.',
      ],
      guida: 'tetto-ventilato-coibentazione', blog: 'preventivo-rifacimento-tetto-pordenone-veneto',
    },
  },
  'San Vito al Tagliamento': {
    provincia: 'Pordenone', regione: 'Friuli-Venezia Giulia',
    taglio: 'A San Vito al Tagliamento la richiesta può riguardare una singola abitazione o una copertura condivisa: indicate da subito chi segue l’organizzazione del sopralluogo.',
    approfondimento: {
      titolo: 'Un tetto condiviso a San Vito: raccogliere le segnalazioni',
      paragrafi: [
        'Per una copertura condominiale, più segnalazioni possono descrivere parti diverse dello stesso problema. Raccogliete piano, stanza interessata, data e fotografie disponibili per ciascun appartamento. L’amministratore o il referente del condominio può così fornire alla ditta un quadro ordinato, insieme alle informazioni sui lavori già eseguiti.',
        'Prima della visita all’immobile di San Vito al Tagliamento, chiarite quali ambienti siano accessibili e chi possa aprire gli spazi comuni. Nel preventivo chiedete di distinguere gli interventi necessari dalle attività di manutenzione programmabile. La priorità si valuta sulle condizioni riscontrate, non soltanto sull’età dell’edificio o sulla dimensione visibile di una macchia.',
      ],
      guida: 'manutenzione-programmata-tetto', blog: 'manutenzione-tetto-autunno-pordenone',
    },
  },
  Jesolo: {
    provincia: 'Venezia', regione: 'Veneto',
    taglio: 'Per un immobile a Jesolo, indicate anche i periodi di utilizzo e la disponibilità per l’accesso: sono informazioni utili per programmare sopralluogo e lavori.',
    approfondimento: {
      titolo: 'Programmare i lavori sul tetto di un immobile a Jesolo',
      paragrafi: [
        'Se l’edificio è una seconda casa o viene utilizzato solo in alcuni periodi, definite un referente che possa consentire l’accesso. Se ospita un’attività o persone durante il lavoro, segnalate le esigenze da rispettare. Il programma dipende dalle lavorazioni effettive, dalle condizioni di posa e dall’organizzazione concordata.',
        'Comunicate eventuali ristagni, infiltrazioni o anomalie delle lattonerie e indicate se riguardano falde, terrazze o parti piane. Nel preventivo per l’immobile a Jesolo chiedete quali superfici siano incluse, quali finiture verranno ripristinate e come saranno gestite eventuali necessità aggiuntive. Una data desiderata va discussa insieme allo stato della copertura e alle condizioni necessarie per eseguire il lavoro.',
      ],
      guida: 'costo-rifacimento-tetto', blog: 'preventivo-rifacimento-tetto-pordenone-veneto',
    },
  },
}

export const zone: Zona[] = site.areaServed.slice(1).map((nome) => {
  const contesto = contesti[nome]
  if (!contesto) throw new Error(`Completare il contenuto locale prima di pubblicare la zona: ${nome}`)
  /* Davanti a una A l'italiano scrive "ad": "ad Azzano Decimo", non "a Azzano". */
  const prep = /^a/i.test(nome) ? 'ad' : 'a'
  return { nome, slug: slugify(nome), prep, aNome: `${prep} ${nome}`, ...contesto }
})

/** La zona principale (la citta) resta coperta dalla home. */
export const zoneSecondarie = zone
