import React from "react";

type Props = {
  images: File[];
  setImages: (files: File[]) => void;
};

export default function OgloszenieZdjecia({ images, setImages }: Props) {
  // Dodawanie nowych plików
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // Zamiana FileList na tablicę File
    let newFiles = Array.from(e.target.files);

    // Usuwanie duplikatów (po nazwie i rozmiarze)
    const merged = [...images, ...newFiles];
    const unique = merged.filter(
      (file, idx, arr) =>
        arr.findIndex((f) => f.name === file.name && f.size === file.size) ===
        idx
    );

    // Ograniczenie do max 8
    setImages(unique.slice(0, 8));
  };

  // Usuwanie zdjęcia
  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // Ustaw wybrane zdjęcie jako główne (przenieś na początek tablicy)
  const handleMakePrimary = (idx: number) => {
    if (idx === 0) return;
    const selected = images[idx];
    const rest = images.filter((_, i) => i !== idx);
    setImages([selected, ...rest]);
  };

  return (
    <div className="bg-[#fdf5e2] border border-[#efc872] rounded-xl px-4 pt-8 pb-6 md:px-6 relative">
      <div className="absolute -top-4 left-6">
        <div className="bg-[#ecb742] text-white font-semibold rounded-md px-4 py-2 shadow">
          4. Zdjęcia
        </div>
      </div>

      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="block"
          disabled={images.length >= 8}
        />
        <div className="text-xs text-gray-500 mt-1">
          Możesz wybrać maksymalnie 8 zdjęć.
        </div>

        {/* Informacja o tym które zdjęcie jest główne */}
        <div className="text-sm text-gray-700 mt-2">
          <strong>Uwaga:</strong> pierwsze przesłane zdjęcie będzie <span className="font-semibold">główne</span> — będzie
          wyświetlane jako miniatura ogłoszenia. Kliknij zdjęcie lub przycisk „Ustaw jako główne”, aby zmienić.
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        {images.map((img, idx) => {
          const src = URL.createObjectURL(img);
          return (
            <div
              key={`${img.name}-${img.size}-${idx}`}
              className="relative flex flex-col items-center justify-center bg-white border border-gray-300 rounded-lg p-2"
            >
              {/* Badge dla zdjęcia głównego */}
              {idx === 0 && (
                <div className="absolute left-2 top-2 bg-[#ecb742] text-black px-2 py-0.5 rounded text-xs font-semibold z-10">
                  GŁÓWNE
                </div>
              )}

              <img
                src={src}
                alt={`Zdjęcie ${idx + 1}`}
                className="w-20 h-20 object-cover rounded mb-2 cursor-pointer"
                onClick={() => handleMakePrimary(idx)}
                title={idx === 0 ? "To jest zdjęcie główne" : "Kliknij, aby ustawić jako główne"}
              />

              <div className="flex gap-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleMakePrimary(idx)}
                    className="text-sm bg-white border border-gray-200 px-2 py-1 rounded text-gray-700 hover:bg-gray-50"
                    title="Ustaw jako główne"
                  >
                    Ustaw jako główne
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="text-sm bg-white border border-gray-200 px-2 py-1 rounded text-red-600 hover:bg-red-50"
                  title="Usuń zdjęcie"
                >
                  Usuń
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
