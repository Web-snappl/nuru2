import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function FormularzZgloszeniowy() {
  const [email, setEmail] = useState("");
  const [temat, setTemat] = useState("");
  const [wiadomosc, setWiadomosc] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // <--- PODAJ SWOJE DANE Z EMAILJS --->
  const SERVICE_ID = "service_fx5ej59";
  const TEMPLATE_ID = "template_h46kjly";
  const USER_ID = "5HuY1pzYuMMtjq1gC"; // lub PUBLIC KEY

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!email || !temat || !wiadomosc) {
      setError("Uzupełnij wszystkie pola!");
      return;
    }

    // Wysyłka przez EmailJS
    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          email: email,
          subject: temat,
          message: wiadomosc
        },
        USER_ID
      )
      .then(
        () => {
          setSent(true);
          setEmail("");
          setTemat("");
          setWiadomosc("");
        },
        (err) => {
          setError("Błąd wysyłki: " + err.text);
        }
      );
  };

  return (
    <section className="w-full min-h-[70vh] bg-white flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Formularz zgłoszeniowy
        </h1>
        {sent ? (
          <div className="text-green-700 text-center font-semibold py-8">
            Twoja wiadomość została wysłana!
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
                placeholder="Wpisz swój e-mail"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Temat</label>
              <input
                type="text"
                value={temat}
                onChange={e => setTemat(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Temat zgłoszenia"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Wiadomość</label>
              <textarea
                value={wiadomosc}
                onChange={e => setWiadomosc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Treść wiadomości"
                rows={5}
                required
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded transition-colors"
            >
              Wyślij zgłoszenie
            </button>
          </form>
        )}
      </div>
    </section>
  );
}