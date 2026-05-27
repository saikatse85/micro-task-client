"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import Swal from "sweetalert2";

export default function SettingsPage() {
  const { user, refreshUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/users/${user.email.toLowerCase()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          photoURL,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Profile updated", "success");
        refreshUser();
      } else {
        Swal.fire("Error", "Update failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-100 dark:bg-slate-950 text-black dark:text-white">
      <div className="max-w-xl mx-auto bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 backdrop-blur-xl">
        <h1 className="text-3xl font-black text-emerald-500 mb-6">Settings</h1>

        {/* ROLE INFO */}
        <div className="mb-6">
          <p className="text-sm text-slate-500">Role</p>
          <p className="font-bold text-emerald-400">{user?.role}</p>
        </div>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm">Name</label>
          <input
            className="w-full mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* PHOTO */}
        <div className="mb-4">
          <label className="text-sm">Photo URL</label>
          <input
            className="w-full mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
        </div>

        {/* READ ONLY INFO */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <p className="text-xs text-slate-400">Coins</p>
            <p className="font-bold text-emerald-400">{user?.coin || 0}</p>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <p className="text-xs text-slate-400">Email</p>
            <p className="text-sm break-all">{user?.email}</p>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleUpdate}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-semibold"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
