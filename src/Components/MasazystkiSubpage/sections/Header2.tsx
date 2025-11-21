import React from "react";
import { useLocation } from "react-router-dom";

export default function Header2() {
  const location = useLocation();
  let teamLabel = "Masażystki";
  let title = "Poznaj nasz zespół: ";
  let subtitle = "Poznaj nasze utalentowane masażystki! Nie czekaj dłużej na relaks i odprężenie. Zarezerwuj swoją wizytę już teraz!";

  if (location.pathname === "/masazysci") {
    teamLabel = "Masażyści";
    title = "Poznaj nasz zespół: ";
    subtitle = "Poznaj naszych utalentowanych masażystów! Zarezerwuj masaż i poczuj się lepiej.";
  }
  if (location.pathname === "/duety") {
    teamLabel = "Duety";
    title = "Poznaj nasz zespół: ";
    subtitle = "Odkryj wyjątkowe duety masażystek i masażystów! Podwójna energia, podwójny relaks.";
  }

  return (
    <div className="bg-white py-14 px-4 sm:px-6 lg:px-8 text-[#3E4249] flex justify-center items-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl text-[#3E4249]">
          {title}
          <span className="font-semibold text-[#3E4249]">{teamLabel}</span>
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-[#3E4249] text-xl">
          {subtitle}
        </p>
      </div>
    </div>
  );
}