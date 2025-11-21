import { Link} from "react-router-dom";
import footer from "../../images/footer.png";

export default function Footer() {
  return (
    <footer className="bg-gray-700 text-gray-200 py-6 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between items-center">
        <div className="flex flex-col md:flex-row md:space-x-8 w-full md:w-auto text-xs md:text-sm">
          <a href="#" className="hover:underline mb-1 md:mb-0">Regulamin</a>
          <a href="#" className="hover:underline mb-1 md:mb-0">Polityka prywatności</a>
          <a href="#" className="hover:underline mb-1 md:mb-0">Polityka cookies</a>
        </div>
        <div className="flex flex-col items-center md:mx-8 my-6 md:my-0 flex-1">
          <span className="flex items-center gap-2 font-bold text-lg">
            <img src={footer}></img>
            <span>NURU.MS</span>
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-8 w-full md:w-auto text-xs md:text-sm md:justify-end">
          <Link to="/Login" className="hover:underline mb-1 md:mb-0">Moje konto</Link>
          <Link to="/Haslo" className="hover:underline">Zapomnialem hasla</Link>
          <Link to="/formularz" className="hover:underline">Kontakt</Link>
        </div>
      </div>
      <hr className="my-4 border-gray-500" />
      <div className="text-center text-xs text-gray-400">
        © 2025 Nuru.ms. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
}
