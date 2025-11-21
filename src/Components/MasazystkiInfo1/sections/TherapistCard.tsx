import Info from "../../../images/image.png";
import { Link } from "react-router-dom";

export default function TherapistCard({ ad }: any) {
  const STRAPI_BASE_URL = "https://admin.nuru.ms";
  const imageUrl =
    ad.Zdjecia?.[0]?.url
      ? `${STRAPI_BASE_URL}${ad.Zdjecia[0].url}`
      : "https://via.placeholder.com/400x400";
  return (
    <section className="w-full bg-[#FAF0D8] py-12 md:py-20 text-[#3E4249]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start gap-10">
        {/* Obrazek główny */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={imageUrl}
            className="w-full max-w-sm sm:max-w-md md:max-w-lg h-auto rounded-xl object-contain bg-white"
            alt="Terapeutka"
          />
        </div>
        {/* Tekst */}
        <div className="w-full md:w-2/3 flex flex-col justify-center text-left">
          <h2 className="text-3xl font-medium text-[#3E4249]">{ad.OgloszenieTytul}</h2>
          <p className="text-sm font-medium text-gray-600 mb-4">{ad.OgloszenieKategoria}</p>
          <p className="text-[#3E4249] mb-4 text-xl">
            {ad.OgloszeniePelenOpis}
          </p>
          <button className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-md w-fit">
            <Link 
                to="/masazystki/info2" 
                state={{ ad }}
              >
                Umów się na wizytę
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
};