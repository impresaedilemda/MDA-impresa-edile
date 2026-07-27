/**
 * =============================================================================
 *  MDA IMPRESA EDILE - CONFIGURAZIONE CENTRALE
 * =============================================================================
 *  Questo è l'UNICO file da modificare quando il cliente invia i suoi dati.
 *  Ogni valore marcato "TODO CLIENTE" e un segnaposto da sostituire.
 *  Vedi CLIENT-DATA.md per la checklist completa.
 * =============================================================================
 */

export const site = {
  /* --- Identita -------------------------------------------------------- */
  name: 'MDA Impresa Edile',
  legalName: 'MDA Impresa Edile S.r.l.', // TODO CLIENTE: ragione sociale esatta
  tagline: 'Specialisti in tetti e coperture',
  foundedYear: 2009, // TODO CLIENTE: anno di fondazione
  vat: 'IT00000000000', // TODO CLIENTE: partita IVA
  rea: 'BS-000000', // TODO CLIENTE: numero REA (opzionale, togliere se assente)

  /* --- Localizzazione (CRITICO PER LA SEO LOCALE) -----------------------
   * L'impresa opera fra Veneto e Friuli-Venezia Giulia (indicazione del
   * cliente). La citta esatta non e ancora confermata: Portogruaro e il
   * segnaposto piu sensato perche sta proprio al confine fra le due
   * regioni. Quando arriva la citta vera si cambia SOLO qui.
   * -------------------------------------------------------------------- */
  city: 'Portogruaro', // TODO CLIENTE: città principale da confermare
  province: 'VE', // TODO CLIENTE: sigla provincia da confermare
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
  url: 'https://www.mdaimpresaedile.it', // TODO CLIENTE: dominio definitivo
  locale: 'it_IT',
  lang: 'it',

  /** Endpoint del form. Vedi CLIENT-DATA.md, punto 9. */
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: 'YOUR-WEB3FORMS-ACCESS-KEY', // TODO CLIENTE: chiave gratuita da web3forms.com
} as const

/** Anni di attività, calcolati automaticamente. */
export const yearsActive = new Date().getFullYear() - site.foundedYear

/** Link WhatsApp con messaggio precompilato. */
export function waLink(message = 'Buongiorno, vorrei un preventivo per il mio tetto.') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
