import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const setValue = (key: keyof typeof form, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Wszystkie pola są wymagane.");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Nieprawidłowy format e-mail.");
      return;
    }

    if (form.password.length < 6) {
      setError("Hasło musi mieć minimum 6 znaków.");
      return;
    }

    try {
      setLoading(true);

      const { error: signUpError } = await signUp(form.email, form.password);

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          setError("Ten adres e-mail jest już zarejestrowany.");
        } else if (signUpError.message.includes("Password should be at least")) {
          setError("Hasło musi mieć minimum 6 znaków.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      setSuccess(
        "Konto utworzone! Sprawdź swój e-mail, aby potwierdzić konto. (Sprawdź także folder SPAM)"
      );
      setForm({ email: "", password: "" });
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[70vh] bg-white flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1 text-center">
          Rejestracja
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Podaj swój e-mail, aby utworzyć konto. Na podany adres zostanie wysłany mail aktywacyjny.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setValue("email", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Podaj e-mail"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Hasło</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setValue("password", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Wpisz hasło"
              autoComplete="new-password"
              required
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>
      </div>
    </section>
  );
}