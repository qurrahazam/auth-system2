"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string; 
  query?: Record<string, string | number | undefined>; 
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "",
  query = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createHref = (page: number) => {
    const params = new URLSearchParams({
      ...Object.fromEntries(Object.entries(query).filter(([_, v]) => v != null)),
      page: page.toString(),
    });
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-3 pt-8">
      {currentPage > 1 && (
        <Link href={createHref(currentPage - 1)}>
          <Button variant="outline">Previous</Button>
        </Link>
      )}

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link href={createHref(currentPage + 1)}>
          <Button variant="outline">Next</Button>
        </Link>
      )}
    </div>
  );
}
