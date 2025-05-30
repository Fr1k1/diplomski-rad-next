interface ActiveFiltersProps {
  filters: {
    waterTypeId?: string;
    beachTextureId?: string;
    characteristicIds?: number[];
  };
  beachRelatedData: {
    beachTypes: any[];
    beachTextures: any[];
    beachCharacteristics: any[];
  };
}

export default function ActiveFilters({
  filters,
  beachRelatedData,
}: ActiveFiltersProps) {
  const { beachTextures, beachTypes, beachCharacteristics } = beachRelatedData;

  const hasActiveFilters =
    filters.waterTypeId ||
    filters.beachTextureId ||
    (filters.characteristicIds && filters.characteristicIds.length > 0);

  if (!hasActiveFilters) return null;

  return (
    <div className="grid grid-cols-3 gap-4 lg:flex">
      {filters.waterTypeId && (
        <div className="bg-secondary rounded-xl text-white px-3 py-1 text-sm">
          <p>
            {
              beachTypes.find(
                (type) => type.id.toString() === filters.waterTypeId
              )?.name
            }
          </p>
        </div>
      )}

      {filters.beachTextureId && (
        <div className="bg-secondary rounded-xl text-white px-3 py-1 text-sm">
          <p>
            {
              beachTextures.find(
                (texture) => texture.id.toString() === filters.beachTextureId
              )?.name
            }
          </p>
        </div>
      )}

      {filters.characteristicIds &&
        filters.characteristicIds.map((charId) => {
          const characteristic = beachCharacteristics.find(
            (char) => char.id === charId
          );
          return characteristic ? (
            <div
              key={charId}
              className="bg-secondary rounded-xl text-white px-3 py-1 text-sm"
            >
              <p>{characteristic.name}</p>
            </div>
          ) : null;
        })}
    </div>
  );
}
