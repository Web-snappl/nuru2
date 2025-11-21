import React, { useEffect, useState } from "react";
import PinIcon from "../../images/pin.png";
import HandIcon from "../../images/hand.png";
import zdj1 from "../../images/zdj1.png";
import zdj2 from "../../images/zdj2.png";
import zdj3 from "../../images/zdj3.png";
import zdj4 from "../../images/zdj4.png";
import zdj5 from "../../images/zdj5.png";
import zdj6 from "../../images/zdj6.png";
import Mapa from "./Mapa";

type UserLocation = {
  latitude: number;
  longitude: number;
};

const offers = [
  { label: "MassageLos", type: "Masaż całego ciała", img: zdj1 },
  { label: "Thai Van", type: "Tajski masaż całego ciała", img: zdj2 },
  { label: "Massage Master", type: "Masaż pleców", img: zdj3 },
  { label: "KapMassage", type: "Masaż relaksacyjny", img: zdj4 },
  { label: "MassageLos", type: "Masaż klasyczny", img: zdj5 },
  { label: "RehaMas", type: "Masaż rehabilitacyjny", img: zdj6 },
];

export default function FindRelaxSection() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [manualHint, setManualHint] = useState(false);

  // Pobieraj ogłoszenia masażystek, masażystów i duetów (pełny obiekt!)
  const [masazystki, setMasazystki] = useState<any[]>([]);
    
  useEffect(() => {
    const fetchAds = async () => {
      const categories = ["Masażystka", "Masażysta", "Duet"];
      let allAds: any[] = [];
      for (const category of categories) {
        try {
          const res = await fetch(
            `https://nuru.ms/api/ogloszenie-nurus?filters[OgloszenieTyp][$eq]=Prywatne&filters[OgloszenieKategoria][$eq]=${encodeURIComponent(category)}&filters[isConfirmed][$eq]=true&populate=*`
          );
          const json = await res.json();

          // DEBUG: pokaż co zwraca API
          console.log("DEBUG Strapi raw data:", json.data);

          // Dodaj tylko ogłoszenia z adresem i miastem, pełne obiekty
          if (json.data && Array.isArray(json.data)) {
            allAds = allAds.concat(
              json.data.filter((item: any) => item.OgloszenieAdres && item.OgloszenieMiasto)
            );
          }
        } catch (err) {
          console.error("Błąd pobierania:", err);
        }
      }

      // allAds to tablica z pełnymi obiektami ogłoszenia
      console.log("DEBUG filteredAds for map:", allAds);

      setMasazystki(allAds);
    };
    fetchAds();
  }, []);

  const handleShowMyLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolokalizacja nie jest obsługiwana przez tę przeglądarkę");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const { latitude, longitude } = position.coords;

      setUserLocation({ latitude, longitude });
      setSelectedLocation({ lat: latitude, lng: longitude });
    } catch (error: any) {
      let errorMessage = "Nie udało się uzyskać lokalizacji";

      if (error && typeof error === "object" && "code" in error) {
        switch ((error as GeolocationPositionError).code) {
          case (error as GeolocationPositionError).PERMISSION_DENIED:
            errorMessage = "Dostęp do lokalizacji został odrzucony";
            break;
          case (error as GeolocationPositionError).POSITION_UNAVAILABLE:
            errorMessage = "Informacja o lokalizacji jest niedostępna";
            break;
          case (error as GeolocationPositionError).TIMEOUT:
            errorMessage = "Przekroczono czas oczekiwania na lokalizację";
            break;
        }
      }

      setLocationError(errorMessage);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center pt-10 pb-4 px-2">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 text-center mb-2">
          Znajdź <b className="font-bold">chwilę relaksu</b> tam, gdzie jesteś!
        </h2>
        <p className="text-md text-gray-700 text-center font-light mb-7">
          Wyszukaj miasto/adres, kliknij na mapę lub pozwól wykryć lokalizację – a my pokażemy oferty w okolicy.
        </p>

        {/* Przyciski lokalizacji */}
        <div className="flex items-center gap-0 mb-4 flex-wrap justify-center">
          <button
            onClick={handleShowMyLocation}
            disabled={isLocating}
            className="flex items-center gap-2 bg-[#3e4249] hover:bg-gray-900 transition-colors text-white font-medium px-5 py-2 rounded-l text-sm border border-gray-300 border-r-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocating ? "Lokalizuję..." : "Wyświetl moją lokalizację"}
            <img src={PinIcon} alt="pin" className="w-5 h-5" />
          </button>
          <button
            className="flex items-center gap-2 bg-[#ecb742] hover:bg-[#ffe1a1] transition-colors text-white font-medium px-5 py-2 rounded-r text-sm border border-gray-300"
            onClick={() => setManualHint(true)}
          >
            Wybierz ręcznie
            <img src={HandIcon} alt="hand" className="w-5 h-5" />
          </button>
        </div>

        {/* Podpowiedź wyboru ręcznego */}
        {manualHint && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm text-center max-w-md">
            Kliknij na mapę, aby ustawić pinezkę. Możesz też skorzystać z wyszukiwarki nad mapą.
            <button
              className="ml-3 underline"
              onClick={() => setManualHint(false)}
            >
              Zamknij
            </button>
          </div>
        )}

        {/* Komunikaty */}
        {locationError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm text-center max-w-md">
            {locationError}
          </div>
        )}

        {/* Mapa Google z wyszukiwarką, pinezkami masażystek i klikaniem */}
        <Mapa
          userLocation={userLocation}
          onLocationChange={(coords: { lat: number; lng: number }) => setSelectedLocation(coords)}
          masazystki={masazystki}
        />
      </div>
    </section>
  );
}