// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel/static'
import tailwindcss from '@tailwindcss/vite'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * URL canonico del sito, UNICO punto da cambiare al cutover del dominio.
 *
 * Finche www.mdaimpresaedile.it non e comprato e delegato risponde 410 Gone
 * su http e non ha certificato su https: canonical, og:url, og:image e
 * sitemap punterebbero a risorse non fetchabili e le anteprime dei link
 * condivisi resterebbero vuote. Il default e quindi l'host che risponde
 * davvero. Al cutover basta impostare su Vercel
 *   PUBLIC_SITE_URL=https://www.mdaimpresaedile.it
 * e rifare il deploy: canonical, og, sitemap, robots.txt e security.txt
 * seguono da soli (robots e security.txt vengono riscritti dall'integrazione
 * qui sotto, proprio per non avere un secondo URL da ricordare).
 *
 * NOTA: `url` in src/config/site.ts, usato nel JSON-LD, e ancora hardcodato
 * e va allineato allo stesso modo.
 */
/**
 * Il dominio definitivo e collegato e risponde dal 9 settembre 2026, quindi
 * e lui il valore predefinito. Prima il ripiego era l'indirizzo vercel.app:
 * aveva senso finche il dominio non rispondeva, ma da quando risponde manda
 * canonical e sitemap sul dominio sbagliato e Google consolida li.
 * PUBLIC_SITE_URL resta e vince, per le anteprime e per un eventuale cambio.
 */
const SITE_URL = (process.env.PUBLIC_SITE_URL ?? 'https://www.mdaimpresaedile.it').replace(/\/+$/, '')

/** I deploy di anteprima non devono finire nell'indice al posto del sito. */
const ANTEPRIMA = process.env.VERCEL_ENV === 'preview'

/** Tipi di <script> che il browser esegue davvero (ld+json non e fra questi). */
const TIPI_ESEGUIBILI = new Set(['', 'module', 'text/javascript', 'application/javascript'])

const RE_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const RE_STYLE = /<style\b([^>]*)>([\s\S]*?)<\/style>/gi

/** Elenco ricorsivo dei file .html dentro dist/. */
function elencaHtml(cartella) {
  const trovati = []
  for (const voce of readdirSync(cartella, { withFileTypes: true })) {
    const percorso = join(cartella, voce.name)
    if (voce.isDirectory()) trovati.push(...elencaHtml(percorso))
    else if (voce.name.endsWith('.html')) trovati.push(percorso)
  }
  return trovati
}

/** Il tipo dichiarato su un tag, normalizzato ('' se assente). */
function tipoDi(attributi) {
  const trovato = attributi.match(/\stype\s*=\s*["']?([^"'\s>]*)/i)
  return (trovato ? trovato[1] : '').toLowerCase()
}

/**
 * Integrazione locale: toglie OGNI blocco inline dall'HTML generato.
 *
 * Perche non hash sha256 rigenerati in vercel.json, che sarebbe l'altra
 * strada: su Vercel il file vercel.json viene letto dalla sorgente del
 * deploy, non dall'output della build, quindi un hook che lo riscrive
 * durante `astro build` non cambierebbe gli header davvero serviti. L'unica
 * variante funzionante sarebbe buildare in locale e committare il vercel.json
 * rigenerato: basta dimenticarsene una volta e la CSP blocca i moduli dei
 * form, in produzione, senza nessun errore in build. Estrarre i blocchi
 * inline in file su /_astro/ invece non ha stato da sincronizzare: qualunque
 * cosa scrivano i componenti, l'HTML finale non ha inline e
 * `script-src 'self'` resta valido per costruzione. In piu i file estratti
 * sono cacheabili immutabili e spariscono da ogni pagina HTML.
 *
 * Se un blocco inline sopravvive, la build FALLISCE: meglio un deploy che non
 * parte che un sito online con gli script bloccati dalla CSP.
 *
 * @returns {import('astro').AstroIntegration}
 */
function risorseSenzaInline() {
  return {
    name: 'mda-risorse-senza-inline',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const radice = fileURLToPath(dir)
        const cartellaAsset = join(radice, '_astro')
        mkdirSync(cartellaAsset, { recursive: true })

        /** Scrive il blocco in un file col proprio hash e ne restituisce l'URL. */
        const scriviAsset = (contenuto, estensione) => {
          const impronta = createHash('sha256').update(contenuto).digest('hex').slice(0, 16)
          const nomeFile = `inline.${impronta}.${estensione}`
          const percorso = join(cartellaAsset, nomeFile)
          if (!existsSync(percorso)) writeFileSync(percorso, contenuto, 'utf8')
          return `/_astro/${nomeFile}`
        }

        let estratti = 0

        for (const pagina of elencaHtml(radice)) {
          let html = readFileSync(pagina, 'utf8')

          // <script> inline -> file esterno. Gli attributi restano intatti,
          // quindi type="module" resta differito e uno classico resta
          // bloccante nella stessa posizione: nessun cambio di ordine.
          html = html.replace(RE_SCRIPT, (intero, attributi, contenuto) => {
            if (/\ssrc\s*=/i.test(attributi)) return intero
            if (!TIPI_ESEGUIBILI.has(tipoDi(attributi))) return intero // ld+json: dati, non codice
            if (contenuto.trim() === '') return intero
            estratti++
            return `<script${attributi} src="${scriviAsset(contenuto, 'js')}"></script>`
          })

          // <style> inline -> foglio esterno nella stessa posizione, cosi
          // l'ordine della cascata non cambia. Con inlineStylesheets 'never'
          // qui non dovrebbe passare piu nulla: resta come rete di sicurezza.
          html = html.replace(RE_STYLE, (intero, attributi, contenuto) => {
            if (contenuto.trim() === '') return intero
            const media = attributi.match(/\smedia\s*=\s*["'][^"']*["']/i)
            estratti++
            return `<link rel="stylesheet" href="${scriviAsset(contenuto, 'css')}"${media ? media[0] : ''}>`
          })

          // Sui deploy di anteprima la meta robots diventa noindex: l'URL di
          // preview non deve competere col sito nell'indice.
          if (ANTEPRIMA) {
            const noindex = '<meta name="robots" content="noindex, nofollow">'
            html = /<meta\s+name="robots"[^>]*>/i.test(html)
              ? html.replace(/<meta\s+name="robots"[^>]*>/i, noindex)
              : html.replace(/<head([^>]*)>/i, `<head$1>${noindex}`)
          }

          writeFileSync(pagina, html, 'utf8')

          // Controllo finale: se resta anche un solo blocco inline eseguibile,
          // la CSP senza 'unsafe-inline' lo bloccherebbe in produzione.
          for (const trovato of html.matchAll(RE_SCRIPT)) {
            const [, attributi, contenuto] = trovato
            if (/\ssrc\s*=/i.test(attributi)) continue
            if (!TIPI_ESEGUIBILI.has(tipoDi(attributi))) continue
            if (contenuto.trim() === '') continue
            throw new Error(
              `[mda-risorse-senza-inline] script inline non estratto in ${pagina}. ` +
                `La CSP in vercel.json non ha piu 'unsafe-inline': il deploy sarebbe rotto.`,
            )
          }
          for (const trovato of html.matchAll(RE_STYLE)) {
            if (trovato[2].trim() === '') continue
            throw new Error(`[mda-risorse-senza-inline] <style> inline non estratto in ${pagina}.`)
          }
        }

        // robots.txt e security.txt contengono URL assoluti: li riallineiamo
        // a SITE_URL, cosi il cutover del dominio resta una variabile sola.
        const robots = join(radice, 'robots.txt')
        if (existsSync(robots)) {
          writeFileSync(
            robots,
            ANTEPRIMA
              ? '# Deploy di anteprima: non indicizzare.\nUser-agent: *\nDisallow: /\n'
              : readFileSync(robots, 'utf8').replace(/^Sitemap:.*$/m, `Sitemap: ${SITE_URL}/sitemap-index.xml`),
            'utf8',
          )
        }

        const security = join(radice, '.well-known', 'security.txt')
        if (existsSync(security)) {
          writeFileSync(
            security,
            readFileSync(security, 'utf8').replace(
              /^Canonical:.*$/m,
              `Canonical: ${SITE_URL}/.well-known/security.txt`,
            ),
            'utf8',
          )
        }

        logger.info(`${estratti} blocchi inline estratti in /_astro/. URL del sito: ${SITE_URL}`)
      },
    },
  }
}

export default defineConfig({
  site: SITE_URL,
  /**
   * Il sito resta statico: ogni pagina e un file, come prima. L'adattatore
   * serve a una cosa sola, la funzione dei moduli in src/pages/api/.
   *
   * Perche non basta una cartella api/ nella radice: quella scorciatoia di
   * Vercel funziona nei progetti senza framework (come malerdelius, che e
   * Vite). Con il preset Astro la build e statica e la cartella api/ viene
   * ignorata: la funzione non esisteva e /api/richiesta rispondeva 404.
   */
  adapter: vercel(),
  integrations: [
    sitemap({
      // Il pannello non e contenuto del sito: fuori da sitemap e da Google.
      filter: (pagina) => !pagina.includes('/admin') && !pagina.includes('/blog/articolo') && !/\/l\/$/.test(pagina),
    }),
    risorseSenzaInline(),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Niente asset inline nell'HTML: i moduli delle componenti sotto 4 KB
      // finirebbero dentro ogni pagina e obbligherebbero a 'unsafe-inline'.
      assetsInlineLimit: 0,
    },
  },
  build: {
    // Il CSS resta in file esterni con hash nel nome: costa una richiesta di
    // rete in piu, ma e cacheabile immutabile e permette style-src 'self'.
    inlineStylesheets: 'never',
  },
  image: {
    // Formati moderni per le immagini processate da Astro
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  compressHTML: true,
})
