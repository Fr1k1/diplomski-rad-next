import { MapPin, User } from "@phosphor-icons/react";
import { Button } from "./button";
import { Card, CardHeader, CardTitle } from "./card";
import { BeachDetailsData } from "@/app/common/types";
import { useRouter } from "next/navigation";

const BeachRequestsCard = ({ request }: { request: BeachDetailsData }) => {
  const router = useRouter();

  const id = request.id;

  const handleViewDetails = () => {
    router.push(`/beach-requests/${id}`);
  };

  return (
    <Card>
      <div>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <div>
                <CardTitle>{request?.name}</CardTitle>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={24} weight="fill" color="#0E7490" />
                    <p>
                      {request?.cities?.name},{" "}
                      {request?.cities?.countries?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={24} weight="fill" color="#0E7490" />
                    <p>
                      {request?.users?.first_name} {request?.users?.last_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Button underlined variant={"darker"} onClick={handleViewDetails}>
                View request
              </Button>
            </div>
          </div>
        </CardHeader>
      </div>
    </Card>
  );
};

export default BeachRequestsCard;
