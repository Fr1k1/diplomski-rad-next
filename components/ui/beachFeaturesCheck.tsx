import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { prisma } from "@/lib/prisma";

async function getCharacteristics() {
  const characteristics = await prisma.characteristics.findMany();
  return characteristics;
}

const BeachFeaturesCheck = async ({
  beachCharacteristics,
}: {
  beachCharacteristics: Array<any> | undefined;
}) => {
  const allCharacteristics = await getCharacteristics();

  if (!beachCharacteristics || !allCharacteristics) {
    return <div>No features data available</div>;
  }

  const beachCharacteristicNames = beachCharacteristics
    .map((char) =>
      char && typeof char === "object" && char.name ? char.name : null
    )
    .filter(Boolean);

  const availableAmenities = allCharacteristics.filter((char) =>
    beachCharacteristicNames.includes(char.name)
  );

  const unavailableAmenities = allCharacteristics.filter(
    (char) => !beachCharacteristicNames.includes(char.name)
  );

  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-1 items-center justify-center lg:items-baseline lg:justify-normal">
      {availableAmenities.length > 0 ? (
        availableAmenities.map((amenity, index) => (
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

      {unavailableAmenities.map((amenity, index) => (
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
};

export default BeachFeaturesCheck;
