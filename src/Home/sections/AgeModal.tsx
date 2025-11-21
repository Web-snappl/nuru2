import React from "react";
import Logo from "../../images/Group1.png";

type Props = {
  onAccept: () => void;
  onReject: () => void;
};

export default function AgeModal({ onAccept, onReject }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img src={Logo} alt="NURU.MS" className="h-12 mr-2" />
          <span className="text-2xl font-bold text-[#ecb742]">NURU.MS</span>
        </div>
        <h2 className="text-2xl font-light mb-2">
          Jest stroną internetową dla <b className="font-semibold">dorosłych</b>
        </h2>
        <p className="text-gray-700 mb-6">
          Wchodząc na tę stronę potwierdzam, że mam 18 lub więcej lat i akceptuję regulamin świadczenia usług, który jest dostępny <a href="/regulamin" className="text-[#ecb742] underline">tutaj</a>.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onAccept}
            className="bg-[#ecb742] hover:bg-[#ffe1a1] text-white font-medium px-6 py-2 rounded"
          >
            Mam ukończone 18 lat
          </button>
          <button
            onClick={onReject}
            className="bg-gray-700 hover:bg-gray-900 text-white font-medium px-6 py-2 rounded"
          >
            Nie mam ukończonych 18 lat
          </button>
        </div>
      </div>
    </div>
  );
}