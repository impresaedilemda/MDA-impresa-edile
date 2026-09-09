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

export async function avvia(): Promise<void> {
  const radice = document.getElementById('admin')
  if (!radice) return

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
