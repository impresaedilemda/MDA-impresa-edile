import { site } from './site'

/**
 * =============================================================================
 *  PAGINE PER COMUNE (SEO locale, fase 2)
 * =============================================================================
 *  Una pagina per ogni comune servito: "rifacimento tetto <comune>" e le
 *  ricerche affini si vincono con una pagina dedicata, non con la home.
 *
 *  L'elenco viene da site.areaServed: aggiungere un comune li crea
 *  automaticamente la pagina, il link nel footer e la voce nella sitemap.
 *
 *  ONESTA DEI CONTENUTI: queste pagine dichiarano che l'impresa LAVORA nel
 *  comune (vero, e la zona di intervento). Non inventano cantieri, recensioni
 *  o sedi locali. Niente "i nostri progetti a X" finche non esistono davvero.
 * =============================================================================
 */

/** Trasforma "Palazzolo sull'Oglio" in "palazzolo-sull-oglio". */
export function slugify(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // accenti
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export type Zona = {
  nome: string
  slug: string
  /** Frase distintiva della pagina, per non avere testi fotocopia. */
  taglio: string
}

/**
 * Ogni comune riceve un "taglio" diverso: un tema vero dell'attivita,
 * ruotato in modo deterministico. Cosi le pagine condividono la struttura
 * ma non sono l'una la fotocopia dell'altra (il contenuto duplicato
 * vanifica la SEO locale).
 */
const tagli = [
  'Il nostro capocantiere effettua i sopralluoghi in zona di persona, salendo sulla copertura: la valutazione non si fa mai da terra.',
  'La squadra arriva in cantiere con mezzi e attrezzature propri, ponteggi inclusi: nessun costo di noleggio scaricato sul preventivo.',
  'Interveniamo anche per singole riparazioni urgenti: una tegola rotta oggi costa poco, un travetto marcito fra due inverni costa molto.',
  'Seguiamo tanto le abitazioni private quanto i condomini, con la documentazione nel formato che gli amministratori richiedono.',
  'Lavoriamo su coperture di ogni epoca: dai coppi recuperati dei centri storici alle lamiere coibentate dei capannoni.',
  'Ogni intervento chiude con collaudo finale insieme al proprietario e garanzia scritta, non con una stretta di mano.',
  'Il preventivo arriva scritto, voce per voce, e il prezzo firmato non cambia in corso d’opera.',
  'Prima di proporre un rifacimento completo verifichiamo sempre se una manutenzione mirata basta: capita piu spesso di quanto si creda.',
]

export const zone: Zona[] = site.areaServed.map((nome, i) => ({
  nome,
  slug: slugify(nome),
  taglio: tagli[i % tagli.length],
}))

/** La zona principale (la citta) resta coperta dalla home. */
export const zoneSecondarie = zone.slice(1)
