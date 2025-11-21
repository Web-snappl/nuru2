import React, { useState } from "react";

export default function HasloReset() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    // Tu normalnie wysłałbyś żądanie do backendu.
  };

  return (
    <section className="w-full min-h-[70vh] bg-white flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1 text-center">
          Resetowanie hasła
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Podaj swój adres e-mail, aby zresetować hasło.
        </p>
        {sent ? (
          <div className="text-green-600 text-center">
            Jeśli konto istnieje, wysłaliśmy instrukcję resetowania hasła na podany e-mail.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Wpisz e-mail"
                required
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded transition-colors"
            >
              Wyślij link do resetowania
            </button>
          </form>
        )}
      </div>
    </section>
  );
}