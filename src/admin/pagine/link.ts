/**
 * =============================================================================
 *  LINK DI TRACCIAMENTO
 * =============================================================================
 *  Indirizzi corti da mettere in un volantino, in un annuncio o su Facebook.
 *  Chi entra da uno di questi viene contato a parte, così il cliente vede
 *  quale annuncio porta lavoro e quale no.
 *
 *  Il codice si genera da solo dal nome finché non lo si tocca a mano: chi
 *  scrive "Volantino settembre" ottiene "volantino-settembre" senza doverci
 *  pensare, ma resta libero di scegliere un codice più corto.
 *
 *  Il link vale da subito: la pagina /l/ del sito legge il codice e manda
 *  alla destinazione giusta. Qui si salva e basta.
 * =============================================================================
 */

import { cancellaLink, elencaLink, nuovoId, salvaLink, slugDa, type Link as LinkTracciato } from '../dati'
import {
  campo,
  conferma,
  copia,
  el,
  pulsante,
  statoCaricamento,
  statoErrore,
  statoVuoto,
  svuota,
  tendina,
  toast,
} from '../dom'
import { iconaAvviso, iconaCestino, iconaCopia, iconaLink, iconaPiu } from '../icone'
import { intestazione } from '../telaio'
import { t, type Chiave } from '../lingua'

/**
 * Radice degli indirizzi mostrati al cliente. Resta il dominio definitivo
 * anche prima del cutover: il link finisce su carta stampata e deve valere
 * quando il dominio risponde, non l'indirizzo temporaneo di Vercel.
 * Se il dominio cambia si cambia qui, in un punto solo.
 */
const RADICE = 'https://www.mdaimpresaedile.it/l/'

/**
 * Le pagine principali del sito, più l'ancora del preventivo in home. Il
 * valore è quello che si salva; la chiave è il nome tradotto che si legge
 * nella tendina.
 */
const DESTINAZIONI: readonly { valore: string; chiave: Chiave }[] = [
  { valore: '/', chiave: 'link.home' },
  { valore: '/servizi/', chiave: 'link.servizi' },
  { valore: '/guide/', chiave: 'link.guide' },
  { valore: '/zone/', chiave: 'link.zone' },
  { valore: '/blog/', chiave: 'link.blog' },
  { valore: '/#preventivo', chiave: 'link.preventivo' },
]

/** Indirizzo completo da consegnare al cliente. */
function indirizzo(codice: string): string {
  return `${RADICE}${codice}`
}

/**
 * Il nome leggibile di una destinazione. Un link salvato con un percorso che
 * non sta più nell'elenco si mostra com'è: è un dato, non va nascosto.
 */
function nomeDestinazione(percorso: string): string {
  const voce = DESTINAZIONI.find((d) => d.valore === percorso)
  return voce ? t(voce.chiave) : percorso
}

/**
 * Seleziona il testo di un elemento. Serve quando gli appunti non si possono
 * usare: l'indirizzo resta scritto nella tabella e almeno arriva già
 * evidenziato, pronto per un copia a mano.
 */
function selezionaTesto(nodo: HTMLElement): void {
  const selezione = window.getSelection()
  if (!selezione) return
  const intervallo = document.createRange()
  intervallo.selectNodeContents(nodo)
  selezione.removeAllRanges()
  selezione.addRange(intervallo)
}

/* --- SCHERMATA ------------------------------------------------------------ */

export default function disegna(lavoro: HTMLElement): void {
  svuota(lavoro)

  let elenco: LinkTracciato[] = []

  /* Finché il codice non lo tocca nessuno segue il nome. */
  let codiceToccato = false

  /* Una risposta lenta di una lettura vecchia non deve sovrascrivere quella
     nuova: vince solo chi ha il numero di giro corrente. */
  let giro = 0

  /* --- intestazione --- */

  intestazione(lavoro, t('link.titolo'), t('link.sottotitolo'))

  /* --- modulo di creazione --- */

  const etichetta = campo({
    id: 'lnk-etichetta',
    etichetta: t('link.etichetta'),
    segnaposto: t('link.segnapostoEtichetta'),
    autocomplete: 'off',
    massimo: 80,
  })

  const codice = campo({
    id: 'lnk-codice',
    etichetta: t('link.codice'),
    autocomplete: 'off',
    massimo: 80,
  })

  // L'anteprima dell'indirizzo va aggiornata a ogni tasto: il nodo lo si
  // tiene in mano invece di cercarlo dentro il blocco del campo.
  const anteprima = el('p', { class: 'adm-aiuto' }, indirizzo(''))
  codice.blocco.append(anteprima)

  const destinazione = tendina(
    'lnk-destinazione',
    t('link.destinazione'),
    DESTINAZIONI.map((d) => ({ valore: d.valore, testo: t(d.chiave) })),
    DESTINAZIONI[0].valore,
  )

  function aggiornaAnteprima(): void {
    anteprima.textContent = indirizzo(codice.input.value)
  }

  etichetta.input.addEventListener('input', () => {
    if (codiceToccato) return
    codice.input.value = slugDa(etichetta.input.value)
    aggiornaAnteprima()
  })

  codice.input.addEventListener('input', () => {
    // Un codice svuotato a mano torna a seguire il nome: chi lo cancella
    // tutto vuole ricominciare, non restare con l'anteprima ferma.
    codiceToccato = codice.input.value.trim() !== ''
    aggiornaAnteprima()
  })

  // Resta un submit vero: così Invio dentro un campo crea il link.
  const invio = el('button', { type: 'submit', class: 'adm-btn' }, [
    iconaPiu(16),
    el('span', undefined, t('link.crea')),
  ])

  /* L'avviso del modulo: vuoto non si vede, pieno resta finché il problema
     non si risolve. È un'etichetta fissa, non un toast. */
  const avviso = el('div', { class: 'adm-errore', role: 'alert' })

  function avvisa(testo: string | null): void {
    svuota(avviso)
    if (!testo) return
    avviso.append(iconaAvviso(18), el('div', undefined, [el('p', undefined, testo)]))
  }

  // L'avviso sta su una riga sua, a tutta larghezza: accanto al pulsante si
  // schiaccerebbe, e su telefono finirebbe sotto senza allinearsi a niente.
  // Da vuoto non occupa spazio, quindi la pila non lascia buchi.
  const modulo = el('form', { class: 'adm-card adm-entra' }, [
    el('h2', { class: 'adm-titoletto' }, t('link.nuovo')),
    el('div', { class: 'adm-pila' }, [
      el('div', { class: 'adm-campi' }, [etichetta.blocco, codice.blocco, destinazione.blocco]),
      avviso,
      el('div', { class: 'adm-riga' }, [invio]),
    ]),
  ])

  modulo.addEventListener('submit', (evento) => {
    evento.preventDefault()
    void crea()
  })

  /* --- elenco --- */

  const zonaElenco = el('div', { class: 'adm-card adm-entra' })

  lavoro.append(el('div', { class: 'adm-pila' }, [modulo, zonaElenco]))

  /* --- azioni --------------------------------------------------------- */

  async function crea(): Promise<void> {
    const nome = etichetta.input.value.trim()
    /* Anche un codice scritto a mano passa da slugDa: uno spazio o un
       accento nell'indirizzo darebbe un link che non si apre. */
    const codicePulito = slugDa(codice.input.value)

    if (!nome || !codicePulito) {
      avvisa(t('link.serveEtichetta'))
      return
    }
    if (elenco.some((l) => l.codice === codicePulito)) {
      avvisa(t('link.codiceUsato'))
      return
    }

    avvisa(null)
    invio.disabled = true

    const nuovo: LinkTracciato = {
      id: nuovoId(),
      codice: codicePulito,
      etichetta: nome,
      destinazione: destinazione.select.value,
      creato: new Date().toISOString(),
    }

    try {
      await salvaLink(nuovo)
      etichetta.input.value = ''
      codice.input.value = ''
      codiceToccato = false
      destinazione.select.value = DESTINAZIONI[0].valore
      aggiornaAnteprima()
      // Il nuovo link va in cima senza rileggere niente: la lista è già qui.
      elenco = [nuovo, ...elenco]
      disegnaElenco()
      toast(t('comune.salvato'))
      etichetta.input.focus()
    } catch (errore) {
      avvisa(errore instanceof Error && errore.message ? errore.message : t('comune.errore'))
    } finally {
      invio.disabled = false
    }
  }

  /**
   * Gli appunti non ci sono su tutti i browser e non funzionano fuori da un
   * contesto sicuro: se copia() torna false l'indirizzo NON è negli appunti
   * e dirlo lo stesso sarebbe la cosa peggiore. Si evidenzia il testo e si
   * avvisa, così il cliente sa che deve copiare a mano.
   */
  async function copiaIndirizzo(codiceLink: string, testo: HTMLElement): Promise<void> {
    const riuscito = await copia(indirizzo(codiceLink))
    if (riuscito) {
      toast(t('link.copiato'))
      return
    }
    selezionaTesto(testo)
    toast(t('comune.errore'), 'errore')
  }

  async function cancella(l: LinkTracciato, riga: HTMLElement): Promise<void> {
    const via = await conferma({
      titolo: t('link.cancella'),
      testo: t('link.confermaCancella'),
      pericolo: true,
    })
    if (!via) return

    try {
      await cancellaLink(l.id)
      elenco = elenco.filter((x) => x.id !== l.id)
      // Con un solo link rimasto sparisce la tabella e compare lo stato
      // vuoto: si ridisegna tutto invece di togliere la riga da sola.
      if (elenco.length === 0) disegnaElenco()
      else riga.remove()
    } catch (errore) {
      avvisa(errore instanceof Error && errore.message ? errore.message : t('comune.errore'))
    }
  }

  /* --- disegno dell'elenco -------------------------------------------- */

  function rigaDi(l: LinkTracciato): HTMLElement {
    const testo = el('code', { class: 'adm-codice' }, indirizzo(l.codice))

    const bCopia = pulsante(iconaCopia(14), t('link.copia'), 'adm-btn adm-btn-chiaro adm-btn-piccolo', () => {
      void copiaIndirizzo(l.codice, testo)
    })

    const riga = el('tr')

    const bCancella = pulsante(
      iconaCestino(14),
      t('link.cancella'),
      'adm-btn adm-btn-pericolo adm-btn-piccolo',
      () => void cancella(l, riga),
    )

    riga.append(
      el('td', undefined, [
        el('span', undefined, l.etichetta),
        // Sotto il nome, dove porta: è quello che il cliente vuole sapere
        // quando ha tre volantini diversi.
        el('p', { class: 'adm-aiuto' }, nomeDestinazione(l.destinazione)),
      ]),
      el('td', undefined, [testo]),
      el('td', undefined, [el('div', { class: 'adm-azioni' }, [bCopia, bCancella])]),
    )

    return riga
  }

  function disegnaElenco(): void {
    svuota(zonaElenco)

    if (elenco.length === 0) {
      zonaElenco.append(
        statoVuoto({
          icona: iconaLink(28),
          titolo: t('link.vuoto'),
          testo: t('link.vuotoTesto'),
        }),
      )
      return
    }

    const corpoTabella = el('tbody')
    for (const l of elenco) corpoTabella.append(rigaDi(l))

    zonaElenco.append(
      el('div', { class: 'adm-scorri' }, [
        el('table', { class: 'adm-tabella' }, [
          el('thead', undefined, [
            el('tr', undefined, [
              el('th', { scope: 'col' }, t('link.etichetta')),
              el('th', { scope: 'col' }, t('link.codice')),
              el('th', { scope: 'col' }),
            ]),
          ]),
          corpoTabella,
        ]),
      ]),
    )
  }

  async function carica(): Promise<void> {
    const mio = ++giro
    statoCaricamento(zonaElenco, 3)

    try {
      const letti = await elencaLink()
      if (mio !== giro) return
      elenco = letti
      disegnaElenco()
    } catch {
      if (mio !== giro) return
      statoErrore(zonaElenco, () => void carica())
    }
  }

  void carica()
}
