import Title from "./title";
import { Button } from "./button";
import BeachDetailsReviewCard from "./beachDetailsReviewCard";
import { Review } from "@/app/common/types";
import { useRouter } from "next/router";
import Link from "next/link";

const BeachDetailsReviews = ({ reviews }: { reviews?: Array<Review> }) => {
  const router = useRouter();
  const { id } = router.query;

  if (reviews === undefined) {
    return null;
  }

  const hasReviews = reviews && reviews.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 ">
        <Title>Reviews</Title>
        {hasReviews && (
          <Link
            href={`/beach/${id}/reviews`}
            className="text-primary-800 underline text-base "
          >
            More
          </Link>
        )}
      </div>

      {!hasReviews && (
        <p className="text-gray-500 mb-4">
          No reviews yet. Be the first to leave a review!
        </p>
      )}

      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 ">
        {hasReviews &&
          reviews.map((review, index) => (
            <BeachDetailsReviewCard key={review.id || index} review={review} />
          ))}
      </div>

      <div className="flex flex-end justify-end mt-4">
        <Link href={`/beach/${id}/add-review`} passHref>
          <Button variant={"darker"} underlined>
            Leave a review
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BeachDetailsReviews;
