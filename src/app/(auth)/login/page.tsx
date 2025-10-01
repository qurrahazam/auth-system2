"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Welcome Back
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 rounded-lg outline-none"
            required
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 rounded-lg outline-none w-full"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-sm text-blue-600 hover:underline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p
            className="text-red-500 mt-3 text-center text-sm"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Forgot Password */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-blue-600 hover:underline"
            type="button"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign up link */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-600 font-medium hover:underline"
            type="button"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
