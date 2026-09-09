/**
 * =============================================================================
 *  TELAIO: la cornice comune a ogni schermata del pannello
 * =============================================================================
 *  Barra laterale a sinistra, area di lavoro a destra. Sotto i 700px la barra
 *  sparisce e al suo posto ci sono una testata sottile e cinque schede in
 *  fondo allo schermo, come in una app: il cliente lo apre dal telefono, in
 *  cantiere, con una mano.
 *
 *  Le sezioni sono pagine Astro separate (/admin/, /admin/blog/ ...), quindi
 *  qui dentro non c'è nessun router: solo normali <a href>. Un indirizzo del
 *  pannello si può mettere nei preferiti e funziona anche aperto da zero.
 *
 *  L'area di lavoro ha due parti: `.adm-sopra`, dove il telaio mette gli
 *  avvisi suoi (modalità di prova, modifiche da pubblicare) e che le sezioni
 *  non toccano, e `.adm-lavoro`, che è quello che ogni sezione riceve e
 *  svuota liberamente.
 * =============================================================================
 */

import { collegato, contaRichiesteNuove, daPubblicare, leggiPubblicazione, pubblica, sb } from './dati'
import { el, fascia, pulsante, svuota, toast } from './dom'
import {
  iconaBlog,
  iconaCantiere,
  iconaEsci,
  iconaEsterno,
  iconaImpostazioni,
  iconaLink,
  iconaMenu,
  iconaPannello,
  iconaPubblica,
  iconaRichieste,
  iconaStatistiche,
  iconaStella,
  iconaUtente,
} from './icone'
import { cambiaLingua, dataOra, lingua, t, type Chiave, type Lingua } from './lingua'

export type Sezione =
  | 'pannello'
  | 'richieste'
  | 'blog'
  | 'blog-modifica'
  | 'lavori'
  | 'recensioni'
  | 'statistiche'
  | 'link'
  | 'impostazioni'

/** Le due lingue del pannello. L'ordine è quello dei pulsanti. */
const LINGUE: Lingua[] = ['it', 'ro']

/** Misura delle icone della barra, in pixel. */
const MISURA_ICONA = 18

type Voce = {
  /** Quali sezioni tengono accesa questa voce. */
  sezioni: Sezione[]
  indirizzo: string
  chiave: Chiave
  icona: (dimensione?: number) => SVGElement
  /** true per la voce che porta il pallino delle richieste da leggere */
  pallino?: boolean
}

type Gruppo = { chiave: Chiave | null; voci: Voce[] }

/**
 * Il menu, a gruppi. La scrittura di un articolo accende comunque "Blog":
 * mentre si scrive si è dentro quella sezione, non da nessuna parte.
 */
const GRUPPI: Gruppo[] = [
  {
    chiave: null,
    voci: [{ sezioni: ['pannello'], indirizzo: '/admin/', chiave: 'menu.pannello', icona: iconaPannello }],
  },
  {
    chiave: 'menu.clienti',
    voci: [
      { sezioni: ['richieste'], indirizzo: '/admin/richieste/', chiave: 'menu.richieste', icona: iconaRichieste, pallino: true },
    ],
  },
  {
    chiave: 'menu.contenuti',
    voci: [
      { sezioni: ['blog', 'blog-modifica'], indirizzo: '/admin/blog/', chiave: 'menu.blog', icona: iconaBlog },
      { sezioni: ['lavori'], indirizzo: '/admin/lavori/', chiave: 'menu.lavori', icona: iconaCantiere },
      { sezioni: ['recensioni'], indirizzo: '/admin/recensioni/', chiave: 'menu.recensioni', icona: iconaStella },
    ],
  },
  {
    chiave: 'menu.analisi',
    voci: [
      { sezioni: ['statistiche'], indirizzo: '/admin/statistiche/', chiave: 'menu.statistiche', icona: iconaStatistiche },
      { sezioni: ['link'], indirizzo: '/admin/link/', chiave: 'menu.link', icona: iconaLink },
    ],
  },
  {
    chiave: null,
    voci: [
      { sezioni: ['impostazioni'], indirizzo: '/admin/impostazioni/', chiave: 'menu.impostazioni', icona: iconaImpostazioni },
    ],
  },
]

/** Le quattro voci che stanno nelle schede in fondo, su telefono. La quinta è "Altro". */
const SCHEDE: Voce[] = [GRUPPI[0].voci[0], GRUPPI[1].voci[0], GRUPPI[2].voci[0], GRUPPI[2].voci[1]]

/* --- MARCHIO -------------------------------------------------------------- */

const NS_SVG = 'http://www.w3.org/2000/svg'

/** Un nodo SVG con i suoi attributi. I valori vuoti si saltano. */
function nodo(tag: string, attributi: Record<string, string | number | null | undefined> = {}): SVGElement {
  const e = document.createElementNS(NS_SVG, tag)
  for (const chiave of Object.keys(attributi)) {
    const valore = attributi[chiave]
    if (valore === null || valore === undefined) continue
    e.setAttribute(chiave, String(valore))
  }
  return e
}

/**
 * Il logo MDA: le due case con il comignolo, la pennellata sotto e il
 * lettering. Sono le stesse sagome del logo del sito pubblico, così il
 * pannello sembra la stanza sul retro dello stesso edificio.
 *
 * I colori sono scritti a mano e non con var(): dentro un attributo di
 * presentazione SVG le variabili CSS non vengono sostituite.
 *
 * `sfondo` non decora: scava. I timpani e le finestre sono ritagli, e vanno
 * dipinti del colore vero della superficie sotto, altrimenti spariscono.
 */
export function marchio(tinta = '#151613', sfondo = '#F7F4EB'): SVGElement {
  const svg = nodo('svg', {
    viewBox: '0 0 440 172',
    role: 'img',
    'aria-label': 'MDA Impresa Edile',
    fill: 'none',
    xmlns: NS_SVG,
  })

  const titolo = nodo('title')
  titolo.textContent = 'MDA Impresa Edile'
  svg.append(titolo)

  // Comignolo
  svg.append(nodo('rect', { x: 68, y: 20, width: 17, height: 62, fill: tinta }))

  // Casa grande: falda asimmetrica che scende verso destra
  svg.append(nodo('path', { d: 'M165 12 L330 104 L42 104 Z', fill: tinta }))
  svg.append(nodo('path', { d: 'M165 35 L252 104 L78 104 Z', fill: sfondo }))
  svg.append(nodo('rect', { x: 149, y: 62, width: 32, height: 32, fill: tinta }))
  svg.append(nodo('rect', { x: 163, y: 62, width: 4, height: 32, fill: sfondo }))
  svg.append(nodo('rect', { x: 149, y: 76, width: 32, height: 4, fill: sfondo }))

  // Casa piccola. La prima sagoma, del colore dello sfondo, ritaglia lo
  // stacco fra i due tetti.
  svg.append(nodo('path', { d: 'M368 42 L440 105 L286 105 Z', fill: sfondo }))
  svg.append(nodo('path', { d: 'M368 50 L432 104 L296 104 Z', fill: tinta }))
  svg.append(nodo('path', { d: 'M368 67 L413 104 L323 104 Z', fill: sfondo }))
  svg.append(nodo('rect', { x: 356, y: 78, width: 24, height: 24, fill: tinta }))
  svg.append(nodo('rect', { x: 366.5, y: 78, width: 3, height: 24, fill: sfondo }))
  svg.append(nodo('rect', { x: 356, y: 88.5, width: 24, height: 3, fill: sfondo }))

  // Pennellata: passa sulla base delle case, non sotto
  svg.append(
    nodo('path', {
      d: 'M12 111 C 76 94, 168 103, 248 107 C 328 111, 388 107, 437 92 C 394 117, 324 124, 246 120 C 166 116, 78 117, 12 111 Z',
      fill: tinta,
    }),
  )

  // Lettering
  const carattere = 'Manrope Variable, Manrope, Helvetica, Arial, sans-serif'

  const mda = nodo('text', {
    x: 46,
    y: 164,
    'font-family': carattere,
    'font-size': 46,
    'font-weight': 800,
    'letter-spacing': 3,
    fill: tinta,
  })
  mda.textContent = 'MDA'
  svg.append(mda)

  const impresa = nodo('text', {
    x: 176,
    y: 164,
    'font-family': carattere,
    'font-size': 23,
    'font-weight': 600,
    'letter-spacing': 4.2,
    fill: tinta,
  })
  impresa.textContent = 'IMPRESA EDILE'
  svg.append(impresa)

  return svg
}

/* --- USCITA --------------------------------------------------------------- */

/**
 * Chiude la sessione e torna all'ingresso. La chiusura vera vive accanto
 * all'ingresso, in accesso.ts: è lì che si sa con quale chiave è stata
 * scritta la sessione di prova.
 */
async function esciDalPannello(): Promise<void> {
  try {
    const modulo = (await import('./accesso')) as unknown as Record<string, unknown>
    const uscita = modulo.esci
    if (typeof uscita === 'function') {
      await (uscita as () => Promise<void> | void)()
      return
    }
  } catch {
    /* modulo assente o rotto: si esce lo stesso, qui sotto */
  }

  try {
    if (sb) await sb.auth.signOut()
  } catch {
    /* senza rete la sessione resta aperta sul server, ma qui si esce comunque */
  }
  location.href = '/admin/'
}

/* --- PALLINO DELLE RICHIESTE ---------------------------------------------- */

/** Tutti i pallini della pagina: barra laterale, schede, foglio. */
const pallini: HTMLElement[] = []

function nuovoPallino(): HTMLElement {
  const p = el('span', { class: 'adm-pallino', hidden: true, 'aria-label': t('menu.nuoveRichieste') })
  pallini.push(p)
  return p
}

/** Aggiorna il numero su tutti i pallini. Zero li nasconde. */
export function aggiornaPallino(quante: number): void {
  for (const p of pallini) {
    p.textContent = quante > 99 ? '99+' : String(quante)
    p.hidden = quante <= 0
  }
}

async function contaPerIlPallino(): Promise<void> {
  try {
    aggiornaPallino(await contaRichiesteNuove())
  } catch {
    /* il conteggio è un lusso: senza, il menu resta com'è */
  }
}

/* --- PEZZI DELLA BARRA ---------------------------------------------------- */

/** Una voce del menu: icona, testo e title, con l'aria accesa se è la sua. */
function voceMenu(voce: Voce, sezione: Sezione): HTMLElement {
  const attiva = voce.sezioni.includes(sezione)
  const testo = t(voce.chiave)

  return el(
    'a',
    {
      class: attiva ? 'adm-attivo' : null,
      href: voce.indirizzo,
      title: testo,
      'aria-current': attiva ? 'page' : null,
    },
    [voce.icona(MISURA_ICONA), el('span', undefined, testo), voce.pallino ? nuovoPallino() : null],
  )
}

/**
 * I due pulsanti della lingua. Le sigle non passano da t(): IT e RO sono le
 * stesse in tutte e due le lingue. Ogni pulsante porta il proprio lang, così
 * una voce sintetica legge "RO" come lo leggerebbe un romeno.
 */
function sceltaLingua(): HTMLElement {
  const attuale = lingua()
  const gruppo = el('div', { class: 'adm-lingue' })

  for (const l of LINGUE) {
    const scelta = l === attuale
    const b = el(
      'button',
      {
        type: 'button',
        lang: l,
        class: scelta ? 'adm-lingua-attiva' : null,
        'aria-pressed': scelta ? 'true' : 'false',
      },
      l.toUpperCase(),
    )
    b.addEventListener('click', () => {
      if (scelta) return
      cambiaLingua(l)
    })
    gruppo.append(b)
  }

  return gruppo
}

/** Il menu a gruppi, uguale nella barra e nel foglio su telefono. */
function menu(sezione: Sezione, soloVoci?: Voce[]): HTMLElement {
  const nav = el('nav', { class: 'adm-menu', 'aria-label': t('menu.aria') })
  if (soloVoci) {
    for (const voce of soloVoci) nav.append(voceMenu(voce, sezione))
    return nav
  }
  for (const gruppo of GRUPPI) {
    if (gruppo.chiave) nav.append(el('p', { class: 'adm-menu-gruppo' }, t(gruppo.chiave)))
    for (const voce of gruppo.voci) nav.append(voceMenu(voce, sezione))
  }
  return nav
}

/** Il fondo della barra: chi è dentro, lingua, collegamento al sito e uscita. */
function fondoBarra(email: string | null): HTMLElement {
  const vediSito = t('menu.vediSito')
  const esci = t('menu.esci')

  const chi = email
    ? el('div', { class: 'adm-utente', title: email }, [iconaUtente(15), el('span', undefined, email)])
    : null

  const sito = el(
    'a',
    { href: '/', target: '_blank', rel: 'noopener noreferrer', title: vediSito },
    [iconaEsterno(MISURA_ICONA), el('span', undefined, vediSito)],
  )

  const uscita = el('button', { type: 'button', class: 'adm-esci', title: esci }, [
    iconaEsci(MISURA_ICONA),
    el('span', undefined, esci),
  ])
  uscita.addEventListener('click', () => {
    uscita.disabled = true
    void esciDalPannello()
  })

  return el('div', { class: 'adm-lato-fondo' }, [chi, sceltaLingua(), sito, uscita])
}

/** La barra laterale intera. */
function barraLaterale(sezione: Sezione, email: string | null): HTMLElement {
  const testa = el('div', { class: 'adm-lato-testa' }, [
    marchio(),
    el('span', { class: 'adm-marchio' }, t('accesso.titolo')),
  ])
  return el('aside', { class: 'adm-lato' }, [testa, menu(sezione), fondoBarra(email)])
}

/* --- TELEFONO: testata, schede e foglio "Altro" --------------------------- */

function testataMobile(): HTMLElement {
  const logo = marchio()
  logo.classList.add('adm-testata-logo')
  return el('header', { class: 'adm-testata-mobile' }, [
    el('a', { href: '/admin/', 'aria-label': t('menu.pannello') }, [logo]),
    el(
      'a',
      { class: 'adm-btn adm-btn-chiaro adm-btn-piccolo', href: '/', target: '_blank', rel: 'noopener noreferrer' },
      [iconaEsterno(14), el('span', undefined, t('menu.vediSito'))],
    ),
  ])
}

function schedeMobile(sezione: Sezione, email: string | null): HTMLElement[] {
  const foglio = el('div', { class: 'adm-foglio', 'data-aperto': 'false', role: 'dialog', 'aria-modal': 'true' })
  const altro = el('button', { type: 'button', 'aria-expanded': 'false', 'aria-controls': 'adm-foglio' }, [
    iconaMenu(20),
    el('span', undefined, t('menu.altro')),
  ])

  const apri = (stato: boolean) => {
    foglio.dataset.aperto = stato ? 'true' : 'false'
    altro.setAttribute('aria-expanded', stato ? 'true' : 'false')
  }
  altro.addEventListener('click', () => apri(foglio.dataset.aperto !== 'true'))
  foglio.addEventListener('click', (ev) => {
    if (ev.target === foglio) apri(false)
  })
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') apri(false)
  })

  // Nel foglio ci sono le voci che non stanno nelle schede, più il fondo.
  const nelleSchede = new Set(SCHEDE)
  const restanti = GRUPPI.flatMap((g) => g.voci).filter((v) => !nelleSchede.has(v))
  foglio.id = 'adm-foglio'
  foglio.append(el('div', { class: 'adm-foglio-corpo' }, [menu(sezione, restanti), fondoBarra(email)]))

  const schede = el('nav', { class: 'adm-schede', 'aria-label': t('menu.aria') })
  for (const voce of SCHEDE) {
    const attiva = voce.sezioni.includes(sezione)
    schede.append(
      el('a', { href: voce.indirizzo, class: attiva ? 'adm-attivo' : null, 'aria-current': attiva ? 'page' : null }, [
        voce.icona(20),
        el('span', undefined, t(voce.chiave)),
        voce.pallino ? nuovoPallino() : null,
      ]),
    )
  }
  const restantiAttive = restanti.some((v) => v.sezioni.includes(sezione))
  if (restantiAttive) altro.classList.add('adm-attivo')
  schede.append(altro)

  return [schede, foglio]
}

/* --- AVVISI IN CIMA ------------------------------------------------------- */

/** Senza database quello che si scrive non parte: lo si dice subito. */
function fasciaLocale(): HTMLElement {
  return fascia(t('locale.testo'), 'info', t('locale.titolo'))
}

/**
 * La fascia della pubblicazione: compare solo quando ci sono modifiche
 * salvate dopo l'ultima pubblicazione. Con l'indirizzo impostato ha il
 * pulsante che rigenera il sito; senza, spiega che le modifiche andranno
 * online al prossimo aggiornamento.
 */
async function fasciaPubblicazione(sopra: HTMLElement): Promise<void> {
  let stato
  try {
    stato = await leggiPubblicazione()
  } catch {
    return
  }

  // La fascia vecchia va via in ogni caso: dopo una pubblicazione non c'è
  // più niente da segnalare, e lasciarla lì direbbe il contrario.
  const vecchia = sopra.querySelector('.adm-fascia-pubblica')
  if (vecchia) vecchia.remove()

  if (!daPubblicare(stato)) return

  if (!stato.hook_url) {
    const link = el('a', { href: '/admin/impostazioni/#pubblicazione', class: 'adm-btn adm-btn-chiaro adm-btn-piccolo' }, [
      iconaImpostazioni(14),
      el('span', undefined, t('pubblica.impostaHook')),
    ])
    const f = fascia([document.createTextNode(t('pubblica.senzaHook')), el('span', undefined, ' ')], 'info')
    f.classList.add('adm-fascia-pubblica')
    f.append(link)
    sopra.append(f)
    return
  }

  const bottonePubblica = pulsante(iconaPubblica(16), t('pubblica.pubblica'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', () => {
    bottonePubblica.disabled = true
    void pubblica()
      .then(() => {
        toast(t('pubblica.fatto'))
        f.remove()
      })
      .catch(() => {
        toast(t('comune.errore'), 'errore')
        bottonePubblica.disabled = false
      })
  })

  const testo = stato.ultima_pubblicazione
    ? `${t('pubblica.daPubblicare')} ${t('pubblica.ultima')}: ${dataOra(stato.ultima_pubblicazione)}.`
    : `${t('pubblica.daPubblicare')} ${t('pubblica.maiPubblicato')}`

  const f = fascia(testo, 'info')
  f.classList.add('adm-fascia-pubblica')
  f.append(bottonePubblica)
  sopra.append(f)
}

/** Da chiamare dopo un salvataggio: la fascia si aggiorna senza ricaricare. */
export function segnalaModifica(): void {
  const sopra = document.querySelector<HTMLElement>('.adm-sopra')
  if (sopra) void fasciaPubblicazione(sopra)
}

/* --- TELAIO --------------------------------------------------------------- */

/**
 * Costruisce la cornice e restituisce l'area di lavoro, cioè l'elemento dove
 * la schermata si disegnerà. Il telaio completo si raggiunge da lì con
 * `lavoro.closest('.adm')`: è quello che va attaccato alla pagina.
 */
export function disegnaTelaio(sezione: Sezione, email: string | null): HTMLElement {
  const sopra = el('div', { class: 'adm-sopra' })
  const lavoro = el('main', { class: 'adm-lavoro', id: 'contenuto' })
  const corpo = el('div', { class: 'adm-corpo' }, [sopra, lavoro])

  if (!collegato) sopra.append(fasciaLocale())

  el('div', { class: 'adm' }, [
    barraLaterale(sezione, email),
    el('div', { class: 'adm-destra' }, [testataMobile(), corpo, ...schedeMobile(sezione, email)]),
  ])

  void contaPerIlPallino()
  void fasciaPubblicazione(sopra)

  return lavoro
}

/* --- INTESTAZIONE --------------------------------------------------------- */

/**
 * La riga in cima a una schermata: titolo, sottotitolo e, a destra, le
 * azioni (un pulsante, un gruppo di segmenti, quello che serve).
 *
 *   intestazione(lavoro, titolo, sottotitolo, azioni)
 *
 * Si attacca da sola in cima all'area di lavoro, sostituendo quella che
 * c'era. Torna l'elemento, per chi vuole aggiornarlo dopo.
 */
export function intestazione(
  lavoro: HTMLElement,
  titolo: string,
  sottotitolo?: string,
  azioni?: (HTMLElement | null)[] | HTMLElement,
  occhiello?: string,
): HTMLElement {
  const scritte = el('div', undefined, [
    occhiello ? el('p', { class: 'adm-occhiello' }, occhiello) : null,
    el('h1', { class: 'adm-titolo' }, titolo),
    sottotitolo ? el('p', { class: 'adm-sottotitolo' }, sottotitolo) : null,
  ])

  const lista = Array.isArray(azioni) ? azioni.filter(Boolean) : azioni ? [azioni] : []
  const testa = el('header', { class: 'adm-testa' }, [
    scritte,
    lista.length ? el('div', { class: 'adm-testa-azioni' }, lista) : null,
  ])

  const vecchia = lavoro.querySelector(':scope > .adm-testa')
  if (vecchia) vecchia.replaceWith(testa)
  else lavoro.prepend(testa)

  return testa
}

/** Svuota l'area di lavoro: le sezioni partono sempre da qui. */
export function pulisci(lavoro: HTMLElement): void {
  svuota(lavoro)
}
