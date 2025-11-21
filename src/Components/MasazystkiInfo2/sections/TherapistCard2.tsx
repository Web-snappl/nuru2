import PhoneCall from "../../../images/phone-call.png";
import Mail from "../../../images/mail.png";
import MapPin from "../../../images/map-pin.png";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapaAdres from "../../../Home/sections/MapaAdres";

const STRAPI_BASE_URL = "https://admin.nuru.ms";

export default function TherapistFullProfile({ ad }: any) {
  const location = useLocation();
  const [effectiveAd, setEffectiveAd] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showMail, setShowMail] = useState(false);

  // normalizacja: jeśli dostaniemy raw { id, attributes } lub już spłaszczony -> zwróć spłaszczony
  const normalize = (raw: any) => {
    if (!raw) return null;
    if (raw.attributes && typeof raw.attributes === "object") {
      return { id: raw.id, ...raw.attributes };
    }
    return raw;
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // najpierw spróbuj prop ad, potem location.state.ad
      let candidate = normalize(ad) || normalize(location.state?.ad);
      if (!candidate) {
        if (mounted) setEffectiveAd(null);
        return;
      }

      // sprawdź czy mamy godziny i cennik (przynajmniej jedno)
      const hasHours = Array.isArray(candidate.OgloszenieGodziny) && candidate.OgloszenieGodziny.length > 0;
      const hasCennik = candidate.cennikUMnie || candidate.cennikWyjazd;

      if (hasHours && hasCennik) {
        if (mounted) setEffectiveAd(candidate);
        return;
      }

      // jeśli brakuje szczegółów — fetch pełnego ogłoszenia po id z populate=*
      try {
        setLoading(true);
        const id = candidate.id;
        const res = await fetch(`${STRAPI_BASE_URL}/api/ogloszenie-nurus/${id}?populate=*`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const item = json.data;
        const attrs = item.attributes || item;
        const flattened = { id: item.id, ...attrs };
        if (mounted) setEffectiveAd(flattened);
      } catch (e) {
        console.error("Error fetching full ad:", e);
        // ustaw chociaż częściowe dane
        if (mounted) setEffectiveAd(candidate);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [ad, location.state]);

  if (loading) return <div className="p-6">Ładowanie ogłoszenia...</div>;
  if (!effectiveAd) return <div className="p-6">Brak danych ogłoszenia.</div>;

  // Dane gotowe do użycia
  const prefs: string[] = effectiveAd.Preferencje?.map((p: any) => p.Preferencja) || [];
  const cennikUMnie = Array.isArray(effectiveAd.cennikUMnie) ? effectiveAd.cennikUMnie[0] : effectiveAd.cennikUMnie;
  const cennikWyjazd = Array.isArray(effectiveAd.cennikWyjazd) ? effectiveAd.cennikWyjazd[0] : effectiveAd.cennikWyjazd;
  const godziny = effectiveAd.OgloszenieGodziny || [];
  const images = effectiveAd.Zdjecia?.length ? effectiveAd.Zdjecia : [{ url: "" }];
  const imageUrl =
    images[photoIdx]?.url
      ? `${STRAPI_BASE_URL}${images[photoIdx].url}`
      : "https://via.placeholder.com/400x400";

  // helpers: formatuj i warunkowo pokazuj ceny (nie pokazujemy 0)
  const formatPrice = (val: any) => {
    const num = Number(val);
    if (!isFinite(num) || num <= 0) return "";
    return `${num} zł`;
  };

  const shouldShowRow = (a: any, b: any) => {
    const na = Number(a);
    const nb = Number(b);
    return (isFinite(na) && na > 0) || (isFinite(nb) && nb > 0);
  };

  return (
    <>
      {/* GÓRNY BLOK */}
      <section className="w-full bg-[#faf0d8] py-10 text-[#3E4249]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Galeria zdjęć z przewijaniem */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 relative">
            <img
              src={imageUrl}
              className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl object-contain bg-white shadow"
              alt={effectiveAd.OgloszenieTytul}
              style={{ maxHeight: 684, height: "100%", objectFit: "contain" }}
            />
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#ecb742] text-white rounded-full p-2 shadow hover:bg-[#ffe1a1] transition"
                  style={{ zIndex: 2 }}
                  onClick={() => setPhotoIdx((i) => Math.max(i - 1, 0))}
                  disabled={photoIdx === 0}
                  aria-label="Poprzednie zdjęcie"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ecb742] text-white rounded-full p-2 shadow hover:bg-[#ffe1a1] transition"
                  style={{ zIndex: 2 }}
                  onClick={() => setPhotoIdx((i) => Math.min(i + 1, images.length - 1))}
                  disabled={photoIdx === images.length - 1}
                  aria-label="Następne zdjęcie"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((img: any, idx: number) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 rounded-full ${idx === photoIdx ? "bg-[#ecb742]" : "bg-white opacity-60"} border border-[#ecb742]`}
                    ></span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Dane i opis oraz kontakt */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2">{effectiveAd.OgloszenieTytul}</h2>
            <p className="text-lg font-medium mb-2">{effectiveAd.OgloszenieKategoria}</p>
            <p className="text-base mb-4 leading-relaxed">{effectiveAd.OgloszenieKrotkiOpis}</p>

            <div className="flex flex-col gap-3 mb-4 w-full">
              <div className="flex items-center justify-center bg-[#ecb742] text-white font-semibold px-6 py-3 rounded transition w-full gap-2">
                <img src={PhoneCall} className="w-5 h-5" alt="Telefon" />
                <span className="font-semibold text-base">{effectiveAd.OgloszeniaKontaktNumer}</span>
              </div>
              <div className="flex items-center justify-center bg-[#ecb742] text-white font-semibold px-6 py-3 rounded transition w-full gap-2">
                <img src={Mail} className="w-5 h-5" alt="Mail" />
                <span className="font-semibold text-base">{effectiveAd.OgloszeniaEmail}</span>
              </div>
            </div>

            <div className="text-base font-semibold mb-0">Adres:</div>
            <div className="text-base mb-2">
              {effectiveAd.OgloszenieAdres}
              <br />
              {effectiveAd.OgloszenieMiasto}
            </div>

            {/* MAPA GOOGLE */}
            <div className="mt-2">
              <MapaAdres address={`${effectiveAd.OgloszenieAdres}, ${effectiveAd.OgloszenieMiasto}`} />
            </div>
          </div>
        </div>
      </section>

      {/* DOLNA SEKCJA */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lewa strona: Informacje, Preferencje, O mnie */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Informacje */}
          <div className="bg-white border rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bold text-xl mb-4 text-[#222] flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#ecb742] mr-2" /> Informacje
              </h2>
              <div className="space-y-2 text-base">
                <div>Płeć: <span className="font-bold">{effectiveAd.Plec}</span></div>
                <div>Wiek: <span className="font-bold">{effectiveAd.Wiek} lat</span></div>
                <div>Narodowość: <span className="font-bold">{effectiveAd.Narodowosc}</span></div>
                <div>Orientacja: <span className="font-bold">{effectiveAd.Orientacja}</span></div>
              </div>
            </div>
            <div>
              <div className="space-y-2 text-base mt-8 md:mt-0">
                <div>Wzrost: <span className="font-bold">{effectiveAd.Wzrost} cm</span></div>
                <div>Waga: <span className="font-bold">{effectiveAd.Waga} kg</span></div>
                <div>Kolor włosów: <span className="font-bold">{effectiveAd.KolorWlosow}</span></div>
                <div>Kolor oczu: <span className="font-bold">{effectiveAd.KolorOczu}</span></div>
                <div>Tatuaże: <span className="font-bold">{effectiveAd.Tatuaze}</span></div>
              </div>
            </div>
          </div>

          {/* Preferencje */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-bold text-xl mb-4 text-[#222] flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#ecb742] mr-2" /> Preferencje
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {prefs.map((p: string, idx: number) => (
                <span key={idx} className="bg-gray-100 rounded px-3 py-1 text-base font-semibold">{p}</span>
              ))}
            </div>
            <div className="mt-2 font-semibold text-base">
              Wyjazdy: <span className="font-normal">{effectiveAd.Wyjazdy}</span>
            </div>
          </div>

          {/* O mnie */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-bold text-xl mb-4 text-[#222] flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#ecb742] mr-2" /> O mnie
            </h2>
            <div className="text-base text-[#222] whitespace-pre-line">{effectiveAd.OgloszeniePelenOpis}</div>
          </div>
        </div>

        {/* Prawa kolumna: Cennik + Godziny spotkań w jednym boksie */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#ffe1a1] to-[#ecb742] rounded-lg p-6 text-[#3E4249] min-h-[380px] flex flex-col justify-start">
          {/* Cennik */}
          <h2 className="font-bold text-xl mb-2">Cennik</h2>

          <div className="flex flex-col w-full mt-0 mb-4">
            <div className="flex flex-row w-full font-medium mb-2">
              <div className="flex-1 text-left"></div>
              <div className="flex-1 text-center">U mnie</div>
              <div className="flex-1 text-center">Wyjazd</div>
            </div>

            {/* 15 minut */}
            {shouldShowRow(cennikUMnie?.cena15min, cennikWyjazd?.cena15min) && (
              <div className="flex flex-row w-full py-1">
                <div className="flex-1 text-left">15 minut</div>
                <div className="flex-1 text-center font-bold">{formatPrice(cennikUMnie?.cena15min)}</div>
                <div className="flex-1 text-center font-bold">{formatPrice(cennikWyjazd?.cena15min)}</div>
              </div>
            )}

            {/* 30 minut */}
            {shouldShowRow(cennikUMnie?.cena30min, cennikWyjazd?.cena30min) && (
              <div className="flex flex-row w-full py-1">
                <div className="flex-1 text-left">30 minut</div>
                <div className="flex-1 text-center font-bold">{formatPrice(cennikUMnie?.cena30min)}</div>
                <div className="flex-1 text-center font-bold">{formatPrice(cennikWyjazd?.cena30min)}</div>
              </div>
            )}

            {/* 1 godzina */}
            {shouldShowRow(cennikUMnie?.cena, cennikWyjazd?.cena) && (
              <div className="flex flex-row w-full py-1">
                <div className="flex-1 text-left">1 godzina</div>
                <div className="flex-1 text-center font-bold">{formatPrice(cennikUMnie?.cena)}</div>
                <div className="flex-1 text-center font-bold">{formatPrice(cennikWyjazd?.cena)}</div>
              </div>
            )}

            {/* cała noc */}
            {shouldShowRow(cennikUMnie?.cenaNoc, cennikWyjazd?.cenaNoc) && (
              <div className="flex flex-row w-full py-1">
                <div className="flex-1 text-left">cała noc</div>
                <div className="flex-1 text-center font-bold">{formatPrice(cennikUMnie?.cenaNoc)}</div>
                <div className="flex-1 text-center font-bold">{formatPrice(cennikWyjazd?.cenaNoc)}</div>
              </div>
            )}
          </div>

          {/* Godziny spotkań */}
          <h2 className="font-bold text-xl mb-2">Godziny spotkań</h2>
          <div className="space-y-2">
            {godziny.map((g: any, idx: number) => (
              <div key={idx} className="flex flex-row items-center gap-2 font-semibold">
                <span>{g.DzienTygodnia}</span>
                <span className="text-sm font-mono font-bold">
                  {g.GodzinaOd} - {g.GodzinaDo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}