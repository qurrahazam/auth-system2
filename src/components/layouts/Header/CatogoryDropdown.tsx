"use client";

import { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { CategoryDropdownProps } from "@/types/header";

export default function CategoryDropdown({
  categories = ["Tech", "Food", "Travel", "Lifestyle", "Business"],
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 600);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer">
          Categories
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="bg-white shadow-xl rounded-xl border mt-2 w-44"
      >
        {categories.map((cat) => (
          <DropdownMenuItem asChild key={cat}>
            <Link
              href={`/category/${cat}`}
              className="block w-full px-4 py-2.5 rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
            >
              {cat}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
