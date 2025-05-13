"use client";

import { Rating } from "react-simple-star-rating";
import { MapPin } from "@phosphor-icons/react";
import BeachDetailsFeaturedCard from "./beachDetailsFeaturedCard";
import BeachDetailsAccordion from "./beachDetailsAccordion";
import BeachDetailsReviews from "./beachDetailsReviews";
import { calculateAverageRating } from "@/app/common/utils";
import Image from "next/image";
import CarouselClient from "./Carousel/carouselClient";
import BeachFeaturesClient from "./beachFeaturesClient";

export default function BeachDetailsClient({ beach, beachImages }) {
  const getReviewCount = () => beach?.reviews?.length ?? 0;
  const averageRating = beach?.reviews
    ? calculateAverageRating(beach.reviews)
    : 0;
  const reviewCount = getReviewCount();

  if (!beach || Object.keys(beach).length === 0) {
    return <div className="flex justify-center p-8">Beach not found...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2">
        <div>
          <CarouselClient imageUrls={beachImages} />
        </div>
        <div className="flex flex-col gap-6 lg:p-6">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
              <h2 className="font-extrabold text-3xl">{beach.name}</h2>
              <div className="flex items-center gap-1">
                <Rating
                  readonly
                  size={25}
                  transition
                  allowFraction
                  initialValue={averageRating}
                />
                <p>{reviewCount} reviews</p>
              </div>
            </div>

            {beach.cities && (
              <div className="flex items-center bg-primary-800 rounded-lg p-2">
                <MapPin
                  weight="duotone"
                  className="mr-2"
                  size={32}
                  color="white"
                />
                <div className="text-white">
                  <p>
                    {beach.cities.name}, {beach.cities.countries?.name}
                  </p>
                  {beach.address && <p className="text-xs">{beach.address}</p>}
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-md">{beach.description}</p>
          </div>

          <div className="text-lg font-bolder flex flex-col gap-4">
            {beach.beach_textures && (
              <div className="flex items-center gap-3">
                <Image
                  src={beach.beach_textures.img_url}
                  alt=""
                  className="rounded-xl h-8 w-12"
                  width={400}
                  height={400}
                />
              </div>
            )}
            <p>Depth: {beach?.beach_depth?.description}</p>

            <p>Best time to visit: {beach.best_time_to_visit}</p>
          </div>
          {beach.beach_has_characteristics &&
            beach.beach_has_characteristics.length > 0 && (
              <div className="flex gap-2">
                {beach.beach_has_characteristics
                  .filter((char) => char.featured)
                  .map((characteristic, index) => (
                    <BeachDetailsFeaturedCard
                      key={index}
                      name={characteristic.characteristics?.name}
                      iconUrl={characteristic.characteristics?.icon_url}
                    />
                  ))}
              </div>
            )}
        </div>
      </div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2">
        {beach.beach_has_characteristics &&
          beach.beach_has_characteristics.length > 0 && (
            <BeachFeaturesClient
              characteristics={beach.beach_has_characteristics}
            />
          )}
        <BeachDetailsAccordion
          bestTimeToVisit={beach?.best_time_to_visit}
          localWildlife={beach?.local_wildlife}
          restaurantsAndBars={beach?.restaurants_and_bars_nearby}
        />
      </div>

      <div>
        {beach.reviews && (
          <BeachDetailsReviews reviews={beach.reviews} beachId={beach?.id} />
        )}
      </div>
    </div>
  );
}
