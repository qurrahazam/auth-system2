"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinkActive({ 
  href, 
  children 
}: { 
  href: string; 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`hover:text-emerald-600 transition-colors ${
        isActive ? "text-emerald-600 font-semibold" : ""
      }`}
    >
      {children}
    </Link>
  );
}