"use client";
import { useEffect, useState } from "react";
import HeroImage from "../../public/hero_image.svg";
import Image from "next/image";
const Hero = () => {
  const [isDesktop, setDesktop] = useState<boolean | null>(null);
  //tu napisi u diplomskom kak se mora drukcije postavljati vrijednosti

  useEffect(() => {
    setDesktop(window.innerWidth >= 1024);

    const updateMedia = () => {
      setDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center lg:grid lg:grid-cols-2 lg:max-w-screen-2xl m-auto p-4">
      <div>
        <Image src={HeroImage} alt="" className="lg:w-full" priority />
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="text-center">
          <h2 className="nerko-one-regular text-primary-800 mb-3 leading-none text-8xl md:text-9xl lg:text-156px lg:mb-0 ">
            Beach,
          </h2>
          <h2 className="nerko-one-regular text-156px text-primary-800 leading-none -mt-10 text-8xl md:text-9xl lg:text-156px">
            please!
          </h2>
        </div>

        {isDesktop ? (
          <>
            <p className="nerko-one-regular text-4xl text-primary leading-none font-semibold">
              Find your perfect sandy spot{" "}
            </p>
            <p className="nerko-one-regular text-4xl text-primary leading-none font-semibold -mt-4">
              in seconds
            </p>
          </>
        ) : (
          <>
            <p className="nerko-one-regular text-4xl text-primary leading-none font-semibold">
              Find your perfect sandy spot in seconds
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Hero;
