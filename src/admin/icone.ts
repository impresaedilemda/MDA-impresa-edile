/**
 * =============================================================================
 *  ICONE, DISEGNATE A MANO
 * =============================================================================
 *  Nessuna libreria: al pannello servono una dozzina di simboli e stanno tutti
 *  in poche righe di percorsi SVG. Un pacchetto di icone intero peserebbe piu
 *  di tutto il resto del pannello messo insieme, e questo pannello lo apre un
 *  artigiano dal cantiere, spesso con mezza tacca di rete.
 *
 *  Ogni funzione restituisce un nodo NUOVO: un elemento del DOM sta in un posto
 *  solo, quindi la stessa icona in due punti sono due chiamate.
 *
 *  Le icone sono decorative: accanto c'e sempre la parola scritta. Per questo
 *  escono tutte con aria-hidden e non finiscono nella lettura a voce.
 * =============================================================================
 */

const NS = 'http://www.w3.org/2000/svg'

/** Le forme che servono qui: una linea, un cerchio, un rettangolo smussato. */
export type Forma =
  | { tipo: 'percorso'; d: string }
  | { tipo: 'cerchio'; cx: number; cy: number; r: number }
  | { tipo: 'rettangolo'; x: number; y: number; larghezza: number; altezza: number; raggio?: number }

/**
 * Costruisce l'icona su una griglia di 24, la stessa di tutti i disegni qui
 * sotto. Chi aggiunge un simbolo nuovo passa da questa funzione e non tocca
 * altro.
 */
export function icona(dimensione: number, forme: Forma[]): SVGElement {
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('xmlns', NS)
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', String(dimensione))
  svg.setAttribute('height', String(dimensione))
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '2')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.setAttribute('aria-hidden', 'true')
  // Senza questo Internet Explorer e i vecchi Edge mettevano le icone nel giro
  // del tasto tab: costa un attributo ed evita una tabulazione a vuoto.
  svg.setAttribute('focusable', 'false')

  for (const f of forme) {
    if (f.tipo === 'percorso') {
      const p = document.createElementNS(NS, 'path')
      p.setAttribute('d', f.d)
      svg.appendChild(p)
      continue
    }
    if (f.tipo === 'cerchio') {
      const c = document.createElementNS(NS, 'circle')
      c.setAttribute('cx', String(f.cx))
      c.setAttribute('cy', String(f.cy))
      c.setAttribute('r', String(f.r))
      svg.appendChild(c)
      continue
    }
    const r = document.createElementNS(NS, 'rect')
    r.setAttribute('x', String(f.x))
    r.setAttribute('y', String(f.y))
    r.setAttribute('width', String(f.larghezza))
    r.setAttribute('height', String(f.altezza))
    r.setAttribute('rx', String(f.raggio ?? 2))
    svg.appendChild(r)
  }

  return svg
}

/* --- I SIMBOLI ------------------------------------------------------------ */

/** Piu: aggiungere qualcosa, di solito un articolo nuovo. */
export function iconaPiu(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M5 12h14' },
    { tipo: 'percorso', d: 'M12 5v14' },
  ])
}

/** Freccia a destra: porta da un'altra parte. */
export function iconaFreccia(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M5 12h14' },
    { tipo: 'percorso', d: 'm12 5 7 7-7 7' },
  ])
}

/** Matita su un foglio: scrivere e modificare. */
export function iconaMatita(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' },
    { tipo: 'percorso', d: 'M18.4 2.6a2 2 0 0 1 2.8 2.8L12 14.6l-3.8 1 1-3.8z' },
  ])
}

/** Fotografie sovrapposte: la galleria dei lavori. */
export function iconaFoto(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M18 22H4a2 2 0 0 1-2-2V6' },
    { tipo: 'percorso', d: 'm22 13-1.3-1.3a2.4 2.4 0 0 0-3.4 0L11 18' },
    { tipo: 'cerchio', cx: 12, cy: 8, r: 2 },
    { tipo: 'rettangolo', x: 6, y: 2, larghezza: 16, altezza: 16, raggio: 2 },
  ])
}

/** Due anelli di catena: un collegamento. */
export function iconaLink(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M9 17H7A5 5 0 0 1 7 7h2' },
    { tipo: 'percorso', d: 'M15 7h2a5 5 0 1 1 0 10h-2' },
    { tipo: 'percorso', d: 'M8 12h8' },
  ])
}

/** Colonne su due assi: i numeri del traffico. */
export function iconaGrafico(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M3 3v16a2 2 0 0 0 2 2h16' },
    { tipo: 'percorso', d: 'M18 17V9' },
    { tipo: 'percorso', d: 'M13 17V5' },
    { tipo: 'percorso', d: 'M8 17v-3' },
  ])
}

/** Occhio: quante volte una pagina e stata vista. */
export function iconaOcchio(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M2.1 12.3a1 1 0 0 1 0-.7 10.8 10.8 0 0 1 19.8 0 1 1 0 0 1 0 .7 10.8 10.8 0 0 1-19.8 0' },
    { tipo: 'cerchio', cx: 12, cy: 12, r: 3 },
  ])
}

/** Due sagome: i visitatori contati una volta sola a testa. */
export function iconaPersone(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' },
    { tipo: 'cerchio', cx: 9, cy: 7, r: 4 },
    { tipo: 'percorso', d: 'M22 21v-2a4 4 0 0 0-3-3.9' },
    { tipo: 'percorso', d: 'M16 3.1a4 4 0 0 1 0 7.8' },
  ])
}

/** Telefono: le visite arrivate dal palmo di una mano. */
export function iconaTelefono(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'rettangolo', x: 5, y: 2, larghezza: 14, altezza: 20, raggio: 2 },
    { tipo: 'percorso', d: 'M12 18h.01' },
  ])
}

/** Mappamondo: da dove sono arrivate le visite. */
export function iconaMondo(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'cerchio', cx: 12, cy: 12, r: 10 },
    { tipo: 'percorso', d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' },
    { tipo: 'percorso', d: 'M2 12h20' },
  ])
}

/** Schermo con piede: il computer, contrapposto al telefono. */
export function iconaSchermo(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'rettangolo', x: 2, y: 3, larghezza: 20, altezza: 14, raggio: 2 },
    { tipo: 'percorso', d: 'M8 21h8' },
    { tipo: 'percorso', d: 'M12 17v4' },
  ])
}

/** Griglia di righe e colonne: gli stessi dati, ma in cifre. */
export function iconaTabella(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'rettangolo', x: 3, y: 3, larghezza: 18, altezza: 18, raggio: 2 },
    { tipo: 'percorso', d: 'M3 9h18' },
    { tipo: 'percorso', d: 'M3 15h18' },
    { tipo: 'percorso', d: 'M12 3v18' },
  ])
}

/** Cerchio aperto: sto ancora aspettando la risposta. */
export function iconaAttesa(dimensione = 16): SVGElement {
  return icona(dimensione, [{ tipo: 'percorso', d: 'M21 12a9 9 0 1 1-6.2-8.6' }])
}

/** Punto esclamativo in un cerchio: qualcosa non ha funzionato. */
export function iconaAvviso(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'cerchio', cx: 12, cy: 12, r: 10 },
    { tipo: 'percorso', d: 'M12 8v4' },
    { tipo: 'percorso', d: 'M12 16h.01' },
  ])
}

/** Due frecce in tondo: riprova. */
export function iconaRicarica(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M3 12a9 9 0 0 1 9-9 9.8 9.8 0 0 1 6.7 2.7L21 8' },
    { tipo: 'percorso', d: 'M21 3v5h-5' },
    { tipo: 'percorso', d: 'M21 12a9 9 0 0 1-9 9 9.8 9.8 0 0 1-6.7-2.7L3 16' },
    { tipo: 'percorso', d: 'M8 16H3v5' },
  ])
}

/* --- VOCI DEL MENU -------------------------------------------------------- */

/** Quattro riquadri: la pagina vista dall'alto, cioe il pannello. */
export function iconaPannello(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'rettangolo', x: 3, y: 3, larghezza: 7, altezza: 9, raggio: 1 },
    { tipo: 'rettangolo', x: 14, y: 3, larghezza: 7, altezza: 5, raggio: 1 },
    { tipo: 'rettangolo', x: 14, y: 12, larghezza: 7, altezza: 9, raggio: 1 },
    { tipo: 'rettangolo', x: 3, y: 16, larghezza: 7, altezza: 5, raggio: 1 },
  ])
}

/** Foglio scritto con l'angolo piegato: un articolo. */
export function iconaBlog(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z' },
    { tipo: 'percorso', d: 'M14 3v5h5' },
    { tipo: 'percorso', d: 'M8 13h7' },
    { tipo: 'percorso', d: 'M8 17h4' },
  ])
}

/**
 * La galleria nel menu. Stesso segno delle fotografie sovrapposte: sono la
 * stessa cosa, e due disegni diversi per la stessa cosa confondono e basta.
 */
export function iconaGalleria(dimensione = 16): SVGElement {
  return iconaFoto(dimensione)
}

/** Le statistiche nel menu, cioe le colonne del grafico. */
export function iconaStatistiche(dimensione = 16): SVGElement {
  return iconaGrafico(dimensione)
}

/** Freccia che esce dalla porta: uscire dal pannello. */
export function iconaEsci(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' },
    { tipo: 'percorso', d: 'm16 17 5-5-5-5' },
    { tipo: 'percorso', d: 'M21 12H9' },
  ])
}

/** Freccia che lascia il riquadro: si apre qualcosa fuori dal pannello. */
export function iconaEsterno(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' },
    { tipo: 'percorso', d: 'M15 3h6v6' },
    { tipo: 'percorso', d: 'M10 14 21 3' },
  ])
}

/* --- AZIONI --------------------------------------------------------------- */

/** Freccia a sinistra: si torna indietro. */
export function iconaFrecciaIndietro(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M19 12H5' },
    { tipo: 'percorso', d: 'm12 19-7-7 7-7' },
  ])
}

/** Il vecchio dischetto: salvare. Lo riconoscono ancora tutti. */
export function iconaSalva(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' },
    { tipo: 'percorso', d: 'M17 21v-8H7v8' },
    { tipo: 'percorso', d: 'M7 3v5h8' },
  ])
}

/** Cestino: cancellare, e non si torna indietro. */
export function iconaCestino(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M3 6h18' },
    { tipo: 'percorso', d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' },
    { tipo: 'percorso', d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' },
    { tipo: 'percorso', d: 'M10 11v6' },
    { tipo: 'percorso', d: 'M14 11v6' },
  ])
}

/** Due fogli uguali: copiare negli appunti. */
export function iconaCopia(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'rettangolo', x: 9, y: 9, larghezza: 13, altezza: 13, raggio: 2 },
    { tipo: 'percorso', d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' },
  ])
}

/** Una fotografia sola: l'immagine da mettere nel testo o in copertina. */
export function iconaImmagine(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'rettangolo', x: 3, y: 3, larghezza: 18, altezza: 18, raggio: 2 },
    { tipo: 'cerchio', cx: 8.5, cy: 8.5, r: 1.5 },
    { tipo: 'percorso', d: 'm21 15-5-5L5 21' },
  ])
}

/* --- BARRA DI SCRITTURA --------------------------------------------------- */

/** Grassetto. */
export function iconaGrassetto(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M6 4h8a4 4 0 0 1 0 8H6z' },
    { tipo: 'percorso', d: 'M6 12h9a4 4 0 0 1 0 8H6z' },
  ])
}

/** Corsivo. */
export function iconaCorsivo(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M19 4h-9' },
    { tipo: 'percorso', d: 'M14 20H5' },
    { tipo: 'percorso', d: 'M15 4 9 20' },
  ])
}

/** Sottotitolo dentro l'articolo. */
export function iconaTitolo(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M4 12h8' },
    { tipo: 'percorso', d: 'M4 18V6' },
    { tipo: 'percorso', d: 'M12 18V6' },
    { tipo: 'percorso', d: 'M21 18h-5c0-4 4-3 4-6 0-1.5-1.5-2.5-4-1' },
  ])
}

/** Elenco puntato. I punti sono linee lunghe niente, arrotondate. */
export function iconaElenco(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M8 6h13' },
    { tipo: 'percorso', d: 'M8 12h13' },
    { tipo: 'percorso', d: 'M8 18h13' },
    { tipo: 'percorso', d: 'M3 6h.01' },
    { tipo: 'percorso', d: 'M3 12h.01' },
    { tipo: 'percorso', d: 'M3 18h.01' },
  ])
}

/**
 * Collegamento dentro il testo. Somiglia a iconaLink ma non e la stessa cosa:
 * quella e la voce del menu, questa e il pulsante della barra di scrittura.
 */
export function iconaCollegamento(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' },
    { tipo: 'percorso', d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' },
  ])
}

/* --- INGRESSO ------------------------------------------------------------- */

/** Freccia che entra nella porta: entrare nel pannello. */
export function iconaEntra(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' },
    { tipo: 'percorso', d: 'm10 17 5-5-5-5' },
    { tipo: 'percorso', d: 'M15 12H3' },
  ])
}

/** Lucchetto: area riservata. */
export function iconaLucchetto(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'rettangolo', x: 3, y: 11, larghezza: 18, altezza: 11, raggio: 2 },
    { tipo: 'percorso', d: 'M7 11V7a5 5 0 0 1 10 0v4' },
  ])
}

/** Una i in un cerchio: nota di servizio, niente di rotto. */
export function iconaInfo(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'cerchio', cx: 12, cy: 12, r: 10 },
    { tipo: 'percorso', d: 'M12 16v-4' },
    { tipo: 'percorso', d: 'M12 8h.01' },
  ])
}

/* --- SIMBOLI AGGIUNTI CON LE SEZIONI NUOVE -------------------------------- */

/** Vassoio con freccia in entrata: le richieste arrivate dal sito. */
export function iconaRichieste(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M22 12h-6l-2 3h-4l-2-3H2' },
    { tipo: 'percorso', d: 'M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1Z' },
  ])
}

/** Stella a contorno: le recensioni. */
export function iconaStella(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'm12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z' },
  ])
}

/** Casa con il tetto in evidenza: i cantieri. */
export function iconaCantiere(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'm3 11 9-8 9 8' },
    { tipo: 'percorso', d: 'M5 10v10h14V10' },
    { tipo: 'percorso', d: 'M10 20v-6h4v6' },
  ])
}

/** Cursori: le impostazioni. */
export function iconaImpostazioni(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M4 6h10' },
    { tipo: 'percorso', d: 'M18 6h2' },
    { tipo: 'percorso', d: 'M4 12h2' },
    { tipo: 'percorso', d: 'M10 12h10' },
    { tipo: 'percorso', d: 'M4 18h12' },
    { tipo: 'percorso', d: 'M20 18h0' },
    { tipo: 'cerchio', cx: 16, cy: 6, r: 2 },
    { tipo: 'cerchio', cx: 8, cy: 12, r: 2 },
    { tipo: 'cerchio', cx: 18, cy: 18, r: 2 },
  ])
}

/** Fumetto di WhatsApp semplificato: scrivere al cliente. */
export function iconaWhatsapp(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6a8.4 8.4 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z' },
    { tipo: 'percorso', d: 'M9.5 9.5c.3 2 2 3.7 4 4l1.2-1.2 1.8.9-.4 1.4c-3.6.4-7.3-3.3-6.9-6.9l1.4-.4.9 1.8Z' },
  ])
}

/** Busta: l'email. */
export function iconaBusta(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'rettangolo', x: 3, y: 5, larghezza: 18, altezza: 14, raggio: 2 },
    { tipo: 'percorso', d: 'm3 7 9 6 9-6' },
  ])
}

/** Freccia verso l'alto su una linea: caricare un file. */
export function iconaCarica(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M12 16V4' },
    { tipo: 'percorso', d: 'm6 10 6-6 6 6' },
    { tipo: 'percorso', d: 'M4 20h16' },
  ])
}

/** Segno di spunta: fatto, salvato, confermato. */
export function iconaSpunta(dimensione = 16): SVGElement {
  return icona(dimensione, [{ tipo: 'percorso', d: 'm4 12.5 5 5L20 6.5' }])
}

/** Croce: chiudere, annullare, togliere. */
export function iconaChiudi(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M6 6l12 12' },
    { tipo: 'percorso', d: 'M18 6 6 18' },
  ])
}

/** Freccia in su: spostare prima nell'ordine. */
export function iconaSu(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M12 19V5' },
    { tipo: 'percorso', d: 'm5 12 7-7 7 7' },
  ])
}

/** Freccia in giu: spostare dopo nell'ordine. */
export function iconaGiu(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M12 5v14' },
    { tipo: 'percorso', d: 'm19 12-7 7-7-7' },
  ])
}

/** Occhio barrato: nascosto dal sito. */
export function iconaOcchioBarrato(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M9.9 4.2A10.9 10.9 0 0 1 12 4c7 0 10 8 10 8a17.5 17.5 0 0 1-2.2 3.2' },
    { tipo: 'percorso', d: 'M6.6 6.6A17.7 17.7 0 0 0 2 12s3 8 10 8a9.7 9.7 0 0 0 5.4-1.6' },
    { tipo: 'percorso', d: 'M14.1 14.1a3 3 0 1 1-4.2-4.2' },
    { tipo: 'percorso', d: 'M2 2l20 20' },
  ])
}

/** Razzo: pubblicare il sito. */
export function iconaPubblica(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M5 13c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2' },
    { tipo: 'percorso', d: 'M12 15 9 12c.7-4 3-8 10-9-1 7-5 9.3-9 10Z' },
    { tipo: 'percorso', d: 'M9 12H5.5L3 9.5c1.5-1 3.5-1.5 5-1' },
    { tipo: 'percorso', d: 'M12 15v3.5l2.5 2.5c1-1.5 1.5-3.5 1-5' },
  ])
}

/** Chiave: la password. */
export function iconaChiave(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'cerchio', cx: 8, cy: 15, r: 4.5 },
    { tipo: 'percorso', d: 'm11.5 11.5 9-9' },
    { tipo: 'percorso', d: 'M17 6l3 3' },
    { tipo: 'percorso', d: 'M14 9l2 2' },
  ])
}

/** Lente: cercare in un elenco. */
export function iconaCerca(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'cerchio', cx: 11, cy: 11, r: 7 },
    { tipo: 'percorso', d: 'm21 21-4.3-4.3' },
  ])
}

/** Tre linee: il menu su telefono. */
export function iconaMenu(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M4 6h16' },
    { tipo: 'percorso', d: 'M4 12h16' },
    { tipo: 'percorso', d: 'M4 18h16' },
  ])
}

/** Persona: l'account di chi amministra. */
export function iconaUtente(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'cerchio', cx: 12, cy: 8, r: 4 },
    { tipo: 'percorso', d: 'M4 21a8 8 0 0 1 16 0' },
  ])
}

/** Orologio: quando e successo qualcosa. */
export function iconaOrologio(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'cerchio', cx: 12, cy: 12, r: 9 },
    { tipo: 'percorso', d: 'M12 7v5l3 2' },
  ])
}

/** Segnaposto sulla mappa: il comune. */
export function iconaLuogo(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z' },
    { tipo: 'cerchio', cx: 12, cy: 10, r: 3 },
  ])
}

/** Mondo con freccia: aprire il sito pubblico. */
export function iconaSito(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'cerchio', cx: 12, cy: 12, r: 9 },
    { tipo: 'percorso', d: 'M3 12h18' },
    { tipo: 'percorso', d: 'M12 3a14 14 0 0 1 0 18' },
    { tipo: 'percorso', d: 'M12 3a14 14 0 0 0 0 18' },
  ])
}

/** Uno scudo con la spunta: la verifica in due passaggi. */
export function iconaScudo(dimensione = 16): SVGElement {
  return icona(dimensione, [
    { tipo: 'percorso', d: 'M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z' },
    { tipo: 'percorso', d: 'm9 12 2 2 4-4' },
  ])
}
