create table if not exists public.sobrenomes (
  nome character varying not null,
  freq_br integer not null,
  freq_ac integer null,
  freq_al integer null,
  freq_am integer null,
  freq_ap integer null,
  freq_ba integer null,
  freq_ce integer null,
  freq_df integer null,
  freq_es integer null,
  freq_go integer null,
  freq_ma integer null,
  freq_mg integer null,
  freq_ms integer null,
  freq_mt integer null,
  freq_pa integer null,
  freq_pb integer null,
  freq_pe integer null,
  freq_pi integer null,
  freq_pr integer null,
  freq_rj integer null,
  freq_ro integer null,
  freq_rn integer null,
  freq_rr integer null,
  freq_rs integer null,
  freq_sc integer null,
  freq_se integer null,
  freq_sp integer null,
  freq_to integer null,
  constraint sobrenomes_pkey primary key (nome)
) TABLESPACE pg_default;

create index if not exists idx_sobrenomes_freq_br on public.sobrenomes (freq_br);
create index if not exists idx_sobrenomes_freq_ac on public.sobrenomes (freq_ac);
create index if not exists idx_sobrenomes_freq_al on public.sobrenomes (freq_al);
create index if not exists idx_sobrenomes_freq_am on public.sobrenomes (freq_am);
create index if not exists idx_sobrenomes_freq_ap on public.sobrenomes (freq_ap);
create index if not exists idx_sobrenomes_freq_ba on public.sobrenomes (freq_ba);
create index if not exists idx_sobrenomes_freq_ce on public.sobrenomes (freq_ce);
create index if not exists idx_sobrenomes_freq_df on public.sobrenomes (freq_df);
create index if not exists idx_sobrenomes_freq_es on public.sobrenomes (freq_es);
create index if not exists idx_sobrenomes_freq_go on public.sobrenomes (freq_go);
create index if not exists idx_sobrenomes_freq_ma on public.sobrenomes (freq_ma);
create index if not exists idx_sobrenomes_freq_mg on public.sobrenomes (freq_mg);
create index if not exists idx_sobrenomes_freq_ms on public.sobrenomes (freq_ms);
create index if not exists idx_sobrenomes_freq_mt on public.sobrenomes (freq_mt);
create index if not exists idx_sobrenomes_freq_pa on public.sobrenomes (freq_pa);
create index if not exists idx_sobrenomes_freq_pb on public.sobrenomes (freq_pb);
create index if not exists idx_sobrenomes_freq_pe on public.sobrenomes (freq_pe);
create index if not exists idx_sobrenomes_freq_pi on public.sobrenomes (freq_pi);
create index if not exists idx_sobrenomes_freq_pr on public.sobrenomes (freq_pr);
create index if not exists idx_sobrenomes_freq_rj on public.sobrenomes (freq_rj);
create index if not exists idx_sobrenomes_freq_ro on public.sobrenomes (freq_ro);
create index if not exists idx_sobrenomes_freq_rn on public.sobrenomes (freq_rn);
create index if not exists idx_sobrenomes_freq_rr on public.sobrenomes (freq_rr);
create index if not exists idx_sobrenomes_freq_rs on public.sobrenomes (freq_rs);
create index if not exists idx_sobrenomes_freq_sc on public.sobrenomes (freq_sc);
create index if not exists idx_sobrenomes_freq_se on public.sobrenomes (freq_se);
create index if not exists idx_sobrenomes_freq_sp on public.sobrenomes (freq_sp);
create index if not exists idx_sobrenomes_freq_to on public.sobrenomes (freq_to);

create table if not exists public.localidades (
  cod integer not null,
  nome character varying not null,
  uf character varying not null,
  pop_local integer not null,
  constraint localidades_pkey primary key (cod)
) TABLESPACE pg_default;