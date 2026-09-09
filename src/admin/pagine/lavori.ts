/**
 * =============================================================================
 *  LAVORI
 * =============================================================================
 *  I cantieri con la foto prima e dopo, così come compaiono sul sito: titolo,
 *  comune, due righe di descrizione, tempo di posa e materiali. Il sito parte
 *  con cinque esempi e lo dice; appena un cantiere vero è visibile, gli
 *  esempi lasciano il posto.
 *
 *  Una schermata sola con due facce: l'elenco a card e, al posto suo, il
 *  modulo di scrittura. Non si cambia pagina e non si ricarica: dopo un
 *  salvataggio l'elenco in memoria si aggiorna e si ridisegna, e la fascia
 *  "Pubblica" del telaio viene avvisata.
 *
 *  L'ordine è quello delle card: le frecce spostano di un posto e riscrivono
 *  il campo `ordine` di tutte, così il sito le mostra nello stesso ordine.
 *
 *  Tutto quello che compare in pagina lo scrive il cliente: entra solo come
 *  textContent, mai come markup. Le foto arrivano dal caricatore, che le
 *  riduce nel browser e le deposita prima che il cantiere venga salvato.
 * =============================================================================
 */

import { cancellaLavoro, elencaLavori, nuovoId, riordina, salvaLavoro, type Lavoro } from '../dati'
import {
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
  svuota,
  toast,
} from '../dom'
import {
  iconaAvviso,
  iconaCantiere,
  iconaCestino,
  iconaFrecciaIndietro,
  iconaGiu,
  iconaLuogo,
  iconaMatita,
  iconaPiu,
  iconaSalva,
  iconaSu,
} from '../icone'
import { t } from '../lingua'
import { intestazione, segnalaModifica } from '../telaio'

/* --- COSTANTI ------------------------------------------------------------- */

/** Lunghezze massime dei campi: un titolo sta su una riga, una descrizione su poche. */
const MASSIMO_TITOLO = 120
const MASSIMO_LOCALITA = 80
const MASSIMO_DURATA = 60
const MASSIMO_MATERIALI = 160
const MASSIMO_TESTO = 1500

/** Quante righe di descrizione si vedono nella card prima del taglio. */
const RIGHE_ANTEPRIMA = 3

/* --- AIUTI ---------------------------------------------------------------- */

/**
 * Assegna stili dal CSSOM, non con l'attributo style: la CSP del sito
 * rifiuta gli stili scritti come testo, mentre le proprietà impostate una a
 * una passano. Si usa solo per quello che nessuna classe di admin.css copre.
 */
function stile(nodo: HTMLElement, proprieta: Record<string, string>): void {
  for (const nome of Object.keys(proprieta)) nodo.style.setProperty(nome, proprieta[nome])
}

/**
 * Il testo di una card si ferma a tre righe: una descrizione lunga non deve
 * spingere in fondo tutte le altre. Nessuna classe copre il taglio a righe.
 */
function troncato(testo: string): HTMLElement {
  const p = el('p', undefined, testo)
  stile(p, {
    margin: '0',
    display: '-webkit-box',
    '-webkit-line-clamp': String(RIGHE_ANTEPRIMA),
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    'line-height': '1.55',
  })
  return p
}

/**
 * Una foto della coppia, oppure un riquadro color sabbia della stessa forma
 * quando manca: la card tiene la sua sagoma e si capisce subito cosa va
 * ancora caricato.
 */
function fotoOSegnaposto(url: string | null): HTMLElement {
  if (url) return el('img', { src: url, alt: '', loading: 'lazy', decoding: 'async' })
  const vuoto = el('div', { 'aria-hidden': 'true' })
  stile(vuoto, {
    display: 'block',
    width: '100%',
    'aspect-ratio': '1 / 1',
    'border-radius': '8px',
    background: 'var(--color-sabbia)',
  })
  return vuoto
}

/** La coppia prima/dopo di un cantiere, con le didascalie colorate. */
function coppiaDi(l: Lavoro): HTMLElement {
  return el('div', { class: 'adm-coppia' }, [
    el('figure', { class: 'adm-coppia-prima' }, [el('figcaption', undefined, t('lavori.prima')), fotoOSegnaposto(l.foto_prima)]),
    el('figure', { class: 'adm-coppia-dopo' }, [el('figcaption', undefined, t('lavori.dopo')), fotoOSegnaposto(l.foto_dopo)]),
  ])
}

/** Un dettaglio della card: etichetta piccola in maiuscoletto e il valore sotto. */
function dettaglio(etichetta: string, valore: string): HTMLElement {
  const testo = el('p', undefined, valore)
  stile(testo, { margin: '0.3rem 0 0', 'font-size': '0.9rem', 'line-height': '1.45' })
  return el('div', undefined, [el('p', { class: 'adm-etichetta' }, etichetta), testo])
}

/** L'ordine per un cantiere nuovo: dopo l'ultimo. */
function prossimoOrdine(elenco: Lavoro[]): number {
  let massimo = -1
  for (const l of elenco) {
    if (Number.isFinite(l.ordine) && l.ordine > massimo) massimo = l.ordine
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

/* --- SCHERMATA ------------------------------------------------------------ */

export default function disegna(lavoro: HTMLElement): void {
  svuota(lavoro)

  let lavori: Lavoro[] = []
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
  /* La lettura in corso: chi salva un cantiere nuovo la aspetta, per contare bene l'ordine. */
  let caricamento: Promise<void> = Promise.resolve()

  /* --- impalcatura, disegnata una volta sola ------------------------------ */

  const bNuovo = pulsante(iconaPiu(16), t('lavori.nuovo'), 'adm-btn', () => apriEditor(null))
  intestazione(lavoro, t('lavori.titolo'), t('lavori.sottotitolo'), bNuovo)

  const contenuto = el('div', { class: 'adm-pila adm-entra' })
  lavoro.append(contenuto)

  /* --- elenco ------------------------------------------------------------- */

  /** Due card grigie che pulsano: la pagina ha già la forma che avrà. */
  function scheletri(): HTMLElement {
    const pila = el('div', { class: 'adm-pila' })
    for (let i = 0; i < 2; i++) {
      pila.append(
        el('div', { class: 'adm-card' }, [
          el('div', { class: 'adm-due' }, [
            el('div', { class: 'adm-coppia' }, [scheletro(3), scheletro(3)]),
            scheletro(5),
          ]),
        ]),
      )
    }
    return pila
  }

  function cardDi(l: Lavoro, indice: number): HTMLElement {
    const bModifica = pulsante(iconaMatita(14), t('lavori.modifica'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', () =>
      apriEditor(l),
    )
    bModifica.disabled = inCorso

    const bSu = el(
      'button',
      {
        type: 'button',
        class: 'adm-btn adm-btn-nudo adm-btn-piccolo adm-btn-icona',
        'aria-label': t('lavori.su'),
        title: t('lavori.su'),
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
        class: 'adm-btn adm-btn-nudo adm-btn-piccolo adm-btn-icona',
        'aria-label': t('lavori.giu'),
        title: t('lavori.giu'),
        'data-verso': 'giu',
      },
      [iconaGiu(14)],
    )
    bGiu.disabled = inCorso || indice === lavori.length - 1
    bGiu.addEventListener('click', () => void sposta(indice, 1))

    const bCancella = pulsante(iconaCestino(14), t('lavori.cancella'), 'adm-btn adm-btn-pericolo adm-btn-piccolo', () =>
      void chiediCancella(l),
    )
    bCancella.disabled = inCorso

    const visibile = Boolean(l.visibile)
    const titolo = el('h2', { class: 'adm-titoletto' }, [
      el('span', undefined, l.titolo),
      distintivo(visibile ? t('lavori.visibile') : t('lavori.nascosto'), visibile ? 'vivo' : 'spento'),
    ])
    stile(titolo, { 'margin-bottom': '0' })

    const dove = l.localita
      ? el('span', { class: 'adm-voce-sotto adm-riga' }, [iconaLuogo(13), el('span', undefined, l.localita)])
      : null

    const dettagli =
      l.durata || l.materiali
        ? el('div', { class: 'adm-due' }, [
            l.durata ? dettaglio(t('lavori.campoDurata'), l.durata) : null,
            l.materiali ? dettaglio(t('lavori.campoMateriali'), l.materiali) : null,
          ])
        : null

    const azioni = el('div', { class: 'adm-riga' }, [bModifica, bSu, bGiu, el('span', { class: 'adm-spazio' }), bCancella])

    const scritte = el('div', { class: 'adm-pila' }, [
      el('div', undefined, [titolo, dove]),
      l.testo ? troncato(l.testo) : null,
      dettagli,
      azioni,
    ])
    stile(scritte, { gap: '0.9rem', 'align-content': 'start' })

    return el('article', { class: 'adm-card', 'data-id': l.id }, [el('div', { class: 'adm-due' }, [coppiaDi(l), scritte])])
  }

  function mostraLista(): void {
    vista = 'lista'
    bNuovo.hidden = false
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

    if (lavori.length === 0) {
      contenuto.append(
        el('div', { class: 'adm-card' }, [
          statoVuoto({
            icona: iconaCantiere(28),
            titolo: t('lavori.vuotoTitolo'),
            testo: t('lavori.vuotoTesto'),
            azione: pulsante(iconaPiu(16), t('lavori.nuovo'), 'adm-btn', () => apriEditor(null)),
          }),
        ]),
      )
      return
    }

    // Finché nessuno è visibile il sito mostra ancora gli esempi: lo si dice.
    if (!lavori.some((l) => l.visibile)) contenuto.append(fascia(t('lavori.esempiNota'), 'attenzione'))

    const pila = el('div', { class: 'adm-pila' })
    lavori.forEach((l, i) => pila.append(cardDi(l, i)))
    contenuto.append(pila)
  }

  /**
   * Dopo un riordino l'elenco si ridisegna e la freccia premuta non esiste
   * più: chi la usava con la tastiera la ritrova sulla stessa card, nella
   * sua posizione nuova. Se la card è arrivata in fondo o in cima, quella
   * freccia è spenta e il fuoco passa all'altra, per poter tornare indietro.
   */
  function rimettiFuoco(id: string, verso: -1 | 1): void {
    const card = contenuto.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)
    if (!card) return
    const stessa = card.querySelector<HTMLButtonElement>(verso < 0 ? '[data-verso="su"]' : '[data-verso="giu"]')
    const opposta = card.querySelector<HTMLButtonElement>(verso < 0 ? '[data-verso="giu"]' : '[data-verso="su"]')
    const freccia = stessa && !stessa.disabled ? stessa : opposta
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
      const letti = await elencaLavori()
      if (mio !== giro) return
      lavori = letti
      caricato = true
    } catch {
      if (mio !== giro) return
      erroreLettura = true
    }
    if (vista === 'lista') mostraLista()
  }

  async function sposta(indice: number, verso: -1 | 1): Promise<void> {
    const altro = indice + verso
    if (inCorso || altro < 0 || altro >= lavori.length) return

    const id = lavori[indice].id
    const prima = lavori
    const scambiati = lavori.slice()
    ;[scambiati[indice], scambiati[altro]] = [scambiati[altro], scambiati[indice]]
    // L'elenco cambia subito, prima della risposta: la card si muove sotto il dito.
    lavori = scambiati.map((l, i) => ({ ...l, ordine: i }))
    riprovaAzione = null
    inCorso = true
    mostraLista()

    try {
      await riordina(
        'lavori',
        lavori.map((l) => l.id),
      )
      segnalaModifica()
    } catch {
      lavori = prima
      riprovaAzione = () => void sposta(indice, verso)
    } finally {
      inCorso = false
      if (vista === 'lista') {
        mostraLista()
        rimettiFuoco(id, verso)
      }
    }
  }

  async function chiediCancella(l: Lavoro): Promise<void> {
    if (inCorso) return
    const ok = await conferma({
      titolo: t('lavori.confermaCancella'),
      testo: l.localita ? `${l.titolo}, ${l.localita}` : l.titolo,
      ok: t('lavori.cancella'),
      pericolo: true,
    })
    if (!ok) return
    await eseguiCancella(l)
  }

  async function eseguiCancella(l: Lavoro): Promise<void> {
    if (inCorso) return
    riprovaAzione = null
    inCorso = true
    mostraLista()
    try {
      await cancellaLavoro(l.id)
      lavori = lavori.filter((x) => x.id !== l.id)
      toast(t('comune.salvato'))
      segnalaModifica()
    } catch {
      riprovaAzione = () => void eseguiCancella(l)
    } finally {
      inCorso = false
      if (vista === 'lista') mostraLista()
    }
  }

  /* --- editor ------------------------------------------------------------- */

  function chiudiEditor(): void {
    // Aperto da /admin/lavori/#nuovo: senza pulire, un ricaricamento riaprirebbe il modulo vuoto.
    if (location.hash === '#nuovo') history.replaceState(null, '', location.pathname + location.search)
    mostraLista()
    bNuovo.focus()
  }

  function apriEditor(esistente: Lavoro | null): void {
    vista = 'editor'
    bNuovo.hidden = true
    svuota(contenuto)

    let fotoPrima: string | null = esistente?.foto_prima ?? null
    let fotoDopo: string | null = esistente?.foto_dopo ?? null
    let visibile = esistente ? Boolean(esistente.visibile) : true

    const indietro = el('a', { class: 'adm-indietro', href: '/admin/lavori/' }, [
      iconaFrecciaIndietro(14),
      el('span', undefined, t('comune.indietro')),
    ])
    indietro.addEventListener('click', (ev) => {
      ev.preventDefault()
      chiudiEditor()
    })

    const titolo = campo({
      id: 'lav-titolo',
      etichetta: t('lavori.campoTitolo'),
      valore: esistente?.titolo ?? '',
      segnaposto: t('lavori.segnapostoTitolo'),
      autocomplete: 'off',
      obbligatorio: true,
      massimo: MASSIMO_TITOLO,
    })
    const localita = campo({
      id: 'lav-localita',
      etichetta: t('lavori.campoLocalita'),
      valore: esistente?.localita ?? '',
      segnaposto: t('lavori.segnapostoLocalita'),
      autocomplete: 'off',
      massimo: MASSIMO_LOCALITA,
    })
    const durata = campo({
      id: 'lav-durata',
      etichetta: t('lavori.campoDurata'),
      valore: esistente?.durata ?? '',
      segnaposto: t('lavori.segnapostoDurata'),
      autocomplete: 'off',
      massimo: MASSIMO_DURATA,
    })
    const materiali = campo({
      id: 'lav-materiali',
      etichetta: t('lavori.campoMateriali'),
      valore: esistente?.materiali ?? '',
      segnaposto: t('lavori.segnapostoMateriali'),
      autocomplete: 'off',
      massimo: MASSIMO_MATERIALI,
    })
    const testo = campo({
      id: 'lav-testo',
      etichetta: t('lavori.campoTesto'),
      tipo: 'area',
      righe: 4,
      valore: esistente?.testo ?? '',
      segnaposto: t('lavori.segnapostoTesto'),
      massimo: MASSIMO_TESTO,
    })

    const caricatorePrima = caricatoreFoto({
      cartella: 'lavori',
      valore: fotoPrima,
      etichetta: t('lavori.prima'),
      testoCarica: t('lavori.caricaFoto'),
      forma: 'quadrata',
      alCambio: (url) => {
        fotoPrima = url
      },
    })
    const caricatoreDopo = caricatoreFoto({
      cartella: 'lavori',
      valore: fotoDopo,
      etichetta: t('lavori.dopo'),
      testoCarica: t('lavori.caricaFoto'),
      forma: 'quadrata',
      alCambio: (url) => {
        fotoDopo = url
      },
    })

    const stato = interruttore(
      visibile,
      t('lavori.visibile'),
      (acceso) => {
        visibile = acceso
      },
      t('lavori.nascosto'),
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
      el('span', undefined, t('lavori.salva')),
    ])
    const bAnnulla = bottone(t('comune.annulla'), 'adm-btn adm-btn-chiaro', chiudiEditor)

    const modulo = el('form', { class: 'adm-card', novalidate: true }, [
      el('h2', { class: 'adm-titoletto' }, esistente ? t('lavori.modificaTitolo') : t('lavori.nuovoTitolo')),
      el('div', { class: 'adm-pila' }, [
        el('div', { class: 'adm-campi-2' }, [titolo.blocco, localita.blocco, durata.blocco, materiali.blocco]),
        testo.blocco,
        el('div', { class: 'adm-coppia' }, [caricatorePrima.blocco, caricatoreDopo.blocco]),
        stato.blocco,
        avviso,
        el('div', { class: 'adm-riga' }, [bSalva, bAnnulla]),
      ]),
    ])

    async function salva(): Promise<void> {
      const titoloPulito = titolo.input.value.trim()
      if (!titoloPulito) {
        mostraAvviso(t('lavori.serveTitolo'))
        titolo.input.focus()
        return
      }
      // Una foto sta ancora salendo: salvare adesso la perderebbe.
      if (caricatorePrima.inAttesa() || caricatoreDopo.inAttesa()) {
        mostraAvviso(t('comune.caricamentoFoto'))
        return
      }
      if (!fotoPrima || !fotoDopo) {
        mostraAvviso(t('lavori.serveFoto'))
        return
      }

      nascondiAvviso()
      bSalva.disabled = true
      bAnnulla.disabled = true
      try {
        // Aperto da #nuovo mentre l'elenco sta ancora arrivando: l'ordine
        // "dopo l'ultimo" si calcola sull'elenco vero, non su quello vuoto.
        if (!esistente && !caricato && !erroreLettura) await caricamento

        const salvato = await salvaLavoro({
          id: esistente?.id ?? nuovoId(),
          titolo: titoloPulito,
          localita: localita.input.value.trim(),
          testo: testo.input.value.trim(),
          durata: durata.input.value.trim(),
          materiali: materiali.input.value.trim(),
          foto_prima: fotoPrima,
          foto_dopo: fotoDopo,
          visibile,
          ordine: esistente && Number.isFinite(esistente.ordine) ? esistente.ordine : prossimoOrdine(lavori),
          creato: esistente?.creato ?? '',
          aggiornato: '',
        })
        const i = lavori.findIndex((l) => l.id === salvato.id)
        if (i >= 0) lavori[i] = salvato
        else lavori.push(salvato)

        toast(t('comune.salvato'))
        segnalaModifica()
        chiudiEditor()
        // Modulo aperto da #nuovo con la lettura fallita: adesso l'elenco si rilegge.
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

    contenuto.append(el('div', { class: 'adm-entra' }, [indietro, modulo]))
    window.scrollTo(0, 0)
    if (conPuntatore()) titolo.input.focus()
  }

  /* --- avvio -------------------------------------------------------------- */

  // /admin/lavori/#nuovo apre subito il modulo vuoto, per i collegamenti dal pannello iniziale.
  if (location.hash === '#nuovo') apriEditor(null)
  void carica()
}
