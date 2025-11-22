import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header2 from "./sections/Header2";
import MasseusesTeam from "./sections/Workers";
import MassageInfoBlock from "./sections/MassageInfoBlock";
import MassageServiceSection from "./sections/MassageServiceSection";
import { fetchOgloszenia } from "../../services/ogloszeniaService";

function MasazystkiSubpage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Odebranie regionu z przekierowania (województwa)
  const region = location.state?.region;

  // Ustal kategorię na podstawie podstrony
  let category = "Masażystka";
  if (location.pathname === "/masazysci") {
    category = "Masażysta";
  }
  if (location.pathname === "/duety") {
    category = "Duet";
  }

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await fetchOgloszenia({
          kategoria: category,
          wojewodztwo: region,
          typ: "Prywatne"
        });
        setAds(data);
        console.log("Fetched ads:", data);
      } catch (err) {
        console.error("Błąd podczas pobierania ogłoszeń:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [category, location.pathname, region]);

  if (loading) {
    return <div className="p-10 text-center">Ładowanie ogłoszeń...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header2 />
      <MasseusesTeam ads={ads} />
      <MassageServiceSection />
      <MassageInfoBlock />
    </div>
  );
}

export default MasazystkiSubpage;