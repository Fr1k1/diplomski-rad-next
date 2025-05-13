import { Review } from "./types";

export const calculateAverageRating = (data: Array<Review>) => {
  if (data && data?.length > 0) {
    const totalRating = data.reduce(
      (sum: number, review: Review) => sum + review.rating,
      0
    );
    return totalRating / data.length;
  }
  return 0;
};
