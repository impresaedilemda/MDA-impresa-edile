/**
 * =============================================================================
 *  ACCESSO E CANCELLO DEL PANNELLO
 * =============================================================================
 *  Chi entra nel pannello passa sempre da qui.
 *
 *  Due modalità, le stesse dello strato dati:
 *
 *  - COLLEGATA: l'accesso lo fa Supabase con email e password, ma essere
 *    loggati NON basta. Il permesso lo dà la tabella 'admin_email': se
 *    l'indirizzo non è in quella lista, la sessione viene chiusa e il
 *    pannello resta fuori portata. Chiunque potrebbe crearsi un account sul
 *    progetto, la lista è l'unica cosa che decide.
 *  - DI PROVA: senza database non c'è nessuno a cui chiedere la password,
 *    quindi si entra con un pulsante e la "sessione" è una riga nel
 *    localStorage. Serve a far vedere il pannello, non a proteggerlo.
 *
 *  Il permesso vero, lato server, sta comunque nelle policy RLS di Supabase:
 *  questo file evita solo di mostrare una stanza in cui non si può lavorare.
 *
 *  La schermata è una sola, a due colonne: la foto del cantiere con il marchio
 *  e la frase a sinistra, la scatola bianca a destra. Dentro la scatola si
 *  alternano l'attesa, il modulo di accesso, il recupero della password e la
 *  scelta di una password nuova: cambia il contenuto, non la cornice.
 * =============================================================================
 */

import { cambiaPassword, chiediRecupero, collegato, sb } from './dati'
import { bottone, campo, el, fascia, scheletro, svuota, toast } from './dom'
import {
  iconaAttesa,
  iconaAvviso,
  iconaBusta,
  iconaChiave,
  iconaEntra,
  iconaLucchetto,
  iconaOcchio,
  iconaOcchioBarrato,
} from './icone'
import { t } from './lingua'
import { marchio } from './telaio'

/** La sessione finta della modalità di prova vive qui. */
export const CHIAVE_PROVA = 'mda-admin-prova'

/**
 * Segno lasciato nel browser di chi amministra: lo script delle statistiche
 * lo legge e salta la visita. Senza, ogni giro di controllo del cliente
 * finirebbe nei numeri del suo stesso sito e il traffico sarebbe una bugia.
 */
export const NON_TRACCIARE = 'mda-non-tracciare'

/** Indirizzo di comodo mostrato quando non c'è database. */
const EMAIL_PROVA = 'prova@locale'

/** Tabella che decide chi entra. Una colonna sola, 'email'. */
const TABELLA_PERMESSI = 'admin_email'

/** Il nome della ditta sopra il titolo: uguale in tutte le lingue. */
const NOME_DITTA = 'MDA Impresa Edile'

/** Quanto resta a schermo l'avviso "password cambiata" prima di rientrare. */
const PAUSA_RIENTRO = 1400

/* --- SESSIONE FINTA ------------------------------------------------------- */

function leggiProva(): { email: string } | null {
  try {
    const grezzo = localStorage.getItem(CHIAVE_PROVA)
    if (!grezzo) return null
    const d = JSON.parse(grezzo) as { email?: string }
    return { email: d.email || EMAIL_PROVA }
  } catch {
    /* chiave rovinata o modalità privata: si riparte dalla schermata */
    return null
  }
}

function scriviProva(): void {
  try {
    localStorage.setItem(CHIAVE_PROVA, JSON.stringify({ email: EMAIL_PROVA, entrato: new Date().toISOString() }))
  } catch {
    /* niente da fare, resta valida solo questa scheda */
  }
}

function pulisciProva(): void {
  try {
    localStorage.removeItem(CHIAVE_PROVA)
  } catch {
    /* pazienza */
  }
}

/* --- SESSIONE ------------------------------------------------------------- */

/**
 * Chi è entrato, se è entrato.
 * Con il database risponde Supabase, senza risponde il localStorage.
 * Rete giù o token illeggibile valgono come "nessuno": si riparte dalla
 * schermata di accesso invece di lasciare il pannello a metà.
 */
export async function sessione(): Promise<{ email: string } | null> {
  if (!collegato || !sb) return leggiProva()

  try {
    const { data } = await sb.auth.getSession()
    const email = data.session?.user?.email
    return email ? { email: email.toLowerCase() } : null
  } catch {
    return null
  }
}

/* --- PERMESSO ------------------------------------------------------------- */

/** Una sola domanda alla tabella dei permessi. Se la domanda fallisce, urla. */
async function interrogaPermesso(email: string): Promise<boolean> {
  const cliente = sb
  if (!cliente) return true

  const { data, error } = await cliente
    .from(TABELLA_PERMESSI)
    .select('email')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (error) throw new Error(error.message)
  return Boolean(data)
}

/**
 * Essere loggati non basta: l'accesso lo dà la tabella.
 * In modalità di prova non c'è nessuna tabella da interrogare e si passa.
 * Se la domanda non arriva a destinazione si resta fuori: meglio una porta
 * chiusa per errore che una aperta per errore.
 */
export async function autorizzato(email: string): Promise<boolean> {
  if (!collegato || !sb) return true
  if (!email) return false

  try {
    return await interrogaPermesso(email)
  } catch {
    return false
  }
}

/* --- USCITA --------------------------------------------------------------- */

/**
 * Chiude la sessione e riporta all'ingresso.
 * La chiave NON_TRACCIARE resta: è il browser di chi amministra, e le sue
 * visite non devono contare nemmeno dopo l'uscita.
 */
export async function esci(): Promise<void> {
  try {
    if (sb) await sb.auth.signOut()
  } catch {
    /* se la chiamata fallisce si esce lo stesso, la pagina cambia comunque */
  }
  pulisciProva()
  location.href = '/admin/'
}

/* --- CORNICE DELLA SCHERMATA ---------------------------------------------- */

/**
 * La cornice a due colonne, e dentro la scatola bianca da riempire.
 *
 * Se la cornice c'è già si riusa e si svuota solo la scatola: il passaggio
 * dall'attesa al modulo, o dal modulo al recupero, cambia quello che sta
 * nella scatola e nient'altro. La foto non ricompare, l'entrata morbida non
 * riparte e la pagina non salta.
 */
function scatolaIn(radice: HTMLElement): HTMLElement {
  const esistente = radice.querySelector<HTMLElement>(':scope > .adm-accesso .adm-accesso-scatola')
  if (esistente) {
    svuota(esistente)
    return esistente
  }

  svuota(radice)

  // Sul fondo scuro della foto il marchio è crema e i suoi ritagli sono neri:
  // il secondo colore non decora, scava.
  const foto = el('aside', { class: 'adm-accesso-foto' }, [
    marchio('#F7F4EB', '#151613'),
    el('p', { class: 'adm-accesso-frase' }, t('accesso.frase')),
  ])
  const scatola = el('div', { class: 'adm-accesso-scatola adm-entra' })

  radice.append(
    el('div', { class: 'adm-accesso' }, [foto, el('div', { class: 'adm-accesso-pannello' }, [scatola])]),
  )
  return scatola
}

/**
 * Il marchio piccolo in cima alla scatola: admin.css lo mostra solo su
 * telefono, dove la colonna con la foto sparisce e senza di lui la schermata
 * non avrebbe più il nome della ditta.
 */
function marchioMobile(): SVGElement {
  const piccolo = marchio()
  piccolo.classList.add('adm-accesso-mobile-marchio')
  return piccolo
}

/** La testa della scatola: marchio, nome della ditta, titolo e riga sotto. */
function testaScatola(scatola: HTMLElement, titolo: string, sottotitolo: string): void {
  scatola.append(
    marchioMobile(),
    el('p', { class: 'adm-accesso-marchio' }, NOME_DITTA),
    el('h1', { class: 'adm-titolo' }, titolo),
    el('p', { class: 'adm-sottotitolo' }, sottotitolo),
  )
}

/* --- PEZZI COMUNI AI MODULI ----------------------------------------------- */

/**
 * L'avviso rosso in pagina. Vuoto non si vede (admin.css nasconde
 * .adm-errore:empty), pieno resta finché qualcuno non risolve.
 */
function avvisoErrore(): HTMLElement {
  return el('div', { class: 'adm-errore', role: 'alert' })
}

function segnala(avviso: HTMLElement, messaggio: string | null): void {
  svuota(avviso)
  if (messaggio) avviso.append(iconaAvviso(16), el('span', undefined, messaggio))
}

/** Il messaggio di un errore lanciato dallo strato dati, o quello generico. */
function messaggioDi(errore: unknown): string {
  return errore instanceof Error && errore.message ? errore.message : t('comune.errore')
}

/**
 * Il pulsante principale dice sempre cosa sta succedendo: in attesa mostra
 * la clessidra e "Un momento", e non si può premere una seconda volta.
 */
function pulsanteInvio(
  icona: (dimensione?: number) => SVGElement,
  testo: string,
): { pulsante: HTMLButtonElement; attesa: (si: boolean) => void } {
  const pulsante = el('button', { class: 'adm-btn adm-btn-largo', type: 'submit' })
  const attesa = (si: boolean): void => {
    svuota(pulsante)
    pulsante.append(si ? iconaAttesa(16) : icona(16), el('span', undefined, si ? t('accesso.attesa') : testo))
    pulsante.disabled = si
  }
  attesa(false)
  return { pulsante, attesa }
}

/** Il campo email, uguale nell'accesso e nel recupero. */
function campoEmail(id: string): { blocco: HTMLElement; input: HTMLInputElement } {
  const c = campo({
    id,
    etichetta: t('accesso.email'),
    tipo: 'email',
    autocomplete: 'email',
    inputmode: 'email',
    obbligatorio: true,
  })
  const input = c.input as HTMLInputElement
  input.name = 'email'
  // Il telefono non deve né mettere la maiuscola né correggere un indirizzo.
  input.setAttribute('autocapitalize', 'none')
  input.setAttribute('spellcheck', 'false')
  return { blocco: c.blocco, input }
}

/**
 * Il campo password con l'occhio che la mostra: sul telefono si sbaglia a
 * scrivere e non si vede dove. Il pulsante alterna il tipo del campo fra
 * password e testo, e cambia icona ed etichetta vocale di conseguenza.
 */
function campoPassword(
  id: string,
  etichetta: string,
  autocomplete: 'current-password' | 'new-password',
): { blocco: HTMLElement; input: HTMLInputElement } {
  const c = campo({ id, etichetta, tipo: 'password', autocomplete, obbligatorio: true })
  const input = c.input as HTMLInputElement
  input.name = id

  let visibile = false
  const occhio = el('button', { type: 'button', 'aria-label': t('accesso.mostraPassword') }, [iconaOcchio(16)])
  occhio.addEventListener('click', () => {
    visibile = !visibile
    input.type = visibile ? 'text' : 'password'
    svuota(occhio)
    occhio.append(visibile ? iconaOcchioBarrato(16) : iconaOcchio(16))
    occhio.setAttribute('aria-label', visibile ? t('accesso.nascondiPassword') : t('accesso.mostraPassword'))
  })

  // campo() ha già messo il campo nel suo blocco: gli si mette attorno la
  // cornice con l'occhio, al posto suo, senza rifare etichetta e aiuto.
  const cornice = el('div', { class: 'adm-campo-password' })
  input.replaceWith(cornice)
  cornice.append(input, occhio)

  return { blocco: c.blocco, input }
}

/* --- MODULO DI ACCESSO ---------------------------------------------------- */

/**
 * La schermata di ingresso. `negato` la apre già con il messaggio del
 * permesso mancante, per chi è loggato ma non è nella lista: si dice perché,
 * non si lascia il cliente davanti a un modulo che ha appena compilato bene.
 */
export function disegnaAccesso(radice: HTMLElement, negato = false): void {
  const scatola = scatolaIn(radice)
  testaScatola(scatola, t('accesso.titolo'), t('accesso.sottotitolo'))

  if (collegato && sb) moduloCollegato(scatola, radice, negato)
  else moduloProva(scatola)
}

/** Modalità collegata: email, password e poi la lista dei permessi. */
function moduloCollegato(scatola: HTMLElement, radice: HTMLElement, negato: boolean): void {
  const cliente = sb as NonNullable<typeof sb>

  const email = campoEmail('adm-email')
  const password = campoPassword('adm-password', t('accesso.password'), 'current-password')
  const avviso = avvisoErrore()
  const { pulsante: entra, attesa } = pulsanteInvio(iconaEntra, t('accesso.entra'))

  let inCorso = false

  function blocca(si: boolean): void {
    inCorso = si
    attesa(si)
    email.input.disabled = si
    password.input.disabled = si
  }

  async function invia(ev: Event): Promise<void> {
    ev.preventDefault()
    if (inCorso) return

    const indirizzo = email.input.value.trim().toLowerCase()
    const parola = password.input.value
    if (!indirizzo || !parola) {
      segnala(avviso, t('accesso.errore'))
      ;(indirizzo ? password.input : email.input).focus()
      return
    }

    blocca(true)
    segnala(avviso, null)

    // Quando si entra la pagina si ricarica: il modulo resta bloccato fino a
    // quel momento, sbloccarlo farebbe solo lampeggiare il pulsante.
    let entrato = false
    try {
      const { error } = await cliente.auth.signInWithPassword({ email: indirizzo, password: parola })
      if (error) {
        segnala(avviso, t('accesso.errore'))
        return
      }

      // Loggati sì, dentro non ancora: senza il permesso la sessione si
      // chiude subito, così non resta in giro un accesso a metà.
      if (!(await interrogaPermesso(indirizzo))) {
        await cliente.auth.signOut()
        segnala(avviso, t('accesso.nonAutorizzato'))
        return
      }

      // La sessione è nel browser: si ricarica e la guardia trova tutto
      // pronto, senza dover rimontare a mano l'intero pannello da qui.
      entrato = true
      location.reload()
    } catch {
      // Guasto della rete, non delle credenziali: si può ritentare subito.
      segnala(avviso, t('comune.errore'))
    } finally {
      if (!entrato) blocca(false)
    }
  }

  const modulo = el('form', { novalidate: true }, [
    el('div', { class: 'adm-accesso-campi' }, [email.blocco, password.blocco, avviso, entra]),
  ])
  modulo.addEventListener('submit', (ev) => void invia(ev))

  const dimenticata = bottone(t('accesso.dimenticata'), 'adm-accesso-link', () => vistaRecupero(radice))

  scatola.append(modulo, dimenticata)
  if (negato) segnala(avviso, t('accesso.nonAutorizzato'))
}

/** Modalità di prova: nessuna password da chiedere a nessuno. */
function moduloProva(scatola: HTMLElement): void {
  const entra = el('button', { class: 'adm-btn adm-btn-largo', type: 'button' }, [
    iconaLucchetto(16),
    el('span', undefined, t('accesso.entraProva')),
  ])
  entra.addEventListener('click', () => {
    entra.disabled = true
    scriviProva()
    location.reload()
  })

  scatola.append(el('div', { class: 'adm-accesso-campi' }, [fascia(t('accesso.locale'), 'info'), entra]))
}

/* --- RECUPERO DELLA PASSWORD ---------------------------------------------- */

/**
 * Chi ha perso la password scrive l'email e riceve un collegamento. Quello
 * riporta qui con il segno di recupero nell'indirizzo, e la guardia apre la
 * scelta della password nuova. Supabase risponde bene anche per un indirizzo
 * che non conosce: da questa schermata non si scopre chi ha un account.
 */
function vistaRecupero(radice: HTMLElement): void {
  const scatola = scatolaIn(radice)
  testaScatola(scatola, t('accesso.recuperoTitolo'), t('accesso.recuperoTesto'))

  const email = campoEmail('adm-recupero-email')
  const avviso = avvisoErrore()
  const { pulsante: invia, attesa } = pulsanteInvio(iconaBusta, t('accesso.recuperoInvia'))

  let inCorso = false

  async function manda(): Promise<void> {
    if (inCorso) return
    const indirizzo = email.input.value.trim().toLowerCase()
    if (!indirizzo) {
      email.input.focus()
      return
    }

    inCorso = true
    attesa(true)
    email.input.disabled = true
    segnala(avviso, null)

    try {
      await chiediRecupero(indirizzo)
      // Al posto del modulo resta la conferma: qui non c'è altro da fare,
      // il seguito sta nella posta.
      modulo.replaceWith(el('div', { class: 'adm-accesso-campi' }, [fascia(t('accesso.recuperoInviato'), 'ok')]))
    } catch (errore) {
      segnala(avviso, messaggioDi(errore))
      inCorso = false
      attesa(false)
      email.input.disabled = false
    }
  }

  // Senza novalidate: il browser ferma da solo un'email vuota o storpiata,
  // e non serve inventare un messaggio in più.
  const modulo = el('form', undefined, [el('div', { class: 'adm-accesso-campi' }, [email.blocco, avviso, invia])])
  modulo.addEventListener('submit', (ev) => {
    ev.preventDefault()
    void manda()
  })

  const torna = bottone(t('accesso.torna'), 'adm-accesso-link', () => disegnaAccesso(radice))

  scatola.append(modulo, torna)
  email.input.focus()
}

/* --- PASSWORD NUOVA ------------------------------------------------------- */

/** true se frammento o query portano il segno del collegamento di recupero. */
function segnoDiRecupero(frammento: string, ricerca: string): boolean {
  return /type=recovery/.test(frammento) || /type=recovery/.test(ricerca)
}

/**
 * Il segno di recupero letto appena il modulo parte, nello stesso giro in cui
 * nasce il client di Supabase. Quel client consuma il frammento
 * dell'indirizzo (#access_token=...&type=recovery) e poi lo cancella: se la
 * guardia arrivasse dopo, nell'indirizzo non troverebbe più niente e il
 * pannello si aprirebbe con la password vecchia ancora in piedi.
 */
const RECUPERO_ALL_AVVIO = typeof location !== 'undefined' && segnoDiRecupero(location.hash, location.search)

/**
 * true se l'indirizzo porta, o portava all'avvio, il segno del collegamento
 * di recupero. Si guarda anche la query per non dipendere da come è
 * configurato il flusso.
 */
function inRecupero(): boolean {
  return RECUPERO_ALL_AVVIO || segnoDiRecupero(location.hash, location.search)
}

/**
 * La scelta della password nuova, dopo il collegamento di recupero. Il
 * collegamento apre già una sessione vera: senza questo passo il pannello si
 * aprirebbe con la password vecchia ancora in piedi, e chi l'ha persa non
 * l'avrebbe mai cambiata.
 */
function vistaNuovaPassword(radice: HTMLElement): void {
  const scatola = scatolaIn(radice)
  testaScatola(scatola, t('accesso.nuovaPasswordTitolo'), t('accesso.nuovaPasswordTesto'))

  const nuova = campoPassword('adm-nuova-password', t('accesso.nuovaPassword'), 'new-password')
  const conferma = campoPassword('adm-conferma-password', t('accesso.confermaPassword'), 'new-password')
  const avviso = avvisoErrore()
  const { pulsante: salva, attesa } = pulsanteInvio(iconaChiave, t('accesso.salvaPassword'))

  let inCorso = false

  function blocca(si: boolean): void {
    inCorso = si
    attesa(si)
    nuova.input.disabled = si
    conferma.input.disabled = si
  }

  async function salvaNuova(ev: Event): Promise<void> {
    ev.preventDefault()
    if (inCorso) return

    const parola = nuova.input.value
    if (parola.length < 8) {
      segnala(avviso, t('accesso.passwordCorta'))
      nuova.input.focus()
      return
    }
    if (parola !== conferma.input.value) {
      segnala(avviso, t('accesso.passwordDiverse'))
      conferma.input.focus()
      return
    }

    blocca(true)
    segnala(avviso, null)

    try {
      await cambiaPassword(parola)
      toast(t('accesso.passwordCambiata'))
      // Il tempo di leggere l'avviso, poi si rientra dall'ingresso pulito.
      // replace e non href: il collegamento di recupero non deve restare
      // nella cronologia, da riaprire per sbaglio.
      window.setTimeout(() => location.replace('/admin/'), PAUSA_RIENTRO)
    } catch (errore) {
      segnala(avviso, messaggioDi(errore))
      blocca(false)
    }
  }

  const modulo = el('form', { novalidate: true }, [
    el('div', { class: 'adm-accesso-campi' }, [nuova.blocco, conferma.blocco, avviso, salva]),
  ])
  modulo.addEventListener('submit', (ev) => void salvaNuova(ev))

  // Una via d'uscita se il collegamento è scaduto e il salvataggio non passa:
  // si torna all'ingresso, dove la guardia decide da capo.
  const torna = bottone(t('accesso.torna'), 'adm-accesso-link', () => location.replace('/admin/'))

  scatola.append(modulo, torna)
  nuova.input.focus()
}

/**
 * Il segno di recupero può arrivare anche dall'evento di Supabase, se il
 * client ha già letto e ripulito l'indirizzo prima che la guardia lo guardasse.
 * Si ascolta solo finché la guardia decide: dopo, un evento in ritardo non
 * deve più strappare via il pannello.
 */
function ascoltaRecupero(radice: HTMLElement): { scattato: () => boolean; smetti: () => void } {
  if (!collegato || !sb) return { scattato: () => false, smetti: () => undefined }

  let scattato = false
  const { data } = sb.auth.onAuthStateChange((evento) => {
    if (evento !== 'PASSWORD_RECOVERY' || scattato) return
    scattato = true
    vistaNuovaPassword(radice)
  })

  return { scattato: () => scattato, smetti: () => data.subscription.unsubscribe() }
}

/* --- CANCELLO ------------------------------------------------------------- */

/**
 * L'attesa iniziale, e basta: qui la cornice dell'accesso NON va disegnata.
 *
 * Ogni sezione del pannello è una pagina a sé, quindi la guardia riparte a
 * ogni passaggio fra una sezione e l'altra. Finché qui c'era la cornice
 * dell'accesso, chi passava al blog vedeva lampeggiare la foto del cantiere
 * con "Area riservata": sembrava che il pannello lo avesse buttato fuori, e
 * per un attimo chiedeva la password a chi era già dentro.
 *
 * Restano tre righe grigie al centro, che non dicono niente a nessuno. La
 * cornice dell'accesso la disegna disegnaAccesso, e solo quando si sa che
 * davvero non c'è nessuna sessione.
 */
function mostraAttesa(radice: HTMLElement): void {
  svuota(radice)
  radice.append(el('div', { class: 'adm-attesa-pagina' }, [scheletro(3)]))
}

/**
 * Se la sessione cade da un'altra scheda o scade il token, il pannello se ne
 * accorge e torna all'ingresso invece di restare aperto su dati che non può
 * più leggere.
 */
function ascoltaUscita(): void {
  if (!sb) return
  sb.auth.onAuthStateChange((evento) => {
    if (evento === 'SIGNED_OUT') location.href = '/admin/'
  })
}

/**
 * Il cancello davanti a ogni pagina del pannello: prima guarda chi c'è, poi
 * lascia passare. Finché non sa, non mostra nulla del pannello.
 * Torna true solo con la radice già svuotata e pronta da disegnare.
 */
export async function guardia(radice: HTMLElement): Promise<boolean> {
  mostraAttesa(radice)

  // Il collegamento di recupero va servito PRIMA di leggere la sessione:
  // quel collegamento ne apre una vera, e senza questo passo il pannello si
  // aprirebbe come se niente fosse.
  if (collegato && sb && inRecupero()) {
    vistaNuovaPassword(radice)
    return false
  }

  const recupero = ascoltaRecupero(radice)
  try {
    const attuale = await sessione()
    if (recupero.scattato()) return false
    if (!attuale) {
      disegnaAccesso(radice)
      return false
    }

    const permesso = await autorizzato(attuale.email)
    if (recupero.scattato()) return false
    if (!permesso) {
      // Loggati ma fuori dalla lista: la sessione si chiude, così a ogni
      // ricarica non si ripete la stessa domanda con lo stesso no. Non si
      // aspetta la risposta: la schermata con il perché va mostrata subito.
      if (sb) void sb.auth.signOut().catch(() => undefined)
      disegnaAccesso(radice, true)
      return false
    }
  } finally {
    recupero.smetti()
  }

  // Chi amministra non deve finire nelle statistiche del sito che amministra.
  try {
    localStorage.setItem(NON_TRACCIARE, '1')
  } catch {
    /* modalità privata: le sue visite verranno contate, poco male */
  }

  ascoltaUscita()
  svuota(radice)
  return true
}
