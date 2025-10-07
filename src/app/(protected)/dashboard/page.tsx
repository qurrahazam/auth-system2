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

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-xl text-center border border-emerald-100">
        <h1 className="text-4xl font-extrabold text-emerald-700 mb-4">
          Welcome to your Dashboard
        </h1>
        <p className="text-gray-600 mb-8">Manage your account with ease 🌿</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-emerald-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-emerald-600 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            Logout
          </button>
          <button
            onClick={handleChangePassword}
            className="bg-white text-emerald-600 border border-emerald-400 py-3 px-6 rounded-xl font-semibold hover:bg-emerald-50 hover:shadow-md transition-all duration-300 ease-in-out"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 text-sm text-gray-500">
        &copy; 2025 Your Company
      </div>
    </div>
  );
}
