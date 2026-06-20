"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function NavLink({ href, children, className = "", ...props }) {
  const pathname = usePathname();

  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link href={href} className={`relative px-4 py-2 ${className}`} {...props}>
      {isActive && (
        <motion.div
          layoutId="active-nav"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          className="absolute inset-0 rounded-full bg-emerald-500"
        />
      )}

      <span
        className={`relative z-10 ${
          isActive
            ? "text-black font-semibold"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        {children}
      </span>
    </Link>
  );
}
