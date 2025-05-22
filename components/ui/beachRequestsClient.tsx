"use client";

import { BeachDetailsData } from "@/app/common/types";
import Title from "@/components/ui/title";
import { useState } from "react";
import BeachRequestsCard from "./beachRequestsCard";

interface BeachRequestsClientProps {
  initialBeachRequests: BeachDetailsData[];
}

export default function BeachRequestsClient({
  initialBeachRequests,
}: BeachRequestsClientProps) {
  const [beachRequests, setBeachRequests] =
    useState<BeachDetailsData[]>(initialBeachRequests);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Title>Beach Requests</Title>
      </div>

      {beachRequests.length === 0 && !loading ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No pending beach requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {beachRequests.map((request, index) => (
            <BeachRequestsCard key={index} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
