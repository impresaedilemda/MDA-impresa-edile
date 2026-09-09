/**
 * =============================================================================
 *  LISTINO DEL CALCOLATORE DI STIMA
 * =============================================================================
 *  Tutti i numeri del configuratore stanno QUI e solo qui. Intervalli di
 *  mercato italiani 2025-2026, posa e manodopera incluse, IVA esclusa;
 *  per il Nord-Est i listini reali si collocano nella meta alta.
 *
 *  Fonti principali (rilevazione 31/08/2026): instapro.it, ediliziacrobatica.com,
 *  studiomadera.it, generalcover.it, homedeal.it, pgcasa.it, tetto360.it,
 *  cronoshare.it, edilnet.it, idealista.it/news, agenziaentrate.gov.it.
 *
 *  IMPORTANTE: finche listinoConfermato resta false, il pannello di sviluppo
 *  ricorda che il cliente deve rivedere questi intervalli e adattarli ai suoi
 *  prezzi reali. La stima mostrata al visitatore e sempre dichiarata come
 *  indicativa e non vincolante.
 * =============================================================================
 */

export const listinoConfermato = false // TODO CLIENTE: rivedere gli intervalli e mettere true

/** Disclaimer mostrato accanto alla stima: formulazione prudente, nessun vincolo. */
export const disclaimerStima =
  'Stima puramente indicativa e non vincolante, calcolata su parametri medi di mercato, IVA esclusa. Il prezzo definitivo viene confermato solo dopo il sopralluogo tecnico gratuito e resta bloccato alla firma.'

type Unita = 'euro_mq' | 'euro_ml' | 'euro_forfait'

export type VoceListino = {
  /** value del radio nel passo materiale */
  id: string
  /** etichetta mostrata nel configuratore */
  label: string
  /** riga secondaria facoltativa sotto l'etichetta */
  hint?: string
  unita: Unita
  min: number
  max: number
}

export type ServizioCalcolatore = {
  /** deve combaciare con la label del passo "intervento" in content.ts */
  intervento: string
  /** domanda del passo materiale per questo servizio */
  domanda: string
  voci: VoceListino[]
}

export const servizi: ServizioCalcolatore[] = [
  {
    intervento: 'Rifacimento completo del tetto',
    domanda: 'Che tipo di manto preferisci?',
    voci: [
      { id: 'tegole', label: 'Tegole in laterizio o cemento', hint: 'La scelta più comune, ottimo rapporto resa e durata', unita: 'euro_mq', min: 140, max: 250 },
      { id: 'coppi', label: 'Coppi tradizionali', hint: 'Posa lenta e selezione manuale, resa d’epoca', unita: 'euro_mq', min: 150, max: 280 },
      { id: 'lamiera', label: 'Lamiera aggraffata / zinco titanio', hint: 'Lattoneria specializzata, durata superiore', unita: 'euro_mq', min: 200, max: 350 },
      { id: 'non-so-manto', label: 'Non lo so, consigliatemi voi', unita: 'euro_mq', min: 140, max: 280 },
    ],
  },
  {
    intervento: 'Impermeabilizzazione e guaine',
    domanda: 'Che tipo di impermeabilizzazione serve?',
    voci: [
      { id: 'guaina-bituminosa', label: 'Guaina bituminosa a doppio strato', hint: 'La soluzione classica per tetti piani e terrazzi', unita: 'euro_mq', min: 30, max: 55 },
      { id: 'membrana-sintetica', label: 'Membrana sintetica PVC o TPO', hint: 'Saldatura certificata, vita utile oltre i trent’anni', unita: 'euro_mq', min: 40, max: 65 },
      { id: 'non-so-guaina', label: 'Non lo so, decidiamo al sopralluogo', unita: 'euro_mq', min: 30, max: 65 },
    ],
  },
  {
    intervento: 'Grondaie e lattoneria',
    domanda: 'In quale materiale?',
    voci: [
      { id: 'alluminio', label: 'Alluminio preverniciato', hint: 'Leggero, economico, tanti colori', unita: 'euro_ml', min: 25, max: 60 },
      { id: 'zinco-titanio', label: 'Zinco titanio', hint: 'Il compromesso nobile', unita: 'euro_ml', min: 35, max: 80 },
      { id: 'rame', label: 'Rame', hint: 'Il riferimento: durata e patina inconfondibile', unita: 'euro_ml', min: 45, max: 100 },
      { id: 'non-so-gronda', label: 'Non lo so, consigliatemi voi', unita: 'euro_ml', min: 25, max: 80 },
    ],
  },
  {
    intervento: 'Verniciatura del tetto',
    domanda: 'In che stato sono le tegole?',
    voci: [
      { id: 'buono-stato', label: 'Buono stato, solo da proteggere', hint: 'Lavaggio, biocida, primer e doppia mano', unita: 'euro_mq', min: 18, max: 32 },
      { id: 'con-riparazioni', label: 'Servono anche piccole riparazioni', hint: 'Sostituzione pezzi rotti prima del ciclo', unita: 'euro_mq', min: 25, max: 40 },
      { id: 'non-so-stato', label: 'Non lo so, va visto', unita: 'euro_mq', min: 18, max: 40 },
    ],
  },
  {
    intervento: 'Manutenzione e riparazione',
    domanda: 'Che tipo di problema hai?',
    voci: [
      { id: 'riparazione-puntuale', label: 'Riparazione puntuale', hint: 'Tegole rotte, piccola infiltrazione, colmo smosso', unita: 'euro_forfait', min: 250, max: 1000 },
      { id: 'sigillatura-camino', label: 'Camino o scossaline da sistemare', unita: 'euro_forfait', min: 300, max: 1000 },
      { id: 'controllo-annuale', label: 'Controllo annuale con report', hint: 'Verifica completa, pulizia gronde, report fotografico', unita: 'euro_forfait', min: 100, max: 200 },
      { id: 'non-so-problema', label: 'Non lo so, perde e basta', unita: 'euro_forfait', min: 250, max: 1000 },
    ],
  },
]

/**
 * Fasce di superficie del passo dedicato -> mq rappresentativo della fascia.
 * Lo sviluppo in metri lineari delle lattonerie NON si dichiara qui: si
 * ricava dai mq con un'unica formula nel configuratore, altrimenti la stessa
 * copertura darebbe due risposte diverse a seconda che l'utente scelga la
 * fascia o scriva i metri esatti.
 */
export const fasceSuperficie: Record<string, { mq: number }> = {
  'Fino a 50 mq': { mq: 45 },
  'Da 50 a 100 mq': { mq: 75 },
  'Da 100 a 200 mq': { mq: 150 },
  'Oltre 200 mq': { mq: 250 },
}

/**
 * Oltre questa superficie una stima automatica non ha senso: sono cantieri
 * industriali, con logiche di prezzo diverse dal residenziale. Il
 * configuratore raccoglie comunque il contatto, ma non mostra cifre.
 */
export const sogliaSopralluogoObbligatorio = 600

/**
 * Maggiorazioni prudenziali legate alla tipologia di immobile: incidono su
 * accessibilita e vincoli (fonti: fattori qualitativi citati dai portali,
 * non listini pubblicati). Il rustico/storico eredita l'intervallo
 * "accessibilita difficile / centro storico" della rilevazione.
 */
export const fattoriEdificio: Record<string, { min: number; max: number }> = {
  'Rustico / Casale Storico': { min: 1.1, max: 1.3 },
  'Condominio / Edificio Plurifamiliare': { min: 1.05, max: 1.15 },
}

/**
 * Sotto questa superficie i costi fissi del cantiere (allestimento, ponteggio,
 * trasporti) pesano in proporzione. La maggiorazione si applica in modo
 * graduale, non a scalino: a 60 mq vale zero, a 20 mq vale tutta.
 */
export const fattorePiccolaSuperficie = { sogliaMq: 60, min: 1.15, max: 1.35 }
