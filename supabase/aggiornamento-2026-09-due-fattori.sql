-- =============================================================================
--  MDA IMPRESA EDILE, verifica in due passaggi (settembre 2026)
-- =============================================================================
--  Da eseguire DOPO schema.sql e aggiornamento-2026-09.sql, nell'SQL Editor
--  di Supabase. Si puo lanciare piu volte: sostituisce sempre la stessa
--  funzione.
--
--  Cosa cambia: e_admin(), la funzione che tutte le policy usano per dire
--  "questa persona puo scrivere", chiede una cosa in piu. Se il conto ha
--  un'app di verifica collegata (un fattore TOTP confermato), la sessione
--  deve averla superata: nel token di Supabase la voce "aal" vale "aal2".
--  Una sessione con la sola password ("aal1") di un conto con l'app resta
--  fuori da tutto, anche se qualcuno aggira la schermata del codice.
--
--  Un conto SENZA app collegata entra come prima: la verifica e facoltativa
--  finche il cliente non la attiva dal pannello (la proposta che compare
--  all'ingresso, oppure Impostazioni, Il tuo accesso).
--
--  Prima di lanciare: in Supabase, Authentication, Multi-Factor, il metodo
--  TOTP deve essere acceso (lo e di default nei progetti nuovi).
--
--  Telefono perso: Authentication, Users, l'utente, sezione "Multi-factor
--  authentication", elimina il fattore. Da quel momento entra di nuovo con
--  la sola password e puo ricollegare il telefono nuovo dal pannello.
-- =============================================================================

create or replace function public.e_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1 from public.admin_email
      where lower(email) = lower(auth.jwt() ->> 'email')
    )
    and (
      -- la sessione ha dato il codice dell'app...
      coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      -- ...oppure il conto non ha nessuna app collegata: basta la password.
      or not exists (
        select 1 from auth.mfa_factors f
        where f.user_id = auth.uid()
          and f.status = 'verified'
      )
    );
$$;

-- La funzione e security definer: legge auth.mfa_factors anche se chi la
-- chiama non potrebbe. Non espone niente, risponde solo vero o falso.
