import { Rating } from "react-simple-star-rating";
import { Card, CardHeader } from "./card";
import { Review } from "@/app/common/types";

const BeachDetailsReviewCard = ({ review }: { review: Review }) => {
  return (
    <Card>
      <div>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">{review?.title}</h3>

            <Rating size={25} transition initialValue={review?.rating} />
          </div>
          <div>
            <p className="text-sm mb-2">{review?.description}</p>
            <p className="text-sm">
              {review?.user?.first_name} {review?.user?.last_name}
            </p>
          </div>
        </CardHeader>
      </div>
    </Card>
  );
};

export default BeachDetailsReviewCard;
