"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/layouts/AuthLayout";
import { signupSchema, SignupFormData } from "@/lib/signupSchema";


export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [suceessMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSuccessMessage("Signup successful! Please verify your email.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      const result = await res.json();
      setServerError(result.error || "Signup failed. Try again.");
    }
  };

  return (
    <AuthLayout title="Sign Up" subtitle="Create a new account">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      {suceessMessage && (
        <p className="text-green-500 text-lg mt-3 text-center">{suceessMessage}</p>
      )}

      {serverError && (
        <p className="text-red-500 text-lg mt-3 text-center">{serverError}</p>
      )}

      <p className="text-gray-600 text-lg text-center mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-emerald-600 font-medium hover:underline">
          Login
        </a>
      </p>
    </AuthLayout>
  );
}
