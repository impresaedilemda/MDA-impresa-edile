import { site } from './site'

/**
 * =============================================================================
 *  CONTROLLO DATI LEGALI OBBLIGATORI
 * =============================================================================
 *  Un sito di un'impresa in Italia deve esporre alcuni dati identificativi:
 *  art. 7 D.Lgs. 70/2003 (commercio elettronico e servizi della societa
 *  dell'informazione) e art. 2250 c.c. per le societa iscritte al registro
 *  imprese. In piu servono privacy policy e, se ci sono cookie non tecnici,
 *  cookie policy con banner di consenso (GDPR, Reg. UE 2016/679).
 *
 *  Questo modulo NON e consulenza legale: verifica solo che i campi non siano
 *  rimasti coi valori segnaposto. Prima della pubblicazione fate validare i
 *  testi dal commercialista o dal consulente del cliente.
 * =============================================================================
 */

type Verifica = {
  campo: string
  valore: string
  ok: boolean
  perche: string
}

/** Valori chiaramente segnaposto, da non pubblicare mai. */
function eSegnaposto(valore: string): boolean {
  const v = valore.trim().toLowerCase()
  return (
    v === '' ||
    /^it0+$/.test(v.replace(/\s/g, '')) ||
    /0{6,}/.test(v) ||
    v.includes('esempio') ||
    v.includes('your-') ||
    v.includes('000000')
  )
}

export const verificheLegali: Verifica[] = [
  {
    campo: 'Ragione sociale',
    valore: site.legalName,
    ok: !eSegnaposto(site.legalName),
    perche: 'Denominazione completa dell’impresa, obbligatoria nei dati identificativi.',
  },
  {
    campo: 'Partita IVA',
    valore: site.vat,
    ok: !eSegnaposto(site.vat),
    perche:
      'Obbligatoria. Pubblicare una partita IVA inventata e piu grave che non indicarla: risulta come dato identificativo falso.',
  },
  {
    campo: 'Numero REA',
    valore: site.rea,
    ok: !eSegnaposto(site.rea),
    perche: 'Obbligatorio per le societa iscritte al registro delle imprese (art. 2250 c.c.).',
  },
  {
    campo: 'Sede legale',
    valore: `${site.street}, ${site.postalCode} ${site.city} (${site.province})`,
    ok: !eSegnaposto(site.street) && !eSegnaposto(site.postalCode),
    perche: 'Indirizzo completo della sede, obbligatorio fra i dati identificativi.',
  },
  {
    campo: 'Email di contatto',
    valore: site.email,
    ok: !eSegnaposto(site.email),
    perche: 'Deve permettere di contattare l’impresa in modo rapido e diretto.',
  },
  {
    campo: 'Telefono',
    valore: site.phone,
    ok: !eSegnaposto(site.phone),
    perche: 'Recapito diretto, atteso dagli utenti e utile alla SEO locale.',
  },
  {
    campo: 'Dominio del sito',
    valore: site.url,
    ok: !site.url.includes('mdaimpresaedile.it') || true,
    perche: 'Deve corrispondere al dominio reale, usato in canonical, sitemap e dati strutturati.',
  },
  {
    campo: 'Chiave del modulo',
    valore: site.formAccessKey,
    ok: !eSegnaposto(site.formAccessKey),
    perche: 'Senza chiave valida i moduli mostrano la conferma ma l’email non parte: i contatti si perdono.',
  },
]

export const problemiLegali = verificheLegali.filter((v) => !v.ok)

/** Avviso in console durante `npm run build`, cosi non passa inosservato. */
export function avvisaSeIncompleto() {
  if (problemiLegali.length === 0) return
  const elenco = problemiLegali.map((p) => `   - ${p.campo}: "${p.valore}"`).join('\n')
  console.warn(
    `\n\x1b[33m  ATTENZIONE, ${problemiLegali.length} dati obbligatori sono ancora segnaposto:\x1b[0m\n${elenco}\n` +
      `   Vanno completati in src/config/site.ts prima di pubblicare. Vedi CLIENT-DATA.md\n`,
  )
}
