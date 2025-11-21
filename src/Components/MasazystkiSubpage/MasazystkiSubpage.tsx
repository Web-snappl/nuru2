import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Header2 from "./sections/Header2";
import MasseusesTeam from "./sections/Workers";
import MassageInfoBlock from "./sections/MassageInfoBlock";
import MassageServiceSection from "./sections/MassageServiceSection";

function MasazystkiSubpage() {
  const [ads, setAds] = useState([]);
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
        // Budujemy endpoint dynamicznie
        let url = `https://nuru.ms/api/ogloszenie-nurus?filters[OgloszenieTyp][$eq]=Prywatne&filters[OgloszenieKategoria][$eq]=${encodeURIComponent(category)}&filters[isConfirmed][$eq]=true&populate=*`;
        if (region) {
          url += `&filters[OgloszenieWojewodztwo][$eq]=${encodeURIComponent(region)}`;
        }
        const res = await fetch(url);
        const json = await res.json();
        setAds(json.data || []);
        console.log("Fetched ads:", json);
      } catch (err) {
        console.error("Błąd podczas pobierania ogłoszeń:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [category, location.pathname, region]); // reaguj na zmianę regionu

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