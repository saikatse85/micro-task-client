"use client";

import { useContext, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Sidebar from "@/components/Sidebar";

import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import Swal from "sweetalert2";
import FooterSection from "@/components/Footer";

export default function DashboardLayout({ children }) {
  const { user, loading, authChecked } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && authChecked && !user) {
      router.push("/login");
    }
  }, [user, loading, authChecked, router]);

  useEffect(() => {
    if (loading || !user || !pathname?.startsWith("/dashboard")) return;

    const role = user.role;

    const commonRoutes = [
      "/dashboard/profile",
      "/dashboard/notifications",
      "/dashboard/settings",
    ];

    const adminRoutes = [
      "/dashboard/admin",
      "/dashboard/manage-users",
      "/dashboard/manage-tasks",
      "/dashboard/admin/withdrawal",
    ];

    const buyerRoutes = [
      "/dashboard/buyer",
      "/dashboard/buyer/create-task",
      "/dashboard/my-tasks",
      "/dashboard/task-review",
      "/dashboard/purchase-coins",
      "/dashboard/payment-history",
      "/dashboard/buyer/notifications",
    ];

    const workerRoutes = [
      "/dashboard/worker",
      "/dashboard/task-list",
      "/dashboard/my-submissions",
      "/dashboard/withdrawals",
    ];

    const isCommon = commonRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (pathname === "/dashboard" || isCommon) return;

    const allowed =
      role === "admin"
        ? adminRoutes
        : role === "buyer"
          ? buyerRoutes
          : workerRoutes;

    const canAccess = allowed.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (!canAccess) {
      Swal.fire({
        icon: "error",
        title: "Access denied",
        text: "Redirecting to your dashboard.",
        timer: 1600,
        showConfirmButton: false,
      });
      router.push(`/dashboard/${role}`);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-950 text-black dark:text-white overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} onToggle={setSidebarOpen} />

      {/* RIGHT SIDE */}
      <div className="lg:ml-72 h-screen flex flex-col">
        {/* TOP BAR */}
        <div className="shrink-0 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-emerald-500">
              MicroTask Dashboard
            </h1>

            <div className="relative">
              <Bell className="cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-10">{children}</main>
      </div>
    </div>
  );
}
