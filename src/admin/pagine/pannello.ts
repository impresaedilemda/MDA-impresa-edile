/**
 * =============================================================================
 *  PANNELLO: la schermata iniziale dell'area riservata
 * =============================================================================
 *  La prima cosa che il cliente vede quando entra, spesso dal telefono, in
 *  cantiere. Deve rispondere a tre domande in un colpo d'occhio: c'è qualcuno
 *  che aspetta una risposta? Il sito è visitato? Cosa posso fare adesso?
 *
 *  Tre fasce, nell'ordine in cui contano:
 *    1. quattro numeri: richieste da leggere, oggi, sette giorni, trenta
 *       giorni con la curva del mese;
 *    2. le ultime richieste arrivate, i contenuti del sito e le scorciatoie;
 *    3. gli ultimi articoli scritti.
 *
 *  Le letture partono tutte insieme con Promise.all: se il database è lento
 *  meglio un'attesa sola che sei in fila. Se una qualsiasi fallisce cade tutto
 *  il contenuto, con il messaggio e il pulsante per riprovare: mostrare cinque
 *  numeri su sei sarebbe peggio che non mostrarne nessuno, perché il cliente
 *  non saprebbe quale dei cinque è vecchio.
 *
 *  Mentre i dati arrivano la pagina ha già la sua forma: card con righe grigie
 *  al posto dei numeri, così niente salta quando compaiono quelli veri.
 *
 *  La navigazione fra le sezioni resta di pagine Astro separate, quindi qui ci
 *  sono normali <a href>, non un router.
 * =============================================================================
 */

import { avatar, distintivo, el, fascia, scheletro, statoErrore, svuota } from '../dom'
import {
  iconaCantiere,
  iconaFreccia,
  iconaGrafico,
  iconaImpostazioni,
  iconaLink,
  iconaMatita,
  iconaPiu,
  iconaStella,
} from '../icone'
import { aggiornaPallino, intestazione } from '../telaio'
import { disegnaGrafico } from '../grafico'
import {
  elencaArticoli,
  elencaRichieste,
  leggiContatori,
  leggiStatistiche,
  type Articolo,
  type Contatori,
  type Richiesta,
  type Statistiche,
} from '../dati'
import { dataLeggibile, numero, t, tempoFa } from '../lingua'

/** Tutto quello che la schermata mostra, letto in un colpo solo. */
type Caricato = {
  contatori: Contatori
  oggi: Statistiche
  sette: Statistiche
  trenta: Statistiche
  richieste: Richiesta[]
  articoli: Articolo[]
}

/** Quante richieste e quanti articoli recenti stanno nelle liste. */
const QUANTI = 5

/** Altezza della curva dentro la card dei numeri: è un accenno, non un grafico. */
const ALTEZZA_CURVA = 92

/** Separatore fra comune, servizio e tempo nella riga di una richiesta. */
const PUNTO = ' · '

/* --- SALUTO --------------------------------------------------------------- */

/**
 * Il titolo cambia con l'ora: chi apre il pannello alle sette del mattino e
 * chi lo apre dopo cena leggono due cose diverse. Il pomeriggio comincia
 * dopo pranzo e la sera alle sei, come nell'uso corrente.
 */
function saluto(): string {
  const ora = new Date().getHours()
  if (ora < 13) return t('pannello.buongiorno')
  if (ora < 18) return t('pannello.buonPomeriggio')
  return t('pannello.buonasera')
}

/* --- PEZZI PICCOLI -------------------------------------------------------- */

/**
 * Il collegamento in fondo a una card dei numeri. È un pulsante chiaro e non
 * un testo in taupe perché deve leggersi anche sulla card scura delle
 * richieste, dove il taupe sparirebbe sul nero. Il margine automatico lo
 * tiene in fondo quando la card accanto è più alta.
 */
function collegamento(href: string, testo: string): HTMLElement {
  const a = el('a', { class: 'adm-btn adm-btn-chiaro adm-btn-piccolo', href }, [
    el('span', undefined, testo),
    iconaFreccia(14),
  ])
  a.style.marginTop = 'auto'
  a.style.alignSelf = 'flex-start'
  return a
}

/**
 * Una card dei numeri che porta anche un collegamento (o la curva) sotto: si
 * dispone in colonna così quello che sta in fondo resta in fondo, allineato
 * fra una card e l'altra, qualunque sia l'altezza del testo sopra.
 */
function cardInColonna(classe: string, figli: (Node | null)[]): HTMLElement {
  const card = el('article', { class: classe }, figli)
  card.style.display = 'flex'
  card.style.flexDirection = 'column'
  card.style.gap = '0.85rem'
  return card
}

/** Etichetta, numero e nota: il blocco che apre ogni card dei numeri. */
function blocco(etichetta: string, valore: number, nota: string, piccolo = false): HTMLElement {
  return el('div', undefined, [
    el('p', { class: 'adm-etichetta' }, etichetta),
    el('p', { class: piccolo ? 'adm-numero adm-numero-piccolo' : 'adm-numero' }, numero(valore)),
    el('p', { class: 'adm-nota' }, nota),
  ])
}

/** "visualizzazioni · 12 visite uniche", la nota sotto i numeri del traffico. */
function notaTraffico(s: Statistiche): string {
  return `${t('pannello.visualizzazioni')}${PUNTO}${numero(s.totale.unici)} ${t('pannello.visiteUniche')}`
}

/** Il titolo di una card con, se serve, il collegamento a destra. */
function titoletto(testo: string, href?: string, testoLink?: string): HTMLElement {
  return el('h2', { class: 'adm-titoletto' }, [
    el('span', undefined, testo),
    href && testoLink ? el('a', { href }, testoLink) : null,
  ])
}

/* --- PRIMA FASCIA: I NUMERI ----------------------------------------------- */

/**
 * La card delle richieste da leggere. Con almeno una richiesta in attesa
 * diventa nera: è l'unica cosa nella pagina che chiede un'azione, e deve
 * saltare all'occhio prima di tutto il resto. A zero torna bianca come le
 * altre, con una riga che lo dice.
 */
function cardRichiesteNuove(quante: number): HTMLElement {
  const nessuna = quante <= 0
  return cardInColonna(nessuna ? 'adm-card adm-entra' : 'adm-card adm-card-scura adm-entra', [
    blocco(t('pannello.richiesteNuove'), quante, nessuna ? t('pannello.nessunaNuova') : t('pannello.richiesteNuoveNota')),
    collegamento('/admin/richieste/', t('pannello.vediRichieste')),
  ])
}

/** Una card con il solo numero: oggi e gli ultimi sette giorni. */
function cardTraffico(etichetta: string, s: Statistiche, piccolo = false): HTMLElement {
  return el('article', { class: 'adm-card adm-entra' }, [blocco(etichetta, s.totale.visualizzazioni, notaTraffico(s), piccolo)])
}

/**
 * La quarta card: i trenta giorni, la curva del mese e il collegamento alle
 * statistiche. Il numero resta grande: è la card del mese, quella che dice
 * se il sito lavora, e sotto ha spazio a sufficienza.
 *
 * Il grafico non si disegna qui dentro: per sapere quanto è largo deve già
 * stare nella pagina, e finché la card è un pezzo staccato la larghezza è
 * zero. Perciò torna anche la tela, e chi attacca la card disegna dopo.
 */
function cardMese(s: Statistiche): { card: HTMLElement; tela: HTMLElement } {
  const tela = el('div', { 'aria-label': t('pannello.curva') })
  const card = cardInColonna('adm-card adm-entra', [
    blocco(t('pannello.trentaGiorni'), s.totale.visualizzazioni, notaTraffico(s)),
    tela,
    collegamento('/admin/statistiche/', t('pannello.vediStatistiche')),
  ])
  return { card, tela }
}

/* --- SECONDA FASCIA: RICHIESTE, SITO, SCORCIATOIE ------------------------- */

/** Il distintivo dello stato di una richiesta: rosso finché nessuno risponde. */
function distintivoStato(stato: Richiesta['stato']): HTMLElement {
  if (stato === 'nuova') return distintivo(t('richieste.statoNuova'), 'attenzione')
  if (stato === 'contattata') return distintivo(t('richieste.statoContattata'), 'vivo')
  return distintivo(t('richieste.statoChiusa'), 'spento')
}

/** Richiamo o preventivo: dice da quale modulo del sito è arrivata. */
function distintivoTipo(tipo: Richiesta['tipo']): HTMLElement {
  return distintivo(tipo === 'preventivo' ? t('richieste.tipoPreventivo') : t('richieste.tipoRichiamo'), 'neutro')
}

/**
 * Una riga della lista delle richieste, tutta cliccabile. Sotto il nome ci
 * sono comune, servizio e da quanto aspetta: per chi deve richiamare, il
 * tempo passato conta più della data.
 */
function voceRichiesta(r: Richiesta): HTMLElement {
  const nome = r.nome.trim() || t('richieste.senzaNome')
  const sotto = [r.comune, r.servizio, tempoFa(r.creato)]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
    .join(PUNTO)

  const testo = el('span', { class: 'adm-voce-testo' }, [
    el('span', { class: 'adm-voce-titolo' }, nome),
    sotto ? el('span', { class: 'adm-voce-sotto' }, sotto) : null,
  ])
  // Il testo prende tutto lo spazio fra il tondo e i distintivi: senza, la
  // riga li sparpaglierebbe ai tre angoli.
  testo.style.flex = '1'

  // Il tondo riceve il nome grezzo, non quello di ripiego: chi non ha scritto
  // il nome ha un punto interrogativo, non le iniziali di "Senza nome".
  return el('a', { class: 'adm-voce', href: '/admin/richieste/' }, [
    avatar(r.nome.trim(), null, 38),
    testo,
    el('span', { class: 'adm-riga' }, [distintivoStato(r.stato), distintivoTipo(r.tipo)]),
  ])
}

/** La colonna larga: le ultime richieste arrivate, o la spiegazione di dove arriveranno. */
function cardRichieste(richieste: Richiesta[]): HTMLElement {
  const recenti = richieste.slice(0, QUANTI)
  return el('section', { class: 'adm-card' }, [
    titoletto(t('pannello.ultimeRichieste'), '/admin/richieste/', t('pannello.vediRichieste')),
    recenti.length === 0
      ? el('p', { class: 'adm-vuoto' }, t('pannello.nessunaRichiesta'))
      : el('div', { class: 'adm-elenco' }, recenti.map(voceRichiesta)),
  ])
}

/**
 * Una riga di "Il sito": il numero a sinistra, cosa conta accanto. Le due
 * classi nascono per stare una sotto l'altra e portano un margine sopra; in
 * fila quel margine le sfaserebbe, quindi qui si azzera. La larghezza minima
 * della cifra tiene le tre etichette incolonnate anche con un 12 e uno 0.
 */
function rigaSito(valore: number, etichetta: string): HTMLElement {
  const cifra = el('span', { class: 'adm-numero adm-numero-piccolo' }, numero(valore))
  cifra.style.margin = '0'
  cifra.style.minWidth = '2ch'
  const nome = el('span', { class: 'adm-nota' }, etichetta)
  nome.style.margin = '0'
  return el('div', { class: 'adm-riga' }, [cifra, nome])
}

/**
 * Cosa c'è sul sito adesso. Finché lavori o recensioni sono a zero il sito
 * mostra gli esempi scritti in fase di costruzione: lo si dice qui, perché è
 * la prima cosa da sistemare e da questa schermata non si vedrebbe.
 */
function cardSito(c: Contatori): HTMLElement {
  const esempi = c.recensioni <= 0 || c.lavori <= 0
  return el('section', { class: 'adm-card' }, [
    titoletto(t('pannello.ilSito')),
    el('div', { class: 'adm-pila' }, [
      el('div', { class: 'adm-elenco' }, [
        rigaSito(c.articoliPubblicati, t('pannello.articoliPubblicati')),
        rigaSito(c.recensioni, t('pannello.recensioniAttive')),
        rigaSito(c.lavori, t('pannello.cantieri')),
      ]),
      esempi ? fascia(t('pannello.esempiAttivi'), 'attenzione') : null,
    ]),
  ])
}

/**
 * Un pulsante chiaro a tutta larghezza. Il contenuto sta a sinistra, come in
 * un menu: sei pulsanti con il testo centrato e le icone a zig zag si
 * leggono peggio di una colonna allineata.
 */
function scorciatoia(href: string, simbolo: SVGElement, testo: string): HTMLElement {
  const a = el('a', { class: 'adm-btn adm-btn-chiaro adm-btn-largo', href }, [simbolo, el('span', undefined, testo)])
  a.style.justifyContent = 'flex-start'
  return a
}

/** Sei strade verso il resto del pannello, quelle che si prendono più spesso. */
function cardScorciatoie(): HTMLElement {
  // adm-riga è una fila che va a capo: con pulsanti a tutta larghezza ogni
  // pulsante occupa la sua riga e lo spazio fra l'uno e l'altro è il gap.
  const elenco = el('div', { class: 'adm-riga' }, [
    scorciatoia('/admin/blog/nuovo/', iconaMatita(17), t('pannello.scriviArticoli')),
    scorciatoia('/admin/lavori/#nuovo', iconaCantiere(17), t('pannello.aggiungiLavoro')),
    scorciatoia('/admin/recensioni/#nuova', iconaStella(17), t('pannello.aggiungiRecensione')),
    scorciatoia('/admin/link/', iconaLink(17), t('pannello.creaLink')),
    scorciatoia('/admin/statistiche/', iconaGrafico(17), t('pannello.vediTraffico')),
    scorciatoia('/admin/impostazioni/', iconaImpostazioni(17), t('pannello.cambiaDati')),
  ])
  return el('section', { class: 'adm-card' }, [titoletto(t('pannello.scorciatoie')), elenco])
}

/* --- TERZA FASCIA: ARTICOLI ----------------------------------------------- */

/** Una riga della lista degli ultimi articoli, tutta cliccabile. */
function voceArticolo(a: Articolo): HTMLElement {
  const quando = dataLeggibile(a.creato)
  // L'id arriva dal database: passa da encodeURIComponent, non si incolla.
  return el('a', { class: 'adm-voce', href: `/admin/blog/${encodeURIComponent(a.id)}/` }, [
    el('span', { class: 'adm-voce-testo' }, [
      el('span', { class: 'adm-voce-titolo' }, a.titolo.trim() || t('blog.nuovoTitolo')),
      quando ? el('span', { class: 'adm-voce-sotto' }, quando) : null,
    ]),
    a.bozza ? distintivo(t('blog.bozza'), 'neutro') : distintivo(t('blog.pubblicato'), 'vivo'),
  ])
}

/** Gli ultimi articoli scritti, o l'invito a scrivere il primo. */
function cardArticoli(articoli: Articolo[]): HTMLElement {
  const recenti = articoli.slice(0, QUANTI)
  return el('section', { class: 'adm-card' }, [
    titoletto(t('pannello.ultimiArticoli'), '/admin/blog/', t('blog.tuttiArticoli')),
    recenti.length === 0
      ? el('p', { class: 'adm-vuoto' }, t('pannello.nessunArticolo'))
      : el('div', { class: 'adm-elenco' }, recenti.map(voceArticolo)),
  ])
}

/* --- SCHERMATA ------------------------------------------------------------ */

/** Una card con dentro solo le righe grigie dell'attesa. */
function cardAttesa(righe: number): HTMLElement {
  return el('article', { class: 'adm-card' }, [scheletro(righe)])
}

/**
 * La forma della pagina prima dei dati: stesse griglie, stesse card, righe
 * grigie al posto dei numeri. Così quando i dati arrivano niente si sposta,
 * e chi apre il pannello capisce subito com'è fatto.
 */
function mostraAttesa(zona: HTMLElement): void {
  svuota(zona)
  zona.append(
    el('div', { class: 'adm-griglia-numeri' }, [cardAttesa(3), cardAttesa(3), cardAttesa(3), cardAttesa(4)]),
    el('div', { class: 'adm-pila' }, [
      el('div', { class: 'adm-due-terzi' }, [
        cardAttesa(6),
        el('div', { class: 'adm-pila' }, [cardAttesa(3), cardAttesa(5)]),
      ]),
      cardAttesa(5),
    ]),
  )
}

/** Riempie la zona sotto l'intestazione con i dati appena letti. */
function mostra(zona: HTMLElement, dati: Caricato): void {
  svuota(zona)

  const mese = cardMese(dati.trenta)

  zona.append(
    el('div', { class: 'adm-griglia-numeri' }, [
      cardRichiesteNuove(dati.contatori.richiesteNuove),
      cardTraffico(t('pannello.oggi'), dati.oggi),
      cardTraffico(t('pannello.setteGiorni'), dati.sette, true),
      mese.card,
    ]),
    el('div', { class: 'adm-pila' }, [
      el('div', { class: 'adm-due-terzi' }, [
        cardRichieste(dati.richieste),
        el('div', { class: 'adm-pila' }, [cardSito(dati.contatori), cardScorciatoie()]),
      ]),
      cardArticoli(dati.articoli),
    ]),
  )

  // Adesso la card sta nella pagina e il grafico può misurare la larghezza vera.
  disegnaGrafico(mese.tela, dati.trenta.serie, ALTEZZA_CURVA)
}

/**
 * Legge tutto e disegna. In caso di errore il pulsante richiama questa stessa
 * funzione: il tentativo è vero, non un ricaricamento della pagina.
 */
async function carica(zona: HTMLElement): Promise<void> {
  mostraAttesa(zona)

  try {
    // Le sei letture insieme: nessuna dipende dal risultato dell'altra.
    const [contatori, oggi, sette, trenta, richieste, articoli] = await Promise.all([
      leggiContatori(),
      leggiStatistiche(1),
      leggiStatistiche(7),
      leggiStatistiche(30),
      elencaRichieste(),
      elencaArticoli(),
    ])

    // Il telaio conta le richieste per conto suo all'apertura; qui il numero
    // è appena stato letto, e il pallino nel menu va d'accordo con la card.
    aggiornaPallino(contatori.richiesteNuove)

    mostra(zona, { contatori, oggi, sette, trenta, richieste, articoli })
  } catch (errore) {
    console.error('Pannello non caricato:', errore)
    statoErrore(zona, () => void carica(zona))
  }
}

export default function disegna(lavoro: HTMLElement): void {
  svuota(lavoro)

  const nuovo = el('a', { class: 'adm-btn', href: '/admin/blog/nuovo/' }, [
    iconaPiu(17),
    el('span', undefined, t('pannello.nuovoArticolo')),
  ])

  // L'intestazione resta ferma mentre i numeri caricano o falliscono: il
  // pulsante per scrivere un articolo nuovo non dipende dalle statistiche.
  intestazione(lavoro, saluto(), t('pannello.benvenuto'), nuovo, t('pannello.titolo'))

  const zona = el('div')
  lavoro.append(zona)

  void carica(zona)
}
