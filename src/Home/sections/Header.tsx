import React, { useState } from "react";
import Logo from "../../images/Group1.png";
import ObserwowaneIcon from "../../images/obserwowane.png";
import RejestracjaIcon from "../../images/rejestracja.png";
import LogowanieIcon from "../../images/logowanie.png";
import PlusIcon from "../../images/plusIco.png";
import HomeIcon from "../../images/Homeico.png";
import MasazystkiIcon from "../../images/MasazystkiIco.png";
import MasazysciIcon from "../../images/MasazysciIco.png";
import DuetyIcon from "../../images/DuetyIco.png";
import OfertyIcon from "../../images/OfertyIco.png";
import SalonyIcon from "../../images/SalonyIco.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-32 py-5">
          {/* Logo */}
          <Link to ="/">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={Logo} alt="LOGO" className="max-h-full max-w-full" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                NURU.MS
              </span>
            </div>
          </Link>
          {/* Hamburger button (mobile) */}
          <button
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="menu"
          >
            ☰
          </button>

          {/* Right menu */}
          <div
            className={`flex-col lg:flex lg:flex-row lg:items-center lg:space-x-6 text-gray-700 font-medium absolute lg:static left-0 right-0 bg-white lg:bg-transparent shadow-md lg:shadow-none transition-all duration-300 ${
              isOpen ? "top-16 flex" : "top-[-400px] hidden lg:flex"
            }`}
          >
            {/* Obserwowane */}
            <div className="flex flex-col items-center py-2 lg:py-0 cursor-pointer hover:text-yellow-600">
              <img src={ObserwowaneIcon} alt="OBSERWOWANE" className="w-9 h-8" />
              <span className="text-m">Obserwowane</span>
            </div>

            {/* Separator */}
            <div className="hidden lg:block w-px h-14 bg-gray-300" />

            {/* Opcje zależne od zalogowania */}
            {user ? (
              <>
                {/* Witaj + Wyloguj */}
                <div className="flex flex-col items-center py-2 lg:py-0 text-yellow-700 font-semibold">
                  <span className="text-m">Witaj, {user.email}</span>
                </div>
                {/* Separator */}
                <div className="hidden lg:block w-px h-14 bg-gray-300" />
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center py-2 lg:py-0 cursor-pointer hover:text-yellow-600 text-red-600 font-semibold bg-transparent border-none"
                  style={{ background: "none" }}
                >
                  <img src={LogowanieIcon} alt="WYLOGUJ" className="w-7 h-7" />
                  <span className="text-m">Wyloguj</span>
                </button>
              </>
            ) : (
              <>
                {/* Rejestracja */}
                <Link
                  to="/Register"
                  className="flex flex-col items-center py-2 lg:py-0 cursor-pointer hover:text-yellow-600"
                >
                  <img src={RejestracjaIcon} alt="REJESTRACJA" className="w-9 h-7" />
                  <span className="text-m">Rejestracja</span>
                </Link>
                {/* Separator */}
                <div className="hidden lg:block w-px h-14 bg-gray-300" />
                {/* Logowanie */}
                <Link
                  to="/Login"
                  className="flex flex-col items-center py-2 lg:py-0 cursor-pointer hover:text-yellow-600"
                >
                  <img src={LogowanieIcon} alt="LOGOWANIE" className="w-7 h-7" />
                  <span className="text-m">Logowanie</span>
                </Link>
              </>
            )}

            {/* Separator */}
            <div className="hidden lg:block w-px h-14 bg-gray-300" />

            {/* Button */}
            <Link
              to="/ogloszenia"
              className="flex flex-col items-center py-2 lg:py-0 cursor-pointer hover:text-yellow-600"
            >
              <button className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition-colors">
                <span>Dodaj ogłoszenie</span>
                <img src={PlusIcon} alt="ADD" className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Sub-navbar */}
      <div className="bg-[#faf2dd] shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-32 py-1">
          <div
            className="grid grid-cols-3 md:grid-cols-6 gap-x-2 gap-y-2 w-full"
          >
            {/* Home */}
            <Link to="/" className="flex items-center cursor-pointer hover:text-yellow-600 gap-2 py-2 px-2">
              <img src={HomeIcon} alt="HOME" className="w-7 h-7 object-contain" />
              <span className="text-base font-medium">Home</span>
            </Link>
            {/* Masażystki */}
            <Link to="/masazystki" className="flex items-center cursor-pointer hover:text-yellow-600 gap-2 py-2 px-2">
              <img src={MasazystkiIcon} alt="MASAŻYSTKI" className="w-7 h-7 object-contain" />
              <span className="text-base font-medium">Masażystki</span>
            </Link>
            {/* Masażyści */}
            <Link to="/masazysci" className="flex items-center cursor-pointer hover:text-yellow-600 gap-2 py-2 px-2">
              <img src={MasazysciIcon} alt="MASAŻYŚCI" className="w-7 h-7 object-contain" />
              <span className="text-base font-medium">Masażyści</span>
            </Link>
            {/* Duety */}
            <Link to="/duety" className="flex items-center cursor-pointer hover:text-yellow-600 gap-2 py-2 px-2">
              <img src={DuetyIcon} alt="DUETY" className="w-7 h-7 object-contain" />
              <span className="text-base font-medium">Duety</span>
            </Link>
            {/* Salony */}
            <Link to="/salony" className="flex items-center cursor-pointer hover:text-yellow-600 gap-2 py-2 px-2">
              <img src={SalonyIcon} alt="SALONY" className="w-7 h-7 object-contain" />
              <span className="text-base font-medium">Salony</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
