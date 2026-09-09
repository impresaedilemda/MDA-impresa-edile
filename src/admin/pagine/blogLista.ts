/**
 * =============================================================================
 *  BLOG, ELENCO DEGLI ARTICOLI
 * =============================================================================
 *  La prima cosa che il cliente vede quando entra nel blog: cosa è già scritto,
 *  cosa è ancora in bozza, quando lo ha toccato l'ultima volta.
 *
 *  Una card per articolo, non una tabella: il pannello si apre dal telefono, e
 *  una tabella a quattro colonne su uno schermo stretto o scorre di lato o si
 *  schiaccia. Le card stanno in una colonna sola e i pulsanti restano grandi
 *  abbastanza per un dito.
 *
 *  Ogni card porta alla pagina di modifica con un link normale, perché ogni
 *  sezione del pannello è una pagina Astro a sé: niente router lato client.
 *  Dopo una cancellazione l'elenco in memoria si aggiorna e si ridisegna, e la
 *  fascia "Pubblica" del telaio viene avvisata.
 *
 *  Titolo, introduzione e testo li scrive il cliente, quindi entrano nella
 *  pagina solo come testo: qui non si costruisce nessun pezzo di HTML da una
 *  stringa.
 * =============================================================================
 */

import { cancellaArticolo, elencaArticoli, type Articolo } from '../dati'
import { conferma, distintivo, el, pulsante, scheletro, statoErrore, statoVuoto, svuota, toast } from '../dom'
import { iconaBlog, iconaCestino, iconaEsterno, iconaMatita, iconaPiu } from '../icone'
import { dataBreve, t } from '../lingua'
import { intestazione, segnalaModifica } from '../telaio'
import { testoSemplice } from '../../lib/testo'

/* --- COSTANTI ------------------------------------------------------------- */

/** Quante card di attesa mostrare mentre arrivano i dati. */
const SCHELETRI = 3

/** Lato della miniatura, in pixel: abbastanza per riconoscere la foto, non di più. */
const LATO_MINIATURA = 72

/** Caratteri dell'introduzione mostrati nella card prima dei puntini. */
const MASSIMO_ESTRATTO = 150

/**
 * La miniatura è quadrata e con gli angoli smussati, che ci sia la foto o il
 * riquadro vuoto al suo posto. Nessuna classe di admin.css copre questa
 * misura, e adm-avatar da solo la farebbe tonda.
 */
const STILE_MINIATURA: Record<string, string> = {
  width: `${LATO_MINIATURA}px`,
  height: `${LATO_MINIATURA}px`,
  'flex-shrink': '0',
  'object-fit': 'cover',
  'border-radius': 'var(--adm-raggio-piccolo)',
}

/* --- AIUTI ---------------------------------------------------------------- */

/**
 * Assegna stili dal CSSOM, non con l'attributo style: la CSP del sito sta
 * provando style-src-attr 'none', e le proprietà impostate una a una dal
 * codice non passano da quella regola. Si usa solo per quello che nessuna
 * classe di admin.css copre.
 */
function stile(nodo: HTMLElement, proprieta: Record<string, string>): void {
  for (const nome of Object.keys(proprieta)) nodo.style.setProperty(nome, proprieta[nome])
}

function indirizzoModifica(id: string): string {
  return `/admin/blog/${encodeURIComponent(id)}/`
}

function indirizzoPubblico(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}/`
}

/** Il link per scrivere un articolo nuovo, vestito da pulsante principale. */
function linkNuovo(): HTMLElement {
  return el('a', { class: 'adm-btn', href: '/admin/blog/nuovo/' }, [iconaPiu(16), el('span', undefined, t('blog.nuovo'))])
}

/** La miniatura della copertina, o un riquadro con l'icona del blog se manca. */
function miniatura(a: Articolo): HTMLElement {
  const nodo = a.copertina
    ? el('img', { src: a.copertina, alt: '', loading: 'lazy', decoding: 'async' })
    : el('span', { class: 'adm-avatar', 'aria-hidden': 'true' }, [iconaBlog(24)])
  stile(nodo, STILE_MINIATURA)
  return nodo
}

/** Le prime righe dell'articolo: l'introduzione, o il testo se l'introduzione manca. */
function anteprimaTesto(a: Articolo): string {
  return testoSemplice(a.estratto, MASSIMO_ESTRATTO) || testoSemplice(a.contenuto, MASSIMO_ESTRATTO)
}

/* --- SCHERMATA ------------------------------------------------------------ */

export default function disegna(lavoro: HTMLElement): void {
  svuota(lavoro)

  let articoli: Articolo[] = []
  /* L'elenco è arrivato: senza, si mostrano gli scheletri. */
  let caricato = false
  /* La lettura è fallita: si mostra l'errore con il "riprova". */
  let erroreLettura = false
  /* L'articolo in cancellazione: i pulsanti si spengono finché non risponde. */
  let inCancellazione: string | null = null
  /* Una risposta lenta di una lettura vecchia non deve coprire quella nuova. */
  let giro = 0
  /* L'ultima cancellazione fallita, da riproporre con il "riprova" in cima. */
  let riprovaAzione: (() => void) | null = null

  /* --- impalcatura, disegnata una volta sola ------------------------------ */

  intestazione(lavoro, t('blog.titolo'), t('blog.sottotitolo'), linkNuovo())

  const contenuto = el('div', { class: 'adm-pila adm-entra' })
  lavoro.append(contenuto)

  /* --- elenco ------------------------------------------------------------- */

  /** Card grigie che pulsano: la pagina ha già la forma che avrà. */
  function scheletri(): HTMLElement[] {
    const lista: HTMLElement[] = []
    for (let i = 0; i < SCHELETRI; i++) lista.push(el('div', { class: 'adm-card adm-card-stretta' }, [scheletro(3)]))
    return lista
  }

  function cardDi(a: Articolo): HTMLElement {
    const occupata = inCancellazione !== null

    // Il titolo è un collegamento ma deve leggersi come un titolo: niente blu, niente sottolineatura.
    const titolo = el('a', { class: 'adm-voce-titolo', href: indirizzoModifica(a.id) }, a.titolo || t('blog.nuovoTitolo'))
    stile(titolo, { color: 'inherit', 'text-decoration': 'none' })

    const riga = el('div', { class: 'adm-riga' }, [
      distintivo(a.bozza ? t('blog.bozza') : t('blog.pubblicato'), a.bozza ? 'neutro' : 'vivo'),
      el('span', { class: 'adm-voce-sotto' }, dataBreve(a.aggiornato)),
    ])
    stile(riga, { 'margin-top': '0.3rem' })

    const estratto = anteprimaTesto(a)
    let paragrafoEstratto: HTMLElement | null = null
    if (estratto) {
      paragrafoEstratto = el('p', { class: 'adm-voce-sotto' }, estratto)
      // un <p> porta il suo margine sotto: dentro la card lascerebbe un buco prima dei pulsanti
      stile(paragrafoEstratto, { 'margin-bottom': '0' })
    }

    const testo = el('div', { class: 'adm-voce-testo adm-spazio' }, [titolo, riga, paragrafoEstratto])

    const bModifica = el('a', { class: 'adm-btn adm-btn-chiaro adm-btn-piccolo', href: indirizzoModifica(a.id) }, [
      iconaMatita(14),
      el('span', undefined, t('blog.modifica')),
    ])

    // Il collegamento al sito ha senso solo per quello che sul sito c'è davvero.
    const bVedi =
      a.bozza || !a.slug
        ? null
        : el(
            'a',
            {
              class: 'adm-btn adm-btn-chiaro adm-btn-piccolo',
              href: indirizzoPubblico(a.slug),
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            [iconaEsterno(14), el('span', undefined, t('blog.vediSulSito'))],
          )

    const bCancella = pulsante(iconaCestino(14), t('blog.cancella'), 'adm-btn adm-btn-pericolo adm-btn-piccolo', () =>
      void chiediCancella(a),
    )
    bCancella.disabled = occupata

    const testa = el('div', { class: 'adm-riga' }, [miniatura(a), testo])
    const piede = el('div', { class: 'adm-riga' }, [bModifica, bVedi, el('span', { class: 'adm-spazio' }), bCancella])

    return el('article', { class: 'adm-card adm-card-stretta adm-pila', 'data-id': a.id }, [testa, piede])
  }

  function mostraLista(): void {
    svuota(contenuto)

    if (erroreLettura) {
      statoErrore(contenuto, () => void carica())
      return
    }
    if (!caricato) {
      contenuto.append(...scheletri())
      return
    }

    if (riprovaAzione) {
      const zona = el('div')
      statoErrore(zona, riprovaAzione)
      contenuto.append(zona)
    }

    if (articoli.length === 0) {
      contenuto.append(
        el('div', { class: 'adm-card' }, [
          statoVuoto({
            icona: iconaBlog(28),
            titolo: t('blog.vuoto'),
            testo: t('blog.vuotoTesto'),
            azione: linkNuovo(),
          }),
        ]),
      )
      return
    }

    for (const a of articoli) contenuto.append(cardDi(a))
  }

  /* --- dati --------------------------------------------------------------- */

  async function carica(): Promise<void> {
    const mio = ++giro
    caricato = false
    erroreLettura = false
    mostraLista()
    try {
      const letti = await elencaArticoli()
      if (mio !== giro) return
      articoli = letti
      caricato = true
    } catch {
      if (mio !== giro) return
      erroreLettura = true
    }
    mostraLista()
  }

  async function chiediCancella(a: Articolo): Promise<void> {
    if (inCancellazione) return
    const ok = await conferma({
      titolo: t('blog.confermaCancella'),
      testo: a.titolo,
      ok: t('blog.cancella'),
      pericolo: true,
    })
    if (!ok) return
    await eseguiCancella(a)
  }

  async function eseguiCancella(a: Articolo): Promise<void> {
    if (inCancellazione) return
    riprovaAzione = null
    inCancellazione = a.id
    mostraLista()
    try {
      await cancellaArticolo(a.id)
      // la lista si aggiorna qui, senza ricaricare la pagina
      articoli = articoli.filter((x) => x.id !== a.id)
      toast(t('comune.salvato'))
      segnalaModifica()
    } catch {
      riprovaAzione = () => void eseguiCancella(a)
    } finally {
      inCancellazione = null
      mostraLista()
    }
  }

  void carica()
}
