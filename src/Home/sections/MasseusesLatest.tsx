import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../images/icon.png";
import zdjFallback from "../../images/zdj1.png";
import { fetchOgloszenia } from "../../services/ogloszeniaService";
import { supabase } from "../../lib/supabase";

const OFFER_CARD_WIDTH = 240;

type Offer = {
  id: string;
  label: string;
  type: string;
  img: string;
  rawAd: any;
};

export default function LatestOffersStrip({ limit = 4 }: { limit?: number }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOgloszenia();
        
        // Mapuj do formatu komponentu
        const mapped: Offer[] = await Promise.all(
          data.slice(0, limit).map(async (item: any) => {
            let img = zdjFallback;
            
            // Pobierz pierwsze zdjęcie
            if (item.ogloszenia_images && item.ogloszenia_images.length > 0) {
              const firstImage = item.ogloszenia_images
                .sort((a: any, b: any) => a.display_order - b.display_order)[0];
              
              if (firstImage?.storage_path) {
                const { data: urlData } = supabase.storage
                  .from('ogloszenia-images')
                  .getPublicUrl(firstImage.storage_path);
                img = urlData.publicUrl;
              }
            }

            return {
              id: item.id,
              label: item.miasto || "Miasto",
              type: item.tytul || "Ogłoszenie",
              img,
              rawAd: item,
            };
          })
        );

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