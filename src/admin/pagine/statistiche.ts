/**
 * =============================================================================
 *  STATISTICHE
 * =============================================================================
 *  I numeri del traffico, spiegati a chi non guarda numeri tutti i giorni.
 *
 *  Quattro periodi in cima: 7, 30 e 90 giorni passano da leggiStatistiche(n),
 *  i 12 mesi da leggiStatisticheMesi(12). Ogni cambio di periodo rilegge tutto
 *  dal database, quindi c'è sempre uno stato di attesa e uno di errore.
 *
 *  Il grafico ha accanto la stessa cosa in tabella: chi non legge bene una
 *  curva deve poter leggere le cifre riga per riga.
 * =============================================================================
 */

import { el, fascia, scheletro, statoErrore, svuota } from '../dom'
import {
  iconaGrafico,
  iconaLink,
  iconaMondo,
  iconaOcchio,
  iconaPersone,
  iconaSchermo,
  iconaTabella,
  iconaTelefono,
} from '../icone'
import { intestazione } from '../telaio'
import { disegnaGrafico } from '../grafico'
import { leggiStatistiche, leggiStatisticheMesi, type Statistiche } from '../dati'
import { locale, t, type Chiave } from '../lingua'

/* --- PERIODI -------------------------------------------------------------- */

type Periodo = {
  /** chiave stabile per il confronto, non è testo mostrato */
  id: string
  etichetta: Chiave
  /** giorni oppure mesi, secondo aMesi */
  quantita: number
  aMesi: boolean
}

const PERIODI: readonly Periodo[] = [
  { id: 'g7', etichetta: 'statistiche.settegiorni', quantita: 7, aMesi: false },
  { id: 'g30', etichetta: 'statistiche.trentagiorni', quantita: 30, aMesi: false },
  { id: 'g90', etichetta: 'statistiche.novantagiorni', quantita: 90, aMesi: false },
  { id: 'm12', etichetta: 'statistiche.dodicimesi', quantita: 12, aMesi: true },
]

/* --- PEZZI RIUSABILI ------------------------------------------------------ */

type VoceBarra = {
  id: string
  nome: string
  valore: number
}

/**
 * Una lista con la barra accanto a ogni voce. La barra è proporzionale al
 * primo della lista, non al totale: così anche una lista di numeri piccoli
 * resta leggibile. Il minimo del 3 per cento serve a far vedere che la voce
 * esiste, anche quando vale uno contro mille.
 */
function listaBarre(voci: VoceBarra[], formatta: (n: number) => string): HTMLElement {
  if (voci.length === 0) return el('p', { class: 'adm-vuoto' }, t('statistiche.nessunDato'))

  const massimo = voci.reduce((m, v) => (v.valore > m ? v.valore : m), 0)
  const lista = el('div')

  for (const v of voci) {
    const parte = massimo > 0 ? Math.max(3, Math.round((v.valore / massimo) * 100)) : 0

    // La larghezza cambia con i dati: è l'unico caso in cui lo stile va
    // scritto sull'elemento, la classe non può saperla.
    const pieno = el('i')
    pieno.style.width = `${parte}%`

    lista.append(
      el('div', { class: 'adm-riga-barra' }, [
        el('span', { title: v.nome }, v.nome),
        el('span', { class: 'adm-barra', 'aria-hidden': 'true' }, [pieno]),
        el('span', { class: 'adm-cifra' }, formatta(v.valore)),
      ]),
    )
  }

  return lista
}

/**
 * Una card numerica: icona piccola nell'etichetta, cifra grossa, nota sotto.
 * L'etichetta è già un flex con il suo spazio: l'icona si mette davanti e
 * basta, senza spazi di testo in mezzo.
 */
function cardNumero(
  simbolo: SVGElement,
  etichetta: string,
  valore: string,
  nota: string,
  piccolo = false,
  titoloValore?: string,
): HTMLElement {
  return el('div', { class: 'adm-card adm-entra' }, [
    el('p', { class: 'adm-etichetta' }, [simbolo, etichetta]),
    el(
      'p',
      { class: piccolo ? 'adm-numero adm-numero-piccolo' : 'adm-numero', title: titoloValore },
      valore,
    ),
    el('p', { class: 'adm-nota' }, nota),
  ])
}

/**
 * Il titoletto di un riquadro, con l'icona davanti se c'è. Il titoletto è un
 * flex che spinge ai due lati quello che contiene: icona e parola stanno
 * dentro un solo span, così restano vicine e niente finisce a destra.
 */
function titoletto(simbolo: SVGElement | null, titolo: string): HTMLElement {
  if (!simbolo) return el('h2', { class: 'adm-titoletto' }, titolo)
  const insieme = el('span', undefined, [simbolo, titolo])
  // Micro-allineamento che nessuna classe copre: l'icona centrata sulla riga.
  insieme.style.display = 'inline-flex'
  insieme.style.alignItems = 'center'
  insieme.style.gap = '0.5rem'
  return el('h2', { class: 'adm-titoletto' }, [insieme])
}

/** Un riquadro di dettaglio: titoletto con icona e dentro quello che gli passi. */
function riquadro(simbolo: SVGElement | null, titolo: string, dentro: Node): HTMLElement {
  return el('div', { class: 'adm-card adm-entra' }, [titoletto(simbolo, titolo), dentro])
}

/** Una tabella dentro il suo contenitore scorrevole: su telefono scorre lei, non la pagina. */
function tabellaScorrevole(intestazioni: string[], righe: HTMLElement): HTMLElement {
  return el('div', { class: 'adm-scorri' }, [
    el('table', { class: 'adm-tabella adm-tabella-numeri' }, [
      el('thead', undefined, [
        el(
          'tr',
          undefined,
          intestazioni.map((testo) => el('th', { scope: 'col' }, testo)),
        ),
      ]),
      righe,
    ]),
  ])
}

/**
 * Lo stato di attesa con la stessa sagoma della pagina piena: quattro card
 * piccole e una grande. Così quando arrivano i numeri niente salta.
 */
function attesa(): HTMLElement[] {
  const cardVuota = (righe: number): HTMLElement => el('div', { class: 'adm-card' }, [scheletro(righe)])
  return [
    el('div', { class: 'adm-griglia-numeri' }, [cardVuota(2), cardVuota(2), cardVuota(2), cardVuota(2)]),
    cardVuota(6),
  ]
}

/* --- SCHERMATA ------------------------------------------------------------ */

export default function disegna(lavoro: HTMLElement): void {
  svuota(lavoro)

  let idPeriodo: string = PERIODI[0].id
  /** false = grafico, true = tabella. Vale per tutti i periodi. */
  let tabella = false
  /**
   * Contatore delle letture: la risposta lenta di un periodo abbandonato non
   * deve sovrascrivere quella del periodo che si sta guardando adesso.
   */
  let giro = 0

  // Le cifre nella lingua del pannello: entrambe le lingue mettono il punto
  // alle migliaia, ma il formato lo decide Intl, non noi.
  const numeri = new Intl.NumberFormat(locale())
  const formatta = (n: number): string => numeri.format(n)

  /* --- intestazione, sempre visibile anche mentre carica --- */

  const segmenti = el('div', {
    class: 'adm-segmenti',
    role: 'group',
    'aria-label': t('statistiche.titolo'),
  })

  const bottoni = new Map<string, HTMLButtonElement>()

  for (const p of PERIODI) {
    const b = el(
      'button',
      { type: 'button', 'aria-pressed': p.id === idPeriodo ? 'true' : 'false' },
      t(p.etichetta),
    )
    b.addEventListener('click', () => {
      if (idPeriodo === p.id) return
      idPeriodo = p.id
      segnaAttivo()
      void carica()
    })
    bottoni.set(p.id, b)
    segmenti.append(b)
  }

  function segnaAttivo(): void {
    for (const [id, b] of bottoni) {
      b.setAttribute('aria-pressed', id === idPeriodo ? 'true' : 'false')
    }
  }

  // L'intestazione si attacca da sola in cima all'area di lavoro: i segmenti
  // dei periodi restano raggiungibili anche mentre i numeri caricano o
  // falliscono.
  intestazione(lavoro, t('statistiche.titolo'), t('statistiche.sottotitolo'), segmenti)

  // La nota e la zona dei dati stanno in pila: la fascia non ha un margine
  // suo e senza la pila si incollerebbe alle card.
  const zona = el('div')
  lavoro.append(el('div', { class: 'adm-pila' }, [fascia(t('statistiche.nota'), 'info'), zona]))

  /* --- nomi tradotti dei dati grezzi --- */

  /** Sorgente vuota o "diretto": chi ha digitato l'indirizzo o veniva dai preferiti. */
  function nomeSorgente(sorgente: string): string {
    const pulita = (sorgente ?? '').trim().toLowerCase()
    if (pulita === '' || pulita === 'diretto') return t('statistiche.diretto')
    // Un dominio qualsiasi si mostra com'è: è un dato, non testo dell'interfaccia.
    return sorgente
  }

  function nomeDispositivo(dispositivo: string): string {
    if (dispositivo === 'computer') return t('statistiche.computer')
    if (dispositivo === 'telefono') return t('statistiche.telefono')
    return dispositivo
  }

  /* --- andamento nel tempo, a scelta grafico o tabella --- */

  function tabellaSerie(dati: Statistiche): HTMLElement {
    const righe = el('tbody')
    for (const riga of dati.serie) {
      righe.append(
        el('tr', undefined, [
          el('td', undefined, riga.etichetta),
          el('td', undefined, formatta(riga.visualizzazioni)),
          el('td', undefined, formatta(riga.unici)),
        ]),
      )
    }

    return tabellaScorrevole(
      [t('statistiche.giorno'), t('statistiche.visualizzazioni'), t('statistiche.uniche')],
      righe,
    )
  }

  /**
   * Il riquadro dell'andamento. Restituisce anche la funzione che lo riempie,
   * perché il grafico per misurarsi deve già stare nella pagina: finché la
   * card è un pezzo staccato la sua larghezza è zero.
   */
  function cardAndamento(dati: Statistiche): { card: HTMLElement; riempi: () => void } {
    const scambia = el('button', { type: 'button', class: 'adm-btn adm-btn-chiaro adm-btn-piccolo' })

    // Il titoletto è fatto per avere qualcosa a destra: qui ci va il
    // pulsante che scambia grafico e tabella.
    const testa = el('h2', { class: 'adm-titoletto' }, [
      el('span', undefined, t('statistiche.visitePerGiorno')),
      scambia,
    ])
    const dentro = el('div')
    const card = el('div', { class: 'adm-card adm-entra' }, [testa, dentro])

    function ridisegna(): void {
      svuota(scambia)
      scambia.append(
        tabella ? iconaGrafico(14) : iconaTabella(14),
        el('span', undefined, tabella ? t('statistiche.vediGrafico') : t('statistiche.vediTabella')),
      )
      scambia.setAttribute('aria-pressed', tabella ? 'true' : 'false')

      svuota(dentro)
      if (dati.serie.length === 0) {
        dentro.append(el('p', { class: 'adm-vuoto' }, t('statistiche.nessunDato')))
        return
      }
      if (tabella) {
        dentro.append(tabellaSerie(dati))
        return
      }
      disegnaGrafico(dentro, dati.serie)
    }

    scambia.addEventListener('click', () => {
      tabella = !tabella
      ridisegna()
    })

    return { card, riempi: ridisegna }
  }

  /* --- i quattro riquadri di dettaglio --- */

  function tabellaLink(dati: Statistiche): HTMLElement {
    if (dati.link.length === 0) return el('p', { class: 'adm-vuoto' }, t('statistiche.nessunDato'))

    const righe = el('tbody')
    for (const l of dati.link) {
      righe.append(
        el('tr', undefined, [
          el('td', undefined, [el('code', { class: 'adm-codice' }, l.codice)]),
          el('td', undefined, formatta(l.sessioni)),
          el('td', undefined, formatta(l.visualizzazioni)),
        ]),
      )
    }

    return tabellaScorrevole([t('link.codice'), t('link.visite'), t('link.visualizzazioni')], righe)
  }

  function dettagli(dati: Statistiche): HTMLElement {
    const vociPagine: VoceBarra[] = dati.pagine
      .map((p) => ({ id: p.percorso, nome: p.percorso, valore: p.visualizzazioni }))
      .sort((a, b) => b.valore - a.valore)

    const vociSorgenti: VoceBarra[] = dati.sorgenti
      .map((s) => ({ id: s.sorgente || 'diretto', nome: nomeSorgente(s.sorgente), valore: s.sessioni }))
      .sort((a, b) => b.valore - a.valore)

    const vociDispositivi: VoceBarra[] = dati.dispositivi
      .map((d) => ({ id: d.dispositivo, nome: nomeDispositivo(d.dispositivo), valore: d.sessioni }))
      .sort((a, b) => b.valore - a.valore)

    return el('div', { class: 'adm-quattro' }, [
      riquadro(null, t('statistiche.paginePiuViste'), listaBarre(vociPagine, formatta)),
      riquadro(iconaMondo(16), t('statistiche.provenienza'), listaBarre(vociSorgenti, formatta)),
      riquadro(iconaSchermo(16), t('statistiche.dispositivi'), listaBarre(vociDispositivi, formatta)),
      riquadro(iconaLink(16), t('statistiche.trafficoLink'), tabellaLink(dati)),
    ])
  }

  /* --- i quattro numeri grossi --- */

  function numeriGrossi(dati: Statistiche): HTMLElement {
    const piuVista =
      dati.pagine.length === 0
        ? null
        : dati.pagine.reduce((a, b) => (b.visualizzazioni > a.visualizzazioni ? b : a))

    const sessioni = dati.dispositivi.reduce((s, d) => s + d.sessioni, 0)
    const daTelefono = dati.dispositivi
      .filter((d) => d.dispositivo === 'telefono')
      .reduce((s, d) => s + d.sessioni, 0)
    const percentualeTelefono = sessioni === 0 ? 0 : Math.round((daTelefono / sessioni) * 100)

    return el('div', { class: 'adm-griglia-numeri' }, [
      cardNumero(
        iconaOcchio(13),
        t('statistiche.visualizzazioni'),
        formatta(dati.totale.visualizzazioni),
        t('statistiche.periodo'),
      ),
      cardNumero(
        iconaPersone(13),
        t('statistiche.uniche'),
        formatta(dati.totale.unici),
        t('statistiche.sessioni'),
      ),
      // Qui dentro va un indirizzo di pagina, non una cifra: carattere più
      // piccolo. Senza dati resta uno spazio fermo, così la card non cambia
      // altezza quando il periodo scelto è vuoto.
      cardNumero(
        iconaGrafico(13),
        t('statistiche.piuVista'),
        piuVista ? piuVista.percorso : '\u00a0',
        piuVista
          ? `${formatta(piuVista.visualizzazioni)} ${t('statistiche.visualizzazioni')}`
          : t('statistiche.nessunDato'),
        true,
        piuVista ? piuVista.percorso : undefined,
      ),
      cardNumero(
        iconaTelefono(13),
        t('statistiche.daMobile'),
        `${formatta(percentualeTelefono)}%`,
        t('statistiche.percentuale'),
      ),
    ])
  }

  /* --- lettura --- */

  function mostra(dati: Statistiche): void {
    svuota(zona)
    const andamento = cardAndamento(dati)
    // La griglia dei numeri ha già il suo margine sotto; andamento e dettagli
    // stanno in pila con lo stesso passo.
    zona.append(numeriGrossi(dati), el('div', { class: 'adm-pila' }, [andamento.card, dettagli(dati)]))
    // Prima la card entra nella pagina, poi si disegna quello che ci va dentro.
    andamento.riempi()
  }

  async function carica(): Promise<void> {
    const mio = ++giro
    const periodo = PERIODI.find((p) => p.id === idPeriodo) ?? PERIODI[0]

    svuota(zona)
    zona.append(...attesa())

    try {
      const dati = periodo.aMesi
        ? await leggiStatisticheMesi(periodo.quantita)
        : await leggiStatistiche(periodo.quantita)
      if (mio !== giro) return
      mostra(dati)
    } catch {
      if (mio !== giro) return
      // L'errore sta dentro una card, così la pagina non salta da un blocco
      // alto a una riga di testo nudo.
      svuota(zona)
      const errore = el('div', { class: 'adm-card adm-entra' })
      zona.append(errore)
      statoErrore(errore, () => void carica())
    }
  }

  void carica()
}
