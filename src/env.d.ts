/// <reference types="astro/client" />

/**
 * Dichiarazioni globali del progetto.
 *
 * `dataLayer` e la coda di Google Tag Manager: gli script inline di
 * BarraMobile.astro e ContattoRapido.astro la popolano prima che GTM sia
 * caricato. Senza questa dichiarazione `astro check` segnala
 * ts(2339) "Property 'dataLayer' does not exist on type 'Window'".
 */
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

export {}
