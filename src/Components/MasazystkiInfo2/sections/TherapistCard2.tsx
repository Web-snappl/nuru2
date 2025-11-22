import PhoneCall from "../../../images/phone-call.png";
import Mail from "../../../images/mail.png";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapaAdres from "../../../Home/sections/MapaAdres";
import { supabase } from "../../../lib/supabase";
import { fetchOgloszenieById } from "../../../services/ogloszeniaService";

export default function TherapistFullProfile({ ad }: any) {
  const location = useLocation();
  const [effectiveAd, setEffectiveAd] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      let candidate = ad || location.state?.ad;
      if (!candidate) {
        if (mounted) setEffectiveAd(null);
        return;
      }

      // Sprawdź czy mamy wszystkie dane
      const hasFullData = 
        candidate.ogloszenia_godziny && 
        candidate.ogloszenia_preferencje &&
        candidate.ogloszenia_images;

      if (hasFullData) {
        if (mounted) setEffectiveAd(candidate);
        return;
      }

      // Pobierz pełne dane z bazy
      try {
        setLoading(true);
        const fullData = await fetchOgloszenieById(candidate.id);
        if (mounted && fullData) {
          setEffectiveAd(fullData);
        } else if (mounted) {
          setEffectiveAd(candidate);
        }
      } catch (e) {
        console.error("Error fetching full ad:", e);
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

  useEffect(() => {
    if (effectiveAd?.ogloszenia_images) {
      const urls = effectiveAd.ogloszenia_images
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => {
          const { data } = supabase.storage
            .from('ogloszenia-images')
            .getPublicUrl(img.storage_path);
          return data.publicUrl;
        });
      setImageUrls(urls);
    }
  }, [effectiveAd]);

  if (loading) return <div className="p-6">Ładowanie ogłoszenia...</div>;
  if (!effectiveAd) return <div className="p-6">Brak danych ogłoszenia.</div>;

  const prefs: string[] = effectiveAd.ogloszenia_preferencje?.map((p: any) => p.preferencja) || [];
  const godziny = effectiveAd.ogloszenia_godziny || [];
  const currentImage = imageUrls[photoIdx] || "https://via.placeholder.com/400x400";

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
          {/* Galeria zdjęć */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 relative">
            <img
              src={currentImage}
              className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl object-contain bg-white shadow"
              alt={effectiveAd.tytul}
              style={{ maxHeight: 684, height: "100%", objectFit: "contain" }}
            />
            {imageUrls.length > 1 && (
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
                  onClick={() => setPhotoIdx((i) => Math.min(i + 1, imageUrls.length - 1))}
                  disabled={photoIdx === imageUrls.length - 1}
                  aria-label="Następne zdjęcie"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {imageUrls.map((_, idx: number) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 rounded-full ${idx === photoIdx ? "bg-[#ecb742]" : "bg-white opacity-60"} border border-[#ecb742]`}
                    ></span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Dane i kontakt */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2">{effectiveAd.tytul}</h2>
            <p className="text-lg font-medium mb-2">{effectiveAd.kategoria}</p>
            <p className="text-base mb-4 leading-relaxed">{effectiveAd.krotki_opis}</p>

            <div className="flex flex-col gap-3 mb-4 w-full">
              {effectiveAd.telefon && (
                <div className="flex items-center justify-center bg-[#ecb742] text-white font-semibold px-6 py-3 rounded transition w-full gap-2">
                  <img src={PhoneCall} className="w-5 h-5" alt="Telefon" />
                  <span className="font-semibold text-base">{effectiveAd.telefon}</span>
                </div>
              )}
              {effectiveAd.email && (
                <div className="flex items-center justify-center bg-[#ecb742] text-white font-semibold px-6 py-3 rounded transition w-full gap-2">
                  <img src={Mail} className="w-5 h-5" alt="Mail" />
                  <span className="font-semibold text-base">{effectiveAd.email}</span>
                </div>
              )}
            </div>

            <div className="text-base font-semibold mb-0">Adres:</div>
            <div className="text-base mb-2">
              {effectiveAd.adres}
              <br />
              {effectiveAd.miasto}
            </div>

            {effectiveAd.adres && effectiveAd.miasto && (
              <div className="mt-2">
                <MapaAdres address={`${effectiveAd.adres}, ${effectiveAd.miasto}`} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DOLNA SEKCJA */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lewa strona */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Informacje */}
          <div className="bg-white border rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bold text-xl mb-4 text-[#222] flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#ecb742] mr-2" /> Informacje
              </h2>
              <div className="space-y-2 text-base">
                {effectiveAd.plec && <div>Płeć: <span className="font-bold">{effectiveAd.plec}</span></div>}
                {effectiveAd.wiek && <div>Wiek: <span className="font-bold">{effectiveAd.wiek} lat</span></div>}
                {effectiveAd.narodowosc && <div>Narodowość: <span className="font-bold">{effectiveAd.narodowosc}</span></div>}
                {effectiveAd.orientacja && <div>Orientacja: <span className="font-bold">{effectiveAd.orientacja}</span></div>}
              </div>
            </div>
            <div>
              <div className="space-y-2 text-base mt-8 md:mt-0">
                {effectiveAd.wzrost && <div>Wzrost: <span className="font-bold">{effectiveAd.wzrost} cm</span></div>}
                {effectiveAd.waga && <div>Waga: <span className="font-bold">{effectiveAd.waga} kg</span></div>}
                {effectiveAd.kolor_wlosow && <div>Kolor włosów: <span className="font-bold">{effectiveAd.kolor_wlosow}</span></div>}
                {effectiveAd.kolor_oczu && <div>Kolor oczu: <span className="font-bold">{effectiveAd.kolor_oczu}</span></div>}
                {effectiveAd.tatuaze && <div>Tatuaże: <span className="font-bold">{effectiveAd.tatuaze}</span></div>}
              </div>
            </div>
          </div>

          {/* Preferencje */}
          {prefs.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-bold text-xl mb-4 text-[#222] flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#ecb742] mr-2" /> Preferencje
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {prefs.map((p: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 rounded px-3 py-1 text-base font-semibold">{p}</span>
                ))}
              </div>
              {effectiveAd.wyjazdy && (
                <div className="mt-2 font-semibold text-base">
                  Wyjazdy: <span className="font-normal">{effectiveAd.wyjazdy}</span>
                </div>
              )}
            </div>
          )}

          {/* O mnie */}
          {effectiveAd.pelny_opis && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-bold text-xl mb-4 text-[#222] flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-[#ecb742] mr-2" /> O mnie
              </h2>
              <div className="text-base text-[#222] whitespace-pre-line">{effectiveAd.pelny_opis}</div>
            </div>
          )}
        </div>

        {/* Prawa kolumna */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#ffe1a1] to-[#ecb742] rounded-lg p-6 text-[#3E4249] min-h-[380px] flex flex-col justify-start">
          {/* Cennik */}
          <h2 className="font-bold text-xl mb-2">Cennik</h2>

          <div className="flex flex-col w-full mt-0 mb-4">
            <div className="flex flex-row w-full font-medium mb-2">
              <div className="flex-1 text-left"></div>
              <div className="flex-1 text-center">U mnie</div>
              <div className="flex-1 text-center">Wyjazd</div>
            </div>

            {shouldShowRow(effectiveAd.cena_umnie_15min, effectiveAd.cena_wyjazd_15min) && (
              <div className="flex flex-row w-full py-1">
                <div className="flex-1 text-left">15 minut</div>
                <div className="flex-1 text-center font-bold">{formatPrice(effectiveAd.cena_umnie_15min)}</div>
                <div className="flex-1 text-center font-bold">{formatPrice(effectiveAd.cena_wyjazd_15min)}</div>
              </div>
            )}

            {shouldShowRow(effectiveAd.cena_umnie_30min, effectiveAd.cena_wyjazd_30min) && (
              <div className="flex flex-row w-full py-1">
                <div className="flex-1 text-left">30 minut</div>
                <div className="flex-1 text-center font-bold">{formatPrice(effectiveAd.cena_umnie_30min)}</div>
                <div className="flex-1 text-center font-bold">{formatPrice(effectiveAd.cena_wyjazd_30min)}</div>
              </div>
            )}

            {shouldShowRow(effectiveAd.cena_umnie, effectiveAd.cena_wyjazd) && (
              <div className="flex flex-row w-full py-1">
                <div className="flex-1 text-left">1 godzina</div>
                <div className="flex-1 text-center font-bold">{formatPrice(effectiveAd.cena_umnie)}</div>
                <div className="flex-1 text-center font-bold">{formatPrice(effectiveAd.cena_wyjazd)}</div>
              </div>
            )}

            {shouldShowRow(effectiveAd.cena_umnie_noc, effectiveAd.cena_wyjazd_noc) && (
              <div className="flex flex-row w-full py-1">
                <div className="flex-1 text-left">cała noc</div>
                <div className="flex-1 text-center font-bold">{formatPrice(effectiveAd.cena_umnie_noc)}</div>
                <div className="flex-1 text-center font-bold">{formatPrice(effectiveAd.cena_wyjazd_noc)}</div>
              </div>
            )}
          </div>

          {/* Godziny spotkań */}
          {godziny.length > 0 && (
            <>
              <h2 className="font-bold text-xl mb-2">Godziny spotkań</h2>
              <div className="space-y-2">
                {godziny.map((g: any, idx: number) => (
                  <div key={idx} className="flex flex-row items-center gap-2 font-semibold">
                    <span className="capitalize">{g.dzien_tygodnia}</span>
                    <span className="text-sm font-mono font-bold">
                      {g.godzina_od} - {g.godzina_do}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
