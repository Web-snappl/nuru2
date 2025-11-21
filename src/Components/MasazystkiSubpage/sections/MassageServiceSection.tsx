import Check from '../../../images/circle.png';

const MassageServiceSection: React.FC = () => {
  return (
    <section className="bg-[#FAF0D8] py-16 sm:py-20 text-center text-[#3E4249] px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs sm:text-sm text-[#3F4249] mb-2">Masaż</p>

        <h2 className="text-2xl sm:text-3xl font-light mb-4 text-[#3F4249]">
          Odkryj nasze <span className="font-semibold">wyjątkowe usługi</span> masażu
        </h2>

        <p className="text-[#3F4249] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Nasze masażystki to profesjonaliści z pasją. Oferujemy różnorodne techniki masażu,
          które dostosowujemy do indywidualnych potrzeb klientów. Zrelaksuj się i zregeneruj siły
          w komfortowej atmosferze.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          <div className="flex flex-col items-center text-center sm:text-left">
            <img src={Check} className="w-10 h-10 mb-4 mx-auto" alt="Checkmark" />
            <h3 className="font-semibold mb-2 text-[#3F4249] text-base sm:text-lg">
              Dlaczego warto wybrać nasze usługi
            </h3>
            <p className="text-[#3F4249] text-sm sm:text-base">
              Gwarantujemy wysoką jakość i pełne zadowolenie
            </p>
          </div>

          <div className="flex flex-col items-center text-center sm:text-left">
            <img src={Check} className="w-10 h-10 mb-4 mx-auto" alt="Checkmark" />
            <h3 className="font-semibold mb-2 text-[#3F4249] text-base sm:text-lg">
              Nasze masażystki to doświadczeni profesjonaliści
            </h3>
            <p className="text-[#3F4249] text-sm sm:text-base">
              Każda z nich posiada certyfikat i doświadczenie
            </p>
          </div>

          <div className="flex flex-col items-center text-center sm:text-left">
            <img src={Check} className="w-10 h-10 mb-4 mx-auto" alt="Checkmark" />
            <h3 className="font-semibold mb-2 text-[#3F4249] text-base sm:text-lg">
              Indywidualne podejście do każdego klienta
            </h3>
            <p className="text-[#3F4249] text-sm sm:text-base">
              Tworzymy spersonalizowane programy masaży dla Ciebie
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MassageServiceSection;
