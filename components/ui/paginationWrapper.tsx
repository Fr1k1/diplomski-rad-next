"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/ui/Pagination/pagination";

interface PaginationWrapperProps {
  totalPages: number;
}

export default function PaginationWrapper({
  totalPages,
}: PaginationWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }

    const currentPath = window.location.pathname;
    const url = params.toString()
      ? `${currentPath}?${params.toString()}`
      : currentPath;

    router.push(url);
  };

  return <Pagination setPage={handlePageChange} totalPages={totalPages} />;
}
