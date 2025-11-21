import React, { useState } from "react";
import MapImg from "../../images/mapka.png";
import PinIcon from "../../images/pin.png";
import HandIcon from "../../images/hand.png";
import MarkerIcon from "../../images/marker.png";
import OfferImg from "../../images/offer.png"; // <-- przykładowy obrazek oferty
import Mapa from "../../Home/sections/Mapa";

const markers = [
  { left: "24%", top: "44%" },
  { left: "37%", top: "50%" },
  { left: "58%", top: "40%" },
  { left: "73%", top: "56%" },
  { left: "62%", top: "65%" },
  { left: "48%", top: "58%" },
];

const offers = Array.from({ length: 4 }).map((_, idx) => ({
  label: "MassageLos",
  title: "Japoński masaż twarzy",
  price: "200 złotych",
  city: "Warszawa",
  rating: 5.0,
  reviews: 132,
  description:
    "Japoński masaż twarzy to tradycyjna sztuka pielęgnacji i odmładzania skóry twarzy.",
  img: OfferImg,
}));

export default function OffersListPage() {
  const [sort, setSort] = useState("alphabetical");

  return (
    <section className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="w-full bg-white pt-8 pb-6">
        <div className="max-w-6xl mx-auto w-full px-2 flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-light text-gray-800 text-center mb-2">
            <span className="font-bold">Oferty</span> w Twojej okolicy
          </h1>
          <p className="text-md text-gray-700 text-center font-light mb-7">
            Sprawdź dostępne oferty od firm w Twoim regionie i wybierz najlepszą dla siebie.
          </p>
          {/* Search Bar */}
          <form className="w-full flex flex-col items-center mb-4">
            <div className="flex flex-row items-center gap-0 w-full mb-4 max-w-3xl mx-auto px-4 py-5 rounded-lg">
              <div className="flex flex-1 items-center bg-white border border-gray-300 rounded-l px-3 py-2">
                <input
                  type="text"
                  placeholder="Wpisz nazwę oferty..."
                  className="w-full outline-none bg-transparent text-gray-700 text-base"
                />
              </div>
              <div className="flex flex-1 items-center bg-white border border-gray-300 px-3 py-2">
                <input
                  type="text"
                  placeholder="Wpisz miasto..."
                  className="w-full outline-none bg-transparent text-gray-700 text-base"
                />
              </div>
              <button
                type="submit"
                className="bg-[#ecb742] hover:bg-[#ffe1a1] px-7 py-2.5 rounded text-white font-medium text-sm border border-gray-300"
                style={{ minWidth: 96 }}
              >
                szukaj
              </button>
            </div>
            {/* Location Buttons */}
            <div className="flex items-center gap-0 mb-2 flex-wrap justify-center">
              <button className="flex items-center gap-2 bg-[#3e4249] hover:bg-gray-900 transition-colors text-white font-medium px-5 py-2 rounded-l text-sm border border-gray-300 border-r-0">
                Wyświetl moją lokalizację
                <img src={PinIcon} alt="pin" className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 bg-[#ecb742] hover:bg-[#ffe1a1] transition-colors text-white font-medium px-5 py-2 rounded-r text-sm border border-gray-300">
                Wybierz ręcznie
                <img src={HandIcon} alt="hand" className="w-5 h-5" />
              </button>
            </div>
          </form>
          {/* MAPA */}
          <Mapa />
        </div>
      </div>

      {/* LISTA OFERT */}
      <div className="w-full bg-white pt-4 pb-12">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
          <div className="w-full flex flex-row items-center justify-between mb-6 px-1">
            <h2 className="text-2xl font-semibold text-gray-800">
              Lista <span className="font-bold">ofert</span>
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
          {/* GRID OF OFFERS */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offers.map((offer, i) => (
              <div
                key={i}
                className="bg-white border border-[#e7e7e7] rounded-xl shadow-sm flex flex-col items-center px-3 pt-3 pb-5"
                style={{ minHeight: 420 }}
              >
                <div className="w-full flex flex-col items-center mb-3">
                  <img
                    src={offer.img}
                    alt={offer.title}
                    className="w-full h-44 object-cover rounded-lg mb-2"
                    style={{ background: "#fff" }}
                  />
                  <span className="text-xs text-gray-600 font-semibold mb-1">{offer.label}</span>
                  <span className="font-semibold text-lg text-gray-800 text-center mb-1">{offer.title}</span>
                  {/* Gwiazdki */}
                  <div className="flex flex-row items-center gap-1 text-sm mb-1">
                    <span className="font-semibold text-[#222]">{offer.rating.toFixed(1)}</span>
                    <span className="flex flex-row gap-[2px] ml-1">
                      {[...Array(5)].map((_, idx) => (
                        <svg key={idx} width="18" height="18" viewBox="0 0 18 18" fill="#ffc940" style={{marginRight:2}}>
                          <polygon points="9,1 11,7 17,7 12,11 14,17 9,13 4,17 6,11 1,7 7,7" />
                        </svg>
                      ))}
                    </span>
                    <span className="text-gray-600 ml-2">({offer.reviews})</span>
                    {/* Ikonka info */}
                    <svg width="16" height="16" viewBox="0 0 16 16" style={{marginLeft:4,verticalAlign:'middle'}} fill="#888">
                      <circle cx="8" cy="8" r="8" fill="#e7e7e7"/>
                      <text x="8" y="12" textAnchor="middle" fontSize="10" fill="#888">i</text>
                    </svg>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Cena za godzinę:</span> {offer.price} &nbsp;|&nbsp;
                    <span className="font-semibold">Miasto:</span> {offer.city}
                  </div>
                  <div className="text-sm text-gray-700 mb-2 text-center">{offer.description}</div>
                </div>
                {/* Akcje */}
                <div className="w-full flex flex-row gap-3 justify-center mt-auto">
                  <button className="bg-[#ecb742] text-white px-5 py-2 rounded font-medium text-sm hover:bg-[#ffe1a1] transition-colors">
                    Przejdź do kalendarza
                  </button>
                  <button className="bg-white border border-[#ecb742] text-[#ecb742] px-5 py-2 rounded font-medium text-sm hover:bg-[#faf2dd] transition-colors">
                    Dowiedz się więcej
                  </button>
                </div>
              </div>
            ))}
          </div>
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
        <button className="bg-[#ecb742] text-white text-lg font-medium rounded px-8 py-3 shadow hover:bg-[#ffe1a1] transition-colors">
            Dodaj swoją ofertę
        </button>
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
    </section>
  );
}