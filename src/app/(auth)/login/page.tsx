"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/LoginSchema";
import { z } from "zod";
import AuthLayout from "@/components/layouts/AuthLayout";
import toast from "react-hot-toast";

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Login successful! Redirecting...");
      {setTimeout(() =>{
        router.push("/dashboard");
      }, 2000)}
    }

    else {
      const err = await res.json();
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Welcome! Please login to your account">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register("email")} placeholder="Email" className="px-4 py-2 border rounded-lg" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input {...register("password")} type="password" placeholder="Password" className="px-4 py-2 border rounded-lg" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
          
        </button><div className="mt-2 text-center"> <button onClick={() => router.push("/forgot-password")} className="text-emerald-600 hover:underline text-lg font-medium" type="button" > Forgot Password? </button> </div>
        
      </form>
    </AuthLayout>
  );
}
