# Instrukcje konfiguracji Supabase

## 1. Konfiguracja projektu Supabase

### Utwórz projekt w Supabase
1. Przejdź do [supabase.com](https://supabase.com)
2. Utwórz nowy projekt
3. Skopiuj:
   - `SUPABASE_URL` z Project Settings → API
   - `SUPABASE_ANON_KEY` z Project Settings → API

### Dodaj zmienne środowiskowe
Utwórz plik `.env` w głównym katalogu projektu:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Uruchom migracje bazy danych

W Supabase Dashboard → SQL Editor, wykonaj w kolejności:

### Migracja 1: Schema główny
```sql
-- Skopiuj całą zawartość z: supabase/migrations/001_initial_schema.sql
```

### Migracja 2: Storage
```sql
-- Skopiuj całą zawartość z: supabase/migrations/002_storage.sql
```

## 3. Konfiguracja Authentication

### Email Templates
W Supabase Dashboard → Authentication → Email Templates:

1. **Confirm signup**
   - Subject: `Potwierdź swój email w NURU.MS`
   - Body: Dostosuj treść wiadomości z linkiem potwierdzającym

2. **Reset password**
   - Subject: `Resetuj swoje hasło w NURU.MS`
   - Body: Dodaj link do resetowania hasła

### Redirect URLs
W Supabase Dashboard → Authentication → URL Configuration:

1. **Site URL**: Twój URL produkcyjny (np. `https://twoja-domena.com`)
2. **Redirect URLs**: Dodaj:
   - `http://localhost:5173/` (development)
   - `https://twoja-domena.com/` (production)
   - `https://twoja-domena.com/reset-password` (reset hasła)

### Email Settings
W Supabase Dashboard → Authentication → Providers:

1. Włącz **Email** jako provider
2. **Opcjonalnie**: Wyłącz "Confirm email" dla szybszego testowania
   - ⚠️ Pamiętaj włączyć to z powrotem w produkcji!

## 4. Testowanie

### Rejestracja
1. Przejdź do `/Register`
2. Zarejestruj nowego użytkownika
3. Sprawdź email potwierdzający (lub zaloguj się bezpośrednio jeśli "Confirm email" jest wyłączone)

### Logowanie
1. Przejdź do `/Login`
2. Zaloguj się
3. Sprawdź czy widzisz "Witaj, twoj@email.com" w nagłówku

### Dodawanie ogłoszenia
1. Zaloguj się
2. Kliknij "Dodaj ogłoszenie"
3. Wypełnij formularz
4. Ogłoszenie zostanie zapisane w bazie danych (wymaga płatności Stripe dla aktywacji)

## 5. Struktura bazy danych

### Tabele:
- `profiles` - Profile użytkowników
- `ogloszenia` - Ogłoszenia masażystów/masażystek
- `ogloszenia_godziny` - Godziny pracy
- `ogloszenia_preferencje` - Preferencje usług
- `ogloszenia_images` - Metadane zdjęć
- `payments` - Historia płatności
- `favorites` - Ulubione ogłoszenia

### Storage:
- `ogloszenia-images` - Bucket na zdjęcia ogłoszeń

## 6. Bezpieczeństwo

✅ **Row Level Security (RLS)** jest włączony na wszystkich tabelach
✅ Użytkownicy mogą modyfikować tylko swoje dane
✅ Tylko aktywne i potwierdzone ogłoszenia są widoczne publicznie
✅ Hasła są hashowane przez Supabase Auth

## 7. Kolejne kroki

- [ ] Skonfiguruj Stripe dla płatności
- [ ] Dostosuj email templates
- [ ] Dodaj custom domain
- [ ] Skonfiguruj backup bazy danych
- [ ] Skonfiguruj monitoring
