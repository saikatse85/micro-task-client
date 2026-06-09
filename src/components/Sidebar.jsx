"use client";

import Link from "next/link";
import { useContext, useEffect } from "react";
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

export default function Sidebar({ open, onToggle }) {
  const pathname = usePathname();

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    return <div className="p-6">Loading......</div>;
  }

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        onClick={() => onToggle?.(!open)}
        className="lg:hidden fixed top-4 left-4 z-[60] rounded-lg bg-emerald-500 p-2 text-white shadow-lg"
        aria-label={open ? "Close dashboard menu" : "Open dashboard menu"}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => onToggle?.(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
    fixed top-0 left-0
    z-50
    w-72
    h-screen
    bg-white dark:bg-slate-900
    border-r border-gray-200 dark:border-white/10
    overflow-y-auto
    p-6
    shadow-xl lg:shadow-none
    transform transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        {/* CLOSE BUTTON */}
        <button onClick={() => onToggle?.(false)} className="lg:hidden mb-6">
          <X size={24} />
        </button>

        {/* LOGO */}
        <div>
          <h2 className="text-3xl font-black text-emerald-500">MicroTask</h2>

          <p className=" mt-4 text-2xl font-bold text-gray-500 dark:text-gray-400 capitalize">
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
                onClick={() => onToggle?.(false)}
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
