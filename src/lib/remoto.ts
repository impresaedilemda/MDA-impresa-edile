/**
 * =============================================================================
 *  CONTENUTI REMOTI: quello che il sito legge dal database quando viene generato
 * =============================================================================
 *  Il sito e statico. Quando Vercel lo costruisce, questo modulo chiede a
 *  Supabase gli articoli pubblicati, le recensioni, i cantieri e i dati
 *  dell'impresa scritti dal cliente nel pannello, e li consegna alle pagine
 *  come se fossero scritti nel codice.
 *
 *  Senza le due variabili PUBLIC_SUPABASE_* (in locale, o se il database non
 *  risponde) il sito si costruisce lo stesso con i contenuti di src/config/:
 *  meglio un sito con gli esempi che nessun sito.
 *
 *  Gira SOLO durante la build, in Node: usa fetch e la chiave anon, la stessa
 *  che il browser gia conosce. Le policy RLS fanno il resto: da qui si leggono
 *  solo le righe che chiunque potrebbe leggere.
 * =============================================================================
 */

import type { Articolo, ImpostazioniSito, Lavoro, Recensione } from './tipi'

const URL_BASE = (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '')
const CHIAVE = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined

/** true quando il sito puo leggere dal database. */
export const remotoAttivo = Boolean(URL_BASE && CHIAVE)

/** Quanto aspettare il database prima di rinunciare e usare gli esempi. */
const ATTESA_MS = 8000

let avvisato = false

/** Una lettura dalla REST API. Torna null se qualcosa non va, senza mai lanciare. */
async function leggi<T>(percorso: string): Promise<T[] | null> {
  if (!remotoAttivo) return null
  try {
    const risposta = await fetch(`${URL_BASE}/rest/v1/${percorso}`, {
      headers: { apikey: CHIAVE as string, Authorization: `Bearer ${CHIAVE}` },
      signal: AbortSignal.timeout(ATTESA_MS),
    })
    if (!risposta.ok) throw new Error(`HTTP ${risposta.status} su ${percorso}`)
    return (await risposta.json()) as T[]
  } catch (errore) {
    if (!avvisato) {
      avvisato = true
      console.warn(
        `[mda] Database non raggiungibile durante la build (${errore instanceof Error ? errore.message : errore}). Il sito usa i contenuti di src/config/.`,
      )
    }
    return null
  }
}

/* --- LETTURE -------------------------------------------------------------- */

export type DatiRemoti = {
  articoli: Articolo[]
  recensioni: Recensione[]
  lavori: Lavoro[]
  impostazioni: Partial<ImpostazioniSito>
}

/** Solo i campi davvero compilati: una stringa vuota non deve coprire il valore del codice. */
function pieni(dati: Record<string, unknown>): Partial<ImpostazioniSito> {
  const puliti: Record<string, unknown> = {}
  for (const [chiave, valore] of Object.entries(dati)) {
    if (valore === null || valore === undefined) continue
    if (typeof valore === 'string' && valore.trim() === '') continue
    if (typeof valore === 'number' && !Number.isFinite(valore)) continue
    puliti[chiave] = valore
  }
  return puliti as Partial<ImpostazioniSito>
}

async function caricaTutto(): Promise<DatiRemoti> {
  if (!remotoAttivo) return { articoli: [], recensioni: [], lavori: [], impostazioni: {} }

  const [articoli, recensioni, lavori, impostazioni] = await Promise.all([
    leggi<Articolo>('articoli?select=*&bozza=eq.false&order=creato.desc'),
    leggi<Recensione>('recensioni?select=*&visibile=eq.true&order=ordine.asc,creato.desc'),
    leggi<Lavoro>('lavori?select=*&visibile=eq.true&order=ordine.asc,creato.desc'),
    leggi<{ dati: Record<string, unknown> }>('impostazioni?select=dati&id=eq.sito'),
  ])

  return {
    // Un articolo senza slug non ha un indirizzo: resta fuori dal sito.
    articoli: (articoli ?? []).filter((a) => a.slug && a.titolo),
    recensioni: recensioni ?? [],
    lavori: lavori ?? [],
    impostazioni: pieni(impostazioni?.[0]?.dati ?? {}),
  }
}

/**
 * Letti una volta sola per build. L'await in cima al modulo fa aspettare chi
 * importa: le pagine trovano i dati gia pronti, senza async nel frontmatter.
 */
export const remoto: DatiRemoti = await caricaTutto()

/** Gli indirizzi dei file caricati dal pannello stanno tutti qui sotto. */
export const radiceImmagini = remotoAttivo ? `${URL_BASE}/storage/v1/object/public/immagini/` : null
