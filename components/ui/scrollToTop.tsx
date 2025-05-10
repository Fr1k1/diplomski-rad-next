"use client";

import { useEffect, useState } from "react";
import { ArrowCircleUp } from "@phosphor-icons/react";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 2500) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="bottom-12 right-7 fixed text-4xl cursor-pointer border-none rounded-3xl hover:transition hover:scale-125">
      {showTopBtn ? (
        <ArrowCircleUp
          onClick={goToTop}
          size={64}
          weight="fill"
          color="#0E7490"
        />
      ) : null}
    </div>
  );
};

export default ScrollToTop;
