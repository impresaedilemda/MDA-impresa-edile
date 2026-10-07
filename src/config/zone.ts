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
  provincia: string
  regione: string
  taglio: string
  approfondimento: { titolo: string; paragrafi: string[]; guida: string; blog: string }
}

// Contesto editoriale esplicito: nessuna sede, opera o prestazione locale
// viene inventata. Per un nuovo comune vanno prima verificati zona e contenuto.
const contesti: Record<string, Omit<Zona, 'nome' | 'slug'>> = {
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
  return { nome, slug: slugify(nome), ...contesto }
})

/** La zona principale (la citta) resta coperta dalla home. */
export const zoneSecondarie = zone
