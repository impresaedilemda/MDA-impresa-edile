/**
 * =============================================================================
 *  CONSENSO AI COOKIE E AGLI STRUMENTI DI TRACCIAMENTO
 * =============================================================================
 *  Regola applicata (art. 122 d.lgs. 196/2003 e linee guida del Garante del
 *  10 giugno 2021, doc. web 9677876):
 *
 *   - gli strumenti tecnici e le statistiche di prima parte, minimizzate e
 *     usate solo in forma aggregata dal titolare, NON richiedono consenso;
 *   - qualsiasi strumento di terze parti che profila o che consente a un
 *     fornitore esterno di incrociare i dati (Google Analytics 4, pixel
 *     pubblicitari, mappe incorporate) richiede consenso PREVENTIVO, libero,
 *     specifico e revocabile.
 *
 *  Da qui discendono tre vincoli sul banner, tutti richiesti dal Garante:
 *   1. niente si carica prima della scelta, salvo il necessario;
 *   2. "Rifiuta" deve essere visibile e facile quanto "Accetta": nessuna
 *      chiusura con la X che valga come consenso, nessuno scroll che accetti;
 *   3. dopo un rifiuto il banner non si ripropone a ogni pagina. Il Garante
 *      indica sei mesi come periodo ragionevole.
 *
 *  La scelta vive nel localStorage del visitatore: non e un cookie e non
 *  esce mai dal suo dispositivo.
 * =============================================================================
 */

/** Cambiare questo numero quando cambiano le categorie: le scelte vecchie decadono. */
export const VERSIONE_CONSENSO = 1

export const CHIAVE_CONSENSO = 'mda-consenso'

/** Quanto vale un rifiuto prima di poter richiedere: sei mesi, come indica il Garante. */
export const GIORNI_RIPROPOSIZIONE = 180

export type Categorie = {
  /** Sempre true: sono le funzioni senza le quali il sito non funziona. */
  necessari: true
  /** Google Analytics 4. Spento finche non c'e un si esplicito. */
  statistiche: boolean
}

export type Consenso = {
  versione: number
  /** ISO, serve a sapere quando si puo richiedere dopo un rifiuto. */
  data: string
  categorie: Categorie
}

/** La scelta salvata, oppure null se non e mai stata fatta o non e piu valida. */
export function leggiConsenso(): Consenso | null {
  try {
    const grezzo = localStorage.getItem(CHIAVE_CONSENSO)
    if (!grezzo) return null
    const dato = JSON.parse(grezzo) as Consenso
    if (dato?.versione !== VERSIONE_CONSENSO) return null
    if (typeof dato?.categorie?.statistiche !== 'boolean') return null
    return dato
  } catch {
    // Modalita privata o archiviazione bloccata: vale come "mai scelto", e
    // senza archiviazione non possiamo comunque caricare niente di terze parti.
    return null
  }
}

export function salvaConsenso(statistiche: boolean): Consenso {
  const scelta: Consenso = {
    versione: VERSIONE_CONSENSO,
    data: new Date().toISOString(),
    categorie: { necessari: true, statistiche },
  }
  try {
    localStorage.setItem(CHIAVE_CONSENSO, JSON.stringify(scelta))
  } catch {
    /* senza archiviazione la scelta vale per questa sola pagina */
  }
  return scelta
}

/**
 * true quando il banner va mostrato: nessuna scelta valida, oppure un
 * rifiuto piu vecchio di sei mesi. Un consenso dato invece resta finche la
 * persona non lo revoca da sola.
 */
export function serveIlBanner(): boolean {
  const scelta = leggiConsenso()
  if (!scelta) return true
  if (scelta.categorie.statistiche) return false

  const quando = Date.parse(scelta.data)
  if (!Number.isFinite(quando)) return true
  const giorni = (Date.now() - quando) / 86_400_000
  return giorni > GIORNI_RIPROPOSIZIONE
}

/* --- Google Analytics 4 ---------------------------------------------------
 * Caricato solo su consenso esplicito e solo se esiste un identificativo.
 * Il Consent Mode resta su "denied" fino a quel momento, cosi anche le
 * eventuali chiamate anticipate non trasmettono nulla.
 * ------------------------------------------------------------------------ */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...argomenti: unknown[]) => void
  }
}

let gaCaricato = false

function gtag(...argomenti: unknown[]): void {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(argomenti)
}

/** Consent Mode v2 su "negato". Va chiamato prima di qualunque altra cosa. */
export function preparaConsentMode(): void {
  window.gtag = window.gtag ?? gtag
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  })
}

/**
 * Accende GA4. Idempotente: chiamarla due volte non carica due volte lo script.
 * `anonymize_ip` non esiste piu in GA4 (l'IP e sempre troncato lato Google),
 * quindi non si finge di impostarlo.
 */
export function accendiStatistiche(idGa: string): void {
  if (!idGa) return
  gtag('consent', 'update', { analytics_storage: 'granted' })
  if (gaCaricato) return
  gaCaricato = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(idGa)}`
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', idGa, { send_page_view: true })
}

/** Revoca. GA resta caricato se lo era, ma smette di scrivere e di inviare. */
export function spegniStatistiche(): void {
  gtag('consent', 'update', { analytics_storage: 'denied' })
}
