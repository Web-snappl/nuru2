import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Logowanie() {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [haslo, setHaslo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !haslo) {
      setError("Podaj e-mail i hasło.");
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, haslo);

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Nieprawidłowy e-mail lub hasło.");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Potwierdź swój adres e-mail przed zalogowaniem.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      // Success - will redirect via useEffect
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Błąd logowania. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setEmail("");
    setHaslo("");
  };

  return (
    <section className="w-full min-h-[70vh] bg-white flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow p-6">
        {user ? (
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
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded transition-colors"
              >
                {loading ? "Logowanie..." : "Zaloguj"}
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