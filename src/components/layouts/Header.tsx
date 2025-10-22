"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, User, ChevronDown, KeyRound, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

type SearchForm = { query: string };

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { reset } = useForm<SearchForm>();
  const searchRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);


  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${debouncedQuery}`);
        const data = await res.json();
        setResults(data.posts || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleResultClick = (slug: string) => {
    setQuery("");
    setResults([]);
    router.push(`/posts/${slug}`);
  };

  const onSubmit = (data: SearchForm) => {
    const q = data.query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
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
              {["Tech", "Food", "Travel", "Lifestyle", "Business"].map((cat) => (
                <DropdownMenuItem asChild key={cat}>
                  <Link href={`/category/${cat}`}>{cat}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>


        <div className="flex items-center gap-4 relative">

            <div ref={searchRef} className="relative w-64">
              <Input
                type="text"
                placeholder="Search posts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true); 
                }}
                className="border border-emerald-200 rounded-full bg-emerald-50 px-3 text-sm text-gray-700 placeholder:text-gray-400 w-full focus-visible:ring-emerald-400"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-emerald-600" />

              {showResults && query && (
                <div className="absolute left-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
                  {loading ? (
                    <p className="text-center text-sm text-gray-500 py-3">Searching...</p>
                  ) : results.length > 0 ? (
                    results.map((post) => (
                      <button
                        key={post._id}
                        onClick={() => {
                          handleResultClick(post.slug);
                          setShowResults(false); 
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-emerald-50 flex items-center gap-3 border-b last:border-none"
                      >
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded-md border border-gray-100"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{post.title}</span>
                          <span className="text-xs text-gray-500">{post.category}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-sm text-gray-500 py-3">No results found.</p>
                  )}
                </div>
              )}
            </div>


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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-emerald-700 hover:bg-emerald-50"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/change-password")}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
