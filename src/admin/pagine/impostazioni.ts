/**
 * =============================================================================
 *  IMPOSTAZIONI: i dati dell'impresa, la pubblicazione e l'accesso
 * =============================================================================
 *  Tre cose diverse in una schermata sola, perché il cliente le cerca tutte
 *  nello stesso posto:
 *
 *  1. I dati dell'impresa che compaiono sul sito: contatti, sede, dati legali
 *     e social. Un solo modulo, un solo pulsante. Una casella lasciata vuota
 *     non viene salvata: al momento della build il sito tiene il valore
 *     scritto in src/config/site.ts, così il bianco non cancella mai niente.
 *  2. La pubblicazione: lo stato (c'è qualcosa da mandare online o no), il
 *     pulsante che rigenera il sito e l'indirizzo di Vercel che lo permette.
 *     Il telaio manda qui con l'ancora #pubblicazione quando l'indirizzo
 *     manca: per questo la card ha quell'id e la pagina ci scorre da sola.
 *  3. L'accesso: con quale email si entra, il cambio della password (solo con
 *     il database, in prova non c'è nessuna password) e la lingua del pannello.
 *
 *  Le tre letture partono insieme e, se una fallisce, cade tutta la schermata
 *  con il pulsante per riprovare: un modulo pieno di dati vecchi farebbe più
 *  danni di una pagina vuota.
 * =============================================================================
 */

import { sessione } from '../accesso'
import {
  cambiaPassword,
  collegato,
  daPubblicare,
  leggiImpostazioni,
  leggiPubblicazione,
  pubblica,
  salvaHook,
  salvaImpostazioni,
  type ImpostazioniSito,
  type Pubblicazione,
} from '../dati'
import { campo, el, fascia, pulsante, statoCaricamento, statoErrore, svuota, toast, type OpzioniCampo } from '../dom'
import { iconaAvviso, iconaOrologio, iconaPubblica, iconaSalva, iconaUtente } from '../icone'
import { cambiaLingua, dataOra, lingua, t, type Chiave, type Lingua } from '../lingua'
import { intestazione, segnalaModifica } from '../telaio'

/** Tutto quello che la schermata mostra, letto in un colpo solo. */
type Caricato = {
  impostazioni: Partial<ImpostazioniSito>
  pubblicazione: Pubblicazione
  email: string | null
}

/** Indirizzo di comodo mostrato in modalità di prova, dove non c'è nessun account. */
const EMAIL_PROVA = 'prova@locale'

/** Le due lingue del pannello, nell'ordine dei pulsanti. */
const LINGUE: readonly Lingua[] = ['it', 'ro']

/** Sotto questa lunghezza Supabase rifiuta la password: meglio dirlo prima di chiamarlo. */
const PASSWORD_MINIMA = 8

/** Il toast della pubblicazione dice anche quanto aspettare: gli si lascia più tempo per essere letto. */
const DURATA_TOAST_PUBBLICA = 4500

/* --- MICRO-ALLINEAMENTI ---------------------------------------------------
 *  admin.css copre card, titoletti, campi e fasce. Resta una misura che
 *  nessuna classe prevede: la nota appoggiata sotto il titolo di una card,
 *  che deve stare vicina al titolo e lasciare respiro a quello che segue.
 *  Si imposta dal CSSOM (elemento.style.margin) e non con un attributo
 *  style: la CSP del sito sta provando style-src-attr 'none', e le proprietà
 *  assegnate dal codice non passano da quella regola.
 * ------------------------------------------------------------------------ */

const MARGINE_NOTA_TITOLO = '-0.55rem 0 1.25rem'
const MARGINE_NOTA_PIANA = '0'

/* --- PEZZI ---------------------------------------------------------------- */

/** Una riga di nota grigia con il margine deciso da chi la chiama. */
function nota(testo: string, margine: string): HTMLElement {
  const p = el('p', { class: 'adm-nota' }, testo)
  p.style.margin = margine
  return p
}

/**
 * Una card con il titoletto, un'eventuale nota appoggiata sotto e il resto
 * impilato con lo stesso respiro. I figli nulli si saltano.
 */
function card(titolo: string, sottotitolo: string | null, figli: (Node | null)[], id?: string): HTMLElement {
  return el('section', { class: 'adm-card', id: id ?? null }, [
    el('h2', { class: 'adm-titoletto' }, titolo),
    sottotitolo ? nota(sottotitolo, MARGINE_NOTA_TITOLO) : null,
    el('div', { class: 'adm-pila' }, figli),
  ])
}

/**
 * Il riquadro rosso di una card. Vuoto non occupa spazio (admin.css lo
 * nasconde con :empty), pieno resta lì finché il problema non si risolve.
 */
function riquadroErrore(): { blocco: HTMLElement; mostra: (messaggio: string) => void; nascondi: () => void } {
  const blocco = el('div', { class: 'adm-errore', role: 'alert' })
  return {
    blocco,
    mostra: (messaggio) => {
      svuota(blocco)
      blocco.append(iconaAvviso(18), el('span', undefined, messaggio))
    },
    nascondi: () => svuota(blocco),
  }
}

/** Il messaggio di un errore, o la frase generica se non ne ha uno leggibile. */
function messaggioDi(errore: unknown): string {
  return errore instanceof Error && errore.message ? errore.message : t('comune.errore')
}

/** La riga di stato della pubblicazione: cosa c'è da mandare online e quando è stato fatto l'ultima volta. */
function testoStato(p: Pubblicazione): string {
  const stato = daPubblicare(p) ? t('pubblica.daPubblicare') : t('pubblica.tuttoOnline')
  const ultima = p.ultima_pubblicazione
    ? `${t('pubblica.ultima')}: ${dataOra(p.ultima_pubblicazione)}.`
    : t('pubblica.maiPubblicato')
  return `${stato} ${ultima}`
}

/* --- MODULO DELL'IMPRESA -------------------------------------------------- */

/** Le scelte di un campo del modulo, oltre a quelle che si ricavano dalla chiave. */
type ScelteVoce = {
  tipo?: OpzioniCampo['tipo']
  aiuto?: Chiave
  segnaposto?: string
  inputmode?: string
  massimo?: number
}

/**
 * Le quattro card dei dati dell'impresa, dentro un unico form con un unico
 * pulsante. `dopoSalvataggio` avvisa il resto della pagina che c'è qualcosa
 * di nuovo da pubblicare.
 */
function moduloImpresa(iniziali: Partial<ImpostazioniSito>, dopoSalvataggio: () => void): HTMLFormElement {
  const ingressi = new Map<keyof ImpostazioniSito, HTMLInputElement | HTMLTextAreaElement>()

  /**
   * Un campo del modulo. L'etichetta si ricava dalla chiave: in lingua.ts
   * ogni voce di ImpostazioniSito ha la sua 'impostazioni.<chiave>'.
   */
  function voce(chiave: keyof ImpostazioniSito, scelte: ScelteVoce = {}): HTMLElement {
    const { blocco, input } = campo({
      id: `imp-${chiave}`,
      etichetta: t(`impostazioni.${chiave}` as const),
      tipo: scelte.tipo,
      valore: iniziali[chiave] ?? null,
      aiuto: scelte.aiuto ? t(scelte.aiuto) : undefined,
      segnaposto: scelte.segnaposto,
      inputmode: scelte.inputmode,
      massimo: scelte.massimo,
    })
    if (scelte.tipo === 'number') {
      // Ore e anni: interi, mai sotto zero. Il resto lo controlla il browser.
      input.setAttribute('min', '0')
      input.setAttribute('step', '1')
    }
    ingressi.set(chiave, input)
    return blocco
  }

  /**
   * Quello che c'è nei campi, pronto da salvare. Le caselle vuote non entrano:
   * il sito, alla build, tiene il valore scritto nel codice. I due numeri si
   * salvano come numeri, il resto come testo senza spazi attorno.
   */
  function raccogli(): Partial<ImpostazioniSito> {
    const dati: Partial<ImpostazioniSito> = {}
    for (const [chiave, input] of ingressi) {
      const valore = input.value.trim()
      if (!valore) continue

      if (chiave === 'oreRisposta' || chiave === 'garanziaAnni') {
        const n = Number(valore)
        if (Number.isFinite(n)) dati[chiave] = n
        continue
      }

      // La sigla della provincia va sempre maiuscola: finisce in "IT-VE" e
      // fra parentesi dopo il comune.
      const pulito = chiave === 'provincia' ? valore.toUpperCase() : valore
      input.value = pulito
      dati[chiave] = pulito
    }
    return dati
  }

  const contatti = card(t('impostazioni.contatti'), t('impostazioni.contattiNota'), [
    el('div', { class: 'adm-campi-2' }, [
      voce('telefono', { tipo: 'tel', aiuto: 'impostazioni.aiutoTelefono' }),
      voce('whatsapp', { tipo: 'tel', aiuto: 'impostazioni.aiutoWhatsapp', inputmode: 'numeric' }),
      voce('email', { tipo: 'email' }),
      voce('orari', { aiuto: 'impostazioni.aiutoOrari' }),
      voce('oreRisposta', { tipo: 'number', inputmode: 'numeric' }),
      voce('garanziaAnni', { tipo: 'number', inputmode: 'numeric' }),
    ]),
  ])

  const sede = card(t('impostazioni.sede'), null, [
    el('div', { class: 'adm-campi-2' }, [
      voce('via'),
      voce('cap', { inputmode: 'numeric' }),
      voce('citta'),
      voce('provincia', { aiuto: 'impostazioni.aiutoProvincia', massimo: 2 }),
      voce('provinciaNome', { aiuto: 'impostazioni.aiutoProvinciaNome' }),
    ]),
  ])

  const legale = card(t('impostazioni.legale'), null, [
    fascia(t('impostazioni.legaleNota'), 'info'),
    el('div', { class: 'adm-campi-2' }, [
      voce('ragioneSociale', { aiuto: 'impostazioni.aiutoRagioneSociale' }),
      voce('partitaIva', { aiuto: 'impostazioni.aiutoPartitaIva' }),
      voce('rea', { aiuto: 'impostazioni.aiutoRea' }),
    ]),
  ])

  const social = card(t('impostazioni.social'), null, [
    el('div', { class: 'adm-campi-2' }, [
      voce('instagram', { tipo: 'url', inputmode: 'url', segnaposto: 'https://' }),
      voce('facebook', { tipo: 'url', inputmode: 'url', segnaposto: 'https://' }),
    ]),
  ])

  const errore = riquadroErrore()
  const invia = el('button', { type: 'submit', class: 'adm-btn' }, [
    iconaSalva(16),
    el('span', undefined, t('impostazioni.salva')),
  ])

  const modulo = el('form', { class: 'adm-pila' }, [
    contatti,
    sede,
    legale,
    social,
    errore.blocco,
    el('div', { class: 'adm-riga' }, [invia]),
  ])

  async function salva(): Promise<void> {
    if (invia.disabled) return
    errore.nascondi()
    invia.disabled = true
    try {
      await salvaImpostazioni(raccogli())
      toast(t('impostazioni.salvato'))
      dopoSalvataggio()
    } catch (e) {
      errore.mostra(messaggioDi(e))
    } finally {
      invia.disabled = false
    }
  }

  modulo.addEventListener('submit', (ev) => {
    ev.preventDefault()
    void salva()
  })

  return modulo
}

/* --- PUBBLICAZIONE -------------------------------------------------------- */

/**
 * La card della pubblicazione. Torna anche `aggiorna`, che rilegge lo stato:
 * dopo un salvataggio nel modulo qui sopra la riga deve dire che c'è
 * qualcosa di nuovo da mandare online, senza ricaricare la pagina.
 */
function cardPubblicazione(iniziale: Pubblicazione): { card: HTMLElement; aggiorna: () => Promise<void> } {
  let stato: Pubblicazione = { ...iniziale }

  /* --- riga di stato e pulsante --- */

  const testo = el('span', { class: 'adm-spazio' }, testoStato(stato))
  const errorePubblica = riquadroErrore()
  const bPubblica = pulsante(iconaPubblica(16), t('pubblica.pubblica'), 'adm-btn', () => void avvia())
  const riga = el('div', { class: 'adm-riga' }, [iconaOrologio(16), testo, bPubblica])

  /** Compare solo finché l'indirizzo manca. Si toglie e si rimette, non si nasconde. */
  const avvisoHook = fascia(t('pubblica.senzaHook'), 'attenzione')

  /* --- indirizzo di pubblicazione --- */

  const hook = campo({
    id: 'imp-hook',
    etichetta: t('impostazioni.hook'),
    tipo: 'url',
    valore: stato.hook_url,
    aiuto: t('impostazioni.aiutoHook'),
    inputmode: 'url',
    autocomplete: 'off',
  })
  const erroreHook = riquadroErrore()
  const bHook = el('button', { type: 'submit', class: 'adm-btn adm-btn-chiaro' }, t('impostazioni.salvaHook'))

  // Un form a sé: così l'Invio dentro il campo salva l'indirizzo. Il
  // controllo dell'indirizzo lo fa salvaHook, con un messaggio suo.
  const moduloHook = el('form', { class: 'adm-pila', novalidate: true }, [
    hook.blocco,
    erroreHook.blocco,
    el('div', { class: 'adm-riga' }, [bHook]),
  ])
  moduloHook.addEventListener('submit', (ev) => {
    ev.preventDefault()
    void salvaIndirizzo()
  })

  const scheda = card(
    t('impostazioni.pubblicazione'),
    t('impostazioni.pubblicazioneNota'),
    [riga, errorePubblica.blocco, moduloHook],
    'pubblicazione',
  )

  /* --- azioni --- */

  function disegnaStato(): void {
    testo.textContent = testoStato(stato)
    bPubblica.disabled = !stato.hook_url
    if (stato.hook_url) avvisoHook.remove()
    else if (!avvisoHook.isConnected) moduloHook.before(avvisoHook)
  }

  async function avvia(): Promise<void> {
    if (bPubblica.disabled) return
    errorePubblica.nascondi()
    bPubblica.disabled = true
    try {
      const quando = await pubblica()
      stato = { ...stato, ultima_pubblicazione: quando }
      toast(t('pubblica.fatto'), 'ok', DURATA_TOAST_PUBBLICA)
      // La fascia nera in cima dice ancora che c'è qualcosa da mandare
      // online: il telaio la rilegge e, non essendoci più niente, la toglie.
      segnalaModifica()
    } catch (e) {
      errorePubblica.mostra(messaggioDi(e))
    } finally {
      disegnaStato()
    }
  }

  async function salvaIndirizzo(): Promise<void> {
    if (bHook.disabled) return
    erroreHook.nascondi()
    bHook.disabled = true
    const valore = hook.input.value.trim()
    try {
      await salvaHook(valore)
      stato = { ...stato, hook_url: valore }
      hook.input.value = valore
      toast(t('comune.salvato'))
      disegnaStato()
      // Se in cima c'è la fascia "configura la pubblicazione", adesso può
      // diventare quella con il pulsante: il telaio la ridisegna da solo.
      segnalaModifica()
    } catch (e) {
      erroreHook.mostra(messaggioDi(e))
    } finally {
      bHook.disabled = false
    }
  }

  async function aggiorna(): Promise<void> {
    try {
      stato = await leggiPubblicazione()
      disegnaStato()
    } catch {
      /* la riga resta com'era: il salvataggio è già andato a buon fine e la fascia in cima lo dice comunque */
    }
  }

  disegnaStato()
  return { card: scheda, aggiorna }
}

/* --- ACCESSO -------------------------------------------------------------- */

/** Il cambio della password, solo con il database collegato. */
function moduloPassword(email: string): HTMLFormElement {
  // Un campo con l'email, nascosto: i gestori di password lo leggono per
  // sapere a quale account appartiene la password nuova.
  const utente = el('input', {
    type: 'email',
    name: 'username',
    autocomplete: 'username',
    readonly: true,
    hidden: true,
    tabindex: -1,
    'aria-hidden': 'true',
  })
  utente.value = email

  const nuova = campo({
    id: 'imp-nuova-password',
    etichetta: t('impostazioni.nuovaPassword'),
    tipo: 'password',
    autocomplete: 'new-password',
  })
  const conferma = campo({
    id: 'imp-conferma-password',
    etichetta: t('impostazioni.confermaPassword'),
    tipo: 'password',
    autocomplete: 'new-password',
  })
  const errore = riquadroErrore()
  const bCambia = el('button', { type: 'submit', class: 'adm-btn adm-btn-chiaro' }, t('impostazioni.cambiaPassword'))

  const modulo = el('form', { class: 'adm-pila', novalidate: true }, [
    utente,
    el('div', { class: 'adm-campi-2' }, [nuova.blocco, conferma.blocco]),
    errore.blocco,
    el('div', { class: 'adm-riga' }, [bCambia]),
  ])

  async function cambia(): Promise<void> {
    if (bCambia.disabled) return
    errore.nascondi()

    const password = nuova.input.value
    if (password.length < PASSWORD_MINIMA) {
      errore.mostra(t('accesso.passwordCorta'))
      nuova.input.focus()
      return
    }
    if (password !== conferma.input.value) {
      errore.mostra(t('accesso.passwordDiverse'))
      conferma.input.focus()
      return
    }

    bCambia.disabled = true
    try {
      await cambiaPassword(password)
      toast(t('impostazioni.passwordCambiata'))
      nuova.input.value = ''
      conferma.input.value = ''
    } catch (e) {
      errore.mostra(messaggioDi(e))
    } finally {
      bCambia.disabled = false
    }
  }

  modulo.addEventListener('submit', (ev) => {
    ev.preventDefault()
    void cambia()
  })

  return modulo
}

/**
 * I due pulsanti della lingua. Le sigle non passano da t(): IT e RO sono le
 * stesse in tutte e due le lingue. Ogni pulsante porta il proprio lang, così
 * una voce sintetica legge "RO" come lo leggerebbe un romeno.
 */
function sceltaLingua(): HTMLElement {
  const attuale = lingua()
  const gruppo = el('div', { class: 'adm-segmenti', role: 'group', 'aria-label': t('impostazioni.lingua') })

  for (const l of LINGUE) {
    const scelta = l === attuale
    const b = el('button', { type: 'button', lang: l, 'aria-pressed': scelta ? 'true' : 'false' }, l.toUpperCase())
    b.addEventListener('click', () => {
      if (!scelta) cambiaLingua(l)
    })
    gruppo.append(b)
  }

  return el('div', undefined, [el('span', { class: 'adm-etichetta-campo' }, t('impostazioni.lingua')), gruppo])
}

/** La card dell'accesso: chi è dentro, la password e la lingua. */
function cardAccesso(email: string | null): HTMLElement {
  const chi = collegato ? (email ?? '') : EMAIL_PROVA

  const riga = el('div', { class: 'adm-riga' }, [
    iconaUtente(16),
    el('span', undefined, t('impostazioni.accountEmail')),
    el('strong', undefined, chi),
  ])

  return card(t('impostazioni.account'), null, [
    riga,
    collegato ? moduloPassword(chi) : nota(t('accesso.locale'), MARGINE_NOTA_PIANA),
    sceltaLingua(),
  ])
}

/* --- SCHERMATA ------------------------------------------------------------ */

/** Riempie la zona sotto l'intestazione con i dati appena letti. */
function mostra(zona: HTMLElement, dati: Caricato): void {
  svuota(zona)

  const pubblicazione = cardPubblicazione(dati.pubblicazione)

  const modulo = moduloImpresa(dati.impostazioni, () => {
    // La fascia in cima e la riga di stato qui sotto dicono la stessa cosa:
    // si aggiornano insieme.
    segnalaModifica()
    void pubblicazione.aggiorna()
  })

  zona.append(modulo, pubblicazione.card, cardAccesso(dati.email))

  // Il telaio manda qui con l'ancora quando manca l'indirizzo di
  // pubblicazione: la card nasce dopo il caricamento, quindi il browser da
  // solo non la trova.
  if (location.hash === '#pubblicazione') {
    window.requestAnimationFrame(() => pubblicazione.card.scrollIntoView({ block: 'start', behavior: 'smooth' }))
  }
}

export default function disegna(lavoro: HTMLElement): void {
  svuota(lavoro)
  intestazione(lavoro, t('impostazioni.titolo'), t('impostazioni.sottotitolo'))

  const zona = el('div', { class: 'adm-pila' })
  lavoro.append(zona)

  /* Una risposta lenta di una lettura vecchia non deve sovrascrivere quella
     nuova: vince solo chi ha il numero di giro corrente. */
  let giro = 0

  /**
   * Legge tutto e disegna. In caso di errore il pulsante richiama questa
   * stessa funzione: il tentativo è vero, non un ricaricamento della pagina.
   */
  async function carica(): Promise<void> {
    const mio = ++giro
    statoCaricamento(zona, 6)

    try {
      // Le tre letture insieme: nessuna dipende dal risultato delle altre.
      const [impostazioni, pubblicazione, chi] = await Promise.all([
        leggiImpostazioni(),
        leggiPubblicazione(),
        sessione(),
      ])
      if (mio !== giro) return
      mostra(zona, { impostazioni, pubblicazione, email: chi?.email ?? null })
    } catch {
      if (mio !== giro) return
      statoErrore(zona, () => void carica())
    }
  }

  void carica()
}
