"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Switch } from "./switch";
import { Label } from "./label";
import { Characteristic } from "@/app/common/types";

interface CharacteristicsClientProps {
  characteristics: Characteristic[] | null;
  form?: UseFormReturn<any>;
}

const CharacteristicsClient: React.FC<CharacteristicsClientProps> = ({
  characteristics,
  form,
}) => {
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (form) {
      const currentValues = form.getValues("characteristics") || [];
      setSelectedCharacteristics(currentValues.map((id: number) => String(id)));
    }
  }, [form, form?.watch("characteristics")]);

  const handleCharacteristicChange = (
    characteristicId: string,
    isChecked: boolean
  ) => {
    const currentCharacteristics = [...selectedCharacteristics];
    let newCharacteristics;

    if (isChecked) {
      newCharacteristics = [...currentCharacteristics, characteristicId];
    } else {
      newCharacteristics = currentCharacteristics.filter(
        (id: string) => id !== characteristicId
      );
    }

    setSelectedCharacteristics(newCharacteristics);

    const numericCharacteristics = newCharacteristics.map((id) => Number(id));
    form?.setValue("characteristics", numericCharacteristics, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-7 lg:gap-6">
      {characteristics?.map((characteristic: Characteristic) => {
        const isSelected = selectedCharacteristics.includes(
          String(characteristic.id)
        );

        return (
          <div key={characteristic.id} className="flex items-center space-x-2">
            <Switch
              id={`characteristic-${characteristic.id}`}
              checked={isSelected}
              onCheckedChange={(checked) =>
                handleCharacteristicChange(String(characteristic.id), checked)
              }
            />
            <Label htmlFor={`characteristic-${characteristic.id}`}>
              {characteristic.name}
            </Label>
          </div>
        );
      })}
    </div>
  );
};

export default CharacteristicsClient;
