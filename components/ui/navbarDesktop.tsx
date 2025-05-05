import { Button } from "./button";
import Logo from "../../app/assets/logo.png";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

const NavbarDesktop = ({
  isLoggedIn,
  isAdmin,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
}) => {
  const supabase = createClient();

  useEffect(() => {
    console.log("Is logged in mi je na navbaru", isLoggedIn);
  });

  return (
    <div className="flex justify-between p-3 w-full items-center ">
      <div>
        <Image src={Logo} alt="" />
      </div>

      <nav className="flex gap-6 p-2 items-center">
        <Link href="/">Homepage</Link>
        <Link href="/country/:id">Find a beach</Link>
        {isAdmin ? <Link href="/beach-requests">Beach requests</Link> : null}
        <Link href="/add-beach" passHref>
          <Button variant={"secondary"}>Add new beach</Button>
        </Link>

        {isLoggedIn ? (
          <>
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
          </>
        ) : (
          <>
            <div>
              <Link href="/login" passHref>
                <Button>Login</Button>
              </Link>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default NavbarDesktop;
