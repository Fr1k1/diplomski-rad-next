"use client";

import { CheckCircle, XCircle } from "@phosphor-icons/react";

export default function BeachFeaturesClient({ characteristics }) {
  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-1 items-center justify-center lg:items-baseline lg:justify-normal">
      {characteristics.map((char, index) => (
        <div
          key={`check-${char.characteristics?.id || index}`}
          className="flex items-center gap-2"
        >
          <CheckCircle size={32} weight="fill" color="#16A34A" />
          <p>{char.characteristics?.name}</p>
        </div>
      ))}
    </div>
  );
}
