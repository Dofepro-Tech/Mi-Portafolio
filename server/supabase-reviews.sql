-- Ejecuta este script una vez en Supabase: SQL Editor.
create table if not exists public.resenas (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(nombre) between 2 and 80),
  comentario text not null check (char_length(comentario) between 10 and 600),
  puntuacion smallint not null check (puntuacion between 1 and 5),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  created_at timestamptz not null default now()
);

create index if not exists resenas_publicadas_fecha_idx
  on public.resenas (estado, created_at desc);
