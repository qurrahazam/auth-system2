"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      router.push("/login"); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Welcome to your Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
