import React from "react";

import Header from "../../Home/sections/Header";
import Footer from "../../Home/sections/Footer";

import { useLocation, useNavigate } from "react-router-dom";

import Header2 from "../MasazystkiSubpage/sections/Header2";
import TherapistCard2 from "./sections/TherapistCard2";
import MassageInfoBlock2 from "./sections/MassageInfoBlock2";

function MasazystkiInfo2() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ad = (state as any)?.ad;

  // jeśli ktoś wszedł bez state (np. odświeżenie), możesz przekierować albo pobrać po id
  if (!ad) {
    // np. przekieruj z powrotem albo obsłuż fetch po id
    return (
      <div className="p-8">
        <p>Brak danych ogłoszenia — spróbuj wyszukać jeszcze raz.</p>
        <button onClick={() => navigate(-1)} className="mt-4">Wróć</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Header2 />

      <TherapistCard2 ad={ad} />

      <MassageInfoBlock2 />

    </div>
  );
}

export default MasazystkiInfo2;