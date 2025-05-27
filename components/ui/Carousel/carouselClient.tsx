"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import "./carousel.scss";

export default function CarouselClient({
  imageUrls,
}: {
  imageUrls: Array<string>;
}) {
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
            {/*komponenta ne radi s Next Image*/}
            <img
              src={url}
              className="w-full h-full object-cover"
              alt="Beach image"
            />
          </div>
        ))}
      </ReactCarousel>
    </div>
  );
}
