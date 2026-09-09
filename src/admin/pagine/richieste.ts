/**
 * =============================================================================
 *  RICHIESTE: chi ha compilato un modulo sul sito
 * =============================================================================
 *  È la sezione che il cliente apre più spesso, e la apre dal telefono: una
 *  persona ha lasciato il numero e aspetta una chiamata. Per questo ogni
 *  richiesta è una card con i pulsanti di contatto grandi e sempre visibili,
 *  mentre tutto il resto (le risposte del configuratore, la pagina di
 *  partenza, gli appunti) sta chiuso sotto "Dettagli".
 *
 *  La lista si legge una volta sola; filtri e ricerca lavorano sull'elenco
 *  già in memoria, così su una connessione lenta cambiare scheda non costa
 *  nulla. Ogni cambio di stato aggiorna la card sul posto e il pallino del
 *  menu, senza ricaricare la pagina.
 *
 *  Nome, comune, messaggio: li scrive chi compila il modulo. Qui entrano solo
 *  come testo, mai come HTML.
 * =============================================================================
 */

import { aggiornaRichiesta, cancellaRichiesta, elencaRichieste, type Richiesta, type StatoRichiesta } from '../dati'
import {
  avatar,
  bottone,
  campo,
  conferma,
  distintivo,
  el,
  pulsante,
  scheletro,
  statoErrore,
  statoVuoto,
  svuota,
  toast,
} from '../dom'
import {
  iconaAvviso,
  iconaBusta,
  iconaCantiere,
  iconaCerca,
  iconaCestino,
  iconaGiu,
  iconaLuogo,
  iconaRichieste,
  iconaSalva,
  iconaSu,
  iconaTelefono,
  iconaWhatsapp,
} from '../icone'
import { dataOra, numero, t, tempoFa } from '../lingua'
import { aggiornaPallino, intestazione } from '../telaio'

/** Le quattro schede in cima: tutte, oppure uno dei tre stati. */
type Filtro = 'tutte' | StatoRichiesta

type Dettagli = Richiesta['dettagli']

/** Quello che una card deve poter dire alla lista che la contiene. */
type Contesto = {
  /** dopo ogni cambio di stato: ricalcola il pallino e il numero nella scheda */
  ricalcola: () => void
  /** quando la card è stata tolta dalla pagina */
  tolta: (r: Richiesta) => void
  /** una misura da fare quando la card sta già nella pagina */
  registraMisura: (misura: () => void) => void
}

/** Quante card di attesa mostrare mentre arrivano i dati. */
const SCHELETRI = 3

/** Le chiavi dei dettagli che raccontano la stima: escono in una riga sola. */
const CHIAVI_STIMA = new Set(['stima', 'stima_min', 'stima_max'])

/** Numera le card per dare un id ai pezzi collegati da aria-controls e for. */
let contatore = 0

/* --- STILI DI POSA --------------------------------------------------------
 *  admin.css copre card, pulsanti, campi e distintivi. Qui restano solo gli
 *  allineamenti interni della card, che nessuna classe copre. Vanno negli
 *  attributi style perché la CSP dichiara style-src 'self': un foglio creato
 *  dal codice verrebbe rifiutato dal browser, un attributo style no.
 * ------------------------------------------------------------------------ */

const STILE_CERCA = 'flex: 1 1 220px'
const STILE_TESTA = 'display: flex; align-items: flex-start; gap: 0.8rem'
const STILE_TESTA_TESTO = 'flex: 1; min-width: 0'
const STILE_NOME = 'margin: 0; font-size: 1.02rem; font-weight: 700; line-height: 1.3; overflow-wrap: anywhere'
const STILE_DISTINTIVI = 'display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.35rem'
const STILE_QUANDO =
  'flex-shrink: 0; padding-top: 0.2rem; font-size: 0.78rem; color: var(--adm-testo-3); white-space: nowrap; font-variant-numeric: tabular-nums'
const STILE_RIGHE = 'display: grid; gap: 0.45rem; margin-top: 0.95rem; font-size: 0.9rem; line-height: 1.5'
const STILE_RIGA = 'display: flex; align-items: flex-start; gap: 0.5rem; min-width: 0'
const STILE_ICONA_RIGA = 'flex-shrink: 0; margin-top: 0.2rem; color: var(--color-taupe-testo)'
const STILE_RIGA_TESTO = 'min-width: 0; overflow-wrap: anywhere'
const STILE_MESSAGGIO =
  'margin: 0; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; white-space: pre-line; overflow-wrap: anywhere; color: var(--adm-testo-2)'
const STILE_NUDO_SINISTRA = 'margin-left: -0.75rem'
const STILE_CONTATTI =
  'display: grid; grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)); gap: 0.5rem; margin-top: 1rem'
const STILE_RIGA_DETTAGLI = 'margin-top: 0.5rem'
const STILE_DETTAGLI = 'display: grid; gap: 1rem; margin-top: 0.5rem; border-top: 1px solid var(--adm-bordo); padding-top: 1rem'
const STILE_COPPIE = 'display: grid; gap: 0.55rem; margin: 0; font-size: 0.88rem'
const STILE_COPPIA = 'display: grid; gap: 0.1rem'
const STILE_COPPIA_VALORE = 'margin: 0; overflow-wrap: anywhere; white-space: pre-line'
const STILE_SALVA_NOTA = 'display: flex; justify-content: flex-end; margin-top: 0.6rem'
const STILE_ERRORE_CARD = 'margin-top: 0.9rem'
const STILE_ERRORE_TESTO = 'margin: 0'
const STILE_PIEDE = 'margin-top: 1rem'
const STILE_ICONA_IN_LINEA = 'display: inline-flex'

/* --- AIUTI ---------------------------------------------------------------- */

/** Un campo di testo del database come stringa pulita, anche se arriva vuoto. */
function testo(valore: unknown): string {
  if (typeof valore === 'string') return valore.trim()
  if (valore === null || valore === undefined) return ''
  return String(valore).trim()
}

/** Il numero come lo vuole `tel:`: solo cifre, più il + se c'era davanti. */
function numeroPerChiamata(telefono: string): string {
  const cifre = telefono.replace(/\D/g, '')
  if (!cifre) return ''
  return telefono.trim().startsWith('+') ? `+${cifre}` : cifre
}

/**
 * Il numero come lo vuole wa.me: prefisso internazionale e cifre, senza +.
 * Chi compila il modulo scrive "333 1234567" e basta: è un numero italiano
 * e davanti ci va il 39. Un + o uno 00 dicono che il prefisso c'è già.
 */
function numeroPerWhatsapp(telefono: string): string {
  const pulito = telefono.trim()
  const cifre = pulito.replace(/\D/g, '')
  if (!cifre) return ''
  if (pulito.startsWith('+')) return cifre
  if (cifre.startsWith('00')) return cifre.slice(2)
  if (cifre.length >= 11 && cifre.startsWith('39')) return cifre
  return `39${cifre}`
}

/** Minuscolo e senza accenti, così "Forlì" si trova anche scrivendo "forli". */
function normalizza(valore: string): string {
  return valore
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** true se la richiesta risponde a quello che c'è scritto nella ricerca. */
function corrisponde(r: Richiesta, cercato: string): boolean {
  const chiave = normalizza(cercato.trim())
  if (!chiave) return true

  // Un numero si cerca sulle cifre: "333 12" deve trovare "+39 333 1234567".
  const cifre = chiave.replace(/\D/g, '')
  if (cifre.length >= 3 && testo(r.telefono).replace(/\D/g, '').includes(cifre)) return true

  const campi = [r.nome, r.comune, r.cap, r.email, r.servizio].map(testo).join(' ')
  return normalizza(campi).includes(chiave)
}

/** "superficie_mq" diventa "Superficie mq": leggibile senza una tabella di traduzioni. */
function chiaveLeggibile(chiave: string): string {
  const pulita = chiave.replace(/_+/g, ' ').trim()
  if (!pulita) return chiave
  return pulita.charAt(0).toUpperCase() + pulita.slice(1)
}

/** Un valore dei dettagli come testo; null se non c'è niente da mostrare. */
function valoreLeggibile(valore: unknown): string | null {
  if (valore === null || valore === undefined) return null
  if (typeof valore === 'number') return Number.isFinite(valore) ? numero(valore) : null
  if (typeof valore !== 'string') return null
  const pulito = valore.trim()
  return pulito ? pulito : null
}

/** I dettagli come oggetto, anche se il database li ha salvati vuoti o storti. */
function dettagliDi(r: Richiesta): Dettagli {
  const grezzi: unknown = r.dettagli
  if (grezzi && typeof grezzi === 'object' && !Array.isArray(grezzi)) return grezzi as Dettagli
  return {}
}

/**
 * La stima mostrata alla persona: un intervallo se ci sono i due estremi,
 * altrimenti il valore così com'è. Un numero nudo è in euro; una stringa
 * arriva già scritta come si deve.
 */
function testoStima(dettagli: Dettagli): string | null {
  const grezzoMin = dettagli.stima_min
  const grezzoMax = dettagli.stima_max
  const min = valoreLeggibile(grezzoMin)
  const max = valoreLeggibile(grezzoMax)
  const numerico = typeof grezzoMin === 'number' || typeof grezzoMax === 'number'
  const intervallo = min && max ? `${min} - ${max}` : (min ?? max)
  if (intervallo) return numerico ? `${intervallo} €` : intervallo
  return valoreLeggibile(dettagli.stima)
}

/** Il distintivo dello stato: da leggere in mattone, contattata in verde, chiusa spenta. */
function distintivoStato(stato: StatoRichiesta): HTMLElement {
  if (stato === 'nuova') return distintivo(t('richieste.statoNuova'), 'attenzione')
  if (stato === 'contattata') return distintivo(t('richieste.statoContattata'), 'vivo')
  return distintivo(t('richieste.statoChiusa'), 'spento')
}

/** Una riga compatta: icona taupe e testo accanto. */
function rigaCompatta(simbolo: SVGElement, valore: string): HTMLElement {
  simbolo.setAttribute('style', STILE_ICONA_RIGA)
  return el('div', { style: STILE_RIGA }, [simbolo, el('span', { style: STILE_RIGA_TESTO }, valore)])
}

/* --- CARD ----------------------------------------------------------------- */

/**
 * La card di una richiesta. Tiene dentro di sé lo stato e i suoi pulsanti:
 * un cambio di stato ridisegna solo il distintivo, il bordo e le azioni in
 * fondo, così i dettagli aperti e gli appunti non ancora salvati restano
 * dove sono.
 */
function cardDi(r: Richiesta, contesto: Contesto): HTMLElement {
  const numeroCard = ++contatore
  const card = el('article', { class: 'adm-card adm-card-stretta adm-entra' })

  /* --- testa: avatar, nome, distintivi, quanto tempo aspetta --- */

  const nomeGrezzo = testo(r.nome)
  const nome = nomeGrezzo || t('richieste.senzaNome')
  const zonaStato = el('span', { style: STILE_ICONA_IN_LINEA })
  const tipo =
    r.tipo === 'preventivo'
      ? distintivo(t('richieste.tipoPreventivo'), 'vivo')
      : distintivo(t('richieste.tipoRichiamo'), 'neutro')

  const quando = el('time', { datetime: r.creato, title: dataOra(r.creato) || null, style: STILE_QUANDO }, tempoFa(r.creato))

  const testa = el('div', { style: STILE_TESTA }, [
    avatar(nomeGrezzo, null, 42),
    el('div', { style: STILE_TESTA_TESTO }, [
      el('p', { style: STILE_NOME }, nome),
      el('div', { style: STILE_DISTINTIVI }, [tipo, zonaStato]),
    ]),
    quando,
  ])

  /* --- righe compatte: comune, servizio, messaggio --- */

  const righe = el('div', { style: STILE_RIGHE })
  const comune = testo(r.comune)
  const servizio = testo(r.servizio)
  const messaggio = testo(r.messaggio)

  if (comune) righe.append(rigaCompatta(iconaLuogo(15), comune))
  if (servizio) righe.append(rigaCompatta(iconaCantiere(15), servizio))

  if (messaggio) {
    const paragrafo = el('p', { style: STILE_MESSAGGIO }, messaggio)

    // Il pulsante per leggere tutto compare solo se il testo è stato davvero
    // tagliato: si misura dopo che la card è nella pagina, e di nuovo quando
    // lo schermo cambia larghezza (un telefono girato taglia righe diverse).
    let aperto = false
    const simbolo = el('span', { style: STILE_ICONA_IN_LINEA }, [iconaGiu(14)])
    const etichetta = el('span', undefined, t('richieste.messaggio'))
    const bAltro = el(
      'button',
      {
        type: 'button',
        class: 'adm-btn adm-btn-nudo adm-btn-piccolo',
        'aria-expanded': 'false',
        style: STILE_NUDO_SINISTRA,
        hidden: true,
      },
      [simbolo, etichetta],
    )
    bAltro.addEventListener('click', () => {
      aperto = !aperto
      bAltro.setAttribute('aria-expanded', aperto ? 'true' : 'false')
      svuota(simbolo)
      simbolo.append(aperto ? iconaSu(14) : iconaGiu(14))
      etichetta.textContent = aperto ? t('comune.chiudi') : t('richieste.messaggio')
      if (aperto) {
        paragrafo.style.display = 'block'
        paragrafo.style.removeProperty('-webkit-line-clamp')
      } else {
        paragrafo.style.display = '-webkit-box'
        paragrafo.style.setProperty('-webkit-line-clamp', '3')
      }
    })
    contesto.registraMisura(() => {
      // Aperto non si misura: il testo intero non è mai tagliato, e il
      // pulsante deve restare per poterlo richiudere.
      if (aperto) return
      bAltro.hidden = paragrafo.scrollHeight <= paragrafo.clientHeight + 1
    })

    righe.append(el('div', undefined, [paragrafo, bAltro]))
  }

  /* --- contatti: grandi, sempre visibili --- */

  const contatti = el('div', { style: STILE_CONTATTI })
  const telefono = testo(r.telefono)
  const perChiamata = numeroPerChiamata(telefono)
  const perWhatsapp = numeroPerWhatsapp(telefono)
  const email = testo(r.email).replace(/\s+/g, '')

  if (perChiamata) {
    contatti.append(
      el('a', { class: 'adm-btn', href: `tel:${perChiamata}` }, [
        iconaTelefono(16),
        el('span', undefined, t('richieste.chiama')),
      ]),
    )
  }
  if (perWhatsapp) {
    contatti.append(
      el(
        'a',
        {
          class: 'adm-btn adm-btn-whatsapp',
          href: `https://wa.me/${perWhatsapp}?text=${encodeURIComponent(t('richieste.whatsappTesto'))}`,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        [iconaWhatsapp(16), el('span', undefined, t('richieste.whatsapp'))],
      ),
    )
  }
  if (email) {
    contatti.append(
      el('a', { class: 'adm-btn adm-btn-chiaro', href: `mailto:${email}` }, [
        iconaBusta(16),
        el('span', undefined, t('richieste.email')),
      ]),
    )
  }

  /* --- dettagli: chiusi finché non servono --- */

  const idDettagli = `ric-dettagli-${numeroCard}`
  const zonaDettagli = el('div', { id: idDettagli, style: STILE_DETTAGLI, hidden: true })

  const simboloDettagli = el('span', { style: STILE_ICONA_IN_LINEA }, [iconaGiu(14)])
  const bDettagli = el(
    'button',
    {
      type: 'button',
      class: 'adm-btn adm-btn-nudo adm-btn-piccolo',
      'aria-expanded': 'false',
      'aria-controls': idDettagli,
      style: STILE_NUDO_SINISTRA,
    },
    [simboloDettagli, el('span', undefined, t('richieste.dettagli'))],
  )
  bDettagli.addEventListener('click', () => {
    const apri = zonaDettagli.hidden
    zonaDettagli.hidden = !apri
    bDettagli.setAttribute('aria-expanded', apri ? 'true' : 'false')
    svuota(simboloDettagli)
    simboloDettagli.append(apri ? iconaSu(14) : iconaGiu(14))
  })

  const coppie = el('dl', { style: STILE_COPPIE })
  const aggiungiCoppia = (chiave: string, valore: string | null): void => {
    if (!valore) return
    coppie.append(
      el('div', { style: STILE_COPPIA }, [
        el('dt', { class: 'adm-etichetta' }, chiave),
        el('dd', { style: STILE_COPPIA_VALORE }, valore),
      ]),
    )
  }

  const dettagli = dettagliDi(r)
  aggiungiCoppia(t('richieste.stima'), testoStima(dettagli))
  for (const chiave of Object.keys(dettagli)) {
    if (CHIAVI_STIMA.has(chiave)) continue
    aggiungiCoppia(chiaveLeggibile(chiave), valoreLeggibile(dettagli[chiave]))
  }
  aggiungiCoppia(t('richieste.pagina'), valoreLeggibile(r.pagina))
  aggiungiCoppia(t('richieste.arrivataDa'), valoreLeggibile(r.codice_link))
  aggiungiCoppia(t('richieste.email'), email || null)
  // Il CAP non ha una voce tutta sua: sta accanto al comune, come sulla busta.
  const cap = testo(r.cap)
  if (cap) aggiungiCoppia(t('richieste.comune'), `${comune} ${cap}`.trim())
  aggiungiCoppia(t('richieste.ricevuta'), dataOra(r.creato) || null)

  const nota = campo({
    id: `ric-nota-${numeroCard}`,
    etichetta: t('richieste.nota'),
    tipo: 'area',
    valore: testo(r.nota),
    segnaposto: t('richieste.notaSegnaposto'),
    righe: 3,
  })
  const bSalvaNota = pulsante(iconaSalva(15), t('richieste.salvaNota'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', () => {
    void salvaNota()
  })

  if (coppie.childElementCount > 0) zonaDettagli.append(coppie)
  zonaDettagli.append(el('div', undefined, [nota.blocco, el('div', { style: STILE_SALVA_NOTA }, [bSalvaNota])]))

  /* --- errori della card e azioni in fondo --- */

  const zonaErrore = el('div')
  const zonaAzioni = el('div', { class: 'adm-riga', style: STILE_PIEDE })

  // true mentre una chiamata al database è in corso: i pulsanti aspettano.
  let inCorso = false

  /** L'errore resta nella card finché un'azione non riesce. Il database spiega cosa è andato storto, se sa dirlo. */
  function mostraErrore(errore?: unknown): void {
    const messaggio = errore instanceof Error && errore.message ? errore.message : t('comune.errore')
    svuota(zonaErrore)
    zonaErrore.append(
      el('div', { class: 'adm-errore', role: 'alert', style: STILE_ERRORE_CARD }, [
        iconaAvviso(18),
        el('p', { style: STILE_ERRORE_TESTO }, messaggio),
      ]),
    )
  }

  function nascondiErrore(): void {
    svuota(zonaErrore)
  }

  function blocca(stato: boolean): void {
    inCorso = stato
    zonaAzioni.querySelectorAll('button').forEach((b) => {
      b.disabled = stato
    })
  }

  /** Bordo, distintivo e pulsanti seguono lo stato: si ridisegnano solo loro. */
  function disegnaStato(): void {
    card.style.borderLeft = r.stato === 'nuova' ? '3px solid var(--color-taupe)' : ''

    svuota(zonaStato)
    zonaStato.append(distintivoStato(r.stato))

    svuota(zonaAzioni)
    const azioni: HTMLElement[] = []
    if (r.stato === 'nuova') {
      azioni.push(bottone(t('richieste.segnaContattata'), 'adm-btn', () => void cambiaStato('contattata')))
      azioni.push(bottone(t('richieste.segnaChiusa'), 'adm-btn adm-btn-chiaro', () => void cambiaStato('chiusa')))
    } else if (r.stato === 'contattata') {
      azioni.push(bottone(t('richieste.segnaChiusa'), 'adm-btn', () => void cambiaStato('chiusa')))
      azioni.push(bottone(t('richieste.riapri'), 'adm-btn adm-btn-chiaro', () => void cambiaStato('nuova')))
    } else {
      azioni.push(bottone(t('richieste.riapri'), 'adm-btn adm-btn-chiaro', () => void cambiaStato('nuova')))
    }

    const bCancella = pulsante(iconaCestino(14), t('richieste.cancella'), 'adm-btn adm-btn-pericolo adm-btn-piccolo', () => {
      void cancella()
    })

    // Lo spazio elastico spinge il cestino a destra, lontano dai pulsanti buoni.
    zonaAzioni.append(...azioni, el('span', { class: 'adm-spazio' }), bCancella)
  }

  async function cambiaStato(nuovo: StatoRichiesta): Promise<void> {
    if (inCorso) return
    blocca(true)
    try {
      const aggiornata = await aggiornaRichiesta(r.id, { stato: nuovo })
      // Si aggiorna l'oggetto condiviso con la lista: filtri e conteggi lo leggono da lì.
      r.stato = aggiornata.stato ?? nuovo
      r.aggiornato = aggiornata.aggiornato ?? r.aggiornato
      nascondiErrore()
      disegnaStato()
      contesto.ricalcola()
      toast(t('comune.salvato'))
      // Il pulsante premuto non esiste più: chi usa la tastiera riparte dal
      // primo dei nuovi, non da capo alla pagina.
      zonaAzioni.querySelector('button')?.focus()
    } catch (errore) {
      mostraErrore(errore)
      blocca(false)
    } finally {
      inCorso = false
    }
  }

  async function salvaNota(): Promise<void> {
    const valore = nota.input.value.trim()
    bSalvaNota.disabled = true
    try {
      const aggiornata = await aggiornaRichiesta(r.id, { nota: valore })
      r.nota = aggiornata.nota ?? valore
      nascondiErrore()
      toast(t('comune.salvato'))
    } catch (errore) {
      mostraErrore(errore)
    } finally {
      bSalvaNota.disabled = false
    }
  }

  async function cancella(): Promise<void> {
    if (inCorso) return
    const ok = await conferma({
      titolo: t('richieste.cancella'),
      testo: t('richieste.confermaCancella'),
      pericolo: true,
    })
    if (!ok) return

    blocca(true)
    try {
      await cancellaRichiesta(r.id)
      card.remove()
      contesto.tolta(r)
      toast(t('comune.salvato'))
    } catch (errore) {
      mostraErrore(errore)
      blocca(false)
    } finally {
      inCorso = false
    }
  }

  /* --- montaggio --- */

  card.append(testa)
  if (righe.childElementCount > 0) card.append(righe)
  if (contatti.childElementCount > 0) card.append(contatti)
  card.append(el('div', { style: STILE_RIGA_DETTAGLI }, [bDettagli]), zonaDettagli, zonaErrore, zonaAzioni)
  disegnaStato()

  return card
}

/* --- SCHERMATA ------------------------------------------------------------ */

export default function disegna(lavoro: HTMLElement): void {
  svuota(lavoro)

  let richieste: Richiesta[] = []
  let filtro: Filtro = 'tutte'
  let cercato = ''

  /* Una risposta lenta di una lettura vecchia non deve sovrascrivere quella
     nuova: vince solo chi ha il numero di giro corrente. */
  let giro = 0

  /* Le misure dei messaggi tagliati delle card in pagina: si rifanno quando
     lo schermo cambia larghezza. */
  let misure: (() => void)[] = []
  let misuraPrenotata = false

  function misuraTutte(): void {
    misuraPrenotata = false
    for (const misura of misure) misura()
  }

  // Un solo ascoltatore per tutta la schermata, e una misura sola per
  // fotogramma anche se il ridimensionamento manda cento eventi.
  window.addEventListener('resize', () => {
    if (misuraPrenotata) return
    misuraPrenotata = true
    requestAnimationFrame(misuraTutte)
  })

  /* --- azioni in testa: ricerca e schede --- */

  const campoCerca = el('input', {
    class: 'adm-campo',
    type: 'search',
    placeholder: t('richieste.cerca'),
    'aria-label': t('richieste.cerca'),
    autocomplete: 'off',
    spellcheck: 'false',
  })
  campoCerca.addEventListener('input', () => {
    cercato = campoCerca.value
    disegnaElenco()
  })
  const cerca = el('div', { class: 'adm-campo-cerca', style: STILE_CERCA }, [iconaCerca(16), campoCerca])

  const pallinoNuove = el('span', { class: 'adm-pallino', hidden: true })
  const schede = new Map<Filtro, HTMLButtonElement>()
  const segmenti = el('div', { class: 'adm-segmenti', role: 'group', 'aria-label': t('richieste.titolo') })

  const aggiungiScheda = (valore: Filtro, etichetta: string, extra?: HTMLElement): void => {
    const b = el('button', { type: 'button', 'aria-pressed': valore === filtro ? 'true' : 'false' }, [
      el('span', undefined, etichetta),
      extra ?? null,
    ])
    b.addEventListener('click', () => impostaFiltro(valore))
    schede.set(valore, b)
    segmenti.append(b)
  }
  aggiungiScheda('tutte', t('richieste.tutte'))
  aggiungiScheda('nuova', t('richieste.nuove'), pallinoNuove)
  aggiungiScheda('contattata', t('richieste.contattate'))
  aggiungiScheda('chiusa', t('richieste.chiuse'))

  intestazione(lavoro, t('richieste.titolo'), t('richieste.sottotitolo'), [cerca, segmenti])

  const zona = el('div')
  lavoro.append(zona)

  /* --- conteggi e filtri --------------------------------------------------- */

  function impostaFiltro(nuovo: Filtro): void {
    filtro = nuovo
    schede.forEach((b, valore) => b.setAttribute('aria-pressed', valore === nuovo ? 'true' : 'false'))
    disegnaElenco()
  }

  /** Il numero delle richieste da leggere: nel menu e nella scheda "Da leggere". */
  function ricalcolaNuove(): void {
    const quante = richieste.filter((r) => r.stato === 'nuova').length
    aggiornaPallino(quante)
    pallinoNuove.textContent = quante > 99 ? '99+' : String(quante)
    pallinoNuove.hidden = quante <= 0
  }

  /* --- disegno ------------------------------------------------------------- */

  /**
   * Lo stato vuoto giusto per la situazione: nessuna richiesta in assoluto,
   * niente da leggere (una buona notizia), oppure una scheda o una ricerca
   * senza risultati, con il pulsante per tornare a vedere tutto.
   */
  function vuoto(): HTMLElement {
    const icona = iconaRichieste(28)

    if (richieste.length === 0) {
      return el('div', { class: 'adm-card adm-entra' }, [statoVuoto({ icona, titolo: t('richieste.vuoto') })])
    }

    const azione = bottone(t('richieste.tutte'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', () => {
      campoCerca.value = ''
      cercato = ''
      impostaFiltro('tutte')
    })

    let titolo = t('richieste.vuotoFiltro')
    if (cercato.trim()) titolo = t('comune.nessunRisultato')
    else if (filtro === 'nuova') titolo = t('richieste.vuotoNuove')

    return el('div', { class: 'adm-card adm-entra' }, [statoVuoto({ icona, titolo, azione })])
  }

  /** Filtra e disegna l'elenco in memoria: nessuna lettura dal database. */
  function disegnaElenco(): void {
    svuota(zona)
    misure = []

    const visibili = richieste.filter((r) => (filtro === 'tutte' || r.stato === filtro) && corrisponde(r, cercato))
    if (visibili.length === 0) {
      zona.append(vuoto())
      return
    }

    const pila = el('div', { class: 'adm-pila' })
    const contesto: Contesto = {
      ricalcola: ricalcolaNuove,
      tolta: (r) => {
        richieste = richieste.filter((x) => x.id !== r.id)
        ricalcolaNuove()
        // Era l'ultima card della scheda: al suo posto va lo stato vuoto.
        if (pila.childElementCount === 0) disegnaElenco()
      },
      registraMisura: (misura) => misure.push(misura),
    }

    for (const r of visibili) pila.append(cardDi(r, contesto))
    zona.append(pila)

    // I messaggi si possono misurare solo quando le card stanno nella pagina.
    requestAnimationFrame(misuraTutte)
  }

  /** Card grigie che pulsano al posto delle richieste, così la pagina non salta. */
  function mostraScheletri(): void {
    svuota(zona)
    const pila = el('div', { class: 'adm-pila' })
    for (let i = 0; i < SCHELETRI; i++) {
      pila.append(el('div', { class: 'adm-card adm-card-stretta' }, [scheletro(3)]))
    }
    zona.append(pila)
  }

  /* --- lettura ------------------------------------------------------------- */

  async function carica(): Promise<void> {
    const mio = ++giro
    mostraScheletri()

    try {
      const lette = await elencaRichieste()
      if (mio !== giro) return
      // Dalle più recenti: chi ha scritto per ultimo aspetta da meno, ma è in cima.
      richieste = [...lette].sort((a, b) => testo(b.creato).localeCompare(testo(a.creato)))
      ricalcolaNuove()
      disegnaElenco()
    } catch {
      if (mio !== giro) return
      statoErrore(zona, () => void carica())
    }
  }

  void carica()
}
