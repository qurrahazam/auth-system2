"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import { isStrongPassword } from "@/lib/validators";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const passwordValidation = isStrongPassword(newPassword);
    if (typeof passwordValidation === "object" && !passwordValidation.valid) {
      setMessage(passwordValidation.message || "Weak password.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset successfully!");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Set a new password for your account">

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
            required
          />

          {message && (
            <p
              className={`text-center text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Update Password
          </button>
        </form>

        <p className="text-gray-600 text-lg text-center mt-6">
          Back to{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-emerald-600 font-medium hover:underline"
            type="button"
          >
            Login
          </button>
        </p>
    </AuthLayout>
  );
}
