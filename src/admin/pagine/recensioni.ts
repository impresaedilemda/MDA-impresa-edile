/**
 * =============================================================================
 *  RECENSIONI
 * =============================================================================
 *  Le parole dei clienti, così come le hanno scritte: nome, comune, stelle e
 *  una foto facoltativa. Il sito parte con qualche esempio e lo dice; appena
 *  una recensione vera è visibile, gli esempi lasciano il posto.
 *
 *  Una schermata sola con due facce: l'elenco a card e, al posto suo, il
 *  modulo di scrittura. Non si cambia pagina e non si ricarica: dopo un
 *  salvataggio l'elenco in memoria si aggiorna e si ridisegna, e la fascia
 *  "Pubblica" del telaio viene avvisata.
 *
 *  L'ordine è quello delle card: le frecce spostano di un posto e riscrivono
 *  il campo `ordine` di tutte, così il sito le mostra nello stesso ordine.
 *
 *  Tutto quello che compare in pagina lo scrive il cliente (o il suo
 *  cliente): entra solo come textContent, mai come markup.
 * =============================================================================
 */

import { cancellaRecensione, elencaRecensioni, nuovoId, riordina, salvaRecensione, type Recensione } from '../dati'
import {
  avatar,
  bottone,
  campo,
  caricatoreFoto,
  conferma,
  distintivo,
  el,
  fascia,
  interruttore,
  pulsante,
  scheletro,
  statoErrore,
  statoVuoto,
  stelle,
  svuota,
  toast,
} from '../dom'
import { iconaAvviso, iconaCestino, iconaGiu, iconaMatita, iconaPiu, iconaSalva, iconaStella, iconaSu } from '../icone'
import { t } from '../lingua'
import { intestazione, segnalaModifica } from '../telaio'

/* --- COSTANTI ------------------------------------------------------------- */

/** Voto di partenza per una recensione nuova: chi la copia qui è contento. */
const VOTO_PREDEFINITO = 5

/** Lunghezze massime dei campi: un nome non è un romanzo, una recensione nemmeno. */
const MASSIMO_NOME = 80
const MASSIMO_LOCALITA = 80
const MASSIMO_TESTO = 1500

/** Righe di testo che una card mostra prima di tagliare. */
const RIGHE_CARD = 4

/* --- AIUTI ---------------------------------------------------------------- */

/**
 * Ferma un paragrafo a poche righe: una recensione lunga non deve spingere
 * in fondo tutte le altre. Nessuna classe di admin.css copre il taglio a
 * righe, e si scrive sullo style dell'elemento e non nell'attributo: la CSP
 * di prova del sito vieta gli attributi style, le proprietà scritte dal
 * codice le lascia passare.
 */
function troncaRighe(paragrafo: HTMLElement, righe: number): void {
  paragrafo.style.margin = '0'
  paragrafo.style.display = '-webkit-box'
  paragrafo.style.setProperty('-webkit-line-clamp', String(righe))
  paragrafo.style.setProperty('-webkit-box-orient', 'vertical')
  paragrafo.style.overflow = 'hidden'
  paragrafo.style.lineHeight = '1.55'
}

/** Un voto sempre fra 1 e 5, anche se dal database arriva qualcosa di strano. */
function votoValido(valore: number): number {
  const n = Math.round(Number(valore))
  if (!Number.isFinite(n)) return VOTO_PREDEFINITO
  return Math.min(5, Math.max(1, n))
}

/** L'ordine per una recensione nuova: dopo l'ultima. */
function prossimoOrdine(elenco: Recensione[]): number {
  let massimo = -1
  for (const r of elenco) {
    if (Number.isFinite(r.ordine) && r.ordine > massimo) massimo = r.ordine
  }
  return massimo + 1
}

/** Sui telefoni il campo non si mette a fuoco da solo: aprirebbe la tastiera prima che si veda il modulo. */
function conPuntatore(): boolean {
  try {
    return window.matchMedia('(hover: hover)').matches
  } catch {
    return false
  }
}

/**
 * Cinque stelle da premere. La classe adm-stella-piena accende le prime N;
 * passando sopra con il mouse (o con il tab) si vede l'anteprima del voto,
 * e andando via si torna a quello scelto.
 */
function sceltaStelle(iniziale: number): { blocco: HTMLElement; voto: () => number } {
  let scelto = votoValido(iniziale)
  const bottoni: HTMLButtonElement[] = []

  const dipingi = (fino: number): void => {
    bottoni.forEach((b, i) => b.classList.toggle('adm-stella-piena', i < fino))
  }
  const segna = (): void => {
    bottoni.forEach((b, i) => b.setAttribute('aria-pressed', i + 1 === scelto ? 'true' : 'false'))
    dipingi(scelto)
  }

  const gruppo = el('div', { class: 'adm-scelta-stelle', role: 'group', 'aria-label': t('recensioni.campoVoto') })
  for (let n = 1; n <= 5; n++) {
    const b = el('button', { type: 'button', 'aria-label': `${n} ${t('recensioni.stelle')}` }, '★')
    b.addEventListener('click', () => {
      scelto = n
      segna()
    })
    b.addEventListener('mouseenter', () => dipingi(n))
    b.addEventListener('mouseleave', () => dipingi(scelto))
    b.addEventListener('focus', () => dipingi(n))
    b.addEventListener('blur', () => dipingi(scelto))
    bottoni.push(b)
    gruppo.append(b)
  }
  segna()

  const blocco = el('div', { class: 'adm-blocco-campo' }, [
    el('span', { class: 'adm-etichetta-campo' }, t('recensioni.campoVoto')),
    gruppo,
  ])
  return { blocco, voto: () => scelto }
}

/* --- SCHERMATA ------------------------------------------------------------ */

export default function disegna(lavoro: HTMLElement): void {
  svuota(lavoro)

  let recensioni: Recensione[] = []
  /* L'elenco è arrivato: senza, si mostrano gli scheletri. */
  let caricato = false
  /* La lettura è fallita: si mostra l'errore con il "riprova". */
  let erroreLettura = false
  /* Un riordino o una cancellazione in volo: i pulsanti delle card si spengono. */
  let inCorso = false
  /* Quale faccia è disegnata adesso. */
  let vista: 'lista' | 'editor' = 'lista'
  /* Una risposta lenta di una lettura vecchia non deve coprire quella nuova. */
  let giro = 0
  /* L'ultima azione fallita, da riproporre con il "riprova" in cima all'elenco. */
  let riprovaAzione: (() => void) | null = null
  /* La lettura in corso: chi salva una recensione nuova la aspetta, per contare bene l'ordine. */
  let caricamento: Promise<void> = Promise.resolve()

  /* --- impalcatura, disegnata una volta sola ------------------------------ */

  const bNuova = pulsante(iconaPiu(16), t('recensioni.nuova'), 'adm-btn', () => apriEditor(null))
  intestazione(lavoro, t('recensioni.titolo'), t('recensioni.sottotitolo'), bNuova)

  const contenuto = el('div', { class: 'adm-pila' })
  lavoro.append(el('div', { class: 'adm-pila adm-entra' }, [fascia(t('recensioni.googleNota'), 'info'), contenuto]))

  /* --- elenco ------------------------------------------------------------- */

  /** Due card grigie che pulsano: la pagina ha già la forma che avrà. */
  function scheletri(): HTMLElement {
    const griglia = el('div', { class: 'adm-due' })
    for (let i = 0; i < 2; i++) griglia.append(el('div', { class: 'adm-card adm-card-stretta' }, [scheletro(4)]))
    return griglia
  }

  function cardDi(r: Recensione, indice: number): HTMLElement {
    const bModifica = pulsante(iconaMatita(14), t('recensioni.modifica'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', () =>
      apriEditor(r),
    )
    bModifica.disabled = inCorso

    const bSu = el(
      'button',
      {
        type: 'button',
        class: 'adm-btn adm-btn-chiaro adm-btn-piccolo adm-btn-icona',
        'aria-label': t('recensioni.su'),
        title: t('recensioni.su'),
        'data-verso': 'su',
      },
      [iconaSu(14)],
    )
    bSu.disabled = inCorso || indice === 0
    bSu.addEventListener('click', () => void sposta(indice, -1))

    const bGiu = el(
      'button',
      {
        type: 'button',
        class: 'adm-btn adm-btn-chiaro adm-btn-piccolo adm-btn-icona',
        'aria-label': t('recensioni.giu'),
        title: t('recensioni.giu'),
        'data-verso': 'giu',
      },
      [iconaGiu(14)],
    )
    bGiu.disabled = inCorso || indice === recensioni.length - 1
    bGiu.addEventListener('click', () => void sposta(indice, 1))

    const bCancella = pulsante(iconaCestino(14), t('recensioni.cancella'), 'adm-btn adm-btn-pericolo adm-btn-piccolo', () =>
      void chiediCancella(r),
    )
    bCancella.disabled = inCorso

    const testa = el('div', { class: 'adm-riga' }, [
      avatar(r.nome, r.foto, 44),
      el('div', { class: 'adm-voce-testo adm-spazio' }, [
        el('span', { class: 'adm-voce-titolo' }, r.nome),
        r.localita ? el('span', { class: 'adm-voce-sotto' }, r.localita) : null,
      ]),
      stelle(votoValido(r.voto), 15),
    ])

    const testo = el('p', undefined, r.testo)
    troncaRighe(testo, RIGHE_CARD)

    const piede = el('div', { class: 'adm-riga' }, [
      distintivo(r.visibile ? t('recensioni.visibile') : t('recensioni.nascosta'), r.visibile ? 'vivo' : 'spento'),
      el('span', { class: 'adm-spazio' }),
      bModifica,
      bSu,
      bGiu,
      bCancella,
    ])

    return el('article', { class: 'adm-card adm-card-stretta adm-pila', 'data-id': r.id }, [testa, testo, piede])
  }

  function mostraLista(): void {
    vista = 'lista'
    bNuova.hidden = false
    svuota(contenuto)

    if (erroreLettura) {
      statoErrore(contenuto, () => void carica())
      return
    }
    if (!caricato) {
      contenuto.append(scheletri())
      return
    }

    if (riprovaAzione) {
      const zona = el('div')
      statoErrore(zona, riprovaAzione)
      contenuto.append(zona)
    }

    if (recensioni.length === 0) {
      contenuto.append(
        el('div', { class: 'adm-card' }, [
          statoVuoto({
            icona: iconaStella(28),
            titolo: t('recensioni.vuotoTitolo'),
            testo: t('recensioni.vuotoTesto'),
            azione: pulsante(iconaPiu(16), t('recensioni.nuova'), 'adm-btn', () => apriEditor(null)),
          }),
        ]),
      )
      return
    }

    // Finché nessuna è visibile il sito mostra ancora gli esempi: lo si dice.
    if (!recensioni.some((r) => r.visibile)) contenuto.append(fascia(t('recensioni.esempiNota'), 'attenzione'))

    const griglia = el('div', { class: 'adm-due' })
    recensioni.forEach((r, i) => griglia.append(cardDi(r, i)))
    contenuto.append(griglia)
  }

  /**
   * Dopo un riordino l'elenco si ridisegna e la freccia premuta non esiste
   * più: chi la usava con la tastiera la ritrova sulla stessa card, nella
   * sua posizione nuova.
   */
  function rimettiFuoco(id: string, verso: -1 | 1): void {
    const card = contenuto.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)
    const freccia = card?.querySelector<HTMLButtonElement>(verso < 0 ? '[data-verso="su"]' : '[data-verso="giu"]')
    if (freccia && !freccia.disabled) freccia.focus()
  }

  /* --- dati --------------------------------------------------------------- */

  /** Legge l'elenco e lo tiene a portata di chi deve aspettarlo. Non lancia mai: l'errore resta nello stato. */
  function carica(): Promise<void> {
    caricamento = leggiElenco()
    return caricamento
  }

  async function leggiElenco(): Promise<void> {
    const mio = ++giro
    caricato = false
    erroreLettura = false
    if (vista === 'lista') mostraLista()
    try {
      const lette = await elencaRecensioni()
      if (mio !== giro) return
      recensioni = lette
      caricato = true
    } catch {
      if (mio !== giro) return
      erroreLettura = true
    }
    if (vista === 'lista') mostraLista()
  }

  async function sposta(indice: number, verso: -1 | 1): Promise<void> {
    const altro = indice + verso
    if (inCorso || altro < 0 || altro >= recensioni.length) return

    const id = recensioni[indice].id
    const prima = recensioni
    const scambiate = recensioni.slice()
    ;[scambiate[indice], scambiate[altro]] = [scambiate[altro], scambiate[indice]]
    // L'elenco cambia subito, prima della risposta: la card si muove sotto il dito.
    recensioni = scambiate.map((r, i) => ({ ...r, ordine: i }))
    riprovaAzione = null
    inCorso = true
    mostraLista()

    try {
      await riordina(
        'recensioni',
        recensioni.map((r) => r.id),
      )
      segnalaModifica()
    } catch {
      recensioni = prima
      riprovaAzione = () => void sposta(indice, verso)
    } finally {
      inCorso = false
      if (vista === 'lista') {
        mostraLista()
        rimettiFuoco(id, verso)
      }
    }
  }

  async function chiediCancella(r: Recensione): Promise<void> {
    if (inCorso) return
    const ok = await conferma({
      titolo: t('recensioni.confermaCancella'),
      testo: r.localita ? `${r.nome}, ${r.localita}` : r.nome,
      ok: t('recensioni.cancella'),
      pericolo: true,
    })
    if (!ok) return
    await eseguiCancella(r)
  }

  async function eseguiCancella(r: Recensione): Promise<void> {
    if (inCorso) return
    riprovaAzione = null
    inCorso = true
    mostraLista()
    try {
      await cancellaRecensione(r.id)
      recensioni = recensioni.filter((x) => x.id !== r.id)
      toast(t('comune.salvato'))
      segnalaModifica()
    } catch {
      riprovaAzione = () => void eseguiCancella(r)
    } finally {
      inCorso = false
      if (vista === 'lista') mostraLista()
    }
  }

  /* --- editor ------------------------------------------------------------- */

  function chiudiEditor(): void {
    // Aperto da /admin/recensioni/#nuova: senza pulire, un ricaricamento riaprirebbe il modulo vuoto.
    if (location.hash === '#nuova') history.replaceState(null, '', location.pathname + location.search)
    mostraLista()
    bNuova.focus()
  }

  function apriEditor(esistente: Recensione | null): void {
    vista = 'editor'
    bNuova.hidden = true
    svuota(contenuto)

    let foto: string | null = esistente?.foto ?? null
    let visibile = esistente ? esistente.visibile : true

    const caricatore = caricatoreFoto({
      cartella: 'recensioni',
      valore: foto,
      etichetta: t('recensioni.campoFoto'),
      testoCarica: t('recensioni.caricaFoto'),
      testoTogli: t('recensioni.togliFoto'),
      aiuto: t('recensioni.fotoNota'),
      forma: 'tonda',
      alCambio: (url) => {
        foto = url
      },
    })

    const nome = campo({
      id: 'rec-nome',
      etichetta: t('recensioni.campoNome'),
      valore: esistente?.nome ?? '',
      segnaposto: t('recensioni.segnapostoNome'),
      autocomplete: 'off',
      massimo: MASSIMO_NOME,
    })
    const localita = campo({
      id: 'rec-localita',
      etichetta: t('recensioni.campoLocalita'),
      valore: esistente?.localita ?? '',
      segnaposto: t('recensioni.segnapostoLocalita'),
      autocomplete: 'off',
      massimo: MASSIMO_LOCALITA,
    })
    const testo = campo({
      id: 'rec-testo',
      etichetta: t('recensioni.campoTesto'),
      tipo: 'area',
      righe: 5,
      valore: esistente?.testo ?? '',
      segnaposto: t('recensioni.segnapostoTesto'),
      massimo: MASSIMO_TESTO,
    })
    const voto = sceltaStelle(esistente ? esistente.voto : VOTO_PREDEFINITO)
    const stato = interruttore(
      visibile,
      t('recensioni.visibile'),
      (acceso) => {
        visibile = acceso
      },
      t('recensioni.nascosta'),
    )

    /* L'errore resta in pagina finché non si salva davvero. */
    const avviso = el('div', { class: 'adm-errore', role: 'alert', hidden: true })
    const mostraAvviso = (messaggio: string): void => {
      svuota(avviso)
      avviso.append(iconaAvviso(18), el('div', undefined, [el('p', undefined, messaggio)]))
      avviso.hidden = false
    }
    const nascondiAvviso = (): void => {
      svuota(avviso)
      avviso.hidden = true
    }

    const bSalva = el('button', { type: 'submit', class: 'adm-btn' }, [
      iconaSalva(16),
      el('span', undefined, t('recensioni.salva')),
    ])
    const bAnnulla = bottone(t('comune.annulla'), 'adm-btn adm-btn-chiaro', chiudiEditor)

    const modulo = el('form', { class: 'adm-card adm-entra', novalidate: true }, [
      el('h2', { class: 'adm-titoletto' }, esistente ? t('recensioni.modificaTitolo') : t('recensioni.nuovaTitolo')),
      el('div', { class: 'adm-pila' }, [
        caricatore.blocco,
        el('div', { class: 'adm-campi-2' }, [nome.blocco, localita.blocco]),
        testo.blocco,
        voto.blocco,
        stato.blocco,
        avviso,
        el('div', { class: 'adm-riga' }, [bSalva, bAnnulla]),
      ]),
    ])

    async function salva(): Promise<void> {
      const nomePulito = nome.input.value.trim()
      const testoPulito = testo.input.value.trim()
      if (!nomePulito || !testoPulito) {
        mostraAvviso(t('recensioni.serveTesto'))
        ;(nomePulito ? testo.input : nome.input).focus()
        return
      }
      // La foto sta ancora salendo: salvare adesso la perderebbe.
      if (caricatore.inAttesa()) {
        mostraAvviso(t('comune.caricamentoFoto'))
        return
      }

      nascondiAvviso()
      bSalva.disabled = true
      bAnnulla.disabled = true
      try {
        // Aperto da #nuova mentre l'elenco sta ancora arrivando: l'ordine
        // "dopo l'ultima" si calcola sull'elenco vero, non su quello vuoto.
        if (!esistente && !caricato && !erroreLettura) await caricamento

        const salvata = await salvaRecensione({
          id: esistente?.id ?? nuovoId(),
          nome: nomePulito,
          localita: localita.input.value.trim(),
          testo: testoPulito,
          voto: voto.voto(),
          foto,
          visibile,
          ordine: esistente && Number.isFinite(esistente.ordine) ? esistente.ordine : prossimoOrdine(recensioni),
          creato: esistente?.creato ?? '',
          aggiornato: '',
        })
        const i = recensioni.findIndex((r) => r.id === salvata.id)
        if (i >= 0) recensioni[i] = salvata
        else recensioni.push(salvata)

        toast(t('comune.salvato'))
        segnalaModifica()
        chiudiEditor()
        // Modulo aperto da #nuova con la lettura fallita: adesso l'elenco si rilegge.
        if (!caricato) void carica()
      } catch (errore) {
        mostraAvviso(errore instanceof Error && errore.message ? errore.message : t('comune.errore'))
        bSalva.disabled = false
        bAnnulla.disabled = false
      }
    }

    modulo.addEventListener('submit', (ev) => {
      ev.preventDefault()
      void salva()
    })

    contenuto.append(modulo)
    window.scrollTo(0, 0)
    if (conPuntatore()) nome.input.focus()
  }

  /* --- avvio -------------------------------------------------------------- */

  // /admin/recensioni/#nuova apre subito il modulo vuoto, per i collegamenti dal pannello iniziale.
  if (location.hash === '#nuova') apriEditor(null)
  void carica()
}
