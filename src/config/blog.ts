import type { Articolo } from '../lib/tipi'
import manutenzione from '../editorial/blog/manutenzione-tetto-autunno-pordenone.md?raw'
import infiltrazioni from '../editorial/blog/infiltrazioni-tetto-pioggia-portogruaro-latisana.md?raw'
import preventivo from '../editorial/blog/preventivo-rifacimento-tetto-pordenone-veneto.md?raw'

export type ArticoloBlog = Articolo & {
  metaTitle?: string
  copertinaAlt?: string
  illustrazione?: boolean
}

// Questi articoli si aggiornano nel repository; gli articoli del pannello
// restano in Supabase. Gli identificativi editoriali non sono ID del database.
const pubblicazione = '2026-10-07T20:00:00.000Z'
const articoli = [
  {
    slug: 'manutenzione-tetto-autunno-pordenone',
    titolo: 'Manutenzione del tetto in autunno a Pordenone: cosa controllare',
    metaTitle: 'Manutenzione tetto in autunno a Pordenone | MDA',
    estratto: 'Tetto, grondaie e raccordi: cosa far controllare prima dell’inverno a Pordenone, Sacile e San Vito al Tagliamento. Prepara il sopralluogo con la checklist MDA.',
    copertina: '/images/blog/manutenzione-grondaie-autunno.webp',
    copertinaAlt: 'Illustrazione AI di una grondaia in rame sotto un tetto in coppi',
    contenuto: manutenzione,
  },
  {
    slug: 'infiltrazioni-tetto-pioggia-portogruaro-latisana',
    titolo: 'Infiltrazioni dal tetto dopo la pioggia a Portogruaro e Latisana',
    metaTitle: 'Infiltrazioni tetto: Portogruaro e Latisana | MDA',
    estratto: 'Acqua dal tetto dopo la pioggia? Cosa segnalare, cause da verificare e come chiedere un sopralluogo MDA per infiltrazioni a Portogruaro e Latisana.',
    copertina: '/images/blog/infiltrazioni-copertura-piana.webp',
    copertinaAlt: 'Illustrazione AI di una copertura piana con ristagni e membrana deteriorata',
    contenuto: infiltrazioni,
  },
  {
    slug: 'preventivo-rifacimento-tetto-pordenone-veneto',
    titolo: 'Preventivo per rifare il tetto a Pordenone e in Veneto: come confrontarlo',
    metaTitle: 'Preventivo rifacimento tetto: Pordenone e Veneto | MDA',
    estratto: 'Come confrontare i preventivi per rifare il tetto a Pordenone e in Veneto: materiali, isolamento, lattonerie, ponteggi ed esclusioni da verificare.',
    copertina: '/images/blog/preventivo-rifacimento-copertura.webp',
    copertinaAlt: 'Illustrazione AI di un tetto in tegole con raccordo al camino',
    contenuto: preventivo,
  },
]

export const editorialiBlog: ArticoloBlog[] = articoli.map((articolo) => ({
  ...articolo,
  id: `editoriale-${articolo.slug}`,
  bozza: false,
  creato: pubblicazione,
  aggiornato: pubblicazione,
  illustrazione: true,
}))
