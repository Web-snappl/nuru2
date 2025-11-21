import logo1 from "../../images/logo1.png";
import logo2 from "../../images/logo2.png";
import logo3 from "../../images/logo3.png";
import logo4 from "../../images/logo4.png";
import logo5 from "../../images/logo5.png";
import logo6 from "../../images/logo6.png";
import logo7 from "../../images/logo7.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

export default function Partners() {
  return (
    <section
      className="w-full bg-white flex flex-col items-center justify-center pb-16 pt-16"
    >
      <div className="pt-2 pb-4">
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 text-center">
          Nasi <span className="font-semibold">partnerzy</span>
        </h2>
        <p className="mt-2 text-md text-gray-600 text-center">
          Zaufane marki i specjaliści, z którymi współpracujemy.
        </p>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-12">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="w-32 h-32 rounded-full flex items-center justify-center bg-white"
          >
            <img
              src={logo}
              alt={`Partner logo ${i + 1}`}
            
            />
          </div>
        ))}
      </div>
    </section>
  );
}