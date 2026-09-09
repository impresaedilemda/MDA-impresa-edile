/**
 * =============================================================================
 *  LETTURA PUBBLICA DAL BROWSER: i contenuti del pannello, dopo la build
 * =============================================================================
 *  Il sito è statico e le recensioni e i cantieri entrano nell'HTML quando
 *  Vercel lo costruisce (vedi src/lib/remoto.ts). Fra una build e l'altra il
 *  cliente può però aver aggiunto, nascosto o riordinato qualcosa dal
 *  pannello: le sezioni della home chiedono qui la versione più fresca e, se
 *  è diversa da quella resa, si ridisegnano da sole.
 *
 *  Stessa chiave anon del browser, stesse policy RLS: da qui si leggono solo
 *  le righe che chiunque potrebbe leggere. Senza le variabili
 *  PUBLIC_SUPABASE_* la funzione torna null e il sito resta com'è.
 *
 *  Non lancia mai: chi chiama decide cosa fare con un null.
 * =============================================================================
 */

const URL_BASE = (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '')
const CHIAVE = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined

/** Quanto aspettare il database prima di lasciare la pagina com'è. */
const ATTESA_MS = 6000

/**
 * Una lettura dalla REST API di Supabase. `percorso` è tabella più query,
 * es. "recensioni?select=id,nome&visibile=eq.true". Torna null se mancano le
 * variabili, se la risposta non è ok o se la rete non risponde in tempo.
 */
export async function leggiPubblico<T>(percorso: string): Promise<T[] | null> {
  if (!URL_BASE || !CHIAVE) return null
  try {
    const risposta = await fetch(`${URL_BASE}/rest/v1/${percorso}`, {
      headers: { apikey: CHIAVE, Authorization: `Bearer ${CHIAVE}` },
      signal: AbortSignal.timeout(ATTESA_MS),
    })
    if (!risposta.ok) return null
    const dati: unknown = await risposta.json()
    return Array.isArray(dati) ? (dati as T[]) : null
  } catch {
    return null
  }
}
