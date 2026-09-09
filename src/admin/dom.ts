/**
 * =============================================================================
 *  PICCOLO AIUTO PER COSTRUIRE IL DOM, E I PEZZI CHE OGNI SCHERMATA RIUSA
 * =============================================================================
 *  Il pannello non carica nessun framework: le schermate si disegnano a mano,
 *  e senza un aiuto minimo ogni riga diventerebbe tre chiamate a
 *  document.createElement. Qui c'è il poco che serve, più i pezzi comuni:
 *  campi, interruttori, il caricatore di foto, le finestre di conferma, gli
 *  avvisi a scomparsa, gli stati vuoti e di attesa.
 *
 *  La regola che conta: si costruisce con createElement e textContent, mai
 *  con innerHTML. Il pannello mostra testo scritto dagli utenti, e una sola
 *  stringa incollata dentro innerHTML basterebbe a far girare codice altrui
 *  nella pagina di chi amministra il sito.
 *
 *  Gli stili stanno in admin.css: qui si assegnano solo le classi. La CSP del
 *  sito dichiara style-src 'self', quindi un <style> creato dal codice
 *  verrebbe rifiutato; gli attributi style singoli invece passano, e si usano
 *  solo per le misure che cambiano a runtime (larghezza di una barra, ecc.).
 * =============================================================================
 */

import { caricaImmagine, type CartellaImmagini } from './dati'
import { iconaAvviso, iconaCarica, iconaChiudi, iconaInfo, iconaSpunta } from './icone'
import { t } from './lingua'

/* --- COSTRUZIONE ---------------------------------------------------------- */

/**
 * Crea un elemento con i suoi attributi e i suoi figli.
 *
 * - `class` diventa className, tutto il resto passa da setAttribute.
 * - I valori null, undefined e false si saltano: così si può scrivere
 *   `{ disabled: attesa }` senza un if attorno.
 * - Il valore true stampa l'attributo vuoto, come vuole l'HTML.
 * - `html` viene ignorato di proposito: qui dentro non si incolla markup.
 * - Gli attributi che iniziano con 'on' vengono ignorati: i gestori si
 *   attaccano con addEventListener, così il codice non finisce mai in una
 *   stringa.
 * - `figli` può essere una stringa, e allora diventa il testo dell'elemento,
 *   oppure un elenco di nodi e stringhe, con i buchi saltati.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributi?: Record<string, string | number | boolean | null | undefined>,
  figli?: (Node | string | null | undefined | false)[] | string,
): HTMLElementTagNameMap[K] {
  const nodo = document.createElement(tag)

  if (attributi) {
    for (const chiave of Object.keys(attributi)) {
      const valore = attributi[chiave]
      if (valore === null || valore === undefined || valore === false) continue
      if (chiave === 'html') continue
      if (chiave.startsWith('on')) continue

      if (chiave === 'class') {
        nodo.className = String(valore)
        continue
      }

      nodo.setAttribute(chiave, valore === true ? '' : String(valore))
    }
  }

  if (typeof figli === 'string') {
    nodo.textContent = figli
  } else if (figli) {
    for (const figlio of figli) {
      if (figlio === null || figlio === undefined || figlio === false) continue
      nodo.append(typeof figlio === 'string' ? document.createTextNode(figlio) : figlio)
    }
  }

  return nodo
}

/**
 * Svuota un elemento. Si tolgono i figli uno per uno invece di azzerare
 * innerHTML: stessa spesa, e non si nomina mai quella proprietà.
 */
export function svuota(e: HTMLElement): void {
  while (e.firstChild) e.removeChild(e.firstChild)
}

/**
 * Un pulsante con il suo testo, la sua classe e quello che fa.
 * Il tipo è sempre 'button': dentro un form, un bottone senza tipo lo
 * invierebbe, e mezzo pannello vive dentro un form.
 */
export function bottone(testo: string, classe: string, azione: () => void): HTMLButtonElement {
  const b = el('button', { class: classe, type: 'button' }, testo)
  b.addEventListener('click', azione)
  return b
}

/** Un pulsante con l'icona davanti al testo. */
export function pulsante(
  simbolo: SVGElement | null,
  testo: string,
  classe: string,
  azione: () => void,
): HTMLButtonElement {
  const b = el('button', { class: classe, type: 'button' }, [simbolo, el('span', undefined, testo)])
  b.addEventListener('click', azione)
  return b
}

/** Un'etichetta di stato tonda: bozza, pubblicato, nuova, chiusa. */
export function distintivo(testo: string, tipo: 'neutro' | 'vivo' | 'attenzione' | 'spento' = 'neutro'): HTMLElement {
  return el('span', { class: `adm-stato adm-stato-${tipo}` }, testo)
}

/* --- STATI DI UNA SCHERMATA ----------------------------------------------- */

/**
 * Lo stato di attesa: righe grigie che pulsano al posto del contenuto, così
 * la pagina non salta quando arrivano i dati. Sostituisce quello che c'è
 * nella radice: chi lo chiama sta ricominciando da capo.
 */
export function statoCaricamento(radice: HTMLElement, righe = 4): void {
  svuota(radice)
  radice.append(scheletro(righe))
}

/** Il blocco di attesa da solo, per chi lo vuole dentro una card. */
export function scheletro(righe = 4): HTMLElement {
  const blocco = el('div', { class: 'adm-scheletro', role: 'status', 'aria-label': t('comune.caricamento') })
  for (let i = 0; i < righe; i++) {
    const riga = el('span')
    // Larghezze diverse: un blocco di righe tutte uguali sembra un errore.
    riga.style.width = `${[92, 68, 80, 55, 74, 60][i % 6]}%`
    blocco.append(riga)
  }
  return blocco
}

/**
 * Lo stato di errore, con il pulsante che ritenta davvero: `riprova` è la
 * stessa funzione che ha caricato i dati la prima volta.
 */
export function statoErrore(radice: HTMLElement, riprova: () => void, messaggio?: string): void {
  svuota(radice)
  radice.append(
    el('div', { class: 'adm-errore', role: 'alert' }, [
      iconaAvviso(18),
      el('div', undefined, [
        el('p', undefined, messaggio || t('comune.errore')),
        bottone(t('comune.riprova'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', riprova),
      ]),
    ]),
  )
}

/**
 * Lo stato vuoto: un'icona, un titolo, due righe che spiegano cosa fare, e
 * il pulsante per farlo. Meglio di una riga grigia "nessun elemento".
 */
export function statoVuoto(opzioni: {
  icona: SVGElement
  titolo: string
  testo?: string
  azione?: HTMLElement
}): HTMLElement {
  return el('div', { class: 'adm-vuoto-stato' }, [
    el('div', { class: 'adm-vuoto-icona' }, [opzioni.icona]),
    el('p', { class: 'adm-vuoto-titolo' }, opzioni.titolo),
    opzioni.testo ? el('p', { class: 'adm-vuoto-testo' }, opzioni.testo) : null,
    opzioni.azione ?? null,
  ])
}

/** Una fascia con un'icona: nota di servizio, avvertimento o conferma. */
export function fascia(
  testo: string | Node[],
  tipo: 'info' | 'attenzione' | 'ok' = 'info',
  titolo?: string,
): HTMLElement {
  const simbolo = tipo === 'ok' ? iconaSpunta(18) : tipo === 'attenzione' ? iconaAvviso(18) : iconaInfo(18)
  simbolo.classList.add('adm-fascia-icona')
  const corpo = el('div')
  if (titolo) corpo.append(el('strong', undefined, titolo))
  if (typeof testo === 'string') corpo.append(document.createTextNode(testo))
  else corpo.append(...testo)
  return el('div', { class: `adm-fascia adm-fascia-${tipo}`, role: tipo === 'attenzione' ? 'alert' : null }, [
    simbolo,
    corpo,
  ])
}

/* --- AVVISI A SCOMPARSA --------------------------------------------------- */

let zonaToast: HTMLElement | null = null

/**
 * Un messaggio breve in fondo allo schermo, che sparisce da solo: "Salvato",
 * "Copiato", "Foto caricata". Per gli errori si usa la fascia rossa in
 * pagina, che resta finché qualcuno non la legge.
 */
export function toast(testo: string, tipo: 'ok' | 'errore' = 'ok', durata = 2600): void {
  if (!zonaToast) {
    zonaToast = el('div', { class: 'adm-toast-zona', 'aria-live': 'polite' })
    document.body.append(zonaToast)
  }
  const nodo = el('div', { class: `adm-toast adm-toast-${tipo}` }, [
    tipo === 'ok' ? iconaSpunta(16) : iconaAvviso(16),
    el('span', undefined, testo),
  ])
  zonaToast.append(nodo)
  window.setTimeout(() => {
    nodo.classList.add('adm-toast-via')
    window.setTimeout(() => nodo.remove(), 320)
  }, durata)
}

/* --- FINESTRE ------------------------------------------------------------- */

/**
 * Chiede conferma con una finestra vera al posto di window.confirm: quella
 * del browser non si può tradurre né disegnare, e su alcuni telefoni non
 * compare affatto. Risolve true se la persona conferma.
 */
export function conferma(opzioni: {
  titolo: string
  testo?: string
  ok?: string
  annulla?: string
  pericolo?: boolean
}): Promise<boolean> {
  return new Promise((risolvi) => {
    const dialogo = el('dialog', { class: 'adm-dialogo' })

    const chiudi = (esito: boolean) => {
      dialogo.close()
      dialogo.remove()
      risolvi(esito)
    }

    const bAnnulla = bottone(opzioni.annulla ?? t('comune.annulla'), 'adm-btn adm-btn-chiaro', () => chiudi(false))
    const bOk = bottone(
      opzioni.ok ?? t('comune.conferma'),
      opzioni.pericolo ? 'adm-btn adm-btn-pericolo-pieno' : 'adm-btn',
      () => chiudi(true),
    )

    dialogo.append(
      el('div', { class: 'adm-dialogo-corpo' }, [
        el('h2', { class: 'adm-dialogo-titolo' }, opzioni.titolo),
        opzioni.testo ? el('p', { class: 'adm-dialogo-testo' }, opzioni.testo) : null,
        el('div', { class: 'adm-dialogo-azioni' }, [bAnnulla, bOk]),
      ]),
    )
    dialogo.addEventListener('cancel', (ev) => {
      ev.preventDefault()
      chiudi(false)
    })
    // Un clic sullo sfondo scuro chiude come "annulla".
    dialogo.addEventListener('click', (ev) => {
      if (ev.target === dialogo) chiudi(false)
    })

    document.body.append(dialogo)
    dialogo.showModal()
    ;(opzioni.pericolo ? bAnnulla : bOk).focus()
  })
}

/**
 * Chiede un testo, al posto di window.prompt. Risolve null se annullato.
 */
export function chiedi(opzioni: {
  titolo: string
  testo?: string
  etichetta: string
  valore?: string
  segnaposto?: string
  tipo?: 'text' | 'url'
  ok?: string
}): Promise<string | null> {
  return new Promise((risolvi) => {
    const dialogo = el('dialog', { class: 'adm-dialogo' })
    const campoTesto = el('input', {
      class: 'adm-campo',
      id: 'adm-dialogo-campo',
      type: opzioni.tipo ?? 'text',
      placeholder: opzioni.segnaposto ?? null,
      autocomplete: 'off',
    })
    campoTesto.value = opzioni.valore ?? ''

    const chiudi = (esito: string | null) => {
      dialogo.close()
      dialogo.remove()
      risolvi(esito)
    }

    const modulo = el('form', { class: 'adm-dialogo-corpo', method: 'dialog' }, [
      el('h2', { class: 'adm-dialogo-titolo' }, opzioni.titolo),
      opzioni.testo ? el('p', { class: 'adm-dialogo-testo' }, opzioni.testo) : null,
      el('label', { class: 'adm-etichetta-campo', for: 'adm-dialogo-campo' }, opzioni.etichetta),
      campoTesto,
      el('div', { class: 'adm-dialogo-azioni' }, [
        bottone(t('comune.annulla'), 'adm-btn adm-btn-chiaro', () => chiudi(null)),
        el('button', { class: 'adm-btn', type: 'submit' }, opzioni.ok ?? t('comune.conferma')),
      ]),
    ])
    modulo.addEventListener('submit', (ev) => {
      ev.preventDefault()
      chiudi(campoTesto.value)
    })
    dialogo.addEventListener('cancel', (ev) => {
      ev.preventDefault()
      chiudi(null)
    })
    dialogo.addEventListener('click', (ev) => {
      if (ev.target === dialogo) chiudi(null)
    })

    dialogo.append(modulo)
    document.body.append(dialogo)
    dialogo.showModal()
    campoTesto.focus()
    campoTesto.select()
  })
}

/* --- CAMPI ---------------------------------------------------------------- */

export type OpzioniCampo = {
  id: string
  etichetta: string
  tipo?: 'text' | 'email' | 'tel' | 'url' | 'number' | 'password' | 'area'
  valore?: string | number | null
  segnaposto?: string
  aiuto?: string
  righe?: number
  obbligatorio?: boolean
  autocomplete?: string
  inputmode?: string
  massimo?: number
}

/**
 * Etichetta, campo e riga di aiuto, già impaginati. Torna anche il campo da
 * solo per leggerne il valore o ascoltarne gli eventi.
 */
export function campo(o: OpzioniCampo): { blocco: HTMLElement; input: HTMLInputElement | HTMLTextAreaElement } {
  const input =
    o.tipo === 'area'
      ? el('textarea', {
          id: o.id,
          class: 'adm-campo',
          rows: o.righe ?? 4,
          placeholder: o.segnaposto ?? null,
          maxlength: o.massimo ?? null,
        })
      : el('input', {
          id: o.id,
          class: 'adm-campo',
          type: o.tipo ?? 'text',
          placeholder: o.segnaposto ?? null,
          required: o.obbligatorio ?? false,
          autocomplete: o.autocomplete ?? null,
          inputmode: o.inputmode ?? null,
          maxlength: o.massimo ?? null,
        })
  input.value = o.valore === null || o.valore === undefined ? '' : String(o.valore)

  const blocco = el('div', { class: 'adm-blocco-campo' }, [
    el('label', { class: 'adm-etichetta-campo', for: o.id }, o.etichetta),
    input,
    o.aiuto ? el('p', { class: 'adm-aiuto' }, o.aiuto) : null,
  ])
  return { blocco, input }
}

/** Un menu a tendina con le sue voci. */
export function tendina(
  id: string,
  etichetta: string,
  voci: { valore: string; testo: string }[],
  scelto?: string,
): { blocco: HTMLElement; select: HTMLSelectElement } {
  const select = el('select', { id, class: 'adm-campo' })
  for (const v of voci) select.append(el('option', { value: v.valore, selected: v.valore === scelto }, v.testo))
  const blocco = el('div', { class: 'adm-blocco-campo' }, [
    el('label', { class: 'adm-etichetta-campo', for: id }, etichetta),
    select,
  ])
  return { blocco, select }
}

/**
 * Un interruttore acceso/spento con l'etichetta accanto. `alCambio` riceve
 * il nuovo stato; `imposta` lo cambia da fuori senza scatenare il gestore.
 */
export function interruttore(
  acceso: boolean,
  etichetta: string,
  alCambio: (acceso: boolean) => void,
  etichettaSpenta?: string,
): { blocco: HTMLElement; imposta: (acceso: boolean) => void; stato: () => boolean } {
  let attuale = acceso
  const pallina = el('span', { class: 'adm-interruttore-pallina' })
  const tasto = el('button', { type: 'button', role: 'switch', class: 'adm-interruttore' }, [pallina])
  const testo = el('span', { class: 'adm-interruttore-testo' })

  const disegna = () => {
    tasto.setAttribute('aria-checked', attuale ? 'true' : 'false')
    tasto.classList.toggle('adm-interruttore-acceso', attuale)
    testo.textContent = attuale ? etichetta : (etichettaSpenta ?? etichetta)
  }
  tasto.addEventListener('click', () => {
    attuale = !attuale
    disegna()
    alCambio(attuale)
  })
  disegna()

  const blocco = el('label', { class: 'adm-interruttore-riga' }, [tasto, testo])
  return {
    blocco,
    imposta: (nuovo) => {
      attuale = nuovo
      disegna()
    },
    stato: () => attuale,
  }
}

/* --- CARICATORE DI FOTO --------------------------------------------------- */

/** Oltre questa misura il file non si prova nemmeno a leggere. */
const PESO_MASSIMO = 20 * 1024 * 1024

/**
 * Il riquadro per caricare una foto: anteprima, pulsante, trascinamento,
 * stato di attesa e messaggio d'errore. Riduce la foto nel browser e la
 * carica nel deposito (vedi caricaImmagine); quando ha finito chiama
 * `alCambio` con l'indirizzo pubblico, o null se la foto è stata tolta.
 */
export function caricatoreFoto(o: {
  cartella: CartellaImmagini
  valore: string | null
  etichetta: string
  testoCarica?: string
  testoTogli?: string
  aiuto?: string
  /** 'quadrata' per lavori e volti, 'larga' per le copertine */
  forma?: 'quadrata' | 'larga' | 'tonda'
  alCambio: (url: string | null) => void
}): { blocco: HTMLElement; imposta: (url: string | null) => void; inAttesa: () => boolean } {
  let url = o.valore
  let attesa = false

  const anteprima = el('img', { class: 'adm-caricatore-anteprima', alt: '' })
  const ingresso = el('input', { type: 'file', accept: 'image/*', class: 'adm-caricatore-file' })
  const messaggio = el('p', { class: 'adm-aiuto adm-caricatore-errore', role: 'alert' })
  const bCarica = pulsante(iconaCarica(15), o.testoCarica ?? t('comune.caricaImmagine'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', () =>
    ingresso.click(),
  )
  const bTogli = pulsante(iconaChiudi(14), o.testoTogli ?? t('comune.elimina'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', () => {
    url = null
    o.alCambio(null)
    disegna()
  })
  const attesaTesto = el('span', { class: 'adm-caricatore-attesa' }, t('comune.caricamentoFoto'))
  const invito = el('span', { class: 'adm-caricatore-invito' }, t('comune.trascinaImmagine'))

  const cornice = el('div', { class: `adm-caricatore adm-caricatore-${o.forma ?? 'larga'}` }, [
    anteprima,
    el('div', { class: 'adm-caricatore-azioni' }, [bCarica, bTogli, invito, attesaTesto]),
    ingresso,
  ])

  function disegna(): void {
    cornice.classList.toggle('adm-caricatore-piena', Boolean(url))
    cornice.classList.toggle('adm-caricatore-in-attesa', attesa)
    anteprima.hidden = !url
    if (url) anteprima.src = url
    else anteprima.removeAttribute('src')
    bTogli.hidden = !url || attesa
    bCarica.hidden = attesa
    invito.hidden = Boolean(url) || attesa
    attesaTesto.hidden = !attesa
    bCarica.disabled = attesa
  }

  async function carica(file: File): Promise<void> {
    messaggio.textContent = ''
    if (!file.type.startsWith('image/')) {
      messaggio.textContent = t('comune.formatoNonValido')
      return
    }
    if (file.size > PESO_MASSIMO) {
      messaggio.textContent = t('comune.immagineTroppoGrande')
      return
    }
    attesa = true
    disegna()
    try {
      url = await caricaImmagine(file, o.cartella)
      o.alCambio(url)
    } catch (errore) {
      messaggio.textContent = errore instanceof Error ? errore.message : t('comune.errore')
    } finally {
      attesa = false
      disegna()
    }
  }

  ingresso.addEventListener('change', () => {
    const file = ingresso.files?.[0]
    ingresso.value = ''
    if (file) void carica(file)
  })
  cornice.addEventListener('dragover', (ev) => {
    ev.preventDefault()
    cornice.classList.add('adm-caricatore-sopra')
  })
  cornice.addEventListener('dragleave', () => cornice.classList.remove('adm-caricatore-sopra'))
  cornice.addEventListener('drop', (ev) => {
    ev.preventDefault()
    cornice.classList.remove('adm-caricatore-sopra')
    const file = ev.dataTransfer?.files?.[0]
    if (file) void carica(file)
  })

  disegna()

  const blocco = el('div', { class: 'adm-blocco-campo' }, [
    el('span', { class: 'adm-etichetta-campo' }, o.etichetta),
    cornice,
    o.aiuto ? el('p', { class: 'adm-aiuto' }, o.aiuto) : null,
    messaggio,
  ])

  return {
    blocco,
    imposta: (nuovo) => {
      url = nuovo
      disegna()
    },
    inAttesa: () => attesa,
  }
}

/* --- VARIE ---------------------------------------------------------------- */

/** Le iniziali di un nome, per il tondo al posto della foto: "Giovanni S." -> "GS". */
export function iniziali(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

/** Un tondo con la foto o con le iniziali. */
export function avatar(nome: string, foto: string | null, misura = 40): HTMLElement {
  const tondo = el('span', { class: 'adm-avatar', 'aria-hidden': 'true' })
  tondo.style.width = `${misura}px`
  tondo.style.height = `${misura}px`
  if (foto) tondo.append(el('img', { src: foto, alt: '' }))
  else tondo.textContent = iniziali(nome) || '?'
  return tondo
}

/** Cinque stelle, piene fino a `voto`. */
export function stelle(voto: number, misura = 14): HTMLElement {
  const fila = el('span', { class: 'adm-stelle', role: 'img', 'aria-label': `${voto} ${t('recensioni.stelle')}` })
  for (let i = 1; i <= 5; i++) {
    const s = el('span', { class: i <= voto ? 'adm-stella adm-stella-piena' : 'adm-stella' }, '★')
    s.style.fontSize = `${misura}px`
    fila.append(s)
  }
  return fila
}

/** Copia negli appunti; torna false se il browser non lo permette. */
export async function copia(testo: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false
    await navigator.clipboard.writeText(testo)
    return true
  } catch {
    return false
  }
}
