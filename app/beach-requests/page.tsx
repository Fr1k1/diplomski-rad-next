import BeachRequestsClient from "@/components/ui/beachRequestsClient";

export default async function BeachRequestsPage() {
  //spremi ovo u neki env
  const response = await fetch(`http://localhost:3000/api/beaches?approved=0`, {
    cache: "no-store",
  });
  const data = await response.json();

  return <BeachRequestsClient initialBeachRequests={data.beaches || []} />;
}
