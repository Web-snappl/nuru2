import StarImage from '../../../images/star.png';
import StarGImage from '../../../images/starg.png';
import Info from '../../../images/in.png';
import { Link } from "react-router-dom";
import { supabase } from '../../../lib/supabase';

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
  const formatPrice = (val: any) => {
    const num = Number(val);
    if (!isFinite(num) || num <= 0) return "";
    return `${num} zł`;
  };

  const getImageUrl = (ad: any) => {
    if (ad.ogloszenia_images && ad.ogloszenia_images.length > 0) {
      const firstImage = ad.ogloszenia_images
        .sort((a: any, b: any) => a.display_order - b.display_order)[0];
      
      if (firstImage?.storage_path) {
        const { data } = supabase.storage
          .from('ogloszenia-images')
          .getPublicUrl(firstImage.storage_path);
        return data.publicUrl;
      }
    }
    return "https://via.placeholder.com/400x400";
  };

  const getTodaySchedule = (ad: any) => {
    if (!ad.ogloszenia_godziny || ad.ogloszenia_godziny.length === 0) {
      return "Brak danych";
    }
    
    const today = ad.ogloszenia_godziny[0];
    return `${today.dzien_tygodnia}: ${today.godzina_od} - ${today.godzina_do}`;
  };

  return (
    <div className="bg-white pb-16 text-[#3E4249] px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {(!ads || ads.length === 0) ? (
          <div className="col-span-4 w-full py-12 flex flex-col items-center justify-center">
            <span className="text-xl text-gray-500 mb-2 font-semibold">
              Brak dostępnych ogłoszeń dla wybranych kryteriów.
            </span>
            <span className="text-base text-gray-400">
              Spróbuj wybrać inne województwo lub sprawdź ponownie później.
            </span>
          </div>
        ) : (
          ads.map((ad: any) => {
            const imageUrl = getImageUrl(ad);
            const godziny = getTodaySchedule(ad);
            const cena = ad.cena_umnie || 0;

            return (
              <div
                key={ad.id}
                className="bg-white rounded-lg overflow-hidden flex flex-col justify-between"
              >
                <div className="w-full h-64 sm:h-72 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={ad.tytul}
                    className="w-full h-full object-contain bg-white"
                  />
                </div>

                <div className="p-4 sm:p-5 text-left flex-1 flex flex-col">
                  <h2 className="text-xl sm:text-2xl font-medium">
                    {ad.tytul}
                  </h2>
                  <p className="text-[#3E4249] text-sm sm:text-base font-medium">
                    {ad.kategoria}
                  </p>

                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs sm:text-sm text-[#3E4249] font-semibold">
                      0
                    </span>
                    {renderStars(0)}
                    <span className="text-[#3E4249] text-xs sm:text-sm">(0)</span>
                    <img src={Info} className="w-3 h-3" alt="info" />
                  </div>

                  <div className="mt-4 text-[#3E4249] font-semibold text-sm sm:text-base space-y-1">
                    <p>Cena za godzinę: {formatPrice(cena)}</p>
                    <p>Dziś pracuje: {godziny}</p>
                    <p>Miasto: {ad.miasto}</p>
                  </div>

                  <p className="mt-4 text-[#3E4249] text-sm sm:text-base leading-relaxed">
                    {ad.krotki_opis}
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
