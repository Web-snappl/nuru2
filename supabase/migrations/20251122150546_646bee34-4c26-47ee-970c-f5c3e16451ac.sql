-- Najpierw usuń trigger
DROP TRIGGER IF EXISTS update_ogloszenia_updated_at ON public.ogloszenia;

-- Usuń starą funkcję
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Utwórz funkcję z poprawnym search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Utwórz trigger ponownie
CREATE TRIGGER update_ogloszenia_updated_at
  BEFORE UPDATE ON public.ogloszenia
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();