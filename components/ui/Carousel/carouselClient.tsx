"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import Image from "next/image";

export default function CarouselClient({ imageUrls }) {
  if (!imageUrls || imageUrls.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="relative">
      <ReactCarousel
        autoPlay={true}
        infiniteLoop={true}
        dynamicHeight={false}
        showArrows={true}
        swipeable
        emulateTouch
        showStatus={false}
      >
        {imageUrls.map((url, index) => (
          <div key={index} className="h-[550px]">
            <Image
              src={url}
              className="w-full h-full object-cover"
              alt="Beach image"
              width={800}
              height={550}
            />
          </div>
        ))}
      </ReactCarousel>
    </div>
  );
}
