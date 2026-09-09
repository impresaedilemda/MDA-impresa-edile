/**
 * I blocchi di testo.ts disegnati come elementi veri del DOM.
 *
 * Serve dove l'HTML non si puo incollare: nell'anteprima del pannello e nella
 * pagina del blog che si costruisce nel browser. Si usa createElement e
 * textContent, mai innerHTML: il testo lo scrive l'utente, e una stringa
 * infilata nel DOM basterebbe a far girare codice altrui nella pagina.
 */

import { inBlocchi, type Blocco, type Pezzo } from './testo'

function nodoPezzi(pezzi: Pezzo[]): Node[] {
  return pezzi.map((p) => {
    switch (p.genere) {
      case 'testo':
        return document.createTextNode(p.testo)
      case 'acapo':
        return document.createElement('br')
      case 'forte': {
        const e = document.createElement('strong')
        e.append(...nodoPezzi(p.dentro))
        return e
      }
      case 'corsivo': {
        const e = document.createElement('em')
        e.append(...nodoPezzi(p.dentro))
        return e
      }
      case 'link': {
        if (!p.url) {
          const s = document.createElement('span')
          s.append(...nodoPezzi(p.dentro))
          return s
        }
        const a = document.createElement('a')
        a.href = p.url
        if (/^https?:\/\//i.test(p.url)) {
          a.target = '_blank'
          a.rel = 'noopener noreferrer'
        }
        a.append(...nodoPezzi(p.dentro))
        return a
      }
      case 'immagine': {
        const img = document.createElement('img')
        img.src = p.url
        img.alt = p.alt
        img.loading = 'lazy'
        img.decoding = 'async'
        return img
      }
    }
  })
}

function nodoBlocco(b: Blocco): HTMLElement {
  switch (b.genere) {
    case 'titolo': {
      const h = document.createElement('h2')
      h.append(...nodoPezzi(b.pezzi))
      return h
    }
    case 'elenco': {
      const ul = document.createElement('ul')
      for (const voce of b.voci) {
        const li = document.createElement('li')
        li.append(...nodoPezzi(voce))
        ul.append(li)
      }
      return ul
    }
    case 'figura': {
      const fig = document.createElement('figure')
      const img = document.createElement('img')
      img.src = b.url
      img.alt = b.alt
      img.loading = 'lazy'
      img.decoding = 'async'
      fig.append(img)
      if (b.alt) {
        const didascalia = document.createElement('figcaption')
        didascalia.textContent = b.alt
        fig.append(didascalia)
      }
      return fig
    }
    case 'paragrafo': {
      const p = document.createElement('p')
      p.append(...nodoPezzi(b.pezzi))
      return p
    }
  }
}

/** Gli elementi dell'articolo, pronti da attaccare a un contenitore .prosa. */
export function disegnaTesto(sorgente: string): HTMLElement[] {
  return inBlocchi(sorgente).map(nodoBlocco)
}
