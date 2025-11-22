import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";

// Fix: Define libraries as const outside component to prevent reloads
const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];

// Props: adres jako string
export default function MapaAdres({ address }: { address: string }) {
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
  const [searchValue, setSearchValue] = useState(address || "");
  const mapRef = useRef<any>(null);
  const searchBoxRef = useRef<any>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyA8aqtLQbxqJ-DSCBvY7mO1Q_FE5J8gC7E",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // helper: promisified geocode with fallback (address, address + ", Polska", city-only)
  const geocodeAddress = (addr: string) => {
    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      if (!window.google?.maps?.Geocoder) return resolve(null);
      const geocoder = new window.google.maps.Geocoder();

      const tryGeocode = (query: string, cb: (res: any, status: any) => void) => {
        geocoder.geocode({ address: query, componentRestrictions: { country: "PL" } }, cb);
      };

      // sequence of attempts
      const attempts = [
        addr,
        addr && !addr.toLowerCase().includes("polska") ? `${addr}, Polska` : null,
        // try just the city (take last part after comma)
        addr && addr.includes(",") ? addr.split(",").slice(-1).join("").trim() : null,
      ].filter(Boolean) as string[];

      (async () => {
        for (const q of attempts) {
          tryGeocode(q, (results: any, status: any) => {
            if (status === "OK" && results && results[0]) {
              const loc = results[0].geometry.location;
              resolve({ lat: loc.lat(), lng: loc.lng() });
            } else {
              // proceed to next attempt by doing nothing here
            }
          });
          // small delay to allow callback to be processed before next attempt
          await new Promise(r => setTimeout(r, 300));
          // If selected was set by the callback, return it
          // We can't synchronously read it from callback, so above delay is a pragmatic approach.
        }
        // final fallback null
        resolve(null);
      })();
    });
  };

  // Geokodowanie adresu masażystki przy pierwszym renderze
  useEffect(() => {
    if (!isLoaded || !address) return;
    (async () => {
      // próbujemy geokodować i dopiero gdy mamy wynik ustawiamy mapę
      let loc = null;
      try {
        loc = await geocodeAddress(address);
      } catch (e) {
        console.error("Geocode error:", e);
      }
      if (loc) {
        setSelected(loc);
        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(13);
        }
      }
    })();
    // eslint-disable-next-line
  }, [isLoaded, address]);

  // Po wyszukaniu innego adresu w polu (Places Autocomplete)
  const handlePlacesChanged = () => {
    const sb = searchBoxRef.current;
    if (!sb) return;
    const places = sb.getPlaces();
    if (!places || places.length === 0) return;
    const place = places[0];
    const loc = place.geometry?.location;
    if (!loc) return;
    const coords = { lat: loc.lat(), lng: loc.lng() };
    setSelected(coords);
    if (mapRef.current) {
      mapRef.current.panTo(coords);
      mapRef.current.setZoom(13);
    }
  };

  // Kliknięcie na mapie
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setSelected(coords);
  };

  return (
    <div className="relative w-full bg-white rounded-xl overflow-hidden" style={{ height: 350 }}>
      <div className="relative overflow-hidden" style={{ height: "350px" }}>
        {!isLoaded ? (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Ładowanie mapy...
          </div>
        ) : loadError ? (
          <div className="w-full h-full flex items-center justify-center text-red-600">
            Błąd ładowania Map Google
          </div>
        ) : (
          <>
            <GoogleMap
              center={selected || { lat: 52.1, lng: 19.4 }}
              zoom={selected ? 13 : 6}
              onLoad={map => { mapRef.current = map; }}
              onClick={handleMapClick}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {selected && <Marker position={selected} />}
            </GoogleMap>

            {/* Wyszukiwarka z automatycznym adresem */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-xl">
              <StandaloneSearchBox
                onLoad={ref => (searchBoxRef.current = ref)}
                onPlacesChanged={handlePlacesChanged}
              >
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Wpisz miasto/adres i wybierz z listy..."
                  className="w-full bg-white border border-gray-300 rounded px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoFocus
                />
              </StandaloneSearchBox>
            </div>
          </>
        )}
      </div>
    </div>
  );
}