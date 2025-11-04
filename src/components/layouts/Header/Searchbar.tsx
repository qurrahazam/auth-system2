"use client";

import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "./useDebounce";

export default function SearchBar() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
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
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  const handleResultClick = (slug: string) => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    router.push(`/${slug}`);
  };

  return (
   <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md">
      <Input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        className="border-gray-200 rounded-full bg-gray-50 pl-10 pr-4 text-sm focus-visible:ring-emerald-400 focus-visible:border-emerald-400"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

      {showResults && query && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
          {loading ? (
            <p className="text-center text-sm text-gray-500 py-4">Searching...</p>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((post) => (
                <button
                  key={post._id}
                  onClick={() => handleResultClick(post.slug)}
                  className="w-full text-left px-3 py-3 hover:bg-emerald-50 rounded-lg flex items-center gap-3 transition-colors"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-gray-900 truncate">{post.title}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{post.category}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 py-4">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}
