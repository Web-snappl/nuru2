import React from "react";
import tlo from "../../images/tlo.png";
import { Link } from "react-router";

export default function MassageSalonsBanner() {
  return (
    <section
      className="w-full py-14 flex items-center justify-center"
      style={{
        background: `url(${tlo}) center center / cover no-repeat`,
      }}
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between px-8">
        {/* Left side */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-2">
            <span className="font-semibold">Salony</span> masażu
          </h2>
          <p className="text-white text-base font-light">
            Sprawdź pełną listę i wybierz odpowiedni dla siebie.
          </p>
        </div>
        {/* Right side */}
        <Link
          to="/Salony"
          className="text-white text-xl md:text-2xl font-semibold flex items-center transition-all hover:underline"
        >
          Wszystkie salony
          <span className="ml-2 text-2xl md:text-3xl">›</span>
        </Link>
      </div>
    </section>
  );
}