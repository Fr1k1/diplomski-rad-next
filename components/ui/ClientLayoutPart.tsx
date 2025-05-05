"use client";

import { usePathname } from "next/navigation";

export default function ClientLayoutPart({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      className={`${
        pathname === "/login" || pathname === "/register"
          ? "flex items-center justify-center flex-grow"
          : "flex-grow max-w-screen-2xl mx-auto w-full my-8 px-4 xl:px-0"
      }`}
    >
      {children}
    </div>
  );
}
