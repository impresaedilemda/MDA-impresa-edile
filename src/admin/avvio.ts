/**
 * Punto di partenza del pannello.
 *
 * La pagina Astro dice quale sezione mostrare con un attributo data, poi qui
 * si controlla chi sta entrando e si disegna la schermata giusta.
 *
 * Ogni sezione è una pagina statica a sé (/admin/, /admin/blog/ ...), quindi
 * non serve nessun router: i collegamenti sono <a> normali e gli indirizzi
 * funzionano anche aperti direttamente o messi nei preferiti. Le schermate si
 * caricano con import() dinamico, così chi apre le statistiche non scarica
 * anche l'editor degli articoli.
 */

import { guardia, sessione } from './accesso'
import { collegato } from './dati'
import { disegnaTelaio, type Sezione } from './telaio'
import { statoErrore } from './dom'

/** Le sezioni ammesse, per non fidarsi di quello che c'è scritto nell'HTML. */
const SEZIONI: Sezione[] = [
  'pannello',
  'richieste',
  'blog',
  'blog-modifica',
  'lavori',
  'recensioni',
  'statistiche',
  'link',
  'impostazioni',
]

/**
 * L'identificativo dell'articolo sta nell'indirizzo, non nella pagina: il sito
 * è statico e al momento della compilazione quell'id non esiste ancora.
 * /admin/blog/nuovo/ significa articolo nuovo, quindi nessun id.
 */
function idDallIndirizzo(): string | null {
  const pezzi = location.pathname.split('/').filter(Boolean)
  const ultimo = pezzi[pezzi.length - 1] ?? ''
  return ultimo === 'nuovo' || ultimo === 'blog' ? null : decodeURIComponent(ultimo)
}

async function disegnaSezione(lavoro: HTMLElement, sezione: Sezione): Promise<void> {
  switch (sezione) {
    case 'pannello':
      (await import('./pagine/pannello')).default(lavoro)
      break
    case 'richieste':
      (await import('./pagine/richieste')).default(lavoro)
      break
    case 'blog':
      (await import('./pagine/blogLista')).default(lavoro)
      break
    case 'blog-modifica':
      (await import('./pagine/blogModifica')).default(lavoro, idDallIndirizzo())
      break
    case 'lavori':
      (await import('./pagine/lavori')).default(lavoro)
      break
    case 'recensioni':
      (await import('./pagine/recensioni')).default(lavoro)
      break
    case 'statistiche':
      (await import('./pagine/statistiche')).default(lavoro)
      break
    case 'link':
      (await import('./pagine/link')).default(lavoro)
      break
    case 'impostazioni':
      (await import('./pagine/impostazioni')).default(lavoro)
      break
  }
}

/**
 * La modalita di prova serve a far vedere il pannello mentre si sviluppa:
 * si entra con un pulsante, senza password, perche senza database non c'e
 * nessuno a cui chiederla. In locale va bene. Sul sito pubblicato no: sarebbe
 * una porta aperta a chiunque indovini l'indirizzo /admin/.
 *
 * Quindi in produzione, se le chiavi Supabase non ci sono, il pannello non si
 * apre affatto e mostra come attivarlo. Il sito pubblico non se ne accorge:
 * queste pagine sono gia noindex e fuori dalla sitemap.
 */
function pannelloNonConfigurato(radice: HTMLElement): void {
  const scatola = document.createElement('div')
  scatola.style.cssText =
    'max-width:32rem;margin:12vh auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.6;color:#151613'

  const titolo = document.createElement('h1')
  titolo.textContent = 'Pannello non configurato'
  titolo.style.cssText = 'font-size:1.5rem;font-weight:600;margin:0 0 0.75rem'

  const testo = document.createElement('p')
  testo.textContent =
    'Il pannello ha bisogno del collegamento al database. Finche le variabili PUBLIC_SUPABASE_URL e PUBLIC_SUPABASE_ANON_KEY non sono impostate su Vercel, questa pagina resta chiusa: la modalita di prova esiste solo in locale, perche si entra senza password.'
  testo.style.margin = '0 0 1.25rem'

  const passi = document.createElement('p')
  passi.textContent = 'I passaggi per attivarlo sono in docs/ATTIVAZIONE-PANNELLO.md.'
  passi.style.cssText = 'margin:0 0 1.75rem;color:#5b5c56'

  const torna = document.createElement('a')
  torna.href = '/'
  torna.textContent = 'Torna al sito'
  torna.style.cssText =
    'display:inline-block;padding:0.7rem 1.3rem;border-radius:4px;background:#151613;color:#f7f4eb;text-decoration:none;font-weight:600'

  scatola.append(titolo, testo, passi, torna)
  radice.replaceChildren(scatola)
}

export async function avvia(): Promise<void> {
  const radice = document.getElementById('admin')
  if (!radice) return

  if (import.meta.env.PROD && !collegato) {
    pannelloNonConfigurato(radice)
    return
  }

  const dichiarata = radice.dataset.sezione as Sezione | undefined
  const sezione: Sezione = dichiarata && SEZIONI.includes(dichiarata) ? dichiarata : 'pannello'

  // Prima il cancello: se non passa, la guardia ha già disegnato l'accesso.
  const dentro = await guardia(radice)
  if (!dentro) return

  const chi = await sessione()
  const lavoro = disegnaTelaio(sezione, chi?.email ?? null)
  radice.replaceChildren(lavoro.closest('.adm') ?? lavoro)

  try {
    await disegnaSezione(lavoro, sezione)
  } catch (errore) {
    // Una sezione che non si carica non deve lasciare la pagina bianca: il
    // menu resta in piedi e si può almeno andare da un'altra parte.
    console.error('Sezione non caricata:', errore)
    statoErrore(lavoro, () => location.reload())
  }
}
