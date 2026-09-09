/**
 * =============================================================================
 *  GRAFICO A LINEE, SVG SCRITTO A MANO
 * =============================================================================
 *  Niente librerie: una libreria di grafici pesa piu di tutto il pannello
 *  messo insieme, e questo pannello si apre da un telefono in cantiere.
 *
 *  Come regge il ridimensionamento: il contenitore viene misurato con un
 *  ResizeObserver e il disegno rinasce alla larghezza vera, in pixel. Cosi il
 *  viewBox coincide sempre con lo spazio a schermo, il tratto resta spesso
 *  uguale ovunque e le scritte non si allungano mai, cosa che invece succede
 *  con un viewBox fisso allargato a forza.
 *
 *  La linea non e una spezzata secca: passa da una curva monotona di
 *  Fritsch-Carlson, che ammorbidisce gli angoli senza inventare gobbe sopra o
 *  sotto i dati veri. Un grafico che mente e peggio di un grafico brutto.
 *
 *  I colori arrivano dalle variabili CSS del sito, e le variabili dentro un
 *  attributo di presentazione SVG non vengono sostituite: percio quelle poche
 *  proprieta si scrivono nello stile dell'elemento. Tutto il resto resta un
 *  normale attributo. Un blocco <style> qui non si puo aggiungere: la CSP del
 *  sito ha style-src 'self' e lo bloccherebbe. Per lo stesso motivo le
 *  animazioni passano dalle Web Animations, che la CSP non tocca.
 * =============================================================================
 */

import { el, svuota } from './dom'
import { locale, t } from './lingua'

export type Punto = { etichetta: string; visualizzazioni: number; unici: number }

/* --- MISURE DI BASE ------------------------------------------------------- */

const SOPRA = 14
const SOTTO = 26
const DESTRA = 14
/** Quante tacche puntiamo ad avere sull'asse verticale, oltre allo zero. */
const TACCHE = 3
/** Larghezza minima che ci si concede per ogni data sull'asse orizzontale. */
const PASSO_DATE = 84

const NS = 'http://www.w3.org/2000/svg'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const GRIGLIA = 'rgba(21, 22, 19, 0.07)'
const GRIGLIA_ZERO = 'rgba(21, 22, 19, 0.16)'
const TESTO_ASSI = 'rgba(21, 22, 19, 0.45)'
const TESTO_TENUE = 'rgba(21, 22, 19, 0.62)'

/** Ogni sfumatura ha bisogno di un id suo: due grafici possono stare insieme. */
let progressivo = 0

/**
 * Chi sta ascoltando le misure di quale contenitore. Ridisegnare lo stesso
 * elemento non deve lasciare in giro il vecchio osservatore.
 */
const ascolti = new WeakMap<HTMLElement, { disconnect: () => void }>()

/* --- AIUTI ---------------------------------------------------------------- */

/** Un nodo SVG con i suoi attributi. I valori vuoti si saltano. */
function nodo(tag: string, attributi: Record<string, string | number | null | undefined> = {}): SVGElement {
  const e = document.createElementNS(NS, tag)
  for (const chiave of Object.keys(attributi)) {
    const valore = attributi[chiave]
    if (valore === null || valore === undefined) continue
    e.setAttribute(chiave, String(valore))
  }
  return e
}

/** Un testo dentro l'SVG. Il contenuto passa da textContent, sempre. */
function testo(attributi: Record<string, string | number | null | undefined>, contenuto: string): SVGElement {
  const e = nodo('text', attributi)
  e.textContent = contenuto
  return e
}

/** Chi ha chiesto meno movimento al sistema non lo deve vedere qui. */
function motoRidotto(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* --- DATE ----------------------------------------------------------------- */

/**
 * Le etichette arrivano dal database come '2026-08-17' oppure '2026-08'.
 *
 * Niente new Date(testo): quella stringa viene letta come mezzanotte UTC, e a
 * ovest di Greenwich il giorno mostrato sarebbe quello prima. La data si
 * compone campo per campo, con il costruttore a numeri, che lavora in ora
 * locale e non sposta niente.
 */
function dataDa(etichetta: string): { data: Date; conGiorno: boolean } | null {
  const pezzi = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(etichetta.trim())
  if (!pezzi) return null

  const anno = Number(pezzi[1])
  const mese = Number(pezzi[2])
  const giorno = pezzi[3] ? Number(pezzi[3]) : 1
  if (mese < 1 || mese > 12 || giorno < 1 || giorno > 31) return null

  const data = new Date(anno, mese - 1, giorno)
  if (Number.isNaN(data.getTime())) return null

  return { data, conGiorno: Boolean(pezzi[3]) }
}

/** Per l'asse: corta, che ce ne stanno cinque senza accavallarsi. */
function etichettaCorta(etichetta: string): string {
  const letta = dataDa(etichetta)
  if (!letta) return etichetta
  return letta.conGiorno
    ? letta.data.toLocaleDateString(locale(), { day: 'numeric', month: 'short' })
    : letta.data.toLocaleDateString(locale(), { month: 'short', year: '2-digit' })
}

/** Per il riquadro e per la tabella: per esteso, che si legge una volta sola. */
function etichettaLunga(etichetta: string): string {
  const letta = dataDa(etichetta)
  if (!letta) return etichetta
  return letta.conGiorno
    ? letta.data.toLocaleDateString(locale(), { day: 'numeric', month: 'long', year: 'numeric' })
    : letta.data.toLocaleDateString(locale(), { month: 'long', year: 'numeric' })
}

/* --- CALCOLI -------------------------------------------------------------- */

/**
 * Scala verticale con numeri tondi: si sceglie prima il passo (1, 2 o 5 per
 * la potenza di dieci giusta) e poi si sale al primo multiplo che copre i
 * dati. Meglio un po' d'aria sopra la linea che un'etichetta con la virgola.
 */
function scala(massimoDati: number): { massimo: number; valori: number[] } {
  const vero = Math.max(massimoDati, 1)
  const grezzo = vero / TACCHE
  const potenza = 10 ** Math.floor(Math.log10(grezzo))
  const normale = grezzo / potenza
  const fattore = normale <= 1 ? 1 : normale <= 2 ? 2 : normale <= 5 ? 5 : 10
  const passo = Math.max(1, Math.round(fattore * potenza))
  const massimo = Math.ceil(vero / passo) * passo

  const valori: number[] = []
  for (let v = 0; v <= massimo; v += passo) valori.push(v)
  return { massimo, valori }
}

/**
 * Pendenze per la curva monotona: dove i dati cambiano direzione la pendenza
 * va a zero, e il limitatore impedisce alla curva di sforare oltre i punti.
 */
function pendenze(px: number[], py: number[]): number[] {
  const n = px.length
  const delta: number[] = []
  for (let i = 0; i < n - 1; i++) delta.push((py[i + 1] - py[i]) / (px[i + 1] - px[i] || 1))

  const m: number[] = new Array(n)
  m[0] = delta[0]
  m[n - 1] = delta[n - 2]
  for (let i = 1; i < n - 1; i++) {
    m[i] = delta[i - 1] * delta[i] <= 0 ? 0 : (delta[i - 1] + delta[i]) / 2
  }

  for (let i = 0; i < n - 1; i++) {
    if (delta[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i] / delta[i]
    const b = m[i + 1] / delta[i]
    const somma = a * a + b * b
    if (somma > 9) {
      const tau = 3 / Math.sqrt(somma)
      m[i] = tau * a * delta[i]
      m[i + 1] = tau * b * delta[i]
    }
  }
  return m
}

/** Dai punti al comando "d", con una cubica fra un punto e l'altro. */
function percorso(px: number[], py: number[]): string {
  const n = px.length
  if (n === 0) return ''
  if (n === 1) return `M ${px[0]} ${py[0]}`
  if (n === 2) return `M ${px[0]} ${py[0]} L ${px[1]} ${py[1]}`

  const m = pendenze(px, py)
  let d = `M ${px[0]} ${py[0]}`
  for (let i = 0; i < n - 1; i++) {
    const dx = (px[i + 1] - px[i]) / 3
    d += ` C ${px[i] + dx} ${py[i] + m[i] * dx} ${px[i + 1] - dx} ${py[i + 1] - m[i + 1] * dx} ${px[i + 1]} ${py[i + 1]}`
  }
  return d
}

/* --- PEZZI IN HTML -------------------------------------------------------- */

/** Il pallino colorato della legenda e del riquadro. */
function pallino(colore: string): HTMLElement {
  const i = el('i')
  i.style.display = 'inline-block'
  i.style.width = '9px'
  i.style.height = '9px'
  i.style.borderRadius = '999px'
  i.style.background = colore
  i.style.flexShrink = '0'
  return i
}

/** La legenda in cima: chi e la linea scura e chi quella taupe. */
function legenda(): HTMLElement {
  const voce = (colore: string, nome: string): HTMLElement => {
    const s = el('span', undefined, [pallino(colore), nome])
    s.style.display = 'inline-flex'
    s.style.alignItems = 'center'
    s.style.gap = '0.45rem'
    return s
  }

  const riga = el('div', undefined, [
    voce('var(--color-nero)', t('statistiche.visualizzazioni')),
    voce('var(--color-taupe)', t('statistiche.uniche')),
  ])
  riga.style.display = 'flex'
  riga.style.flexWrap = 'wrap'
  riga.style.gap = '0.35rem 1.15rem'
  riga.style.marginBottom = '0.9rem'
  riga.style.fontSize = '0.78rem'
  riga.style.fontWeight = '600'
  riga.style.color = TESTO_TENUE
  return riga
}

/** Nasconde alla vista senza nascondere alle voci sintetiche. */
function soloPerLettori(e: HTMLElement): void {
  e.style.position = 'absolute'
  e.style.width = '1px'
  e.style.height = '1px'
  e.style.padding = '0'
  e.style.margin = '-1px'
  e.style.overflow = 'hidden'
  e.style.clipPath = 'inset(50%)'
  e.style.whiteSpace = 'nowrap'
  e.style.border = '0'
}

/**
 * Gli stessi numeri in tabella. Un grafico e un'immagine, e senza questo
 * chi lo ascolta invece di guardarlo resterebbe fuori dai dati del sito.
 */
function tabellaNascosta(punti: Punto[], numeri: Intl.NumberFormat, riassunto: string): HTMLElement {
  const righe = el('tbody')
  for (const p of punti) {
    righe.append(
      el('tr', undefined, [
        el('th', { scope: 'row' }, etichettaLunga(p.etichetta)),
        el('td', undefined, numeri.format(p.visualizzazioni)),
        el('td', undefined, numeri.format(p.unici)),
      ]),
    )
  }

  const tabella = el('table', undefined, [
    el('caption', undefined, riassunto),
    el('thead', undefined, [
      el('tr', undefined, [
        el('th', { scope: 'col' }, t('statistiche.giorno')),
        el('th', { scope: 'col' }, t('statistiche.visualizzazioni')),
        el('th', { scope: 'col' }, t('statistiche.uniche')),
      ]),
    ]),
    righe,
  ])

  // Il ritaglio va su un contenitore, non sulla tabella: una tabella con
  // width 1px resta larga quanto il suo contenuto, e resterebbe una scatola
  // di centinaia di pixel appoggiata sopra la pagina.
  const scatola = el('div', undefined, [tabella])
  soloPerLettori(scatola)
  return scatola
}

/** Il riquadro che segue il dito: giorno, visualizzazioni, uniche. */
function riquadro(): {
  scatola: HTMLElement
  giorno: HTMLElement
  visualizzazioni: HTMLElement
  unici: HTMLElement
} {
  const giorno = el('div')
  giorno.style.marginBottom = '0.35rem'
  giorno.style.fontWeight = '800'

  const cifra = (): HTMLElement => {
    const s = el('strong')
    s.style.marginLeft = 'auto'
    s.style.fontVariantNumeric = 'tabular-nums'
    return s
  }

  const riga = (colore: string, nome: string, valore: HTMLElement): HTMLElement => {
    const nomeSpan = el('span', undefined, nome)
    nomeSpan.style.color = TESTO_TENUE
    const r = el('div', undefined, [pallino(colore), nomeSpan, valore])
    r.style.display = 'flex'
    r.style.alignItems = 'center'
    r.style.gap = '0.45rem'
    return r
  }

  const visualizzazioni = cifra()
  const unici = cifra()

  // Nascosto agli screen reader: gli stessi numeri stanno gia nella tabella,
  // e li stanno tutti insieme invece che uno alla volta sotto il puntatore.
  const scatola = el('div', { 'aria-hidden': 'true' }, [
    giorno,
    riga('var(--color-nero)', t('statistiche.visualizzazioni'), visualizzazioni),
    riga('var(--color-taupe)', t('statistiche.uniche'), unici),
  ])
  scatola.style.position = 'absolute'
  scatola.style.top = '0'
  scatola.style.minWidth = '168px'
  scatola.style.border = '1px solid rgba(21, 22, 19, 0.08)'
  scatola.style.borderRadius = '10px'
  scatola.style.background = '#fff'
  scatola.style.boxShadow = '0 1px 2px rgba(21, 22, 19, 0.05), 0 8px 24px rgba(21, 22, 19, 0.12)'
  scatola.style.padding = '0.6rem 0.75rem'
  scatola.style.fontSize = '0.8rem'
  scatola.style.lineHeight = '1.45'
  scatola.style.pointerEvents = 'none'
  scatola.style.transform = 'translateX(-50%)'
  scatola.style.display = 'none'

  return { scatola, giorno, visualizzazioni, unici }
}

/* --- DISEGNO -------------------------------------------------------------- */

/** Costruisce l'SVG e il riquadro per una larghezza precisa, e li attacca. */
function disegna(
  tela: HTMLElement,
  punti: Punto[],
  larghezza: number,
  altezza: number,
  numeri: Intl.NumberFormat,
  riassunto: string,
): void {
  const n = punti.length
  const { massimo, valori } = scala(Math.max(...punti.map((p) => Math.max(p.visualizzazioni, p.unici))))

  // Il margine sinistro nasce dall'etichetta piu lunga, non da un numero a caso.
  const testiY = valori.map((v) => numeri.format(v))
  const sinistra = Math.round(Math.max(...testiY.map((s) => s.length)) * 6.7 + 14)

  const larghezzaArea = Math.max(24, larghezza - sinistra - DESTRA)
  const altezzaArea = Math.max(24, altezza - SOPRA - SOTTO)
  const base = SOPRA + altezzaArea

  const ascissa = (i: number): number =>
    n === 1 ? sinistra + larghezzaArea / 2 : sinistra + (i * larghezzaArea) / (n - 1)
  const ordinata = (v: number): number => SOPRA + altezzaArea - (v / massimo) * altezzaArea

  const px = punti.map((_, i) => ascissa(i))
  const pyVis = punti.map((p) => ordinata(p.visualizzazioni))
  const pyUni = punti.map((p) => ordinata(p.unici))

  const lineaVis = percorso(px, pyVis)
  const lineaUni = percorso(px, pyUni)
  const area = n > 1 ? `${lineaVis} L ${px[n - 1]} ${base} L ${px[0]} ${base} Z` : ''

  const svg = nodo('svg', {
    role: 'img',
    width: larghezza,
    height: altezza,
    viewBox: `0 0 ${Math.max(larghezza, 1)} ${altezza}`,
  })
  svg.style.display = 'block'
  svg.style.width = '100%'
  svg.style.height = `${altezza}px`
  // Il dito che scorre la pagina la deve scorrere lo stesso.
  svg.style.touchAction = 'pan-y'

  const titolo = nodo('title')
  titolo.textContent = riassunto
  svg.append(titolo)

  /* --- sfumatura sotto la linea --- */

  progressivo += 1
  const idArea = `grf-area-${progressivo}`

  const sfumatura = nodo('linearGradient', { id: idArea, x1: '0', y1: '0', x2: '0', y2: '1' })
  const alto = nodo('stop', { offset: '0%' })
  alto.style.stopColor = 'var(--color-nero)'
  alto.style.stopOpacity = '0.16'
  const basso = nodo('stop', { offset: '100%' })
  basso.style.stopColor = 'var(--color-nero)'
  basso.style.stopOpacity = '0'
  sfumatura.append(alto, basso)

  const definizioni = nodo('defs')
  definizioni.append(sfumatura)
  svg.append(definizioni)

  /* --- tacche orizzontali con la loro cifra --- */

  for (let i = 0; i < valori.length; i++) {
    const v = valori[i]
    const y = Math.round(ordinata(v)) + 0.5
    svg.append(
      nodo('line', {
        x1: sinistra,
        y1: y,
        x2: sinistra + larghezzaArea,
        y2: y,
        stroke: v === 0 ? GRIGLIA_ZERO : GRIGLIA,
        'stroke-width': 1,
      }),
    )
    svg.append(
      testo(
        {
          x: sinistra - 9,
          y,
          'text-anchor': 'end',
          'dominant-baseline': 'middle',
          'font-size': 11,
          'font-variant-numeric': 'tabular-nums',
          fill: TESTO_ASSI,
        },
        testiY[i],
      ),
    )
  }

  /* --- area e linee --- */

  const calmo = motoRidotto()

  if (area) {
    const zona = nodo('path', { d: area, fill: `url(#${idArea})` })
    svg.append(zona)
    if (!calmo) {
      zona.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 700,
        delay: 300,
        easing: EASE,
        fill: 'both',
      })
    }
  }

  /**
   * Il tratto si disegna con pathLength=1: la lunghezza vera del percorso non
   * serve saperla, quindi niente misure in JavaScript. A fine animazione lo
   * scostamento e zero e la linea resta intera, che e anche lo stato in cui
   * nasce se il movimento e stato messo da parte.
   */
  const tratto = (d: string, colore: string, spessore: number, ritardo: number): SVGElement => {
    const p = nodo('path', {
      d,
      pathLength: 1,
      fill: 'none',
      'stroke-dasharray': 1,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    })
    p.style.stroke = colore
    p.style.strokeWidth = String(spessore)
    svg.append(p)
    if (!calmo) {
      p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 900,
        delay: ritardo,
        easing: EASE,
        fill: 'both',
      })
    }
    return p
  }

  tratto(lineaUni, 'var(--color-taupe)', 1.75, 0)
  tratto(lineaVis, 'var(--color-nero)', 2.25, 140)

  /* --- date sull'asse orizzontale, solo quelle che ci stanno --- */

  const quante = Math.max(2, Math.min(5, Math.floor(larghezzaArea / PASSO_DATE)))
  const passi = Math.min(quante, n)
  const indici =
    n === 1
      ? [0]
      : Array.from(new Set(Array.from({ length: passi }, (_, i) => Math.round((i * (n - 1)) / (passi - 1)))))

  for (const i of indici) {
    const ancora = n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle'
    svg.append(
      testo(
        { x: px[i], y: altezza - 8, 'text-anchor': ancora, 'font-size': 11, fill: TESTO_ASSI },
        etichettaCorta(punti[i].etichetta),
      ),
    )
  }

  /* --- punto finale, finche nessuno sta indicando il grafico --- */

  const fine = nodo('g')

  const fineUni = nodo('circle', { cx: px[n - 1], cy: pyUni[n - 1], r: 3 })
  fineUni.style.fill = 'var(--color-taupe)'

  const fineVis = nodo('circle', { cx: px[n - 1], cy: pyVis[n - 1], r: 3.5 })
  fineVis.style.fill = 'var(--color-nero)'

  fine.append(fineUni, fineVis)
  svg.append(fine)

  /* --- riga verticale e pallini del punto indicato --- */

  const indicato = nodo('g', { visibility: 'hidden' })
  const verticale = nodo('line', {
    y1: SOPRA - 4,
    y2: base,
    stroke: 'rgba(21, 22, 19, 0.22)',
    'stroke-width': 1,
  })
  const segnoUni = nodo('circle', { r: 4.5, fill: '#fff', 'stroke-width': 2 })
  segnoUni.style.stroke = 'var(--color-taupe)'
  const segnoVis = nodo('circle', { r: 4.5, fill: '#fff', 'stroke-width': 2 })
  segnoVis.style.stroke = 'var(--color-nero)'
  indicato.append(verticale, segnoUni, segnoVis)
  svg.append(indicato)

  /* --- riquadro di lettura --- */

  const lettura = riquadro()

  /* --- puntatore: vale per il mouse e per il dito --- */

  const accendi = (i: number): void => {
    verticale.setAttribute('x1', String(px[i]))
    verticale.setAttribute('x2', String(px[i]))
    segnoUni.setAttribute('cx', String(px[i]))
    segnoUni.setAttribute('cy', String(pyUni[i]))
    segnoVis.setAttribute('cx', String(px[i]))
    segnoVis.setAttribute('cy', String(pyVis[i]))
    indicato.setAttribute('visibility', 'visible')
    fine.setAttribute('visibility', 'hidden')

    lettura.giorno.textContent = etichettaLunga(punti[i].etichetta)
    lettura.visualizzazioni.textContent = numeri.format(punti[i].visualizzazioni)
    lettura.unici.textContent = numeri.format(punti[i].unici)
    lettura.scatola.style.display = 'block'
    // Il riquadro non esce dai bordi: oltre una certa soglia si ferma.
    lettura.scatola.style.left = `${Math.min(Math.max(px[i], 92), Math.max(larghezza - 92, 92))}px`
  }

  const spegni = (): void => {
    indicato.setAttribute('visibility', 'hidden')
    fine.setAttribute('visibility', 'visible')
    lettura.scatola.style.display = 'none'
  }

  const segui = (e: PointerEvent): void => {
    const scatola = svg.getBoundingClientRect()
    if (scatola.width === 0) return
    const rapporto = larghezza / scatola.width
    const x = (e.clientX - scatola.left) * rapporto
    const grezzo = n === 1 ? 0 : ((x - sinistra) / larghezzaArea) * (n - 1)
    accendi(Math.max(0, Math.min(n - 1, Math.round(grezzo))))
  }

  svg.addEventListener('pointermove', segui)
  svg.addEventListener('pointerdown', segui)
  svg.addEventListener('pointerleave', spegni)
  svg.addEventListener('pointercancel', spegni)

  tela.append(svg, lettura.scatola)
}

/* --- INGRESSO ------------------------------------------------------------- */

/**
 * Disegna il grafico dentro `radice`, che viene svuotata.
 *
 * `punti` sono in ordine di tempo. `altezza` e in pixel: 260 di suo, molto
 * meno quando la curva fa da accenno dentro una card.
 */
export function disegnaGrafico(radice: HTMLElement, punti: Punto[], altezza = 260): void {
  // Un grafico disegnato prima qui dentro smette di ascoltare le misure.
  const vecchio = ascolti.get(radice)
  if (vecchio) {
    vecchio.disconnect()
    ascolti.delete(radice)
  }

  svuota(radice)
  radice.append(legenda())

  const numeri = new Intl.NumberFormat(locale())
  const vuoto = punti.length === 0 || punti.every((p) => p.visualizzazioni <= 0 && p.unici <= 0)

  if (vuoto) {
    const niente = el('div', { class: 'adm-vuoto' }, t('statistiche.nessunDato'))
    niente.style.display = 'grid'
    niente.style.placeItems = 'center'
    niente.style.minHeight = `${altezza}px`
    niente.style.textAlign = 'center'
    radice.append(niente)
    return
  }

  const totaleVis = punti.reduce((s, p) => s + p.visualizzazioni, 0)
  const totaleUni = punti.reduce((s, p) => s + p.unici, 0)
  const riassunto =
    `${t('statistiche.visitePerGiorno')} ${t('statistiche.periodo')}: ` +
    `${etichettaLunga(punti[0].etichetta)} / ${etichettaLunga(punti[punti.length - 1].etichetta)}. ` +
    `${t('statistiche.visualizzazioni')} ${numeri.format(totaleVis)}, ` +
    `${t('statistiche.uniche')} ${numeri.format(totaleUni)}.`

  const tela = el('div')
  tela.style.position = 'relative'
  tela.style.width = '100%'
  radice.append(tela, tabellaNascosta(punti, numeri, riassunto))

  let larghezza = 0

  const misura = (): void => {
    const adesso = Math.round(tela.getBoundingClientRect().width)
    // Solo la larghezza conta: l'altezza la decide chi chiama, e ridisegnare
    // a ogni cambio di altezza vorrebbe dire ridisegnare per sempre.
    if (adesso === larghezza) return
    larghezza = adesso
    svuota(tela)
    if (larghezza <= 0) return
    disegna(tela, punti, larghezza, altezza, numeri, riassunto)
  }

  misura()

  // La finestra si ascolta sempre: costa un ascoltatore e copre il giro della
  // schermata di un telefono anche dove il ResizeObserver non arriva, cosa
  // che capita in qualche webview. Chiamarlo due volte non fa danni, la
  // seconda misura trova la stessa larghezza e si ferma subito.
  window.addEventListener('resize', misura)

  if (typeof ResizeObserver === 'undefined') {
    ascolti.set(radice, { disconnect: () => window.removeEventListener('resize', misura) })
    return
  }

  // L'osservatore vede anche i cambi che la finestra non racconta: una card
  // che si stringe perche le e comparso accanto qualcos'altro.
  const osservatore = new ResizeObserver(misura)
  osservatore.observe(tela)
  ascolti.set(radice, {
    disconnect: () => {
      window.removeEventListener('resize', misura)
      osservatore.disconnect()
    },
  })
}

export default disegnaGrafico
