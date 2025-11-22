-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create ogloszenia table
create table public.ogloszenia (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Podstawowe informacje
  typ text not null check (typ in ('Prywatne', 'Salon')),
  kategoria text not null check (kategoria in ('Masażystka', 'Masażysta', 'Duet')),
  tytul text not null,
  miasto text not null,
  adres text,
  wojewodztwo text,
  
  -- Lokalizacja na mapie
  map_lat numeric,
  map_lng numeric,
  
  -- Ceny
  cena_zl numeric not null,
  cena_za_h integer not null default 1,
  cennik_u_mnie jsonb default '{}'::jsonb,
  cennik_wyjazd jsonb default '{}'::jsonb,
  
  -- Opisy
  krotki_opis text,
  pelny_opis text,
  
  -- Dane fizyczne
  plec text,
  wiek text,
  biust text,
  rozmiar_biustu text,
  rodzaj_biustu text,
  ksztalt_biustu text,
  waga text,
  wzrost text,
  kolor_wlosow text,
  kolor_oczu text,
  tatuaze text,
  narodowosc text,
  orientacja text,
  wyjazdy text,
  
  -- Kontakt
  telefon text unique not null,
  whatsapp text,
  telegram text,
  email text,
  www text,
  
  -- Status
  is_paid boolean default false,
  is_active boolean default false,
  is_confirmed boolean default false,
  
  -- Metadane
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index idx_ogloszenia_user_id on public.ogloszenia(user_id);
create index idx_ogloszenia_miasto on public.ogloszenia(miasto);
create index idx_ogloszenia_wojewodztwo on public.ogloszenia(wojewodztwo);
create index idx_ogloszenia_kategoria on public.ogloszenia(kategoria);
create index idx_ogloszenia_typ on public.ogloszenia(typ);
create index idx_ogloszenia_is_active on public.ogloszenia(is_active);
create index idx_ogloszenia_is_confirmed on public.ogloszenia(is_confirmed);

-- Enable RLS on ogloszenia
alter table public.ogloszenia enable row level security;

-- Ogloszenia policies
create policy "Anyone can view active confirmed ads"
  on public.ogloszenia for select
  using (is_active = true and is_confirmed = true);

create policy "Users can view own ads"
  on public.ogloszenia for select
  using (auth.uid() = user_id);

create policy "Users can create ads"
  on public.ogloszenia for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ads"
  on public.ogloszenia for update
  using (auth.uid() = user_id);

create policy "Users can delete own ads"
  on public.ogloszenia for delete
  using (auth.uid() = user_id);

-- Create ogloszenia_godziny table
create table public.ogloszenia_godziny (
  id uuid default gen_random_uuid() primary key,
  ogloszenie_id uuid references public.ogloszenia(id) on delete cascade not null,
  dzien_tygodnia text not null,
  godzina_od time not null,
  godzina_do time not null
);

-- Enable RLS on ogloszenia_godziny
alter table public.ogloszenia_godziny enable row level security;

create policy "Anyone can view ad hours"
  on public.ogloszenia_godziny for select
  using (exists (
    select 1 from public.ogloszenia
    where ogloszenia.id = ogloszenia_godziny.ogloszenie_id
    and ogloszenia.is_active = true
    and ogloszenia.is_confirmed = true
  ));

create policy "Users can manage own ad hours"
  on public.ogloszenia_godziny for all
  using (exists (
    select 1 from public.ogloszenia
    where ogloszenia.id = ogloszenia_godziny.ogloszenie_id
    and ogloszenia.user_id = auth.uid()
  ));

-- Create ogloszenia_preferencje table
create table public.ogloszenia_preferencje (
  id uuid default gen_random_uuid() primary key,
  ogloszenie_id uuid references public.ogloszenia(id) on delete cascade not null,
  preferencja text not null
);

-- Enable RLS on ogloszenia_preferencje
alter table public.ogloszenia_preferencje enable row level security;

create policy "Anyone can view ad preferences"
  on public.ogloszenia_preferencje for select
  using (exists (
    select 1 from public.ogloszenia
    where ogloszenia.id = ogloszenia_preferencje.ogloszenie_id
    and ogloszenia.is_active = true
    and ogloszenia.is_confirmed = true
  ));

create policy "Users can manage own ad preferences"
  on public.ogloszenia_preferencje for all
  using (exists (
    select 1 from public.ogloszenia
    where ogloszenia.id = ogloszenia_preferencje.ogloszenie_id
    and ogloszenia.user_id = auth.uid()
  ));

-- Create payments table
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  ogloszenie_id uuid references public.ogloszenia(id) on delete set null,
  stripe_payment_id text,
  amount numeric not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS on payments
alter table public.payments enable row level security;

create policy "Users can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- Create ogloszenia_images table
create table public.ogloszenia_images (
  id uuid default gen_random_uuid() primary key,
  ogloszenie_id uuid references public.ogloszenia(id) on delete cascade not null,
  storage_path text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- Enable RLS on ogloszenia_images
alter table public.ogloszenia_images enable row level security;

create policy "Anyone can view active ad images"
  on public.ogloszenia_images for select
  using (exists (
    select 1 from public.ogloszenia
    where ogloszenia.id = ogloszenia_images.ogloszenie_id
    and ogloszenia.is_active = true
    and ogloszenia.is_confirmed = true
  ));

create policy "Users can manage own ad images"
  on public.ogloszenia_images for all
  using (exists (
    select 1 from public.ogloszenia
    where ogloszenia.id = ogloszenia_images.ogloszenie_id
    and ogloszenia.user_id = auth.uid()
  ));

-- Create favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  ogloszenie_id uuid references public.ogloszenia(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, ogloszenie_id)
);

-- Enable RLS on favorites
alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);
