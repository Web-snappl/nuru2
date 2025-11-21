import React from "react";
import kwiatek from "../../images/kwiatek.png";

export default function AboutSection() {
  return (
    <section className="w-full bg-[#faf2dd] flex flex-col items-center pb-16 pt-16">
      <div className="w-full flex flex-col items-center">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800 text-center mb-4">
          O <b>portalu</b>
        </h2>
        {/* Content with image */}
        <div className="w-full max-w-3xl md:max-w-4xl flex flex-col md:flex-row items-center gap-0 bg-gray-700 rounded-md p-0 shadow-lg overflow-hidden">
          {/* Image left */}
          <div className="w-full md:w-[320px] flex-shrink-0 flex items-center justify-center bg-gray-700">
            <img
              src={kwiatek}
              alt="kwiat"
              className="w-full h-full object-cover block"
            />
          </div>
          {/* Text right */}
          <div className="w-full md:w-[calc(100%-320px)] p-6 md:p-8 text-gray-100 font-medium text-sm leading-relaxed">
            <p>
              Nasz portal powstał z myślą o osobach, które poszukują sprawdzonych masażystów,
              masażystek oraz salonów masażu w całej Polsce. Chcemy, aby znalezienie odpowiedniego
              specjalisty było szybkie, wygodne i intuicyjne – niezależnie od tego, czy interesuje Cię relaksacyjny masaż po ciężkim dniu, masaż leczniczy wspierający rehabilitację, czy zabiegi wellness poprawiające samopoczucie i kondycję ciała.
            </p>
            <br />
            <p>
              Dzięki rozbudowanej wyszukiwarce możesz w prosty sposób wybrać miasto lub województwo,
              a także skorzystać z geolokalizacji, aby sprawdzić, którzy specjaliści znajdują się najbliżej Ciebie.
              Oferty prezentowane są w przejrzystej formie wraz z mapą, dzięki czemu od razu wiesz,
              gdzie znajduje się dany salon lub gabinet.
            </p>
            <br />
            <p>
              Nasz serwis nie jest tylko katalogiem – to przestrzeń, w której profesjonaliści mogą
              zaprezentować swoje umiejętności, dodać opis usług, cennik oraz dane kontaktowe.
              Każdy masażysta i salon ma możliwość wyróżnienia się spośród konkurencji i dotarcia
              do nowych klientów, którzy poszukują właśnie ich oferty.
            </p>
            <br />
            <p>
              Dbamy o to, aby wszystkie ogłoszenia były aktualne i wiarygodne. Regularnie dodawane
              nowe oferty pozwalają odkrywać miejsca i osoby, które warto poznać. Dzięki sekcjom „Polecane” oraz „Ostatnio dodane” zawsze masz dostęp do inspiracji i najwyższych propozycji.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}