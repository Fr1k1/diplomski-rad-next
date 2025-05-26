"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { City } from "@/app/common/types";

const Map = ({ cities }: { cities: City[] }) => {
  const router = useRouter();
  const [validCities, setValidCities] = useState<City[]>([]);

  useEffect(() => {
    if (!cities || !Array.isArray(cities)) {
      console.error("Invalid cities data:", cities);
      setValidCities([]);
      return;
    }

    const filteredValidCities = cities.filter((city) => {
      if (!city) return false;

      const lat = parseFloat(String(city.latitude));
      const lng = parseFloat(String(city.longitude));

      const isValid = !isNaN(lat) && !isNaN(lng);

      return isValid;
    });

    setValidCities(filteredValidCities);
  }, [cities]);

  return (
    <div>
      <MapContainer
        style={{ width: "100%", height: "450px", borderRadius: "16px" }}
        center={[43.508133, 16.440193]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validCities.map((city) => {
          const lat = parseFloat(String(city.latitude));
          const lng = parseFloat(String(city.longitude));

          return (
            <Marker
              key={city.id}
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  router.push(`/country/${city.countryId}?city=${city.id}`);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
