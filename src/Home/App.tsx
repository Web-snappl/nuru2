import React, { useEffect, useState } from "react";
import Partners from "./sections/Partners";
import LocationSection from "./sections/Location_section";
import AboutSection from "./sections/About_section";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import MassageSalonsBanner from "./sections/Salons_section";
import WorkersDuetsSection from "./sections/Workers";
import FindRelaxSection from "./sections/Relax_section";
import MasseusesLatest from "./sections/MasseusesLatest";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MasazystkiSubpage from "../Components/MasazystkiSubpage/MasazystkiSubpage";
import MasazystkiInfo1 from "../Components/MasazystkiInfo1/MasazystkiInfo1";
import MasazystkiInfo2 from "../Components/MasazystkiInfo2/MasazystkiInfo2";
import SalonListSection from "../Components/Salony/Salony";
import OffersListPage from "../Components/Oferty/Oferty";
import Logowanie from "./sections/Login";
import Ogloszenia from "./sections/Ogloszenia";
import Register from "./sections/Register";
import HasloReset from "./sections/Haslo";
import FormularzZgloszeniowy from "./sections/FormularzZgloszeniowy";
import AgeModal from "./sections/AgeModal"; // dodaj import

function HomePage() {
  return (
    <>
      <FindRelaxSection />
      <WorkersDuetsSection />
      <MasseusesLatest />
      <LocationSection />
      <AboutSection />
      <Partners />
    </>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("ageAccepted")) {
      setShowModal(true);
    }
    document.title = 'Nuru.MS';
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ageAccepted", "true");
    setShowModal(false);
  };

  const handleReject = () => {
    window.location.href = "https://google.com";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showModal && <AgeModal onAccept={handleAccept} onReject={handleReject} />}
      <Router>
        <Header />
        <Routes>
          {/* Strona główna */}
          <Route path="/" element={<HomePage />} />

          {/* Podstrony */}
          <Route path="/masazystki" element={<MasazystkiSubpage />} />
          <Route path="/masazysci" element={<MasazystkiSubpage />} />
          <Route path="/duety" element={<MasazystkiSubpage />} />
          <Route path="/salony" element={<SalonListSection />} />
          <Route path="/oferty" element={<OffersListPage />} />
          <Route path="/masazystki/info1" element={<MasazystkiInfo1 />} /> 
          <Route path="/masazystki/info2" element={<MasazystkiInfo2 />} /> 
          <Route path="/login" element={<Logowanie />} />
          <Route path="/ogloszenia" element={<Ogloszenia />} />
          <Route path="/register" element={<Register />} />
          <Route path="/haslo" element={<HasloReset />} />
          <Route path="/formularz" element={<FormularzZgloszeniowy />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;