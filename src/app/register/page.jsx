"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*()_\-+=,.<>;:'"[\]{}|\\/`~]).{6,}$/;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadImageToCloudinary(file);
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Unable to upload profile image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const role = selectedRole || "worker";
    const photoFile = form.photoURL.files?.[0];

    if (!name || !email || !password || !confirmPassword) {
      Swal.fire("Missing information", "All fields are required.", "error");
      setLoading(false);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      Swal.fire(
        "Invalid Email",
        "Please enter a valid email address.",
        "error",
      );
      setLoading(false);
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      Swal.fire(
        "Weak Password",
        "Password must be at least 6 characters and include uppercase, lowercase, number, and a special character.",
        "error",
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire(
        "Passwords do not match",
        "Please confirm your password.",
        "error",
      );
      setLoading(false);
      return;
    }

    if (!selectedRole) {
      Swal.fire("Select Role", "Please choose Worker or Buyer.", "error");
      setLoading(false);
      return;
    }

    try {
      const duplicateResponse = await fetch(
        `/api/users/${encodeURIComponent(email)}`,
      );
      const duplicateUser = await duplicateResponse.json();

      if (duplicateUser?.email) {
        Swal.fire(
          "This email is already registered",
          "Please login instead.",
          "error",
        );
        setLoading(false);
        return;
      }

      const coin = role === "buyer" ? 50 : 10;

      let photoURL = imageUrl;
      if (!photoURL && photoFile) {
        photoURL = await uploadImageToCloudinary(photoFile);
        setImageUrl(photoURL);
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL || "",
      });

      const registrationResult = await fetch("/api/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          photoURL: photoURL || "",
          role,
          coin,
          createdAt: new Date(),
        }),
      });

      const registrationData = await registrationResult.json();
      if (!registrationResult.ok || !registrationData.success) {
        await signOut(auth);
        throw new Error(registrationData.message || "Registration failed.");
      }

      // Use the role from the response to ensure it matches MongoDB
      const savedUser = registrationData.user;
      const finalRole = savedUser?.role || role;

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created successfully!",
      });

      form.reset();
      setImageUrl("");
      setSelectedRole("");
      router.push(`/dashboard/${finalRole}`);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error?.message || "Unable to complete registration.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const role = selectedRole || "worker";

      const userData = {
        name: user.displayName || "",
        email: user.email,
        photoURL: user.photoURL || user.imageUrl || "",
        role,
        coin: role === "buyer" ? 50 : 10,
        googleSignIn: true,
        createdAt: new Date(),
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Google registration failed.");
      }

      // Use the role from the response
      const savedUser = data.user;
      const finalRole = savedUser?.role || role;

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Welcome to MicroTask Platform!",
      });

      router.push(`/dashboard/${finalRole}`);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error?.message || "Unable to continue with Google.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 mt-16 bg-slate-100 dark:bg-slate-950 text-black dark:text-white transition-colors duration-300">
      <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black">
            Create{" "}
            <span className="text-emerald-500 dark:text-emerald-400">
              Account
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Start completing tasks and earning coins
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            name="name"
            required
            placeholder="Name"
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-100 text-slate-900 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-100 text-slate-900 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="w-full px-4 py-3 pr-14 rounded-2xl border border-slate-300 bg-slate-100 text-slate-900 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Confirm Password"
              className="w-full px-4 py-3 pr-14 rounded-2xl border border-slate-300 bg-slate-100 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </button>
          </div>

          <select
            name="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-100 text-slate-900 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="worker">Worker</option>
            <option value="buyer">Buyer</option>
          </select>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              name="photoURL"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            />
            {uploading && (
              <p className="text-sm text-emerald-500 mt-2">
                Uploading image...
              </p>
            )}
          </label>

          {imageUrl && (
            <div className="mt-4 flex justify-center">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border-2 border-emerald-500 shadow"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-bold transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-2xl border border-slate-300 bg-slate-100 text-black font-semibold transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Continue with Google
        </button>

        <p className="text-center mt-8 text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
