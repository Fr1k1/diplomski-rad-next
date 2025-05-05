"use client";
import { useEffect, useState } from "react";
import NavbarDesktop from "./navbarDesktop";
import NavbarMobile from "./navbarMobile";

interface HeaderProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const Header = ({ isLoggedIn, isAdmin }: HeaderProps) => {
  const [isDesktop, setDesktop] = useState(false);

  useEffect(() => {
    function updateMedia() {
      setDesktop(window.innerWidth >= 1024);
    }

    updateMedia();
    window.addEventListener("resize", updateMedia);

    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {isDesktop ? (
        <NavbarDesktop isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      ) : (
        <NavbarMobile isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      )}
    </div>
  );
};

export default Header;
