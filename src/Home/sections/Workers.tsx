import React from "react";
import { Link } from "react-router-dom";
import zdj1 from "../../images/masazystki.png";
import zdj2 from "../../images/masazysci.png";
import zdj3 from "../../images/duety.png";

const cards = [
  { label: "Masażystki", to: "/masazystki", img: zdj1 },
  { label: "Masażyści", to: "/masazysci", img: masazysci },
  { label: "Duety", to: "/duety", img: zdj3 },
];

export default function WorkersDuetsSection() {
  return (
    <section className="w-full bg-white flex flex-col items-center justify-center pt-16 pb-10 relative">
      {/* Cards */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full px-4 mt-10">
        {cards.map((card, i) => (
          <Link
            to={card.to}
            key={i}
            className={`group relative w-[340px] h-[260px] rounded-xl overflow-hidden flex items-end shadow-lg transition-transform hover:scale-105 ${
              i === 2 ? "border-2 border-[#ecb742]" : ""
            }`}
            style={{
              background: `url(${card.img}) center center / cover no-repeat`,
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-t from-[#ecb742cc] via-transparent to-transparent pointer-events-none" />
            <span className="text-white text-xl font-medium mb-7 ml-7 flex items-center gap-1 group-hover:underline relative z-10 drop-shadow-lg">
              {card.label} <span className="text-base">›</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
