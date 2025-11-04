"use client";

import Link from "next/link";
import type { MobileMenuProps } from "@/types/header";

export default function MobileMenu({ pathname, user, setMobileMenuOpen }: MobileMenuProps) {
  return (
    <div className="lg:hidden border-t bg-white px-4 py-4 space-y-3">
      <Link
        href="/"
        onClick={() => setMobileMenuOpen(false)}
        className={`block py-2 px-3 rounded-lg hover:bg-emerald-50 ${
          pathname === "/" ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-700"
        }`}
      >
        Home
      </Link>

      {user && (
        <Link
          href="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
          className={`block py-2 px-3 rounded-lg hover:bg-emerald-50 ${
            pathname === "/dashboard"
              ? "bg-emerald-50 text-emerald-600 font-semibold"
              : "text-gray-700"
          }`}
        >
          Dashboard
        </Link>
      )}

      <div className="border-t pt-3">
        <p className="text-xs text-gray-500 px-3 mb-2">Categories</p>
        {["Tech", "Food", "Travel", "Lifestyle", "Business"].map((cat) => (
          <Link
            key={cat}
            href={`/category/${cat}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-emerald-50 text-gray-700"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}
