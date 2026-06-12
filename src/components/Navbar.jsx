"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import Container from "./Container";
import { Menu, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, logoutUser } = useContext(AuthContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav
      className="
        w-full border-b border-white/10
        bg-white/90 dark:bg-slate-950/90
        backdrop-blur-md
        text-black dark:text-white
        fixed top-0 left-0 z-50
      "
    >
      <Container className="h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-black">
          MicroTask
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="hover:text-emerald-500 transition">
            Home
          </Link>

          {user && (
            <Link
              href="/dashboard"
              prefetch={false}
              className="hover:text-emerald-500 transition"
            >
              Dashboard
            </Link>
          )}

          <Link href="/tasks" className="hover:text-emerald-500 transition">
            Tasks
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          {loading ? (
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="
          flex items-center gap-2
          p-1 rounded-xl
          hover:bg-black/5 dark:hover:bg-white/10
          transition
        "
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border"
                />

                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div
                  className="
            absolute right-0 mt-3
            w-72 rounded-2xl
            bg-white dark:bg-slate-900
            border border-gray-200 dark:border-white/10
            shadow-2xl
            p-5
            z-50
          "
                >
                  {/* USER INFO */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt="user"
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold">
                        {user?.name || user.displayName || "User"}
                      </h3>

                      <p className="text-sm text-gray-500 break-all">
                        {user?.email}
                      </p>

                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20">
                        Role: {user?.role || "No Role"}
                      </span>
                    </div>
                  </div>

                  {/* MENU */}
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/dashboard"
                      prefetch={false}
                      onClick={() => setProfileOpen(false)}
                      className="
                block p-3 rounded-xl
                hover:bg-black/5 dark:hover:bg-white/10
                transition
              "
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="
                block p-3 rounded-xl
                hover:bg-black/5 dark:hover:bg-white/10
                transition
              "
                    >
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="
                w-full text-left
                p-3 rounded-xl
                bg-red-500 text-white
                hover:bg-red-600
                transition
              "
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="
        px-4 py-2 rounded-xl
        bg-emerald-500 text-white
        hover:bg-emerald-600
        transition
        inline-block
      "
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="
            lg:hidden
            p-2 rounded-xl
            border border-white/10
            hover:bg-black/5 dark:hover:bg-white/10
            transition
          "
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* MOBILE / TABLET MENU */}
      <div
        className={`
          lg:hidden overflow-hidden transition-all duration-300
          ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <Container className="pb-6 flex flex-col gap-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="
              py-3 px-4 rounded-xl
              hover:bg-black/5 dark:hover:bg-white/10
              transition
            "
          >
            Home
          </Link>

          {user && (
            <Link
              href="/dashboard"
              prefetch={false}
              onClick={() => setOpen(false)}
              className="
              py-3 px-4 rounded-xl
              hover:bg-black/5 dark:hover:bg-white/10
              transition
            "
            >
              Dashboard
            </Link>
          )}

          <Link
            href="/tasks"
            onClick={() => setOpen(false)}
            className="
              py-3 px-4 rounded-xl
              hover:bg-black/5 dark:hover:bg-white/10
              transition
            "
          >
            Tasks
          </Link>

          <div className="flex items-center justify-between mt-2">
            <ThemeToggle />

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 animate-pulse" />
            ) : user ? (
              <button
                onClick={() => {
                  logoutUser();
                  setOpen(false);
                }}
                className="
                  px-4 py-2 rounded-xl
                  bg-red-500 text-white
                  hover:bg-red-600
                  transition
                "
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="
                  px-4 py-2 rounded-xl
                  bg-emerald-500 text-white
                  hover:bg-emerald-600
                  transition
                "
              >
                Login
              </Link>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="user"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          )}
        </Container>
      </div>
    </nav>
  );
}
