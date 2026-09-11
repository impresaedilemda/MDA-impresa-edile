/**
 * =============================================================================
 *  VERIFICA IN DUE PASSAGGI: la finestra che collega l'app del telefono
 * =============================================================================
 *  Un solo pezzo, aperto da due posti:
 *
 *  - la PROPOSTA, subito dopo l'ingresso, finché il conto non ha l'app
 *    collegata. Dice perché serve, mostra il QR e la chiave e chiede il primo
 *    codice. "Più tardi" la chiude fino alla prossima apertura del browser:
 *    torna, ma non tormenta chi sta lavorando.
 *  - le IMPOSTAZIONI, dal pulsante "Attiva" nella card dell'accesso.
 *
 *  Il QR arriva da Supabase già disegnato (un SVG): qui si mette in pagina
 *  come nodo, non come immagine, così scala senza sgranare e non passa da un
 *  indirizzo data:. Accanto sta la chiave scritta a gruppi di quattro, per chi
 *  non riesce a inquadrare e la copia a mano.
 *
 *  Il campo del codice serve anche alla schermata di accesso (accesso.ts):
 *  stesso campo, stesse regole, stesso messaggio quando il codice è sbagliato.
 * =============================================================================
 */

import {
  CODICE_ERRATO,
  DUE_FATTORI_SPENTI,
  confermaDueFattori,
  iniziaDueFattori,
  rimuoviDueFattori,
} from './dati'
import { bottone, campo, el, fascia, scheletro, svuota, toast } from './dom'
import { iconaAttesa, iconaAvviso, iconaCopia, iconaScudo, iconaSpunta } from './icone'
import { t } from './lingua'

/** Quante cifre ha il codice dell'app. */
export const LUNGHEZZA_CODICE = 6

/** "Più tardi" vale per questa apertura del browser: sessionStorage, non localStorage. */
const CHIAVE_RIMANDO = 'mda-admin-2fa-rimandata'

export type MotivoDialogo = 'proposta' | 'impostazioni'

/**
 * Evento sul document quando l'app viene collegata: la card dell'accesso in
 * Impostazioni lo ascolta e si ridisegna, così la proposta aperta sopra
 * quella pagina non lascia dietro di sé un "Non attiva" vecchio.
 */
export const EVENTO_DUE_FATTORI = 'adm-duefattori'

/** true se, in questa apertura del browser, il cliente ha già detto "più tardi". */
export function propostaRimandata(): boolean {
  try {
    return sessionStorage.getItem(CHIAVE_RIMANDO) === '1'
  } catch {
    return false
  }
}

function rimandaProposta(): void {
  try {
    sessionStorage.setItem(CHIAVE_RIMANDO, '1')
  } catch {
    /* la proposta tornerà alla prossima pagina, poco male */
  }
}

/* --- IL CAMPO DEL CODICE -------------------------------------------------- */

/**
 * Sei cifre e basta: tastiera numerica sul telefono, niente maiuscole né
 * correttore, e l'autocompilazione dei codici usa e getta dove il sistema
 * la offre. Quello che non è una cifra sparisce mentre si scrive.
 */
export function campoCodice(id: string): { blocco: HTMLElement; input: HTMLInputElement } {
  const c = campo({
    id,
    etichetta: t('duefattori.codice'),
    tipo: 'text',
    autocomplete: 'one-time-code',
    inputmode: 'numeric',
    obbligatorio: true,
    segnaposto: '000000',
  })
  const input = c.input as HTMLInputElement
  input.name = 'codice'
  input.setAttribute('pattern', '[0-9]*')
  input.setAttribute('autocapitalize', 'none')
  input.setAttribute('spellcheck', 'false')
  // Niente maxlength: una lettera scritta per sbaglio occuperebbe un posto
  // delle sei cifre prima che questo filtro la tolga. Si taglia qui.
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, LUNGHEZZA_CODICE)
  })
  c.blocco.classList.add('adm-2fa-codice')
  return { blocco: c.blocco, input }
}

/** Il codice pulito, o null se non ha sei cifre. */
export function codicePulito(input: HTMLInputElement): string | null {
  const cifre = input.value.replace(/\D/g, '')
  return cifre.length === LUNGHEZZA_CODICE ? cifre : null
}

/** Traduce i messaggi speciali dello strato dati; il resto passa com'è. */
export function messaggioCodice(errore: unknown): string {
  const m = errore instanceof Error ? errore.message : ''
  if (m === CODICE_ERRATO) return t('duefattori.codiceErrato')
  if (m === DUE_FATTORI_SPENTI) return t('duefattori.nonDisponibile')
  return m || t('comune.errore')
}

/* --- QR E CHIAVE ---------------------------------------------------------- */

function decodifica(testo: string): string {
  try {
    return decodeURIComponent(testo)
  } catch {
    return testo
  }
}

/**
 * Il QR di Supabase in pagina. È un SVG con larghezza e altezza fisse e
 * senza viewBox: si ricava il viewBox dalle misure e si tolgono le misure,
 * così è il CSS a decidere quanto è grande. Se la stringa non si legge come
 * SVG si ripiega su un <img> con l'indirizzo data:, che il browser sa aprire.
 */
function immagineQr(qr: string): HTMLElement {
  const grezzo = decodifica(qr.replace(/^data:image\/svg\+xml[^,]*,/, ''))
  const documento = new DOMParser().parseFromString(grezzo, 'image/svg+xml')
  const radice = documento.documentElement
  const leggibile = radice.nodeName === 'svg' && !documento.querySelector('parsererror')

  if (leggibile) {
    const svg = document.importNode(radice, true)
    const larghezza = Number.parseFloat(svg.getAttribute('width') ?? '')
    const altezza = Number.parseFloat(svg.getAttribute('height') ?? '')
    if (!svg.getAttribute('viewBox') && larghezza > 0 && altezza > 0) {
      svg.setAttribute('viewBox', `0 0 ${larghezza} ${altezza}`)
    }
    svg.removeAttribute('width')
    svg.removeAttribute('height')
    svg.setAttribute('role', 'img')
    svg.setAttribute('aria-label', t('duefattori.qrAria'))
    return el('div', { class: 'adm-2fa-qr-immagine' }, [svg])
  }

  const src = qr.startsWith('data:') ? qr : `data:image/svg+xml;utf-8,${encodeURIComponent(qr)}`
  return el('div', { class: 'adm-2fa-qr-immagine' }, [el('img', { src, alt: t('duefattori.qrAria') })])
}

/** La chiave a gruppi di quattro, e il pulsante che la copia intera. */
function bloccoChiave(chiave: string): HTMLElement {
  const pulita = chiave.replace(/\s+/g, '')
  const leggibile = pulita.match(/.{1,4}/g)?.join(' ') ?? pulita

  const copia = el('button', { type: 'button', class: 'adm-btn adm-btn-chiaro adm-2fa-copia' }, [
    iconaCopia(14),
    el('span', undefined, t('duefattori.copiaChiave')),
  ])
  copia.addEventListener('click', () => {
    navigator.clipboard
      ?.writeText(pulita)
      .then(() => toast(t('comune.copiato')))
      .catch(() => undefined)
  })

  return el('div', { class: 'adm-2fa-chiave-blocco' }, [
    el('span', { class: 'adm-etichetta-campo' }, t('duefattori.chiave')),
    el('code', { class: 'adm-2fa-chiave' }, leggibile),
    copia,
  ])
}

/* --- LA FINESTRA ---------------------------------------------------------- */

/**
 * Apre la finestra e risolve true se l'app è stata collegata e confermata,
 * false se il cliente ha rimandato o annullato.
 *
 * Lo sfondo scuro NON chiude: un tocco fuori posto dopo aver inquadrato il
 * QR butterebbe via il collegamento a metà. Si esce solo dai pulsanti o con
 * Esc, che vale come "più tardi".
 */
export function attivaDueFattori(motivo: MotivoDialogo): Promise<boolean> {
  return new Promise((risolvi) => {
    const dialogo = el('dialog', { class: 'adm-dialogo adm-dialogo-2fa' })
    let fattoreId: string | null = null
    let chiuso = false

    const chiudi = (esito: boolean): void => {
      if (chiuso) return
      chiuso = true
      if (!esito && motivo === 'proposta') rimandaProposta()
      // Un collegamento avviato e mai confermato non deve restare sul server.
      if (!esito && fattoreId) void rimuoviDueFattori(fattoreId).catch(() => undefined)
      dialogo.close()
      dialogo.remove()
      risolvi(esito)
    }

    const intro = el('div', { class: 'adm-2fa-intro' }, [
      el('div', { class: 'adm-2fa-icona' }, [iconaScudo(26)]),
      el('div', undefined, [
        el(
          'h2',
          { class: 'adm-dialogo-titolo' },
          t(motivo === 'proposta' ? 'duefattori.propostaTitolo' : 'duefattori.titolo'),
        ),
        el('p', { class: 'adm-dialogo-testo' }, t('duefattori.propostaTesto')),
      ]),
    ])

    const passi = el('ol', { class: 'adm-2fa-passi' }, [
      el('li', undefined, t('duefattori.passo1')),
      el('li', undefined, t('duefattori.passo2')),
      el('li', undefined, t('duefattori.passo3')),
    ])

    const zonaQr = el('div', { class: 'adm-2fa-qr' })
    const codice = campoCodice('adm-2fa-codice')
    const avviso = el('div', { class: 'adm-errore', role: 'alert' })

    const segnala = (messaggio: string | null): void => {
      svuota(avviso)
      if (messaggio) avviso.append(iconaAvviso(16), el('span', undefined, messaggio))
    }

    const bRimanda = bottone(
      t(motivo === 'proposta' ? 'duefattori.piuTardi' : 'comune.annulla'),
      'adm-btn adm-btn-chiaro',
      () => chiudi(false),
    )
    const bAttiva = el('button', { class: 'adm-btn', type: 'submit', disabled: true })
    const attesa = (si: boolean): void => {
      svuota(bAttiva)
      bAttiva.append(si ? iconaAttesa(16) : iconaSpunta(16), el('span', undefined, t(si ? 'accesso.attesa' : 'duefattori.attiva')))
      bAttiva.disabled = si
    }

    async function carica(): Promise<void> {
      svuota(zonaQr)
      zonaQr.append(scheletro(3))
      segnala(null)
      try {
        const avvio = await iniziaDueFattori()
        if (chiuso) return
        fattoreId = avvio.fattoreId
        svuota(zonaQr)
        zonaQr.append(immagineQr(avvio.qr), bloccoChiave(avvio.chiave))
        attesa(false)
        codice.input.focus()
      } catch (errore) {
        if (chiuso) return
        svuota(zonaQr)
        zonaQr.append(
          fascia(messaggioCodice(errore), 'attenzione'),
          bottone(t('comune.riprova'), 'adm-btn adm-btn-chiaro', () => void carica()),
        )
      }
    }

    async function conferma(): Promise<void> {
      if (bAttiva.disabled || !fattoreId) return
      const cifre = codicePulito(codice.input)
      if (!cifre) {
        segnala(t('duefattori.codiceCorto'))
        codice.input.focus()
        return
      }
      attesa(true)
      codice.input.disabled = true
      segnala(null)
      try {
        await confermaDueFattori(fattoreId, cifre)
        toast(t('duefattori.attivata'))
        document.dispatchEvent(new Event(EVENTO_DUE_FATTORI))
        // Confermato: non va più tolto alla chiusura.
        fattoreId = null
        chiudi(true)
      } catch (errore) {
        segnala(messaggioCodice(errore))
        attesa(false)
        codice.input.disabled = false
        codice.input.select()
      }
    }

    const modulo = el('form', { class: 'adm-dialogo-corpo', novalidate: true }, [
      intro,
      passi,
      zonaQr,
      codice.blocco,
      avviso,
      el('div', { class: 'adm-dialogo-azioni' }, [bRimanda, bAttiva]),
      motivo === 'proposta' ? el('p', { class: 'adm-nota adm-2fa-nota' }, t('duefattori.dopoNota')) : null,
    ])
    modulo.addEventListener('submit', (ev) => {
      ev.preventDefault()
      void conferma()
    })
    dialogo.addEventListener('cancel', (ev) => {
      ev.preventDefault()
      chiudi(false)
    })

    dialogo.append(modulo)
    document.body.append(dialogo)
    dialogo.showModal()
    void carica()
  })
}
