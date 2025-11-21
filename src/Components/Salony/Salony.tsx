import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import MapImg from "../../images/mapka.png";
import PinIcon from "../../images/pin.png";
import HandIcon from "../../images/hand.png";
import MarkerIcon from "../../images/marker.png"; // Zrób marker w kolorze #ecb742 (SVG/PNG)
import Mapa from "../../Home/sections/Mapa";
import StarImage from '../../images/star.png';
import StarGImage from '../../images/starg.png';
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
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

export default function SalonListSection() {
  const [sort, setSort] = useState("alphabetical");

  const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchAds = async () => {
        try {
          const res = await fetch(
            'https://nuru.ms/api/ogloszenie-nurus?filters[OgloszenieTyp][$eq]=Salon&filters[isConfirmed][$eq]=true&populate=*'
          );
  
  
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
    }, []);
  
    if (loading) {
      return <div className="p-10 text-center">Ładowanie ogłoszeń...</div>;
    }
    

  return (
    <section className="w-full bg-[#222] min-h-screen">
      {/* HERO */}
      <div className="w-full bg-white border-b border-[#e7d6b5]">
        <div className="max-w-6xl mx-auto w-full pt-8 pb-6 px-2">
          <h1 className="text-2xl md:text-3xl font-light text-gray-800 text-center mb-2">
            <span className="font-bold">Salony masażu</span> w Twojej okolicy
          </h1>
          <p className="text-md text-gray-700 text-center font-light mb-7">
            Odkryj profesjonalne miejsca, które oferują relaks, regenerację i troskę o Twoje ciało.<br />
            Wybierz lokalizację i znajdź salon idealny dla siebie.
          </p>
          {/* Search Bar */}
          <form className="flex flex-row items-center justify-center gap-0 w-full mb-4 max-w-2xl mx-auto"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Wpisz nazwę salonu..."
              className="flex-1 outline-none bg-[#fff] border border-gray-300 rounded-l px-3 py-2 text-gray-700 text-base"
            />
            <input
              type="text"
              placeholder="Wpisz miasto..."
              className="flex-1 outline-none bg-[#fff] border border-gray-300 px-3 py-2 text-gray-700 text-base"
            />
            <button
              type="submit"
              className="bg-[#ecb742] hover:bg-[#ffe1a1] px-7 py-2.5 rounded-r text-white font-medium text-sm border border-l-0 border-gray-300"
            >
              Szukaj
            </button>
          </form>
          {/* Location Buttons */}
          <div className="flex items-center gap-0 mb-7 flex-wrap justify-center">
            <button className="flex items-center gap-2 bg-[#3e4249] hover:bg-gray-900 transition-colors text-white font-medium px-5 py-2 rounded-l text-sm border border-gray-300 border-r-0">
              Wyświetl moją lokalizację
              <img src={PinIcon} alt="pin" className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-[#ecb742] hover:bg-[#ffe1a1] transition-colors text-white font-medium px-5 py-2 rounded-r text-sm border border-gray-300">
              Wybierz ręcznie
              <img src={HandIcon} alt="hand" className="w-5 h-5" />
            </button>
          </div>
          {/* MAPA */}
          <Mapa />
        </div>
      </div>
      {/* LISTA SALONÓW */}
      <div className="w-full bg-white pt-4 pb-12">
        <div className="max-w-[85%] mx-auto w-full flex flex-col items-center">
          <div className="w-full flex flex-row items-center justify-between mb-3 px-1">
            <h2 className="text-2xl font-semibold text-gray-800">
              Salony masażu
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sortowanie:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border border-gray-300 px-2 py-1 rounded text-sm bg-white"
              >
                <option value="alphabetical">Alfabetycznie, rosnąco</option>
                <option value="alphabetical-desc">Alfabetycznie, malejąco</option>
                <option value="rating">Najlepiej oceniane</option>
              </select>
            </div>
          </div>
          {/* List */}
        <div className="w-full flex flex-col gap-4">
        {ads.map((ad: any, i: number) => {
  const STRAPI_BASE_URL = "https://nuru.ms";

  const godziny = ad.OgloszenieGodziny?.[0]
    ? `${ad.OgloszenieGodziny[0].GodzinaOd.slice(0,5)} - ${ad.OgloszenieGodziny[0].GodzinaDo.slice(0,5)}`
    : "Brak danych";

  const oferty = ad.OgloszenieKrotkiOpis || "Brak danych";

  return (
    <div
      key={i}
      className="w-full bg-[#fff] border border-gray-200 rounded-xl flex flex-row items-center px-5 py-4 shadow-sm"
      style={{
        marginBottom: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        alignItems: "center",
      }}
    >
      {/* Icon - powiększona, bez tła */}
      <div className="flex-shrink-0 mr-6 flex flex-col items-center justify-center" style={{ minWidth: 86 }}>
        <img
          src={ad.Zdjecia?.[0]?.url ? `${STRAPI_BASE_URL}${ad.Zdjecia[0].url}` : MarkerIcon}
          alt={ad.OgloszenieTytul}
          className="w-[90px] h-[90px] object-contain"
          style={{ display: "block" }}
        />
      </div>
      {/* Info i ocena */}
      <div className="flex-1 flex flex-row">
        {/* Lewa: nazwa, adres, ocena */}
        <div className="flex flex-col justify-center" style={{ minWidth: 220 }}>
          <span className="font-semibold text-xl text-gray-800">{ad.OgloszenieTytul}</span>
          <span className="text-base text-gray-700 mb-1">{ad.OgloszenieAdres}, {ad.OgloszenieMiasto}</span>
          <div className="flex flex-row items-center gap-1 text-sm mt-1">
            <span className="font-semibold text-[#222]">{ad.OgloszenieOcena || 0}</span>
            <span className="flex flex-row gap-[2px] ml-1">
              {renderStars(ad.OgloszenieOcena)}
            </span>
            <span className="text-gray-600 ml-2">({ad.OgloszenieIloscOcen || 0})</span>
            <svg width="16" height="16" viewBox="0 0 16 16" style={{marginLeft:4,verticalAlign:'middle'}} fill="#888">
              <circle cx="8" cy="8" r="8" fill="#e7e7e7"/>
              <text x="8" y="12" textAnchor="middle" fontSize="10" fill="#888">i</text>
            </svg>
          </div>
        </div>
        {/* Prawa: szczegóły, godziny, telefon, oferty */}
        <div className="flex flex-col justify-center ml-8" style={{minWidth: '340px'}}>
          <div className="flex flex-row gap-5 text-sm text-gray-800 mb-1">
            <span className="text-gray-600">Dzisiejsze godziny otwarcia:</span> <b>{godziny}</b>
          </div>
          <div className="flex flex-row gap-5 text-sm text-gray-800 mb-1">
            <span className="text-gray-600">Telefon:</span> <a href="#" className="text-[#ecb742] underline">{ad.OgloszeniaKontaktNumer || "Kliknij aby wyświetlić"}</a>
          </div>
          
          <div className="text-sm text-gray-700 truncate">
            <span className="text-gray-600">Oferty:</span> {oferty}
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-col gap-2 ml-8 items-end">
        <button className="bg-[#ecb742] text-white px-5 py-2 rounded font-medium text-sm hover:bg-[#ffe1a1] transition-colors w-[150px]">
          Wszystkie oferty
        </button>
        <button className="bg-white border border-[#ecb742] text-[#ecb742] px-5 py-2 rounded font-medium text-sm hover:bg-[#faf2dd] transition-colors w-[150px]">
          Zobacz szczegóły
        </button>
      </div>
    </div>
  );
})}
        </div>
        </div>
        {/* PAGINATION */}
        <div className="w-full flex flex-row justify-center items-center py-6 bg-[#faf2dd] border-t border-[#e7d6b5]">
        <button className="bg-[#e7e7e7] text-gray-700 rounded px-4 py-1 mr-3" disabled>
            &lt; Poprzednia
        </button>
        <div className="flex flex-row gap-2">
            <button className="bg-[#fff] border border-[#ecb742] text-[#ecb742] rounded px-3 py-1 font-semibold">1</button>
            <button className="bg-[#fff] border border-[#ecb742] text-[#ecb742] rounded px-3 py-1 font-semibold">2</button>
            <button className="bg-[#fff] border border-[#ecb742] text-[#ecb742] rounded px-3 py-1 font-semibold">3</button>
            <span className="px-2 font-bold">...</span>
            <button className="bg-[#fff] border border-[#ecb742] text-[#ecb742] rounded px-3 py-1 font-semibold">78</button>
        </div>
        <button className="bg-[#ecb742] text-white rounded px-4 py-1 ml-3">
            następna &gt;
        </button>
        </div>

        {/* CTA Salon */}
        <div className="w-full bg-[#faf2dd] py-10 flex flex-col items-center border-t border-[#e7d6b5]">
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 text-center mb-2">
            Prowadzisz <span className="font-bold">salon masażu</span>?
        </h2>
        <p className="text-md text-gray-700 text-center font-light mb-5">
            Dodaj swoją ofertę i dotrzyj do nowych klientów!
        </p>
        <Link to="/ogloszenia">
            <button className="bg-[#ecb742] text-white text-lg font-medium rounded px-8 py-3 shadow hover:bg-[#ffe1a1] transition-colors">
                Dodaj swój salon
            </button>
        </Link>
        </div>

        {/* DLACZEGO NASZ PORTAL */}
        <div className="w-full bg-white py-14 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 text-center mb-8">
            Dlaczego warto wybrać <span className="font-bold">nasz portal</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl w-full">
            <div className="flex flex-col items-center text-center">
            <img src={require("../../images/ikona1.png")} alt="Łatwe wyszukiwanie" className="mb-4 w-14 h-14" />
            <div className="font-semibold text-lg mb-2">Łatwe wyszukiwanie</div>
            <div className="text-gray-700 text-base">
                Intuicyjna wyszukiwarka i filtry pozwolą Ci szybko znaleźć idealny salon lub masażystę.
            </div>
            </div>
            <div className="flex flex-col items-center text-center">
            <img src={require("../../images/ikona2.png")} alt="Zweryfikowane opinie" className="mb-4 w-14 h-14" />
            <div className="font-semibold text-lg mb-2">Zweryfikowane opinie</div>
            <div className="text-gray-700 text-base">
                Zyskujesz pewność wyboru dzięki recenzjom i ocenom wystawianym przez użytkowników.
            </div>
            </div>
            <div className="flex flex-col items-center text-center">
            <img src={require("../../images/ikona3.png")} alt="Aktualne ogłoszenia" className="mb-4 w-14 h-14" />
            <div className="font-semibold text-lg mb-2">Aktualne ogłoszenia</div>
            <div className="text-gray-700 text-base">
                Codziennie dodawane nowe oferty sprawiają, że zawsze masz dostęp do świeżych propozycji.
            </div>
            </div>
        </div>
        </div>
        
      </div>
    </section>
  );
}