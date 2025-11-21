import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../images/icon.png";
import zdjFallback from "../../images/zdj1.png";

const OFFER_CARD_WIDTH = 240;

type Offer = {
  id: number | string;
  label: string;
  type: string;
  img: string;
  rawAd: any; // flattened ad: { id, ...attributes }
};

export default function LatestOffersStrip({ limit = 4 }: { limit?: number }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const STRAPI_BASE = "https://admin.nuru.ms";
  // populate=* aby dostać wszystkie relacje (Zdjecia, cennikUMnie, cennikWyjazd, OgloszenieGodziny, Preferencje itd.)
  const API_PATH = `/api/ogloszenie-nurus?sort=createdAt:desc&pagination[limit]=${limit}&filters[isConfirmed][$eq]=true&populate=*`;

  useEffect(() => {
    let mounted = true;
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${STRAPI_BASE}${API_PATH}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const mapped: Offer[] = (json.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          const title =
            attrs.OgloszenieTytul ||
            attrs.title ||
            attrs.name ||
            "Ogłoszenie";
          const label = attrs.OgloszenieMiasto || attrs.city || "Miasto";

          // zdjęcie — pierwsze Zdjecia.data[0].attributes.url lub fallback
          let img = zdjFallback;
          try {
            const imgs = attrs.Zdjecia || attrs.zdjecia || attrs.images;
            if (imgs?.data && Array.isArray(imgs.data) && imgs.data[0]) {
              const urlPath =
                imgs.data[0].attributes?.formats?.thumbnail?.url ||
                imgs.data[0].attributes?.url;
              if (urlPath) img = urlPath.startsWith("http") ? urlPath : STRAPI_BASE + urlPath;
            } else if (Array.isArray(imgs) && imgs[0]) {
              const urlPath = imgs[0].url || imgs[0].attributes?.url;
              if (urlPath) img = urlPath.startsWith("http") ? urlPath : STRAPI_BASE + urlPath;
            }
          } catch (e) {
            img = zdjFallback;
          }

          // SPŁASZCZENIE: przygotuj obiekt adFlatten z id + wszystkie pola attributes na top-level
          const adFlatten = { id: item.id, ...(attrs || {}) };

          return {
            id: item.id,
            label,
            type: title,
            img,
            rawAd: adFlatten,
          } as Offer;
        });

        if (mounted) setOffers(mapped);
      } catch (err: any) {
        console.error("Fetch offers error:", err);
        if (mounted) setError("Nie udało się wczytać ofert.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOffers();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const handleOfferClick = (offer: Offer) => {
    // Przekazujemy spłaszczony obiekt — info2 dostanie pola typu OgloszenieGodziny, cennikUMnie itd.
    navigate("/masazystki/info2", { state: { ad: offer.rawAd } });
  };

  return (
    <section className="w-full relative bg-white flex flex-col items-center justify-center pt-0 pb-20">
      <div className="w-full max-w-6xl mx-auto">
        <div className="w-full pt-10 pb-4 flex flex-col items-center">
          <h2 className="text-3xl font-light text-gray-800 text-center mb-2">
            <span className="font-bold">Najnowsze</span> oferty
          </h2>
          <p className="text-md text-gray-700 text-center font-light mb-8">
            Najnowsze ogłoszenia masażystów i salonów dostępne w naszej bazie.
          </p>
        </div>

        <div className="w-full flex flex-row justify-center items-center gap-6 mb-10">
          {loading &&
            Array.from({ length: limit }).map((_, i) => (
              <div key={`pl-${i}`} className="relative flex flex-col items-stretch" style={{ width: OFFER_CARD_WIDTH }}>
                <div className="rounded-xl overflow-hidden shadow-lg w-full h-[150px] relative bg-gray-100 animate-pulse" />
                <div className="w-full bg-gray-700 flex flex-col justify-center px-4 py-3 rounded-b-xl" style={{ minHeight: 46, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
                  <div className="h-3 bg-gray-500 rounded w-24 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-600 rounded w-32 animate-pulse" />
                </div>
              </div>
            ))}

          {!loading && error && <div className="text-red-600">{error}</div>}

          {!loading && !error && offers.map((offer, i) => (
            <div key={i} className="relative flex flex-col items-stretch cursor-pointer" style={{ width: OFFER_CARD_WIDTH }} onClick={() => handleOfferClick(offer)}>
              <div className="rounded-xl overflow-hidden shadow-lg w-full h-[150px] relative">
                <img src={offer.img} alt={offer.type} className="absolute inset-0 w-full h-full object-cover" draggable={false} style={{ zIndex: 1 }} />
              </div>

              <div className="w-full bg-gray-700 flex flex-col justify-center px-4 py-3 rounded-b-xl" style={{ minHeight: 46, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
                <span className="text-xs text-gray-200 opacity-80 flex items-center gap-1 mb-1">
                  <img src={icon} alt="icon" className="w-4 h-4 mr-1" />
                  {offer.label}
                </span>
                <span className="font-semibold text-base text-white">{offer.type}</span>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center bg-[#faf2dd] border border-[#efc872] rounded-xl shadow px-0 py-0" style={{ width: OFFER_CARD_WIDTH, height: 196 }}>
            <a className="flex flex-col items-center justify-center w-full h-full" href="/ogloszenia">
              <div className="rounded-full w-14 h-14 flex items-center justify-center mb-3 bg-[#ecb742]">
                <span className="text-white text-3xl font-semibold">+</span>
              </div>
              <button className="text-[#efc872] text-lg font-medium hover:underline transition-colors">
                Dodaj ogłoszenie
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}