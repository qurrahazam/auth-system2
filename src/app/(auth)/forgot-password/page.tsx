"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "If that email is registered, a reset link has been sent.");
                setEmail("");
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
                    Forgot Password
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 p-3 rounded-lg outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
                {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
                <p className="mt-4 text-center text-gray-600 text-sm">
                    Remembered your password?{" "}
                    <button
                        onClick={() => router.push("/login")}
                        className="text-purple-600 hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}