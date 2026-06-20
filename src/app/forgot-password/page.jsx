"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      Swal.fire("Invalid Email", "Enter a valid email address", "error");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);

      Swal.fire({
        icon: "success",
        title: "Reset Link Sent",
        text: "Check your email inbox (and spam folder).",
      });

      setEmail("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Unable to send reset email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10">
        <h1 className="text-4xl font-black text-center mb-2">
          Forgot <span className="text-emerald-500">Password</span>
        </h1>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          Enter your email to receive reset link
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-white/10 focus:border-emerald-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Remember password?{" "}
          <Link href="/login" className="text-emerald-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
