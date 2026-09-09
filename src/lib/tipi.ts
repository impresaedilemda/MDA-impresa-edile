/**
 * I tipi dei contenuti gestiti dal pannello, condivisi con il sito pubblico.
 * Nessun codice qui dentro: solo la forma dei dati, cosi il pannello che li
 * scrive e le pagine che li leggono parlano della stessa cosa.
 */

export type Articolo = {
  id: string
  titolo: string
  slug: string
  estratto: string
  copertina: string | null
  contenuto: string
  bozza: boolean
  creato: string
  aggiornato: string
}

export type Recensione = {
  id: string
  nome: string
  localita: string
  testo: string
  /** da 1 a 5 */
  voto: number
  foto: string | null
  visibile: boolean
  ordine: number
  creato: string
  aggiornato: string
}

export type Lavoro = {
  id: string
  titolo: string
  localita: string
  testo: string
  /** es. "8 giorni lavorativi" */
  durata: string
  /** es. "Lana minerale, rame, tegole" */
  materiali: string
  foto_prima: string | null
  foto_dopo: string | null
  visibile: boolean
  ordine: number
  creato: string
  aggiornato: string
}

export type TipoRichiesta = 'richiamo' | 'preventivo'
export type StatoRichiesta = 'nuova' | 'contattata' | 'chiusa'

export type Richiesta = {
  id: string
  tipo: TipoRichiesta
  nome: string
  telefono: string
  email: string
  comune: string
  cap: string
  servizio: string
  messaggio: string
  /** le risposte del configuratore, la stima mostrata, e cosi via */
  dettagli: Record<string, string | number | null>
  pagina: string
  codice_link: string | null
  stato: StatoRichiesta
  nota: string
  creato: string
  aggiornato: string
}

/** Quello che il modulo del sito manda: il resto lo mette il database. */
export type NuovaRichiesta = Pick<
  Richiesta,
  'tipo' | 'nome' | 'telefono' | 'email' | 'comune' | 'cap' | 'servizio' | 'messaggio' | 'dettagli' | 'pagina' | 'codice_link'
>

/**
 * I dati dell'impresa che il cliente puo cambiare dal pannello. Ogni campo e
 * facoltativo: quello che manca resta com'e scritto in src/config/site.ts.
 */
export type ImpostazioniSito = {
  telefono: string
  whatsapp: string
  email: string
  ragioneSociale: string
  partitaIva: string
  rea: string
  via: string
  cap: string
  citta: string
  provincia: string
  provinciaNome: string
  orari: string
  oreRisposta: number
  garanziaAnni: number
  instagram: string
  facebook: string
  /** Registro delle imprese di iscrizione, es. "Registro delle Imprese di Venezia". */
  registroImprese: string
  /** Capitale sociale versato, obbligatorio per le societa di capitali (art. 2250 c.c.). */
  capitaleSociale: string
  /** Indirizzo PEC iscritto al registro delle imprese. */
  pec: string
  /** Estremi della polizza RC verso terzi, se il cliente vuole pubblicarli. */
  assicurazione: string
}

export type Pubblicazione = {
  hook_url: string
  ultima_pubblicazione: string | null
  ultima_modifica: string | null
}
