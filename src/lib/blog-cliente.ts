/**
 * =============================================================================
 *  BLOG NEL BROWSER: gli articoli pubblicati dopo l'ultima build
 * =============================================================================
 *  Il sito è statico: le pagine del blog nascono quando Vercel lo costruisce,
 *  con gli articoli che il database aveva in quel momento. Un articolo
 *  pubblicato dopo, prima della build successiva, non ha ancora la sua pagina
 *  e non compare nell'elenco. Questo modulo colma quel buco dal browser: legge
 *  gli articoli pubblicati con la stessa chiave anon che il sito già conosce,
 *  e le pagine del blog si aggiornano da sole se trovano qualcosa di nuovo.
 *
 *  Niente DOM qui dentro: solo letture e qualche calcolo sui dati, così le
 *  stesse funzioni servono alle pagine Astro durante la build e agli script
 *  che girano nel browser. Ogni lettura torna null quando le variabili
 *  PUBLIC_SUPABASE_* mancano, quando la rete non risponde o quando il
 *  database risponde male, senza mai lanciare: il visitatore vede comunque la
 *  pagina costruita alla build, che è già completa.
 *
 *  Le policy RLS lasciano leggere all'anon solo le righe con bozza = false:
 *  il filtro nella query è una cortesia verso il database, non la protezione.
 * =============================================================================
 */

import { primaImmagine, tempoLettura, testoSemplice } from './testo'
import type { Articolo } from './tipi'

/** I campi che servono alle pagine pubbliche: le bozze non passano mai di qui. */
export type ArticoloPubblico = Pick<
  Articolo,
  'id' | 'titolo' | 'slug' | 'estratto' | 'copertina' | 'contenuto' | 'creato'
>

/** Quello che una card o un'intestazione mostrano davvero, già calcolato. */
export type Scheda = {
  slug: string
  titolo: string
  estratto: string
  copertina: string | null
  minuti: number
  creato: string
}

const URL_BASE = (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '')
const CHIAVE = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined

/** Quanto aspettare il database prima di lasciar perdere. */
const ATTESA_MS = 8000

/** Le colonne chieste: il contenuto serve per minuti di lettura e ripieghi. */
const CAMPI = 'id,titolo,slug,estratto,copertina,contenuto,creato'

/** true quando il browser può leggere dal database. */
export const blogCollegato = Boolean(URL_BASE && CHIAVE)

/* --- SLUG ----------------------------------------------------------------- */

/**
 * Uno slug come lo produce il pannello: lettere, cifre, trattini. Serve a
 * tre cose insieme: un indirizzo pulito per la pagina statica, un valore che
 * PostgREST legge senza ambiguità nel filtro eq., e la certezza che
 * "articolo" resti libero, perché /blog/articolo/ è la pagina guscio che
 * disegna nel browser gli articoli senza pagina propria.
 */
export function slugValido(slug: string): boolean {
  return /^[a-z0-9_-]{1,120}$/i.test(slug) && slug.toLowerCase() !== 'articolo'
}

/* --- DATE ----------------------------------------------------------------- */

/**
 * Postgres scrive i secondi con sei decimali ("10:20:30.123456+00:00"):
 * V8 li digerisce, Safari a volte no. Tre decimali li leggono tutti.
 */
function dataDa(iso: string): Date | null {
  const data = new Date(iso.replace(/(\.\d{3})\d+/, '$1'))
  return Number.isNaN(data.getTime()) ? null : data
}

/**
 * La data per esteso in italiano, sempre nel fuso di Roma: così la pagina
 * costruita su un server in UTC e quella ridisegnata nel browser di un
 * lettore dicono lo stesso giorno.
 */
export function dataItaliana(iso: string): string {
  const data = dataDa(iso)
  if (!data) return ''
  return data.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Rome',
  })
}

/**
 * Solo il giorno, nella forma che vuole l'attributo datetime di <time>:
 * stesso fuso della data leggibile, così le due non si contraddicono mai a
 * cavallo della mezzanotte. en-CA è l'unica locale che scrive AAAA-MM-GG.
 */
export function dataIso(iso: string): string {
  const data = dataDa(iso)
  if (!data) return ''
  try {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Europe/Rome',
    }).format(data)
  } catch {
    return /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10) : ''
  }
}

/** L'indirizzo pubblico di un articolo, lo stesso ovunque venga costruito. */
export function indirizzoArticolo(slug: string): string {
  return `/blog/${slug}/`
}

/* --- DATI CALCOLATI ------------------------------------------------------- */

/** L'estratto scritto dal cliente, oppure l'inizio del testo tagliato bene. */
export function descrizioneDi(a: ArticoloPubblico): string {
  return a.estratto.trim() || testoSemplice(a.contenuto, 155)
}

/** Copertina, estratto e minuti di lettura, con i ripieghi già applicati. */
export function schedaDi(a: ArticoloPubblico): Scheda {
  return {
    slug: a.slug,
    titolo: a.titolo,
    estratto: descrizioneDi(a),
    copertina: a.copertina && a.copertina.trim() ? a.copertina : primaImmagine(a.contenuto),
    minuti: tempoLettura(a.contenuto),
    creato: a.creato,
  }
}

/**
 * JSON per un blocco ld+json. JSON.stringify non escapa "<": un "</script>"
 * nel titolo di un articolo chiuderebbe il blocco in anticipo. U+2028 e
 * U+2029 spezzano invece il parsing. Stessa cura di Schema.astro, ripetuta
 * qui perché i titoli del blog li scrive il cliente, non il codice.
 */
export function jsonLd(dati: unknown): string {
  return JSON.stringify(dati)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/* --- LETTURE -------------------------------------------------------------- */

/** Un segnale che scade da solo; sui browser che non lo hanno, nessun limite. */
function segnaleAttesa(): AbortSignal | undefined {
  try {
    return AbortSignal.timeout(ATTESA_MS)
  } catch {
    return undefined
  }
}

/** Una riga del database ridotta ai campi attesi, o null se non è un articolo. */
function articoloPulito(grezzo: unknown): ArticoloPubblico | null {
  if (!grezzo || typeof grezzo !== 'object') return null
  const riga = grezzo as Record<string, unknown>
  const testo = (valore: unknown) => (typeof valore === 'string' ? valore : '')

  const slug = testo(riga.slug)
  const titolo = testo(riga.titolo)
  // Senza slug non ha un indirizzo, senza titolo non ha una card: fuori.
  if (!slug || !titolo) return null

  const copertina = testo(riga.copertina).trim()
  return {
    id: testo(riga.id),
    titolo,
    slug,
    estratto: testo(riga.estratto),
    copertina: copertina || null,
    contenuto: testo(riga.contenuto),
    creato: testo(riga.creato),
  }
}

/** Una lettura dalla REST API. Torna null se qualcosa non va, senza mai lanciare. */
async function leggi(percorso: string): Promise<unknown[] | null> {
  if (!URL_BASE || !CHIAVE) return null
  try {
    const risposta = await fetch(`${URL_BASE}/rest/v1/${percorso}`, {
      headers: { apikey: CHIAVE, Authorization: `Bearer ${CHIAVE}`, Accept: 'application/json' },
      signal: segnaleAttesa(),
    })
    if (!risposta.ok) return null
    const dati: unknown = await risposta.json()
    return Array.isArray(dati) ? dati : null
  } catch {
    // Rete assente, richiesta scaduta o bloccata: la pagina resta com'è.
    return null
  }
}

/** Tutti gli articoli pubblicati, dal più recente. Null se non si può leggere. */
export async function leggiArticoliPubblicati(): Promise<ArticoloPubblico[] | null> {
  const righe = await leggi(`articoli?select=${CAMPI}&bozza=eq.false&order=creato.desc`)
  if (!righe) return null
  return righe.map(articoloPulito).filter((a): a is ArticoloPubblico => a !== null)
}

/** L'articolo pubblicato con quello slug. Null se manca, o se non si può leggere. */
export async function leggiArticoloPerSlug(slug: string): Promise<ArticoloPubblico | null> {
  const pulito = slug.trim()
  // Uno slug strano non arriva nemmeno alla rete: non esiste, punto.
  if (!slugValido(pulito)) return null
  const righe = await leggi(
    `articoli?select=${CAMPI}&bozza=eq.false&slug=eq.${encodeURIComponent(pulito)}&limit=1`,
  )
  if (!righe || righe.length === 0) return null
  return articoloPulito(righe[0])
}
