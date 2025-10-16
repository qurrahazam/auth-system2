"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SearchForm = { query: string };

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { register, handleSubmit, reset } = useForm<SearchForm>();
  const [isExpanded, setIsExpanded] = useState(false);

  const onSubmit = (data: SearchForm) => {
    const query = data.query.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
    reset();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto ml-3 mr-3 flex h-16 px-12 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 select-none">
          <h1 className="font-extrabold text-4xl tracking-tight">
            <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent italic">
              Insightly
            </span>
            <span className="text-base font-medium text-gray-600 ml-2 align-middle">
              where your words meet world
            </span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link
            href="/"
            className={`hover:text-emerald-600 ${
              pathname === "/" ? "text-emerald-600" : ""
            }`}
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className={`hover:text-emerald-600 ${
              pathname === "/dashboard" ? "text-emerald-600" : ""
            }`}
          >
            Dashboard
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 hover:text-emerald-600 transition">
                Categories
                <ChevronDown className="h-4 w-4 mt-[2px]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-lg rounded-md border p-2">
              <DropdownMenuItem asChild>
                <Link href="/category/tech">Tech</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/category/food">Food</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/category/travel">Travel</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/category/lifestyle">Lifestyle</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/category/business">Business</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center border border-emerald-200 rounded-full bg-emerald-50 w-64 px-3 transition duration-300"
          >
            <Input
              type="text"
              placeholder="Search..."
              {...register("query")}
              className="border-none bg-transparent focus:ring-0 text-sm text-gray-700 placeholder:text-gray-400 w-full"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="text-emerald-600"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 text-base"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-emerald-700 border-emerald-300 rounded-full px-5 text-base"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Button variant="ghost" className="flex items-center gap-2 text-emerald-700">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-emerald-700"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
