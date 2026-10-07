import { editorialiBlog, type ArticoloBlog } from '../config/blog'
import { remoto } from './remoto'

// Il pannello può sostituire un editoriale usando lo stesso slug.
const perSlug = new Map<string, ArticoloBlog>(editorialiBlog.map((a) => [a.slug, a]))
for (const articolo of remoto.articoli) perSlug.set(articolo.slug, articolo)

export const articoliBlog = [...perSlug.values()].sort((a, b) => b.creato.localeCompare(a.creato))
