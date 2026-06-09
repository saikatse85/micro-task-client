"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!EMAIL_REGEX.test(email)) {
      Swal.fire(
        "Invalid Email",
        "Please enter a valid email address.",
        "error",
      );
      setLoading(false);
      return;
    }

    if (!password) {
      Swal.fire("Invalid Password", "Password cannot be empty.", "error");
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user profile from MongoDB - this is the source of truth for role
      const profileResponse = await fetch(
        `/api/users/${encodeURIComponent(result.user.email)}`,
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok || !profileData.user) {
        throw new Error(
          profileData.message || "User profile not found in database.",
        );
      }

      const redirectRole = profileData.user.role;

      // Generate JWT token
      const tokenResponse = await fetch("/api/jwt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: result.user.email }),
      });
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(tokenData.error || "Unable to generate auth token.");
      }

      localStorage.setItem("token", tokenData.token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (redirect === "/dashboard") {
          router.push(`/dashboard/${redirectRole}`);
        } else {
          router.push(redirect);
        }
      }, 500);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fetch user profile from MongoDB
      let profileResponse = await fetch(
        `/api/users/${encodeURIComponent(user.email)}`,
      );
      let profileData = await profileResponse.json();

      // If user doesn't exist in MongoDB, create their profile automatically
      if (!profileData || !profileData.email) {
        const createResponse = await fetch("/api/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: user.displayName || "",
            email: user.email,
            photoURL: user.photoURL || "",
            role: "worker",
            coin: 10,
            googleSignIn: true,
            createdAt: new Date(),
          }),
        });

        const createData = await createResponse.json();
        if (!createResponse.ok || !createData.success) {
          throw new Error(
            createData.message || "Failed to create user profile.",
          );
        }

        profileData = createData.user;
      }

      // Get role from MongoDB (use DB value directly)
      const redirectRole = profileData.role;

      // Generate JWT token
      const tokenResponse = await fetch("/api/jwt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(tokenData.error || "Unable to generate auth token.");
      }

      localStorage.setItem("token", tokenData.token);

      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push(`/dashboard/${redirectRole}`);
      }, 500);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error?.message || "Unable to sign in with Google.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        px-4
        bg-slate-100 dark:bg-slate-950
        text-black dark:text-white
        transition-colors duration-300
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-3xl
          p-8
          shadow-2xl
          border
          bg-white dark:bg-slate-900
          border-slate-200 dark:border-white/10
        "
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black leading-tight">
            Welcome{" "}
            <span className="text-emerald-500 dark:text-emerald-400">Back</span>
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Login to continue your earning journey
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-2xl border outline-none transition bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-white/10 focus:border-emerald-500 dark:focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
                className="
        w-full px-4 py-3 pr-12
        rounded-2xl border outline-none transition
        bg-slate-100 dark:bg-slate-800
        border-slate-300 dark:border-white/10
        focus:border-emerald-500 dark:focus:border-emerald-400
      "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
        absolute right-4 top-1/2 -translate-y-1/2
        text-slate-500 hover:text-emerald-500
      "
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold transition bg-emerald-500 hover:bg-emerald-600 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="border-t border-slate-300 dark:border-white/10"></div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 px-4 text-sm bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            OR
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 rounded-2xl font-bold border transition bg-slate-100 dark:bg-white text-black border-slate-300 dark:border-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Continue with Google
        </button>

        <p className="text-center mt-8 text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-500 dark:text-emerald-400 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
