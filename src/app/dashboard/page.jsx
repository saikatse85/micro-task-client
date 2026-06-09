"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {} from "@/lib/role";
import { AuthContext } from "@/context/AuthProvider";

export default function DashboardRedirectPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      const role = user.role;
      const destination =
        role === "admin"
          ? "/dashboard/admin"
          : role === "buyer"
            ? "/dashboard/buyer"
            : "/dashboard/worker";

      router.replace(destination);
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-black dark:text-white">
      <div className="text-center px-6 py-10 rounded-3xl shadow-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
        <p className="text-xl font-semibold">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}
