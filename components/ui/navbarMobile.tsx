"use client";

import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../app/assets/logo.png";
import { Button } from "./button";
import { createClient } from "@/utils/supabase/client";
//has many interactivity so it's ok to be client
const NavbarMobile = ({
  isLoggedIn,
  isAdmin,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const supabase = createClient();

  const navHandler = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <div>
      <div className="flex p-4 justify-between">
        <Image src={Logo} alt="Logo" width={150} height={50} />

        <List
          onClick={navHandler}
          className={isNavOpen ? "hidden" : "bg-primary-700 rounded-md"}
          size={32}
          color="white"
        />
        <X
          onClick={navHandler}
          className={isNavOpen ? " bg-primary-700 rounded-md" : "hidden"}
          size={32}
          color="white"
        />
      </div>
      <nav className={isNavOpen ? "" : "hidden"} onClick={closeNav}>
        <div className="flex flex-col justify-center items-center gap-4 bg-white p-4">
          <Link href="/">Homepage</Link>
          <Link href="/country">Find a beach</Link>
          {isAdmin ? <Link href="/beach-requests">Beach requests</Link> : null}
          <Link href="/add-beach" passHref>
            <Button variant={"secondary"}>Add new beach</Button>
          </Link>
          {isLoggedIn ? (
            <div>
              <Button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
              >
                Log out
              </Button>
            </div>
          ) : (
            <div>
              <Link href="/login" passHref>
                <Button>Login</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavbarMobile;
