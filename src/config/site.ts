/**
 * =============================================================================
 *  MDA IMPRESA EDILE - CONFIGURAZIONE CENTRALE
 * =============================================================================
 *  Questo è l'UNICO file da modificare quando il cliente invia i suoi dati.
 *  Ogni valore marcato "TODO CLIENTE" e un segnaposto da sostituire.
 *  Vedi CLIENT-DATA.md per la checklist completa.
 *
 *  Dal settembre 2026 il cliente può cambiare da solo contatti, sede e dati
 *  legali dal pannello (Impostazioni). Quello che scrive lì arriva qui al
 *  momento della build attraverso src/lib/remoto.ts e copre il valore
 *  scritto sotto; un campo lasciato vuoto nel pannello non copre niente.
 *  Il file resta la base: senza database il sito si costruisce con questi.
 * =============================================================================
 */

import { remoto } from '../lib/remoto'

const statico = {
  /* --- Identita -------------------------------------------------------- */
  name: 'MDA Impresa Edile',
  legalName: 'MDA Impresa Edile S.r.l.', // TODO CLIENTE: ragione sociale esatta
  tagline: 'Specialisti in tetti e coperture',
  foundedYear: 2009, // TODO CLIENTE: anno di fondazione
  /**
   * Finche il cliente non conferma l'anno di fondazione, la cifra NON deve
   * uscire in pagina ne nei dati strutturati: l'anzianita dichiarata e una
   * affermazione di fatto e va pubblicata solo se vera.
   * Mettere a true SOLO insieme all'anno reale in foundedYear.
   */
  foundedYearConfermato: false,
  vat: 'IT00000000000', // TODO CLIENTE: partita IVA
  rea: 'BS-000000', // TODO CLIENTE: numero REA (opzionale, togliere se assente)

  /* --- Dati societari dell'art. 2250 c.c. -------------------------------
   * Vanno pubblicati SOLO se veri: un dato identificativo inventato e piu
   * grave di un campo assente. Finche restano stringhe vuote il footer e le
   * pagine legali semplicemente non li mostrano.
   *
   * capitaleSociale e obbligatorio per le societa di capitali (S.r.l., S.p.A.)
   * ed e la cifra effettivamente versata risultante dall'ultimo bilancio.
   * Per una ditta individuale o una S.n.c. non si compila: non esiste.
   * -------------------------------------------------------------------- */
  registroImprese: '', // TODO CLIENTE: es. "Registro delle Imprese di Venezia"
  capitaleSociale: '', // TODO CLIENTE: es. "10.000,00 EUR i.v." (solo societa di capitali)
  pec: '', // TODO CLIENTE: indirizzo PEC iscritto al registro delle imprese
  assicurazione: '', // TODO CLIENTE: compagnia e numero della polizza RC verso terzi

  /**
   * Forma giuridica reale dell'impresa. Cambia quali dati sono obbligatori:
   * una societa di capitali deve indicare anche il capitale sociale versato,
   * una ditta individuale no. 'da-confermare' finche non arriva la visura.
   */
  formaGiuridica: 'da-confermare' as 'societa-di-capitali' | 'societa-di-persone' | 'ditta-individuale' | 'da-confermare',

  /* --- Localizzazione (CRITICO PER LA SEO LOCALE) -----------------------
   * L'impresa opera fra Veneto e Friuli-Venezia Giulia (indicazione del
   * cliente). La citta esatta non e ancora confermata: Portogruaro e il
   * segnaposto piu sensato perche sta proprio al confine fra le due
   * regioni. Quando arriva la citta vera si cambia SOLO qui.
   * -------------------------------------------------------------------- */
  city: 'Portogruaro', // TODO CLIENTE: città principale da confermare
  province: 'VE', // TODO CLIENTE: sigla provincia da confermare
  /** Nome esteso della provincia. La sigla si usa SOLO fra parentesi dopo il
   *  comune (Portogruaro (VE)) e in geo.region (IT-VE): nel testo corrente
   *  si scrive sempre "provincia di Venezia", che e anche cio che si cerca. */
  provinceName: 'Venezia', // TODO CLIENTE: da confermare insieme alla sigla
  region: 'Veneto e Friuli-Venezia Giulia',
  regions: ['Veneto', 'Friuli-Venezia Giulia'], // per lo schema areaServed
  street: 'Via Esempio 12', // TODO CLIENTE: indirizzo sede
  postalCode: '30026', // TODO CLIENTE: CAP
  geo: { lat: 45.7753, lng: 12.8388 }, // TODO CLIENTE: coordinate sede

  /** Comuni serviti fra Veneto e Friuli. Alimentano la SEO locale,
   *  le pagine /zone/ e il footer. */
  areaServed: [
    // TODO CLIENTE: sostituire con i comuni realmente serviti
    'Portogruaro',
    'San Donà di Piave',
    'Pordenone',
    'Latisana',
    'Sacile',
    'Conegliano',
    'San Vito al Tagliamento',
    'Jesolo',
  ],

  /* --- Contatti -------------------------------------------------------- */
  phone: '+39 389 999 7498',
  phoneHref: '+393899997498',
  whatsapp: '393899997498', // TODO CLIENTE: confermare che questo numero ha WhatsApp attivo
  email: 'impresaedilemda@gmail.com',

  /* --- Orari (usati anche nello schema JSON-LD) ------------------------- */
  hours: {
    label: 'Lun - Sab, 08:00 - 18:00', // TODO CLIENTE
    schema: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
      { days: ['Saturday'], opens: '08:00', closes: '13:00' },
    ],
  },

  /* --- Promesse commerciali -------------------------------------------- */
  warrantyYears: 10, // TODO CLIENTE: anni di garanzia offerti
  responseHours: 24, // ore entro cui si risponde a una richiesta

  /* --- Social ----------------------------------------------------------- */
  social: {
    instagram: 'https://www.instagram.com/mdaimpresaedile',
    facebook: 'https://www.facebook.com/share/189dW2P2bb/',
  },

  /* --- Tecnico ---------------------------------------------------------- */
  /**
   * L'indirizzo pubblico del sito, usato nei dati strutturati e nei
   * breadcrumb. Segue PUBLIC_SITE_URL come astro.config.mjs: finché il
   * dominio mdaimpresaedile.it non è collegato risponde solo Vercel, e un
   * canonical verso un host che non risponde vale come assente.
   * Al cutover basta la variabile su Vercel, senza toccare il codice.
   */
  url: ((import.meta.env.PUBLIC_SITE_URL as string | undefined) ?? 'https://mda-impresa-edile-henna.vercel.app').replace(
    /\/+$/,
    '',
  ),
  locale: 'it_IT',
  lang: 'it',

  /* --- Statistiche di terze parti --------------------------------------
   * L'identificativo di Google Analytics 4 (formato G-XXXXXXXXXX). Si mette
   * come variabile d'ambiente PUBLIC_GA_ID su Vercel, non nel codice.
   *
   * Finche resta vuoto GA non viene caricato in nessun caso. Quando c'e,
   * viene caricato SOLO dopo che la persona ha accettato le statistiche nel
   * banner dei cookie: GA4 e un servizio di terze parti che scrive cookie
   * propri, quindi in Italia il consenso preventivo e obbligatorio
   * (art. 122 d.lgs. 196/2003 e linee guida cookie del Garante, 2021).
   * -------------------------------------------------------------------- */
  gaId: ((import.meta.env.PUBLIC_GA_ID as string | undefined) ?? '').trim(),

  /**
   * Data dell'ultima revisione dei testi legali, scritta a mano.
   * NON si usa la data di build: farebbe risultare "aggiornata oggi" una
   * informativa che nessuno ha riletto da mesi.
   */
  dataInformative: '2026-09-09',

  /** Endpoint del form. Vedi CLIENT-DATA.md, punto 9. */
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: 'YOUR-WEB3FORMS-ACCESS-KEY', // TODO CLIENTE: chiave gratuita da web3forms.com
}

/* --- Quello che il cliente ha scritto nel pannello ------------------------ */

const r = remoto.impostazioni

/** Solo le cifre di un numero di telefono, con il prefisso: "+39 389 ..." -> "39389..." */
const cifre = (s: string) => s.replace(/\D/g, '')

const telefono = r.telefono ?? statico.phone
const whatsapp = r.whatsapp ? cifre(r.whatsapp) : r.telefono ? cifre(r.telefono) : statico.whatsapp

export const site = {
  ...statico,
  legalName: r.ragioneSociale ?? statico.legalName,
  vat: r.partitaIva ? r.partitaIva.replace(/\s/g, '').toUpperCase() : statico.vat,
  rea: r.rea ?? statico.rea,
  city: r.citta ?? statico.city,
  province: r.provincia ? r.provincia.toUpperCase().slice(0, 2) : statico.province,
  provinceName: r.provinciaNome ?? statico.provinceName,
  street: r.via ?? statico.street,
  postalCode: r.cap ?? statico.postalCode,
  phone: telefono,
  phoneHref: r.telefono ? `+${cifre(r.telefono)}` : statico.phoneHref,
  whatsapp,
  email: r.email ?? statico.email,
  hours: { ...statico.hours, label: r.orari ?? statico.hours.label },
  warrantyYears: r.garanziaAnni ?? statico.warrantyYears,
  responseHours: r.oreRisposta ?? statico.responseHours,
  registroImprese: r.registroImprese ?? statico.registroImprese,
  capitaleSociale: r.capitaleSociale ?? statico.capitaleSociale,
  pec: r.pec ?? statico.pec,
  assicurazione: r.assicurazione ?? statico.assicurazione,
  social: {
    instagram: r.instagram ?? statico.social.instagram,
    facebook: r.facebook ?? statico.social.facebook,
  },
}

/** Anni di attività, calcolati automaticamente.
 *  ATTENZIONE: vale quanto foundedYear, quindi finche
 *  site.foundedYearConfermato e false questo numero NON va mostrato.
 *  Usare `anzianitaPubblicabile` invece di leggerlo a mano. */
export const yearsActive = new Date().getFullYear() - site.foundedYear

/**
 * true solo quando l'anno di fondazione e confermato dal cliente ed e
 * plausibile. L'anzianita dichiarata e una affermazione di fatto: pubblicarla
 * senza riscontro e pubblicita ingannevole (art. 21 d.lgs. 206/2005).
 * Ogni testo che dice "dal 2009" o "da N anni" deve passare da qui.
 */
/**
 * La denominazione da mostrare in pubblico.
 *
 * "MDA Impresa Edile S.r.l." e un segnaposto travestito: la sigla non passa
 * nessun controllo automatico (niente zeri, niente "esempio") ma dichiara una
 * forma giuridica che nessuno ha ancora confermato. Dichiarare "S.r.l." senza
 * esserlo e una informazione societaria falsa, e per giunta fa scattare
 * l'obbligo di indicare anche il capitale sociale (art. 2250 c.c.).
 *
 * Finche formaGiuridica resta 'da-confermare' si usa il nome commerciale, che
 * e vero comunque. Alla conferma torna la ragione sociale completa.
 */
export const denominazione = site.formaGiuridica === 'da-confermare' ? site.name : site.legalName

export const anzianitaPubblicabile =
  site.foundedYearConfermato && site.foundedYear > 1900 && yearsActive >= 1

/** Link WhatsApp con messaggio precompilato. */
export function waLink(message = 'Buongiorno, vorrei un preventivo per il mio tetto.') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
