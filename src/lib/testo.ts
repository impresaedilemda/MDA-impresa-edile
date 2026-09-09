/**
 * =============================================================================
 *  TESTO DEGLI ARTICOLI: dalla sintassi ai blocchi, e dai blocchi all'HTML
 * =============================================================================
 *  Gli articoli del blog si scrivono con una sintassi minima, la stessa
 *  dell'editor del pannello:
 *
 *    riga vuota            nuovo paragrafo
 *    ## Sottotitolo        titolo di sezione (anche ###)
 *    - voce                elenco puntato (anche *)
 *    **grassetto**         grassetto
 *    *corsivo*             corsivo
 *    [testo](indirizzo)    collegamento
 *    ![descrizione](url)   immagine
 *
 *  Questo modulo non tocca il DOM e non conosce Astro: lo usano sia il sito
 *  quando viene generato, sia il pannello nel browser, sia la pagina del blog
 *  che si disegna da sola per gli articoli pubblicati dopo l'ultima build.
 *  Una sola grammatica, tre lettori: cosi l'anteprima nel pannello e la pagina
 *  pubblica non possono divergere.
 *
 *  L'HTML che esce di qui e SICURO per costruzione: ogni testo passa da
 *  `scappa`, e negli attributi entrano solo indirizzi accettati da
 *  `indirizzoSicuro`. Non esiste nessun punto in cui una stringa scritta
 *  dall'utente finisca nell'HTML senza passare di la.
 * =============================================================================
 */

/* --- TIPI ----------------------------------------------------------------- */

export type Pezzo =
  | { genere: 'testo'; testo: string }
  | { genere: 'acapo' }
  | { genere: 'forte'; dentro: Pezzo[] }
  | { genere: 'corsivo'; dentro: Pezzo[] }
  | { genere: 'link'; url: string | null; dentro: Pezzo[] }
  | { genere: 'immagine'; url: string; alt: string }

export type Blocco =
  | { genere: 'titolo'; pezzi: Pezzo[] }
  | { genere: 'elenco'; voci: Pezzo[][] }
  | { genere: 'paragrafo'; pezzi: Pezzo[] }
  | { genere: 'figura'; url: string; alt: string }

/* --- INDIRIZZI ------------------------------------------------------------ */

/** Lascia passare solo quello che si puo aprire senza rischi. */
export function indirizzoSicuro(grezzo: string): string | null {
  const valore = grezzo.trim()
  if (!valore) return null
  if (valore.startsWith('/') || valore.startsWith('#')) return valore
  if (/^https?:\/\//i.test(valore)) return valore
  if (/^mailto:/i.test(valore)) return valore
  // javascript:, data: e compagnia restano fuori
  return null
}

/* --- RIGA: la sintassi dentro un paragrafo --------------------------------- */

/** immagine, link, grassetto, corsivo: in quest'ordine, il doppio prima del singolo. */
const REGOLA = /!\[([^\]]*)\]\(([^)\s]*)\)|\[([^\]]*)\]\(([^)\s]*)\)|\*\*([\s\S]+?)\*\*|\*([\s\S]+?)\*/g

/** Testo semplice, con i ritorni a capo dentro un paragrafo mantenuti. */
function pezziSemplici(testo: string): Pezzo[] {
  const pezzi: Pezzo[] = []
  testo.split('\n').forEach((riga, i) => {
    if (i > 0) pezzi.push({ genere: 'acapo' })
    if (riga) pezzi.push({ genere: 'testo', testo: riga })
  })
  return pezzi
}

/** Trasforma la sintassi di una riga in pezzi, anche annidati. */
export function inPezzi(testo: string): Pezzo[] {
  const pezzi: Pezzo[] = []
  const regola = new RegExp(REGOLA.source, 'g')
  let ultimo = 0
  let trovato: RegExpExecArray | null

  while ((trovato = regola.exec(testo)) !== null) {
    if (trovato.index > ultimo) pezzi.push(...pezziSemplici(testo.slice(ultimo, trovato.index)))

    if (trovato[2] !== undefined) {
      const url = indirizzoSicuro(trovato[2])
      if (url) pezzi.push({ genere: 'immagine', url, alt: trovato[1] ?? '' })
    } else if (trovato[4] !== undefined) {
      pezzi.push({ genere: 'link', url: indirizzoSicuro(trovato[4]), dentro: inPezzi(trovato[3] ?? '') })
    } else if (trovato[5] !== undefined) {
      pezzi.push({ genere: 'forte', dentro: inPezzi(trovato[5]) })
    } else if (trovato[6] !== undefined) {
      pezzi.push({ genere: 'corsivo', dentro: inPezzi(trovato[6]) })
    }

    ultimo = trovato.index + trovato[0].length
  }

  if (ultimo < testo.length) pezzi.push(...pezziSemplici(testo.slice(ultimo)))
  return pezzi
}

/* --- BLOCCHI: paragrafi, titoli, elenchi, figure --------------------------- */

/** Un paragrafo fatto di una sola immagine diventa una figura a tutta larghezza. */
function soloImmagine(pezzi: Pezzo[]): Extract<Pezzo, { genere: 'immagine' }> | null {
  const pieni = pezzi.filter((p) => !(p.genere === 'testo' && p.testo.trim() === '') && p.genere !== 'acapo')
  return pieni.length === 1 && pieni[0].genere === 'immagine' ? pieni[0] : null
}

/** Righe vuote fra i paragrafi, "## " per i sottotitoli, "- " per gli elenchi. */
export function inBlocchi(sorgente: string): Blocco[] {
  const blocchi: Blocco[] = []
  let paragrafo: string[] = []
  let elenco: string[] = []

  const chiudiParagrafo = () => {
    if (paragrafo.length === 0) return
    const pezzi = inPezzi(paragrafo.join('\n'))
    const figura = soloImmagine(pezzi)
    blocchi.push(figura ? { genere: 'figura', url: figura.url, alt: figura.alt } : { genere: 'paragrafo', pezzi })
    paragrafo = []
  }
  const chiudiElenco = () => {
    if (elenco.length === 0) return
    blocchi.push({ genere: 'elenco', voci: elenco.map(inPezzi) })
    elenco = []
  }

  for (const grezza of (sorgente ?? '').replace(/\r\n?/g, '\n').split('\n')) {
    const riga = grezza.trimEnd()

    if (riga.trim() === '') {
      chiudiElenco()
      chiudiParagrafo()
      continue
    }

    const titolo = /^#{2,3}\s+(.*)$/.exec(riga)
    if (titolo) {
      chiudiElenco()
      chiudiParagrafo()
      blocchi.push({ genere: 'titolo', pezzi: inPezzi(titolo[1]) })
      continue
    }

    if (/^[-*]\s+/.test(riga)) {
      chiudiParagrafo()
      elenco.push(riga.replace(/^[-*]\s+/, ''))
      continue
    }

    chiudiElenco()
    paragrafo.push(riga)
  }

  chiudiElenco()
  chiudiParagrafo()
  return blocchi
}

/* --- TESTO SEMPLICE ------------------------------------------------------- */

function testoDeiPezzi(pezzi: Pezzo[]): string {
  return pezzi
    .map((p) => {
      switch (p.genere) {
        case 'testo':
          return p.testo
        case 'acapo':
          return ' '
        case 'immagine':
          return ''
        default:
          return testoDeiPezzi(p.dentro)
      }
    })
    .join('')
}

/**
 * Il testo nudo, senza segni ne immagini: serve alla descrizione per Google,
 * all'anteprima nelle liste e al conto delle parole. Tagliato a `massimo`
 * caratteri su una parola intera, con i puntini se manca qualcosa.
 */
export function testoSemplice(sorgente: string, massimo = 0): string {
  const intero = inBlocchi(sorgente)
    .map((b) => {
      if (b.genere === 'figura') return ''
      if (b.genere === 'elenco') return b.voci.map(testoDeiPezzi).join('. ')
      return testoDeiPezzi(b.pezzi)
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!massimo || intero.length <= massimo) return intero
  const taglio = intero.lastIndexOf(' ', massimo - 1)
  return `${intero.slice(0, taglio > massimo / 2 ? taglio : massimo).trimEnd()}…`
}

/** Minuti di lettura, mai meno di uno: duecento parole al minuto. */
export function tempoLettura(sorgente: string): number {
  const parole = testoSemplice(sorgente).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(parole / 200))
}

/* --- HTML ----------------------------------------------------------------- */

/** L'unica porta verso l'HTML: ogni carattere pericoloso diventa un'entita. */
export function scappa(testo: string): string {
  return testo
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function htmlDeiPezzi(pezzi: Pezzo[]): string {
  return pezzi
    .map((p) => {
      switch (p.genere) {
        case 'testo':
          return scappa(p.testo)
        case 'acapo':
          return '<br>'
        case 'forte':
          return `<strong>${htmlDeiPezzi(p.dentro)}</strong>`
        case 'corsivo':
          return `<em>${htmlDeiPezzi(p.dentro)}</em>`
        case 'link': {
          const dentro = htmlDeiPezzi(p.dentro)
          if (!p.url) return dentro
          const esterno = /^https?:\/\//i.test(p.url)
          return `<a href="${scappa(p.url)}"${esterno ? ' target="_blank" rel="noopener noreferrer"' : ''}>${dentro}</a>`
        }
        case 'immagine':
          return `<img src="${scappa(p.url)}" alt="${scappa(p.alt)}" loading="lazy" decoding="async">`
      }
    })
    .join('')
}

/**
 * I blocchi come HTML, senza classi: chi lo incolla in pagina gli da lo stile
 * dal contenitore (vedi .prosa in global.css e l'anteprima del pannello).
 */
export function inHtml(sorgente: string): string {
  return inBlocchi(sorgente)
    .map((b) => {
      switch (b.genere) {
        case 'titolo':
          return `<h2>${htmlDeiPezzi(b.pezzi)}</h2>`
        case 'elenco':
          return `<ul>${b.voci.map((v) => `<li>${htmlDeiPezzi(v)}</li>`).join('')}</ul>`
        case 'figura':
          return `<figure><img src="${scappa(b.url)}" alt="${scappa(b.alt)}" loading="lazy" decoding="async">${
            b.alt ? `<figcaption>${scappa(b.alt)}</figcaption>` : ''
          }</figure>`
        case 'paragrafo':
          return `<p>${htmlDeiPezzi(b.pezzi)}</p>`
      }
    })
    .join('\n')
}

/** La prima immagine dell'articolo, utile come copertina quando manca. */
export function primaImmagine(sorgente: string): string | null {
  for (const b of inBlocchi(sorgente)) {
    if (b.genere === 'figura') return b.url
    if (b.genere === 'paragrafo') {
      const img = b.pezzi.find((p) => p.genere === 'immagine')
      if (img && img.genere === 'immagine') return img.url
    }
  }
  return null
}
