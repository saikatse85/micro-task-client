"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { usePathname } from "next/navigation";

import {
  Bell,
  Menu,
  X,
  ClipboardList,
  FileText,
  Wallet,
  PlusCircle,
  ListChecks,
  Users,
  Shield,
  BadgeDollarSign,
  CheckCircle,
  CreditCard,
  User,
  Settings,
  HandCoins,
  LayoutDashboard,
  Home,
} from "lucide-react";

import { AuthContext } from "@/context/AuthProvider";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { user, loading } = useContext(AuthContext);

  const role = user?.role;

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // ===============================
  // WORKER MENU
  // ===============================
  const workerLinks = [
    {
      name: "Worker Home",
      href: "/dashboard/worker",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Task List",
      href: "/dashboard/task-list",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "My Submissions",
      href: "/dashboard/my-submissions",
      icon: <FileText size={18} />,
    },
    {
      name: "Withdrawals",
      href: "/dashboard/withdrawals",
      icon: <Wallet size={18} />,
    },
  ];

  // ===============================
  // BUYER MENU
  // ===============================
  const buyerLinks = [
    {
      name: "Buyer Home",
      href: "/dashboard/buyer",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Add Task",
      href: "/dashboard/buyer/create-task",
      icon: <PlusCircle size={18} />,
    },
    {
      name: "My Tasks",
      href: "/dashboard/my-tasks",
      icon: <ListChecks size={18} />,
    },
    {
      name: "Task Review",
      href: "/dashboard/task-review",
      icon: <CheckCircle size={18} />,
    },
    {
      name: "Purchase Coins",
      href: "/dashboard/purchase-coins",
      icon: <BadgeDollarSign size={18} />,
    },
    {
      name: "Payment History",
      href: "/dashboard/payment-history",
      icon: <CreditCard size={18} />,
    },
  ];

  // ===============================
  // ADMIN MENU
  // ===============================
  const adminLinks = [
    {
      name: "Admin Home",
      href: "/dashboard/admin",
      icon: <Shield size={18} />,
    },
    {
      name: "Manage Users",
      href: "/dashboard/manage-users",
      icon: <Users size={18} />,
    },
    {
      name: "Manage Tasks",
      href: "/dashboard/manage-tasks",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Withdrawal Requests",
      href: "/dashboard/admin/withdrawal",
      icon: <HandCoins size={18} />,
    },
  ];

  // ===============================
  // ROLE BASED MENU
  // ===============================
  let navLinks = [];

  if (role === "worker") {
    navLinks = workerLinks;
  } else if (role === "buyer") {
    navLinks = buyerLinks;
  } else if (role === "admin") {
    navLinks = adminLinks;
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
          lg:hidden fixed top-4 left-4 z-[60]
          p-2 rounded-lg
          bg-emerald-500 text-white
        "
      >
        <Menu size={22} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0
          z-50 h-full w-72 min-h-screen
          bg-white dark:bg-slate-900
          border-r border-gray-200 dark:border-white/10
          p-6 transition-all duration-300
          overflow-y-auto
          ${open ? "left-0" : "-left-72 lg:left-0"}
        `}
      >
        {/* CLOSE BUTTON */}
        <button onClick={() => setOpen(false)} className="lg:hidden mb-6">
          <X />
        </button>

        {/* LOGO */}
        <div>
          <h2 className="text-3xl font-black text-emerald-500">MicroTask</h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
            {role} Dashboard
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-10">
          {/* DASHBOARD MENU */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">
              Dashboard Menu
            </p>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3
                  p-3 rounded-xl
                  transition-all duration-200
                  font-medium
                  ${
                    isActive(link.href)
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-white/10"
                  }
                `}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* COMMON MENU */}
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">
              Common
            </p>

            <Link
              href="/dashboard/notifications"
              className="
                flex items-center gap-3
                p-3 rounded-xl
                hover:bg-emerald-100
                dark:hover:bg-white/10
                transition-all duration-200
                font-medium
              "
            >
              <Bell size={18} />
              Notifications
            </Link>

            <Link
              href="/dashboard/profile"
              className="
                flex items-center gap-3
                p-3 rounded-xl
                hover:bg-emerald-100
                dark:hover:bg-white/10
                transition-all duration-200
                font-medium
              "
            >
              <User size={18} />
              Profile
            </Link>

            <Link
              href="/dashboard/settings"
              className="
                flex items-center gap-3
                p-3 rounded-xl
                hover:bg-emerald-100
                dark:hover:bg-white/10
                transition-all duration-200
                font-medium
              "
            >
              <Settings size={18} />
              Settings
            </Link>
          </div>

          {/* BACK HOME */}
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10">
            <Link
              href="/"
              className="
                flex items-center gap-3
                p-3 rounded-xl
                hover:bg-emerald-100
                dark:hover:bg-white/10
                transition-all duration-200
                font-medium
              "
            >
              <Home size={18} />
              Back To Home
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
