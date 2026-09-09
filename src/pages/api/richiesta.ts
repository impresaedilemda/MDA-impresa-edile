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
 *  PERCHE STA IN src/pages/api/ E NON IN api/ NELLA RADICE: la cartella api/
 *  nella radice e una scorciatoia di Vercel che vale per i progetti senza
 *  framework. Con il preset Astro la build e statica e quella cartella viene
 *  ignorata del tutto: provata il 9 settembre 2026, /api/richiesta rispondeva
 *  404. Da qui invece l'adattatore @astrojs/vercel la trasforma in una vera
 *  funzione, e il resto del sito resta statico pagina per pagina.
 *
 *  Il file resta comunque autonomo, senza import da src/: quello che gli
 *  serve e poco e cosi si legge tutto in un posto solo.
 * =============================================================================
 */

import type { APIRoute } from 'astro'

/** Questa rotta gira a ogni richiesta: non va congelata nella build. */
export const prerender = false

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
const NERO_2 = '#282924'
const TAUPE = '#8e7e6a'
const TAUPE_TESTO = '#736552'
const WHATSAPP = '#25d366'
const BORDO = 'rgba(21,22,19,0.10)'

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

/**
 * Le sole cifre di un numero, con il prefisso internazionale.
 * Chi scrive "340 1234567" intende un numero italiano: senza il 39 davanti
 * il collegamento di WhatsApp non apre niente.
 */
function soloCifre(numero: string): string {
  const cifre = numero.replace(/\D/g, '')
  if (numero.trim().startsWith('+')) return cifre
  if (cifre.startsWith('00')) return cifre.slice(2)
  if (cifre.startsWith('39')) return cifre
  return `39${cifre}`
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

/**
 * Una variabile d'ambiente, cercata dove puo stare.
 *
 * In produzione su Vercel le variabili sono vere variabili di processo e la
 * risposta giusta e process.env: cambiare la chiave su Vercel ha effetto
 * subito, senza ricompilare, e il valore non finisce dentro nessun pacchetto.
 *
 * In locale invece i file .env li legge Vite, che li mette in import.meta.env
 * e NON in process.env: senza questo ripiego la rotta risponderebbe sempre
 * "non configurato" mentre si sviluppa. Preso a spese nostre il 9 settembre.
 */
function variabile(nome: string): string {
  const daProcesso = typeof process !== 'undefined' ? process.env?.[nome] : undefined
  // import.meta.env esiste quando il file passa da Vite. Fuori (per esempio
  // eseguendo il modulo con node, come si fa per le prove) non c'e: senza
  // questa guardia leggere una chiave da undefined farebbe saltare la rotta.
  const ambienteVite = typeof import.meta !== 'undefined' ? (import.meta as { env?: Record<string, string | undefined> }).env : undefined
  const daVite = ambienteVite?.[nome]
  return (daProcesso ?? daVite ?? '').trim()
}

function primoIp(intestazione: string | null): string {
  return (intestazione ?? '').split(',')[0]?.trim() || 'sconosciuto'
}

/** Risposta JSON, con le intestazioni che servono sempre. */
function rispondi(codice: number, corpo: unknown, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(corpo), {
    status: codice,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  })
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

/**
 * La versione senza grafica, che alcuni programmi di posta mostrano al posto
 * dell'HTML. Qui nome e telefono vanno ripetuti: non c'e nessuna intestazione
 * grande a mostrarli.
 */
function corpoTesto(titolo: string, nome: string, telefono: string, righe: Riga[]): string {
  return [
    titolo,
    '',
    ...(nome ? [`Nome: ${nome}`] : []),
    `Telefono: ${telefono}`,
    ...righe.map((r) => `${r.etichetta}: ${r.valore}`),
  ].join('\n')
}

/**
 * La email che arriva all'impresa.
 *
 * Chi la legge quasi sempre sta in cantiere, col telefono in mano e i guanti
 * addosso. Quindi in cima non c'e un elenco di campi: c'e il nome, il numero
 * scritto grande, e tre pulsanti che partono con un dito solo. Il resto della
 * richiesta sta sotto, per quando si torna in ufficio.
 *
 * Scritta con tabelle e stili in riga perche i programmi di posta buttano via
 * i fogli di stile, e Outlook non conosce flex ne border-radius: i pulsanti
 * restano rettangoli squadrati la, e vanno bene lo stesso.
 */
function corpoHtml(opzioni: {
  titolo: string
  etichettaTipo: string
  nome: string
  telefono: string
  email: string
  righe: Riga[]
}): string {
  const { titolo, etichettaTipo, nome, telefono, email, righe } = opzioni
  const cifre = soloCifre(telefono)

  const pulsante = (indirizzo: string, testo: string, sfondo: string, colore: string) => `
    <td style="padding:0 8px 8px 0">
      <a href="${indirizzo}" style="display:inline-block;padding:13px 20px;background:${sfondo};color:${colore};font-size:14px;font-weight:700;text-decoration:none;border-radius:6px;white-space:nowrap">${scappa(testo)}</a>
    </td>`

  const pulsanti = [
    pulsante(`tel:+${cifre}`, 'Chiama ora', NERO, '#ffffff'),
    pulsante(
      `https://wa.me/${cifre}?text=${encodeURIComponent(`Buongiorno${nome ? ` ${nome.split(' ')[0]}` : ''}, la contatto da MDA Impresa Edile per la sua richiesta dal nostro sito.`)}`,
      'WhatsApp',
      WHATSAPP,
      '#ffffff',
    ),
    email
      ? pulsante(
          `mailto:${email}?subject=${encodeURIComponent('La sua richiesta a MDA Impresa Edile')}`,
          'Rispondi via email',
          '#ffffff',
          NERO,
        )
      : '',
  ]
    .filter(Boolean)
    .join('')

  const celle = righe
    .map(
      (r) => `
      <tr>
        <td style="padding:11px 18px 11px 0;vertical-align:top;font-size:13px;color:${TAUPE_TESTO};white-space:nowrap;border-bottom:1px solid ${BORDO}">${scappa(r.etichetta)}</td>
        <td style="padding:11px 0;vertical-align:top;font-size:15px;color:${NERO};line-height:1.6;border-bottom:1px solid ${BORDO}">${scappa(r.valore).replace(/\n/g, '<br>')}</td>
      </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${scappa(titolo)}</title>
</head>
<body style="margin:0;padding:24px 16px;background:${CREMA};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;margin:0 auto;border-collapse:separate">
    <tr>
      <td style="background:${NERO};border-radius:12px 12px 0 0;padding:26px 28px">
        <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${TAUPE};font-weight:700">${scappa(etichettaTipo)}</p>
        <h1 style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;color:#ffffff;line-height:1.25">${scappa(titolo)}</h1>
      </td>
    </tr>

    <tr>
      <td style="background:${NERO_2};padding:22px 28px 24px">
        ${nome ? `<p style="margin:0 0 4px;font-size:17px;font-weight:700;color:#ffffff">${scappa(nome)}</p>` : ''}
        <a href="tel:+${cifre}" style="display:inline-block;margin:0 0 18px;font-size:27px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.01em">${scappa(telefono)}</a>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${pulsanti}</tr></table>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;border-radius:0 0 12px 12px;padding:8px 28px 26px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">${celle}</table>
      </td>
    </tr>
  </table>

  <p style="max-width:620px;margin:18px auto 0;font-size:12px;line-height:1.6;color:${TAUPE_TESTO};text-align:center">
    Arrivata dal modulo su mdaimpresaedile.it.<br>
    Rispondendo a questa email si scrive direttamente a chi ha compilato il modulo.
  </p>
</body>
</html>`
}

/* --- La rotta ------------------------------------------------------------- */

/** Un GET su questo indirizzo non ha senso: si dice, invece di dare 404. */
export const GET: APIRoute = () => rispondi(405, { errore: 'Usare POST' }, { Allow: 'POST' })

export const POST: APIRoute = async ({ request }) => {
  const origine = request.headers.get('origin') ?? ''
  if (!ORIGINI.some((r) => r.test(origine))) {
    return rispondi(403, { errore: 'Origine non ammessa' })
  }

  let dati: Record<string, unknown>
  try {
    const letto = await request.json()
    dati = typeof letto === 'object' && letto !== null ? (letto as Record<string, unknown>) : {}
  } catch {
    return rispondi(400, { errore: 'Corpo della richiesta non valido' })
  }

  // Trappola anti-spam: il campo e invisibile, se e pieno e un robot.
  // Rispondiamo ok per non insegnargli come si fa.
  if (testo(dati.botcheck, 10)) return rispondi(200, { ok: true })

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

  if (!telefono) return rispondi(400, { errore: 'Manca il numero di telefono' })
  if (!telefonoValido(telefono)) return rispondi(400, { errore: 'Numero di telefono non valido' })
  if (email && !EMAIL_VALIDA.test(email)) return rispondi(400, { errore: 'Indirizzo email non valido' })
  if (!privacy) return rispondi(400, { errore: 'Serve la presa visione dell\u2019informativa privacy' })
  if (tipo === 'preventivo' && !nome) return rispondi(400, { errore: 'Manca il nome' })

  const ip = primoIp(request.headers.get('x-forwarded-for'))
  if (troppiTentativi(ip)) {
    return rispondi(429, { errore: 'Troppi tentativi. Riprovate fra qualche minuto.' }, { 'Retry-After': '600' })
  }

  const chiave = variabile('RESEND_API_KEY')
  const a = variabile('RICHIESTE_A')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const da = variabile('RICHIESTE_DA')

  if (!chiave || a.length === 0 || !da) {
    console.error('Modulo non configurato: mancano RESEND_API_KEY, RICHIESTE_A o RICHIESTE_DA')
    return rispondi(500, { errore: 'Il modulo non \u00e8 ancora configurato' })
  }

  /* --- Le righe della email ----------------------------------------------- */

  // Nome e telefono stanno gia in cima, scritti grandi: ripeterli qui sotto
  // e solo rumore. L'email invece resta, perche il pulsante non la mostra.
  const righe: Riga[] = []
  if (email) righe.push({ etichetta: 'Email', valore: email })
  if (servizio) righe.push({ etichetta: 'Intervento', valore: servizio })
  if (comune) righe.push({ etichetta: 'Comune', valore: cap ? `${comune} (${cap})` : comune })

  // Le risposte del configuratore arrivano come oggetto piatto di stringhe.
  // "intervento" e gia uscito come "Intervento" poco sopra, quindi si salta
  // quello che ripeterebbe una riga gia scritta.
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
  // "/" da solo non dice niente a chi legge: la home si chiama home.
  if (pagina) righe.push({ etichetta: 'Pagina', valore: pagina === '/' ? 'Home page' : pagina })

  const titolo = tipo === 'preventivo' ? 'Nuova richiesta di preventivo' : 'Richiesta di essere richiamato'
  const etichettaTipo = tipo === 'preventivo' ? 'Configuratore del preventivo' : 'Modulo rapido'
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
        text: corpoTesto(titolo, nome, telefono, righe),
        html: corpoHtml({ titolo, etichettaTipo, nome, telefono, email, righe }),
      }),
    })

    clearTimeout(scadenza)

    if (!risposta.ok) {
      console.error('Resend ha risposto', risposta.status, await risposta.text())
      return rispondi(502, { errore: 'Non \u00e8 stato possibile inviare l\u2019email' })
    }

    return rispondi(200, { ok: true })
  } catch (errore) {
    clearTimeout(scadenza)
    console.error('Invio non riuscito', errore)
    return rispondi(500, { errore: 'Non \u00e8 stato possibile inviare l\u2019email' })
  }
}
