// app/(auth)/verify/VerifyClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyClient() {
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage("Email verified successfully! Redirecting...");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setMessage(data.error || "Verification failed.");
        }
      } catch {
        setMessage("Something went wrong.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-700 text-lg font-medium">{message}</p>
    </div>
  );
}
