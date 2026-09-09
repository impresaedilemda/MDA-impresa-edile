/**
 * Contatore di visite proprio, rispettoso della privacy.
 *
 * Una riga per visualizzazione: percorso, da dove arriva il visitatore, se e
 * al computer o al telefono, e un identificativo di sessione casuale che
 * muore quando si chiude la scheda. Nessun cookie, nessun indirizzo IP,
 * nessuna impronta del browser.
 *
 * E per questo che il sito non ha il banner dei cookie: non c'e niente da
 * far consentire. Un banner qui sarebbe una dichiarazione falsa su cosa fa
 * davvero il sito.
 *
 * Se qualcuno arriva da un link di tracciamento (/l/codice oppure ?ref=codice)
 * il codice resta appeso a tutte le visualizzazioni della sessione, cosi nel
 * pannello si vede quanto traffico ha portato ogni link.
 */

const URL_BASE = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined
const CHIAVE = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined

const SESSIONE = 'mda-sessione'
const CODICE = 'mda-codice-link'
const PRIMA = 'mda-prima-visita'

/** Il pannello scrive questa chiave: le visite dell'amministratore non contano. */
const NON_TRACCIARE = 'mda-non-tracciare'

function idSessione(): string {
  try {
    let id = sessionStorage.getItem(SESSIONE)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(SESSIONE, id)
    }
    return id
  } catch {
    // Modalita privata senza archiviazione: ogni pagina conta come sessione
    // nuova. Meglio un numero di visitatori un po' gonfiato che nessun dato.
    return crypto.randomUUID()
  }
}

/** Ricorda il codice del link per tutta la sessione. */
export function ricordaCodice(codice: string): void {
  const pulito = codice
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 60)
  if (!pulito) return
  try {
    sessionStorage.setItem(CODICE, pulito)
  } catch {
    /* senza archiviazione si perde solo l'attribuzione del link */
  }
}

function codiceRicordato(): string | null {
  try {
    return sessionStorage.getItem(CODICE)
  } catch {
    return null
  }
}

/**
 * Da dove arriva il visitatore. Interessa solo alla prima pagina della
 * sessione: dentro il sito la "sorgente" saremmo noi stessi. Si salva
 * soltanto il nome del dominio (google.com, facebook.com), mai l'indirizzo
 * intero, che potrebbe contenere quello che la persona aveva cercato.
 */
function sorgente(): string | null {
  try {
    if (sessionStorage.getItem(PRIMA)) return null
    sessionStorage.setItem(PRIMA, '1')
  } catch {
    return null
  }

  if (!document.referrer) return null
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '')
    const nostro = location.hostname.replace(/^www\./, '')
    return host && host !== nostro ? host.slice(0, 160) : null
  } catch {
    return null
  }
}

function dispositivo(): 'computer' | 'telefono' {
  return matchMedia('(max-width: 767px)').matches ? 'telefono' : 'computer'
}

function spento(): boolean {
  if (!URL_BASE || !CHIAVE) return true
  try {
    if (localStorage.getItem(NON_TRACCIARE)) return true
  } catch {
    /* senza archiviazione si continua a contare */
  }
  // Chi ha chiesto di non essere seguito viene ascoltato, anche se qui non
  // raccogliamo niente di personale.
  return navigator.doNotTrack === '1' || (navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl === true
}

/** Registra la pagina corrente. Non lancia mai: un contatore non rompe un sito. */
export function registraVisita(): void {
  if (spento()) return

  // Il codice del link puo arrivare come ?ref= sulla pagina stessa.
  const parametro = new URLSearchParams(location.search).get('ref')
  if (parametro) ricordaCodice(parametro)

  const corpo = JSON.stringify({
    percorso: location.pathname.slice(0, 300),
    sorgente: sorgente(),
    dispositivo: dispositivo(),
    sessione: idSessione(),
    codice_link: codiceRicordato(),
  })

  const indirizzo = `${URL_BASE}/rest/v1/visite`
  const intestazioni = {
    'Content-Type': 'application/json',
    apikey: CHIAVE as string,
    Authorization: `Bearer ${CHIAVE}`,
    Prefer: 'return=minimal',
  }

  // keepalive: la richiesta arriva anche se la persona chiude subito la
  // scheda. sendBeacon non va bene qui perche non permette le intestazioni.
  fetch(indirizzo, { method: 'POST', headers: intestazioni, body: corpo, keepalive: true }).catch(() => {
    /* rete assente o chiamata bloccata: il sito continua come se niente fosse */
  })
}
