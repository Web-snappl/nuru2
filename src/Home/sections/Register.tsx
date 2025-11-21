import React, { useState } from "react";
import emailjs from "emailjs-com";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);

      // 1️⃣ Sprawdzenie, czy email już istnieje
      const checkRes = await fetch(
        `https://nuru.ms/api/user-nurus?filters[email][$eq]=${encodeURIComponent(form.email)}`
      );
      const checkData = await checkRes.json();

      if (checkData?.data?.length > 0) {
        setError("Ten adres e-mail jest już zarejestrowany.");
        setLoading(false);
        return;
      }

      // 2️⃣ Tworzenie użytkownika
      const res = await fetch(
        "https://nuru.ms/api/user-nurus?_action=register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { email: form.email, password: form.password },
          }),
        }
      );

      if (res.ok) {
        const userEmail = form.email;
        setSuccess(`Konto utworzone: ${form.email}`);
        setForm({ email: "", password: "" });

        // 3️⃣ Wysyłka maila aktywacyjnego przez EmailJS
        try{
            await emailjs.send(
            "service_62ocdty", // Twój Service ID z EmailJS
            "template_l6khqop", // Twój Template ID z EmailJS
            {
                to_email: form.email,
                activation_link: `https://nuru.ms/`
            },
            "5HuY1pzYuMMtjq1gC" // Twój Public Key z EmailJS
            );
            setSuccess(`Konto utworzone: ${userEmail}. Mail aktywacyjny wysłany!`);
            setForm({ email: "", password: "" });
            
            }catch(err)  {
                console.error("EmailJS error:", err);
                setSuccess(`Konto utworzone: ${userEmail}`);
                setError("Konto utworzone, ale nie udało się wysłać maila aktywacyjnego.");
            }
        }else {
            const data = await res.json().catch(() => null);
            setError(data?.error?.message || `Błąd ${res.status}: ${res.statusText}`);
      }
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