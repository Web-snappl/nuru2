import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";

type LatLng = { lat: number; lng: number; };
type MasazystkaOgłoszenie = { id: string; [key: string]: any; };

type Pin = { id: string; position: LatLng; adObj: MasazystkaOgłoszenie; debugAdres: string; status: string };

export default function Mapa({ userLocation, onLocationChange, masazystki = [] }: { userLocation?: any; onLocationChange?: any; masazystki?: MasazystkaOgłoszenie[]; }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<LatLng | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const mapRef = useRef<any>(null);
  const searchBoxRef = useRef<any>(null);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: (process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyA8aqtLQbxqJ-DSCBvY7mO1Q_FE5J8gC7E") as string,
    libraries: ["places"],
  });

  const defaultCenter = useMemo<LatLng>(() => ({ lat: 52.1, lng: 19.4 }), []);

  // promisified geocode with retries/fallbacks and componentRestrictions
  const geocodeOne = (address: string) => {
    return new Promise<{ position: LatLng; status: string }>(resolve => {
      if (!window.google?.maps?.Geocoder) return resolve({ position: defaultCenter, status: "NO_GEOCODER" });
      const geocoder = new window.google.maps.Geocoder();

      const tryQuery = (q: string, callback: (results: any, status: any) => void) => {
        geocoder.geocode({ address: q, componentRestrictions: { country: "PL" } }, callback);
      };

      const attempts = [
        address,
        address && !address.toLowerCase().includes("polska") ? `${address}, Polska` : null,
        address && address.includes(",") ? address.split(",").slice(-1).join("").trim() : null,
      ].filter(Boolean) as string[];

      let tried = 0;
      const tryNext = () => {
        const q = attempts[tried++];
        if (!q) {
          return resolve({ position: defaultCenter, status: "NOT_FOUND" });
        }
        tryQuery(q, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) {
            const loc = results[0].geometry.location;
            resolve({ position: { lat: loc.lat(), lng: loc.lng() }, status: "OK" });
          } else {
            // try next after small delay
            setTimeout(() => {
              tryNext();
            }, 250);
          }
        });
      };
      tryNext();
    });
  };

  useEffect(() => {
    if (!isLoaded || !masazystki?.length) {
      setPins([]); // clear pins if no data
      return;
    }

    let mounted = true;
    (async () => {
      const promises = masazystki.map(async (ad) => {
        const pelnyAdres = `${ad.OgloszenieAdres || ""}, ${ad.OgloszenieMiasto || ""}`.trim();
        try {
          const result = await geocodeOne(pelnyAdres);
          return { id: ad.id, position: result.position, adObj: ad, debugAdres: pelnyAdres, status: result.status } as Pin;
        } catch (e) {
          return { id: ad.id, position: defaultCenter, adObj: ad, debugAdres: pelnyAdres, status: "ERR" } as Pin;
        }
      });

      const resolved = await Promise.all(promises);
      if (!mounted) return;
      // ustaw wszystkie piny jednocześnie (lepsza UX)
      setPins(resolved);
    })();

    return () => { mounted = false; };
  }, [masazystki, isLoaded]);

  useEffect(() => {
    if (userLocation) {
      const pos = { lat: userLocation.latitude, lng: userLocation.longitude };
      if (!selected) setSelected(pos);
      if (mapRef.current) {
        mapRef.current.panTo(pos);
        if (expanded) {
          mapRef.current.setZoom(12);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, expanded]);

  const handleMapLoad = (map: any) => {
    mapRef.current = map;
  };

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
    onLocationChange?.(coords);
    if (mapRef.current) {
      mapRef.current.panTo(coords);
      mapRef.current.setZoom(13);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setSelected(coords);
    onLocationChange?.(coords);
  };

  return (
    <div className="relative w-full max-w-7xl bg-white rounded-xl overflow-hidden">
      <div className="relative transition-all duration-500 ease-in-out overflow-hidden" style={{ height: expanded ? "600px" : "350px" }}>
        {!isLoaded ? (
          <div className="w-full h-full flex items-center justify-center text-gray-600">Ładowanie mapy...</div>
        ) : loadError ? (
          <div className="w-full h-full flex items-center justify-center text-red-600">Błąd ładowania Map Google</div>
        ) : (
          <>
            <GoogleMap
              center={ selected ? selected : userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : pins.length ? pins[0].position : defaultCenter }
              zoom={ selected || userLocation ? 11 : pins.length ? 10 : 6 }
              onLoad={handleMapLoad}
              onClick={handleMapClick}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
            >
              {selected && <Marker position={selected} />}
              {userLocation && (
                <Marker
                  position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                  icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: "#2563eb", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2 }}
                  title="Twoja lokalizacja"
                />
              )}
              {pins.filter(p => p.status === "OK").map(pin => (
                <Marker
                  key={pin.id}
                  position={pin.position}
                  title={pin.adObj.OgloszenieTytul}
                  onClick={() => navigate("/masazystki/info2", { state: { ad: pin.adObj } })}
                />
              ))}
            </GoogleMap>

            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-xl">
              <StandaloneSearchBox onLoad={(ref) => (searchBoxRef.current = ref)} onPlacesChanged={handlePlacesChanged}>
                <input type="text" placeholder="Wpisz miasto/adres i wybierz z listy..." className="w-full bg-white border border-gray-300 rounded px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </StandaloneSearchBox>
            </div>

            <div className="bg-gray-50 text-xs p-2 max-h-32 overflow-y-auto border border-gray-200 mt-2">
              <strong>Debug adresów (ostatnie geokodowania):</strong>
              <ul>
                {pins.map((pin, idx) => (
                  <li key={pin.id + "-" + idx}>
                    <span className="font-bold">{pin.adObj.OgloszenieTytul}</span>: <span>{pin.debugAdres}</span> (<span className={pin.status === "OK" ? "text-green-600" : "text-red-600"}>{pin.status}</span>)
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 bg-white text-gray-800 text-sm px-4 py-1.5 rounded shadow border border-gray-300 hover:bg-gray-100 transition">
          {expanded ? "Zwiń" : "Rozwiń"}
        </button>
      </div>
    </div>
  );
}