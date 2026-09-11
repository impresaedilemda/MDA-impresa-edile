/**
 * =============================================================================
 *  STRATO DATI DEL PANNELLO DI AMMINISTRAZIONE
 * =============================================================================
 *  Un solo punto di accesso per tutto quello che il pannello legge e scrive.
 *
 *  Due modalita, decise da sole in base alle variabili d'ambiente:
 *
 *  - COLLEGATA: se esistono PUBLIC_SUPABASE_URL e PUBLIC_SUPABASE_ANON_KEY,
 *    i dati stanno su Supabase e sono gli stessi per tutti i dispositivi.
 *  - LOCALE: senza quelle variabili tutto vive nel localStorage del browser.
 *    Serve a provare il pannello subito, non a farci lavorare il cliente: il
 *    pannello lo dice a chiare lettere con una fascia in cima.
 *
 *  Lo schema SQL sta in supabase/schema.sql e supabase/aggiornamento-2026-09.sql.
 *
 *  Ogni funzione lancia un Error con un messaggio leggibile quando il database
 *  risponde male: chi chiama mostra lo stato di errore e offre il "riprova".
 * =============================================================================
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type {
  Articolo,
  ImpostazioniSito,
  Lavoro,
  Pubblicazione,
  Recensione,
  Richiesta,
  StatoRichiesta,
} from '../lib/tipi'

export type { Articolo, ImpostazioniSito, Lavoro, Pubblicazione, Recensione, Richiesta, StatoRichiesta }

const URL_SUPABASE = (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '')
const CHIAVE_SUPABASE = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined

export const collegato = Boolean(URL_SUPABASE && CHIAVE_SUPABASE)

export const sb: SupabaseClient | null = collegato
  ? createClient(URL_SUPABASE as string, CHIAVE_SUPABASE as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

/* --- TIPI ----------------------------------------------------------------- */

export type Link = {
  id: string
  codice: string
  etichetta: string
  destinazione: string
  creato: string
}

export type Statistiche = {
  totale: { visualizzazioni: number; unici: number }
  serie: { etichetta: string; visualizzazioni: number; unici: number }[]
  pagine: { percorso: string; visualizzazioni: number }[]
  sorgenti: { sorgente: string; sessioni: number }[]
  dispositivi: { dispositivo: string; sessioni: number }[]
  link: { codice: string; visualizzazioni: number; sessioni: number }[]
}

export const STATISTICHE_VUOTE: Statistiche = {
  totale: { visualizzazioni: 0, unici: 0 },
  serie: [],
  pagine: [],
  sorgenti: [],
  dispositivi: [],
  link: [],
}

/** I numeri che il pannello iniziale mostra in cima. */
export type Contatori = {
  richiesteNuove: number
  richiesteTotali: number
  articoli: number
  articoliPubblicati: number
  recensioni: number
  lavori: number
}

/** Cartelle del deposito immagini: una per ogni cosa che ha una foto. */
export type CartellaImmagini = 'articoli' | 'lavori' | 'recensioni'

/* --- DEPOSITO LOCALE ------------------------------------------------------ */

const CHIAVE = 'mda-admin'

type Deposito = {
  articoli: Articolo[]
  link: Link[]
  richieste: Richiesta[]
  recensioni: Recensione[]
  lavori: Lavoro[]
  impostazioni: Partial<ImpostazioniSito>
  pubblicazione: Pubblicazione
}

const DEPOSITO_VUOTO: Deposito = {
  articoli: [],
  link: [],
  richieste: [],
  recensioni: [],
  lavori: [],
  impostazioni: {},
  pubblicazione: { hook_url: '', ultima_pubblicazione: null, ultima_modifica: null },
}

function leggiLocale(): Deposito {
  try {
    const grezzo = localStorage.getItem(CHIAVE)
    if (!grezzo) return structuredClone(DEPOSITO_VUOTO)
    const d = JSON.parse(grezzo) as Partial<Deposito>
    return {
      articoli: d.articoli ?? [],
      link: d.link ?? [],
      richieste: d.richieste ?? [],
      recensioni: d.recensioni ?? [],
      lavori: d.lavori ?? [],
      impostazioni: d.impostazioni ?? {},
      pubblicazione: { ...DEPOSITO_VUOTO.pubblicazione, ...(d.pubblicazione ?? {}) },
    }
  } catch {
    return structuredClone(DEPOSITO_VUOTO)
  }
}

function scriviLocale(d: Deposito): void {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify(d))
  } catch {
    /* quota piena o modalita privata: si perde solo la prova in locale */
  }
}

/** In locale ogni modifica segna che c'e qualcosa da pubblicare, come i trigger. */
function segnaModificaLocale(d: Deposito): void {
  d.pubblicazione.ultima_modifica = new Date().toISOString()
}

/* --- AIUTI ---------------------------------------------------------------- */

/** Identificativo senza dipendenze: crypto quando c'e, altrimenti a mano. */
export function nuovoId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `id-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`
  }
}

/** "Come scegliere il colore" -> "come-scegliere-il-colore" */
export function slugDa(testo: string): string {
  return testo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function adesso(): string {
  return new Date().toISOString()
}

/** Un errore di Supabase diventa un Error normale, con il suo messaggio. */
function fallisci(errore: { message: string } | null): never {
  throw new Error(errore?.message ?? 'Errore sconosciuto')
}

/* --- ARTICOLI ------------------------------------------------------------- */

export async function elencaArticoli(): Promise<Articolo[]> {
  if (!sb) return leggiLocale().articoli.sort((a, b) => b.creato.localeCompare(a.creato))
  const { data, error } = await sb.from('articoli').select('*').order('creato', { ascending: false })
  if (error) fallisci(error)
  return (data ?? []) as Articolo[]
}

export async function leggiArticolo(id: string): Promise<Articolo | null> {
  if (!sb) return leggiLocale().articoli.find((a) => a.id === id) ?? null
  const { data, error } = await sb.from('articoli').select('*').eq('id', id).maybeSingle()
  if (error) fallisci(error)
  return (data as Articolo) ?? null
}

export async function salvaArticolo(a: Articolo): Promise<Articolo> {
  const pieno = { ...a, aggiornato: adesso(), creato: a.creato || adesso() }

  if (!sb) {
    const d = leggiLocale()
    const i = d.articoli.findIndex((x) => x.id === pieno.id)
    if (i >= 0) d.articoli[i] = pieno
    else d.articoli.push(pieno)
    segnaModificaLocale(d)
    scriviLocale(d)
    return pieno
  }

  const { data, error } = await sb.from('articoli').upsert(pieno).select().single()
  if (error) fallisci(error)
  return data as Articolo
}

export async function cancellaArticolo(id: string): Promise<void> {
  if (!sb) {
    const d = leggiLocale()
    d.articoli = d.articoli.filter((a) => a.id !== id)
    segnaModificaLocale(d)
    scriviLocale(d)
    return
  }
  const { error } = await sb.from('articoli').delete().eq('id', id)
  if (error) fallisci(error)
}

/** true se un altro articolo usa gia questo indirizzo. */
export async function slugOccupato(slug: string, ioStesso: string): Promise<boolean> {
  if (!slug) return false
  if (!sb) return leggiLocale().articoli.some((a) => a.slug === slug && a.id !== ioStesso)
  const { data, error } = await sb.from('articoli').select('id').eq('slug', slug).neq('id', ioStesso).limit(1)
  if (error) fallisci(error)
  return (data ?? []).length > 0
}

/* --- RICHIESTE ------------------------------------------------------------ */

export async function elencaRichieste(): Promise<Richiesta[]> {
  if (!sb) return leggiLocale().richieste.sort((a, b) => b.creato.localeCompare(a.creato))
  const { data, error } = await sb.from('richieste').select('*').order('creato', { ascending: false })
  if (error) fallisci(error)
  return (data ?? []) as Richiesta[]
}

export async function aggiornaRichiesta(
  id: string,
  campi: Partial<Pick<Richiesta, 'stato' | 'nota'>>,
): Promise<Richiesta> {
  if (!sb) {
    const d = leggiLocale()
    const r = d.richieste.find((x) => x.id === id)
    if (!r) throw new Error('Richiesta non trovata')
    Object.assign(r, campi, { aggiornato: adesso() })
    scriviLocale(d)
    return r
  }
  const { data, error } = await sb
    .from('richieste')
    .update({ ...campi, aggiornato: adesso() })
    .eq('id', id)
    .select()
    .single()
  if (error) fallisci(error)
  return data as Richiesta
}

export async function cancellaRichiesta(id: string): Promise<void> {
  if (!sb) {
    const d = leggiLocale()
    d.richieste = d.richieste.filter((r) => r.id !== id)
    scriviLocale(d)
    return
  }
  const { error } = await sb.from('richieste').delete().eq('id', id)
  if (error) fallisci(error)
}

/** Quante richieste aspettano ancora una risposta. Il menu lo mostra come pallino. */
export async function contaRichiesteNuove(): Promise<number> {
  if (!sb) return leggiLocale().richieste.filter((r) => r.stato === 'nuova').length
  const { count, error } = await sb.from('richieste').select('id', { count: 'exact', head: true }).eq('stato', 'nuova')
  if (error) fallisci(error)
  return count ?? 0
}

/* --- RECENSIONI ----------------------------------------------------------- */

export async function elencaRecensioni(): Promise<Recensione[]> {
  if (!sb) {
    return leggiLocale().recensioni.sort((a, b) => a.ordine - b.ordine || b.creato.localeCompare(a.creato))
  }
  const { data, error } = await sb
    .from('recensioni')
    .select('*')
    .order('ordine', { ascending: true })
    .order('creato', { ascending: false })
  if (error) fallisci(error)
  return (data ?? []) as Recensione[]
}

export async function salvaRecensione(r: Recensione): Promise<Recensione> {
  const piena = { ...r, aggiornato: adesso(), creato: r.creato || adesso() }
  if (!sb) {
    const d = leggiLocale()
    const i = d.recensioni.findIndex((x) => x.id === piena.id)
    if (i >= 0) d.recensioni[i] = piena
    else d.recensioni.push(piena)
    segnaModificaLocale(d)
    scriviLocale(d)
    return piena
  }
  const { data, error } = await sb.from('recensioni').upsert(piena).select().single()
  if (error) fallisci(error)
  return data as Recensione
}

export async function cancellaRecensione(id: string): Promise<void> {
  if (!sb) {
    const d = leggiLocale()
    d.recensioni = d.recensioni.filter((r) => r.id !== id)
    segnaModificaLocale(d)
    scriviLocale(d)
    return
  }
  const { error } = await sb.from('recensioni').delete().eq('id', id)
  if (error) fallisci(error)
}

/* --- LAVORI --------------------------------------------------------------- */

export async function elencaLavori(): Promise<Lavoro[]> {
  if (!sb) return leggiLocale().lavori.sort((a, b) => a.ordine - b.ordine || b.creato.localeCompare(a.creato))
  const { data, error } = await sb
    .from('lavori')
    .select('*')
    .order('ordine', { ascending: true })
    .order('creato', { ascending: false })
  if (error) fallisci(error)
  return (data ?? []) as Lavoro[]
}

export async function salvaLavoro(l: Lavoro): Promise<Lavoro> {
  const pieno = { ...l, aggiornato: adesso(), creato: l.creato || adesso() }
  if (!sb) {
    const d = leggiLocale()
    const i = d.lavori.findIndex((x) => x.id === pieno.id)
    if (i >= 0) d.lavori[i] = pieno
    else d.lavori.push(pieno)
    segnaModificaLocale(d)
    scriviLocale(d)
    return pieno
  }
  const { data, error } = await sb.from('lavori').upsert(pieno).select().single()
  if (error) fallisci(error)
  return data as Lavoro
}

export async function cancellaLavoro(id: string): Promise<void> {
  if (!sb) {
    const d = leggiLocale()
    d.lavori = d.lavori.filter((l) => l.id !== id)
    segnaModificaLocale(d)
    scriviLocale(d)
    return
  }
  const { error } = await sb.from('lavori').delete().eq('id', id)
  if (error) fallisci(error)
}

/* --- ORDINE --------------------------------------------------------------- */

/**
 * Riscrive il campo `ordine` seguendo l'elenco di id ricevuto: il primo
 * diventa 0, il secondo 1 e cosi via. Vale per recensioni e lavori.
 */
export async function riordina(tabella: 'recensioni' | 'lavori', ids: string[]): Promise<void> {
  if (!sb) {
    const d = leggiLocale()
    const righe = d[tabella] as { id: string; ordine: number }[]
    ids.forEach((id, i) => {
      const r = righe.find((x) => x.id === id)
      if (r) r.ordine = i
    })
    segnaModificaLocale(d)
    scriviLocale(d)
    return
  }
  // Un aggiornamento per riga: sono pochi elementi, e cosi non serve
  // rimandare al database campi che non sono cambiati.
  const esiti = await Promise.all(
    ids.map((id, i) => sb.from(tabella).update({ ordine: i, aggiornato: adesso() }).eq('id', id)),
  )
  const guasto = esiti.find((e) => e.error)
  if (guasto?.error) fallisci(guasto.error)
}

/* --- IMPOSTAZIONI --------------------------------------------------------- */

export async function leggiImpostazioni(): Promise<Partial<ImpostazioniSito>> {
  if (!sb) return leggiLocale().impostazioni
  const { data, error } = await sb.from('impostazioni').select('dati').eq('id', 'sito').maybeSingle()
  if (error) fallisci(error)
  return ((data as { dati?: Partial<ImpostazioniSito> } | null)?.dati ?? {}) as Partial<ImpostazioniSito>
}

export async function salvaImpostazioni(dati: Partial<ImpostazioniSito>): Promise<void> {
  if (!sb) {
    const d = leggiLocale()
    d.impostazioni = dati
    segnaModificaLocale(d)
    scriviLocale(d)
    return
  }
  const { error } = await sb.from('impostazioni').update({ dati, aggiornato: adesso() }).eq('id', 'sito')
  if (error) fallisci(error)
}

/* --- PUBBLICAZIONE -------------------------------------------------------- */

export async function leggiPubblicazione(): Promise<Pubblicazione> {
  if (!sb) return leggiLocale().pubblicazione
  const { data, error } = await sb
    .from('pubblicazione')
    .select('hook_url, ultima_pubblicazione, ultima_modifica')
    .eq('id', 'sito')
    .maybeSingle()
  if (error) fallisci(error)
  return (data as Pubblicazione | null) ?? { hook_url: '', ultima_pubblicazione: null, ultima_modifica: null }
}

/** true se ci sono modifiche salvate dopo l'ultima pubblicazione. */
export function daPubblicare(p: Pubblicazione): boolean {
  if (!p.ultima_modifica) return false
  if (!p.ultima_pubblicazione) return true
  return p.ultima_modifica > p.ultima_pubblicazione
}

export async function salvaHook(url: string): Promise<void> {
  const pulito = url.trim()
  if (pulito && !/^https:\/\/api\.vercel\.com\/v1\/integrations\/deploy\//.test(pulito)) {
    throw new Error('Indirizzo non valido: deve iniziare con https://api.vercel.com/v1/integrations/deploy/')
  }
  if (!sb) {
    const d = leggiLocale()
    d.pubblicazione.hook_url = pulito
    scriviLocale(d)
    return
  }
  const { error } = await sb.from('pubblicazione').update({ hook_url: pulito }).eq('id', 'sito')
  if (error) fallisci(error)
}

/**
 * Chiede a Vercel di rigenerare il sito. La risposta arriva "opaca" (no-cors),
 * quindi non si puo leggere: se la rete non lancia, la build e partita.
 * Torna la data della pubblicazione appena segnata.
 */
export async function pubblica(): Promise<string> {
  const p = await leggiPubblicazione()
  if (!p.hook_url) throw new Error('Nessun indirizzo di pubblicazione impostato')

  await fetch(p.hook_url, { method: 'POST', mode: 'no-cors' })

  const quando = adesso()
  if (!sb) {
    const d = leggiLocale()
    d.pubblicazione.ultima_pubblicazione = quando
    scriviLocale(d)
    return quando
  }
  const { error } = await sb.from('pubblicazione').update({ ultima_pubblicazione: quando }).eq('id', 'sito')
  if (error) fallisci(error)
  return quando
}

/* --- LINK DI TRACCIAMENTO ------------------------------------------------- */

export async function elencaLink(): Promise<Link[]> {
  if (!sb) return leggiLocale().link
  const { data, error } = await sb.from('link').select('*').order('creato', { ascending: false })
  if (error) fallisci(error)
  return (data ?? []) as Link[]
}

export async function salvaLink(l: Link): Promise<void> {
  if (!sb) {
    const d = leggiLocale()
    const i = d.link.findIndex((x) => x.id === l.id)
    if (i >= 0) d.link[i] = l
    else d.link.push(l)
    scriviLocale(d)
    return
  }
  const { error } = await sb.from('link').upsert(l)
  if (error) fallisci(error)
}

export async function cancellaLink(id: string): Promise<void> {
  if (!sb) {
    const d = leggiLocale()
    d.link = d.link.filter((l) => l.id !== id)
    scriviLocale(d)
    return
  }
  const { error } = await sb.from('link').delete().eq('id', id)
  if (error) fallisci(error)
}

/* --- STATISTICHE ---------------------------------------------------------- */

/**
 * Tutto il conteggio lo fa il database, in ora italiana: se i giorni li
 * calcolasse il browser, una macchina in un altro fuso cercherebbe date che
 * nella risposta non esistono e il traffico sparirebbe dal grafico.
 */
export async function leggiStatistiche(giorni: number): Promise<Statistiche> {
  if (!sb) return STATISTICHE_VUOTE
  const { data, error } = await sb.rpc('statistiche', { giorni })
  if (error) fallisci(error)
  return { ...STATISTICHE_VUOTE, ...((data ?? {}) as Partial<Statistiche>) }
}

export async function leggiStatisticheMesi(mesi: number): Promise<Statistiche> {
  if (!sb) return STATISTICHE_VUOTE
  const { data, error } = await sb.rpc('statistiche_mesi', { mesi })
  if (error) fallisci(error)
  return { ...STATISTICHE_VUOTE, ...((data ?? {}) as Partial<Statistiche>) }
}

/* --- CONTATORI ------------------------------------------------------------ */

async function conta(tabella: string, filtro?: (q: any) => any): Promise<number> {
  const cliente = sb as SupabaseClient
  let q = cliente.from(tabella).select('id', { count: 'exact', head: true })
  if (filtro) q = filtro(q)
  const { count, error } = await q
  if (error) fallisci(error)
  return count ?? 0
}

/** I numeri del pannello iniziale, letti tutti insieme. */
export async function leggiContatori(): Promise<Contatori> {
  if (!sb) {
    const d = leggiLocale()
    return {
      richiesteNuove: d.richieste.filter((r) => r.stato === 'nuova').length,
      richiesteTotali: d.richieste.length,
      articoli: d.articoli.length,
      articoliPubblicati: d.articoli.filter((a) => !a.bozza).length,
      recensioni: d.recensioni.length,
      lavori: d.lavori.length,
    }
  }
  const [richiesteNuove, richiesteTotali, articoli, articoliPubblicati, recensioni, lavori] = await Promise.all([
    conta('richieste', (q) => q.eq('stato', 'nuova')),
    conta('richieste'),
    conta('articoli'),
    conta('articoli', (q) => q.eq('bozza', false)),
    conta('recensioni'),
    conta('lavori'),
  ])
  return { richiesteNuove, richiesteTotali, articoli, articoliPubblicati, recensioni, lavori }
}

/* --- IMMAGINI ------------------------------------------------------------- */

/** Lato massimo, in pixel, per ogni uso: oltre non serve a nessuno schermo. */
const LATO_MASSIMO: Record<CartellaImmagini, number> = {
  articoli: 1600,
  lavori: 1400,
  recensioni: 400,
}

/**
 * Riduce una foto nel browser prima di caricarla: un telefono scatta a
 * 12 megapixel e 4 MB, il sito ne mostra 700 pixel. createImageBitmap
 * raddrizza da solo le foto girate (EXIF). Torna WebP dove il browser sa
 * scriverlo, altrimenti JPEG.
 */
async function riduci(file: File, latoMassimo: number, qualita = 0.82): Promise<Blob> {
  let sorgente: ImageBitmap | HTMLImageElement
  try {
    sorgente = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    // Browser senza createImageBitmap: si passa da un <img> classico.
    sorgente = await new Promise<HTMLImageElement>((ok, no) => {
      const img = new Image()
      img.onload = () => ok(img)
      img.onerror = () => no(new Error('Immagine non leggibile'))
      img.src = URL.createObjectURL(file)
    })
  }

  const larghezza = 'width' in sorgente ? sorgente.width : 0
  const altezza = 'height' in sorgente ? sorgente.height : 0
  if (!larghezza || !altezza) throw new Error('Immagine non leggibile')

  const scala = Math.min(1, latoMassimo / Math.max(larghezza, altezza))
  const tela = document.createElement('canvas')
  tela.width = Math.round(larghezza * scala)
  tela.height = Math.round(altezza * scala)
  const ctx = tela.getContext('2d')
  if (!ctx) throw new Error('Canvas non disponibile')
  ctx.drawImage(sorgente, 0, 0, tela.width, tela.height)
  if ('close' in sorgente) sorgente.close()

  const blob = await new Promise<Blob | null>((ok) => tela.toBlob(ok, 'image/webp', qualita))
  if (blob && blob.type === 'image/webp') return blob

  const jpeg = await new Promise<Blob | null>((ok) => tela.toBlob(ok, 'image/jpeg', qualita))
  if (!jpeg) throw new Error('Immagine non convertibile')
  return jpeg
}

function inDataUrl(blob: Blob): Promise<string> {
  return new Promise((ok, no) => {
    const lettore = new FileReader()
    lettore.onload = () => ok(String(lettore.result))
    lettore.onerror = () => no(new Error('Lettura fallita'))
    lettore.readAsDataURL(blob)
  })
}

/**
 * Carica una foto e torna l'indirizzo pubblico da salvare nel contenuto.
 * In modalita di prova torna un data URL: resta nel browser e basta.
 */
export async function caricaImmagine(file: File, cartella: CartellaImmagini): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Il file non e una immagine')

  const ridotta = await riduci(file, LATO_MASSIMO[cartella])

  if (!sb) return inDataUrl(ridotta)

  const estensione = ridotta.type === 'image/webp' ? 'webp' : 'jpg'
  const percorso = `${cartella}/${nuovoId()}.${estensione}`

  const { error } = await sb.storage.from('immagini').upload(percorso, ridotta, {
    contentType: ridotta.type,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) fallisci(error)

  return sb.storage.from('immagini').getPublicUrl(percorso).data.publicUrl
}

/* --- ACCOUNT -------------------------------------------------------------- */

export async function cambiaPassword(nuova: string): Promise<void> {
  if (!sb) throw new Error('In modalita di prova non c’e nessuna password')
  if (nuova.length < 8) throw new Error('La password deve avere almeno 8 caratteri')
  const { error } = await sb.auth.updateUser({ password: nuova })
  if (error) fallisci(error)
}

/** Manda l'email con il collegamento per scegliere una password nuova. */
export async function chiediRecupero(email: string): Promise<void> {
  if (!sb) throw new Error('In modalita di prova non c’e nessuna password')
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/` })
  if (error) fallisci(error)
}

/* --- VERIFICA IN DUE PASSAGGI --------------------------------------------- */
/*
 *  Il secondo passo dell'accesso: oltre alla password, il codice a sei cifre
 *  che l'app sul telefono (Google Authenticator o simili) cambia ogni mezzo
 *  minuto. Lo gestisce Supabase Auth. Qui si chiede se il conto ha un'app
 *  collegata, si avvia il collegamento (il QR e la chiave da scrivere a mano),
 *  si conferma il primo codice e si verifica quello di ogni accesso.
 *
 *  Il controllo vero sta nelle policy: e_admin() (supabase/aggiornamento-
 *  2026-09-due-fattori.sql) rifiuta ogni scrittura a una sessione che ha
 *  l'app collegata ma non ha ancora dato il codice. La schermata del codice
 *  evita solo di mostrare un pannello in cui non si potrebbe fare niente.
 *
 *  In modalità di prova non c'è nessun conto: il collegamento mostra un QR
 *  di esempio e "attivo" è una riga nel localStorage. Anche il secondo passo
 *  c'è: con la verifica attiva, la prova chiede il codice all'ingresso e
 *  accetta sei cifre qualunque. Serve a far vedere tutto il giro senza
 *  database, come il pulsante che entra senza password.
 */

/** Messaggio speciale: il codice scritto non corrisponde. Chi lo mostra lo traduce. */
export const CODICE_ERRATO = 'codice-errato'
/** Messaggio speciale: la verifica in due passaggi è spenta nel progetto Supabase. */
export const DUE_FATTORI_SPENTI = 'due-fattori-spenti'

export type StatoDueFattori = {
  /** Il conto ha un'app collegata e confermata. */
  attiva: boolean
  /** L'app c'è ma questa sessione non ha ancora dato il codice: il pannello resta chiuso. */
  daVerificare: boolean
  /** L'identificativo del collegamento, per toglierlo. */
  fattoreId: string | null
}

export type AvvioDueFattori = {
  fattoreId: string
  /** Il QR come SVG: una stringa, con o senza il prefisso data:. */
  qr: string
  /** La chiave da scrivere a mano se la fotocamera non collabora. */
  chiave: string
}

/** Il nome che compare nell'app accanto al codice. */
const NOME_FATTORE = 'MDA Impresa Edile'

const CHIAVE_PROVA_2FA = 'mda-admin-prova-2fa'
/** Il codice già dato in questa apertura del browser, sempre in modalità di prova. */
const CHIAVE_PROVA_2FA_OK = 'mda-admin-prova-2fa-ok'

/** Il collegamento confermato, se c'è. Rilegge dal server: un fattore tolto da Supabase sparisce subito. */
async function fattoreConfermato(cliente: SupabaseClient): Promise<{ id: string } | null> {
  const { data, error } = await cliente.auth.mfa.listFactors()
  if (error) fallisci(error)
  const attivo = data.totp.find((f) => f.status === 'verified')
  return attivo ? { id: attivo.id } : null
}

/** true se il codice scritto non corrisponde: l'unico errore che si spiega al cliente con parole sue. */
function codiceRifiutato(errore: { message: string; code?: string }): boolean {
  return errore.code === 'mfa_verification_failed' || /invalid totp|invalid code/i.test(errore.message)
}

export async function statoDueFattori(): Promise<StatoDueFattori> {
  if (!sb) {
    let attiva = false
    let dato = false
    try {
      attiva = localStorage.getItem(CHIAVE_PROVA_2FA) === '1'
      dato = sessionStorage.getItem(CHIAVE_PROVA_2FA_OK) === '1'
    } catch {
      /* modalità privata: resta spenta */
    }
    return { attiva, daVerificare: attiva && !dato, fattoreId: attiva ? 'prova' : null }
  }

  const fattore = await fattoreConfermato(sb)
  if (!fattore) return { attiva: false, daVerificare: false, fattoreId: null }

  const { data, error } = await sb.auth.mfa.getAuthenticatorAssuranceLevel()
  if (error) fallisci(error)
  return { attiva: true, daVerificare: data.currentLevel !== 'aal2', fattoreId: fattore.id }
}

/**
 * Avvia il collegamento: Supabase genera il segreto, il QR e la chiave.
 * Un tentativo lasciato a metà (QR mostrato, codice mai scritto) resta sul
 * server come fattore non confermato e bloccherebbe il prossimo con lo stesso
 * nome: prima si ripulisce.
 */
export async function iniziaDueFattori(): Promise<AvvioDueFattori> {
  if (!sb) return { fattoreId: 'prova', qr: qrDiProva(), chiave: 'PROVA2QNJ7XK4HL6MW3YC5DRPROVA2QN' }

  const elenco = await sb.auth.mfa.listFactors()
  if (elenco.error) fallisci(elenco.error)
  for (const f of elenco.data.all) {
    if (f.factor_type === 'totp' && f.status !== 'verified') await sb.auth.mfa.unenroll({ factorId: f.id })
  }

  const { data, error } = await sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: NOME_FATTORE })
  if (error) {
    const spenta = error.code === 'mfa_totp_enroll_not_enabled' || /not enabled|disabled/i.test(error.message)
    throw new Error(spenta ? DUE_FATTORI_SPENTI : error.message)
  }
  return { fattoreId: data.id, qr: data.totp.qr_code, chiave: data.totp.secret }
}

/** Conferma il collegamento con il primo codice dell'app. Da qui in poi la sessione è verificata. */
export async function confermaDueFattori(fattoreId: string, codice: string): Promise<void> {
  if (!sb) {
    try {
      localStorage.setItem(CHIAVE_PROVA_2FA, '1')
      // Appena collegata, la verifica è già superata: il codice lo si è
      // appena scritto, non ha senso richiederlo subito.
      sessionStorage.setItem(CHIAVE_PROVA_2FA_OK, '1')
    } catch {
      /* vale per questa pagina */
    }
    return
  }
  const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: fattoreId, code: codice })
  if (error) throw new Error(codiceRifiutato(error) ? CODICE_ERRATO : error.message)
}

/**
 * Il codice di un accesso: apre e chiude la sfida sul fattore confermato.
 * Senza fattore (tolto da Supabase nel frattempo) non c'è niente da
 * verificare e si passa: la schermata del codice non deve diventare una
 * porta chiusa per sempre.
 */
export async function verificaDueFattori(codice: string): Promise<void> {
  if (!sb) {
    // In prova non c'è nessun segreto da confrontare: sei cifre qualunque
    // passano, e il segno vale finché il browser resta aperto.
    try {
      sessionStorage.setItem(CHIAVE_PROVA_2FA_OK, '1')
    } catch {
      /* il codice verrà richiesto di nuovo, poco male */
    }
    return
  }
  const fattore = await fattoreConfermato(sb)
  if (!fattore) return
  const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: fattore.id, code: codice })
  if (error) throw new Error(codiceRifiutato(error) ? CODICE_ERRATO : error.message)
}

/** Toglie il collegamento: da quel momento basta la password. Serve una sessione già verificata. */
export async function rimuoviDueFattori(fattoreId: string): Promise<void> {
  if (!sb) {
    try {
      localStorage.removeItem(CHIAVE_PROVA_2FA)
      sessionStorage.removeItem(CHIAVE_PROVA_2FA_OK)
    } catch {
      /* pazienza */
    }
    return
  }
  const { error } = await sb.auth.mfa.unenroll({ factorId: fattoreId })
  if (error) fallisci(error)
}

/**
 * Un QR finto per la modalità di prova: i tre quadrati agli angoli e un po'
 * di rumore, tanto per far vedere dove sta e quanto è grande. Non si legge.
 */
function qrDiProva(): string {
  const n = 25
  const celle: string[] = []
  const angolo = (x: number, y: number): void => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const bordo = i === 0 || i === 6 || j === 0 || j === 6
        const centro = i >= 2 && i <= 4 && j >= 2 && j <= 4
        if (bordo || centro) celle.push(`M${x + j} ${y + i}h1v1h-1z`)
      }
    }
  }
  angolo(0, 0)
  angolo(n - 7, 0)
  angolo(0, n - 7)
  let seme = 7
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const riservata = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8)
      seme = (seme * 48271) % 2147483647
      if (!riservata && seme % 5 < 2) celle.push(`M${x} ${y}h1v1h-1z`)
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><path d="${celle.join('')}" fill="#151613"/></svg>`
}
