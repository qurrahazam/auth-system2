"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-gray-800 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]"></div>

      <div className="relative z-10 text-center max-w-md p-10 rounded-3xl backdrop-blur-md bg-white/60 shadow-xl border border-emerald-100">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
          Welcome to the Home Page
        </h1>
        <p className="text-gray-600 mb-8">
          Explore your dashboard, manage your profile, and enjoy a refreshing experience.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-md"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 transition-all duration-300 font-semibold text-emerald-700 shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-sm text-emerald-700/70">
        © {new Date().getFullYear()} Your App. All rights reserved.
      </footer>
    </main>
  );
}
