-- =============================================================================
--  MDA IMPRESA EDILE, schema del pannello di amministrazione
-- =============================================================================
--  Da eseguire una volta sola nell'SQL Editor di Supabase.
--
--  Principio da tenere a mente leggendo tutto il resto: la chiave che sta nel
--  browser e pubblica per costruzione. Chiunque apra il sorgente della pagina
--  la vede. Quindi NON e la chiave a proteggere i dati: sono le policy qui
--  sotto. Ogni tabella ha RLS attiva e nessuna concede scrittura all'anonimo.
--
--  Chi puo amministrare non e "chi ha fatto il login", ma "chi ha fatto il
--  login E ha l'email in admin_email". Sono due cose diverse: con Supabase
--  Auth chiunque potrebbe registrarsi, e senza questa seconda condizione si
--  ritroverebbe il pannello in mano.
-- =============================================================================

-- -----------------------------------------------------------------------------
--  1. CHI E AMMINISTRATORE
-- -----------------------------------------------------------------------------

create table if not exists public.admin_email (
  email text primary key,
  nota  text,
  creato timestamptz not null default now()
);

alter table public.admin_email enable row level security;

-- La tabella si legge solo per sapere se sei dentro, e solo su te stesso:
-- nessuno puo scaricare l'elenco degli amministratori.
drop policy if exists "admin vede se stesso" on public.admin_email;
create policy "admin vede se stesso"
  on public.admin_email for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- Nessuna policy di insert/update/delete: si aggiunge un amministratore solo
-- da qui, con la chiave service_role, mai dal sito.

-- Funzione di comodo, usata dalle policy piu sotto.
create or replace function public.e_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_email
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- TODO ARTIOM: la riga che da accesso. Sostituisci con l'email vera del
-- cliente, poi crea l'utente in Authentication, Users.
-- insert into public.admin_email (email, nota)
-- values ('impresaedilemda@gmail.com', 'proprietario') on conflict do nothing;

-- -----------------------------------------------------------------------------
--  2. ARTICOLI DEL BLOG
-- -----------------------------------------------------------------------------

create table if not exists public.articoli (
  id         text primary key,
  titolo     text not null default '',
  slug       text not null default '',
  estratto   text not null default '',
  copertina  text,
  contenuto  text not null default '',
  bozza      boolean not null default true,
  creato     timestamptz not null default now(),
  aggiornato timestamptz not null default now()
);

create unique index if not exists articoli_slug_unico
  on public.articoli (slug) where slug <> '';

create index if not exists articoli_pubblicati
  on public.articoli (creato desc) where bozza = false;

alter table public.articoli enable row level security;

-- Il sito pubblico legge SOLO gli articoli pubblicati: una bozza non deve
-- essere raggiungibile da chi conosce l'indirizzo dell'API.
drop policy if exists "tutti leggono i pubblicati" on public.articoli;
create policy "tutti leggono i pubblicati"
  on public.articoli for select
  to anon, authenticated
  using (bozza = false);

drop policy if exists "admin legge tutto" on public.articoli;
create policy "admin legge tutto"
  on public.articoli for select
  to authenticated
  using (public.e_admin());

drop policy if exists "admin scrive" on public.articoli;
create policy "admin scrive"
  on public.articoli for all
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

-- -----------------------------------------------------------------------------
--  3. FOTO DELLA GALLERIA
-- -----------------------------------------------------------------------------
--  Una riga solo per le foto SOSTITUITE. Quelle mai toccate restano nel
--  codice del sito: cosi il sito continua a funzionare anche se il database
--  non risponde, e "rimetti l'originale" e semplicemente cancellare la riga.

create table if not exists public.galleria (
  posto      text primary key,
  url        text not null,
  originale  text not null,
  aggiornato timestamptz not null default now()
);

alter table public.galleria enable row level security;

drop policy if exists "tutti leggono la galleria" on public.galleria;
create policy "tutti leggono la galleria"
  on public.galleria for select to anon, authenticated using (true);

drop policy if exists "admin cambia la galleria" on public.galleria;
create policy "admin cambia la galleria"
  on public.galleria for all
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

-- -----------------------------------------------------------------------------
--  4. LINK DI TRACCIAMENTO
-- -----------------------------------------------------------------------------

create table if not exists public.link (
  id           text primary key,
  codice       text not null unique,
  etichetta    text not null default '',
  destinazione text not null default '/',
  creato       timestamptz not null default now()
);

alter table public.link enable row level security;

-- Pubblico in lettura: la pagina /l/<codice> deve poter risolvere la
-- destinazione senza che il visitatore sia loggato.
drop policy if exists "tutti risolvono i link" on public.link;
create policy "tutti risolvono i link"
  on public.link for select to anon, authenticated using (true);

drop policy if exists "admin gestisce i link" on public.link;
create policy "admin gestisce i link"
  on public.link for all
  to authenticated
  using (public.e_admin())
  with check (public.e_admin());

-- -----------------------------------------------------------------------------
--  5. VISITE
-- -----------------------------------------------------------------------------
--  Contatore proprio, rispettoso della privacy: una riga per visualizzazione.
--  Nessun cookie, nessun indirizzo IP, nessuna impronta del browser. La
--  sessione e un identificativo casuale che muore quando si chiude la scheda.
--  Questo e anche il motivo per cui il sito non ha il banner dei cookie: non
--  c'e niente da consentire.

create table if not exists public.visite (
  id          bigserial primary key,
  percorso    text not null,
  sorgente    text,
  dispositivo text not null default 'computer',
  sessione    uuid not null,
  codice_link text,
  creato      timestamptz not null default now()
);

create index if not exists visite_creato on public.visite (creato desc);
create index if not exists visite_sessione on public.visite (sessione);

alter table public.visite enable row level security;

-- L'anonimo puo SOLO aggiungere una riga. Non puo leggere le visite altrui,
-- non puo modificarle, non puo cancellarle. Senza il "with check" qui sotto
-- chiunque potrebbe scrivere righe con date nel passato e falsare i grafici.
drop policy if exists "chiunque registra una visita" on public.visite;
create policy "chiunque registra una visita"
  on public.visite for insert
  to anon, authenticated
  with check (
    creato > now() - interval '5 minutes'
    and creato < now() + interval '5 minutes'
    and length(percorso) between 1 and 300
    and (sorgente is null or length(sorgente) <= 160)
    and dispositivo in ('computer', 'telefono')
    and (codice_link is null or length(codice_link) <= 60)
  );

drop policy if exists "admin legge le visite" on public.visite;
create policy "admin legge le visite"
  on public.visite for select
  to authenticated
  using (public.e_admin());

-- -----------------------------------------------------------------------------
--  6. STATISTICHE
-- -----------------------------------------------------------------------------
--  Il conto lo fa il database, in ora italiana. Se i giorni li calcolasse il
--  browser, una macchina in un altro fuso cercherebbe date che nella risposta
--  non esistono e pezzi di traffico sparirebbero dal grafico.
--
--  generate_series riempie anche i giorni a zero: senza, la linea salterebbe
--  da un giorno con visite al successivo, dando l'impressione sbagliata.

create or replace function public.statistiche(giorni integer)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  da date := (now() at time zone 'Europe/Rome')::date - (greatest(giorni, 1) - 1);
  al date := (now() at time zone 'Europe/Rome')::date;
  risultato jsonb;
begin
  if not public.e_admin() then
    raise exception 'non autorizzato';
  end if;

  with base as (
    select
      (creato at time zone 'Europe/Rome')::date as giorno,
      percorso, sorgente, dispositivo, sessione, codice_link
    from public.visite
    where (creato at time zone 'Europe/Rome')::date between da and al
  ),
  giorni_pieni as (
    select g::date as giorno from generate_series(da, al, interval '1 day') g
  )
  select jsonb_build_object(
    'totale', (
      select jsonb_build_object(
        'visualizzazioni', count(*),
        'unici', count(distinct sessione)
      ) from base
    ),
    'serie', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'etichetta', to_char(gp.giorno, 'YYYY-MM-DD'),
        'visualizzazioni', coalesce(b.visualizzazioni, 0),
        'unici', coalesce(b.unici, 0)
      ) order by gp.giorno), '[]'::jsonb)
      from giorni_pieni gp
      left join (
        select giorno, count(*) as visualizzazioni, count(distinct sessione) as unici
        from base group by giorno
      ) b on b.giorno = gp.giorno
    ),
    'pagine', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select percorso, count(*) as visualizzazioni
        from base group by percorso order by count(*) desc limit 10
      ) x
    ),
    'sorgenti', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select coalesce(nullif(sorgente, ''), 'diretto') as sorgente,
               count(distinct sessione) as sessioni
        from base group by 1 order by 2 desc limit 10
      ) x
    ),
    'dispositivi', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select dispositivo, count(distinct sessione) as sessioni
        from base group by dispositivo order by 2 desc
      ) x
    ),
    'link', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select codice_link as codice, count(*) as visualizzazioni,
               count(distinct sessione) as sessioni
        from base where codice_link is not null
        group by codice_link order by 3 desc limit 20
      ) x
    )
  ) into risultato;

  return risultato;
end;
$$;

create or replace function public.statistiche_mesi(mesi integer)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  da date := date_trunc('month', (now() at time zone 'Europe/Rome')::date)::date
             - ((greatest(mesi, 1) - 1) || ' months')::interval;
  risultato jsonb;
begin
  if not public.e_admin() then
    raise exception 'non autorizzato';
  end if;

  with base as (
    select
      date_trunc('month', (creato at time zone 'Europe/Rome'))::date as mese,
      percorso, sorgente, dispositivo, sessione, codice_link
    from public.visite
    where (creato at time zone 'Europe/Rome')::date >= da
  ),
  mesi_pieni as (
    select m::date as mese from generate_series(
      da, date_trunc('month', (now() at time zone 'Europe/Rome')::date)::date, interval '1 month'
    ) m
  )
  select jsonb_build_object(
    'totale', (
      select jsonb_build_object('visualizzazioni', count(*), 'unici', count(distinct sessione)) from base
    ),
    'serie', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'etichetta', to_char(mp.mese, 'YYYY-MM'),
        'visualizzazioni', coalesce(b.visualizzazioni, 0),
        'unici', coalesce(b.unici, 0)
      ) order by mp.mese), '[]'::jsonb)
      from mesi_pieni mp
      left join (
        select mese, count(*) as visualizzazioni, count(distinct sessione) as unici
        from base group by mese
      ) b on b.mese = mp.mese
    ),
    'pagine', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select percorso, count(*) as visualizzazioni
        from base group by percorso order by count(*) desc limit 10
      ) x
    ),
    'sorgenti', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select coalesce(nullif(sorgente, ''), 'diretto') as sorgente,
               count(distinct sessione) as sessioni
        from base group by 1 order by 2 desc limit 10
      ) x
    ),
    'dispositivi', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select dispositivo, count(distinct sessione) as sessioni
        from base group by dispositivo order by 2 desc
      ) x
    ),
    'link', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select codice_link as codice, count(*) as visualizzazioni,
               count(distinct sessione) as sessioni
        from base where codice_link is not null
        group by codice_link order by 3 desc limit 20
      ) x
    )
  ) into risultato;

  return risultato;
end;
$$;

revoke all on function public.statistiche(integer) from public, anon;
revoke all on function public.statistiche_mesi(integer) from public, anon;
grant execute on function public.statistiche(integer) to authenticated;
grant execute on function public.statistiche_mesi(integer) to authenticated;

-- -----------------------------------------------------------------------------
--  7. PULIZIA
-- -----------------------------------------------------------------------------
--  Le visite piu vecchie di due anni non servono a nessuno e sono comunque
--  dati da conservare il minimo necessario. Da chiamare a mano o da un cron.

create or replace function public.pulisci_visite()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  cancellate integer;
begin
  delete from public.visite where creato < now() - interval '2 years';
  get diagnostics cancellate = row_count;
  return cancellate;
end;
$$;

revoke all on function public.pulisci_visite() from public, anon;
