/**
 * =============================================================================
 *  FUNZIONE SERVER DEI MODULI DEL SITO
 * =============================================================================
 *  Riceve le richieste dei due moduli e le manda per email con Resend
 *  (https://resend.com):
 *
 *   - "richiamo"    il modulo corto nell'hero: servizio, telefono, messaggio
 *   - "preventivo"  il configuratore in sei passi
 *
 *  Prima qui c'era Web3Forms, un servizio esterno a cui il browser mandava i
 *  dati direttamente. Cambiato il 9 settembre 2026: con Resend i dati passano
 *  dal nostro server, la chiave non esce mai dal server, e nell'informativa
 *  privacy c'e un responsabile del trattamento in meno da dichiarare.
 *
 *  Variabili d'ambiente, tutte su Vercel e nessuna nel codice:
 *
 *    RESEND_API_KEY   la chiave da resend.com
 *    RICHIESTE_A      dove arrivano le email (piu indirizzi: virgola)
 *    RICHIESTE_DA     il mittente, su un dominio verificato in Resend
 *
 *  ATTENZIONE, regola imparata a spese nostre: questo file NON deve importare
 *  niente da src/. Le funzioni in api/ non passano dalla build di Astro e un
 *  import verso src/ non viene transpilato: in locale sembra funzionare e in
 *  produzione la funzione muore con un errore che non si vede da nessuna
 *  parte. Tutto quello che serve sta scritto qui dentro, anche se si ripete.
 * =============================================================================
 */

type Req = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}

type Res = {
  status: (codice: number) => Res
  json: (corpo: unknown) => void
  setHeader: (nome: string, valore: string) => void
}

/** Una riga della email: etichetta a sinistra, valore a destra. */
type Riga = { etichetta: string; valore: string }

const EMAIL_VALIDA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Caratteri di controllo: in un campo di una riga sola diventano spazi. */
const CONTROLLO = /[\x00-\x1f\x7f]/g

/**
 * Da dove il modulo puo arrivare: il sito vero, le anteprime di Vercel (cosi
 * una bozza si puo provare prima di pubblicarla) e la macchina di chi
 * sviluppa. Tutto il resto e una pagina altrui che invia per conto di un
 * visitatore, e non ci interessa.
 */
const ORIGINI = [
  /^https:\/\/(www\.)?mdaimpresaedile\.it$/,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
]

/**
 * Freno per indirizzo IP. Vive quanto vive l'istanza, quindi non ferma un
 * attacco distribuito: ferma quello che succede davvero, cioe una persona
 * o uno script che ripreme invio venti volte. Un tetto vero su tutte le
 * istanze richiederebbe un archivio condiviso.
 */
const TETTO = 5
const FINESTRA_MS = 10 * 60 * 1000
const visti = new Map<string, number[]>()

/**
 * Quanto aspettiamo Resend prima di rinunciare. Vercel concede dieci secondi
 * alla funzione, quindi la nostra scadenza sta sotto: cosi la persona riceve
 * un errore chiaro invece di una risposta troncata.
 */
const SCADENZA_MS = 9_000

/* --- Colori del sito, per la email ---------------------------------------- */
const CREMA = '#f7f4eb'
const NERO = '#151613'
const TAUPE = '#8e7e6a'

/* --- Utilita -------------------------------------------------------------- */

function testo(valore: unknown, massimo: number): string {
  return typeof valore === 'string' ? valore.replace(CONTROLLO, ' ').trim().slice(0, massimo) : ''
}

/** Il messaggio lungo tiene gli a capo: li togliamo solo dai campi di una riga. */
function testoLungo(valore: unknown, massimo: number): string {
  return typeof valore === 'string'
    ? valore.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, ' ').trim().slice(0, massimo)
    : ''
}

/** Un telefono plausibile: da 6 a 20 cifre, piu i simboli che la gente scrive. */
function telefonoValido(valore: string): boolean {
  const cifre = valore.replace(/\D/g, '')
  return cifre.length >= 6 && cifre.length <= 20 && /^[\d\s+().\-/]+$/.test(valore)
}

function scappa(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function primoIp(intestazione: string | string[] | undefined): string {
  const grezzo = Array.isArray(intestazione) ? intestazione[0] : intestazione
  return (grezzo ?? '').split(',')[0]?.trim() || 'sconosciuto'
}

function troppiTentativi(ip: string): boolean {
  const adesso = Date.now()
  const recenti = (visti.get(ip) ?? []).filter((t) => adesso - t < FINESTRA_MS)
  recenti.push(adesso)
  visti.set(ip, recenti)

  // La mappa non deve crescere all'infinito su un'istanza longeva.
  if (visti.size > 500) {
    for (const [chiave, tempi] of visti) {
      if (tempi.every((t) => adesso - t >= FINESTRA_MS)) visti.delete(chiave)
    }
  }

  return recenti.length > TETTO
}

/* --- La email ------------------------------------------------------------- */

function corpoTesto(righe: Riga[]): string {
  return righe.map((r) => `${r.etichetta}: ${r.valore}`).join('\n')
}

function corpoHtml(titolo: string, righe: Riga[]): string {
  const celle = righe
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 16px 10px 0;vertical-align:top;font-size:13px;color:${TAUPE};white-space:nowrap">${scappa(r.etichetta)}</td>
        <td style="padding:10px 0;vertical-align:top;font-size:15px;color:${NERO};line-height:1.6">${scappa(r.valore).replace(/\n/g, '<br>')}</td>
      </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="it">
<body style="margin:0;padding:24px;background:${CREMA};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;border:1px solid rgba(21,22,19,0.1)">
    <tr>
      <td style="padding:28px 28px 8px">
        <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${TAUPE};font-weight:700">MDA Impresa Edile</p>
        <h1 style="margin:10px 0 0;font-size:21px;font-weight:600;color:${NERO}">${scappa(titolo)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 28px 28px">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${celle}</table>
      </td>
    </tr>
  </table>
  <p style="max-width:600px;margin:16px auto 0;font-size:12px;color:${TAUPE};text-align:center">
    Inviato dal modulo su mdaimpresaedile.it
  </p>
</body>
</html>`
}

/* --- Handler -------------------------------------------------------------- */

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ errore: 'Usare POST' })
  }

  const origine = (Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin) ?? ''
  if (!ORIGINI.some((r) => r.test(origine))) {
    return res.status(403).json({ errore: 'Origine non ammessa' })
  }

  const dati = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as Record<string, unknown>

  // Trappola anti-spam: il campo e invisibile, se e pieno e un robot.
  // Rispondiamo ok per non insegnargli come si fa.
  if (testo(dati.botcheck, 10)) return res.status(200).json({ ok: true })

  const tipo = dati.tipo === 'preventivo' ? 'preventivo' : 'richiamo'
  const telefono = testo(dati.telefono, 40)
  const nome = testo(dati.nome, 120)
  const email = testo(dati.email, 160).toLowerCase()
  const servizio = testo(dati.servizio, 160)
  const messaggio = testoLungo(dati.messaggio, 3000)
  const comune = testo(dati.comune, 120)
  const cap = testo(dati.cap, 10)
  const pagina = testo(dati.pagina, 300)
  const codiceLink = testo(dati.codice_link, 60)
  const privacy = dati.privacy === true || dati.privacy === 'on' || dati.privacy === 'true'

  if (!telefono) return res.status(400).json({ errore: 'Manca il numero di telefono' })
  if (!telefonoValido(telefono)) return res.status(400).json({ errore: 'Numero di telefono non valido' })
  if (email && !EMAIL_VALIDA.test(email)) return res.status(400).json({ errore: 'Indirizzo email non valido' })
  if (!privacy) return res.status(400).json({ errore: 'Serve la presa visione dell’informativa privacy' })
  if (tipo === 'preventivo' && !nome) return res.status(400).json({ errore: 'Manca il nome' })

  const ip = primoIp(req.headers['x-forwarded-for'])
  if (troppiTentativi(ip)) {
    return res.status(429).json({ errore: 'Troppi tentativi. Riprovate fra qualche minuto.' })
  }

  const chiave = process.env.RESEND_API_KEY
  const a = (process.env.RICHIESTE_A ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const da = (process.env.RICHIESTE_DA ?? '').trim()

  if (!chiave || a.length === 0 || !da) {
    console.error('Modulo non configurato: mancano RESEND_API_KEY, RICHIESTE_A o RICHIESTE_DA')
    return res.status(500).json({ errore: 'Il modulo non è ancora configurato' })
  }

  /* --- Le righe della email ----------------------------------------------- */

  const righe: Riga[] = []
  if (nome) righe.push({ etichetta: 'Nome', valore: nome })
  righe.push({ etichetta: 'Telefono', valore: telefono })
  if (email) righe.push({ etichetta: 'Email', valore: email })
  if (servizio) righe.push({ etichetta: 'Intervento', valore: servizio })
  if (comune) righe.push({ etichetta: 'Comune', valore: cap ? `${comune} (${cap})` : comune })

  // Le risposte del configuratore arrivano come oggetto piatto di stringhe.
  // "intervento" e gia uscito come "Intervento" poco sopra, quindi si salta
  // quello che ripeterebbe una riga gia scritta: una email con due volte la
  // stessa voce sembra sbagliata anche quando non lo e.
  if (tipo === 'preventivo' && typeof dati.dettagli === 'object' && dati.dettagli !== null) {
    const gia = new Set(righe.map((r) => r.etichetta.toLowerCase()))
    for (const [chiaveDettaglio, valore] of Object.entries(dati.dettagli as Record<string, unknown>).slice(0, 20)) {
      const scritto = testo(valore, 200)
      if (!scritto) continue
      const etichetta = testo(chiaveDettaglio, 60).replace(/[_-]+/g, ' ')
      const bella = etichetta.charAt(0).toUpperCase() + etichetta.slice(1)
      if (gia.has(bella.toLowerCase())) continue
      gia.add(bella.toLowerCase())
      righe.push({ etichetta: bella, valore: scritto })
    }
  }

  if (messaggio) righe.push({ etichetta: 'Messaggio', valore: messaggio })
  if (codiceLink) righe.push({ etichetta: 'Arrivato dal link', valore: codiceLink })
  if (pagina) righe.push({ etichetta: 'Pagina', valore: pagina })

  const titolo = tipo === 'preventivo' ? 'Nuova richiesta di preventivo' : 'Richiesta di essere richiamato'
  const oggetto =
    tipo === 'preventivo'
      ? `Nuova richiesta di preventivo${servizio ? `: ${servizio}` : ''}`
      : `Richiesta di richiamo${servizio ? `: ${servizio}` : ''}`

  /* --- Invio -------------------------------------------------------------- */

  const annulla = new AbortController()
  const scadenza = setTimeout(() => annulla.abort(), SCADENZA_MS)

  try {
    const risposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: annulla.signal,
      headers: {
        Authorization: `Bearer ${chiave}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: da,
        to: a,
        // Il tasto "Rispondi" del programma di posta va dritto al cliente.
        ...(email ? { reply_to: email } : {}),
        subject: oggetto,
        text: corpoTesto(righe),
        html: corpoHtml(titolo, righe),
      }),
    })

    clearTimeout(scadenza)

    if (!risposta.ok) {
      console.error('Resend ha risposto', risposta.status, await risposta.text())
      return res.status(502).json({ errore: 'Non è stato possibile inviare l’email' })
    }

    return res.status(200).json({ ok: true })
  } catch (errore) {
    clearTimeout(scadenza)
    console.error('Invio non riuscito', errore)
    return res.status(500).json({ errore: 'Non è stato possibile inviare l’email' })
  }
}
