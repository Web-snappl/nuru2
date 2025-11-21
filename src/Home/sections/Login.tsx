import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const USERS_KEY = "usersDbJson";

export default function Logowanie() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [haslo, setHaslo] = useState("");
  const [error, setError] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    setIsLogged(!!user);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !haslo) {
      setError("Podaj e-mail i hasło.");
      return;
    }

    try {
      const res = await fetch(
        'https://nuru.ms/api/user-nurus?_action=login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          data: {
            email,
            password: haslo,
          },
        }),// strapi odczyta ctx.request.body.email
        }
      );
      const data = await res.json();

      if (!data?.data || data.data.length === 0) {
        setError("Nieprawidłowy e-mail lub hasło.");
        return;
      }

      // Logowanie udane
      localStorage.setItem("authUser", email);
      localStorage.setItem("authToken", "demo-token"); // tymczasowy token
      setIsLogged(true);
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Błąd logowania. Spróbuj ponownie.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    setIsLogged(false);
    setEmail("");
    setHaslo("");
  };

  return (
    <section className="w-full min-h-[70vh] bg-white flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow p-6">
        {isLogged ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg text-gray-700 mb-4">
              Jesteś już zalogowany!
            </div>
            <button
              onClick={handleLogout}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-5 rounded transition-colors"
            >
              Wyloguj
            </button>
            {/* Link do rejestracji również tutaj (opcjonalnie) */}
            <div className="mt-4 text-sm text-gray-600">
              Nie masz konta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-yellow-600 hover:underline font-semibold"
              >
                Zarejestruj się
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1 text-center">
              Logowanie
            </h1>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Zaloguj się, aby kontynuować.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Wpisz e-mail"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Hasło</label>
                <input
                  type="password"
                  value={haslo}
                  onChange={(e) => setHaslo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Wpisz hasło"
                  autoComplete="current-password"
                />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded transition-colors"
              >
                Zaloguj
              </button>
            </form>
            {/* Link do rejestracji */}
            <div className="mt-4 text-sm text-gray-600 text-center">
              Nie masz konta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-yellow-600 hover:underline font-semibold"
              >
                Zarejestruj się
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}