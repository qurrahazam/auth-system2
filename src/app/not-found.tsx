"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-700">
      <div className="text-center px-6">
        <h1 className="text-8xl font-extrabold text-emerald-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn’t exist or might have been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back Home
        </Link>
      </div>

      <footer className="absolute bottom-6 text-xs text-gray-400">
        © {new Date().getFullYear()} <span className="font-medium text-emerald-600">Insightly</span>
      </footer>
    </div>
  );
}
