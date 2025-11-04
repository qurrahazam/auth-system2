"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";

import Logo from "./Logo";
import NavLinks from "./Navbar";
import SearchBar from "./Searchbar";
import UserMenu from "./UserMenu";
import { useAuth } from "@/context/AuthContext";

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { user } = useAuth(); 
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="mx-10 flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-base font-medium text-gray-700">
          <NavLinks user={user} />
        </nav>

        <div className="flex items-center gap-3">
          <SearchBar />
          {!user ? (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full px-5 shadow-md"
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full gap-2 shadow-md"
                >
                  <PenSquare className="h-4 w-4" />
                  Write
                </Button>
              </Link>

              <UserMenu user={user} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
