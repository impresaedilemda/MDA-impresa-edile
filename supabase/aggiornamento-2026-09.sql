-- =============================================================================
--  MDA IMPRESA EDILE, aggiornamento del pannello (settembre 2026)
-- =============================================================================
--  Da eseguire DOPO schema.sql, nell'SQL Editor di Supabase. Si puo lanciare
--  piu volte: ogni istruzione controlla se esiste gia quello che crea.
--
--  Cosa aggiunge:
--    1. richieste      i contatti che arrivano dai moduli del sito
--    2. recensioni     le recensioni scritte dal cliente nel pannello
--    3. lavori         i cantieri prima/dopo mostrati sul sito
--    4. impostazioni   telefono, email, sede, partita IVA e il resto
--    5. pubblicazione  l'indirizzo che rigenera il sito (solo per gli admin)
--    6. immagini       il deposito delle foto caricate dal pannello
--    7. i trigger che segnano "ci sono modifiche non ancora pubblicate"
--
--  Stessa regola di schema.sql: la chiave nel browser e pubblica, a proteggere
--  i dati sono SOLO le policy. Nessuna tabella concede scrittura all'anonimo,
--  tranne l'inserimento di una richiesta di contatto, che e proprio lo scopo
--  dei moduli.
-- =============================================================================

-- -----------------------------------------------------------------------------
--  0. CHI AMMINISTRA
-- -----------------------------------------------------------------------------
--  Il proprietario e chi ha costruito il pannello. Senza l'utente in
--  Authentication, Users la riga da sola non fa entrare nessuno.

insert into public.admin_email (email, nota)
values
  ('impresaedilemda@gmail.com', 'proprietario'),
  ('ark4su@gmail.com', 'sviluppatore')
on conflict (email) do nothing;

-- -----------------------------------------------------------------------------
--  1. RICHIESTE DI CONTATTO
-- -----------------------------------------------------------------------------
--  Una riga per ogni modulo inviato dal sito: il richiamo rapido dell'hero e
--  il configuratore del preventivo. Cosi nessun contatto si perde, nemmeno se
--  l'email non parte.

create table if not exists public.richieste (
  id          uuid primary key default gen_random_uuid(),
  tipo        text not null default 'richiamo' check (tipo in ('richiamo', 'preventivo')),
  nome        text not null default '',
  telefono    text not null default '',
  email       text not null default '',
  comune      text not null default '',
  cap         text not null default '',
  servizio    text not null default '',
  messaggio   text not null default '',
  dettagli    jsonb not null default '{}'::jsonb,
  pagina      text not null default '',
  codice_link text,
  stato       text not null default 'nuova' check (stato in ('nuova', 'contattata', 'chiusa')),
  nota        text not null default '',
  creato      timestamptz not null default now(),
  aggiornato  timestamptz not null default now()
);

create index if not exists richieste_creato on public.richieste (creato desc);
create index if not exists richieste_stato on public.richieste (stato);

alter table public.richieste enable row level security;

-- L'anonimo puo SOLO inserire, con limiti stretti: niente stato diverso da
-- "nuova", niente note, niente date inventate, niente testi chilometrici.
drop policy if exists "chiunque invia una richiesta" on public.richieste;
create policy "chiunque invia una richiesta"
  on public.richieste for insert
  to anon, authenticated
  with check (
    stato = 'nuova'
    and nota = ''
    and creato > now() - interval '5 minutes'
    and creato < now() + interval '5 minutes'
    and length(nome) <= 120
    and length(telefono) between 5 and 40
    and length(email) <= 160
    and length(comune) <= 120
    and length(cap) <= 10
    and length(servizio) <= 120
    and length(messaggio) <= 3000
    and length(pagina) <= 300
    and (codice_link is null or length(codice_link) <= 60)
    and pg_column_size(dettagli) <= 8000
  );

drop policy if exists "admin legge le richieste" on public.richieste;
create policy "admin legge le richieste"
  on public.richieste for select
  to authenticated
  using (public.e_admin());

drop policy if exists "admin aggiorna le richieste" on public.richieste;
create policy "admin aggiorna le richieste"
  on public.richieste for update
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

drop policy if exists "admin cancella le richieste" on public.richieste;
create policy "admin cancella le richieste"
  on public.richieste for delete
  to authenticated
  using (public.e_admin());

-- -----------------------------------------------------------------------------
--  2. RECENSIONI
-- -----------------------------------------------------------------------------
--  Scritte dal cliente copiando quelle vere del profilo Google. Finche non ce
--  n'e nemmeno una visibile, il sito mostra gli esempi scritti nel codice.

create table if not exists public.recensioni (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null default '',
  localita   text not null default '',
  testo      text not null default '',
  voto       smallint not null default 5 check (voto between 1 and 5),
  foto       text,
  visibile   boolean not null default true,
  ordine     integer not null default 0,
  creato     timestamptz not null default now(),
  aggiornato timestamptz not null default now()
);

create index if not exists recensioni_ordine on public.recensioni (ordine, creato desc);

alter table public.recensioni enable row level security;

drop policy if exists "tutti leggono le recensioni visibili" on public.recensioni;
create policy "tutti leggono le recensioni visibili"
  on public.recensioni for select
  to anon, authenticated
  using (visibile = true);

drop policy if exists "admin legge tutte le recensioni" on public.recensioni;
create policy "admin legge tutte le recensioni"
  on public.recensioni for select
  to authenticated
  using (public.e_admin());

drop policy if exists "admin gestisce le recensioni" on public.recensioni;
create policy "admin gestisce le recensioni"
  on public.recensioni for all
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

-- -----------------------------------------------------------------------------
--  3. LAVORI (cantieri prima/dopo)
-- -----------------------------------------------------------------------------
--  Sostituisce la vecchia tabella "galleria", che cambiava solo le foto degli
--  esempi. Qui il cliente aggiunge i suoi cantieri veri, con foto e testo.
--  La tabella galleria resta in piedi ma non viene piu letta da nessuno.

create table if not exists public.lavori (
  id         uuid primary key default gen_random_uuid(),
  titolo     text not null default '',
  localita   text not null default '',
  testo      text not null default '',
  durata     text not null default '',
  materiali  text not null default '',
  foto_prima text,
  foto_dopo  text,
  visibile   boolean not null default true,
  ordine     integer not null default 0,
  creato     timestamptz not null default now(),
  aggiornato timestamptz not null default now()
);

create index if not exists lavori_ordine on public.lavori (ordine, creato desc);

alter table public.lavori enable row level security;

drop policy if exists "tutti leggono i lavori visibili" on public.lavori;
create policy "tutti leggono i lavori visibili"
  on public.lavori for select
  to anon, authenticated
  using (visibile = true);

drop policy if exists "admin legge tutti i lavori" on public.lavori;
create policy "admin legge tutti i lavori"
  on public.lavori for select
  to authenticated
  using (public.e_admin());

drop policy if exists "admin gestisce i lavori" on public.lavori;
create policy "admin gestisce i lavori"
  on public.lavori for all
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

-- -----------------------------------------------------------------------------
--  4. IMPOSTAZIONI DEL SITO
-- -----------------------------------------------------------------------------
--  Una riga sola. I dati stanno in un jsonb cosi aggiungere un campo non
--  richiede una migrazione: le chiavi sono descritte in src/admin/dati.ts.
--  Lettura pubblica perche il sito li legge quando viene generato.

create table if not exists public.impostazioni (
  id         text primary key default 'sito',
  dati       jsonb not null default '{}'::jsonb,
  aggiornato timestamptz not null default now()
);

insert into public.impostazioni (id, dati) values ('sito', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.impostazioni enable row level security;

drop policy if exists "tutti leggono le impostazioni" on public.impostazioni;
create policy "tutti leggono le impostazioni"
  on public.impostazioni for select
  to anon, authenticated
  using (true);

drop policy if exists "admin aggiorna le impostazioni" on public.impostazioni;
create policy "admin aggiorna le impostazioni"
  on public.impostazioni for update
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

-- -----------------------------------------------------------------------------
--  5. PUBBLICAZIONE
-- -----------------------------------------------------------------------------
--  Il sito e statico: le modifiche vanno online quando Vercel lo rigenera.
--  hook_url e l'indirizzo del Deploy Hook di Vercel: chiunque lo conosca puo
--  far ripartire una build, quindi lo legge solo chi amministra.
--  ultima_modifica la aggiornano i trigger qui sotto; ultima_pubblicazione la
--  scrive il pannello quando preme "Pubblica".

create table if not exists public.pubblicazione (
  id                   text primary key default 'sito',
  hook_url             text not null default '',
  ultima_pubblicazione timestamptz,
  ultima_modifica      timestamptz
);

insert into public.pubblicazione (id) values ('sito')
on conflict (id) do nothing;

alter table public.pubblicazione enable row level security;

drop policy if exists "admin legge la pubblicazione" on public.pubblicazione;
create policy "admin legge la pubblicazione"
  on public.pubblicazione for select
  to authenticated
  using (public.e_admin());

drop policy if exists "admin aggiorna la pubblicazione" on public.pubblicazione;
create policy "admin aggiorna la pubblicazione"
  on public.pubblicazione for update
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

-- Ogni modifica ai contenuti segna che c'e qualcosa da pubblicare.
create or replace function public.segna_modifica()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.pubblicazione set ultima_modifica = now() where id = 'sito';
  return null;
end;
$$;

drop trigger if exists articoli_modifica on public.articoli;
create trigger articoli_modifica
  after insert or update or delete on public.articoli
  for each statement execute function public.segna_modifica();

drop trigger if exists recensioni_modifica on public.recensioni;
create trigger recensioni_modifica
  after insert or update or delete on public.recensioni
  for each statement execute function public.segna_modifica();

drop trigger if exists lavori_modifica on public.lavori;
create trigger lavori_modifica
  after insert or update or delete on public.lavori
  for each statement execute function public.segna_modifica();

drop trigger if exists impostazioni_modifica on public.impostazioni;
create trigger impostazioni_modifica
  after update on public.impostazioni
  for each statement execute function public.segna_modifica();

-- -----------------------------------------------------------------------------
--  6. DEPOSITO DELLE IMMAGINI
-- -----------------------------------------------------------------------------
--  Un solo bucket pubblico: le foto dei cantieri, le copertine degli articoli
--  e i volti delle recensioni finiscono sul sito, non c'e niente da nascondere.
--  Il pannello le riduce prima di caricarle, ma il limite resta per sicurezza.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('immagini', 'immagini', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

drop policy if exists "immagini pubbliche" on storage.objects;
create policy "immagini pubbliche"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'immagini');

drop policy if exists "admin carica immagini" on storage.objects;
create policy "admin carica immagini"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'immagini' and public.e_admin());

drop policy if exists "admin aggiorna immagini" on storage.objects;
create policy "admin aggiorna immagini"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'immagini' and public.e_admin())
  with check (bucket_id = 'immagini' and public.e_admin());

drop policy if exists "admin cancella immagini" on storage.objects;
create policy "admin cancella immagini"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'immagini' and public.e_admin());

-- -----------------------------------------------------------------------------
--  7. CONTROLLO
-- -----------------------------------------------------------------------------
--  Se tutto e andato, questa query risponde con le sei tabelle e il bucket.

select 'tabella' as tipo, tablename as nome
from pg_tables
where schemaname = 'public'
  and tablename in ('richieste', 'recensioni', 'lavori', 'impostazioni', 'pubblicazione', 'admin_email')
union all
select 'bucket', id from storage.buckets where id = 'immagini'
order by 1, 2;
