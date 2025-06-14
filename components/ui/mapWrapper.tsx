"use client";

import { City } from "@/app/common/types";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "16px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading map...
    </div>
  ),
});

const MapWrapper = ({ cities }: { cities: City[] }) => {
  const typeCheckedCities = Array.isArray(cities) ? cities : [];

  return <MapWithNoSSR cities={typeCheckedCities} />;
};

export default MapWrapper;
