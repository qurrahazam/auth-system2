"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthLayout from "@/components/layouts/AuthLayout";
import { changePasswordSchema } from "@/lib/ChangePasswordSchema";

type FormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      if (!result.success) {
        toast.error(result.message || "Failed to update password. Please try again.");
        return;
      }

      toast.success(result.message || "Password updated successfully!");
      
      setTimeout(() => router.push("/login"), 2000);

    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <AuthLayout title="Change Password" subtitle="Update your account password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Current Password"
          {...register("currentPassword")}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
        />
        {errors.currentPassword && (
          <p className="text-red-500">{errors.currentPassword.message}</p>
        )}

        <input
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
        />
        {errors.newPassword && (
          <p className="text-red-500">{errors.newPassword.message}</p>
        )}

        <input
          type="password"
          placeholder="Confirm New Password"
          {...register("confirmPassword")}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
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
