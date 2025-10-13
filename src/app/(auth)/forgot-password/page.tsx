"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/forgotPasswordSchema";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setServerMessage("If that email is registered, a reset link has been sent.");
        reset();
      } else {
        setServerError(result.error || "Failed to send reset link. Please try again.");
      }
    } catch {
      setServerError("Server error. Please try again later.");
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Reset your password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
        {serverMessage && (
          <p className="text-green-500 text-lg mt-3 text-center">{serverMessage}</p>
        )}
        {serverError && (
          <p className="text-red-500 text-lg mt-3 text-center" aria-live="polite">
            {serverError}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-gray-600 text-lg">
        Remembered your password?{" "}
        <button
          onClick={() => router.push("/login")}
          className="text-emerald-600 hover:underline font-medium"
          type="button"
        >
          Login
        </button>
      </p>
    </AuthLayout>
  );
}
