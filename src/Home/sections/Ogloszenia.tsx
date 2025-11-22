import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import mapaSvg from "../../images/mapa.svg";
import OgloszenieMapSection from "./OgloszeniaMapSection";
import OgloszenieZdjecia from "./OgloszeniaZdjecia";

// Payment Link Stripe
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/8x27sK8al3tjdUlfOw1ck00";

type DayKey =
  | "poniedzialek"
  | "wtorek"
  | "sroda"
  | "czwartek"
  | "piatek"
  | "sobota"
  | "niedziela";

type Schedule = Record<
  DayKey,
  {
    enabled: boolean;
    from: string;
    to: string;
  }
>;
const dayLabels: Record<DayKey, string> = {
  poniedzialek: "Poniedziałek",
  wtorek: "Wtorek",
  sroda: "Środa",
  czwartek: "Czwartek",
  piatek: "Piątek",
  sobota: "Sobota",
  niedziela: "Niedziela",
};

const typeOptions = [
  "Prywatne",
  "Salon",
];

const categoryOptions = [
  "Masażystka",
  "Masażysta",
  "Duet",
];

const bustSizes = ["1", "2", "3", "4", "5", "6"];
const bustTypes = ["Naturalny", "Sztuczny"];
const bustShapes = [
  "Wisienka",
  "Cytryna",
  "Jabłuszko",
  "Gruszka",
  "Pomarańcza",
  "Melon",
  "Arbuz",
];

const preferencesList = [
  "Biczowanie",
  "Cuckold",
  "Cztery ręce z kolegą",
  "Cztery ręce z koleżanką",
  "Deptanie",
  "Do ustalenia telefonicznie",
  "Dominacja",
  "Dyskrecja",
  "Eksperymenty",
  "Facesitting",
  "Fetysz butów",
  "Fetysz stóp",
  "Finish na ciało",
  "Finish na twarz",
  "Footjob",
  "Gra wstępna",
  "Klapsy",
  "Klimat BDSM",
  "Klimat GFE",
  "Masaż Body to Body",
  "Masaż dla kobiet",
  "Masaż dla par",
  "Masaż duo",
  "Masaż erotyczny dla kobiet",
  "Masaż erotyczny dla mężczyzn",
  "Masaż erotyczny dla par",
  "Masaż GFE",
  "Masaż klasyczny",
  "Masaż Lingam",
  "Masaż Lomi Lomi",
  "Masaż nuru",
  "Masaż par",
  "Masaż pleców",
  "Masaż profesjonalny",
  "Masaż prostaty",
  "Masaż relaksacyjny",
  "Masaż tantryczny",
  "Masaż Yoni",
  "Mini spódniczki",
  "Namiętne Pocałunki",
  "Odgrywanie ról",
  "Ostre słówka",
  "Palcówka",
  "Pissing",
  "Podwójna satysfakcja",
  "Poldance",
  "Pończochy",
  "Prysznic",
  "Prywatnie",
  "Przytulanie",
  "Referencje na Garso",
  "Rimming (bierny)",
  "Różne pozycje",
  "Seksowna bielizna",
  "Spa",
  "Squirt",
  "Strapon w stronę klienta",
  "Striptiz",
  "Szpilki",
  "Towarzystwo",
  "Wspólna kąpiel",
  "Wspólne wyjazdy",
  "Z zabawkami",
  "Zabawki",
  "Złoty deszcz na klienta",
];

// DODATKOWE POLA
const genderOptions = ["Kobieta", "Mężczyzna", "Inna"];
const yesNoOptions = ["Tak", "Nie"];
const orientationOptions = ["Hetero", "Bi", "Homo"];
const tattooOptions = ["tak", "nie"];

export default function Ogloszenie() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("sukces") === "true") {
      setIsPaid(true);
    }
  }, [user, loading, navigate]);

  const defaultSchedule: Schedule = useMemo(
    () => ({
      poniedzialek: { enabled: true, from: "09:00", to: "17:00" },
      wtorek: { enabled: false, from: "09:00", to: "17:00" },
      sroda: { enabled: false, from: "09:00", to: "17:00" },
      czwartek: { enabled: false, from: "09:00", to: "17:00" },
      piatek: { enabled: false, from: "09:00", to: "17:00" },
      sobota: { enabled: false, from: "10:00", to: "14:00" },
      niedziela: { enabled: false, from: "10:00", to: "14:00" },
    }),
    []
  );

  type FormState = {
    address: string;
    type: string;
    category: string;
    title: string;
    city: string;
    price: string;
    unitHours: number;
    shortDesc: string;
    fullDesc: string;
    location: string;
    phone: string;
    whatsapp: string;
    telegram: string;
    email: string;
    www: string;
    images: (File | null)[];
    bustSize: string;
    bustType: string;
    bustShape: string;
    preferences: string[];
    // DODATKOWE POLA
    plec: string;
    wiek: string;
    biust: string;
    wyjazdy: string;
    narodowosc: string;
    orientacja: string;
    waga: string;
    wzrost: string;
    kolorWlosow: string;
    kolorOczu: string;
    tatuaze: string;
    cennikUMnie: {
    cena: string;
    cena15min: string;
    cena30min: string;
    cenaNoc: string;
    };
    cennikWyjazd: {
    cena: string;
    cena15min: string;
    cena30min: string;
    cenaNoc: string;
    };
  };

  const [form, setForm] = useState<FormState>({
    address: "",
    type: "",
    category: "",
    title: "",
    city: "",
    price: "",
    unitHours: 1,
    shortDesc: "",
    fullDesc: "",
    location: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    email: "",
    www: "",
    images: [] as File[],
    bustSize: "",
    bustType: "",
    bustShape: "",
    preferences: [],
    // DODATKOWE POLA
    plec: "",
    wiek: "",
    biust: "",
    wyjazdy: "",
    narodowosc: "",
    orientacja: "",
    waga: "0",
    wzrost: "",
    kolorWlosow: "",
    kolorOczu: "",
    tatuaze: "",
    cennikUMnie: {
    cena: "0",
    cena15min: "0",
    cena30min: "0",
    cenaNoc: "0",
    },
    cennikWyjazd: {
    cena: "0",
    cena15min: "0",
    cena30min: "0",
    cenaNoc: "0",
  },
  });

  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);

  const shortLeft = 100 - form.shortDesc.length;

  const setValue = (key: keyof typeof form, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const updateDay = (
    key: DayKey,
    patch: Partial<{ enabled: boolean; from: string; to: string }>
  ) =>
    setSchedule((s) => ({
      ...s,
      [key]: { ...s[key], ...patch },
    }));

  const togglePreference = (pref: string) => {
    setForm((f) => {
      let selected = f.preferences as string[];
      if (selected.includes(pref)) {
        selected = selected.filter((p) => p !== pref);
      } else if (selected.length < 10) {
        selected = [...selected, pref];
      }
      return { ...f, preferences: selected };
    });
  };

  const handleStripePay = () => {
    window.location.href = STRIPE_PAYMENT_LINK;
  };
    const checkPhoneDuplicate = async (phone: string) => {
    const res = await fetch(
        `https://nuru.ms/api/ogloszenie-nurus?filters[OgloszeniaKontaktNumer][$eq]=${encodeURIComponent(phone)}`
    );
    const json = await res.json();
    return Array.isArray(json.data) && json.data.length > 0;
    };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const isDuplicate = await checkPhoneDuplicate(form.phone);
  if (isDuplicate) {
    alert("Taki numer telefonu już istnieje w innym ogłoszeniu! Podaj inny numer.");
    return;
  }

  if (!isPaid) {
    alert("Przed dodaniem ogłoszenia musisz zapłacić 50 zł przez Stripe!");
    return;
  }
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          OgloszenieTyp: form.type,
          OgloszenieKategoria: form.category,
          OgloszenieTytul: form.title,
          OgloszenieMiasto: form.city,
          OgloszenieCenaZl: Number(form.price),
          OgloszenieCenaZaH: form.unitHours,
          OgloszenieKrotkiOpis: form.shortDesc,
          OgloszeniePelenOpis: form.fullDesc,
          OgloszenieRozmiarBiustu: form.bustSize,
          OgloszenieRodzajBiustu: form.bustType,
          OgloszenieKsztaltBiustu: form.bustShape,
          OgloszenieAdres: form.address,
          OgloszenieWojewodztwo: form.location,
          OgloszeniaKontaktNumer: form.phone,
          OgloszeniaKontaktWhatsApp: form.whatsapp,
          OgloszeniaKontaktTelegram: form.telegram,
          OgloszeniaEmail: form.email,
          OgloszeniaKontaktStronaWWW: form.www,
          OgloszenieGodziny: Object.entries(schedule)
            .filter(([_, d]) => d.enabled)
            .map(([key, d]) => ({
              DzienTygodnia: key,
              GodzinaOd: `${d.from}:00.000`,
              GodzinaDo: `${d.to}:00.000`,
            })),
          Preferencje: form.preferences.map(pref => ({ Preferencja: pref })),
          userEmail: user?.email,
          // DODATKOWE POLA
          Plec: form.plec,
          Wiek: form.wiek,
          Biust: form.biust,
          Wyjazdy: form.wyjazdy,
          Narodowosc: form.narodowosc,
          Orientacja: form.orientacja,
          Waga: form.waga,
          Wzrost: form.wzrost,
          KolorWlosow: form.kolorWlosow,
          KolorOczu: form.kolorOczu,
          Tatuaze: form.tatuaze,
          cennikUMnie: form.cennikUMnie,
          cennikWyjazd: form.cennikWyjazd,
        })
      );
      form.images
        .filter((f): f is File => !!f)
        .forEach((file) => {
          formData.append("files.Zdjecia", file, file.name);
        });
      const res = await fetch(
        "https://nuru.ms/api/ogloszenie-nurus",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "no json" }));
        console.error("Błąd Strapi:", err);
        alert("Nie udało się dodać ogłoszenia.");
        return;
      }
      alert("Ogłoszenie zostało dodane do bazy!");
      navigate("/");
    } catch (error) {
      console.error("Błąd:", error);
      alert("Wystąpił błąd podczas dodawania ogłoszenia.");
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-5xl mx-auto pt-10 pb-16 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800">
            Dodaj swoje <b className="font-semibold">ogłoszenie</b>
          </h1>
          <p className="text-gray-600 mt-2">
            Wypełnij formularz i zaprezentuj swoje usługi w naszej bazie.
            To tylko kilka kroków!
          </p>
        </div>
        {!isPaid && (
          <div className="mb-8 text-center">
            <div className="mb-2 text-lg text-[#ecb742] font-bold">
              Dodanie ogłoszenia kosztuje 50 zł
            </div>
            <button
              type="button"
              onClick={handleStripePay}
              className="bg-[#ecb742] hover:bg-[#ffe1a1] text-white font-medium px-6 py-2 rounded shadow"
            >
              Zapłać 50 zł przez Stripe
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-10" style={{ opacity: isPaid ? 1 : 0.5, pointerEvents: isPaid ? "auto" : "none" }}>
          {/* 1. Informacje podstawowe */}
          <div className="bg-[#fdf5e2] border border-[#efc872] rounded-xl p-4 md:p-6 relative">
            <div className="absolute -top-4 left-6">
              <div className="bg-[#ecb742] text-white font-semibold rounded-md px-4 py-2 shadow">
                1. Informacje podstawowe
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Typ */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Typ*</label>
                <select
                  value={form.type}
                  onChange={(e) => setValue("type", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 bg-white"
                  required
                >
                  <option value="">Wybierz typ ogłoszenia...</option>
                  {typeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Kategoria */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Kategoria*</label>
                <select
                  value={form.category}
                  onChange={(e) => setValue("category", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 bg-white"
                  required
                >
                  <option value="">Wybierz kategorię ogłoszenia...</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Tytuł */}
              <div className="md:col-span-2 flex flex-col">
                <label className="text-sm text-gray-700 mb-1">
                  Tytuł ogłoszenia*
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setValue("title", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Wpisz tytuł ogłoszenia..."
                  required
                />
              </div>
              {/* Miasto */}
              <div className="md:col-span-2 flex flex-col">
                <label className="text-sm text-gray-700 mb-1">
                  Miasto*
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setValue("city", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Podaj miasto..."
                  required
                />
              </div>
              {/* Cennik u mnie */}
<div className="bg-[#fdf5e2] border border-[#efc872] rounded-xl p-4 md:p-6 relative mt-8">
  <div className="absolute -top-4 left-6">
    <div className="bg-[#ecb742] text-white font-semibold rounded-md px-4 py-2 shadow">
      Cennik u mnie
    </div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">Cena</label>
      <div className="flex items-center">
        <input
          type="number"
          value={form.cennikUMnie.cena}
          onChange={e => setForm(f => ({ ...f, cennikUMnie: { ...f.cennikUMnie, cena: e.target.value } }))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <span className="ml-2 text-gray-500">zł</span>
      </div>
    </div>
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">Cena za 15 min</label>
      <div className="flex items-center">
        <input
          type="number"
          value={form.cennikUMnie.cena15min}
          onChange={e => setForm(f => ({ ...f, cennikUMnie: { ...f.cennikUMnie, cena15min: e.target.value } }))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <span className="ml-2 text-gray-500">zł</span>
      </div>
    </div>
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">Cena za 30 min</label>
      <div className="flex items-center">
        <input
          type="number"
          value={form.cennikUMnie.cena30min}
          onChange={e => setForm(f => ({ ...f, cennikUMnie: { ...f.cennikUMnie, cena30min: e.target.value } }))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <span className="ml-2 text-gray-500">zł</span>
      </div>
    </div>
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">Cena za całą noc</label>
      <div className="flex items-center">
        <input
          type="number"
          value={form.cennikUMnie.cenaNoc}
          onChange={e => setForm(f => ({ ...f, cennikUMnie: { ...f.cennikUMnie, cenaNoc: e.target.value } }))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <span className="ml-2 text-gray-500">zł</span>
      </div>
    </div>
  </div>
</div>

{/* Cennik wyjazd */}
<div className="bg-[#fdf5e2] border border-[#efc872] rounded-xl p-4 md:p-6 relative mt-8">
  <div className="absolute -top-4 left-6">
    <div className="bg-[#ecb742] text-white font-semibold rounded-md px-4 py-2 shadow">
      Cennik wyjazd
    </div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">Cena</label>
      <div className="flex items-center">
        <input
          type="number"
          value={form.cennikWyjazd.cena}
          onChange={e => setForm(f => ({ ...f, cennikWyjazd: { ...f.cennikWyjazd, cena: e.target.value } }))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <span className="ml-2 text-gray-500">zł</span>
      </div>
    </div>
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">Cena za 15 min</label>
      <div className="flex items-center">
        <input
          type="number"
          value={form.cennikWyjazd.cena15min}
          onChange={e => setForm(f => ({ ...f, cennikWyjazd: { ...f.cennikWyjazd, cena15min: e.target.value } }))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <span className="ml-2 text-gray-500">zł</span>
      </div>
    </div>
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">Cena za 30 min</label>
      <div className="flex items-center">
        <input
          type="number"
          value={form.cennikWyjazd.cena30min}
          onChange={e => setForm(f => ({ ...f, cennikWyjazd: { ...f.cennikWyjazd, cena30min: e.target.value } }))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <span className="ml-2 text-gray-500">zł</span>
      </div>
    </div>
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">Cena za całą noc</label>
      <div className="flex items-center">
        <input
          type="number"
          value={form.cennikWyjazd.cenaNoc}
          onChange={e => setForm(f => ({ ...f, cennikWyjazd: { ...f.cennikWyjazd, cenaNoc: e.target.value } }))}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <span className="ml-2 text-gray-500">zł</span>
      </div>
    </div>
  </div>
</div>
            </div>
          </div>

          {/* 2. Informacje dodatkowe */}
          <div className="bg-[#fdf5e2] border border-[#efc872] rounded-xl p-4 md:p-6 relative">
            <div className="absolute -top-4 left-6">
              <div className="bg-[#ecb742] text-white font-semibold rounded-md px-4 py-2 shadow">
                2. Informacje dodatkowe
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {/* Krótki opis */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Krótki opis*</label>
                <input
                  type="text"
                  maxLength={100}
                  value={form.shortDesc}
                  onChange={(e) => setValue("shortDesc", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Dodaj krótki opis... (Maks 100 znaków)"
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  Pozostało znaków: {shortLeft}
                </div>
              </div>
              {/* Pełen opis */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Pełen opis*</label>
                <textarea
                  rows={5}
                  value={form.fullDesc}
                  onChange={(e) => setValue("fullDesc", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 resize-y"
                  placeholder="Dodaj pełen opis widoczny na stronie ogłoszenia..."
                  required
                />
              </div>
              {/* Godziny pracy */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-2">
                  Godziny pracy*
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Object.keys(dayLabels) as DayKey[]).map((key) => {
                    const d = schedule[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={d.enabled}
                              onChange={(e) =>
                                updateDay(key, { enabled: e.target.checked })
                              }
                            />
                            <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#ecb742] transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                          </label>
                          <span className="text-gray-800">{dayLabels[key]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">od</span>
                          <input
                            type="time"
                            value={d.from}
                            disabled={!d.enabled}
                            onChange={(e) =>
                              updateDay(key, { from: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100"
                          />
                          <span className="text-gray-700 text-sm">do</span>
                          <input
                            type="time"
                            value={d.to}
                            disabled={!d.enabled}
                            onChange={(e) =>
                              updateDay(key, { to: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Szczegóły: Biust */}
              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <div className="flex flex-col flex-1">
                  <label className="text-sm text-gray-700 mb-1">Rozmiar biustu</label>
                  <select
                    value={form.bustSize}
                    onChange={e => setValue("bustSize", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="">Wybierz rozmiar...</option>
                    {bustSizes.map(sz => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm text-gray-700 mb-1">Rodzaj biustu</label>
                  <select
                    value={form.bustType}
                    onChange={e => setValue("bustType", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="">Wybierz rodzaj...</option>
                    {bustTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm text-gray-700 mb-1">Kształt biustu</label>
                  <select
                    value={form.bustShape}
                    onChange={e => setValue("bustShape", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="">Wybierz kształt...</option>
                    {bustShapes.map(shape => (
                      <option key={shape} value={shape}>{shape}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Preferencje (multi select, max 10) */}
              <div className="flex flex-col mt-4">
                <label className="text-sm text-gray-700 mb-1">
                  Preferencje (wybierz maksymalnie 10)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {preferencesList.map(pref => (
                    <label
                      key={pref}
                      className={`flex items-center text-sm border rounded px-2 py-1 cursor-pointer transition ${
                        form.preferences.includes(pref)
                          ? "bg-[#ffe1a1] border-[#ecb742] font-semibold"
                          : "bg-white border-gray-300"
                      }`}
                      title={pref}
                    >
                      <input
                        type="checkbox"
                        checked={form.preferences.includes(pref)}
                        onChange={() => togglePreference(pref)}
                        className="mr-2 accent-[#ecb742]"
                        disabled={
                          !form.preferences.includes(pref) &&
                          form.preferences.length >= 10
                        }
                      />
                      {pref}
                    </label>
                  ))}
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  Wybrane: {form.preferences.length} / 10
                </div>
              </div>
            </div>
          </div>

          {/* DODATKOWE POLA */}
          <div className="bg-[#fdf5e2] border border-[#efc872] rounded-xl p-4 md:p-6 relative mt-8">
            <div className="absolute -top-4 left-6">
              <div className="bg-[#ecb742] text-white font-semibold rounded-md px-4 py-2 shadow">
                Dodatkowe pola
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Płeć */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Płeć*</label>
                <select
                  value={form.plec}
                  onChange={e => setValue("plec", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 bg-white"
                  required
                >
                  <option value="">Wybierz...</option>
                  {genderOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Wiek */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Wiek*</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={16}
                    max={99}
                    value={form.wiek}
                    onChange={e => setValue("wiek", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="Wiek"
                    required
                  />
                  <span className="ml-2 text-gray-500">lat</span>
                </div>
              </div>
              {/* Wyjazdy */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Wyjazdy*</label>
                <select
                  value={form.wyjazdy}
                  onChange={e => setValue("wyjazdy", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 bg-white"
                  required
                >
                  <option value="">Wybierz...</option>
                  {yesNoOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Narodowość */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Narodowość*</label>
                <input
                  type="text"
                  value={form.narodowosc}
                  onChange={e => setValue("narodowosc", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Np. Polska"
                  required
                />
              </div>
              {/* Orientacja */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Orientacja*</label>
                <select
                  value={form.orientacja}
                  onChange={e => setValue("orientacja", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 bg-white"
                  required
                >
                  <option value="">Wybierz...</option>
                  {orientationOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Waga */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Waga*</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={30}
                    max={200}
                    value={form.waga}
                    onChange={e => setValue("waga", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="Waga"
                    required
                  />
                  <span className="ml-2 text-gray-500">kg</span>
                </div>
              </div>
              {/* Wzrost */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Wzrost*</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={100}
                    max={220}
                    value={form.wzrost}
                    onChange={e => setValue("wzrost", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="Wzrost"
                    required
                  />
                  <span className="ml-2 text-gray-500">cm</span>
                </div>
              </div>
              {/* Kolor włosów */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Kolor włosów</label>
                <input
                  type="text"
                  value={form.kolorWlosow}
                  onChange={e => setValue("kolorWlosow", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Np. Blond"
                />
              </div>
              {/* Kolor oczu */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Kolor oczu</label>
                <input
                  type="text"
                  value={form.kolorOczu}
                  onChange={e => setValue("kolorOczu", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Np. Brązowe"
                />
              </div>
              {/* Tatuaże */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Tatuaże</label>
                <select
                  value={form.tatuaze}
                  onChange={e => setValue("tatuaze", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 bg-white"
                >
                  <option value="">Wybierz...</option>
                  {tattooOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3. Lokalizacja na mapie */}
          <OgloszenieMapSection
            location={form.location}
            setLocation={loc => setForm(f => ({ ...f, location: loc }))}
            address={form.address}
            setAddress={addr => setForm(f => ({ ...f, address: addr }))}
          />

          {/* 4. Zdjęcia */}
          <OgloszenieZdjecia
            images={form.images.filter((img): img is File => img !== null)}
            setImages={imgs => setForm(f => ({ ...f, images: imgs }))}
          />

          {/* 5. Dane kontaktowe */}
          <div className="bg-[#fdf5e2] border border-[#efc872] rounded-xl px-4 pt-8 pb-6 md:px-6 relative">
            <div className="absolute -top-4 left-6">
              <div className="bg-[#ecb742] text-white font-semibold rounded-md px-4 py-2 shadow">
                5. Dane kontaktowe
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <input
                type="text"
                value={form.phone}
                onChange={e => setValue("phone", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Numer telefonu*"
                required
              />
              <input
                type="text"
                value={form.whatsapp}
                onChange={e => setValue("whatsapp", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="WhatsApp"
              />
              <input
                type="text"
                value={form.telegram}
                onChange={e => setValue("telegram", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Telegram"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <input
                type="email"
                value={form.email}
                onChange={e => setValue("email", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Adres e-mail"
                required
              />
              <input
                type="text"
                value={form.www}
                onChange={e => setValue("www", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Strona www"
              />
            </div>
          </div>

          {/* Akcje */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="submit"
              className="bg-[#ecb742] hover:bg-[#ffe1a1] text-white font-medium px-6 py-2 rounded shadow"
              disabled={!isPaid}
            >
              Zapisz ogłoszenie
            </button>
            <button
              type="button"
              className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2 rounded hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}