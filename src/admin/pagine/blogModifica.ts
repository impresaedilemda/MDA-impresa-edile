/**
 * =============================================================================
 *  BLOG, SCRITTURA E MODIFICA DI UN ARTICOLO
 * =============================================================================
 *  La pagina dove il cliente passa più tempo, quindi quella che deve dare meno
 *  fastidio: a sinistra si scrive, a destra si vede subito come verrà.
 *
 *  Quattro scelte che vale la pena spiegare:
 *
 *  1. Lo slug segue il titolo finché nessuno lo tocca a mano. Appena viene
 *     scritto a mano, o appena l'articolo è stato salvato una volta, resta
 *     fermo: l'indirizzo di un articolo già pubblicato non si cambia da solo.
 *     Prima di salvare si controlla che nessun altro articolo lo usi già.
 *  2. L'anteprima la disegna src/lib/testo-dom.ts, con la stessa grammatica
 *     che usa il sito quando viene generato: quello che si vede qui è quello
 *     che uscirà. Elementi veri, mai HTML incollato: il testo arriva da un
 *     campo, e una stringa infilata nel DOM basterebbe a far girare codice
 *     altrui nel pannello.
 *  3. Le foto non si incollano come indirizzi: si scelgono dal telefono, il
 *     browser le riduce e le carica nel deposito (vedi caricaImmagine), e nel
 *     testo finisce solo l'indirizzo pubblico.
 *  4. Finché ci sono modifiche non salvate il browser chiede conferma prima di
 *     chiudere. Chi scrive un articolo in cantiere non lo riscrive due volte.
 * =============================================================================
 */

import { caricaImmagine, leggiArticolo, nuovoId, salvaArticolo, slugDa, slugOccupato, type Articolo } from '../dati'
import {
  campo,
  caricatoreFoto,
  chiedi,
  distintivo,
  el,
  interruttore,
  pulsante,
  statoCaricamento,
  statoErrore,
  svuota,
  toast,
} from '../dom'
import {
  iconaAvviso,
  iconaCollegamento,
  iconaCorsivo,
  iconaElenco,
  iconaEsterno,
  iconaFrecciaIndietro,
  iconaGrassetto,
  iconaImmagine,
  iconaSalva,
  iconaTitolo,
} from '../icone'
import { numero, t } from '../lingua'
import { segnalaModifica } from '../telaio'
import { tempoLettura, testoSemplice } from '../../lib/testo'
import { disegnaTesto } from '../../lib/testo-dom'

/* --- COSTANTI ------------------------------------------------------------- */

/** Lunghezze massime: un titolo non è un paragrafo, un'introduzione nemmeno. */
const MASSIMO_TITOLO = 140
const MASSIMO_SLUG = 80
const MASSIMO_ESTRATTO = 320

/** Oltre questa misura la foto non si prova nemmeno a leggere. */
const PESO_MASSIMO_FOTO = 20 * 1024 * 1024

/**
 * Gli stili che nessuna classe di admin.css copre: l'altezza del campo del
 * testo, l'anteprima che resta ferma mentre a sinistra si scorre, il titolo
 * dell'anteprima con la misura di un titolo vero, e i piccoli distacchi
 * attorno alla barra degli strumenti e alla nota dell'interruttore.
 *
 * Si assegnano dal CSSOM, proprietà per proprietà, e non con un attributo
 * style: la CSP del sito sta provando style-src-attr 'none', e le proprietà
 * impostate dal codice non passano da quella regola.
 */
const STILE_CONTENUTO: Record<string, string> = { 'min-height': '420px', resize: 'vertical', 'line-height': '1.6' }
const STILE_BARRA: Record<string, string> = { margin: '0 0 0.65rem' }
const STILE_ANTEPRIMA: Record<string, string> = { position: 'sticky', top: '1rem', 'align-self': 'start' }
const STILE_TITOLO_ANTEPRIMA: Record<string, string> = {
  margin: '0 0 0.6rem',
  'font-family': 'var(--font-display)',
  'font-size': '1.65rem',
  'font-weight': '400',
  'line-height': '1.15',
}
const STILE_ESTRATTO_ANTEPRIMA: Record<string, string> = { margin: '0 0 1.15rem', color: 'var(--adm-testo-2)' }
const STILE_NOTA_STATO: Record<string, string> = { 'max-width': '30ch', margin: '0.25rem 0 0' }

/* --- AIUTI ---------------------------------------------------------------- */

/** Applica le proprietà una a una dal CSSOM: vedi la nota sopra le costanti. */
function stile<T extends HTMLElement>(nodo: T, proprieta: Record<string, string>): T {
  for (const nome of Object.keys(proprieta)) nodo.style.setProperty(nome, proprieta[nome])
  return nodo
}

function indirizzoModifica(id: string): string {
  return `/admin/blog/${encodeURIComponent(id)}/`
}

function indirizzoPubblico(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}/`
}

/** Quante parole ha il testo, contate come le conta tempoLettura. */
function contaParole(sorgente: string): number {
  return testoSemplice(sorgente).split(' ').filter(Boolean).length
}

/** Un pulsante della barra: solo l'icona, con il nome per chi passa sopra o ascolta. */
function strumento(etichetta: string, segno: SVGElement, azione: () => void): HTMLButtonElement {
  const b = el('button', { type: 'button', title: etichetta, 'aria-label': etichetta }, [segno])
  b.addEventListener('click', azione)
  return b
}

/* --- SCHERMATA ------------------------------------------------------------ */

export default function disegna(lavoro: HTMLElement, id: string | null): void {
  /** Schermo di errore con un pulsante che ritenta davvero. */
  function mostraErroreLettura(): void {
    statoErrore(lavoro, () => void apri())
  }

  async function apri(): Promise<void> {
    if (!id) {
      svuota(lavoro)
      costruisci(null)
      return
    }

    statoCaricamento(lavoro, 6)
    try {
      const articolo = await leggiArticolo(id)
      if (!articolo) {
        mostraErroreLettura()
        return
      }
      svuota(lavoro)
      costruisci(articolo)
    } catch {
      mostraErroreLettura()
    }
  }

  /* --- EDITORE ------------------------------------------------------------ */

  function costruisci(articolo: Articolo | null): void {
    // id vero dell'articolo: arriva dal database, oppure nasce al primo salvataggio
    let idAttuale: string | null = articolo ? articolo.id : null
    let copertina: string | null = articolo ? articolo.copertina : null
    let bozza = articolo ? articolo.bozza : true
    let creato = articolo ? articolo.creato : ''
    // finché resta falso, lo slug continua a seguire il titolo
    let slugToccato = Boolean(articolo && articolo.slug)
    // com'è l'articolo sul database: il link "Vedi sul sito" segue questo, non l'interruttore
    let slugSalvato = articolo ? articolo.slug : ''
    let pubblicatoSalvato = articolo ? !articolo.bozza : false

    let inSalvataggio = false
    let modificheNonSalvate = false

    /* --- PROTEZIONE DEL LAVORO -------------------------------------------- */

    function avvisaUscita(evento: BeforeUnloadEvent): void {
      evento.preventDefault()
      // i browser moderni mostrano un testo loro, ma vogliono comunque questo
      evento.returnValue = ''
    }

    function segnaNonSalvato(): void {
      if (modificheNonSalvate) return
      modificheNonSalvate = true
      window.addEventListener('beforeunload', avvisaUscita)
    }

    function togliAvviso(): void {
      if (!modificheNonSalvate) return
      modificheNonSalvate = false
      window.removeEventListener('beforeunload', avvisaUscita)
    }

    /* --- TESTATA ----------------------------------------------------------- */

    const indietro = el('a', { class: 'adm-indietro', href: '/admin/blog/' }, [
      iconaFrecciaIndietro(15),
      el('span', undefined, t('blog.tuttiArticoli')),
    ])

    const titoloPagina = el('h1', { class: 'adm-titolo' }, articolo ? t('blog.modificaTitolo') : t('blog.nuovoTitolo'))

    const bVedi = el('a', { class: 'adm-btn adm-btn-chiaro', target: '_blank', rel: 'noopener noreferrer' }, [
      iconaEsterno(15),
      el('span', undefined, t('blog.vediSulSito')),
    ])

    /** Il collegamento al sito compare solo per un articolo salvato e pubblicato. */
    function aggiornaVedi(): void {
      const visibile = pubblicatoSalvato && Boolean(slugSalvato)
      bVedi.hidden = !visibile
      if (visibile) bVedi.href = indirizzoPubblico(slugSalvato)
      else bVedi.removeAttribute('href')
    }

    let targhetta = distintivo(bozza ? t('blog.bozza') : t('blog.pubblicato'), bozza ? 'neutro' : 'vivo')

    /** L'interruttore e la targhetta dicono sempre la stessa cosa. */
    function aggiornaTarghetta(): void {
      const nuova = distintivo(bozza ? t('blog.bozza') : t('blog.pubblicato'), bozza ? 'neutro' : 'vivo')
      targhetta.replaceWith(nuova)
      targhetta = nuova
    }

    const stato = interruttore(
      !bozza,
      t('blog.pubblicato'),
      (acceso) => {
        bozza = !acceso
        segnaNonSalvato()
        aggiornaTarghetta()
      },
      t('blog.bozza'),
    )
    const bloccoStato = el('div', undefined, [
      stato.blocco,
      stile(el('p', { class: 'adm-aiuto' }, t('blog.pubblicaNota')), STILE_NOTA_STATO),
    ])

    const bSalva = pulsante(iconaSalva(16), t('blog.salva'), 'adm-btn', () => void salva())

    const testa = el('header', { class: 'adm-testa' }, [
      el('div', undefined, [indietro, titoloPagina]),
      el('div', { class: 'adm-testa-azioni' }, [bVedi, bloccoStato, targhetta, bSalva]),
    ])

    /* --- MESSAGGI ---------------------------------------------------------- */

    // Vuota non si vede (adm-errore:empty): resta al suo posto e si riempie quando serve.
    // role alert: chi usa un lettore di schermo deve sapere subito perché il
    // salvataggio non è andato, non scoprirlo tornando in cima con il tab.
    const zonaErrore = el('div', { class: 'adm-errore', role: 'alert' })

    function mostraErrore(messaggio: string | null): void {
      svuota(zonaErrore)
      if (messaggio) zonaErrore.append(iconaAvviso(18), el('span', undefined, messaggio))
    }

    /* --- CAMPI ------------------------------------------------------------- */

    const titolo = campo({
      id: 'campo-titolo',
      etichetta: t('blog.campoTitolo'),
      segnaposto: t('blog.segnapostoTitolo'),
      valore: articolo ? articolo.titolo : '',
      massimo: MASSIMO_TITOLO,
      autocomplete: 'off',
    })

    const slug = campo({
      id: 'campo-slug',
      etichetta: t('blog.campoSlug'),
      valore: articolo ? articolo.slug : '',
      massimo: MASSIMO_SLUG,
      autocomplete: 'off',
    })
    const slugMostrato = el('strong')
    slug.blocco.append(el('p', { class: 'adm-aiuto' }, [`${t('blog.aiutoSlug')} `, slugMostrato]))

    /** L'indirizzo che avrà l'articolo, con lo stesso ripiego sul titolo del salvataggio. */
    function slugPrevisto(): string {
      return slugDa(slug.input.value) || slugDa(titolo.input.value)
    }

    function aggiornaAiutoSlug(): void {
      slugMostrato.textContent = `${location.host}/blog/${slugPrevisto()}/`
    }

    const estratto = campo({
      id: 'campo-estratto',
      etichetta: t('blog.campoEstratto'),
      tipo: 'area',
      righe: 3,
      valore: articolo ? articolo.estratto : '',
      aiuto: t('blog.aiutoEstratto'),
      massimo: MASSIMO_ESTRATTO,
    })

    const copertinaCaricatore = caricatoreFoto({
      cartella: 'articoli',
      valore: copertina,
      etichetta: t('blog.campoCopertina'),
      testoCarica: t('blog.scegliImmagine'),
      testoTogli: t('blog.togliCopertina'),
      forma: 'larga',
      alCambio: (url) => {
        copertina = url
        segnaNonSalvato()
        aggiornaAnteprima()
      },
    })

    const schedaCampi = el('div', { class: 'adm-card adm-pila' }, [
      titolo.blocco,
      slug.blocco,
      estratto.blocco,
      copertinaCaricatore.blocco,
    ])

    /* --- CONTENUTO --------------------------------------------------------- */

    const campoContenuto = stile(
      el('textarea', {
        id: 'campo-contenuto',
        class: 'adm-campo',
        rows: 18,
        placeholder: t('blog.segnapostoContenuto'),
      }),
      STILE_CONTENUTO,
    )
    campoContenuto.value = articolo ? articolo.contenuto : ''

    const conteggio = el('p', { class: 'adm-aiuto' })

    /** "320 parole, 2 min di lettura", aggiornato mentre si scrive. */
    function aggiornaConteggio(): void {
      const parole = contaParole(campoContenuto.value)
      const minuti = parole ? tempoLettura(campoContenuto.value) : 0
      conteggio.textContent = `${numero(parole)} ${t('blog.parole')}, ${numero(minuti)} ${t('blog.minutiLettura')}`
    }

    /* --- BARRA DEGLI STRUMENTI --------------------------------------------- */

    /** Rimette il testo, il fuoco e il cursore dove servono a chi scrive. */
    function applica(nuovo: string, da: number, a: number): void {
      campoContenuto.value = nuovo
      campoContenuto.focus()
      campoContenuto.setSelectionRange(da, a)
      segnaNonSalvato()
      aggiornaConteggio()
      aggiornaAnteprima()
    }

    /** Marcatori attorno alla selezione, tipo **grassetto** e *corsivo*. */
    function avvolgi(marcatore: string): void {
      const testo = campoContenuto.value
      const inizio = campoContenuto.selectionStart
      const fine = campoContenuto.selectionEnd
      const scelto = testo.slice(inizio, fine)
      const nuovo = testo.slice(0, inizio) + marcatore + scelto + marcatore + testo.slice(fine)
      const da = inizio + marcatore.length
      // senza selezione il cursore finisce in mezzo, pronto a scrivere
      applica(nuovo, da, da + scelto.length)
    }

    /** Segno a inizio riga, tipo "## " e "- ", su tutte le righe toccate. */
    function prefissa(prefisso: string): void {
      const testo = campoContenuto.value
      const inizio = campoContenuto.selectionStart
      const fine = campoContenuto.selectionEnd
      const partenza = inizio === 0 ? 0 : testo.lastIndexOf('\n', inizio - 1) + 1
      const capo = testo.indexOf('\n', fine)
      const arrivo = capo === -1 ? testo.length : capo

      const righe = testo.slice(partenza, arrivo).split('\n')
      const giaMesso = righe.every((r) => r.startsWith(prefisso))
      // premuto la seconda volta, il segno si toglie
      const rifatte = righe.map((r) => (giaMesso ? r.slice(prefisso.length) : prefisso + r))
      const blocco = rifatte.join('\n')
      const nuovo = testo.slice(0, partenza) + blocco + testo.slice(arrivo)

      const scarto = giaMesso ? -prefisso.length : prefisso.length
      const da = Math.max(partenza, inizio + scarto)
      const a = Math.max(da, fine + scarto * righe.length)
      applica(nuovo, da, a)
    }

    async function inserisciLink(): Promise<void> {
      // la selezione si legge prima della finestra, che porta via il fuoco
      const testo = campoContenuto.value
      const inizio = campoContenuto.selectionStart
      const fine = campoContenuto.selectionEnd

      const risposta = await chiedi({
        titolo: t('blog.link'),
        etichetta: t('blog.chiediLink'),
        tipo: 'url',
        segnaposto: 'https://',
      })
      if (risposta === null) return
      const url = risposta.trim()
      if (!url) return

      const scelto = testo.slice(inizio, fine)
      const pezzo = `[${scelto}](${url})`
      const nuovo = testo.slice(0, inizio) + pezzo + testo.slice(fine)
      // senza testo scelto il cursore va fra le parentesi quadre, dove serve scrivere
      const da = scelto ? inizio + pezzo.length : inizio + 1
      applica(nuovo, da, da)
    }

    /* La foto passa da un input file nascosto: il pulsante della barra lo
       apre, e la selezione del testo si legge al clic, perché la finestra di
       scelta del file porta via il fuoco. */
    const ingressoFoto = el('input', { type: 'file', accept: 'image/*', hidden: true })
    let selezioneFoto: [number, number] = [0, 0]

    const bFoto = strumento(t('blog.immagine'), iconaImmagine(15), () => {
      selezioneFoto = [campoContenuto.selectionStart, campoContenuto.selectionEnd]
      ingressoFoto.click()
    })

    ingressoFoto.addEventListener('change', () => {
      const file = ingressoFoto.files?.[0]
      // svuotato subito: la stessa foto scelta due volte deve scattare due volte
      ingressoFoto.value = ''
      if (file) void inserisciFoto(file)
    })

    async function inserisciFoto(file: File): Promise<void> {
      if (bFoto.disabled) return
      mostraErrore(null)
      if (!file.type.startsWith('image/')) {
        mostraErrore(t('comune.formatoNonValido'))
        return
      }
      if (file.size > PESO_MASSIMO_FOTO) {
        mostraErrore(t('comune.immagineTroppoGrande'))
        return
      }

      bFoto.disabled = true
      toast(t('comune.caricamentoFoto'))
      try {
        const url = await caricaImmagine(file, 'articoli')
        // nel frattempo si può aver scritto: i punti letti al clic non escono dal testo
        const testo = campoContenuto.value
        const inizio = Math.min(selezioneFoto[0], testo.length)
        const fine = Math.min(Math.max(selezioneFoto[1], inizio), testo.length)
        // il testo scelto diventa la descrizione dell'immagine, utile a Google e ai lettori di schermo
        const scelto = testo.slice(inizio, fine)
        const pezzo = `![${scelto}](${url})`
        const nuovo = testo.slice(0, inizio) + pezzo + testo.slice(fine)
        const da = inizio + pezzo.length
        applica(nuovo, da, da)
      } catch (errore) {
        mostraErrore(errore instanceof Error && errore.message ? errore.message : t('comune.errore'))
      } finally {
        bFoto.disabled = false
      }
    }

    const barra = el(
      'div',
      { class: 'adm-segmenti adm-segmenti-strumenti', role: 'toolbar', 'aria-label': t('blog.campoContenuto') },
      [
        strumento(t('blog.grassetto'), iconaGrassetto(15), () => avvolgi('**')),
        strumento(t('blog.corsivo'), iconaCorsivo(15), () => avvolgi('*')),
        strumento(t('blog.sottotitolo2'), iconaTitolo(15), () => prefissa('## ')),
        strumento(t('blog.elenco'), iconaElenco(15), () => prefissa('- ')),
        strumento(t('blog.link'), iconaCollegamento(15), () => void inserisciLink()),
        bFoto,
      ],
    )

    const schedaContenuto = el('div', { class: 'adm-card' }, [
      el('div', { class: 'adm-blocco-campo' }, [
        el('label', { class: 'adm-etichetta-campo', for: 'campo-contenuto' }, t('blog.campoContenuto')),
        stile(el('div', undefined, [barra]), STILE_BARRA),
        campoContenuto,
        conteggio,
        ingressoFoto,
      ]),
    ])

    /* --- ANTEPRIMA --------------------------------------------------------- */

    const zonaAnteprima = el('div')

    function aggiornaAnteprima(): void {
      svuota(zonaAnteprima)

      const titoloTesto = titolo.input.value.trim()
      const estrattoTesto = estratto.input.value.trim()
      const contenuto = campoContenuto.value

      if (!titoloTesto && !estrattoTesto && !contenuto.trim() && !copertina) {
        zonaAnteprima.append(el('p', { class: 'adm-vuoto' }, t('blog.anteprimaVuota')))
        return
      }

      // Copertina, titolo e introduzione sopra, poi il testo con la stessa grammatica del sito.
      zonaAnteprima.append(
        el('div', { class: 'adm-prosa' }, [
          copertina ? el('img', { src: copertina, alt: '' }) : null,
          titoloTesto ? stile(el('h3', undefined, titoloTesto), STILE_TITOLO_ANTEPRIMA) : null,
          estrattoTesto ? stile(el('p', undefined, estrattoTesto), STILE_ESTRATTO_ANTEPRIMA) : null,
          ...disegnaTesto(contenuto),
        ]),
      )
    }

    /* --- ASCOLTI ----------------------------------------------------------- */

    titolo.input.addEventListener('input', () => {
      segnaNonSalvato()
      // lo slug segue il titolo finché nessuno lo scrive a mano
      if (!slugToccato) slug.input.value = slugDa(titolo.input.value)
      aggiornaAiutoSlug()
      aggiornaAnteprima()
    })

    slug.input.addEventListener('input', () => {
      slugToccato = true
      segnaNonSalvato()
      aggiornaAiutoSlug()
    })

    estratto.input.addEventListener('input', () => {
      segnaNonSalvato()
      aggiornaAnteprima()
    })

    campoContenuto.addEventListener('input', () => {
      segnaNonSalvato()
      aggiornaConteggio()
      aggiornaAnteprima()
    })

    /* --- SALVATAGGIO -------------------------------------------------------- */

    async function salva(): Promise<void> {
      if (inSalvataggio) return
      // la copertina sta ancora salendo: salvare adesso la perderebbe
      if (copertinaCaricatore.inAttesa()) {
        toast(t('comune.caricamentoFoto'))
        return
      }

      const titoloPulito = titolo.input.value.trim()
      if (!titoloPulito) {
        mostraErrore(t('blog.serveTitolo'))
        titolo.input.focus()
        return
      }

      inSalvataggio = true
      bSalva.disabled = true
      mostraErrore(null)

      const primaVolta = idAttuale === null
      const identificativo = idAttuale ?? nuovoId()
      // un titolo fatto solo di simboli non lascia niente: l'id fa da indirizzo
      const slugPulito = slugDa(slug.input.value) || slugDa(titoloPulito) || slugDa(identificativo)
      const adesso = new Date().toISOString()

      try {
        if (await slugOccupato(slugPulito, identificativo)) {
          mostraErrore(t('blog.slugOccupato'))
          slug.input.focus()
          return
        }

        const daSalvare: Articolo = {
          id: identificativo,
          titolo: titoloPulito,
          slug: slugPulito,
          estratto: estratto.input.value.trim(),
          copertina,
          contenuto: campoContenuto.value,
          bozza,
          creato: creato || adesso,
          aggiornato: adesso,
        }
        const tornato = await salvaArticolo(daSalvare)

        idAttuale = tornato.id
        creato = tornato.creato
        bozza = tornato.bozza
        stato.imposta(!bozza)
        aggiornaTarghetta()

        slug.input.value = tornato.slug
        // da qui in poi l'articolo ha un indirizzo suo, il titolo non lo cambia più
        slugToccato = true
        aggiornaAiutoSlug()

        slugSalvato = tornato.slug
        pubblicatoSalvato = !tornato.bozza
        aggiornaVedi()

        if (primaVolta) {
          titoloPagina.textContent = t('blog.modificaTitolo')
          // l'indirizzo nella barra diventa quello dell'articolo: un ricaricamento
          // per sbaglio non fa perdere quello che è stato scritto
          try {
            window.history.replaceState(null, '', indirizzoModifica(tornato.id))
          } catch {
            /* se il browser non lo permette, il lavoro è comunque già salvato */
          }
        }

        // il lavoro è al sicuro: l'avviso di uscita non serve più
        togliAvviso()
        toast(t('blog.salvato'))
        segnalaModifica()
      } catch {
        mostraErrore(t('comune.errore'))
      } finally {
        inSalvataggio = false
        bSalva.disabled = false
      }
    }

    /* --- MONTAGGIO ---------------------------------------------------------- */

    const sinistra = el('div', { class: 'adm-pila' }, [zonaErrore, schedaCampi, schedaContenuto])

    // Su telefono adm-due-terzi diventa una colonna sola via CSS e l'anteprima finisce sotto da sé.
    const destra = stile(
      el('div', { class: 'adm-card' }, [el('h2', { class: 'adm-titoletto' }, t('blog.anteprima')), zonaAnteprima]),
      STILE_ANTEPRIMA,
    )

    lavoro.append(el('div', { class: 'adm-entra' }, [testa, el('div', { class: 'adm-due-terzi' }, [sinistra, destra])]))

    aggiornaVedi()
    aggiornaAiutoSlug()
    aggiornaConteggio()
    aggiornaAnteprima()
  }

  void apri()
}
