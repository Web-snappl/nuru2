import EwaImage from '../../../images/image.png';
import KatarzynaImage from '../../../images/image.png';
import MariaImage from '../../../images/image.png';
import KarolinaImage from '../../../images/image.png';
import StarImage from '../../../images/star.png';
import StarGImage from '../../../images/starg.png';
import Info from '../../../images/in.png';

import { Link } from "react-router-dom";

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating || 0);
  const halfStar = (rating || 0) % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex space-x-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <img key={`full-${i}`} src={StarImage} alt="star" className="w-4 h-4" />
      ))}
      {halfStar && <img src={StarGImage} alt="half-star" className="w-4 h-4" />}
      {[...Array(emptyStars)].map((_, i) => (
        <img key={`empty-${i}`} src={StarGImage} alt="empty-star" className="w-4 h-4" />
      ))}
    </div>
  );
};

export default function MasseusesTeam({ ads }: any) {
  const STRAPI_BASE_URL = "https://admin.nuru.ms";

  // helper: extract cennikUMnie safely from different shapes
  const getCennikUMnie = (ad: any) => {
    // If already flattened and object
    if (ad?.cennikUMnie && !Array.isArray(ad.cennikUMnie) && typeof ad.cennikUMnie === "object") {
      return ad.cennikUMnie;
    }
    // If flattened as array [ { ... } ]
    if (Array.isArray(ad?.cennikUMnie) && ad.cennikUMnie.length > 0) {
      return ad.cennikUMnie[0];
    }
    // Strapi raw relation: ad.cennikUMnie.data = [{ id, attributes }]
    if (ad?.cennikUMnie?.data && Array.isArray(ad.cennikUMnie.data) && ad.cennikUMnie.data[0]) {
      return ad.cennikUMnie.data[0].attributes || ad.cennikUMnie.data[0];
    }
    // If the whole ad is raw Strapi item: ad.attributes.cennikUMnie
    if (ad?.attributes) {
      const rel = ad.attributes.cennikUMnie;
      if (rel?.data && Array.isArray(rel.data) && rel.data[0]) {
        return rel.data[0].attributes || rel.data[0];
      }
      if (Array.isArray(rel) && rel[0]) return rel[0];
    }
    return null;
  };

  const formatPrice = (val: any) => {
    const num = Number(val);
    if (!isFinite(num) || num <= 0) return ""; // hide zero/invalid
    return `${num} zł`;
  };

  return (
    <div className="bg-white pb-16 text-[#3E4249] px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {(!ads || ads.length === 0) ? (
          <div className="col-span-4 w-full py-12 flex flex-col items-center justify-center">
            <span className="text-xl text-gray-500 mb-2 font-semibold">
              Brak dostępnych masażystek/ogłoszeń dla wybranych kryteriów.
            </span>
            <span className="text-base text-gray-400">
              Spróbuj wybrać inne województwo lub sprawdź ponownie później.
            </span>
          </div>
        ) : (
          ads.map((raw: any) => {
            // support both flattened ad and raw Strapi item
            const ad = raw.attributes ? { id: raw.id, ...raw.attributes } : raw;

            const imageUrl =
              ad?.Zdjecia?.[0]?.url
                ? `${STRAPI_BASE_URL}${ad.Zdjecia[0].url}`
                : "https://via.placeholder.com/400x400";

            const godziny = Array.isArray(ad?.OgloszenieGodziny) && ad.OgloszenieGodziny.length > 0
              ? `${ad.OgloszenieGodziny[0].DzienTygodnia}: ${String(ad.OgloszenieGodziny[0].GodzinaOd).slice(0,5)} - ${String(ad.OgloszenieGodziny[0].GodzinaDo).slice(0,5)}`
              : "Brak danych";

            const cennik = getCennikUMnie(ad);
            // try several possible price field names
            const cena =
              cennik?.cena ??
              cennik?.cena15min ?? // sometimes stored per-interval
              cennik?.cenaGodzina ??
              cennik?.cenaZaGodzine ??
              ad?.OgloszenieCenaZl ?? 0;

            return (
              <div
                key={ad.id ?? raw.id}
                className="bg-white rounded-lg overflow-hidden flex flex-col justify-between"
              >
                <div className="w-full h-64 sm:h-72 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={ad.OgloszenieTytul}
                    className="w-full h-full object-contain bg-white"
                  />
                </div>

                <div className="p-4 sm:p-5 text-left flex-1 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-medium">
                    {ad.OgloszenieTytul}
                  </h2>
                  <p className="text-[#3E4249] text-sm sm:text-base font-medium">
                    {ad.OgloszenieKategoria}
                  </p>

                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs sm:text-sm text-[#3E4249] font-semibold">
                      {ad.OgloszenieOcena ?? 0}
                    </span>
                    {renderStars(Number(ad.OgloszenieOcena ?? 0))}
                    <span className="text-[#3E4249] text-xs sm:text-sm">({ad.OgloszenieIloscOcen ?? 0})</span>
                    <img src={Info} className="w-3 h-3" />
                  </div>

                  <div className="mt-4 text-[#3E4249] font-semibold text-sm sm:text-base space-y-1">
                    <p>Cena za godzinę: {formatPrice(cena)}</p>
                    <p>Dziś pracuje: {godziny}</p>
                    <p>Miasto: {ad.OgloszenieMiasto}</p>
                  </div>

                  <p className="mt-4 text-[#3E4249] text-sm sm:text-base leading-relaxed">
                    {ad.OgloszenieKrotkiOpis}
                  </p>
                </div>

                <div className="flex flex-col space-y-2 px-4 sm:px-5 pb-4 sm:pb-5">
                  <Link
                    to="/masazystki/info2"
                    state={{ ad }}
                    className="w-full text-center px-4 py-2 border border-[#EDB842] bg-[#EDB842] text-white font-medium rounded-md text-sm sm:text-base"
                  >
                    Umów się na wizytę
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}