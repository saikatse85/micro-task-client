"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "@/context/AuthProvider";

export default function ProfilePage() {
  const {
    user: authUser,
    loading: authLoading,
    refreshUser,
  } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", photoURL: "" });

  // SYNC FORM DATA WITH AUTH USER
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        photoURL: authUser.photoURL || "",
      });
    }
  }, [authUser]);

  // UPDATE USER
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!authUser?.email) {
      Swal.fire("Error", "User not authenticated", "error");
      return;
    }

    try {
      const res = await fetch(
        `/api/users/${encodeURIComponent(authUser.email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            photoURL: formData.photoURL,
          }),
        },
      );

      const data = await res.json();

      if (data.modifiedCount > 0 || data.success) {
        Swal.fire("Success", "Profile updated successfully", "success");
        // Refresh user data from database
        await refreshUser();
      } else {
        Swal.fire("Info", "No changes were made", "info");
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <p className="text-center text-slate-500">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT - PROFILE CARD (like home hero card) */}
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center">
            <img
              src={
                authUser?.photoURL || authUser?.photo || "/default-avatar.png"
              }
              alt="user"
              className="w-28 h-28 mx-auto rounded-full border-4 border-emerald-500 object-cover"
            />

            <h2 className="text-3xl font-black mt-6">{authUser?.name}</h2>

            <p className="text-slate-500 dark:text-slate-400">
              {authUser?.email}
            </p>

            <span className="inline-block mt-4 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {authUser?.role || "User"}
            </span>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="bg-white/40 dark:bg-slate-900/60 p-4 rounded-2xl text-center border border-gray-200 dark:border-white/10">
              <h3 className="text-2xl font-bold text-emerald-400">
                {authUser?.coin || 0}
              </h3>
              <p className="text-sm text-slate-500">Coins</p>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/60 p-4 rounded-2xl text-center border border-gray-200 dark:border-white/10">
              <h3 className="text-2xl font-bold text-emerald-400">Active</h3>
              <p className="text-sm text-slate-500">Status</p>
            </div>
          </div>
        </div>

        {/* RIGHT - EDIT FORM (home style inputs) */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
          <h1 className="text-4xl font-black mb-8 text-center">My Profile</h1>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name */}
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your Name"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            {/* Email */}
            <input
              value={authUser?.email || ""}
              disabled
              className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-slate-500 border border-gray-200 dark:border-white/10"
            />

            {/* Photo */}
            <input
              type="text"
              value={formData.photoURL}
              onChange={(e) =>
                setFormData({ ...formData, photoURL: e.target.value })
              }
              placeholder="Photo URL"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            {/* Role */}
            <input
              value={authUser?.role || ""}
              disabled
              className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-slate-500 border border-gray-200 dark:border-white/10"
            />

            {/* Coins */}
            <input
              value={`Coins: ${authUser?.coin || 0}`}
              disabled
              className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-slate-500 border border-gray-200 dark:border-white/10"
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 transition text-black font-bold py-4 rounded-2xl text-lg"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
