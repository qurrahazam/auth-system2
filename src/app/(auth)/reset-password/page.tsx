"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/resetPasswordSchema";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),

      });

      const result = await res.json();

      if (res.ok) {
        reset();
        setSuccessMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setServerError(result.error || "Failed to reset password. Please try again.");
      }
    } catch {
      setServerError("Server error. Please try again later.");
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Set a new password for your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}

        <input
          type="password"
          placeholder="Confirm New Password"
          {...register("confirmPassword")}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
        {successMessage && (
          <p className="text-green-500 text-lg mt-3 text-center">{successMessage}</p>
        )}
        {serverError && (
          <p className="text-red-500 text-lg mt-3 text-center" aria-live="polite">
            {serverError}
          </p>
        )}
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
