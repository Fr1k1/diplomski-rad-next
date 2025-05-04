"use client";

import Link from "next/link";
import { FacebookLogo, InstagramLogo, XLogo } from "@phosphor-icons/react";

const Footer = () => {
  const date = new Date();
  return (
    <div className="bg-primary-800 flex justify-center h-64">
      <div className="flex gap-6 flex-col max-w-7xl  justify-center">
        <div className="flex-row justify-between ">
          <Link href="/" className="text-white p-4">
            About us
          </Link>
          <Link href="/" className="text-white p-4">
            Contact
          </Link>
          <Link href="/" className="text-white p-4">
            Contribute
          </Link>
          <Link href="/" className="text-white p-4">
            Add a beach
          </Link>
        </div>

        <div className="flex gap-6 justify-center">
          <FacebookLogo size={32} weight="duotone" color="white" />
          <InstagramLogo size={32} weight="duotone" color="white" />
          <XLogo size={32} weight="duotone" color="white" />
        </div>

        <div className="flex justify-center text-white">
          <p>
            Copyright {date.getFullYear()}. All rights reserved by Martin
            Friščić
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
