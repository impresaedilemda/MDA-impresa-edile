/**
 * =============================================================================
 *  INVIO DI UNA RICHIESTA DAL SITO
 * =============================================================================
 *  I due moduli del sito (il richiamo rapido nell'hero e il configuratore del
 *  preventivo) passano da qui. La richiesta viene salvata nel database, dove
 *  il cliente la trova nel pannello sotto "Richieste": e la copia che non si
 *  perde, anche se l'email non parte.
 *
 *  Senza database (in locale, senza le variabili PUBLIC_SUPABASE_*) la
 *  richiesta finisce nel localStorage, nello stesso deposito che il pannello
 *  legge in modalita di prova: cosi si puo provare il giro completo anche
 *  senza rete.
 *
 *  ATTENZIONE, e il punto che conta: quel ripiego vale SOLO in sviluppo.
 *  Sul sito pubblicato il localStorage e il browser del visitatore, non un
 *  posto dove qualcuno andra mai a leggere. Se contasse come "richiesta al
 *  sicuro", il modulo mostrerebbe "Richiesta ricevuta" mentre il contatto
 *  resta chiuso nel telefono di chi ha scritto, e sarebbe di nuovo la bugia
 *  che questo modulo aveva gia prima del 9 settembre 2026. In produzione,
 *  senza database, questa funzione torna false e il modulo mostra l'errore.
 *
 *  Non lancia mai: torna true se la richiesta e al sicuro, false altrimenti.
 *  Decidere cosa dire alla persona spetta al modulo che chiama.
 * =============================================================================
 */

import type { NuovaRichiesta, Richiesta } from './tipi'

const URL_BASE = (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '')
const CHIAVE = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined

/** Lo stesso deposito locale del pannello in modalita di prova. */
const CHIAVE_LOCALE = 'mda-admin'

/** Il codice del link di tracciamento, se la persona e arrivata da uno. */
function codiceLink(): string | null {
  try {
    return sessionStorage.getItem('mda-codice-link')
  } catch {
    return null
  }
}

function taglia(testo: unknown, massimo: number): string {
  return String(testo ?? '')
    .trim()
    .slice(0, massimo)
}

/** I dati puliti e tagliati alle misure che il database accetta. */
function pulisci(dati: NuovaRichiesta): NuovaRichiesta {
  return {
    tipo: dati.tipo === 'preventivo' ? 'preventivo' : 'richiamo',
    nome: taglia(dati.nome, 120),
    telefono: taglia(dati.telefono, 40),
    email: taglia(dati.email, 160),
    comune: taglia(dati.comune, 120),
    cap: taglia(dati.cap, 10),
    servizio: taglia(dati.servizio, 120),
    messaggio: taglia(dati.messaggio, 3000),
    dettagli: dati.dettagli ?? {},
    pagina: taglia(dati.pagina || location.pathname, 300),
    codice_link: dati.codice_link ?? codiceLink(),
  }
}

function salvaInLocale(dati: NuovaRichiesta): boolean {
  try {
    const grezzo = localStorage.getItem(CHIAVE_LOCALE)
    const deposito = grezzo ? JSON.parse(grezzo) : {}
    const adesso = new Date().toISOString()
    const riga: Richiesta = {
      ...dati,
      id: crypto.randomUUID(),
      stato: 'nuova',
      nota: '',
      creato: adesso,
      aggiornato: adesso,
    }
    deposito.richieste = [...(deposito.richieste ?? []), riga]
    localStorage.setItem(CHIAVE_LOCALE, JSON.stringify(deposito))
    return true
  } catch {
    return false
  }
}

/** Salva la richiesta. true se e al sicuro da qualche parte, false se si e persa. */
export async function inviaRichiesta(grezza: NuovaRichiesta): Promise<boolean> {
  const dati = pulisci(grezza)
  if (dati.telefono.length < 5) return false

  if (!URL_BASE || !CHIAVE) {
    // In sviluppo il deposito locale serve a provare il giro completo.
    // In produzione non e un posto sicuro: e il browser di chi scrive.
    if (import.meta.env.DEV) return salvaInLocale(dati)
    console.error('[MDA] Nessun database configurato: la richiesta non e stata salvata da nessuna parte.')
    return false
  }

  try {
    const risposta = await fetch(`${URL_BASE}/rest/v1/richieste`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CHIAVE,
        Authorization: `Bearer ${CHIAVE}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(dati),
      keepalive: true,
    })
    return risposta.ok
  } catch {
    return false
  }
}
