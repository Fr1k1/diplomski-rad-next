"use client";

import { CharacteristicModified } from "@/app/common/types";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function BeachFeaturesClient({
  characteristics,
}: {
  characteristics: CharacteristicModified[];
}) {
  interface AmenityType {
    id: string;
    name: string;
  }
  const [allCharacteristics, setAllCharacteristics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const response = await fetch("/api/characteristics");
        const data = await response.json();
        setAllCharacteristics(data || []);
      } catch (error) {
        console.error("Error fetching characteristics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacteristics();
  }, []);

  if (loading) {
    return <div>Loading features...</div>;
  }

  if (
    !characteristics ||
    !allCharacteristics ||
    allCharacteristics.length === 0
  ) {
    return <div>No features data available</div>;
  }

  const beachCharacteristicNames = characteristics
    .map((char) => char.characteristics?.name || null)
    .filter(Boolean);

  const availableAmenities = allCharacteristics.filter(
    (char: { name: string }) => beachCharacteristicNames.includes(char.name)
  );

  const unavailableAmenities = allCharacteristics.filter(
    (char: { name: string }) => !beachCharacteristicNames.includes(char.name)
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 items-center justify-center lg:items-baseline lg:justify-normal">
      {availableAmenities.length > 0 ? (
        availableAmenities.map((amenity: AmenityType, index) => (
          <div
            key={`check-${amenity.id || index}`}
            className="flex items-center gap-2"
          >
            <CheckCircle size={32} weight="fill" color="#16A34A" />
            <p>{amenity.name}</p>
          </div>
        ))
      ) : (
        <></>
      )}

      {unavailableAmenities.map((amenity: AmenityType, index) => (
        <div
          key={`x-${amenity.id || index}`}
          className="flex items-center gap-x-2"
        >
          <XCircle size={32} weight="fill" color="#F04D4D" />
          <p>{amenity.name}</p>
        </div>
      ))}
    </div>
  );
}
