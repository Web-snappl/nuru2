-- Tabela główna ogłoszeń
CREATE TABLE public.ogloszenia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Podstawowe informacje
  typ TEXT NOT NULL CHECK (typ IN ('Prywatne', 'Salon')),
  kategoria TEXT NOT NULL CHECK (kategoria IN ('Masażystka', 'Masażysta', 'Duet')),
  tytul TEXT NOT NULL,
  miasto TEXT NOT NULL,
  adres TEXT,
  wojewodztwo TEXT,
  
  -- Opisy
  krotki_opis TEXT CHECK (char_length(krotki_opis) <= 100),
  pelny_opis TEXT,
  
  -- Szczegóły osoby
  plec TEXT,
  wiek TEXT,
  biust TEXT,
  rozmiar_biustu TEXT,
  rodzaj_biustu TEXT,
  ksztalt_biustu TEXT,
  wyjazdy TEXT,
  narodowosc TEXT,
  orientacja TEXT,
  waga TEXT,
  wzrost TEXT,
  kolor_wlosow TEXT,
  kolor_oczu TEXT,
  tatuaze TEXT,
  
  -- Cennik u mnie
  cena_umnie DECIMAL(10, 2) DEFAULT 0,
  cena_umnie_15min DECIMAL(10, 2) DEFAULT 0,
  cena_umnie_30min DECIMAL(10, 2) DEFAULT 0,
  cena_umnie_noc DECIMAL(10, 2) DEFAULT 0,
  
  -- Cennik wyjazd
  cena_wyjazd DECIMAL(10, 2) DEFAULT 0,
  cena_wyjazd_15min DECIMAL(10, 2) DEFAULT 0,
  cena_wyjazd_30min DECIMAL(10, 2) DEFAULT 0,
  cena_wyjazd_noc DECIMAL(10, 2) DEFAULT 0,
  
  -- Kontakt
  telefon TEXT,
  whatsapp TEXT,
  telegram TEXT,
  email TEXT,
  www TEXT,
  
  -- Status i daty
  is_active BOOLEAN DEFAULT true,
  is_confirmed BOOLEAN DEFAULT false,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela zdjęć
CREATE TABLE public.ogloszenia_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ogloszenie_id UUID REFERENCES public.ogloszenia(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela godzin pracy
CREATE TABLE public.ogloszenia_godziny (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ogloszenie_id UUID REFERENCES public.ogloszenia(id) ON DELETE CASCADE NOT NULL,
  dzien_tygodnia TEXT NOT NULL CHECK (dzien_tygodnia IN ('poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela')),
  godzina_od TIME NOT NULL,
  godzina_do TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela preferencji
CREATE TABLE public.ogloszenia_preferencje (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ogloszenie_id UUID REFERENCES public.ogloszenia(id) ON DELETE CASCADE NOT NULL,
  preferencja TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indeksy dla lepszej wydajności
CREATE INDEX idx_ogloszenia_user_id ON public.ogloszenia(user_id);
CREATE INDEX idx_ogloszenia_kategoria ON public.ogloszenia(kategoria);
CREATE INDEX idx_ogloszenia_miasto ON public.ogloszenia(miasto);
CREATE INDEX idx_ogloszenia_wojewodztwo ON public.ogloszenia(wojewodztwo);
CREATE INDEX idx_ogloszenia_is_active ON public.ogloszenia(is_active);
CREATE INDEX idx_ogloszenia_is_confirmed ON public.ogloszenia(is_confirmed);
CREATE INDEX idx_ogloszenia_images_ogloszenie ON public.ogloszenia_images(ogloszenie_id);
CREATE INDEX idx_ogloszenia_godziny_ogloszenie ON public.ogloszenia_godziny(ogloszenie_id);
CREATE INDEX idx_ogloszenia_preferencje_ogloszenie ON public.ogloszenia_preferencje(ogloszenie_id);

-- Enable Row Level Security
ALTER TABLE public.ogloszenia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogloszenia_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogloszenia_godziny ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogloszenia_preferencje ENABLE ROW LEVEL SECURITY;

-- RLS Policies dla ogloszenia
CREATE POLICY "Wszyscy mogą zobaczyć aktywne i potwierdzone ogłoszenia"
  ON public.ogloszenia FOR SELECT
  USING (is_active = true AND is_confirmed = true);

CREATE POLICY "Użytkownicy mogą zobaczyć swoje ogłoszenia"
  ON public.ogloszenia FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą tworzyć swoje ogłoszenia"
  ON public.ogloszenia FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą aktualizować swoje ogłoszenia"
  ON public.ogloszenia FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą usuwać swoje ogłoszenia"
  ON public.ogloszenia FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies dla images
CREATE POLICY "Wszyscy mogą zobaczyć zdjęcia aktywnych ogłoszeń"
  ON public.ogloszenia_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ogloszenia 
      WHERE id = ogloszenie_id 
      AND is_active = true 
      AND is_confirmed = true
    )
  );

CREATE POLICY "Użytkownicy mogą zobaczyć zdjęcia swoich ogłoszeń"
  ON public.ogloszenia_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ogloszenia 
      WHERE id = ogloszenie_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Użytkownicy mogą dodawać zdjęcia do swoich ogłoszeń"
  ON public.ogloszenia_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ogloszenia 
      WHERE id = ogloszenie_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Użytkownicy mogą usuwać zdjęcia swoich ogłoszeń"
  ON public.ogloszenia_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.ogloszenia 
      WHERE id = ogloszenie_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies dla godziny
CREATE POLICY "Wszyscy mogą zobaczyć godziny aktywnych ogłoszeń"
  ON public.ogloszenia_godziny FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ogloszenia 
      WHERE id = ogloszenie_id 
      AND is_active = true 
      AND is_confirmed = true
    )
  );

CREATE POLICY "Użytkownicy mogą zarządzać godzinami swoich ogłoszeń"
  ON public.ogloszenia_godziny FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ogloszenia 
      WHERE id = ogloszenie_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies dla preferencje
CREATE POLICY "Wszyscy mogą zobaczyć preferencje aktywnych ogłoszeń"
  ON public.ogloszenia_preferencje FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ogloszenia 
      WHERE id = ogloszenie_id 
      AND is_active = true 
      AND is_confirmed = true
    )
  );

CREATE POLICY "Użytkownicy mogą zarządzać preferencjami swoich ogłoszeń"
  ON public.ogloszenia_preferencje FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ogloszenia 
      WHERE id = ogloszenie_id 
      AND user_id = auth.uid()
    )
  );

-- Trigger do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ogloszenia_updated_at
  BEFORE UPDATE ON public.ogloszenia
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket dla zdjęć ogłoszeń
INSERT INTO storage.buckets (id, name, public)
VALUES ('ogloszenia-images', 'ogloszenia-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Wszyscy mogą zobaczyć zdjęcia ogłoszeń"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ogloszenia-images');

CREATE POLICY "Użytkownicy mogą dodawać zdjęcia"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ogloszenia-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Użytkownicy mogą usuwać swoje zdjęcia"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'ogloszenia-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );